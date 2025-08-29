type CompletionItem = { choreId: string; kidId: string };

const KEY = 'completionQueue';

function readQueue(): CompletionItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CompletionItem[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(items: CompletionItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export function enqueueCompletion(item: CompletionItem) {
  const q = readQueue();
  q.push(item);
  writeQueue(q);
}

export async function flushQueue() {
  const q = readQueue();
  if (!q.length) return;
  const remaining: CompletionItem[] = [];
  for (const it of q) {
    try {
      const res = await fetch(`/api/chores/${it.choreId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kidId: it.kidId }),
      });
      if (!res.ok) {
        remaining.push(it);
      }
    } catch {
      remaining.push(it);
    }
  }
  writeQueue(remaining);
}

export function initOfflineQueue() {
  // Flush when connectivity returns
  window.addEventListener('online', () => {
    flushQueue();
  });
}

