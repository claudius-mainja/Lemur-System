'use client';

import { useState, useEffect, useCallback } from 'react';
import { crmApi } from '@/services/api';
import { 
  BarChart3, Users, UserPlus, Plus, Search, MoreHorizontal, Phone, Mail, MapPin,
  TrendingUp, DollarSign, Star, Edit, Trash2, CheckCircle, XCircle, Clock,
  FileSpreadsheet, Eye, X, Printer, Building2, RefreshCw, Target, Send
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'contacts' | 'deals' | 'social' | 'analytics';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  status: string;
  source?: string;
  assignedTo?: string;
  createdAt: string;
}

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  contactName: string;
  expectedCloseDate: string;
  probability: number;
  createdAt: string;
}

interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
  isConnected: boolean;
  followers: number;
}

interface ScheduledPost {
  id: string;
  content: string;
  scheduledDate: string;
  platform: string;
  status: string;
}

interface DashboardStats {
  totalContacts: number;
  totalDeals: number;
  totalPipeline: number;
  conversionRate: number;
}

export default function CRMDashboard() {
  const [activeView, setActiveView] = useState<ViewTab>('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalDeals: 0,
    totalPipeline: 0,
    conversionRate: 0,
  });
  
  // Data states
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  // Modal states
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [showViewContact, setShowViewContact] = useState<Contact | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const loadDashboardStats = useCallback(async () => {
    try {
      const response = await crmApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  const loadContacts = useCallback(async (page = 1, limit = 50) => {
    setIsLoading(true);
    try {
      const response = await crmApi.getContacts(page, limit);
      setContacts(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDeals = useCallback(async (page = 1, limit = 50) => {
    setIsLoading(true);
    try {
      const response = await crmApi.getDeals(page, limit);
      setDeals(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load deals:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSocialAccounts = useCallback(async () => {
    try {
      const response = await crmApi.getSocialAccounts();
      setSocialAccounts(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load social accounts:', error);
    }
  }, []);

  const loadScheduledPosts = useCallback(async () => {
    try {
      const response = await crmApi.getScheduledPosts();
      setScheduledPosts(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load scheduled posts:', error);
    }
  }, []);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  useEffect(() => {
    if (activeView === 'contacts') loadContacts();
    if (activeView === 'deals') loadDeals();
    if (activeView === 'social') {
      loadSocialAccounts();
      loadScheduledPosts();
    }
  }, [activeView, loadContacts, loadDeals, loadSocialAccounts, loadScheduledPosts]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      customer: 'bg-green-100 text-green-800',
      lead: 'bg-blue-100 text-blue-800',
      prospect: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      proposal: 'bg-orange-100 text-orange-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
      scheduled: 'bg-blue-100 text-blue-800',
      published: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
    return matchesSearch;
  });

  const filteredDeals = deals.filter(d => {
    const matchesSearch = 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Dashboard View
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalContacts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalDeals}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalPipeline)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => { setActiveView('contacts'); setShowAddContact(true); }}
          className="bg-primary text-white p-4 rounded-xl flex items-center gap-3 hover:bg-primary/90 transition"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Contact</span>
        </button>
        <button
          onClick={() => { setActiveView('deals'); setShowAddDeal(true); }}
          className="bg-white text-gray-700 p-4 rounded-xl flex items-center gap-3 border border-gray-200 hover:bg-gray-50 transition"
        >
          <Target className="w-5 h-5" />
          <span>New Deal</span>
        </button>
        <button
          onClick={() => setActiveView('social')}
          className="bg-white text-gray-700 p-4 rounded-xl flex items-center gap-3 border border-gray-200 hover:bg-gray-50 transition"
        >
          <Send className="w-5 h-5" />
          <span>Social Media</span>
        </button>
        <button
          onClick={() => setActiveView('analytics')}
          className="bg-white text-gray-700 p-4 rounded-xl flex items-center gap-3 border border-gray-200 hover:bg-gray-50 transition"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Analytics</span>
        </button>
      </div>

      {/* Recent Contacts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Recent Contacts</h3>
          <button onClick={() => setActiveView('contacts')} className="text-primary text-sm hover:underline">
            View All
          </button>
        </div>
        <div className="p-6">
          {contacts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No contacts yet. Add your first contact!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Company</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.slice(0, 5).map((contact) => (
                    <tr key={contact.id} className="border-b border-gray-50 hover:bg-gray50">
                      <td className="py-3 text-sm font-medium">{contact.firstName} {contact.lastName}</td>
                      <td className="py-3 text-sm text-gray-500">{contact.email}</td>
                      <td className="py-3 text-sm">{contact.company || '-'}</td>
                      <td className="py-3">{getStatusBadge(contact.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Contacts View
  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Contacts</h2>
        <button
          onClick={() => setShowAddContact(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100 bg-gray50">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Company</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : filteredContacts.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No contacts found</td></tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-gray-50 hover:bg-gray50">
                    <td className="p-4 text-sm font-medium">{contact.firstName} {contact.lastName}</td>
                    <td className="p-4 text-sm text-gray-500">{contact.email}</td>
                    <td className="p-4 text-sm text-gray-500">{contact.phone}</td>
                    <td className="p-4 text-sm">{contact.company || '-'}</td>
                    <td className="p-4">{getStatusBadge(contact.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => setShowViewContact(contact)} className="p-1 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Deals View
  const renderDeals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Deals Pipeline</h2>
        <button
          onClick={() => setShowAddDeal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> New Deal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].map((stage) => {
          const stageDeals = deals.filter(d => d.stage === stage);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);
          return (
            <div key={stage} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900 capitalize">{stage}</h3>
                <span className="text-xs text-gray-500">{stageDeals.length} deals</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stageTotal)}</p>
              <div className="mt-3 space-y-2">
                {stageDeals.slice(0, 3).map((deal) => (
                  <div key={deal.id} className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium truncate">{deal.title}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(deal.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Social View
  const renderSocial = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Social Media Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialAccounts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No social accounts connected
          </div>
        ) : (
          socialAccounts.map((account) => (
            <div key={account.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    account.platform === 'facebook' ? 'bg-blue-100' :
                    account.platform === 'twitter' ? 'bg-sky-100' :
                    account.platform === 'instagram' ? 'bg-pink-100' :
                    account.platform === 'linkedin' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <span className="text-lg">{account.platform[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.platform}</h3>
                    <p className="text-sm text-gray-500">{account.accountName}</p>
                  </div>
                </div>
                {getStatusBadge(account.isConnected ? 'active' : 'inactive')}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">{account.followers.toLocaleString()} followers</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Scheduled Posts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Scheduled Posts</h3>
          <button className="text-primary text-sm hover:underline">
            Schedule New
          </button>
        </div>
        <div className="p-6">
          {scheduledPosts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No scheduled posts</p>
          ) : (
            <div className="space-y-3">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-900">{post.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {post.platform} • {formatDate(post.scheduledDate)}
                      </p>
                    </div>
                    {getStatusBadge(post.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const navItems = [
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'deals', label: 'Deals', icon: Target },
    { id: 'social', label: 'Social Media', icon: Send },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CRM</h1>
              <p className="text-sm text-gray-500">Manage contacts, deals & social media</p>
            </div>
          </div>
          <button onClick={() => loadDashboardStats()} className="p-2 hover:bg-gray-100 rounded-lg">
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ViewTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    activeView === item.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderDashboard()}
          {activeView === 'contacts' && renderContacts()}
          {activeView === 'deals' && renderDeals()}
          {activeView === 'social' && renderSocial()}
          {activeView === 'analytics' && (
            <div className="text-center py-12 text-gray-500">
              Analytics coming soon
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
