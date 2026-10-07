import React, { useState } from 'react';
import { sounds } from '../utils/audioSynth';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  aspectRatio: initialRatio,
}) => {
  const [format, setFormat] = useState<'9:16' | '16:9' | '1:1' | '4:5'>(initialRatio);
  const [resolution, setResolution] = useState<'1080p' | '4k' | '720p'>('1080p');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleStartExport = () => {
    sounds.playSelect();
    setIsExporting(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 10;
        } else {
          clearInterval(interval);
          setIsExporting(false);
          sounds.playEquip();

          // Simulated browser file download
          const blob = new Blob(['VIZMOTION_AI_VIDEO_STREAM'], { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `VIZMOTION_${format.replace(':', 'x')}_${resolution}.mp4`;
          a.click();
          URL.revokeObjectURL(url);
          onClose();
          return 100;
        }
      });
    }, 180);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 select-none">
      <div className="relative w-full max-w-md rounded-xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Export Video Project
            </h3>
            <p className="text-[11px] text-slate-400">
              High-definition rendering with rights-aware clean export
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="text-slate-400 hover:text-white text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {!isExporting ? (
          <div className="mt-4 space-y-4">
            {/* Format Preset */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Target Platform & Aspect Ratio:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: '9:16', label: 'Shorts/TikTok', ratio: '9:16' },
                  { id: '16:9', label: 'YouTube/4K', ratio: '16:9' },
                  { id: '1:1', label: 'Square Feed', ratio: '1:1' },
                  { id: '4:5', label: 'Instagram', ratio: '4:5' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      sounds.playSelect();
                      setFormat(item.ratio as '9:16' | '16:9' | '1:1' | '4:5');
                    }}
                    className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
                      format === item.ratio
                        ? 'bg-sky-500 text-black font-bold shadow-md shadow-sky-500/20'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold">{item.ratio}</div>
                    <div className="text-[9px] truncate opacity-80">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Output Resolution & Quality:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '1080p', label: '1080p (FHD)' },
                  { id: '4k', label: '4K (UHD)' },
                  { id: '720p', label: '720p (Fast)' },
                ].map((res) => (
                  <button
                    key={res.id}
                    onClick={() => {
                      sounds.playSelect();
                      setResolution(res.id as '1080p' | '4k' | '720p');
                    }}
                    className={`p-2 rounded-lg text-xs font-medium text-center cursor-pointer transition-all ${
                      resolution === res.id
                        ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {res.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Specs Guarantee (PRD Section 14: No Watermarks) */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>Codec:</span>
                <span className="font-mono text-emerald-400">H.264 / MP4 (High Profile)</span>
              </div>
              <div className="flex justify-between">
                <span>Frame Rate:</span>
                <span className="font-mono text-emerald-400">60 FPS Smooth</span>
              </div>
              <div className="flex justify-between">
                <span>Watermark Policy:</span>
                <span className="font-mono text-emerald-400">Clean (No Watermark)</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleStartExport}
                className="px-6 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs tracking-wide shadow-lg shadow-sky-500/20 cursor-pointer active:scale-95 transition-all"
              >
                Render & Download MP4
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 py-8 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin" />
            <div className="text-center">
              <p className="text-sm font-bold text-sky-200">
                Rendering Master Video... {progress}%
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Validating audio synchronization & sub-frame cuts
              </p>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-sky-400 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
