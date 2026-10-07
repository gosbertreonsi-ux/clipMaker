export type UserMode = 'QUICK' | 'EDIT' | 'PRO';

export type SidebarTab =
  | 'media'
  | 'audio'
  | 'text'
  | 'captions'
  | 'effects'
  | 'transitions'
  | 'filters'
  | 'color'
  | 'ai'
  | 'templates';

export interface TimelineClip {
  id: string;
  title: string;
  fileName?: string;
  videoUrl?: string;
  trackId: 'V2' | 'V1' | 'T1' | 'A1' | 'A2';
  startTime: number; // in seconds
  duration: number; // in seconds
  sourceOffset?: number;
  color: string;
  // Video properties
  scale?: number;
  opacity?: number;
  speedRamp?: number;
  rotation?: number;
  transition?: string;
  effect?: string;
  filter?: string;
  blendMode?: string;
  // Audio properties
  volume?: number;
  // AI score metadata
  score: {
    visual: number;
    motion: number;
    sharpness: number;
    overall: number;
  };
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
  audioUrl?: string;
  fileName?: string;
  beatMarkers: BeatMarker[];
}

export interface ColorGradeSettings {
  exposure: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  preset: string;
}

export interface ProjectSettings {
  name: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  resolution: '1080p' | '4K' | '720p';
  fps: 30 | 60 | 24;
}
