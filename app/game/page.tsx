"use client";

import { Suspense, useReducer, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  GameState,
  Player,
  SlotLabel,
  GameMode,
  CPUTeam,
  RoundResult,
} from "@/types";
import { getPackPlayers } from "@/lib/playerUtils";
import { simulateSeason } from "@/lib/gameEngine";
import {
  generateCPUTeams,
  simulateMatch,
  ROUND_NAMES,
} from "@/lib/tournamentEngine";
import RosterBar from "@/components/RosterBar";
import PackDraft from "@/components/PackDraft";
import SwapScreen from "@/components/SwapScreen";
import BracketScreen from "@/components/BracketScreen";
import MatchupScreen from "@/components/MatchupScreen";
import TournamentResult from "@/components/TournamentResult";

const SLOT_LABELS: SlotLabel[] = ["G", "W", "B"];

type Action =
  | { type: "SET_MODE"; mode: GameMode }
  | { type: "GENERATE_PACK"; allPlayers: Player[] }
  | { type: "REVEAL_NEXT" }
  | { type: "KEEP_CARD"; allPlayers: Player[] }
  | { type: "SWAP_PLAYER"; label: SlotLabel; replacement: Player }
  | { type: "SKIP_SWAP" }
  | { type: "ENTER_BRACKET"; cpuTeams: CPUTeam[]; projectedWins: number }
  | { type: "START_MATCHUP" }
  | { type: "ROUND_OVER"; result: RoundResult }
  | { type: "PLAY_AGAIN" };

function createInitialState(): GameState {
  return {
    phase: "draft-pool",
    mode: "classic",
    roster: SLOT_LABELS.map((label) => ({ label, player: null })),
    pickedPlayerIds: [],
    projectedWins: null,
    pack: [],
    packRevealIndex: -1,
    cpuTeams: [],
    tournamentRound: 1,
    roundResults: [],
    currentMatchResult: null,
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {

    case "SET_MODE":
      return { ...createInitialState(), mode: action.mode, pack: state.pack };

    case "GENERATE_PACK": {
      const pack = getPackPlayers(action.allPlayers, state.pickedPlayerIds);
      return { ...state, pack, packRevealIndex: -1 };
    }

    case "REVEAL_NEXT": {
      const next = state.packRevealIndex + 1;
      if (next >= state.pack.length) return state;
      return { ...state, packRevealIndex: next };
    }

    case "KEEP_CARD": {
      const player = state.pack[state.packRevealIndex];
      if (!player) return state;

      const emptySlot = state.roster.find((s) => s.player === null);
      if (!emptySlot) return state;

      const newRoster      = state.roster.map((s) =>
        s.label === emptySlot.label ? { ...s, player } : s
      );
      const newPickedIds   = [...state.pickedPlayerIds, player.playerId];
      const allFilled      = newRoster.every((s) => s.player !== null);

      if (allFilled) {

        return { ...state, roster: newRoster, pickedPlayerIds: newPickedIds, phase: "swap" };
      }

      const nextPack = getPackPlayers(action.allPlayers, newPickedIds);
      return {
        ...state,
        roster: newRoster,
        pickedPlayerIds: newPickedIds,
        pack: nextPack,
        packRevealIndex: -1,
      };
    }

    case "SWAP_PLAYER": {
      const currentPlayer = state.roster.find((s) => s.label === action.label)?.player;
      const newRoster = state.roster.map((s) =>
        s.label === action.label ? { ...s, player: action.replacement } : s
      );
      const newPickedIds = [
        ...state.pickedPlayerIds.filter((id) => id !== currentPlayer?.playerId),
        action.replacement.playerId,
      ];
      return { ...state, roster: newRoster, pickedPlayerIds: newPickedIds, phase: "complete" };
    }

    case "SKIP_SWAP":
      return { ...state, phase: "complete" };

    case "ENTER_BRACKET":
      return {
        ...state,
        phase: "bracket",
        cpuTeams: action.cpuTeams,
        projectedWins: action.projectedWins,
        tournamentRound: 1,
        roundResults: [],
        currentMatchResult: null,
      };

    case "START_MATCHUP": {
      const cpu    = state.cpuTeams[state.tournamentRound - 1];
      const result = simulateMatch(state.roster, cpu.roster);
      return { ...state, phase: "matchup", currentMatchResult: result };
    }

    case "ROUND_OVER": {
      const newResults = [...state.roundResults, action.result];
      if (!action.result.win) {
        return { ...state, phase: "tourney-over", roundResults: newResults };
      }
      if (state.tournamentRound === 3) {
        return { ...state, phase: "champion", roundResults: newResults };
      }
      return {
        ...state,
        phase: "bracket",
        tournamentRound: state.tournamentRound + 1,
        roundResults: newResults,
        currentMatchResult: null,
      };
    }

    case "PLAY_AGAIN":
      return { ...createInitialState(), mode: state.mode };

    default:
      return state;
  }
}

const NUMERIC_FIELDS: (keyof Player)[] = [
  "composite", "bpm", "wsPer48", "obpm", "dbpm",
  "pts", "reb", "ast", "stl", "blk", "tpm",
  "tsPct", "fgPct", "fg3Pct", "ftPct", "efgPct",
  "defWS", "stlPct", "blkPct", "drebPct",
];

function roundPlayer(p: Player): Player {
  const out = { ...p };
  for (const field of NUMERIC_FIELDS) {
    const v = out[field];
    if (typeof v === "number") (out as Record<string, unknown>)[field] = Math.round(v * 10) / 10;
  }
  return out;
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#050508]" />}>
      <GameContent />
    </Suspense>
  );
}

function GameContent() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as GameMode) || "classic";

  const [state, dispatch]   = useReducer(reducer, undefined, createInitialState);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetch("/data/players.json")
      .then((r) => r.json())
      .then((data: Player[]) => {
        const rounded = data.map(roundPlayer);
        setAllPlayers(rounded);
        dispatch({ type: "GENERATE_PACK", allPlayers: rounded });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_MODE", mode });
  }, [mode]);

  useEffect(() => {
    if (!loading && allPlayers.length > 0 && state.pack.length === 0) {
      dispatch({ type: "GENERATE_PACK", allPlayers });
    }
  }, [loading, allPlayers, state.pack.length]);

  useEffect(() => {
    if (state.phase !== "complete" || allPlayers.length === 0) return;
    const t = setTimeout(() => {
      const cpuTeams      = generateCPUTeams(allPlayers, state.pickedPlayerIds);
      const projectedWins = simulateSeason(state.roster);
      dispatch({ type: "ENTER_BRACKET", cpuTeams, projectedWins });
    }, 700);
    return () => clearTimeout(t);
  }, [state.phase, allPlayers, state.pickedPlayerIds, state.roster]);

  const packNum   = state.pickedPlayerIds.length + 1;
  const currentCPU = state.cpuTeams[state.tournamentRound - 1] ?? null;

  return (
    <div className="scanlines min-h-dvh bg-[#050508] text-white flex flex-col">

      {}
      <header
        className="flex items-center justify-between px-4 py-3 border-b-2 border-[#39FF1420] bg-[#08080c] shrink-0"
        style={{ boxShadow: "0 2px 16px #39FF1410" }}
      >
        <a
          href="/"
          className="arcade-btn font-pixel text-[8px] text-[#ffffff33] hover:text-[#39FF14] transition-colors tracking-wider"
        >
          ◀ BACK
        </a>

        {}
        {state.phase === "draft-pool" && (
          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => {
              const filled = i < state.pickedPlayerIds.length;
              return (
                <div
                  key={i}
                  className="w-2 h-2 transition-all"
                  style={{
                    backgroundColor: filled ? "#39FF14" : "#ffffff18",
                    boxShadow: filled ? "0 0 6px #39FF14" : "none",
                  }}
                />
              );
            })}
          </div>
        )}
        {state.phase === "swap" && (
          <div
            className="font-pixel text-[9px] tracking-widest flicker"
            style={{ color: "#FFB800", textShadow: "0 0 8px #FFB800" }}
          >
            GAMBLE?
          </div>
        )}
        {state.phase === "complete" && (
          <div className="font-pixel text-[8px] text-[#FFB800] blink tracking-widest">
            BUILDING...
          </div>
        )}
        {state.phase === "bracket" && (
          <div className="font-pixel text-[9px] tracking-widest">
            <span className="text-[#FFB80088]">ROUND </span>
            <span style={{ color: "#FFB800", textShadow: "0 0 8px #FFB800" }}>
              {state.tournamentRound}
            </span>
            <span className="text-[#ffffff33]"> / 3</span>
          </div>
        )}

        <div className="font-pixel text-[8px] text-[#ffffff22] tracking-widest">
          {state.mode.toUpperCase()}
        </div>
      </header>

      {}
      <div className="flex-1 flex flex-col min-h-0">

        {}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="font-pixel text-[9px] text-[#39FF14] blink tracking-widest">
              LOADING ROSTER...
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-[#39FF14]"
                  style={{
                    animation: `blink 0.8s step-end ${i * 0.25}s infinite`,
                    boxShadow: "0 0 6px #39FF14",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {}
        {!loading && state.phase === "draft-pool" && (
          <PackDraft
            key={packNum}
            pack={state.pack}
            revealIndex={state.packRevealIndex}
            packNum={packNum}
            mode={state.mode}
            onRevealNext={() => dispatch({ type: "REVEAL_NEXT" })}
            onKeepCard={() => dispatch({ type: "KEEP_CARD", allPlayers })}
          />
        )}

        {}
        {state.phase === "swap" && (
          <SwapScreen
            roster={state.roster}
            allPlayers={allPlayers}
            onSwap={(label, replacement) =>
              dispatch({ type: "SWAP_PLAYER", label, replacement })
            }
            onLockIn={() => dispatch({ type: "SKIP_SWAP" })}
          />
        )}

        {}
        {state.phase === "bracket" && (
          <BracketScreen
            yourRoster={state.roster}
            cpuTeams={state.cpuTeams}
            currentRound={state.tournamentRound}
            roundResults={state.roundResults}
            onPlayRound={() => dispatch({ type: "START_MATCHUP" })}
          />
        )}

        {}
        {state.phase === "complete" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="font-pixel text-[9px] text-[#FFB800] blink tracking-widest">
              GENERATING BRACKET...
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-[#FFB800]"
                  style={{
                    animation: `blink 0.8s step-end ${i * 0.25}s infinite`,
                    boxShadow: "0 0 6px #FFB800",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {}
      {(state.phase === "draft-pool" || state.phase === "swap" || state.phase === "complete") && (
        <RosterBar
          roster={state.roster}
          selectedPlayer={null}
          onPlace={() => {}}
        />
      )}

      {}

      {state.phase === "matchup" && state.currentMatchResult && currentCPU && (
        <MatchupScreen
          yourRoster={state.roster}
          cpuTeam={currentCPU}
          matchResult={state.currentMatchResult}
          roundName={ROUND_NAMES[state.tournamentRound - 1]}
          tournamentRound={state.tournamentRound}
          onContinue={() => {
            dispatch({
              type: "ROUND_OVER",
              result: {
                round: state.tournamentRound,
                roundName: ROUND_NAMES[state.tournamentRound - 1],
                cpuTeam: currentCPU,
                yourScore: state.currentMatchResult!.yourScore,
                cpuScore: state.currentMatchResult!.cpuScore,
                win: state.currentMatchResult!.win,
              },
            });
          }}
        />
      )}

      {(state.phase === "champion" || state.phase === "tourney-over") && (
        <TournamentResult
          roundResults={state.roundResults}
          roster={state.roster}
          projectedWins={state.projectedWins}
          onPlayAgain={() => dispatch({ type: "PLAY_AGAIN" })}
        />
      )}
    </div>
  );
}
