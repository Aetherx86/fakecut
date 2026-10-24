import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Volume2, 
  Info, 
  Minus, 
  Square, 
  RotateCw, 
  ChevronDown,
  Sparkles,
  FileText,
  Sliders
} from 'lucide-react';
import { Clip, InspectorSettings } from '../types';

interface InspectorProps {
  clip: Clip | null;
  settings: InspectorSettings;
  onUpdateSettings: (newSettings: Partial<InspectorSettings>) => void;
  isPlaying?: boolean;
}

export const Inspector: React.FC<InspectorProps> = ({
  clip,
  settings,
  onUpdateSettings,
  isPlaying = false,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'info'>('video');
  const [vuPeak, setVuPeak] = useState<number>(0);

  // Simulated VU audio meter fluctuation when playing
  useEffect(() => {
    if (!isPlaying || settings.muted) {
      setVuPeak(0);
      return;
    }
    const interval = setInterval(() => {
      // fluctuate based on volume
      const base = settings.volume;
      const jitter = (Math.random() * 20 - 10);
      setVuPeak(Math.max(5, Math.min(100, base + jitter)));
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, settings.volume, settings.muted]);

  return (
    <div className="h-full flex flex-col bg-[#1c1c1c] border-l border-[#2c2c2c] select-none text-xs w-[320px] min-w-[290px]">
      {/* Top Tabs matching Image 1: [ Film ] [ Volume ] [ Info ] */}
      <div className="h-7 bg-[#232323] border-b border-[#2d2d2d] flex items-center justify-start px-2 space-x-3 text-[#777]">
        <button
          onClick={() => setActiveTab('video')}
          className={`p-1 rounded transition-colors ${
            activeTab === 'video' ? 'text-white bg-[#2e2e2e]' : 'hover:text-white'
          }`}
          title="비디오 인스펙터 (Video Inspector)"
        >
          <Film className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`p-1 rounded transition-colors ${
            activeTab === 'audio' ? 'text-white bg-[#2e2e2e]' : 'hover:text-white'
          }`}
          title="오디오 인스펙터 (Audio Inspector)"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`p-1 rounded transition-colors ${
            activeTab === 'info' ? 'text-white bg-[#2e2e2e]' : 'hover:text-white'
          }`}
          title="정보 인스펙터 (Metadata & Info)"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Header matching Image 1: 4-1 | 00:02:44;14 */}
      <div className="h-7 px-3 flex items-center justify-between border-b border-[#282828] text-[11px]">
        <span className="font-semibold text-white">4-1</span>
        <span className="font-mono text-[#777]">00:02:44;14</span>
      </div>

      {/* Main Inspector Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-[#ccc] text-[11px]">
        {/* TAB 1: VIDEO CONTROLS */}
        {activeTab === 'video' && (
          <>
            {/* Group 1: Effects Header */}
            <div className="space-y-2">
              <label className="flex items-center space-x-1.5 font-semibold text-white cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.hasShapeMask}
                  onChange={(e) => onUpdateSettings({ hasShapeMask: e.target.checked })}
                  className="accent-[#007aff] rounded-sm cursor-pointer" 
                />
                <span>Effects</span>
              </label>

              {/* Sub-group: Shape Mask */}
              <div className="space-y-2 pl-1.5">
                <div className="flex items-center justify-between font-semibold text-[#dedede]">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.hasShapeMask}
                      onChange={(e) => onUpdateSettings({ hasShapeMask: e.target.checked })}
                      className="accent-[#007aff] rounded-sm cursor-pointer" 
                    />
                    <span>Shape Mask</span>
                  </label>
                  <button 
                    onClick={() => onUpdateSettings({ hasShapeMask: !settings.hasShapeMask })}
                    className="p-0.5 text-[#777] hover:text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>

                {/* Radius */}
                <div className="flex items-center justify-between text-[#aaa] pl-3 space-x-2">
                  <span className="flex items-center space-x-1 shrink-0">
                    <span className="text-[9px] text-[#666]">•</span>
                    <span>Radius</span>
                  </span>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    value={settings.maskRadius}
                    onChange={(e) => onUpdateSettings({ maskRadius: Number(e.target.value) })}
                    className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
                  />
                  <div className="w-14 bg-[#121212] border border-[#333] rounded px-1.5 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                    {settings.maskRadius}
                  </div>
                </div>

                {/* Curvature */}
                <div className="flex items-center justify-between text-[#aaa] pl-3 space-x-2">
                  <span className="shrink-0">Curvature</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.maskCurvature}
                    onChange={(e) => onUpdateSettings({ maskCurvature: Number(e.target.value) })}
                    className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
                  />
                  <div className="w-14 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                    {settings.maskCurvature.toFixed(1)} %
                  </div>
                </div>

                {/* Fill Opacity */}
                <div className="flex items-center justify-between text-[#aaa] pl-3 space-x-2">
                  <span className="shrink-0">Fill Opacity</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.maskFillOpacity}
                    onChange={(e) => onUpdateSettings({ maskFillOpacity: Number(e.target.value) })}
                    className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
                  />
                  <div className="w-14 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                    {settings.maskFillOpacity.toFixed(1)} %
                  </div>
                </div>

                {/* Invert Mask */}
                <div className="flex items-center justify-between text-[#aaa] pl-3">
                  <span>Invert Mask</span>
                  <input 
                    type="checkbox" 
                    checked={settings.maskInvert}
                    onChange={(e) => onUpdateSettings({ maskInvert: e.target.checked })}
                    className="accent-[#007aff] rounded-sm cursor-pointer" 
                  />
                </div>

                {/* View Dropdown */}
                <div className="flex items-center justify-between text-[#aaa] pl-3">
                  <span>View</span>
                  <div className="flex items-center space-x-1 bg-[#121212] border border-[#333] rounded px-2 py-0.5 text-[10px] text-[#ccc]">
                    <span>Composite</span>
                    <ChevronDown className="w-2.5 h-2.5 text-[#666]" />
                  </div>
                </div>

                {/* Feather */}
                <div className="flex items-center justify-between text-[#aaa] pl-3 space-x-2">
                  <span className="shrink-0">Feather</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.maskFeather}
                    onChange={(e) => onUpdateSettings({ maskFeather: Number(e.target.value) })}
                    className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
                  />
                  <div className="w-10 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                    {settings.maskFeather}
                  </div>
                </div>

                {/* Falloff */}
                <div className="flex items-center justify-between text-[#aaa] pl-3 space-x-2">
                  <span className="shrink-0">Falloff</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue={0}
                    className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
                  />
                  <div className="w-10 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                    0
                  </div>
                </div>

                {/* Fixed Feather */}
                <div className="flex items-center justify-between text-[#aaa] pl-3">
                  <span>Fixed Feather</span>
                  <input type="checkbox" defaultChecked className="accent-[#007aff] rounded-sm" />
                </div>

                {/* Control Points */}
                <div className="flex items-center justify-between text-[#aaa] pl-3">
                  <span>Control Points</span>
                  <button 
                    onClick={() => alert('Control Points converted to Bezier Spline')}
                    className="bg-[#2a2a2a] hover:bg-[#333] border border-[#3e3e3e] rounded px-2 py-0.5 text-[10px] text-white active:scale-95"
                  >
                    Convert To Points
                  </button>
                </div>
              </div>
            </div>

            {/* Group 2: Compositing */}
            <div className="space-y-2 pt-2 border-t border-[#2a2a2a]">
              <div className="font-semibold text-white">Compositing</div>

              {/* Blend Mode */}
              <div className="flex items-center justify-between text-[#aaa]">
                <span>Blend Mode</span>
                <select
                  value={settings.blendMode}
                  onChange={(e) => onUpdateSettings({ blendMode: e.target.value as any })}
                  className="bg-[#121212] border border-[#333] rounded px-1.5 py-0.5 text-[10px] text-[#ccc] outline-none cursor-pointer"
                >
                  <option value="normal">Normal</option>
                  <option value="multiply">Multiply</option>
                  <option value="screen">Screen</option>
                  <option value="overlay">Overlay</option>
                  <option value="darken">Darken</option>
                  <option value="lighten">Lighten</option>
                </select>
              </div>

              {/* Opacity */}
              <div className="flex items-center justify-between text-[#aaa] space-x-2">
                <span className="shrink-0">Opacity</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.opacity}
                  onChange={(e) => onUpdateSettings({ opacity: Number(e.target.value) })}
                  className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
                />
                <div className="w-14 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                  {settings.opacity.toFixed(1)} %
                </div>
              </div>
            </div>

            {/* Group 3: Transform matching Image 1 */}
            <div className="space-y-2 pt-2 border-t border-[#2a2a2a]">
              <div className="flex items-center justify-between font-semibold text-white">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#007aff] rounded-sm" />
                  <span>Transform</span>
                </label>
                <Square className="w-3 h-3 text-[#777]" />
              </div>

              {/* Position X / Y */}
              <div className="flex items-center justify-between text-[#aaa]">
                <span>Position</span>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-[#777]">X</span>
                  <input
                    type="number"
                    value={settings.posX}
                    onChange={(e) => onUpdateSettings({ posX: Number(e.target.value) })}
                    className="w-12 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] outline-none"
                  />
                  <span className="text-[10px] text-[#777]">Y</span>
                  <input
                    type="number"
                    value={settings.posY}
                    onChange={(e) => onUpdateSettings({ posY: Number(e.target.value) })}
                    className="w-12 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] outline-none"
                  />
                </div>
              </div>

              {/* Rotation */}
              <div className="flex items-center justify-between text-[#aaa] space-x-2">
                <span className="shrink-0">Rotation</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={settings.rotation}
                  onChange={(e) => onUpdateSettings({ rotation: Number(e.target.value) })}
                  className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
                />
                <div className="w-12 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                  {settings.rotation} °
                </div>
              </div>

              {/* Scale (All) */}
              <div className="flex items-center justify-between text-[#aaa] space-x-2">
                <span className="shrink-0">Scale (All)</span>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={settings.scale}
                  onChange={(e) => onUpdateSettings({ scale: Number(e.target.value) })}
                  className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
                />
                <div className="w-14 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                  {settings.scale.toFixed(2)} %
                </div>
              </div>

              {/* Scale X */}
              <div className="flex items-center justify-between text-[#aaa] space-x-2">
                <span className="shrink-0">Scale X</span>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={settings.scaleX}
                  onChange={(e) => onUpdateSettings({ scaleX: Number(e.target.value) })}
                  className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
                />
                <div className="w-14 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                  {settings.scaleX.toFixed(2)} %
                </div>
              </div>

              {/* Scale Y */}
              <div className="flex items-center justify-between text-[#aaa] space-x-2">
                <span className="shrink-0">Scale Y</span>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={settings.scaleY}
                  onChange={(e) => onUpdateSettings({ scaleY: Number(e.target.value) })}
                  className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
                />
                <div className="w-14 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                  {settings.scaleY.toFixed(2)} %
                </div>
              </div>
            </div>

            {/* Group 4: Checkboxes matching Image 1 */}
            <div className="space-y-2 pt-2 border-t border-[#2a2a2a]">
              {/* Crop */}
              <div className="space-y-1.5">
                <label className="flex items-center space-x-1.5 font-semibold text-white cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.hasCrop}
                    onChange={(e) => onUpdateSettings({ hasCrop: e.target.checked })}
                    className="accent-[#007aff] rounded-sm cursor-pointer" 
                  />
                  <span>Crop</span>
                </label>
                {settings.hasCrop && (
                  <div className="pl-4 space-y-1 text-[10px] text-[#aaa]">
                    <div className="flex justify-between items-center">
                      <span>Left / Right</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="30" 
                        value={settings.cropLeft}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          onUpdateSettings({ cropLeft: val, cropRight: val });
                        }}
                        className="w-24 h-1 accent-[#007aff] bg-[#333]" 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Distort */}
              <label className="flex items-center space-x-1.5 font-semibold text-white cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.hasDistort}
                  onChange={(e) => onUpdateSettings({ hasDistort: e.target.checked })}
                  className="accent-[#007aff] rounded-sm cursor-pointer" 
                />
                <span>Distort</span>
              </label>

              {/* Stabilization */}
              <label className="flex items-center space-x-1.5 font-medium text-[#aaa] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.hasStabilization}
                  onChange={(e) => onUpdateSettings({ hasStabilization: e.target.checked })}
                  className="accent-[#007aff] rounded-sm cursor-pointer" 
                />
                <span>Stabilization</span>
              </label>

              {/* Rolling Shutter */}
              <label className="flex items-center space-x-1.5 font-medium text-[#aaa] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.hasRollingShutter}
                  onChange={(e) => onUpdateSettings({ hasRollingShutter: e.target.checked })}
                  className="accent-[#007aff] rounded-sm cursor-pointer" 
                />
                <span>Rolling Shutter</span>
              </label>
            </div>
          </>
        )}

        {/* TAB 2: AUDIO CONTROLS */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            <div className="font-semibold text-white flex items-center justify-between">
              <span>오디오 믹서 & 볼륨</span>
              <span className="text-[10px] text-[#52c41a] font-mono">48.0 kHz 24-bit</span>
            </div>

            {/* Volume Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[#aaa]">
                <span>마스터 볼륨</span>
                <span className="font-mono text-white">{settings.muted ? '0%' : `${settings.volume}%`}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.muted ? 0 : settings.volume}
                onChange={(e) => onUpdateSettings({ volume: Number(e.target.value), muted: false })}
                className="w-full h-1.5 accent-[#52c41a] bg-[#333] rounded cursor-pointer"
              />
            </div>

            {/* Mute Button */}
            <div className="flex items-center justify-between text-[#aaa]">
              <span>음소거 (Mute)</span>
              <input
                type="checkbox"
                checked={settings.muted}
                onChange={(e) => onUpdateSettings({ muted: e.target.checked })}
                className="accent-[#ff3b30] rounded-sm cursor-pointer"
              />
            </div>

            {/* Animated Bouncing Peak Meter */}
            <div className="bg-[#121212] p-2 rounded border border-[#333] space-y-1">
              <div className="flex justify-between text-[9px] font-mono text-[#777]">
                <span>-40dB</span>
                <span>-20dB</span>
                <span>-6dB</span>
                <span>0dB PEAK</span>
              </div>
              <div className="h-2 bg-[#252525] rounded overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500 transition-all duration-100 rounded-sm"
                  style={{ width: `${vuPeak}%` }}
                ></div>
              </div>
            </div>

            {/* Audio Enhancements */}
            <div className="space-y-2 pt-2 border-t border-[#2a2a2a]">
              <div className="font-semibold text-[#dedede]">오디오 향상 (Enhancements)</div>
              
              <div className="space-y-1 text-[10px] text-[#aaa]">
                <div className="flex justify-between">
                  <span>음성 격리 (Voice Isolation)</span>
                  <span className="font-mono text-white">{settings.voiceIsolation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.voiceIsolation}
                  onChange={(e) => onUpdateSettings({ voiceIsolation: Number(e.target.value) })}
                  className="w-full h-1 accent-[#007aff] bg-[#333]"
                />
              </div>

              <label className="flex items-center space-x-1.5 text-[#aaa] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.noiseRemoval}
                  onChange={(e) => onUpdateSettings({ noiseRemoval: e.target.checked })}
                  className="accent-[#007aff] rounded-sm" 
                />
                <span>배경 노이즈 제거 (Noise Removal 60%)</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: METADATA & INFO */}
        {activeTab === 'info' && (
          <div className="space-y-3 font-mono text-[11px]">
            <div className="font-semibold text-white flex items-center justify-between">
              <span>클립 메타데이터</span>
              <span className="text-[10px] text-[#4ea1f3]">ProRes RAW</span>
            </div>

            <div className="bg-[#141414] p-2.5 rounded border border-[#333] space-y-2 text-[#aaa]">
              <div>
                <span className="text-[9px] text-[#666] block">클립 이름</span>
                <span className="text-white font-medium truncate block">{clip?.title || '4-1. 데모: 터미널 화면녹화.MOV'}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#666] block">코덱 / 포맷</span>
                <span className="text-white font-medium">{clip?.codec || 'Apple ProRes 422 HQ'}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#666] block">해상도 & FPS</span>
                <span className="text-white font-medium">{clip?.resolution || '1920x1080 HD'} @ {clip?.fps || 30} fps</span>
              </div>
              <div>
                <span className="text-[9px] text-[#666] block">색공간 (Color Space)</span>
                <span className="text-white font-medium">Apple Wide Color (Rec. 709 / Rec. 2020)</span>
              </div>
              <div>
                <span className="text-[9px] text-[#666] block">오디오 채널</span>
                <span className="text-white font-medium">48 kHz, 24-bit Stereo PCM Linear</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#2a2a2a]">
              <span className="font-semibold text-[#aaa] text-[10px]">촬영 정보 (Camera Metadata)</span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-[#888]">
                <div className="bg-[#151515] p-1.5 rounded border border-[#2b2b2b]">
                  <span className="text-[#555] block">Camera</span>
                  <span className="text-[#ccc]">ARRI ALEXA Mini LF</span>
                </div>
                <div className="bg-[#151515] p-1.5 rounded border border-[#2b2b2b]">
                  <span className="text-[#555] block">Lens</span>
                  <span className="text-[#ccc]">Cooke S4/i 35mm T2.0</span>
                </div>
                <div className="bg-[#151515] p-1.5 rounded border border-[#2b2b2b]">
                  <span className="text-[#555] block">ISO</span>
                  <span className="text-[#ccc]">800 EI</span>
                </div>
                <div className="bg-[#151515] p-1.5 rounded border border-[#2b2b2b]">
                  <span className="text-[#555] block">Shutter</span>
                  <span className="text-[#ccc]">180.0° (1/48s)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
