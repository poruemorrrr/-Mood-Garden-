import React from 'react';
import { FlowerData, FlowerMoodType } from '../types/garden';
import { FLOWER_PRESETS } from '../data/flowerPresets';
import { Droplet, Sparkles, X, Heart, Clock, Award } from 'lucide-react';
import { soundEngine } from '../services/soundService';

interface FlowerDetailModalProps {
  flower: FlowerData;
  onClose: () => void;
  onWater: () => void;
}

export const FlowerDetailModal: React.FC<FlowerDetailModalProps> = ({
  flower,
  onClose,
  onWater,
}) => {
  const key = flower.name.toLowerCase();
  const preset = (FLOWER_PRESETS as Record<string, any>)[key] || FLOWER_PRESETS.sunflower;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{preset.emoji}</span>
            <div>
              <h3 className="font-bold text-stone-900 text-lg font-display">
                {flower.thaiName} ({preset.name})
              </h3>
              <p className="text-xs text-emerald-700 font-medium">
                {flower.moodDescription}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Visual Stage */}
        <div className="bg-gradient-to-b from-emerald-50/80 to-stone-50 rounded-2xl p-6 text-center my-3 border border-emerald-100 flex flex-col items-center">
          <div className="relative">
            <span className="text-6xl sm:text-7xl animate-sway block filter drop-shadow-md">
              {flower.stage === 'seed' && '🌱'}
              {flower.stage === 'sprout' && '🌿'}
              {flower.stage === 'bud' && (flower.symbol || preset.emoji)}
              {(flower.stage === 'bloom' || flower.stage === 'radiant') && (flower.symbol || preset.emoji)}
            </span>
            {flower.stage === 'radiant' && (
              <span className="absolute -top-1 -right-2 text-2xl animate-ping">✨</span>
            )}
          </div>

          <div className="mt-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white text-emerald-800 shadow-2xs border border-emerald-200">
              สถานะ: {flower.stage === 'seed' && '🌱 เมล็ดพันธุ์ในดิน'}
              {flower.stage === 'sprout' && '🌿 ต้นกล้าผลิใบ'}
              {flower.stage === 'bud' && '🌷 ดอกตูมเตรียมบาน'}
              {flower.stage === 'bloom' && '🌸 ผลิบานงดงาม'}
              {flower.stage === 'radiant' && '✨ เปล่งประกายละอองแสง'}
            </span>
          </div>

          <p className="text-xs text-stone-600 italic mt-3 max-w-xs">
            "{preset.affirmation}"
          </p>
        </div>

        {/* Growth Progress Bar */}
        <div className="space-y-1.5 my-4">
          <div className="flex justify-between text-xs font-semibold text-stone-700">
            <span>ความสมบูรณ์ของดอกไม้</span>
            <span className="text-emerald-700">{Math.round(flower.progressPercent)}%</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
              style={{ width: `${flower.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 mb-5">
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
            <span className="font-semibold text-stone-500 block">งานที่เชื่อมโยง:</span>
            <span className="font-medium text-stone-800 line-clamp-1">
              {flower.taskTitleLinked || 'ปลูกเพื่อฝึกสมาธิ'}
            </span>
          </div>
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
            <span className="font-semibold text-stone-500 block">จำนวนการรดน้ำ:</span>
            <span className="font-medium text-blue-600">
              💧 {flower.waterCount} ครั้ง
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              soundEngine.playWaterDrop();
              onWater();
            }}
            className="flex-1 bg-blue-500 hover:bg-blue-600 active:scale-98 text-white py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Droplet className="w-4 h-4" />
            <span>รดน้ำดอกไม้นี้ (+10%)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
