import React from 'react';
import { FlowerMoodType } from '../types/garden';
import { FLOWER_PRESETS } from '../data/flowerPresets';
import {
  Sprout,
  Sun,
  Droplet,
  Brain,
  Heart,
  Volume2,
  VolumeX,
  BarChart3,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'garden' | 'tasks' | 'sanctuary' | 'companion' | 'analytics';
  onSelectTab: (tab: 'garden' | 'tasks' | 'sanctuary' | 'companion' | 'analytics') => void;
  gardenLevel: number;
  sunlightPoints: number;
  dropletPoints: number;
  currentMoodType: FlowerMoodType;
  onOpenMoodPicker: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  gardenLevel,
  sunlightPoints,
  dropletPoints,
  currentMoodType,
  onOpenMoodPicker,
  isMuted,
  onToggleMute,
}) => {
  const currentPreset = FLOWER_PRESETS[currentMoodType] || FLOWER_PRESETS.sunflower;

  const navItems = [
    { id: 'garden', label: 'สวนของฉัน', icon: '🌱' },
    { id: 'tasks', label: 'AI Micro-Task', icon: '📝' },
    { id: 'sanctuary', label: 'สวนพักใจ', icon: '🦋' },
    { id: 'companion', label: 'เพื่อนคู่คิด', icon: '🧚‍♀️' },
    { id: 'analytics', label: 'รายงานวิเคราะห์', icon: '📊' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectTab('garden')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
              <span className="text-2xl animate-float">🌸</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg text-emerald-950 font-display">
                  Mood Garden AI
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                  Lv.{gardenLevel}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700/80 hidden sm:block">
                สวนดอกไม้อัจฉริยะเพื่อสมาธิและสุขภาวะทางอารมณ์
              </p>
            </div>
          </div>

          {/* Center Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200/80">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Metrics & Audio Control */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sunlight & Droplet Points */}
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-2xl text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1 text-amber-600" title="แต้มแสงแดด">
                <Sun className="w-3.5 h-3.5 fill-amber-400" />
                {sunlightPoints}
              </span>
              <span className="text-stone-300">|</span>
              <span className="flex items-center gap-1 text-blue-600" title="แต้มหยดน้ำ">
                <Droplet className="w-3.5 h-3.5 fill-blue-400" />
                {dropletPoints}
              </span>
            </div>

            {/* Current Mood Button */}
            <button
              onClick={onOpenMoodPicker}
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 px-2.5 sm:px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title="เปลี่ยนดอกไม้แทนอารมณ์"
            >
              <span className="text-base">{currentPreset.emoji}</span>
              <span className="hidden sm:inline line-clamp-1 max-w-[80px]">
                {currentPreset.thaiName}
              </span>
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={onToggleMute}
              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-colors cursor-pointer border ${
                isMuted
                  ? 'bg-stone-100 text-stone-400 border-stone-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
              title={isMuted ? 'เปิดเสียงบรรยากาศ' : 'ปิดเสียงบรรยากาศ'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Nav */}
        <nav className="flex md:hidden items-center justify-around py-2 border-t border-emerald-50 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive ? 'text-emerald-700 bg-emerald-50' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
