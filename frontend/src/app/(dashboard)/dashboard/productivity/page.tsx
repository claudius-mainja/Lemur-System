'use client';

import { useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { useAuthStore } from '@/stores/auth.store';
import { useDataStore } from '@/stores/data.store';
import { 
  Plus, Search, MoreHorizontal, CheckCircle, Clock, AlertCircle,
  Calendar, Users, Briefcase, Target, Trash2, Eye, ArrowRight, Flag, 
  ListTodo, FileText, X, Upload, Paperclip, Video, MapPin, Bell
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'tasks' | 'projects' | 'calendar' | 'team' | 'files';

type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeId?: string;
  dueDate: string;
  project: string;
  projectId?: string;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'active' | 'completed' | 'on_hold';
  teamMembers: string[];
  dueDate: string;
  createdAt: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'reminder';
  attendees: string[];
  meetingLink?: string;
  location?: string;
}

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: number;
  projectId: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

export default function ProductivityDashboard() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { employees } = useDataStore();
  const [activeView, setActiveView] = useState<ViewTab>('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    dueDate: '',
    assignee: '',
    project: '',
  });

  const [newProject, setNewProject] = useState<{
    name: string;
    description: string;
    dueDate: string;
    status: 'active' | 'completed' | 'on_hold';
    teamMembers: string[];
  }>({
    name: '',
    description: '',
    dueDate: '',
    status: 'active',
    teamMembers: [],
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'meeting' as 'meeting' | 'deadline' | 'reminder',
    attendees: [] as string[],
    meetingLink: '',
    location: '',
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    const storedTasks = localStorage.getItem('productivity-tasks');
    const storedProjects = localStorage.getItem('productivity-projects');
    const storedEvents = localStorage.getItem('productivity-events');
    const storedFiles = localStorage.getItem('productivity-files');
    const storedTeam = localStorage.getItem('productivity-team');
    
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedProjects) setProjects(JSON.parse(storedProjects));
    if (storedEvents) setEvents(JSON.parse(storedEvents));
    if (storedFiles) setFiles(JSON.parse(storedFiles));
    if (storedTeam) setTeamMembers(JSON.parse(storedTeam));
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('productivity-tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('productivity-projects', JSON.stringify(projects));
    }
  }, [projects, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('productivity-events', JSON.stringify(events));
    }
  }, [events, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('productivity-files', JSON.stringify(files));
    }
  }, [files, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('productivity-team', JSON.stringify(teamMembers));
    }
  }, [teamMembers, isLoading]);

  useEffect(() => {
    const empMembers = employees.map(emp => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      email: emp.email,
      role: emp.position || 'Employee',
    }));
    if (empMembers.length > 0 && teamMembers.length === 0) {
      setTeamMembers(empMembers);
    }
  }, [employees]);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.date.includes(searchQuery)
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
      default: return <div className="w-4 h-4 rounded-full border-2 border-slate-500" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'meeting': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'deadline': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'reminder': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    const projectObj = projects.find(p => p.id === newTask.project);
    const assignee = teamMembers.find(m => m.id === newTask.assignee);

    const task: Task = {
      id: generateId(),
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      assignee: assignee?.name || newTask.assignee || 'Unassigned',
      assigneeId: newTask.assignee,
      dueDate: newTask.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      project: projectObj?.name || newTask.project || 'General',
      projectId: newTask.project,
      createdAt: new Date().toISOString(),
    };

    setTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', assignee: '', project: '' });
    setShowAddTask(false);
    toast.success('Task created and assigned');
  };

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    const project: Project = {
      id: generateId(),
      name: newProject.name,
      description: newProject.description,
      progress: 0,
      status: newProject.status,
      teamMembers: newProject.teamMembers,
      dueDate: newProject.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    setProjects([project, ...projects]);
    setNewProject({ name: '', description: '', dueDate: '', status: 'active', teamMembers: [] });
    setShowAddProject(false);
    toast.success('Project created successfully');
  };

  const handleCreateEvent = () => {
    if (!newEvent.title.trim()) {
      toast.error('Event title is required');
      return;
    }

    const event: CalendarEvent = {
      id: generateId(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date || new Date().toISOString().split('T')[0],
      time: newEvent.time || '09:00',
      type: newEvent.type,
      attendees: newEvent.attendees,
      meetingLink: newEvent.meetingLink,
      location: newEvent.location,
    };

    setEvents([event, ...events]);
    setNewEvent({ title: '', description: '', date: '', time: '', type: 'meeting', attendees: [], meetingLink: '', location: '' });
    setShowAddEvent(false);
    toast.success('Meeting scheduled');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach(file => {
      const newFile: ProjectFile = {
        id: generateId(),
        name: file.name,
        type: file.type,
        size: file.size,
        projectId,
        uploadedBy: user?.firstName || 'Unknown',
        uploadedAt: new Date().toISOString(),
        url: URL.createObjectURL(file),
      };
      setFiles(prev => [...prev, newFile]);
    });
    
    toast.success(`${uploadedFiles.length} file(s) uploaded`);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    toast.success('Task status updated');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    toast.success('Task deleted');
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    toast.success('Project deleted');
  };

  const stats = {
    totalTasks: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    upcomingMeetings: events.filter(e => new Date(e.date) >= new Date()).length,
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
            Manage tasks, projects, team & meetings
          </p>
        </div>
        <div className="flex gap-2">
          {activeView === 'tasks' && (
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              NEW TASK
            </button>
          )}
          {activeView === 'projects' && (
            <button
              onClick={() => setShowAddProject(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              NEW PROJECT
            </button>
          )}
          {activeView === 'calendar' && (
            <button
              onClick={() => setShowAddEvent(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              SCHEDULE MEETING
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'TOTAL TASKS', value: stats.totalTasks, icon: ListTodo, color: 'from-blue-500 to-cyan-500' },
          { label: 'COMPLETED', value: stats.completed, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
          { label: 'IN PROGRESS', value: stats.inProgress, icon: Clock, color: 'from-amber-500 to-orange-500' },
          { label: 'OVERDUE', value: stats.overdue, icon: AlertCircle, color: 'from-red-500 to-pink-500' },
          { label: 'PROJECTS', value: stats.activeProjects, icon: Briefcase, color: 'from-purple-500 to-pink-500' },
          { label: 'MEETINGS', value: stats.upcomingMeetings, icon: Calendar, color: 'from-indigo-500 to-purple-500' },
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
            <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{stat.label}</p>
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
          { id: 'files' as ViewTab, label: 'FILES', icon: FileText },
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

          {filteredTasks.length === 0 ? (
            <div className={`backdrop-blur-sm rounded-xl p-12 border text-center ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
              <ListTodo className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} />
              <h3 className={`text-xl font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>No Tasks Yet</h3>
              <p className={`${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'} mb-6`}>Create your first task to get started</p>
              <button onClick={() => setShowAddTask(true)} className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2">
                <Plus className="w-5 h-5" /> Create Task
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`group backdrop-blur-sm rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up ${isDark ? 'bg-dark-card/80 border-dark-border hover:border-blue-500/50' : 'bg-light-card/80 border-light-border hover:border-orange-500/50'}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <button onClick={() => handleUpdateTaskStatus(task.id, task.status === 'completed' ? 'todo' : 'completed')} className={`p-2 rounded-lg ${isDark ? 'bg-dark-bg-tertiary' : 'bg-light-bg-tertiary'}`}>
                        {getStatusIcon(task.status)}
                      </button>
                      <div>
                        <h3 className={`font-bold uppercase tracking-wide ${isDark ? 'text-dark-text' : 'text-light-text'} ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                          {task.title}
                        </h3>
                        <p className={`text-sm mt-1 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{task.description || 'No description'}</p>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getPriorityColor(task.priority)}`}>{task.priority.toUpperCase()}</span>
                          <span className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}><Clock className="w-3 h-3 inline mr-1" />{task.dueDate}</span>
                          <span className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}><Users className="w-3 h-3 inline mr-1" />{task.assignee}</span>
                          <span className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-dark-bg-tertiary text-dark-text-secondary' : 'bg-light-bg-tertiary text-light-text-secondary'}`}>{task.project}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleDeleteTask(task.id)} className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${isDark ? 'hover:bg-dark-bg-tertiary' : 'hover:bg-light-bg-tertiary'}`}>
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Projects View */}
      {activeView === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.length === 0 ? (
            <div className={`col-span-full backdrop-blur-sm rounded-xl p-12 border text-center ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
              <Briefcase className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} />
              <h3 className={`text-xl font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>No Projects Yet</h3>
              <p className={`${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'} mb-6`}>Create your first project</p>
              <button onClick={() => setShowAddProject(true)} className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2">
                <Plus className="w-5 h-5" /> Create Project
              </button>
            </div>
          ) : (
            projects.map((project, index) => (
              <div key={project.id} className={`group backdrop-blur-sm rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className={`font-bold uppercase tracking-wide ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{project.name}</h3>
                    <p className={`text-sm mt-1 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{project.description || 'No description'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-lg uppercase ${project.status === 'active' ? 'bg-green-500/20 text-green-400' : project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {project.status}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Progress</span>
                    <span className={`text-xs font-bold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{project.progress}%</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-dark-bg-tertiary' : 'bg-light-bg-tertiary'}`}>
                    <div className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.teamMembers.slice(0, 3).map((memberId, i) => {
                      const member = teamMembers.find(m => m.id === memberId);
                      return (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 ${isDark ? 'border-dark-card' : 'border-light-card'} bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center`}>
                          <span className="text-white text-xs font-bold">{member?.name?.[0] || '?'}</span>
                        </div>
                      );
                    })}
                    {project.teamMembers.length > 3 && (
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isDark ? 'border-dark-card bg-dark-bg-tertiary' : 'border-light-card bg-light-bg-tertiary'}`}>
                        <span className={`text-xs font-bold ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>+{project.teamMembers.length - 3}</span>
                      </div>
                    )}
                  </div>
                  <span className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Due: {project.dueDate}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-dashed flex gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${isDark ? 'bg-dark-bg-tertiary hover:bg-dark-border' : 'bg-light-bg-tertiary hover:bg-light-border'} transition`}>
                    <Upload className="w-4 h-4" />
                    <span className="text-xs">Upload Files</span>
                    <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(e, project.id)} />
                  </label>
                  <button onClick={() => setSelectedProject(project.id)} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-dark-bg-tertiary hover:bg-dark-border' : 'bg-light-bg-tertiary hover:bg-light-border'} transition`}>
                    <FileText className="w-4 h-4" />
                    <span className="text-xs">View Files ({files.filter(f => f.projectId === project.id).length})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Calendar View */}
      {activeView === 'calendar' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isDark ? 'bg-dark-bg-tertiary border-dark-border text-dark-text' : 'bg-light-bg-secondary border-light-border text-light-text'} focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
            />
          </div>

          {filteredEvents.length === 0 ? (
            <div className={`backdrop-blur-sm rounded-xl p-12 border text-center ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
              <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} />
              <h3 className={`text-xl font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>No Meetings Scheduled</h3>
              <p className={`${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'} mb-6`}>Schedule your first meeting</p>
              <button onClick={() => setShowAddEvent(true)} className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2">
                <Plus className="w-5 h-5" /> Schedule Meeting
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className={`backdrop-blur-sm rounded-xl p-5 border ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${event.type === 'meeting' ? 'bg-blue-500/20' : event.type === 'deadline' ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
                        {event.type === 'meeting' ? <Video className="w-6 h-6 text-blue-400" /> : event.type === 'deadline' ? <Flag className="w-6 h-6 text-red-400" /> : <Bell className="w-6 h-6 text-amber-400" />}
                      </div>
                      <div>
                        <h3 className={`font-bold uppercase tracking-wide ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{event.title}</h3>
                        <p className={`text-sm mt-1 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{event.description}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded-lg border ${getEventTypeColor(event.type)}`}>{event.type.toUpperCase()}</span>
                          <span className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}><Calendar className="w-3 h-3 inline mr-1" />{event.date} at {event.time}</span>
                          {event.location && <span className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}><MapPin className="w-3 h-3 inline mr-1" />{event.location}</span>}
                          {event.meetingLink && <a href={event.meetingLink} target="_blank" className="text-xs text-blue-500 hover:underline"><Video className="w-3 h-3 inline mr-1" />Join Meeting</a>}
                        </div>
                        {event.attendees.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Attendees:</span>
                            {event.attendees.map((att, i) => {
                              const member = teamMembers.find(m => m.id === att);
                              return (
                                <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-dark-bg-tertiary' : 'bg-light-bg-tertiary'}`}>{member?.name || att}</span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <button onClick={() => setEvents(events.filter(e => e.id !== event.id))} className={`p-2 rounded-lg ${isDark ? 'hover:bg-dark-bg-tertiary' : 'hover:bg-light-bg-tertiary'}`}>
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Team View */}
      {activeView === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.length === 0 ? (
            <div className={`col-span-full backdrop-blur-sm rounded-xl p-12 border text-center ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
              <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} />
              <h3 className={`text-xl font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>No Team Members</h3>
              <p className={`${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Add employees in HR module to see them here</p>
            </div>
          ) : (
            teamMembers.map((member, index) => (
              <div key={member.id} className={`backdrop-blur-sm rounded-xl p-5 border ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h3 className={`font-bold uppercase tracking-wide ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{member.name}</h3>
                    <p className={`text-sm ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{member.role}</p>
                    <p className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{member.email}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-dashed">
                  <p className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                    {tasks.filter(t => t.assigneeId === member.id).length} tasks assigned
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Files View */}
      {activeView === 'files' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map(project => (
              <div key={project.id} className={`backdrop-blur-sm rounded-xl p-4 border ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
                <h3 className={`font-bold uppercase tracking-wide mb-3 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{project.name}</h3>
                <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer bg-gradient-to-r from-blue-500 to-orange-500 text-white transition hover:shadow-lg`}>
                  <Upload className="w-5 h-5" />
                  <span>Upload Files</span>
                  <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(e, project.id)} />
                </label>
              </div>
            ))}
          </div>

          {files.length === 0 ? (
            <div className={`backdrop-blur-sm rounded-xl p-12 border text-center ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
              <FileText className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} />
              <h3 className={`text-xl font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>No Files Uploaded</h3>
              <p className={`${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Upload files to projects</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, index) => {
                const project = projects.find(p => p.id === file.projectId);
                return (
                  <div key={file.id} className={`backdrop-blur-sm rounded-xl p-4 border ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium truncate ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{file.name}</h4>
                        <p className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{project?.name || 'Unknown'} - {(file.size / 1024).toFixed(1)} KB</p>
                        <p className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{file.uploadedBy} - {new Date(file.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <a href={file.url} target="_blank" className={`flex-1 text-center py-2 rounded-lg text-xs ${isDark ? 'bg-dark-bg-tertiary hover:bg-dark-border' : 'bg-light-bg-tertiary hover:bg-light-border'}`}>View</a>
                      <button onClick={() => setFiles(files.filter(f => f.id !== file.id))} className="px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white dark:bg-dark-card rounded-xl p-6 w-full max-w-lg ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Task</h3>
              <button onClick={() => setShowAddTask(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`} placeholder="Task title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`} rows={3} placeholder="Task description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Assign To</label>
                  <select value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`}>
                    <option value="">Select Team Member</option>
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Project</label>
                  <select value={newTask.project} onChange={(e) => setNewTask({ ...newTask, project: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`}>
                    <option value="">Select Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowAddTask(false)} className={`px-4 py-2 rounded-lg ${isDark ? 'hover:bg-dark-bg-tertiary' : 'hover:bg-light-bg-tertiary'}`}>Cancel</button>
                <button onClick={handleCreateTask} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-lg hover:shadow-lg">Create Task</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white dark:bg-dark-card rounded-xl p-6 w-full max-w-lg ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Project</h3>
              <button onClick={() => setShowAddProject(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name *</label>
                <input type="text" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`} placeholder="Project name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`} rows={3} placeholder="Project description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={newProject.status} onChange={(e) => setNewProject({ ...newProject, status: e.target.value as 'active' | 'completed' | 'on_hold' })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`}>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input type="date" value={newProject.dueDate} onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Team Members</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {teamMembers.map(m => (
                    <label key={m.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={newProject.teamMembers.includes(m.id)} onChange={(e) => {
                        if (e.target.checked) {
                          setNewProject({ ...newProject, teamMembers: [...newProject.teamMembers, m.id] });
                        } else {
                          setNewProject({ ...newProject, teamMembers: newProject.teamMembers.filter(id => id !== m.id) });
                        }
                      }} className="rounded" />
                      <span className="text-sm">{m.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowAddProject(false)} className={`px-4 py-2 rounded-lg ${isDark ? 'hover:bg-dark-bg-tertiary' : 'hover:bg-light-bg-tertiary'}`}>Cancel</button>
                <button onClick={handleCreateProject} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-lg hover:shadow-lg">Create Project</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white dark:bg-dark-card rounded-xl p-6 w-full max-w-lg ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Schedule Meeting</h3>
              <button onClick={() => setShowAddEvent(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`} placeholder="Meeting title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`} rows={2} placeholder="Meeting description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'meeting' | 'deadline' | 'reminder' })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`}>
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`} placeholder="Office or address" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meeting Link (optional)</label>
                <input type="url" value={newEvent.meetingLink} onChange={(e) => setNewEvent({ ...newEvent, meetingLink: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-light-bg-secondary border-light-border'}`} placeholder="https://zoom.us/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Attendees</label>
                <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
                  {teamMembers.map(m => (
                    <label key={m.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={newEvent.attendees.includes(m.id)} onChange={(e) => {
                        if (e.target.checked) {
                          setNewEvent({ ...newEvent, attendees: [...newEvent.attendees, m.id] });
                        } else {
                          setNewEvent({ ...newEvent, attendees: newEvent.attendees.filter(id => id !== m.id) });
                        }
                      }} className="rounded" />
                      <span className="text-sm">{m.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowAddEvent(false)} className={`px-4 py-2 rounded-lg ${isDark ? 'hover:bg-dark-bg-tertiary' : 'hover:bg-light-bg-tertiary'}`}>Cancel</button>
                <button onClick={handleCreateEvent} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-lg hover:shadow-lg">Schedule Meeting</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
