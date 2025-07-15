import React, { useState, useRef, useEffect } from 'react';
import axios from '../utils/axios';

const AITutor = ({ modernUI }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your AI Tutor. Ask me anything about grammar, vocabulary, or practice a conversation!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('/api/chatbot/chat', { message: input });
      setMessages(msgs => [...msgs, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      console.error('Chatbot error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.userMessage || 'Sorry, I could not reply right now.';
      setMessages(msgs => [...msgs, { sender: 'bot', text: errorMessage }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (modernUI) {
    // Modern glassmorphism chat tray
    return (
      <div className="flex flex-col h-[480px] w-full">
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-white/60 dark:bg-gray-900/60 rounded-b-3xl" style={{backdropFilter: 'blur(8px)'}}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-2xl px-4 py-2 max-w-xs whitespace-pre-line shadow-md text-sm transition-all ${msg.sender === 'user' ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}>{msg.text}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="flex gap-2 p-3 bg-white/80 dark:bg-gray-900/80 rounded-b-3xl border-t border-gray-200 dark:border-gray-800 sticky bottom-0">
          <textarea
            className="flex-1 input-field resize-none rounded-xl p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            rows={2}
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            style={{ minHeight: 36, maxHeight: 60 }}
          />
          <button
            className="btn-primary px-4 py-2 rounded-xl shadow-md"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ minWidth: 70 }}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    );
  }

  // Default style for standalone page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-8 px-2">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 flex flex-col" style={{ minHeight: 500 }}>
        <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-200 text-center">AI Tutor Chatbot</h2>
        <div className="flex-1 overflow-y-auto mb-4 px-2" style={{ maxHeight: 350 }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-xl px-4 py-2 max-w-xs whitespace-pre-line ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}>{msg.text}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="flex gap-2">
          <textarea
            className="flex-1 input-field resize-none rounded-xl p-2 border border-gray-300 dark:border-gray-700"
            rows={2}
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="btn-primary px-4 py-2 rounded-xl"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor; 