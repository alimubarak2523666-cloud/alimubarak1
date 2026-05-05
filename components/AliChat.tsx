'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME: Record<string, string> = {
  en: "Hi! I'm Ali's AI assistant. Ask me anything about Ali's background, ventures, book, or how to work with him.",
  ar: 'أهلاً! أنا المساعد الذكي لعلي. اسألني عن خلفيته، مشاريعه، كتابه، أو كيف تعمل معه.'
};

const PLACEHOLDER: Record<string, string> = {
  en: 'Ask me anything…',
  ar: 'اسألني أي شيء…'
};

const TITLE: Record<string, string> = {
  en: 'Ask Ali's AI',
  ar: 'اسأل مساعد علي'
};

export default function AliChat() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME[locale] ?? WELCOME.en }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: isAr
            ? 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.'
            : 'Sorry, something went wrong. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Position: bottom-right for LTR, bottom-left for RTL
  const positionClass = isAr ? 'bottom-6 left-6' : 'bottom-6 right-6';

  return (
    <div className={`fixed ${positionClass} z-50`} dir={dir}>
      {/* Chat panel */}
      {open && (
        <div
          className="mb-4 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: '340px',
            height: '480px',
            background: '#FAFAF7', // cream-50
            border: '1px solid #E8E0C8' // cream-400
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: '#0D5C4A' }} // emerald-700
          >
            <div className="flex items-center gap-2">
              {/* AM monogram */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: '#C9A84C', color: '#0D5C4A' }}
              >
                AM
              </div>
              <span className="text-sm font-semibold text-white">
                {TITLE[locale] ?? TITLE.en}
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? (isAr ? 'justify-start' : 'justify-end') : (isAr ? 'justify-end' : 'justify-start')}`}
              >
                <div
                  className="max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? { background: '#0D5C4A', color: '#fff', borderRadius: isAr ? '18px 4px 18px 18px' : '4px 18px 18px 18px' }
                      : { background: '#F0EBD8', color: '#1a1a1a', border: '1px solid #E8E0C8', borderRadius: isAr ? '4px 18px 18px 18px' : '18px 4px 18px 18px' }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className={`flex ${isAr ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="px-4 py-3 rounded-2xl"
                  style={{ background: '#F0EBD8', border: '1px solid #E8E0C8' }}
                >
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full inline-block"
                        style={{
                          background: '#0D5C4A',
                          animation: `bounce 1s infinite`,
                          animationDelay: `${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-2 border-t"
            style={{ borderColor: '#E8E0C8', background: '#fff' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={PLACEHOLDER[locale] ?? PLACEHOLDER.en}
              disabled={loading}
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
              style={{ color: '#1a1a1a', direction: dir }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity"
              style={{
                background: '#0D5C4A',
                opacity: !input.trim() || loading ? 0.4 : 1
              }}
              aria-label="Send"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95"
        style={{ background: '#0D5C4A' }}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      <style jsx>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
