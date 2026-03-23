'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { automationApi } from '@/services/api';

interface Workflow {
  id: string;
  name: string;
  description: string;
  module: string;
  trigger_type: string;
  status: string;
  is_automated: boolean;
  run_count: number;
  last_run_at: string;
  actions: any[];
}

interface ScheduledTask {
  id: string;
  name: string;
  task_type: string;
  module: string;
  config: any;
  is_active: boolean;
  is_automated: boolean;
  status: string;
  last_run_at: string;
}

interface AutomationSetting {
  id: string;
  module: string;
  setting_name: string;
  setting_key: string;
  value: any;
  is_automated: boolean;
  is_enabled: boolean;
}

interface ModuleConfig {
  code: string;
  name: string;
  settings: string[];
}

interface Stats {
  total_workflows: number;
  active_workflows: number;
  total_tasks: number;
  active_tasks: number;
  automated_count: number;
  manual_count: number;
}

export default function AutomationsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('workflows');
  const [loading, setLoading] = useState(true);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [settings, setSettings] = useState<AutomationSetting[]>([]);
  const [modules, setModules] = useState<ModuleConfig[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'workflow' | 'task' | 'setting'>('workflow');
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [wfRes, taskRes, setRes, modRes, statsRes] = await Promise.all([
        automationApi.getWorkflows().catch(() => ({ data: [] })),
        automationApi.getScheduledTasks().catch(() => ({ data: [] })),
        automationApi.getSettings().catch(() => ({ data: [] })),
        automationApi.getModules().catch(() => ({ data: { modules: [] } })),
        automationApi.getDashboardStats().catch(() => ({ data: null })),
      ]);
      
      setWorkflows(Array.isArray(wfRes.data) ? wfRes.data : []);
      setTasks(Array.isArray(taskRes.data) ? taskRes.data : []);
      setSettings(Array.isArray(setRes.data) ? setRes.data : []);
      setModules(modRes.data.modules || []);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load automation data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWorkflow = async (id: string, action: 'activate' | 'pause' | 'run' | 'toggle_automated') => {
    try {
      if (action === 'activate') await automationApi.activateWorkflow(id);
      else if (action === 'pause') await automationApi.pauseWorkflow(id);
      else if (action === 'run') await automationApi.runWorkflow(id);
      else if (action === 'toggle_automated') await automationApi.toggleWorkflowAutomated(id);
      loadData();
    } catch (err) {
      alert('Failed to update workflow');
    }
  };

  const handleToggleTask = async (id: string, action: 'toggle_active' | 'toggle_automated' | 'run') => {
    try {
      if (action === 'toggle_active') await automationApi.toggleTaskActive(id);
      else if (action === 'toggle_automated') await automationApi.toggleTaskAutomated(id);
      else if (action === 'run') await automationApi.runScheduledTask(id);
      loadData();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleToggleSetting = async (id: string, action: 'toggle_automated' | 'toggle_enabled') => {
    try {
      if (action === 'toggle_automated') await automationApi.toggleAutomated(id);
      else if (action === 'toggle_enabled') await automationApi.toggleEnabled(id);
      loadData();
    } catch (err) {
      alert('Failed to update setting');
    }
  };

  const handleCreateWorkflow = async (data: any) => {
    try {
      await automationApi.createWorkflow(data);
      setShowModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create workflow');
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      await automationApi.createScheduledTask(data);
      setShowModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create task');
    }
  };

  const handleCreateSetting = async (data: any) => {
    try {
      await automationApi.createSetting(data);
      setShowModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create setting');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automations</h1>
          <p className="text-gray-600">Manage workflows, scheduled tasks, and automation settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Workflows</h3>
          <p className="text-2xl font-bold text-gray-900">{stats?.total_workflows || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Active Workflows</h3>
          <p className="text-2xl font-bold text-green-600">{stats?.active_workflows || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Scheduled Tasks</h3>
          <p className="text-2xl font-bold text-purple-600">{stats?.total_tasks || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Automated</h3>
          <p className="text-2xl font-bold text-blue-600">{stats?.automated_count || 0}</p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'workflows', label: 'Workflows' },
            { id: 'tasks', label: 'Scheduled Tasks' },
            { id: 'settings', label: 'Automation Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'workflows' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Workflows</h2>
            <button
              onClick={() => { setModalType('workflow'); setEditingItem(null); setShowModal(true); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Workflow
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {workflows.map((wf) => (
              <div key={wf.id} className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{wf.name}</h3>
                  <p className="text-xs text-gray-500">{wf.description || 'No description'}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">{wf.module}</span>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">{wf.trigger_type}</span>
                    {wf.is_automated && <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">Automated</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    wf.status === 'active' ? 'bg-green-100 text-green-800' :
                    wf.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {wf.status}
                  </span>
                  <div className="flex gap-2">
                    {wf.status !== 'active' && (
                      <button onClick={() => handleToggleWorkflow(wf.id, 'activate')} className="text-sm text-green-600 hover:text-green-800">
                        Activate
                      </button>
                    )}
                    {wf.status === 'active' && (
                      <button onClick={() => handleToggleWorkflow(wf.id, 'pause')} className="text-sm text-yellow-600 hover:text-yellow-800">
                        Pause
                      </button>
                    )}
                    <button onClick={() => handleToggleWorkflow(wf.id, 'run')} className="text-sm text-blue-600 hover:text-blue-800">
                      Run
                    </button>
                    <button onClick={() => handleToggleWorkflow(wf.id, 'toggle_automated')} className="text-sm text-gray-600 hover:text-gray-800">
                      {wf.is_automated ? 'Make Manual' : 'Make Auto'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {workflows.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No workflows found. Create one to get started.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Scheduled Tasks</h2>
            <button
              onClick={() => { setModalType('task'); setEditingItem(null); setShowModal(true); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Task
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{task.name}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded">{task.task_type}</span>
                    {task.module && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">{task.module}</span>}
                    {task.is_automated && <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">Automated</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleToggleTask(task.id, 'toggle_active')} className="text-sm text-blue-600 hover:text-blue-800">
                      {task.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleToggleTask(task.id, 'run')} className="text-sm text-green-600 hover:text-green-800">
                      Run Now
                    </button>
                    <button onClick={() => handleToggleTask(task.id, 'toggle_automated')} className="text-sm text-gray-600 hover:text-gray-800">
                      {task.is_automated ? 'Make Manual' : 'Make Auto'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No scheduled tasks found. Create one to get started.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          {modules.map((mod) => (
            <div key={mod.code} className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold capitalize">{mod.name}</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mod.settings.map((setting) => {
                    const existing = settings.find(s => s.module === mod.code && s.setting_key === setting);
                    return (
                      <div key={setting} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{setting.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-gray-500">
                            {existing ? (existing.is_automated ? 'Automated' : 'Manual') : 'Not configured'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {existing ? (
                            <>
                              <button
                                onClick={() => existing && handleToggleSetting(existing.id, 'toggle_automated')}
                                className={`px-3 py-1 text-xs rounded ${existing.is_automated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                              >
                                {existing.is_automated ? 'Auto' : 'Manual'}
                              </button>
                              <button
                                onClick={() => existing && handleToggleSetting(existing.id, 'toggle_enabled')}
                                className={`px-3 py-1 text-xs rounded ${existing.is_enabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                              >
                                {existing.is_enabled ? 'Enabled' : 'Disabled'}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setModalType('setting');
                                setEditingItem({ module: mod.code, setting_name: setting.replace(/_/g, ' '), setting_key: setting });
                                setShowModal(true);
                              }}
                              className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                            >
                              Configure
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AutomationModal
          type={modalType}
          item={editingItem}
          modules={modules}
          onClose={() => { setShowModal(false); setEditingItem(null); }}
          onSubmit={modalType === 'workflow' ? handleCreateWorkflow : modalType === 'task' ? handleCreateTask : handleCreateSetting}
        />
      )}
    </div>
  );
}

function AutomationModal({ type, item, modules, onClose, onSubmit }: {
  type: 'workflow' | 'task' | 'setting';
  item: any;
  modules: ModuleConfig[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState(item || {});

  useEffect(() => {
    setFormData(item || {});
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (type === 'workflow') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Create Workflow</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Module</label>
              <select
                value={formData.module || ''}
                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                required
              >
                <option value="">Select module</option>
                {modules.map((m) => (
                  <option key={m.code} value={m.code}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trigger Type</label>
              <select
                value={formData.trigger_type || 'manual'}
                onChange={(e) => setFormData({ ...formData, trigger_type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              >
                <option value="manual">Manual</option>
                <option value="scheduled">Scheduled</option>
                <option value="event">Event Based</option>
                <option value="condition">Condition Based</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_automated"
                checked={formData.is_automated || false}
                onChange={(e) => setFormData({ ...formData, is_automated: e.target.checked })}
              />
              <label htmlFor="is_automated" className="text-sm text-gray-700">Automated</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (type === 'task') {
    const taskTypes = ['email', 'report', 'sync', 'backup', 'cleanup', 'notification', 'payroll', 'invoice', 'reminder', 'custom'];
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Create Scheduled Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Task Type</label>
              <select
                value={formData.task_type || ''}
                onChange={(e) => setFormData({ ...formData, task_type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                required
              >
                <option value="">Select type</option>
                {taskTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Module</label>
              <select
                value={formData.module || ''}
                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              >
                <option value="">Select module</option>
                {modules.map((m) => (
                  <option key={m.code} value={m.code}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Interval (minutes)</label>
              <input
                type="number"
                value={formData.interval_minutes || ''}
                onChange={(e) => setFormData({ ...formData, interval_minutes: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_automated"
                checked={formData.is_automated !== false}
                onChange={(e) => setFormData({ ...formData, is_automated: e.target.checked })}
              />
              <label htmlFor="is_automated" className="text-sm text-gray-700">Automated</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Configure Setting</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Setting</label>
            <input
              type="text"
              value={formData.setting_name || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-gray-50"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_automated"
              checked={formData.is_automated !== false}
              onChange={(e) => setFormData({ ...formData, is_automated: e.target.checked })}
            />
            <label htmlFor="is_automated" className="text-sm text-gray-700">Automated</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_enabled"
              checked={formData.is_enabled !== false}
              onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })}
            />
            <label htmlFor="is_enabled" className="text-sm text-gray-700">Enabled</label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
