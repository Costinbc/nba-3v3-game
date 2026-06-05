"use client";

import { CPUTeam, RoundResult, RosterSlot } from "@/types";
import {
  ROUND_NAMES,
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
} from "@/lib/tournamentEngine";
import { getDisplayName } from "@/lib/playerUtils";

interface BracketScreenProps {
  yourRoster: RosterSlot[];
  cpuTeams: CPUTeam[];
  currentRound: number;
  roundResults: RoundResult[];
  onPlayRound: () => void;
}

export default function BracketScreen({
  yourRoster,
  cpuTeams,
  currentRound,
  roundResults,
  onPlayRound,
}: BracketScreenProps) {
  const yourPlayers = yourRoster.map((s) => s.player).filter(Boolean) as NonNullable<RosterSlot["player"]>[];

  return (
    <div className="flex-1 flex flex-col justify-center overflow-y-auto">
      {}
      <div className="min-h-full flex flex-col justify-center px-4 md:px-0 pt-3 pb-0 gap-2 md:gap-3 w-full max-w-xl md:max-w-2xl mx-auto">

      {}
      <div className="flex flex-col justify-center gap-2 md:gap-3">
        {cpuTeams.map((cpu, i) => {
          const round     = i + 1;
          const isPast    = round < currentRound;
          const isCurrent = round === currentRound;
          const isFuture  = round > currentRound;
          const result    = roundResults[i];
          const diffColor = DIFFICULTY_COLORS[cpu.difficulty];

          const borderColor = isCurrent
            ? "#FFB800"
            : isPast
            ? result?.win ? "#39FF14" : "#FF2D78"
            : "#ffffff18";

          const cpuPlayers = cpu.roster.map((s) => s.player).filter(Boolean) as NonNullable<RosterSlot["player"]>[];

          return (
            <div key={cpu.id}>

              {}
              {isCurrent && (
                <div
                  className="relative border-2 px-4 py-4 md:px-8 md:py-7 transition-all"
                  style={{
                    borderColor,
                    backgroundColor: "#FFB80008",
                    boxShadow: `0 0 24px ${borderColor}35`,
                    animation: "neon-pulse 1.8s ease-in-out infinite",
                  }}
                >
                  {}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor }} />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor }} />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor }} />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor }} />

                  {}
                  <div className="flex items-center justify-between mb-3 md:mb-5">
                    <span className="font-pixel text-[8px] md:text-[12px] tracking-widest" style={{ color: "#FFB800" }}>
                      {ROUND_NAMES[i]}
                    </span>
                    <span className="font-pixel text-[7px] md:text-[10px] tracking-wider" style={{ color: diffColor }}>
                      {DIFFICULTY_LABELS[cpu.difficulty]}
                    </span>
                  </div>

                  {}
                  <div className="flex items-start gap-3 md:gap-8">

                    {}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5 md:gap-3">
                      <div className="font-pixel text-[7px] md:text-[10px] text-[#39FF1466] tracking-widest mb-1">YOU</div>
                      {yourPlayers.map((p) => (
                        <div key={p.playerId} className="font-pixel text-[8px] md:text-[12px] text-white tracking-wide whitespace-nowrap">
                          {getDisplayName(p.name, 16)}
                        </div>
                      ))}
                    </div>

                    {}
                    <div className="shrink-0 flex flex-col items-center pt-5 md:pt-7">
                      <div className="w-px h-3 md:h-5 bg-[#FFB80033] mb-1" />
                      <span className="font-pixel text-[9px] md:text-[14px] leading-none" style={{ color: "#FFB80088" }}>VS</span>
                      <div className="w-px h-3 md:h-5 bg-[#FFB80033] mt-1" />
                    </div>

                    {}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5 md:gap-3 items-end">
                      <div className="font-pixel text-[7px] md:text-[10px] tracking-widest mb-1 whitespace-nowrap overflow-hidden w-full text-right" style={{ color: diffColor + "66" }}>
                        {cpu.name}
                      </div>
                      {cpuPlayers.map((p) => (
                        <div
                          key={p.playerId}
                          className="font-pixel text-[8px] md:text-[12px] tracking-wide whitespace-nowrap w-full text-right"
                          style={{ color: "#ffffffcc" }}
                        >
                          {getDisplayName(p.name, 16)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {}
              {isPast && (
                <div
                  className="relative border px-3 py-2.5 md:px-6 md:py-4 transition-all"
                  style={{
                    borderColor,
                    backgroundColor: result?.win ? "#39FF1406" : "#FF2D7806",
                  }}
                >
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor }} />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor }} />

                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <span className="font-pixel text-[7px] md:text-[10px] tracking-widest" style={{ color: borderColor + "bb" }}>
                      {ROUND_NAMES[i]}
                    </span>
                    <span className="font-pixel text-[7px] md:text-[10px]" style={{ color: diffColor + "88" }}>
                      {DIFFICULTY_LABELS[cpu.difficulty]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-pixel text-[8px] md:text-[11px] text-[#ffffff55]">YOUR SQUAD</div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2 font-pixel text-[12px] md:text-[18px]">
                      <span style={{ color: result?.win ? "#39FF14" : "#FF2D78" }}>{result?.yourScore}</span>
                      <span className="text-[#ffffff22] text-[9px] md:text-[13px]">-</span>
                      <span style={{ color: result?.win ? "#FF2D78" : "#39FF14" }}>{result?.cpuScore}</span>
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      <div className="font-pixel text-[8px] md:text-[11px]" style={{ color: "#ffffff55" }}>
                        {cpu.name}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {}
              {isFuture && (
                <div
                  className="relative border px-3 py-2.5 md:px-6 md:py-4 opacity-35"
                  style={{ borderColor: "#ffffff14", backgroundColor: "#07070c" }}
                >
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <span className="font-pixel text-[7px] md:text-[10px] text-[#ffffff33] tracking-widest">
                      {ROUND_NAMES[i]}
                    </span>
                    <span className="font-pixel text-[7px] md:text-[10px]" style={{ color: diffColor + "55" }}>
                      {DIFFICULTY_LABELS[cpu.difficulty]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-[8px] md:text-[11px] text-[#ffffff22]">YOUR SQUAD</span>
                    <span className="font-pixel text-[7px] md:text-[10px] text-[#ffffff22]">VS</span>
                    <span className="font-pixel text-[8px] md:text-[11px] text-[#ffffff22]">{cpu.name}</span>
                  </div>
                </div>
              )}

              {}
              {i < 2 && (
                <div className="flex items-center justify-center py-1">
                  <div className="w-px h-3 bg-[#ffffff14]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {}
      <div className="py-4 md:py-6">
        <button
          onClick={onPlayRound}
          className="arcade-btn w-full font-pixel text-[11px] md:text-[14px] py-4 md:py-6 border-2 border-[#FFB800] text-[#FFB800] bg-[#FFB80008] tracking-widest"
          style={{ boxShadow: "0 0 22px #FFB80050" }}
        >
          PLAY {ROUND_NAMES[currentRound - 1]}
        </button>
      </div>
      </div>
    </div>
  );
}
