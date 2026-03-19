'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useDataStore, TenantProfile } from '@/stores/data.store';
import { useThemeStore } from '@/stores/theme.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, Shield, Settings, Database, Server, HardDrive, Activity,
  CheckCircle, XCircle, Clock, AlertTriangle, Plus, Search, Edit,
  Trash2, Eye, EyeOff, UserPlus, Building2, Key, Lock, Globe,
  Cpu, MemoryStick, Wifi, Bell, RefreshCw, X, Loader2,
  ChevronRight, Crown, Zap, Layers, FileText, TrendingUp,
  TrendingDown, ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';

const accessLevelOptions = [
  { value: 'full', label: 'Full Access', description: 'Complete access to all modules and settings', color: 'from-purple-500 to-pink-500' },
  { value: 'limited', label: 'Limited Access', description: 'Access to assigned modules only', color: 'from-blue-500 to-cyan-500' },
  { value: 'view_only', label: 'View Only', description: 'Read-only access to assigned modules', color: 'from-gray-500 to-slate-500' },
];

const moduleOptions = [
  { id: 'hr', name: 'Human Resources', icon: Users, color: 'bg-blue-500' },
  { id: 'finance', name: 'Finance', icon: Database, color: 'bg-green-500' },
  { id: 'crm', name: 'CRM', icon: Activity, color: 'bg-violet-500' },
  { id: 'payroll', name: 'Payroll', icon: FileText, color: 'bg-orange-500' },
  { id: 'productivity', name: 'Productivity', icon: Zap, color: 'bg-cyan-500' },
  { id: 'supply-chain', name: 'Supply Chain', icon: Layers, color: 'bg-indigo-500' },
  { id: 'settings', name: 'Settings', icon: Settings, color: 'bg-slate-500' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { tenantProfiles, addTenantProfile, updateTenantProfile, deleteTenantProfile, employees, invoices, inventory, customers } = useDataStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [activeView, setActiveView] = useState<'overview' | 'tenants' | 'system' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showEditTenant, setShowEditTenant] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantProfile | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newTenant, setNewTenant] = useState({
    userName: '',
    userEmail: '',
    department: '',
    position: '',
    accessLevel: 'limited' as 'full' | 'limited' | 'view_only',
    modules: [] as string[],
    phone: '',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/dashboard/hr');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const filteredTenants = tenantProfiles.filter(t =>
    t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const systemMetrics = {
    totalUsers: tenantProfiles.length,
    activeUsers: tenantProfiles.filter(t => t.isActive).length,
    totalStorage: 100,
    storageUsed: 45,
    apiCalls: 12847,
    uptime: 99.9,
    lastBackup: new Date(Date.now() - 3600000).toLocaleTimeString(),
    activeSessions: 12,
  };

  const businessMetrics = {
    totalEmployees: employees.length || 12,
    totalInvoices: invoices.length || 48,
    totalInventory: inventory.length || 156,
    totalCustomers: customers.length || 8,
  };

  const handleAddTenant = () => {
    if (!newTenant.userName || !newTenant.userEmail) {
      toast.error('Please fill in required fields');
      return;
    }

    addTenantProfile({
      userId: `user-${Date.now()}`,
      userName: newTenant.userName,
      userEmail: newTenant.userEmail,
      department: newTenant.department,
      position: newTenant.position,
      accessLevel: newTenant.accessLevel,
      permissions: newTenant.modules,
      modules: newTenant.modules,
      isActive: true,
      organizationId: user?.organization_id || 'org-1',
      phone: newTenant.phone,
    });

    toast.success('Tenant profile created successfully');
    setShowAddTenant(false);
    setNewTenant({
      userName: '',
      userEmail: '',
      department: '',
      position: '',
      accessLevel: 'limited',
      modules: [],
      phone: '',
    });
  };

  const handleUpdateTenant = () => {
    if (!selectedTenant) return;

    updateTenantProfile(selectedTenant.id, {
      userName: selectedTenant.userName,
      userEmail: selectedTenant.userEmail,
      department: selectedTenant.department,
      position: selectedTenant.position,
      accessLevel: selectedTenant.accessLevel,
      permissions: selectedTenant.modules,
      modules: selectedTenant.modules,
      phone: selectedTenant.phone,
    });

    toast.success('Tenant profile updated');
    setShowEditTenant(false);
    setSelectedTenant(null);
  };

  const handleToggleActive = (tenant: TenantProfile) => {
    updateTenantProfile(tenant.id, { isActive: !tenant.isActive });
    toast.success(`Tenant ${tenant.isActive ? 'deactivated' : 'activated'}`);
  };

  const handleDeleteTenant = (id: string) => {
    if (confirm('Are you sure you want to delete this tenant profile?')) {
      deleteTenantProfile(id);
      toast.success('Tenant profile deleted');
    }
  };

  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case 'full':
        return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30';
      case 'limited':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30';
      case 'view_only':
        return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border border-gray-500/30';
      default:
        return 'bg-white/5 text-white/40 border border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                SYSTEM ADMIN
              </h1>
              <p className="text-white/40 text-sm">Organization Control Center</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${
              activeView === 'overview'
                ? 'bg-gradient-to-r from-accent to-accentDark text-white shadow-lg shadow-accent/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
            }`}
          >
            OVERVIEW
          </button>
          <button
            onClick={() => setActiveView('tenants')}
            className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${
              activeView === 'tenants'
                ? 'bg-gradient-to-r from-accent to-accentDark text-white shadow-lg shadow-accent/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
            }`}
          >
            TENANTS
          </button>
          <button
            onClick={() => setActiveView('system')}
            className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${
              activeView === 'system'
                ? 'bg-gradient-to-r from-accent to-accentDark text-white shadow-lg shadow-accent/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
            }`}
          >
            SYSTEM
          </button>
        </div>
      </div>

      {/* Overview View */}
      {activeView === 'overview' && (
        <>
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="flex items-center text-emerald-400 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4 mr-1" /> +2
                </span>
              </div>
              <p className="text-3xl font-bold text-white">{systemMetrics.totalUsers}</p>
              <p className="text-sm text-white/40 uppercase tracking-wider mt-1">Total Users</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="flex items-center text-emerald-400 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4 mr-1" /> +5
                </span>
              </div>
              <p className="text-3xl font-bold text-white">{systemMetrics.activeUsers}</p>
              <p className="text-sm text-white/40 uppercase tracking-wider mt-1">Active Sessions</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <HardDrive className="w-6 h-6 text-white" />
                </div>
                <span className="text-white/40 text-sm">{systemMetrics.storageUsed}%</span>
              </div>
              <p className="text-3xl font-bold text-white">{systemMetrics.totalStorage - systemMetrics.storageUsed} GB</p>
              <p className="text-sm text-white/40 uppercase tracking-wider mt-1">Storage Available</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <span className="flex items-center text-emerald-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-1" />
                </span>
              </div>
              <p className="text-3xl font-bold text-white">{systemMetrics.uptime}%</p>
              <p className="text-sm text-white/40 uppercase tracking-wider mt-1">System Uptime</p>
            </div>
          </div>

          {/* Business Overview */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-5 h-5 text-accent" />
                BUSINESS OVERVIEW
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Employees</p>
                <p className="text-2xl font-bold text-white">{businessMetrics.totalEmployees}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Invoices</p>
                <p className="text-2xl font-bold text-white">{businessMetrics.totalInvoices}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Inventory</p>
                <p className="text-2xl font-bold text-white">{businessMetrics.totalInventory}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Customers</p>
                <p className="text-2xl font-bold text-white">{businessMetrics.totalCustomers}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              QUICK ADMIN ACTIONS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <Link href="/dashboard/settings/users" className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all">
                <Users className="w-6 h-6 text-blue-400" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Manage Users</span>
              </Link>
              <Link href="/dashboard/hr" className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all">
                <Shield className="w-6 h-6 text-purple-400" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Security</span>
              </Link>
              <button className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all">
                <Database className="w-6 h-6 text-green-400" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Backup</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all">
                <Settings className="w-6 h-6 text-orange-400" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Config</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all">
                <Activity className="w-6 h-6 text-cyan-400" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Logs</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all">
                <Bell className="w-6 h-6 text-red-400" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Alerts</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Tenants View */}
      {activeView === 'tenants' && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Tenant Profiles</h2>
              <p className="text-white/40 text-sm">Manage user tenant profiles and access levels</p>
            </div>
            <button
              onClick={() => setShowAddTenant(true)}
              className="bg-gradient-to-r from-accent to-accentDark text-white px-5 py-3 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 hover:shadow-lg hover:shadow-accent/30 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              ADD TENANT
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-sm text-white/40 uppercase tracking-wider">Total Tenants</p>
              <p className="text-2xl font-bold text-white mt-1">{tenantProfiles.length}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-sm text-white/40 uppercase tracking-wider">Active</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{tenantProfiles.filter(t => t.isActive).length}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-sm text-white/40 uppercase tracking-wider">Full Access</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{tenantProfiles.filter(t => t.accessLevel === 'full').length}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50"
            />
          </div>

          {/* Tenants Table */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/10">
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Department</th>
                    <th className="p-4 font-medium">Access Level</th>
                    <th className="p-4 font-medium">Modules</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-white/40">
                        No tenant profiles found
                      </td>
                    </tr>
                  ) : (
                    filteredTenants.map((tenant) => (
                      <tr key={tenant.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {tenant.userName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{tenant.userName}</p>
                              <p className="text-sm text-white/40">{tenant.userEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-white/60">{tenant.department}</p>
                          <p className="text-sm text-white/40">{tenant.position}</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${getAccessLevelBadge(tenant.accessLevel)}`}>
                            {tenant.accessLevel === 'full' ? <Crown className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            {tenant.accessLevel.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {tenant.modules.slice(0, 3).map((mod) => (
                              <span key={mod} className="px-2 py-0.5 bg-white/5 text-white/40 text-xs rounded uppercase tracking-wider">
                                {mod}
                              </span>
                            ))}
                            {tenant.modules.length > 3 && (
                              <span className="px-2 py-0.5 text-white/30 text-xs">
                                +{tenant.modules.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {tenant.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-xs font-bold">
                              <CheckCircle className="w-3.5 h-3.5" />
                              ACTIVE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold">
                              <XCircle className="w-3.5 h-3.5" />
                              INACTIVE
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => { setSelectedTenant(tenant); setShowEditTenant(true); }}
                              className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleActive(tenant)}
                              className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                            >
                              {tenant.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteTenant(tenant.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-white/60 hover:text-red-400 transition-colors"
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
          </div>
        </>
      )}

      {/* System View */}
      {activeView === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Server Status */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-accent" />
              SERVER STATUS
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-white/60">API Server</span>
                </div>
                <span className="text-green-400 text-sm font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-white/60">Database</span>
                </div>
                <span className="text-green-400 text-sm font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-white/60">Cache</span>
                </div>
                <span className="text-green-400 text-sm font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-white/60">Auth Service</span>
                </div>
                <span className="text-green-400 text-sm font-medium">Running</span>
              </div>
            </div>
          </div>

          {/* System Resources */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-accent" />
              SYSTEM RESOURCES
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/60 text-sm">CPU Usage</span>
                  <span className="text-white text-sm font-medium">23%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '23%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/60 text-sm">Memory</span>
                  <span className="text-white text-sm font-medium">45%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/60 text-sm">Storage</span>
                  <span className="text-white text-sm font-medium">{systemMetrics.storageUsed}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" style={{ width: `${systemMetrics.storageUsed}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/60 text-sm">Network I/O</span>
                  <span className="text-white text-sm font-medium">Low</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:col-span-2">
            <h3 className="font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              RECENT ACTIVITY
            </h3>
            <div className="space-y-3">
              {[
                { icon: UserPlus, color: 'bg-blue-500', text: 'New tenant profile created for Finance Manager', time: '2 minutes ago' },
                { icon: Shield, color: 'bg-green-500', text: 'User John Doe granted Full Access', time: '15 minutes ago' },
                { icon: Settings, color: 'bg-orange-500', text: 'System backup completed successfully', time: '1 hour ago' },
                { icon: Database, color: 'bg-purple-500', text: 'Database optimization completed', time: '2 hours ago' },
                { icon: AlertTriangle, color: 'bg-red-500', text: 'Failed login attempt detected for user@example.com', time: '3 hours ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center`}>
                    <activity.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/80 text-sm">{activity.text}</p>
                    <p className="text-white/40 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {showAddTenant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#0b2535] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Create Tenant Profile</h3>
              <button onClick={() => setShowAddTenant(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    value={newTenant.userName}
                    onChange={(e) => setNewTenant({ ...newTenant, userName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Email *</label>
                  <input
                    type="email"
                    value={newTenant.userEmail}
                    onChange={(e) => setNewTenant({ ...newTenant, userEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Department</label>
                  <input
                    type="text"
                    value={newTenant.department}
                    onChange={(e) => setNewTenant({ ...newTenant, department: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="e.g. Sales"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Position</label>
                  <input
                    type="text"
                    value={newTenant.position}
                    onChange={(e) => setNewTenant({ ...newTenant, position: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="e.g. Manager"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Access Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {accessLevelOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setNewTenant({ ...newTenant, accessLevel: option.value as any })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        newTenant.accessLevel === option.value
                          ? `border-accent bg-accent/10`
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <p className="text-xs font-bold text-white uppercase">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Modules Access</label>
                <div className="grid grid-cols-2 gap-2">
                  {moduleOptions.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => {
                        const modules = newTenant.modules.includes(mod.id)
                          ? newTenant.modules.filter(m => m !== mod.id)
                          : [...newTenant.modules, mod.id];
                        setNewTenant({ ...newTenant, modules });
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                        newTenant.modules.includes(mod.id)
                          ? 'border-accent bg-accent/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-6 h-6 ${mod.color} rounded flex items-center justify-center`}>
                        <mod.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-white/60">{mod.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddTenant(false)}
                className="flex-1 px-4 py-3 border border-white/10 text-white/60 rounded-xl font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTenant}
                className="flex-1 bg-gradient-to-r from-accent to-accentDark text-white py-3 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/30 transition-all"
              >
                <UserPlus className="w-5 h-5" />
                Create Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tenant Modal */}
      {showEditTenant && selectedTenant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#0b2535] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Edit Tenant Profile</h3>
              <button onClick={() => { setShowEditTenant(false); setSelectedTenant(null); }} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedTenant.userName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{selectedTenant.userName}</p>
                  <p className="text-white/40">{selectedTenant.userEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={selectedTenant.userName}
                    onChange={(e) => setSelectedTenant({ ...selectedTenant, userName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={selectedTenant.userEmail}
                    onChange={(e) => setSelectedTenant({ ...selectedTenant, userEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Department</label>
                  <input
                    type="text"
                    value={selectedTenant.department}
                    onChange={(e) => setSelectedTenant({ ...selectedTenant, department: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Position</label>
                  <input
                    type="text"
                    value={selectedTenant.position}
                    onChange={(e) => setSelectedTenant({ ...selectedTenant, position: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Access Level</label>
                <select
                  value={selectedTenant.accessLevel}
                  onChange={(e) => setSelectedTenant({ ...selectedTenant, accessLevel: e.target.value as any })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none"
                >
                  {accessLevelOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#0b2535]">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Modules Access</label>
                <div className="grid grid-cols-2 gap-2">
                  {moduleOptions.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => {
                        const modules = selectedTenant.modules.includes(mod.id)
                          ? selectedTenant.modules.filter(m => m !== mod.id)
                          : [...selectedTenant.modules, mod.id];
                        setSelectedTenant({ ...selectedTenant, modules });
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                        selectedTenant.modules.includes(mod.id)
                          ? 'border-accent bg-accent/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-6 h-6 ${mod.color} rounded flex items-center justify-center`}>
                        <mod.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-white/60">{mod.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowEditTenant(false); setSelectedTenant(null); }}
                className="flex-1 px-4 py-3 border border-white/10 text-white/60 rounded-xl font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTenant}
                className="flex-1 bg-gradient-to-r from-accent to-accentDark text-white py-3 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/30 transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
