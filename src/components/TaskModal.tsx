import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Calendar, User, Tag, AlignLeft, Share2, Users, Check, Copy } from 'lucide-react';
import { Task, Priority, Status } from '../types';
import { useApp } from '../context/AppContext';
import { Badge } from './Badge';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose }) => {
  const { addComment } = useApp();
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!task) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, commentText);
    setCommentText('');
  };

  const handleShare = () => {
    const url = `${window.location.origin}/project/${task.projectId}?task=${task.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-bg-card shadow-2xl z-50 overflow-y-auto transition-colors duration-300"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <Badge type={task.status} />
                  <Badge type={task.priority} />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleShare}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                      copied ? "bg-green-500 text-bg-card" : "bg-secondary text-navy hover:bg-navy/5"
                    )}
                  >
                    {copied ? <Check size={16} /> : <Share2 size={16} />}
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                  <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors text-navy">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-navy mb-6">{task.title}</h2>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-navy/60">
                    <User size={18} />
                    <span className="text-sm font-medium uppercase tracking-wider text-[10px]">Assignee</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={task.assignee.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <span className="font-semibold text-navy">{task.assignee.name}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-navy/60">
                    <Calendar size={18} />
                    <span className="text-sm font-medium uppercase tracking-wider text-[10px]">Due Date</span>
                  </div>
                  <div className="font-semibold text-navy">
                    {format(new Date(task.dueDate), 'MMMM d, yyyy')}
                    {task.dueTime && <span className="ml-2 text-navy/40">at {task.dueTime}</span>}
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-3 text-navy/60 mb-4">
                  <Users size={18} />
                  <span className="text-sm font-medium uppercase tracking-wider text-[10px]">Team Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img src={task.assignee.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-bg-card" title={task.assignee.name} />
                    <div className="w-8 h-8 rounded-full border-2 border-bg-card bg-primary flex items-center justify-center text-[10px] font-bold text-navy" title="Add Team Member">
                      +2
                    </div>
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:underline ml-2">Invite others</button>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-3 text-navy/60 mb-4">
                  <AlignLeft size={18} />
                  <span className="text-sm font-medium uppercase tracking-wider text-[10px]">Description</span>
                </div>
                <p className="text-navy/80 leading-relaxed bg-secondary/50 p-4 rounded-xl">
                  {task.description || "No description provided."}
                </p>
              </div>

              <div className="border-t border-navy/10 pt-10">
                <h3 className="text-lg font-bold text-navy mb-6">Comments ({task.comments.length})</h3>
                
                <div className="space-y-6 mb-8">
                  {task.comments.map(comment => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-navy font-bold text-xs">
                        {comment.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-navy">{comment.user}</span>
                          <span className="text-[10px] text-navy/40">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                        <p className="text-sm text-navy/70">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="relative">
                  <textarea 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-secondary rounded-xl p-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none text-navy"
                  />
                  <button 
                    type="submit"
                    className="absolute bottom-4 right-4 p-2 bg-navy text-bg-card rounded-lg hover:bg-navy/90 transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
