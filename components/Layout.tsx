
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from 'firebase/auth';
import { DaySchedule } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  user: User;
  days: DaySchedule[];
  updateDays: (days: DaySchedule[]) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, setDarkMode, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  
  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-50 px-4 py-4 flex items-center justify-between border-b shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          {!isHome && (
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transform rotate-180">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}
          <h1 className="text-xl font-black">مدربي الشخصي</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl ${darkMode ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-xl overflow-hidden border-2 border-indigo-500 p-0.5"
          >
            <img src={user.photoURL || ''} alt="User" className="w-full h-full rounded-[10px] object-cover" />
          </button>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {children}
      </main>

      {/* Navigation Bar for SPA feel */}
      {!isHome && (
        <nav className={`fixed bottom-0 left-0 right-0 p-4 border-t flex justify-center gap-8 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-2xl'}`}>
          <button onClick={() => navigate('/')} className={`flex flex-col items-center gap-1 ${isHome ? 'text-indigo-600' : 'text-gray-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className="text-[10px] font-bold">الرئيسية</span>
          </button>
          <button onClick={() => navigate('/settings')} className={`flex flex-col items-center gap-1 ${location.pathname === '/settings' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span className="text-[10px] font-bold">الإعدادات</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default Layout;
