"use client";

import { getMenuUrl, getQrImageUrl } from "@/lib/data";
import type { Restaurant } from "@/lib/types";

type Props = {
  restaurant: Restaurant;
  baseUrl: string;
};

export function QRPanel({ restaurant, baseUrl }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: restaurant.tableCount }, (_, i) => {
        const tableId = String(i + 1);
        const menuUrl = getMenuUrl(restaurant.slug, tableId, baseUrl);
        const qrUrl = getQrImageUrl(menuUrl);

        return (
          <div
            key={tableId}
            className="rounded-2xl border border-stone-200 bg-white p-4 text-center shadow-sm"
          >
            <p className="font-semibold text-stone-900">Table {tableId}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt={`QR code for table ${tableId}`}
              className="mx-auto mt-3 rounded-lg"
              width={200}
              height={200}
            />
            <p className="mt-3 break-all text-xs text-stone-500">{menuUrl}</p>
            <a
              href={qrUrl}
              download={`${restaurant.slug}-table-${tableId}-qr.png`}
              className="mt-3 inline-block text-sm font-medium text-amber-700 underline"
            >
              Download QR
            </a>
          </div>
        );
      })}
    </div>
  );
}
