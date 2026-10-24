import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  ChevronDown
} from 'lucide-react';
import { Clip, InspectorSettings } from '../types';
import { formatTimecode } from '../services/youtube';

export interface ViewerHandle {
  seekTo: (seconds: number) => void;
  play: () => void;
  pause: () => void;
}

interface ViewerProps {
  clip: Clip | null;
  settings: InspectorSettings;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onPlayPauseToggle: () => void;
  onSeek: (seconds: number) => void;
  onOpenImport: () => void;
}

export const Viewer = forwardRef<ViewerHandle, ViewerProps>(({
  clip,
  settings,
  currentTime,
  duration,
  isPlaying,
  onTimeUpdate,
  onDurationChange,
  onPlayPauseToggle,
  onSeek,
  onOpenImport,
}, ref) => {
  const playerRef = useRef<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [zoomPercent, setZoomPercent] = useState('96%');

  // Aggressively force-disable closed captions and subtitles
  const forceDisableCaptions = (player: any) => {
    if (!player) return;
    try {
      if (typeof player.unloadModule === 'function') {
        player.unloadModule('captions');
        player.unloadModule('cc');
      }
      if (typeof player.setOption === 'function') {
        player.setOption('captions', 'track', {});
        player.setOption('captions', 'reload', false);
        player.setOption('captions', 'fontSize', -1);
        player.setOption('cc', 'track', {});
      }
    } catch (e) {}
  };

  // Expose imperative handle for instant seeking and playback control
  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number) => {
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        try {
          playerRef.current.seekTo(seconds, true);
        } catch (e) {
          console.warn('seekTo error', e);
        }
      }
    },
    play: () => {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
      }
    },
    pause: () => {
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
      }
    }
  }), []);

  // Load YouTube Player with strictly hidden controls and disabled captions
  useEffect(() => {
    let checkInterval: any = null;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (!clip?.youtubeId) return;

      if (playerRef.current) {
        try {
          playerRef.current.destroy?.();
        } catch (e) {}
      }

      playerRef.current = new window.YT.Player('yt-player-target', {
        height: '100%',
        width: '100%',
        videoId: clip.youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,          // Complete hide YouTube controls
          modestbranding: 1,    // Hide YouTube logo
          rel: 0,               // No related videos
          fs: 0,                // No fullscreen button
          iv_load_policy: 3,    // Turn off video annotations
          cc_load_policy: 0,    // Turn off captions/subtitles by default
          cc_lang_pref: 'none', // No captions language
          disablekb: 1,         // Disable YouTube keyboard shortcuts
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            setIsPlayerReady(true);
            const dur = event.target.getDuration();
            if (dur && dur > 0) onDurationChange(dur);
            event.target.setVolume(settings.volume);
            if (settings.muted) event.target.mute();
            else event.target.unMute();

            forceDisableCaptions(event.target);
            if (isPlaying) event.target.playVideo();
          },
          onStateChange: (event: any) => {
            forceDisableCaptions(event.target);
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    checkInterval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const t = playerRef.current.getCurrentTime();
          const d = playerRef.current.getDuration();
          if (typeof t === 'number' && !isNaN(t)) {
            onTimeUpdate(t);
          }
          if (typeof d === 'number' && !isNaN(d) && d > 0 && Math.abs(d - duration) > 1) {
            onDurationChange(d);
          }
          // Continually suppress any auto-injected captions
          forceDisableCaptions(playerRef.current);
        } catch (e) {}
      }
    }, 200);

    return () => {
      clearInterval(checkInterval);
    };
  }, [clip?.youtubeId]);

  // Sync play/pause
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;
    try {
      const playerState = playerRef.current.getPlayerState?.();
      if (isPlaying && playerState !== 1) {
        playerRef.current.playVideo?.();
      } else if (!isPlaying && playerState === 1) {
        playerRef.current.pauseVideo?.();
      }
    } catch (e) {}
  }, [isPlaying, isPlayerReady]);

  // Sync volume
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;
    try {
      if (settings.muted) playerRef.current.mute?.();
      else {
        playerRef.current.unMute?.();
        playerRef.current.setVolume?.(settings.volume);
      }
    } catch (e) {}
  }, [settings.volume, settings.muted, isPlayerReady]);

  // Inspector CSS filter & transform simulation
  const videoFilterStyle = {
    opacity: settings.contrast ? `${settings.contrast}%` : '100%',
    transform: `scale(${settings.scale / 100})`,
    filter: `brightness(${settings.exposure}%) saturate(${settings.saturation}%)`,
  };

  return (
    <div className="h-full flex flex-col bg-[#141414] select-none text-xs">
      {/* Top Header Bar matching Image 1: 1080p HD 30p, Stereo | ■ 4-1-26 | 96% ▾ View ▾ */}
      <div className="h-7 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center justify-between px-3 text-[#9e9e9e] text-[11px]">
        {/* Left: Resolution & Audio Format */}
        <div className="font-mono text-[#888]">
          {clip?.resolution ? `${clip.resolution} ${clip.fps}p, Stereo` : '1080p HD 30p, Stereo'}
        </div>

        {/* Center: Project / Clip Name */}
        <div className="flex items-center space-x-1.5 text-[#dedede] font-medium">
          <div className="w-2.5 h-2.5 bg-[#4ea1f3] rounded-sm" />
          <span>{clip?.title ? clip.title.split('_')[0] || '4-1-26' : '4-1-26'}</span>
        </div>

        {/* Right: Zoom & View dropdown */}
        <div className="flex items-center space-x-3 text-[#aaa]">
          <div className="flex items-center space-x-0.5 cursor-pointer hover:text-white">
            <span>{zoomPercent}</span>
            <ChevronDown className="w-3 h-3 text-[#666]" />
          </div>
          <span>-</span>
          <div className="flex items-center space-x-0.5 cursor-pointer hover:text-white">
            <span>View</span>
            <ChevronDown className="w-3 h-3 text-[#666]" />
          </div>
        </div>
      </div>

      {/* Main Video Screen Area */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden p-2">
        {/* If no video is selected/loaded, show exact Empty State from Image 1 */}
        {!clip ? (
          <div 
            onClick={onOpenImport}
            className="flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            {/* Play Button Icon matching Image 1 */}
            <div className="w-14 h-11 rounded-lg bg-[#222]/80 border border-[#444] flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-[#282828] transition-all shadow-lg">
              <Play className="w-5 h-5 text-white/70 fill-white/70 ml-0.5" />
            </div>

            {/* Instruction Text exactly matching Image 1 */}
            <p className="text-[11px] text-[#777] leading-relaxed group-hover:text-[#999] transition-colors">
              상단 툴바의 가져오기(↓) 버튼을 누르거나<br />
              좌측 검색창에 YouTube 링크를 붙여넣어 클립을 불러오세요
            </p>
          </div>
        ) : (
          /* Pure, Stealth Video Canvas: YouTube UI & Captions completely cropped and neutralized */
          <div 
            className="relative aspect-video max-w-full max-h-full w-full bg-black shadow-2xl flex items-center justify-center overflow-hidden rounded"
            style={videoFilterStyle}
          >
            {/*
              Ultra Stealth Masking:
              Scale width to 114% and height to 134%, with top shifted by -5% and bottom overflow by 29%.
              This physically pushes YouTube's bottom overlay (Share pill, Watch Later, "동영상 더보기" shelf,
              YouTube logo, and closed captions) COMPLETELY out of the visible screen!
            */}
            <div className="w-[114%] h-[134%] -mt-[5%] -mb-[29%] pointer-events-none select-none flex items-center justify-center overflow-hidden relative">
              <div id="yt-player-target" className="w-full h-full pointer-events-none"></div>
            </div>

            {/* Transparent click shield: Captures user clicks for Play/Pause so YouTube UI NEVER triggers */}
            <div 
              onClick={onPlayPauseToggle}
              className="absolute inset-0 z-30 cursor-pointer"
              title="재생 / 일시정지 (Space)"
            ></div>
          </div>
        )}
      </div>

      {/* Bottom Transport Bar matching Image 1: ◻ + ▶ 00:00:00:00 ⊣ */}
      <div className="h-8 bg-[#1a1a1a] border-t border-[#2d2d2d] flex items-center justify-between px-3 text-[#aaa]">
        {/* Left: Range and Marker icons */}
        <div className="flex items-center space-x-2 text-[#777]">
          <button className="p-1 hover:text-white rounded" title="Set Selection Range">
            <Square className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-white rounded" title="Add Marker">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Play Button + Timecode matching Image 1 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onPlayPauseToggle}
            className="text-[#dedede] hover:text-white transition-colors"
            title="Play / Pause (Space)"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>
          <span className="font-mono text-xs font-semibold tracking-wider text-[#dedede]">
            {formatTimecode(currentTime, clip?.fps || 30)}
          </span>
        </div>

        {/* Right: Expand / Viewer toggle */}
        <div className="flex items-center text-[#777]">
          <button className="p-1 hover:text-white rounded" title="Toggle Full Viewer">
            <span className="font-mono text-sm leading-none">⊣</span>
          </button>
        </div>
      </div>
    </div>
  );
});

Viewer.displayName = 'Viewer';
