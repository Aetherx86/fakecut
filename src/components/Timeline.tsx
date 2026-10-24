import React, { useRef, useState, useEffect } from 'react';
import { 
  Menu, 
  Check, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  Music, 
  Volume2, 
  Type, 
  Film,
  ArrowRight
} from 'lucide-react';
import { Clip } from '../types';
import { formatTimecode } from '../services/youtube';

interface TimelineProps {
  clip: Clip | null;
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  isPlaying: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({
  clip,
  currentTime,
  duration,
  onSeek,
  isPlaying,
}) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const effectiveDuration = duration > 0 ? duration : 925; // 15:25:09
  const progressPercent = Math.min(100, Math.max(0, (currentTime / effectiveDuration) * 100));

  // Calculate target seek time from cursor X position relative to ruler
  const calculateSeekTime = (clientX: number) => {
    if (!rulerRef.current) return 0;
    const rect = rulerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    return ratio * effectiveDuration;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsScrubbing(true);
    const targetTime = calculateSeekTime(e.clientX);
    onSeek(targetTime);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isScrubbing) {
        e.preventDefault();
        const targetTime = calculateSeekTime(e.clientX);
        onSeek(targetTime);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isScrubbing) {
        setIsScrubbing(false);
        const targetTime = calculateSeekTime(e.clientX);
        onSeek(targetTime);
      }
    };

    if (isScrubbing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing, effectiveDuration]);

  // Skimmer line
  const handleMouseMoveOverTimeline = (e: React.MouseEvent) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x >= 0 && x <= rect.width) {
      setHoverX(x);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#161616] select-none text-xs border-t border-[#2d2d2d]">
      {/* 1. Timeline Header Bar matching Image 1: < ■ 4-1. API Key, 환경...인트 기본기 [Clip ▾] 15:25:09 > */}
      <div className="h-7 bg-[#1c1c1c] border-b border-[#2a2a2a] flex items-center justify-between px-2 text-[#888] text-[11px]">
        {/* Left: ≡ ✓ + */}
        <div className="flex items-center space-x-2 text-[#777]">
          <button className="p-0.5 hover:text-white" title="Index">
            <Menu className="w-3.5 h-3.5" />
          </button>
          <button className="p-0.5 hover:text-white" title="Auditions">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button className="p-0.5 hover:text-white" title="Add">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Breadcrumb and project title */}
        <div className="flex items-center space-x-2 text-[#ccc]">
          <ChevronLeft className="w-3 h-3 text-[#666] cursor-pointer hover:text-white" />
          <div className="w-2.5 h-2.5 bg-[#4ea1f3] rounded-sm shrink-0" />
          <span className="font-medium text-[#dedede] truncate max-w-[280px]">
            {clip?.title ? clip.title : '4-1. API Key, 환경...인트 기본기'}
          </span>
          <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-[#252525] rounded border border-[#383838] text-[10px] text-[#aaa] cursor-pointer">
            <span>Clip</span>
            <ChevronDown className="w-2.5 h-2.5 text-[#777]" />
          </div>
          <span className="font-mono text-[10px] text-[#888]">15:25:09</span>
          <ChevronRight className="w-3 h-3 text-[#666] cursor-pointer hover:text-white" />
        </div>

        {/* Right: Skimmer & Timer icons */}
        <div className="flex items-center space-x-2 text-[#777]">
          <button className="p-0.5 hover:text-white font-mono text-[11px]" title="Timeline Skimmer">
            ⎋
          </button>
          <button className="p-0.5 hover:text-white" title="Timeline Timecode">
            <Clock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Timeline Area (Track headers on left + draggable canvas on right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Track Icons Column matching Image 1 */}
        <div className="w-8 bg-[#181818] border-r border-[#2a2a2a] flex flex-col items-center justify-around py-3 text-[#666]">
          <Film className="w-3.5 h-3.5" />
          <Type className="w-3.5 h-3.5" />
          <Music className="w-3.5 h-3.5" />
          <Volume2 className="w-3.5 h-3.5" />
        </div>

        {/* Right Draggable Ruler & Tracks Area */}
        <div 
          ref={rulerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMoveOverTimeline}
          onMouseLeave={() => setHoverX(null)}
          className="flex-1 flex flex-col relative overflow-hidden bg-[#141414] cursor-ew-resize select-none"
        >
          {/* Time Ruler with markers matching Image 1 */}
          <div className="h-5 bg-[#1b1b1b] border-b border-[#282828] relative flex items-center pointer-events-none">
            <div className="absolute left-[38%] text-[9px] font-mono text-[#666] -translate-x-1/2 flex flex-col items-center">
              <span>00:14:50:00</span>
              <div className="h-1.5 w-px bg-[#444] mt-0.5" />
            </div>
            <div className="absolute left-[70%] text-[9px] font-mono text-[#666] -translate-x-1/2 flex flex-col items-center">
              <span>00:14:55:00</span>
              <div className="h-1.5 w-px bg-[#444] mt-0.5" />
            </div>
          </div>

          {/* Tracks Body matching Image 1 */}
          <div className="flex-1 relative p-2 flex flex-col justify-center space-y-1.5 pointer-events-none">
            {/* Track 1: Gold / Brown Connected Clip (→ GFX 코드 하이라이트) */}
            <div className="h-6 w-full flex items-center">
              <div className="w-[28%] ml-[42%] h-full rounded bg-[#a6701a] border border-[#c48520] px-2 flex items-center space-x-1 text-[10px] text-amber-100 shadow">
                <ArrowRight className="w-3 h-3 text-amber-200 shrink-0" />
                <span className="truncate font-medium">GFX 코드 하이라이트</span>
              </div>
            </div>

            {/* Track 2: Purple Connected Title Clip (▼ 자막: 환경변수란? Build In/Out · Title) */}
            <div className="h-8 w-full flex items-center">
              <div className="w-[38%] ml-[36%] h-full rounded bg-[#632785] border border-[#8338af] px-2 flex flex-col justify-center text-[10px] text-purple-100 shadow">
                <div className="flex items-center space-x-1 font-semibold truncate">
                  <span className="text-[9px]">▼</span>
                  <span className="truncate">자막: 환경변수란?</span>
                </div>
                <div className="text-[8px] text-purple-300 font-mono">
                  Build In/Out · Title
                </div>
              </div>
            </div>

            {/* Track 3: Primary Storyline (Blue with Yellow Outline & Waveforms + Transition + Next Clip) */}
            <div className="h-16 w-full flex items-center">
              {/* Selected Main Clip with Bright Yellow Outline */}
              <div className="w-[58%] h-full rounded bg-[#1e4b7a] border-2 border-[#e5a823] relative flex flex-col justify-between overflow-hidden shadow-md">
                {/* Clip Title */}
                <div className="flex items-center space-x-1.5 p-1 text-white font-medium text-[11px] truncate z-10">
                  <div className="w-2 h-2 bg-blue-300 rounded-sm" />
                  <span className="truncate">데모: 터미널 화면녹화</span>
                </div>

                {/* Layered Waveform Visual matching Image 1 */}
                <div className="h-7 w-full bg-[#163557] flex items-center px-1">
                  <svg className="w-full h-full text-[#4ea1f3]" preserveAspectRatio="none" viewBox="0 0 200 40">
                    <path
                      d="M0 20 Q10 5, 20 20 T40 20 T60 8 T80 20 T100 2 T120 20 T140 10 T160 20 T180 5 T200 20 L200 40 L0 40 Z"
                      fill="currentColor"
                      opacity="0.75"
                    />
                    <path
                      d="M0 20 Q10 35, 20 20 T40 20 T60 32 T80 20 T100 38 T120 20 T140 30 T160 20 T180 35 T200 20 L200 0 L0 0 Z"
                      fill="currentColor"
                      opacity="0.4"
                    />
                  </svg>
                </div>
              </div>

              {/* Transition Block (⋈ Hourglass) matching Image 1 */}
              <div className="w-5 h-full bg-[#2a2a2a] border-y border-[#444] flex items-center justify-center text-[#999] text-sm shrink-0">
                ⋈
              </div>

              {/* Next Clip (환경변수 .env 설정) */}
              <div className="flex-1 h-full rounded-r bg-[#1c3f66] border border-[#275385] border-l-0 p-1 flex flex-col justify-between overflow-hidden">
                <span className="text-[11px] text-[#ccc] truncate">환경변수 .env 설정</span>
                <div className="h-5 w-full bg-[#142e4a] opacity-50"></div>
              </div>
            </div>

            {/* Track 4: Green Audio Clips (♫ whoosh, ♫ pop) */}
            <div className="h-6 w-full flex items-center space-x-3">
              <div className="w-[10%] ml-[8%] h-full rounded bg-[#237542] border border-[#2f9655] px-2 flex items-center space-x-1 text-[9px] text-emerald-100 shadow">
                <span>♫ whoosh</span>
              </div>
              <div className="w-[8%] ml-[44%] h-full rounded bg-[#237542] border border-[#2f9655] px-2 flex items-center space-x-1 text-[9px] text-emerald-100 shadow">
                <span>♫ pop</span>
              </div>
            </div>
          </div>

          {/* Orange Skimmer Line (hover) */}
          {hoverX !== null && !isScrubbing && (
            <div 
              className="absolute top-0 bottom-0 pointer-events-none z-20 flex flex-col items-center"
              style={{ left: `${hoverX}px` }}
            >
              <div className="w-0.5 h-full bg-[#ff9500]"></div>
            </div>
          )}

          {/* Active Red Playhead Line matching Image 1 (Moves with playback and drags to seek) */}
          <div 
            className="absolute top-0 bottom-0 z-30 flex flex-col items-center pointer-events-none"
            style={{ left: `${progressPercent}%` }}
          >
            {/* Top Red Triangular Flag matching Image 1 */}
            <div className="w-3 h-3 bg-[#ff3b30] clip-triangle -translate-y-0.5 shadow-md flex items-center justify-center cursor-ew-resize"></div>
            {/* Red Needle Line cutting through all tracks */}
            <div className="w-0.5 h-full bg-[#ff3b30] shadow-[0_0_6px_rgba(255,59,48,0.9)]"></div>

            {/* Live Scrubbing Timecode Tooltip */}
            {isScrubbing && (
              <div className="absolute top-4 bg-black/90 text-[#4ea1f3] border border-[#333] px-1.5 py-0.5 rounded font-mono text-[9px] whitespace-nowrap shadow-xl">
                {formatTimecode(currentTime, clip?.fps || 30)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
