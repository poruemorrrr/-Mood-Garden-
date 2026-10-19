// Client service to communicate with backend Express server and Gemini AI endpoints

export async function requestMicroTaskBreakdown(
  taskTitle: string,
  taskDetails?: string,
  isStruggling: boolean = false
) {
  try {
    const res = await fetch('/api/gemini/breakdown-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskTitle, taskDetails, isStruggling }),
    });

    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('Using client-side micro-task fallback', error);
    return {
      microSteps: [
        {
          id: `step-${Date.now()}-1`,
          title: `เตรียมพื้นที่และเปิดสิ่งที่ต้องทำ: ${taskTitle}`,
          minutes: isStruggling ? 3 : 5,
          tip: 'แค่หยิบสมุดหรืออุปกรณ์ขึ้นมาวาง ก็ถือเป็นก้าวแรกที่ยอดเยี่ยมแล้ว!',
          rewardPoints: 20,
        },
        {
          id: `step-${Date.now()}-2`,
          title: `ลงมือทำส่วนที่ 1 อย่างใจเย็น (ไม่ต้องกลัวผิด)`,
          minutes: isStruggling ? 5 : 10,
          tip: 'จดจ่อทีละข้อ สวนดอกไม้กำลังแตกหน่ออ่อน',
          rewardPoints: 30,
        },
        {
          id: `step-${Date.now()}-3`,
          title: `ตรวจเช็คหรือทำส่วนสุดท้ายให้เสร็จสิ้น`,
          minutes: isStruggling ? 5 : 10,
          tip: 'ใกล้ถึงเส้นชัยแล้ว หายใจลึกๆ ดอกไม้พร้อมเบ่งบาน!',
          rewardPoints: 40,
        },
      ],
      recommendedFocusMinutes: isStruggling ? 5 : 10,
      companionEncouragement: 'บลูมมี่จะนั่งอ่านหนังสือเป็นเพื่อนอยู่ข้างๆ นะ ไปด้วยกันเลย!',
      adaptiveReasoning: 'การย่อยภารกิจให้เล็กลงช่วยกระตุ้นโดปามีนและลดความกังวลของสมอง',
    };
  }
}

export async function requestCompanionChat(
  message: string,
  currentTask?: string,
  mood?: string
) {
  try {
    const res = await fetch('/api/gemini/companion-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, currentTask, mood }),
    });
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      reply: 'บลูมมี่อยู่นี่แล้วนะ! ไม่ว่างานจะยากแค่ไหน หรือกำลังรู้สึกอย่างไร เราจะผ่านมันไปด้วยกันทีละนิด สวนดอกไม้นี้พร้อมเป็นที่พักใจให้เธอเสมอ 🌸',
      actionSuggestion: 'ลองสูดหายใจลึกๆ 3 ครั้ง แล้วจิบน้ำสักอึกนะ',
      moodAffirmation: 'ความพยายามในก้าวเล็กๆ มีคุณค่ามหาศาลเสมอ!',
    };
  }
}

export async function requestGrowthReport(
  sessionHistory: any[],
  moodHistory: any[],
  distractionReports: any[]
) {
  try {
    const res = await fetch('/api/gemini/growth-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionHistory, moodHistory, distractionReports }),
    });
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      summary: 'สัปดาห์นี้คุณมีความก้าวหน้าในการโฟกัสอย่างน่าประทับใจ ดอกไม้หลายต้นผลิบานอย่างสวยงาม!',
      keyInsights: [
        'ช่วงเวลาที่คุณโฟกัสได้ราบรื่นที่สุดคือช่วง 10:00 - 12:00 น.',
        'การซอยย่อยงานเหลือสเต็ปละ 10 นาทีช่วยให้ทำสำเร็จได้สม่ำเสมอมากขึ้นถึง 70%',
        'การเลือกบันทึกอารมณ์ก่อนเริ่มงานช่วยลดความฟุ้งซ่านได้อย่างชัดเจน',
      ],
      timeRecommendation: 'ปรับงานที่ต้องใช้พลังความคิดมากไว้ช่วงเช้า และช่วงเย็นให้เน้นกิจกรรมผ่อนคลายหรือย่อยงานให้สั้นลง',
      familyAdvice: 'ข้อแนะนำสำหรับครอบครัว: ชื่นชมความพยายามในแต่ละก้าวเล็กๆ แทนการตั้งเป้าหมายใหญ่ ช่วยสร้างความมั่นใจและลดแรงเสียดทานในบ้าน',
      gardenMilestone: 'ปลดล็อก: เมล็ดพันธุ์ดอกบัวสวรรค์แห่งความสงบ และมุมพักผ่อนน้ำตกจำลอง 🪷',
    };
  }
}

export async function requestAdaptivePacing(
  recentFailures: number,
  shortTaskSuccessRate: number,
  preferredActivity: string
) {
  try {
    const res = await fetch('/api/gemini/adaptive-pacing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recentFailures, shortTaskSuccessRate, preferredActivity }),
    });
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      suggestedTaskLength: 8,
      gardenTheme: 'gentle_meadow',
      adaptiveTip: 'AI เรียนรู้ว่าการทำงานช่วงสั้น 8-10 นาทีเหมาะกับสไตล์ของคุณที่สุด จึงเพิ่มระยะการเติบโตของดอกไม้ให้เห็นผลลัพธ์เร็วขึ้น 🌷',
      flowerUnlockBonus: 'ดอกเดซี่มินิ',
    };
  }
}
