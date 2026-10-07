import React, { useRef, useEffect, useState } from 'react';
import { TimelineClip, AudioTrack, ColorGradeSettings } from '../types';
import { sounds } from '../utils/audioSynth';

interface VideoPreviewPlayerProps {
  clips: TimelineClip[];
  audioTrack: AudioTrack;
  colorGrade: ColorGradeSettings;
  currentTime: number;
  onSeek: (time: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  onChangeAspectRatio: (ratio: '16:9' | '9:16' | '1:1' | '4:5') => void;
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  clips,
  audioTrack,
  colorGrade,
  currentTime,
  onSeek,
  isPlaying,
  onTogglePlay,
  aspectRatio,
  onChangeAspectRatio,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoElemRef = useRef<HTMLVideoElement | null>(null);
  const audioElemRef = useRef<HTMLAudioElement | null>(null);
  const [showSafeAreas, setShowSafeAreas] = useState(false);
  const [activeBeatDrop, setActiveBeatDrop] = useState(false);

  // Sync real audio element
  useEffect(() => {
    if (audioElemRef.current && audioTrack.audioUrl) {
      if (isPlaying) {
        audioElemRef.current.currentTime = currentTime;
        audioElemRef.current.play().catch(() => {});
      } else {
        audioElemRef.current.pause();
      }
    }
  }, [isPlaying, audioTrack.audioUrl]);

  useEffect(() => {
    if (audioElemRef.current && audioTrack.audioUrl) {
      if (Math.abs(audioElemRef.current.currentTime - currentTime) > 0.3) {
        audioElemRef.current.currentTime = currentTime;
      }
    }
  }, [currentTime, audioTrack.audioUrl]);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark background
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, width, height);

      // Find active video clip on timeline
      const activeClip = clips.find(
        (c) => c.trackId === 'V1' && currentTime >= c.startTime && currentTime <= c.startTime + c.duration
      ) || clips.find((c) => c.trackId === 'V1');

      // Find active text/caption clip
      const activeTextClip = clips.find(
        (c) => c.trackId === 'T1' && currentTime >= c.startTime && currentTime <= c.startTime + c.duration
      );

      // Check if current timestamp is on beat or drop
      const isDrop = audioTrack.beatMarkers.some(
        (b) => b.type === 'drop' && Math.abs(b.time - (currentTime % audioTrack.duration)) < 0.15
      );
      const isBeat = audioTrack.beatMarkers.some(
        (b) => Math.abs(b.time - (currentTime % audioTrack.duration)) < 0.1
      );

      if (isDrop && !activeBeatDrop) {
        setActiveBeatDrop(true);
        setTimeout(() => setActiveBeatDrop(false), 160);
      }

      // Draw real video frame or animated background
      if (activeClip && activeClip.videoUrl && videoElemRef.current) {
        if (videoElemRef.current.src !== activeClip.videoUrl) {
          videoElemRef.current.src = activeClip.videoUrl;
        }
        if (isPlaying) {
          const clipLocalTime = (currentTime - activeClip.startTime) * (activeClip.speedRamp || 1.0);
          if (Math.abs(videoElemRef.current.currentTime - clipLocalTime) > 0.4) {
            videoElemRef.current.currentTime = Math.max(0, clipLocalTime);
          }
          videoElemRef.current.play().catch(() => {});
        } else {
          videoElemRef.current.pause();
        }

        try {
          ctx.drawImage(videoElemRef.current, 0, 0, width, height);
        } catch {
          // Draw fallback gradient
          drawFallbackScene(ctx, width, height, activeClip, currentTime, isBeat);
        }
      } else {
        drawFallbackScene(ctx, width, height, activeClip, currentTime, isBeat);
      }

      // Apply Color Grading (LUT simulation)
      if (colorGrade.contrast !== 0 || colorGrade.temperature !== 0) {
        ctx.fillStyle = colorGrade.temperature < 0
          ? 'rgba(14, 116, 144, 0.08)' // Cool teal
          : 'rgba(217, 119, 6, 0.08)'; // Warm amber
        ctx.fillRect(0, 0, width, height);
      }

      // Flash & Shake on musical drop
      if (isDrop) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(0, 0, width, height);
      }

      // Render Active Text / Captions
      if (activeTextClip) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Text styling (TikTok-style bold outline)
        ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(activeTextClip.title, width / 2, height * 0.78);
        
        ctx.fillStyle = '#fde047';
        ctx.fillText(activeTextClip.title, width / 2, height * 0.78);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [currentTime, clips, audioTrack, colorGrade, isPlaying, activeBeatDrop]);

  const drawFallbackScene = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    clip: TimelineClip | undefined,
    time: number,
    isBeat: boolean
  ) => {
    // Elegant deep visual preview
    const grad = ctx.createRadialGradient(
      width / 2, height / 2, 40,
      width / 2, height / 2, Math.max(width, height) / 1.1
    );
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#020617');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle studio grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Dynamic 3D Perspective Graphic & Waveform
    const t = time * 2;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    const scale = isBeat ? 1.04 : 1.0;
    ctx.scale(scale, scale);

    ctx.strokeStyle = isBeat ? '#38bdf8' : 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(width, height) * 0.25, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating inner polygon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + t * 0.4;
      const r = Math.min(width, height) * 0.18 + Math.sin(t + i) * 8;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();
    ctx.restore();

    // Active Clip Information Card Overlay
    if (clip) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(clip.title, 16, 28);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText(
        `CUT: ${clip.transition || 'CUT'}  ·  SPEED: ${clip.speedRamp || 1.0}x  ·  EFFECT: ${clip.effect || 'NONE'}`,
        16,
        46
      );
    }
  };

  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  return (
    <section className="relative flex-1 flex flex-col items-center justify-between bg-[#070a0f] p-3 overflow-hidden select-none">
      
      {/* Top Preview Controls Bar */}
      <div className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs mb-2">
        {/* Aspect Ratio Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mr-1">
            Format:
          </span>
          {(['16:9', '9:16', '1:1', '4:5'] as const).map((ratio) => (
            <button
              key={ratio}
              onClick={() => {
                sounds.playSelect();
                onChangeAspectRatio(ratio);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                aspectRatio === ratio
                  ? 'bg-sky-500 text-black font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>

        {/* Safe Area & Resolution Badges */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSafeAreas(!showSafeAreas)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
              showSafeAreas
                ? 'border-sky-400 text-sky-300 bg-sky-950/60'
                : 'border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            Safe Area: {showSafeAreas ? 'ON' : 'OFF'}
          </button>
          <span className="text-[10px] font-mono text-emerald-400 font-medium">
            1080p · 60fps
          </span>
        </div>
      </div>

      {/* Center Canvas Monitor Frame */}
      <div className="relative flex-1 w-full flex items-center justify-center min-h-[300px]">
        <div
          className={`relative bg-black rounded-lg shadow-2xl border border-slate-800 overflow-hidden transition-all duration-200 ${
            aspectRatio === '9:16'
              ? 'w-[250px] sm:w-[280px] h-[450px] sm:h-[490px]'
              : aspectRatio === '1:1'
              ? 'w-[340px] sm:w-[380px] h-[340px] sm:h-[380px]'
              : aspectRatio === '4:5'
              ? 'w-[290px] sm:w-[330px] h-[360px] sm:h-[410px]'
              : 'w-[480px] sm:w-[620px] h-[270px] sm:h-[350px]'
          }`}
        >
          <canvas
            ref={canvasRef}
            width={aspectRatio === '9:16' ? 540 : aspectRatio === '1:1' ? 600 : aspectRatio === '4:5' ? 540 : 800}
            height={aspectRatio === '9:16' ? 960 : aspectRatio === '1:1' ? 600 : aspectRatio === '4:5' ? 675 : 450}
            className="w-full h-full object-cover"
          />

          {/* Social Safe Areas Guide Overlay (TikTok UI buttons preview) */}
          {showSafeAreas && (
            <div className="absolute inset-0 pointer-events-none border border-sky-400/40 p-4 flex flex-col justify-between">
              <div className="text-[9px] font-mono text-sky-400/70 border-b border-sky-400/30 pb-1">
                TOP SAFE MARGIN (SEARCH / TABS)
              </div>
              <div className="flex justify-between items-end text-[9px] font-mono text-sky-400/70 border-t border-sky-400/30 pt-1">
                <span>TITLE / CAPTION AREA</span>
                <span className="text-right">RIGHT CONTROLS (LIKE / SHARE)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Transport Controls Bar */}
      <div className="w-full max-w-xl flex items-center justify-between px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-lg mt-2">
        <div className="flex items-center gap-2">
          {/* Step Back 1s */}
          <button
            onClick={() => onSeek(Math.max(0, currentTime - 1))}
            title="Step Back 1s"
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
            </svg>
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-black flex items-center justify-center font-bold shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Step Forward 1s */}
          <button
            onClick={() => onSeek(Math.min(audioTrack.duration, currentTime + 1))}
            title="Step Forward 1s"
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
            </svg>
          </button>
        </div>

        {/* Timecode */}
        <div className="text-xs font-mono text-slate-200">
          <span className="font-semibold text-sky-400">{formatTimecode(currentTime)}</span>
          <span className="text-slate-500 mx-1">/</span>
          <span className="text-slate-400">{formatTimecode(audioTrack.duration)}</span>
        </div>

        {/* Beat Sync Pulse Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <span className={`w-2 h-2 rounded-full transition-colors ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          <span>{audioTrack.bpm} BPM Beat-Locked</span>
        </div>
      </div>

      {/* Hidden media elements */}
      <video ref={videoElemRef} className="hidden" playsInline muted />
      {audioTrack.audioUrl && (
        <audio ref={audioElemRef} src={audioTrack.audioUrl} className="hidden" />
      )}
    </section>
  );
};
