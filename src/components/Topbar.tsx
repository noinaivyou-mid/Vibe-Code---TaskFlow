import React from 'react';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { Theme } from '../types';

export const Topbar: React.FC = () => {
  const { currentUser, theme, setTheme } = useApp();

  const themes: { id: Theme; icon: any; label: string }[] = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
  ];

  return (
    <header className="h-16 bg-bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center bg-secondary rounded-full px-4 py-2 w-96">
        <Search size={18} className="text-navy/40" />
        <input 
          type="text" 
          placeholder="Search tasks, projects..." 
          className="bg-transparent border-none focus:outline-none ml-2 w-full text-sm text-navy"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl mr-2">
          {themes.map(({ id, icon: Icon, label }) => (
            <button 
              key={id}
              onClick={() => setTheme(id)}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                theme === id ? "bg-bg-card text-navy shadow-sm" : "text-navy/40 hover:text-navy"
              )}
              title={label}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>

        <button className="relative text-navy/60 hover:text-navy transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-card"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-navy">{currentUser.name}</div>
            <div className="text-xs text-navy/50">{currentUser.role}</div>
          </div>
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-10 h-10 rounded-full border-2 border-primary"
          />
        </div>
      </div>
    </header>
  );
};
