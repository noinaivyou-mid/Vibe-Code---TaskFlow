import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Calendar, MessageSquare, Pencil, Trash2, Share2, Check } from 'lucide-react';
import { Task } from '../types';
import { Badge } from './Badge';
import { format, isPast, isToday } from 'date-fns';
import { cn } from '../lib/utils';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && !isToday(dueDate) && task.status !== 'Done';

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/project/${task.projectId}?task=${task.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="task-card group relative"
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button 
          onClick={handleShare}
          className={cn(
            "p-1 rounded-md transition-colors",
            copied ? "bg-green-500 text-bg-card" : "hover:bg-navy/5 text-navy/40 hover:text-blue-600"
          )}
          title="Share Task"
        >
          {copied ? <Check size={14} /> : <Share2 size={14} />}
        </button>
        {onEdit && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(e);
            }}
            className="p-1 hover:bg-navy/5 rounded-md text-navy/40 hover:text-blue-600 transition-colors"
            title="Edit Task"
          >
            <Pencil size={14} />
          </button>
        )}
        {onDelete && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            className="p-1 hover:bg-red-50 rounded-md text-navy/40 hover:text-red-500 transition-colors"
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="flex justify-between items-start mb-3">
        <Badge type={task.priority} />
        <img 
          src={task.assignee.avatar} 
          alt={task.assignee.name} 
          className="w-6 h-6 rounded-full border border-bg-card shadow-sm"
          title={task.assignee.name}
        />
      </div>
      
      <h4 className="text-sm font-semibold text-navy mb-1 group-hover:text-blue-600 transition-colors pr-12">
        {task.title}
      </h4>
      <p className="text-xs text-navy/60 line-clamp-2 mb-4">
        {task.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-medium",
          isOverdue ? "text-red-500" : "text-navy/40"
        )}>
          <Calendar size={12} />
          {format(dueDate, 'MMM d')}
          {task.dueTime && <span className="ml-1 opacity-60">{task.dueTime}</span>}
        </div>

        <div className="flex items-center gap-3 text-navy/40">
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-[10px]">
              <MessageSquare size={12} />
              {task.comments.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
