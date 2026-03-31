import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { Task, Status } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: Status) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks, onTaskClick, onAddTask, onEditTask, onDeleteTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`kanban-column ${isOver ? 'bg-primary/30' : ''} transition-colors`}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-navy uppercase tracking-wider">{status}</h3>
          <span className="bg-navy/5 text-navy/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto min-h-[100px]">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={() => onTaskClick(task)} 
            onEdit={() => onEditTask?.(task)}
            onDelete={() => onDeleteTask?.(task)}
          />
        ))}
      </div>

      <button 
        onClick={() => onAddTask(status)}
        className="mt-4 w-full py-2 flex items-center justify-center gap-2 text-xs font-semibold text-navy/40 hover:text-navy hover:bg-bg-card rounded-lg transition-all border border-dashed border-border hover:border-navy/20"
      >
        <Plus size={14} />
        Add Task
      </button>
    </div>
  );
};
