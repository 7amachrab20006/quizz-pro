import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { User, Mail, Calendar, Settings, Activity, ShieldCheck, MapIcon as HistoryIcon, Star } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export function Profile() {
  const { user, userData, loading } = useAuth();

  if (loading) return (
     <div className="h-full flex items-center justify-center p-24">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
     </div>
  );

  if (!user || !userData) return (
     <div className="h-full flex flex-col items-center justify-center space-y-6 text-center p-24">
        <div className="text-primary opacity-20"><User size={64} /></div>
        <div className="space-y-2">
           <h2 className="text-2xl font-bold tracking-tight">Profile Data Missing</h2>
           <p className="text-text-dim text-sm max-w-xs">We couldn't retrieve your archival history. Ensure your connection is stable.</p>
        </div>
        <Link to="/" className="btn-minimal px-8">Back to Home</Link>
     </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12">
      {/* Profile Header - Minimal Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <aside className="w-full lg:w-80 space-y-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="clean-card text-center space-y-6"
          >
            <div className="w-32 h-32 bg-bg-dark rounded-full mx-auto border border-border-dim flex items-center justify-center relative group">
              <User size={64} className="text-primary opacity-50 shadow-[0_0_20px_rgba(212,175,55,0.2)]" />
              <div className="absolute inset-0 rounded-full border border-primary/20 scale-110 group-hover:scale-125 transition-transform duration-500"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter decoration-primary/50 underline-offset-4 decoration-2">{userData.username}</h1>
              <p className="text-text-dim text-sm font-medium mt-1">{userData.email}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
               <ShieldCheck size={14} className="text-primary" />
               <span className="text-[10px] uppercase tracking-[3px] text-text-dim font-black">Verified Individual</span>
            </div>
          </motion.div>

          <div className="clean-card p-0 overflow-hidden divide-y divide-border-dim">
            <div className="flex items-center justify-between p-5">
               <div className="flex items-center gap-3 text-text-dim">
                 <Calendar size={18} />
                 <span className="text-xs uppercase font-black tracking-widest">Enrollment</span>
               </div>
               <span className="text-sm font-bold">{formatDate(userData.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between p-5">
               <div className="flex items-center gap-3 text-text-dim">
                 <Mail size={18} />
                 <span className="text-xs uppercase font-black tracking-widest">Auth Type</span>
               </div>
               <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20 font-black tracking-[1px]">GOOGLE_OAUTH</span>
            </div>
            <div className="p-5">
              <button className="btn-minimal w-full">Account Orchestration</button>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-8">
           <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Completed Segments', value: userData.totalQuizzes || 0, icon: Activity },
                { label: 'Cumulative Accuracy', value: `${Math.round((userData.avgScore || 0) * 100)}%`, icon: ShieldCheck },
                { label: 'Scholastic Points', value: (userData.totalQuizzes || 0) * 250, icon: Star },
              ].map((stat, i) => (
                <div key={i} className="clean-card space-y-4">
                  <div className="text-primary">
                    <stat.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="stat-value-gold text-4xl">{stat.value}</div>
                    <div className="stat-label-dim mt-1">{stat.label}</div>
                  </div>
                </div>
              ))}
           </section>

           <section className="space-y-8">
              <div className="flex items-end justify-between border-b border-border-dim pb-4">
                <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                  Progress <span className="text-primary italic font-serif">Log</span>.
                </h2>
                <span className="stat-label-dim">Archival Depth: 10</span>
              </div>

              <div className="space-y-4">
                 {userData.lastQuizzes?.length > 0 ? (
                   userData.lastQuizzes.slice(0, 10).map((q: any, i: number) => (
                     <div key={i} className="clean-card flex items-center justify-between group py-6">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 rounded-lg bg-bg-dark border border-border-dim flex items-center justify-center text-primary font-black italic text-xl">
                             {q.category[0]}
                           </div>
                           <div>
                             <div className="text-lg font-bold tracking-tight">{q.category}</div>
                             <div className="text-xs text-text-dim font-medium">{formatDate(q.date)}</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="stat-value-gold text-2xl">{q.score}/{q.total}</div>
                           <div className="stat-label-dim">Performance</div>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="clean-card p-24 text-center border-dashed border-2 border-border-dim">
                      <div className="text-text-dim font-medium mb-6 italic">Historical data is currently absent...</div>
                      <Link to="/" className="btn-minimal-filled w-fit inline-flex mx-auto px-8">Commence Learning</Link>
                   </div>
                 )}
              </div>
           </section>
        </main>
      </div>
    </div>
  );
}
