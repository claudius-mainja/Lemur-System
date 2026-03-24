'use client';

import { useState, useEffect, useCallback } from 'react';
import { marketingApi } from '@/services/api';
import {
  Mail, Users, Target, Zap, BarChart3, Plus, Search, MoreHorizontal,
  Eye, Edit, Trash2, Send, Clock, CheckCircle, XCircle, Play,
  Pause, RefreshCw, Megaphone, FileText, Globe, Link, Image,
  MousePointer, TrendingUp, PieChart, Activity, Calendar, Filter,
  EyeOff, X, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'campaigns' | 'templates' | 'audiences' | 'automation' | 'analytics';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content?: string;
  html_content?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

interface AudienceSegment {
  id: string;
  name: string;
  description?: string;
  criteria?: any;
  contact_count: number;
  created_at: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject?: string;
  template_id?: string;
  audience_id?: string;
  status: string;
  sent_count: number;
  open_rate: number;
  click_rate: number;
  scheduled_at?: string;
  created_at: string;
}

interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  is_active: boolean;
  step_count: number;
  created_at: string;
}

interface LandingPage {
  id: string;
  name: string;
  url: string;
  views: number;
  submissions: number;
  conversion_rate: number;
  is_published: boolean;
  created_at: string;
}

interface DashboardStats {
  total_campaigns: number;
  active_campaigns: number;
  total_sent: number;
  avg_open_rate: number;
  avg_click_rate: number;
  total_subscribers: number;
}

export default function MarketingDashboard() {
  const [activeView, setActiveView] = useState<ViewTab>('campaigns');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    total_campaigns: 0,
    active_campaigns: 0,
    total_sent: 0,
    avg_open_rate: 0,
    avg_click_rate: 0,
    total_subscribers: 0,
  });

  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [audiences, setAudiences] = useState<AudienceSegment[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);

  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [showAddAudience, setShowAddAudience] = useState(false);
  const [showAddWorkflow, setShowAddWorkflow] = useState(false);
  const [showAddLandingPage, setShowAddLandingPage] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    template_id: '',
    audience_id: '',
    scheduled_at: '',
  });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    category: 'general',
  });

  const [newAudience, setNewAudience] = useState({
    name: '',
    description: '',
    criteria: {},
  });

  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger_type: 'email_opened',
    is_active: false,
  });

  const [newLandingPage, setNewLandingPage] = useState({
    name: '',
    url: '',
    content: '',
    is_published: false,
  });

  const loadStats = useCallback(async () => {
    try {
      const statsData: DashboardStats = {
        total_campaigns: campaigns.length,
        active_campaigns: campaigns.filter(c => c.status === 'active').length,
        total_sent: campaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0),
        avg_open_rate: campaigns.length > 0 
          ? campaigns.reduce((sum, c) => sum + (c.open_rate || 0), 0) / campaigns.length 
          : 0,
        avg_click_rate: campaigns.length > 0 
          ? campaigns.reduce((sum, c) => sum + (c.click_rate || 0), 0) / campaigns.length 
          : 0,
        total_subscribers: audiences.reduce((sum, a) => sum + (a.contact_count || 0), 0),
      };
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, [campaigns, audiences]);

  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await marketingApi.getCampaigns();
      setCampaigns(response.data?.results || response.data || []);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await marketingApi.getEmailTemplates();
      setTemplates(response.data?.results || response.data || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAudiences = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await marketingApi.getAudiences();
      setAudiences(response.data?.results || response.data || []);
    } catch (error) {
      console.error('Failed to load audiences:', error);
      setAudiences([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadWorkflows = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await marketingApi.getWorkflows();
      setWorkflows(response.data?.results || response.data || []);
    } catch (error) {
      console.error('Failed to load workflows:', error);
      setWorkflows([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (activeView === 'campaigns') loadCampaigns();
    else if (activeView === 'templates') loadTemplates();
    else if (activeView === 'audiences') loadAudiences();
    else if (activeView === 'automation') loadWorkflows();
  }, [activeView, loadCampaigns, loadTemplates, loadAudiences, loadWorkflows]);

  const handleCreateCampaign = async () => {
    if (!newCampaign.name) {
      toast.error('Campaign name is required');
      return;
    }
    try {
      const response = await marketingApi.createCampaign(newCampaign);
      if (response.data) {
        setCampaigns([response.data, ...campaigns]);
        toast.success('Campaign created successfully!');
      }
      setShowAddCampaign(false);
      setNewCampaign({ name: '', subject: '', template_id: '', audience_id: '', scheduled_at: '' });
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.subject) {
      toast.error('Template name and subject are required');
      return;
    }
    try {
      const response = await marketingApi.createEmailTemplate(newTemplate);
      if (response.data) {
        setTemplates([response.data, ...templates]);
        toast.success('Template created successfully!');
      }
      setShowAddTemplate(false);
      setNewTemplate({ name: '', subject: '', content: '', category: 'general' });
    } catch (error) {
      toast.error('Failed to create template');
    }
  };

  const handleCreateAudience = async () => {
    if (!newAudience.name) {
      toast.error('Audience name is required');
      return;
    }
    try {
      const response = await marketingApi.createAudience(newAudience);
      if (response.data) {
        setAudiences([response.data, ...audiences]);
        toast.success('Audience created successfully!');
      }
      setShowAddAudience(false);
      setNewAudience({ name: '', description: '', criteria: {} });
    } catch (error) {
      toast.error('Failed to create audience');
    }
  };

  const handleCreateWorkflow = async () => {
    if (!newWorkflow.name) {
      toast.error('Workflow name is required');
      return;
    }
    try {
      const response = await marketingApi.createWorkflow(newWorkflow);
      if (response.data) {
        setWorkflows([response.data, ...workflows]);
        toast.success('Workflow created successfully!');
      }
      setShowAddWorkflow(false);
      setNewWorkflow({ name: '', description: '', trigger_type: 'email_opened', is_active: false });
    } catch (error) {
      toast.error('Failed to create workflow');
    }
  };

  const handleSendCampaign = async (id: string) => {
    try {
      await marketingApi.sendCampaign(id);
      toast.success('Campaign sent successfully!');
      loadCampaigns();
    } catch (error) {
      toast.error('Failed to send campaign');
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await marketingApi.deleteCampaign(id);
      setCampaigns(campaigns.filter(c => c.id !== id));
      toast.success('Campaign deleted');
    } catch (error) {
      toast.error('Failed to delete campaign');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await marketingApi.deleteEmailTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
      toast.success('Template deleted');
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const handleDeleteAudience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this audience?')) return;
    try {
      await marketingApi.deleteAudience(id);
      setAudiences(audiences.filter(a => a.id !== id));
      toast.success('Audience deleted');
    } catch (error) {
      toast.error('Failed to delete audience');
    }
  };

  const handleDeleteWorkflow = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    try {
      await marketingApi.deleteWorkflow(id);
      setWorkflows(workflows.filter(w => w.id !== id));
      toast.success('Workflow deleted');
    } catch (error) {
      toast.error('Failed to delete workflow');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'sent': case 'published': return 'text-green-600 bg-green-100';
      case 'scheduled': case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'paused': case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'failed': case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAudiences = audiences.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWorkflows = workflows.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6" suppressHydrationWarning>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>
        <p className="text-gray-500 text-sm mt-1">Email campaigns, automation, and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_campaigns}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Emails Sent</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_sent.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Open Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avg_open_rate.toFixed(1)}%</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Click Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avg_click_rate.toFixed(1)}%</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
          {(['campaigns', 'templates', 'audiences', 'automation', 'analytics'] as ViewTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => {
              if (activeView === 'campaigns') setShowAddCampaign(true);
              else if (activeView === 'templates') setShowAddTemplate(true);
              else if (activeView === 'audiences') setShowAddAudience(true);
              else if (activeView === 'automation') setShowAddWorkflow(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add {activeView === 'campaigns' ? 'Campaign' : activeView === 'templates' ? 'Template' : activeView === 'audiences' ? 'Audience' : 'Workflow'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          {activeView === 'campaigns' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Open Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Click Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No campaigns found. Create your first campaign to get started.
                      </td>
                    </tr>
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{campaign.name}</p>
                            <p className="text-sm text-gray-500">{campaign.subject}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{campaign.sent_count?.toLocaleString() || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{campaign.open_rate?.toFixed(1) || 0}%</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{campaign.click_rate?.toFixed(1) || 0}%</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {campaign.status === 'draft' && (
                              <button
                                onClick={() => handleSendCampaign(campaign.id)}
                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                title="Send"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteCampaign(campaign.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeView === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500">
                  No templates found. Create your first template to get started.
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{template.name}</p>
                          <p className="text-sm text-gray-500">{template.category}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
                    <p className="text-xs text-gray-400">
                      Updated {new Date(template.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeView === 'audiences' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAudiences.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500">
                  No audiences found. Create your first audience segment to get started.
                </div>
              ) : (
                filteredAudiences.map((audience) => (
                  <div key={audience.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{audience.name}</p>
                          <p className="text-sm text-gray-500">{audience.contact_count || 0} contacts</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAudience(audience.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {audience.description && (
                      <p className="text-sm text-gray-600 mb-3">{audience.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeView === 'automation' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workflow</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trigger</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Steps</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredWorkflows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No workflows found. Create your first automation workflow to get started.
                      </td>
                    </tr>
                  ) : (
                    filteredWorkflows.map((workflow) => (
                      <tr key={workflow.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Zap className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{workflow.name}</p>
                              {workflow.description && (
                                <p className="text-sm text-gray-500">{workflow.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{workflow.trigger_type}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${workflow.is_active ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'}`}>
                            {workflow.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{workflow.step_count || 0}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteWorkflow(workflow.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeView === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <BarChart3 className="w-8 h-8 mr-2" />
                  <span>Performance chart visualization</span>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Growth</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <TrendingUp className="w-8 h-8 mr-2" />
                  <span>Audience growth chart visualization</span>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Open Rate</span>
                    <span className="font-semibold text-gray-900">{stats.avg_open_rate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Click Rate</span>
                    <span className="font-semibold text-gray-900">{stats.avg_click_rate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Emails Sent</span>
                    <span className="font-semibold text-gray-900">{stats.total_sent.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Subscribers</span>
                    <span className="font-semibold text-gray-900">{stats.total_subscribers}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Campaigns</h3>
                <div className="space-y-3">
                  {campaigns.slice(0, 5).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <span className="text-gray-600 truncate">{campaign.name}</span>
                      <span className="font-medium text-gray-900">{campaign.sent_count || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Campaign Modal */}
      {showAddCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Campaign</h2>
              <button onClick={() => setShowAddCampaign(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Summer Sale Newsletter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line *</label>
                <input
                  type="text"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Don't miss our summer deals!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                <select
                  value={newCampaign.template_id}
                  onChange={(e) => setNewCampaign({ ...newCampaign, template_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a template</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                <select
                  value={newCampaign.audience_id}
                  onChange={(e) => setNewCampaign({ ...newCampaign, audience_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an audience</option>
                  {audiences.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <input
                  type="datetime-local"
                  value={newCampaign.scheduled_at}
                  onChange={(e) => setNewCampaign({ ...newCampaign, scheduled_at: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddCampaign(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Template Modal */}
      {showAddTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Template</h2>
              <button onClick={() => setShowAddTemplate(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Welcome Email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line *</label>
                <input
                  type="text"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Welcome to our newsletter!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="promotional">Promotional</option>
                  <option value="transactional">Transactional</option>
                  <option value="newsletter">Newsletter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email content..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddTemplate(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Audience Modal */}
      {showAddAudience && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Audience</h2>
              <button onClick={() => setShowAddAudience(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audience Name *</label>
                <input
                  type="text"
                  value={newAudience.name}
                  onChange={(e) => setNewAudience({ ...newAudience, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Active Customers"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newAudience.description}
                  onChange={(e) => setNewAudience({ ...newAudience, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe this audience segment..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddAudience(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAudience}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Audience
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Workflow Modal */}
      {showAddWorkflow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Workflow</h2>
              <button onClick={() => setShowAddWorkflow(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Workflow Name *</label>
                <input
                  type="text"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Welcome Series"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what this workflow does..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Type</label>
                <select
                  value={newWorkflow.trigger_type}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, trigger_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email_opened">Email Opened</option>
                  <option value="email_clicked">Email Clicked</option>
                  <option value="form_submitted">Form Submitted</option>
                  <option value="page_visited">Page Visited</option>
                  <option value="date_based">Date Based</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddWorkflow(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWorkflow}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Workflow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
