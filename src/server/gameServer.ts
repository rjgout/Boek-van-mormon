import type { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import type { ChapterGuessLevel } from "@prisma/client";
import { prisma } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { parseCookieHeader } from "@/lib/parseCookieHeader";
import { isExerciseCorrect } from "@/lib/exerciseGen";
import { completeLesson, completeChapterGuess } from "@/lib/streak";
import { generateChapterGuessQuestions, labelsFor, computeHintEffect, type LiveQuestionSeed, type ChapterLabel } from "@/lib/chapterGuess";

const EXERCISES_TIME_MS = 20_000;
// "Raad het hoofdstuk" krijgt bewust ruim meer tijd (1 minuut, zoals
// gevraagd) dan de bestaande oefeningen-race: je moet eerst het introvers
// lezen vóór je kan antwoorden, dat kost meer tijd dan een invuloefening.
const CHAPTER_GUESS_TIME_MS = 60_000;
const REVEAL_PAUSE_MS = 3_500;

type RoomMode = "EXERCISES" | "CHAPTER_GUESS";

interface GameExercise {
  id: string;
  type: "FILL_BLANK" | "WORD_BANK" | "TRUE_FALSE" | "MULTIPLE_CHOICE" | "SEQUENCE";
  verseRef: string;
  prompt: string;
  answers: string[];
  wordBank?: string[];
  options?: string[];
}

interface RoomPlayer {
  userId: string;
  displayName: string;
  socketIds: Set<string>;
  score: number;
  correctCount: number;
  answeredAt?: number;
  given?: string[];
  correct?: boolean;
  // Alleen relevant bij mode CHAPTER_GUESS — per-speler, alleen in het
  // geheugen (net als score/correctCount hierboven, die ook pas bij
  // finishGame naar de database worden geschreven).
  hintCredits: number;
  hintUsedThisQuestion: boolean;
}

interface RoomState {
  id: string;
  code: string;
  hostId: string;
  status: "LOBBY" | "IN_PROGRESS" | "FINISHED";
  mode: RoomMode;
  timeLimitMs: number;

  // EXERCISES
  chapterId: string | null;
  exercises: GameExercise[];

  // CHAPTER_GUESS
  level: ChapterGuessLevel | null;
  cgQuestions: LiveQuestionSeed[];
  cgChapterLabels: Map<string, ChapterLabel>;

  questionIndex: number;
  questionStartedAt: number;
  players: Map<string, RoomPlayer>;
  timer?: NodeJS.Timeout;
  // Gezet zodra iemand opgeeft (alleen relevant met vrienden/live) — de
  // tegenstander(s) winnen dan altijd, los van de stand op dat moment.
  forfeitedBy?: string;
}

const rooms = new Map<string, RoomState>();
let ioInstance: SocketIOServer | null = null;

export function getIO() {
  return ioInstance;
}

function totalQuestions(room: RoomState): number {
  return room.mode === "EXERCISES" ? room.exercises.length : room.cgQuestions.length;
}

function collectChapterIds(questions: LiveQuestionSeed[]): string[] {
  const ids = new Set<string>();
  for (const q of questions) {
    ids.add(q.chapterId);
    q.optionIds?.forEach((id) => ids.add(id));
  }
  return [...ids];
}

async function authenticateSocket(socket: Socket) {
  const cookies = parseCookieHeader(socket.handshake.headers.cookie);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
}

function serializePlayers(room: RoomState) {
  return [...room.players.values()]
    .map((p) => ({ userId: p.userId, displayName: p.displayName, score: p.score }))
    .sort((a, b) => b.score - a.score);
}

function sanitizeExercise(ex: GameExercise) {
  return {
    id: ex.id,
    type: ex.type,
    verseRef: ex.verseRef,
    prompt: ex.prompt,
    blanks: ex.answers.length,
    wordBank: ex.wordBank,
    options: ex.options,
  };
}

async function loadExercises(chapterId: string): Promise<GameExercise[]> {
  const rows = await prisma.exercise.findMany({
    where: { chapterId, status: "APPROVED" },
    orderBy: { order: "asc" },
    include: { options: { orderBy: { order: "asc" } } },
  });
  return rows.map((r) => ({
    id: r.id,
    type: r.type as "FILL_BLANK" | "WORD_BANK" | "TRUE_FALSE" | "MULTIPLE_CHOICE" | "SEQUENCE",
    verseRef: r.verseRef,
    prompt: r.prompt,
    answers: JSON.parse(r.answers) as string[],
    wordBank: r.wordBank ? (JSON.parse(r.wordBank) as string[]) : undefined,
    options: r.options.length > 0 ? r.options.map((o) => o.label) : undefined,
  }));
}

function broadcastLobby(room: RoomState) {
  ioInstance?.to(room.code).emit("lobby_update", {
    hostId: room.hostId,
    status: room.status,
    mode: room.mode,
    level: room.level,
    players: serializePlayers(room),
  });
}

function askQuestion(room: RoomState) {
  const total = totalQuestions(room);
  if (room.questionIndex >= total) {
    finishGame(room);
    return;
  }
  for (const p of room.players.values()) {
    p.answeredAt = undefined;
    p.given = undefined;
    p.correct = undefined;
    p.hintUsedThisQuestion = false;
  }
  room.questionStartedAt = Date.now();

  if (room.mode === "EXERCISES") {
    const exercise = room.exercises[room.questionIndex];
    ioInstance?.to(room.code).emit("question", {
      mode: "EXERCISES",
      index: room.questionIndex,
      total,
      timeLimitMs: room.timeLimitMs,
      ...sanitizeExercise(exercise),
    });
  } else {
    const q = room.cgQuestions[room.questionIndex];
    const options = q.optionIds?.map((id) => ({ id, label: room.cgChapterLabels.get(id)?.label ?? "?" }));
    ioInstance?.to(room.code).emit("question", {
      mode: "CHAPTER_GUESS",
      index: room.questionIndex,
      total,
      timeLimitMs: room.timeLimitMs,
      introText: q.introText,
      options,
    });
  }

  room.timer = setTimeout(() => revealAndAdvance(room), room.timeLimitMs);
}

function allAnswered(room: RoomState) {
  return [...room.players.values()].every((p) => p.answeredAt !== undefined);
}

function revealAndAdvance(room: RoomState) {
  if (room.timer) clearTimeout(room.timer);
  const total = totalQuestions(room);

  let correctAnswer: string[];
  let correctChapterLabel: string | undefined;
  if (room.mode === "EXERCISES") {
    correctAnswer = room.exercises[room.questionIndex].answers;
  } else {
    const q = room.cgQuestions[room.questionIndex];
    correctAnswer = [q.chapterId];
    correctChapterLabel = room.cgChapterLabels.get(q.chapterId)?.label;
  }

  ioInstance?.to(room.code).emit("reveal", {
    index: room.questionIndex,
    correctAnswer,
    correctChapterLabel,
    scoreboard: serializePlayers(room),
  });

  room.questionIndex += 1;
  room.timer = setTimeout(() => {
    if (room.questionIndex >= total) {
      finishGame(room);
    } else {
      askQuestion(room);
    }
  }, REVEAL_PAUSE_MS);
}

async function finishGame(room: RoomState) {
  if (room.timer) clearTimeout(room.timer);
  if (room.status === "FINISHED") return; // al afgerond (bv. dubbele opgave-klik)
  room.status = "FINISHED";
  ioInstance?.to(room.code).emit("game_finished", { scoreboard: serializePlayers(room), forfeitedBy: room.forfeitedBy });
  await prisma.liveGame.update({ where: { code: room.code }, data: { status: "FINISHED" } }).catch(() => {});

  if (room.mode === "EXERCISES") {
    const maxScore = Math.max(0, ...[...room.players.values()].map((p) => p.score));
    for (const p of room.players.values()) {
      await prisma.liveGamePlayer
        .update({ where: { gameId_userId: { gameId: room.id, userId: p.userId } }, data: { score: p.score } })
        .catch(() => {});

      const percent = room.exercises.length === 0 ? 0 : Math.round((p.correctCount / room.exercises.length) * 100);
      const xp = Math.round(p.score / 5);
      const won = maxScore > 0 && p.score === maxScore;
      // Altijd aanroepen, ook bij xp === 0 (verloren met score 0): meespelen
      // telt als vandaag gestudeerd, net als bij CHAPTER_GUESS hieronder.
      // completeLesson/awardXp behandelen xp = 0 zelf al als no-op voor de
      // XP-boekhouding.
      await completeLesson(p.userId, room.chapterId!, percent, xp, won ? "LIVE_GAME_WON" : "LIVE_GAME_PLAYED").catch(() => {});
    }
  } else {
    const total = room.cgQuestions.length;
    for (const p of room.players.values()) {
      await prisma.liveGamePlayer
        .update({ where: { gameId_userId: { gameId: room.id, userId: p.userId } }, data: { score: p.score } })
        .catch(() => {});
      await completeChapterGuess(p.userId, p.correctCount, total, room.level ?? undefined).catch(() => {});
    }
  }
  setTimeout(() => rooms.delete(room.code), 5 * 60_000);
}

function registerAnswer(room: RoomState, userId: string, given: string[]) {
  const player = room.players.get(userId);
  if (!player || player.answeredAt !== undefined) return;

  let correct: boolean;
  if (room.mode === "EXERCISES") {
    const exercise = room.exercises[room.questionIndex];
    if (!exercise) return;
    correct = isExerciseCorrect(exercise.type, given, exercise.answers);
  } else {
    const question = room.cgQuestions[room.questionIndex];
    if (!question) return;
    correct = given[0] === question.chapterId;
  }

  const elapsed = Date.now() - room.questionStartedAt;
  const remainingFraction = Math.max(0, 1 - elapsed / room.timeLimitMs);
  const points = correct ? Math.round(50 + 50 * remainingFraction) : 0;

  player.answeredAt = Date.now();
  player.given = given;
  player.correct = correct;
  player.score += points;
  if (correct) {
    player.correctCount += 1;
    // Net als bij het alleen-spelen-spel: geen nieuwe hints te verdienen op
    // EXPERT, daar mogen ze toch niet gebruikt worden.
    if (room.mode === "CHAPTER_GUESS" && room.level !== "EXPERT") player.hintCredits += 1;
  }

  ioInstance?.to(room.code).emit("answer_received", {
    userId,
    total: room.players.size,
    answered: [...room.players.values()].filter((p) => p.answeredAt !== undefined).length,
  });

  // Iedereen beantwoord? Dan meteen door, ook als de tijd nog niet om is
  // (net zoals bij de bestaande oefeningen-race).
  if (allAnswered(room)) {
    revealAndAdvance(room);
  }
}

export function initGameServer(httpServer: HttpServer) {
  ioInstance = new SocketIOServer(httpServer, { path: "/socket.io" });

  // Een net gestarte instantie heeft per definitie nog geen enkele
  // socket-verbinding, dus elke oude telling hier is die van vóór een
  // herstart (crash of deploy) die nooit een disconnect-event kreeg. Zonder
  // deze reset zou zo'n gebruiker voor altijd "online" blijven staan op
  // /adminbackend. Gaat (net als de rest van dit bestand, zie de
  // Redis-adapter hieronder) uit van precies één draaiende instantie.
  prisma.user.updateMany({ data: { onlineSocketCount: 0 } }).catch((err) => {
    console.error("Kon onlineSocketCount niet resetten bij opstarten:", err);
  });

  // Redis-adapter voor Socket.io: alle room-broadcasts (lobby/vraag/reveal)
  // lopen hierdoor via Redis pub/sub. Nu draait er één bom-game-instantie,
  // maar dit is wat het mogelijk maakt om later zonder herbouw meerdere
  // instanties te draaien die dezelfde live-spellen kunnen bedienen.
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const pubClient = new Redis(redisUrl, { lazyConnect: false });
    const subClient = pubClient.duplicate();
    pubClient.on("error", (err) => console.error("Redis (pub) verbindingsfout:", err.message));
    subClient.on("error", (err) => console.error("Redis (sub) verbindingsfout:", err.message));
    ioInstance.adapter(createAdapter(pubClient, subClient));
  } else {
    console.warn(
      "REDIS_URL is niet gezet — Socket.io draait zonder Redis-adapter (werkt alleen correct met één bom-game-instantie)."
    );
  }

  ioInstance.on("connection", async (socket) => {
    const user = await authenticateSocket(socket);
    if (!user) {
      socket.disconnect();
      return;
    }
    socket.data.userId = user.id;
    socket.data.displayName = user.handle;
    socket.join(`user:${user.id}`);

    // Aanwezigheid voor het adminoverzicht (/adminbackend): zie de opmerking
    // bij User.onlineSocketCount in schema.prisma voor waarom dit in de
    // database staat i.p.v. in-memory.
    await prisma.user
      .update({ where: { id: user.id }, data: { onlineSocketCount: { increment: 1 }, lastSeenAt: new Date() } })
      .catch(() => {});

    socket.on("join_game", async ({ code }: { code: string }) => {
      const upperCode = code.toUpperCase();
      let room = rooms.get(upperCode);

      if (!room) {
        const game = await prisma.liveGame.findUnique({ where: { code: upperCode } });
        if (!game || game.status === "FINISHED") {
          socket.emit("error_message", { message: "Spel niet gevonden of al afgelopen." });
          return;
        }

        if (game.mode === "CHAPTER_GUESS") {
          const questions = await generateChapterGuessQuestions(game.level!, game.questionCount!);
          room = {
            id: game.id,
            code: upperCode,
            hostId: game.hostId,
            status: game.status as RoomState["status"],
            mode: "CHAPTER_GUESS",
            timeLimitMs: CHAPTER_GUESS_TIME_MS,
            chapterId: null,
            exercises: [],
            level: game.level,
            cgQuestions: questions,
            cgChapterLabels: await labelsFor(collectChapterIds(questions)),
            questionIndex: 0,
            questionStartedAt: 0,
            players: new Map(),
          };
        } else {
          room = {
            id: game.id,
            code: upperCode,
            hostId: game.hostId,
            status: game.status as RoomState["status"],
            mode: "EXERCISES",
            timeLimitMs: EXERCISES_TIME_MS,
            chapterId: game.chapterId,
            exercises: await loadExercises(game.chapterId!),
            level: null,
            cgQuestions: [],
            cgChapterLabels: new Map(),
            questionIndex: 0,
            questionStartedAt: 0,
            players: new Map(),
          };
        }
        rooms.set(upperCode, room);
      }

      if (room.status !== "LOBBY") {
        socket.emit("error_message", { message: "Dit spel is al begonnen." });
        return;
      }

      socket.join(upperCode);
      socket.data.gameCode = upperCode;

      let player = room.players.get(user.id);
      if (!player) {
        player = {
          userId: user.id,
          displayName: user.handle,
          socketIds: new Set(),
          score: 0,
          correctCount: 0,
          hintCredits: 0,
          hintUsedThisQuestion: false,
        };
        room.players.set(user.id, player);
        await prisma.liveGamePlayer
          .upsert({
            where: { gameId_userId: { gameId: room.id, userId: user.id } },
            create: { gameId: room.id, userId: user.id },
            update: {},
          })
          .catch(() => {});
      }
      player.socketIds.add(socket.id);

      broadcastLobby(room);
    });

    socket.on("start_game", async () => {
      const code = socket.data.gameCode as string | undefined;
      if (!code) return;
      const room = rooms.get(code);
      if (!room || room.hostId !== user.id || room.status !== "LOBBY") return;
      if (totalQuestions(room) === 0) {
        socket.emit("error_message", {
          message: room.mode === "EXERCISES" ? "Dit hoofdstuk heeft geen oefeningen." : "Kon geen vragen genereren.",
        });
        return;
      }

      room.status = "IN_PROGRESS";
      await prisma.liveGame.update({ where: { code }, data: { status: "IN_PROGRESS" } });
      broadcastLobby(room);
      askQuestion(room);
    });

    socket.on("submit_answer", ({ given }: { given: string[] }) => {
      const code = socket.data.gameCode as string | undefined;
      if (!code) return;
      const room = rooms.get(code);
      if (!room || room.status !== "IN_PROGRESS") return;
      registerAnswer(room, user.id, given);
    });

    socket.on("use_hint", async () => {
      const code = socket.data.gameCode as string | undefined;
      if (!code) return;
      const room = rooms.get(code);
      if (!room || room.status !== "IN_PROGRESS" || room.mode !== "CHAPTER_GUESS") return;
      if (room.level === "EXPERT") {
        socket.emit("hint_error", { message: "Hints zijn niet beschikbaar op expert-niveau." });
        return;
      }
      const player = room.players.get(user.id);
      if (!player || player.hintUsedThisQuestion) return;

      // Zelfde twee-traps-verbruik als overal elders: eerst het per-spel
      // verdiende (in-memory) tegoed, dan pas User.hintBalance.
      let used = false;
      if (player.hintCredits > 0) {
        player.hintCredits -= 1;
        used = true;
      } else {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (dbUser && dbUser.hintBalance > 0) {
          await prisma.user.update({ where: { id: user.id }, data: { hintBalance: { decrement: 1 } } });
          used = true;
        }
      }
      if (!used) {
        // Los "hint_error"-event i.p.v. het generieke "error_message": dat
        // laatste zet de client naar een volle foutpagina (spel niet
        // gevonden/al gestart e.d.), wat hier te drastisch zou zijn voor
        // "geen hint over" — de vraag loopt gewoon door.
        socket.emit("hint_error", { message: "Je hebt geen hint beschikbaar — geef eerst een goed antwoord, of koop er een in de winkel." });
        return;
      }
      player.hintUsedThisQuestion = true;

      const question = room.cgQuestions[room.questionIndex];
      const effect = computeHintEffect(room.level!, question.chapterId, question.optionIds, room.cgChapterLabels.get(question.chapterId) ?? null);
      socket.emit("hint_result", effect);
    });

    socket.on("forfeit", () => {
      const code = socket.data.gameCode as string | undefined;
      if (!code) return;
      const room = rooms.get(code);
      if (!room || room.status !== "IN_PROGRESS") return;
      room.forfeitedBy = user.id;
      finishGame(room);
    });

    socket.on("invite_friend", async ({ toUserId, code }: { toUserId: string; code: string }) => {
      const game = await prisma.liveGame.findUnique({ where: { code: code.toUpperCase() }, include: { host: true } });
      if (!game) return;
      const friendship = await prisma.friendship.findFirst({
        where: {
          status: "ACCEPTED",
          OR: [
            { senderId: user.id, receiverId: toUserId },
            { senderId: toUserId, receiverId: user.id },
          ],
        },
      });
      if (!friendship) return;
      ioInstance?.to(`user:${toUserId}`).emit("game_invite", {
        code: game.code,
        fromDisplayName: user.handle,
      });
    });

    socket.on("disconnect", () => {
      prisma.user
        .update({
          where: { id: user.id },
          // Nooit onder 0: bij een servercrash met nog "open" tellingen (zie
          // de reset bij het opstarten in initGameServer hieronder) zou een
          // losse late disconnect anders negatief kunnen tellen.
          data: { onlineSocketCount: { decrement: 1 }, lastSeenAt: new Date() },
        })
        .then(async (updated) => {
          if (updated.onlineSocketCount < 0) {
            await prisma.user.update({ where: { id: user.id }, data: { onlineSocketCount: 0 } });
          }
        })
        .catch(() => {});

      const code = socket.data.gameCode as string | undefined;
      if (!code) return;
      const room = rooms.get(code);
      const player = room?.players.get(user.id);
      player?.socketIds.delete(socket.id);
      if (room && player && player.socketIds.size === 0 && room.status === "LOBBY") {
        room.players.delete(user.id);
        broadcastLobby(room);
      }
    });
  });
}
