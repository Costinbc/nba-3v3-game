"use client";

import { useRef, useState, useEffect } from "react";
import { RoundResult, RosterSlot } from "@/types";
import { getTeamColor } from "@/lib/teamColors";
import { getPositionArchetype, getDisplayName } from "@/lib/playerUtils";
import { DIFFICULTY_COLORS } from "@/lib/tournamentEngine";

interface TournamentResultProps {
  roundResults: RoundResult[];
  roster: RosterSlot[];
  projectedWins: number | null;
  onPlayAgain: () => void;
}

const SLOT_FULL: Record<string, string> = { G: "1ST", W: "2ND", B: "3RD" };

function CornerTick({ color, pos }: { color: string; pos: "tl" | "br" }) {
  const base = "absolute w-2 h-2";
  return pos === "tl"
    ? <div className={`${base} top-0.5 left-0.5 border-t border-l`} style={{ borderColor: color }} />
    : <div className={`${base} bottom-0.5 right-0.5 border-b border-r`} style={{ borderColor: color }} />;
}

export default function TournamentResult({
  roundResults,
  roster,
  onPlayAgain,
}: TournamentResultProps) {
  const [visible, setVisible] = useState(false);
  const [saving, setSaving]   = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const isChampion     = roundResults.length === 3 && roundResults.every((r) => r.win);
  const isPerfect      = isChampion && roundResults.every((r) => r.cpuScore === 0);
  const wins           = roundResults.filter((r) => r.win).length;
  const losses         = roundResults.filter((r) => !r.win).length;
  const totalYourPts   = roundResults.reduce((s, r) => s + r.yourScore, 0);
  const totalCpuPts    = roundResults.reduce((s, r) => s + r.cpuScore, 0);
  const finalRound  = roundResults[roundResults.length - 1];
  const accentColor = isPerfect ? "#00FFFF" : isChampion ? "#FFD700" : "#FF2D78";

  const players = roster.map((s) => s.player).filter(Boolean) as NonNullable<RosterSlot["player"]>[];

  const mvp = players.length
    ? players.reduce((best, p) => (p.pctOverall > best.pctOverall ? p : best), players[0])
    : null;

  const avgOvr = players.length
    ? Math.round(players.reduce((s, p) => s + p.pctOverall, 0) / players.length)
    : 0;
  const teamGrade =
    avgOvr >= 100 ? "S"  : avgOvr >= 95 ? "A+" : avgOvr >= 90 ? "A"
    : avgOvr >= 85 ? "B+" : avgOvr >= 80 ? "B"  : avgOvr >= 75 ? "C+" : "C";

  const diffWeight = (d: string) => d === "hard" ? 3 : d === "medium" ? 2 : 1;
  const compScore  = roundResults.reduce(
    (sum, r) => sum + diffWeight(r.cpuTeam.difficulty) * (r.win ? 1 : 0.5), 0
  );
  const compGrade  = compScore >= 6 ? "S" : compScore >= 4 ? "A" : compScore >= 1.5 ? "B" : "C";
  const compLabel  = wins === 3 ? "champions" : wins === 2 ? "finalists" : wins === 1 ? "conference finalists" : "1st round";

  const statusLabel =
    isChampion           ? "TOURNAMENT CHAMPIONS"
    : roundResults.length === 3 ? "RUNNER-UPS"
    : roundResults.length === 2 ? "CONFERENCE FINALISTS"
    : "1SR ROUND EXIT";

  async function handleSave() {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      await document.fonts.ready;
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#020205",
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png")
      );
      const file = new File([blob], "3v3-squad-card.png", { type: "image/png" });
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Mobile: use share sheet (covers iOS Chrome/Safari, Android)
      if (isMobile && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "My 3V3 Squad" });
          return;
        } catch {
          // User cancelled or share failed — fall through to download
        }
      }

      // Desktop: direct download
      const link = document.createElement("a");
      link.download = "3v3-squad-card.png";
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    } finally {
      setSaving(false);
    }
  }

  if (!visible) return <div className="fixed inset-0 bg-[#020205] z-50" />;

  return (
    <div className="fixed inset-0 z-50 bg-[#020205] flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-10" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)"
      }} />
      <div className="flex-1 flex items-center justify-center p-3 md:p-6 relative z-20 min-h-0">
      <div className="w-full max-w-sm md:max-w-xl slide-up flex flex-col gap-2.5 md:gap-4">

        <div
          ref={cardRef}
          className="bg-[#020205] border-2 p-3 md:p-5 flex flex-col gap-2 md:gap-3"
          style={{ borderColor: accentColor + "40", boxShadow: `0 0 40px ${accentColor}18` }}
        >
          {/* Status + Record */}
          <div className="text-center">
            {isChampion ? (
              <div className="flex items-center justify-center gap-2">
                <span className="font-pixel text-sm md:text-base" style={{ color: isPerfect ? "#00FFFF" : "#FFD700", textShadow: `0 0 12px ${isPerfect ? "#00FFFF" : "#FFD700"}` }}>★</span>
                <span
                  className="font-pixel leading-none flicker"
                  style={{ fontSize: "clamp(0.9rem,5vw,1.5rem)", color: isPerfect ? "#00FFFF" : "#FFD700", textShadow: isPerfect ? "0 0 20px #00FFFF, 0 0 40px #00FFFF88" : "0 0 20px #FFD700, 0 0 40px #FFD70088" }}
                >
                  {isPerfect ? "PERFECT" : "CHAMPIONS"}
                </span>
                <span className="font-pixel text-sm md:text-base" style={{ color: isPerfect ? "#00FFFF" : "#FFD700", textShadow: `0 0 12px ${isPerfect ? "#00FFFF" : "#FFD700"}` }}>★</span>
              </div>
            ) : (
              <div
                className="font-pixel leading-none"
                style={{ fontSize: "clamp(0.8rem,4.5vw,1.3rem)", color: "#FF2D78", textShadow: "0 0 16px #FF2D78" }}
              >
                {statusLabel}
              </div>
            )}

            <div className="font-pixel text-2xl md:text-3xl leading-none mt-1.5 md:mt-2">
              <span style={{ color: isPerfect ? "#00FFFF" : "#39FF14", textShadow: `0 0 10px ${isPerfect ? "#00FFFF" : "#39FF14"}` }}>{totalYourPts}</span>
              <span className="text-[#ffffff22] mx-2 text-lg md:text-xl">-</span>
              <span style={{ color: "#FF2D78", textShadow: "0 0 10px #FF2D78" }}>{totalCpuPts}</span>
            </div>
            {isPerfect && (
              <div className="font-pixel text-[6px] md:text-[8px] mt-1 tracking-widest" style={{ color: "#00FFFF66" }}>
                SHUTOUT IN EVERY ROUND
              </div>
            )}
          </div>

          {/* Players */}
          <div className="flex flex-col gap-0.5 md:gap-1">
            {roster.map((slot) => {
              const p      = slot.player;
              const tc     = p ? getTeamColor(p.team) : "#39FF1444";
              const arch   = p ? (getPositionArchetype(p.positions) || SLOT_FULL[slot.label]) : SLOT_FULL[slot.label];
              return (
                <div key={slot.label} className="px-2.5 py-1.5 md:px-3 md:py-2 border relative" style={{ borderColor: tc + "40", backgroundColor: tc + "06" }}>
                  <CornerTick color={tc + "60"} pos="tl" />
                  <div className="flex items-center gap-2.5 md:gap-3">
                    <span className="font-pixel text-[6px] md:text-[7px] w-9 md:w-10 shrink-0 leading-tight" style={{ color: tc }}>{arch}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-xs md:text-sm leading-snug">{p?.name ?? "—"}</div>
                      {p && (
                        <div className="font-pixel text-[5px] md:text-[6px] mt-0.5" style={{ color: tc + "88" }}>
                          {p.team}  {p.era}
                        </div>
                      )}
                    </div>
                    <span className="font-pixel text-[6px] md:text-[7px] text-[#39FF1488] shrink-0">OVR {p ? Math.round(p.pctOverall) : "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grades */}
          <div className="flex gap-1.5 md:gap-2">
            <div className="flex-1 border px-2.5 py-2 md:px-3 md:py-2.5 text-center relative" style={{ borderColor: accentColor + "30", backgroundColor: accentColor + "06" }}>
              <CornerTick color={accentColor + "50"} pos="tl" />
              <div className="font-pixel text-[6px] md:text-[7px] text-[#ffffff33] tracking-widest mb-0.5 md:mb-1">SQUAD</div>
              <div className="font-pixel text-2xl md:text-3xl leading-none" style={{ color: accentColor, textShadow: `0 0 14px ${accentColor}88` }}>{teamGrade}</div>
              <div className="font-pixel text-[5px] md:text-[6px] text-[#ffffff33] mt-0.5 md:mt-1">avg ovr {avgOvr}</div>
            </div>
            <div className="flex-1 border px-2.5 py-2 md:px-3 md:py-2.5 text-center relative" style={{ borderColor: "#FFB80030", backgroundColor: "#FFB80006" }}>
              <CornerTick color="#FFB80050" pos="tl" />
              <div className="font-pixel text-[6px] md:text-[7px] text-[#ffffff33] tracking-widest mb-0.5 md:mb-1">COMP</div>
              <div className="font-pixel text-2xl md:text-3xl leading-none" style={{ color: "#FFB800", textShadow: "0 0 14px #FFB80088" }}>{compGrade}</div>
              <div className="font-pixel text-[5px] md:text-[6px] text-[#ffffff33] mt-0.5 md:mt-1">{compLabel}</div>
            </div>
          </div>

          {/* Round log — single-line per round */}
          <div className="flex flex-col gap-1 md:gap-1.5">
            {roundResults.map((r, i) => {
              const resultColor = r.win ? "#39FF14" : "#FF2D78";
              const cpuPlayers  = r.cpuTeam.roster
                .map((s) => s.player).filter(Boolean) as NonNullable<RosterSlot["player"]>[];
              const names = cpuPlayers.map((p) => getDisplayName(p.name, 10)).join("  ");
              return (
                <div
                  key={i}
                  className="border px-2.5 py-1.5 md:px-3 md:py-2 relative"
                  style={{ borderColor: resultColor + "25", backgroundColor: resultColor + "05" }}
                >
                  <CornerTick color={resultColor + "40"} pos="tl" />
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="font-pixel text-[7px] md:text-[8px] w-3.5 shrink-0 text-center" style={{ color: resultColor }}>{r.win ? "W" : "L"}</span>
                    <span className="font-pixel text-[6px] md:text-[7px] text-[#ffffff33] tracking-wider shrink-0">{r.roundName}</span>
                    <span className="font-pixel text-[6px] md:text-[7px] flex-1 min-w-0 whitespace-nowrap" style={{ color: "#ffffff55" }}>{names}</span>
                    <span className="font-pixel text-[8px] md:text-[10px] shrink-0">
                      <span style={{ color: resultColor }}>{r.yourScore}</span>
                      <span className="text-[#ffffff22] mx-0.5 md:mx-1">–</span>
                      <span style={{ color: r.win ? "#FF2D78" : "#39FF14" }}>{r.cpuScore}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="font-pixel text-[6px] md:text-[8px] text-[#39FF14] tracking-[0.2em] text-center">63-0.app</div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 md:gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="arcade-btn flex-1 font-pixel text-[10px] md:text-[12px] py-3 md:py-4 border-2 tracking-widest disabled:opacity-40"
            style={{
              borderColor:     accentColor,
              color:           accentColor,
              backgroundColor: accentColor + "08",
              boxShadow:       `0 0 16px ${accentColor}40`,
            }}
          >
            {saving ? "SAVING..." : "SAVE IMAGE"}
          </button>

          <button
            onClick={onPlayAgain}
            className="arcade-btn flex-1 font-pixel text-[10px] md:text-[12px] py-3 md:py-4 border border-[#ffffff18] text-[#ffffff44] tracking-widest"
          >
            PLAY AGAIN
          </button>
        </div>

      </div>
      </div>
    </div>
  );
}
