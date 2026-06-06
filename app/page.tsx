import Link from "next/link";
import HowToPlayButton from "@/components/HowToPlay";

export default function Home() {
  return (
    <main className="scanlines crt-vignette min-h-dvh bg-[#050508] flex flex-col items-center justify-center px-6 gap-0 relative">

      {}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#39FF14] opacity-60" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#39FF14] opacity-60" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#39FF14] opacity-60" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#39FF14] opacity-60" />

      <div className="absolute top-5 right-5 z-10">
        <HowToPlayButton />
      </div>

      {}
      <div className="text-center mb-10">
        <p className="font-pixel text-[10px] text-[#FFB800] tracking-widest mb-6 neon-amber">
          NBA DRAFT CHALLENGE
        </p>
        <h1 className="font-pixel text-6xl sm:text-7xl neon-green flicker leading-none">
          3V3
        </h1>
        <p className="font-pixel text-[9px] text-[#39FF1488] mt-4 tracking-wider">
          BUILD YOUR SQUAD
        </p>
      </div>

      {}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/game?mode=classic"
          className="arcade-btn relative group block border-2 border-[#39FF14] bg-[#39FF1408] px-6 py-5 text-center"
          style={{ boxShadow: "0 0 12px #39FF1440, inset 0 0 12px #39FF1408" }}
        >
          <div className="font-pixel text-sm text-[#39FF14] mb-2 group-hover:neon-green transition-all">
            CLASSIC
          </div>
          <div className="text-xs text-[#39FF1488]">Full stats visible</div>
          <div className="absolute top-1.5 right-2 font-pixel text-[8px] text-[#39FF1455]">▶</div>
        </Link>

        <Link
          href="/game?mode=hidden"
          className="arcade-btn relative group block border-2 border-[#FF2D78] bg-[#FF2D7808] px-6 py-5 text-center"
          style={{ boxShadow: "0 0 12px #FF2D7840, inset 0 0 12px #FF2D7808" }}
        >
          <div className="font-pixel text-sm text-[#FF2D78] mb-2 transition-all">
            HIDDEN
          </div>
          <div className="text-xs text-[#FF2D7888]">Draft from memory</div>
          <div className="absolute top-1.5 right-2 font-pixel text-[8px] text-[#FF2D7855]">▶</div>
        </Link>
      </div>

      {}
      <p className="font-pixel text-[8px] text-[#FFB800] mt-12 blink tracking-wider">
        ● INSERT COIN TO PLAY ●
      </p>

      {}
      <div className="absolute bottom-10 flex gap-2 opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-1 h-1 bg-[#39FF14] rounded-full" />
        ))}
      </div>
    </main>
  );
}
