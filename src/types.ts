export type MainTab = 
  | 'WEAPONS' 
  | 'ARMOR' 
  | 'SKILLS' 
  | 'MAP' 
  | 'GOALS' 
  | 'CODEX' 
  | 'RESOURCES';

export interface WeaponLoadout {
  id: string;
  name: string;
  category: 'axe' | 'blades' | 'shield' | 'bow';
  level: number;
  strength: number;
  description: string;
  lore: string;
  lightRunic: RunicGem | null;
  heavyRunic: RunicGem | null;
  grip: GripPommel | null;
  videoTrackName: string;
  currentStyle: string;
}

export interface RunicGem {
  id: string;
  name: string;
  level: number;
  type: string;
  cooldown: number;
  damage: number;
  runic: number;
  description: string;
  effectName: string;
}

export interface GripPommel {
  id: string;
  name: string;
  level: number;
  statBonus: string;
  perk: string;
}

export interface TimelineClip {
  id: string;
  title: string;
  startTime: number;
  duration: number;
  trackIndex: number;
  color: string;
  score: {
    visual: number;
    motion: number;
    sharpness: number;
    overall: number;
  };
  transition?: string;
  effect?: string;
  speedRamp?: number;
}

export interface BeatMarker {
  time: number;
  type: 'downbeat' | 'beat' | 'drop' | 'buildup';
  energy: number;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  duration: number;
  beatMarkers: BeatMarker[];
}

export interface CharacterStats {
  level: number;
  hp: number;
  maxHp: number;
  strength: number;
  runic: number;
  defense: number;
  vitality: number;
  luck: number;
  cooldown: number;
}

export type EditingStyle = 
  | 'CINEMATIC' 
  | 'HYPE' 
  | 'MUSIC VIDEO' 
  | 'SPORTS' 
  | 'DARK' 
  | 'DREAMY' 
  | 'SOCIAL TREND';
