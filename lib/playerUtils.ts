import { Player, RosterSlot, SortStat, Era, OriginalPosition } from "@/types";

const NAME_SUFFIXES = new Set(["jr", "jr.", "sr", "sr.", "ii", "iii", "iv", "v"]);

function parseName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const suffixes: string[] = [];
  let end = parts.length - 1;
  while (end > 0 && NAME_SUFFIXES.has(parts[end].toLowerCase())) {
    suffixes.unshift(parts[end]);
    end--;
  }
  const firstName = parts[0];
  const lastName  = parts[end] ?? firstName;
  return { firstName, lastName, suffixes };
}

export function getDisplayName(fullName: string, maxLen = 16): string {
  if (fullName.length <= maxLen) return fullName;
  const { firstName, lastName, suffixes } = parseName(fullName);
  const suffix = suffixes.length ? " " + suffixes.join(" ") : "";
  return `${firstName[0]}. ${lastName}${suffix}`;
}

export function getShortName(fullName: string): string {
  const { lastName } = parseName(fullName);
  return lastName;
}

export function getPositionArchetype(positions: OriginalPosition[]): string {
  if (!positions || positions.length === 0) return "";

  if (positions.length >= 3) return "HYBRID";

  if (positions.length === 1) {
    const p = positions[0];
    if (p === "PG" || p === "SG") return "GUARD";
    if (p === "SF")               return "WING";
    if (p === "PF" || p === "C")  return "BIG";
    return "";
  }

  const set = new Set(positions);
  if (set.has("PG") && set.has("SG")) return "GUARD";
  if (set.has("SG") && set.has("SF")) return "WING";
  if (set.has("PF") && set.has("C"))  return "BIG";
  return "HYBRID";
}

const PACK_SIZE = 5;

export function getPackPlayers(
  allPlayers: Player[],
  pickedPlayerIds: string[]
): Player[] {
  const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
  const notPicked = (p: Player) => !pickedPlayerIds.includes(p.playerId);

  const available = [...allPlayers]
    .filter(notPicked)
    .filter((p) => p.pctOverall >= 70)
    .sort((a, b) => b.pctOverall - a.pctOverall);

  if (available.length === 0) return [];

  const n = available.length;
  const sTier = available.slice(0, Math.max(1, Math.floor(n * 0.20)));
  const aTier = available.slice(sTier.length, Math.max(sTier.length + 1, Math.floor(n * 0.55)));
  const bTier = available.slice(sTier.length + aTier.length);

  const pack: Player[] = [
    ...shuffle(sTier).slice(0, 2),
    ...shuffle(aTier).slice(0, 2),
    ...shuffle(bTier).slice(0, 1),
  ];

  if (pack.length < PACK_SIZE) {
    const usedIds = new Set(pack.map((p) => p.playerId));
    const extras = shuffle(available.filter((p) => !usedIds.has(p.playerId)));
    pack.push(...extras.slice(0, PACK_SIZE - pack.length));
  }

  return shuffle(pack).slice(0, PACK_SIZE);
}

export function getAvailablePlayers(
  players: Player[],
  team: string,
  era: Era,
  pickedPlayerIds: string[]
): Player[] {
  let result = players.filter(
    (p) => p.team === team && p.era === era && !pickedPlayerIds.includes(p.playerId)
  );

  if (result.length < 3) {
    result = players.filter(
      (p) => p.era === era && !pickedPlayerIds.includes(p.playerId)
    );
  }

  return result.sort((a, b) => b.composite - a.composite);
}

export function hasOpenSlot(roster: RosterSlot[]): boolean {
  return roster.some((s) => s.player === null);
}

export function searchPlayers(players: Player[], query: string): Player[] {
  if (!query.trim()) return players;
  const q = query.toLowerCase();
  return players.filter((p) => p.name.toLowerCase().includes(q));
}

export function sortPlayers(players: Player[], stat: SortStat): Player[] {
  return [...players].sort((a, b) => ((b[stat] ?? 0) as number) - ((a[stat] ?? 0) as number));
}
