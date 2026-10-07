import React from 'react';
import { TimelineClip, UserMode, ColorGradeSettings } from '../types';
import { sounds } from '../utils/audioSynth';

interface InspectorPanelProps {
  selectedClip: TimelineClip | null;
  userMode: UserMode;
  colorGrade: ColorGradeSettings;
  onChangeColorGrade: (newGrade: ColorGradeSettings) => void;
  onUpdateClip: (clipId: string, updates: Partial<TimelineClip>) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedClip,
  userMode,
  colorGrade,
  onChangeColorGrade,
  onUpdateClip,
}) => {
  if (!selectedClip) {
    return (
      <aside className="w-64 sm:w-72 bg-[#0a0d14] border-l border-slate-800/80 p-4 flex flex-col justify-between text-xs select-none">
        <div>
          <h3 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] mb-3">
            Inspector & Properties
          </h3>
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-slate-500">
            Select any clip on the timeline to inspect and edit its properties.
          </div>
        </div>

        {/* Global Color Grade Controls */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h4 className="font-semibold text-slate-300 text-xs">Global Color Grade</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>Contrast</span>
                <span>{colorGrade.contrast}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={colorGrade.contrast}
                onChange={(e) => onChangeColorGrade({ ...colorGrade, contrast: parseInt(e.target.value) })}
                className="w-full accent-sky-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>Temperature</span>
                <span>{colorGrade.temperature}K</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={colorGrade.temperature}
                onChange={(e) => onChangeColorGrade({ ...colorGrade, temperature: parseInt(e.target.value) })}
                className="w-full accent-amber-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 sm:w-72 bg-[#0a0d14] border-l border-slate-800/80 p-4 overflow-y-auto text-xs select-none space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-sky-400 block">{selectedClip.trackId} TRACK</span>
          <h3 className="font-bold text-slate-100 truncate w-44">{selectedClip.title}</h3>
        </div>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
          {selectedClip.duration.toFixed(1)}s
        </span>
      </div>

      {/* AI Clip Score (Section 22 of PRD) */}
      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span>AI Clip Quality Score</span>
          <span className="text-amber-400 font-mono">{selectedClip.score.overall}/100</span>
        </div>
        <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-center">
          <div className="bg-slate-950 p-1 rounded">
            <span className="text-slate-500 block">VISUAL</span>
            <span className="text-slate-200">{selectedClip.score.visual}</span>
          </div>
          <div className="bg-slate-950 p-1 rounded">
            <span className="text-slate-500 block">MOTION</span>
            <span className="text-slate-200">{selectedClip.score.motion}</span>
          </div>
          <div className="bg-slate-950 p-1 rounded">
            <span className="text-slate-500 block">SHARP</span>
            <span className="text-slate-200">{selectedClip.score.sharpness}</span>
          </div>
        </div>
      </div>

      {/* Speed & Speed Ramping (Section 25 of PRD) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">Playback Speed</label>
          <span className="text-[11px] font-mono text-sky-400">{selectedClip.speedRamp || 1.0}x</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[0.5, 1.0, 1.5, 2.0].map((spd) => (
            <button
              key={spd}
              onClick={() => {
                sounds.playSelect();
                onUpdateClip(selectedClip.id, { speedRamp: spd });
              }}
              className={`flex-1 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                (selectedClip.speedRamp || 1.0) === spd
                  ? 'bg-sky-500 text-black font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Transform Controls (Available in EDIT & PRO modes) */}
      {(userMode === 'EDIT' || userMode === 'PRO') && (
        <div className="space-y-2.5 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 block">Transform & Scale</label>
          
          <div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span>Scale</span>
              <span>{Math.round((selectedClip.scale || 1.0) * 100)}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              value={Math.round((selectedClip.scale || 1.0) * 100)}
              onChange={(e) => onUpdateClip(selectedClip.id, { scale: parseInt(e.target.value) / 100 })}
              className="w-full accent-sky-400 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span>Opacity</span>
              <span>{Math.round((selectedClip.opacity ?? 1.0) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round((selectedClip.opacity ?? 1.0) * 100)}
              onChange={(e) => onUpdateClip(selectedClip.id, { opacity: parseInt(e.target.value) / 100 })}
              className="w-full accent-sky-400 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Applied Effects & Transitions */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <label className="text-xs font-semibold text-slate-300 block">Applied FX</label>
        <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-300 truncate">
            {selectedClip.effect || 'None (Clean)'}
          </span>
          <span className="text-[9px] font-mono text-sky-400 bg-sky-950 px-1 py-0.5 rounded">
            FX
          </span>
        </div>
        <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-300 truncate">
            {selectedClip.transition || 'Hard Cut'}
          </span>
          <span className="text-[9px] font-mono text-amber-400 bg-amber-950 px-1 py-0.5 rounded">
            TRANSITION
          </span>
        </div>
      </div>

      {/* PRO MODE ONLY: Keyframing & Compositing (Section 17 of PRD) */}
      {userMode === 'PRO' && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-purple-300">Pro Compositing</label>
            <span className="text-[9px] font-mono px-1 rounded bg-purple-950 text-purple-300">
              PRO
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {['Keyframes', 'Masking', 'Optical Flow', 'Motion Track'].map((tool) => (
              <button
                key={tool}
                onClick={() => sounds.playSelect()}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-purple-500/60 text-[10px] text-slate-300 text-left cursor-pointer transition-all"
              >
                + {tool}
              </button>
            ))}
          </div>
        </div>
      )}

    </aside>
  );
};
