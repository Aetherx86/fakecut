import React from 'react';
import { 
  Plus, 
  FolderDown, 
  Edit3, 
  Layout, 
  Grid, 
  Share, 
  Columns,
  Sparkles
} from 'lucide-react';

interface TopMenuBarProps {
  onOpenImport: () => void;
  onTriggerPanic: () => void;
  onToggleFullscreen: () => void;
}

export const TopMenuBar: React.FC<TopMenuBarProps> = ({
  onOpenImport,
  onTriggerPanic,
  onToggleFullscreen,
}) => {
  return (
    <header className="h-9 bg-[#1c1c1c] border-b border-[#2d2d2d] flex items-center justify-between px-3 text-[#d1d1d1] select-none text-xs z-30">
      {/* Left: macOS Traffic Lights + FCP Quick Tools */}
      <div className="flex items-center space-x-3">
        {/* macOS Traffic Lights */}
        <div className="flex items-center space-x-1.5 mr-2">
          <button 
            title="Panic Button / 긴급 위장 (ESC)"
            onClick={onTriggerPanic} 
            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 active:brightness-90 transition-all border border-[#e0443e]"
          />
          <button 
            title="Minimize"
            onClick={onTriggerPanic} 
            className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 active:brightness-90 transition-all border border-[#dea123]"
          />
          <button 
            title="Toggle Fullscreen (Cmd+Ctrl+F)"
            onClick={onToggleFullscreen} 
            className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 active:brightness-90 transition-all border border-[#1aab29]"
          />
        </div>

        {/* Toolbar Icons matching Image 1: +, Download/Import Tray, Edit icon */}
        <div className="flex items-center space-x-2 text-[#9e9e9e]">
          <button 
            onClick={onOpenImport}
            className="p-1 hover:text-white hover:bg-[#2c2c2c] rounded transition-colors"
            title="New Project / Item"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={onOpenImport}
            className="p-1 hover:text-white hover:bg-[#2c2c2c] rounded transition-colors text-[#e0e0e0]"
            title="가져오기 (Import Media - Cmd+I)"
          >
            <FolderDown className="w-3.5 h-3.5 text-[#007aff]" />
          </button>

          <button 
            onClick={() => {}}
            className="p-1 hover:text-white hover:bg-[#2c2c2c] rounded transition-colors"
            title="Edit / Rename"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center: Subtle project info */}
      <div 
        onClick={onTriggerPanic}
        className="cursor-pointer text-[11px] text-[#777] hover:text-[#aaa] transition-colors flex items-center space-x-1"
        title="긴급 보스키 (ESC 또는 클릭)"
      >
        <span className="opacity-0 hover:opacity-100 transition-opacity text-[10px] bg-red-950/60 text-red-400 px-1.5 py-0.5 rounded border border-red-800/40">
          ESC 긴급 렌더 위장
        </span>
      </div>

      {/* Right: Layout Switcher & Export (Square with upward arrow) */}
      <div className="flex items-center space-x-2 text-[#8e8e8e]">
        <button 
          onClick={onToggleFullscreen}
          className="p-1 hover:text-white hover:bg-[#2c2c2c] rounded transition-colors"
          title="Dual Display Toggle"
        >
          <Columns className="w-3.5 h-3.5" />
        </button>

        {/* Grid and list layout buttons matching Image 1 */}
        <div className="flex items-center space-x-1 px-1 bg-[#181818] rounded border border-[#333]">
          <button className="p-0.5 hover:text-white rounded text-white" title="Clip Grid">
            <Grid className="w-3 h-3" />
          </button>
          <button className="p-0.5 hover:text-white rounded text-[#888]" title="List View">
            <Layout className="w-3 h-3" />
          </button>
        </div>

        {/* Share / Export Tray */}
        <button 
          onClick={() => alert('Apple ProRes 422 HQ 내보내기 준비 완료')}
          className="p-1 hover:text-white hover:bg-[#2c2c2c] rounded transition-colors text-[#ccc]"
          title="Share / Export"
        >
          <Share className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
