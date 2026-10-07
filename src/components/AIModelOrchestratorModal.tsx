import React, { useState } from 'react';
import { AIModel } from '../types';
import { AI_MODELS_REGISTRY } from '../data/mockData';
import { sounds } from '../utils/audioSynth';

interface AIModelOrchestratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: 'AUTO' | 'FAST' | 'QUALITY' | 'CREATIVE' | 'CONTROL';
  onChangeProfile: (profile: 'AUTO' | 'FAST' | 'QUALITY' | 'CREATIVE' | 'CONTROL') => void;
  onTestModel: (model: AIModel) => void;
}

export const AIModelOrchestratorModal: React.FC<AIModelOrchestratorModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onChangeProfile,
  onTestModel,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [testingModelId, setTestingModelId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Models' },
    { id: 'vision', label: 'Vision & Masking' },
    { id: 'audio', label: 'Audio & Stems' },
    { id: 'orchestration', label: 'Orchestrators' },
    { id: 'video', label: 'Motion & Slow-Mo' },
  ];

  const filteredModels = selectedCategory === 'all'
    ? AI_MODELS_REGISTRY
    : AI_MODELS_REGISTRY.filter((m) => m.category === selectedCategory);

  const handleRunModelTest = (model: AIModel) => {
    sounds.playMakeItFire();
    setTestingModelId(model.id);
    setTimeout(() => {
      setTestingModelId(null);
      sounds.playEquip();
      onTestModel(model);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="relative w-full max-w-3xl rounded-xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 via-sky-500 to-indigo-500 flex items-center justify-center text-white text-base shadow-md shadow-sky-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  AI Model Orchestrator & Multi-Model Registry
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                  SECTION 12-14 PRD
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pluggable specialized neural architectures powering background removal, stem separation, and rhythmic cutting.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Multi-Model Profile Strategy Bar (Section 13) */}
        <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">
              Orchestration Strategy:
            </span>
            <span className="text-[11px] text-slate-400">
              Auto-selects optimal models based on latency and task complexity
            </span>
          </div>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            {(['AUTO', 'FAST', 'QUALITY', 'CREATIVE', 'CONTROL'] as const).map((prof) => (
              <button
                key={prof}
                onClick={() => {
                  sounds.playSelect();
                  onChangeProfile(prof);
                }}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-all cursor-pointer ${
                  activeProfile === prof
                    ? 'bg-sky-500 text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {prof}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playSelect();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
                      {model.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">{model.version}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 shrink-0">
                    {model.benchmarkScore}% ACCURACY
                  </span>
                </div>
                <p className="text-xs font-medium text-sky-300/90 mt-1.5 leading-snug">
                  {model.specialty}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {model.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  Latency: ~{model.latencyMs}ms
                </span>
                <button
                  onClick={() => handleRunModelTest(model)}
                  disabled={testingModelId === model.id}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-sky-500 hover:text-black text-slate-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  {testingModelId === model.id ? 'Running Test...' : 'Trigger Pipeline ⚡'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Evaluation Benchmark Note (Section 56) */}
        <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span>Automated Model Verification Engine: Active (Evaluates PSNR, Temporal Consistency & Audio LRA)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs cursor-pointer transition-all"
          >
            Apply & Return
          </button>
        </div>

      </div>
    </div>
  );
};
