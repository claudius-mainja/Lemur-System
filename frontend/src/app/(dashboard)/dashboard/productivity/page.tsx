'use client';

import { useState } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { 
  Zap, Plus, Search, MoreHorizontal, CheckCircle, Clock, AlertCircle,
  Calendar, Users, Briefcase, Target, TrendingUp, Edit, Trash2, Eye,
  ArrowRight, Flag, ListTodo, FileText, MessageSquare, Video
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'tasks' | 'projects' | 'calendar' | 'team';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  dueDate: string;
  project: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'active' | 'completed' | 'on_hold';
  teamSize: number;
  dueDate: string;
}

const mockTasks: Task[] = [
  { id: '1', title: 'Review Q1 Financial Reports', description: 'Review and approve quarterly financial reports', status: 'in_progress', priority: 'high', assignee: 'Thabo Mokoena', dueDate: '2024-02-15', project: 'Finance' },
  { id: '2', title: 'Update Employee Records', description: 'Add new hires to the system', status: 'todo', priority: 'medium', assignee: 'Amara Okonkwo', dueDate: '2024-02-20', project: 'HR' },
  { id: '3', title: 'Client Presentation Prep', description: 'Prepare slides for MegaMart meeting', status: 'review', priority: 'urgent', assignee: 'Lerato Dlamini', dueDate: '2024-02-12', project: 'Sales' },
  { id: '4', title: 'Inventory Audit', description: 'Complete monthly inventory check', status: 'completed', priority: 'low', assignee: 'Pieter van der Merwe', dueDate: '2024-02-10', project: 'Operations' },
  { id: '5', title: 'Software Update Review', description: 'Review new system requirements', status: 'todo', priority: 'medium', assignee: 'Fatima Ahmed', dueDate: '2024-02-25', project: 'IT' },
];

const mockProjects: Project[] = [
  { id: '1', name: 'Q1 Financial Review', description: 'Complete quarterly financial analysis and reporting', progress: 75, status: 'active', teamSize: 4, dueDate: '2024-03-31' },
  { id: '2', name: 'HR Onboarding Campaign', description: 'New employee onboarding process improvement', progress: 45, status: 'active', teamSize: 3, dueDate: '2024-04-15' },
  { id: '3', name: 'Website Redesign', description: 'Company website modernization project', progress: 90, status: 'active', teamSize: 5, dueDate: '2024-02-28' },
  { id: '4', name: 'CRM Implementation', description: 'Customer relationship management system rollout', progress: 30, status: 'active', teamSize: 6, dueDate: '2024-05-30' },
];

export default function ProductivityDashboard() {
  const { theme } = useThemeStore();
  const [activeView, setActiveView] = useState<ViewTab>('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [projects] = useState<Project[]>(mockProjects);
  const [showAddTask, setShowAddTask] = useState(false);

  const isDark = theme === 'dark';

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'low': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'review': return <Eye className="w-4 h-4 text-amber-500" />;
      default: return <Circle className="w-4 h-4 text-slate-500" />;
    }
  };

  const stats = {
    totalTasks: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
    activeProjects: projects.filter(p => p.status === 'active').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold uppercase tracking-wide ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
            Productivity Hub
          </h1>
          <p className={`text-sm ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
            Manage tasks, projects, and team collaboration
          </p>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          NEW TASK
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'TOTAL TASKS', value: stats.totalTasks, icon: ListTodo, color: 'from-blue-500 to-cyan-500' },
          { label: 'COMPLETED', value: stats.completed, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
          { label: 'IN PROGRESS', value: stats.inProgress, icon: Clock, color: 'from-amber-500 to-orange-500' },
          { label: 'OVERDUE', value: stats.overdue, icon: AlertCircle, color: 'from-red-500 to-pink-500' },
          { label: 'PROJECTS', value: stats.activeProjects, icon: Briefcase, color: 'from-purple-500 to-pink-500' },
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className={`backdrop-blur-sm rounded-xl p-4 border animate-fade-in-up ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{stat.value}</p>
            <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'uted' : 'text-light-text-mtext-dark-text-muted'}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* View Tabs */}
      <div className={`flex gap-2 p-1 rounded-xl ${isDark ? 'bg-dark-bg-tertiary' : 'bg-light-bg-tertiary'} w-fit`}>
        {[
          { id: 'tasks' as ViewTab, label: 'TASKS', icon: ListTodo },
          { id: 'projects' as ViewTab, label: 'PROJECTS', icon: Briefcase },
          { id: 'calendar' as ViewTab, label: 'CALENDAR', icon: Calendar },
          { id: 'team' as ViewTab, label: 'TEAM', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
              activeView === tab.id
                ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg'
                : `${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'} hover:bg-white/10`
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks View */}
      {activeView === 'tasks' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isDark ? 'bg-dark-bg-tertiary border-dark-border text-dark-text' : 'bg-light-bg-secondary border-light-border text-light-text'} focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
            />
          </div>

          {/* Task List */}
          <div className="grid gap-4">
            {filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className={`group backdrop-blur-sm rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up ${isDark ? 'bg-dark-card/80 border-dark-border hover:border-blue-500/50' : 'bg-light-card/80 border-light-border hover:border-orange-500/50'}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-dark-bg-tertiary' : 'bg-light-bg-tertiary'}`}>
                      {getStatusIcon(task.status)}
                    </div>
                    <div>
                      <h3 className={`font-bold uppercase tracking-wide ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                        {task.title}
                      </h3>
                      <p className={`text-sm mt-1 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                        {task.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                          <Clock className="w-3 h-3 inline mr-1" />
                          {task.dueDate}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                          <Users className="w-3 h-3 inline mr-1" />
                          {task.assignee}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-dark-bg-tertiary text-dark-text-secondary' : 'bg-light-bg-tertiary text-light-text-secondary'}`}>
                          {task.project}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${isDark ? 'hover:bg-dark-bg-tertiary' : 'hover:bg-light-bg-tertiary'}`}>
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects View */}
      {activeView === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`group backdrop-blur-sm rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up ${isDark ? 'bg-dark-card/80 border-dark-border hover:border-blue-500/50' : 'bg-light-card/80 border-light-border hover:border-orange-500/50'}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className={`font-bold uppercase tracking-wide ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                    {project.name}
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                    {project.description}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded-lg uppercase ${
                  project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Progress</span>
                  <span className={`text-xs font-bold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{project.progress}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-dark-bg-tertiary' : 'bg-light-bg-tertiary'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(project.teamSize, 3))].map((_, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 ${isDark ? 'border-dark-card' : 'border-light-card'} bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                      </div>
                    ))}
                    {project.teamSize > 3 && (
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isDark ? 'border-dark-card bg-dark-bg-tertiary' : 'border-light-card bg-light-bg-tertiary'}`}>
                        <span className={`text-xs font-bold ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>+{project.teamSize - 3}</span>
                      </div>
                    )}
                  </div>
                  <span className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                    Due: {project.dueDate}
                  </span>
                </div>
                <button className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${isDark ? 'hover:bg-dark-bg-tertiary' : 'hover:bg-light-bg-tertiary'}`}>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {activeView === 'calendar' && (
        <div className={`backdrop-blur-sm rounded-xl p-6 border animate-fade-in-up ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
          <div className="text-center py-12">
            <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} />
            <h3 className={`text-xl font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
              Calendar View
            </h3>
            <p className={`${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
              Calendar integration coming soon
            </p>
          </div>
        </div>
      )}

      {/* Team View */}
      {activeView === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Thabo Mokoena', role: 'Managing Director', tasks: 5 },
            { name: 'Amara Okonkwo', role: 'HR Manager', tasks: 8 },
            { name: 'Pieter van der Merwe', role: 'Finance Controller', tasks: 6 },
            { name: 'Lerato Dlamini', role: 'Sales Executive', tasks: 12 },
            { name: 'Fatima Ahmed', role: 'Systems Admin', tasks: 4 },
            { name: 'Kyle Hendricks', role: 'Operations Manager', tasks: 7 },
          ].map((member, index) => (
            <div
              key={member.name}
              className={`group backdrop-blur-sm rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up ${isDark ? 'bg-dark-card/80 border-dark-border hover:border-blue-500/50' : 'bg-light-card/80 border-light-border hover:border-orange-500/50'}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className={`font-bold uppercase tracking-wide ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                    {member.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                    {member.role}
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {member.tasks} active tasks
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Circle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
