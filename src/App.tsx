/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserMode,
  SidebarTab,
  TimelineClip,
  AudioTrack,
  ColorGradeSettings,
  ProjectSettings,
  CaptionPreset,
  CaptionItem,
  RepurposeCard,
  AIModel,
} from './types';
import { INITIAL_CLIPS, DEMO_AUDIO, DEFAULT_COLOR_GRADE, DEMO_CAPTIONS } from './data/mockData';
import { sounds } from './utils/audioSynth';
import { StudioHeader } from './components/StudioHeader';
import { SidebarNav } from './components/SidebarNav';
import { VideoPreviewPlayer } from './components/VideoPreviewPlayer';
import { InspectorPanel } from './components/InspectorPanel';
import { MultiTrackTimeline } from './components/MultiTrackTimeline';
import { MediaImportModal } from './components/MediaImportModal';
import { MakeItFireModal } from './components/MakeItFireModal';
import { ExportModal } from './components/ExportModal';
import { AIModelOrchestratorModal } from './components/AIModelOrchestratorModal';

export default function App() {
  // Mode & Navigation states
  const [userMode, setUserMode] = useState<UserMode>('EDIT');
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('media');

  // Project Settings
  const [projectSettings, setProjectSettings] = useState<ProjectSettings>({
    name: 'Untitled Project - Reel 1',
    aspectRatio: '16:9',
    resolution: '1080p',
    fps: 60,
    activeModelProfile: 'AUTO',
  });

  // Timeline Media & Stems states
  const [clips, setClips] = useState<TimelineClip[]>(INITIAL_CLIPS);
  const [audioTrack, setAudioTrack] = useState<AudioTrack>(DEMO_AUDIO);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(INITIAL_CLIPS[0].id);
  const [colorGrade, setColorGrade] = useState<ColorGradeSettings>(DEFAULT_COLOR_GRADE);
  const [captions, setCaptions] = useState<CaptionItem[]>(DEMO_CAPTIONS);
  const [activeCaptionStyle, setActiveCaptionStyle] = useState<CaptionPreset>('HORMOZI_BOLD');

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isMakeItFireOpen, setIsMakeItFireOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isModelOrchestratorOpen, setIsModelOrchestratorOpen] = useState(false);
  const [aiFeedbackToast, setAiFeedbackToast] = useState<string | null>(null);

  // Toggle audio stem mute
  const handleToggleStemMute = (stemId: string) => {
    setAudioTrack((prev) => ({
      ...prev,
      stems: prev.stems?.map((s) => (s.id === stemId ? { ...s, muted: !s.muted } : s)),
    }));
    showToast(`Toggled ${stemId.toUpperCase()} stem state`);
  };

  // 1-Click Repurpose execution (Section 34 of PRD)
  const handleSelectRepurpose = (card: RepurposeCard) => {
    setProjectSettings((prev) => ({ ...prev, aspectRatio: card.aspectRatio }));
    setClips((prev) =>
      prev.map((c) => ({
        ...c,
        speedRamp: card.platform === 'TikTok' ? 1.3 : 1.1,
      }))
    );
    showToast(`Repurposed for ${card.platform}! Projected Hook Retention: ${card.hookRetentionScore}%`);
  };

  // Test individual AI model from Orchestrator
  const handleTestModel = (model: AIModel) => {
    if (model.category === 'vision') {
      // SAM-2 background removal
      setClips((prev) =>
        prev.map((c, i) => (i === 0 ? { ...c, aiBgRemoved: true, effect: 'SAM-2 Subject Isolated' } : c))
      );
      showToast(`${model.name} executed: Subject isolated without greenscreen!`);
    } else if (model.category === 'audio') {
      // Whisper / Demucs
      showToast(`${model.name} executed: Audio stems & subtitles synchronized!`);
    } else {
      showToast(`${model.name} executed successfully! (Benchmark: ${model.benchmarkScore}%)`);
    }
  };

  // Playback timer & audio beat synthesis
  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.05;
          if (next >= audioTrack.duration) {
            return 0;
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isPlaying, audioTrack.duration]);

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      sounds.toggleMusicBeat(audioTrack.bpm);
    } else {
      sounds.stopMusic();
    }
  };

  // Currently selected clip object
  const selectedClip = clips.find((c) => c.id === selectedClipId) || null;

  // Handle clip property updates
  const handleUpdateClip = (clipId: string, updates: Partial<TimelineClip>) => {
    setClips((prev) =>
      prev.map((c) => (c.id === clipId ? { ...c, ...updates } : c))
    );
  };

  // Split active clip at playhead
  const handleSplitClip = () => {
    if (!selectedClipId) return;
    const clip = clips.find((c) => c.id === selectedClipId);
    if (!clip || clip.duration <= 0.8) return;

    const half = clip.duration / 2;
    setClips((prev) =>
      prev.flatMap((c) =>
        c.id === selectedClipId
          ? [
              { ...c, duration: half },
              {
                ...c,
                id: `clip_${Date.now()}`,
                title: `${c.title} (Part 2)`,
                startTime: c.startTime + half,
                duration: half,
              },
            ]
          : [c]
      )
    );
    showToast(`Split "${clip.title}" at playhead`);
  };

  // Delete active clip
  const handleDeleteClip = () => {
    if (!selectedClipId || clips.length <= 1) return;
    setClips((prev) => prev.filter((c) => c.id !== selectedClipId));
    setSelectedClipId(clips[0].id);
    showToast('Deleted clip from timeline');
  };

  // Add new clip to timeline
  const handleAddClip = () => {
    const newId = `clip_${Date.now()}`;
    const newClip: TimelineClip = {
      id: newId,
      title: `B-Roll Scene ${clips.length + 1}`,
      trackId: 'V1',
      startTime: clips.length * 3.75,
      duration: 3.75,
      color: '#3b82f6',
      scale: 1.0,
      opacity: 1.0,
      speedRamp: 1.0,
      transition: 'Cross Dissolve',
      score: { visual: 96, motion: 94, sharpness: 95, overall: 95 },
    };
    setClips((prev) => [...prev, newClip]);
    setSelectedClipId(newId);
    showToast('Added new clip to timeline');
  };

  // Handle media import
  const handleImportMedia = (newClips: TimelineClip[], newAudio: AudioTrack) => {
    setClips(newClips);
    setAudioTrack(newAudio);
    setSelectedClipId(newClips.length > 0 ? newClips[0].id : null);
    setCurrentTime(0);
    showToast(`Imported ${newClips.length} clips & ${newAudio.bpm} BPM soundtrack!`);
  };

  // AI Command Bar execution engine (Section 5 of PRD)
  const handleExecuteAICommand = (command: string) => {
    const cmd = command.toLowerCase();

    if (cmd.includes('beat') || cmd.includes('follow') || cmd.includes('sync')) {
      // Sync cuts to beat
      const beatInterval = (60 / audioTrack.bpm) * 4;
      setClips((prev) =>
        prev.map((c, i) => ({
          ...c,
          startTime: i * beatInterval,
          duration: beatInterval,
          transition: 'Flash Impact',
        }))
      );
      showToast(`AI aligned all cuts to ${audioTrack.bpm} BPM downbeats!`);
    } else if (cmd.includes('tiktok') || cmd.includes('vertical') || cmd.includes('9:16')) {
      // Convert to TikTok vertical
      setProjectSettings((prev) => ({ ...prev, aspectRatio: '9:16' }));
      setClips((prev) =>
        prev.map((c) => ({
          ...c,
          speedRamp: 1.25,
        }))
      );
      showToast('Switched to 9:16 TikTok format & accelerated pacing!');
    } else if (cmd.includes('cinematic') || cmd.includes('teal') || cmd.includes('color')) {
      // Cinematic look
      setColorGrade({
        exposure: 0,
        contrast: 25,
        saturation: 15,
        temperature: -10,
        tint: 0,
        preset: 'Cinematic Teal & Orange',
      });
      showToast('Applied Cinematic Teal & Orange grade and letterboxing!');
    } else if (cmd.includes('speed') || cmd.includes('ramp') || cmd.includes('drop')) {
      // Speed ramps on drops
      setClips((prev) =>
        prev.map((c, i) => ({
          ...c,
          speedRamp: i % 2 === 0 ? 1.5 : 0.6,
          effect: 'RGB Split & Quake',
        }))
      );
      showToast('Generated dynamic speed ramps on musical drops!');
    } else if (cmd.includes('hook') || cmd.includes('first 3') || cmd.includes('retention')) {
      // Optimize opening hook
      setClips((prev) => [
        {
          id: `hook_${Date.now()}`,
          title: 'HIGH-ENERGY OPENING HOOK (3s)',
          trackId: 'V1',
          startTime: 0,
          duration: 3.0,
          color: '#ef4444',
          speedRamp: 1.4,
          transition: 'Whip Pan Right',
          score: { visual: 99, motion: 99, sharpness: 99, overall: 99 },
        },
        ...prev.map((c) => ({ ...c, startTime: c.startTime + 3.0 })),
      ]);
      showToast('Injected 3-second high-retention visual hook!');
    } else {
      // General creative polish
      setClips((prev) =>
        prev.map((c) => ({
          ...c,
          transition: 'Cross Dissolve',
          score: { ...c.score, overall: Math.min(99, c.score.overall + 3) },
        }))
      );
      showToast(`AI Creative Plan applied: "${command}"`);
    }
  };

  const showToast = (msg: string) => {
    setAiFeedbackToast(msg);
    setTimeout(() => setAiFeedbackToast(null), 4000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'c' || e.key === 'C') {
        handleSplitClip();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteClip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, selectedClipId, clips]);

  return (
    <div className="relative w-screen h-screen bg-[#070a0f] text-slate-100 flex flex-col justify-between overflow-hidden font-sans">
      
      {/* Top Application Header */}
      <StudioHeader
        userMode={userMode}
        onSetUserMode={setUserMode}
        projectSettings={projectSettings}
        onChangeProjectName={(name) => setProjectSettings((p) => ({ ...p, name }))}
        onExecuteAICommand={handleExecuteAICommand}
        onOpenImport={() => setIsImportModalOpen(true)}
        onOpenMakeItFire={() => setIsMakeItFireOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenModelOrchestrator={() => setIsModelOrchestratorOpen(true)}
        hasUnsavedChanges={false}
      />

      {/* Floating AI Feedback Toast */}
      {aiFeedbackToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-slate-900 border border-sky-400/80 text-sky-200 text-xs font-medium shadow-2xl shadow-sky-500/20 flex items-center gap-2 animate-fadeIn">
          <span className="text-amber-400">⚡</span>
          <span>{aiFeedbackToast}</span>
        </div>
      )}

      {/* Main Workspace Stage */}
      <div className="relative flex-1 w-full flex overflow-hidden">
        
        {/* Left: Tools & Media Sidebar */}
        <SidebarNav
          activeTab={activeSidebarTab}
          onSelectTab={setActiveSidebarTab}
          clips={clips}
          audioTrack={audioTrack}
          onAddClipToTimeline={(clip) => {
            const newClip: TimelineClip = {
              id: `clip_${Date.now()}`,
              title: clip.title || 'New Scene',
              trackId: clip.trackId || 'V1',
              startTime: currentTime,
              duration: clip.duration || 3.0,
              color: clip.color || '#3b82f6',
              score: { visual: 95, motion: 95, sharpness: 95, overall: 95 },
            };
            setClips((prev) => [...prev, newClip]);
            setSelectedClipId(newClip.id);
            showToast(`Added "${newClip.title}" to timeline`);
          }}
          onApplyEffect={(eff) => {
            if (selectedClipId) {
              handleUpdateClip(selectedClipId, { effect: eff });
              showToast(`Applied ${eff} to active clip`);
            }
          }}
          onApplyTransition={(tr) => {
            if (selectedClipId) {
              handleUpdateClip(selectedClipId, { transition: tr });
              showToast(`Applied ${tr} transition`);
            }
          }}
          onApplyColorPreset={(preset) => {
            setColorGrade((g) => ({ ...g, preset }));
            showToast(`Switched color grade to ${preset}`);
          }}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onOpenModelOrchestrator={() => setIsModelOrchestratorOpen(true)}
          activeCaptionStyle={activeCaptionStyle}
          onSelectCaptionStyle={setActiveCaptionStyle}
          onSelectRepurpose={handleSelectRepurpose}
          onToggleStemMute={handleToggleStemMute}
        />

        {/* Center: Video Preview Monitor */}
        <VideoPreviewPlayer
          clips={clips}
          audioTrack={audioTrack}
          colorGrade={colorGrade}
          currentTime={currentTime}
          onSeek={setCurrentTime}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          aspectRatio={projectSettings.aspectRatio}
          onChangeAspectRatio={(aspectRatio) => setProjectSettings((p) => ({ ...p, aspectRatio }))}
          captions={captions}
          activeCaptionStyle={activeCaptionStyle}
        />

        {/* Right: Inspector / Properties Panel */}
        <InspectorPanel
          selectedClip={selectedClip}
          userMode={userMode}
          colorGrade={colorGrade}
          onChangeColorGrade={setColorGrade}
          onUpdateClip={handleUpdateClip}
        />

      </div>

      {/* Bottom: Multi-Track Timeline */}
      <MultiTrackTimeline
        clips={clips}
        audioTrack={audioTrack}
        currentTime={currentTime}
        onSeek={setCurrentTime}
        selectedClipId={selectedClipId}
        onSelectClip={(c) => setSelectedClipId(c.id)}
        onSplitClip={handleSplitClip}
        onDeleteClip={handleDeleteClip}
        onAddClip={handleAddClip}
      />

      {/* Modals */}
      <MediaImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportMedia={handleImportMedia}
        currentClipsCount={clips.length}
      />

      <MakeItFireModal
        isOpen={isMakeItFireOpen}
        onClose={() => setIsMakeItFireOpen(false)}
        onCompleteEdit={(style) => {
          handleExecuteAICommand(`Make It Fire ${style}`);
        }}
        currentStyle="CINEMATIC"
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        aspectRatio={projectSettings.aspectRatio}
      />

      {/* AI Model Orchestrator Modal */}
      <AIModelOrchestratorModal
        isOpen={isModelOrchestratorOpen}
        onClose={() => setIsModelOrchestratorOpen(false)}
        activeProfile={projectSettings.activeModelProfile}
        onChangeProfile={(profile) => setProjectSettings((p) => ({ ...p, activeModelProfile: profile }))}
        onTestModel={handleTestModel}
      />

    </div>
  );
}
