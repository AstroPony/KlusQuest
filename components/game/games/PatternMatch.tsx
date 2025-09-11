"use client";
import { useEffect, useState } from "react";

type Props = { onComplete: (score: number, durationSeconds?: number) => void; onExit: () => void };
const COLORS = [
  { id: 0, name: "red", cls: "bg-red-500" },
  { id: 1, name: "blue", cls: "bg-blue-500" },
  { id: 2, name: "green", cls: "bg-green-500" },
  { id: 3, name: "yellow", cls: "bg-yellow-400" },
];

export default function PatternMatch({ onComplete, onExit }: Props) {
  const [pattern, setPattern] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [showing, setShowing] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [start] = useState<number>(() => Date.now());

  useEffect(() => {
    startRound(1);
  }, []);

  function startRound(r: number) {
    const next = Array.from({ length: r + 2 }, () => Math.floor(Math.random() * COLORS.length));
    setPattern(next);
    setIndex(0);
    setShowing(true);
    // playback: flash each color in sequence
    let i = 0;
    const id = setInterval(() => {
      const step = Math.floor(i / 2);
      if (i % 2 === 0) {
        setActive(next[step]);
      } else {
        setActive(null);
      }
      i++;
      if (i >= next.length * 2) {
        clearInterval(id);
        setActive(null);
        setShowing(false);
      }
    }, 450);
  }

  function press(id: number) {
    if (showing) return;
    if (pattern[index] === id) {
      const nextIdx = index + 1;
      setIndex(nextIdx);
      if (nextIdx >= pattern.length) {
        // round complete
        const nextRound = round + 1;
        setRound(nextRound);
        if (nextRound > 5) {
          const seconds = Math.round((Date.now() - start) / 1000);
          const score = 1500 - seconds * 20;
          onComplete(Math.max(0, score), seconds);
        } else {
          startRound(nextRound);
        }
      }
    } else {
      // fail
      const seconds = Math.round((Date.now() - start) / 1000);
      const score = Math.max(0, round * 200 - seconds * 10);
      onComplete(score, seconds);
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Pattern Match</h3>
        <button className="btn btn-ghost" onClick={onExit}>Exit</button>
      </div>
      <div className="text-center text-sm text-muted mb-4">Round {round} / 5 {showing ? "• Watch the pattern" : "• Your turn"}</div>
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        {COLORS.map(c => (
          <button
            key={c.id}
            onClick={() => press(c.id)}
            className={`h-24 rounded-lg ${c.cls} ${showing ? "opacity-60" : "opacity-100"} ${active === c.id ? "ring-4 ring-white scale-105" : ""}`}
            disabled={showing}
          />
        ))}
      </div>
    </div>
  );
}

