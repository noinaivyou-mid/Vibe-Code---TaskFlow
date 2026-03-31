import React from 'react';
import { User, Bell, Moon, Shield, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Settings: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-navy mb-1">User Settings</h1>
        <p className="text-navy/50">Manage your account preferences and application settings.</p>
      </header>

      <div className="space-y-6">
        <section className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-navy/5">
            <h3 className="font-bold text-navy flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Profile Information
            </h3>
          </div>
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-6">
              <img src={currentUser.avatar} alt="" className="w-20 h-20 rounded-2xl border-4 border-primary" />
              <div>
                <button className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-navy/90 transition-colors">
                  Change Avatar
                </button>
                <p className="text-xs text-navy/40 mt-2">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={currentUser.name}
                  className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">Role</label>
                <input 
                  type="text" 
                  defaultValue={currentUser.role}
                  className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-navy/5">
            <h3 className="font-bold text-navy flex items-center gap-2">
              <Moon size={20} className="text-purple-600" />
              Appearance
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-navy">Dark Mode</div>
                <div className="text-xs text-navy/40">Adjust the interface to reduce eye strain</div>
              </div>
              <button className="w-12 h-6 bg-navy/10 rounded-full relative transition-colors">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-navy">Compact View</div>
                <div className="text-xs text-navy/40">Show more tasks on the screen at once</div>
              </div>
              <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-navy/5">
            <h3 className="font-bold text-navy flex items-center gap-2">
              <Bell size={20} className="text-orange-600" />
              Notifications
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {['Email notifications', 'Push notifications', 'Task reminders', 'Weekly summary'].map(item => (
              <label key={item} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-navy/20 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-navy/80 group-hover:text-navy transition-colors">{item}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-4">
        <button className="bg-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-navy/90 transition-all shadow-lg shadow-navy/20">
          Save Changes
        </button>
      </div>
    </div>
  );
};
