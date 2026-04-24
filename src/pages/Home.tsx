import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CATEGORIES } from '../lib/data';
import * as Icons from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn, getRank } from '../lib/utils';
import { isDomainUnlocked, getCompletedLevelsCount } from '../lib/progress';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export function Home() {
  const { user, userData } = useAuth();

  return (
    <div className="space-y-32 py-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      {/* Hero Section - Editorial Style */}
      <section className="text-center space-y-12 max-w-7xl mx-auto px-4 relative">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm shadow-xl">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#D4AF37]"></span>
            <span className="text-[10px] font-black uppercase tracking-[4px] text-text-dim">Global Cognitive Protocol v2.4</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-7xl md:text-[160px] font-black tracking-tighter leading-[0.8] text-white uppercase drop-shadow-2xl">
              CONQUER <br />
              <span className="text-primary italic">PROGRESSION.</span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-text-dim font-display uppercase tracking-[8px] text-xs font-bold">
              <span>Strategy</span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span>Knowledge</span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span>Dominance</span>
            </div>
          </div>

          <p className="text-xl md:text-2xl text-text-dim max-w-3xl mx-auto font-medium leading-relaxed tracking-tight">
            Only 1% reach Level 10. Are you one of them? Earn XP, climb ranks, and conquer the leaderboard in the world's most addictive quiz system.
          </p>
        </motion.div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-center gap-10 pt-8"
        >
          {user ? (
            <Link to="/dashboard" className="btn-minimal-filled text-lg group">
              INITIATE SEQUENCE <Icons.ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link to="/auth" className="btn-minimal-filled text-lg group">
              JOIN THE ELITE <Icons.UserPlus size={20} className="group-hover:scale-110 transition-transform" />
            </Link>
          )}
          
          <div className="flex flex-col items-center md:items-start text-left border-l border-white/10 pl-10">
            <span className="text-[10px] font-black uppercase tracking-[3px] text-text-dim mb-2 opacity-50">Global Standing</span>
            <Link to="/leaderboard" className="text-lg font-bold hover:text-primary transition-colors flex items-center gap-2 group">
              <Icons.Trophy size={18} className="text-primary group-hover:scale-110 transition-transform" /> View Rankings
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Ranks Teaser - Technical Style */}
      <section className="relative py-32 border-y border-white/[0.03] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-2">
                <div className="text-[10px] font-black text-primary uppercase tracking-[4px]">Advancement Path</div>
                <h2 className="text-5xl font-black uppercase tracking-tighter italic">Climb the Tiers</h2>
              </div>
              <p className="text-text-dim text-lg max-w-md">Precision is rewarded. Every perfect session accelerates your ascent to the Elite status.</p>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { name: 'Bronze', color: '#cd7f32', level: '1-2', perk: 'Base Rewards' },
                { name: 'Silver', color: '#c0c0c0', level: '3-4', perk: 'Double Stakes' },
                { name: 'Gold', color: '#D4AF37', level: '5-7', perk: 'Domain Master' },
                { name: 'Platinum', color: '#E5E4E2', level: '8-9', perk: 'System Overload' },
                { name: 'Elite', color: '#ffffff', level: '10+', perk: 'God Protocol' }
              ].map((rank, i) => (
                <motion.div 
                  key={rank.name} 
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] text-center space-y-6 group hover:border-primary/20 transition-all"
                >
                   <div 
                     className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center font-black text-3xl italic transition-all group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                     style={{ backgroundColor: `${rank.color}10`, color: rank.color, border: `1px solid ${rank.color}20` }}
                   >
                     {rank.name[0]}
                   </div>
                   <div className="space-y-4">
                      <div>
                        <div className="font-black uppercase tracking-widest text-xs" style={{ color: rank.color }}>{rank.name}</div>
                        <div className="text-[10px] text-text-dim font-bold mt-1 uppercase tracking-tighter">Level {rank.level}</div>
                      </div>
                      <div className="pt-4 border-t border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{rank.perk}</span>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Game Domains - Modern Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h2 className="text-5xl font-black tracking-tighter uppercase italic">Active Domains</h2>
            <p className="text-text-dim text-lg">Select a protocol to begin your cognitive advancement.</p>
          </div>
          <div className="text-xs font-black uppercase tracking-[3px] text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
            {CATEGORIES.length} Sequences Live
          </div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {CATEGORIES.map((cat) => {
            const Icon = (Icons as any)[cat.icon];
            const isLocked = !isDomainUnlocked(cat.id);
            const completedCount = getCompletedLevelsCount(cat.id);
            const totalLevels = cat.levels.length;
            const progressPercent = (completedCount / totalLevels) * 100;

            return (
              <motion.div key={cat.id} variants={item}>
                <Link 
                  to={isLocked ? '#' : `/quiz/${cat.id}/levels`}
                  className={cn(
                    "clean-card h-full flex flex-col items-start gap-8 group relative",
                    isLocked ? "opacity-40 grayscale pointer-events-none" : ""
                  )}
                >
                    <div className="flex justify-between w-full items-start">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                        isLocked ? "bg-white/5 border border-white/10 text-white/20" : "bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-bg-dark"
                      )}>
                        {isLocked ? <Icons.Lock size={30} /> : <Icon size={30} />}
                      </div>
                      <div className="text-[10px] font-black uppercase text-text-dim tracking-widest pl-4 text-right">
                        {cat.difficulty} Type
                      </div>
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      <h3 className="text-2xl font-black tracking-tighter uppercase italic group-hover:text-primary transition-colors">{cat.name}</h3>
                      <p className="text-text-dim text-sm leading-relaxed font-medium">{cat.description}</p>
                    </div>
                    
                    <div className="w-full space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">
                             {isLocked ? 'Restricted Access' : 'advancement'}
                           </span>
                           <span className={cn(
                             "text-[10px] font-black uppercase tracking-widest",
                             completedCount === totalLevels ? "text-green-400" : "text-primary"
                           )}>
                             {completedCount}/{totalLevels} Nodes
                           </span>
                        </div>
                        
                        <div className="progress-rail">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            className="progress-bar-fill"
                          />
                        </div>
                      </div>

                      <div className="btn-minimal w-full font-black text-[10px]">
                        {isLocked ? 'Locked Domain' : 'Enter Sequence'}
                      </div>
                    </div>
                    
                    {!isLocked && completedCount === totalLevels && (
                      <div className="absolute top-4 right-4 text-green-400">
                        <Icons.CheckCircle2 size={18} />
                      </div>
                    )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
