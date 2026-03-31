import React from 'react';
import { Priority, Status } from '../types';
import { cn } from '../lib/utils';

export const Badge: React.FC<{ 
  type: Priority | Status; 
  className?: string 
}> = ({ type, className }) => {
  const getStyles = () => {
    switch (type) {
      case 'High': return 'bg-priority-high text-priority-high-text';
      case 'Medium': return 'bg-priority-medium text-priority-medium-text';
      case 'Low': return 'bg-priority-low text-priority-low-text';
      case 'Stuck': return 'bg-stuck text-stuck-text';
      case 'Done': return 'bg-done text-done-text';
      case 'To-Do': return 'bg-todo text-todo-text';
      case 'In Progress': return 'bg-progress text-progress-text';
      default: return 'bg-secondary text-navy/40';
    }
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
      getStyles(),
      className
    )}>
      {type}
    </span>
  );
};
