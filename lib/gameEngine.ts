import { Player, RosterSlot } from "@/types";

export function simulateSeason(roster: RosterSlot[]): number {
  const players = roster.map((s) => s.player!);

  const avgOffense = players.reduce((s, p) => s + p.offenseRating, 0) / players.length;
  const avgDefense = players.reduce((s, p) => s + p.defenseRating, 0) / players.length;

  const teamScore = avgOffense * 0.55 + avgDefense * 0.45;

  const rawWins = 82 / (1 + Math.exp(-0.12 * (teamScore - 76)));

  const noise = stableNoise(players) * 4 - 2;
  return Math.min(82, Math.max(0, Math.round(rawWins + noise)));
}

function stableNoise(players: Player[]): number {
  const str = players.map((p) => p.playerId).sort().join("|");
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0;
  }
  return (hash % 1000) / 1000;
}
