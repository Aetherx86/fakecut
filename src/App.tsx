import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TopMenuBar } from './components/TopMenuBar';
import { MediaBrowser } from './components/MediaBrowser';
import { Viewer, ViewerHandle } from './components/Viewer';
import { Inspector } from './components/Inspector';
import { Timeline } from './components/Timeline';
import { PanicModal } from './components/PanicModal';
import { ImportModal } from './components/ImportModal';
import { Clip, InspectorSettings } from './types';
import { INITIAL_CLIPS, extractYouTubeId, fetchYouTubeMeta } from './services/youtube';

export function App() {
  const viewerRef = useRef<ViewerHandle>(null);

  // Clips state
  const [clips, setClips] = useState<Clip[]>([]);
  const [activeClip, setActiveClip] = useState<Clip | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(925); // 15:25:09
  
  // UI states
  const [isPanicActive, setIsPanicActive] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Inspector settings
  const [inspectorSettings, setInspectorSettings] = useState<InspectorSettings>({
    exposure: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    volume: 80,
    muted: false,
    scale: 100,
    rotation: 0,
  });

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Toggle panic mode
  const triggerPanic = useCallback(() => {
    setIsPanicActive(prev => {
      const next = !prev;
      if (next) {
        setIsPlaying(false);
      }
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        if (e.key === 'Escape') {
          setIsImportOpen(false);
          triggerPanic();
        }
        return;
      }

      // Boss key: ESC or F1 or Backtick
      if (e.key === 'Escape' || e.key === 'F1' || e.key === '`') {
        e.preventDefault();
        triggerPanic();
        return;
      }

      // Space: Play/Pause
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(p => !p);
        return;
      }

      // J: Rewind 5s
      if (e.key === 'j' || e.key === 'J') {
        const nextTime = Math.max(0, currentTime - 5);
        setCurrentTime(nextTime);
        viewerRef.current?.seekTo(nextTime);
        return;
      }

      // K: Pause
      if (e.key === 'k' || e.key === 'K') {
        setIsPlaying(false);
        return;
      }

      // L: Forward 5s
      if (e.key === 'l' || e.key === 'L') {
        const nextTime = Math.min(duration, currentTime + 5);
        setCurrentTime(nextTime);
        viewerRef.current?.seekTo(nextTime);
        return;
      }

      // Cmd+I / Ctrl+I: Import
      if ((e.metaKey || e.ctrlKey) && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        setIsImportOpen(true);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, duration, triggerPanic]);

  const handleSelectClip = (clip: Clip) => {
    setActiveClip(clip);
    setCurrentTime(0);
    setDuration(clip.duration || 600);
    setIsPlaying(true);
  };

  const handleAddClip = (newClip: Clip) => {
    setClips(prev => [newClip, ...prev]);
    setActiveClip(newClip);
    setCurrentTime(0);
    setDuration(newClip.duration || 600);
    setIsPlaying(true);
  };

  // Quick import from Left search input
  const handleImportFromUrl = async (urlOrQuery: string) => {
    const extractedId = extractYouTubeId(urlOrQuery);
    if (extractedId) {
      const meta = await fetchYouTubeMeta(extractedId);
      const newClip: Clip = {
        id: `clip-${Date.now()}`,
        title: `4-1. ${meta.title.slice(0, 20)}`,
        originalTitle: meta.title,
        youtubeId: extractedId,
        thumbnail: meta.thumbnail,
        duration: 925,
        category: 'A-Roll',
        resolution: '1080p HD',
        fps: 30,
        codec: 'Apple ProRes 422',
        date: new Date().toISOString().slice(0, 10),
      };
      handleAddClip(newClip);
    } else {
      const fallback = INITIAL_CLIPS[0];
      handleAddClip({
        ...fallback,
        title: `4-1. ${urlOrQuery.slice(0, 18)}...`,
      });
    }
  };

  const handleUpdateSettings = (newSettings: Partial<InspectorSettings>) => {
    setInspectorSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Instant Seek handler: Synchronizes React state AND physically seeks YouTube Player
  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    viewerRef.current?.seekTo(seconds);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#141414] text-[#dedede] overflow-hidden select-none font-sans">
      {/* 1. macOS Top Menu Bar matching Image 1 */}
      <TopMenuBar
        onOpenImport={() => setIsImportOpen(true)}
        onTriggerPanic={triggerPanic}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 2. Main Middle Workspace: Left Library + Center Viewer + Right Inspector */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Library & Search Bar matching Image 1 */}
        <MediaBrowser
          clips={clips}
          activeClip={activeClip}
          onSelectClip={handleSelectClip}
          onOpenImport={() => setIsImportOpen(true)}
          onImportUrl={handleImportFromUrl}
        />

        {/* Center Viewer matching Image 1 */}
        <div className="flex-1 h-full min-w-0">
          <Viewer
            ref={viewerRef}
            clip={activeClip}
            settings={inspectorSettings}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            onTimeUpdate={setCurrentTime}
            onDurationChange={setDuration}
            onPlayPauseToggle={() => {
              if (!activeClip) {
                // If clicked when empty, load first sample
                handleSelectClip(INITIAL_CLIPS[0]);
              } else {
                setIsPlaying(p => !p);
              }
            }}
            onSeek={handleSeek}
            onOpenImport={() => setIsImportOpen(true)}
          />
        </div>

        {/* Right Inspector matching Image 1 */}
        <Inspector
          clip={activeClip}
          settings={inspectorSettings}
          onUpdateSettings={handleUpdateSettings}
        />
      </div>

      {/* 3. Bottom Timeline matching Image 1 with interactive scrubbing */}
      <div className="h-[210px] min-h-[170px] max-h-[260px]">
        <Timeline
          clip={activeClip}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          isPlaying={isPlaying}
        />
      </div>

      {/* Emergency Boss Key Modal */}
      <PanicModal
        isOpen={isPanicActive}
        onDismiss={() => setIsPanicActive(false)}
      />

      {/* Import Media Dialog (Cmd+I) */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onAddClip={handleAddClip}
      />
    </div>
  );
}

export default App;
