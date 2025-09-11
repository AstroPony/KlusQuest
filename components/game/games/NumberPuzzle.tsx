"use client";
import { useEffect, useMemo, useState } from "react";

type Props = { onComplete: (score: number, durationSeconds?: number) => void; onExit: () => void };

type Q = { a: number; b: number; op: "+" | "-" | "×" };

function makeQuestions(n = 10): Q[] {
  const qs: Q[] = [];
  for (let i = 0; i < n; i++) {
    const op = Math.random() < 0.5 ? (Math.random() < 0.5 ? "+" : "-") : "×";
    const a = op === "×" ? Math.ceil(Math.random() * 10) : Math.ceil(Math.random() * 20);
    const b = op === "×" ? Math.ceil(Math.random() * 10) : Math.ceil(Math.random() * 20);
    qs.push({ a, b, op });
  }
  return qs;
}

function evalQ(q: Q): number {
  switch (q.op) {
    case "+": return q.a + q.b;
    case "-": return q.a - q.b;
    case "×": return q.a * q.b;
  }
}

export default function NumberPuzzle({ onComplete, onExit }: Props) {
  const [qs] = useState<Q[]>(() => makeQuestions(10));
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [start] = useState<number>(() => Date.now());

  const current = useMemo(() => qs[idx], [qs, idx]);

  const submit = () => {
    if (!current) return;
    const val = parseInt(answer, 10);
    if (!Number.isNaN(val) && val === evalQ(current)) setCorrect(c => c + 1);
    setAnswer("");
    const next = idx + 1;
    setIdx(next);
    if (next >= qs.length) {
      const seconds = Math.round((Date.now() - start) / 1000);
      const score = correct * 120 + (val === evalQ(current) ? 120 : 0) - seconds * 2;
      onComplete(Math.max(0, score), seconds);
    }
  };

  useEffect(() => {
    const onEnter = (e: KeyboardEvent) => { if (e.key === "Enter") submit(); };
    window.addEventListener("keydown", onEnter);
    return () => window.removeEventListener("keydown", onEnter);
  });

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Number Puzzle</h3>
        <button className="btn btn-ghost" onClick={onExit}>Exit</button>
      </div>
      {current ? (
        <div className="text-center">
          <div className="text-4xl font-bold mb-4">{current.a} {current.op} {current.b} = ?</div>
          <input
            className="input input-bordered w-40 text-center text-xl"
            value={answer}
            onChange={(e) => setAnswer(e.target.value.replace(/[^0-9-]/g, ''))}
          />
          <div>
            <button className="btn btn-primary mt-4" onClick={submit}>Submit</button>
          </div>
          <div className="mt-4 text-sm text-muted">Solved: {idx} / {qs.length} • Correct: {correct}</div>
        </div>
      ) : (
        <div className="text-center">Loading…</div>
      )}
    </div>
  );
}

