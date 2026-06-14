import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function Captcha({ onChange }) {
  const [code, setCode] = useState('');

  const generateCaptcha = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
    onChange(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div 
        className="flex items-center justify-center font-mono font-bold tracking-widest text-xl px-5 py-2.5 bg-slate-900 border border-slate-700/80 text-gold-400 select-none rounded-lg shadow-inner"
        style={{
          textShadow: '2px 2px 3px rgba(0,0,0,0.8)',
          letterSpacing: '0.3em',
          backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '16px 16px',
        }}
      >
        <span className="italic transform -rotate-3 select-none line-through decoration-slate-600 decoration-wavy">{code}</span>
      </div>
      <button 
        type="button" 
        onClick={generateCaptcha} 
        className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700 transition-all duration-200"
        title="Refresh Captcha"
      >
        <RefreshCw size={18} />
      </button>
    </div>
  );
}
