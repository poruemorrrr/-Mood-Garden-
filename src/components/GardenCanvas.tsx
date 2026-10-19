import React, { useState } from 'react';
import { FlowerData, GardenPlot, FlowerMoodType } from '../types/garden';
import { FLOWER_PRESETS } from '../data/flowerPresets';
import { soundEngine } from '../services/soundService';
import { Droplet, Sun, Sparkles, Plus, Heart, Info, Wind } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GardenCanvasProps {
  plots: GardenPlot[];
  sunlightPoints: number;
  dropletPoints: number;
  gardenLevel: number;
  onWaterFlower: (plotId: number) => void;
  onPlantSeed: (plotId: number, flowerType: FlowerMoodType) => void;
  onSelectFlowerToView: (flower: FlowerData) => void;
  onOpenMoodPicker: () => void;
}

export const GardenCanvas: React.FC<GardenCanvasProps> = ({
  plots,
  sunlightPoints,
  dropletPoints,
  gardenLevel,
  onWaterFlower,
  onPlantSeed,
  onSelectFlowerToView,
  onOpenMoodPicker,
}) => {
  const [selectedPlotForPlanting, setSelectedPlotForPlanting] = useState<number | null>(null);
  const [visitorQuote, setVisitorQuote] = useState<string | null>(
    'ยินดีต้อนรับสู่สวนดอกไม้ของคุณ! ดอกไม้ที่นี่เติบโตตามความพยายามของคุณนะ 🌱'
  );
  const [isWateringAll, setIsWateringAll] = useState(false);

  const handleWater = (plotId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playWaterDrop();
    onWaterFlower(plotId);
  };

  const handleWaterAll = () => {
    setIsWateringAll(true);
    soundEngine.playWaterDrop();
    plots.forEach((p) => {
      if (p.flower) {
        onWaterFlower(p.id);
      }
    });
    setTimeout(() => {
      setIsWateringAll(false);
      soundEngine.playBloomChime();
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#60a5fa', '#34d399', '#f472b6'],
      });
    }, 400);
  };

  const visitors = [
    { id: 1, emoji: '🦋', name: 'ผีเสื้อนำโชค', quote: 'ผีเสื้อบินมาบอกว่า: "ก้าวเล็กๆ ที่สม่ำเสมอ พาไปสู่สวนที่งดงามที่สุด"', x: '15%', y: '12%' },
    { id: 2, emoji: '🐝', name: 'ผึ้งน้อยขยัน', quote: 'ผึ้งน้อยกระซิบ: "ไม่จำเป็นต้องสมบูรณ์แบบ แค่ลงมือทำทีละนิดก็วิเศษมากแล้ว!"', x: '78%', y: '18%' },
    { id: 3, emoji: '🐰', name: 'กระต่ายบันนี่', quote: 'กระต่ายบันนี่ชวน: "อย่าลืมยืดเส้นยืดสายและดื่มน้ำด้วยนะเพื่อนรัก!"', x: '88%', y: '75%' },
  ];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-emerald-100 bg-gradient-to-b from-sky-100 via-amber-50/40 to-emerald-100/90 p-4 sm:p-6 transition-all">
      {/* Sky Backdrop & Atmosphere */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-sky-200/50 via-sky-100/30 to-transparent pointer-events-none" />
      
      {/* Sun & Cloud Decor */}
      <div className="absolute top-4 right-8 flex items-center gap-2 pointer-events-none opacity-90">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-200 blur-[2px] shadow-lg shadow-amber-200/50 flex items-center justify-center animate-pulse">
          <Sun className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '40s' }} />
        </div>
      </div>

      {/* Floating Gentle Clouds */}
      <div className="absolute top-6 left-12 opacity-70 pointer-events-none animate-float">
        <div className="flex items-center gap-1 bg-white/70 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs text-sky-700 shadow-xs">
          <Wind className="w-3.5 h-3.5 text-sky-400" />
          <span>สายลมพัดเบาๆ ในสวนอารมณ์ดี</span>
        </div>
      </div>

      {/* Interactive Visitors (Butterfly, Bee, Bunny) */}
      {visitors.map((v) => (
        <button
          key={v.id}
          onClick={() => {
            soundEngine.playStepCompleteChime();
            setVisitorQuote(v.quote);
          }}
          className="absolute z-20 cursor-pointer transform hover:scale-130 active:scale-95 transition-transform animate-float select-none"
          style={{ left: v.x, top: v.y }}
          title={`คลิกคุยกับ ${v.name}`}
        >
          <span className="text-2xl sm:text-3xl filter drop-shadow-md hover:drop-shadow-lg">
            {v.emoji}
          </span>
        </button>
      ))}

      {/* Header Bar inside Garden */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-xs">
              Lv.{gardenLevel}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-display">
              สวนดอกไม้ของฉัน (My Mood Garden)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-0.5">
            ดอกไม้เติบโตจากทุกช่วงเวลาที่คุณตั้งใจโฟกัสและดูแลสุขภาวะใจ 🌿
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleWaterAll}
            disabled={isWateringAll}
            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium shadow-md shadow-blue-200 transition-all cursor-pointer"
          >
            <Droplet className={`w-4 h-4 ${isWateringAll ? 'animate-bounce text-blue-200' : ''}`} />
            <span>รดน้ำทุกแปลง</span>
          </button>

          <button
            onClick={onOpenMoodPicker}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium shadow-md shadow-emerald-200 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>เช็คอินอารมณ์</span>
          </button>
        </div>
      </div>

      {/* Visitor Quote Banner */}
      {visitorQuote && (
        <div className="relative z-10 mb-5 bg-white/85 backdrop-blur-md border border-emerald-200/80 rounded-2xl p-3 px-4 shadow-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-emerald-900">
            <span className="text-lg">✨</span>
            <p className="font-medium">{visitorQuote}</p>
          </div>
          <button
            onClick={() => setVisitorQuote(null)}
            className="text-emerald-500 hover:text-emerald-700 text-xs px-2 py-0.5 rounded-lg hover:bg-emerald-50 cursor-pointer"
          >
            ปิด
          </button>
        </div>
      )}

      {/* Garden Plots Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 my-2">
        {plots.map((plot) => {
          const hasFlower = !!plot.flower;
          const flower = plot.flower;
          const preset = flower ? FLOWER_PRESETS[flower.name.toLowerCase() as FlowerMoodType] || FLOWER_PRESETS.tulip : null;

          return (
            <div
              key={plot.id}
              onClick={() => {
                if (hasFlower && flower) {
                  onSelectFlowerToView(flower);
                } else if (plot.unlocked) {
                  setSelectedPlotForPlanting(plot.id);
                }
              }}
              className={`group relative rounded-3xl p-3 sm:p-4 transition-all duration-300 min-h-[175px] sm:min-h-[200px] flex flex-col justify-between cursor-pointer border-2 shadow-sm hover:shadow-lg ${
                plot.unlocked
                  ? hasFlower
                    ? 'bg-gradient-to-b from-white/90 via-emerald-50/60 to-emerald-100/90 border-emerald-300/80 hover:border-emerald-400'
                    : 'bg-white/60 border-dashed border-emerald-300 hover:bg-emerald-50/80 hover:border-emerald-400'
                  : 'bg-stone-200/50 border-stone-300 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Soil Base styling */}
              <div className="absolute bottom-2 left-4 right-4 h-5 rounded-full bg-amber-950/20 blur-[1px] pointer-events-none" />

              {/* Top info badge */}
              <div className="flex items-center justify-between w-full z-10 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 font-medium text-[11px]">
                  แปลง #{plot.id}
                </span>

                {hasFlower && flower && (
                  <span className="px-2 py-0.5 rounded-full bg-white/90 font-medium text-[11px] shadow-xs text-stone-700 flex items-center gap-1">
                    {flower.stage === 'seed' && '🌱 เมล็ด'}
                    {flower.stage === 'sprout' && '🌿 ต้นกล้า'}
                    {flower.stage === 'bud' && '🌷 ดอกตูม'}
                    {flower.stage === 'bloom' && '🌸 บานแล้ว'}
                    {flower.stage === 'radiant' && '✨ เปล่งประกาย'}
                  </span>
                )}
              </div>

              {/* Flower Visual Render */}
              <div className="flex-1 flex flex-col items-center justify-center my-1 z-10">
                {hasFlower && flower ? (
                  <div className="flex flex-col items-center group-hover:scale-105 transition-transform">
                    {/* Flower Graphic */}
                    <div className="relative flex items-center justify-center">
                      {flower.stage === 'radiant' && (
                        <div className="absolute inset-0 rounded-full bg-amber-300/40 blur-md animate-pulse" />
                      )}

                      {flower.stage === 'seed' && (
                        <div className="w-12 h-12 rounded-full bg-amber-800/80 flex items-center justify-center shadow-inner text-amber-200 text-lg">
                          🌱
                        </div>
                      )}

                      {flower.stage === 'sprout' && (
                        <div className="text-4xl animate-sway filter drop-shadow-sm">
                          🌿
                        </div>
                      )}

                      {flower.stage === 'bud' && (
                        <div className="text-4xl sm:text-5xl animate-sway filter drop-shadow-md">
                          {flower.symbol || preset?.emoji || '🌷'}
                        </div>
                      )}

                      {(flower.stage === 'bloom' || flower.stage === 'radiant') && (
                        <div className="relative">
                          <div className="text-5xl sm:text-6xl animate-sway filter drop-shadow-lg">
                            {flower.symbol || preset?.emoji || '🌸'}
                          </div>
                          {flower.stage === 'radiant' && (
                            <span className="absolute -top-2 -right-2 text-base animate-ping">✨</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-center">
                      <p className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1 justify-center">
                        {flower.thaiName}
                      </p>
                      <p className="text-[11px] text-emerald-700 line-clamp-1 max-w-[130px]">
                        {flower.moodDescription}
                      </p>
                    </div>
                  </div>
                ) : plot.unlocked ? (
                  <div className="flex flex-col items-center text-center p-2 text-emerald-700/80 hover:text-emerald-800">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-1 group-hover:bg-emerald-200 transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold">ปลูกเมล็ดพันธุ์</span>
                    <span className="text-[10px] text-stone-500">เลือกอารมณ์ของคุณ</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-stone-400 text-center">
                    <span className="text-xl mb-1">🔒</span>
                    <span className="text-xs font-medium">ปลดล็อกที่ Lv.{plot.requiredLevel}</span>
                  </div>
                )}
              </div>

              {/* Bottom Progress Bar & Water button */}
              {hasFlower && flower && (
                <div className="w-full z-10">
                  <div className="flex items-center justify-between text-[10px] text-stone-600 mb-1">
                    <span>การเติบโต</span>
                    <span className="font-semibold text-emerald-700">{Math.round(flower.progressPercent)}%</span>
                  </div>
                  <div className="w-full bg-stone-200/80 rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 transition-all duration-500"
                      style={{ width: `${flower.progressPercent}%` }}
                    />
                  </div>

                  {/* Water Action */}
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={(e) => handleWater(plot.id, e)}
                      className="w-full flex items-center justify-center gap-1 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 border border-blue-200 rounded-xl py-1 text-xs font-medium transition-colors shadow-2xs"
                    >
                      <Droplet className="w-3.5 h-3.5 text-blue-500" />
                      <span>รดน้ำ (+10%)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Plot Planting Modal */}
      {selectedPlotForPlanting !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌱</span>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-display">
                    เลือกดอกไม้แทนอารมณ์ของคุณ
                  </h3>
                  <p className="text-xs text-stone-500">
                    ปลูกในแปลง #{selectedPlotForPlanting} เพื่อเริ่มภารกิจ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlotForPlanting(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4 border border-emerald-100">
              💡 ดอกไม้เหล่านี้เป็นสัญลักษณ์ที่คุณเลือกเอง เพื่อสะท้อนความรู้สึก ไม่ใช่เครื่องมือวินิจฉัยทางการแพทย์
            </p>

            <div className="space-y-2.5">
              {Object.values(FLOWER_PRESETS).map((preset) => (
                <button
                  key={preset.type}
                  onClick={() => {
                    onPlantSeed(selectedPlotForPlanting, preset.type);
                    soundEngine.playStepCompleteChime();
                    setSelectedPlotForPlanting(null);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left group cursor-pointer"
                >
                  <span className="text-3xl p-1.5 rounded-2xl bg-stone-100 group-hover:bg-white group-hover:scale-110 transition-transform">
                    {preset.emoji}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm">
                        {preset.thaiName} ({preset.name})
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 font-medium">
                      {preset.moodDescription}
                    </p>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {preset.meaning}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
