import React, { useState } from 'react';
import { MessageCircle } from 'react-feather';
import AITutor from '../pages/AITutor';

const AITutorFloatingButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Modern Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed z-50 bottom-6 right-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl p-5 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-300 animate-pulse hover:scale-110 transition-transform duration-200"
        aria-label="Open AI Tutor"
        style={{ boxShadow: '0 8px 32px rgba(80,0,200,0.18)' }}
      >
        <MessageCircle size={32} />
      </button>
      {/* Modern Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
          <div className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl p-0 bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200 dark:border-gray-800 animate-slide-up">
            {/* Header with AI Avatar and Title */}
            <div className="flex items-center gap-3 px-6 pt-5 pb-3 border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/70 rounded-t-3xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                🤖
              </div>
              <div className="flex-1">
                <span className="font-semibold text-lg text-blue-700 dark:text-blue-200">AI Tutor</span>
                <div className="text-xs text-gray-500">Ask me anything or practice conversation!</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none"
                aria-label="Close AI Tutor"
              >
                ×
              </button>
            </div>
            {/* Chat Tray */}
            <div className="p-0">
              <AITutor modernUI />
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s; }
        @keyframes slide-up { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.25s cubic-bezier(.4,2,.6,1); }
      `}</style>
    </>
  );
};

export default AITutorFloatingButton; 