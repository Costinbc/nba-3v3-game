export type Era = "1960s" | "1970s" | "1980s" | "1990s" | "2000s" | "2010s" | "2020s";

export type OriginalPosition = "PG" | "SG" | "SF" | "PF" | "C";

export type SlotLabel = "G" | "W" | "B";

export type SortStat = "pts" | "reb" | "ast" | "stl" | "blk" | "composite";

export type GameMode = "classic" | "hidden";

export type GamePhase =
  | "draft-pool"
  | "swap"
  | "complete"
  | "bracket"
  | "matchup"
  | "tourney-over"
  | "champion";

export interface Player {
  id: string;
  playerId: string;
  slug: string;
  name: string;
  team: string;
  teamFull: string;
  era: Era;
  seasonsWithTeam: string;
  gamesPlayed: number;
  positions: OriginalPosition[];
  composite: number;
  bpm: number;
  wsPer48: number;
  obpm: number;
  dbpm: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tpm: number;
  tsPct: number | null;
  fgPct: number | null;
  fg3Pct: number | null;
  ftPct: number | null;
  efgPct: number | null;
  defWS: number;
  stlPct: number;
  blkPct: number;
  drebPct: number;
  notes: string;
  pctScoring: number;
  pctShooting: number;
  pctPlaymaking: number;
  pctRebounding: number;
  pctDefense: number;
  offenseRating: number;
  defenseRating: number;
  pctOverall: number;
}

export interface RosterSlot {
  label: SlotLabel;
  player: Player | null;
}

export interface Draw {
  team: string;
  teamFull: string;
  era: Era;
}

export type CPUDifficulty = "easy" | "medium" | "hard";

export interface CPUTeam {
  id: string;
  name: string;
  difficulty: CPUDifficulty;
  roster: RosterSlot[];
}

export interface RoundResult {
  round: number;
  roundName: string;
  cpuTeam: CPUTeam;
  yourScore: number;
  cpuScore: number;
  win: boolean;
}

export interface Buff {
  name: string;
  label: string;
  delta: number;
  side: "yours" | "cpu";
}

export interface MatchResult {
  yourScore: number;
  cpuScore: number;
  win: boolean;
  buffs: Buff[];
}

export interface GameState {
  phase: GamePhase;
  mode: GameMode;
  roster: RosterSlot[];
  pickedPlayerIds: string[];
  projectedWins: number | null;
  pack: Player[];
  packRevealIndex: number;
  cpuTeams: CPUTeam[];
  tournamentRound: number;
  roundResults: RoundResult[];
  currentMatchResult: MatchResult | null;
}
