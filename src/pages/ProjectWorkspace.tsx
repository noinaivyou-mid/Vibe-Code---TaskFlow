import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { LayoutGrid, List, Filter, Plus, Pencil, Trash2, Share2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { KanbanColumn } from '../components/KanbanColumn';
import { TaskModal } from '../components/TaskModal';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { Badge } from '../components/Badge';
import { Task, Status, Priority } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export const ProjectWorkspace: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, updateTaskStatus, deleteTask } = useApp();
  const project = projects.find(p => p.id === projectId);

  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [initialStatus, setInitialStatus] = useState<Status>('To-Do');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [projectCopied, setProjectCopied] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (!project) return <div>Project not found</div>;

  const filteredTasks = project.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      updateTaskStatus(active.id as string, over.id as Status);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleAddTask = (status: Status = 'To-Do') => {
    setEditingTask(null);
    setInitialStatus(status);
    setIsCreateModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsCreateModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  const handleShareProject = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setProjectCopied(true);
    setTimeout(() => setProjectCopied(false), 2000);
  };

  const statuses: Status[] = ['To-Do', 'In Progress', 'Stuck', 'Done'];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-navy">{project.name}</h1>
              <button 
                onClick={handleShareProject}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold transition-all",
                  projectCopied ? "bg-green-500 text-white" : "bg-secondary text-navy/40 hover:text-navy"
                )}
              >
                {projectCopied ? <Check size={12} /> : <Share2 size={12} />}
                {projectCopied ? 'Link Copied' : 'Share Project'}
              </button>
            </div>
            <p className="text-navy/50 text-sm">Manage your team tasks and project progress.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-bg-card rounded-lg p-1 border border-border shadow-sm">
              <button 
                onClick={() => setView('kanban')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all",
                  view === 'kanban' ? "bg-primary text-navy shadow-sm" : "text-navy/40 hover:text-navy"
                )}
              >
                <LayoutGrid size={16} />
                Kanban
              </button>
              <button 
                onClick={() => setView('list')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all",
                  view === 'list' ? "bg-primary text-navy shadow-sm" : "text-navy/40 hover:text-navy"
                )}
              >
                <List size={16} />
                List
              </button>
            </div>
            
            <button 
              onClick={() => handleAddTask()}
              className="bg-navy text-bg-card px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-navy/90 transition-all shadow-lg shadow-navy/20"
            >
              <Plus size={18} />
              New Task
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
            <input 
              type="text" 
              placeholder="Filter tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-card border border-border rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-navy"
            />
          </div>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="bg-bg-card border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-navy/60 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto px-8 pb-8">
        {view === 'kanban' ? (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex gap-6 h-full min-h-[500px]">
              {statuses.map(status => (
                <KanbanColumn 
                  key={status} 
                  status={status} 
                  tasks={filteredTasks.filter(t => t.status === status)}
                  onTaskClick={handleTaskClick}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          </DndContext>
        ) : (
          <div className="bg-bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-navy/40">Task Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-navy/40">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-navy/40">Priority</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-navy/40">Assignee</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-navy/40">Due Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-navy/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTasks.length > 0 ? filteredTasks.map(task => (
                  <tr 
                    key={task.id} 
                    onClick={() => handleTaskClick(task)}
                    className="hover:bg-primary/20 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-navy group-hover:text-blue-600 transition-colors">{task.title}</div>
                      <div className="text-xs text-navy/40 truncate max-w-xs">{task.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge type={task.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Badge type={task.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img src={task.assignee.avatar} alt="" className="w-6 h-6 rounded-full" />
                        <span className="text-xs font-medium text-navy">{task.assignee.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-navy/60">
                      {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(task);
                          }}
                          className="p-1.5 hover:bg-navy/5 rounded-md text-navy/40 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task);
                          }}
                          className="p-1.5 hover:bg-red-50 rounded-md text-navy/40 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-navy/20">
                          <Plus size={32} />
                        </div>
                        <div>
                          <p className="font-bold text-navy">No tasks found</p>
                          <p className="text-sm text-navy/40">Try adjusting your filters or create a new task.</p>
                        </div>
                        <button 
                          onClick={() => handleAddTask()}
                          className="mt-2 text-blue-600 font-bold text-sm hover:underline"
                        >
                          Create your first task
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TaskModal 
        task={selectedTask} 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />
      
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTask(null);
        }}
        initialStatus={initialStatus}
        projectId={projectId!}
        taskToEdit={editingTask || undefined}
      />
    </div>
  );
};
