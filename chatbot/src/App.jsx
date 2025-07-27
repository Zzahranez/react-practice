import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  SunMoon,
  ClipboardCopy,
  Check,
  Trash2,
  Loader2,
} from 'lucide-react';

export default function App() {
  // 🧠 State utama
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]); // { role: 'user' | 'ai', text }
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  // Ganti dengan API_KEY kamu
  const API_KEY = 'AIzaSyCUpJVNDmBaI21f9SMfwGMq7QEsxlRcOFA';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  // Resize otomatis textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [prompt]);

  // Scroll otomatis ke bawah saat ada pesan baru
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fungsi streaming teks AI
  const streamText = (text, index) => {
    setIsStreaming(true);
    const words = text.split(' ');
    let idx = 0;

    const interval = setInterval(() => {
      setMessages(prev => {
        const arr = [...prev];
        arr[index] = { role: 'ai', text: (arr[index].text || '') + (idx === 0 ? '' : ' ') + words[idx] };
        return arr;
      });
      idx++;
      if (idx >= words.length) {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 50);
  };

  // Proses pengiriman dan penanganan respons AI
  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: prompt }]);
    setPrompt('');
    setLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada jawaban.';
      const index = messages.length + 1;

      setMessages(prev => [...prev, { role: 'ai', text: '' }]);
      streamText(aiText, index);

    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '❌ Error saat memproses.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Kirim saat tekan Enter
  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Copy pesan AI
  const copyToClipboard = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {}
  };

  // Reset chat
  const clearChat = () => {
    setMessages([]);
    setPrompt('');
    setMessageCount(0);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-80 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pink-400 rounded-full opacity-70 animate-bounce"></div>
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-green-400 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-600/10 to-cyan-600/10 rounded-full blur-3xl animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full" style={{backgroundImage: 'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.5) 1px,transparent 1px)', backgroundSize: '50px 50px'}}></div>
          </div>
        </div>

        {/* Container utama chat */}
        <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
          <div className="w-full max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full">
                  <Sparkles className="text-white w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Quantum AI Chat</h1>
                  <p className="text-gray-300 dark:text-gray-400">Powered by Gemini</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={clearChat} className="p-2 rounded-md border hover:bg-red-500 hover:text-white transition"><Trash2 /></button>
                <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-md border hover:bg-gray-700 transition"><SunMoon /></button>
              </div>
            </div>

            {/* Chat history */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto px-1 pb-2">
              {messages.map((msg, idx) => (
                <div key={idx}
                  className={`p-4 rounded-xl text-sm whitespace-pre-wrap relative ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto max-w-[70%]'
                      : 'bg-black/60 text-cyan-100 border border-cyan-500/10 max-w-[70%]'
                  }`}
                >
                  {msg.text}
                  {msg.role === 'ai' && (
                    <button onClick={() => copyToClipboard(msg.text, idx)}
                      className="absolute top-2 right-2 text-xs text-cyan-400 hover:text-white">
                      {copiedIndex === idx ? <Check size={16} /> : <ClipboardCopy size={16} />}
                    </button>
                  )}
                </div>
              ))}
              <div ref={bottomRef}></div>
            </div>

            {/* Input area */}
            <div className="mt-6 p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-cyan-500/20 shadow-2xl">
              <div className="relative mb-6">
                <textarea
                  ref={textareaRef}
                  rows="1"
                  placeholder="Ketik pertanyaan kamu..."
                  className="w-full p-4 pr-20 rounded-2xl border-2 border-cyan-500/30 bg-gray-900/50 focus:border-cyan-400 focus:ring focus:ring-cyan-400/20 text-white resize-none transition-all"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ minHeight: '60px', maxHeight: '200px' }}
                />
                <button
                  disabled={loading || !prompt.trim()}
                  onClick={handleSubmit}
                  className={`absolute bottom-4 right-4 p-3 rounded-xl transition ${
                    loading || !prompt.trim()
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg'
                  }`}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '⚡'}
                </button>
              </div>

              <p className="text-sm text-gray-300">
                Transmisi aktif: {messageCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
