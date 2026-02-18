
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DaySchedule } from '../types';

interface HomeViewProps {
  days: DaySchedule[];
  updateDays: (days: DaySchedule[]) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ days, updateDays }) => {
  const [isEditingNames, setIsEditingNames] = useState(false);
  const navigate = useNavigate();

  const toggleRestDay = (id: string) => {
    const newDays = days.map(d => d.id === id ? { ...d, isRest: !d.isRest } : d);
    updateDays(newDays);
  };

  const renameDay = (id: string, newName: string) => {
    const newDays = days.map(d => d.id === id ? { ...d, name: newName } : d);
    updateDays(newDays);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">برنامجك الأسبوعي</h2>
        <button 
          onClick={() => setIsEditingNames(!isEditingNames)}
          className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${isEditingNames ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-indigo-600 border border-indigo-100 dark:border-slate-700'}`}
        >
          {isEditingNames ? 'حفظ' : 'تعديل النظام'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {days.map((day) => (
          <div key={day.id} className="relative">
            <div
              className={`w-full p-5 rounded-[2rem] flex items-center justify-between transition-all border-2 ${
                day.isRest 
                ? 'bg-gray-100 dark:bg-slate-800/30 text-gray-400 border-gray-200/50 opacity-80'
                : 'bg-white dark:bg-slate-800 border-white dark:border-slate-700 shadow-xl shadow-indigo-100/50 dark:shadow-none'
              }`}
            >
              <div 
                className="flex items-center gap-4 flex-1 cursor-pointer"
                onClick={() => !isEditingNames && !day.isRest && navigate(`/day/${day.id}`)}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${day.isRest ? 'bg-gray-200 dark:bg-slate-700' : 'bg-indigo-600 text-white'}`}>
                  {day.isRest ? '💤' : <span className="text-lg font-black">{day.name.charAt(0)}</span>}
                </div>
                <div className="flex-1">
                  {isEditingNames ? (
                    <input 
                      type="text"
                      value={day.name}
                      onChange={(e) => renameDay(day.id, e.target.value)}
                      className="text-lg font-black w-full bg-transparent border-b border-indigo-500 outline-none"
                    />
                  ) : (
                    <h3 className="text-lg font-black">{day.name}</h3>
                  )}
                  <p className="text-[10px] text-indigo-500 font-bold">{day.isRest ? 'يوم راحة' : `${day.exercises.length} تمارين`}</p>
                </div>
              </div>
              
              {isEditingNames && (
                <button 
                  onClick={() => toggleRestDay(day.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${day.isRest ? 'bg-emerald-500 text-white' : 'bg-indigo-50 text-indigo-600'}`}
                >
                  {day.isRest ? 'تفعيل' : 'راحة'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeView;
