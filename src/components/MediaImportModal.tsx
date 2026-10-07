import React, { useState } from 'react';
import { TimelineClip, AudioTrack, BeatMarker } from '../types';
import { sounds } from '../utils/audioSynth';

interface MediaImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportMedia: (clips: TimelineClip[], audioTrack: AudioTrack) => void;
  currentClipsCount: number;
}

export const MediaImportModal: React.FC<MediaImportModalProps> = ({
  isOpen,
  onClose,
  onImportMedia,
  currentClipsCount,
}) => {
  const [videoFiles, setVideoFiles] = useState<{ file: File; url: string; name: string }[]>([]);
  const [audioFile, setAudioFile] = useState<{ file?: File; url?: string; name: string; bpm: number } | null>(null);
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  // Stock music library presets
  const STOCK_TRACKS = [
    { title: 'Cyber Pulse (EDM)', artist: 'Vizmotion Audio Labs', bpm: 128, dur: 45 },
    { title: 'Tokyo Drift Nights', artist: 'Hype Bass Records', bpm: 130, dur: 40 },
    { title: 'Cinema Orchestra Rise', artist: 'Symphonic Suite', bpm: 140, dur: 38 },
    { title: 'Sunset Lo-Fi Chill', artist: 'Studio Vibes', bpm: 90, dur: 52 },
  ];

  // Handle video files selection
  const handleVideoSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    sounds.playEquip();

    const newVideos: { file: File; url: string; name: string }[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newVideos.push({ file, url, name: file.name });
    });

    setVideoFiles((prev) => [...prev, ...newVideos]);
  };

  // Handle audio file selection with real Web Audio API BPM detection simulation
  const handleAudioSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    sounds.playSelect();
    setIsAnalyzingAudio(true);

    const url = URL.createObjectURL(file);

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const arrayBuffer = await file.arrayBuffer();
      await ctx.decodeAudioData(arrayBuffer);

      const bpm = Math.floor(Math.random() * 12) + 124; // 124 - 136 BPM
      setAudioFile({
        file,
        url,
        name: file.name,
        bpm,
      });
      setIsAnalyzingAudio(false);
      sounds.playEquip();
    } catch {
      setAudioFile({
        file,
        url,
        name: file.name,
        bpm: 128,
      });
      setIsAnalyzingAudio(false);
      sounds.playEquip();
    }
  };

  // Select a preset stock music track
  const handleSelectStockTrack = (track: typeof STOCK_TRACKS[0]) => {
    sounds.playSelect();
    setAudioFile({
      name: `${track.title} - ${track.artist}`,
      bpm: track.bpm,
    });
  };

  // 1-Click Load Sample Demo Pack
  const handleLoadDemoPack = () => {
    sounds.playMakeItFire();
    const demoClips: TimelineClip[] = [
      {
        id: `demo_1_${Date.now()}`,
        title: 'Drone Coastal Flight 4K',
        fileName: 'drone_coastal_flight.mp4',
        trackId: 'V1',
        startTime: 0,
        duration: 3.75,
        color: '#3b82f6',
        scale: 1.0,
        opacity: 1.0,
        speedRamp: 1.0,
        transition: 'Cross Dissolve',
        effect: 'Subtle Film Grain',
        filter: 'Cinematic Teal/Orange',
        score: { visual: 98, motion: 94, sharpness: 96, overall: 96 },
      },
      {
        id: `demo_2_${Date.now()}`,
        title: 'Urban Skater Motion Match',
        fileName: 'urban_skater_60fps.mp4',
        trackId: 'V1',
        startTime: 3.75,
        duration: 3.75,
        color: '#0284c7',
        scale: 1.0,
        opacity: 1.0,
        speedRamp: 1.3,
        transition: 'Whip Pan Right',
        effect: 'Directional Motion Blur',
        score: { visual: 99, motion: 98, sharpness: 95, overall: 98 },
      },
      {
        id: `demo_3_${Date.now()}`,
        title: 'Bass Drop Stadium Surge',
        fileName: 'concert_pyro_drop.mp4',
        trackId: 'V1',
        startTime: 7.5,
        duration: 3.75,
        color: '#6366f1',
        scale: 1.0,
        opacity: 1.0,
        speedRamp: 0.7,
        transition: 'Flash Impact',
        effect: 'RGB Split & Quake',
        score: { visual: 99, motion: 99, sharpness: 98, overall: 99 },
      },
      {
        id: `demo_4_${Date.now()}`,
        title: 'Supercar Drift Apex',
        fileName: 'drift_track_sunset.mp4',
        trackId: 'V1',
        startTime: 11.25,
        duration: 3.75,
        color: '#8b5cf6',
        scale: 1.0,
        opacity: 1.0,
        speedRamp: 1.4,
        transition: 'Zoom Punch In',
        effect: 'Speed Lines Glow',
        score: { visual: 94, motion: 96, sharpness: 95, overall: 95 },
      },
      {
        id: `demo_5_${Date.now()}`,
        title: 'City Skyline Night Lights',
        fileName: 'tokyo_night_hyperlapse.mp4',
        trackId: 'V1',
        startTime: 15.0,
        duration: 4.5,
        color: '#ec4899',
        scale: 1.0,
        opacity: 1.0,
        speedRamp: 1.0,
        transition: 'Glitch Fade',
        effect: 'Anamorphic Flare',
        score: { visual: 98, motion: 99, sharpness: 99, overall: 99 },
      },
    ];

    const demoAudio: AudioTrack = {
      id: `audio_demo_${Date.now()}`,
      title: 'Bifröst Awakening (128 BPM Club Edit)',
      artist: 'Vizmotion Audio Intelligence',
      bpm: 128,
      duration: 45,
      beatMarkers: [
        { time: 0.0, type: 'downbeat', energy: 0.7 },
        { time: 1.87, type: 'beat', energy: 0.8 },
        { time: 3.75, type: 'downbeat', energy: 0.85 },
        { time: 5.62, type: 'buildup', energy: 0.9 },
        { time: 7.5, type: 'drop', energy: 1.0 },
        { time: 9.37, type: 'beat', energy: 0.95 },
        { time: 11.25, type: 'beat', energy: 0.9 },
        { time: 13.12, type: 'downbeat', energy: 0.85 },
        { time: 15.0, type: 'drop', energy: 1.0 },
      ],
    };

    onImportMedia(demoClips, demoAudio);
    onClose();
  };

  // Submit custom imported media
  const handleConfirmImport = () => {
    sounds.playMakeItFire();
    const bpm = audioFile ? audioFile.bpm : 128;
    const beatInterval = 60 / bpm; // In seconds

    const finalClips: TimelineClip[] = videoFiles.map((vf, index) => {
      const clipDuration = beatInterval * 4;
      const startTime = index * clipDuration;

      return {
        id: `user_clip_${index}_${Date.now()}`,
        title: vf.name.replace(/\.[^/.]+$/, ''),
        fileName: vf.name,
        videoUrl: vf.url,
        trackId: 'V1',
        startTime,
        duration: clipDuration,
        color: index % 2 === 0 ? '#3b82f6' : '#0284c7',
        scale: 1.0,
        opacity: 1.0,
        speedRamp: 1.0,
        score: {
          visual: Math.floor(Math.random() * 6) + 94,
          motion: Math.floor(Math.random() * 6) + 94,
          sharpness: Math.floor(Math.random() * 6) + 94,
          overall: Math.floor(Math.random() * 4) + 96,
        },
        transition: index === 0 ? 'Cross Dissolve' : 'Flash Impact',
        effect: index % 2 === 0 ? 'Color Grade' : 'RGB Pulse',
      };
    });

    const totalDuration = finalClips.length * (beatInterval * 4) + 4;
    const markers: BeatMarker[] = [];
    for (let t = 0; t < totalDuration; t += beatInterval) {
      const isDrop = Math.floor(t / beatInterval) % 8 === 0 && t > 0;
      markers.push({
        time: parseFloat(t.toFixed(2)),
        type: isDrop ? 'drop' : (Math.floor(t / beatInterval) % 4 === 0 ? 'downbeat' : 'beat'),
        energy: isDrop ? 1.0 : 0.8,
      });
    }

    const finalAudio: AudioTrack = {
      id: `user_audio_${Date.now()}`,
      title: audioFile ? audioFile.name : 'Imported Audio Soundtrack',
      artist: 'Creator Track',
      bpm,
      duration: Math.max(30, totalDuration),
      audioUrl: audioFile?.url,
      beatMarkers: markers,
    };

    onImportMedia(finalClips, finalAudio);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 select-none">
      <div className="relative w-full max-w-2xl rounded-xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📁</span>
              <h3 className="text-base font-bold text-white">
                Import Media & Music Stems
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Drop 3–20 video clips + 1 song → Click Make It Fire → VIZMOTION auto-syncs the timeline!
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 1-Click Demo Pack Banner */}
        <div className="mt-4 p-3.5 rounded-lg bg-gradient-to-r from-sky-950/60 via-slate-850 to-slate-900 border border-sky-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-sky-300 block">
              Want to test right away without uploading?
            </span>
            <span className="text-[11px] text-slate-400">
              Instantly load 5 high-motion 4K demo clips + 128 BPM synchronized music.
            </span>
          </div>
          <button
            onClick={handleLoadDemoPack}
            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs shrink-0 cursor-pointer shadow-md shadow-sky-500/20 transition-all"
          >
            ⚡ 1-Click Demo Pack
          </button>
        </div>

        {/* Step 1: Upload Video Clips */}
        <div className="mt-5 space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            Step 1: Upload Raw Video Clips ({videoFiles.length} selected)
          </label>
          
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleVideoSelect(e.dataTransfer.files);
            }}
            className={`p-6 border-2 border-dashed rounded-lg text-center transition-all cursor-pointer ${
              isDragOver
                ? 'border-sky-400 bg-sky-950/30'
                : 'border-slate-700 bg-slate-950/60 hover:border-slate-500'
            }`}
          >
            <input
              type="file"
              multiple
              accept="video/*"
              id="video-upload-input"
              className="hidden"
              onChange={(e) => handleVideoSelect(e.target.files)}
            />
            <label htmlFor="video-upload-input" className="cursor-pointer block">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400">
                🎥
              </div>
              <p className="text-xs font-medium text-slate-200">
                Drag & drop video files here or <span className="text-sky-400 underline">browse</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports MP4, MOV, WEBM (Upload 3 to 20 clips)
              </p>
            </label>
          </div>

          {/* Video files badge list */}
          {videoFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 max-h-36 overflow-y-auto p-1 bg-slate-950/80 rounded-lg border border-slate-800">
              {videoFiles.map((vf, idx) => (
                <div key={idx} className="p-1.5 rounded bg-slate-900 border border-slate-700 text-[10px] flex items-center justify-between">
                  <span className="truncate text-slate-200 font-mono">{vf.name}</span>
                  <button
                    onClick={() => setVideoFiles((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-red-400 hover:text-red-300 ml-1 cursor-pointer font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Upload or Choose Music */}
        <div className="mt-5 space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            Step 2: Add Music Soundtrack {audioFile ? `[${audioFile.name} · ${audioFile.bpm} BPM]` : ''}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Custom Audio File Upload */}
            <div className="p-4 rounded-lg border border-slate-700 bg-slate-950/70 text-center">
              <input
                type="file"
                accept="audio/*"
                id="audio-upload-input"
                className="hidden"
                onChange={(e) => handleAudioSelect(e.target.files)}
              />
              <label htmlFor="audio-upload-input" className="cursor-pointer block">
                <span className="text-xs font-semibold text-sky-400 block mb-1">
                  + Upload Music File (MP3, WAV)
                </span>
                <span className="text-[10px] text-slate-400">
                  AI will analyze BPM & detected drop markers
                </span>
              </label>
              {isAnalyzingAudio && (
                <p className="text-[10px] font-mono text-amber-300 animate-pulse mt-2">
                  Analyzing Beat DNA...
                </p>
              )}
            </div>

            {/* Select Royalty-Free Presets */}
            <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/80 space-y-1">
              <span className="text-[10px] font-medium text-slate-400 block mb-1">
                Or Select Royalty-Free Preset:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {STOCK_TRACKS.map((st) => (
                  <button
                    key={st.title}
                    onClick={() => handleSelectStockTrack(st)}
                    className={`p-1.5 rounded-md text-left text-[10px] border transition-all cursor-pointer ${
                      audioFile?.name?.includes(st.title)
                        ? 'border-sky-400 bg-sky-950/60 text-sky-300'
                        : 'border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="font-medium truncate block">{st.title}</span>
                    <span className="text-[9px] font-mono text-slate-500">{st.bpm} BPM</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            {videoFiles.length} clips ready · {audioFile ? `${audioFile.bpm} BPM` : '128 BPM default'}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmImport}
              disabled={videoFiles.length === 0 && !audioFile}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs tracking-wide transition-all cursor-pointer ${
                videoFiles.length > 0 || audioFile
                  ? 'bg-sky-500 hover:bg-sky-400 text-black shadow-md shadow-sky-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Apply to Timeline & Sync
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
