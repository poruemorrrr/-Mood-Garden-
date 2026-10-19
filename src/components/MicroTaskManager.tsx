import React, { useState } from 'react';
import { ParentTask, MicroStep, FlowerMoodType } from '../types/garden';
import { FLOWER_PRESETS } from '../data/flowerPresets';
import { requestMicroTaskBreakdown } from '../services/apiClient';
import { soundEngine } from '../services/soundService';
import { Sparkles, Brain, CheckCircle2, Play, Plus, Clock, Award, ShieldAlert, RefreshCw, Feather } from 'lucide-react';

interface MicroTaskManagerProps {
  tasks: ParentTask[];
  onAddTask: (task: ParentTask) => void;
  onStartFocusStep: (task: ParentTask, step: MicroStep) => void;
  onCompleteMicroStep: (taskId: string, stepId: string) => void;
}

export const MicroTaskManager: React.FC<MicroTaskManagerProps> = ({
  tasks,
  onAddTask,
  onStartFocusStep,
  onCompleteMicroStep,
}) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<'homework' | 'reading' | 'chores' | 'creative' | 'other'>('homework');
  const [taskDetails, setTaskDetails] = useState('');
  const [selectedMoodFlower, setSelectedMoodFlower] = useState<FlowerMoodType>('sunflower');
  const [isStruggling, setIsStruggling] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  const presets = [
    { label: '📝 การบ้านเลข 5 ข้อ', title: 'ทำการบ้านวิชาคณิตศาสตร์ 5 ข้อ', category: 'homework' as const },
    { label: '🎒 จัดกระเป๋านักเรียน', title: 'จัดตารางเรียนและกระเป๋านักเรียนสำหรับพรุ่งนี้', category: 'chores' as const },
    { label: '📖 อ่านหนังสือเตรียมสอบ 1 บท', title: 'อ่านทบทวนวิชาวิทยาศาสตร์ บทที่ 3', category: 'reading' as const },
    { label: '🧹 จัดโต๊ะเขียนหนังสือ', title: 'เก็บเอกสารและจัดระเบียบโต๊ะหนังสือ', category: 'chores' as const },
  ];

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setIsLoadingAI(true);
    try {
      const result = await requestMicroTaskBreakdown(taskTitle, taskDetails, isStruggling);

      const generatedSteps: MicroStep[] = (result.microSteps || []).map((s: any, idx: number) => ({
        id: `step-${Date.now()}-${idx}`,
        title: s.title || `ขั้นตอนที่ ${idx + 1}`,
        minutes: s.minutes || (isStruggling ? 5 : 10),
        tip: s.tip,
        rewardPoints: s.rewardPoints || 25,
        completed: false,
      }));

      const newTask: ParentTask = {
        id: `task-${Date.now()}`,
        title: taskTitle.trim(),
        category: taskCategory,
        microSteps: generatedSteps,
        currentStepIndex: 0,
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        flowerAssigned: selectedMoodFlower,
        totalEstimatedMinutes: generatedSteps.reduce((acc, cur) => acc + cur.minutes, 0),
        totalPointsEarned: 0,
      };

      onAddTask(newTask);
      setAiTip(result.companionEncouragement || 'บลูมมี่แบ่งงานเป็นสเต็ปเล็กๆ ให้แล้วนะ สบายใจได้เลย!');
      soundEngine.playStepCompleteChime();

      setTaskTitle('');
      setTaskDetails('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-2">
              <Brain className="w-3.5 h-3.5" />
              <span>ระบบรับข้อมูลและแบ่งงาน (AI Micro-Tasking)</span>
            </div>
            <h2 className="text-2xl font-bold font-display">
              เปลี่ยนงานใหญ่ให้เป็นสเต็ปจิ๋ว สบายใจ ไม่ท้อแท้
            </h2>
            <p className="text-emerald-50 text-sm mt-1 max-w-xl">
              ออกแบบพิเศษสำหรับเยาวชนและผู้มีสภาวะสมาธิสั้น (ADHD) AI จะช่วยซอยงานให้เริ่มได้ทันที และแปลงเป็นพลังงานให้ดอกไม้ในสวนผลิบาน 🌸
            </p>
          </div>
          <div className="text-4xl sm:text-5xl bg-white/10 p-3 rounded-2xl border border-white/20">
            🌱
          </div>
        </div>
      </div>

      {/* Task Creation Form */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-stone-200">
        <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>บอกเป้าหมายที่คุณอยากทำให้สำเร็จ</span>
        </h3>

        {/* Quick Presets for ADHD / Teens */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-stone-500 self-center font-medium">ตัวอย่างยอดนิยม:</span>
          {presets.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setTaskTitle(preset.title);
                setTaskCategory(preset.category);
              }}
              className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 px-3 py-1.5 rounded-full transition-colors border border-stone-200 cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              ชื่องานหรือเป้าหมาย (เช่น "ทำการบ้านเลข 5 ข้อ", "อ่านหนังสือ 15 นาที")
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="พิมพ์เป้าหมายที่ต้องการ..."
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                หมวดหมู่กิจกรรม
              </label>
              <select
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="homework">📚 การบ้าน / งานโรงเรียน</option>
                <option value="reading">📖 อ่านหนังสือ / ทบทวน</option>
                <option value="chores">🧹 จัดกระเป๋า / กิจวัตรในบ้าน</option>
                <option value="creative">🎨 กิจกรรมสร้างสรรค์ / วาดรูป</option>
                <option value="other">🌱 อื่นๆ</option>
              </select>
            </div>

            {/* Mood Flower Association */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                เลือกดอกไม้แทนอารมณ์ที่จะร่วมเติบโตกับงานนี้
              </label>
              <select
                value={selectedMoodFlower}
                onChange={(e) => setSelectedMoodFlower(e.target.value as FlowerMoodType)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              >
                {Object.values(FLOWER_PRESETS).map((p) => (
                  <option key={p.type} value={p.type}>
                    {p.emoji} {p.thaiName} — {p.moodDescription}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Neurodiversity toggle: Struggling mode */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Feather className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-900">
                  โหมดก้าวเล็กพิเศษ (สำหรับวันที่สมาธิหลุดง่าย หรือรู้สึกเหนื่อยล้า)
                </p>
                <p className="text-[11px] text-amber-700">
                  AI จะย่อยงานให้เป็นสเต็ปจิ๋ว 3-5 นาที เริ่มง่ายมาก ไม่มีแรงกดดัน
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isStruggling}
                onChange={(e) => setIsStruggling(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoadingAI || !taskTitle.trim()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white py-3 rounded-2xl font-semibold text-sm shadow-md shadow-emerald-200 transition-all disabled:opacity-60 cursor-pointer"
          >
            {isLoadingAI ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI กำลังจัดสเต็ปย่อยและคำนวณจังหวะเวลา...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>ให้ AI ช่วยย่อยงาน (Generate Micro-Tasks)</span>
              </>
            )}
          </button>
        </form>

        {aiTip && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 animate-fadeIn">
            <span className="text-lg">🧚‍♀️</span>
            <div>
              <span className="font-bold text-emerald-800">บลูมมี่: </span>
              {aiTip}
            </div>
          </div>
        )}
      </div>

      {/* Task List and Decomposed Micro-Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
            <span>ภารกิจย่อยในสวนของคุณ ({tasks.length})</span>
          </h3>
          <span className="text-xs text-stone-500">
            แต่ละสเต็ปที่สำเร็จจะช่วยให้ดอกไม้ผลิบานทันที!
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-stone-50 rounded-3xl p-8 text-center border-2 border-dashed border-stone-200">
            <p className="text-3xl mb-2">🌻</p>
            <p className="text-stone-700 font-medium text-sm">ยังไม่มีภารกิจที่เพิ่มไว้</p>
            <p className="text-xs text-stone-500 mt-1">
              ลองเลือกตัวอย่างด้านบน หรือพิมพ์เป้าหมายใหญ่ให้ AI ช่วยย่อยเป็นสเต็ปเล็กๆ ได้เลยนะ!
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            const flowerPreset = task.flowerAssigned ? FLOWER_PRESETS[task.flowerAssigned] : FLOWER_PRESETS.sunflower;
            const completedCount = task.microSteps.filter((s) => s.completed).length;
            const progress = task.microSteps.length > 0 ? (completedCount / task.microSteps.length) * 100 : 0;

            return (
              <div
                key={task.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 hover:border-emerald-200 transition-all"
              >
                {/* Task Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{flowerPreset.emoji}</span>
                      <h4 className="font-bold text-stone-900 text-base">
                        {task.title}
                      </h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-100 font-medium">
                        {task.category === 'homework' && '📚 การบ้าน'}
                        {task.category === 'reading' && '📖 อ่านหนังสือ'}
                        {task.category === 'chores' && '🧹 กิจวัตร'}
                        {task.category === 'creative' && '🎨 สร้างสรรค์'}
                        {task.category === 'other' && '🌱 ทั่วไป'}
                      </span>
                      <span>รวม ~{task.totalEstimatedMinutes} นาที</span>
                      <span>• สำเร็จ {completedCount}/{task.microSteps.length} สเต็ป</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                      <Award className="w-3.5 h-3.5" />
                      +{task.microSteps.reduce((acc, c) => acc + (c.completed ? c.rewardPoints : 0), 0)} แต้ม
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-100 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Micro-steps List */}
                <div className="space-y-2">
                  {task.microSteps.map((step, idx) => (
                    <div
                      key={step.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl border transition-all gap-2 ${
                        step.completed
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : 'bg-stone-50 border-stone-200/80 hover:bg-white hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => {
                            soundEngine.playStepCompleteChime();
                            onCompleteMicroStep(task.id, step.id);
                          }}
                          className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                            step.completed
                              ? 'bg-emerald-500 text-white'
                              : 'border-2 border-stone-300 hover:border-emerald-500 text-transparent'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 fill-current" />
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-500">
                              สเต็ป {idx + 1}:
                            </span>
                            <span className={`text-sm font-semibold ${step.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                              {step.title}
                            </span>
                          </div>
                          {step.tip && (
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              💡 {step.tip}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Step Action / Timer */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <span className="text-xs font-medium text-stone-500 flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-stone-200">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {step.minutes} นาที
                        </span>

                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-xl">
                          +{step.rewardPoints} แต้ม
                        </span>

                        {!step.completed && (
                          <button
                            onClick={() => onStartFocusStep(task, step)}
                            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>โฟกัส</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
