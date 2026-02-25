'use client';

import { useState } from 'react';

export default function VoiceDemo() {
  const [state, setState] = useState<'idle' | 'playing'>('idle');

  const demoText =
    'こんにちは！Chatweb.aiのAI音声合成です。LINE、Telegram、Webから使えるマルチモデルAIエージェントです。無料で100クレジットから始められます。ぜひ試してみてください。';

  const handlePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (state === 'playing') {
      window.speechSynthesis.cancel();
      setState('idle');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(demoText);
    utterance.lang = 'ja-JP';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onstart = () => setState('playing');
    utterance.onend = () => setState('idle');
    utterance.onerror = () => setState('idle');
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handlePlay}
      title="api.chatweb.ai/v1/speech/synthesize"
      className={`text-[10px] px-3 py-1 border flex items-center gap-1.5 transition-colors cursor-pointer ${
        state === 'playing'
          ? 'bg-[#ffaa00]/20 border-[#ffaa00]/60 text-[#ffaa00] animate-pulse'
          : 'bg-transparent border-[#ffaa00]/30 text-[#666] hover:border-[#ffaa00]/50 hover:text-[#ffaa00]'
      }`}
    >
      {state === 'playing' ? '⏹ 停止' : '🔊 音声デモ'}
    </button>
  );
}
