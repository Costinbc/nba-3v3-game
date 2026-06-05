"use client";

import { useEffect, useState } from "react";
import { Player, RosterSlot, SlotLabel } from "@/types";
import { getTeamColor } from "@/lib/teamColors";
import { getPositionArchetype, getDisplayName } from "@/lib/playerUtils";

interface SwapScreenProps {
  roster: RosterSlot[];
  allPlayers: Player[];

  onSwap: (label: SlotLabel, replacement: Player) => void;
  onLockIn: () => void;
}

type SwapStep =
  | { kind: "idle" }
  | { kind: "rolling"; label: SlotLabel }
  | { kind: "reveal"; label: SlotLabel; player: Player };

export default function SwapScreen({
  roster,
  allPlayers,
  onSwap,
  onLockIn,
}: SwapScreenProps) {
  const [step, setStep] = useState<SwapStep>({ kind: "idle" });

  useEffect(() => {
    if (step.kind !== "reveal") return;
    const t = setTimeout(() => {
      onSwap(step.label, step.player);
    }, 4000);
    return () => clearTimeout(t);
  }, [step]);

  function handleSwap(label: SlotLabel) {
    if (step.kind !== "idle") return;
    setStep({ kind: "rolling", label });

    setTimeout(() => {

      const currentPlayer = roster.find((s) => s.label === label)?.player;
      const keepIds = roster
        .map((s) => s.player?.playerId)
        .filter(Boolean)
        .filter((id) => id !== currentPlayer?.playerId) as string[];
      const pool = allPlayers.filter((p) => !keepIds.includes(p.playerId) && p.pctOverall >= 70);
      if (pool.length === 0) { onLockIn(); return; }
      const replacement = pool[Math.ceil(Math.random() * pool.length)];
      setStep({ kind: "reveal", label, player: replacement });
    }, 900);
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="min-h-full flex flex-col justify-center px-4 py-4 md:py-8">
      <div className="flex flex-col max-w-lg md:max-w-2xl mx-auto w-full gap-4 md:gap-6">

        {}
        <div className="text-center shrink-0">
          <div
            className="font-pixel text-xl md:text-3xl tracking-widest mb-2 flicker"
            style={{ color: "#FFB800", textShadow: "0 0 20px #FFB800, 0 0 50px #FFB80066" }}
          >
            {step.kind === "reveal" ? "YOU GOT:" : "GAMBLE?"}
          </div>
          <div className="font-pixel text-[8px] md:text-[10px] text-[#ffffff44] tracking-wider">
            {step.kind === "reveal"
              ? "SWAP LOCKED IN"
              : "SWAP ONE PICK FOR A RANDOM PLAYER"}
          </div>
        </div>

        {}
        <div className="flex flex-col gap-3 md:gap-4">
          {roster.map((slot) => {
            const p         = slot.player;
            const tc        = p ? getTeamColor(p.team) : "#39FF14";
            const archetype = p ? getPositionArchetype(p.positions) : "";

            const isRolling = step.kind === "rolling" && step.label === slot.label;
            const isReveal  = step.kind === "reveal"  && step.label === slot.label;
            const isLocked  = step.kind !== "idle" && !isRolling && !isReveal;

            const revealedPlayer = isReveal ? step.player : null;
            const rtc = revealedPlayer ? getTeamColor(revealedPlayer.team) : "#39FF14";
            const rArchetype = revealedPlayer ? getPositionArchetype(revealedPlayer.positions) : "";

            return (
              <div
                key={slot.label}
                className="flex items-center gap-3 md:gap-5 border-2 px-4 py-4 md:px-6 md:py-5 relative transition-all"
                style={{
                  borderColor: isReveal ? "#39FF14" : isRolling ? "#FFB800" : tc + "55",
                  backgroundColor: isReveal ? "#39FF1408" : isRolling ? "#FFB80008" : tc + "08",
                  boxShadow: isReveal ? "0 0 28px #39FF1440" : isRolling ? "0 0 24px #FFB80040" : "none",
                  animation: isRolling ? "neon-pulse 0.4s ease-in-out infinite" : isReveal ? "slide-up 0.3s ease-out" : "none",
                  opacity: isLocked ? 0.3 : 1,
                }}
              >
                {(isReveal || isRolling) && (
                  <>
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: isReveal ? "#39FF14" : "#FFB800" }} />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: isReveal ? "#39FF14" : "#FFB800" }} />
                  </>
                )}

                {}
                <div
                  className="font-pixel text-[8px] md:text-[10px] w-10 md:w-14 shrink-0 tracking-wider leading-tight text-center"
                  style={{ color: isReveal ? "#39FF14" : tc }}
                >
                  {isReveal && revealedPlayer ? rArchetype || "PLAYER" : archetype || "PLAYER"}
                </div>

                {}
                <div className="flex-1 min-w-0">
                  {isRolling && (
                    <div className="font-pixel text-[11px] text-[#FFB800] blink tracking-widest">ROLLING...</div>
                  )}

                  {isReveal && revealedPlayer && (
                    <div className="slide-up">
                      <div className="font-bold text-white text-sm md:text-base leading-tight mb-0.5">
                        {getDisplayName(revealedPlayer.name, 18)}
                      </div>
                      <div className="font-pixel text-[7px] md:text-[9px] flex items-center gap-2">
                        <span style={{ color: rtc + "cc" }}>{revealedPlayer.team}</span>
                        <span className="text-[#ffffff55]">{revealedPlayer.era}</span>
                        <span style={{ color: "#39FF14" }}>OVR {Math.round(revealedPlayer.pctOverall)}</span>
                      </div>
                    </div>
                  )}

                  {!isRolling && !isReveal && p && (
                    <>
                      <div className="font-bold text-white text-sm md:text-base leading-tight mb-0.5">
                        {getDisplayName(p.name, 18)}
                      </div>
                      <div className="font-pixel text-[7px] md:text-[9px] flex items-center gap-2">
                        <span style={{ color: tc + "cc" }}>{p.team}</span>
                        <span className="text-[#ffffff55]">{p.era}</span>
                        <span style={{ color: "#39FF14" }}>OVR {Math.round(p.pctOverall)}</span>
                      </div>
                    </>
                  )}
                </div>

                {}
                {!isRolling && !isReveal && (
                  <button
                    onClick={() => handleSwap(slot.label)}
                    disabled={step.kind !== "idle"}
                    className="arcade-btn font-pixel text-[8px] md:text-[10px] px-3 md:px-5 py-2.5 md:py-3 border-2 tracking-wider shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ borderColor: "#FFB800", color: "#FFB800", backgroundColor: "#FFB80008", boxShadow: "0 0 12px #FFB80040" }}
                  >
                    SWAP
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {}
        <div className="shrink-0">
          {step.kind === "reveal" ? (
            <button
              onClick={() => onSwap(step.label, step.player)}
              className="arcade-btn w-full font-pixel text-[12px] md:text-[14px] py-4 md:py-5 border-2 border-[#39FF14] text-[#39FF14] bg-[#39FF1408] tracking-widest"
              style={{ boxShadow: "0 0 22px #39FF1450" }}
            >
              CONTINUE
            </button>
          ) : (
            <button
              onClick={onLockIn}
              disabled={step.kind !== "idle"}
              className="arcade-btn w-full font-pixel text-[12px] md:text-[14px] py-4 md:py-5 border-2 border-[#39FF14] text-[#39FF14] bg-[#39FF1408] tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ boxShadow: "0 0 22px #39FF1450" }}
            >
              LOCK IN SQUAD
            </button>
          )}
        </div>

      </div>
      </div>
    </div>
  );
}
