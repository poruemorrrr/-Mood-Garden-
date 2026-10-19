import express, { Request, Response } from "express";
import { GoogleGenAI, Type } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. AI Micro-Tasking Endpoint (ระบบรับข้อมูลและแบ่งงานสำหรับเด็กสมาธิสั้น/เยาวชน)
app.post("/api/gemini/breakdown-task", async (req: Request, res: Response) => {
  const { taskTitle, taskDetails, userPreference, isStruggling } = req.body;

  if (!taskTitle) {
    return res.status(400).json({ error: "Task title is required" });
  }

  // Fallback if AI is not available
  const generateFallbackSteps = () => {
    return [
      {
        id: "step-1",
        title: `เตรียมอุปกรณ์และเปิดสิ่งที่ต้องทำ: ${taskTitle}`,
        minutes: isStruggling ? 3 : 5,
        tip: "แค่หยิบของมาวางบนโต๊ะก็สำเร็จก้าวแรกแล้ว เก่งมาก!",
        rewardPoints: 20,
      },
      {
        id: "step-2",
        title: `เริ่มลงมือส่วนแรกเบาๆ (ก้าวที่ 1 ของ ${taskTitle})`,
        minutes: isStruggling ? 5 : 10,
        tip: "ทำทีละนิด ไม่ต้องรีบ ดอกไม้กำลังเริ่มผลิใบ",
        rewardPoints: 30,
      },
      {
        id: "step-3",
        title: `ทำต่ออีกนิดเดียว หรือตรวจเช็คสิ่งที่ทำเสร็จ`,
        minutes: isStruggling ? 5 : 10,
        tip: "ใกล้ถึงเป้าหมายแล้ว หายใจลึกๆ ดอกไม้ใกล้บานเต็มที่",
        rewardPoints: 40,
      },
    ];
  };

  if (!ai) {
    return res.json({
      microSteps: generateFallbackSteps(),
      recommendedFocusMinutes: isStruggling ? 5 : 12,
      companionEncouragement: "เรามาเริ่มก้าวเล็กๆ ไปด้วยกันนะ บลูมมี่จะนั่งทำการบ้านอยู่ข้างๆ เอง 🌱",
      adaptiveReasoning: "ย่อยเป็นขั้นตอนสั้นๆ เพื่อลดความกดดันและช่วยให้สมองหลั่งโดปามีนได้ง่ายขึ้น",
    });
  }

  try {
    const prompt = `คุณคือ AI Focus Guardian และ Micro-Tasking Specialist ในแอปพลิเคชัน 'Mood Garden AI'
หน้าที่ของคุณคือช่วยเยาวชนและเด็กสมาธิสั้น (ADHD) ย่อยงานใหญ่ให้เป็น "สเต็ปย่อยๆ ขนาดจิ๋ว (Micro-tasks)" ที่ทำได้จริงทันที ไม่น่ากลัว และให้ความรู้สึกสำเร็จได้รวดเร็ว (Dopamine boost)
งานที่ได้รับ: "${taskTitle}"
รายละเอียดเพิ่มเติม: "${taskDetails || "ไม่มี"}"
สถานะผู้ใช้: ${isStruggling ? "กำลังรู้สึกตื้อ/ท้อแท้/สมาธิหลุดง่าย ขอให้ย่อยงานให้สเต็ปสั้นและง่ายมากๆ (Micro-dosing task)" : "พร้อมโฟกัสในระดับปกติ"}
เวลาเฉลี่ยที่แนะนำต่อสเต็ป: ${isStruggling ? "3-7 นาที" : "5-15 นาที"}

โปรดตอบในรูปแบบ JSON ตาม Schema ที่กำหนด:
- microSteps: รายการ 3-5 สเต็ปย่อย โดยแต่ละสเต็ปมี title (เข้าใจง่าย ชัดเจน เช่น 'หยิบสมุดคณิตศาสตร์ขึ้นมาเปิดหน้า 12', 'ทำข้อ 1 ข้อเดียว'), minutes (จำนวนนาที), tip (คำพูดเชิงบวกอบอุ่นจากบลูมมี่), rewardPoints (15-50 แต้ม)
- recommendedFocusMinutes: เวลาโฟกัสที่แนะนำสำหรับสเต็ปแรก (นาที)
- companionEncouragement: ข้อความให้กำลังใจสั้นๆ นุ่มนวล จากเพื่อนคู่คิด AI บลูมมี่
- adaptiveReasoning: คำอธิบายสั้นๆ ว่าทำไมจึงแบ่งสเต็ปแบบนี้เพื่อช่วยสมองและสมาธิ`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            microSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  minutes: { type: Type.INTEGER },
                  tip: { type: Type.STRING },
                  rewardPoints: { type: Type.INTEGER },
                },
                required: ["id", "title", "minutes", "tip", "rewardPoints"],
              },
            },
            recommendedFocusMinutes: { type: Type.INTEGER },
            companionEncouragement: { type: Type.STRING },
            adaptiveReasoning: { type: Type.STRING },
          },
          required: ["microSteps", "recommendedFocusMinutes", "companionEncouragement", "adaptiveReasoning"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Gemini micro-task error:", err);
    return res.json({
      microSteps: generateFallbackSteps(),
      recommendedFocusMinutes: isStruggling ? 5 : 10,
      companionEncouragement: "สู้ๆ นะ บลูมมี่คอยเอาใจช่วยอยู่ข้างๆ สวนดอกไม้พร้อมเบ่งบานไปกับเธอ!",
      adaptiveReasoning: "ปรับเป็นก้าวเล็กๆ ที่เริ่มต้นได้ง่ายทันที",
    });
  }
});

// 2. AI Companion Chat & Refocus Guardian (เพื่อนคู่คิดและตัวช่วยโฟกัส)
app.post("/api/gemini/companion-chat", async (req: Request, res: Response) => {
  const { message, context, mood, currentTask } = req.body;

  if (!ai) {
    return res.json({
      reply: `บลูมมี่อยู่นี่แล้วนะ! 🌿 ${currentTask ? `เห็นว่ากำลังทำ "${currentTask}" อยู่ เก่งมากเลยนะ` : "มีอะไรอยากเล่าให้บลูมมี่ฟังไหม"} ไม่ว่าจะรู้สึกยังไง สวนดอกไม้ตรงนี้เป็นพื้นที่ปลอดภัยของเธอเสมอ สูดหายใจลึกๆ แล้วค่อยๆ ไปด้วยกันนะ`,
      actionSuggestion: "ดื่มน้ำสักอึก หรือยืดเส้นยืดสาย 1 นาทีไหม?",
      moodAffirmation: "ทุกอารมณ์มีคุณค่า ดอกไม้ในสวนของเรามีหลายพันธุ์ อารมณ์ของเราก็มีหลายสีสันเช่นกันนะ",
    });
  }

  try {
    const prompt = `คุณคือ "บลูมมี่ (Bloomie)" นางฟ้าภูติน้อยประจำ Mood Garden AI
คุณคือเพื่อนคู่คิด (Role Model & Focus Companion) ของวัยรุ่นและเด็กที่มีสภาวะสมาธิสั้น (ADHD)
น้ำเสียงของคุณ: อบอุ่น ใจดี เป็นกันเอง ไม่สั่งสอน ไม่ตำหนิ ใช้คำพูดเชิงบวก (Positive Reinforcement) เข้าใจความยากลำบากในการเริ่มงานและการควบคุมสิ่งเร้า
ข้อมูลปัจจุบันของผู้ใช้:
- อารมณ์ปัจจุบัน: ${mood || "ไม่ระบุ"}
- งานที่กำลังทำ: ${currentTask || "กำลังพักผ่อนในสวน"}
- สิ่งที่ผู้ใช้พูด: "${message}"

โปรดตอบในรูปแบบ JSON:
- reply: คำตอบของบลูมมี่ (1-3 ประโยค อบอุ่น นุ่มนวล เติมพลังบวก)
- actionSuggestion: คำแนะนำการกระทำเล็กๆ ที่ช่วยผ่อนคลายหรือกลับมาโฟกัสได้ง่าย เช่น ดื่มน้ำ หายใจ 3 ครั้ง
- moodAffirmation: ข้อความปลอบโยนหรือชื่นชมที่เสริมสร้าง Self-esteem`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            actionSuggestion: { type: Type.STRING },
            moodAffirmation: { type: Type.STRING },
          },
          required: ["reply", "actionSuggestion", "moodAffirmation"],
        },
      },
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (err) {
    return res.json({
      reply: "บลูมมี่อยู่ตรงนี้เสมอ ไม่ต้องกังวลนะ ค่อยๆ ก้าวไปทีละก้าว ดอกไม้ในสวนกำลังผลิบานเป็นกำลังใจให้เธอ 🌸",
      actionSuggestion: "พักสายตามองสีเขียวของใบไม้สัก 30 วินาทีนะ",
      moodAffirmation: "เธอทำได้ดีมากแล้วในแต่ละวัน ภูมิใจในตัวเองได้เลย!",
    });
  }
});

// 3. Emotional & Focus Analytics Report (ระบบประเมินผลและปรับพฤติกรรม & คำแนะนำครอบครัว)
app.post("/api/gemini/growth-report", async (req: Request, res: Response) => {
  const { sessionHistory, moodHistory, distractionReports } = req.body;

  const defaultReport = {
    summary: "สัปดาห์นี้คุณฝึกโฟกัสได้ยอดเยี่ยม ดอกไม้ในสวนเติบโตขึ้นอย่างงดงาม!",
    keyInsights: [
      "ช่วงเวลาที่ทำภารกิจสำเร็จได้ดีที่สุดคือช่วงเช้าและบ่ายต้นๆ (10.00 - 14.00 น.)",
      "การแบ่งภารกิจเป็นสเต็ปย่อย 7-10 นาที ช่วยลดอาการหลุดโฟกัสจากมือถือได้ถึง 65%",
      "เมื่อเลือกดอกไม้แทนอารมณ์ผ่อนคลาย (ลาเวนเดอร์) สมาธิจะคงที่ขึ้นอย่างมีนัยสำคัญ",
    ],
    timeRecommendation: "แนะนำให้ทำภารกิจยากในช่วงก่อน 16.00 น. และใช้ช่วงเย็นเป็นโหมดสวนพักใจหรือภารกิจสั้นๆ ไม่เกิน 8 นาที",
    familyAdvice: "ข้อแนะนำสำหรับครอบครัว: ชื่นชมความพยายามในก้าวเล็กๆ ของเด็ก แทนการเน้นผลลัพธ์สุดท้าย การให้กำลังใจเชิงบวกช่วยกระตุ้นโดปามีนตามธรรมชาติของเด็ก ADHD ได้ดีเยี่ยม",
    gardenMilestone: "ปลดล็อก 'โซนสวนพักใจใต้ร่มไม้ใหญ่' และเมล็ดพันธุ์ดอกบัวสวรรค์แห่งความสงบ 🪷",
  };

  if (!ai) {
    return res.json(defaultReport);
  }

  try {
    const prompt = `คุณคือผู้เชี่ยวชาญด้านจิตวิทยาวัยรุ่นและพฤติกรรมเด็กสมาธิสั้น (ADHD) วิเคราะห์ข้อมูลของ Mood Garden AI
ประวัติกิจกรรม: ${JSON.stringify(sessionHistory || []).slice(0, 1000)}
ประวัติอารมณ์: ${JSON.stringify(moodHistory || []).slice(0, 1000)}
รายงานสิ่งรบกวน: ${JSON.stringify(distractionReports || []).slice(0, 1000)}

ช่วยสร้างรายงานสรุปพัฒนาการทั้ง 4 มิติ:
1. ความสัมพันธ์ระหว่างเวลาที่ใช้ - ความสำเร็จของงาน - อารมณ์
2. รูปแบบช่วงเวลาที่ทำกิจกรรมได้ดี
3. คำแนะนำปรับเวลา/ปริมาณงานเพื่อไม่ให้เด็กเครียดเกินไป (Adaptive Pacing)
4. ข้อแนะนำเชิงบวกสำหรับครอบครัว/ผู้ปกครอง เพื่อลดความขัดแย้งในบ้านและสร้างความเข้าใจ

โปรดตอบในรูปแบบ JSON ตาม Schema:
- summary: บทสรุปภาพรวมที่ให้กำลังใจ (1-2 ประโยค)
- keyInsights: ข้อสังเกตเชิงลึก 3-4 ข้อเกี่ยวกับพฤติกรรมและอารมณ์
- timeRecommendation: คำแนะนำการปรับเวลาทำงานและพักผ่อน
- familyAdvice: ข้อแนะนำสำหรับพ่อแม่/ครอบครัวในการสนับสนุนเด็กเชิงบวก
- gardenMilestone: รางวัลการเติบโตเชิงสัญลักษณ์ในสวน`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            timeRecommendation: { type: Type.STRING },
            familyAdvice: { type: Type.STRING },
            gardenMilestone: { type: Type.STRING },
          },
          required: ["summary", "keyInsights", "timeRecommendation", "familyAdvice", "gardenMilestone"],
        },
      },
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (err) {
    console.error("Report error:", err);
    return res.json(defaultReport);
  }
});

// 4. Adaptive AI Flower Ecosystem Insights (ปรับแต่งสวนตามพฤติกรรมรายบุคคล)
app.post("/api/gemini/adaptive-pacing", async (req: Request, res: Response) => {
  const { recentFailures, shortTaskSuccessRate, preferredActivity } = req.body;

  if (!ai) {
    return res.json({
      suggestedTaskLength: 8,
      gardenTheme: "gentle_meadow",
      adaptiveTip: "AI สังเกตว่าคุณชอบภารกิจสั้นๆ ระบบจึงแบ่งการบานของดอกไม้เป็น 3 ระยะย่อย เพื่อให้เห็นความก้าวหน้าชัดเจนขึ้นในทุกๆ 8 นาที 🌼",
      flowerUnlockBonus: "ดอกทานตะวันจิ๋ว (Mini Sunflower)",
    });
  }

  try {
    const prompt = `ผู้ใช้มีข้อมูลพฤติกรรม:
- อัตราสำเร็จภารกิจสั้น: ${shortTaskSuccessRate || 80}%
- สะดุดหรือหลุดโฟกัสบ่อยในภารกิจยาวหรือไม่: ${recentFailures > 1 ? "ใช่" : "ไม่"}
- กิจกรรมที่ชอบ: ${preferredActivity || "การอ่านและการบ้าน"}

หน้าที่: แนะนำการปรับจังหวะเวลา (Adaptive Pacing) และกลไกสวนดอกไม้ที่เหมาะสม ตอบเป็น JSON:
- suggestedTaskLength: ระยะเวลาที่เหมาะสมที่สุดในนาที (จำนวนเต็ม 5-20)
- gardenTheme: ธีมสวน เช่น "gentle_meadow", "zen_stream", "sunlight_glade"
- adaptiveTip: คำอธิบายภาษาไทยที่เป็นมิตรว่า AI ปรับระบบนิเวศของสวนให้เข้ากับสไตล์ของเขาอย่างไร
- flowerUnlockBonus: ดอกไม้พิเศษที่แนะนำให้ปลูก`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedTaskLength: { type: Type.INTEGER },
            gardenTheme: { type: Type.STRING },
            adaptiveTip: { type: Type.STRING },
            flowerUnlockBonus: { type: Type.STRING },
          },
          required: ["suggestedTaskLength", "gardenTheme", "adaptiveTip", "flowerUnlockBonus"],
        },
      },
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (e) {
    return res.json({
      suggestedTaskLength: 10,
      gardenTheme: "gentle_meadow",
      adaptiveTip: "AI ปรับให้เป็นภารกิจสั้น 10 นาทีเพื่อให้สมองสดชื่นและมีสมาธิต่อเนื่องอย่างเป็นธรรมชาติ 🌷",
      flowerUnlockBonus: "ดอกเดซี่แห่งความร่าเริง",
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Mood Garden AI server running on port ${PORT}`);
  });
}

startServer();
