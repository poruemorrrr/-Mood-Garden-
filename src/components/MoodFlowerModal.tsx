import React, { useState } from 'react';
import { FlowerMoodType, MoodLog } from '../types/garden';
import { FLOWER_PRESETS } from '../data/flowerPresets';
import { soundEngine } from '../services/soundService';
import { Sparkles, Heart, Smile, Check, X, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MoodFlowerModalProps {
  currentMoodType: FlowerMoodType;
  onSelectMood: (moodType: FlowerMoodType, log: MoodLog) => void;
  onClose: () => void;
}

export const MoodFlowerModal: React.FC<MoodFlowerModalProps> = ({
  currentMoodType,
  onSelectMood,
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState<FlowerMoodType>(currentMoodType);
  const [stressLevel, setStressLevel] = useState<number>(2);
  const [focusRating, setFocusRating] = useState<number>(3);
  const [note, setNote] = useState<string>('');

  const currentPreset = FLOWER_PRESETS[selectedType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playBloomChime();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });

    const newLog: MoodLog = {
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
      flowerType: selectedType,
      emoji: currentPreset.emoji,
      energyLevel: 3,
      stressLevel,
      focusRating,
      note: note.trim() || undefined,
    };

    onSelectMood(selectedType, newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌼</span>
            <div>
              <h3 className="font-bold text-stone-900 text-lg font-display">
                เลือกดอกไม้แทนอารมณ์ (Mood Flower)
              </h3>
              <p className="text-xs text-stone-500">
                สะท้อนความรู้สึกของคุณในขณะนี้ เพื่อสร้างสวนที่สอดคล้องกับใจ
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

        {/* Disclaimer / Guidance note */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 mb-4 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            ดอกไม้เหล่านี้เป็นสัญลักษณ์ที่คุณเลือกเอง ไม่ใช่เครื่องมือวินิจฉัยอารมณ์ของ AI ทุกความรู้สึกสามารถมีพื้นที่งดงามในสวนนี้ได้เสมอ
          </p>
        </div>

        {/* Flower Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
          {Object.values(FLOWER_PRESETS).map((preset) => {
            const isSelected = selectedType === preset.type;
            return (
              <button
                key={preset.type}
                type="button"
                onClick={() => {
                  setSelectedType(preset.type);
                  soundEngine.playStepCompleteChime();
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-400/40'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl mb-1">{preset.emoji}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">{preset.thaiName}</p>
                  <p className="text-[10px] text-emerald-700 font-medium line-clamp-1 mt-0.5">
                    {preset.moodDescription.split('(')[0]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Flower Card / Affirmation */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{currentPreset.emoji}</span>
            <span className="font-bold text-xs text-stone-800">
              {currentPreset.thaiName} — {currentPreset.meaning}
            </span>
          </div>
          <p className="text-xs text-purple-700 italic bg-purple-50/80 p-2 rounded-xl mt-1.5">
            "{currentPreset.affirmation}"
          </p>
        </div>

        {/* Quick Self-Assessment sliders */}
        <div className="space-y-3 mb-5 text-xs">
          <div>
            <div className="flex justify-between font-semibold text-stone-700 mb-1">
              <span>ระดับความตึงเครียดในใจ:</span>
              <span className="text-emerald-700">
                {stressLevel === 1 && '😌 ผ่อนคลายมาก'}
                {stressLevel === 2 && '🙂 สบายๆ'}
                {stressLevel === 3 && '😐 ปานกลาง'}
                {stressLevel === 4 && '😰 เครียดเล็กน้อย'}
                {stressLevel === 5 && '😫 ตึงเครียดมาก'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold text-stone-700 mb-1">
              <span>ความรู้สึกพร้อมโฟกัส:</span>
              <span className="text-emerald-700">{focusRating} / 5 คะแนน</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={focusRating}
              onChange={(e) => setFocusRating(parseInt(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              โน้ตความรู้สึกสั้นๆ (ถ้ามี):
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น วันนี้ทำการบ้านเสร็จเร็ว หรือรู้สึกเหนื่อยนิดหน่อย..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-3 rounded-2xl font-bold text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer"
        >
          บันทึกอารมณ์และปลูกในสวน 🌸
        </button>
      </div>
    </div>
  );
};
