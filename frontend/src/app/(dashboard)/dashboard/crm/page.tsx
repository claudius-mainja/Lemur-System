'use client';

import { useState, useEffect, useCallback } from 'react';
import { crmApi } from '@/services/api';
import { useDataStore } from '@/stores/data.store';
import { 
  BarChart3, Users, UserPlus, Plus, Search, MoreHorizontal, Phone, Mail, MapPin,
  TrendingUp, DollarSign, Star, Edit, Trash2, CheckCircle, XCircle, Clock,
  FileSpreadsheet, Eye, X, Printer, Building2, RefreshCw, Target, Send,
  Facebook, Twitter, Instagram, Linkedin, Link, Unlink, Sparkles, Wand2,
  Calendar, Clock3, Upload, FileText, MessageSquare, Loader2
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
  const { customers, leads, addCustomer, updateLead, addLead, socialAccounts, socialPosts, addSocialAccount, deleteSocialAccount, addSocialPost, deleteSocialPost } = useDataStore();
  const [activeView, setActiveView] = useState<ViewTab>('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalDeals: 0,
    totalPipeline: 0,
    conversionRate: 0,
  });
  
  // Data states
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  // Modal states
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [showViewContact, setShowViewContact] = useState<Contact | null>(null);
  const [showConnectAccount, setShowConnectAccount] = useState(false);
  const [showSchedulePost, setShowSchedulePost] = useState(false);
  const [showAIGenerate, setShowAIGenerate] = useState(false);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    content: '',
    platform: 'facebook' as 'facebook' | 'twitter' | 'instagram' | 'linkedin',
    scheduledDate: '',
    scheduledTime: '',
    mediaFiles: [] as File[],
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSource, setAiSource] = useState<'chatgpt' | 'perplexity' | 'gemini'>('chatgpt');
  const [generatedContent, setGeneratedContent] = useState('');

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
    // Load from data store - accounts are synced via useEffect
  }, []);

  const loadScheduledPosts = useCallback(async () => {
    // Load from data store - posts are synced via useEffect
  }, []);

  const handleConnectAccount = async (platform: string, accountName: string, accountId: string) => {
    setConnectingPlatform(platform);
    try {
      // Simulate OAuth connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      addSocialAccount({
        platform: platform as 'facebook' | 'twitter' | 'instagram' | 'linkedin',
        accountName,
        accountId,
        isConnected: true,
        connectedAt: new Date().toISOString(),
      });
      toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} account connected successfully!`);
    } catch (error) {
      toast.error('Failed to connect account');
    } finally {
      setConnectingPlatform(null);
      setShowConnectAccount(false);
    }
  };

  const handleDisconnectAccount = (accountId: string) => {
    deleteSocialAccount(accountId);
    toast.success('Account disconnected');
  };

  const handleSchedulePost = async () => {
    if (!newPost.content.trim()) {
      toast.error('Please enter post content');
      return;
    }
    if (!newPost.scheduledDate || !newPost.scheduledTime) {
      toast.error('Please select date and time');
      return;
    }
    
    const scheduledDateTime = new Date(`${newPost.scheduledDate}T${newPost.scheduledTime}`).toISOString();
    addSocialPost({
      platform: newPost.platform,
      content: newPost.content,
      mediaUrls: [],
      scheduledFor: scheduledDateTime,
      status: 'scheduled',
      aiGenerated: false,
    });
    toast.success('Post scheduled successfully!');
    setShowSchedulePost(false);
    setNewPost({
      content: '',
      platform: 'facebook',
      scheduledDate: '',
      scheduledTime: '',
      mediaFiles: [],
    });
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for content generation');
      return;
    }
    setIsGenerating(true);
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      const templates = {
        chatgpt: `📱 Exciting news! ${aiPrompt}\n\nWe're thrilled to share this update with our amazing community. Stay tuned for more updates!\n\n#Update #Innovation`,
        perplexity: `🔍 ${aiPrompt}\n\nDiscover how we're making a difference. Our latest insights are here!\n\nLearn more →\n\n#Insights #Innovation`,
        gemini: `✨ ${aiPrompt}\n\nWe're committed to delivering excellence. Join us on this journey!\n\n#Excellence #Growth #Innovation`,
      };
      setGeneratedContent(templates[aiSource]);
      setNewPost({ ...newPost, content: templates[aiSource] });
      toast.success(`Content generated using ${aiSource.charAt(0).toUpperCase() + aiSource.slice(1)}!`);
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    loadDashboardStats().catch(() => {});
  }, [loadDashboardStats]);

  useEffect(() => {
    if (activeView === 'contacts') {
      setContacts(customers.map(c => ({
        id: c.id,
        firstName: c.name.split(' ')[0],
        lastName: c.name.split(' ').slice(1).join(' '),
        email: c.email,
        phone: c.phone,
        company: c.company,
        status: c.status,
        source: c.source,
        createdAt: c.lastContact,
      })));
      loadContacts().catch(() => {});
    }
    if (activeView === 'deals') {
      setDeals(leads.filter(l => l.status !== 'new').map(l => ({
        id: l.id,
        title: l.company,
        value: l.value,
        stage: l.status,
        contactName: l.name,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        probability: 50,
        createdAt: l.createdAt,
      })));
      loadDeals().catch(() => {});
    }
    if (activeView === 'social') {
      setScheduledPosts(socialPosts.map(p => ({
        id: p.id,
        content: p.content,
        scheduledDate: p.scheduledFor || '',
        platform: p.platform,
        status: p.status,
      })));
      loadSocialAccounts().catch(() => {});
      loadScheduledPosts().catch(() => {});
    }
  }, [activeView, customers, leads, socialPosts]);

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

  // Contacts View
  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white uppercase tracking-wider">Contacts</h2>
        <button
          onClick={() => setShowAddContact(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl">
        <div className="p-4 border-b border-white/10 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm bg-white/5 text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/50 border-b border-white/10 bg-white/5">
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
                <tr><td colSpan={6} className="p-8 text-center text-white/50">Loading...</td></tr>
              ) : filteredContacts.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-white/50">No contacts found</td></tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-medium text-white">{contact.firstName} {contact.lastName}</td>
                    <td className="p-4 text-sm text-white/50">{contact.email}</td>
                    <td className="p-4 text-sm text-white/50">{contact.phone}</td>
                    <td className="p-4 text-sm text-white">{contact.company || '-'}</td>
                    <td className="p-4">{getStatusBadge(contact.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => setShowViewContact(contact)} className="p-1 hover:bg-white/10 rounded">
                          <Eye className="w-4 h-4 text-white/50" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Edit className="w-4 h-4 text-white/50" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
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
        <h2 className="text-xl font-semibold text-white uppercase tracking-wider">Deals Pipeline</h2>
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
            <div key={stage} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white capitalize">{stage}</h3>
                <span className="text-xs text-white/50">{stageDeals.length} deals</span>
              </div>
              <p className="text-lg font-bold text-white">{formatCurrency(stageTotal)}</p>
              <div className="mt-3 space-y-2">
                {stageDeals.slice(0, 3).map((deal) => (
                  <div key={deal.id} className="p-2 bg-white/5 rounded-lg">
                    <p className="text-sm font-medium text-white truncate">{deal.title}</p>
                    <p className="text-xs text-white/50">{formatCurrency(deal.value)}</p>
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white uppercase tracking-wider">Social Media Management</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAIGenerate(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
          >
            <Sparkles className="w-4 h-4" /> AI Generate
          </button>
          <button
            onClick={() => setShowConnectAccount(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
          >
            <Link className="w-4 h-4" /> Connect Account
          </button>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { platform: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
          { platform: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'bg-sky-500' },
          { platform: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500' },
          { platform: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
        ].map(({ platform, name, icon: Icon, color }) => {
          const connectedAccount = socialAccounts.find(a => a.platform === platform);
          return (
            <div key={platform} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{name}</h3>
                  {connectedAccount ? (
                    <p className="text-xs text-green-400">Connected</p>
                  ) : (
                    <p className="text-xs text-white/40">Not connected</p>
                  )}
                </div>
              </div>
              {connectedAccount ? (
                <div className="space-y-2">
                  <p className="text-xs text-white/60">{connectedAccount.accountName}</p>
                  <button
                    onClick={() => handleDisconnectAccount(connectedAccount.id)}
                    className="w-full text-xs text-red-400 hover:text-red-300 flex items-center gap-1 justify-center py-1"
                  >
                    <Unlink className="w-3 h-3" /> Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowConnectAccount(true);
                  }}
                  className="w-full text-xs bg-white/10 hover:bg-white/20 text-white py-1.5 rounded-lg transition"
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Content Creation */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Create New Post</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Platform</label>
              <select
                value={newPost.platform}
                onChange={(e) => setNewPost({ ...newPost, platform: e.target.value as any })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
              >
                <option value="facebook">Facebook</option>
                <option value="twitter">X (Twitter)</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() => setShowAIGenerate(true)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm hover:opacity-90"
              >
                <Wand2 className="w-4 h-4" /> AI Generate
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Content</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="What's on your mind?"
              rows={4}
              className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Date</label>
              <input
                type="date"
                value={newPost.scheduledDate}
                onChange={(e) => setNewPost({ ...newPost, scheduledDate: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Time</label>
              <input
                type="time"
                value={newPost.scheduledTime}
                onChange={(e) => setNewPost({ ...newPost, scheduledTime: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setNewPost({ content: '', platform: 'facebook', scheduledDate: '', scheduledTime: '', mediaFiles: [] })}
              className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
            >
              Clear
            </button>
            <button
              onClick={() => setShowSchedulePost(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Schedule Post
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled Posts */}
      <div className="bg-white/5 border border-white/10 rounded-xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Scheduled Posts</h3>
          <span className="text-sm text-white/50">{scheduledPosts.length} posts</span>
        </div>
        <div className="p-6">
          {scheduledPosts.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-white/20 mb-3" />
              <p className="text-white/50">No scheduled posts</p>
              <p className="text-xs text-white/30 mt-1">Create a post above to schedule it</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="p-4 border border-white/10 rounded-lg bg-white/5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-primary uppercase font-bold">{post.platform}</span>
                        <span className="text-xs text-white/30">•</span>
                        <span className="text-xs text-white/50 flex items-center gap-1">
                          <Clock3 className="w-3 h-3" /> {formatDate(post.scheduledDate)}
                        </span>
                      </div>
                      <p className="text-sm text-white">{post.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(post.status)}
                      <button
                        onClick={() => {
                          deleteSocialPost(post.id);
                          toast.success('Post deleted');
                        }}
                        className="p-1 hover:bg-white/10 rounded text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'active',
    source: 'website',
  });

  const [newDeal, setNewDeal] = useState({
    title: '',
    value: 0,
    stage: 'new',
    contactId: '',
    expectedCloseDate: '',
    probability: 10,
  });

  const handleCreateContact = async () => {
    try {
      await crmApi.createContact(newContact);
      toast.success('Contact created successfully');
      setShowAddContact(false);
      setNewContact({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        status: 'active',
        source: 'website',
      });
      loadContacts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create contact');
    }
  };

  const handleCreateDeal = async () => {
    try {
      await crmApi.createDeal(newDeal);
      toast.success('Deal created successfully');
      setShowAddDeal(false);
      setNewDeal({
        title: '',
        value: 0,
        stage: 'new',
        contactId: '',
        expectedCloseDate: '',
        probability: 10,
      });
      loadDeals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create deal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520]">
      {/* Header */}
      <header className="bg-[#0b2535]/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wider">CRM</h1>
              <p className="text-sm text-white/50">Manage contacts, deals & social media</p>
            </div>
          </div>
          <button onClick={() => loadDashboardStats()} className="p-2 hover:bg-white/10 rounded-lg transition">
            <RefreshCw className="w-5 h-5 text-white/50" />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0b2535]/80 backdrop-blur-xl border-r border-white/10 min-h-screen">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ViewTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
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
          {activeView === 'contacts' && renderContacts()}
          {activeView === 'deals' && renderDeals()}
          {activeView === 'social' && renderSocial()}
          {activeView === 'analytics' && (
            <div className="text-center py-12 text-white/50">
              Analytics coming soon
            </div>
          )}
        </main>
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Add New Contact</h3>
              <button onClick={() => setShowAddContact(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    value={newContact.firstName}
                    onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    value={newContact.lastName}
                    onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Company</label>
                  <input
                    type="text"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Position</label>
                  <input
                    type="text"
                    value={newContact.position}
                    onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Status</label>
                  <select
                    value={newContact.status}
                    onChange={(e) => setNewContact({ ...newContact, status: e.target.value })}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Source</label>
                  <select
                    value={newContact.source}
                    onChange={(e) => setNewContact({ ...newContact, source: e.target.value })}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  >
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social">Social Media</option>
                    <option value="advertising">Advertising</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddContact(false)}
                  className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateContact}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Create Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Deal Modal */}
      {showAddDeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-lg border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Create New Deal</h3>
              <button onClick={() => setShowAddDeal(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Deal Title</label>
                <input
                  type="text"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Value (USD)</label>
                  <input
                    type="number"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Stage</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Contact</label>
                <select
                  value={newDeal.contactId}
                  onChange={(e) => setNewDeal({ ...newDeal, contactId: e.target.value })}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                >
                  <option value="">Select Contact</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>{contact.firstName} {contact.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Expected Close Date</label>
                  <input
                    type="date"
                    value={newDeal.expectedCloseDate}
                    onChange={(e) => setNewDeal({ ...newDeal, expectedCloseDate: e.target.value })}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Probability (%)</label>
                  <input
                    type="number"
                    value={newDeal.probability}
                    onChange={(e) => setNewDeal({ ...newDeal, probability: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddDeal(false)}
                  className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDeal}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Create Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connect Account Modal */}
      {showConnectAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-md border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Connect Social Account</h3>
              <button onClick={() => setShowConnectAccount(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { platform: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600', desc: 'Connect your Facebook page' },
                { platform: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'bg-sky-500', desc: 'Connect your X/Twitter account' },
                { platform: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500', desc: 'Connect your Instagram business account' },
                { platform: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', desc: 'Connect your LinkedIn company page' },
              ].map(({ platform, name, icon: Icon, color, desc }) => {
                const isConnected = socialAccounts.some(a => a.platform === platform);
                const isConnecting = connectingPlatform === platform;
                return (
                  <div key={platform} className="p-4 border border-white/10 rounded-lg bg-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{name}</h4>
                          <p className="text-xs text-white/50">{desc}</p>
                        </div>
                      </div>
                      {isConnected ? (
                        <span className="text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded">Connected</span>
                      ) : (
                        <button
                          onClick={() => handleConnectAccount(platform, `${name} Account`, `acc_${platform}_${Date.now()}`)}
                          disabled={isConnecting}
                          className="bg-primary text-white text-sm px-3 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link className="w-4 h-4" />}
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-white/40 mt-4 text-center">
              OAuth connection simulation - credentials are stored locally
            </p>
          </div>
        </div>
      )}

      {/* Schedule Post Modal */}
      {showSchedulePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-md border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Schedule Post</h3>
              <button onClick={() => setShowSchedulePost(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-primary uppercase font-bold">{newPost.platform}</span>
                </div>
                <p className="text-sm text-white">{newPost.content || 'No content entered'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Date</label>
                  <input
                    type="date"
                    value={newPost.scheduledDate}
                    onChange={(e) => setNewPost({ ...newPost, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Time</label>
                  <input
                    type="time"
                    value={newPost.scheduledTime}
                    onChange={(e) => setNewPost({ ...newPost, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                    required
                  />
                </div>
              </div>
              {newPost.scheduledDate && newPost.scheduledTime && (
                <div className="p-3 bg-primary/20 rounded-lg text-sm">
                  <p className="text-white/80">
                    Post will be published on {new Date(`${newPost.scheduledDate}T${newPost.scheduledTime}`).toLocaleString('en-ZA', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowSchedulePost(false)}
                  className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSchedulePost}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Confirm Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Generate Modal */}
      {showAIGenerate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-lg border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> AI Content Generator
              </h3>
              <button onClick={() => setShowAIGenerate(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Select AI Source</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'chatgpt', name: 'ChatGPT', color: 'from-green-500 to-emerald-600' },
                    { id: 'perplexity', name: 'Perplexity', color: 'from-blue-500 to-indigo-600' },
                    { id: 'gemini', name: 'Gemini', color: 'from-purple-500 to-pink-600' },
                  ].map((source) => (
                    <button
                      key={source.id}
                      onClick={() => setAiSource(source.id as any)}
                      className={`p-3 rounded-lg border transition ${
                        aiSource === source.id
                          ? `bg-gradient-to-r ${source.color} border-transparent`
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm font-medium text-white">{source.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">What would you like to post about?</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="E.g., Announce our new product launch, share industry insights, promote a sale..."
                  rows={3}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white resize-none"
                />
              </div>
              <button
                onClick={handleAIGenerate}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Generate Content
                  </>
                )}
              </button>
              {generatedContent && (
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-purple-400 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Generated by {aiSource.charAt(0).toUpperCase() + aiSource.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-white whitespace-pre-wrap">{generatedContent}</p>
                  <button
                    onClick={() => {
                      setNewPost({ ...newPost, content: generatedContent });
                      setShowAIGenerate(false);
                      toast.success('Content applied to post composer!');
                    }}
                    className="mt-3 w-full bg-primary text-white py-2 rounded-lg text-sm hover:bg-primary/90"
                  >
                    Use This Content
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
