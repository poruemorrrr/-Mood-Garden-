import React, { useState, useEffect } from 'react';
import {
  GardenPlot,
  FlowerData,
  ParentTask,
  MicroStep,
  FlowerMoodType,
  MoodLog,
  GrowthStage,
} from './types/garden';
import { FLOWER_PRESETS } from './data/flowerPresets';
import { soundEngine } from './services/soundService';
import { Navbar } from './components/Navbar';
import { GardenCanvas } from './components/GardenCanvas';
import { MicroTaskManager } from './components/MicroTaskManager';
import { FocusGuardianModal } from './components/FocusGuardianModal';
import { SanctuaryView } from './components/SanctuaryView';
import { CompanionView } from './components/CompanionView';
import { AnalyticsView } from './components/AnalyticsView';
import { MoodFlowerModal } from './components/MoodFlowerModal';
import { FlowerDetailModal } from './components/FlowerDetailModal';
import { OnboardingModal } from './components/OnboardingModal';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'mood_garden_ai_state_v1';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'garden' | 'tasks' | 'sanctuary' | 'companion' | 'analytics'>('garden');

  // User Profile & Points
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [userName, setUserName] = useState('เพื่อนนกฮูก');
  const [gardenLevel, setGardenLevel] = useState(1);
  const [sunlightPoints, setSunlightPoints] = useState(120);
  const [dropletPoints, setDropletPoints] = useState(50);
  const [currentMoodType, setCurrentMoodType] = useState<FlowerMoodType>('sunflower');
  const [isMuted, setIsMuted] = useState(false);

  // Garden Plots (6 initial plots)
  const [plots, setPlots] = useState<GardenPlot[]>([
    {
      id: 1,
      unlocked: true,
      plotType: 'standard',
      requiredLevel: 1,
      flower: {
        id: 'fl-1',
        name: 'Sunflower',
        thaiName: 'ดอกทานตะวัน',
        symbol: '🌻',
        color: '#eab308',
        accentColor: '#ca8a04',
        moodDescription: 'รู้สึกมีพลัง (Energetic)',
        meaning: 'พร้อมมุ่งสู่เป้าหมายเหมือนทานตะวันหันหาแสงแดด',
        stage: 'bloom',
        progressPercent: 85,
        plantedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        lastTendedAt: new Date().toISOString(),
        taskTitleLinked: 'ทำการบ้านวิชาเลข 5 ข้อ',
        waterCount: 3,
      },
    },
    {
      id: 2,
      unlocked: true,
      plotType: 'standard',
      requiredLevel: 1,
      flower: {
        id: 'fl-2',
        name: 'Tulip',
        thaiName: 'ดอกทิวลิป',
        symbol: '🌷',
        color: '#ec4899',
        accentColor: '#db2777',
        moodDescription: 'รู้สึกสงบ (Calm & Peaceful)',
        meaning: 'สะท้อนความเรียบง่าย สมดุลในจิตใจ',
        stage: 'sprout',
        progressPercent: 40,
        plantedAt: new Date(Date.now() - 86400000).toISOString(),
        lastTendedAt: new Date().toISOString(),
        taskTitleLinked: 'อ่านหนังสือเตรียมสอบชีวะ',
        waterCount: 1,
      },
    },
    {
      id: 3,
      unlocked: true,
      plotType: 'standard',
      requiredLevel: 1,
    },
    {
      id: 4,
      unlocked: true,
      plotType: 'standard',
      requiredLevel: 1,
    },
    {
      id: 5,
      unlocked: true,
      plotType: 'zen_sanctuary',
      requiredLevel: 2,
    },
    {
      id: 6,
      unlocked: false,
      plotType: 'butterfly_grove',
      requiredLevel: 3,
    },
  ]);

  // Tasks with Micro-steps
  const [tasks, setTasks] = useState<ParentTask[]>([
    {
      id: 'task-initial-1',
      title: 'ทำการบ้านวิชาคณิตศาสตร์ 5 ข้อ',
      category: 'homework',
      currentStepIndex: 1,
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      flowerAssigned: 'sunflower',
      totalEstimatedMinutes: 25,
      totalPointsEarned: 50,
      microSteps: [
        {
          id: 'step-init-1',
          title: 'หยิบสมุดเลขและดินสอขึ้นมาเปิดหน้า 45',
          minutes: 3,
          tip: 'แค่วางอุปกรณ์พร้อมก็สำเร็จก้าวแรกแล้ว!',
          rewardPoints: 20,
          completed: true,
        },
        {
          id: 'step-init-2',
          title: 'อ่านโจทย์ข้อ 1 และเขียนสิ่งที่โจทย์กำหนด',
          minutes: 7,
          tip: 'คิดช้าๆ ทีละสเต็ป บลูมมี่คอยให้กำลังใจ',
          rewardPoints: 25,
          completed: false,
        },
        {
          id: 'step-init-3',
          title: 'ลงมือคำนวณข้อ 2-3 อย่างใจเย็น',
          minutes: 10,
          tip: 'ดอกไม้กำลังผลิบานอีกขั้น สู้ๆ นะ!',
          rewardPoints: 30,
          completed: false,
        },
      ],
    },
  ]);

  // Mood Logs
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([
    {
      id: 'log-1',
      timestamp: new Date().toISOString(),
      flowerType: 'sunflower',
      emoji: '🌻',
      energyLevel: 4,
      stressLevel: 2,
      focusRating: 4,
      note: 'เริ่มต้นวันใหม่ด้วยพลังบวก พร้อมทำการบ้าน',
    },
  ]);

  // Modals & Overlays
  const [activeFocusStep, setActiveFocusStep] = useState<{
    task: ParentTask;
    step: MicroStep;
  } | null>(null);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [inspectingFlower, setInspectingFlower] = useState<FlowerData | null>(null);

  // Load state from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.hasOnboarded) setHasOnboarded(true);
        if (parsed.userName) setUserName(parsed.userName);
        if (parsed.gardenLevel) setGardenLevel(parsed.gardenLevel);
        if (parsed.sunlightPoints !== undefined) setSunlightPoints(parsed.sunlightPoints);
        if (parsed.dropletPoints !== undefined) setDropletPoints(parsed.dropletPoints);
        if (parsed.currentMoodType) setCurrentMoodType(parsed.currentMoodType);
        if (parsed.plots) setPlots(parsed.plots);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.moodLogs) setMoodLogs(parsed.moodLogs);
      } else {
        // First time visitor, show onboarding
        setHasOnboarded(false);
      }
    } catch (e) {
      console.warn('LocalStorage load error', e);
    }
  }, []);

  // Save state to local storage on changes
  useEffect(() => {
    try {
      const stateToSave = {
        hasOnboarded,
        userName,
        gardenLevel,
        sunlightPoints,
        dropletPoints,
        currentMoodType,
        plots,
        tasks,
        moodLogs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      // ignore
    }
  }, [hasOnboarded, userName, gardenLevel, sunlightPoints, dropletPoints, currentMoodType, plots, tasks, moodLogs]);

  // Audio mute toggle
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      soundEngine.stopAmbient();
    }
  };

  // Onboarding Complete Handler
  const handleOnboardingComplete = (data: {
    userName: string;
    goals: string[];
    distractions: string[];
    starterFlower: FlowerMoodType;
  }) => {
    setUserName(data.userName);
    setCurrentMoodType(data.starterFlower);
    setHasOnboarded(true);

    const preset = FLOWER_PRESETS[data.starterFlower];
    // Plant starter flower in plot 3
    setPlots((prev) =>
      prev.map((plot) =>
        plot.id === 3
          ? {
              ...plot,
              flower: {
                id: `flower-start-${Date.now()}`,
                name: preset.name,
                thaiName: preset.thaiName,
                symbol: preset.emoji,
                color: preset.color,
                accentColor: preset.accentColor,
                moodDescription: preset.moodDescription,
                meaning: preset.meaning,
                stage: 'sprout',
                progressPercent: 35,
                plantedAt: new Date().toISOString(),
                lastTendedAt: new Date().toISOString(),
                taskTitleLinked: data.goals[0] || 'ฝึกสมาธิก้าวแรก',
                waterCount: 1,
              },
            }
          : plot
      )
    );
  };

  // Water flower handler
  const handleWaterFlower = (plotId: number) => {
    setPlots((prev) =>
      prev.map((plot) => {
        if (plot.id === plotId && plot.flower) {
          const currentProgress = plot.flower.progressPercent;
          const newProgress = Math.min(100, currentProgress + 12);

          let newStage: GrowthStage = plot.flower.stage;
          if (newProgress >= 100) newStage = 'radiant';
          else if (newProgress >= 70) newStage = 'bloom';
          else if (newProgress >= 40) newStage = 'bud';
          else if (newProgress >= 20) newStage = 'sprout';

          return {
            ...plot,
            flower: {
              ...plot.flower,
              progressPercent: newProgress,
              stage: newStage,
              waterCount: plot.flower.waterCount + 1,
              lastTendedAt: new Date().toISOString(),
            },
          };
        }
        return plot;
      })
    );
    setDropletPoints((prev) => Math.max(0, prev + 2));
    setSunlightPoints((prev) => prev + 5);
  };

  // Plant seed in plot
  const handlePlantSeed = (plotId: number, flowerType: FlowerMoodType) => {
    const preset = FLOWER_PRESETS[flowerType];
    setPlots((prev) =>
      prev.map((plot) => {
        if (plot.id === plotId) {
          return {
            ...plot,
            flower: {
              id: `flower-${Date.now()}`,
              name: preset.name,
              thaiName: preset.thaiName,
              symbol: preset.emoji,
              color: preset.color,
              accentColor: preset.accentColor,
              moodDescription: preset.moodDescription,
              meaning: preset.meaning,
              stage: 'seed',
              progressPercent: 10,
              plantedAt: new Date().toISOString(),
              lastTendedAt: new Date().toISOString(),
              waterCount: 0,
            },
          };
        }
        return plot;
      })
    );
  };

  // Complete micro-step handler
  const handleCompleteMicroStep = (taskId: string, stepId: string) => {
    let earnedPoints = 25;

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedSteps = task.microSteps.map((s) => {
            if (s.id === stepId) {
              earnedPoints = s.rewardPoints;
              return { ...s, completed: true };
            }
            return s;
          });
          return {
            ...task,
            microSteps: updatedSteps,
            totalPointsEarned: task.totalPointsEarned + earnedPoints,
          };
        }
        return task;
      })
    );

    // Increase points and grow the corresponding flower
    setSunlightPoints((prev) => {
      const nextPoints = prev + earnedPoints;
      // Level up check
      if (nextPoints >= 250 && gardenLevel === 1) {
        setGardenLevel(2);
        setPlots((p) =>
          p.map((item) => (item.id === 5 ? { ...item, unlocked: true } : item))
        );
        soundEngine.playBloomChime();
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
      } else if (nextPoints >= 500 && gardenLevel === 2) {
        setGardenLevel(3);
        setPlots((p) =>
          p.map((item) => (item.id === 6 ? { ...item, unlocked: true } : item))
        );
        soundEngine.playBloomChime();
        confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
      }
      return nextPoints;
    });

    // Advance first blooming flower
    setPlots((prev) => {
      let boosted = false;
      return prev.map((plot) => {
        if (!boosted && plot.flower && plot.flower.progressPercent < 100) {
          boosted = true;
          const nextProg = Math.min(100, plot.flower.progressPercent + 25);
          let newStage: GrowthStage = plot.flower.stage;
          if (nextProg >= 100) newStage = 'radiant';
          else if (nextProg >= 70) newStage = 'bloom';
          else if (nextProg >= 40) newStage = 'bud';
          else if (nextProg >= 20) newStage = 'sprout';

          return {
            ...plot,
            flower: {
              ...plot.flower,
              progressPercent: nextProg,
              stage: newStage,
            },
          };
        }
        return plot;
      });
    });
  };

  // Adapt step (Neurodiversity friendly: shrink without penalty)
  const handleAdaptStep = (taskId: string, stepId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const stepIndex = task.microSteps.findIndex((s) => s.id === stepId);
          if (stepIndex === -1) return task;

          const oldStep = task.microSteps[stepIndex];
          const smallerMinutes = Math.max(3, Math.floor(oldStep.minutes / 2));

          const part1: MicroStep = {
            id: `step-${Date.now()}-part1`,
            title: `${oldStep.title} (ส่วนที่ 1: ขั้นตอนสั้นพิเศษ)`,
            minutes: smallerMinutes,
            tip: 'ก้าวเล็กๆ นี้เริ่มต้นง่ายมากเลยนะ บลูมมี่อยู่ข้างๆ',
            rewardPoints: Math.floor(oldStep.rewardPoints * 0.6),
            completed: false,
          };

          const part2: MicroStep = {
            id: `step-${Date.now()}-part2`,
            title: `${oldStep.title} (ส่วนที่ 2: ทำต่ออีกนิดเดียว)`,
            minutes: smallerMinutes,
            tip: 'ทำต่อส่วนที่เหลือเบาๆ ไม่ต้องรีบ',
            rewardPoints: Math.floor(oldStep.rewardPoints * 0.6),
            completed: false,
          };

          const newSteps = [...task.microSteps];
          newSteps.splice(stepIndex, 1, part1, part2);

          return {
            ...task,
            microSteps: newSteps,
          };
        }
        return task;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f7faf5] text-stone-800 flex flex-col font-sans">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        gardenLevel={gardenLevel}
        sunlightPoints={sunlightPoints}
        dropletPoints={dropletPoints}
        currentMoodType={currentMoodType}
        onOpenMoodPicker={() => setIsMoodModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'garden' && (
          <div className="space-y-6">
            <GardenCanvas
              plots={plots}
              sunlightPoints={sunlightPoints}
              dropletPoints={dropletPoints}
              gardenLevel={gardenLevel}
              onWaterFlower={handleWaterFlower}
              onPlantSeed={handlePlantSeed}
              onSelectFlowerToView={setInspectingFlower}
              onOpenMoodPicker={() => setIsMoodModalOpen(true)}
            />

            {/* Quick Micro-Task preview inside garden */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📝</span>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    มีงานที่อยากให้ AI ช่วยย่อยสเต็ปไหม?
                  </h4>
                  <p className="text-xs text-stone-500">
                    เปลี่ยนงานใหญ่ที่ชวนท้อ ให้กลายเป็นภารกิจสั้น 5-10 นาที ที่ทำได้ทันที
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-200 transition-all cursor-pointer whitespace-nowrap"
              >
                เปิดระบบ AI Micro-Tasking ➔
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <MicroTaskManager
            tasks={tasks}
            onAddTask={(task) => setTasks((prev) => [task, ...prev])}
            onStartFocusStep={(task, step) =>
              setActiveFocusStep({ task, step })
            }
            onCompleteMicroStep={handleCompleteMicroStep}
          />
        )}

        {activeTab === 'sanctuary' && <SanctuaryView />}

        {activeTab === 'companion' && (
          <CompanionView
            currentMood={FLOWER_PRESETS[currentMoodType]?.moodDescription}
            gardenLevel={gardenLevel}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            tasks={tasks}
            moodLogs={moodLogs}
            gardenLevel={gardenLevel}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-emerald-100 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 justify-center">
            <span>🌱</span>
            <strong className="text-emerald-900">Mood Garden AI</strong> — สวนดอกไม้อัจฉริยะเพื่อสมาธิและสุขภาวะทางอารมณ์ในวัยรุ่น
          </p>
          <p className="text-stone-400">
            ระบบนิเวศการเติบโตเชิงบวก (Positive Reinforcement & Executive Function)
          </p>
        </div>
      </footer>

      {/* Onboarding Modal (Step 1) */}
      {!hasOnboarded && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {/* Mood Flower Selection Modal (Step 2) */}
      {isMoodModalOpen && (
        <MoodFlowerModal
          currentMoodType={currentMoodType}
          onSelectMood={(type, log) => {
            setCurrentMoodType(type);
            setMoodLogs((prev) => [log, ...prev]);
          }}
          onClose={() => setIsMoodModalOpen(false)}
        />
      )}

      {/* Focus Guardian Fullscreen Modal (Step 3) */}
      {activeFocusStep && (
        <FocusGuardianModal
          task={activeFocusStep.task}
          step={activeFocusStep.step}
          flowerType={activeFocusStep.task.flowerAssigned || currentMoodType}
          onClose={() => setActiveFocusStep(null)}
          onStepComplete={handleCompleteMicroStep}
          onAdaptStep={handleAdaptStep}
        />
      )}

      {/* Flower Detail Modal */}
      {inspectingFlower && (
        <FlowerDetailModal
          flower={inspectingFlower}
          onClose={() => setInspectingFlower(null)}
          onWater={() => {
            const plot = plots.find((p) => p.flower?.id === inspectingFlower.id);
            if (plot) {
              handleWaterFlower(plot.id);
              // Update inspecting flower modal state
              setInspectingFlower((prev) =>
                prev
                  ? {
                      ...prev,
                      progressPercent: Math.min(100, prev.progressPercent + 12),
                      waterCount: prev.waterCount + 1,
                    }
                  : null
              );
            }
          }}
        />
      )}
    </div>
  );
}
