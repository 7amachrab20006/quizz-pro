import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { DecisionSimulator } from './pages/DecisionSimulator';
import { Dashboard } from './pages/Dashboard';
import { Quiz } from './pages/Quiz';
import { DomainLevels } from './pages/DomainLevels';
import { Profile } from './pages/Profile';
import { Auth } from './pages/Auth';
import { Leaderboard } from './pages/Leaderboard';
import { Contact } from './pages/Contact';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { LogOut, User as UserIcon, Trophy, LayoutDashboard, Home as HomeIcon, Settings, Medal, MessageSquare, Menu, X, BrainCircuit } from 'lucide-react';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { getRank } from './lib/utils';

function Layout({ children }: { children: React.ReactNode }) {
  const { user, userData } = useAuth();
  const location = window.location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex bg-bg-dark text-text-main font-sans selection:bg-primary selection:text-bg-dark">
      {/* Sidebar - Desktop */}
      <aside className="w-72 border-r border-white/5 bg-black p-10 hidden md:flex flex-col shrink-0 relative overflow-hidden">
        {/* Subtle glow behind sidebar */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none"></div>

        <Link to="/" className="flex items-center gap-4 mb-16 relative z-10 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-xl text-bg-dark italic shadow-[0_0_20px_#D4AF3744] group-hover:scale-110 transition-transform">Q</div>
          <div>
            <span className="text-xl font-black italic tracking-tighter uppercase text-white block leading-none">QuizMaster</span>
            <span className="text-[9px] font-black tracking-[4px] uppercase text-primary block mt-1">Pro Edition</span>
          </div>
        </Link>

        {user && (
          <div className="mb-16 relative z-10">
            <div className="relative inline-block mx-auto">
              <div className="w-24 h-24 rounded-[2rem] bg-white/[0.03] p-1 border border-white/10 group overflow-hidden relative text-center">
                 <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-bg-dark flex items-center justify-center">
                    {userData?.photoURL ? (
                      <img src={userData.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="text-primary/20" size={32} />
                    )}
                 </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-bg-dark text-[10px] font-black w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-black shadow-xl">
                L{userData?.level || 1}
              </div>
            </div>
            <div className="mt-6 text-center space-y-1">
              <div className="font-black text-lg uppercase italic tracking-tighter truncate text-white">{userData?.username || 'Guest Scholar'}</div>
              <div className="text-[10px] uppercase tracking-[3px] text-primary font-black opacity-80">
                {getRank(userData?.level || 1)} Tier
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-3 relative z-10">
          <Link to="/" className={`side-nav-item ${location === '/' ? 'active' : ''}`}>
            <HomeIcon size={18} /> Home Sequence
          </Link>
          <Link to="/leaderboard" className={`side-nav-item ${location === '/leaderboard' ? 'active' : ''}`}>
            <Trophy size={18} /> Global Standings
          </Link>
          <Link to="/simulator" className={`side-nav-item ${location === '/simulator' ? 'active' : ''}`}>
            <BrainCircuit size={18} /> Decision Advisor
          </Link>
          <Link to="/contact" className={`side-nav-item ${location === '/contact' ? 'active' : ''}`}>
            <MessageSquare size={18} /> Support Net
          </Link>
          {user && (
            <>
              <div className="pt-6 pb-2 text-[10px] font-black uppercase tracking-[4px] text-white/20 pl-4">Operations</div>
              <Link to="/dashboard" className={`side-nav-item ${location === '/dashboard' ? 'active' : ''}`}>
                <LayoutDashboard size={18} /> Systems Overview
              </Link>
              <Link to="/profile" className={`side-nav-item ${location === '/profile' ? 'active' : ''}`}>
                <UserIcon size={18} /> Scholar Profile
              </Link>
              <button 
                onClick={() => signOut(auth)}
                className="side-nav-item w-full text-left text-red-500/50 hover:text-red-500 hover:bg-red-500/10 mt-12 transition-all"
              >
                <LogOut size={18} /> Terminate Session
              </button>
            </>
          )}
          {!user && (
            <Link to="/auth" className="btn-minimal-filled w-full mt-8 !py-4 text-center block">
              AUTHENTICATE
            </Link>
          )}
        </nav>

        <div className="mt-auto pt-10 border-t border-white/5 opacity-30 text-[9px] uppercase tracking-[4px] font-black relative z-10">
          Neural Protocol v3.0.4
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-bg-dark border-r border-white/10 p-10 z-[101] md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-xl text-bg-dark italic shadow-[0_0_20px_#D4AF3744]">Q</div>
                  <span className="text-xl font-black italic tracking-tighter uppercase text-white">QuizMaster</span>
                </div>
                <button onClick={closeMenu} className="p-3 bg-white/5 rounded-2xl hover:text-primary transition-colors">
                  <X size={24} />
                </button>
              </div>

              {user ? (
                <div className="mb-12 flex items-center gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                    {userData?.photoURL ? (
                      <img src={userData.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="text-primary/40" size={24} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="font-black text-lg uppercase italic tracking-tighter text-white">{userData?.username}</div>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black bg-primary text-bg-dark px-1.5 py-0.5 rounded-lg">L{userData?.level || 1}</span>
                       <span className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">{getRank(userData?.level || 1)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/auth" onClick={closeMenu} className="btn-minimal-filled w-full mb-12 !py-5">
                  AUTHENTICATE
                </Link>
              )}

              <nav className="flex-1 space-y-6">
                <Link to="/" onClick={closeMenu} className={`side-nav-item text-xl py-6 ${location === '/' ? 'active' : ''}`}>
                  <HomeIcon size={24} /> Home Node
                </Link>
                <Link to="/leaderboard" onClick={closeMenu} className={`side-nav-item text-xl py-6 ${location === '/leaderboard' ? 'active' : ''}`}>
                  <Trophy size={24} /> Leaderboard
                </Link>
                <Link to="/simulator" onClick={closeMenu} className={`side-nav-item text-xl py-6 ${location === '/simulator' ? 'active' : ''}`}>
                  <BrainCircuit size={24} /> Decision Advisor
                </Link>
                <Link to="/contact" onClick={closeMenu} className={`side-nav-item text-xl py-6 ${location === '/contact' ? 'active' : ''}`}>
                  <MessageSquare size={24} /> Support
                </Link>
                {user && (
                  <>
                    <Link to="/dashboard" onClick={closeMenu} className={`side-nav-item text-xl py-6 ${location === '/dashboard' ? 'active' : ''}`}>
                      <LayoutDashboard size={24} /> Dashboard
                    </Link>
                    <Link to="/profile" onClick={closeMenu} className={`side-nav-item text-xl py-6 ${location === '/profile' ? 'active' : ''}`}>
                      <UserIcon size={24} /> My Profile
                    </Link>
                    <button 
                      onClick={() => { signOut(auth); closeMenu(); }}
                      className="side-nav-item w-full text-left text-red-500 py-6 mt-12 bg-red-500/5"
                    >
                      <LogOut size={24} /> Sign Out
                    </button>
                  </>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-white/5 bg-black p-5 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-3 bg-white/5 rounded-2xl">
             <Menu size={24} className="text-white/70" />
           </button>
           <Link to="/" className="flex items-center gap-3">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-sm text-bg-dark italic shadow-[0_0_15px_#D4AF3744]">Q</div>
             <span className="font-black text-white italic text-lg tracking-tighter uppercase">QuizMaster</span>
           </Link>
           <div className="w-12" /> {/* Spacer */}
        </header>

        <main className="flex-1 p-8 md:p-20 relative">
          {children}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B18] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="text-[10px] text-primary/50 uppercase tracking-[4px] font-black animate-pulse">Initializing System</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<DecisionSimulator />} />
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
          <Route path="/profile/:profileUserId" element={<Profile />} />
          <Route path="/quiz/:domainId/levels" element={user ? <DomainLevels /> : <Navigate to="/auth" />} />
          <Route path="/quiz/:domainId/:levelId" element={user ? <Quiz /> : <Navigate to="/auth" />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
