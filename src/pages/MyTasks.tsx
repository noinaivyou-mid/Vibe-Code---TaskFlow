import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronRight,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, isToday, isPast, addDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { cn } from '../lib/utils';
import { Badge } from '../components/Badge';
import { Task, Status, Priority } from '../types';
import { TaskModal } from '../components/TaskModal';

export const MyTasks: React.FC = () => {
  const { projects, currentUser, updateTaskStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Today': true,
    'This Week': true,
    'Later': true,
    'Completed': false
  });

  const allTasks = projects.flatMap(p => p.tasks);
  const myTasks = allTasks.filter(t => {
    const isAssignedToMe = t.assignee.id === currentUser.id;
    const matchesSearch = !searchQuery || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projects.find(p => p.id === t.projectId)?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return isAssignedToMe && matchesSearch;
  });

  const groups = [
    {
      title: 'Today',
      tasks: myTasks.filter(t => t.status !== 'Done' && isToday(new Date(t.dueDate))),
      color: 'bg-blue-500'
    },
    {
      title: 'This Week',
      tasks: myTasks.filter(t => {
        const date = new Date(t.dueDate);
        return t.status !== 'Done' && 
               !isToday(date) && 
               isWithinInterval(date, { 
                 start: startOfWeek(new Date()), 
                 end: endOfWeek(new Date()) 
               });
      }),
      color: 'bg-indigo-500'
    },
    {
      title: 'Later',
      tasks: myTasks.filter(t => {
        const date = new Date(t.dueDate);
        return t.status !== 'Done' && 
               !isToday(date) && 
               !isWithinInterval(date, { 
                 start: startOfWeek(new Date()), 
                 end: endOfWeek(new Date()) 
               }) &&
               !isPast(date);
      }),
      color: 'bg-gray-400'
    },
    {
      title: 'Overdue',
      tasks: myTasks.filter(t => t.status !== 'Done' && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))),
      color: 'bg-red-500'
    },
    {
      title: 'Completed',
      tasks: myTasks.filter(t => t.status === 'Done'),
      color: 'bg-green-500'
    }
  ];

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-secondary transition-colors duration-300">
      <header className="p-8 pb-4 bg-bg-card border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-navy">My Work</h1>
              <p className="text-sm text-navy/50 mt-1">Track all your tasks across all projects in one place.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" size={16} />
                <input 
                  type="text" 
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-secondary border-none rounded-lg text-sm focus:ring-2 focus:ring-navy/10 outline-none w-64 transition-all"
                />
              </div>
              <button className="p-2 hover:bg-secondary rounded-lg text-navy/60 transition-colors">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-navy/40 border-b border-border">
            <button className="pb-3 border-b-2 border-navy text-navy">List View</button>
            <button className="pb-3 hover:text-navy transition-colors">Calendar</button>
            <button className="pb-3 hover:text-navy transition-colors">Files</button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 pt-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {groups.map(group => (
            <div key={group.title} className="space-y-3">
              <button 
                onClick={() => toggleGroup(group.title)}
                className="flex items-center gap-2 group w-full text-left"
              >
                <div className={cn(
                  "transition-transform duration-200 text-navy/40 group-hover:text-navy",
                  expandedGroups[group.title] ? "rotate-0" : "-rotate-90"
                )}>
                  <ChevronDown size={18} />
                </div>
                <div className={cn("w-1 h-6 rounded-full", group.color)} />
                <h3 className="font-bold text-navy flex items-center gap-2">
                  {group.title}
                  <span className="text-xs font-normal text-navy/30 bg-navy/5 px-2 py-0.5 rounded-full">
                    {group.tasks.length}
                  </span>
                </h3>
              </button>

              {expandedGroups[group.title] && (
                <div className="bg-bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-wider text-navy/40 font-bold border-b border-border bg-secondary/30">
                        <th className="px-6 py-3 w-12"></th>
                        <th className="px-4 py-3">Task Name</th>
                        <th className="px-4 py-3">Project</th>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {group.tasks.map(task => (
                        <tr 
                          key={task.id}
                          onClick={() => handleTaskClick(task)}
                          className="group hover:bg-primary/30 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateTaskStatus(task.id, task.status === 'Done' ? 'To-Do' : 'Done');
                              }}
                              className={cn(
                                "transition-colors",
                                task.status === 'Done' ? "text-green-500" : "text-navy/20 hover:text-navy/40"
                              )}
                            >
                              {task.status === 'Done' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className={cn(
                              "text-sm font-semibold text-navy",
                              task.status === 'Done' && "line-through opacity-40"
                            )}>
                              {task.title}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-xs font-medium text-navy/50">
                              <div className="w-2 h-2 rounded-full bg-navy/20" />
                              {projects.find(p => p.id === task.projectId)?.name}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className={cn(
                              "flex items-center gap-2 text-xs font-medium",
                              isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'Done' 
                                ? "text-red-500" 
                                : "text-navy/40"
                            )}>
                              <Calendar size={14} />
                              {format(new Date(task.dueDate), 'MMM d')}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              task.priority === 'High' ? "bg-red-100 text-red-700" :
                              task.priority === 'Medium' ? "bg-orange-100 text-orange-700" :
                              "bg-blue-100 text-blue-700"
                            )}>
                              {task.priority}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge type={task.status} />
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button className="p-1 text-navy/20 hover:text-navy transition-colors opacity-0 group-hover:opacity-100">
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {group.tasks.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-sm text-navy/30 italic">
                            No tasks in this group
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <TaskModal 
        task={selectedTask} 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />
    </div>
  );
};
