import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { CATEGORIES } from '../lib/data';
import { isLevelUnlocked, isLevelCompleted, isDomainUnlocked } from '../lib/progress';
import { Lock, CheckCircle2, ChevronRight, ArrowLeft, Trophy, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export function DomainLevels() {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const domain = CATEGORIES.find(d => d.id === domainId);

  if (!domain) {
    return <div className="text-center py-20">Domain not found</div>;
  }

  const unlockedDom = isDomainUnlocked(domainId!);

  return (
    <div className="max-w-5xl mx-auto py-12 space-y-16 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px] -z-10"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/dashboard" className="side-nav-item !bg-white/5 !text-white border border-white/10 group">
          <Icons.ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase text-[10px] tracking-[2px]">Systems Overview</span>
        </Link>
        <div className="text-[10px] font-black uppercase tracking-[4px] text-primary bg-primary/5 px-6 py-2 rounded-full border border-primary/20">
          Domain Authorization: {unlockedDom ? 'GRANTED' : 'RESTRICTED'}
        </div>
      </div>

      <header className="flex flex-col md:flex-row items-start justify-between gap-12 border-b border-white/5 pb-16">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center border border-white/10 text-primary shadow-inner">
            <Icons.Layers size={48} strokeWidth={1} />
          </div>
          <div className="space-y-3">
            <div className="stat-label-dim text-primary">Active Sequence</div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">{domain.name}</h1>
            <p className="text-text-dim text-lg font-medium leading-relaxed max-w-xl">{domain.description}</p>
          </div>
        </div>
        
        <div className="w-full md:w-64 space-y-4">
           <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">Overall Mastery</span>
              <span className="text-xs font-bold text-primary">{(domain.levels.filter(l => isLevelCompleted(domain.id, l.id)).length / domain.levels.length * 100).toFixed(0)}%</span>
           </div>
           <div className="progress-rail h-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(domain.levels.filter(l => isLevelCompleted(domain.id, l.id)).length / domain.levels.length * 100)}%` }}
                className="progress-bar-fill" 
              />
           </div>
        </div>
      </header>

      {!unlockedDom && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 rounded-[2rem] bg-red-500/5 border border-red-500/20 flex items-center gap-6 text-red-500"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <Icons.Lock size={32} />
          </div>
          <div className="space-y-1">
            <span className="text-lg font-black uppercase tracking-tighter italic">Restricted Access</span>
            <p className="text-xs font-medium opacity-70 tracking-tight">Complete previous domain protocols to authorize access to these nodes.</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="stat-label-dim mb-4 tracking-[6px]">Node Sequence</div>
        {domain.levels.map((level, idx) => {
          const unlocked = unlockedDom && isLevelUnlocked(domain.id, level.id);
          const completed = isLevelCompleted(domain.id, level.id);

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={unlocked ? `/quiz/${domain.id}/${level.id}` : '#'}
                className={cn(
                  "flex items-center justify-between p-10 rounded-[2.5rem] border-2 transition-all duration-500",
                  unlocked 
                    ? "bg-white/[0.02] border-white/5 hover:border-primary/50 hover:bg-primary/[0.03] hover:-translate-x-2" 
                    : "bg-white/[0.01] border-white/[0.02] opacity-30 cursor-not-allowed grayscale",
                  completed && "border-green-500/40 bg-green-500/[0.02]"
                )}
                onClick={(e) => !unlocked && e.preventDefault()}
              >
                <div className="flex items-center gap-10">
                  <div className={cn(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black italic text-2xl border-2 transition-colors duration-500",
                    completed ? "bg-green-500/10 border-green-500/20 text-green-400" : (unlocked ? "bg-primary/10 border-primary/20 text-primary" : "bg-white/5 border-white/10 text-white/20")
                  )}>
                    0{level.levelNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-black text-3xl uppercase italic tracking-tighter">Node Protocol {level.levelNumber}</h3>
                      {completed && (
                        <div className="bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          <Icons.CheckCircle2 size={12} /> Verified
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="text-[10px] font-black uppercase tracking-[3px] text-text-dim">
                         {level.questions.length} Active Challenges
                       </span>
                       <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                       <span className="text-[10px] font-black uppercase tracking-[3px] text-primary">
                         Type: {idx === 0 ? 'Foundation' : (idx === domain.levels.length - 1 ? 'Terminal' : 'Expansion')}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {!unlocked ? (
                    <div className="stat-label-dim !text-red-500/40">Required: Clear Previous Node</div>
                  ) : (
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:text-primary transition-colors">
                      <Icons.ChevronRight size={24} />
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {unlockedDom && domain.levels.every(l => isLevelCompleted(domain.id, l.id)) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-16 rounded-[3rem] bg-primary/[0.03] border border-primary/20 text-center space-y-8 relative overflow-hidden backdrop-blur-sm"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          <Icons.Sparkles className="mx-auto text-primary" size={64} strokeWidth={1} />
          <div className="space-y-3">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">Domain Overload!</h2>
            <p className="text-text-dim text-lg font-medium max-w-xl mx-auto leading-relaxed">
              All node protocols in <span className="text-white">{domain.name}</span> have been synchronized. The next sequence has been promoted to your systems overview.
            </p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-minimal-filled px-12 py-5 text-xl">PROCEED TO NEXT PROTOCOL</button>
        </motion.div>
      )}

      {/* Domain Navigation Footer */}
      <footer className="pt-12 mt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 pb-12">
        <div className="text-center md:text-left">
          <div className="text-[10px] font-black uppercase tracking-[4px] text-text-dim mb-4">Jump Access Protocols</div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {CATEGORIES.map((cat, i) => {
              const isActive = cat.id === domainId;
              const isLocked = !isDomainUnlocked(cat.id);
              
              return (
                <Link
                  key={cat.id}
                  to={isLocked ? '#' : `/quiz/${cat.id}/levels`}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black italic text-sm transition-all duration-300 border-2",
                    isActive 
                      ? "bg-primary border-primary text-black scale-110 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]" 
                      : (isLocked ? "bg-white/5 border-white/10 text-white/10 cursor-not-allowed" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white")
                  )}
                  title={cat.name}
                  onClick={(e) => isLocked && e.preventDefault()}
                >
                  P{i + 1}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {(() => {
            const currentIdx = CATEGORIES.findIndex(d => d.id === domainId);
            const nextDomain = CATEGORIES[currentIdx + 1];
            
            if (nextDomain) {
              const nextLocked = !isDomainUnlocked(nextDomain.id);
              return (
                <button
                  disabled={nextLocked}
                  onClick={() => navigate(`/quiz/${nextDomain.id}/levels`)}
                  className={cn(
                    "btn-minimal py-5 px-8 rounded-2xl flex items-center gap-4 group",
                    nextLocked && "opacity-20 cursor-not-allowed"
                  )}
                >
                  <div className="text-left">
                    <div className="text-[9px] font-black tracking-[4px] uppercase opacity-50">Next Protocol Phase</div>
                    <div className="text-lg font-black uppercase italic tracking-tighter">{nextDomain.name}</div>
                  </div>
                  <Icons.ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              );
            }
            return null;
          })()}
        </div>
      </footer>
    </div>
  );
}
