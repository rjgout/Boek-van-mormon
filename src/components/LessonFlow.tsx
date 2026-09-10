"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

interface Exercise {
  id: string;
  type: "FILL_BLANK" | "WORD_BANK";
  verseRef: string;
  prompt: string;
  blanks: number;
  wordBank?: string[];
}

interface Verse {
  number: number;
  text: string;
}

interface Props {
  chapterId: string;
  bookName: string;
  chapterNumber: number;
  verses: Verse[];
  exercises: Exercise[];
}

type Phase = "read" | "exercises" | "summary";

interface SubmittedAnswer {
  exerciseId: string;
  given: string[];
}

interface SummaryResult {
  correctCount: number;
  total: number;
  xpEarned: number;
  scorePercent: number;
  currentStreak: number;
  longestStreak: number;
  streakBroken: boolean;
  freezeUsed: boolean;
  freezesEarned: number;
  freezeCount: number;
}

export default function LessonFlow({ chapterId, bookName, chapterNumber, verses, exercises }: Props) {
  const [phase, setPhase] = useState<Phase>("read");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<SubmittedAnswer[]>([]);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const current = exercises[index];

  async function finishExercises(finalAnswers: SubmittedAnswer[]) {
    setSubmitting(true);
    const res = await fetch(`/api/chapters/${chapterId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: finalAnswers }),
    });
    const data = await res.json();
    setSubmitting(false);
    setSummary(data);
    setPhase("summary");
  }

  function onExerciseDone(given: string[]) {
    const next = [...answers, { exerciseId: current.id, given }];
    setAnswers(next);
    if (index + 1 < exercises.length) {
      setIndex(index + 1);
    } else {
      finishExercises(next);
    }
  }

  if (phase === "read") {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-extrabold text-brand-800">
          {bookName} {chapterNumber}
        </h1>
        <div className="card flex flex-col gap-3 text-lg leading-relaxed">
          {verses.map((v) => (
            <p key={v.number}>
              <span className="text-brand-400 font-bold mr-2">{v.number}</span>
              {v.text}
            </p>
          ))}
        </div>
        <button className="btn-primary self-start" onClick={() => setPhase("exercises")}>
          Begin oefeningen →
        </button>
      </div>
    );
  }

  if (phase === "exercises" && current) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <ProgressBar current={index} total={exercises.length} />
        <ExerciseCard key={current.id} exercise={current} onDone={onExerciseDone} disabled={submitting} />
      </div>
    );
  }

  if (phase === "summary" && summary) {
    return <SummaryScreen summary={summary} />;
  }

  return null;
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
      <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

function ExerciseCard({
  exercise,
  onDone,
  disabled,
}: {
  exercise: Exercise;
  onDone: (given: string[]) => void;
  disabled: boolean;
}) {
  const [checked, setChecked] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [placed, setPlaced] = useState<{ word: string; poolIndex: number }[]>([]);

  const pool = useMemo(() => exercise.wordBank ?? [], [exercise]);
  const availablePool = pool
    .map((word, poolIndex) => ({ word, poolIndex }))
    .filter(({ poolIndex }) => !placed.some((p) => p.poolIndex === poolIndex));

  const promptParts = exercise.prompt.split(/____/);

  function check() {
    setChecked(true);
    if (exercise.type === "FILL_BLANK") {
      // De server bepaalt de echte correctheid; hier tonen we alvast feedback.
      setWasCorrect(textAnswer.trim().length > 0);
    } else {
      setWasCorrect(placed.length === exercise.blanks);
    }
  }

  function next() {
    if (exercise.type === "FILL_BLANK") {
      onDone([textAnswer]);
    } else {
      onDone(placed.map((p) => p.word));
    }
  }

  if (exercise.type === "FILL_BLANK") {
    return (
      <div className="card flex flex-col gap-5">
        <p className="text-xs font-bold uppercase text-slate-400">{exercise.verseRef}</p>
        <p className="text-xl leading-relaxed">
          {promptParts.map((part, i) => (
            <span key={i}>
              {part}
              {i < promptParts.length - 1 && (
                <input
                  autoFocus
                  disabled={checked}
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !checked && textAnswer && check()}
                  className={`inline-block w-32 mx-1 text-center border-b-2 outline-none bg-transparent font-bold ${
                    checked
                      ? wasCorrect
                        ? "border-brand-500 text-brand-600"
                        : "border-red-400 text-red-500 animate-shake"
                      : "border-slate-300 focus:border-brand-400"
                  }`}
                />
              )}
            </span>
          ))}
        </p>
        <FooterControls
          checked={checked}
          canCheck={textAnswer.trim().length > 0}
          disabled={disabled}
          onCheck={check}
          onNext={next}
        />
      </div>
    );
  }

  // WORD_BANK
  return (
    <div className="card flex flex-col gap-5">
      <p className="text-xs font-bold uppercase text-slate-400">{exercise.verseRef}</p>
      <p className="text-xl leading-relaxed">{exercise.prompt}</p>

      <div className="flex flex-wrap gap-2 min-h-[3rem] p-3 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200">
        {placed.length === 0 && <span className="text-slate-400 text-sm">Tik de woorden hieronder in de juiste volgorde</span>}
        {placed.map((p, i) => (
          <button
            key={i}
            disabled={checked}
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
            disabled={checked}
            onClick={() => setPlaced([...placed, { word, poolIndex }])}
            className="rounded-xl bg-white border-2 border-slate-200 px-3 py-1.5 font-bold hover:border-brand-300"
          >
            {word}
          </button>
        ))}
      </div>

      <FooterControls
        checked={checked}
        canCheck={placed.length === exercise.blanks}
        disabled={disabled}
        onCheck={check}
        onNext={next}
      />
    </div>
  );
}

function FooterControls({
  checked,
  canCheck,
  disabled,
  onCheck,
  onNext,
}: {
  checked: boolean;
  canCheck: boolean;
  disabled: boolean;
  onCheck: () => void;
  onNext: () => void;
}) {
  if (!checked) {
    return (
      <button className="btn-primary self-end" disabled={!canCheck || disabled} onClick={onCheck}>
        Controleer
      </button>
    );
  }
  return (
    <button className="btn-primary self-end animate-pop" disabled={disabled} onClick={onNext}>
      {disabled ? "Bezig..." : "Doorgaan →"}
    </button>
  );
}

function SummaryScreen({ summary }: { summary: SummaryResult }) {
  return (
    <div className="max-w-md mx-auto card flex flex-col items-center gap-4 text-center animate-pop">
      <div className="text-5xl">{summary.scorePercent >= 80 ? "🎉" : summary.scorePercent >= 50 ? "👍" : "💪"}</div>
      <h2 className="text-2xl font-extrabold text-brand-800">
        {summary.correctCount} / {summary.total} goed ({summary.scorePercent}%)
      </h2>
      <p className="text-gold-600 font-extrabold text-lg">+{summary.xpEarned} XP</p>

      <div className="flex gap-6 mt-2">
        <div>
          <div className="text-xl font-extrabold text-orange-500">🔥 {summary.currentStreak}</div>
          <div className="text-xs text-slate-400 font-bold uppercase">Streak</div>
        </div>
        <div>
          <div className="text-xl font-extrabold text-ice-600">🧊 {summary.freezeCount}</div>
          <div className="text-xs text-slate-400 font-bold uppercase">Freezes</div>
        </div>
      </div>

      {summary.freezeUsed && (
        <p className="text-sm bg-ice-50 text-ice-600 rounded-xl px-3 py-2">
          Je hebt een dag gemist, maar een streak freeze heeft je streak gered! 🧊
        </p>
      )}
      {summary.streakBroken && !summary.freezeUsed && (
        <p className="text-sm bg-red-50 text-red-500 rounded-xl px-3 py-2">
          Je streak is helaas verbroken — morgen weer opbouwen!
        </p>
      )}
      {summary.freezesEarned > 0 && (
        <p className="text-sm bg-gold-50 text-gold-600 rounded-xl px-3 py-2">
          Mijlpaal gehaald! Je hebt {summary.freezesEarned} streak freeze{summary.freezesEarned > 1 ? "s" : ""} verdiend. 🧊
        </p>
      )}

      <div className="flex gap-3 mt-4">
        <Link href="/dashboard" className="btn-secondary">
          Terug naar lessen
        </Link>
      </div>
    </div>
  );
}
