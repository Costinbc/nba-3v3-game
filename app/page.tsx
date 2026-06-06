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
            BALL KNOWER
          </div>
          <div className="text-xs text-[#FF2D7888]">Draft from memory</div>
          <div className="absolute top-1.5 right-2 font-pixel text-[8px] text-[#FF2D7855]">▶</div>
        </Link>
      </div>

      {}
      <p className="font-pixel text-[8px] text-[#FFB800] mt-12 blink tracking-wider">
        ● INSERT COIN TO PLAY ●
      </p>

      <div className="absolute bottom-5 flex items-center gap-4">

        <a
          href="https://www.instagram.com/basketballismyreligion/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-[#ffffff22] hover:text-[#E1306C] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </a>

        <a
          href="https://x.com/basketballimr"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter / X"
          className="text-[#ffffff22] hover:text-[#1DA1F2] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
          </svg>
        </a>

        <div className="w-px h-3 bg-[#ffffff12]" />

        <a
          href="https://forms.gle/MXSxDJwdzakpR4nq9"
          target="_blank"
          rel="noopener noreferrer"
          className="arcade-btn font-pixel text-[7px] px-2.5 py-2 border border-[#ffffff18] text-[#ffffff33] hover:text-[#39FF14] hover:border-[#39FF1444] transition-colors tracking-widest"
        >
          FEEDBACK
        </a>
      </div>
    </main>
  );
}
