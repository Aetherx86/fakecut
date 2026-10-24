import React, { useState } from 'react';
import { 
  Film, 
  Volume2, 
  Info, 
  Minus, 
  Square, 
  RotateCw, 
  ChevronDown
} from 'lucide-react';
import { Clip, InspectorSettings } from '../types';

interface InspectorProps {
  clip: Clip | null;
  settings: InspectorSettings;
  onUpdateSettings: (newSettings: Partial<InspectorSettings>) => void;
}

export const Inspector: React.FC<InspectorProps> = ({
  clip,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'info'>('video');

  // Realistic FCP Inspector internal state values matching Image 1
  const [radius, setRadius] = useState(1200);
  const [curvature, setCurvature] = useState(100.0);
  const [fillOpacity, setFillOpacity] = useState(100.0);
  const [feather, setFeather] = useState(0);
  const [falloff, setFalloff] = useState(0);
  const [opacity, setOpacity] = useState(100.0);
  const [posX, setPosX] = useState(749.5);
  const [posY, setPosY] = useState(-341.7);
  const [rotation, setRotation] = useState(0);
  const [scaleAll, setScaleAll] = useState(42.67);

  return (
    <div className="h-full flex flex-col bg-[#1c1c1c] border-l border-[#2c2c2c] select-none text-xs w-[320px] min-w-[290px]">
      {/* Top Tabs matching Image 1: [ Film ] [ Volume ] [ Info ] */}
      <div className="h-7 bg-[#232323] border-b border-[#2d2d2d] flex items-center justify-start px-2 space-x-3 text-[#777]">
        <button
          onClick={() => setActiveTab('video')}
          className={`p-1 rounded transition-colors ${
            activeTab === 'video' ? 'text-white' : 'hover:text-white'
          }`}
          title="Video Inspector"
        >
          <Film className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`p-1 rounded transition-colors ${
            activeTab === 'audio' ? 'text-white' : 'hover:text-white'
          }`}
          title="Audio Inspector"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`p-1 rounded transition-colors ${
            activeTab === 'info' ? 'text-white' : 'hover:text-white'
          }`}
          title="Info Inspector"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Header matching Image 1: 4-1 | 00:02:44;14 */}
      <div className="h-7 px-3 flex items-center justify-between border-b border-[#282828] text-[11px]">
        <span className="font-semibold text-white">4-1</span>
        <span className="font-mono text-[#777]">00:02:44;14</span>
      </div>

      {/* Main Inspector Scrollable Body matching Image 1 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-[#ccc] text-[11px]">
        {/* Group 1: Effects Header */}
        <div className="space-y-2">
          <label className="flex items-center space-x-1.5 font-semibold text-white cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-[#007aff] rounded-sm" />
            <span>Effects</span>
          </label>

          {/* Sub-group: Shape Mask */}
          <div className="space-y-2 pl-1.5">
            <div className="flex items-center justify-between font-semibold text-[#dedede]">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#007aff] rounded-sm" />
                <span>Shape Mask</span>
              </label>
              <button className="p-0.5 text-[#777] hover:text-white">
                <Minus className="w-3 h-3" />
              </button>
            </div>

            {/* Radius */}
            <div className="flex items-center justify-between text-[#aaa] pl-3">
              <span className="flex items-center space-x-1">
                <span className="text-[9px] text-[#666]">•</span>
                <span>Radius</span>
              </span>
              <div className="w-16 bg-[#121212] border border-[#333] rounded px-1.5 py-0.5 text-right font-mono text-white text-[10px]">
                {radius}
              </div>
            </div>

            {/* Curvature */}
            <div className="flex items-center justify-between text-[#aaa] pl-3 space-x-2">
              <span className="shrink-0">Curvature</span>
              <input
                type="range"
                min="0"
                max="100"
                value={curvature}
                onChange={(e) => setCurvature(Number(e.target.value))}
                className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
              />
              <div className="w-14 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                {curvature.toFixed(1)} %
              </div>
            </div>

            {/* Fill Opacity */}
            <div className="flex items-center justify-between text-[#aaa] pl-3 space-x-2">
              <span className="shrink-0">Fill Opacity</span>
              <input
                type="range"
                min="0"
                max="100"
                value={fillOpacity}
                onChange={(e) => setFillOpacity(Number(e.target.value))}
                className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
              />
              <div className="w-14 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                {fillOpacity.toFixed(1)} %
              </div>
            </div>

            {/* Invert Mask */}
            <div className="flex items-center justify-between text-[#aaa] pl-3">
              <span>Invert Mask</span>
              <input type="checkbox" className="accent-[#007aff] rounded-sm" />
            </div>

            {/* View */}
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
                value={feather}
                onChange={(e) => setFeather(Number(e.target.value))}
                className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
              />
              <div className="w-10 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                {feather}
              </div>
            </div>

            {/* Falloff */}
            <div className="flex items-center justify-between text-[#aaa] pl-3 space-x-2">
              <span className="shrink-0">Falloff</span>
              <input
                type="range"
                min="0"
                max="100"
                value={falloff}
                onChange={(e) => setFalloff(Number(e.target.value))}
                className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
              />
              <div className="w-10 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
                {falloff}
              </div>
            </div>

            {/* Fixed Feather */}
            <div className="flex items-center justify-between text-[#aaa] pl-3">
              <span>Fixed Feather</span>
              <input type="checkbox" className="accent-[#007aff] rounded-sm" />
            </div>

            {/* Transforms */}
            <div className="flex items-center justify-between text-[#aaa] pl-3">
              <span className="flex items-center space-x-1">
                <span className="text-[9px] text-[#666]">•</span>
                <span>Transforms</span>
              </span>
            </div>

            {/* Control Points */}
            <div className="flex items-center justify-between text-[#aaa] pl-3">
              <span>Control Points</span>
              <button className="bg-[#2a2a2a] hover:bg-[#333] border border-[#3e3e3e] rounded px-2 py-0.5 text-[10px] text-white">
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
            <div className="flex items-center space-x-1 bg-[#121212] border border-[#333] rounded px-2 py-0.5 text-[10px] text-[#ccc]">
              <span>Normal</span>
              <ChevronDown className="w-2.5 h-2.5 text-[#666]" />
            </div>
          </div>

          {/* Opacity */}
          <div className="flex items-center justify-between text-[#aaa] space-x-2">
            <span className="shrink-0">Opacity</span>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => {
                setOpacity(Number(e.target.value));
                onUpdateSettings({ contrast: Number(e.target.value) });
              }}
              className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
            />
            <div className="w-14 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
              {opacity.toFixed(1)} %
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
                type="text"
                value={posX}
                onChange={(e) => setPosX(Number(e.target.value))}
                className="w-12 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] outline-none"
              />
              <span className="text-[10px] text-[#777]">Y</span>
              <input
                type="text"
                value={posY}
                onChange={(e) => setPosY(Number(e.target.value))}
                className="w-12 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] outline-none"
              />
            </div>
          </div>

          {/* Rotation */}
          <div className="flex items-center justify-between text-[#aaa] space-x-2">
            <span className="shrink-0">Rotation</span>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
            />
            <div className="w-12 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
              {rotation} °
            </div>
          </div>

          {/* Scale (All) */}
          <div className="flex items-center justify-between text-[#aaa] space-x-2">
            <span className="shrink-0">Scale (All)</span>
            <input
              type="range"
              min="10"
              max="150"
              value={scaleAll}
              onChange={(e) => {
                const val = Number(e.target.value);
                setScaleAll(val);
                onUpdateSettings({ scale: val });
              }}
              className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
            />
            <div className="w-14 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
              {scaleAll.toFixed(2)} %
            </div>
          </div>

          {/* Scale X */}
          <div className="flex items-center justify-between text-[#aaa] space-x-2">
            <span className="shrink-0">Scale X</span>
            <input
              type="range"
              min="10"
              max="150"
              value={scaleAll}
              onChange={(e) => setScaleAll(Number(e.target.value))}
              className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
            />
            <div className="w-14 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
              {scaleAll.toFixed(2)} %
            </div>
          </div>

          {/* Scale Y */}
          <div className="flex items-center justify-between text-[#aaa] space-x-2">
            <span className="shrink-0">Scale Y</span>
            <input
              type="range"
              min="10"
              max="150"
              value={scaleAll}
              onChange={(e) => setScaleAll(Number(e.target.value))}
              className="flex-1 h-1 accent-[#007aff] bg-[#333] rounded cursor-pointer"
            />
            <div className="w-14 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px] shrink-0">
              {scaleAll.toFixed(2)} %
            </div>
          </div>

          {/* Anchor */}
          <div className="flex items-center justify-between text-[#aaa]">
            <span>Anchor</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-[#777]">X</span>
              <div className="w-8 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px]">
                0
              </div>
              <span className="text-[10px] text-[#777]">Y</span>
              <div className="w-8 bg-[#121212] border border-[#333] rounded px-1 py-0.5 text-right font-mono text-white text-[10px]">
                0
              </div>
            </div>
          </div>
        </div>

        {/* Group 4: Checkboxes matching bottom of Image 1 */}
        <div className="space-y-2 pt-2 border-t border-[#2a2a2a]">
          <label className="flex items-center space-x-1.5 font-semibold text-white cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-[#007aff] rounded-sm" />
            <span>Crop</span>
          </label>

          <label className="flex items-center space-x-1.5 font-semibold text-white cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-[#007aff] rounded-sm" />
            <span>Distort</span>
          </label>

          <label className="flex items-center space-x-1.5 font-medium text-[#aaa] cursor-pointer">
            <input type="checkbox" className="accent-[#007aff] rounded-sm" />
            <span>Stabilization</span>
          </label>

          <label className="flex items-center space-x-1.5 font-medium text-[#aaa] cursor-pointer">
            <input type="checkbox" className="accent-[#007aff] rounded-sm" />
            <span>Rolling Shutter</span>
          </label>
        </div>
      </div>
    </div>
  );
};
