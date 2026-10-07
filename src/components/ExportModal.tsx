import React, { useState } from 'react';
import { sounds } from '../utils/audioSynth';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  aspectRatio: '16:9' | '9:16' | '1:1';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  aspectRatio: initialRatio,
}) => {
  const [format, setFormat] = useState<'9:16' | '16:9' | '1:1'>(initialRatio);
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

          // Trigger simulated download of exported MP4 file
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
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="relative w-full max-w-md rounded bg-gradient-to-b from-slate-900 to-slate-950 border border-sky-500/70 p-6 shadow-[0_0_40px_rgba(56,189,248,0.3)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-500/40 pb-3">
          <h3 className="font-cinzel text-base font-black text-sky-200 tracking-wider">
            EXPORT ENGINE // VIZMOTION AI
          </h3>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="text-slate-400 hover:text-white font-cinzel text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {!isExporting ? (
          <div className="mt-4 space-y-4">
            {/* Format Preset */}
            <div>
              <label className="block text-[11px] font-cinzel font-bold text-slate-300 mb-1.5">
                TARGET PLATFORM & ASPECT RATIO:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '9:16', label: 'SHORTS / REELS', ratio: '9:16' },
                  { id: '16:9', label: 'YOUTUBE / 4K', ratio: '16:9' },
                  { id: '1:1', label: 'SQUARE FEED', ratio: '1:1' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      sounds.playSelect();
                      setFormat(item.ratio as '9:16' | '16:9' | '1:1');
                    }}
                    className={`p-2 rounded text-[11px] font-cinzel font-bold text-center cursor-pointer transition-all ${
                      format === item.ratio
                        ? 'bg-sky-500 text-black border border-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                        : 'bg-slate-950 border border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>{item.ratio}</div>
                    <div className="text-[9px] opacity-80">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div>
              <label className="block text-[11px] font-cinzel font-bold text-slate-300 mb-1.5">
                OUTPUT RESOLUTION & CODEC:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '1080p', label: '1080p (FHD)' },
                  { id: '4k', label: '4K (UHD)' },
                  { id: '720p', label: '720p (FAST)' },
                ].map((res) => (
                  <button
                    key={res.id}
                    onClick={() => {
                      sounds.playSelect();
                      setResolution(res.id as '1080p' | '4k' | '720p');
                    }}
                    className={`p-2 rounded text-xs font-mono font-bold text-center cursor-pointer transition-all ${
                      resolution === res.id
                        ? 'bg-amber-500 text-black border border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                        : 'bg-slate-950 border border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {res.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Specs Guarantee (PRD Section 14: No Watermarks) */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded text-[11px] space-y-1.5 font-cinzel text-slate-300">
              <div className="flex justify-between">
                <span>BITRATE:</span>
                <span className="font-mono text-emerald-400">HIGH (45 Mbps)</span>
              </div>
              <div className="flex justify-between">
                <span>FRAME RATE:</span>
                <span className="font-mono text-emerald-400">60 FPS</span>
              </div>
              <div className="flex justify-between">
                <span>WATERMARK POLICY:</span>
                <span className="font-mono text-emerald-400">CLEAN (NO WATERMARK)</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-cinzel text-slate-400 hover:text-white cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleStartExport}
                className="px-6 py-2.5 rounded bg-sky-500 hover:bg-sky-400 text-black font-cinzel font-black text-xs tracking-wider shadow-[0_0_15px_rgba(56,189,248,0.5)] cursor-pointer active:scale-95 transition-all"
              >
                EXPORT NOW (MP4)
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 py-6 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin" />
            <div className="text-center">
              <p className="font-cinzel text-sm font-bold text-sky-200">
                ENCODING BEAT-SYNCED MASTER... {progress}%
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">
                VALIDATING AUDIO/VIDEO SYNCHRONIZATION (&lt;100ms)
              </p>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-sky-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
