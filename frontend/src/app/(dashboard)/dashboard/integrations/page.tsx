'use client';

import { useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { 
  Plug, Plus, Search, Settings, CheckCircle, XCircle, RefreshCw, ExternalLink,
  Mail, Calendar, Zap, Shield, Clock, MessageCircle, CreditCard, 
  Folder, FileText, Building2, Users, Bug, Database, Smartphone, Palette
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  status: 'connected' | 'disconnected' | 'pending';
  connectedDate?: string;
  lastSync?: string;
}

const iconMap: Record<string, React.ElementType> = {
  MessageCircle,
  Folder,
  Mail,
  CreditCard,
  Users,
  Building2,
  CheckCircle,
  Zap,
  Bug,
  FileText,
  Plug,
  Settings,
  ExternalLink,
  Shield,
  Clock,
  Calendar,
  Smartphone,
  Palette,
};

const getIcon = (iconName: string) => iconMap[iconName] || Plug;

export default function IntegrationsPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('integrations');
    if (stored) {
      setIntegrations(JSON.parse(stored));
    } else {
      const defaultIntegrations: Integration[] = [
        { id: '1', name: 'Slack', description: 'Team communication and notifications', iconName: 'MessageCircle', category: 'Communication', status: 'disconnected' },
        { id: '2', name: 'Google Workspace', description: 'Gmail, Drive, Calendar integration', iconName: 'Folder', category: 'Productivity', status: 'disconnected' },
        { id: '3', name: 'Microsoft 365', description: 'Outlook, OneDrive, Teams', iconName: 'Mail', category: 'Productivity', status: 'disconnected' },
        { id: '4', name: 'Stripe', description: 'Payment processing and invoicing', iconName: 'CreditCard', category: 'Payments', status: 'disconnected' },
        { id: '5', name: 'PayPal', description: 'Payment processing', iconName: 'CreditCard', category: 'Payments', status: 'disconnected' },
        { id: '6', name: 'Mailchimp', description: 'Email marketing automation', iconName: 'Mail', category: 'Marketing', status: 'disconnected' },
        { id: '7', name: 'HubSpot', description: 'CRM and marketing automation', iconName: 'Users', category: 'CRM', status: 'disconnected' },
        { id: '8', name: 'Salesforce', description: 'Enterprise CRM platform', iconName: 'Building2', category: 'CRM', status: 'disconnected' },
        { id: '9', name: 'Trello', description: 'Project management', iconName: 'Folder', category: 'Project Management', status: 'disconnected' },
        { id: '10', name: 'Asana', description: 'Team task management', iconName: 'CheckCircle', category: 'Project Management', status: 'disconnected' },
        { id: '11', name: 'Zapier', description: 'Workflow automation', iconName: 'Zap', category: 'Automation', status: 'disconnected' },
        { id: '12', name: 'GitHub', description: 'Code repository and CI/CD', iconName: 'Bug', category: 'Development', status: 'disconnected' },
        { id: '13', name: 'Dropbox', description: 'Cloud file storage', iconName: 'Folder', category: 'Storage', status: 'disconnected' },
        { id: '14', name: 'QuickBooks', description: 'Accounting software', iconName: 'FileText', category: 'Finance', status: 'disconnected' },
        { id: '15', name: 'Xero', description: 'Online accounting platform', iconName: 'FileText', category: 'Finance', status: 'disconnected' },
      ];
      setIntegrations(defaultIntegrations);
      localStorage.setItem('integrations', JSON.stringify(defaultIntegrations));
    }
    setIsLoading(false);
  }, []);

  const categories = ['all', 'Communication', 'Productivity', 'Payments', 'Marketing', 'CRM', 'Project Management', 'Automation', 'Development', 'Storage', 'Finance'];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  const handleConnect = (integrationId: string) => {
    const updated = integrations.map(i => {
      if (i.id === integrationId) {
        return {
          ...i,
          status: 'connected' as const,
          connectedDate: new Date().toISOString(),
          lastSync: new Date().toISOString(),
        };
      }
      return i;
    });
    setIntegrations(updated);
    localStorage.setItem('integrations', JSON.stringify(updated));
    toast.success('Integration connected successfully');
  };

  const handleDisconnect = (integrationId: string) => {
    const updated = integrations.map(i => {
      if (i.id === integrationId) {
        return { ...i, status: 'disconnected' as const };
      }
      return i;
    });
    setIntegrations(updated);
    localStorage.setItem('integrations', JSON.stringify(updated));
    toast.success('Integration disconnected');
  };

  const popularIntegrations = integrations.filter(i => ['Slack', 'Google Workspace', 'Stripe', 'Zapier'].includes(i.name));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-accentDark rounded-xl flex items-center justify-center">
              <Plug className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Integrations</h1>
              <p className="text-sm text-gray-500">Connect your favorite tools</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-xl p-6 border ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'}`}>Connected Apps</p>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{connectedCount}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <CheckCircle className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
            </div>
          </div>
          <div className={`rounded-xl p-6 border ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'}`}>Available</p>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{integrations.length}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-accent/20' : 'bg-blue-100'}`}>
                <Plug className={`w-6 h-6 ${isDark ? 'text-accent' : 'text-blue-600'}`} />
              </div>
            </div>
          </div>
          <div className={`rounded-xl p-6 border ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'}`}>Categories</p>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{categories.length - 1}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-secondary/20' : 'bg-purple-100'}`}>
                <Zap className={`w-6 h-6 ${isDark ? 'text-secondary' : 'text-purple-600'}`} />
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Popular Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularIntegrations.map(integration => {
              const Icon = getIcon(integration.iconName);
              return (
                <div key={integration.id} className={`border rounded-xl p-4 transition-shadow ${isDark ? 'border-dark-border hover:bg-dark-bg-tertiary' : 'border-gray-200 hover:shadow-md'}`}>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-dark-bg-tertiary' : 'bg-gray-100'}`}>
                      <Icon className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                    </div>
                    {integration.status === 'connected' ? (
                      <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>Connected</span>
                    ) : (
                      <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-dark-bg-tertiary text-dark-text-secondary' : 'bg-gray-100 text-gray-600'}`}>Available</span>
                    )}
                  </div>
                  <h3 className={`font-semibold mt-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{integration.name}</h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'}`}>{integration.description}</p>
                  {integration.status === 'connected' ? (
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className={`mt-4 w-full py-2 border rounded-lg text-sm transition ${isDark ? 'border-dark-border text-white hover:bg-dark-bg-tertiary' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(integration.id)}
                      className="mt-4 w-full py-2 bg-gradient-to-r from-accent to-accentDark text-white rounded-lg text-sm hover:shadow-lg"
                    >
                      Connect
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm ${isDark ? 'bg-dark-bg border-dark-border text-white placeholder-dark-text-muted' : 'border-gray-200 text-gray-900'}`}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-accent to-accentDark text-white'
                        : isDark ? 'bg-dark-bg-tertiary text-dark-text-secondary hover:bg-dark-border' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map(integration => {
                const Icon = getIcon(integration.iconName);
                return (
                  <div key={integration.id} className={`border rounded-xl p-5 transition-all hover:-translate-y-1 ${isDark ? 'border-dark-border hover:bg-dark-bg-tertiary' : 'border-gray-200 hover:shadow-md'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-dark-bg-tertiary' : 'bg-gray-100'}`}>
                          <Icon className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{integration.name}</h3>
                          <span className={`text-xs ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'}`}>{integration.category}</span>
                        </div>
                      </div>
                    </div>
                    <p className={`text-sm mt-3 ${isDark ? 'text-dark-text-secondary' : 'text-gray-600'}`}>{integration.description}</p>
                    <div className={`mt-4 pt-4 border-t flex items-center justify-between ${isDark ? 'border-dark-border' : 'border-gray-100'}`}>
                      {integration.status === 'connected' ? (
                        <>
                          <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                            <CheckCircle className="w-4 h-4" />
                            <span>Connected</span>
                          </div>
                          <div className="flex gap-2">
                            <button className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-dark-border' : 'hover:bg-gray-100'}`}>
                              <RefreshCw className={`w-4 h-4 ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'}`} />
                            </button>
                            <button 
                              onClick={() => handleDisconnect(integration.id)}
                              className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      ) : integration.status === 'pending' ? (
                        <>
                          <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            <Clock className="w-4 h-4" />
                            <span>Pending</span>
                          </div>
                          <button 
                            onClick={() => handleDisconnect(integration.id)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition ${isDark ? 'bg-dark-bg-tertiary text-white hover:bg-dark-border' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-gray-500">Not connected</span>
                          <button
                            onClick={() => handleConnect(integration.id)}
                            className="px-4 py-1.5 bg-gradient-to-r from-accent to-accentDark text-white rounded-lg text-sm hover:shadow-lg"
                          >
                            Connect
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
