"use client";

import { SlotLabel, RosterSlot, Player } from "@/types";
import { getTeamColor } from "@/lib/teamColors";
import { getPositionArchetype, getShortName } from "@/lib/playerUtils";

const SLOT_DEFS: { label: SlotLabel; full: string }[] = [
  { label: "G", full: "1ST" },
  { label: "W", full: "2ND" },
  { label: "B", full: "3RD" },
];

interface RosterBarProps {
  roster: RosterSlot[];
  selectedPlayer: Player | null;
  onPlace: (label: SlotLabel) => void;
}

export default function RosterBar({ roster, selectedPlayer, onPlace }: RosterBarProps) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-3 bg-[#08080c] border-t-2 border-[#39FF1430]"
      style={{ boxShadow: "0 -4px 20px #39FF1410" }}
    >
      {SLOT_DEFS.map(({ label, full }) => {
        const slot     = roster.find((s) => s.label === label)!;
        const p        = slot.player;
        const filled   = p !== null;
        const canPlace = selectedPlayer !== null && !filled;
        const tc       = filled && p ? getTeamColor(p.team) : null;
        const archetype = filled && p ? getPositionArchetype(p.positions) : null;

        return (
          <button
            key={label}
            onClick={() => canPlace && onPlace(label)}
            disabled={!canPlace && !filled}
            className="arcade-btn flex-1 h-16 relative flex flex-col items-center justify-center border-2 transition-all"
            style={
              canPlace
                ? {
                    borderColor: "#39FF14",
                    backgroundColor: "#39FF1408",
                    boxShadow: "0 0 14px #39FF1460",
                    animation: "neon-pulse 1.2s ease-in-out infinite",
                  }
                : filled && tc
                ? {
                    borderColor: tc,
                    backgroundColor: tc + "14",
                    boxShadow: `0 0 8px ${tc}30`,
                  }
                : {
                    borderColor: "#ffffff12",
                    backgroundColor: "#0d0d14",
                  }
            }
          >
            {}
            {filled && tc && (
              <>
                <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l" style={{ borderColor: tc }} />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r" style={{ borderColor: tc }} />
                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l" style={{ borderColor: tc }} />
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r" style={{ borderColor: tc }} />
              </>
            )}

            {}
            <span
              className="font-pixel text-[7px] tracking-widest leading-none"
              style={{
                color: filled && tc
                  ? tc + "cc"
                  : canPlace
                  ? "#39FF14"
                  : "#ffffff30",
              }}
            >
              {filled && archetype ? archetype : full}
            </span>

            {}
            {filled ? (
              <span className="text-[10px] text-white font-medium mt-1 truncate max-w-full px-1 leading-none">
                {getShortName(p!.name)}
              </span>
            ) : canPlace ? (
              <span className="font-pixel text-[7px] text-[#39FF1488] mt-0.5 blink">TAP</span>
            ) : (
              <span className="font-pixel text-[8px] text-[#ffffff18] mt-0.5">---</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
