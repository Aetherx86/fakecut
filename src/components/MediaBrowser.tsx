import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  SquareSplitHorizontal,
  Star,
  Film,
  Music,
  Image,
  FolderKanban,
  Trash2
} from 'lucide-react';
import { Clip } from '../types';
import { formatDuration } from '../services/youtube';

interface MediaBrowserProps {
  clips: Clip[];
  activeClip: Clip | null;
  onSelectClip: (clip: Clip) => void;
  onOpenImport: () => void;
  onImportUrl: (url: string) => void;
  onToggleFavorite: (clipId: string) => void;
  onDeleteClip: (clipId: string) => void;
}

export const MediaBrowser: React.FC<MediaBrowserProps> = ({
  clips,
  activeClip,
  onSelectClip,
  onOpenImport,
  onImportUrl,
  onToggleFavorite,
  onDeleteClip,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [isSmartCollectionsOpen, setIsSmartCollectionsOpen] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string>('4-1-26');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      e.preventDefault();
      onImportUrl(searchVal.trim());
      setSearchVal('');
    }
  };

  // Filter clips based on active Smart Collection / Event and search query
  const filteredClips = clips.filter(clip => {
    // 1. Text Search Filter
    if (searchVal.trim()) {
      const q = searchVal.toLowerCase();
      const match = 
        clip.title.toLowerCase().includes(q) ||
        clip.originalTitle.toLowerCase().includes(q) ||
        (clip.channelTitle && clip.channelTitle.toLowerCase().includes(q));
      if (!match) return false;
    }

    // 2. Folder / Smart Collection Filter
    if (selectedFolder === 'all-video') {
      return clip.type === 'video' || (!clip.type && clip.category !== 'Music');
    }
    if (selectedFolder === 'audio-only') {
      return clip.type === 'audio' || clip.category === 'Music';
    }
    if (selectedFolder === 'favorites') {
      return !!clip.isFavorite;
    }
    if (selectedFolder === 'projects') {
      return clip.type === 'project';
    }
    if (selectedFolder === 'stills') {
      return clip.type === 'still';
    }
    if (selectedFolder === '4-1-26') {
      return true; // All clips in current event
    }

    return true;
  });

  return (
    <div className="h-full flex flex-col bg-[#191919] border-r border-[#2c2c2c] select-none text-xs w-[320px] min-w-[280px]">
      {/* Search Header Bar matching Image 1 */}
      <div className="h-8 bg-[#1f1f1f] border-b border-[#2c2c2c] flex items-center px-2 space-x-1.5">
        <div className="relative flex-1 flex items-center bg-[#151515] border border-[#333] rounded px-2 py-0.5">
          <Search className="w-3.5 h-3.5 text-[#666] shrink-0 mr-1.5" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search text, spoken words, and visual objects"
            className="w-full bg-transparent text-[11px] text-[#dedede] placeholder-[#666] outline-none"
          />
        </div>
        <button 
          onClick={onOpenImport}
          className="p-1 text-[#777] hover:text-white rounded hover:bg-[#2c2c2c]"
          title="미디어 가져오기 (Cmd+I)"
        >
          <SquareSplitHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Library Tree View matching Image 1 */}
      <div className="flex-1 overflow-y-auto p-2 text-[#ccc] space-y-1 text-[11px]">
        {/* Untitled Library */}
        <div className="flex items-center space-x-1.5 text-[#e0e0e0] font-medium py-0.5">
          <ChevronDown className="w-3.5 h-3.5 text-[#888]" />
          <div className="w-3.5 h-3.5 bg-[#4ea1f3] rounded-sm flex items-center justify-center text-[9px] text-black font-bold">
            F
          </div>
          <span>Untitled</span>
        </div>

        {/* Smart Collections Folder */}
        <div className="pl-3 space-y-1">
          <div 
            onClick={() => setIsSmartCollectionsOpen(p => !p)}
            className="flex items-center space-x-1.5 py-0.5 cursor-pointer hover:text-white"
          >
            {isSmartCollectionsOpen ? (
              <ChevronDown className="w-3 h-3 text-[#777]" />
            ) : (
              <ChevronRight className="w-3 h-3 text-[#777]" />
            )}
            <Folder className="w-3.5 h-3.5 text-[#e5a823] fill-[#e5a823]" />
            <span className="font-medium text-[#dedede]">Smart Collections</span>
          </div>

          {isSmartCollectionsOpen && (
            <div className="pl-5 space-y-1">
              {[
                { id: 'all-video', label: 'All Video', icon: Film },
                { id: 'audio-only', label: 'Audio Only', icon: Music },
                { id: 'favorites', label: 'Favorites', icon: Star },
                { id: 'projects', label: 'Projects', icon: FolderKanban },
                { id: 'stills', label: 'Stills', icon: Image },
              ].map(item => {
                const count = clips.filter(c => {
                  if (item.id === 'all-video') return c.type === 'video' || (!c.type && c.category !== 'Music');
                  if (item.id === 'audio-only') return c.type === 'audio' || c.category === 'Music';
                  if (item.id === 'favorites') return !!c.isFavorite;
                  if (item.id === 'projects') return c.type === 'project';
                  if (item.id === 'stills') return c.type === 'still';
                  return true;
                }).length;

                return (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedFolder(item.id)}
                    className={`flex items-center justify-between py-0.5 px-1.5 rounded cursor-pointer transition-colors ${
                      selectedFolder === item.id ? 'bg-[#007aff] text-white font-medium' : 'text-[#aaa] hover:bg-[#252525]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-[#f5a623]" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] opacity-70 font-mono">{count}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Event 4-1-26 */}
          <div 
            onClick={() => setSelectedFolder('4-1-26')}
            className={`flex items-center justify-between py-1 px-1.5 rounded cursor-pointer transition-colors ${
              selectedFolder === '4-1-26' ? 'bg-[#007aff] text-white font-medium' : 'text-[#dedede] hover:bg-[#252525]'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <ChevronRight className="w-3 h-3 text-[#777]" />
              <div className="w-2 h-2 rounded-full bg-[#f5a623]" />
              <span className="font-medium">4-1-26</span>
            </div>
            <span className="text-[10px] opacity-70 font-mono">{clips.length}</span>
          </div>
        </div>

        {/* Dynamic Clips List Area */}
        <div className="mt-3 pt-2 border-t border-[#2a2a2a] space-y-1">
          {filteredClips.length > 0 ? (
            filteredClips.map(clip => {
              const isSelected = activeClip?.id === clip.id;
              return (
                <div
                  key={clip.id}
                  onClick={() => onSelectClip(clip)}
                  className={`group flex items-center justify-between p-1.5 rounded cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[#293d56] border border-[#007aff]/70 text-white shadow' 
                      : 'hover:bg-[#242424] text-[#bbb]'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="relative w-10 h-7 rounded bg-black shrink-0 overflow-hidden border border-[#383838]">
                      <img 
                        src={clip.thumbnail} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute bottom-0.5 right-0.5 px-0.5 bg-black/80 rounded text-[8px] font-mono text-white">
                        {formatDuration(clip.duration)}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[11px] font-medium" title={clip.title}>
                        {clip.title}
                      </div>
                      <div className="text-[9px] text-[#777] font-mono flex items-center space-x-1.5">
                        <span>{clip.resolution}</span>
                        <span>•</span>
                        <span>{clip.codec.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Favorite Star + Delete */}
                  <div className="flex items-center space-x-1 pl-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(clip.id);
                      }}
                      className="p-1 text-[#666] hover:text-[#ffbd2e] transition-colors"
                      title="즐겨찾기 토글"
                    >
                      <Star className={`w-3 h-3 ${clip.isFavorite ? 'text-[#ffbd2e] fill-[#ffbd2e]' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClip(clip.id);
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 text-[#666] hover:text-red-400 transition-opacity"
                      title="클립 삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-[#666] space-y-1.5">
              <Film className="w-5 h-5 mx-auto opacity-40" />
              <div className="text-[10px]">클립 없음 — 링크를 추가하세요</div>
              <button
                onClick={onOpenImport}
                className="px-2.5 py-1 bg-[#222] hover:bg-[#2c2c2c] rounded border border-[#383838] text-[10px] text-[#aaa] hover:text-white"
              >
                + 새 클립 가져오기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Text matching Image 1: "클립 없음 — 링크를 추가하세요" */}
      <div 
        onClick={onOpenImport}
        className="h-7 border-t border-[#252525] bg-[#171717] flex items-center justify-between px-3 text-[10px] text-[#666] hover:text-[#999] cursor-pointer transition-colors"
      >
        <span>{selectedFolder === '4-1-26' ? '이벤트: 4-1-26' : `스마트 컬렉션: ${selectedFolder}`}</span>
        <span className="font-mono text-[#888]">{filteredClips.length}개 항목</span>
      </div>
    </div>
  );
};
