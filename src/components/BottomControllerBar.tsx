import React from 'react';
import { sounds } from '../utils/audioSynth';

interface BottomControllerBarProps {
  onTriggerMakeItFire: () => void;
  onTogglePlay: () => void;
  onOpenExport: () => void;
  isPlaying: boolean;
}

export const BottomControllerBar: React.FC<BottomControllerBarProps> = ({
  onTriggerMakeItFire,
  onTogglePlay,
  onOpenExport,
  isPlaying,
}) => {
  return (
    <footer className="relative z-30 w-full bg-gradient-to-t from-black via-black/95 to-black/80 px-6 py-2.5 border-t border-slate-700/50 select-none">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        
        {/* Left / Center: Norse Instruction Prompt matching God of War */}
        <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-cinzel">
          <span className="text-amber-400">ᛟ</span>
          <span className="text-slate-300 italic">
            Customize weapons by equipping Runic Attack Gems and Pommels · Drop clips & music to sync
          </span>
        </div>

        {/* Right: Controller Button Action Hints */}
        <div className="flex items-center gap-4 text-xs font-cinzel font-semibold text-slate-300">
          
          {/* Square: MAKE IT FIRE */}
          <button
            onClick={() => {
              sounds.playMakeItFire();
              onTriggerMakeItFire();
            }}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer group"
          >
            <div className="w-4 h-4 rounded-sm border border-purple-400 flex items-center justify-center text-[10px] text-purple-300 font-sans group-hover:bg-purple-900/40">
              □
            </div>
            <span>MAKE IT FIRE 🔥</span>
          </button>

          {/* Triangle: PLAY / PAUSE */}
          <button
            onClick={onTogglePlay}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer group"
          >
            <div className="w-4 h-4 border border-emerald-400 flex items-center justify-center text-[10px] text-emerald-300 font-sans group-hover:bg-emerald-900/40">
              △
            </div>
            <span>{isPlaying ? 'PAUSE' : 'PLAY PREVIEW'}</span>
          </button>

          {/* Cross: EXPORT */}
          <button
            onClick={() => {
              sounds.playSelect();
              onOpenExport();
            }}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer group"
          >
            <div className="w-4 h-4 rounded-full border border-sky-400 flex items-center justify-center text-[10px] text-sky-300 font-sans group-hover:bg-sky-900/40">
              ✕
            </div>
            <span>EXPORT VIDEO</span>
          </button>

          {/* Touchpad: MAP / STORY */}
          <div className="hidden xl:flex items-center gap-1 text-slate-400">
            <span className="px-1.5 py-0.2 rounded border border-slate-600 text-[10px]">MAP</span>
            <span>TIMELINE</span>
          </div>

          {/* Options: OPTIONS */}
          <div className="hidden xl:flex items-center gap-1 text-slate-400">
            <span className="px-1 py-0.2 rounded border border-slate-600 text-[9px]">OPTIONS</span>
            <span>SETTINGS</span>
          </div>

          {/* Circle: EXIT */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <div className="w-4 h-4 rounded-full border border-red-400 flex items-center justify-center text-[10px] text-red-300 font-sans">
              ○
            </div>
            <span>EXIT</span>
          </div>

        </div>

      </div>
    </footer>
  );
};
