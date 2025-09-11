"use client";
import { useEffect, useState } from "react";

type Props = { onComplete: (score: number, durationSeconds?: number) => void; onExit: () => void };
type Color = "red" | "blue" | "green";
const COLORS: Color[] = ["red","blue","green"];

export default function ColorSort({ onComplete, onExit }: Props) {
  const [queue, setQueue] = useState<Color[]>([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [start] = useState<number>(() => Date.now());

  useEffect(() => {
    const items: Color[] = Array.from({ length: 12 }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
    setQueue(items);
  }, []);

  const pick = (bucket: Color) => {
    if (index >= queue.length) return;
    const isCorrect = bucket === queue[index];
    if (isCorrect) setCorrect(c => c + 1);
    const nextIndex = index + 1;
    setIndex(nextIndex);
    if (nextIndex >= queue.length) {
      const seconds = Math.round((Date.now() - start) / 1000);
      const score = correct * 100 + (isCorrect ? 100 : 0) - seconds * 5;
      onComplete(Math.max(0, score), seconds);
    }
  };

  const current = queue[index];
  const colorToClass = (c: Color) => c === "red" ? "bg-red-500" : c === "blue" ? "bg-blue-500" : "bg-green-500";

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Color Sort</h3>
        <button className="btn btn-ghost" onClick={onExit}>Exit</button>
      </div>
      <div className="text-center">
        <div className={`w-16 h-16 rounded-full mx-auto mb-6 ${colorToClass(current ?? "red")}`}></div>
        <div className="grid grid-cols-3 gap-4">
          {COLORS.map((b) => (
            <button key={b} onClick={() => pick(b)} className={`h-16 rounded-lg text-white font-semibold ${colorToClass(b)} hover:opacity-90`}>
              {b.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="mt-4 text-sm text-muted">Correct: {correct} / {queue.length}</div>
      </div>
    </div>
  );
}

