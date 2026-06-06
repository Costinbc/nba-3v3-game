"use client";

import { useState, useEffect } from "react";

const SEEN_KEY = "3v3_htp_seen";

const sections = [
  {
    color: "#b46002",
    title: "THE BASICS",
    steps: [
      "Draft a squad of 3 NBA players and take them through a 3-round tournament.",
      "Each round is a 3v3 game against a CPU team. First to 21 wins.",
      "Win all 3 rounds to become champions. Win every game 21-0 for a perfect run.",
    ],
  },
  {
    color: "#39FF14",
    title: "THE DRAFT",
    steps: [
      "You get 3 packs, one player per pack goes to your squad.",
      "Each pack has 5 cards. Flip through them one by one.",
      "PASS to skip, KEEP to lock that player in.",
      "You are forced to keep the last card in the pack.",
    ],
  },
  {
    color: "#FFB800",
    title: "THE GAMBLE",
    steps: [
      "Before the tournament you get one chance to swap a player on your squad for a random new one.",
    ],
  },
  {
    color: "#FF2D78",
    title: "THE TOURNAMENT",
    steps: [
      "3 rounds. Each game is first to 21.",
      "Opponents get progressively tougher each round",
      "Tougher opponents get a hidden strength boost. Expect to work for every win.",
      "The better team always wins, closer matchups just mean a closer score.",
    ],
  },
  {
    color: "#00D4FF",
    title: "BUFFS",
    steps: [
      "Your lineup can unlock bonuses based on player types.",
      "A balanced Guard + Wing + Big crew earns CHEMISTRY.",
      "There are scorers, shooters, defenders, each archetype has its own buff.",
      "Opponent lineups can have buffs too. Check them on the tipoff screen.",
    ],
  },
  {
    color: "#FF9944",
    title: "OVR ISN'T EVERYTHING",
    steps: [
      "OVR gives a rough idea of quality but matches run on offense and defense ratings.",
      "Offense counts slightly more than defense.",
      "A player with high OVR but weak defense can drag your team down.",
      "Buffs matter. A balanced lineup can beat a higher rated one.",
    ],
  },
  {
    color: "#BF7FFF",
    title: "MODES",
    steps: [
      "CLASSIC: full stats visible while drafting.",
      "BALL KNOWER: stats are hidden. Draft from memory alone.",
    ],
  },
  {
    color: "#FFD700",
    title: "YOUR GRADES",
    steps: [
      "SQUAD: based on the average OVR of your 3 players.",
      "OPPONENTS: based on the average OVR of every team you faced.",
      "Both use the same scale. Compare them to see how you measured up.",
    ],
  },
];

function Modal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[500] flex items-start justify-center overflow-y-auto"
      style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px), #020205f0",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md px-4 py-8 flex flex-col gap-5">

        <div className="flex items-center justify-between">
          <div>
            <div className="font-pixel text-[8px] text-[#ffffff33] tracking-widest mb-1">3V3 NBA DRAFT</div>
            <div
              className="font-pixel text-xl tracking-widest"
              style={{ color: "#FFB800", textShadow: "0 0 16px #FFB800" }}
            >
              HOW TO PLAY
            </div>
          </div>
          <button
            onClick={onClose}
            className="arcade-btn font-pixel text-[11px] px-3 py-2 border border-[#ffffff22] text-[#ffffff55] hover:text-white hover:border-[#ffffff44] transition-colors"
          >
            ✕
          </button>
        </div>

        {sections.map((s) => (
          <div
            key={s.title}
            className="border px-4 py-3 flex flex-col gap-2.5 relative"
            style={{ borderColor: s.color + "30", backgroundColor: s.color + "06" }}
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: s.color + "60" }} />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: s.color + "60" }} />

            <div
              className="font-pixel text-[9px] tracking-widest"
              style={{ color: s.color, textShadow: `0 0 8px ${s.color}66` }}
            >
              {s.title}
            </div>

            <div className="flex flex-col gap-1.5">
              {s.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="font-pixel text-[7px] mt-0.5 shrink-0" style={{ color: s.color + "66" }}>▸</span>
                  <span className="font-pixel text-[7px] leading-relaxed" style={{ color: "#ffffffaa" }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="font-pixel text-[6px] text-[#ffffff22] tracking-widest text-center">
          TAP OUTSIDE OR ✕ TO CLOSE
        </div>

      </div>
    </div>
  );
}

export default function HowToPlayButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(SEEN_KEY)) {
      setOpen(true);
    }
  }, []);

  function handleClose() {
    localStorage.setItem(SEEN_KEY, "1");
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="arcade-btn font-pixel text-[8px] px-2.5 py-2.5 border border-[#ffffff22] text-[#ffffff44] hover:text-[#FFB800] hover:border-[#FFB80055] transition-colors tracking-wider"
      >
        ?
      </button>

      {open && <Modal onClose={handleClose} />}
    </>
  );
}
