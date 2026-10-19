import React, { useState } from 'react';
import { requestCompanionChat } from '../services/apiClient';
import { soundEngine } from '../services/soundService';
import { Sparkles, Send, Heart, Coffee, RefreshCw, MessageSquare } from 'lucide-react';

interface CompanionViewProps {
  currentMood?: string;
  gardenLevel: number;
}

interface ChatMessage {
  id: string;
  sender: 'bloomie' | 'user';
  text: string;
  actionSuggestion?: string;
  moodAffirmation?: string;
  time: string;
}

export const CompanionView: React.FC<CompanionViewProps> = ({ currentMood, gardenLevel }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bloomie',
      text: 'สวัสดีจ้า! บลูมมี่อยู่นี่แล้วนะ 🌿 วันนี้พร้อมอยู่เป็นเพื่อนเธอเสมอ ไม่ว่าจะทำการบ้าน อ่านหนังสือ หรือแค่อยากแวะมานั่งพักผ่อนในสวน มีอะไรอยากเล่าให้บลูมมี่ฟังไหม?',
      actionSuggestion: 'ลองจิบน้ำสักแก้วก่อนเริ่มงานเบาๆ นะ',
      time: 'เมื่อสักครู่',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    '🌱 เริ่มลงมือทำการบ้านไม่ถูก ช่วยแนะสเต็ปแรกที',
    '📱 รู้สึกติดดูคลิป TikTok หยุดเล่นยากจัง',
    '🥱 วันนี้รู้สึกเหนื่อย หมดพลังโฟกัส',
    '🎉 เพิ่งทำภารกิจเสร็จ ขอกำลังใจหน่อย!',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    soundEngine.playStepCompleteChime();

    try {
      const response = await requestCompanionChat(text, undefined, currentMood);
      const bloomieMsg: ChatMessage = {
        id: `bloomie-${Date.now()}`,
        sender: 'bloomie',
        text: response.reply || 'บลูมมี่ฟังอยู่เสมอนะ ค่อยๆ ก้าวไปทีละก้าว เธอทำได้ดีแล้ว!',
        actionSuggestion: response.actionSuggestion,
        moodAffirmation: response.moodAffirmation,
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, bloomieMsg]);
      soundEngine.playBloomChime();
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-stone-200 overflow-hidden flex flex-col h-[650px] max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 sm:p-5 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner animate-float">
              🧚‍♀️
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-emerald-700 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg font-display">
                น้องบลูมมี่ (Bloomie Focus Companion)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-medium">
                เพื่อนคู่คิด AI
              </span>
            </div>
            <p className="text-xs text-emerald-100">
              พร้อมทำกิจกรรมเคียงข้าง เสริมแรงบวก และรับฟังอย่างเข้าใจ
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs text-emerald-100">สวนเลเวล {gardenLevel}</span>
          <p className="text-[11px] text-emerald-200">พื้นที่ปลอดภัย 100%</p>
        </div>
      </div>

      {/* Messages Body */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-stone-50/50 to-emerald-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {msg.sender === 'bloomie' ? (
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0 shadow-xs">
                🧚‍♀️
              </div>
            ) : (
              <div className="w-9 h-9 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-xs">
                ฉัน
              </div>
            )}

            <div className="space-y-1.5">
              <div
                className={`p-3.5 sm:p-4 rounded-3xl shadow-xs text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-xs'
                    : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs'
                }`}
              >
                <p>{msg.text}</p>

                {msg.actionSuggestion && (
                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50/70 p-2 rounded-xl font-medium">
                    <Coffee className="w-3.5 h-3.5 shrink-0" />
                    <span>คำแนะนำน่ารัก: {msg.actionSuggestion}</span>
                  </div>
                )}

                {msg.moodAffirmation && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50/70 p-2 rounded-xl font-medium">
                    <Heart className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span>พลังใจ: {msg.moodAffirmation}</span>
                  </div>
                )}
              </div>

              <span className={`text-[10px] text-stone-400 block px-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-stone-500 text-xs bg-white px-3 py-2 rounded-2xl w-fit shadow-xs border border-stone-100">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>บลูมมี่กำลังคิดคำตอบอบอุ่นให้เธอ...</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="p-3 bg-stone-50 border-t border-stone-200 overflow-x-auto flex gap-2 no-scrollbar">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            disabled={isTyping}
            onClick={() => handleSendMessage(q)}
            className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 px-3 py-1.5 rounded-full border border-stone-200 transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="คุยกับบลูมมี่ หรือเล่าเรื่องที่กำลังกังวล..."
          className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-2.5 rounded-2xl transition-all disabled:opacity-50 cursor-pointer shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
