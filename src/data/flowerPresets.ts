import { FlowerMoodType } from '../types/garden';

export interface FlowerPreset {
  type: FlowerMoodType;
  name: string;
  thaiName: string;
  emoji: string;
  moodDescription: string;
  meaning: string;
  color: string;
  accentColor: string;
  lightBg: string;
  badgeColor: string;
  affirmation: string;
}

export const FLOWER_PRESETS: Record<FlowerMoodType, FlowerPreset> = {
  sunflower: {
    type: 'sunflower',
    name: 'Sunflower',
    thaiName: 'ดอกทานตะวัน',
    emoji: '🌻',
    moodDescription: 'รู้สึกมีพลัง (Energetic)',
    meaning: 'สะท้อนความกระตือรือร้น พร้อมมุ่งสู่เป้าหมายเหมือนทานตะวันหันหาแสงแดด',
    color: '#eab308',
    accentColor: '#ca8a04',
    lightBg: 'bg-amber-50 border-amber-200 text-amber-800',
    badgeColor: 'bg-amber-100 text-amber-800',
    affirmation: 'วันนี้พลังในตัวเธอกำลังส่องสว่างดั่งดวงอาทิตย์!',
  },
  tulip: {
    type: 'tulip',
    name: 'Tulip',
    thaiName: 'ดอกทิวลิป',
    emoji: '🌷',
    moodDescription: 'รู้สึกสงบ (Calm & Peaceful)',
    meaning: 'สะท้อนความเรียบง่าย สมดุลในจิตใจ และความมั่นคงอ่อนโยน',
    color: '#ec4899',
    accentColor: '#db2777',
    lightBg: 'bg-pink-50 border-pink-200 text-pink-800',
    badgeColor: 'bg-pink-100 text-pink-800',
    affirmation: 'ความสงบในใจคือพลังอันยิ่งใหญ่ที่ช่วยให้ใจเย็นและมั่นคง',
  },
  rose: {
    type: 'rose',
    name: 'Rose',
    thaiName: 'ดอกกุหลาบ',
    emoji: '🌹',
    moodDescription: 'รู้สึกกังวล / ต้องการความใส่ใจ (Anxious & Sensitive)',
    meaning: 'สะท้อนจิตใจที่อ่อนไหว มีหนามคอยปกป้องตัวเอง แต่ต้องการความอบอุ่นและการดูแลอย่างทะนุถนอม',
    color: '#f43f5e',
    accentColor: '#e11d48',
    lightBg: 'bg-rose-50 border-rose-200 text-rose-800',
    badgeColor: 'bg-rose-100 text-rose-800',
    affirmation: 'ไม่เป็นไรเลยนะที่รู้สึกกังวล กุหลาบทุกดอกสวยงามได้แม้จะมีหนาม',
  },
  lavender: {
    type: 'lavender',
    name: 'Lavender',
    thaiName: 'ดอกลาเวนเดอร์',
    emoji: '🪻',
    moodDescription: 'ต้องการผ่อนคลาย (Seeking Relaxation)',
    meaning: 'สะท้อนความปรารถนาในการปลดปล่อยความตึงเครียด กลิ่นหอมบำบัดใจ',
    color: '#a855f7',
    accentColor: '#9333ea',
    lightBg: 'bg-purple-50 border-purple-200 text-purple-800',
    badgeColor: 'bg-purple-100 text-purple-800',
    affirmation: 'ปล่อยวางความรีบร้อน สูดลมหายใจช้าๆ ผ่อนคลายกล้ามเนื้อนะ',
  },
  daisy: {
    type: 'daisy',
    name: 'Daisy',
    thaiName: 'ดอกเดซี่',
    emoji: '🌼',
    moodDescription: 'รู้สึกเบิกบาน (Joyful & Cheerful)',
    meaning: 'สะท้อนความสดใสร่าเริง การมองโลกในแง่ดี และรอยยิ้มบริสุทธิ์',
    color: '#f59e0b',
    accentColor: '#d97706',
    lightBg: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    affirmation: 'รอยยิ้มและความเบิกบานของเธอคือของขวัญอันแสนวิเศษในสวนนี้',
  },
  lotus: {
    type: 'lotus',
    name: 'Blue Lotus',
    thaiName: 'ดอกบัวสวรรค์',
    emoji: '🪷',
    moodDescription: 'สมาธิลึกซึ้ง (Deep Focus)',
    meaning: 'สะท้อนสมาธิที่นิ่งสงบท่ามกลางผืนน้ำ ความผ่องใสและความเข้าใจ',
    color: '#3b82f6',
    accentColor: '#2563eb',
    lightBg: 'bg-blue-50 border-blue-200 text-blue-800',
    badgeColor: 'bg-blue-100 text-blue-800',
    affirmation: 'จิตใจที่จดจ่อเหมือนน้ำนิ่งใส สะท้อนทุกสิ่งได้อย่างชัดเจน',
  },
  sakura: {
    type: 'sakura',
    name: 'Sakura',
    thaiName: 'ดอกซากุระ',
    emoji: '🌸',
    moodDescription: 'เริ่มต้นสิ่งใหม่ (Fresh Start)',
    meaning: 'สะท้อนการเริ่มต้นใหม่ด้วยใจเบิกบาน ทุกวันคือโอกาสใหม่เสมอ',
    color: '#fb7185',
    accentColor: '#f43f5e',
    lightBg: 'bg-red-50 border-red-200 text-red-800',
    badgeColor: 'bg-red-100 text-red-800',
    affirmation: 'ไม่ว่าเมื่อวานจะเป็นอย่างไร วันนี้คือจุดเริ่มต้นแสนสวยงาม',
  },
};
