
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { DaySchedule, Exercise, ViewState } from './types';
import { INITIAL_DAYS } from './constants';
import { saveSettings, loadSettings } from './utils/storage';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import DayDetailView from './views/DayDetailView';
import ProgressView from './views/ProgressView';
import EditExerciseView from './views/EditExerciseView';
import SettingsView from './views/SettingsView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<DaySchedule[]>(INITIAL_DAYS);
  const [darkMode, setDarkMode] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync with Firestore
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    
    // Listen to real-time updates
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.days) setDays(data.days);
      } else {
        // Initial setup for new user
        setDoc(userDocRef, { days: INITIAL_DAYS });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Load Settings
  useEffect(() => {
    const settings = loadSettings();
    if (settings) setDarkMode(settings.darkMode);
  }, []);

  // Save Settings
  useEffect(() => {
    saveSettings({ darkMode });
  }, [darkMode]);

  const updateFirebaseDays = async (newDays: DaySchedule[]) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), { days: newDays }, { merge: true });
    } catch (e) {
      console.error("Error saving to Firebase:", e);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      alert("خطأ في تسجيل الدخول");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-600">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
    </div>
  );

  if (!user) return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50'}`}>
      <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
      </div>
      <h1 className="text-3xl font-black mb-2">مدربي الشخصي</h1>
      <p className="text-gray-500 mb-12 max-w-xs leading-relaxed">سجل تمارينك، تابع تقدمك، وحافظ على نشاطك في أي مكان.</p>
      <button 
        onClick={handleLogin}
        className="w-full max-w-xs bg-white text-gray-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
        تسجيل الدخول باستخدام جوجل
      </button>
    </div>
  );

  return (
    <Router>
      <Layout 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        user={user}
        days={days}
        updateDays={updateFirebaseDays}
      >
        <Routes>
          <Route path="/" element={<HomeView days={days} updateDays={updateFirebaseDays} />} />
          <Route path="/day/:dayId" element={<DayDetailView days={days} updateDays={updateFirebaseDays} />} />
          <Route path="/exercise/:dayId/:exerciseId/progress" element={<ProgressView days={days} />} />
          <Route path="/exercise/:dayId/:exerciseId/edit" element={<EditExerciseView days={days} updateDays={updateFirebaseDays} />} />
          <Route path="/exercise/:dayId/new" element={<EditExerciseView days={days} updateDays={updateFirebaseDays} />} />
          <Route path="/settings" element={<SettingsView days={days} setDays={setDays} user={user} darkMode={darkMode} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
