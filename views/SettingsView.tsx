
import React from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { DaySchedule } from '../types';

interface SettingsViewProps {
  user: User;
  days: DaySchedule[];
  setDays: (d: DaySchedule[]) => void;
  darkMode: boolean;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, days, setDays, darkMode }) => {
  const handleLogout = () => signOut(auth);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(days));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `gym_backup_${user.uid}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-[2rem] border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="flex items-center gap-4 mb-6">
          <img src={user.photoURL || ''} className="w-16 h-16 rounded-2xl" alt="Profile" />
          <div>
            <h3 className="text-xl font-black">{user.displayName}</h3>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold border border-red-100 active:scale-95 transition-all"
        >
          تسجيل الخروج
        </button>
      </div>

      <div className={`p-6 rounded-[2rem] border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
        <h3 className="text-lg font-black mb-4">إدارة البيانات السحابية</h3>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          يتم مزامنة بياناتك تلقائياً مع حسابك في Google. يمكنك دائماً تحميل نسخة احتياطية من تمارينك.
        </p>
        
        <button 
          onClick={handleExport}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold active:scale-95 transition-all"
        >
          <span>تصدير نسخة احتياطية (JSON)</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
