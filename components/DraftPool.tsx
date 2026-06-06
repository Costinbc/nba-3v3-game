"use client";

import { Player, GameMode } from "@/types";
import { getTeamColor } from "@/lib/teamColors";

type CardStatus = "available" | "you-picked" | "cpu-picked";

interface DraftPoolProps {
  pool: Player[];
  pickedByYou: string[];
  pickedByCpu: string[];
  isYourTurn: boolean;
  mode: GameMode;
  onPick: (player: Player) => void;
}

const PICK_ORDER: ("y" | "c")[] = ["y", "c", "y", "c", "y", "c"];
const YOU_COLOR  = "#39FF14";
const CPU_COLOR  = "#FF2D78";

function PickOrderRow({ totalPicked }: { totalPicked: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {PICK_ORDER.map((who, i) => {
        const isPast    = i < totalPicked;
        const isCurrent = i === totalPicked;
        const isDone    = totalPicked >= 6;
        const color     = who === "y" ? YOU_COLOR : CPU_COLOR;

        return (
          <div
            key={i}
            className="w-3.5 h-3.5 border-2 flex items-center justify-center transition-all"
            style={{
              borderColor: color,
              backgroundColor: isPast || (isCurrent && !isDone) ? color : "transparent",
              boxShadow:  isCurrent && !isDone ? `0 0 8px ${color}` : "none",
              transform:  isCurrent && !isDone ? "scale(1.2)" : "scale(1)",
              animation:  isCurrent && !isDone ? "neon-pulse 0.9s ease-in-out infinite" : "none",
              opacity: isDone ? 0.6 : 1,
            }}
          >
            {isPast && (
              <span className="font-pixel text-[5px] text-black leading-none">
                {who === "y" ? "Y" : "C"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface DraftCardProps {
  player: Player;
  status: CardStatus;
  canPick: boolean;
  mode: GameMode;
  onPick: () => void;
}

function DraftCard({ player, status, canPick, mode, onPick }: DraftCardProps) {
  const tc = getTeamColor(player.team);
  const isPicked  = status !== "available";
  const isYours   = status === "you-picked";
  const isCpu     = status === "cpu-picked";

  return (
    <button
      onClick={() => canPick && onPick()}
      disabled={!canPick}
      className="relative border-2 p-2.5 text-left w-full transition-all"
      style={{
        borderColor: isCpu
          ? "#FF2D7825"
          : isYours
          ? "#39FF1435"
          : canPick
          ? tc
          : "#ffffff15",
        backgroundColor: isCpu
          ? "#0a0a0f"
          : isYours
          ? "#39FF1406"
          : canPick
          ? tc + "0c"
          : "#09090f",
        boxShadow: canPick ? `0 0 14px ${tc}35, inset 0 0 6px ${tc}08` : "none",
        animation: canPick ? "neon-pulse 1.6s ease-in-out infinite" : "none",
      }}
    >
      {}
      {canPick && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: tc }} />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: tc }} />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l" style={{ borderColor: tc }} />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: tc }} />
        </>
      )}

      {}
      {isPicked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {isYours ? (
            <div
              className="font-pixel text-[9px] tracking-wider"
              style={{ color: YOU_COLOR, textShadow: `0 0 8px ${YOU_COLOR}` }}
            >
              ✓ DRAFTED
            </div>
          ) : (
            <div className="font-pixel text-[8px] text-[#FF2D7866] tracking-wider">
              CPU PICK
            </div>
          )}
        </div>
      )}

      {}
      <div style={{ opacity: isPicked ? 0.2 : 1 }}>
        {}
        <div className="flex gap-0.5 flex-wrap mb-1.5">
          {player.positions.slice(0, 2).map((pos) => (
            <span
              key={pos}
              className="font-pixel text-[5px] px-1 py-0.5"
              style={{
                color: tc,
                border: `1px solid ${tc}44`,
                backgroundColor: tc + "18",
              }}
            >
              {pos}
            </span>
          ))}
        </div>

        {}
        <div className="text-[11px] font-semibold text-white leading-tight mb-0.5 truncate">
          {player.name}
        </div>

        {}
        <div className="font-pixel text-[6px] tracking-wide mb-2 flex gap-2">
          <span style={{ color: tc + "cc" }}>{player.team}</span>
          <span className="text-[#ffffff44]">{player.era}</span>
        </div>

        {}
        {mode === "classic" && (
          <>
            <div className="flex flex-col gap-0.5 mb-2">
              {[
                { label: "OFF", value: player.offenseRating, color: "#FF2D78" },
                { label: "DEF", value: player.defenseRating, color: "#00D4FF" },
                { label: "OVR", value: player.pctOverall,    color: "#39FF14" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-1">
                  <span className="font-pixel text-[5px] w-4 shrink-0" style={{ color }}>
                    {label}
                  </span>
                  <div className="flex-1 h-0.5 bg-[#1a1a1a] overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.min(value, 100)}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 3px ${color}`,
                      }}
                    />
                  </div>
                  <span className="font-pixel text-[5px] text-[#ffffff55] w-4 text-right shrink-0">
                    {Math.round(value)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-1 justify-between">
              {[
                { l: "PTS", v: player.pts },
                { l: "REB", v: player.reb },
                { l: "AST", v: player.ast },
              ].map(({ l, v }) => (
                <div key={l} className="text-center flex-1">
                  <div className="font-pixel text-[5px] text-[#ffffff33] mb-0.5">{l}</div>
                  <div className="text-[10px] font-medium text-[#ffffffbb]">{v.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {}
        {mode === "hidden" && (
          <div className="flex gap-1 mt-1">
            {Array.from({ length: Math.min(5, Math.round(player.pctOverall / 18)) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5"
                  style={{ backgroundColor: tc + "70" }}
                />
              )
            )}
          </div>
        )}
      </div>
    </button>
  );
}

export default function DraftPool({
  pool,
  pickedByYou,
  pickedByCpu,
  isYourTurn,
  mode,
  onPick,
}: DraftPoolProps) {
  const totalPicked = pickedByYou.length + pickedByCpu.length;
  const isDone      = totalPicked >= 6;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
      {}
      <div className="px-4 py-3 border-b border-[#ffffff08] bg-[#08080c] shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-pixel text-[7px] text-[#ffffff33] tracking-wider">
            {isDone ? "DRAFT DONE" : `PICK ${totalPicked + 1} / 6`}
          </span>
          <span
            className={`font-pixel text-[8px] tracking-wider ${
              !isDone && isYourTurn ? "blink" : ""
            }`}
            style={{
              color: isDone
                ? "#ffffff44"
                : isYourTurn
                ? YOU_COLOR
                : CPU_COLOR + "aa",
              textShadow:
                !isDone && isYourTurn ? `0 0 8px ${YOU_COLOR}` : "none",
            }}
          >
            {isDone
              ? "▶ ENTERING BRACKET..."
              : isYourTurn
              ? "▶ YOUR PICK"
              : "CPU THINKING..."}
          </span>
        </div>

        <PickOrderRow totalPicked={totalPicked} />

        {}
        <div className="flex justify-between mt-1.5">
          {PICK_ORDER.map((who, i) => (
            <div
              key={i}
              className="font-pixel text-[5px] w-3.5 text-center"
              style={{
                color:
                  who === "y"
                    ? YOU_COLOR + (i === totalPicked ? "cc" : "44")
                    : CPU_COLOR + (i === totalPicked ? "cc" : "44"),
              }}
            >
              {who === "y" ? "Y" : "C"}
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="flex-1 p-3 grid grid-cols-2 gap-2.5 content-start">
        {pool.map((player) => {
          const status: CardStatus = pickedByYou.includes(player.playerId)
            ? "you-picked"
            : pickedByCpu.includes(player.playerId)
            ? "cpu-picked"
            : "available";

          const canPick = status === "available" && isYourTurn && !isDone;

          return (
            <DraftCard
              key={player.id}
              player={player}
              status={status}
              canPick={canPick}
              mode={mode}
              onPick={() => onPick(player)}
            />
          );
        })}
      </div>
    </div>
  );
}
