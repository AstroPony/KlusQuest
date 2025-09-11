"use client";
import { useEffect, useMemo, useState } from "react";

type Props = { onComplete: (score: number, durationSeconds?: number) => void; onExit: () => void };
type Card = { id: number; value: string; flipped: boolean; matched: boolean };

const EMOJIS = ["🍎","🍌","🍇","🍓","🍒","🍍","🥝","🍉"];

export default function MemoryMatch({ onComplete, onExit }: Props) {
  const [cards, setCards] = useState<Card[]>([]);
  const [first, setFirst] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [start] = useState<number>(() => Date.now());

  useEffect(() => {
    // Pick 6 unique emojis, duplicate to make pairs, then shuffle
    const unique = EMOJIS.slice(0, 6);
    const pairValues = [...unique, ...unique]; // 6 pairs = 12 cards
    const shuffled = pairValues
      .sort(() => Math.random() - 0.5)
      .map((v, i) => ({ id: i, value: v, flipped: false, matched: false }));
    setCards(shuffled);
  }, []);

  const matchedCount = useMemo(() => cards.filter(c => c.matched).length, [cards]);

  useEffect(() => {
    if (cards.length > 0 && matchedCount === cards.length) {
      const seconds = Math.round((Date.now() - start) / 1000);
      // Simple score: higher is better
      const score = Math.max(0, 1000 - moves * 20 - seconds * 10);
      onComplete(score, seconds);
    }
  }, [cards, matchedCount, moves, onComplete, start]);

  const flip = (idx: number) => {
    if (cards[idx].flipped || cards[idx].matched) return;
    const next = cards.slice();
    next[idx] = { ...next[idx], flipped: true };
    setCards(next);
    if (first === null) {
      setFirst(idx);
    } else {
      setMoves(m => m + 1);
      const a = next[first];
      const b = next[idx];
      if (a.value === b.value) {
        next[first] = { ...a, matched: true } as Card;
        next[idx] = { ...b, matched: true } as Card;
        setCards(next);
        setFirst(null);
      } else {
        // flip back after brief delay
        const prevFirst = first;
        setTimeout(() => {
          setCards(curr => {
            const c = curr.slice();
            c[prevFirst] = { ...c[prevFirst], flipped: false } as Card;
            c[idx] = { ...c[idx], flipped: false } as Card;
            return c;
          });
        }, 700);
        setFirst(null);
      }
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Memory Match</h3>
        <button className="btn btn-ghost" onClick={onExit}>Exit</button>
      </div>
      <div className="text-sm text-muted mb-2">Moves: {moves}</div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => flip(i)}
            className={`h-20 rounded-lg border flex items-center justify-center text-3xl select-none transition-all ${c.matched ? "bg-green-500/20 border-green-500/40" : c.flipped ? "bg-white/10 border-white/30" : "bg-primary/10 border-primary/30"}`}
          >
            {c.flipped || c.matched ? c.value : "❓"}
          </button>
        ))}
      </div>
    </div>
  );
}
