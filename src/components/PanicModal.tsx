import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  HardDrive, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Film,
  Zap
} from 'lucide-react';

interface PanicModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const PanicModal: React.FC<PanicModalProps> = ({ isOpen, onDismiss }) => {
  const [progress, setProgress] = useState(84);
  const [fpsRate, setFpsRate] = useState(142);

  // Slow simulated progress to make it look 100% active and real
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setProgress(p => (p >= 99 ? 84 : p + 0.2));
      setFpsRate(Math.floor(138 + Math.random() * 12));
    }, 1200);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md select-none font-sans">
      <div className="w-[580px] bg-[#282828] border border-[#484848] rounded-xl shadow-2xl overflow-hidden text-[#d4d4d4] animate-in fade-in zoom-in-95 duration-150">
        {/* macOS Modal Title Bar */}
        <div className="h-9 bg-[#323232] border-b border-[#3e3e3e] flex items-center justify-between px-3 text-xs font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer" onClick={onDismiss} />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
            <span className="text-[#aaa] ml-2 font-semibold">백그라운드 작업 (Background Tasks)</span>
          </div>

          <button 
            onClick={onDismiss}
            className="p-1 rounded hover:bg-[#444] text-[#888] hover:text-white"
            title="창 닫기 (ESC)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Main Task Header */}
          <div className="flex items-center space-x-3 bg-[#1e1e1e] p-3 rounded-lg border border-[#383838]">
            <div className="p-2.5 rounded-lg bg-[#007aff]/15 text-[#007aff] border border-[#007aff]/30">
              <Film className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-white text-sm">타임라인 미디어 백그라운드 렌더링</span>
                <span className="font-mono text-[#4ea1f3] font-bold text-sm">{progress.toFixed(1)}%</span>
              </div>
              <div className="text-[11px] text-[#888] truncate mt-0.5 font-mono">
                Commercial_Campaign_2026.fcpbundle / ProRes_422_HQ_Master_4K.mov
              </div>
            </div>
          </div>

          {/* Animated Render Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-[#181818] rounded-full overflow-hidden p-0.5 border border-[#3e3e3e]">
              <div 
                className="h-full bg-gradient-to-r from-[#007aff] to-[#34c759] rounded-full transition-all duration-300 render-stripes"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-[#777] font-mono">
              <span>남은 시간: 약 1분 12초 (인코딩 속도: {fpsRate} fps)</span>
              <span>18,420 / 21,900 프레임</span>
            </div>
          </div>

          {/* Task Detailed Breakdown List */}
          <div className="space-y-2 border-t border-[#383838] pt-3">
            <div className="text-[11px] font-semibold text-[#aaa] uppercase tracking-wider">
              파이프라인 실행 상태
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between text-[#bbb]">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34c759]" />
                  <span>광색역 Rec.2020 3D LUT 컬러 변환</span>
                </div>
                <span className="text-[#34c759] text-[10px]">완료</span>
              </div>

              <div className="flex items-center justify-between text-[#bbb]">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34c759]" />
                  <span>광학 흐름(Optical Flow) 60fps 보간</span>
                </div>
                <span className="text-[#34c759] text-[10px]">완료</span>
              </div>

              <div className="flex items-center justify-between text-white bg-[#222] p-1.5 rounded border border-[#333]">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-3.5 h-3.5 text-[#007aff] animate-spin" />
                  <span>Apple Silicon MetalFX 가속 4K ProRes 인코딩</span>
                </div>
                <span className="text-[#4ea1f3] text-[10px] font-bold">진행 중 ({progress.toFixed(0)}%)</span>
              </div>

              <div className="flex items-center justify-between text-[#777]">
                <div className="flex items-center space-x-2">
                  <div className="w-3.5 h-3.5 rounded-full border border-[#555] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#555] rounded-full"></div>
                  </div>
                  <span>오디오 48kHz 24-bit PCM 다채널 믹스다운</span>
                </div>
                <span className="text-[10px]">대기 중</span>
              </div>
            </div>
          </div>

          {/* System Hardware Stats */}
          <div className="flex items-center justify-between bg-[#1f1f1f] p-2.5 rounded-lg border border-[#333] text-[11px] text-[#888]">
            <div className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#ff9500]" />
              <span>Apple M-Series GPU: 78%</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-[#34c759]" />
              <span>Metal 3 가속 활성</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <HardDrive className="w-3.5 h-3.5 text-[#007aff]" />
              <span>SSD 대역폭: 1.2 GB/s</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="h-12 bg-[#2f2f2f] border-t border-[#3e3e3e] px-4 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] text-[#888]">
            <ShieldCheck className="w-4 h-4 text-[#34c759]" />
            <span>비상 위장 모드 동작 중 (ESC 키를 누르면 해제됩니다)</span>
          </div>

          <button
            onClick={onDismiss}
            className="px-4 py-1.5 bg-[#007aff] hover:bg-[#006ee6] text-white rounded font-medium text-xs transition-colors shadow"
          >
            편집기로 복귀 (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
