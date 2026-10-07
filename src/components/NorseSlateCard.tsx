import React from 'react';
import { WeaponLoadout, RunicGem, GripPommel } from '../types';
import { sounds } from '../utils/audioSynth';
import { AVAILABLE_LIGHT_RUNICS, AVAILABLE_HEAVY_RUNICS, AVAILABLE_GRIPS } from '../data/mockData';

interface NorseSlateCardProps {
  loadout: WeaponLoadout;
  selectedSlot: 'weapon' | 'lightRunic' | 'heavyRunic' | 'grip';
  onEquipLightRunic: (gem: RunicGem | null) => void;
  onEquipHeavyRunic: (gem: RunicGem | null) => void;
  onEquipGrip: (grip: GripPommel) => void;
  onUpgradeWeapon: () => void;
}

export const NorseSlateCard: React.FC<NorseSlateCardProps> = ({
  loadout,
  selectedSlot,
  onEquipLightRunic,
  onEquipHeavyRunic,
  onEquipGrip,
  onUpgradeWeapon,
}) => {
  return (
    <div className="relative w-80 sm:w-96 select-none shrink-0">
      {/* Stone Slate Container matching God of War 2018 */}
      <div className="relative rounded bg-gradient-to-b from-slate-900/95 via-[#0b131c]/95 to-[#080d14]/98 border border-[#3b5368]/60 shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-4 backdrop-blur-md overflow-hidden">
        
        {/* Subtle Norse ornamental scrollwork background watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Slate Top Header Bar */}
        <div className="relative flex items-center justify-between pb-3 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <h2 className="font-cinzel text-base sm:text-lg font-extrabold tracking-widest text-slate-100">
              {loadout.name}
            </h2>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-cinzel font-bold tracking-wider text-sky-200 bg-sky-950/70 border border-sky-400/50 uppercase rounded">
            EQUIPPED
          </span>
        </div>

        {/* Flavour & Lore text */}
        <p className="mt-2.5 text-xs text-slate-300/90 leading-relaxed italic">
          "{loadout.description}"
        </p>
        <p className="mt-1 text-[11px] text-sky-300/70">
          {loadout.lore}
        </p>

        {/* Level Diamond & Primary Stat (Strength) */}
        <div className="mt-4 flex items-center justify-between p-3 rounded bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-950/90 border border-slate-700/50">
          <div className="flex items-center gap-3">
            {/* Level Diamond Badge */}
            <div className="relative w-10 h-10 rotate-45 border-2 border-slate-300 bg-slate-900 flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.15)]">
              <span className="-rotate-45 font-cinzel text-sm font-black text-slate-100">
                {loadout.level === 1 ? 'I' : loadout.level === 2 ? 'II' : loadout.level === 3 ? 'III' : loadout.level === 4 ? 'IV' : 'V'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-cinzel tracking-widest text-slate-400">
                LVL {loadout.level} · POWER
              </span>
              <span className="font-cinzel text-xl font-black text-slate-100 tracking-wider">
                STRENGTH
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-cinzel text-3xl font-black text-slate-100 tabular-nums">
              {loadout.strength}
            </span>
            <button
              onClick={() => {
                sounds.playEquip();
                onUpgradeWeapon();
              }}
              title="Upgrade Leviathan Axe / Enhance Timeline Precision"
              className="px-2 py-1 text-[10px] font-cinzel font-bold text-amber-300 bg-amber-950/60 border border-amber-500/60 hover:bg-amber-900/60 hover:scale-105 active:scale-95 transition-all cursor-pointer rounded"
            >
              UPGRADE +1
            </button>
          </div>
        </div>

        {/* Section 1: LIGHT RUNIC ATTACK */}
        <div className="mt-4 border-t border-slate-700/50 pt-3">
          <div className="flex items-center justify-between text-[11px] font-cinzel font-bold text-slate-300 tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rotate-45 bg-sky-400" />
              LIGHT RUNIC ATTACK : {loadout.lightRunic ? loadout.lightRunic.name : 'EMPTY'}
            </span>
            {loadout.lightRunic && (
              <button
                onClick={() => {
                  sounds.playSelect();
                  onEquipLightRunic(null);
                }}
                className="text-[10px] text-red-400 hover:text-red-300 underline cursor-pointer"
              >
                UNEQUIP
              </button>
            )}
          </div>

          {/* Table Header & Rows */}
          <div className="grid grid-cols-3 gap-1 text-center bg-slate-950/70 border border-slate-800/80 rounded p-1.5 text-[10px] font-cinzel">
            <div className="text-slate-400 border-r border-slate-800">
              <span className="block text-[9px] text-slate-500">LEVEL</span>
              <span className="font-bold text-slate-200">
                {loadout.lightRunic ? loadout.lightRunic.level : '--'}
              </span>
            </div>
            <div className="text-slate-400 border-r border-slate-800">
              <span className="block text-[9px] text-slate-500">TYPE</span>
              <span className="font-bold text-slate-200 truncate block px-0.5">
                {loadout.lightRunic ? loadout.lightRunic.type : '--'}
              </span>
            </div>
            <div className="text-slate-400">
              <span className="block text-[9px] text-slate-500">COOLDOWN</span>
              <span className="font-bold text-slate-200">
                {loadout.lightRunic ? `${loadout.lightRunic.cooldown}s` : '--'}
              </span>
            </div>
          </div>

          {/* Quick Equip Selector for Light Runic */}
          {selectedSlot === 'lightRunic' && (
            <div className="mt-2.5 p-2 bg-sky-950/40 border border-sky-600/40 rounded space-y-1.5 animate-fadeIn">
              <span className="block text-[10px] font-cinzel font-bold text-sky-300">
                SELECT LIGHT RUNIC GEM (AI TRANSITION):
              </span>
              {AVAILABLE_LIGHT_RUNICS.map((gem) => (
                <button
                  key={gem.id}
                  onClick={() => {
                    sounds.playEquip();
                    onEquipLightRunic(gem);
                  }}
                  className={`w-full text-left p-1.5 rounded text-[11px] flex items-center justify-between transition-all cursor-pointer ${
                    loadout.lightRunic?.id === gem.id
                      ? 'bg-sky-600/40 text-white border border-sky-400'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div>
                    <span className="font-bold font-cinzel">{gem.name}</span>
                    <span className="block text-[10px] text-sky-300/80">{gem.type}</span>
                  </div>
                  <span className="text-[10px] font-mono text-sky-200">{gem.cooldown}s CD</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: HEAVY RUNIC ATTACK */}
        <div className="mt-3 border-t border-slate-700/50 pt-3">
          <div className="flex items-center justify-between text-[11px] font-cinzel font-bold text-slate-300 tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rotate-45 bg-indigo-400" />
              HEAVY RUNIC ATTACK : {loadout.heavyRunic ? loadout.heavyRunic.name : 'EMPTY'}
            </span>
            {loadout.heavyRunic && (
              <button
                onClick={() => {
                  sounds.playSelect();
                  onEquipHeavyRunic(null);
                }}
                className="text-[10px] text-red-400 hover:text-red-300 underline cursor-pointer"
              >
                UNEQUIP
              </button>
            )}
          </div>

          {/* Table Header & Rows */}
          <div className="grid grid-cols-3 gap-1 text-center bg-slate-950/70 border border-slate-800/80 rounded p-1.5 text-[10px] font-cinzel">
            <div className="text-slate-400 border-r border-slate-800">
              <span className="block text-[9px] text-slate-500">LEVEL</span>
              <span className="font-bold text-slate-200">
                {loadout.heavyRunic ? loadout.heavyRunic.level : '--'}
              </span>
            </div>
            <div className="text-slate-400 border-r border-slate-800">
              <span className="block text-[9px] text-slate-500">TYPE</span>
              <span className="font-bold text-slate-200 truncate block px-0.5">
                {loadout.heavyRunic ? loadout.heavyRunic.type : '--'}
              </span>
            </div>
            <div className="text-slate-400">
              <span className="block text-[9px] text-slate-500">COOLDOWN</span>
              <span className="font-bold text-slate-200">
                {loadout.heavyRunic ? `${loadout.heavyRunic.cooldown}s` : '--'}
              </span>
            </div>
          </div>

          {/* Quick Equip Selector for Heavy Runic */}
          {selectedSlot === 'heavyRunic' && (
            <div className="mt-2.5 p-2 bg-indigo-950/40 border border-indigo-600/40 rounded space-y-1.5 animate-fadeIn">
              <span className="block text-[10px] font-cinzel font-bold text-indigo-300">
                SELECT HEAVY RUNIC GEM (DROP VFX & IMPACT):
              </span>
              {AVAILABLE_HEAVY_RUNICS.map((gem) => (
                <button
                  key={gem.id}
                  onClick={() => {
                    sounds.playEquip();
                    onEquipHeavyRunic(gem);
                  }}
                  className={`w-full text-left p-1.5 rounded text-[11px] flex items-center justify-between transition-all cursor-pointer ${
                    loadout.heavyRunic?.id === gem.id
                      ? 'bg-indigo-600/40 text-white border border-indigo-400'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div>
                    <span className="font-bold font-cinzel">{gem.name}</span>
                    <span className="block text-[10px] text-indigo-300/80">{gem.type}</span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-200">{gem.cooldown}s CD</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: POMMEL / GRIP */}
        <div className="mt-3 border-t border-slate-700/50 pt-2.5">
          <div className="flex items-center justify-between">
            <span className="font-cinzel text-[11px] font-bold text-emerald-300 tracking-wider">
              {loadout.grip ? loadout.grip.name : 'WOODEN GRIP'}
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-400">
              {loadout.grip ? loadout.grip.statBonus : 'STR 1'}
            </span>
          </div>

          {/* Quick Equip Selector for Grip */}
          {selectedSlot === 'grip' && (
            <div className="mt-2.5 p-2 bg-emerald-950/40 border border-emerald-600/40 rounded space-y-1.5 animate-fadeIn">
              <span className="block text-[10px] font-cinzel font-bold text-emerald-300">
                SELECT POMMEL / GRIP (COLOR ENGINE & STABILITY):
              </span>
              {AVAILABLE_GRIPS.map((grp) => (
                <button
                  key={grp.id}
                  onClick={() => {
                    sounds.playEquip();
                    onEquipGrip(grp);
                  }}
                  className={`w-full text-left p-1.5 rounded text-[11px] flex items-center justify-between transition-all cursor-pointer ${
                    loadout.grip?.id === grp.id
                      ? 'bg-emerald-600/40 text-white border border-emerald-400'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div>
                    <span className="font-bold font-cinzel">{grp.name}</span>
                    <span className="block text-[10px] text-emerald-300/80">{grp.statBonus}</span>
                  </div>
                  <span className="text-[10px] font-cinzel text-emerald-200">LVL {grp.level}</span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
