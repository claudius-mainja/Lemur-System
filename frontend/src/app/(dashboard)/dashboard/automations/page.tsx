'use client';

import { useState, useEffect } from 'react';
import { 
  Zap, Plus, Search, Settings, Play, Pause, Trash2, Clock, ArrowRight,
  Bell, Mail, MessageSquare, Calendar, Users, FileText, DollarSign,
  CheckCircle, XCircle, RefreshCw, Copy, MoreHorizontal, X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  status: 'active' | 'paused' | 'draft';
  lastRun?: string;
  runCount: number;
}

const triggerTemplates = [
  { id: 'new_employee', name: 'New Employee Added', icon: Users },
  { id: 'invoice_paid', name: 'Invoice Paid', icon: DollarSign },
  { id: 'lead_created', name: 'New Lead Created', icon: Users },
  { id: 'task_completed', name: 'Task Completed', icon: CheckCircle },
  { id: 'leave_request', name: 'Leave Request Submitted', icon: Calendar },
];

const actionTemplates = [
  { id: 'send_email', name: 'Send Email', icon: Mail },
  { id: 'send_slack', name: 'Send Slack Message', icon: MessageSquare },
  { id: 'create_task', name: 'Create Task', icon: CheckCircle },
  { id: 'add_to_list', name: 'Add to List', icon: Users },
  { id: 'send_notification', name: 'Send Notification', icon: Bell },
  { id: 'update_status', name: 'Update Status', icon: RefreshCw },
];

export default function AutomationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    trigger: '',
    actions: [] as string[],
  });

  useEffect(() => {
    const stored = localStorage.getItem('automations');
    if (stored) {
      setAutomations(JSON.parse(stored));
    }
  }, []);

  const filteredAutomations = automations.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = automations.filter(a => a.status === 'active').length;
  const pausedCount = automations.filter(a => a.status === 'paused').length;

  const handleToggleStatus = (id: string) => {
    const updated = automations.map(a => {
      if (a.id === id) {
        const newStatus: 'active' | 'paused' = a.status === 'active' ? 'paused' : 'active';
        return { ...a, status: newStatus };
      }
      return a;
    });
    setAutomations(updated);
    localStorage.setItem('automations', JSON.stringify(updated));
    toast.success('Automation status updated');
  };

  const handleDelete = (id: string) => {
    const updated = automations.filter(a => a.id !== id);
    setAutomations(updated);
    localStorage.setItem('automations', JSON.stringify(updated));
    toast.success('Automation deleted');
  };

  const handleCreate = () => {
    if (!newAutomation.name || !newAutomation.trigger) {
      toast.error('Please fill in required fields');
      return;
    }
    const automation: Automation = {
      id: Math.random().toString(36).substring(2, 15),
      name: newAutomation.name,
      description: newAutomation.description,
      trigger: newAutomation.trigger,
      actions: newAutomation.actions,
      status: 'active',
      runCount: 0,
    };
    const updated = [...automations, automation];
    setAutomations(updated);
    localStorage.setItem('automations', JSON.stringify(updated));
    toast.success('Automation created');
    setShowCreateModal(false);
    setNewAutomation({ name: '', description: '', trigger: '', actions: [] });
  };

  const handleDuplicate = (automation: Automation) => {
    const duplicate: Automation = {
      ...automation,
      id: Math.random().toString(36).substring(2, 15),
      name: `${automation.name} (Copy)`,
      status: 'draft',
      runCount: 0,
    };
    const updated = [...automations, duplicate];
    setAutomations(updated);
    localStorage.setItem('automations', JSON.stringify(updated));
    toast.success('Automation duplicated');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520]">
      <header className="bg-[#0b2535]/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accentDark to-accent rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wider">Automations</h1>
              <p className="text-sm text-white/50">Workflow automation & triggers</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-accentDark to-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Create Automation
          </button>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Total Automations</p>
                <p className="text-2xl font-bold text-white mt-1">{automations.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Active</p>
                <p className="text-2xl font-bold text-green-500 mt-1">{activeCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Paused</p>
                <p className="text-2xl font-bold text-yellow-500 mt-1">{pausedCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Pause className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Total Runs</p>
                <p className="text-2xl font-bold text-purple-500 mt-1">
                  {automations.reduce((acc, a) => acc + a.runCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl">
          <div className="p-4 border-b border-white/10">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search automations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm bg-white/5 text-white"
              />
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {filteredAutomations.length === 0 ? (
              <div className="p-12 text-center">
                <Zap className="w-16 h-16 mx-auto text-white/20 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Automations Yet</h3>
                <p className="text-white/50 mb-6">Create your first automation to streamline workflows</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-accentDark to-accent text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create Automation
                </button>
              </div>
            ) : (
              filteredAutomations.map((automation) => (
                <div key={automation.id} className="p-6 hover:bg-white/5 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        automation.status === 'active' 
                          ? 'bg-green-500/20' 
                          : automation.status === 'paused'
                          ? 'bg-yellow-500/20'
                          : 'bg-white/10'
                      }`}>
                        <Zap className={`w-6 h-6 ${
                          automation.status === 'active' 
                            ? 'text-green-500' 
                            : automation.status === 'paused'
                            ? 'text-yellow-500'
                            : 'text-white/50'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{automation.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            automation.status === 'active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : automation.status === 'paused'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-white/10 text-white/50'
                          }`}>
                            {automation.status}
                          </span>
                        </div>
                        <p className="text-sm text-white/50 mt-1">{automation.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/40">Trigger:</span>
                            <span className="text-xs font-medium bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                              {automation.trigger}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/30" />
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/40">Actions:</span>
                            {automation.actions.map((action, i) => (
                              <span key={i} className="text-xs font-medium bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                                {action}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
                          <span className="flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            {automation.runCount} runs
                          </span>
                          {automation.lastRun && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Last run: {new Date(automation.lastRun).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(automation.id)}
                        className={`p-2 rounded-lg ${
                          automation.status === 'active'
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                      >
                        {automation.status === 'active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDuplicate(automation)}
                        className="p-2 rounded-lg hover:bg-white/10"
                      >
                        <Copy className="w-4 h-4 text-white/50" />
                      </button>
                      <button
                        onClick={() => handleDelete(automation.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Create Automation</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Automation Name *</label>
                <input
                  type="text"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  placeholder="e.g., New Employee Welcome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Description</label>
                <textarea
                  value={newAutomation.description}
                  onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white resize-none"
                  rows={2}
                  placeholder="What does this automation do?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">When this happens (Trigger) *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {triggerTemplates.map((trigger) => {
                    const Icon = trigger.icon;
                    return (
                      <button
                        key={trigger.id}
                        onClick={() => setNewAutomation({ ...newAutomation, trigger: trigger.name })}
                        className={`p-3 rounded-lg border text-left transition ${
                          newAutomation.trigger === trigger.name
                            ? 'border-teal-500 bg-teal-500/20'
                            : 'border-white/10 hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1 text-white/70" />
                        <span className="text-sm font-medium text-white">{trigger.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Do this (Actions)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {actionTemplates.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => {
                          const actions = newAutomation.actions.includes(action.name)
                            ? newAutomation.actions.filter(a => a !== action.name)
                            : [...newAutomation.actions, action.name];
                          setNewAutomation({ ...newAutomation, actions });
                        }}
                        className={`p-3 rounded-lg border text-left transition ${
                          newAutomation.actions.includes(action.name)
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/10 hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1 text-white/70" />
                        <span className="text-sm font-medium text-white">{action.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-gradient-to-r from-accentDark to-accent text-white rounded-lg hover:shadow-lg"
                >
                  Create Automation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
