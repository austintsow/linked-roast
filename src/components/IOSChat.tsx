'use client';

import { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

interface IOSChatProps {
  messages: string[];
  showTyping?: boolean;
}

export function IOSChat({ messages, showTyping = false }: IOSChatProps) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < messages.length) {
      const timer = setTimeout(() => {
        // Alternate between user (right/blue) and assistant (left/gray)
        const isUser = currentIndex % 2 === 0;
        setVisibleMessages((prev) => [
          ...prev,
          { text: messages[currentIndex], isUser },
        ]);
        setCurrentIndex(currentIndex + 1);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, messages]);

  return (
    <div className="flex flex-col gap-2 p-4 max-w-2xl mx-auto">
      {visibleMessages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[75%] px-4 py-2 shadow-sm ${
              msg.isUser
                ? 'bg-[#0B93F6] text-white rounded-2xl rounded-br-sm'
                : 'bg-gray-200 text-gray-900 rounded-2xl rounded-bl-sm'
            }`}
          >
            <p className="text-sm leading-relaxed">{msg.text}</p>
            <span className="text-[10px] opacity-60 mt-1 block">
              {new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      ))}

      {showTyping && currentIndex < messages.length && (
        <div className="flex justify-start">
          <div className="bg-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
            <TypingDots />
          </div>
        </div>
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
}
