import React, { useState } from 'react';
import { CharacterStats } from '../types';
import { sounds } from '../utils/audioSynth';

interface RightStatsPanelProps {
  stats: CharacterStats;
  onInspectStat?: (statName: string) => void;
}

export const RightStatsPanel: React.FC<RightStatsPanelProps> = ({ stats }) => {
  const [showDescriptions, setShowDescriptions] = useState(false);

  const toggleDescriptions = () => {
    sounds.playSelect();
    setShowDescriptions(!showDescriptions);
  };

  const statItems = [
    {
      name: 'STRENGTH',
      value: stats.strength,
      max: 15,
      description: 'Increases damage for all standard attacks and weapon skills. In VIZMOTION AI, boosts audio beat-hit impact and sub-frame cutting velocity.',
      icon: (
        <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 10.5V8c0-.83-.67-1.5-1.5-1.5S16 7.17 16 8v-1.5c0-.83-.67-1.5-1.5-1.5S13 5.67 13 6.5V5c0-.83-.67-1.5-1.5-1.5S10 4.17 10 5v6.2l-.77-.45a1.5 1.5 0 0 0-2.07.56l-.5.87a1.5 1.5 0 0 0 .56 2.07L11.5 17c.5.3 1.1.4 1.7.4h4.3c1.9 0 3.5-1.6 3.5-3.5v-3.4z" />
        </svg>
      ),
    },
    {
      name: 'RUNIC',
      value: stats.runic,
      max: 15,
      description: 'Increases damage for Runic Attacks. In VIZMOTION AI, powers the "MAKE IT FIRE" automated transition and VFX synthesis engine.',
      icon: (
        <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M7 3v18M7 7l10 5-10 5M7 12h10" />
        </svg>
      ),
    },
    {
      name: 'DEFENSE',
      value: stats.defense,
      max: 15,
      description: 'Reduces all incoming damage taken. In VIZMOTION AI, ensures 60 FPS playback stability and eliminates frame drops during export.',
      icon: (
        <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      name: 'VITALITY',
      value: stats.vitality,
      max: 15,
      description: 'Increases maximum Health and decreases the severity of hit reactions. In VIZMOTION AI, maximizes viewer retention curves across TikTok/Reels.',
      icon: (
        <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
    },
    {
      name: 'LUCK',
      value: stats.luck,
      max: 15,
      description: 'Increases XP and Hacksilver gains, as well as activation chance for equipment perks. In VIZMOTION AI, improves algorithmic virality indexing.',
      icon: (
        <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
          <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
          <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
          <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'COOLDOWN',
      value: stats.cooldown,
      max: 15,
      description: 'Reduces recharge time of Runic Attacks, Summons, and Talismans. In VIZMOTION AI, accelerates timeline rendering and cloud export pipeline.',
      icon: (
        <svg className="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative w-72 sm:w-80 select-none shrink-0">
      <div className="rounded bg-gradient-to-b from-slate-900/90 via-[#0b131c]/90 to-[#080d14]/95 border border-[#3b5368]/50 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-md">
        
        {/* Top Diamond Level Crest & Health Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
          <div className="flex-1 mr-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-cinzel text-xs font-bold text-slate-300 tracking-wider">
                HP {stats.hp} / {stats.maxHp}
              </span>
              <span className="text-[10px] font-mono text-emerald-400">100% BUFFER</span>
            </div>
            
            {/* Health Bar Track */}
            <div className="h-2 w-full bg-slate-950 border border-slate-700/80 rounded-sm overflow-hidden p-[1px]">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-white shadow-[0_0_8px_rgba(52,211,153,0.8)] transition-all duration-300"
                style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }}
              />
            </div>
          </div>

          {/* Level Crest Diamond */}
          <div className="relative w-11 h-11 rotate-45 border-2 border-slate-200 bg-slate-900 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <span className="-rotate-45 font-cinzel text-base font-black text-slate-100">
              {stats.level === 1 ? 'I' : stats.level === 2 ? 'II' : stats.level === 3 ? 'III' : stats.level === 4 ? 'IV' : 'V'}
            </span>
          </div>
        </div>

        {/* Stat Meters List */}
        <div className="mt-4 space-y-2.5">
          {statItems.map((stat) => {
            const pct = Math.min(100, Math.max(0, (stat.value / stat.max) * 100));
            return (
              <div key={stat.name} className="flex items-center gap-2.5">
                {/* Icon Socket */}
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  {stat.icon}
                </div>

                {/* Stat Name */}
                <span className="w-24 font-cinzel text-[11px] font-bold tracking-widest text-slate-300 shrink-0">
                  {stat.name}
                </span>

                {/* Gauge Meter Track matching God of War */}
                <div className="flex-1 h-3 bg-slate-950/90 border border-slate-700/70 rounded-[1px] relative overflow-hidden flex items-center px-0.5">
                  <div
                    className="h-2 bg-gradient-to-r from-slate-400 via-slate-200 to-white shadow-[0_0_6px_rgba(255,255,255,0.4)] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                  {/* Subtle segmented markings */}
                  <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
                    <div className="w-[1px] h-full bg-slate-400" />
                    <div className="w-[1px] h-full bg-slate-400" />
                    <div className="w-[1px] h-full bg-slate-400" />
                    <div className="w-[1px] h-full bg-slate-400" />
                  </div>
                </div>

                {/* Value number */}
                <span className="w-6 text-right font-cinzel text-xs font-bold text-slate-100 tabular-nums shrink-0">
                  {stat.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Toggle / Descriptions Prompt */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-end">
          <button
            onClick={toggleDescriptions}
            className="group flex items-center gap-1.5 text-xs font-cinzel font-semibold text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <div className="w-4 h-4 rounded-full border border-slate-500 group-hover:border-amber-400 flex items-center justify-center text-[10px]">
              R3
            </div>
            <span>{showDescriptions ? 'HIDE DESCRIPTIONS' : 'SHOW DESCRIPTIONS'}</span>
          </button>
        </div>

        {/* Detailed Lore & Engine Descriptions Flyout */}
        {showDescriptions && (
          <div className="mt-3 p-3 bg-slate-950/90 border border-amber-500/40 rounded space-y-2 animate-fadeIn max-h-56 overflow-y-auto">
            <h4 className="font-cinzel text-xs font-bold text-amber-300 border-b border-amber-500/30 pb-1">
              ENGINE ATTRIBUTES (VIZMOTION AI)
            </h4>
            {statItems.map((s) => (
              <div key={s.name} className="text-[11px] leading-snug">
                <span className="font-cinzel font-bold text-slate-200">{s.name}: </span>
                <span className="text-slate-400">{s.description}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
