"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  coins: number;
  xp: number;
  kidName?: string;
};

const RATE_KEY = "tokenRateCents";
const BASELINE_KEY = "payoutBaselineCoins";
const LAST_REQUEST_AT_KEY = "lastPayoutRequestAt";

export function KidEarningsSummary({ coins, xp, kidName }: Props) {
  const [rateCents, setRateCents] = useState<number>(0);
  const [baselineCoins, setBaselineCoins] = useState<number>(0);
  const [lastRequestAt, setLastRequestAt] = useState<string | null>(null);

  useEffect(() => {
    const rateStr = localStorage.getItem(RATE_KEY);
    setRateCents(rateStr ? parseInt(rateStr, 10) || 0 : 0);
    const baseStr = localStorage.getItem(BASELINE_KEY);
    setBaselineCoins(baseStr ? parseInt(baseStr, 10) || 0 : 0);
    setLastRequestAt(localStorage.getItem(LAST_REQUEST_AT_KEY));
  }, []);

  const sinceBaselineCoins = useMemo(() => Math.max(0, coins - baselineCoins), [coins, baselineCoins]);
  const euroAmount = useMemo(() => (sinceBaselineCoins * rateCents) / 100, [sinceBaselineCoins, rateCents]);

  const canRequest = sinceBaselineCoins > 0 && rateCents > 0;

  const handleRequest = () => {
    // Lock in baseline at current coins and mark request time
    localStorage.setItem(BASELINE_KEY, String(coins));
    const now = new Date().toISOString();
    localStorage.setItem(LAST_REQUEST_AT_KEY, now);
    setBaselineCoins(coins);
    setLastRequestAt(now);
    // Compose a helpful email subject/body for parents (Tikkie link can be added by parent)
    const subject = encodeURIComponent(
      `${kidName ?? "Kind"} vraagt uitbetaling aan: ${sinceBaselineCoins} tokens (€${euroAmount.toFixed(2)})`
    );
    const body = encodeURIComponent(
      `Hoi!\n\nIk heb ${sinceBaselineCoins} tokens verdiend sinds mijn laatste uitbetaling. Dat is ongeveer €${euroAmount.toFixed(
        2
      )} bij een tarief van €${(rateCents / 100).toFixed(2)} per token.\n\nKun je een Tikkie sturen of bevestigen?`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleConfirmReceived = () => {
    // Confirmation marks baseline at current coins (meaning new accumulation starts now)
    localStorage.setItem(BASELINE_KEY, String(coins));
    setBaselineCoins(coins);
  };

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Samenvatting</h4>
        {lastRequestAt && (
          <span className="text-xs text-muted">Laatste aanvraag: {new Date(lastRequestAt).toLocaleString()}</span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-2xl font-bold">{xp}</div>
          <div className="text-muted text-sm">XP</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{sinceBaselineCoins}</div>
          <div className="text-muted text-sm">Tokens sinds payout</div>
        </div>
        <div>
          <div className="text-2xl font-bold">€{euroAmount.toFixed(2)}</div>
          <div className="text-muted text-sm">Geschat bedrag</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="btn-primary flex-1"
          onClick={handleRequest}
          disabled={!canRequest}
          title={canRequest ? "Vraag Tikkie aan" : "Stel eerst het tarief in en verdien tokens"}
        >
          Vraag Tikkie aan
        </button>
        <button className="btn-ghost" onClick={handleConfirmReceived} title="Ik heb het ontvangen">
          Ontvangen ✓
        </button>
      </div>
      {rateCents === 0 && (
        <div className="alert alert-error mt-1">Tarief is 0. Vraag je ouder om dit in te stellen.</div>
      )}
    </div>
  );
}

