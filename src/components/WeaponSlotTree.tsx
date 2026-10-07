import React from 'react';
import { WeaponLoadout } from '../types';
import { sounds } from '../utils/audioSynth';

interface WeaponSlotTreeProps {
  loadout: WeaponLoadout;
  selectedSlot: 'weapon' | 'lightRunic' | 'heavyRunic' | 'grip';
  onSelectSlot: (slot: 'weapon' | 'lightRunic' | 'heavyRunic' | 'grip') => void;
  onSwitchWeapon: () => void;
}

export const WeaponSlotTree: React.FC<WeaponSlotTreeProps> = ({
  loadout,
  selectedSlot,
  onSelectSlot,
  onSwitchWeapon,
}) => {
  return (
    <div className="relative flex flex-col items-center select-none w-28 shrink-0">
      {/* Top Weapon Category Badge */}
      <div className="flex flex-col items-center mb-3">
        <button
          onClick={() => {
            sounds.playSelect();
            onSwitchWeapon();
          }}
          title="Click to Switch Weapon (Leviathan Axe / Blades of Chaos)"
          className="w-10 h-10 rounded-full border border-amber-400/80 bg-slate-900/90 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {loadout.category === 'axe' ? (
            <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2L6 10l4 4 8-8L14 2z" />
              <path d="M10 14L3 21" />
              <path d="M17 5l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 3l-6 6 3 3 6-6-3-3z" />
              <path d="M12 9L5 16l3 3 7-7" />
              <circle cx="4" cy="20" r="2" />
            </svg>
          )}
        </button>
        <span className="font-cinzel text-[11px] font-bold tracking-widest text-slate-300 mt-1">
          WEAPON
        </span>
      </div>

      {/* Primary Weapon Socket Frame */}
      <div className="relative">
        <button
          onClick={() => {
            sounds.playSelect();
            onSelectSlot('weapon');
          }}
          className={`relative w-20 h-20 rounded bg-gradient-to-b from-slate-900/95 to-slate-950/95 flex items-center justify-center transition-all cursor-pointer ${
            selectedSlot === 'weapon'
              ? 'border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105'
              : 'border border-slate-600/80 hover:border-amber-400/60'
          }`}
        >
          {/* Subtle Norse inner border */}
          <div className="absolute inset-1 border border-amber-500/20 pointer-events-none" />
          
          {/* Axe or Blades SVG representation */}
          {loadout.category === 'axe' ? (
            <div className="relative flex flex-col items-center">
              <svg className="w-10 h-10 text-sky-200 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]" viewBox="0 0 48 48" fill="none">
                <path d="M12 36L34 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M30 10C34 6 42 8 40 16C36 24 30 22 28 18L30 10Z" fill="rgba(56,189,248,0.25)" stroke="#7dd3fc" strokeWidth="2" />
                <path d="M35 12L32 17" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="12" cy="36" r="2" fill="#d97706" />
              </svg>
            </div>
          ) : (
            <div className="relative flex flex-col items-center">
              <svg className="w-10 h-10 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" viewBox="0 0 48 48" fill="none">
                <path d="M16 12C24 8 36 12 34 22C30 30 20 28 18 20L16 12Z" fill="rgba(239,68,68,0.3)" stroke="#f87171" strokeWidth="2" />
                <path d="M18 20L28 36" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
                <circle cx="28" cy="36" r="3" stroke="#f59e0b" strokeWidth="2" />
              </svg>
            </div>
          )}

          {/* Golden Corner Accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-400" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-400" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-400" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-400" />
        </button>

        {/* Horizontal glowing filament into the slate card */}
        {selectedSlot === 'weapon' && (
          <div className="absolute top-1/2 -right-8 w-8 h-[2px] runic-line-h pointer-events-none" />
        )}
      </div>

      {/* Vertical Connecting Runic Line 1 */}
      <div className="w-[2px] h-8 runic-line-v my-1" />

      {/* Diamond Socket 1: Light Runic Attack */}
      <div className="relative">
        <button
          onClick={() => {
            sounds.playSelect();
            onSelectSlot('lightRunic');
          }}
          title="Light Runic Attack (AI Transition & Hook Gem)"
          className={`relative w-12 h-12 rotate-45 rounded bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center transition-all cursor-pointer ${
            selectedSlot === 'lightRunic'
              ? 'border-2 border-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.6)] scale-110'
              : 'border border-slate-600/80 hover:border-sky-400/60'
          }`}
        >
          <div className="-rotate-45 flex items-center justify-center">
            {loadout.lightRunic ? (
              <div className="w-5 h-5 rounded-full bg-sky-400/30 border border-sky-300 flex items-center justify-center shadow-[0_0_10px_rgba(56,189,248,0.8)]">
                <span className="text-[10px] font-cinzel font-bold text-sky-200">ᚱ</span>
              </div>
            ) : (
              <div className="w-2.5 h-2.5 bg-slate-700/60 rounded-full" />
            )}
          </div>
        </button>
        {selectedSlot === 'lightRunic' && (
          <div className="absolute top-1/2 -right-12 w-12 h-[2px] runic-line-h pointer-events-none" />
        )}
      </div>

      {/* Vertical Connecting Runic Line 2 */}
      <div className="w-[2px] h-8 runic-line-v my-1" />

      {/* Diamond Socket 2: Heavy Runic Attack */}
      <div className="relative">
        <button
          onClick={() => {
            sounds.playSelect();
            onSelectSlot('heavyRunic');
          }}
          title="Heavy Runic Attack (Beat Drop VFX & Speed Ramp)"
          className={`relative w-12 h-12 rotate-45 rounded bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center transition-all cursor-pointer ${
            selectedSlot === 'heavyRunic'
              ? 'border-2 border-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.6)] scale-110'
              : 'border border-slate-600/80 hover:border-sky-400/60'
          }`}
        >
          <div className="-rotate-45 flex items-center justify-center">
            {loadout.heavyRunic ? (
              <div className="w-5 h-5 rounded-full bg-indigo-500/30 border border-indigo-300 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.8)]">
                <span className="text-[10px] font-cinzel font-bold text-indigo-200">ᚦ</span>
              </div>
            ) : (
              <div className="w-2.5 h-2.5 bg-slate-700/60 rounded-full" />
            )}
          </div>
        </button>
        {selectedSlot === 'heavyRunic' && (
          <div className="absolute top-1/2 -right-12 w-12 h-[2px] runic-line-h pointer-events-none" />
        )}
      </div>

      {/* Vertical Connecting Runic Line 3 */}
      <div className="w-[2px] h-8 runic-line-v my-1" />

      {/* Square Socket 3: Wooden Grip / Pommel */}
      <div className="relative">
        <button
          onClick={() => {
            sounds.playSelect();
            onSelectSlot('grip');
          }}
          title="Pommel / Grip (Color Grading LUT & Frame Rate Engine)"
          className={`relative w-11 h-11 rounded bg-gradient-to-b from-emerald-950/80 to-slate-950 flex items-center justify-center transition-all cursor-pointer ${
            selectedSlot === 'grip'
              ? 'border-2 border-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.5)] scale-110'
              : 'border border-emerald-700/60 hover:border-emerald-400/60'
          }`}
        >
          <div className="w-6 h-6 rounded bg-emerald-900/60 border border-emerald-400/80 flex items-center justify-center">
            <span className="text-xs font-cinzel font-bold text-emerald-300">ᛉ</span>
          </div>
        </button>
        {selectedSlot === 'grip' && (
          <div className="absolute top-1/2 -right-12 w-12 h-[2px] runic-line-h pointer-events-none" />
        )}
      </div>
    </div>
  );
};
