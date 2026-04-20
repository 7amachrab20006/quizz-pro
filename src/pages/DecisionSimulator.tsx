import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Send, Sparkles, AlertCircle, RefreshCw, Scale } from 'lucide-react';
import { analyzeDecision, DecisionResult } from '../services/geminiService';
import { cn } from '../lib/utils';

export function DecisionSimulator() {
  const [dilemma, setDilemma] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dilemma.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await analyzeDecision(dilemma, context);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze decision. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDilemma('');
    setContext('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 text-primary mb-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
        >
          <BrainCircuit size={40} />
        </motion.div>
        <h1 className="text-5xl font-black tracking-tight uppercase italic">Decision Advisor</h1>
        <p className="text-text-dim max-w-xl mx-auto">
          Input your real-life dilemmas and let our high-level AI logic evaluate the best course of action.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Input Side */}
        <section className="space-y-8">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="space-y-2">
              <label className="stat-label-dim">The Dilemma</label>
              <textarea 
                value={dilemma}
                onChange={(e) => setDilemma(e.target.value)}
                placeholder="e.g., Should I study for 2 more hours or go to sleep early?"
                className="w-full bg-bg-dark border border-border-dim rounded-xl p-4 min-h-[120px] focus:border-primary transition-colors outline-none resize-none text-sm leading-relaxed"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="stat-label-dim">Additional Context (Optional)</label>
              <textarea 
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Details like: I have an exam tomorrow at 8 AM, but I'm feeling very exhausted."
                className="w-full bg-bg-dark border border-border-dim rounded-xl p-4 min-h-[80px] focus:border-primary transition-colors outline-none resize-none text-xs leading-relaxed opacity-70"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !dilemma.trim()}
              className={cn(
                "btn-minimal-filled w-full text-lg py-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]",
                (loading || !dilemma.trim()) && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? <RefreshCw className="animate-spin" /> : <><Sparkles size={20} /> Analyze Logic</>}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-3"
              >
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Output Side */}
        <section className="relative">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="clean-card border-dashed flex flex-col items-center justify-center min-h-[400px] text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-text-dim opacity-30">
                  <Scale size={40} />
                </div>
                <div className="space-y-1">
                   <div className="text-sm font-bold uppercase tracking-widest text-text-dim opacity-50">Awaiting Input</div>
                   <p className="text-xs text-text-dim max-w-[200px] leading-relaxed">Evaluation will appear here once logic is processed.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="clean-card border-primary/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Confidence Score</span>
                  </div>
                  
                  <div className="flex items-center gap-6 mb-8 mt-4">
                    <div className="w-24 h-24 rounded-full border-4 border-bg-dark bg-primary flex items-center justify-center text-bg-dark font-black text-3xl shadow-[0_0_25px_rgba(212,175,55,0.3)]">
                      {result.decisionScore}
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs uppercase tracking-[3px] font-black text-text-dim">Recommendation</div>
                      <h3 className="text-2xl font-black text-primary leading-tight italic uppercase">{result.recommendation}</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="stat-label-dim">AI Reasoning</div>
                    <div className="text-sm text-text-main leading-relaxed font-medium bg-bg-dark/50 p-6 rounded-xl border border-border-dim">
                      {result.reasoning}
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end">
                    <button onClick={reset} className="btn-minimal text-[10px]">
                      New Simulation <RefreshCw size={12} className="ml-1" />
                    </button>
                  </div>

                  {/* Aesthetic grid overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                </div>
                
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center italic text-[10px] text-text-dim">
                  * Analysis powered by Gemini Decision-Logic Engine V4
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
