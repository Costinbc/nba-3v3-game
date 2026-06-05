"use client";

import { Draw } from "@/types";
import { TEAMS, ERAS } from "@/lib/slotMachine";
import { getTeamColor, getEraColor } from "@/lib/teamColors";
import { useState, useEffect, useCallback } from "react";

interface SlotMachineProps {
  draw: Draw;
  onSpinComplete: () => void;
  isSpinning: boolean;
  spinType?: "both" | "team" | "era";
}

export default function SlotMachine({ draw, onSpinComplete, isSpinning, spinType = "both" }: SlotMachineProps) {
  const [displayTeam, setDisplayTeam] = useState(draw.team);
  const [displayEra, setDisplayEra] = useState(draw.era);

  const animate = useCallback(() => {
    const duration = 1500;
    const interval = 80;
    const steps = Math.floor(duration / interval);
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (spinType !== "era") setDisplayTeam(TEAMS[Math.floor(Math.random() * TEAMS.length)].abbr);
      if (spinType !== "team") setDisplayEra(ERAS[Math.floor(Math.random() * ERAS.length)]);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayTeam(draw.team);
        setDisplayEra(draw.era);
        onSpinComplete();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [draw, onSpinComplete, spinType]);

  useEffect(() => {
    if (isSpinning) return animate();
  }, [isSpinning, animate]);

  useEffect(() => {
    if (!isSpinning) {
      setDisplayTeam(draw.team);
      setDisplayEra(draw.era);
    }
  }, [draw, isSpinning]);

  const teamColor = getTeamColor(displayTeam);
  const eraColor = getEraColor(displayEra);

  return (
    <div className="flex items-stretch justify-center gap-3">
      {}
      <div
        className="flex-1 max-w-[160px] relative border-2 p-4 text-center"
        style={{
          borderColor: teamColor,
          backgroundColor: teamColor + "0d",
          boxShadow: `0 0 12px ${teamColor}50, inset 0 0 12px ${teamColor}08`,
        }}
      >
        {}
        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l" style={{ borderColor: teamColor }} />
        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r" style={{ borderColor: teamColor }} />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l" style={{ borderColor: teamColor }} />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r" style={{ borderColor: teamColor }} />

        <div className="font-pixel text-[8px] mb-2 tracking-widest uppercase" style={{ color: teamColor + "99" }}>
          TEAM
        </div>
        <div
          className="font-pixel text-2xl"
          style={{
            color: teamColor,
            textShadow: `0 0 10px ${teamColor}, 0 0 20px ${teamColor}88`,
          }}
        >
          {displayTeam}
        </div>
      </div>

      {}
      <div className="flex items-center">
        <div className="font-pixel text-[#ffffff22] text-lg">×</div>
      </div>

      {}
      <div
        className="flex-1 max-w-[160px] relative border-2 p-4 text-center"
        style={{
          borderColor: eraColor,
          backgroundColor: eraColor + "0d",
          boxShadow: `0 0 12px ${eraColor}50, inset 0 0 12px ${eraColor}08`,
        }}
      >
        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l" style={{ borderColor: eraColor }} />
        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r" style={{ borderColor: eraColor }} />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l" style={{ borderColor: eraColor }} />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r" style={{ borderColor: eraColor }} />

        <div className="font-pixel text-[8px] mb-2 tracking-widest uppercase" style={{ color: eraColor + "99" }}>
          ERA
        </div>
        <div
          className="font-pixel text-2xl"
          style={{
            color: eraColor,
            textShadow: `0 0 10px ${eraColor}, 0 0 20px ${eraColor}88`,
          }}
        >
          {displayEra}
        </div>
      </div>
    </div>
  );
}
