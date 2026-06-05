import { Draw, Era } from "@/types";

const TEAMS: { abbr: string; full: string }[] = [
  { abbr: "ATL", full: "Atlanta Hawks" },
  { abbr: "BOS", full: "Boston Celtics" },
  { abbr: "BKN", full: "Brooklyn Nets" },
  { abbr: "CHA", full: "Charlotte Hornets" },
  { abbr: "CHI", full: "Chicago Bulls" },
  { abbr: "CLE", full: "Cleveland Cavaliers" },
  { abbr: "DAL", full: "Dallas Mavericks" },
  { abbr: "DEN", full: "Denver Nuggets" },
  { abbr: "DET", full: "Detroit Pistons" },
  { abbr: "GSW", full: "Golden State Warriors" },
  { abbr: "HOU", full: "Houston Rockets" },
  { abbr: "IND", full: "Indiana Pacers" },
  { abbr: "LAC", full: "Los Angeles Clippers" },
  { abbr: "LAL", full: "Los Angeles Lakers" },
  { abbr: "MEM", full: "Memphis Grizzlies" },
  { abbr: "MIA", full: "Miami Heat" },
  { abbr: "MIL", full: "Milwaukee Bucks" },
  { abbr: "MIN", full: "Minnesota Timberwolves" },
  { abbr: "NOP", full: "New Orleans Pelicans" },
  { abbr: "NYK", full: "New York Knicks" },
  { abbr: "OKC", full: "Oklahoma City Thunder" },
  { abbr: "ORL", full: "Orlando Magic" },
  { abbr: "PHI", full: "Philadelphia 76ers" },
  { abbr: "PHX", full: "Phoenix Suns" },
  { abbr: "POR", full: "Portland Trail Blazers" },
  { abbr: "SAC", full: "Sacramento Kings" },
  { abbr: "SAS", full: "San Antonio Spurs" },
  { abbr: "TOR", full: "Toronto Raptors" },
  { abbr: "UTA", full: "Utah Jazz" },
  { abbr: "WAS", full: "Washington Wizards" },
];

const ERAS: Era[] = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

const TEAM_ERAS: Record<string, Era[]> = {
  ATL: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  BKN: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  BOS: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  CHA: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  CHI: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  CLE: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  DAL: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  DEN: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  DET: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  GSW: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  HOU: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  IND: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  LAC: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  LAL: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  MEM: ["1990s", "2000s", "2010s", "2020s"],
  MIA: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  MIL: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  MIN: ["1990s", "2000s", "2010s", "2020s"],
  NOP: ["2000s", "2010s", "2020s"],
  NYK: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  OKC: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  ORL: ["1990s", "2000s", "2010s", "2020s"],
  PHI: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  PHX: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  POR: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  SAC: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  SAS: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  TOR: ["1990s", "2000s", "2010s", "2020s"],
  UTA: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  WAS: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
};

const ERA_TEAMS: Record<Era, { abbr: string; full: string }[]> = {} as Record<Era, { abbr: string; full: string }[]>;
for (const era of ERAS) {
  ERA_TEAMS[era] = TEAMS.filter((t) => TEAM_ERAS[t.abbr]?.includes(era));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickDifferent<T>(arr: T[], current: T): T {
  if (arr.length === 1) return arr[0];
  let next = pick(arr);
  while (next === current) next = pick(arr);
  return next;
}

export function randomDraw(): Draw {
  const era = pick(ERAS);
  const team = pick(ERA_TEAMS[era]);
  return { team: team.abbr, teamFull: team.full, era };
}

export function reSpinTeam(currentDraw: Draw): Draw {
  const pool = ERA_TEAMS[currentDraw.era];
  const team = pickDifferent(pool, pool.find((t) => t.abbr === currentDraw.team)!);
  return { team: team.abbr, teamFull: team.full, era: currentDraw.era };
}

export function reSpinEra(currentDraw: Draw): Draw {
  const pool = TEAM_ERAS[currentDraw.team] ?? ERAS;
  const era = pickDifferent(pool, currentDraw.era);
  return { ...currentDraw, era };
}

export { TEAMS, ERAS };
