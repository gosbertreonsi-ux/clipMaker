import React from 'react';
import { TimelineClip, AudioTrack } from '../types';
import { sounds } from '../utils/audioSynth';

interface TimelineEditorProps {
  clips: TimelineClip[];
  audioTrack: AudioTrack;
  currentTime: number;
  onSeek: (time: number) => void;
  onSelectClip: (clip: TimelineClip) => void;
  selectedClipId: string | null;
  onAddClip: () => void;
  onSplitClip: () => void;
  onDeleteClip: () => void;
  onTogglePlay: () => void;
  isPlaying: boolean;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  clips,
  audioTrack,
  currentTime,
  onSeek,
  onSelectClip,
  selectedClipId,
  onAddClip,
  onSplitClip,
  onDeleteClip,
  onTogglePlay,
  isPlaying,
}) => {
  const totalDuration = audioTrack.duration;
  const pixelsPerSecond = 24; // Timeline scale
  const timelineWidth = Math.max(800, totalDuration * pixelsPerSecond);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(totalDuration, clickX / pixelsPerSecond));
    onSeek(newTime);
  };

  return (
    <div className="w-full bg-[#070b10] border-t border-slate-700/60 p-3 select-none">
      <div className="max-w-[1720px] mx-auto">
        {/* Timeline Header & Tool Buttons */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs font-bold text-amber-300 tracking-wider">
              TIMELINE ENGINE
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              [BEAT DNA: {audioTrack.bpm} BPM · 4/4 TIME]
            </span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onTogglePlay}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-cinzel rounded flex items-center gap-1 cursor-pointer"
            >
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>
            <button
              onClick={() => {
                sounds.playSelect();
                onAddClip();
              }}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-cinzel rounded cursor-pointer"
            >
              + ADD CLIP
            </button>
            <button
              onClick={() => {
                sounds.playSelect();
                onSplitClip();
              }}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-cinzel rounded cursor-pointer"
            >
              SPLIT (C)
            </button>
            <button
              onClick={() => {
                sounds.playSelect();
                onDeleteClip();
              }}
              className="px-2 py-1 bg-red-950/70 hover:bg-red-900/80 text-red-300 border border-red-700/60 text-xs font-cinzel rounded cursor-pointer"
            >
              DELETE
            </button>
          </div>
        </div>

        {/* Scrollable Tracks Area */}
        <div className="overflow-x-auto overflow-y-hidden rounded border border-slate-800 bg-slate-950/90 relative">
          
          {/* Timeline Time Ruler */}
          <div
            onClick={handleTimelineClick}
            className="h-6 border-b border-slate-800 bg-slate-900/80 relative cursor-pointer"
            style={{ width: `${timelineWidth}px` }}
          >
            {Array.from({ length: Math.ceil(totalDuration) }).map((_, sec) => {
              if (sec % 2 !== 0) return null;
              return (
                <div
                  key={sec}
                  className="absolute top-0 flex flex-col items-start"
                  style={{ left: `${sec * pixelsPerSecond}px` }}
                >
                  <div className="w-[1px] h-3 bg-slate-600" />
                  <span className="text-[9px] font-mono text-slate-400 pl-0.5">
                    {sec}s
                  </span>
                </div>
              );
            })}
          </div>

          {/* Tracks Container */}
          <div
            onClick={handleTimelineClick}
            className="relative p-1 space-y-1.5 cursor-pointer"
            style={{ width: `${timelineWidth}px`, minHeight: '120px' }}
          >
            {/* Playhead red indicator line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-30 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.9)]"
              style={{ left: `${currentTime * pixelsPerSecond}px` }}
            >
              <div className="w-3 h-3 -ml-[5px] -mt-1 bg-red-500 rotate-45" />
            </div>

            {/* TRACK 1: VIDEO 1 */}
            <div className="h-9 bg-slate-900/60 rounded border border-slate-800/80 relative flex items-center">
              <span className="absolute left-2 text-[9px] font-cinzel font-bold text-slate-500 pointer-events-none z-10">
                VIDEO 1
              </span>
              {clips.map((clip) => {
                const isSelected = selectedClipId === clip.id;
                const left = clip.startTime * pixelsPerSecond;
                const width = clip.duration * pixelsPerSecond;

                return (
                  <div
                    key={clip.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playSelect();
                      onSelectClip(clip);
                    }}
                    style={{ left: `${left}px`, width: `${width}px` }}
                    className={`absolute top-0.5 bottom-0.5 rounded px-2 flex items-center justify-between text-[10px] font-cinzel font-bold border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-sky-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)] z-20'
                        : 'border-sky-500/50 bg-sky-800/60 text-sky-100 hover:bg-sky-700/70'
                    }`}
                  >
                    <span className="truncate">{clip.title}</span>
                    <span className="text-[9px] font-mono opacity-80 shrink-0">
                      {clip.score.overall} pts
                    </span>
                  </div>
                );
              })}
            </div>

            {/* TRACK 2: FX / RUNIC GEMS */}
            <div className="h-7 bg-slate-900/40 rounded border border-slate-800/60 relative flex items-center">
              <span className="absolute left-2 text-[9px] font-cinzel font-bold text-slate-500 pointer-events-none z-10">
                RUNIC FX
              </span>
              <div
                className="absolute top-0.5 bottom-0.5 rounded bg-indigo-900/70 border border-indigo-400/60 text-[9px] text-indigo-200 px-2 flex items-center font-cinzel font-bold"
                style={{ left: `${7.5 * pixelsPerSecond}px`, width: `${4 * pixelsPerSecond}px` }}
              >
                SUB-BASS QUAKE & RGB SPLIT
              </div>
            </div>

            {/* TRACK 3: AUDIO & BEAT DNA */}
            <div className="h-10 bg-slate-900/80 rounded border border-slate-800/80 relative flex items-center">
              <span className="absolute left-2 text-[9px] font-cinzel font-bold text-slate-400 pointer-events-none z-10">
                BEAT DNA ({audioTrack.bpm} BPM)
              </span>

              {/* Render Beat Markers along track */}
              {audioTrack.beatMarkers.map((bm, idx) => {
                const left = bm.time * pixelsPerSecond;
                const isDrop = bm.type === 'drop';
                return (
                  <div
                    key={idx}
                    title={`${bm.type.toUpperCase()} @ ${bm.time}s`}
                    style={{ left: `${left}px` }}
                    className={`absolute top-0 bottom-0 w-[2px] pointer-events-none ${
                      isDrop
                        ? 'bg-amber-400 w-[3px] shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                        : bm.type === 'downbeat'
                        ? 'bg-sky-400'
                        : 'bg-slate-600'
                    }`}
                  >
                    {isDrop && (
                      <span className="absolute -top-1 -left-2 text-[8px] font-cinzel font-black text-amber-300">
                        ⚡DROP
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
