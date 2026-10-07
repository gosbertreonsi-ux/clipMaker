import React from 'react';
import { MainTab } from '../types';
import { sounds } from '../utils/audioSynth';

interface TopNavProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  hacksilver: number;
  xp: number;
  activeViewMode: 'loadout' | 'video' | 'split';
  onChangeViewMode: (mode: 'loadout' | 'video' | 'split') => void;
}

const TABS: MainTab[] = ['WEAPONS', 'ARMOR', 'SKILLS', 'MAP', 'GOALS', 'CODEX', 'RESOURCES'];

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  hacksilver,
  xp,
  activeViewMode,
  onChangeViewMode,
}) => {
  const currentIndex = TABS.indexOf(activeTab);

  const handlePrevTab = () => {
    sounds.playBumper();
    const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    onSelectTab(TABS[prevIndex]);
  };

  const handleNextTab = () => {
    sounds.playBumper();
    const nextIndex = (currentIndex + 1) % TABS.length;
    onSelectTab(TABS[nextIndex]);
  };

  return (
    <header className="relative z-30 w-full bg-gradient-to-b from-black/95 via-black/80 to-transparent pt-3 pb-2 px-6 border-b border-slate-700/40">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between">
        {/* Left bumper + Tabs */}
        <div className="flex items-center gap-2">
          {/* L1 Bumper Button */}
          <button
            onClick={handlePrevTab}
            title="Previous Tab [L1 / Q]"
            className="group flex items-center justify-center px-2 py-0.5 rounded bg-slate-900/90 border border-slate-600/70 text-slate-300 hover:text-amber-400 hover:border-amber-500/80 transition-all cursor-pointer active:scale-95"
          >
            <span className="font-cinzel text-xs font-bold tracking-wider text-slate-400 group-hover:text-amber-300">L1</span>
          </button>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 ml-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    sounds.playSelect();
                    onSelectTab(tab);
                  }}
                  className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-cinzel font-semibold tracking-widest transition-all cursor-pointer ${
                    isActive
                      ? 'text-amber-300 bg-gradient-to-b from-amber-500/20 to-black/60 border border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-amber-500 border-r border-b border-amber-600" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* R1 Bumper Button */}
          <button
            onClick={handleNextTab}
            title="Next Tab [R1 / E]"
            className="group flex items-center justify-center px-2 py-0.5 rounded bg-slate-900/90 border border-slate-600/70 text-slate-300 hover:text-amber-400 hover:border-amber-500/80 transition-all cursor-pointer active:scale-95 ml-1"
          >
            <span className="font-cinzel text-xs font-bold tracking-wider text-slate-400 group-hover:text-amber-300">R1</span>
          </button>
        </div>

        {/* Center Engine Brand & Stage View Mode */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center bg-slate-950/80 border border-slate-700/60 rounded px-1.5 py-1">
            <button
              onClick={() => {
                sounds.playSelect();
                onChangeViewMode('loadout');
              }}
              className={`px-2.5 py-1 text-[11px] font-cinzel font-semibold tracking-wider rounded transition-all cursor-pointer ${
                activeViewMode === 'loadout'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              WAR LOADOUT
            </button>
            <button
              onClick={() => {
                sounds.playSelect();
                onChangeViewMode('split');
              }}
              className={`px-2.5 py-1 text-[11px] font-cinzel font-semibold tracking-wider rounded transition-all cursor-pointer ${
                activeViewMode === 'split'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/60'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              SPLIT CANVAS
            </button>
            <button
              onClick={() => {
                sounds.playSelect();
                onChangeViewMode('video');
              }}
              className={`px-2.5 py-1 text-[11px] font-cinzel font-semibold tracking-wider rounded transition-all cursor-pointer ${
                activeViewMode === 'video'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              PREVIEW STAGE
            </button>
          </div>
        </div>

        {/* Currencies & Counters (Hacksilver + XP) */}
        <div className="flex items-center gap-5">
          {/* Gold Hacksilver (Credits / Cloud Storage) */}
          <div className="flex items-center gap-2" title="Hacksilver (Creator Render Credits)">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-200 flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.5)]">
              <span className="text-[10px] font-cinzel font-extrabold text-amber-950">ᚷ</span>
            </div>
            <span className="font-cinzel text-sm sm:text-base font-bold text-amber-300 tabular-nums tracking-wide">
              {hacksilver.toLocaleString()}
            </span>
          </div>

          {/* Runic XP / HS (Beat Engine Energy) */}
          <div className="flex items-center gap-2" title="XP (Runic Beat Synchronization Units)">
            <div className="w-5 h-5 rotate-45 bg-gradient-to-br from-sky-400 to-slate-800 border border-sky-300 flex items-center justify-center shadow-[0_0_8px_rgba(56,189,248,0.4)]">
              <span className="text-[9px] -rotate-45 font-cinzel font-bold text-sky-100">HS</span>
            </div>
            <span className="font-cinzel text-sm sm:text-base font-bold text-slate-200 tabular-nums tracking-wide">
              {xp.toLocaleString()} <span className="text-xs text-slate-400 font-normal">XP</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
