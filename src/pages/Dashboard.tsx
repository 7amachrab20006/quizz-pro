import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../lib/data';
import * as Icons from 'lucide-react';
import { formatDate } from '../lib/utils';

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

  return (
    <div className="space-y-12 h-full flex flex-col">
      {/* Header Area */}
      <header className="flex justify-between items-end border-b border-border-dim pb-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-bg-dark border border-border-dim overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            {userData.photoURL ? (
              <img src={userData.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/5">
                <Icons.User size={32} className="text-primary opacity-40" />
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-light tracking-tight">Welcome back, <span className="font-bold underline decoration-primary decoration-4 underline-offset-8">{userData.username}.</span></h1>
            <p className="text-text-dim text-sm">You have several active domains waiting for a new challenge.</p>
          </div>
        </motion.div>
        
        <div className="text-right hidden md:block">
           <div className="stat-label-dim mb-1">Last Activity</div>
           <div className="text-sm font-medium">{formatDate(userData.lastActivity)}</div>
        </div>
      </header>

      {/* Stats Strip - Matching the design HTML exactly */}
      <section className="stats-strip grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="clean-card bg-card-bg/50">
          <span className="stat-label-dim block mb-2">Overall Accuracy</span>
          <span className="stat-value-gold text-3xl">{Math.round((userData.avgScore || 0) * 100)}%</span>
        </div>
        <div className="clean-card bg-card-bg/50">
          <span className="stat-label-dim block mb-2">Completed Quizzes</span>
          <span className="stat-value-gold text-3xl">{userData.totalQuizzes || 0}</span>
        </div>
        <div className="clean-card bg-card-bg/50">
          <span className="stat-label-dim block mb-2">Knowledge Rank</span>
          <span className="stat-value-gold text-3xl">{(userData.avgScore || 0) > 0.8 ? 'Expert' : 'Adept'}</span>
        </div>
      </section>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {CATEGORIES.map((cat) => {
           const Icon = (Icons as any)[cat.icon];
           return (
             <Link key={cat.id} to={`/quiz/${cat.id}`} className="clean-card flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="text-2xl opacity-80 group-hover:scale-110 transition-transform origin-left">
                    <Icon size={32} strokeWidth={1.5} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none mb-1">{cat.name}</h3>
                    <p className="text-[10px] text-text-dim uppercase tracking-[1px] font-black">{cat.difficulty}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="progress-rail">
                    <div className="progress-bar-fill w-[45%]" /> {/* Mock progress for UI */}
                  </div>
                  <button className="btn-minimal w-full">Enter Domain</button>
                </div>
             </Link>
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
