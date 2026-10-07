import React, { useState } from 'react';
import { EditingStyle } from '../types';
import { sounds } from '../utils/audioSynth';

interface MakeItFireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteEdit: (style: EditingStyle) => void;
  currentStyle: EditingStyle;
}

const STYLES: EditingStyle[] = [
  'CINEMATIC',
  'HYPE',
  'MUSIC VIDEO',
  'SPORTS',
  'DARK',
  'DREAMY',
  'SOCIAL TREND',
];

export const MakeItFireModal: React.FC<MakeItFireModalProps> = ({
  isOpen,
  onClose,
  onCompleteEdit,
  currentStyle,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<EditingStyle>(currentStyle);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    'ANALYZING MUSIC BEAT DNA (128 BPM · 4/4 DETECTED)...',
    'SCORING RAW CLIPS (VISUAL QUALITY: 96% · MOTION: 98%)...',
    'MOTION MATCHING & ALIGNING CUTS TO DOWNBEATS...',
    'INJECTING RUNIC TRANSITIONS & SPEED RAMPS...',
    'SYNTHESIZING 1080P PROXY PREVIEW...',
  ];

  const handleRunMakeItFire = () => {
    sounds.playMakeItFire();
    setIsProcessing(true);
    setProgressStep(0);

    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            sounds.playEquip();
            onCompleteEdit(selectedStyle);
            onClose();
          }, 800);
          return prev;
        }
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded bg-gradient-to-b from-slate-900/98 to-slate-950 border border-amber-500/70 p-6 shadow-[0_0_50px_rgba(245,158,11,0.35)] select-none">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h3 className="font-cinzel text-lg font-black text-amber-300 tracking-wider">
              MAKE IT FIRE — AI EDIT ENGINE
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-white font-cinzel text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {!isProcessing ? (
          <div className="mt-4 space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              VIZMOTION AI analyzes your footage, extracts the musical rhythm from your audio, detects high-motion moments, and builds a complete beat-synchronized edit in one click.
            </p>

            {/* Style Selector */}
            <div>
              <label className="block text-[11px] font-cinzel font-bold text-amber-300 mb-2">
                CHOOSE AI DIRECTING STYLE:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => {
                      sounds.playSelect();
                      setSelectedStyle(style);
                    }}
                    className={`p-2 rounded text-xs font-cinzel font-bold tracking-wider transition-all cursor-pointer ${
                      selectedStyle === style
                        ? 'bg-amber-500 text-black border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                        : 'bg-slate-950/80 text-slate-300 border border-slate-700 hover:border-amber-400/50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="p-3 bg-slate-950/60 rounded border border-slate-800 text-[11px] font-cinzel space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>✓ BEAT-SYNCHRONIZED CUTS</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>✓ MOTION MATCHING SEQUENCING</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>✓ AUTO SPEED RAMPS ON DROPS</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>✓ COLOR GRADE & RUNIC LUT</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded text-xs font-cinzel text-slate-400 hover:text-white cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleRunMakeItFire}
                className="px-6 py-2.5 rounded bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 text-black font-cinzel font-black text-sm tracking-widest border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                IGNITE EDIT 🔥
              </button>
            </div>
          </div>
        ) : (
          /* Processing State */
          <div className="mt-6 py-6 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin flex items-center justify-center">
              <span className="text-xl">🔥</span>
            </div>
            <div className="text-center space-y-1">
              <p className="font-cinzel text-sm font-bold text-amber-300 tracking-wider">
                {steps[progressStep]}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                STEP {progressStep + 1} OF {steps.length} · SUB-FRAME PRECISION
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-950 rounded border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-amber-300 transition-all duration-300"
                style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
