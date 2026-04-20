import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { DecisionSimulator } from './pages/DecisionSimulator';
import { Dashboard } from './pages/Dashboard';
import { Quiz } from './pages/Quiz';
import { Profile } from './pages/Profile';
import { Auth } from './pages/Auth';
import { Leaderboard } from './pages/Leaderboard';
import { Contact } from './pages/Contact';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { LogOut, User as UserIcon, Trophy, LayoutDashboard, Home as HomeIcon, Settings, Medal, MessageSquare, Menu, X } from 'lucide-react';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { getRank } from './lib/utils';

function Layout({ children }: { children: React.ReactNode }) {
  const { user, userData } = useAuth();
  const location = window.location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex bg-bg-dark text-text-main font-sans">
      {/* Sidebar - Desktop */}
      <aside className="w-64 border-r border-border-dim bg-card-bg p-8 hidden md:flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-bg-dark">Q</div>
          <span className="text-lg font-bold tracking-tight">QuizPro</span>
        </div>

        {user && (
          <div className="mb-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-border-dim to-primary/20 mx-auto mb-4 border-2 border-primary overflow-hidden relative group">
              <div className="w-full h-full bg-card-bg flex items-center justify-center">
                {userData?.photoURL ? (
                  <img src={userData.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="text-primary" size={32} />
                )}
              </div>
            </div>
            <div className="font-bold text-sm truncate px-4">{userData?.username || 'Guest Scholar'}</div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-[10px] font-black bg-primary text-bg-dark px-1.5 py-0.5 rounded leading-none">L{userData?.level || 1}</span>
              <span className="text-[10px] uppercase tracking-wider text-primary font-black">
                {getRank(userData?.level || 1)}
              </span>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-2">
          <Link to="/" className={`side-nav-item ${location === '/' ? 'active' : ''}`}>
            <HomeIcon size={18} /> Home
          </Link>
          <Link to="/simulator" className={`side-nav-item ${location === '/simulator' ? 'active' : ''}`}>
            <Icons.BrainCircuit size={18} /> Decision Advisor
          </Link>
          <Link to="/leaderboard" className={`side-nav-item ${location === '/leaderboard' ? 'active' : ''}`}>
            <Trophy size={18} /> Leaderboard
          </Link>
          <Link to="/contact" className={`side-nav-item ${location === '/contact' ? 'active' : ''}`}>
            <MessageSquare size={18} /> Contact Us
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className={`side-nav-item ${location === '/dashboard' ? 'active' : ''}`}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link to="/profile" className={`side-nav-item ${location === '/profile' ? 'active' : ''}`}>
                <UserIcon size={18} /> Profile
              </Link>
              <button 
                onClick={() => signOut(auth)}
                className="side-nav-item w-full text-left text-red-400/70 hover:text-red-400 hover:bg-red-400/5 mt-auto"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </>
          )}
          {!user && (
            <Link to="/auth" className={`side-nav-item ${location === '/auth' ? 'active' : ''}`}>
              <LogOut size={18} /> Sign In
            </Link>
          )}
        </nav>

        <div className="mt-auto opacity-30 text-[10px] uppercase tracking-widest font-bold">
          System V2.4.1 [LATEST]
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-bg-dark border-r border-border-dim p-8 z-[101] md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-bg-dark">Q</div>
                  <span className="text-lg font-bold tracking-tight">QuizPro</span>
                </div>
                <button onClick={closeMenu} className="p-2 hover:bg-white/5 rounded-lg">
                  <X size={24} />
                </button>
              </div>

              {user && (
                <div className="mb-10 px-2 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                    {userData?.photoURL ? (
                      <img src={userData.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="text-primary" size={24} />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{userData?.username}</div>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black bg-primary text-bg-dark px-1.5 py-0.5 rounded leading-none">L{userData?.level || 1}</span>
                       <span className="text-[9px] font-black uppercase text-primary tracking-widest">{getRank(userData?.level || 1)}</span>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex-1 space-y-4">
                <Link to="/" onClick={closeMenu} className={`side-nav-item text-lg py-4 ${location === '/' ? 'active' : ''}`}>
                  <HomeIcon size={22} /> Home
                </Link>
                <Link to="/leaderboard" onClick={closeMenu} className={`side-nav-item text-lg py-4 ${location === '/leaderboard' ? 'active' : ''}`}>
                  <Trophy size={22} /> Leaderboard
                </Link>
                <Link to="/contact" onClick={closeMenu} className={`side-nav-item text-lg py-4 ${location === '/contact' ? 'active' : ''}`}>
                  <MessageSquare size={22} /> Contact Us
                </Link>
                {user && (
                  <>
                    <Link to="/dashboard" onClick={closeMenu} className={`side-nav-item text-lg py-4 ${location === '/dashboard' ? 'active' : ''}`}>
                      <LayoutDashboard size={22} /> Dashboard
                    </Link>
                    <Link to="/profile" onClick={closeMenu} className={`side-nav-item text-lg py-4 ${location === '/profile' ? 'active' : ''}`}>
                      <UserIcon size={22} /> Profile
                    </Link>
                    <button 
                      onClick={() => { signOut(auth); closeMenu(); }}
                      className="side-nav-item w-full text-left text-red-400 py-4 mt-auto"
                    >
                      <LogOut size={22} /> Sign Out
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
        <header className="md:hidden border-b border-border-dim bg-bg-dark p-4 flex justify-between items-center sticky top-0 z-50">
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2">
             <Menu size={24} />
           </button>
           <Link to="/" className="font-bold text-primary italic text-xl tracking-tighter">QuizPro</Link>
           <div className="w-10" /> {/* Spacer */}
        </header>

        <main className="flex-1 p-8 md:p-12 relative">
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
          <Route path="/quiz/:categoryId" element={user ? <Quiz /> : <Navigate to="/auth" />} />
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
