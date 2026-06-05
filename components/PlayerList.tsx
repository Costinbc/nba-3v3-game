"use client";

import { Player, SortStat, GameMode } from "@/types";
import { searchPlayers, sortPlayers } from "@/lib/playerUtils";
import PlayerRow from "./PlayerRow";

interface PlayerListProps {
  players: Player[];
  selectedPlayer: Player | null;
  mode: GameMode;
  searchQuery: string;
  sortStat: SortStat;
  onSelectPlayer: (player: Player) => void;
  onSearchChange: (q: string) => void;
  onSortChange: (s: SortStat) => void;
}

const SORT_OPTIONS: { label: string; value: SortStat }[] = [
  { label: "PTS", value: "pts" },
  { label: "REB", value: "reb" },
  { label: "AST", value: "ast" },
  { label: "STL", value: "stl" },
  { label: "BLK", value: "blk" },
  { label: "OVR", value: "composite" },
];

export default function PlayerList({
  players,
  selectedPlayer,
  mode,
  searchQuery,
  sortStat,
  onSelectPlayer,
  onSearchChange,
  onSortChange,
}: PlayerListProps) {
  let filtered = searchPlayers(players, searchQuery);
  filtered = sortPlayers(filtered, sortStat);

  return (
    <div className="flex flex-col min-h-0">
      {}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[#ffffff0f] bg-[#08080c]">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="SEARCH..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-1.5 font-pixel text-[9px] bg-[#0d0d14] border border-[#39FF1430] text-[#39FF14] placeholder-[#39FF1440] outline-none tracking-wider focus:border-[#39FF14] focus:shadow-[0_0_8px_#39FF1430] transition-all"
          />
        </div>
        {mode === "classic" && (
          <select
            value={sortStat}
            onChange={(e) => onSortChange(e.target.value as SortStat)}
            className="px-2 py-1.5 font-pixel text-[8px] bg-[#0d0d14] border border-[#FF2D7840] text-[#FF2D78] outline-none tracking-wider"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#0d0d14]">
                {o.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#08080c] border-b border-[#ffffff08]">
        <span className="font-pixel text-[7px] text-[#ffffff33] tracking-wider">
          {filtered.length} PLAYERS
        </span>
        {selectedPlayer && (
          <span className="font-pixel text-[7px] text-[#FFB800] blink tracking-wider">
            ▼ PLACE IN SLOT
          </span>
        )}
      </div>

      {}
      <div className="flex-1 overflow-y-auto divide-y divide-[#ffffff08]">
        {filtered.map((player) => (
          <PlayerRow
            key={player.id}
            player={player}
            selected={selectedPlayer?.id === player.id}
            mode={mode}
            onSelect={() => onSelectPlayer(player)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <span className="font-pixel text-[9px] text-[#ffffff22] tracking-wider">NO PLAYERS FOUND</span>
          </div>
        )}
      </div>
    </div>
  );
}
