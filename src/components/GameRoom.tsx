"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getSocket } from "@/lib/socketClient";

interface LobbyPlayer {
  userId: string;
  displayName: string;
  score: number;
}

interface QuestionData {
  id: string;
  index: number;
  total: number;
  type: "FILL_BLANK" | "WORD_BANK";
  verseRef: string;
  prompt: string;
  blanks: number;
  wordBank?: string[];
  timeLimitMs: number;
}

interface Friend {
  id: string;
  username: string;
  displayName: string;
}

type Phase = "connecting" | "lobby" | "question" | "reveal" | "finished" | "error";

export default function GameRoom({ code, myUserId }: { code: string; myUserId: string }) {
  const [phase, setPhase] = useState<Phase>("connecting");
  const [hostId, setHostId] = useState<string | null>(null);
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [answeredCount, setAnsweredCount] = useState({ answered: 0, total: 0 });
  const [correctAnswer, setCorrectAnswer] = useState<string[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [placed, setPlaced] = useState<{ word: string; poolIndex: number }[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [invited, setInvited] = useState<Set<string>>(new Set());

  const socket = getSocket();

  useEffect(() => {
    socket.emit("join_game", { code });

    function onLobby(data: { hostId: string; status: string; players: LobbyPlayer[] }) {
      setHostId(data.hostId);
      setPlayers(data.players);
      if (data.status === "LOBBY") setPhase((p) => (p === "connecting" ? "lobby" : p));
    }
    function onQuestion(data: QuestionData) {
      setQuestion(data);
      setCorrectAnswer(null);
      setSubmitted(false);
      setTextAnswer("");
      setPlaced([]);
      setAnsweredCount({ answered: 0, total: players.length });
      setPhase("question");
    }
    function onAnswerReceived(data: { answered: number; total: number }) {
      setAnsweredCount(data);
    }
    function onReveal(data: { correctAnswer: string[]; scoreboard: LobbyPlayer[] }) {
      setCorrectAnswer(data.correctAnswer);
      setPlayers(data.scoreboard);
      setPhase("reveal");
    }
    function onFinished(data: { scoreboard: LobbyPlayer[] }) {
      setPlayers(data.scoreboard);
      setPhase("finished");
    }
    function onError(data: { message: string }) {
      setErrorMessage(data.message);
      setPhase("error");
    }

    socket.on("lobby_update", onLobby);
    socket.on("question", onQuestion);
    socket.on("answer_received", onAnswerReceived);
    socket.on("reveal", onReveal);
    socket.on("game_finished", onFinished);
    socket.on("error_message", onError);

    return () => {
      socket.off("lobby_update", onLobby);
      socket.off("question", onQuestion);
      socket.off("answer_received", onAnswerReceived);
      socket.off("reveal", onReveal);
      socket.off("game_finished", onFinished);
      socket.off("error_message", onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => {
    fetch("/api/friends")
      .then((r) => r.json())
      .then((d) => setFriends(d.friends ?? []));
  }, []);

  function startGame() {
    socket.emit("start_game");
  }

  function inviteFriend(friendId: string) {
    socket.emit("invite_friend", { toUserId: friendId, code });
    setInvited((prev) => new Set(prev).add(friendId));
  }

  function submitAnswer() {
    if (!question) return;
    const given = question.type === "WORD_BANK" ? placed.map((p) => p.word) : [textAnswer];
    socket.emit("submit_answer", { given });
    setSubmitted(true);
  }

  const pool = useMemo(() => question?.wordBank ?? [], [question]);
  const availablePool = pool
    .map((word, poolIndex) => ({ word, poolIndex }))
    .filter(({ poolIndex }) => !placed.some((p) => p.poolIndex === poolIndex));

  if (phase === "error") {
    return (
      <div className="max-w-md mx-auto card text-center flex flex-col gap-4">
        <p className="text-red-600 font-bold">{errorMessage}</p>
        <Link href="/live" className="btn-secondary self-center">
          Terug
        </Link>
      </div>
    );
  }

  if (phase === "connecting") {
    return <p className="text-center text-slate-400">Verbinden...</p>;
  }

  if (phase === "lobby") {
    const nonPlayerFriends = friends.filter((f) => !players.some((p) => p.userId === f.id));
    return (
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        <div className="card text-center flex flex-col gap-2">
          <p className="text-sm text-slate-400 font-bold uppercase">Speelcode</p>
          <p className="text-4xl font-extrabold tracking-[0.3em] text-brand-700">{code}</p>
          <p className="text-slate-400 text-sm">Deel deze code met vrienden om mee te doen.</p>
        </div>

        <div className="card">
          <h2 className="font-extrabold mb-3">Spelers ({players.length})</h2>
          <ul className="flex flex-col gap-2">
            {players.map((p) => (
              <li key={p.userId} className="flex items-center gap-2">
                <span>{p.userId === hostId ? "👑" : "🙋"}</span>
                <span className="font-bold">{p.displayName}</span>
                {p.userId === myUserId && <span className="text-brand-500 text-sm">(jij)</span>}
              </li>
            ))}
          </ul>
        </div>

        {nonPlayerFriends.length > 0 && (
          <div className="card">
            <h2 className="font-extrabold mb-3">Vrienden uitnodigen</h2>
            <ul className="flex flex-col gap-2">
              {nonPlayerFriends.map((f) => (
                <li key={f.id} className="flex items-center justify-between">
                  <span>{f.displayName}</span>
                  <button
                    className="btn-secondary !px-3 !py-1.5"
                    disabled={invited.has(f.id)}
                    onClick={() => inviteFriend(f.id)}
                  >
                    {invited.has(f.id) ? "Uitgenodigd" : "Nodig uit"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {myUserId === hostId ? (
          <button className="btn-primary self-center" onClick={startGame} disabled={players.length === 0}>
            Start spel →
          </button>
        ) : (
          <p className="text-center text-slate-400">Wachten tot de host het spel start...</p>
        )}
      </div>
    );
  }

  if ((phase === "question" || phase === "reveal") && question) {
    const promptParts = question.prompt.split(/____/);
    return (
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between text-sm font-bold text-slate-400">
          <span>
            Vraag {question.index + 1} / {question.total}
          </span>
          {phase === "question" && (
            <span>
              {answeredCount.answered}/{players.length || answeredCount.total} beantwoord
            </span>
          )}
        </div>
        <CountdownBar key={question.index} timeLimitMs={question.timeLimitMs} active={phase === "question"} />

        <div className="card flex flex-col gap-5">
          <p className="text-xs font-bold uppercase text-slate-400">{question.verseRef}</p>

          {question.type === "FILL_BLANK" ? (
            <p className="text-xl leading-relaxed">
              {promptParts.map((part, i) => (
                <span key={i}>
                  {part}
                  {i < promptParts.length - 1 && (
                    <input
                      autoFocus
                      disabled={submitted || phase === "reveal"}
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !submitted && textAnswer && submitAnswer()}
                      className="inline-block w-32 mx-1 text-center border-b-2 border-slate-300 focus:border-brand-400 outline-none bg-transparent font-bold"
                    />
                  )}
                </span>
              ))}
            </p>
          ) : (
            <>
              <p className="text-xl leading-relaxed">{question.prompt}</p>
              <div className="flex flex-wrap gap-2 min-h-[3rem] p-3 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200">
                {placed.map((p, i) => (
                  <button
                    key={i}
                    disabled={submitted || phase === "reveal"}
                    onClick={() => setPlaced(placed.filter((_, idx) => idx !== i))}
                    className="rounded-xl bg-brand-500 text-white px-3 py-1.5 font-bold"
                  >
                    {p.word}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {availablePool.map(({ word, poolIndex }) => (
                  <button
                    key={poolIndex}
                    disabled={submitted || phase === "reveal"}
                    onClick={() => setPlaced([...placed, { word, poolIndex }])}
                    className="rounded-xl bg-white border-2 border-slate-200 px-3 py-1.5 font-bold hover:border-brand-300"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </>
          )}

          {phase === "question" && !submitted && (
            <button
              className="btn-primary self-end"
              disabled={question.type === "WORD_BANK" ? placed.length !== question.blanks : textAnswer.trim().length === 0}
              onClick={submitAnswer}
            >
              Verstuur
            </button>
          )}
          {submitted && phase === "question" && <p className="text-slate-400 text-sm self-end">Antwoord verstuurd, wachten op anderen...</p>}
          {phase === "reveal" && correctAnswer && (
            <p className="bg-brand-50 text-brand-700 rounded-xl px-3 py-2 font-bold">
              Juiste antwoord: {correctAnswer.join(" ")}
            </p>
          )}
        </div>

        {phase === "reveal" && <Scoreboard players={players} myUserId={myUserId} />}
      </div>
    );
  }

  if (phase === "finished") {
    return (
      <div className="max-w-xl mx-auto flex flex-col gap-6 items-center">
        <h1 className="text-3xl font-extrabold text-brand-800">🏁 Spel afgelopen!</h1>
        <Scoreboard players={players} myUserId={myUserId} showMedals />
        <Link href="/live" className="btn-primary">
          Nieuw spel
        </Link>
      </div>
    );
  }

  return null;
}

function CountdownBar({ timeLimitMs, active }: { timeLimitMs: number; active: boolean }) {
  const [pct, setPct] = useState(100);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!active) return;
    startRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setPct(Math.max(0, 100 - (elapsed / timeLimitMs) * 100));
    }, 100);
    return () => clearInterval(interval);
  }, [active, timeLimitMs]);

  return (
    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`h-full transition-all duration-100 ${pct < 25 ? "bg-red-400" : "bg-brand-500"}`}
        style={{ width: `${active ? pct : 0}%` }}
      />
    </div>
  );
}

function Scoreboard({ players, myUserId, showMedals }: { players: LobbyPlayer[]; myUserId: string; showMedals?: boolean }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="card flex flex-col divide-y divide-slate-100 w-full">
      {players.map((p, i) => (
        <div key={p.userId} className={`flex items-center justify-between py-2 ${p.userId === myUserId ? "font-extrabold" : ""}`}>
          <span>
            {showMedals ? medals[i] ?? i + 1 : i + 1}. {p.displayName} {p.userId === myUserId && "(jij)"}
          </span>
          <span className="text-gold-600 font-bold">{p.score}</span>
        </div>
      ))}
    </div>
  );
}
