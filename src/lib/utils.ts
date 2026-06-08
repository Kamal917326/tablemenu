export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function dishIdFromName(name: string, existingIds: string[]): string {
  const base =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "dish";
  let id = base;
  let n = 1;
  while (existingIds.includes(id)) {
    id = `${base}-${n++}`;
  }
  return id;
}
