import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flame, Coffee, Bell } from 'lucide-react';
import Card from './Card';

/**
 * Unique Feature: Integrated Student Pomodoro Study Timer
 * Allows students to time their assignments directly while completing tasks.
 * Uses Web Audio API for a subtle pleasant chime when timer completes.
 */
export default function PomodoroTimer() {
  const [mode, setMode] = useState('work'); // 'work' (25 min) or 'break' (5 min)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const timerRef = useRef(null);

  // Play a simple synthesized audio chime
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio chime not available', e);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playChime();

            if (mode === 'work') {
              setSessionsCompleted((s) => s + 1);
              setMode('break');
              return 5 * 60;
            } else {
              setMode('work');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <Card
      title="Focus Pomodoro"
      icon={<Flame className="w-5 h-5 text-amber-400" />}
      className="bg-slate-900/60 border-amber-500/20"
      action={
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
          {sessionsCompleted} Cycles Done
        </span>
      }
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Mode Toggle Buttons */}
        <div className="inline-flex p-1 bg-slate-950/70 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => switchMode('work')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              mode === 'work'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            25m Study Focus
          </button>
          <button
            type="button"
            onClick={() => switchMode('break')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              mode === 'break'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            5m Refresh Break
          </button>
        </div>

        {/* Digital Clock Display */}
        <div className="relative py-2">
          <span className="text-5xl font-mono font-black tracking-tight text-white drop-shadow-md">
            {formattedTime}
          </span>
          <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
            {isRunning ? (mode === 'work' ? 'Deep Work Session' : 'Recharging...') : 'Paused'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              mode === 'work' ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition shadow-lg active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pause' : 'Start Focus'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition border border-slate-700"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
