"use client";

import { RosterSlot } from "@/types";
import { getTeamColor } from "@/lib/teamColors";
import { getPositionArchetype } from "@/lib/playerUtils";
import { useState, useEffect } from "react";

interface SimulationResultProps {
  wins: number;
  roster: RosterSlot[];
  onPlayAgain: () => void;
}

function getGrade(wins: number): { letter: string; color: string; label: string } {
  if (wins === 82) return { letter: "S+", color: "#FFD700", label: "LEGENDARY" };
  if (wins >= 75) return { letter: "S",  color: "#FFD700", label: "ELITE" };
  if (wins >= 67) return { letter: "A+", color: "#39FF14", label: "DOMINANT" };
  if (wins >= 60) return { letter: "A",  color: "#39FF14", label: "GREAT" };
  if (wins >= 53) return { letter: "B+", color: "#00D4FF", label: "SOLID" };
  if (wins >= 46) return { letter: "B",  color: "#00D4FF", label: "DECENT" };
  if (wins >= 38) return { letter: "C+", color: "#FFB800", label: "AVERAGE" };
  if (wins >= 30) return { letter: "C",  color: "#FFB800", label: "BELOW AVG" };
  if (wins >= 22) return { letter: "D",  color: "#FF2D78", label: "WEAK" };
  return { letter: "F", color: "#FF2D78", label: "GAME OVER" };
}

const SLOT_FULL: Record<string, string> = { G: "1ST", W: "2ND", B: "3RD" };

export default function SimulationResult({ wins, roster, onPlayAgain }: SimulationResultProps) {
  const [displayWins, setDisplayWins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gradeVisible, setGradeVisible] = useState(false);
  const losses = 82 - wins;
  const isPerfect = wins === 82;
  const grade = getGrade(wins);
  const doneAnimating = displayWins >= wins;

  useEffect(() => {
    const delay = setTimeout(() => setShowResult(true), 2000);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!showResult || displayWins >= wins) return;
    const speed = wins > 60 ? 20 : wins > 40 ? 25 : 35;
    const timer = setTimeout(() => setDisplayWins((prev) => Math.min(prev + 1, wins)), speed);
    return () => clearTimeout(timer);
  }, [showResult, displayWins, wins]);

  useEffect(() => {
    if (doneAnimating && showResult) {
      const t = setTimeout(() => setGradeVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, [doneAnimating, showResult]);

  const players = roster.map((s) => s.player).filter(Boolean) as NonNullable<typeof roster[0]["player"]>[];
  const teamOff = players.length ? players.reduce((s, p) => s + p.offenseRating, 0) / players.length : 0;
  const teamDef = players.length ? players.reduce((s, p) => s + p.defenseRating, 0) / players.length : 0;

  return (
    <div className="scanlines fixed inset-0 z-50 bg-[#020205] flex flex-col items-center justify-center p-4 overflow-y-auto">
      {!showResult ? (
        <div className="text-center">
          <div className="font-pixel text-[10px] text-[#39FF14] mb-6 neon-green blink tracking-widest">
            SIMULATING...
          </div>
          <div className="flex gap-1 justify-center">
            {[0,1,2].map(i => (
              <div
                key={i}
                className="w-2 h-2 bg-[#39FF14]"
                style={{
                  animation: `blink 0.8s step-end ${i * 0.25}s infinite`,
                  boxShadow: "0 0 6px #39FF14",
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center w-full max-w-sm slide-up">

          {}
          <div className="font-pixel text-[9px] text-[#ffffff44] tracking-widest mb-3">
            SEASON RECORD
          </div>

          <div
            className={`font-pixel text-5xl mb-1 leading-none ${isPerfect ? "neon-amber flicker" : "text-white"}`}
            style={isPerfect ? {} : { textShadow: "0 0 20px #ffffff30" }}
          >
            {displayWins}
            <span className="text-[#ffffff33] mx-2 text-3xl">-</span>
            {doneAnimating ? losses : <span className="text-[#ffffff22]">??</span>}
          </div>

          {isPerfect && doneAnimating && (
            <div className="font-pixel text-sm neon-green blink mt-2 tracking-wider">
              ★ 82-0 PERFECT ★
            </div>
          )}

          {}
          {gradeVisible && (
            <div className="mt-5 mb-6 slide-up">
              <div
                className="font-pixel text-6xl leading-none"
                style={{
                  color: grade.color,
                  textShadow: `0 0 20px ${grade.color}, 0 0 40px ${grade.color}66`,
                }}
              >
                {grade.letter}
              </div>
              <div className="font-pixel text-[9px] mt-2 tracking-widest" style={{ color: grade.color + "aa" }}>
                {grade.label}
              </div>
            </div>
          )}

          {}
          {players.length > 0 && (
            <div className="mb-4 border border-[#ffffff12] bg-[#0a0a10] p-3 relative">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#39FF1440]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#39FF1440]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#39FF1440]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#39FF1440]" />

              <div className="font-pixel text-[8px] text-[#ffffff33] tracking-widest mb-3">TEAM RATINGS</div>
              <div className="flex gap-4">
                {[
                  { label: "OFFENSE", val: teamOff, color: "#FF2D78" },
                  { label: "DEFENSE", val: teamDef, color: "#00D4FF" },
                ].map(({ label, val, color }) => (
                  <div key={label} className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-pixel text-[7px]" style={{ color }}>{label}</span>
                      <span className="font-pixel text-[7px] text-white">{val.toFixed(0)}</span>
                    </div>
                    <div className="h-1.5 bg-[#1a1a1a] relative overflow-hidden">
                      <div
                        className="h-full absolute left-0 top-0 transition-all duration-700"
                        style={{ width: `${Math.min(val, 100)}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          <div className="space-y-2 mb-6">
            {roster.map((slot) => {
              const p = slot.player;
              const tc = p ? getTeamColor(p.team) : "#39FF1444";
              return (
                <div
                  key={slot.label}
                  className="px-3 py-2 border text-left relative"
                  style={{ borderColor: tc + "50", backgroundColor: tc + "0a" }}
                >
                  <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l" style={{ borderColor: tc + "88" }} />
                  <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r" style={{ borderColor: tc + "88" }} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-pixel text-[8px]" style={{ color: tc }}>
                        {p ? (getPositionArchetype(p.positions) || SLOT_FULL[slot.label]) : SLOT_FULL[slot.label]}
                      </span>
                      <span className="text-sm font-semibold text-white">{p?.name ?? "—"}</span>
                    </div>
                    {p && (
                      <span className="font-pixel text-[7px]" style={{ color: tc + "aa" }}>
                        {p.team} {p.era}
                      </span>
                    )}
                  </div>
                  {p && (
                    <div className="flex gap-3 mt-1 text-xs text-[#ffffff55]">
                      {[
                        { l: "PTS", v: p.pts }, { l: "REB", v: p.reb }, { l: "AST", v: p.ast },
                        { l: "STL", v: p.stl }, { l: "BLK", v: p.blk },
                      ].map(({ l, v }) => (
                        <span key={l}>
                          <span className="font-pixel text-[6px] text-[#ffffff33] mr-0.5">{l}</span>
                          {v.toFixed(1)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {}
          <button
            onClick={onPlayAgain}
            className="arcade-btn font-pixel text-[10px] px-8 py-3 border-2 border-[#39FF14] text-[#39FF14] bg-[#39FF1408] tracking-widest"
            style={{ boxShadow: "0 0 16px #39FF1450" }}
          >
            ↺ PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
