import React, { useRef, useEffect, useState } from 'react';
import { TimelineClip, AudioTrack, EditingStyle } from '../types';
import { sounds } from '../utils/audioSynth';
import backdropImage from '../assets/images/gow_backdrop_1791384594156.jpg';

interface CenterStageProps {
  viewMode: 'loadout' | 'video' | 'split';
  clips: TimelineClip[];
  audioTrack: AudioTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  onSeek: (time: number) => void;
  currentStyle: EditingStyle;
  aspectRatio: '16:9' | '9:16' | '1:1';
  onChangeAspectRatio: (ratio: '16:9' | '9:16' | '1:1') => void;
  onTriggerMakeItFire: () => void;
}

export const CenterStage: React.FC<CenterStageProps> = ({
  viewMode,
  clips,
  audioTrack,
  isPlaying,
  onTogglePlay,
  currentTime,
  onSeek,
  currentStyle,
  aspectRatio,
  onChangeAspectRatio,
  onTriggerMakeItFire,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeBeatPulse, setActiveBeatPulse] = useState(false);

  // Canvas render loop for simulated video editing preview & audio waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark cinematic canvas background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Determine active clip based on currentTime
      let activeClip: TimelineClip | undefined = clips.find(
        (c) => currentTime >= c.startTime && currentTime <= c.startTime + c.duration
      );
      if (!activeClip && clips.length > 0) {
        activeClip = clips[0];
      }

      // Check if current timestamp is on or near a beat marker
      const isBeat = audioTrack.beatMarkers.some(
        (b) => Math.abs(b.time - (currentTime % audioTrack.duration)) < 0.12
      );

      if (isBeat && !activeBeatPulse) {
        setActiveBeatPulse(true);
        setTimeout(() => setActiveBeatPulse(false), 120);
      }

      // Draw stylized video simulation scene
      const clipIndex = activeClip ? clips.indexOf(activeClip) : 0;
      
      // Dynamic background gradient based on clip index & style
      const grad = ctx.createRadialGradient(
        width / 2, height / 2, 20,
        width / 2, height / 2, Math.max(width, height) / 1.1
      );

      if (currentStyle === 'HYPE') {
        grad.addColorStop(0, '#991b1b');
        grad.addColorStop(0.5, '#450a0a');
        grad.addColorStop(1, '#050505');
      } else if (currentStyle === 'SPORTS') {
        grad.addColorStop(0, '#065f46');
        grad.addColorStop(0.5, '#022c22');
        grad.addColorStop(1, '#020617');
      } else {
        grad.addColorStop(0, '#0369a1');
        grad.addColorStop(0.5, '#082f49');
        grad.addColorStop(1, '#020617');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Simulated 3D Action Wireframe / Graphic in Canvas Center
      const t = currentTime * 2.5;
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Beat scale pulse
      const scale = isBeat ? 1.08 : 1.0;
      ctx.scale(scale, scale);

      // Rotating runic ring
      ctx.strokeStyle = isBeat ? '#38bdf8' : 'rgba(125, 211, 252, 0.4)';
      ctx.lineWidth = isBeat ? 3 : 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 75, 0, Math.PI * 2);
      ctx.stroke();

      // Inner polygon
      ctx.strokeStyle = '#e0f2fe';
      ctx.beginPath();
      const sides = 6;
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides + t * 0.5;
        const r = 50 + Math.sin(t + i) * 6;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.restore();

      // Audio reactive waveform bars at bottom of canvas
      const barCount = 36;
      const barWidth = width / barCount;
      for (let i = 0; i < barCount; i++) {
        const freqHeight = Math.sin(currentTime * 8 + i * 0.4) * 20 + 26 + (isBeat ? 20 : 0);
        ctx.fillStyle = isBeat
          ? 'rgba(56, 189, 248, 0.85)'
          : 'rgba(148, 163, 184, 0.45)';
        ctx.fillRect(
          i * barWidth + 2,
          height - freqHeight - 20,
          barWidth - 4,
          freqHeight
        );
      }

      // Title & Score overlay
      if (activeClip) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px "Cinzel", serif';
        ctx.fillText(activeClip.title.toUpperCase(), 16, 32);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '11px sans-serif';
        ctx.fillText(
          `EFFECT: ${activeClip.effect || 'NONE'}  ·  TRANSITION: ${activeClip.transition || 'CUT'}  ·  SPEED: ${activeClip.speedRamp || 1.0}x`,
          16,
          50
        );

        ctx.fillStyle = '#f59e0b';
        ctx.fillText(
          `AI CLIP SCORE: ${activeClip.score.overall}/100 [VIS: ${activeClip.score.visual} | MOT: ${activeClip.score.motion} | SHP: ${activeClip.score.sharpness}]`,
          16,
          68
        );
      }

      // Beat marker strobe flash during drops
      if (isBeat) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(0, 0, width, height);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [currentTime, clips, audioTrack, isPlaying, currentStyle, activeBeatPulse]);

  return (
    <div className="relative flex-1 h-full min-h-[520px] flex items-center justify-center overflow-hidden">
      
      {/* Background Image: Kratos & Atreus Back-View (Exact match to uploaded image) */}
      <div className="absolute inset-0 z-0">
        <img
          src={backdropImage}
          alt="Norse Warrior and Archer Backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
        />
        {/* Subtle Nordic vignette scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 pointer-events-none" />
      </div>

      {/* Floating Center Content depending on ViewMode */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 py-2">
        
        {/* If in Video or Split mode, show Video Canvas Player Overlay */}
        {(viewMode === 'video' || viewMode === 'split') && (
          <div className="relative flex flex-col items-center w-full max-w-xl animate-fadeIn">
            {/* Top Canvas Controls Bar */}
            <div className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-950/90 border border-slate-700/80 rounded-t text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-cinzel text-slate-200 font-bold tracking-wider">
                  VIZMOTION PREVIEW CANVAS
                </span>
              </div>

              {/* Aspect Ratio Switcher */}
              <div className="flex items-center gap-1">
                {(['16:9', '9:16', '1:1'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => onChangeAspectRatio(ratio)}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer ${
                      aspectRatio === ratio
                        ? 'bg-amber-500 text-black font-bold'
                        : 'text-slate-400 hover:text-white bg-slate-800/80'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Canvas Container */}
            <div
              className={`relative bg-black border-x border-b border-slate-700/80 shadow-2xl overflow-hidden transition-all duration-300 ${
                aspectRatio === '9:16'
                  ? 'w-[280px] h-[480px]'
                  : aspectRatio === '1:1'
                  ? 'w-[360px] h-[360px]'
                  : 'w-[520px] h-[300px]'
              }`}
            >
              <canvas
                ref={canvasRef}
                width={aspectRatio === '9:16' ? 540 : aspectRatio === '1:1' ? 600 : 800}
                height={aspectRatio === '9:16' ? 960 : aspectRatio === '1:1' ? 600 : 450}
                className="w-full h-full object-cover"
              />

              {/* Watermark badge (None as per PRD requirement!) */}
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-slate-300">
                1080p · 60 FPS
              </div>

              {/* Beat sync flash halo */}
              {activeBeatPulse && (
                <div className="absolute inset-0 border-2 border-sky-400/80 pointer-events-none transition-opacity duration-100" />
              )}
            </div>

            {/* Video Player Transport Bar */}
            <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-950/95 border border-slate-700/80 rounded-b backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={onTogglePlay}
                  className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-cinzel font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                >
                  {isPlaying ? 'PAUSE' : 'PLAY'}
                </button>
                <span className="font-mono text-xs text-slate-300">
                  {currentTime.toFixed(2)}s / {audioTrack.duration.toFixed(2)}s
                </span>
              </div>

              {/* Scrub range slider */}
              <input
                type="range"
                min="0"
                max={audioTrack.duration}
                step="0.05"
                value={currentTime}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="mx-4 flex-1 accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />

              {/* Style Badge */}
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-cinzel font-bold text-amber-300 border border-amber-500/40">
                {currentStyle}
              </span>
            </div>
          </div>
        )}

        {/* Loadout Center Callout overlay when in Loadout mode */}
        {viewMode === 'loadout' && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
            <button
              onClick={() => {
                sounds.playMakeItFire();
                onTriggerMakeItFire();
              }}
              className="group relative px-6 py-2.5 rounded bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 text-black font-cinzel font-black text-sm tracking-widest border border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                MAKE IT FIRE 🔥
              </span>
            </button>
            <span className="font-cinzel text-[11px] text-slate-300/80 tracking-wider mt-1.5 text-center drop-shadow">
              DROP CLIPS + ADD MUSIC → 1-CLICK BEAT SYNCHRONIZATION
            </span>
          </div>
        )}

      </div>
    </div>
  );
};
