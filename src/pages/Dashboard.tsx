import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../lib/data';
import * as Icons from 'lucide-react';
import { formatDate, cn, getRank } from '../lib/utils';
import { LEVEL_THRESHOLDS } from '../lib/constants';
import { isDomainUnlocked, getCompletedLevelsCount } from '../lib/progress';

export function Dashboard() {
  const { user, userData, loading } = useAuth();

  if (loading) return (
     <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
     </div>
  );

  if (!user || !userData) return (
     <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
        <div className="text-primary opacity-20"><Icons.ShieldAlert size={64} /></div>
        <div className="space-y-2">
           <h2 className="text-2xl font-bold tracking-tight">Identity Records Not Found</h2>
           <p className="text-text-dim text-sm max-w-xs">We encountered an issue synchronizing your scholarly profile. Please try re-authenticating.</p>
        </div>
        <Link to="/auth" className="btn-minimal px-8">Return to Portal</Link>
     </div>
  );

  const currentLevel = userData.level || 1;
  const currentXP = userData.xp || 0;
  const nextXP = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const prevXP = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const progress = ((currentXP - prevXP) / (nextXP - prevXP)) * 100;

  return (
    <div className="space-y-12 h-full flex flex-col pb-12 relative">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-10 gap-8 relative">
        <div className="absolute -bottom-[1px] left-0 w-32 h-[1px] bg-primary shadow-[0_0_10px_#D4AF37]"></div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-8"
        >
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-card-bg/80 border border-white/10 p-1 shadow-card group-hover:border-primary/50 transition-all duration-500 overflow-hidden">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-bg-dark flex items-center justify-center">
                {userData.photoURL ? (
                  <img src={userData.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <Icons.User size={40} className="text-primary/30" />
                )}
              </div>
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              className="absolute -bottom-3 -right-3 bg-primary text-bg-dark text-[10px] font-black w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-bg-dark shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              L{currentLevel}
            </motion.div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">
              Scholar <span className="text-primary">{userData.username}.</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i <= currentLevel % 5 + 1 ? "bg-primary" : "bg-white/10")} />
                ))}
              </div>
              <p className="text-text-dim text-[10px] uppercase font-black tracking-[2px]">{getRank(currentLevel)} Class</p>
            </div>
          </div>
        </motion.div>
        
        <div className="text-right w-full md:w-80 space-y-4">
           <div className="flex justify-between items-end mb-1">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-dim block mb-1">XP Advancement</span>
                <span className="text-xs font-bold text-white tracking-widest">{currentXP} <span className="text-text-dim font-medium">Accumulated</span></span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">L{currentLevel + 1} Target</span>
                <span className="text-xs font-bold text-white tracking-widest">{nextXP - currentXP} <span className="text-text-dim font-medium">Remain</span></span>
              </div>
           </div>
           <div className="progress-rail h-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="progress-bar-fill" 
              />
           </div>
        </div>
      </header>

      {/* Stats Strip */}
      <section className="stats-strip grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Avg Accuracy', value: `${Math.round((userData.avgScore || 0) * 100)}%`, icon: 'Target' },
          { label: 'Active Streak', value: userData.streak || 0, icon: 'Flame', subValue: userData.streak > 0 ? `${Math.round((1 + (Math.min(userData.streak, 10) * 0.1)) * 10) / 10}x XP` : null },
          { label: 'Knowledge Rank', value: getRank(currentLevel), icon: 'Medal' },
          { label: 'Total Quizzes', value: userData.totalQuizzes || 0, icon: 'Layout' }
        ].map((stat, i) => {
          const Icon = (Icons as any)[stat.icon];
          return (
            <motion.div 
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="clean-card flex items-center justify-between group"
            >
              <div>
                <span className="stat-label-dim block mb-2">{stat.label}</span>
                <div className="flex items-center gap-3">
                  <span className="stat-value-gold text-2xl">{stat.value}</span>
                  {stat.subValue && (
                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded uppercase">
                      {stat.subValue}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl text-white/20 group-hover:text-primary transition-colors">
                <Icon size={20} />
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {CATEGORIES.map((cat, i) => {
           const Icon = (Icons as any)[cat.icon];
           const isLocked = !isDomainUnlocked(cat.id);
           const completedCount = getCompletedLevelsCount(cat.id);
           const totalLevels = cat.levels.length;
           const progressPercent = (completedCount / totalLevels) * 100;
           
           return (
             <motion.div 
               key={cat.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 + (i * 0.05) }}
               className="relative group"
             >
               <Link 
                  to={isLocked ? '#' : `/quiz/${cat.id}/levels`} 
                  className={cn(
                    "clean-card flex flex-col justify-between h-full relative overflow-hidden transition-all duration-500",
                    isLocked ? "opacity-40 grayscale pointer-events-none" : "hover:-translate-y-2"
                  )}
               >
                  {/* Subtle Background Icon */}
                  <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                    <Icon size={120} strokeWidth={1} />
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-bg-dark transition-all duration-300">
                        {isLocked ? <Icons.Lock size={24} /> : <Icon size={24} />}
                      </div>
                      {!isLocked && completedCount === totalLevels && (
                        <div className="bg-green-500/10 p-1.5 rounded-lg border border-green-500/20 text-green-500">
                           <Icons.CheckCircle2 size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-xl uppercase italic tracking-tighter leading-tight mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                      <p className="text-[10px] text-text-dim uppercase tracking-[2px] font-black">{cat.difficulty} PROTOCOL</p>
                    </div>
                  </div>

                  <div className="mt-12 space-y-6 relative z-10">
                    <div className="space-y-3">
                       <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-text-dim">
                          <span>Advancement</span>
                          <span className="text-white">{completedCount}/{totalLevels} Nodes</span>
                       </div>
                       <div className="progress-rail h-1.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            className="progress-bar-fill"
                          />
                       </div>
                    </div>

                    <div className="btn-minimal w-full font-black text-[9px]">
                      {isLocked ? 'Locked Domain' : 'Enter Sequence'}
                    </div>
                  </div>
               </Link>
             </motion.div>
           );
        })}
      </div>

      {/* Special Advisor Section */}
      <section className="mt-12">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-px bg-white/10 flex-1"></div>
           <div className="text-[10px] font-black uppercase tracking-[5px] text-primary/60">Auxiliary Protocols</div>
           <div className="h-px bg-white/10 flex-1"></div>
        </div>
        
        <Link to="/simulator" className="clean-card group flex flex-col md:flex-row items-center justify-between gap-10 hover:border-primary/40 transition-all duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[200px] -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-all"></div>
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-bg-dark transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <Icons.BrainCircuit size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">AI Decision Advisor</h3>
              <p className="text-text-dim max-w-md text-sm leading-relaxed">
                Utilize high-level cognitive synthesis to evaluate real-world dilemmas through multiple layers of logic.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3 relative z-10 w-full md:w-auto">
            <div className="btn-minimal px-10 group-hover:bg-primary group-hover:text-bg-dark transition-colors">Launch Module</div>
            <div className="text-[8px] font-black uppercase tracking-[3px] text-text-dim text-right pr-2">Neural Engine V4.0</div>
          </div>
        </Link>
      </section>
 
       {/* Activity Summary */}
      <footer className="mt-12 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
            <Icons.Calendar size={24} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-black tracking-[2px] text-text-dim mb-1">Last Operational Cycle</div>
            <div className="font-black text-xl uppercase tracking-tighter italic">
              {userData.lastQuizzes?.[0]?.category || 'Zero Data Found'}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-12">
          <div className="text-center">
            <div className="text-[10px] uppercase font-black tracking-[2px] text-text-dim mb-1">Result</div>
            <div className="text-2xl font-black text-green-400 italic italic tracking-tighter">{userData.lastScore || '---'}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase font-black tracking-[2px] text-text-dim mb-1">Timestamp</div>
            <div className="text-2xl font-black text-white italic tracking-tighter uppercase">{userData.lastQuizzes?.[0]?.date ? formatDate(userData.lastQuizzes[0].date) : 'N/A'}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
