import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Quiz } from './pages/Quiz';
import { Profile } from './pages/Profile';
import { Auth } from './pages/Auth';
import { Leaderboard } from './pages/Leaderboard';
import { Contact } from './pages/Contact';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LogOut, User as UserIcon, Trophy, LayoutDashboard, Home as HomeIcon, Settings, Medal, MessageSquare } from 'lucide-react';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';

function Layout({ children }: { children: React.ReactNode }) {
  const { user, userData } = useAuth();
  const location = window.location.pathname;

  return (
    <div className="min-h-screen flex bg-bg-dark text-text-main font-sans">
      {/* Sidebar - only show if user is logged in and not on mobile (simplified for now) */}
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
            <div className="text-[10px] uppercase tracking-wider text-primary font-black mt-1">
              {userData ? ((userData.avgScore || 0) > 0.8 ? 'Expert Rank' : 'Rising Star') : 'Initializing...'}
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-2">
          <Link to="/" className={`side-nav-item ${location === '/' ? 'active' : ''}`}>
            <HomeIcon size={18} /> Home
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
          System V2.4.0
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-border-dim bg-card-bg p-4 flex justify-between items-center sticky top-0 z-50">
           <Link to="/" className="font-bold text-primary italic">QuizPro</Link>
           <div className="flex gap-4">
             <Link to="/leaderboard"><Trophy size={20} /></Link>
             <Link to="/contact"><MessageSquare size={20} /></Link>
             <Link to="/dashboard"><LayoutDashboard size={20} /></Link>
             <Link to="/profile"><UserIcon size={20} /></Link>
           </div>
        </header>

        <main className="flex-1 p-8 md:p-12">
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
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
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
