import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar, Info, X, Pencil, Trash2, LayoutGrid, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, isToday, isPast } from 'date-fns';
import { Badge } from '../components/Badge';
import { TaskModal } from '../components/TaskModal';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { Task } from '../types';
import { cn } from '../lib/utils';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const STATUS_COLORS = {
  'To Do': '#6366F1',
  'In Progress': '#F59E0B',
  'Done': '#10B981',
};

const PRIORITY_COLORS = {
  'High': '#EF4444',
  'Medium': '#F59E0B',
  'Low': '#3B82F6',
};

export const Dashboard: React.FC = () => {
  const { projects, currentUser, deleteTask } = useApp();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const allTasks = projects.flatMap(p => p.tasks);
  const myTasks = allTasks.filter(t => t.assignee.id === currentUser.id);
  
  const dueToday = myTasks.filter(t => isToday(new Date(t.dueDate)) && t.status !== 'Done');
  const overdue = myTasks.filter(t => isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate)) && t.status !== 'Done');
  const completed = myTasks.filter(t => t.status === 'Done');

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  const stats = [
    { label: 'Due Today', value: dueToday.length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Overdue', value: overdue.length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Completed', value: completed.length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Tasks', value: myTasks.length, icon: TrendingUp, color: 'text-navy', bg: 'bg-secondary' },
  ];

  const statusCounts = myTasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const priorityCounts = myTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityChartData = ['Low', 'Medium', 'High'].map(p => ({
    name: p,
    value: priorityCounts[p] || 0
  }));

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-navy mb-2">Welcome back, {currentUser.name}!</h1>
          <p className="text-navy/50">Here's what's happening with your projects today.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-bg-card p-6 rounded-2xl border border-border shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-3xl font-bold text-navy">{stat.value}</span>
            </div>
            <div className="text-sm font-semibold text-navy/40 uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-bg-card p-6 rounded-2xl border border-border shadow-sm h-[400px] flex flex-col"
        >
          <h3 className="font-bold text-navy mb-6">Task Status Distribution</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-card p-6 rounded-2xl border border-border shadow-sm h-[400px] flex flex-col"
        >
          <h3 className="font-bold text-navy mb-6">Tasks by Priority</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS] || '#8884d8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-navy">My Tasks Due Soon</h3>
              <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="divide-y divide-navy/5">
              {myTasks.slice(0, 5).map(task => (
                <div 
                  key={task.id} 
                  onClick={() => handleTaskClick(task)}
                  className="p-4 flex items-center justify-between hover:bg-primary transition-colors cursor-pointer group border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      task.priority === 'High' ? "bg-red-500" : task.priority === 'Medium' ? "bg-orange-500" : "bg-blue-500"
                    )} />
                    <div>
                      <div className="font-semibold text-sm text-navy group-hover:text-blue-600 transition-colors">{task.title}</div>
                      <div className="text-xs text-navy/40">{projects.find(p => p.id === task.projectId)?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTask(task);
                        }}
                        className="p-1.5 hover:bg-navy/5 rounded-md text-navy/40 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task);
                        }}
                        className="p-1.5 hover:bg-red-50 rounded-md text-navy/40 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <Badge type={task.status} />
                    <div className="text-xs font-medium text-navy/40 flex items-center gap-1">
                      <Calendar size={12} />
                      {format(new Date(task.dueDate), 'MMM d')}
                    </div>
                  </div>
                </div>
              ))}
              {myTasks.length === 0 && (
                <div className="p-10 text-center text-navy/40 text-sm">No tasks assigned to you yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-navy text-bg-card rounded-2xl p-6 shadow-xl shadow-navy/20">
            <h3 className="font-bold mb-4">Quick Tip</h3>
            <p className="text-sm text-bg-card/70 leading-relaxed mb-6">
              Use the Kanban board to visualize your workflow. Dragging tasks between columns automatically updates their status for the whole team.
            </p>
            <button 
              onClick={() => setIsGuideOpen(true)}
              className="w-full py-3 bg-bg-card/10 hover:bg-bg-card/20 rounded-xl text-sm font-bold transition-colors"
            >
              Learn More
            </button>
          </div>

          <div className="bg-bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-bold text-navy mb-4">Project Progress</h3>
            <div className="space-y-4">
              {projects.map(project => {
                const total = project.tasks.length;
                const done = project.tasks.filter(t => t.status === 'Done').length;
                const percent = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-navy">{project.name}</span>
                      <span className="text-navy/40">{percent}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        className="h-full bg-navy"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-bold text-navy mb-4">Team Overview</h3>
            <div className="space-y-4">
              {[
                { name: 'Alex Rivera', role: 'Project Manager', status: 'Active', avatar: 'https://picsum.photos/seed/alex/100/100' },
                { name: 'Sarah Chen', role: 'Lead Designer', status: 'In Meeting', avatar: 'https://picsum.photos/seed/sarah/100/100' },
                { name: 'Marcus Wright', role: 'Developer', status: 'Focus Mode', avatar: 'https://picsum.photos/seed/marcus/100/100' },
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={member.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-bg-card shadow-sm" />
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-card",
                        member.status === 'Active' ? "bg-green-500" : member.status === 'In Meeting' ? "bg-orange-500" : "bg-blue-500"
                      )} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-navy group-hover:text-blue-600 transition-colors">{member.name}</div>
                      <div className="text-[10px] text-navy/40 font-medium uppercase tracking-wider">{member.role}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-navy/30">{member.status}</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Manage Team
            </button>
          </div>

          <div className="bg-bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-bold text-navy mb-4">Recent Activity</h3>
            <div className="space-y-6">
              {allTasks.flatMap(t => t.comments.map(c => ({ ...c, taskTitle: t.title, taskId: t.id, task: t })))
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 4)
                .map((activity, i) => (
                  <div 
                    key={activity.id} 
                    onClick={() => handleTaskClick(activity.task)}
                    className="flex gap-4 cursor-pointer group"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex-shrink-0 flex items-center justify-center text-navy font-bold text-xs uppercase">
                      {activity.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-navy/80 leading-relaxed">
                        <span className="font-bold">{activity.user}</span> commented on <span className="font-bold text-blue-600 group-hover:underline">{activity.taskTitle}</span>
                      </p>
                      <p className="text-[10px] text-navy/40 mt-1">{format(new Date(activity.createdAt), 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                ))}
              {allTasks.flatMap(t => t.comments).length === 0 && (
                <div className="text-center py-4 text-navy/40 text-xs">No recent activity.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <TaskModal 
        task={selectedTask} 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />

      <CreateTaskModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        projectId={editingTask?.projectId || ''}
        taskToEdit={editingTask || undefined}
      />

      <AnimatePresence>
        {isGuideOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGuideOpen(false)}
              className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-bg-card rounded-2xl shadow-2xl z-[60] overflow-hidden"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-navy text-bg-card">
                <h2 className="text-xl font-bold">TaskFlow Guide</h2>
                <button onClick={() => setIsGuideOpen(false)} className="p-2 hover:bg-bg-card/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-navy flex-shrink-0">
                    <LayoutGrid size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy">Kanban View</h4>
                    <p className="text-sm text-navy/60">Drag and drop tasks between columns to update their status instantly.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-navy flex-shrink-0">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy">Track Progress</h4>
                    <p className="text-sm text-navy/60">Monitor project completion rates and identify bottlenecks from your dashboard.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-navy flex-shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy">Collaborate</h4>
                    <p className="text-sm text-navy/60">Add comments to tasks to keep all project communication in one place.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsGuideOpen(false)}
                  className="w-full py-3 bg-navy text-white rounded-xl font-bold hover:bg-navy/90 transition-all"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Removed local cn function as we now use the imported one
