"use client";

import { useEffect, useMemo, useState } from "react";

type Kid = { id: string; displayName: string };
type Luxury = { id?: string; title: string; type: "TIME" | "ITEM" | "PRIVILEGE"; minutes?: number; rank: number; assignedGame: string; active?: boolean };

const GAME_OPTIONS = [
  { id: "reaction", label: "Reaction Rush" },
  { id: "memory", label: "Memory Match" },
  { id: "math", label: "Math Blitz" },
  { id: "mole", label: "Whack-a-Mole" },
];

export default function KidLuxuries() {
  const [kids, setKids] = useState<Kid[]>([]);
  const [kidId, setKidId] = useState<string>("");
  const [rows, setRows] = useState<Luxury[]>([
    { title: "", type: "ITEM", rank: 1, assignedGame: "reaction" },
    { title: "", type: "ITEM", rank: 2, assignedGame: "memory" },
    { title: "", type: "ITEM", rank: 3, assignedGame: "math" },
    { title: "", type: "ITEM", rank: 4, assignedGame: "mole" },
  ]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/kids").then(async r => {
      if (!r.ok) return;
      const data = await r.json();
      setKids(data.map((k: any) => ({ id: k.id, displayName: k.displayName })));
      if (data[0]) setKidId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!kidId) return;
    fetch(`/api/kids/${kidId}/luxuries`).then(async r => {
      if (!r.ok) return;
      const lux = await r.json();
      if (Array.isArray(lux) && lux.length) {
        const merged = [...rows];
        for (const l of lux) {
          const idx = (l.rank || 1) - 1;
          merged[idx] = {
            title: l.title,
            type: l.type,
            minutes: l.minutes ?? undefined,
            rank: l.rank,
            assignedGame: l.assignedGame,
            active: l.active,
          };
        }
        setRows(merged);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidId]);

  const canSave = useMemo(() => kidId && rows.some(r => r.title.trim().length >= 2), [kidId, rows]);

  const updateRow = (i: number, patch: Partial<Luxury>) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  };

  const save = async () => {
    if (!kidId) return;
    setSaving(true);
    setMessage(null);
    try {
      const payload = rows
        .filter(r => r.title.trim().length >= 2)
        .map(r => ({
          title: r.title.trim(),
          type: r.type,
          minutes: r.type === "TIME" ? (r.minutes || 15) : undefined,
          rank: r.rank,
          assignedGame: r.assignedGame,
          active: true,
        }));
      const res = await fetch(`/api/kids/${kidId}/luxuries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      setMessage("Voorkeuren opgeslagen ✓");
    } catch (e) {
      setMessage("Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Luxes na Spelwinst</h2>
      <p className="text-sm text-muted mb-3">Kies tot 4 dingen die je kind mag doen/krijgt na het winnen van een spel. Koppel elk item aan een spel en rangschik ze.</p>

      <div className="flex gap-2 items-center mb-4">
        <label className="text-sm">Kind:</label>
        <select value={kidId} onChange={e => setKidId(e.target.value)} className="input">
          {kids.map(k => (
            <option key={k.id} value={k.id}>{k.displayName}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="card p-4 grid md:grid-cols-5 gap-2 items-center">
            <div>
              <div className="text-xs text-muted">Rang</div>
              <div className="font-semibold">{i + 1}</div>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted">Titel</label>
              <input
                className="input w-full"
                placeholder={i === 0 ? "Bijv. 15 min YouTube" : "Bijv. IJsje"}
                value={r.title}
                onChange={e => updateRow(i, { title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted">Type</label>
              <select className="input w-full" value={r.type} onChange={e => updateRow(i, { type: e.target.value as any })}>
                <option value="ITEM">Item</option>
                <option value="TIME">Tijd</option>
                <option value="PRIVILEGE">Privilege</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted">Spel</label>
              <select className="input w-full" value={r.assignedGame} onChange={e => updateRow(i, { assignedGame: e.target.value })}>
                {GAME_OPTIONS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
              </select>
            </div>
            {r.type === "TIME" && (
              <div className="md:col-span-5">
                <label className="text-xs text-muted">Minuten</label>
                <input type="number" min={5} max={240} className="input w-32" value={r.minutes ?? 15} onChange={e => updateRow(i, { minutes: parseInt(e.target.value || "15", 10) })} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button onClick={save} disabled={!canSave || saving} className="btn-primary">
          {saving ? "Opslaan..." : "Opslaan"}
        </button>
        {message && <span className="text-sm text-muted">{message}</span>}
      </div>
    </section>
  );
}

