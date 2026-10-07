import React, { useRef } from 'react';
import { TimelineClip, AudioTrack } from '../types';
import { sounds } from '../utils/audioSynth';

interface MultiTrackTimelineProps {
  clips: TimelineClip[];
  audioTrack: AudioTrack;
  currentTime: number;
  onSeek: (time: number) => void;
  selectedClipId: string | null;
  onSelectClip: (clip: TimelineClip) => void;
  onSplitClip: () => void;
  onDeleteClip: () => void;
  onAddClip: () => void;
}

export const MultiTrackTimeline: React.FC<MultiTrackTimelineProps> = ({
  clips,
  audioTrack,
  currentTime,
  onSeek,
  selectedClipId,
  onSelectClip,
  onSplitClip,
  onDeleteClip,
  onAddClip,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const totalDuration = audioTrack.duration;
  const pixelsPerSecond = 26;
  const timelineWidth = Math.max(900, totalDuration * pixelsPerSecond);

  const TRACKS: { id: 'V2' | 'V1' | 'T1' | 'A1' | 'A2'; label: string; height: string; type: 'video' | 'text' | 'audio' }[] = [
    { id: 'V2', label: 'V2 Overlay', height: 'h-8', type: 'video' },
    { id: 'V1', label: 'V1 Video', height: 'h-11', type: 'video' },
    { id: 'T1', label: 'T1 Text', height: 'h-8', type: 'text' },
    { id: 'A1', label: 'A1 Music', height: 'h-11', type: 'audio' },
    { id: 'A2', label: 'A2 Voice', height: 'h-8', type: 'audio' },
  ];

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(totalDuration, clickX / pixelsPerSecond));
    onSeek(newTime);
  };

  return (
    <div className="w-full bg-[#0a0d14] border-t border-slate-800/80 p-2.5 flex flex-col select-none shrink-0">
      {/* Timeline Toolbar Header */}
      <div className="flex items-center justify-between pb-2 px-1">
        <div className="flex items-center gap-2">
          {/* Tool shortcuts */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md p-0.5 text-xs">
            <button
              title="Selection Tool (V)"
              className="px-2.5 py-1 bg-slate-800 text-sky-400 font-semibold rounded cursor-pointer"
            >
              Select (V)
            </button>
            <button
              onClick={() => {
                sounds.playSelect();
                onSplitClip();
              }}
              title="Split at Playhead (C)"
              className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded cursor-pointer transition-all"
            >
              Split (C)
            </button>
            <button
              onClick={() => {
                sounds.playSelect();
                onDeleteClip();
              }}
              title="Delete Selected Clip (Del)"
              className="px-2.5 py-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded cursor-pointer transition-all"
            >
              Delete
            </button>
          </div>

          <button
            onClick={() => {
              sounds.playSelect();
              onAddClip();
            }}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white cursor-pointer transition-all"
          >
            + Add Clip
          </button>
        </div>

        {/* Snapping & Beat-Lock Status */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Magnetic Beat-Snap: ON</span>
          </div>
          <span className="text-[11px] font-mono text-sky-400 bg-sky-950/80 border border-sky-800/60 px-2 py-0.5 rounded">
            {audioTrack.bpm} BPM Grid
          </span>
        </div>
      </div>

      {/* Scrollable Tracks Area */}
      <div className="relative rounded-lg border border-slate-800 bg-[#080b11] overflow-x-auto overflow-y-hidden shadow-inner">
        
        {/* Time Ruler Header */}
        <div
          onClick={handleTimelineClick}
          className="h-6 border-b border-slate-800 bg-slate-900/90 relative cursor-pointer"
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
                <div className="w-[1px] h-3 bg-slate-700" />
                <span className="text-[9px] font-mono text-slate-400 pl-0.5">
                  00:{String(sec).padStart(2, '0')}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tracks Column Container */}
        <div
          ref={containerRef}
          onClick={handleTimelineClick}
          className="relative space-y-1.5 p-1 cursor-pointer"
          style={{ width: `${timelineWidth}px`, minHeight: '160px' }}
        >
          {/* Moving Playhead Red Line */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-40 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.9)]"
            style={{ left: `${currentTime * pixelsPerSecond}px` }}
          >
            <div className="w-3.5 h-3.5 -ml-[6px] -mt-1 bg-red-500 rotate-45 border border-white/20" />
          </div>

          {/* Render Tracks */}
          {TRACKS.map((track) => (
            <div
              key={track.id}
              className={`relative ${track.height} rounded bg-slate-900/50 border border-slate-800/80 flex items-center overflow-hidden`}
            >
              {/* Track Label Badge */}
              <div className="absolute left-1 z-30 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[9px] font-mono text-slate-400 pointer-events-none">
                {track.label}
              </div>

              {/* Render Track Clips */}
              {clips
                .filter((c) => c.trackId === track.id)
                .map((clip) => {
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
                      className={`absolute top-0.5 bottom-0.5 rounded px-2 flex items-center justify-between text-xs font-medium border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-sky-400 bg-sky-600 text-white shadow-lg shadow-sky-500/30 z-20 font-semibold'
                          : track.type === 'text'
                          ? 'border-amber-500/60 bg-amber-900/50 text-amber-200 hover:bg-amber-800/60'
                          : 'border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      <span className="truncate text-[11px]">{clip.title}</span>
                      <span className="text-[9px] font-mono opacity-75 shrink-0 ml-1">
                        {clip.duration.toFixed(1)}s
                      </span>
                    </div>
                  );
                })}

              {/* A1 MUSIC TRACK: Render Real Audio Waveform & Beat Markers */}
              {track.id === 'A1' && (
                <>
                  {/* Waveform bars simulation */}
                  <div className="absolute inset-0 flex items-center opacity-30 pointer-events-none px-12">
                    {Array.from({ length: Math.ceil(totalDuration * 4) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-[2px] bg-emerald-400 mx-[2px] rounded-full"
                        style={{ height: `${Math.sin(i * 0.5) * 14 + 16}px` }}
                      />
                    ))}
                  </div>

                  {/* Beat Markers on Timeline */}
                  {audioTrack.beatMarkers.map((bm, idx) => {
                    const left = bm.time * pixelsPerSecond;
                    const isDrop = bm.type === 'drop';
                    return (
                      <div
                        key={idx}
                        title={`${bm.type.toUpperCase()} @ ${bm.time}s`}
                        style={{ left: `${left}px` }}
                        className={`absolute top-0 bottom-0 pointer-events-none z-10 ${
                          isDrop
                            ? 'w-[3px] bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]'
                            : bm.type === 'downbeat'
                            ? 'w-[2px] bg-sky-400'
                            : 'w-[1px] bg-slate-600'
                        }`}
                      >
                        {isDrop && (
                          <span className="absolute -top-1 -left-2 text-[8px] font-mono font-bold text-amber-300">
                            ⚡DROP
                          </span>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
