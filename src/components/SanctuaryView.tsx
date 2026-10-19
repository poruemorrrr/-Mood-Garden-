import React, { useState, useEffect } from 'react';
import { soundEngine } from '../services/soundService';
import {
  Wind,
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle,
  Smile,
  Leaf
} from 'lucide-react';

export const SanctuaryView: React.FC = () => {
  // Breathing state
  const [breathingPattern, setBreathingPattern] = useState<'4-7-8' | 'box' | 'gentle'>('4-7-8');
  const [breathPhase, setBreathPhase] = useState<'หายใจเข้า (Inhale)' | 'กลั้นหายใจ (Hold)' | 'หายใจออก (Exhale)' | 'พักนิ่ง (Rest)' | 'พร้อมเริ่มต้น'>('พร้อมเริ่มต้น');
  const [breathCounter, setBreathCounter] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathCycleCount, setBreathCycleCount] = useState(0);

  // Soundscape mixer
  const [activeSound, setActiveSound] = useState<'gentle_rain' | 'forest_birds' | 'zen_stream' | 'summer_breeze' | 'none'>('zen_stream');
  const [soundVolume, setSoundVolume] = useState(0.5);

  // Sensory Grounding 5-4-3-2-1 Game
  const [groundingStep, setGroundingStep] = useState(1);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    soundEngine.setVolume(soundVolume);
    soundEngine.startAmbient(activeSound);
    return () => {
      soundEngine.stopAmbient();
    };
  }, [activeSound, soundVolume]);

  // Breathing loop
  useEffect(() => {
    let timer: any = null;
    if (isBreathingActive) {
      if (breathingPattern === '4-7-8') {
        // Inhale 4, Hold 7, Exhale 8
        const runCycle = async () => {
          setBreathPhase('หายใจเข้า (Inhale)');
          for (let i = 4; i >= 1; i--) {
            setBreathCounter(i);
            await new Promise((r) => setTimeout(r, 1000));
          }
          setBreathPhase('กลั้นหายใจ (Hold)');
          for (let i = 7; i >= 1; i--) {
            setBreathCounter(i);
            await new Promise((r) => setTimeout(r, 1000));
          }
          setBreathPhase('หายใจออก (Exhale)');
          for (let i = 8; i >= 1; i--) {
            setBreathCounter(i);
            await new Promise((r) => setTimeout(r, 1000));
          }
          setBreathCycleCount((c) => c + 1);
        };
        runCycle();
        timer = setInterval(runCycle, 19000);
      } else if (breathingPattern === 'box') {
        // Box 4-4-4-4
        const runCycle = async () => {
          setBreathPhase('หายใจเข้า (Inhale)');
          for (let i = 4; i >= 1; i--) {
            setBreathCounter(i);
            await new Promise((r) => setTimeout(r, 1000));
          }
          setBreathPhase('กลั้นหายใจ (Hold)');
          for (let i = 4; i >= 1; i--) {
            setBreathCounter(i);
            await new Promise((r) => setTimeout(r, 1000));
          }
          setBreathPhase('หายใจออก (Exhale)');
          for (let i = 4; i >= 1; i--) {
            setBreathCounter(i);
            await new Promise((r) => setTimeout(r, 1000));
          }
          setBreathPhase('พักนิ่ง (Rest)');
          for (let i = 4; i >= 1; i--) {
            setBreathCounter(i);
            await new Promise((r) => setTimeout(r, 1000));
          }
          setBreathCycleCount((c) => c + 1);
        };
        runCycle();
        timer = setInterval(runCycle, 16000);
      } else {
        // Gentle 3-3
        const runCycle = async () => {
          setBreathPhase('หายใจเข้า (Inhale)');
          for (let i = 3; i >= 1; i--) {
            setBreathCounter(i);
            await new Promise((r) => setTimeout(r, 1000));
          }
          setBreathPhase('หายใจออก (Exhale)');
          for (let i = 3; i >= 1; i--) {
            setBreathCounter(i);
            await new Promise((r) => setTimeout(r, 1000));
          }
          setBreathCycleCount((c) => c + 1);
        };
        runCycle();
        timer = setInterval(runCycle, 6000);
      }
    } else {
      setBreathPhase('พร้อมเริ่มต้น');
      setBreathCounter(4);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBreathingActive, breathingPattern]);

  const groundingQuestions = [
    { step: 1, title: '5 สิ่งที่คุณมองเห็นรอบตัว 👀', desc: 'มองดูรอบห้อง สังเกตสี แสง หรือสิ่งของ 5 ชิ้น' },
    { step: 2, title: '4 สิ่งที่คุณสัมผัสได้ 🖐️', desc: 'เช่น สัมผัสของเก้าอี้ เท้าที่แตะพื้น เสื้อผ้า หรือโต๊ะ' },
    { step: 3, title: '3 เสียงที่คุณได้ยิน 👂', desc: 'เสียงแอร์ เสียงลม เสียงนก หรือเสียงในบ้าน' },
    { step: 4, title: '2 กลิ่นที่คุณสัมผัสได้ 👃', desc: 'กลิ่นกระดาษ กลิ่นอากาศ หรือกลิ่นสบู่' },
    { step: 5, title: '1 สิ่งดีๆ ที่คุณภูมิใจในตัวเองวันนี้ 💖', desc: 'เช่น ความพยายามที่ได้เริ่ม หรือการอนุญาตให้ตัวเองได้พัก' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-3">
            <span>🦋 โหมดสวนพักใจ (Mindful Sanctuary)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display">
            พื้นที่ปลอดภัยไร้แรงกดดัน พักใจให้สดชื่น
          </h2>
          <p className="text-purple-100 text-xs sm:text-sm mt-2 leading-relaxed">
            ที่นี่ไม่มีงานที่ต้องทำให้เสร็จ และดอกไม้ในสวนจะไม่มีวันเฉาเพื่อลงโทษคุณ การพักผ่อนอย่างมีคุณภาพจะช่วยหยั่งรากลึกให้จิตใจกลับมามีพลังอีกครั้ง 🌱
          </p>
        </div>

        {/* Ambient Butterfly Graphic */}
        <div className="absolute right-4 bottom-2 text-7xl sm:text-9xl opacity-30 select-none animate-float pointer-events-none">
          🦋
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Butterfly Breathing Exercise */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🦋</span>
                <div>
                  <h3 className="font-bold text-stone-900 text-base font-display">
                    ผีเสื้อฝึกหายใจ (Butterfly Breathing)
                  </h3>
                  <p className="text-xs text-stone-500">
                    ปรับคลื่นสมองให้สงบ ผ่อนคลายความวิตกกังวล
                  </p>
                </div>
              </div>

              {/* Mode picker */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-medium">
                <button
                  onClick={() => {
                    setBreathingPattern('4-7-8');
                    setIsBreathingActive(false);
                  }}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    breathingPattern === '4-7-8' ? 'bg-purple-600 text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  4-7-8 คลายเครียด
                </button>
                <button
                  onClick={() => {
                    setBreathingPattern('box');
                    setIsBreathingActive(false);
                  }}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    breathingPattern === 'box' ? 'bg-purple-600 text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Box กล่องสี่เหลี่ยม
                </button>
                <button
                  onClick={() => {
                    setBreathingPattern('gentle');
                    setIsBreathingActive(false);
                  }}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    breathingPattern === 'gentle' ? 'bg-purple-600 text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  อ่อนโยน 3-3
                </button>
              </div>
            </div>

            {/* Interactive Butterfly Visual */}
            <div className="my-8 flex flex-col items-center justify-center">
              <div
                className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ${
                  breathPhase.includes('หายใจเข้า')
                    ? 'scale-115 bg-gradient-to-tr from-purple-200 via-pink-100 to-sky-100 shadow-xl shadow-purple-200'
                    : breathPhase.includes('กลั้น')
                    ? 'scale-110 bg-gradient-to-tr from-amber-100 via-pink-100 to-purple-100 shadow-lg'
                    : 'scale-90 bg-stone-100 text-stone-600 shadow-inner'
                }`}
              >
                {/* Flapping Butterfly Wings */}
                <span
                  className={`text-6xl sm:text-7xl select-none transition-transform duration-1000 ${
                    isBreathingActive ? 'animate-flutter' : ''
                  }`}
                >
                  🦋
                </span>

                <div className="mt-2 text-center">
                  <p className="text-xs font-bold text-purple-900 tracking-wide">
                    {breathPhase}
                  </p>
                  <p className="text-3xl font-mono font-bold text-purple-950 mt-0.5">
                    {isBreathingActive ? breathCounter : '—'}
                  </p>
                </div>
              </div>

              {breathCycleCount > 0 && (
                <p className="text-xs text-stone-500 mt-4">
                  ✨ สำเร็จไปแล้ว {breathCycleCount} รอบแห่งความสงบ
                </p>
              )}
            </div>
          </div>

          {/* Breathing Action Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundEngine.playStepCompleteChime();
                setIsBreathingActive(!isBreathingActive);
              }}
              className={`w-full py-3 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isBreathingActive
                  ? 'bg-stone-800 hover:bg-stone-900 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 active:scale-98 text-white shadow-purple-200'
              }`}
            >
              {isBreathingActive ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>หยุดพักการฝึก</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>เริ่มฝึกหายใจคลายใจ</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sensory Grounding & Soundscape Mixer */}
        <div className="space-y-6">
          {/* Nature Sound Mixer */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-stone-900 text-base font-display">
                  เสียงบรรยากาศธรรมชาติบำบัด
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                Web Audio ไร้รอยต่อ
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {(
                [
                  { key: 'zen_stream', label: '🌊 สายน้ำลำธารใส', desc: 'เสียงน้ำไหลเอื่อยๆ' },
                  { key: 'forest_birds', label: '🐦 นกร้องในป่าเขียว', desc: 'ธรรมชาติสดชื่น' },
                  { key: 'gentle_rain', label: '🌧️ ฝนโปรยปรายแผ่วเบา', desc: 'ปลอบประโลมจิตใจ' },
                  { key: 'summer_breeze', label: '🍃 ลมพัดใบไม้ไหว', desc: 'ผ่อนคลายกล้ามเนื้อ' },
                ] as const
              ).map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActiveSound(s.key)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeSound === s.key
                      ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <p className="text-xs font-bold">{s.label}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl">
              <Volume2 className="w-4 h-4 text-stone-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundVolume}
                onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-xs font-semibold text-stone-600 w-10 text-right">
                {Math.round(soundVolume * 100)}%
              </span>
            </div>
          </div>

          {/* 5-4-3-2-1 Sensory Grounding Game */}
          <div className="bg-gradient-to-br from-amber-50/60 to-emerald-50/60 rounded-3xl p-6 shadow-md border border-amber-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌿</span>
                <div>
                  <h3 className="font-bold text-stone-900 text-base font-display">
                    แบบฝึกดึงสติ 5-4-3-2-1 (Grounding)
                  </h3>
                  <p className="text-xs text-stone-600">
                    เหมาะมากเมื่อเริ่มรู้สึกตื้อ ฟุ้งซ่าน หรือกระวนกระวาย
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              {groundingQuestions.map((q) => {
                const isDone = !!checkedItems[q.step];
                return (
                  <div
                    key={q.step}
                    onClick={() => {
                      soundEngine.playStepCompleteChime();
                      setCheckedItems((prev) => ({ ...prev, [q.step]: !prev[q.step] }));
                    }}
                    className={`flex items-start gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900'
                        : 'bg-white border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 text-xs transition-colors ${
                        isDone ? 'bg-emerald-600 text-white' : 'border border-stone-300'
                      }`}
                    >
                      {isDone ? '✓' : q.step}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isDone ? 'line-through text-stone-500' : 'text-stone-800'}`}>
                        {q.title}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">{q.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
