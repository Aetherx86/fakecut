import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  SquareSplitHorizontal,
  Film
} from 'lucide-react';
import { Clip } from '../types';

interface MediaBrowserProps {
  clips: Clip[];
  activeClip: Clip | null;
  onSelectClip: (clip: Clip) => void;
  onOpenImport: () => void;
  onImportUrl: (url: string) => void;
}

export const MediaBrowser: React.FC<MediaBrowserProps> = ({
  clips,
  activeClip,
  onSelectClip,
  onOpenImport,
  onImportUrl,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [isSmartCollectionsOpen, setIsSmartCollectionsOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string>('4-1-26');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      e.preventDefault();
      onImportUrl(searchVal.trim());
      setSearchVal('');
    }
  };

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
          title="Clip Appearance / Split View"
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
                { id: 'all-video', label: 'All Video' },
                { id: 'audio-only', label: 'Audio Only' },
                { id: 'favorites', label: 'Favorites' },
                { id: 'projects', label: 'Projects' },
                { id: 'stills', label: 'Stills' },
              ].map(item => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className={`flex items-center space-x-2 py-0.5 px-1.5 rounded cursor-pointer ${
                    selectedItem === item.id ? 'bg-[#007aff] text-white' : 'text-[#aaa] hover:bg-[#252525]'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-[#f5a623]" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Event 4-1-26 */}
          <div 
            onClick={() => setSelectedItem('4-1-26')}
            className={`flex items-center space-x-1.5 py-1 px-1.5 rounded cursor-pointer ${
              selectedItem === '4-1-26' ? 'bg-[#007aff] text-white' : 'text-[#dedede] hover:bg-[#252525]'
            }`}
          >
            <ChevronRight className="w-3 h-3 text-[#777]" />
            <div className="w-2 h-2 rounded-full bg-[#f5a623]" />
            <span className="font-medium">4-1-26</span>
          </div>
        </div>

        {/* Loaded Clips List if any */}
        {clips.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#2a2a2a] space-y-1">
            <div className="text-[10px] uppercase text-[#666] px-1 font-semibold">
              가져온 클립 ({clips.length})
            </div>
            {clips.map(clip => (
              <div
                key={clip.id}
                onClick={() => onSelectClip(clip)}
                className={`flex items-center space-x-2 p-1.5 rounded cursor-pointer ${
                  activeClip?.id === clip.id ? 'bg-[#293d56] border border-[#007aff]/60 text-white' : 'hover:bg-[#242424] text-[#bbb]'
                }`}
              >
                <img src={clip.thumbnail} alt="" className="w-9 h-6 object-cover rounded bg-black shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-[11px] font-medium">{clip.title}</div>
                  <div className="text-[9px] text-[#777] font-mono">1080p • ProRes 422</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Status Text matching Image 1: "클립 없음 — 링크를 추가하세요" */}
      <div 
        onClick={onOpenImport}
        className="h-8 border-t border-[#252525] bg-[#171717] flex items-center justify-center text-[10px] text-[#666] hover:text-[#999] cursor-pointer transition-colors"
      >
        <span>{clips.length > 0 ? `${clips.length}개 클립 준비됨` : '클립 없음 — 링크를 추가하세요'}</span>
      </div>
    </div>
  );
};
