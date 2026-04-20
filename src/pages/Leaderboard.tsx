import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Trophy, Medal, Star, User as UserIcon, ExternalLink } from 'lucide-react';
import { cn, getRank } from '../lib/utils';
import { Link } from 'react-router-dom';

interface LeaderboardEntry {
  userId: string;
  username: string;
  totalQuizzes: number;
  avgScore: number;
}

export function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const q = query(
          collection(db, 'users'),
          orderBy('avgScore', 'desc'),
          limit(10)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          userId: doc.id,
          ...(doc.data() as any)
        }));
        setLeaders(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      <div className="border-b border-border-dim pb-8 mb-12">
        <h1 className="text-5xl font-black tracking-tighter mb-2">Global Rankings.</h1>
        <p className="text-text-dim text-lg font-light tracking-tight">An elite circle of scholars demonstrating cognitive dominance.</p>
      </div>

      <div className="clean-card p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-text-dim animate-pulse uppercase tracking-[2px] text-xs font-black">Syncing Rankings...</div>
        ) : (
          <div className="divide-y divide-border-dim">
            {leaders.map((leader, index) => (
              <Link
                key={leader.userId}
                to={`/profile/${leader.userId}`}
                className={cn(
                  "flex items-center justify-between p-8 transition-all hover:bg-white/5 active:scale-[0.99] group",
                  index === 0 && "bg-primary/5"
                )}
              >
                <div className="flex items-center gap-8">
                  <div className="w-8 text-center text-2xl font-black text-text-dim italic">
                    {index + 1}
                  </div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-bg-dark rounded-2xl flex items-center justify-center border border-border-dim group-hover:border-primary/50 transition-colors">
                      {index === 0 ? <Trophy className="text-primary" size={28} /> : <UserIcon className="text-text-dim" size={24} />}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold tracking-tight flex items-center gap-2">
                       {leader.username}
                       <span className="text-[10px] font-black bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded leading-none">L{(leader as any).level || 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="stat-label-dim">{leader.totalQuizzes} Quizzes</span>
                       <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                       <span className="text-[10px] uppercase font-black tracking-widest text-primary">
                         {getRank((leader as any).level || 1)}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="stat-value-gold text-3xl">{Math.round((leader.avgScore || 0) * 100)}%</div>
                    <div className="stat-label-dim">Accuracy Rating</div>
                  </div>
                  <div className="text-text-dim opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={18} />
                  </div>
                </div>
              </Link>
            ))}
            {leaders.length === 0 && (
              <div className="p-24 text-center">
                <Medal size={48} className="mx-auto text-text-dim mb-4 opacity-20" />
                <p className="text-text-dim font-black uppercase tracking-[2px] text-xs">No active standings found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
