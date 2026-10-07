import React, { useState } from 'react';
import { SidebarTab, TimelineClip, AudioTrack, CaptionPreset, RepurposeCard } from '../types';
import { AI_MODELS_REGISTRY, DEMO_REPURPOSE_CARDS } from '../data/mockData';
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
  onOpenModelOrchestrator: () => void;
  activeCaptionStyle: CaptionPreset;
  onSelectCaptionStyle: (style: CaptionPreset) => void;
  onSelectRepurpose: (card: RepurposeCard) => void;
  onToggleStemMute: (stemId: string) => void;
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
  onOpenModelOrchestrator,
  activeCaptionStyle,
  onSelectCaptionStyle,
  onSelectRepurpose,
  onToggleStemMute,
}) => {
  const [isGeneratingStems, setIsGeneratingStems] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);

  const TABS: { id: SidebarTab; label: string; icon: string }[] = [
    { id: 'media', label: 'Media', icon: '📁' },
    { id: 'audio', label: 'Audio', icon: '🎵' },
    { id: 'captions', label: 'Captions', icon: '💬' },
    { id: 'models', label: 'Models', icon: '⚡' },
    { id: 'repurpose', label: 'Repurpose', icon: '🚀' },
    { id: 'text', label: 'Text', icon: '🔤' },
    { id: 'effects', label: 'Effects', icon: '✨' },
    { id: 'transitions', label: 'Transitions', icon: '⚡' },
    { id: 'color', label: 'Color', icon: '☀️' },
    { id: 'ai', label: 'AI Direct', icon: '🤖' },
    { id: 'templates', label: 'Templates', icon: '📐' },
  ];

  return (
    <aside className="relative z-30 flex h-full bg-[#0d1117] border-r border-slate-800/80 shrink-0 select-none">
      {/* Icon Navigation Column */}
      <div className="w-16 bg-[#090d14] border-r border-slate-800/80 flex flex-col items-center py-2 space-y-1 overflow-y-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playSelect();
                onSelectTab(tab.id);
              }}
              className={`w-13 py-1.5 rounded-lg flex flex-col items-center justify-center gap-0.5 text-[9px] font-medium transition-all cursor-pointer ${
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
      <div className="w-68 sm:w-76 bg-[#0d1117] flex flex-col h-full border-r border-slate-800/80 p-3.5 overflow-y-auto">
        
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

            <div
              onClick={onOpenImportModal}
              className="p-3.5 rounded-lg border border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-900 hover:border-sky-500/80 text-center transition-all cursor-pointer"
            >
              <div className="text-xl mb-1">📥</div>
              <p className="text-xs font-medium text-slate-200">Upload Clips & Music</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Supports 4K MP4, MOV, WEBM</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Project Assets ({clips.length})
              </span>
              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {clips.map((clip) => (
                  <div
                    key={clip.id}
                    className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between group"
                  >
                    <div className="truncate mr-2">
                      <p className="text-xs font-medium text-slate-200 truncate">{clip.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {clip.duration.toFixed(1)}s · {clip.score.overall} AI Quality
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

        {/* AUDIO & STEMS TAB (Better than CapCut) */}
        {activeTab === 'audio' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Audio & Neural Stems
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                {audioTrack.bpm} BPM
              </span>
            </div>

            {/* Current Audio Track Card */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-sky-400 truncate">{audioTrack.title}</p>
                <span className="text-[10px] font-mono text-slate-400">{audioTrack.duration}s</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">{audioTrack.artist}</p>
              
              {/* Demucs 4-Stem Separation Feature */}
              <div className="pt-2 border-t border-slate-800 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-purple-300">
                    HT-Demucs Neural Stems
                  </span>
                  <button
                    onClick={() => {
                      sounds.playMakeItFire();
                      setIsGeneratingStems(true);
                      setTimeout(() => setIsGeneratingStems(false), 800);
                    }}
                    className="text-[10px] font-mono text-sky-400 hover:underline cursor-pointer"
                  >
                    {isGeneratingStems ? 'Separating...' : 'Re-Separate ⚡'}
                  </button>
                </div>

                {/* Stems Volume & Mute Controls */}
                <div className="space-y-1.5">
                  {(audioTrack.stems || []).map((stem) => (
                    <div
                      key={stem.id}
                      className="p-1.5 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stem.color }} />
                        <span className="text-slate-300 font-medium">{stem.label}</span>
                      </div>
                      <button
                        onClick={() => {
                          sounds.playSelect();
                          onToggleStemMute(stem.id);
                        }}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono cursor-pointer transition-all ${
                          stem.muted
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {stem.muted ? 'MUTED' : 'ACTIVE'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CAPTIONS TAB (CapCut-Beating Animated Word Highlight) */}
        {activeTab === 'captions' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Viral Auto-Captions
              </h2>
              <span className="text-[10px] font-mono text-sky-400">Whisper Turbo</span>
            </div>

            {/* 1-Click Auto Caption Trigger */}
            <div className="p-3.5 rounded-lg bg-gradient-to-br from-sky-950/50 to-purple-950/40 border border-sky-800/60 space-y-2">
              <p className="text-xs font-bold text-sky-200">AI Speech-to-Text Transcription</p>
              <p className="text-[11px] text-slate-300 leading-snug">
                Detects spoken dialogue with word-by-word timing and dynamic animated karaoke highlights.
              </p>
              <button
                onClick={() => {
                  sounds.playMakeItFire();
                  setIsGeneratingCaptions(true);
                  setTimeout(() => {
                    setIsGeneratingCaptions(false);
                    onAddClipToTimeline({
                      title: 'CAPTION: "WATCH THIS MASSIVE BEAT DROP"',
                      trackId: 'T1',
                      startTime: 0.5,
                      duration: 4.5,
                      color: '#eab308',
                    });
                  }, 800);
                }}
                className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold shadow-md shadow-sky-500/20 cursor-pointer transition-all"
              >
                {isGeneratingCaptions ? 'Transcribing Audio...' : '⚡ Generate Viral Captions (Whisper Turbo)'}
              </button>
            </div>

            {/* Caption Animation Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Choose Animated Style
              </span>

              {[
                { id: 'HORMOZI_BOLD' as CaptionPreset, name: 'Hormozi Kinetic Pop', desc: 'Bold black border, neon yellow active word pop', preview: 'GROW YOUR REVENUE' },
                { id: 'POP_KARAOKE' as CaptionPreset, name: 'Pop Bounce Karaoke', desc: 'Scale bounce on every syllable with spring curve', preview: 'WATCH THE DROP' },
                { id: 'NEON_PULSE' as CaptionPreset, name: 'Cyberpunk Neon Glow', desc: 'Vibrant cyan & magenta outer pulse glow', preview: 'LEVEL UP NOW' },
                { id: 'CINEMATIC_SUB' as CaptionPreset, name: 'Cinematic Minimal', desc: 'Clean tracked serif with subtle fade', preview: 'In the heart of the storm.' },
              ].map((style) => (
                <div
                  key={style.id}
                  onClick={() => {
                    sounds.playSelect();
                    onSelectCaptionStyle(style.id);
                  }}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    activeCaptionStyle === style.id
                      ? 'border-sky-400 bg-sky-950/40 shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">{style.name}</p>
                    {activeCaptionStyle === style.id && (
                      <span className="text-[10px] font-mono text-sky-400 font-semibold">SELECTED</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{style.desc}</p>
                  <div className="mt-2 py-1 px-2 rounded bg-slate-950 text-center text-xs font-bold text-amber-300 font-mono">
                    {style.preview}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI MODELS REGISTRY TAB (Section 12, 13, 14 of PRD) */}
        {activeTab === 'models' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                AI Model Orchestrator
              </h2>
              <button
                onClick={onOpenModelOrchestrator}
                className="text-[11px] font-mono text-sky-400 hover:underline cursor-pointer"
              >
                Expand ↗
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              VIZMOTION orchestrates specialized foundation models for each editing discipline.
            </p>

            <div className="space-y-2">
              {AI_MODELS_REGISTRY.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{m.name}</h4>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1 py-0.5 rounded">
                      {m.benchmarkScore}%
                    </span>
                  </div>
                  <p className="text-[10px] text-sky-300 font-medium mt-0.5">{m.specialty}</p>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                    <span>Latency: ~{m.latencyMs}ms</span>
                    <span className="text-emerald-400 font-semibold">● ONLINE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1-CLICK REPURPOSE TAB (Section 34 & 40 of PRD) */}
        {activeTab === 'repurpose' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                1-Click Content Repurpose
              </h2>
              <span className="text-[10px] font-mono text-amber-400">Viral AI</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              Converts 1 Master Video into 5 viral platform variants with predictive hook retention scores.
            </p>

            <div className="space-y-2">
              {DEMO_REPURPOSE_CARDS.map((card) => (
                <div
                  key={card.id}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500/60 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-sky-300">
                      {card.platform} · {card.aspectRatio}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      {card.hookRetentionScore}% RETENTION
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">{card.title}</h4>
                  <p className="text-[10px] text-slate-400">{card.hookSnippet}</p>
                  <button
                    onClick={() => {
                      sounds.playMakeItFire();
                      onSelectRepurpose(card);
                    }}
                    className="w-full mt-1.5 py-1 rounded bg-slate-800 hover:bg-sky-500 hover:text-black text-xs font-semibold text-slate-200 transition-all cursor-pointer"
                  >
                    Generate {card.platform} Cut ⚡
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI DIRECT TOOLS TAB */}
        {activeTab === 'ai' && (
          <div className="space-y-3.5">
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              AI Creative Disciplines
            </h2>

            <div className="space-y-2">
              {[
                { name: 'SAM-2 One-Click Background Removal', desc: 'Isolates subjects without greenscreen in 1 click' },
                { name: 'Depth Anything 3D Relighting', desc: 'Places 3D text behind subjects using monocular depth' },
                { name: 'Smart Auto-Reframe (16:9 → 9:16)', desc: 'AI tracks facial motion to keep action centered' },
                { name: 'RIFE 120 FPS Frame Interpolation', desc: 'Silky smooth slow-motion without blur artifacts' },
                { name: 'AI B-Roll Generator & Inserter', desc: 'Automatically places matching B-roll on V2 track' },
              ].map((tool) => (
                <div
                  key={tool.name}
                  onClick={() => {
                    sounds.playMakeItFire();
                    onApplyEffect(tool.name);
                  }}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-all"
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

        {/* TEXT TAB */}
        {activeTab === 'text' && (
          <div className="space-y-3.5">
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Titles & Graphics
            </h2>
            <div className="space-y-1.5">
              {[
                { title: 'Bold Kinetic Headline', desc: 'High impact social title with pop animation' },
                { title: 'Cinematic Lower Third', desc: 'Minimalist documentary subtitle' },
                { title: 'Neon Cyberpunk Title', desc: 'RGB pulse distortion effect' },
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
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
                >
                  <p className="text-xs font-bold text-slate-200">{style.title}</p>
                  <p className="text-[10px] text-slate-500">{style.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EFFECTS TAB */}
        {activeTab === 'effects' && (
          <div className="space-y-3.5">
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Visual Effects Engine
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
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
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500/60 text-left transition-all cursor-pointer"
                >
                  <p className="text-xs font-semibold text-slate-200">{fx.name}</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">{fx.cat}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TRANSITIONS TAB */}
        {activeTab === 'transitions' && (
          <div className="space-y-3.5">
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Seamless Transitions
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
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
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500/60 text-left transition-all cursor-pointer"
                >
                  <p className="text-xs font-semibold text-slate-200">{tr.name}</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">{tr.cat}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* COLOR TAB */}
        {activeTab === 'color' && (
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
              ].map((preset) => (
                <div
                  key={preset.name}
                  onClick={() => {
                    sounds.playSelect();
                    onApplyColorPreset(preset.name);
                  }}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
                >
                  <p className="text-xs font-bold text-slate-200">{preset.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{preset.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="space-y-3.5">
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              AI Production Templates
            </h2>
            <div className="space-y-2">
              {[
                { name: 'Viral TikTok 9:16', desc: 'Fast pacing with animated captions' },
                { name: 'Luxury Commercial 30s', desc: 'Smooth slow-mo with minimal typography' },
                { name: 'Music Video Visualizer', desc: 'Beat-reactive effects and hard drop cuts' },
              ].map((tmpl) => (
                <div
                  key={tmpl.name}
                  onClick={() => sounds.playSelect()}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
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
