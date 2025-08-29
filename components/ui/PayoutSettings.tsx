"use client";

import { useEffect, useState } from "react";

const RATE_KEY = "tokenRateCents";

export default function PayoutSettings() {
  const [rate, setRate] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem(RATE_KEY);
    if (saved != null) setRate(saved);
  }, []);

  const save = () => {
    const cents = Math.max(0, Math.floor(Number(rate) || 0));
    localStorage.setItem(RATE_KEY, String(cents));
    setRate(String(cents));
  };

  return (
    <section className="card p-4">
      <h3 className="text-lg font-semibold mb-2">Uitbetalingsinstellingen</h3>
      <p className="text-sm text-muted mb-3">
        Stel in hoeveel eurocent één token waard is. Kinderen gebruiken dit voor hun Tikkie-aanvraag.
      </p>
      <div className="flex items-center gap-3">
        <label className="text-sm" htmlFor="rate">Cents per token</label>
        <input
          id="rate"
          className="input w-36"
          type="number"
          min={0}
          step={1}
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="bv. 25"
        />
        <button className="btn-primary" onClick={save}>Opslaan</button>
      </div>
      <div className="text-sm text-muted mt-2">Huidig tarief: €{((Number(rate)||0)/100).toFixed(2)} per token</div>
    </section>
  );
}

