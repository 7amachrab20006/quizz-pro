import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CATEGORIES } from '../lib/data';
import * as Icons from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn, getRank } from '../lib/utils';

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
    <div className="space-y-24 py-12">
      {/* Hero Section - Gaming Focus */}
      <section className="text-center space-y-8 max-w-5xl mx-auto px-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-6"
        >
          <div className="inline-block px-10 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-[10px] font-black uppercase tracking-[4px] text-primary mb-6 animate-pulse">
            The Ultimate Cognitive Battle
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-8 text-white uppercase drop-shadow-2xl">
            Only 1% reach <br />
            <span className="text-primary italic font-serif">Level 10.</span>
          </h1>
          <p className="text-2xl text-text-dim max-w-2xl mx-auto font-medium leading-relaxed tracking-tight">
            Are you one of them? Earn XP, climb ranks, and conquer the leaderboard in the world's most addictive quiz system.
          </p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 pt-10"
        >
          {user ? (
            <Link to="/dashboard" className="btn-minimal-filled text-xl py-6 px-16 rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              START QUIZ NOW <Icons.Gamepad2 size={24} className="ml-2" />
            </Link>
          ) : (
            <Link to="/auth" className="btn-minimal-filled text-xl py-6 px-16 rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              JOIN THE ELITE <Icons.UserPlus size={24} className="ml-2" />
            </Link>
          )}
          
          <div className="flex flex-col items-center md:items-start text-left">
            <span className="text-[10px] font-black uppercase tracking-[3px] text-text-dim mb-1">Global Standing</span>
            <Link to="/leaderboard" className="text-lg font-bold border-b-2 border-primary/50 pb-1 hover:border-primary transition-colors flex items-center gap-2">
              <Icons.Trophy size={18} className="text-primary" /> View Leaderboard
            </Link>
          </div>
        </motion.div>

        {/* User Progress Teaser if Logged In */}
        {user && userData && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 p-8 rounded-2xl bg-card-bg/50 border border-primary/20 max-w-md mx-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-text-dim">Current Rank</span>
              <span className="text-primary font-bold">{getRank(userData.level || 1)}</span>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="text-3xl font-black italic">L{userData.level || 1}</div>
              <div className="flex-1">
                 <div className="progress-rail h-3 bg-bg-dark border border-white/5">
                    <div className="progress-bar-fill shadow-[0_0_15px_rgba(212,175,55,0.5)]" style={{ width: '45%' }}></div>
                 </div>
              </div>
            </div>
            <div className="text-[10px] text-text-dim font-bold uppercase tracking-tighter">Your next unlock is 120 XP away</div>
          </motion.div>
        )}
      </section>

      {/* Grid of Ranks - Teaser */}
      <section className="bg-gradient-to-b from-transparent to-bg-dark py-24 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-4">
           <div className="text-center mb-16 space-y-2">
              <h2 className="text-5xl font-black uppercase tracking-tighter italic">Climb the Tiers</h2>
              <p className="text-text-dim text-lg">Every correct answer brings you closer to the Gold Rank.</p>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { name: 'Bronze', color: '#cd7f32', level: '1-2' },
                { name: 'Silver', color: '#c0c0c0', level: '3-4' },
                { name: 'Gold', color: '#D4AF37', level: '5-7' },
                { name: 'Platinum', color: '#E5E4E2', level: '8-9' },
                { name: 'Elite', color: '#ffffff', level: '10+' }
              ].map((rank, i) => (
                <div key={rank.name} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center space-y-4 group hover:border-primary/40 transition-colors">
                   <div 
                     className="w-16 h-16 mx-auto rounded-full flex items-center justify-center font-black text-2xl italic group-hover:scale-110 transition-transform"
                     style={{ backgroundColor: `${rank.color}20`, color: rank.color, border: `2px solid ${rank.color}40` }}
                   >
                     {rank.name[0]}
                   </div>
                   <div>
                      <div className="font-bold uppercase tracking-widest text-xs" style={{ color: rank.color }}>{rank.name}</div>
                      <div className="text-[10px] text-text-dim font-bold mt-1">Level {rank.level}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Game Domains - The Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12 border-b border-border-dim pb-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-bold tracking-tight">Active Domains</h2>
            <p className="text-text-dim text-sm">Select a category to begin your advancement.</p>
          </div>
          <div className="stat-label-dim font-black">{CATEGORIES.length} Domains Available</div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {CATEGORIES.map((cat) => {
            const Icon = (Icons as any)[cat.icon];
            return (
              <motion.div key={cat.id} variants={item}>
                <div className="clean-card h-full flex flex-col items-start gap-6 group relative">
                    <div className="w-14 h-14 bg-bg-dark border border-border-dim rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-bg-dark transition-all duration-300">
                      <Icon size={28} />
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{cat.name}</h3>
                      <p className="text-text-dim text-sm leading-relaxed">{cat.description}</p>
                    </div>
                    
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">Difficulty</span>
                         <span className={cn(
                           "text-[10px] font-black uppercase tracking-widest",
                           cat.difficulty === 'Easy' ? "text-green-500" :
                           cat.difficulty === 'Medium' ? "text-yellow-500" :
                           "text-red-500"
                         )}>
                           {cat.difficulty}
                         </span>
                      </div>
                      <Link to={`/quiz/${cat.id}`} className="btn-minimal w-full">
                        Enter Domain
                      </Link>
                    </div>
                    
                    {/* Minimal decorative corner accent */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-primary/5 rounded-bl-3xl group-hover:bg-primary/10 transition-colors"></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Stats - Minimalist Layout */}
      <section className="border-y border-border-dim py-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div>
          <div className="stat-value-gold text-5xl mb-2">500+</div>
          <div className="stat-label-dim">Curated Questions</div>
        </div>
        <div className="border-x border-border-dim hidden md:block px-12">
          <div className="stat-value-gold text-5xl mb-2">12k</div>
          <div className="stat-label-dim">Scholarly Minds</div>
        </div>
        <div className="md:hidden border-y border-border-dim py-12">
          <div className="stat-value-gold text-5xl mb-2">12k</div>
          <div className="stat-label-dim">Scholarly Minds</div>
        </div>
        <div>
          <div className="stat-value-gold text-5xl mb-2">Unlimited</div>
          <div className="stat-label-dim">Cognitive Potential</div>
        </div>
      </section>
    </div>
  );
}
