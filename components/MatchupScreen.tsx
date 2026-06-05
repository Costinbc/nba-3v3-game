"use client";

import { useEffect, useRef, useState } from "react";
import { RosterSlot, CPUTeam, MatchResult, Buff } from "@/types";
import { buildScoreSequence, DIFFICULTY_COLORS } from "@/lib/tournamentEngine";
import { getDisplayName, getShortName } from "@/lib/playerUtils";

type MatchPhase = "tipoff" | "playing" | "result";

interface MatchupScreenProps {
  yourRoster: RosterSlot[];
  cpuTeam: CPUTeam;
  matchResult: MatchResult;
  roundName: string;
  tournamentRound: number;
  onContinue: () => void;
}

const BUFF_DESC: Record<string, string> = {
  "CHEMISTRY":      "slight boost from a balanced lineup",
  "HOT HAND":       "big boost to your scoring",
  "HEAT CHECK":     "slight boost to your scoring",
  "SPLASH ZONE":    "big boost to your shooting",
  "SHARPSHOOTER":   "slight boost to your shooting",
  "SHOWTIME":       "big boost to your playmaking",
  "MAESTRO":        "slight edge in playmaking",
  "GLASS KING":     "big boost to your rebounding",
  "GLASS CLEANER":  "slight edge on the boards",
  "FORTRESS":       "big boost to your defense",
  "LOCKDOWN":       "slight defensive edge",
  "UNSTOPPABLE":    "big scoring boost for them",
  "BUCKET GETTERS": "slight scoring edge for them",
  "SHOOTING STARS": "big shooting boost for them",
  "ON FIRE":        "slight shooting edge for them",
  "STEEL WALL":     "big defensive boost for them",
  "IRON CURTAIN":   "slight defensive edge for them",
  "CONDUCTOR":      "big playmaking boost for them",
  "SLICK MOVERS":   "slight playmaking edge for them",
};

function BuffsPanel({ buffs }: { buffs: Buff[] }) {
  const yours = buffs.filter((b) => b.side === "yours");
  const cpu   = buffs.filter((b) => b.side === "cpu");
  if (yours.length === 0 && cpu.length === 0) return null;
  return (
    <div className="w-full border border-[#ffffff0a] bg-[#08080e] px-4 py-3 flex flex-col gap-2">
      {yours.length > 0 && (
        <div className="font-pixel text-[7px] text-[#39FF1450] tracking-widest">YOUR EDGE</div>
      )}
      {yours.map((b) => (
        <div key={b.name} className="flex items-center justify-between gap-3">
          <span className="font-pixel text-[9px] whitespace-nowrap shrink-0" style={{ color: "#39FF14" }}>
            ★ {b.name}
          </span>
          <span className="font-pixel text-[7px] text-[#39FF1460] text-right">
            {BUFF_DESC[b.name] ?? b.label}
          </span>
        </div>
      ))}

      {yours.length > 0 && cpu.length > 0 && (
        <div className="border-t border-[#ffffff0a] my-0.5" />
      )}

      {cpu.length > 0 && (
        <div className="font-pixel text-[7px] text-[#FF2D7850] tracking-widest">THEIR EDGE</div>
      )}
      {cpu.map((b) => (
        <div key={b.name} className="flex items-center justify-between gap-3">
          <span className="font-pixel text-[9px] whitespace-nowrap shrink-0" style={{ color: "#FF2D78" }}>
            ⚡ {b.name}
          </span>
          <span className="font-pixel text-[7px] text-[#FF2D7860] text-right">
            {BUFF_DESC[b.name] ?? b.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function PlayerPill({ name, team, era, color }: { name: string; team: string; era: string; color: string }) {

  const short = getShortName(name);
  const label = short.length > 10 ? short.slice(0, 9) + "." : short;
  return (
    <div
      className="border px-3 md:px-4 py-1.5 md:py-2 w-full"
      style={{ borderColor: color + "44", backgroundColor: color + "0a" }}
    >
      <div className="font-pixel text-[8px] md:text-[10px] tracking-wide" style={{ color: color + "cc" }}>
        {label}
      </div>
      <div className="font-pixel text-[7px] mt-0.5" style={{ color: color + "55" }}>
        {team}  {era}
      </div>
    </div>
  );
}

export default function MatchupScreen({
  yourRoster,
  cpuTeam,
  matchResult,
  roundName,
  tournamentRound,
  onContinue,
}: MatchupScreenProps) {
  const [matchPhase, setMatchPhase] = useState<MatchPhase>("tipoff");
  const advanceToPlaying = () => setMatchPhase((p) => p === "tipoff" ? "playing" : p);
  const [yourScore, setYourScore]   = useState(0);
  const [cpuScore, setCpuScore]     = useState(0);
  const [seqIdx, setSeqIdx]         = useState(0);
  const seqRef = useRef<("y" | "c")[]>([]);

  const yourPlayers = yourRoster.map((s) => s.player).filter(Boolean) as NonNullable<RosterSlot["player"]>[];
  const cpuPlayers  = cpuTeam.roster.map((s) => s.player).filter(Boolean) as NonNullable<RosterSlot["player"]>[];
  const diffColor   = DIFFICULTY_COLORS[cpuTeam.difficulty];

  useEffect(() => {
    seqRef.current = buildScoreSequence(
      matchResult.yourScore,
      matchResult.cpuScore,
      tournamentRound * 9973
    );
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMatchPhase("playing"), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (matchPhase !== "playing") return;
    const seq = seqRef.current;
    if (seqIdx >= seq.length) {
      const t = setTimeout(() => setMatchPhase("result"), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (seq[seqIdx] === "y") setYourScore((s) => s + 1);
      else setCpuScore((s) => s + 1);
      setSeqIdx((i) => i + 1);
    }, 75);
    return () => clearTimeout(t);
  }, [matchPhase, seqIdx]);

  return (
    <div className="fixed inset-0 z-[200] bg-[#020205] flex items-center justify-center">
      {}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)"
      }} />

      {}
      <div className="w-full max-w-sm md:max-w-lg px-5 py-4 flex flex-col items-center gap-4 md:gap-8 relative z-20">

        {}
        <div className="text-center">
          <span className="font-pixel text-[11px] md:text-[14px] text-[#ffffff44] tracking-widest">
            {roundName}
          </span>
        </div>

          {}
          {matchPhase === "tipoff" && (
            <div className="w-full flex flex-col gap-10 md:gap-14 slide-up cursor-pointer" onClick={advanceToPlaying}>
              <div className="flex items-start justify-between gap-4 md:gap-8">

                {}
                <div className="flex-1 min-w-0 text-right">
                  <div className="font-pixel text-[8px] md:text-[11px] text-[#39FF14] tracking-wide mb-4 md:mb-6 neon-green leading-tight">
                    YOUR SQUAD
                  </div>
                  <div className="flex flex-col items-end gap-2.5 md:gap-4">
                    {yourPlayers.map((p) => (
                      <PlayerPill key={p.id} name={p.name} team={p.team} era={p.era} color="#39FF14" />
                    ))}
                  </div>
                </div>

                {}
                <div
                  className="font-pixel text-5xl md:text-7xl shrink-0 leading-none flicker"
                  style={{ color: "#FFB800", textShadow: "0 0 24px #FFB800, 0 0 50px #FFB80088" }}
                >
                  VS
                </div>

                {}
                <div className="flex-1 min-w-0">
                  <div
                    className="font-pixel text-[8px] md:text-[11px] tracking-wide mb-4 md:mb-6 leading-tight"
                    style={{ color: diffColor, textShadow: `0 0 10px ${diffColor}` }}
                  >
                    {cpuTeam.name}
                  </div>
                  <div className="flex flex-col gap-2.5 md:gap-4">
                    {cpuPlayers.map((p) => (
                      <PlayerPill key={p.id} name={p.name} team={p.team} era={p.era} color={diffColor} />
                    ))}
                  </div>
                </div>
              </div>

              {}
              {matchResult.buffs.length > 0 && (
                <BuffsPanel buffs={matchResult.buffs} />
              )}

              <div className="text-center flex flex-col items-center gap-3">
                <span className="font-pixel text-[13px] md:text-[16px] text-[#39FF14] blink tracking-widest neon-green">
                  TIPOFF!
                </span>
                <span className="font-pixel text-[8px] text-[#ffffff22] tracking-widest">
                  TAP TO START
                </span>
              </div>
            </div>
          )}

          {}
          {matchPhase === "playing" && (
            <div className="w-full flex flex-col items-center gap-5 md:gap-8">
              <div
                className="border-2 border-[#ffffff15] bg-[#08080e] px-6 py-8 md:px-10 md:py-12 relative w-full"
                style={{ boxShadow: "0 0 40px #00000080" }}
              >
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FFB80040]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FFB80040]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FFB80040]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FFB80040]" />

                <div className="flex items-center justify-between gap-4 md:gap-6">
                  <div className="flex-1 min-w-0 text-right">
                    <div className="font-pixel text-[10px] md:text-[13px] text-[#39FF1488] tracking-wider mb-3 md:mb-5">YOU</div>
                    <div
                      className="font-pixel leading-none"
                      style={{
                        fontSize: "clamp(3rem, 15vw, 4.5rem)",
                        color: "#39FF14",
                        textShadow: "0 0 24px #39FF14, 0 0 50px #39FF1466",
                      }}
                    >
                      {yourScore}
                    </div>
                  </div>

                  <div className="font-pixel text-2xl md:text-3xl text-[#ffffff22] shrink-0">-</div>

                  <div className="flex-1 min-w-0">
                    <div
                      className="font-pixel text-[10px] md:text-[13px] tracking-wider mb-3 md:mb-5 truncate"
                      style={{ color: diffColor + "88" }}
                    >
                      {cpuTeam.name.split(" ")[0]}
                    </div>
                    <div
                      className="font-pixel leading-none"
                      style={{
                        fontSize: "clamp(3rem, 15vw, 4.5rem)",
                        color: diffColor,
                        textShadow: `0 0 24px ${diffColor}, 0 0 50px ${diffColor}66`,
                      }}
                    >
                      {cpuScore}
                    </div>
                  </div>
                </div>
              </div>

              <div className="font-pixel text-[10px] md:text-[13px] text-[#ffffff33] blink tracking-widest">
                GAME TO 21
              </div>
            </div>
          )}

          {}
          {matchPhase === "result" && (
            <div className="w-full flex flex-col items-center gap-5 md:gap-8 slide-up">

              <div
                className="font-pixel tracking-widest text-center"
                style={{
                  fontSize: "clamp(1.6rem, 9vw, 4rem)",
                  color: matchResult.win ? "#39FF14" : "#FF2D78",
                  textShadow: matchResult.win
                    ? "0 0 24px #39FF14, 0 0 60px #39FF1488"
                    : "0 0 24px #FF2D78, 0 0 60px #FF2D7888",
                }}
              >
                {matchResult.win ? "VICTORY!" : "DEFEATED"}
              </div>

              <div
                className="font-pixel leading-none text-center whitespace-nowrap"
                style={{ fontSize: "clamp(2.5rem, 13vw, 6rem)" }}
              >
                <span
                  style={{
                    color: matchResult.win ? "#39FF14" : "#FF2D78",
                    textShadow: `0 0 20px ${matchResult.win ? "#39FF14" : "#FF2D78"}`,
                  }}
                >
                  {matchResult.yourScore}
                </span>
                <span className="text-[#ffffff33] mx-3 md:mx-6" style={{ fontSize: "clamp(1.5rem, 7vw, 3.5rem)" }}>
                  –
                </span>
                <span
                  style={{
                    color: matchResult.win ? "#FF2D78" : "#39FF14",
                    textShadow: `0 0 20px ${matchResult.win ? "#FF2D78" : "#39FF14"}`,
                  }}
                >
                  {matchResult.cpuScore}
                </span>
              </div>

              <div className="font-pixel text-[11px] md:text-[14px] text-[#ffffff44] tracking-wider">
                vs {cpuTeam.name}
              </div>

              {!matchResult.win && (
                <div className="font-pixel text-[13px] md:text-[16px] text-[#FF2D78] blink tracking-widest neon-pink">
                  ✕ GAME OVER ✕
                </div>
              )}
              {matchResult.win && (
                <div className="font-pixel text-[10px] md:text-[13px] text-[#39FF1488] tracking-wider text-center">
                  {tournamentRound < 3 ? "ADVANCING TO NEXT ROUND..." : "TOURNAMENT CHAMPION!"}
                </div>
              )}

              <button
                onClick={onContinue}
                className="arcade-btn w-full font-pixel text-[13px] md:text-[15px] py-5 md:py-6 border-2 tracking-widest mt-2"
                style={{
                  borderColor:     matchResult.win ? "#39FF14" : "#FF2D78",
                  color:           matchResult.win ? "#39FF14" : "#FF2D78",
                  backgroundColor: matchResult.win ? "#39FF1408" : "#FF2D7808",
                  boxShadow: `0 0 22px ${matchResult.win ? "#39FF1450" : "#FF2D7850"}`,
                }}
              >
                {matchResult.win
                  ? tournamentRound < 3 ? "CONTINUE" : "FINAL RESULTS"
                  : "SEE RESULTS"}
              </button>
            </div>
          )}

      </div>
    </div>
  );
}
