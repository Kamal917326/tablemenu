export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export function getMenuUrl(slug: string, tableId: string, baseUrl: string) {
  return `${baseUrl.replace(/\/$/, "")}/r/${slug}/t/${tableId}`;
}

export function getQrImageUrl(menuUrl: string, size = 280): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(menuUrl)}`;
}
