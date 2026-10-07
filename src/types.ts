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
  | 'models'
  | 'repurpose'
  | 'templates';

export interface AIModel {
  id: string;
  name: string;
  version: string;
  category: 'video' | 'audio' | 'vision' | 'generation' | 'orchestration';
  specialty: string;
  benchmarkScore: number; // e.g. 98.4%
  latencyMs: number;
  status: 'active' | 'standby' | 'processing';
  description: string;
}

export type CaptionPreset = 'HORMOZI_BOLD' | 'POP_KARAOKE' | 'NEON_PULSE' | 'CINEMATIC_SUB';

export interface CaptionItem {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  words: { word: string; start: number; end: number }[];
  style: CaptionPreset;
}

export interface AudioStem {
  id: 'vocals' | 'drums' | 'bass' | 'instruments';
  label: string;
  volume: number;
  muted: boolean;
  color: string;
}

export interface RepurposeCard {
  id: string;
  title: string;
  aspectRatio: '9:16' | '1:1' | '16:9';
  platform: 'TikTok' | 'YouTube Shorts' | 'Instagram Reels' | 'X Teaser';
  duration: number;
  hookRetentionScore: number;
  hookSnippet: string;
  thumbnailColor: string;
}

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
  // AI enhancements
  aiBgRemoved?: boolean;
  aiMotionTracked?: boolean;
  aiSuperResolution?: boolean;
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
  stems?: AudioStem[];
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
  activeModelProfile: 'AUTO' | 'FAST' | 'QUALITY' | 'CREATIVE' | 'CONTROL';
}

