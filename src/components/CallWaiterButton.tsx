"use client";

import { useState } from "react";

export function CallWaiterButton({ tableId }: { tableId: string }) {
  const [sent, setSent] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setSent(true)}
      disabled={sent}
      className="fixed bottom-4 right-4 z-20 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-stone-800 disabled:bg-emerald-600"
    >
      {sent ? "Waiter notified ✓" : `Call waiter · Table ${tableId}`}
    </button>
  );
}
