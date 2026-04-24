import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { CATEGORIES, Question, QuizLevel, QuizCategory } from '../lib/data';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { toPng } from 'html-to-image';
import { Timer, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Trophy, RefreshCw, BarChart, Sparkles, Lock, Share2, Download, ExternalLink, Gamepad2, Zap, ArrowLeft } from 'lucide-react';
import { cn, getRank } from '../lib/utils';
import { generateQuizQuestions } from '../services/geminiService';
import { LEVEL_THRESHOLDS, getLevel } from '../lib/constants';
import { completeLevel, isLevelUnlocked, isDomainUnlocked } from '../lib/progress';

export function Quiz() {
  const { domainId, levelId } = useParams();
  const navigate = useNavigate();
  const locationState = useLocation().state as { questions?: Question[], name?: string } | null;
  const { user, userData } = useAuth();
  
  const [currentDomain, setCurrentDomain] = useState<Partial<QuizCategory> | undefined>(
    CATEGORIES.find(c => c.id === domainId)
  );
  const level = currentDomain?.levels?.find(l => l.id === levelId);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [history, setHistory] = useState<{questionId: string, correct: boolean}[]>([]);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayedXP, setDisplayedXP] = useState(0);

  useEffect(() => {
    async function initQuiz() {
      if (domainId === 'custom' && levelId) {
        setAiLoading(true);
        try {
          // If questions passed via state, use them
          if (locationState?.questions) {
            setQuestions(locationState.questions);
            setCurrentDomain({
              id: 'custom',
              name: locationState.name || 'Custom Synthesis',
              difficulty: 'Medium',
              icon: 'FlaskConical'
            });
          } else {
            // Otherwise fetch from Firestore
            const quizDoc = await getDoc(doc(db, 'customQuizzes', levelId));
            if (quizDoc.exists()) {
              const data = quizDoc.data();
              setQuestions(data.questions);
              setCurrentDomain({
                id: 'custom',
                name: data.topic || 'Custom Synthesis',
                difficulty: data.difficulty || 'Medium',
                icon: 'FlaskConical'
              });
            } else {
              setAiError('Node not found in local archives.');
            }
          }
        } catch (err) {
          console.error('Error loading custom quiz:', err);
          setAiError('Failed to retrieve quiz sequence.');
        } finally {
          setAiLoading(false);
        }
        return;
      }

      if (!currentDomain || !level) return;

      // Security: Check progression locks
      if (currentDomain.id !== 'custom') {
        if (!isDomainUnlocked(currentDomain.id!)) {
          setAiError(`Domain Locked: Complete previous domains first.`);
          setAiLoading(false);
          return;
        }

        if (!level || !isLevelUnlocked(currentDomain.id!, level.id)) {
          setAiError(`Level Locked: Complete previous levels first.`);
          setAiLoading(false);
          return;
        }

        // Security: Check level before starting
        if (userData && (userData.level || 1) < (currentDomain.requiredLevel || 0)) {
          setAiError(`Insufficient Level: This domain requires Level ${currentDomain.requiredLevel}`);
          setAiLoading(false);
          return;
        }
      }
      
      setAiLoading(true);
      setAiError(null);
      
      try {
        const aiQuestions = await generateQuizQuestions(`${currentDomain.name} - Level ${level?.levelNumber || 1}`, currentDomain.difficulty || 'Medium');
        setQuestions(aiQuestions);
      } catch (err) {
        console.error("AI Generation failed, falling back to static data:", err);
        // Fallback to static if AI fails
        if (level) {
          const shuffled = [...level.questions]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
          setQuestions(shuffled);
        }
      } finally {
        setAiLoading(false);
      }
    }

    initQuiz();
  }, [domainId, levelId]);

    const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
    const xpGains = { 'Easy': 10, 'Medium': 20, 'Hard': 30 };
    const earnedXP = currentDomain ? Math.round((xpGains[currentDomain.difficulty as keyof typeof xpGains] || 10) * (percentage / 100) * (1 + (Math.min(userData?.streak || 0, 10) * 0.1))) + (percentage === 100 ? 50 : 0) : 0;

    // Effect for XP count-up has been moved to top level
    useEffect(() => {
      if (!isFinished) return;
      let start = 0;
      const end = earnedXP;
      if (start === end) {
        setDisplayedXP(end);
        return;
      }
      
      const duration = 1500;
      const stepTime = 16;
      const steps = duration / stepTime;
      const increment = end / steps;
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayedXP(end);
          clearInterval(timer);
        } else {
          setDisplayedXP(Math.floor(start));
        }
      }, stepTime);
      
      return () => clearInterval(timer);
    }, [earnedXP, isFinished]);
  
  useEffect(() => {
    if (questions.length === 0 || isFinished || isLocked || !timerEnabled || !gameStarted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext(true); // Auto-fail on timeout
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [questions, currentIdx, isFinished, isLocked]);

  const handleAnswer = (index: number) => {
    if (isLocked) return;
    
    setSelectedAnswer(index);
    setIsLocked(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = index === questions[currentIdx].correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    
    setHistory(h => [...h, { questionId: questions[currentIdx].id, correct: isCorrect }]);

    setTimeout(() => {
      handleNext();
    }, 1500);
  };

  const handleNext = (isTimeout = false) => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(c => c + 1);
      setSelectedAnswer(null);
      setIsLocked(false);
      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsFinished(true);
    
    // Progression Logic: Save level progress if score >= 60%
    if (currentDomain && level && percentage >= 60 && currentDomain.id !== 'custom') {
      completeLevel(currentDomain.id!, level.id, score);
    }

    if (user && currentDomain) {
      const quizResult = {
        userId: user.uid,
        category: currentDomain.name,
        level: level?.levelNumber || (currentDomain.id === 'custom' ? 'AI' : 1),
        score,
        total: questions.length,
        timestamp: new Date().toISOString()
      };

      // Save to scores collection
      await addDoc(collection(db, 'scores'), {
        ...quizResult,
        serverTimestamp: serverTimestamp()
      });

      // Update user stats
      const userRef = doc(db, 'users', user.uid);
      const newTotal = (userData?.totalQuizzes || 0) + 1;
      const newAvg = ((userData?.avgScore || 0) * (userData?.totalQuizzes || 0) + (score / questions.length)) / newTotal;

      // XP Calculation
      const xpGains = { 'Easy': 10, 'Medium': 20, 'Hard': 30 };
      const baseXP = xpGains[currentDomain.difficulty as keyof typeof xpGains] || 10;
      
      // Streak Logic & XP Multiplier
      const isPerfect = percentage === 100;
      const isGood = percentage >= 80;
      const isFail = percentage < 50;
      
      let newStreak = isGood ? (userData?.streak || 0) + 1 : (isFail ? 0 : userData?.streak || 0);
      const newHighestStreak = Math.max(userData?.highestStreak || 0, newStreak);
      
      // XP Multiplier: 1.0x (default), up to 2.0x for 10+ streak
      const multiplier = 1 + (Math.min(newStreak, 10) * 0.1);
      let earnedXP = Math.round(baseXP * (percentage / 100) * multiplier);
      
      // Bonus XP for Perfect Score
      if (isPerfect) {
        earnedXP += 50; 
      }
      
      const currentXP = (userData?.xp || 0) + earnedXP;
      const newLevel = getLevel(currentXP);

      await updateDoc(userRef, {
        totalQuizzes: newTotal,
        avgScore: newAvg,
        xp: currentXP,
        level: newLevel,
        streak: newStreak,
        highestStreak: newHighestStreak,
        lastScore: `${score}/${questions.length}`,
        lastActivity: new Date().toISOString(),
        lastQuizzes: arrayUnion({
          category: currentDomain.name,
          level: level?.levelNumber || (currentDomain.id === 'custom' ? 'AI' : 1),
          score,
          total: questions.length,
          date: new Date().toISOString(),
          xpEarned: earnedXP,
          streakAtTime: newStreak
        })
      });
    }
  };

  if (!currentDomain) return <div>Domain not found</div>;

  if (aiLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-16 py-12 relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px] -z-10"></div>
        
        <div className="relative">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 border-[1px] border-white/5 border-t-primary rounded-full shadow-[0_0_30px_rgba(212,175,55,0.1)]"
          />
          <motion.div 
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center text-primary"
          >
            <Icons.Cpu size={64} strokeWidth={1} />
          </motion.div>
        </div>
        
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="stat-label-dim tracking-[6px] text-primary">Neural Pathfinding</div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">Synthesizing Domain</h2>
          <p className="text-text-dim text-sm leading-relaxed font-medium">
            Architecting {currentDomain.name} protocols specifically for your session rank of {getRank(userData?.level || 1)}.
          </p>
        </div>

        <div className="flex gap-4">
          {[0, 1, 2].map(i => (
            <motion.div 
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_#D4AF37]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (questions.length === 0) return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center p-16 glass-effect rounded-[2.5rem] max-w-lg mx-auto mt-12 space-y-8">
        {aiError?.includes('Level') ? (
          <Icons.Lock className="mx-auto text-primary/40" size={80} strokeWidth={1} />
        ) : (
          <Icons.ShieldAlert className="mx-auto text-red-500/40" size={80} strokeWidth={1} />
        )}
        <div className="space-y-3">
          <h3 className="text-3xl font-black uppercase italic tracking-tighter">
            {aiError?.includes('Level') ? 'Access Restricted' : 'Protocol Denied'}
          </h3>
          <p className="text-text-dim text-sm px-4 leading-relaxed font-medium opacity-70">
            {aiError || "The cognitive synthesis could not be completed at this time due to high system load."}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/dashboard')} className="btn-minimal px-10">Return to Base</button>
          {!aiError?.includes('Level') && (
            <button onClick={() => window.location.reload()} className="btn-minimal-filled">Retry Synthesis</button>
          )}
        </div>
      </div>
    </div>
  );

  if (isFinished) {
    const feedback = percentage === 100 ? "ABSOLUTE MASTERY 🧠" : 
                    percentage >= 80 ? "EXPERT CLEARANCE 🏆" :
                    percentage >= 60 ? "CRITICAL PASS 🎓" :
                    percentage >= 40 ? "SUB-OPTIMAL 📚" :
                    "SYSTEM FAILURE 😭";

    const leveledUp = userData?.level && getLevel(userData.xp + earnedXP) > userData.level;
    
    const handleDownload = async () => {
      if (cardRef.current === null) return;
      try {
        const dataUrl = await toPng(cardRef.current, { cacheBust: true, backgroundColor: '#05070A' });
        const link = document.createElement('a');
        link.download = `result-${currentDomain.id}-${level?.levelNumber || 'custom'}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Download failed:", err);
      }
    };

    const handleShare = async () => {
      const shareText = `I just reached ${getRank(userData?.level || 1)} status on QuizMaster Pro with a score of ${score}/${questions.length} in ${currentDomain.name}. Join the cognitive elite!`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'QuizMaster Pro Operative',
            text: shareText,
            url: window.location.origin,
          });
        } catch (err) {
          console.error("Share failed:", err);
        }
      } else {
        navigator.clipboard.writeText(shareText + "\n" + window.location.origin);
        alert("Encrypted result copied to clipboard!");
      }
    };

    const isLevelPassed = percentage >= 60;

    return (
      <div className="flex items-center justify-center min-h-[80vh] py-12 px-4 relative overflow-hidden">
        {/* Confetti Background for perfect score */}
        {percentage === 100 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -10, x: Math.random() * 100 + "%", opacity: 0 }}
                animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}
                transition={{ duration: Math.random() * 2 + 2, repeat: Infinity, delay: Math.random() * 5 }}
                className="absolute w-1 h-1 bg-primary rounded-full blur-[1px]"
              />
            ))}
          </div>
        )}

        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="max-w-3xl w-full space-y-10"
        >
          {/* Result Card */}
          <div className="clean-card p-12 text-center space-y-12 relative overflow-hidden backdrop-blur-2xl">
            {leveledUp && (
              <motion.div 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="absolute top-0 left-0 right-0 bg-primary text-bg-dark py-3 text-[10px] font-black uppercase tracking-[8px] z-20"
              >
                PROMOTED TO NEXT TIER
              </motion.div>
            )}

            <div className="space-y-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                className={cn(
                  "w-32 h-32 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-2 shadow-2xl relative",
                  isLevelPassed ? "bg-primary/10 border-primary/20 text-primary" : "bg-red-500/10 border-red-500/20 text-red-500"
                )}
              >
                {isLevelPassed ? <Icons.Trophy size={64} strokeWidth={1} /> : <Icons.Target size={64} strokeWidth={1} />}
                <div className="absolute -bottom-2 -right-2 bg-bg-dark border border-white/10 rounded-xl px-3 py-1 font-black text-xs italic tracking-tighter">
                  {percentage}%
                </div>
              </motion.div>
              <h2 className={cn("text-6xl font-black mb-2 tracking-tighter uppercase italic leading-none", isLevelPassed ? "text-white" : "text-red-500")}>
                {isLevelPassed ? "Protocol Cleared" : "Protocol Failed"}
              </h2>
              <div className="text-primary font-black uppercase tracking-[6px] text-xs pb-1 border-b border-primary/20 inline-block">{feedback}</div>
            </div>
            
            {/* Stats Dashboard */}
            <div ref={cardRef} className="bg-bg-dark/40 border border-white/5 rounded-[2rem] p-10 space-y-10 relative">
               <div className="flex justify-between items-center text-left">
                  <div>
                    <div className="stat-label-dim mb-2">Operative Rank</div>
                    <div className="text-3xl font-black text-primary italic uppercase tracking-tighter">{getRank(userData?.level || 1)}</div>
                  </div>
                  <div className="text-right">
                    <div className="stat-label-dim mb-2">Sequence</div>
                    <div className="text-xl font-bold tracking-tight uppercase">{currentDomain.name} • NODE {level?.levelNumber || 'AI'}</div>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-8 py-10 border-y border-white/5">
                <div className="space-y-2">
                  <div className="stat-value-gold text-4xl">{score}</div>
                  <div className="stat-label-dim !text-[9px]">Verified Correct</div>
                </div>
                <div className="border-x border-white/10 space-y-2">
                  <div className="stat-value-gold text-4xl">{questions.length - score}</div>
                  <div className="stat-label-dim !text-[9px]">Errors Found</div>
                </div>
                <div className="space-y-2">
                  <div className="stat-value-gold text-4xl">+{displayedXP}</div>
                  <div className="stat-label-dim !text-[9px]">XP Accrued</div>
                </div>
               </div>

               {percentage === 100 && (
                 <div className="flex items-center justify-center gap-3 text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-500/5 py-3 rounded-xl border border-green-500/10">
                    <Icons.Sparkles size={16} /> Perfect Execution Bonus Applied (+50 XP)
                 </div>
               )}
            </div>

            <div className="flex flex-col md:flex-row gap-6 pt-4">
              <button onClick={handleShare} className="btn-minimal flex-1 gap-3 py-5 rounded-2xl group">
                <Icons.Share2 size={20} className="group-hover:rotate-12 transition-transform" /> ENCRYPT & SHARE
              </button>
              <button onClick={handleDownload} className="btn-minimal flex-1 gap-3 py-5 rounded-2xl group text-white/50">
                <Icons.Download size={20} className="group-hover:translate-y-1 transition-transform" /> SAVE INTEL
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 px-4">
            <button 
              onClick={() => window.location.reload()}
              className="btn-minimal-filled flex-1 py-6 rounded-2xl text-xl"
            >
              <Icons.RefreshCw size={24} className="mr-3" /> RE-ENTER SEQUENCE
            </button>
            <Link 
              to={currentDomain.id === 'custom' ? '/ai-lab' : `/quiz/${currentDomain.id}/levels`}
              className="btn-minimal flex-1 py-6 rounded-2xl text-lg uppercase font-black italic tracking-tighter text-center flex items-center justify-center"
            >
              <Icons.ArrowLeft size={20} className="mr-3" /> LEVEL OVERVIEW
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!gameStarted && questions.length > 0) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] py-12 px-4 relative">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="clean-card max-w-2xl w-full p-16 text-center space-y-12 relative overflow-hidden"
        >
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 rotate-45 border-l border-white/10"></div>

          <div className="space-y-6">
             <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-white/10 shadow-inner">
               <Icons.Gamepad2 className="text-primary" size={48} strokeWidth={1.5} />
             </div>
             <div className="space-y-3">
               <h2 className="text-5xl font-black uppercase italic tracking-tighter">Sequence Ready</h2>
               <p className="text-text-dim text-sm px-10 leading-relaxed font-medium">
                 Preparing <span className="text-white font-bold">{currentDomain.name} {level ? `Phase ${level.levelNumber}` : 'AI Mode'}</span>. 
                 <br />Minimum 60% accuracy required for node advancement.
               </p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pb-2 border-b border-white/5">
            <div className="text-left py-4">
              <div className="stat-label-dim mb-1">Target Domain</div>
              <div className="font-black text-xl tracking-tighter uppercase italic">{currentDomain.name}</div>
            </div>
            <div className="text-right py-4">
              <div className="stat-label-dim mb-1">Complexity</div>
              <div className="font-black text-xl tracking-tighter uppercase italic text-primary">{currentDomain.difficulty}</div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.03] border border-white/5">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Icons.Timer size={24} />
                 </div>
                 <div className="text-left">
                    <div className="font-black text-sm uppercase tracking-tight">Temporal Pressure</div>
                    <div className="text-[10px] text-text-dim font-black uppercase tracking-widest">30s PER NODE</div>
                 </div>
               </div>
               <button 
                 onClick={() => setTimerEnabled(!timerEnabled)}
                 className={cn(
                   "w-14 h-7 rounded-full transition-all relative p-1",
                   timerEnabled ? "bg-primary" : "bg-white/10"
                 )}
               >
                 <motion.div 
                   animate={{ x: timerEnabled ? 28 : 0 }}
                   className="w-5 h-5 bg-bg-dark rounded-full shadow-lg" 
                 />
               </button>
            </div>

            <button 
              onClick={() => setGameStarted(true)}
              className="btn-minimal-filled w-full text-2xl py-8 rounded-[2.5rem] group"
            >
              INITIATE PROTOCOL <Icons.Zap size={24} className="ml-3 group-hover:scale-125 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center border border-primary/20 shadow-inner">
            <Icons.Code className="text-primary" size={32} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">{currentDomain.name} <span className="text-primary">{level ? `L${level.levelNumber}` : 'AI'}</span></h2>
            <div className="flex items-center gap-4">
              <div className="stat-label-dim tracking-[3px]">Node {currentIdx + 1} of {questions.length}</div>
              <div className="w-1 h-1 bg-white/20 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Icons.Activity size={12} className="text-primary" />
                <span className="text-[9px] font-black uppercase text-white tracking-[2px]">{getRank(userData?.level || 1)} RANK</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className={cn(
             "h-16 flex flex-col items-center justify-center px-10 rounded-[1.5rem] border transition-all duration-500",
             timeLeft <= 10 ? "border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse" : "border-white/10 bg-white/5 text-white/50"
           )}>
              <span className="text-[8px] font-black uppercase tracking-[4px] mb-1">Time Remain</span>
              <span className="font-mono text-3xl font-black leading-none">{timeLeft}S</span>
           </div>
        </div>
      </div>

      {/* Progress Bar - Dramatic */}
      <div className="relative px-4">
        <div className="progress-rail h-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            className="progress-bar-fill"
          />
        </div>
      </div>

      {/* Question Interface */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="space-y-12 py-10"
        >
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <div className="stat-label-dim text-primary opacity-60">Objective Identification</div>
            <h3 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter uppercase italic">
              {currentQ.text}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {currentQ.options.map((opt, i) => {
              const outcome = isLocked ? (
                i === currentQ.correctAnswer ? 'correct' : (selectedAnswer === i ? 'wrong' : null)
              ) : null;

              return (
                <button
                  key={i}
                  disabled={isLocked}
                  onClick={() => handleAnswer(i)}
                  className={cn(
                    "group relative w-full text-left p-10 rounded-[2rem] border-2 transition-all duration-300 flex items-center justify-between",
                    !isLocked && "border-white/5 bg-white/[0.02] hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-1",
                    outcome === 'correct' && "border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]",
                    outcome === 'wrong' && "border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]",
                    isLocked && outcome === null && "opacity-20 grayscale scale-[0.98]"
                  )}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-text-dim uppercase tracking-widest block mb-2 opacity-50">Option 0{i + 1}</span>
                    <span className="text-lg font-black tracking-tight uppercase italic">{opt}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {outcome === 'correct' && <Icons.CheckCircle2 size={32} strokeWidth={2.5} />}
                    {outcome === 'wrong' && <Icons.XCircle size={32} strokeWidth={2.5} />}
                    {!isLocked && (
                      <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/10 group-hover:border-primary group-hover:text-primary transition-colors">
                        <Icons.ArrowRight size={16} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center pt-8 border-t border-white/5 px-4 h-24">
        <AnimatePresence>
          {timeLeft <= 5 && !isLocked && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex items-center gap-3 text-red-500 bg-red-500/10 px-8 py-3 rounded-full border border-red-500/20 text-[10px] font-black uppercase tracking-[4px]"
            >
              <Icons.AlertOctagon size={16} /> SYSTem Critical: Temporal Drain
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
