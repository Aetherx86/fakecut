import React, { useState } from 'react';
import { 
  X, 
  FolderDown, 
  Video, 
  Sparkles, 
  Check, 
  Film, 
  Search,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Clip } from '../types';
import { extractYouTubeId, fetchYouTubeMeta } from '../services/youtube';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClip: (clip: Clip) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onAddClip,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [category, setCategory] = useState<'A-Roll' | 'B-Roll' | 'Music' | 'References'>('A-Roll');
  const [isLoading, setIsLoading] = useState(false);
  const [previewMeta, setPreviewMeta] = useState<{ id: string; title: string; author: string; thumbnail: string } | null>(null);

  if (!isOpen) return null;

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputUrl(val);

    const extractedId = extractYouTubeId(val);
    if (extractedId) {
      setIsLoading(true);
      const meta = await fetchYouTubeMeta(extractedId);
      setPreviewMeta({
        id: extractedId,
        title: meta.title,
        author: meta.author,
        thumbnail: meta.thumbnail,
      });
      setIsLoading(false);
    } else {
      setPreviewMeta(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const extractedId = previewMeta?.id || extractYouTubeId(inputUrl);
    if (!extractedId) {
      alert('유효한 YouTube URL 또는 비디오 ID를 입력해주세요.');
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const dateStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

    const newClip: Clip = {
      id: `custom-${Date.now()}`,
      title: `CAM_A_${category.toUpperCase()}_C00${randomNum}_RAW.MOV`,
      originalTitle: previewMeta?.title || `YouTube Video (${extractedId})`,
      youtubeId: extractedId,
      thumbnail: previewMeta?.thumbnail || `https://i.ytimg.com/vi/${extractedId}/hqdefault.jpg`,
      duration: 600, // Default duration estimate
      category: category,
      resolution: '3840x2160',
      fps: 23.98,
      codec: 'Apple ProRes 422 HQ',
      date: dateStr,
      channelTitle: previewMeta?.author || 'YouTube Channel',
    };

    onAddClip(newClip);
    onClose();
    setInputUrl('');
    setPreviewMeta(null);
  };

  const handlePresetSelect = async (presetId: string, presetName: string, cat: any) => {
    setIsLoading(true);
    setInputUrl(`https://www.youtube.com/watch?v=${presetId}`);
    const meta = await fetchYouTubeMeta(presetId);
    setCategory(cat);
    setPreviewMeta({
      id: presetId,
      title: presetName || meta.title,
      author: meta.author,
      thumbnail: meta.thumbnail,
    });
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm select-none font-sans">
      <div className="w-[620px] bg-[#282828] border border-[#484848] rounded-xl shadow-2xl overflow-hidden text-[#d4d4d4] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="h-9 bg-[#323232] border-b border-[#3e3e3e] flex items-center justify-between px-3 text-xs font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
            <span className="text-[#aaa] ml-2 font-semibold flex items-center space-x-1.5">
              <FolderDown className="w-3.5 h-3.5 text-[#007aff]" />
              <span>미디어 가져오기 (Import Media)</span>
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-[#444] text-[#888] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* URL Input Box */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#bbb] flex items-center space-x-1.5">
              <Video className="w-3.5 h-3.5 text-red-500" />
              <span>YouTube 비디오 URL 또는 영상 ID</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputUrl}
                onChange={handleUrlChange}
                placeholder="예: https://www.youtube.com/watch?v=... 또는 youtu.be/..."
                className="w-full bg-[#1c1c1c] border border-[#3e3e3e] focus:border-[#007aff] rounded-lg px-3 py-2 text-xs text-[#e6e6e6] placeholder-[#666] outline-none"
                autoFocus
              />
            </div>
            <p className="text-[10px] text-[#777]">
              Tip: 영상 링크를 붙여넣으면 FCP 이벤트 브라우저에 ProRes RAW 클립 형식으로 자동 등록됩니다.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#888]">추천 인기 프리셋 바로 담기</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePresetSelect('5yx6BWlEVcY', 'Chill Electronic Chillstep', 'Music')}
                className="bg-[#212121] hover:bg-[#2c2c2c] p-2 rounded border border-[#3a3a3a] text-left transition-colors"
              >
                <div className="font-semibold text-white text-[11px] truncate">코딩/공부 BGM</div>
                <div className="text-[10px] text-[#777]">Chill Electronic Mix</div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('BexVn_yZq6Y', 'Tokyo Cyberpunk 4K Cinematic Walk', 'B-Roll')}
                className="bg-[#212121] hover:bg-[#2c2c2c] p-2 rounded border border-[#3a3a3a] text-left transition-colors"
              >
                <div className="font-semibold text-white text-[11px] truncate">도쿄 야경 4K</div>
                <div className="text-[10px] text-[#777]">Cinematic Walk</div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('gO5j_kOQ-3U', 'Studio Ghibli Relaxing Piano', 'Music')}
                className="bg-[#212121] hover:bg-[#2c2c2c] p-2 rounded border border-[#3a3a3a] text-left transition-colors"
              >
                <div className="font-semibold text-white text-[11px] truncate">지브리 피아노 BGM</div>
                <div className="text-[10px] text-[#777]">Relaxing Piano</div>
              </button>
            </div>
          </div>

          {/* Target Event / Category */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#bbb]">저장할 이벤트 카테고리</label>
            <div className="grid grid-cols-4 gap-2">
              {(['A-Roll', 'B-Roll', 'Music', 'References'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-1.5 px-2 rounded border text-center transition-colors ${
                    category === cat
                      ? 'bg-[#007aff] text-white border-[#007aff]'
                      : 'bg-[#212121] text-[#aaa] border-[#383838] hover:bg-[#2b2b2b]'
                  }`}
                >
                  {cat === 'A-Roll' && '01_A-Roll 촬영'}
                  {cat === 'B-Roll' && '02_B-Roll 스톡'}
                  {cat === 'Music' && '03_음악/오디오'}
                  {cat === 'References' && '04_레퍼런스'}
                </button>
              ))}
            </div>
          </div>

          {/* Video Metadata Preview (if loaded) */}
          {previewMeta && (
            <div className="bg-[#1b1b1b] p-3 rounded-lg border border-[#3a3a3a] flex items-center space-x-3">
              <img
                src={previewMeta.thumbnail}
                alt="thumbnail"
                className="w-24 h-14 object-cover rounded bg-black shrink-0 border border-[#444]"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-[11px] truncate">{previewMeta.title}</div>
                <div className="text-[10px] text-[#888] mt-0.5">채널: {previewMeta.author}</div>
                <div className="text-[10px] text-[#4ea1f3] font-mono mt-0.5">
                  ProRes 422 HQ (위장명: CAM_A_{category.toUpperCase()}_C00{Math.floor(100 + Math.random() * 900)}_RAW.MOV)
                </div>
              </div>
            </div>
          )}

          {/* FCP Stealth Options */}
          <div className="bg-[#202020] p-3 rounded-lg border border-[#333] space-y-2 text-[11px]">
            <label className="flex items-center space-x-2 text-[#ccc]">
              <input type="checkbox" defaultChecked className="accent-[#007aff] rounded" />
              <span>최적화된 미디어(Apple ProRes 422 HQ) 변환 생성</span>
            </label>
            <label className="flex items-center space-x-2 text-[#ccc]">
              <input type="checkbox" defaultChecked className="accent-[#007aff] rounded" />
              <span>사운드 채널 오디오 파형(Waveform) 자동 렌더링</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="h-10 pt-2 flex items-center justify-end space-x-2 border-t border-[#3a3a3a]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded hover:bg-[#383838] text-[#aaa] hover:text-white"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!previewMeta && !inputUrl}
              className="px-4 py-1.5 bg-[#007aff] hover:bg-[#006ee6] disabled:opacity-50 text-white rounded font-medium transition-colors"
            >
              선택한 항목 가져오기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
