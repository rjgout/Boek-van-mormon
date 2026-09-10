import type { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import { prisma } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { parseCookieHeader } from "@/lib/parseCookieHeader";
import { isAnswerCorrect, isWordBankCorrect } from "@/lib/exerciseGen";
import { completeLesson } from "@/lib/streak";

const QUESTION_TIME_MS = 20_000;
const REVEAL_PAUSE_MS = 3_500;

interface GameExercise {
  id: string;
  type: "FILL_BLANK" | "WORD_BANK" | "TRUE_FALSE";
  verseRef: string;
  prompt: string;
  answers: string[];
  wordBank?: string[];
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
}

interface RoomState {
  id: string;
  code: string;
  chapterId: string;
  hostId: string;
  status: "LOBBY" | "IN_PROGRESS" | "FINISHED";
  exercises: GameExercise[];
  questionIndex: number;
  questionStartedAt: number;
  players: Map<string, RoomPlayer>;
  timer?: NodeJS.Timeout;
}

const rooms = new Map<string, RoomState>();
let ioInstance: SocketIOServer | null = null;

export function getIO() {
  return ioInstance;
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
  };
}

async function loadExercises(chapterId: string): Promise<GameExercise[]> {
  const rows = await prisma.exercise.findMany({
    where: { chapterId, status: "APPROVED" },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    type: r.type as "FILL_BLANK" | "WORD_BANK" | "TRUE_FALSE",
    verseRef: r.verseRef,
    prompt: r.prompt,
    answers: JSON.parse(r.answers) as string[],
    wordBank: r.wordBank ? (JSON.parse(r.wordBank) as string[]) : undefined,
  }));
}

function broadcastLobby(room: RoomState) {
  ioInstance?.to(room.code).emit("lobby_update", {
    hostId: room.hostId,
    status: room.status,
    players: serializePlayers(room),
  });
}

function askQuestion(room: RoomState) {
  const exercise = room.exercises[room.questionIndex];
  if (!exercise) {
    finishGame(room);
    return;
  }
  for (const p of room.players.values()) {
    p.answeredAt = undefined;
    p.given = undefined;
    p.correct = undefined;
  }
  room.questionStartedAt = Date.now();
  ioInstance?.to(room.code).emit("question", {
    index: room.questionIndex,
    total: room.exercises.length,
    timeLimitMs: QUESTION_TIME_MS,
    ...sanitizeExercise(exercise),
  });

  room.timer = setTimeout(() => revealAndAdvance(room), QUESTION_TIME_MS);
}

function allAnswered(room: RoomState) {
  return [...room.players.values()].every((p) => p.answeredAt !== undefined);
}

function revealAndAdvance(room: RoomState) {
  if (room.timer) clearTimeout(room.timer);
  const exercise = room.exercises[room.questionIndex];
  ioInstance?.to(room.code).emit("reveal", {
    index: room.questionIndex,
    correctAnswer: exercise.answers,
    scoreboard: serializePlayers(room),
  });

  room.questionIndex += 1;
  room.timer = setTimeout(() => {
    if (room.questionIndex >= room.exercises.length) {
      finishGame(room);
    } else {
      askQuestion(room);
    }
  }, REVEAL_PAUSE_MS);
}

async function finishGame(room: RoomState) {
  room.status = "FINISHED";
  ioInstance?.to(room.code).emit("game_finished", { scoreboard: serializePlayers(room) });
  await prisma.liveGame.update({ where: { code: room.code }, data: { status: "FINISHED" } }).catch(() => {});

  const maxScore = Math.max(0, ...[...room.players.values()].map((p) => p.score));

  for (const p of room.players.values()) {
    await prisma.liveGamePlayer
      .update({ where: { gameId_userId: { gameId: room.id, userId: p.userId } }, data: { score: p.score } })
      .catch(() => {});

    const percent = room.exercises.length === 0 ? 0 : Math.round((p.correctCount / room.exercises.length) * 100);
    const xp = Math.round(p.score / 5);
    const won = maxScore > 0 && p.score === maxScore;
    if (xp > 0) {
      await completeLesson(p.userId, room.chapterId, percent, xp, won ? "LIVE_GAME_WON" : "LIVE_GAME_PLAYED").catch(() => {});
    }
  }
  setTimeout(() => rooms.delete(room.code), 5 * 60_000);
}

function registerAnswer(room: RoomState, userId: string, given: string[]) {
  const player = room.players.get(userId);
  if (!player || player.answeredAt !== undefined) return;
  const exercise = room.exercises[room.questionIndex];
  if (!exercise) return;

  const correct =
    exercise.type === "WORD_BANK" ? isWordBankCorrect(given, exercise.answers) : isAnswerCorrect(given[0] ?? "", exercise.answers);

  const elapsed = Date.now() - room.questionStartedAt;
  const remainingFraction = Math.max(0, 1 - elapsed / QUESTION_TIME_MS);
  const points = correct ? Math.round(50 + 50 * remainingFraction) : 0;

  player.answeredAt = Date.now();
  player.given = given;
  player.correct = correct;
  player.score += points;
  if (correct) player.correctCount += 1;

  ioInstance?.to(room.code).emit("answer_received", {
    userId,
    total: room.players.size,
    answered: [...room.players.values()].filter((p) => p.answeredAt !== undefined).length,
  });

  if (allAnswered(room)) {
    revealAndAdvance(room);
  }
}

export function initGameServer(httpServer: HttpServer) {
  ioInstance = new SocketIOServer(httpServer, { path: "/socket.io" });

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
    socket.data.displayName = user.displayName;
    socket.join(`user:${user.id}`);

    socket.on("join_game", async ({ code }: { code: string }) => {
      const upperCode = code.toUpperCase();
      let room = rooms.get(upperCode);

      if (!room) {
        const game = await prisma.liveGame.findUnique({ where: { code: upperCode } });
        if (!game || game.status === "FINISHED") {
          socket.emit("error_message", { message: "Spel niet gevonden of al afgelopen." });
          return;
        }
        room = {
          id: game.id,
          code: upperCode,
          chapterId: game.chapterId,
          hostId: game.hostId,
          status: game.status as RoomState["status"],
          exercises: await loadExercises(game.chapterId),
          questionIndex: 0,
          questionStartedAt: 0,
          players: new Map(),
        };
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
        player = { userId: user.id, displayName: user.displayName, socketIds: new Set(), score: 0, correctCount: 0 };
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
      if (room.exercises.length === 0) {
        socket.emit("error_message", { message: "Dit hoofdstuk heeft geen oefeningen." });
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
        fromDisplayName: user.displayName,
      });
    });

    socket.on("disconnect", () => {
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
