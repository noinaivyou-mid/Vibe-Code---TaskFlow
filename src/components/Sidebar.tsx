import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderKanban, Settings, Plus, Flower2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const Sidebar: React.FC = () => {
  const { projects } = useApp();

  return (
    <aside className="w-64 bg-bg-card border-r border-border flex flex-col h-screen sticky top-0 transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 text-navy font-bold text-2xl">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Flower2 size={38} className="text-yellow-400 fill-yellow-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-inner">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-0.5 bg-navy rounded-full" />
                  <div className="w-0.5 h-0.5 bg-navy rounded-full" />
                </div>
              </div>
            </div>
          </div>
          TaskFlow
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <NavLink to="/" className={({ isActive }) => cn("sidebar-item", isActive && "active")}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/my-tasks" className={({ isActive }) => cn("sidebar-item", isActive && "active")}>
          <CheckSquare size={20} />
          My Tasks
        </NavLink>
        
        <div className="pt-6 pb-2 px-4 text-xs font-semibold text-navy/40 uppercase tracking-wider">
          Projects
        </div>
        {projects.map(project => (
          <NavLink 
            key={project.id} 
            to={`/project/${project.id}`} 
            className={({ isActive }) => cn("sidebar-item", isActive && "active")}
          >
            <FolderKanban size={20} />
            {project.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <NavLink to="/settings" className={({ isActive }) => cn("sidebar-item", isActive && "active")}>
          <Settings size={20} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
};
