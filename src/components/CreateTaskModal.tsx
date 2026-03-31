import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Status, Priority, Task } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStatus?: Status;
  projectId: string;
  taskToEdit?: Task;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  initialStatus = 'To-Do', 
  projectId,
  taskToEdit
}) => {
  const { addTask, updateTask, currentUser, team } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(initialStatus);
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('12:00');
  const [assigneeId, setAssigneeId] = useState(currentUser.id);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setDueDate(new Date(taskToEdit.dueDate).toISOString().split('T')[0]);
      setDueTime(taskToEdit.dueTime || '12:00');
      setAssigneeId(taskToEdit.assignee.id);
    } else {
      setTitle('');
      setDescription('');
      setStatus(initialStatus);
      setPriority('Medium');
      setDueDate(new Date().toISOString().split('T')[0]);
      setDueTime('12:00');
      setAssigneeId(currentUser.id);
    }
  }, [taskToEdit, initialStatus, isOpen, currentUser.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignee = team.find(u => u.id === assigneeId) || currentUser;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title,
        description,
        status,
        priority,
        dueDate,
        dueTime,
        assignee,
      });
    } else {
      addTask(projectId, {
        title,
        description,
        status,
        priority,
        dueDate,
        dueTime,
        assignee,
        projectId
      });
    }

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
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-bg-card rounded-2xl shadow-2xl z-50 overflow-hidden transition-colors duration-300"
          >
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-navy">
                {taskToEdit ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors text-navy">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">Task Title</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details..."
                  className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none text-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                    className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none text-navy"
                  >
                    <option value="To-Do">To-Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                    <option value="Stuck">Stuck</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none text-navy"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">Assign To</label>
                <select 
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none text-navy"
                >
                  {team.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">Due Date</label>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">Due Time</label>
                  <input 
                    type="time" 
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-navy"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-bold text-navy/60 hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-navy text-bg-card rounded-xl font-bold hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 flex items-center justify-center gap-2"
                >
                  {taskToEdit ? <Save size={18} /> : <Plus size={18} />}
                  {taskToEdit ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
