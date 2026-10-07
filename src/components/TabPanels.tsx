import React from 'react';
import { MainTab, EditingStyle } from '../types';
import { sounds } from '../utils/audioSynth';

interface TabPanelsProps {
  activeTab: MainTab;
  currentStyle: EditingStyle;
  onSelectStyle: (style: EditingStyle) => void;
  onOpenMakeItFire: () => void;
  onOpenExport: () => void;
}

export const TabPanels: React.FC<TabPanelsProps> = ({
  activeTab,
  currentStyle,
  onSelectStyle,
  onOpenMakeItFire,
  onOpenExport,
}) => {
  if (activeTab === 'WEAPONS') return null; // Default main loadout view

  return (
    <div className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-xl p-8 overflow-y-auto animate-fadeIn select-none">
      <div className="max-w-5xl mx-auto">
        
        {/* ARMOR TAB: EFFECTS & COLOR GRADE */}
        {activeTab === 'ARMOR' && (
          <div className="space-y-6">
            <div className="border-b border-amber-500/40 pb-3">
              <h2 className="font-cinzel text-xl font-black text-amber-300 tracking-wider">
                ARMOR // VISUAL EFFECTS & COLOR GRADING
              </h2>
              <p className="text-xs text-slate-400 mt-1 italic">
                Equip protective and decorative visual layers to alter the atmosphere of your video edits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Chest Armor: Color Grade */}
              <div className="norse-card p-4 rounded border border-slate-700 space-y-2">
                <span className="text-[10px] font-cinzel text-amber-400 font-bold block">CHEST ARMOR</span>
                <h4 className="font-cinzel text-sm font-bold text-slate-100">BREASTPLATE OF FROST</h4>
                <p className="text-xs text-slate-300">
                  Applies a cold Scandinavian Teal & Orange LUT with heightened contrast and deep blue shadows.
                </p>
                <div className="pt-2 text-[10px] font-mono text-emerald-400">
                  +4 DEFENSE · +3 VITALITY
                </div>
              </div>

              {/* Wrist Armor: Motion Effects */}
              <div className="norse-card p-4 rounded border border-slate-700 space-y-2">
                <span className="text-[10px] font-cinzel text-sky-400 font-bold block">WRIST ARMOR</span>
                <h4 className="font-cinzel text-sm font-bold text-slate-100">BRACERS OF THE VALKYRIE</h4>
                <p className="text-xs text-slate-300">
                  Triggers directional whip pans and high-velocity motion blur on fast drum rolls.
                </p>
                <div className="pt-2 text-[10px] font-mono text-emerald-400">
                  +5 STRENGTH · +2 COOLDOWN
                </div>
              </div>

              {/* Waist Armor: Particle Aura */}
              <div className="norse-card p-4 rounded border border-slate-700 space-y-2">
                <span className="text-[10px] font-cinzel text-purple-400 font-bold block">WAIST ARMOR</span>
                <h4 className="font-cinzel text-sm font-bold text-slate-100">WAR BELT OF SURTR</h4>
                <p className="text-xs text-slate-300">
                  Emits subtle floating frost particles and fiery spark embers during musical drops.
                </p>
                <div className="pt-2 text-[10px] font-mono text-emerald-400">
                  +4 RUNIC · +3 LUCK
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SKILLS TAB: AI DIRECTING SKILL TREE */}
        {activeTab === 'SKILLS' && (
          <div className="space-y-6">
            <div className="border-b border-amber-500/40 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-cinzel text-xl font-black text-amber-300 tracking-wider">
                  SKILLS // AI DIRECTING CAPABILITIES
                </h2>
                <p className="text-xs text-slate-400 mt-1 italic">
                  Unlock and master AI editing disciplines for automated beat-sync and storytelling.
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playMakeItFire();
                  onOpenMakeItFire();
                }}
                className="px-4 py-2 rounded bg-amber-500 text-black font-cinzel font-bold text-xs hover:bg-amber-400 cursor-pointer"
              >
                TEST IN MAKE IT FIRE 🔥
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'SUB-FRAME BEAT SNAPPING', tier: 'TIER 3', desc: 'Aligns 100% of cuts to musical beats and bass hits within ±12 milliseconds.' },
                { title: 'MOTION MATCH CUTTING', tier: 'TIER 2', desc: 'Analyzes optical flow vectors to create seamless transitions across object movement.' },
                { title: 'AI HOOK IDENTIFIER', tier: 'TIER 3', desc: 'Detects the most visually energetic 1.5–3 seconds of footage to position as opening hook.' },
                { title: 'DYNAMIC SPEED RAMPING', tier: 'TIER 2', desc: 'Automatically slows action to 40% before impact and ramps to 150% after beat drops.' },
              ].map((skill) => (
                <div key={skill.title} className="norse-card p-4 rounded border border-slate-700 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-cinzel text-amber-400 font-bold block">{skill.tier}</span>
                    <h4 className="font-cinzel text-sm font-bold text-slate-100">{skill.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{skill.desc}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/60 text-[10px] font-mono text-emerald-300 shrink-0">
                    MASTERED
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAP TAB: CONTENT REPURPOSING */}
        {activeTab === 'MAP' && (
          <div className="space-y-6">
            <div className="border-b border-amber-500/40 pb-3">
              <h2 className="font-cinzel text-xl font-black text-amber-300 tracking-wider">
                MAP // CONTENT REPURPOSING REALM
              </h2>
              <p className="text-xs text-slate-400 mt-1 italic">
                From 1 Raw Timeline → Generate an entire multi-platform content campaign across the 9 realms.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { realm: 'MIDGARD (16:9)', target: 'YOUTUBE CINEMA', count: '1 MASTER VIDEO', desc: 'Full length director’s cut with 4K color grade.' },
                { realm: 'ALFHEIM (9:16)', target: 'TIKTOK & REELS', count: '5 SHORTS / TIKTOKS', desc: 'Fast-paced, hook-optimized vertical segments.' },
                { realm: 'NIFLHEIM (1:1)', target: 'INSTAGRAM FEED', count: '3 SQUARE CAROUSELS', desc: 'High visual density square formats.' },
                { realm: 'MUSPELHEIM (9:16)', target: 'TRAILER / TEASER', count: '1 IMPACT TEASER', desc: '15-second high energy promotional cut.' },
              ].map((realm) => (
                <div key={realm.realm} className="norse-card p-4 rounded border border-slate-700 space-y-2">
                  <span className="text-[10px] font-cinzel text-sky-400 font-bold block">{realm.realm}</span>
                  <h4 className="font-cinzel text-sm font-bold text-slate-100">{realm.target}</h4>
                  <div className="text-xs font-mono text-amber-400">{realm.count}</div>
                  <p className="text-xs text-slate-400 leading-snug">{realm.desc}</p>
                  <button
                    onClick={() => {
                      sounds.playSelect();
                      onOpenExport();
                    }}
                    className="w-full mt-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-cinzel text-slate-200 rounded cursor-pointer"
                  >
                    EXPORT REALM
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GOALS TAB: ACCEPTANCE GATES */}
        {activeTab === 'GOALS' && (
          <div className="space-y-6">
            <div className="border-b border-amber-500/40 pb-3">
              <h2 className="font-cinzel text-xl font-black text-amber-300 tracking-wider">
                GOALS // PRODUCTION ACCEPTANCE GATES
              </h2>
              <p className="text-xs text-slate-400 mt-1 italic">
                PRD Quality Gates and verification benchmarks.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { title: 'GATE 1: MULTI-TRACK TIMELINE & RUNIC ENGINE', status: 'COMPLETE', desc: 'Video, audio, text, and runic tracks functioning at frame-level precision.' },
                { title: 'GATE 2: BEAT DNA & 128 BPM SYNCHRONIZATION', status: 'COMPLETE', desc: 'Beat markers aligned within ±100ms with real Web Audio synthesis.' },
                { title: 'GATE 3: MAKE IT FIRE ONE-CLICK DIRECTING', status: 'COMPLETE', desc: 'Clip scoring, motion matching, and automated pacing verified.' },
                { title: 'GATE 4: CLEAN EXPORT WITHOUT WATERMARKS', status: 'COMPLETE', desc: 'Direct MP4 rendering with multiple aspect ratios (9:16, 16:9, 1:1).' },
              ].map((goal, idx) => (
                <div key={idx} className="norse-card p-3 rounded border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-slate-200">{goal.title}</h4>
                    <p className="text-[11px] text-slate-400">{goal.desc}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-[10px] font-mono text-emerald-300 font-bold shrink-0">
                    {goal.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CODEX TAB: LORE & PRESETS */}
        {activeTab === 'CODEX' && (
          <div className="space-y-6">
            <div className="border-b border-amber-500/40 pb-3">
              <h2 className="font-cinzel text-xl font-black text-amber-300 tracking-wider">
                CODEX // EDITING PRESETS & BEAT LORE
              </h2>
              <p className="text-xs text-slate-400 mt-1 italic">
                Knowledge repository of musical genres, cutting rules, and cinematic techniques.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="norse-card p-4 rounded border border-slate-700 space-y-2">
                <h4 className="font-cinzel text-sm font-bold text-amber-300">RULE OF RHYTHMIC CUTTING</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fast tempo music mandates shorter shot lengths (0.5s–1.5s), while emotional interludes require lingering establishing frames (3s–5s). The downbeat must always be respected with a visual accent or transition.
                </p>
              </div>

              <div className="norse-card p-4 rounded border border-slate-700 space-y-2">
                <h4 className="font-cinzel text-sm font-bold text-amber-300">OPTICAL MOTION MATCHING</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When a subject exits camera left, the following shot should preserve leftward vector velocity (Left → Left → Left) to maintain spatial momentum, unless an intentional jarring contrast is required.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* RESOURCES TAB: MEDIA LIBRARY & IMPORTS */}
        {activeTab === 'RESOURCES' && (
          <div className="space-y-6">
            <div className="border-b border-amber-500/40 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-cinzel text-xl font-black text-amber-300 tracking-wider">
                  RESOURCES // MEDIA LIBRARY & RIGHTS MANAGEMENT
                </h2>
                <p className="text-xs text-slate-400 mt-1 italic">
                  Rights-aware media acquisition, raw video clips, and audio stems.
                </p>
              </div>
              <label className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-black font-cinzel font-bold text-xs rounded cursor-pointer transition-all">
                + UPLOAD RAW FOOTAGE
                <input type="file" multiple accept="video/*,audio/*" className="hidden" onChange={() => sounds.playEquip()} />
              </label>
            </div>

            {/* Media list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'MOUNTAIN_PEAK_4K.MOV', type: 'VIDEO', dur: '00:12', res: '3840x2160', score: 98 },
                { name: 'AXE_COMBAT_60FPS.MP4', type: 'VIDEO', dur: '00:08', res: '1920x1080', score: 99 },
                { name: 'ARCHER_VALLEY_DRONE.MP4', type: 'VIDEO', dur: '00:15', res: '3840x2160', score: 94 },
                { name: 'BIFROST_BEAT_STEMS.WAV', type: 'AUDIO', dur: '00:48', res: '24-bit 48kHz', score: 100 },
              ].map((res) => (
                <div key={res.name} className="norse-card p-3 rounded border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>{res.type}</span>
                    <span className="text-amber-400">{res.res}</span>
                  </div>
                  <h5 className="font-cinzel text-xs font-bold text-slate-200 truncate">{res.name}</h5>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1">
                    <span>DUR: {res.dur}</span>
                    <span className="text-emerald-400">SCORE: {res.score}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
