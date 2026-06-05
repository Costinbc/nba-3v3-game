"use client";

import { Player, GameMode } from "@/types";
import { getTeamColor } from "@/lib/teamColors";

interface PlayerRowProps {
  player: Player;
  onSelect: () => void;
  selected: boolean;
  mode: GameMode;
}

export default function PlayerRow({ player, onSelect, selected, mode }: PlayerRowProps) {
  const tc = getTeamColor(player.team);

  return (
    <button
      onClick={onSelect}
      className="w-full text-left px-3 py-2.5 flex items-center gap-3 transition-all relative"
      style={
        selected
          ? { backgroundColor: tc + "18", borderLeft: `3px solid ${tc}`, boxShadow: `inset 0 0 20px ${tc}0a` }
          : { borderLeft: "3px solid transparent" }
      }
    >
      {}
      {selected && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: tc, boxShadow: `0 0 8px ${tc}` }}
        />
      )}

      <div className="flex-1 min-w-0">
        {}
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-white text-sm truncate leading-tight">
            {player.name}
          </span>
          <div className="flex gap-1 shrink-0">
            {player.positions.map((pos) => (
              <span
                key={pos}
                className="font-pixel text-[7px] px-1.5 py-0.5"
                style={{ color: tc, border: `1px solid ${tc}44`, backgroundColor: tc + "18" }}
              >
                {pos}
              </span>
            ))}
          </div>
        </div>

        {}
        <div className="font-pixel text-[7px] mb-1.5 tracking-wide flex gap-2">
          <span style={{ color: tc + "cc" }}>{player.team}</span>
          <span className="text-[#ffffff44]">{player.era}</span>
        </div>

        {}
        <div className="flex flex-col gap-0.5">
          {[
            { label: "OFF", value: player.offenseRating, color: "#FF2D78" },
            { label: "DEF", value: player.defenseRating, color: "#00D4FF" },
            { label: "OVR", value: player.pctOverall,    color: "#39FF14" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="font-pixel text-[7px] w-5 shrink-0" style={{ color }}>{label}</span>
              <div className="flex-1 h-1 bg-[#1a1a1a] relative overflow-hidden">
                <div
                  className="h-full absolute left-0 top-0"
                  style={{
                    width: `${Math.min(value, 100)}%`,
                    backgroundColor: color,
                    boxShadow: `0 0 4px ${color}`,
                  }}
                />
              </div>
              <span className="font-pixel text-[7px] text-[#ffffff55] w-5 text-right shrink-0">
                {Math.round(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {}
      {mode === "classic" && (
        <div className="flex gap-2 text-[#ffffff66] shrink-0">
          {[
            { label: "PTS", val: player.pts },
            { label: "REB", val: player.reb },
            { label: "AST", val: player.ast },
          ].map(({ label, val }) => (
            <div key={label} className="text-center w-8">
              <div className="font-pixel text-[6px] text-[#ffffff33] mb-0.5">{label}</div>
              <div className="text-xs font-medium text-[#ffffffbb]">{val.toFixed(1)}</div>
            </div>
          ))}
          <div className="text-center w-8 hidden sm:block">
            <div className="font-pixel text-[6px] text-[#ffffff33] mb-0.5">STL</div>
            <div className="text-xs text-[#ffffffbb]">{player.stl.toFixed(1)}</div>
          </div>
          <div className="text-center w-8 hidden sm:block">
            <div className="font-pixel text-[6px] text-[#ffffff33] mb-0.5">BLK</div>
            <div className="text-xs text-[#ffffffbb]">{player.blk.toFixed(1)}</div>
          </div>
        </div>
      )}
    </button>
  );
}
