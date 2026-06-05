"use client";

import { useEffect, useState } from "react";
import { Player, GameMode } from "@/types";
import { getDisplayName, getPositionArchetype } from "@/lib/playerUtils";
import { getTeamColor } from "@/lib/teamColors";

const PACK_SIZE   = 5;
const FORCED_SECS = 5;

interface PackDraftProps {
  pack: Player[];
  revealIndex: number;
  packNum: number;
  mode: GameMode;
  onRevealNext: () => void;
  onKeepCard: () => void;
}

function Pips({ total, revealed, currentColor }: { total: number; revealed: number; currentColor: string }) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => {
        const isPassed  = i < revealed;
        const isCurrent = i === revealed;
        return (
          <div
            key={i}
            className="rounded-sm transition-all duration-300"
            style={{
              width:           isCurrent ? 18 : 10,
              height:          isCurrent ? 10 : 8,
              backgroundColor: isPassed ? "#FF2D7840" : isCurrent ? currentColor : "#ffffff1a",
              boxShadow:       isCurrent ? `0 0 8px ${currentColor}` : "none",
              opacity:         i > revealed ? 0.5 : 1,
            }}
          />
        );
      })}
    </div>
  );
}

function SealedPack({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 md:gap-14 px-6">
      {
}
      <div className="flex flex-col items-center gap-4 md:gap-6 md:scale-[1.8] md:mb-28 origin-center">
        <div className="flex items-end justify-center" style={{ height: 120 }}>
          {[...Array(PACK_SIZE)].map((_, i) => {
            const deg    = (i - 2) * 9;
            const yShift = Math.abs(i - 2) * 6;
            return (
              <div
                key={i}
                className="border-2 border-[#ffffff20] bg-[#0e0e1c] flex items-center justify-center"
                style={{ width: 52, height: 76, marginLeft: i === 0 ? 0 : -14, transform: `rotate(${deg}deg) translateY(${yShift}px)`, zIndex: i, boxShadow: "0 4px 12px #00000060" }}
              >
                <div className="w-8 h-11 border border-[#ffffff15] flex items-center justify-center" style={{ backgroundColor: "#ffffff06" }}>
                  <span className="font-pixel text-[9px] text-[#ffffff22]">?</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <div className="font-pixel text-[9px] text-[#ffffff33] tracking-widest mb-1">{PACK_SIZE} CARDS INSIDE</div>
          <div className="font-pixel text-[10px] text-[#ffffff22] tracking-wider">PASS OR KEEP</div>
          <div className="font-pixel text-[6px] text-[#ffffff22] tracking-wider">LAST CARD IS FORCED</div>
        </div>
      </div>
      <button
        onClick={onOpen}
        className="arcade-btn w-full max-w-xs md:max-w-sm font-pixel text-[12px] md:text-[14px] py-4 md:py-5 border-2 border-[#FFB800] text-[#FFB800] bg-[#FFB80008] tracking-widest"
        style={{ boxShadow: "0 0 22px #FFB80055" }}
      >
        OPEN PACK
      </button>
    </div>
  );
}

function PassedCard({ player, mode }: { player: Player; mode: GameMode }) {
  const tc = getTeamColor(player.team);
  return (
    <div
      className="flex-1 flex items-center gap-3 border px-4"
      style={{ borderColor: "#FF2D7840", backgroundColor: "#0d0d18", opacity: 0.65 }}
    >
      <span className="font-pixel text-[8px] text-[#FF2D7866] shrink-0">✗</span>
      <span className="font-pixel text-[7px] shrink-0" style={{ color: tc + "99" }}>
        {getPositionArchetype(player.positions) || "—"}
      </span>
      <span className="text-base font-semibold text-[#ffffff80] flex-1 truncate leading-tight">
        {getDisplayName(player.name, 18)}
      </span>
      {mode === "classic" && (
        <span className="font-pixel text-[7px] text-[#39FF1460] shrink-0">
          OVR {Math.round(player.pctOverall)}
        </span>
      )}
    </div>
  );
}

function FutureCard() {
  return (
    <div
      className="flex-1 flex items-center justify-center border gap-3"
      style={{ borderColor: "#ffffff20", backgroundColor: "#0d0d18", opacity: 0.55 }}
    >
      <span className="font-pixel text-[8px] text-[#ffffff55] tracking-[0.35em]">? ? ?</span>
    </div>
  );
}

function PlayerCard({ player, mode, isForced }: { player: Player; mode: GameMode; isForced: boolean }) {
  const tc          = getTeamColor(player.team);
  const borderColor = isForced ? "#FFB800" : tc;

  return (
    <div
      className="relative border-2 px-5 py-5 slide-up w-full flex-1 flex flex-col justify-between"
      style={{ borderColor, backgroundColor: tc + "07", boxShadow: `0 0 28px ${borderColor}30` }}
    >
      {}
      {(["tl","tr","bl","br"] as const).map((c) => (
        <div
          key={c}
          className="absolute w-3 h-3"
          style={{
            top:    c.startsWith("t") ? 0 : "auto",
            bottom: c.startsWith("b") ? 0 : "auto",
            left:   c.endsWith("l")   ? 0 : "auto",
            right:  c.endsWith("r")   ? 0 : "auto",
            borderTop:    c.startsWith("t") ? `2px solid ${borderColor}` : "none",
            borderBottom: c.startsWith("b") ? `2px solid ${borderColor}` : "none",
            borderLeft:   c.endsWith("l")   ? `2px solid ${borderColor}` : "none",
            borderRight:  c.endsWith("r")   ? `2px solid ${borderColor}` : "none",
          }}
        />
      ))}

      {isForced && (
        <div className="absolute top-2 right-3 font-pixel text-[7px] text-[#FFB800] blink tracking-wider">LAST CARD</div>
      )}

      {}
      <div>
        <div className="flex gap-1.5 mb-3">
          <span className="font-pixel text-[7px] px-2 py-1" style={{ color: tc, border: `1px solid ${tc}44`, backgroundColor: tc + "18" }}>
            {getPositionArchetype(player.positions)}
          </span>
        </div>
        <div className="text-2xl font-bold text-white leading-tight mb-1">{player.name}</div>
        <div className="font-pixel text-[8px] tracking-wide flex gap-3">
          <span style={{ color: tc + "cc" }}>{player.team}</span>
          <span className="text-[#ffffff55]">{player.era}</span>
        </div>
      </div>

      {}
      {mode === "classic" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {[
              { label: "OFF", value: player.offenseRating, color: "#FF2D78" },
              { label: "DEF", value: player.defenseRating, color: "#00D4FF" },
              { label: "OVR", value: player.pctOverall,    color: "#39FF14" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="font-pixel text-[8px] w-6 shrink-0" style={{ color }}>{label}</span>
                <div className="flex-1 h-2.5 bg-[#1a1a1a] overflow-hidden">
                  <div className="h-full transition-all duration-700" style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
                </div>
                <span className="font-pixel text-[8px] text-[#ffffff66] w-7 text-right shrink-0">{Math.round(value)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-[#ffffff0a] pt-4">
            {[{ l: "PTS", v: player.pts }, { l: "REB", v: player.reb }, { l: "AST", v: player.ast }, { l: "STL", v: player.stl }, { l: "BLK", v: player.blk }].map(({ l, v }) => (
              <div key={l} className="text-center flex-1">
                <div className="font-pixel text-[7px] text-[#ffffff33] mb-1.5">{l}</div>
                <div className="text-base font-semibold text-[#ffffffcc]">{v.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      {mode === "hoopiq" && (
        <div className="flex items-center gap-3">
          <div className="font-pixel text-[7px] text-[#ffffff33] tracking-wider">FEEL</div>
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(5, Math.round(player.pctOverall / 18)) }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5" style={{ backgroundColor: tc + "70" }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PackDraft({ pack, revealIndex, packNum, mode, onRevealNext, onKeepCard }: PackDraftProps) {
  const [countdown, setCountdown] = useState<number | null>(null);

  const isSealed   = revealIndex < 0;
  const isLastCard = !isSealed && revealIndex === pack.length - 1;
  const current    = isSealed ? null : pack[revealIndex];
  const tc         = current ? getTeamColor(current.team) : "#FFB800";
  const remaining  = isSealed ? pack.length : pack.length - 1 - revealIndex;

  useEffect(() => {
    if (!isLastCard) { setCountdown(null); return; }
    let n = FORCED_SECS;
    setCountdown(n);
    const t = setInterval(() => {
      n -= 1;
      setCountdown(n);
      if (n <= 0) { clearInterval(t); onKeepCard(); }
    }, 1000);
    return () => clearInterval(t);
  }, [isLastCard, revealIndex]);

  if (isSealed) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col min-h-0">
          <div className="px-5 py-3 flex items-center justify-between shrink-0">
            <div className="font-pixel text-[8px] text-[#FFB80088] tracking-wider">PACK</div>
            <div className="font-pixel text-[11px]" style={{ color: "#FFB800", textShadow: "0 0 12px #FFB800" }}>
              {packNum} <span className="text-[#ffffff33] text-[8px]">/ 3</span>
            </div>
            <Pips total={PACK_SIZE} revealed={-1} currentColor="#FFB800" />
          </div>
          <SealedPack onOpen={onRevealNext} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col min-h-0">

      {}
      <div className="px-4 py-3 flex items-center justify-between shrink-0">
        <div className="font-pixel text-[10px]" style={{ color: "#FFB800", textShadow: "0 0 10px #FFB800" }}>
          PACK {packNum}<span className="text-[#ffffff33] text-[8px] ml-1.5">/ 3</span>
        </div>
        <Pips total={PACK_SIZE} revealed={revealIndex} currentColor={isLastCard ? "#FFB800" : tc} />
        <div className="font-pixel text-[8px] text-right">
          {remaining > 0
            ? <span className="text-[#ffffff44]">{remaining} LEFT</span>
            : <span className="text-[#FFB80088] blink">FORCED</span>}
        </div>
      </div>

      {
}
      <div className="flex-1 min-h-0 px-4 flex flex-col gap-1.5 py-2">
        {Array.from({ length: PACK_SIZE }).map((_, i) => {
          if (i < revealIndex) {
            return (
              <div key={i} style={{ flex: "1 1 0%", minHeight: 0 }} className="flex flex-col">
                <PassedCard player={pack[i]} mode={mode} />
              </div>
            );
          }
          if (i === revealIndex && current) {
            return (
              <div key={i} style={{ flex: "3 1 0%", minHeight: 0 }} className="flex flex-col">
                <PlayerCard player={current} mode={mode} isForced={isLastCard} />
              </div>
            );
          }
          return (
            <div key={i} style={{ flex: "1 1 0%", minHeight: 0 }} className="flex flex-col">
              <FutureCard />
            </div>
          );
        })}
      </div>

      {}
      <div className="px-4 pb-4 pt-2 shrink-0">
        {isLastCard ? (
          <>
            <div className="h-1 bg-[#FFB80018] overflow-hidden mb-2">
              <div
                className="h-full bg-[#FFB800] transition-all duration-1000"
                style={{ width: `${countdown !== null ? (countdown / FORCED_SECS) * 100 : 100}%`, boxShadow: "0 0 6px #FFB800" }}
              />
            </div>
            <button
              onClick={onKeepCard}
              className="arcade-btn w-full font-pixel text-[11px] py-4 border-2 border-[#FFB800] text-[#FFB800] bg-[#FFB80008] tracking-widest"
              style={{ boxShadow: "0 0 18px #FFB80055" }}
            >
              FORCED PICK{countdown !== null && countdown > 0 && <span className="ml-2 text-[#FFB80077]">({countdown})</span>}
            </button>
          </>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onRevealNext}
              className="arcade-btn flex-1 font-pixel text-[11px] py-4 border-2 border-[#FF2D78] text-[#FF2D78] bg-[#FF2D7808] tracking-widest"
              style={{ boxShadow: "0 0 16px #FF2D7850" }}
            >
              PASS
            </button>
            <button
              onClick={onKeepCard}
              className="arcade-btn flex-1 font-pixel text-[11px] py-4 border-2 border-[#39FF14] text-[#39FF14] bg-[#39FF1408] tracking-widest"
              style={{ boxShadow: "0 0 16px #39FF1450" }}
            >
              KEEP
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
