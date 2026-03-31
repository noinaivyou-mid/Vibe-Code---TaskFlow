import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, FolderPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    addProject(name, description);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-bg-card rounded-2xl shadow-2xl z-[60] overflow-hidden border border-border"
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-navy text-bg-card">
              <div className="flex items-center gap-3">
                <FolderPlus size={20} />
                <h2 className="text-xl font-bold">Create New Project</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-bg-card/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-navy/40 uppercase tracking-wider">Project Name</label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marketing Campaign"
                  className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-navy focus:ring-2 focus:ring-navy/10 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-navy/40 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this project about?"
                  rows={3}
                  className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-navy focus:ring-2 focus:ring-navy/10 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-secondary text-navy font-bold rounded-xl hover:bg-navy/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-navy text-bg-card font-bold rounded-xl hover:bg-navy/90 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
