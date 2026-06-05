import { Player, RosterSlot, CPUTeam, MatchResult, Buff } from "@/types";

const SLOT_LABELS = ["G", "W", "B"] as const;

const ROUND_CONFIGS = [
  { min: 78, max: 90, difficulty: "easy"   as const },
  { min: 85, max: 95, difficulty: "medium" as const },
  { min: 95, max: 110, difficulty: "hard"  as const },
];

const CPU_TEAM_NAMES = [
  "RIM ROCKERS",    "SPLASH CITY",   "THE LOCKDOWN",  "BUCKET GETTERS",
  "GLASS EATERS",   "FULL COURT",    "THE ALL-STARS", "CHAOS SQUAD",
  "PICK & ROLL",    "THE DUNKERS",   "SHOT CALLERS",  "THE BALLERS",
  "CORNER THREE",   "FAST BREAK",    "PAINT KINGS",   "WING SPAN",
];

export function generateCPUTeams(
  allPlayers: Player[],
  usedPlayerIds: string[]
): CPUTeam[] {
  const available = allPlayers.filter((p) => !usedPlayerIds.includes(p.playerId) && p.pctOverall >= 70);
  const teams: CPUTeam[] = [];
  const usedInCPU = new Set<string>();
  const usedNamesInCPU = new Set<string>();

  const namePool = [...CPU_TEAM_NAMES].sort(() => Math.random() - 0.5);

  for (let i = 0; i < 3; i++) {
    const { min, max, difficulty } = ROUND_CONFIGS[i];

    const normName = (p: Player) => p.name.trim().toLowerCase();
    const isAvail  = (p: Player) => !usedInCPU.has(p.playerId) && !usedNamesInCPU.has(normName(p));

    let pool = available.filter(
      (p) => p.pctOverall >= min && p.pctOverall <= max && isAvail(p)
    );

    if (pool.length < 3) {
      const mid = (min + max) / 2;
      pool = available
        .filter((p) => isAvail(p))
        .sort((a, b) => Math.abs(a.pctOverall - mid) - Math.abs(b.pctOverall - mid));
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const picked: Player[] = [];
    const pickedNames = new Set<string>();
    for (const p of shuffled) {
      if (picked.length === 3) break;
      const n = normName(p);
      if (!pickedNames.has(n)) { picked.push(p); pickedNames.add(n); }
    }
    picked.forEach((p) => { usedInCPU.add(p.playerId); usedNamesInCPU.add(normName(p)); });

    teams.push({
      id: `cpu-${i + 1}`,
      name: namePool[i] ?? `TEAM ${i + 1}`,
      difficulty,
      roster: SLOT_LABELS.map((label, idx) => ({
        label,
        player: picked[idx] ?? null,
      })),
    });
  }

  return teams;
}

type CategoryTier = "weak" | "solid" | "elite" | "legendary";

function categoryTier(avg: number): CategoryTier {
  if (avg >= 85) return "legendary";
  if (avg >= 70) return "elite";
  if (avg >= 50) return "solid";
  return "weak";
}

interface TeamCategories {
  sco: number; sht: number; ply: number; reb: number; def: number;
}

function teamCategories(players: Player[]): TeamCategories {
  if (players.length === 0) return { sco: 50, sht: 50, ply: 50, reb: 50, def: 50 };
  const avg = (vals: number[]) => vals.reduce((s, v) => s + v, 0) / vals.length;
  return {
    sco: avg(players.map((p) => p.pctScoring)),
    sht: avg(players.map((p) => p.pctShooting)),
    ply: avg(players.map((p) => p.pctPlaymaking)),
    reb: avg(players.map((p) => p.pctRebounding)),
    def: avg(players.map((p) => p.pctDefense)),
  };
}

function computeBuffs(yours: TeamCategories, cpu: TeamCategories): Buff[] {
  const buffs: Buff[] = [];

  const ySco = categoryTier(yours.sco);
  if      (ySco === "legendary") buffs.push({ name: "HOT HAND",       label: "SCO · LEGENDARY", delta:  5, side: "yours" });
  else if (ySco === "elite")     buffs.push({ name: "HEAT CHECK",     label: "SCO · ELITE",     delta:  3, side: "yours" });

  const ySht = categoryTier(yours.sht);
  if      (ySht === "legendary") buffs.push({ name: "SPLASH ZONE",    label: "SHT · LEGENDARY", delta:  5, side: "yours" });
  else if (ySht === "elite")     buffs.push({ name: "SHARPSHOOTER",   label: "SHT · ELITE",     delta:  3, side: "yours" });

  const yPly = categoryTier(yours.ply);
  if      (yPly === "legendary") buffs.push({ name: "SHOWTIME",       label: "PLY · LEGENDARY", delta:  5, side: "yours" });
  else if (yPly === "elite")     buffs.push({ name: "MAESTRO",        label: "PLY · ELITE",     delta:  3, side: "yours" });

  const yReb = categoryTier(yours.reb);
  if      (yReb === "legendary") buffs.push({ name: "GLASS KING",     label: "REB · LEGENDARY", delta:  5, side: "yours" });
  else if (yReb === "elite")     buffs.push({ name: "GLASS CLEANER",  label: "REB · ELITE",     delta:  3, side: "yours" });

  const yDef = categoryTier(yours.def);
  if      (yDef === "legendary") buffs.push({ name: "FORTRESS",       label: "DEF · LEGENDARY", delta:  5, side: "yours" });
  else if (yDef === "elite")     buffs.push({ name: "LOCKDOWN",       label: "DEF · ELITE",     delta:  3, side: "yours" });

  const cSco = categoryTier(cpu.sco);
  if      (cSco === "legendary") buffs.push({ name: "UNSTOPPABLE",    label: "SCO · LEGENDARY", delta: -5, side: "cpu" });
  else if (cSco === "elite")     buffs.push({ name: "BUCKET GETTERS", label: "SCO · ELITE",     delta: -3, side: "cpu" });

  const cSht = categoryTier(cpu.sht);
  if      (cSht === "legendary") buffs.push({ name: "SHOOTING STARS", label: "SHT · LEGENDARY", delta: -5, side: "cpu" });
  else if (cSht === "elite")     buffs.push({ name: "ON FIRE",        label: "SHT · ELITE",     delta: -3, side: "cpu" });

  const cDef = categoryTier(cpu.def);
  if      (cDef === "legendary") buffs.push({ name: "STEEL WALL",     label: "DEF · LEGENDARY", delta: -5, side: "cpu" });
  else if (cDef === "elite")     buffs.push({ name: "IRON CURTAIN",   label: "DEF · ELITE",     delta: -3, side: "cpu" });

  const cPly = categoryTier(cpu.ply);
  if      (cPly === "legendary") buffs.push({ name: "CONDUCTOR",      label: "PLY · LEGENDARY", delta: -5, side: "cpu" });
  else if (cPly === "elite")     buffs.push({ name: "SLICK MOVERS",   label: "PLY · ELITE",     delta: -3, side: "cpu" });

  return buffs;
}

function playerRole(positions: string[]): "guard" | "wing" | "big" | "hybrid" {
  if (!positions || positions.length === 0) return "hybrid";
  const isG = (positions.includes("PG") && positions.includes("SG")) ||
              (positions.length === 1 && (positions[0] === "PG" || positions[0] === "SG"));
  const isW = (positions.includes("SG") && positions.includes("SF")) ||
              (positions.length === 1 && positions[0] === "SF");
  const isB = (positions.includes("PF") && positions.includes("C")) ||
              (positions.length === 1 && (positions[0] === "PF" || positions[0] === "C"));
  const isH = positions.length > 2 || (isG && isW) || (isG && isB) || (isW && isB);
  if (isH)      return "hybrid";
  if (isG)      return "guard";
  if (isW)      return "wing";
  if (isB)      return "big";
  return "hybrid";
}

function isBalancedLineup(players: Player[]): boolean {
  let guards = 0, wings = 0, bigs = 0, hybrids = 0;
  for (const p of players) {
    const role = playerRole(p.positions as string[]);
    if (role === "guard")  guards++;
    else if (role === "wing")   wings++;
    else if (role === "big")    bigs++;
    else                        hybrids++;
  }
  const uncovered = (guards === 0 ? 1 : 0) + (wings === 0 ? 1 : 0) + (bigs === 0 ? 1 : 0);
  return uncovered <= hybrids;
}

function teamStrength(players: Player[]): number {
  if (players.length === 0) return 50;
  const avg = (vals: number[]) => vals.reduce((s, v) => s + v, 0) / vals.length;
  return avg(players.map((p) => p.offenseRating)) * 0.55
       + avg(players.map((p) => p.defenseRating)) * 0.45;
}

const MAX_DIFF = 20;

export function simulateMatch(
  yourRoster: RosterSlot[],
  cpuRoster: RosterSlot[]
): MatchResult {
  const yours = yourRoster.map((s) => s.player).filter(Boolean) as Player[];
  const cpus  = cpuRoster.map((s) => s.player).filter(Boolean) as Player[];

  const yourStr = teamStrength(yours);
  const cpuStr  = teamStrength(cpus);
  const rawDiff = yourStr - cpuStr;

  const buffs = computeBuffs(teamCategories(yours), teamCategories(cpus));

  if (isBalancedLineup(yours)) {
    buffs.unshift({ name: "CHEMISTRY", label: "LINEUP · BALANCED", delta: 3, side: "yours" });
  }

  const netDelta = buffs.reduce((s, b) => s + b.delta, 0);

  const adjustedDiff = rawDiff + netDelta;

  const win = adjustedDiff >= 0;
  const magnitude = Math.abs(adjustedDiff);

  const loserScore = Math.max(0, Math.round(20 * (1 - magnitude / MAX_DIFF)));

  if (win) {
    return { yourScore: 21, cpuScore: loserScore, win: true, buffs };
  } else {
    return { yourScore: loserScore, cpuScore: 21, win: false, buffs };
  }
}

export function buildScoreSequence(
  yourScore: number,
  cpuScore: number,
  seed: number
): ("y" | "c")[] {
  const winner: "y" | "c" = yourScore === 21 ? "y" : "c";
  const loser:  "y" | "c" = winner === "y" ? "c" : "y";
  const loserCount = winner === "y" ? cpuScore : yourScore;

  const body: ("y" | "c")[] = [
    ...Array<"y" | "c">(20).fill(winner),
    ...Array<"y" | "c">(loserCount).fill(loser),
  ];

  let s = seed >>> 0;
  for (let i = body.length - 1; i > 0; i--) {
    s = Math.imul(s, 1664525) + 1013904223;
    s = s >>> 0;
    const j = s % (i + 1);
    [body[i], body[j]] = [body[j], body[i]];
  }

  body.push(winner);
  return body;
}

export const ROUND_NAMES = ["QUARTERFINAL", "SEMIFINAL", "FINAL"] as const;

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy:   "ROOKIE",
  medium: "ALL-STAR",
  hard:   "HALL-OF-FAME",
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  easy:   "#00D4FF",
  medium: "#FFB800",
  hard:   "#FF2D78",
};
