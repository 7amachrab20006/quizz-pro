import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Calendar, Activity, ShieldCheck, Star, Camera, Loader2, CheckCircle2 } from 'lucide-react';
import { formatDate, getRank, cn } from '../lib/utils';
import { LEVEL_THRESHOLDS } from '../lib/constants';
import { Link, useParams } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, storage, auth } from '../lib/firebase';

export function Profile() {
  const { profileUserId } = useParams();
  const { user, userData: currentUserData, loading: authLoading } = useAuth();
  
  const [targetUserData, setTargetUserData] = useState<any>(null);
  const [targetLoading, setTargetLoading] = useState(false);
  const [targetError, setTargetError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = !profileUserId || profileUserId === user?.uid;

  useEffect(() => {
    async function fetchTargetProfile() {
      if (!profileUserId || profileUserId === user?.uid) {
        setTargetUserData(null);
        return;
      }

      setTargetLoading(true);
      setTargetError(null);
      try {
        const docRef = doc(db, 'users', profileUserId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTargetUserData(docSnap.data());
        } else {
          setTargetError("Subject profile not found in archival records.");
        }
      } catch (err) {
        console.error("Error fetching target profile:", err);
        setTargetError("Failed to synchronize with target profile.");
      } finally {
        setTargetLoading(false);
      }
    }

    fetchTargetProfile();
  }, [profileUserId, user?.uid]);

  if (authLoading || targetLoading) return (
     <div className="h-full flex items-center justify-center p-24">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
     </div>
  );

  const displayData = isOwnProfile ? currentUserData : targetUserData;

  if (targetError) return (
    <div className="h-full flex flex-col items-center justify-center space-y-6 text-center p-24">
       <div className="text-red-500 opacity-20"><ShieldCheck size={64} /></div>
       <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Access Error</h2>
          <p className="text-text-dim text-sm max-w-xs">{targetError}</p>
       </div>
       <Link to="/leaderboard" className="btn-minimal px-8">Return to Ranks</Link>
    </div>
  );

  if (!displayData) return (
     <div className="h-full flex flex-col items-center justify-center space-y-6 text-center p-24">
        <div className="text-primary opacity-20"><User size={64} /></div>
        <div className="space-y-2">
           <h2 className="text-2xl font-bold tracking-tight">Profile Data Missing</h2>
           <p className="text-text-dim text-sm max-w-xs">We couldn't retrieve the archival history. Ensure your connection is stable.</p>
        </div>
        <Link to="/" className="btn-minimal px-8">Back to Home</Link>
     </div>
  );

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setSuccess(false);
    setError(null);

    try {
      // 1. Create a promise-based image loader and compressor
      const processImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 400;
              const MAX_HEIGHT = 400;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              
              // Compress to JPEG for smaller footprint
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = event.target?.result as string;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      const compressedBase64 = await processImage(file);

      // 2. Update Firestore immediately (Bypasses Storage CORS issues)
      await updateDoc(doc(db, 'users', user.uid), {
        photoURL: compressedBase64,
        lastActivity: new Date().toISOString()
      });

      // 3. Update Auth purely for session consistency
      try {
        await updateProfile(user, { photoURL: compressedBase64 });
      } catch (authErr) {
        console.warn("Auth profile update skipped, data saved in DB.");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error processing photo:", err);
      setError("Failed to process photo. Ensure it is a valid image.");
    } finally {
      setUploading(false);
    }
  };

  const currentLevel = displayData.level || 1;
  const currentXP = displayData.xp || 0;
  const nextXP = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const prevXP = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const progress = ((currentXP - prevXP) / (nextXP - prevXP)) * 100;

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
            <div 
              onClick={isOwnProfile ? handlePhotoClick : undefined}
              className={cn(
                "w-32 h-32 bg-bg-dark rounded-full mx-auto border border-border-dim flex items-center justify-center relative group overflow-hidden",
                isOwnProfile && "cursor-pointer"
              )}
            >
              <AnimatePresence mode="wait">
                {uploading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-bg-dark/80 flex items-center justify-center z-10"
                  >
                    <Loader2 className="text-primary animate-spin" size={32} />
                  </motion.div>
                ) : success ? (
                  <motion.div 
                    key="success"
                    initial={{ scale: 0.5, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute inset-0 bg-green-500/20 flex items-center justify-center z-10"
                  >
                    <CheckCircle2 className="text-green-500" size={32} />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {displayData.photoURL ? (
                <img 
                  src={displayData.photoURL} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User size={64} className="text-primary opacity-50" />
              )}
              
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                  <Camera size={24} className="text-white mb-1" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white">Change Photo</span>
                </div>
              )}
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] text-red-500 font-black uppercase tracking-widest bg-red-500/5 py-2 px-3 rounded border border-red-500/10"
              >
                {error}
              </motion.div>
            )}
            
            <div>
              <h1 className="text-3xl font-black tracking-tighter underline-offset-4 decoration-primary decoration-2">{displayData.username}</h1>
              <p className="text-primary font-black uppercase text-[10px] tracking-[4px] mt-2 italic">{getRank(displayData.level || 1)} RANK</p>
              {isOwnProfile && <p className="text-text-dim text-sm font-medium mt-1">{displayData.email}</p>}
            </div>
            
            <div className="flex items-center justify-center gap-2">
               <ShieldCheck size={14} className="text-primary" />
               <span className="text-[10px] uppercase tracking-[3px] text-text-dim font-black">Verified Individual</span>
            </div>

            <div className="p-6 space-y-4 border-t border-border-dim mt-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-dim">
                <span>L{currentLevel} Progress</span>
                <span className="text-primary">{currentXP - prevXP} / {nextXP - prevXP} XP</span>
              </div>
              <div className="progress-rail h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="progress-bar-fill shadow-[0_0_10px_rgba(212,175,55,0.3)]" 
                />
              </div>
            </div>
          </motion.div>

          <div className="clean-card p-0 overflow-hidden divide-y divide-border-dim">
            <div className="flex items-center justify-between p-5">
               <div className="flex items-center gap-3 text-text-dim">
                 <Calendar size={18} />
                 <span className="text-xs uppercase font-black tracking-widest">Enrollment</span>
               </div>
               <span className="text-sm font-bold">{formatDate(displayData.createdAt)}</span>
            </div>
            {isOwnProfile && (
              <div className="flex items-center justify-between p-5">
                 <div className="flex items-center gap-3 text-text-dim">
                   <Mail size={18} />
                   <span className="text-xs uppercase font-black tracking-widest">Auth Type</span>
                 </div>
                 <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20 font-black tracking-[1px]">GOOGLE_OAUTH</span>
              </div>
            )}
            {isOwnProfile && (
              <div className="p-5">
                <button className="btn-minimal w-full">Account Orchestration</button>
              </div>
            )}
            {!isOwnProfile && (
              <div className="p-5">
                <Link to="/leaderboard" className="btn-minimal w-full inline-flex justify-center">Return to Standings</Link>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 space-y-8">
           <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Completed Segments', value: displayData.totalQuizzes || 0, icon: Activity },
                { label: 'Cumulative Accuracy', value: `${Math.round((displayData.avgScore || 0) * 100)}%`, icon: ShieldCheck },
                { label: 'Active Streak', value: `${displayData.streak || 0} Days`, icon: Star },
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
                 {displayData.lastQuizzes?.length > 0 ? (
                   displayData.lastQuizzes.slice(0, 10).map((q: any, i: number) => (
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
                      {isOwnProfile && <Link to="/" className="btn-minimal-filled w-fit inline-flex mx-auto px-8">Commence Learning</Link>}
                   </div>
                 )}
              </div>
           </section>
        </main>
      </div>
    </div>
  );
}
