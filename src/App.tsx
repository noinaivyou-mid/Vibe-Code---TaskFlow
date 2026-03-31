import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { MyTasks } from './pages/MyTasks';
import { ProjectWorkspace } from './pages/ProjectWorkspace';
import { Settings } from './pages/Settings';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';

import { useApp } from './context/AppContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useApp();
  
  return (
    <div className={`flex min-h-screen bg-secondary ${theme}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const { isAuthenticated } = useApp();

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <Route 
            path="/*" 
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/project/:projectId" element={<ProjectWorkspace />} />
                  <Route path="/my-tasks" element={<MyTasks />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            } 
          />
        )}
      </Routes>
    </Router>
  );
}
