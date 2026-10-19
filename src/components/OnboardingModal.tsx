import React, { useState } from 'react';
import { FlowerMoodType } from '../types/garden';
import { FLOWER_PRESETS } from '../data/flowerPresets';
import { soundEngine } from '../services/soundService';
import { Sparkles, Brain, Check, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  onComplete: (data: {
    userName: string;
    goals: string[];
    distractions: string[];
    starterFlower: FlowerMoodType;
  }) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['ทำการบ้านวิชาเลข', 'อ่านหนังสือสอบ']);
  const [selectedDistractions, setSelectedDistractions] = useState<string[]>([
    'คลิปสั้น TikTok / Reels',
    'แจ้งเตือนข้อความแชท',
  ]);
  const [starterFlower, setStarterFlower] = useState<FlowerMoodType>('sunflower');

  const goalOptions = [
    'ทำการบ้านวิชาเลข / วิทย์',
    'อ่านหนังสือสอบ / ทบทวน',
    'จัดกระเป๋าและโต๊ะเรียน',
    'วาดรูป / งานสร้างสรรค์',
    'ฝึกสมาธิและอยู่กับตัวเอง',
  ];

  const distractionOptions = [
    'คลิปสั้น TikTok / Reels',
    'แจ้งเตือนข้อความแชท / โซเชียล',
    'เปิดเล่นเกมเพลินจนลืมเวลา',
    'ใจลอย ฟุ้งซ่าน คิดเรื่องอื่น',
    'รู้สึกเหนื่อยล้า ไม่อยากเริ่มงาน',
  ];

  const toggleGoal = (g: string) => {
    soundEngine.playStepCompleteChime();
    setSelectedGoals((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
    );
  };

  const toggleDistraction = (d: string) => {
    soundEngine.playStepCompleteChime();
    setSelectedDistractions((prev) =>
      prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
    );
  };

  const handleFinish = () => {
    soundEngine.playBloomChime();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
    onComplete({
      userName: userName.trim() || 'เพื่อนรักนักปลูกดอกไม้',
      goals: selectedGoals,
      distractions: selectedDistractions,
      starterFlower,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-float">🧚‍♀️</span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                ขั้นตอนที่ {step} จาก 3
              </span>
              <h2 className="text-xl font-bold font-display text-stone-900 mt-0.5">
                {step === 1 && 'เริ่มต้นด้วยสวนของตัวเอง 🌱'}
                {step === 2 && 'กิจกรรมและสิ่งรบกวนสมาธิ 🎯'}
                {step === 3 && 'เลือกเมล็ดพันธุ์ดอกไม้ต้นแรก 🌼'}
              </h2>
            </div>
          </div>
        </div>

        {/* STEP 1: Introduction & Name */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-xs sm:text-sm text-emerald-950 leading-relaxed">
              <p className="font-semibold text-emerald-800 mb-1">
                ยินดีต้อนรับสู่ Mood Garden AI สวนดอกไม้อัจฉริยะ!
              </p>
              <p>
                ที่นี่คือพื้นที่ส่วนตัวที่ออกแบบเพื่อช่วยคุณฝึกสมาธิอย่างอ่อนโยน ไร้การกดดัน ทุกครั้งที่คุณเริ่มและทำภารกิจ ดอกไม้ในสวนจะค่อยๆ ผลิบานไปพร้อมกับคุณ 🌸
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                บลูมมี่ควรเรียกคุณว่าอะไรดี? (ชื่อหรือชื่อเล่น)
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="พิมพ์ชื่อหรือฉายาของคุณ เช่น มีน, กานต์..."
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              />
            </div>

            <button
              onClick={() => {
                soundEngine.playStepCompleteChime();
                setStep(2);
              }}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-3 rounded-2xl font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ถัดไป</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Goals & Distractions */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <p className="text-xs font-bold text-stone-800 mb-2">
                1. กิจกรรมที่คุณอยากฝึกฝนให้มีสมาธิดีขึ้น:
              </p>
              <div className="space-y-1.5">
                {goalOptions.map((goal) => {
                  const isChecked = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-2xs'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span>{goal}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-bold text-stone-800 mb-2">
                2. พฤติกรรมที่มักดึงความสนใจของคุณออกไป:
              </p>
              <div className="space-y-1.5">
                {distractionOptions.map((dis) => {
                  const isChecked = selectedDistractions.includes(dis);
                  return (
                    <button
                      key={dis}
                      type="button"
                      onClick={() => toggleDistraction(dis)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-2xs'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span>{dis}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 py-3 rounded-2xl font-semibold text-xs transition-colors cursor-pointer"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={() => {
                  soundEngine.playStepCompleteChime();
                  setStep(3);
                }}
                className="w-2/3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-3 rounded-2xl font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ถัดไป</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Initial Mood Flower */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-stone-600">
              เลือกดอกไม้ที่ตรงกับความรู้สึกในวันนี้ เพื่อปลูกในแปลงแรกของคุณ:
            </p>

            <div className="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1">
              {Object.values(FLOWER_PRESETS).slice(0, 4).map((p) => {
                const isSelected = starterFlower === p.type;
                return (
                  <button
                    key={p.type}
                    type="button"
                    onClick={() => {
                      setStarterFlower(p.type);
                      soundEngine.playStepCompleteChime();
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-400/40'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-3xl mb-1 block">{p.emoji}</span>
                    <p className="text-xs font-bold text-stone-900">{p.thaiName}</p>
                    <p className="text-[10px] text-emerald-700 font-medium">{p.moodDescription}</p>
                  </button>
                );
              })}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                คุณจะได้รับชุดเมล็ดพันธุ์เริ่มต้น + 50 แต้มแสงแดด ☀️ และ 30 หยดน้ำ 💧
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 py-3 rounded-2xl font-semibold text-xs transition-colors cursor-pointer"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white py-3 rounded-2xl font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>เปิดประตูสู่สวนของฉัน 🌸</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
