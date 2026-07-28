import React from 'react';
import { Bot, Cpu, Sparkles, Activity, Shield } from 'lucide-react';

const AuthVisual = ({ title = "ACE YOUR INTERVIEW.", subtitle = "AI-powered mock interview simulator for technical and behavioral practice." }) => {
  return (
    <div className="flex flex-col justify-between h-full w-full py-4 lg:py-6 text-slate-100">
      {/* Top Brand Logo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
            <Bot className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white font-mono">
            INTERVIEW<span className="text-slate-400">.AI</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-[#161926] px-3 py-1.5 rounded-full border border-slate-800 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping"></span>
          <span>SYSTEM_READY</span>
        </div>
      </div>

      {/* Center 3D Animated AI Model & Waveform Display */}
      <div className="my-8 lg:my-auto flex flex-col items-center justify-center relative">
        {/* 3D Animated Orb Core */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center perspective-1000">
          
          {/* Outer Rotating Ring 1 */}
          <div className="absolute inset-0 rounded-full border border-slate-700/60 border-dashed animate-[spin_20s_linear_infinite]"></div>

          {/* Outer Rotating Ring 2 (Tilted 3D perspective effect) */}
          <div className="absolute inset-4 rounded-full border border-slate-600/40 animate-[spin_12s_linear_infinite_reverse] [transform:rotateX(60deg)_rotateY(15deg)]"></div>
          
          {/* Outer Rotating Ring 3 */}
          <div className="absolute inset-8 rounded-full border border-slate-500/30 animate-[spin_16s_linear_infinite] [transform:rotateX(25deg)_rotateY(60deg)]"></div>

          {/* Inner Glowing Core Container */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#161926] border border-slate-700 flex flex-col items-center justify-center shadow-2xl relative z-10 backdrop-blur-sm animate-[pulse_4s_ease-in-out_infinite]">
            <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-2" />
            
            {/* Animated Audio Equalizer Bars */}
            <div className="flex items-end gap-1 h-5">
              <span className="w-1 bg-slate-300 rounded-full animate-[bounce_1s_infinite_100ms] h-3"></span>
              <span className="w-1 bg-white rounded-full animate-[bounce_1s_infinite_300ms] h-5"></span>
              <span className="w-1 bg-slate-400 rounded-full animate-[bounce_1s_infinite_200ms] h-4"></span>
              <span className="w-1 bg-white rounded-full animate-[bounce_1s_infinite_400ms] h-2"></span>
              <span className="w-1 bg-slate-300 rounded-full animate-[bounce_1s_infinite_150ms] h-4"></span>
            </div>
          </div>

          {/* Floating Floating Satellite Badges (Responsive Positioned) */}
          <div className="absolute -top-2 -right-2 sm:right-0 bg-[#161926] border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono shadow-lg animate-bounce [animation-duration:3s]">
            <Cpu className="w-3.5 h-3.5 text-slate-300" />
            <span>AI Core v4.2</span>
          </div>

          <div className="absolute -bottom-2 -left-2 sm:left-0 bg-[#161926] border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono shadow-lg animate-bounce [animation-duration:4s]">
            <Activity className="w-3.5 h-3.5 text-slate-300" />
            <span>Voice Speech Ready</span>
          </div>
        </div>

        {/* Headline Below Visual */}
        <div className="text-center mt-8 max-w-md">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            {title}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-normal leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="flex items-center justify-between text-xs text-slate-600 font-mono border-t border-slate-900 pt-4">
        <span>INTERVIEW.AI</span>
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5" />
          Encrypted & Secure
        </span>
      </div>
    </div>
  );
};

export default AuthVisual;
