export const TEAM_COLORS: Record<string, { primary: string; dark: string }> = {
  ATL: { primary: "#E03A3E", dark: "#E03A3E20" },
  BOS: { primary: "#00A94F", dark: "#00A94F20" },
  BKN: { primary: "#B0B0B0", dark: "#B0B0B015" },
  CHA: { primary: "#00788C", dark: "#00788C20" },
  CHI: { primary: "#CE1141", dark: "#CE114120" },
  CLE: { primary: "#BB2135", dark: "#BB213520" },
  DAL: { primary: "#00689E", dark: "#00689E20" },
  DEN: { primary: "#FEC524", dark: "#FEC52418" },
  DET: { primary: "#C8102E", dark: "#C8102E20" },
  GSW: { primary: "#FFC72C", dark: "#FFC72C18" },
  HOU: { primary: "#CE1141", dark: "#CE114120" },
  IND: { primary: "#FDBB30", dark: "#FDBB3018" },
  LAC: { primary: "#ED174C", dark: "#ED174C20" },
  LAL: { primary: "#FDB927", dark: "#FDB92718" },
  MEM: { primary: "#6189B2", dark: "#6189B220" },
  MIA: { primary: "#F9423A", dark: "#F9423A20" },
  MIL: { primary: "#00843D", dark: "#00843D20" },
  MIN: { primary: "#3C8DB5", dark: "#3C8DB520" },
  NOP: { primary: "#E3183E", dark: "#E3183E20" },
  NYK: { primary: "#F58426", dark: "#F5842620" },
  OKC: { primary: "#0096D6", dark: "#0096D620" },
  ORL: { primary: "#0096D6", dark: "#0096D620" },
  PHI: { primary: "#ED174C", dark: "#ED174C20" },
  PHX: { primary: "#E56020", dark: "#E5602020" },
  POR: { primary: "#E03A3E", dark: "#E03A3E20" },
  SAC: { primary: "#7B4BBD", dark: "#7B4BBD20" },
  SAS: { primary: "#B0B0B0", dark: "#B0B0B015" },
  TOR: { primary: "#CE1141", dark: "#CE114120" },
  UTA: { primary: "#F9A01B", dark: "#F9A01B18" },
  WAS: { primary: "#E3183E", dark: "#E3183E20" },
};

export const ERA_COLORS: Record<string, { primary: string; dark: string }> = {
  "1960s": { primary: "#D4A854", dark: "#D4A85418" },
  "1970s": { primary: "#E88B45", dark: "#E88B4518" },
  "1980s": { primary: "#E84B8A", dark: "#E84B8A18" },
  "1990s": { primary: "#3CC8B4", dark: "#3CC8B418" },
  "2000s": { primary: "#7B9EC4", dark: "#7B9EC418" },
  "2010s": { primary: "#4A9EF5", dark: "#4A9EF518" },
  "2020s": { primary: "#7BDB5E", dark: "#7BDB5E18" },
};

export function getTeamColor(team: string): string {
  return TEAM_COLORS[team]?.primary ?? "#f97316";
}

export function getTeamDark(team: string): string {
  return TEAM_COLORS[team]?.dark ?? "#f9731622";
}

export function getEraColor(era: string): string {
  return ERA_COLORS[era]?.primary ?? "#a1a1aa";
}

export function getEraDark(era: string): string {
  return ERA_COLORS[era]?.dark ?? "#a1a1aa18";
}
