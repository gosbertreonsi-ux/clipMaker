import React, { useState } from 'react';
import { sounds } from '../utils/audioSynth';

interface MakeItFireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteEdit: (style: string) => void;
  currentStyle: string;
}

const STYLES = [
  'CINEMATIC',
  'HYPE',
  'MUSIC VIDEO',
  'SPORTS',
  'DARK',
  'DREAMY',
  'TIKTOK VIRAL',
  'LUXURY FASHION',
];

export const MakeItFireModal: React.FC<MakeItFireModalProps> = ({
  isOpen,
  onClose,
  onCompleteEdit,
  currentStyle,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<string>(currentStyle);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    'Analyzing music tempo & detecting 128 BPM beat map...',
    'Scoring raw video clips (Visual: 98% · Motion: 99%)...',
    'Aligning cuts to downbeats and tempo changes...',
    'Injecting cinematic speed ramps and seamless transitions...',
    'Synthesizing full 1080p 60fps timeline preview...',
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
          }, 600);
          return prev;
        }
      });
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="relative w-full max-w-lg rounded-xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-lg shadow-md shadow-orange-500/20">
              🔥
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Make It Fire — AI Video Creator
              </h3>
              <p className="text-[11px] text-slate-400">
                1-Click professional beat synchronization and clip sequencing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-white text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {!isProcessing ? (
          <div className="mt-4 space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              VIZMOTION Creative Intelligence extracts the rhythm and energy curve of your music, scores every camera movement, and assembles a professional beat-synced edit automatically.
            </p>

            {/* Style Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2">
                Choose Directing Style:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => {
                      sounds.playSelect();
                      setSelectedStyle(style);
                    }}
                    className={`p-2 rounded-lg text-xs font-medium text-center transition-all cursor-pointer ${
                      selectedStyle === style
                        ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>Sub-frame beat synchronization (±12ms)</span>
                <span className="text-emerald-400 font-mono font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Optical motion matching & match cuts</span>
                <span className="text-emerald-400 font-mono font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Automatic speed ramps on drops</span>
                <span className="text-emerald-400 font-mono font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Cinematic color grade & LUT</span>
                <span className="text-emerald-400 font-mono font-semibold">Active</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRunMakeItFire}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-black font-bold text-xs tracking-wide shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Ignite Edit 🔥
              </button>
            </div>
          </div>
        ) : (
          /* Processing State */
          <div className="mt-6 py-8 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin flex items-center justify-center">
              <span className="text-sm">🔥</span>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-amber-300">
                {steps[progressStep]}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Step {progressStep + 1} of {steps.length} · Processing Timeline
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-300"
                style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
