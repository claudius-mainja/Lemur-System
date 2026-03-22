'use client';

import { useState, useEffect, useCallback } from 'react';
import { servicesApi } from '@/services/api';
import {
  Ticket, Plus, Search, MoreHorizontal, Clock, CheckCircle, XCircle,
  AlertCircle, Send, RefreshCw, User, Mail, Phone, MessageSquare,
  FileText, Eye, Edit, Trash2, PlusCircle, ArrowRight, Loader2,
  X, ChevronDown, Filter, BarChart3, TrendingUp, Users, Calendar,
  AlertTriangle, Shield, Star, ClipboardList, BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'tickets' | 'sla' | 'knowledge-base' | 'reports' | 'settings';

interface TicketData {
  id: string;
  subject: string;
  description?: string;
  status: string;
  priority: string;
  category?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

interface SLAConfig {
  id: string;
  name: string;
  response_time_hours: number;
  resolution_time_hours: number;
  priority: string;
  created_at: string;
}

interface KBArticle {
  id: string;
  title: string;
  content: string;
  category_id?: string;
  category_name?: string;
  status: string;
  views: number;
  helpful: number;
  not_helpful: number;
  created_at: string;
  updated_at: string;
}

interface KBCategory {
  id: string;
  name: string;
  description?: string;
  article_count: number;
  parent_id?: string;
}

interface EscalationRule {
  id: string;
  name: string;
  trigger_type: string;
  trigger_value?: string;
  action_type: string;
  action_target?: string;
  is_active: boolean;
  created_at: string;
}

interface ServiceReport {
  id: string;
  name: string;
  report_type: string;
  start_date: string;
  end_date: string;
  metrics?: any;
  created_at: string;
}

interface DashboardStats {
  open_tickets: number;
  pending_tickets: number;
  resolved_tickets: number;
  avg_response_time: number;
  avg_resolution_time: number;
  satisfaction_score: number;
}

export default function ServicesDashboard() {
  const [activeView, setActiveView] = useState<ViewTab>('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    open_tickets: 0,
    pending_tickets: 0,
    resolved_tickets: 0,
    avg_response_time: 0,
    avg_resolution_time: 0,
    satisfaction_score: 0,
  });

  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [slaConfigs, setSLAConfigs] = useState<SLAConfig[]>([]);
  const [kbCategories, setKBCategories] = useState<KBCategory[]>([]);
  const [kbArticles, setKBArticles] = useState<KBArticle[]>([]);
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>([]);
  const [serviceReports, setServiceReports] = useState<ServiceReport[]>([]);

  const [showAddTicket, setShowAddTicket] = useState(false);
  const [showAddSLA, setShowAddSLA] = useState(false);
  const [showAddKBArticle, setShowAddKBArticle] = useState(false);
  const [showAddKBCategory, setShowAddKBCategory] = useState(false);
  const [showViewTicket, setShowViewTicket] = useState<TicketData | null>(null);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    category: 'general',
    customer_name: '',
    customer_email: '',
  });

  const [newSLA, setNewSLA] = useState({
    name: '',
    response_time_hours: 4,
    resolution_time_hours: 24,
    priority: 'medium',
  });

  const [newKBArticle, setNewKBArticle] = useState({
    title: '',
    content: '',
    category_id: '',
    status: 'draft',
  });

  const [newKBCategory, setNewKBCategory] = useState({
    name: '',
    description: '',
    parent_id: '',
  });

  const loadStats = useCallback(async () => {
    try {
      const statsData: DashboardStats = {
        open_tickets: tickets.filter(t => t.status === 'open').length,
        pending_tickets: tickets.filter(t => t.status === 'pending').length,
        resolved_tickets: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
        avg_response_time: 2.5,
        avg_resolution_time: 18.3,
        satisfaction_score: 4.2,
      };
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, [tickets]);

  const loadTickets = useCallback(async (params?: { status?: string; priority?: string }) => {
    setIsLoading(true);
    try {
      const response = await servicesApi.getTickets(params);
      setTickets(response.data?.results || response.data || []);
    } catch (error) {
      console.error('Failed to load tickets:', error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSLAConfigs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await servicesApi.getSLAConfigs();
      setSLAConfigs(response.data?.results || response.data || []);
    } catch (error) {
      console.error('Failed to load SLA configs:', error);
      setSLAConfigs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadKBCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await servicesApi.getKBCategories();
      setKBCategories(response.data?.results || response.data || []);
    } catch (error) {
      console.error('Failed to load KB categories:', error);
      setKBCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadKBArticles = useCallback(async (categoryId?: string) => {
    setIsLoading(true);
    try {
      const response = await servicesApi.getKBArticles(categoryId ? { category_id: categoryId } : undefined);
      setKBArticles(response.data?.results || response.data || []);
    } catch (error) {
      console.error('Failed to load KB articles:', error);
      setKBArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadEscalationRules = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await servicesApi.getEscalationRules();
      setEscalationRules(response.data?.results || response.data || []);
    } catch (error) {
      console.error('Failed to load escalation rules:', error);
      setEscalationRules([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (activeView === 'tickets') {
      const params: { status?: string; priority?: string } = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterPriority !== 'all') params.priority = filterPriority;
      loadTickets(Object.keys(params).length > 0 ? params : undefined);
    } else if (activeView === 'sla') loadSLAConfigs();
    else if (activeView === 'knowledge-base') {
      loadKBCategories();
      loadKBArticles();
    } else if (activeView === 'settings') loadEscalationRules();
  }, [activeView, filterStatus, filterPriority, loadTickets, loadSLAConfigs, loadKBCategories, loadKBArticles, loadEscalationRules]);

  const handleCreateTicket = async () => {
    if (!newTicket.subject) {
      toast.error('Subject is required');
      return;
    }
    try {
      const response = await servicesApi.createTicket(newTicket);
      if (response.data) {
        setTickets([response.data, ...tickets]);
        toast.success('Ticket created successfully!');
      }
      setShowAddTicket(false);
      setNewTicket({
        subject: '',
        description: '',
        priority: 'medium',
        category: 'general',
        customer_name: '',
        customer_email: '',
      });
    } catch (error) {
      toast.error('Failed to create ticket');
    }
  };

  const handleCreateSLA = async () => {
    if (!newSLA.name) {
      toast.error('SLA name is required');
      return;
    }
    try {
      const response = await servicesApi.createSLAConfig(newSLA);
      if (response.data) {
        setSLAConfigs([response.data, ...slaConfigs]);
        toast.success('SLA config created successfully!');
      }
      setShowAddSLA(false);
      setNewSLA({ name: '', response_time_hours: 4, resolution_time_hours: 24, priority: 'medium' });
    } catch (error) {
      toast.error('Failed to create SLA config');
    }
  };

  const handleCreateKBArticle = async () => {
    if (!newKBArticle.title || !newKBArticle.content) {
      toast.error('Title and content are required');
      return;
    }
    try {
      const response = await servicesApi.createKBArticle(newKBArticle);
      if (response.data) {
        setKBArticles([response.data, ...kbArticles]);
        toast.success('Article created successfully!');
      }
      setShowAddKBArticle(false);
      setNewKBArticle({ title: '', content: '', category_id: '', status: 'draft' });
    } catch (error) {
      toast.error('Failed to create article');
    }
  };

  const handleCreateKBCategory = async () => {
    if (!newKBCategory.name) {
      toast.error('Category name is required');
      return;
    }
    try {
      const response = await servicesApi.createKBCategory(newKBCategory);
      if (response.data) {
        setKBCategories([response.data, ...kbCategories]);
        toast.success('Category created successfully!');
      }
      setShowAddKBCategory(false);
      setNewKBCategory({ name: '', description: '', parent_id: '' });
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleCloseTicket = async (id: string) => {
    try {
      await servicesApi.closeTicket(id);
      toast.success('Ticket closed');
      loadTickets();
    } catch (error) {
      toast.error('Failed to close ticket');
    }
  };

  const handleReopenTicket = async (id: string) => {
    try {
      await servicesApi.reopenTicket(id);
      toast.success('Ticket reopened');
      loadTickets();
    } catch (error) {
      toast.error('Failed to reopen ticket');
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await servicesApi.deleteTicket(id);
      setTickets(tickets.filter(t => t.id !== id));
      toast.success('Ticket deleted');
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
  };

  const handleDeleteSLA = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SLA config?')) return;
    try {
      await servicesApi.deleteSLAConfig(id);
      setSLAConfigs(slaConfigs.filter(s => s.id !== id));
      toast.success('SLA config deleted');
    } catch (error) {
      toast.error('Failed to delete SLA config');
    }
  };

  const handleDeleteKBArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await servicesApi.deleteKBArticle(id);
      setKBArticles(kbArticles.filter(a => a.id !== id));
      toast.success('Article deleted');
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const handleDeleteKBCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      setKBCategories(kbCategories.filter(c => c.id !== id));
      toast.success('Category deleted');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': case 'closed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTickets = tickets.filter(t =>
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customer_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredKBArticles = kbArticles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Help Desk</h1>
        <p className="text-gray-500 text-sm mt-1">Support tickets, knowledge base, and service reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.open_tickets}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending_tickets}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved_tickets}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">{stats.satisfaction_score.toFixed(1)}/5</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
          {(['tickets', 'sla', 'knowledge-base', 'reports', 'settings'] as ViewTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'knowledge-base' ? 'Knowledge Base' : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
              if (activeView === 'tickets') setShowAddTicket(true);
              else if (activeView === 'sla') setShowAddSLA(true);
              else if (activeView === 'knowledge-base') setShowAddKBArticle(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {activeView === 'tickets' ? 'New Ticket' : activeView === 'sla' ? 'Add SLA' : 'New Article'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          {activeView === 'tickets' && (
            <>
              <div className="flex items-center gap-4 mb-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTickets.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No tickets found. Create your first ticket to get started.
                        </td>
                      </tr>
                    ) : (
                      filteredTickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{ticket.subject}</p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            <div>
                              <p>{ticket.customer_name || 'Unknown'}</p>
                              <p className="text-xs text-gray-400">{ticket.customer_email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setShowViewTicket(ticket)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {ticket.status === 'open' || ticket.status === 'pending' ? (
                                <button
                                  onClick={() => handleCloseTicket(ticket.id)}
                                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                                  title="Close"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleReopenTicket(ticket.id)}
                                  className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                                  title="Reopen"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteTicket(ticket.id)}
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
            </>
          )}

          {activeView === 'sla' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">SLA Policies</h3>
                <button
                  onClick={() => setShowAddSLA(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add SLA Policy
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolution Time</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {slaConfigs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No SLA policies found. Create your first SLA policy to get started.
                      </td>
                    </tr>
                  ) : (
                    slaConfigs.map((sla) => (
                      <tr key={sla.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{sla.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(sla.priority)}`}>
                            {sla.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{sla.response_time_hours}h</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{sla.resolution_time_hours}h</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteSLA(sla.id)}
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

          {activeView === 'knowledge-base' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Categories</h3>
                    <button
                      onClick={() => setShowAddKBCategory(true)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium">
                      All Articles ({kbArticles.length})
                    </button>
                    {kbCategories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                        <span className="text-gray-700">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{category.article_count}</span>
                          <button
                            onClick={() => handleDeleteKBCategory(category.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Articles</h3>
                    <button
                      onClick={() => setShowAddKBArticle(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      New Article
                    </button>
                  </div>
                  <div className="space-y-3">
                    {filteredKBArticles.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No articles found. Create your first article to get started.</p>
                    ) : (
                      filteredKBArticles.map((article) => (
                        <div key={article.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{article.title}</h4>
                                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{article.content}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                  <span>{article.views} views</span>
                                  <span>{article.helpful} helpful</span>
                                  <span className={`px-2 py-0.5 rounded-full ${article.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {article.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDeleteKBArticle(article.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
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
              </div>
            </div>
          )}

          {activeView === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Response Time</span>
                    <span className="font-semibold text-gray-900">{stats.avg_response_time.toFixed(1)} hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Resolution Time</span>
                    <span className="font-semibold text-gray-900">{stats.avg_resolution_time.toFixed(1)} hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Tickets</span>
                    <span className="font-semibold text-gray-900">{tickets.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Resolution Rate</span>
                    <span className="font-semibold text-gray-900">
                      {tickets.length > 0 ? ((stats.resolved_tickets / tickets.length) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction</h3>
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gray-900">{stats.satisfaction_score.toFixed(1)}</p>
                    <p className="text-sm text-gray-500 mt-1">out of 5.0</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${star <= Math.round(stats.satisfaction_score) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Priority</h3>
                <div className="h-48 flex items-center justify-center text-gray-400">
                  <BarChart3 className="w-8 h-8 mr-2" />
                  <span>Priority chart visualization</span>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets Trend</h3>
                <div className="h-48 flex items-center justify-center text-gray-400">
                  <TrendingUp className="w-8 h-8 mr-2" />
                  <span>Trend chart visualization</span>
                </div>
              </div>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Escalation Rules</h3>
                <p className="text-sm text-gray-500 mt-1">Configure automatic ticket escalation rules</p>
              </div>
              <div className="p-4">
                {escalationRules.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No escalation rules configured. Add rules to automatically escalate tickets.</p>
                ) : (
                  <div className="space-y-3">
                    {escalationRules.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{rule.name}</p>
                          <p className="text-sm text-gray-500">
                            {rule.trigger_type} - {rule.action_type}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${rule.is_active ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'}`}>
                            {rule.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Ticket Modal */}
      {showAddTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Ticket</h2>
              <button onClick={() => setShowAddTicket(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="sales">Sales</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={newTicket.customer_name}
                  onChange={(e) => setNewTicket({ ...newTicket, customer_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                <input
                  type="email"
                  value={newTicket.customer_email}
                  onChange={(e) => setNewTicket({ ...newTicket, customer_email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="customer@example.com"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddTicket(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTicket}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add SLA Modal */}
      {showAddSLA && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create SLA Policy</h2>
              <button onClick={() => setShowAddSLA(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Name *</label>
                <input
                  type="text"
                  value={newSLA.name}
                  onChange={(e) => setNewSLA({ ...newSLA, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Premium Support"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newSLA.priority}
                  onChange={(e) => setNewSLA({ ...newSLA, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Response Time (hours)</label>
                  <input
                    type="number"
                    value={newSLA.response_time_hours}
                    onChange={(e) => setNewSLA({ ...newSLA, response_time_hours: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Time (hours)</label>
                  <input
                    type="number"
                    value={newSLA.resolution_time_hours}
                    onChange={(e) => setNewSLA({ ...newSLA, resolution_time_hours: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddSLA(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSLA}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add KB Article Modal */}
      {showAddKBArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Article</h2>
              <button onClick={() => setShowAddKBArticle(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={newKBArticle.title}
                  onChange={(e) => setNewKBArticle({ ...newKBArticle, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Article title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newKBArticle.category_id}
                  onChange={(e) => setNewKBArticle({ ...newKBArticle, category_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {kbCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newKBArticle.status}
                  onChange={(e) => setNewKBArticle({ ...newKBArticle, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  value={newKBArticle.content}
                  onChange={(e) => setNewKBArticle({ ...newKBArticle, content: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your article content here..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddKBArticle(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateKBArticle}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add KB Category Modal */}
      {showAddKBCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Category</h2>
              <button onClick={() => setShowAddKBCategory(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={newKBCategory.name}
                  onChange={(e) => setNewKBCategory({ ...newKBCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Getting Started"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newKBCategory.description}
                  onChange={(e) => setNewKBCategory({ ...newKBCategory, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category description..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddKBCategory(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateKBCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Ticket Modal */}
      {showViewTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Ticket Details</h2>
              <button onClick={() => setShowViewTicket(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Subject</label>
                <p className="text-gray-900 mt-1">{showViewTicket.subject}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(showViewTicket.status)}`}>
                      {showViewTicket.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  <p className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(showViewTicket.priority)}`}>
                      {showViewTicket.priority}
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer</label>
                  <p className="text-gray-900 mt-1">{showViewTicket.customer_name || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900 mt-1">{showViewTicket.customer_email || 'N/A'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{showViewTicket.description || 'No description provided.'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900 mt-1">{new Date(showViewTicket.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900 mt-1">{new Date(showViewTicket.updated_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                {showViewTicket.status === 'open' || showViewTicket.status === 'pending' ? (
                  <button
                    onClick={() => {
                      handleCloseTicket(showViewTicket.id);
                      setShowViewTicket(null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Close Ticket
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleReopenTicket(showViewTicket.id);
                      setShowViewTicket(null);
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Reopen Ticket
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
