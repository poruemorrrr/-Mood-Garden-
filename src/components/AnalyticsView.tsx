import React, { useState } from 'react';
import { MoodLog, ParentTask } from '../types/garden';
import { requestGrowthReport } from '../services/apiClient';
import { soundEngine } from '../services/soundService';
import {
  TrendingUp,
  Clock,
  Sparkles,
  HeartHandshake,
  Brain,
  CheckCircle2,
  Calendar,
  Award,
  RefreshCw,
  Users
} from 'lucide-react';

interface AnalyticsViewProps {
  tasks: ParentTask[];
  moodLogs: MoodLog[];
  gardenLevel: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, moodLogs, gardenLevel }) => {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [reportData, setReportData] = useState<any>({
    summary: 'สัปดาห์นี้คุณมีความก้าวหน้าอย่างยอดเยี่ยมในการจัดระเบียบงานและการดูแลสุขภาวะใจ 🌿',
    keyInsights: [
      'คุณทำภารกิจสำเร็จได้ดีที่สุดเมื่อแบ่งเวลาเป็นสเต็ปละ 8-12 นาที (อัตราสำเร็จสูงถึง 86%)',
      'ช่วงเวลาที่มีสมาธิต่อเนื่องสูงสุดคือ 10:00 - 13:00 น. ก่อนเข้าสู่ช่วงบ่ายคล้อย',
      'เมื่อเช็คอินอารมณ์ด้วย "ดอกลาเวนเดอร์" หรือ "ดอกทิวลิป" อัตราการหลุดโฟกัสจากโทรศัพท์ลดลง 65%',
    ],
    timeRecommendation: 'แนะนำให้ย้ายงานยากมาทำช่วงเช้า และช่วงเย็นหลัง 17:00 น. ให้เน้นเป็นภารกิจสั้น 5 นาทีหรือฝึกหายใจในสวนพักใจ',
    familyAdvice: 'ข้อแนะนำสำหรับครอบครัว: ชื่นชม "ความพยายามในการเริ่มงาน" มากกว่าความสมบูรณ์แบบของผลลัพธ์ การใช้คำพูดเชิงบวก เช่น "เก่งมากที่เปิดสมุดลงมือทำได้ทันที" ช่วยกระตุ้นโดปามีนของเด็กสมาธิสั้นได้ดีกว่าการสั่งซ้ำๆ',
    gardenMilestone: 'ปลดล็อก: เมล็ดพันธุ์ดอกบัวสวรรค์แห่งความสงบ และมุมพักผ่อนน้ำตกจำลอง 🪷',
  });

  const totalFocusMinutes = tasks.reduce(
    (acc, t) => acc + t.microSteps.filter((s) => s.completed).reduce((sum, s) => sum + s.minutes, 0),
    45 // initial base demo minutes
  );

  const completedStepsCount = tasks.reduce(
    (acc, t) => acc + t.microSteps.filter((s) => s.completed).length,
    6
  );

  const handleRefreshReport = async () => {
    setIsGeneratingAI(true);
    soundEngine.playStepCompleteChime();
    try {
      const res = await requestGrowthReport(tasks, moodLogs, []);
      setReportData(res);
      soundEngine.playBloomChime();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-green-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-2">
            <Brain className="w-3.5 h-3.5" />
            <span>ระบบประเมินผลและปรับพฤติกรรม (Emotional & Focus Analytics)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display">
            รายงานการเติบโตของสวนและพัฒนาการสมาธิ
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
            ประมวลผลความสัมพันธ์ระหว่าง "เวลาที่ใช้ - ความสำเร็จของงาน - อารมณ์" เพื่อปรับตารางชีวิตให้สมดุลและลดความตึงเครียดในครอบครัว
          </p>
        </div>

        <button
          onClick={handleRefreshReport}
          disabled={isGeneratingAI}
          className="bg-white hover:bg-emerald-50 active:scale-95 text-emerald-900 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin text-emerald-600' : ''}`} />
          <span>{isGeneratingAI ? 'AI กำลังวิเคราะห์ข้อมูล...' : 'อัปเดตรายงาน AI'}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">เวลาโฟกัสรวม</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            {totalFocusMinutes} <span className="text-xs font-normal text-stone-500">นาที</span>
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            ↑ เพิ่มขึ้น 25% จากสัปดาห์ก่อน
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">สเต็ปจิ๋วสำเร็จ</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            {completedStepsCount} <span className="text-xs font-normal text-stone-500">สเต็ป</span>
          </p>
          <p className="text-[11px] text-teal-600 font-medium mt-1">
            สร้างโดปามีนเชิงบวกต่อเนื่อง
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">การลดสิ่งรบกวน</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            -65% <span className="text-xs font-normal text-stone-500">TikTok & Games</span>
          </p>
          <p className="text-[11px] text-sky-600 font-medium mt-1">
            Focus Guardian ช่วยบล็อกสิ่งเร้า
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">ความสุขภาวะใจ</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            4.6 <span className="text-xs font-normal text-stone-500">/ 5.0</span>
          </p>
          <p className="text-[11px] text-amber-600 font-medium mt-1">
            ประเมินตนเองอย่างสม่ำเสมอ
          </p>
        </div>
      </div>

      {/* AI Key Insights & Behavioral Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core AI Insights */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="font-bold text-stone-900 text-base font-display">
                บทวิเคราะห์พฤติกรรมจาก AI (Adaptive Behavioral Insights)
              </h3>
              <p className="text-xs text-stone-500">
                เรียนรู้รูปแบบเฉพาะตัวของคุณ เพื่อปรับแต่งประสบการณ์ในสวน
              </p>
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-emerald-950 text-xs sm:text-sm leading-relaxed">
            <p className="font-semibold text-emerald-800 mb-1">สรุปภาพรวม:</p>
            {reportData.summary}
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              ข้อสังเกตสำคัญ 3 ประการ:
            </p>
            {(reportData.keyInsights || []).map((insight: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 bg-stone-50 p-3 rounded-2xl border border-stone-100 text-xs sm:text-sm text-stone-800"
              >
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                <p>{insight}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900">
            <strong className="block mb-1 text-amber-950 flex items-center gap-1.5 font-bold">
              <Calendar className="w-4 h-4 text-amber-600" />
              คำแนะนำปรับเวลาและการจัดตาราง (Adaptive Pacing):
            </strong>
            {reportData.timeRecommendation}
          </div>
        </div>

        {/* Family & Positive Reinforcement Column */}
        <div className="space-y-6">
          {/* Family & Parent Guidance Panel */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/50 rounded-3xl p-6 shadow-md border border-indigo-200/70">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base font-display">
                  มุมความเข้าใจสำหรับคุณพ่อคุณแม่และครอบครัว
                </h3>
                <p className="text-xs text-stone-500">
                  ลดความตึงเครียดเรื่องการบ้าน เปลี่ยนเป็นการสร้างแรงจูงใจภายใน
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-indigo-100 shadow-2xs text-xs sm:text-sm text-stone-800 leading-relaxed space-y-3">
              <p>{reportData.familyAdvice}</p>

              <div className="pt-2 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-800">✅ สิ่งที่แนะนำ:</span>
                  <p className="text-emerald-900 mt-0.5">
                    ร่วมดูสวนและชื่นชมดอกไม้ที่บานในแต่ละสเต็ป
                  </p>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                  <span className="font-bold text-rose-800">❌ สิ่งที่ควรเลี่ยง:</span>
                  <p className="text-rose-900 mt-0.5">
                    การเปรียบเทียบหรือสั่งจี้ซ้ำๆ ขณะเด็กกำลังพยายาม
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Adaptive AI Flower Ecosystem Status */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌱</span>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm font-display">
                    Adaptive AI Flower Ecosystem
                  </h4>
                  <p className="text-xs text-stone-500">
                    ระบบนิเวศสวนปรับตามการตอบสนองจริง
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed mb-3">
              แทนที่จะให้ทุกคนปลูกดอกไม้เหมือนกัน AI ได้ปรับระยะเวลาภารกิจเป็นขนาดสั้น 8-12 นาที และแบ่งขั้นการบานของดอกไม้เป็น 5 ระยะ เพื่อให้สัมผัสความสำเร็จได้ง่ายขึ้น
            </p>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong>ความสำเร็จล่าสุด: </strong>
                {reportData.gardenMilestone || 'ปลดล็อกพันธุ์ดอกไม้ใหม่ประจำสัปดาห์'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
