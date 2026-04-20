import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../lib/data';
import * as Icons from 'lucide-react';
import { formatDate, cn, getRank } from '../lib/utils';
import { LEVEL_THRESHOLDS } from '../lib/constants';

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
    <div className="space-y-12 h-full flex flex-col pb-12">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border-dim pb-8 gap-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-6"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-bg-dark border border-border-dim overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              {userData.photoURL ? (
                <img src={userData.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/5">
                  <Icons.User size={32} className="text-primary opacity-40" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-bg-dark text-[10px] font-black w-8 h-8 rounded-lg flex items-center justify-center border-4 border-bg-dark shadow-xl">
              L{currentLevel}
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-light tracking-tight">Welcome back, <span className="font-bold underline decoration-primary decoration-4 underline-offset-8">{userData.username}.</span></h1>
            <p className="text-text-dim text-sm">Level {currentLevel} Scholar • {currentXP} Total XP</p>
          </div>
        </motion.div>
        
        <div className="text-right w-full md:w-64 space-y-2">
           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-dim mb-1">
              <span>Progress to L{currentLevel + 1}</span>
              <span className="text-primary">{currentXP - prevXP} / {nextXP - prevXP} XP</span>
           </div>
           <div className="progress-rail h-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="progress-bar-fill shadow-[0_0_10px_rgba(212,175,55,0.3)] transition-all" 
              />
           </div>
           {currentLevel < 5 && (
             <div className="text-[9px] text-text-dim/60 italic">Next unlock available at Level {currentLevel + Math.max(1, (CATEGORIES.find(c => c.requiredLevel > currentLevel)?.requiredLevel || currentLevel) - currentLevel)}</div>
           )}
        </div>
      </header>

      {/* Stats Strip */}
      <section className="stats-strip grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="clean-card bg-card-bg/50">
          <span className="stat-label-dim block mb-2">Overall Accuracy</span>
          <span className="stat-value-gold text-3xl">{Math.round((userData.avgScore || 0) * 100)}%</span>
        </div>
        <div className="clean-card bg-card-bg/50">
          <span className="stat-label-dim block mb-2">Active Streak</span>
          <div className="flex items-center gap-2">
            <span className="stat-value-gold text-3xl">{userData.streak || 0}</span>
            {(userData.streak || 0) > 0 && (
              <span className="text-[10px] font-black px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded border border-orange-500/20">
                {Math.round((1 + (Math.min(userData.streak, 10) * 0.1)) * 10) / 10}x XP
              </span>
            )}
          </div>
        </div>
        <div className="clean-card bg-card-bg/50">
          <span className="stat-label-dim block mb-2">Knowledge Rank</span>
          <span className="stat-value-gold text-3xl">{getRank(userData.level || 1)}</span>
        </div>
      </section>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1">
        {CATEGORIES.map((cat) => {
           const Icon = (Icons as any)[cat.icon];
           const isLocked = currentLevel < cat.requiredLevel;
           
           return (
             <div key={cat.id} className="relative h-full">
               <Link 
                  to={isLocked ? '#' : `/quiz/${cat.id}`} 
                  className={cn(
                    "clean-card flex flex-col justify-between h-full group h-full transition-all duration-300",
                    isLocked ? "bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed grayscale" : "hover:scale-[1.02] active:scale-[0.98]"
                  )}
               >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className={cn(
                        "text-2xl transition-transform origin-left",
                        !isLocked && "group-hover:scale-110"
                      )}>
                        <Icon size={32} strokeWidth={1.5} className={isLocked ? "text-text-dim" : "text-primary"} />
                      </div>
                      {isLocked && <Icons.Lock size={18} className="text-text-dim/40" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-1">{cat.name}</h3>
                      <p className="text-[10px] text-text-dim uppercase tracking-[1px] font-black">{cat.difficulty}</p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {isLocked ? (
                      <div className="w-full py-2 px-4 rounded bg-white/5 border border-white/5 text-center">
                        <span className="text-[10px] font-black uppercase text-text-dim tracking-wider">Unlock at Level {cat.requiredLevel}</span>
                      </div>
                    ) : (
                      <button className="btn-minimal w-full">Enter Domain</button>
                    )}
                  </div>
               </Link>
             </div>
           );
        })}
      </div>

      {/* Recent Activity Footnote */}
      <footer className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          Last Attempt: <strong className="text-primary">{userData.lastQuizzes?.[0]?.category || 'None'}</strong>
        </div>
        <div className="flex gap-8 items-center">
          <div className="text-xs uppercase tracking-widest text-text-dim">Score: <span className="text-green-400 font-bold">{userData.lastScore || 'N/A'}</span></div>
          <div className="text-[10px] font-black px-2 py-0.5 border border-red-500/50 text-red-500 rounded uppercase tracking-tighter">Verified Result</div>
        </div>
      </footer>
    </div>
  );
}
