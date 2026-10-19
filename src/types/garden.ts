export type FlowerMoodType =
  | 'sunflower' // รู้สึกมีพลัง (Energetic)
  | 'tulip'     // รู้สึกสงบ (Calm)
  | 'rose'      // รู้สึกกังวล/ต้องการความใส่ใจ (Anxious/Vulnerable)
  | 'lavender'  // ต้องการผ่อนคลาย (Seeking Relaxation)
  | 'daisy'     // รู้สึกเบิกบาน (Joyful)
  | 'lotus'     // สมาธิลึกซึ้ง (Deep Focus)
  | 'sakura';   // เริ่มต้นสิ่งใหม่ (Fresh Start)

export type GrowthStage = 'seed' | 'sprout' | 'bud' | 'bloom' | 'radiant';

export interface FlowerData {
  id: string;
  name: string;
  thaiName: string;
  symbol: string;
  color: string;
  accentColor: string;
  moodDescription: string;
  meaning: string;
  stage: GrowthStage;
  progressPercent: number; // 0 - 100
  plantedAt: string;
  lastTendedAt: string;
  taskTitleLinked?: string;
  waterCount: number;
}

export interface GardenPlot {
  id: number;
  unlocked: boolean;
  flower?: FlowerData;
  plotType: 'standard' | 'zen_sanctuary' | 'butterfly_grove';
  requiredLevel: number;
}

export interface MicroStep {
  id: string;
  title: string;
  minutes: number;
  tip?: string;
  rewardPoints: number;
  completed: boolean;
}

export interface ParentTask {
  id: string;
  title: string;
  category: 'homework' | 'reading' | 'chores' | 'creative' | 'other';
  microSteps: MicroStep[];
  currentStepIndex: number;
  status: 'pending' | 'in_progress' | 'completed' | 'paused';
  createdAt: string;
  flowerAssigned?: FlowerMoodType;
  totalEstimatedMinutes: number;
  totalPointsEarned: number;
}

export interface MoodLog {
  id: string;
  timestamp: string;
  flowerType: FlowerMoodType;
  emoji: string;
  energyLevel: number; // 1-5
  stressLevel: number; // 1-5
  focusRating: number; // 1-5
  note?: string;
  activityTagged?: string;
}

export interface GardenVisitor {
  id: string;
  type: 'butterfly' | 'bee' | 'hummingbird' | 'bunny' | 'ladybug';
  name: string;
  thaiName: string;
  message: string;
  positionX: number; // percentage
  positionY: number; // percentage
}

export interface UserPreferences {
  userName: string;
  goals: string[]; // e.g. ["ทำการบ้าน", "อ่านหนังสือ", "จัดห้อง"]
  distractions: string[]; // e.g. ["แจ้งเตือน TikTok", "เล่นเกม", "ใจลอย", "เปิดดูมือถือ"]
  preferredFocusDuration: number; // e.g. 10 or 15 minutes
  gardenLevel: number;
  sunlightPoints: number;
  dropletPoints: number;
  streakDays: number;
  adaptiveModeEnabled: boolean;
  soundEnabled: boolean;
  soundTheme: 'gentle_rain' | 'forest_birds' | 'zen_stream' | 'summer_breeze' | 'none';
  soundVolume: number;
}

export interface AnalyticsSummary {
  totalTasksCompleted: number;
  totalMicroStepsCompleted: number;
  totalFocusMinutes: number;
  flowersBloomed: number;
  bestFocusTimeSlot: string;
  distractionDropRate: string;
  emotionalBalanceScore: string;
}
