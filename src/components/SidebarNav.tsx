import React, { useState } from 'react';
import { SidebarTab, TimelineClip, AudioTrack } from '../types';
import { sounds } from '../utils/audioSynth';

interface SidebarNavProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  clips: TimelineClip[];
  audioTrack: AudioTrack;
  onAddClipToTimeline: (clip: Partial<TimelineClip>) => void;
  onApplyEffect: (effectName: string) => void;
  onApplyTransition: (transitionName: string) => void;
  onApplyColorPreset: (presetName: string) => void;
  onOpenImportModal: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  clips,
  audioTrack,
  onAddClipToTimeline,
  onApplyEffect,
  onApplyTransition,
  onApplyColorPreset,
  onOpenImportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const TABS: { id: SidebarTab; label: string; icon: string }[] = [
    { id: 'media', label: 'Media', icon: '📁' },
    { id: 'audio', label: 'Audio', icon: '🎵' },
    { id: 'text', label: 'Text', icon: '🔤' },
    { id: 'captions', label: 'Captions', icon: '💬' },
    { id: 'effects', label: 'Effects', icon: '✨' },
    { id: 'transitions', label: 'Transitions', icon: '⚡' },
    { id: 'filters', label: 'Filters', icon: '🎨' },
    { id: 'color', label: 'Color', icon: '☀️' },
    { id: 'ai', label: 'AI Tools', icon: '🤖' },
    { id: 'templates', label: 'Templates', icon: '📐' },
  ];

  return (
    <aside className="relative z-30 flex h-full bg-[#0d1117] border-r border-slate-800/80 shrink-0 select-none">
      {/* Icon Navigation Column */}
      <div className="w-16 bg-[#090d14] border-r border-slate-800/80 flex flex-col items-center py-2.5 space-y-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playSelect();
                onSelectTab(tab.id);
              }}
              className={`w-13 py-2 rounded-lg flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 text-sky-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              <span className="truncate w-full text-center px-1">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Expanded Content Drawer */}
      <div className="w-64 sm:w-72 bg-[#0d1117] flex flex-col h-full border-r border-slate-800/80 p-3.5 overflow-y-auto">
        
        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Media Library
              </h2>
              <button
                onClick={onOpenImportModal}
                className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-black text-[11px] font-semibold rounded cursor-pointer transition-all"
              >
                + Import
              </button>
            </div>

            {/* Upload Drag Area */}
            <div
              onClick={onOpenImportModal}
              className="p-3.5 rounded-lg border border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-900 hover:border-sky-500/80 text-center transition-all cursor-pointer"
            >
              <div className="text-xl mb-1">📥</div>
              <p className="text-xs font-medium text-slate-200">Upload Clips & Music</p>
              <p className="text-[10px] text-slate-500 mt-0.5">MP4, MOV, WEBM, MP3</p>
            </div>

            {/* Clips List */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Project Assets ({clips.length})
              </span>
              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {clips.map((clip) => (
                  <div
                    key={clip.id}
                    className="p-2 rounded bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between group"
                  >
                    <div className="truncate mr-2">
                      <p className="text-xs font-medium text-slate-200 truncate">{clip.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {clip.duration.toFixed(1)}s · {clip.score.overall} AI score
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playSelect();
                        onAddClipToTimeline(clip);
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-sky-500 hover:text-black text-[10px] font-medium text-slate-300 opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AUDIO TAB */}
        {activeTab === 'audio' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Audio & Beat DNA
              </h2>
              <span className="text-[10px] font-mono text-emerald-400">
                {audioTrack.bpm} BPM
              </span>
            </div>

            {/* Current Audio Card */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
              <p className="text-xs font-semibold text-sky-400">{audioTrack.title}</p>
              <p className="text-[10px] text-slate-400 font-mono">{audioTrack.artist}</p>
              <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {audioTrack.beatMarkers.length} Beats Mapped
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">
                  Drops Synced
                </span>
              </div>
            </div>

            {/* Stock Music Library */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Royalty-Free Tracks
              </span>
              {[
                { name: 'Valkyrie Drop', bpm: 128, genre: 'Electronic / EDM' },
                { name: 'Night Street Phonk', bpm: 130, genre: 'Phonk' },
                { name: 'Cinematic Dawn', bpm: 95, genre: 'Orchestral' },
                { name: 'Trap Momentum', bpm: 140, genre: 'Hip Hop / Trap' },
              ].map((trk) => (
                <div
                  key={trk.name}
                  className="p-2 rounded bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-medium text-slate-200">{trk.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{trk.genre} · {trk.bpm} BPM</p>
                  </div>
                  <button
                    onClick={() => sounds.playSelect()}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 rounded cursor-pointer"
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEXT & CAPTIONS TAB */}
        {(activeTab === 'text' || activeTab === 'captions') && (
          <div className="space-y-3.5">
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              {activeTab === 'text' ? 'Titles & Typography' : 'Auto Subtitles & Captions'}
            </h2>

            {activeTab === 'captions' && (
              <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-800/60 space-y-2">
                <p className="text-xs font-semibold text-sky-300">AI Speech-to-Text</p>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Automatically generate animated TikTok captions synchronized to speech and musical beats.
                </p>
                <button
                  onClick={() => {
                    sounds.playMakeItFire();
                    onAddClipToTimeline({
                      title: 'CAPTION: "Watch this drop..."',
                      trackId: 'T1',
                      startTime: 2,
                      duration: 4,
                      color: '#eab308',
                    });
                  }}
                  className="w-full py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold cursor-pointer transition-all"
                >
                  ⚡ Generate Auto-Captions
                </button>
              </div>
            )}

            {/* Typography Styles */}
            <div className="space-y-1.5">
              {[
                { title: 'Bold Kinetic Pop', desc: 'High energy animated social title' },
                { title: 'Cinematic Minimal', desc: 'Clean tracked serif with soft fade' },
                { title: 'Cyber Glitch Headline', desc: 'RGB split title with distortion' },
                { title: 'Lower Third Pro', desc: 'Broadcast speaker tag & bio' },
              ].map((style) => (
                <div
                  key={style.title}
                  onClick={() => {
                    sounds.playSelect();
                    onAddClipToTimeline({
                      title: style.title.toUpperCase(),
                      trackId: 'T1',
                      startTime: 1,
                      duration: 3,
                      color: '#f59e0b',
                    });
                  }}
                  className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
                >
                  <p className="text-xs font-bold text-slate-200">{style.title}</p>
                  <p className="text-[10px] text-slate-500">{style.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EFFECTS & TRANSITIONS TAB */}
        {(activeTab === 'effects' || activeTab === 'transitions') && (
          <div className="space-y-3.5">
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              {activeTab === 'effects' ? 'Visual Effects' : 'Seamless Transitions'}
            </h2>

            <div className="grid grid-cols-2 gap-2">
              {activeTab === 'effects'
                ? [
                    { name: 'Film Grain 35mm', cat: 'Texture' },
                    { name: 'RGB Split Glitch', cat: 'Distortion' },
                    { name: 'Camera Shake', cat: 'Motion' },
                    { name: 'Impact Flash', cat: 'Light' },
                    { name: 'Zoom Blur Pulse', cat: 'Motion' },
                    { name: 'Anamorphic Flare', cat: 'Light' },
                  ].map((fx) => (
                    <button
                      key={fx.name}
                      onClick={() => {
                        sounds.playSelect();
                        onApplyEffect(fx.name);
                      }}
                      className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-sky-500/60 text-left transition-all cursor-pointer"
                    >
                      <p className="text-xs font-semibold text-slate-200">{fx.name}</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">{fx.cat}</p>
                    </button>
                  ))
                : [
                    { name: 'Cross Dissolve', cat: 'Smooth' },
                    { name: 'Whip Pan', cat: 'Motion' },
                    { name: 'Zoom In Punch', cat: 'Impact' },
                    { name: 'Glitch Fade', cat: 'Digital' },
                    { name: 'Flash Impact', cat: 'Light' },
                    { name: 'Match Cut', cat: 'AI Direct' },
                  ].map((tr) => (
                    <button
                      key={tr.name}
                      onClick={() => {
                        sounds.playSelect();
                        onApplyTransition(tr.name);
                      }}
                      className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-sky-500/60 text-left transition-all cursor-pointer"
                    >
                      <p className="text-xs font-semibold text-slate-200">{tr.name}</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">{tr.cat}</p>
                    </button>
                  ))}
            </div>
          </div>
        )}

        {/* COLOR & FILTERS TAB */}
        {(activeTab === 'color' || activeTab === 'filters') && (
          <div className="space-y-3.5">
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Color Grading & LUTs
            </h2>

            <div className="space-y-2">
              {[
                { name: 'Cinematic Teal & Orange', desc: 'Blockbuster contrast with cool shadows' },
                { name: 'Moody Dark Shadow', desc: 'Subdued saturation, dramatic deep blacks' },
                { name: 'Golden Hour Film', desc: 'Warm vintage sunlight illumination' },
                { name: 'Cyberpunk Neon Matrix', desc: 'Vibrant blues and hyper-magenta highlights' },
                { name: 'B&W High Contrast Noir', desc: 'Classic monochrome silhouette look' },
              ].map((preset) => (
                <div
                  key={preset.name}
                  onClick={() => {
                    sounds.playSelect();
                    onApplyColorPreset(preset.name);
                  }}
                  className="p-2.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
                >
                  <p className="text-xs font-bold text-slate-200">{preset.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{preset.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI TOOLS TAB */}
        {activeTab === 'ai' && (
          <div className="space-y-3.5">
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              AI Creative Engine
            </h2>

            <div className="space-y-2">
              {[
                { name: 'Auto Beat-Sync Cutter', desc: 'Cuts clips to downbeats and tempo changes' },
                { name: 'Motion Match Optimizer', desc: 'Preserves camera vector momentum across cuts' },
                { name: 'Smart Reframe (16:9 → 9:16)', desc: 'Keeps subjects centered for vertical video' },
                { name: 'AI Hook Identifier', desc: 'Finds top 3 seconds of footage for the intro' },
                { name: 'One-Click Background Remove', desc: 'Isolates people without greenscreen' },
              ].map((tool) => (
                <div
                  key={tool.name}
                  onClick={() => {
                    sounds.playMakeItFire();
                    onApplyEffect(tool.name);
                  }}
                  className="p-2.5 rounded bg-slate-900 border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-amber-300">{tool.name}</p>
                    <span className="text-[9px] font-mono text-sky-400">AI</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="space-y-3.5">
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Project Templates
            </h2>

            <div className="space-y-2">
              {[
                { name: 'Viral TikTok 9:16', desc: 'Fast pacing with animated captions' },
                { name: 'Luxury Commercial 30s', desc: 'Smooth slow-mo with minimal typography' },
                { name: 'Music Video Visualizer', desc: 'Beat-reactive effects and hard drop cuts' },
                { name: 'YouTube Cinema 16:9', desc: 'Epic widescreen pacing with letterboxing' },
              ].map((tmpl) => (
                <div
                  key={tmpl.name}
                  onClick={() => sounds.playSelect()}
                  className="p-2.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
                >
                  <p className="text-xs font-bold text-slate-200">{tmpl.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{tmpl.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};
