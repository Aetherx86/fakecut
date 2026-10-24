export type ToolMode = 'select' | 'trim' | 'position' | 'range' | 'blade' | 'zoom' | 'hand';

export interface Clip {
  id: string;
  title: string;
  originalTitle: string;
  youtubeId: string;
  thumbnail: string;
  duration: number; // in seconds
  category: 'A-Roll' | 'B-Roll' | 'Music' | 'References' | 'Search';
  resolution: string;
  fps: number;
  codec: string;
  date: string;
  channelTitle?: string;
}

export interface TimelineClip {
  id: string;
  clipId: string;
  track: 'overlay' | 'primary' | 'audio';
  start: number; // in seconds relative to timeline
  duration: number; // in seconds
  title: string;
  color: string;
}

export interface InspectorSettings {
  exposure: number; // brightness % (50 - 150)
  contrast: number; // contrast % (50 - 150)
  saturation: number; // saturation % (0 - 200)
  hue: number; // deg (-180 to 180)
  blur: number; // px (0 - 10)
  volume: number; // 0 - 100
  muted: boolean;
  scale: number; // % (50 - 150)
  rotation: number; // deg (-180 to 180)
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}
