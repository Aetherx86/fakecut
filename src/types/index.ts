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
  isFavorite?: boolean;
  type?: 'video' | 'audio' | 'still' | 'project';
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
  // Color & Opacity
  exposure: number;     // brightness %
  contrast: number;     // contrast %
  saturation: number;   // saturation %
  hue: number;          // deg
  blur: number;         // px
  opacity: number;      // 0 - 100%
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';
  
  // Transform
  posX: number;         // px offset
  posY: number;         // px offset
  scale: number;        // %
  scaleX: number;       // %
  scaleY: number;       // %
  rotation: number;     // deg (-360 to 360)
  anchorX: number;
  anchorY: number;

  // Shape Mask
  hasShapeMask: boolean;
  maskRadius: number;   // px
  maskCurvature: number;// 0 - 100%
  maskFillOpacity: number; // 0 - 100%
  maskFeather: number;  // px
  maskInvert: boolean;

  // Crop & Effects
  hasCrop: boolean;
  cropLeft: number;
  cropRight: number;
  cropTop: number;
  cropBottom: number;
  hasDistort: boolean;
  hasStabilization: boolean;
  hasRollingShutter: boolean;

  // Audio
  volume: number;       // 0 - 100
  muted: boolean;
  pan: number;          // -100 to 100
  voiceIsolation: number; // 0 - 100%
  noiseRemoval: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}
