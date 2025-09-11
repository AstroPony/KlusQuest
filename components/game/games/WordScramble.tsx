"use client";
import { useMemo, useState } from "react";

type Props = { onComplete: (score: number, durationSeconds?: number) => void; onExit: () => void };
const WORDS = ["apple","banana","orange","grape","peach","mango","lemon","pear","cherry","kiwi"];

function shuffleWord(w: string) {
  return w.split("").sort(() => Math.random() - 0.5).join("");
}

export default function WordScramble({ onComplete, onExit }: Props) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [correct, setCorrect] = useState(0);
  const [start] = useState<number>(() => Date.now());

  const original = WORDS[idx];
  const scrambled = useMemo(() => shuffleWord(original), [original]);

  const submit = () => {
    const isCorrect = input.trim().toLowerCase() === original.toLowerCase();
    if (isCorrect) setCorrect(c => c + 1);
    setInput("");
    const next = idx + 1;
    setIdx(next);
    if (next >= WORDS.length) {
      const seconds = Math.round((Date.now() - start) / 1000);
      const score = correct * 150 + (isCorrect ? 150 : 0) - seconds * 3;
      onComplete(Math.max(0, score), seconds);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Word Scramble</h3>
        <button className="btn btn-ghost" onClick={onExit}>Exit</button>
      </div>
      <div className="text-center">
        <div className="text-3xl tracking-widest mb-4 font-mono">{scrambled}</div>
        <input
          className="input input-bordered w-64 text-center"
          placeholder="Type the word"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div>
          <button className="btn btn-primary mt-4" onClick={submit}>Submit</button>
        </div>
        <div className="mt-4 text-sm text-muted">Solved: {idx} / {WORDS.length} • Correct: {correct}</div>
      </div>
    </div>
  );
}

