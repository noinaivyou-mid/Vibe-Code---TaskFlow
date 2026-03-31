import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, Task, User, Status, Priority, Theme } from '../types';
import { mockProjects, mockUser, mockTeam } from '../data/mockData';

interface AppContextType {
  projects: Project[];
  currentUser: User;
  team: User[];
  theme: Theme;
  setTheme: (theme: Theme) => void;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'comments'>) => void;
  updateTask: (taskId: string, taskData: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  getTaskById: (taskId: string) => Task | undefined;
  addComment: (taskId: string, text: string) => void;
  addProject: (name: string, description: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [currentUser] = useState<User>(mockUser);
  const [team] = useState<User[]>(mockTeam);
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'light';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Sync theme on mount
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addProject = (name: string, description: string) => {
    const newProject: Project = {
      id: `p${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      tasks: [],
    };
    setProjects(prev => [...prev, newProject]);
  };

  const addTask = (projectId: string, taskData: Omit<Task, 'id' | 'comments'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t${Math.random().toString(36).substr(2, 9)}`,
      comments: [],
    };

    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, tasks: [...p.tasks, newTask] } : p
    ));
  };

  const updateTask = (taskId: string, taskData: Partial<Task>) => {
    setProjects(prev => prev.map(p => ({
      ...p,
      tasks: p.tasks.map(t => t.id === taskId ? { ...t, ...taskData } : t)
    })));
  };

  const deleteTask = (taskId: string) => {
    setProjects(prev => prev.map(p => ({
      ...p,
      tasks: p.tasks.filter(t => t.id !== taskId)
    })));
  };

  const updateTaskStatus = (taskId: string, status: Status) => {
    setProjects(prev => prev.map(p => ({
      ...p,
      tasks: p.tasks.map(t => t.id === taskId ? { ...t, status } : t)
    })));
  };

  const getTaskById = (taskId: string) => {
    for (const project of projects) {
      const task = project.tasks.find(t => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  };

  const addComment = (taskId: string, text: string) => {
    const comment = {
      id: `c${Date.now()}`,
      user: currentUser.name,
      text,
      createdAt: new Date().toISOString(),
    };

    setProjects(prev => prev.map(p => ({
      ...p,
      tasks: p.tasks.map(t => t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t)
    })));
  };

  return (
    <AppContext.Provider value={{ projects, currentUser, team, theme, setTheme, addTask, updateTask, deleteTask, updateTaskStatus, getTaskById, addComment, addProject }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
