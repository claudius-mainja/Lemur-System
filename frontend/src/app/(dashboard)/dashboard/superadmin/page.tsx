'use client';

import { useState, useEffect, useCallback } from 'react';
import { superadminApi } from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';
import {
  Users, Building2, Package, Settings, Shield, Plus, Search,
  Edit, Trash2, Eye, MoreHorizontal, CheckCircle, XCircle,
  UserPlus, UserCog, UserX, CreditCard, Key, Activity,
  Clock, X, Loader2, RefreshCw, ChevronDown, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'dashboard' | 'users' | 'tenants' | 'modules' | 'groups' | 'plans' | 'audit';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  department: string;
  organization_name: string;
  modules: string[];
  is_active: boolean;
  date_joined: string;
}

interface Tenant {
  id: string;
  name: string;
  email: string;
  industry: string;
  country: string;
  subscription: string;
  currency: string;
  modules: string[];
  max_users: number;
  user_count: number;
  is_active: boolean;
  created_at: string;
}

interface Module {
  code: string;
  name: string;
  description: string;
}

interface DashboardStats {
  total_users: number;
  total_tenants: number;
  active_tenants: number;
  by_subscription: { subscription: string; count: number }[];
  recent_users: User[];
  recent_tenants: Tenant[];
}

const AVAILABLE_MODULES: Module[] = [
  { code: 'hr', name: 'Human Resources', description: 'Employee management, recruitment, leave, attendance' },
  { code: 'finance', name: 'Finance & Accounting', description: 'Invoicing, expenses, bank reconciliation' },
  { code: 'crm', name: 'Customer Relations', description: 'Leads, opportunities, contacts' },
  { code: 'payroll', name: 'Payroll', description: 'Salary processing, payslips, tax deductions' },
  { code: 'productivity', name: 'Productivity', description: 'Projects, tasks, documents, calendar' },
  { code: 'supply-chain', name: 'Supply Chain', description: 'Inventory, purchases, vendors' },
  { code: 'marketing', name: 'Marketing', description: 'Email campaigns, landing pages, automation' },
  { code: 'services', name: 'Help Desk', description: 'Support tickets, knowledge base, SLA' },
];

export default function SuperAdminDashboard() {
  const { user } = useAuthStore();
  const [activeView, setActiveView] = useState<ViewTab>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showViewUser, setShowViewUser] = useState<User | null>(null);
  const [showViewTenant, setShowViewTenant] = useState<Tenant | null>(null);

  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'employee',
    department: '',
    phone: '',
    modules: [] as string[],
  });

  const [newTenant, setNewTenant] = useState({
    name: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    industry: '',
    country: 'ZA',
    currency: 'ZAR',
    plan_code: 'starter',
  });

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await superadminApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await superadminApi.getUsers();
      setUsers(response.data?.users || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTenants = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await superadminApi.getTenants();
      setTenants(response.data?.tenants || []);
    } catch (error) {
      toast.error('Failed to load tenants');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (activeView === 'users') loadUsers();
    else if (activeView === 'tenants') loadTenants();
  }, [activeView, loadUsers, loadTenants]);

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.first_name || !newUser.last_name) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const response = await superadminApi.createUser(newUser);
      if (response.data) {
        toast.success('User created successfully!');
        setUsers([response.data, ...users]);
        setShowAddUser(false);
        setNewUser({
          email: '', password: '', first_name: '', last_name: '',
          role: 'employee', department: '', phone: '', modules: [],
        });
      }
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleCreateTenant = async () => {
    if (!newTenant.name || !newTenant.email || !newTenant.password || !newTenant.first_name || !newTenant.last_name) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const response = await superadminApi.createTenant(newTenant);
      if (response.data) {
        toast.success('Tenant created successfully!');
        loadTenants();
        setShowAddTenant(false);
        setNewTenant({
          name: '', email: '', password: '', first_name: '', last_name: '',
          industry: '', country: 'ZA', currency: 'ZAR', plan_code: 'starter',
        });
      }
    } catch (error) {
      toast.error('Failed to create tenant');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await superadminApi.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteTenant = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tenant and all associated users?')) return;
    try {
      await superadminApi.deleteTenant(id);
      setTenants(tenants.filter(t => t.id !== id));
      toast.success('Tenant deleted');
    } catch (error) {
      toast.error('Failed to delete tenant');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'hr': return 'bg-yellow-100 text-yellow-800';
      case 'finance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (user?.role !== 'super_admin') {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">You need super admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage users, tenants, and system settings</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadStats}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 mb-6 w-fit">
        {(['dashboard', 'users', 'tenants', 'modules', 'groups', 'plans', 'audit'] as ViewTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveView(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeView === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          {activeView === 'dashboard' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_users}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Tenants</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_tenants}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Tenants</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active_tenants}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Subscription Plans</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.by_subscription.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {stats.recent_users?.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{user.first_name?.[0] || ''}{user.last_name?.[0] || ''}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tenants</h3>
                  <div className="space-y-3">
                    {stats.recent_tenants?.map((tenant) => (
                      <div key={tenant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{tenant.name}</p>
                          <p className="text-sm text-gray-500">{tenant.user_count} users</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {tenant.subscription}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'users' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowAddUser(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  <UserPlus className="w-4 h-4" />
                  Add User
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">{user.first_name[0]}{user.last_name[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.organization_name || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setShowViewUser(user)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeView === 'tenants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tenants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowAddTenant(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  <Building2 className="w-4 h-4" />
                  Add Tenant
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTenants.map((tenant) => (
                  <div key={tenant.id} className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{tenant.name}</p>
                          <p className="text-sm text-gray-500">{tenant.user_count} users</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${tenant.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {tenant.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600"><span className="font-medium">Plan:</span> {tenant.subscription}</p>
                      <p className="text-gray-600"><span className="font-medium">Industry:</span> {tenant.industry || '-'}</p>
                      <p className="text-gray-600"><span className="font-medium">Country:</span> {tenant.country}</p>
                      <p className="text-gray-600"><span className="font-medium">Modules:</span> {tenant.modules?.length || 0}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button onClick={() => setShowViewTenant(tenant)} className="flex-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                        View
                      </button>
                      <button onClick={() => handleDeleteTenant(tenant.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'modules' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Modules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {AVAILABLE_MODULES.map((module) => (
                  <div key={module.code} className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{module.name}</p>
                        <p className="text-xs text-gray-500 uppercase">{module.code}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'groups' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">User Groups</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Add Group
                </button>
              </div>
              <p className="text-gray-500 text-center py-8">No user groups configured yet.</p>
            </div>
          )}

          {activeView === 'plans' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Add Plan
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['starter', 'professional', 'enterprise'].map((plan) => (
                  <div key={plan} className="p-5 border border-gray-200 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 capitalize">{plan}</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {plan === 'starter' ? 'R199' : plan === 'professional' ? 'R499' : 'R999'}<span className="text-sm font-normal text-gray-500">/mo</span>
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" /> 5 users max
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" /> Basic modules
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" /> Email support
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'audit' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Logs</h3>
              <p className="text-gray-500 text-center py-8">No audit logs available.</p>
            </div>
          )}
        </>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New User</h2>
              <button onClick={() => setShowAddUser(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="hr">HR Manager</option>
                    <option value="finance">Finance Manager</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modules</label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_MODULES.map((module) => (
                    <label key={module.code} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newUser.modules.includes(module.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewUser({ ...newUser, modules: [...newUser.modules, module.code] });
                          } else {
                            setNewUser({ ...newUser, modules: newUser.modules.filter(m => m !== module.code) });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{module.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowAddUser(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
                <button onClick={handleCreateUser} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {showAddTenant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New Tenant</h2>
              <button onClick={() => setShowAddTenant(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
                <input
                  type="text"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin First Name *</label>
                  <input
                    type="text"
                    value={newTenant.first_name}
                    onChange={(e) => setNewTenant({ ...newTenant, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Last Name *</label>
                  <input
                    type="text"
                    value={newTenant.last_name}
                    onChange={(e) => setNewTenant({ ...newTenant, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email *</label>
                <input
                  type="email"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password *</label>
                <input
                  type="password"
                  value={newTenant.password}
                  onChange={(e) => setNewTenant({ ...newTenant, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={newTenant.industry}
                    onChange={(e) => setNewTenant({ ...newTenant, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    value={newTenant.country}
                    onChange={(e) => setNewTenant({ ...newTenant, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ZA">South Africa</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="NG">Nigeria</option>
                    <option value="KE">Kenya</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                <select
                  value={newTenant.plan_code}
                  onChange={(e) => setNewTenant({ ...newTenant, plan_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="starter">Starter</option>
                  <option value="professional">Professional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowAddTenant(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
                <button onClick={handleCreateTenant} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create Tenant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">User Details</h2>
              <button onClick={() => setShowViewUser(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{showViewUser.first_name[0]}{showViewUser.last_name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{showViewUser.first_name} {showViewUser.last_name}</p>
                  <p className="text-sm text-gray-500">{showViewUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="font-medium">{showViewUser.role}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium">{showViewUser.is_active ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium">{showViewUser.department || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Organization</p>
                  <p className="font-medium">{showViewUser.organization_name || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Modules</p>
                <div className="flex flex-wrap gap-2">
                  {showViewUser.modules?.map((module) => (
                    <span key={module} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {module}
                    </span>
                  )) || <span className="text-gray-400">No modules assigned</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Tenant Modal */}
      {showViewTenant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Tenant Details</h2>
              <button onClick={() => setShowViewTenant(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{showViewTenant.name}</p>
                  <p className="text-sm text-gray-500">{showViewTenant.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Subscription</p>
                  <p className="font-medium capitalize">{showViewTenant.subscription}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium">{showViewTenant.is_active ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Industry</p>
                  <p className="font-medium">{showViewTenant.industry || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Country</p>
                  <p className="font-medium">{showViewTenant.country}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Users</p>
                  <p className="font-medium">{showViewTenant.user_count} / {showViewTenant.max_users}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Currency</p>
                  <p className="font-medium">{showViewTenant.currency}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Modules</p>
                <div className="flex flex-wrap gap-2">
                  {showViewTenant.modules?.map((module) => (
                    <span key={module} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      {module}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
