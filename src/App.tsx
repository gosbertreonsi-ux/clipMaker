/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MainTab, WeaponLoadout, RunicGem, GripPommel, EditingStyle, TimelineClip } from './types';
import {
  DEFAULT_LOADOUT,
  BLADES_LOADOUT,
  INITIAL_STATS,
  INITIAL_CLIPS,
  DEMO_AUDIO,
} from './data/mockData';
import { sounds } from './utils/audioSynth';
import { TopNav } from './components/TopNav';
import { WeaponSlotTree } from './components/WeaponSlotTree';
import { NorseSlateCard } from './components/NorseSlateCard';
import { RightStatsPanel } from './components/RightStatsPanel';
import { CenterStage } from './components/CenterStage';
import { TimelineEditor } from './components/TimelineEditor';
import { BottomControllerBar } from './components/BottomControllerBar';
import { MakeItFireModal } from './components/MakeItFireModal';
import { ExportModal } from './components/ExportModal';
import { TabPanels } from './components/TabPanels';

export default function App() {
  // Navigation & View states
  const [activeTab, setActiveTab] = useState<MainTab>('WEAPONS');
  const [activeViewMode, setActiveViewMode] = useState<'loadout' | 'video' | 'split'>('loadout');
  const [showTimelineDrawer, setShowTimelineDrawer] = useState<boolean>(true);

  // Loadout & Character Stats
  const [loadout, setLoadout] = useState<WeaponLoadout>(DEFAULT_LOADOUT);
  const [selectedSlot, setSelectedSlot] = useState<'weapon' | 'lightRunic' | 'heavyRunic' | 'grip'>('weapon');
  const [stats, setStats] = useState(INITIAL_STATS);
  const [hacksilver, setHacksilver] = useState(24500);
  const [xp, setXp] = useState(18200);

  // Timeline & Video Engine states
  const [clips, setClips] = useState<TimelineClip[]>(INITIAL_CLIPS);
  const [audioTrack] = useState(DEMO_AUDIO);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(INITIAL_CLIPS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentStyle, setCurrentStyle] = useState<EditingStyle>('CINEMATIC');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');

  // Modals
  const [isMakeItFireOpen, setIsMakeItFireOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Playback timer & Web Audio beat pulse integration
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

  // Switch between Leviathan Axe and Blades of Chaos
  const handleSwitchWeapon = () => {
    if (loadout.category === 'axe') {
      setLoadout(BLADES_LOADOUT);
      setCurrentStyle('HYPE');
      setStats((s) => ({ ...s, strength: 12, runic: 6 }));
    } else {
      setLoadout(DEFAULT_LOADOUT);
      setCurrentStyle('CINEMATIC');
      setStats((s) => ({ ...s, strength: 6, runic: 0 }));
    }
  };

  // Upgrade Weapon (Leviathan Axe Level up)
  const handleUpgradeWeapon = () => {
    if (hacksilver >= 500) {
      setHacksilver((prev) => prev - 500);
      setXp((prev) => prev + 350);
      setLoadout((prev) => ({
        ...prev,
        level: Math.min(5, prev.level + 1),
        strength: prev.strength + 2,
      }));
      setStats((prev) => ({
        ...prev,
        level: Math.min(5, prev.level + 1),
        strength: prev.strength + 2,
        defense: prev.defense + 1,
      }));
    }
  };

  // Equip Light Runic Gem
  const handleEquipLightRunic = (gem: RunicGem | null) => {
    setLoadout((prev) => ({ ...prev, lightRunic: gem }));
    if (gem) {
      setStats((prev) => ({
        ...prev,
        runic: prev.runic + gem.runic,
        strength: prev.strength + gem.damage,
      }));
    } else {
      setStats((prev) => ({
        ...prev,
        runic: Math.max(0, prev.runic - 3),
      }));
    }
  };

  // Equip Heavy Runic Gem
  const handleEquipHeavyRunic = (gem: RunicGem | null) => {
    setLoadout((prev) => ({ ...prev, heavyRunic: gem }));
    if (gem) {
      setStats((prev) => ({
        ...prev,
        runic: prev.runic + gem.runic,
        strength: prev.strength + gem.damage,
      }));
    } else {
      setStats((prev) => ({
        ...prev,
        runic: Math.max(0, prev.runic - 3),
      }));
    }
  };

  // Equip Pommel / Grip
  const handleEquipGrip = (grip: GripPommel) => {
    setLoadout((prev) => ({ ...prev, grip }));
    setStats((prev) => ({
      ...prev,
      defense: prev.defense + 2,
      luck: prev.luck + 2,
    }));
  };

  // MAKE IT FIRE completion handler
  const handleCompleteMakeItFire = (style: EditingStyle) => {
    setCurrentStyle(style);
    setStats((prev) => ({
      ...prev,
      level: Math.min(5, prev.level + 1),
      strength: prev.strength + 3,
      runic: prev.runic + 4,
      defense: prev.defense + 2,
      vitality: prev.vitality + 5,
      luck: prev.luck + 4,
      cooldown: prev.cooldown + 3,
    }));
    setXp((prev) => prev + 1500);

    // Transform clips with beat-synchronized pacing
    setClips((prev) =>
      prev.map((c, i) => ({
        ...c,
        score: {
          visual: Math.min(99, c.score.visual + 4),
          motion: Math.min(99, c.score.motion + 5),
          sharpness: Math.min(99, c.score.sharpness + 3),
          overall: Math.min(99, c.score.overall + 4),
        },
        speedRamp: i % 2 === 0 ? 1.4 : 0.8,
        transition: style === 'HYPE' ? 'Impact Flash' : 'Slow Cinematic Push',
      }))
    );
  };

  // Keyboard Navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'q' || e.key === 'Q') {
        sounds.playBumper();
        const tabs: MainTab[] = ['WEAPONS', 'ARMOR', 'SKILLS', 'MAP', 'GOALS', 'CODEX', 'RESOURCES'];
        const idx = tabs.indexOf(activeTab);
        setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length]);
      } else if (e.key === 'e' || e.key === 'E') {
        sounds.playBumper();
        const tabs: MainTab[] = ['WEAPONS', 'ARMOR', 'SKILLS', 'MAP', 'GOALS', 'CODEX', 'RESOURCES'];
        const idx = tabs.indexOf(activeTab);
        setActiveTab(tabs[(idx + 1) % tabs.length]);
      } else if (e.key === 'f' || e.key === 'F') {
        setIsMakeItFireOpen(true);
      } else if (e.key === 'x' || e.key === 'X') {
        setIsExportOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isPlaying]);

  return (
    <div className="relative w-screen h-screen bg-[#05070a] text-slate-100 flex flex-col justify-between overflow-hidden">
      
      {/* Top God of War Navigation Bar */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hacksilver={hacksilver}
        xp={xp}
        activeViewMode={activeViewMode}
        onChangeViewMode={setActiveViewMode}
      />

      {/* Main Viewport Content */}
      <main className="relative flex-1 w-full flex items-center justify-between px-6 py-2 overflow-hidden">
        
        {/* Render Tab Panels for ARMOR, SKILLS, MAP, GOALS, CODEX, RESOURCES */}
        <TabPanels
          activeTab={activeTab}
          currentStyle={currentStyle}
          onSelectStyle={setCurrentStyle}
          onOpenMakeItFire={() => setIsMakeItFireOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
        />

        {/* WEAPONS LOADOUT SCREEN (Matches uploaded image exactly) */}
        {activeTab === 'WEAPONS' && (
          <div className="relative w-full h-full flex items-center justify-between gap-4">
            
            {/* Left Column: Equipment Slot Tree & Slate Card */}
            <div className="relative z-20 flex items-center gap-4">
              {/* Vertical Weapon and Runic Socket Tree */}
              <WeaponSlotTree
                loadout={loadout}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
                onSwitchWeapon={handleSwitchWeapon}
              />

              {/* Center-Left Stone Slate Card */}
              <NorseSlateCard
                loadout={loadout}
                selectedSlot={selectedSlot}
                onEquipLightRunic={handleEquipLightRunic}
                onEquipHeavyRunic={handleEquipHeavyRunic}
                onEquipGrip={handleEquipGrip}
                onUpgradeWeapon={handleUpgradeWeapon}
              />
            </div>

            {/* Center Stage: Character Backdrop (Kratos & Atreus) + Live Video Preview */}
            <CenterStage
              viewMode={activeViewMode}
              clips={clips}
              audioTrack={audioTrack}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              currentTime={currentTime}
              onSeek={setCurrentTime}
              currentStyle={currentStyle}
              aspectRatio={aspectRatio}
              onChangeAspectRatio={setAspectRatio}
              onTriggerMakeItFire={() => setIsMakeItFireOpen(true)}
            />

            {/* Right Column: Character / Engine Stats Panel */}
            <div className="relative z-20">
              <RightStatsPanel stats={stats} />
            </div>

          </div>
        )}
      </main>

      {/* Collapsible Timeline Drawer at bottom of viewport */}
      {showTimelineDrawer && (
        <div className="relative z-20 w-full">
          <div className="flex justify-end px-6 -mb-2">
            <button
              onClick={() => setShowTimelineDrawer(!showTimelineDrawer)}
              className="text-[10px] font-cinzel text-slate-400 hover:text-amber-300 bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded cursor-pointer"
            >
              COLLAPSE TIMELINE ▼
            </button>
          </div>
          <TimelineEditor
            clips={clips}
            audioTrack={audioTrack}
            currentTime={currentTime}
            onSeek={setCurrentTime}
            onSelectClip={(c) => setSelectedClipId(c.id)}
            selectedClipId={selectedClipId}
            onAddClip={() => {
              const newId = `c_${Date.now()}`;
              setClips((prev) => [
                ...prev,
                {
                  id: newId,
                  title: `CLIP 0${prev.length + 1} // Action Shot`,
                  startTime: prev.length * 3.75,
                  duration: 3.75,
                  trackIndex: 0,
                  color: '#0284c7',
                  score: { visual: 95, motion: 92, sharpness: 94, overall: 94 },
                  transition: 'Impact Flash',
                  effect: 'Cold Frost Tint',
                  speedRamp: 1.0,
                },
              ]);
            }}
            onSplitClip={() => {
              if (selectedClipId) {
                const clip = clips.find((c) => c.id === selectedClipId);
                if (clip && clip.duration > 1) {
                  const half = clip.duration / 2;
                  setClips((prev) =>
                    prev.flatMap((c) =>
                      c.id === selectedClipId
                        ? [
                            { ...c, duration: half },
                            {
                              ...c,
                              id: `c_${Date.now()}`,
                              title: `${c.title} (Part 2)`,
                              startTime: c.startTime + half,
                              duration: half,
                            },
                          ]
                        : [c]
                    )
                  );
                }
              }
            }}
            onDeleteClip={() => {
              if (selectedClipId && clips.length > 1) {
                setClips((prev) => prev.filter((c) => c.id !== selectedClipId));
                setSelectedClipId(clips[0].id);
              }
            }}
            onTogglePlay={handleTogglePlay}
            isPlaying={isPlaying}
          />
        </div>
      )}

      {/* If Timeline is hidden, show restore button */}
      {!showTimelineDrawer && (
        <div className="absolute bottom-12 right-6 z-30">
          <button
            onClick={() => setShowTimelineDrawer(true)}
            className="px-3 py-1 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/60 rounded text-xs font-cinzel text-amber-300 shadow-lg cursor-pointer"
          >
            ▲ EXPAND TIMELINE
          </button>
        </div>
      )}

      {/* Bottom Controller Bar matching God of War */}
      <BottomControllerBar
        onTriggerMakeItFire={() => setIsMakeItFireOpen(true)}
        onTogglePlay={handleTogglePlay}
        onOpenExport={() => setIsExportOpen(true)}
        isPlaying={isPlaying}
      />

      {/* MAKE IT FIRE Modal */}
      <MakeItFireModal
        isOpen={isMakeItFireOpen}
        onClose={() => setIsMakeItFireOpen(false)}
        onCompleteEdit={handleCompleteMakeItFire}
        currentStyle={currentStyle}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        aspectRatio={aspectRatio}
      />

    </div>
  );
}
