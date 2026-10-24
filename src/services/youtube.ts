import { Clip } from '../types';

// Extract YouTube ID from various URL formats
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // youtube.com/watch?v=...
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // youtu.be/...
  const beMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (beMatch) return beMatch[1];

  // youtube.com/shorts/...
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  // youtube.com/embed/...
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  return null;
}

// Convert seconds into Final Cut Pro Timecode string: HH:MM:SS:FF
export function formatTimecode(totalSeconds: number, fps: number = 24): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) totalSeconds = 0;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const frames = Math.floor((totalSeconds % 1) * fps);

  const pad = (n: number, z: number = 2) => String(n).padStart(z, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

// Convert seconds to simple MM:SS
export function formatDuration(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) totalSeconds = 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

// Fetch YouTube video metadata via public oEmbed API without API key
export async function fetchYouTubeMeta(youtubeId: string): Promise<{ title: string; author: string; thumbnail: string }> {
  try {
    const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${youtubeId}`);
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title || `Clip_${youtubeId}`,
        author: data.author_name || 'YouTube',
        thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      };
    }
  } catch (e) {
    console.warn('oEmbed fetch failed, using fallback:', e);
  }

  return {
    title: `Footage_${youtubeId}`,
    author: 'External Source',
    thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  };
}

// Curated high quality default clips disguised as real camera reels
export const INITIAL_CLIPS: Clip[] = [
  {
    id: 'clip-1',
    title: 'A001_C024_0424_PRORES_4K.MOV',
    originalTitle: 'lofi hip hop radio 📚 - beats to relax/study to',
    youtubeId: 'jfKfPfyJRdk', // Lofi Girl
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    duration: 3600,
    category: 'A-Roll',
    resolution: '3840x2160',
    fps: 23.98,
    codec: 'Apple ProRes 422 HQ',
    date: '2026-10-24 14:20',
    channelTitle: 'Lofi Girl',
  },
  {
    id: 'clip-2',
    title: 'B002_NIGHT_DRONE_TOKYO_LOG.MOV',
    originalTitle: 'Tokyo in 8K 60fps HDR',
    youtubeId: '1la40WKI97A', // 8K Tokyo Walk
    thumbnail: 'https://i.ytimg.com/vi/1la40WKI97A/hqdefault.jpg',
    duration: 720,
    category: 'B-Roll',
    resolution: '3840x2160',
    fps: 60,
    codec: 'Apple ProRes 4444 XQ',
    date: '2026-10-24 16:45',
    channelTitle: 'Tokyo Walk HDR',
  },
  {
    id: 'clip-3',
    title: 'REF_003_APPLE_KEYNOTE_EVENT.MP4',
    originalTitle: 'Apple Event — September 2024 Highlight Reel',
    youtubeId: 'uarNiSl_uh4', // Apple Event
    thumbnail: 'https://i.ytimg.com/vi/uarNiSl_uh4/hqdefault.jpg',
    duration: 480,
    category: 'References',
    resolution: '3840x2160',
    fps: 29.97,
    codec: 'H.264 Main',
    date: '2026-10-23 09:12',
    channelTitle: 'Apple',
  },
  {
    id: 'clip-4',
    title: 'AUDIO_004_SYNTHWAVE_AMBIENCE.WAV',
    originalTitle: 'Chillstep / Ambient Electronic Mix 2024',
    youtubeId: '5qap5aO4i9A', // Lofi Chill Mix
    thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg',
    duration: 1800,
    category: 'Music',
    resolution: '1920x1080',
    fps: 24,
    codec: 'Linear PCM 24-bit',
    date: '2026-10-22 18:30',
    channelTitle: 'ChilledCow Records',
  },
  {
    id: 'clip-5',
    title: 'C005_SEOUL_NIGHT_RAIN_4K.MOV',
    originalTitle: 'Seoul Night Rain Walk 4K Binaural Sound',
    youtubeId: 'F8MN0o6rs9o', // Seoul Walk
    thumbnail: 'https://i.ytimg.com/vi/F8MN0o6rs9o/hqdefault.jpg',
    duration: 1200,
    category: 'B-Roll',
    resolution: '3840x2160',
    fps: 30,
    codec: 'Apple ProRes 422',
    date: '2026-10-24 21:05',
    channelTitle: 'Seoul Walker',
  },
  {
    id: 'clip-6',
    title: 'INTERVIEW_A_CAM_DIRECTOR.MOV',
    originalTitle: 'The Making of Interstellar - Behind The Scenes',
    youtubeId: 'l3w2MTXB448', // Cinematic BTS
    thumbnail: 'https://i.ytimg.com/vi/l3w2MTXB448/hqdefault.jpg',
    duration: 650,
    category: 'A-Roll',
    resolution: '3840x2160',
    fps: 23.98,
    codec: 'Apple ProRes 422 HQ',
    date: '2026-10-21 11:40',
    channelTitle: 'Warner Bros. Pictures',
  }
];
