import React, { useEffect, useRef, useState } from 'react';
import { User, Bell, Moon, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Settings: React.FC = () => {
  const { currentUser, theme, setTheme, updateCurrentUser } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(currentUser.name);
  const [role, setRole] = useState(currentUser.role || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [compactView, setCompactView] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setName(currentUser.name);
    setRole(currentUser.role || '');
    setAvatar(currentUser.avatar);
  }, [currentUser]);

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      window.alert('Please choose a JPG, PNG, GIF, or another image file.');
      return;
    }

    if (file.size > 800 * 1024) {
      window.alert('Image size must be 800KB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = () => {
    updateCurrentUser({
      name: name.trim() || currentUser.name,
      role: role.trim() || undefined,
      avatar,
    });
    setTheme(theme);
    setSaveMessage('Changes saved');
    window.setTimeout(() => setSaveMessage(''), 2500);
  };

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
              <img src={avatar} alt="" className="w-20 h-20 rounded-2xl border-4 border-primary object-cover" />
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleAvatarButtonClick}
                  className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-navy/90 transition-colors"
                >
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">Role</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
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
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-navy/10'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                    theme === 'dark' ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-navy">Compact View</div>
                <div className="text-xs text-navy/40">Show more tasks on the screen at once</div>
              </div>
              <button
                type="button"
                onClick={() => setCompactView(prev => !prev)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  compactView ? 'bg-blue-600' : 'bg-navy/10'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                    compactView ? 'right-1' : 'left-1'
                  }`}
                />
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
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded border-navy/20 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-navy/80 group-hover:text-navy transition-colors">Email notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="w-4 h-4 rounded border-navy/20 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-navy/80 group-hover:text-navy transition-colors">Push notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={taskReminders}
                onChange={(e) => setTaskReminders(e.target.checked)}
                className="w-4 h-4 rounded border-navy/20 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-navy/80 group-hover:text-navy transition-colors">Task reminders</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={weeklySummary}
                onChange={(e) => setWeeklySummary(e.target.checked)}
                className="w-4 h-4 rounded border-navy/20 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-navy/80 group-hover:text-navy transition-colors">Weekly summary</span>
            </label>
          </div>
        </section>
      </div>

      <div className="flex justify-end items-center gap-4 pt-4">
        {saveMessage && (
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <CheckCircle2 size={18} />
            {saveMessage}
          </div>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="bg-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-navy/90 transition-all shadow-lg shadow-navy/20"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
