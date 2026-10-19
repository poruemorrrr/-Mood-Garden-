import React, { useState, useEffect, useRef } from 'react';
import { MicroStep, ParentTask, FlowerMoodType } from '../types/garden';
import { FLOWER_PRESETS } from '../data/flowerPresets';
import { soundEngine } from '../services/soundService';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Shield,
  Heart,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Coffee,
  X,
  Plus
} from 'lucide-react';

interface FocusGuardianModalProps {
  task: ParentTask;
  step: MicroStep;
  flowerType: FlowerMoodType;
  onClose: () => void;
  onStepComplete: (taskId: string, stepId: string) => void;
  onAdaptStep: (taskId: string, stepId: string) => void;
}

export const FocusGuardianModal: React.FC<FocusGuardianModalProps> = ({
  task,
  step,
  flowerType,
  onClose,
  onStepComplete,
  onAdaptStep,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(step.minutes * 60);
  const [secondsLeft, setSecondsLeft] = useState(step.minutes * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [ambientSound, setAmbientSound] = useState<'gentle_rain' | 'forest_birds' | 'zen_stream' | 'none'>('forest_birds');
  const [soundMuted, setSoundMuted] = useState(false);
  const [bloomieNote, setBloomieNote] = useState<string>(
    'บลูมมี่นั่งอ่านหนังสืออยู่ข้างๆ นะ ค่อยๆ ไปด้วยกันทีละก้าว 🌱'
  );
  const [distractionShieldActive, setDistractionShieldActive] = useState(true);
  const [isDone, setIsDone] = useState(false);

  const preset = FLOWER_PRESETS[flowerType] || FLOWER_PRESETS.sunflower;

  // Sound effect on open
  useEffect(() => {
    if (!soundMuted && ambientSound !== 'none') {
      soundEngine.startAmbient(ambientSound);
    }
    return () => {
      soundEngine.stopAmbient();
    };
  }, [ambientSound, soundMuted]);

  // Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          const next = prev - 1;
          // Mid-way companion encouragement
          if (next === Math.floor(totalSeconds / 2)) {
            setBloomieNote('เก่งมากนะ! ผ่านไปครึ่งทางแล้ว ดอกไม้กำลังเริ่มผลิใบอ่อน 🌿');
          } else if (next === 60) {
            setBloomieNote('อีกแค่ 1 นาทีสุดท้าย สูดลมหายใจสบายๆ ดอกไม้ใกล้บานแล้ว! ✨');
          }
          return next;
        });
      }, 1000);
    } else if (secondsLeft === 0 && !isDone) {
      setIsDone(true);
      setIsRunning(false);
      soundEngine.stopAmbient();
      soundEngine.playBloomChime();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, totalSeconds, isDone]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100));

  const handleFinishEarly = () => {
    setIsDone(true);
    setIsRunning(false);
    soundEngine.stopAmbient();
    soundEngine.playBloomChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleClaimReward = () => {
    onStepComplete(task.id, step.id);
    onClose();
  };

  const addExtraMinutes = (mins: number) => {
    setSecondsLeft((prev) => prev + mins * 60);
    setTotalSeconds((prev) => prev + mins * 60);
    setBloomieNote(`บลูมมี่เพิ่มเวลาให้อีก ${mins} นาที ไม่ต้องรีบเลยนะ ค่อยๆ ทำ 🌸`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30">
        {/* Close / Minimize */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Distraction Shield Banner */}
        <div className="flex items-center justify-between bg-emerald-900/60 border border-emerald-500/40 px-3.5 py-2 rounded-2xl mb-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-200">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong className="text-white">Focus Guardian: </strong>
              ล็อกสมาธิ ป้องกันสิ่งเร้า (TikTok & Games)
            </span>
          </div>
          <span className="text-[11px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">
            กำลังทำงาน
          </span>
        </div>

        {/* Task Title & Micro-step */}
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">
            {task.title}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            {step.title}
          </h2>
          {step.tip && (
            <p className="text-xs text-stone-300 mt-1.5 italic">
              💡 {step.tip}
            </p>
          )}
        </div>

        {/* Circular / Flower Visual Timer */}
        <div className="relative flex flex-col items-center justify-center my-4">
          {/* Pulsing Aura */}
          <div
            className="w-52 h-52 sm:w-60 sm:h-60 rounded-full flex flex-col items-center justify-center relative p-3 border-4 transition-all duration-700"
            style={{
              borderColor: preset.color,
              boxShadow: `0 0 35px ${preset.color}40`,
              background: `radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.4) 100%)`,
            }}
          >
            {/* Animated Plant / Companion Avatar */}
            <div className="relative mb-2">
              <span className="text-5xl sm:text-6xl animate-sway select-none filter drop-shadow-md">
                {progressPercent < 30 ? '🌱' : progressPercent < 75 ? '🌿' : preset.emoji}
              </span>
              <span className="absolute -bottom-1 -right-3 text-2xl animate-float">
                🧚‍♀️
              </span>
            </div>

            {/* Countdown Display */}
            <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white">
              {formatTime(secondsLeft)}
            </div>

            {/* Progress label */}
            <div className="text-xs text-emerald-300 font-medium mt-1">
              ก้าวหน้า {Math.round(progressPercent)}%
            </div>
          </div>
        </div>

        {/* Bloomie Companion Note */}
        <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 px-4 my-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/40 flex items-center justify-center text-lg shrink-0">
            🌸
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium flex-1">
            {bloomieNote}
          </p>
        </div>

        {/* Controls */}
        {!isDone ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/50 transition-all cursor-pointer active:scale-95"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>หยุดชั่วคราว</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>ทำต่อ</span>
                  </>
                )}
              </button>

              <button
                onClick={handleFinishEarly}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>ทำเสร็จแล้ว</span>
              </button>

              <button
                onClick={() => addExtraMinutes(3)}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-stone-200 px-3 py-2.5 rounded-2xl text-xs transition-colors cursor-pointer"
                title="เพิ่มเวลา 3 นาที"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>3 นาที</span>
              </button>
            </div>

            {/* Ambient Sound Selector */}
            <div className="flex flex-wrap items-center justify-between text-xs text-stone-300 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>เสียงบรรยากาศผ่อนคลาย:</span>
              </div>
              <div className="flex items-center gap-1">
                {(
                  [
                    { key: 'forest_birds', label: '🐦 ป่าไม้' },
                    { key: 'gentle_rain', label: '🌧️ ฝนตก' },
                    { key: 'zen_stream', label: '🌊 ลำธาร' },
                    { key: 'none', label: '🔇 เงียบ' },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setAmbientSound(s.key)}
                    className={`px-2 py-1 rounded-xl text-xs transition-colors cursor-pointer ${
                      ambientSound === s.key ? 'bg-emerald-500 text-white font-semibold' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Neurodiversity Option: Stuck or Overwhelmed */}
            <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
              <div className="text-amber-200/90">
                <span className="font-semibold text-amber-300">รู้สึกติดขัด หรือเริ่มล้า? </span>
                AI จะช่วยปรับสเต็ปให้เล็กลงทันที โดยไม่มีการหักคะแนนใดๆ
              </div>
              <button
                onClick={() => {
                  soundEngine.playBloomChime();
                  onAdaptStep(task.id, step.id);
                  onClose();
                }}
                className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 px-3 py-1.5 rounded-xl font-bold shrink-0 cursor-pointer transition-all"
              >
                ปรับให้ง่ายขึ้น
              </button>
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="text-center py-4 space-y-4 animate-scaleUp">
            <div className="text-5xl animate-bounce">🎉</div>
            <h3 className="text-2xl font-bold font-display text-white">
              สุดยอดมาก! สเต็ปนี้สำเร็จแล้ว
            </h3>
            <p className="text-sm text-emerald-200 max-w-sm mx-auto">
              ดอกไม้ในสวนได้รับพลังงานและผลิบานขึ้นอีกขั้นแล้ว คุณได้รับรางวัลโดปามีนและแต้มพัฒนาสวน!
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-400 text-stone-900 font-bold px-4 py-2 rounded-2xl text-base shadow-lg">
              <Sparkles className="w-5 h-5 text-amber-800" />
              <span>+{step.rewardPoints} แต้มแสงแดด</span>
            </div>
            <div>
              <button
                onClick={handleClaimReward}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-bold text-base shadow-lg shadow-emerald-900/50 cursor-pointer active:scale-98 transition-all"
              >
                รับรางวัลและกลับสู่สวน 🌸
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
