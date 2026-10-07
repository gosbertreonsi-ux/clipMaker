import React, { useState } from 'react';
import { UserMode, ProjectSettings } from '../types';
import { sounds } from '../utils/audioSynth';

interface StudioHeaderProps {
  userMode: UserMode;
  onSetUserMode: (mode: UserMode) => void;
  projectSettings: ProjectSettings;
  onChangeProjectName: (name: string) => void;
  onExecuteAICommand: (command: string) => void;
  onOpenImport: () => void;
  onOpenMakeItFire: () => void;
  onOpenExport: () => void;
  onOpenModelOrchestrator: () => void;
  hasUnsavedChanges: boolean;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  userMode,
  onSetUserMode,
  projectSettings,
  onChangeProjectName,
  onExecuteAICommand,
  onOpenImport,
  onOpenMakeItFire,
  onOpenExport,
  onOpenModelOrchestrator,
  hasUnsavedChanges,
}) => {
  const [commandText, setCommandText] = useState('');
  const [showCommandSuggestions, setShowCommandSuggestions] = useState(false);

  const SUGGESTED_COMMANDS = [
    'Make cuts follow the beat',
    'Make this feel cinematic with teal/orange grade',
    'Turn this into a viral 9:16 TikTok reel',
    'Add speed ramps on musical drops',
    'Make the first 3 seconds a high-retention hook',
    'Remove low-motion shots and keep the best clips',
  ];

  const handleSubmitCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commandText.trim()) return;
    sounds.playMakeItFire();
    onExecuteAICommand(commandText);
    setCommandText('');
    setShowCommandSuggestions(false);
  };

  const handleSelectSuggestion = (cmd: string) => {
    sounds.playMakeItFire();
    onExecuteAICommand(cmd);
    setCommandText('');
    setShowCommandSuggestions(false);
  };

  return (
    <header className="relative z-40 w-full bg-[#0a0d14] border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between gap-4 select-none">
      {/* Left: Brand & Project Name */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h4v16H4V4zm6 0h4v16h-4V4zm6 0h4v16h-4V4z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold tracking-tight text-white font-sans">
                VIZMOTION<span className="text-sky-400 font-extrabold ml-1">AI</span>
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800/60 font-medium">
                PRO
              </span>
            </div>
          </div>
        </div>

        <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

        {/* Project Title Input */}
        <div className="hidden md:flex items-center gap-2">
          <input
            type="text"
            value={projectSettings.name}
            onChange={(e) => onChangeProjectName(e.target.value)}
            className="text-xs font-medium text-slate-200 bg-transparent hover:bg-slate-900 focus:bg-slate-900 border border-transparent focus:border-slate-700 rounded px-2 py-1 outline-none transition-all w-44 truncate"
            title="Rename Project"
          />
          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Saved
          </span>
        </div>
      </div>

      {/* Center: AI Command Bar (Section 5 of PRD) */}
      <div className="flex-1 max-w-xl relative">
        <form onSubmit={handleSubmitCommand} className="relative">
          <div className="relative flex items-center">
            <div className="absolute left-3 text-sky-400 flex items-center pointer-events-none">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
              </svg>
            </div>
            <input
              type="text"
              value={commandText}
              onChange={(e) => setCommandText(e.target.value)}
              onFocus={() => setShowCommandSuggestions(true)}
              placeholder="What do you want to create? (e.g. 'Make cuts follow the beat', 'Add speed ramps')"
              className="w-full pl-9 pr-24 py-1.5 bg-slate-900/90 border border-slate-700/80 focus:border-sky-500 rounded-lg text-xs text-slate-100 placeholder-slate-400 outline-none shadow-inner transition-all"
            />
            <button
              type="submit"
              disabled={!commandText.trim()}
              className="absolute right-1.5 px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-black font-semibold text-[11px] cursor-pointer transition-all"
            >
              Apply AI
            </button>
          </div>
        </form>

        {/* Command Suggestions Dropdown */}
        {showCommandSuggestions && (
          <div
            onMouseLeave={() => setShowCommandSuggestions(false)}
            className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 border border-slate-700/90 rounded-lg shadow-2xl p-2 z-50 backdrop-blur-md space-y-1 animate-fadeIn"
          >
            <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-800">
              <span>QUICK AI ACTIONS</span>
              <button
                onClick={() => setShowCommandSuggestions(false)}
                className="hover:text-slate-200 cursor-pointer"
              >
                esc
              </button>
            </div>
            {SUGGESTED_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleSelectSuggestion(cmd)}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800/80 text-xs text-slate-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>{cmd}</span>
                <span className="text-[10px] text-sky-400 font-mono">⚡ Instant</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Mode Switcher & Primary Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Model Orchestrator Trigger Button */}
        <button
          onClick={() => {
            sounds.playSelect();
            onOpenModelOrchestrator();
          }}
          title="Open AI Model Orchestrator (SAM-2, Whisper Turbo, Demucs v4, Depth Anything)"
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/70 border border-purple-600/60 text-purple-200 hover:bg-purple-900/60 text-xs font-medium cursor-pointer transition-all shadow-sm"
        >
          <span className="text-purple-400">⚡</span>
          <span>Models: <strong className="font-mono text-white">{projectSettings.activeModelProfile || 'AUTO'}</strong></span>
        </button>

        {/* User Mode Switcher (Section 4 of PRD) */}
        <div className="hidden xl:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          {(['QUICK', 'EDIT', 'PRO'] as UserMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                sounds.playSelect();
                onSetUserMode(mode);
              }}
              className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                userMode === mode
                  ? 'bg-slate-800 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode === 'QUICK' ? 'Quick' : mode === 'EDIT' ? 'Edit' : 'Pro'}
            </button>
          ))}
        </div>

        {/* Import Media Button */}
        <button
          onClick={() => {
            sounds.playSelect();
            onOpenImport();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-200 text-xs font-medium cursor-pointer transition-all"
        >
          <svg className="w-3.5 h-3.5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <span>Import</span>
        </button>

        {/* Flagship: MAKE IT FIRE 🔥 */}
        <button
          onClick={() => {
            sounds.playMakeItFire();
            onOpenMakeItFire();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-black font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <span>🔥</span>
          <span>Make It Fire</span>
        </button>

        {/* Export Button */}
        <button
          onClick={() => {
            sounds.playSelect();
            onOpenExport();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
          </svg>
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
