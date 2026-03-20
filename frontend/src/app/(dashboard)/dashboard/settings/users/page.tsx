'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore, ROLE_PERMISSIONS, type UserRole } from '@/stores/auth.store';
import { usersApi } from '@/services/api';
import { 
  Users, UserPlus, Search, MoreHorizontal, Edit, Trash2, 
  CheckCircle, XCircle, Shield, UserCheck, Mail, Phone,
  Building2, X, Loader2, RefreshCw, Eye, EyeOff, AlertCircle,
  Key, Database, Activity, FileText, Zap, Layers, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  department?: string;
  phone?: string;
  is_active: boolean;
  organization_id: string;
  organization_name: string;
  created_at?: string;
  modules?: string[];
}

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Full system access' },
  { value: 'hr', label: 'HR Manager', description: 'HR module access' },
  { value: 'finance', label: 'Finance', description: 'Finance module access' },
  { value: 'accountant', label: 'Accountant', description: 'Accounting & reports' },
  { value: 'manager', label: 'Manager', description: 'Multiple modules access' },
  { value: 'employee', label: 'Employee', description: 'Basic access' },
  { value: 'ordinary', label: 'Ordinary', description: 'Profile only' },
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

const getRoleBadge = (role: string) => {
  const styles: Record<string, string> = {
    admin: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    hr: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    finance: 'bg-green-500/20 text-green-400 border border-green-500/30',
    accountant: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    manager: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    employee: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    ordinary: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
  };
  return styles[role] || styles.ordinary;
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return Shield;
    case 'hr': return Users;
    case 'finance': return Building2;
    default: return UserCheck;
  }
};

export default function UsersPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'employee' as UserRole,
    department: '',
    phone: '',
    modules: [] as string[],
  });

  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      const response = await usersApi.getAll();
      const userData = response.data.map((u: any) => ({
        id: u.id,
        email: u.email,
        first_name: u.first_name,
        last_name: u.last_name,
        role: u.role,
        department: u.department,
        phone: u.phone,
        is_active: u.is_active,
        organization_id: u.organization_id,
        organization_name: u.organization_name,
      }));
      setUsers(userData || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users from server');
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.first_name || !newUser.last_name) {
      toast.error('Please fill in all required fields');
      return;
    }

    const generatedPassword = newUser.password || `Temp${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`;

    setIsLoading(true);
    try {
      await usersApi.create({
        email: newUser.email,
        password: generatedPassword,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: newUser.role,
        department: newUser.department || undefined,
        phone: newUser.phone || undefined,
        modules: newUser.modules,
      });
      
      localStorage.setItem(`user_credentials_${Date.now()}`, JSON.stringify({
        username: newUser.email,
        password: generatedPassword,
        createdAt: new Date().toISOString(),
      }));
      
      toast.success(`User created successfully! ${!newUser.password ? `Temporary password: ${generatedPassword}` : 'Credentials have been set.'}`);
      setShowAddModal(false);
      setNewUser({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'employee',
        department: '',
        phone: '',
        modules: [],
      });
      loadUsers();
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to create user';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      await usersApi.update(selectedUser.id, {
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        role: selectedUser.role,
        department: selectedUser.department || undefined,
        phone: selectedUser.phone || undefined,
      });
      toast.success('User updated successfully');
      setShowEditModal(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to update user';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;

    setIsLoading(true);
    try {
      await usersApi.delete(userId);
      toast.success('User deactivated successfully');
      loadUsers();
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to deactivate user';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (u.department?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
  });

  if (!isAdmin) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-white/40">Only administrators can access user management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-white/60">Manage users and their access levels</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-accent to-accentDark text-white px-5 py-3 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 hover:shadow-lg hover:shadow-accent/30 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider">Total Users</p>
              <p className="text-2xl font-bold text-white mt-1">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider">Active</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{users.filter(u => u.is_active).length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider">Admins</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{users.filter(u => u.role === 'admin').length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider">Departments</p>
              <p className="text-2xl font-bold text-white mt-1">{new Set(users.filter(u => u.department).map(u => u.department)).size}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50"
              />
            </div>
            <button 
              onClick={loadUsers} 
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/10">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Modules Access</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/40">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/40">
                    {searchQuery ? 'No users found matching your search' : 'No users yet. Add your first user!'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const RoleIcon = getRoleIcon(u.role);
                  const modules = ROLE_PERMISSIONS[u.role as UserRole] || [];
                  
                  return (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {u.first_name?.[0]}{u.last_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{u.first_name} {u.last_name}</p>
                            <p className="text-sm text-white/40">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${getRoleBadge(u.role)}`}>
                          <RoleIcon className="w-3.5 h-3.5" />
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-white/60">
                        {u.department || '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {modules.slice(0, 3).map((mod) => (
                            <span key={mod} className="px-2 py-0.5 bg-white/5 text-white/40 text-xs rounded uppercase tracking-wider">
                              {mod}
                            </span>
                          ))}
                          {modules.length > 3 && (
                            <span className="px-2 py-0.5 text-white/30 text-xs">
                              +{modules.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {u.is_active ? (
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
                            onClick={() => { setSelectedUser(u); setShowEditModal(true); }}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {u.id !== user?.id && (
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-white/60 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#0b2535] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">First Name *</label>
                  <input
                    type="text"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Last Name *</label>
                  <input
                    type="text"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 pr-12"
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none"
                >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value} className="bg-[#0b2535]">
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="e.g. Sales, Engineering"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Module Access</label>
                <div className="grid grid-cols-2 gap-2">
                  {moduleOptions.map((mod) => {
                    const Icon = mod.icon;
                    return (
                      <button
                        key={mod.id}
                        onClick={() => {
                          const modules = newUser.modules.includes(mod.id)
                            ? newUser.modules.filter(m => m !== mod.id)
                            : [...newUser.modules, mod.id];
                          setNewUser({ ...newUser, modules });
                        }}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                          newUser.modules.includes(mod.id)
                            ? 'border-accent bg-accent/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-6 h-6 ${mod.color} rounded flex items-center justify-center`}>
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-medium text-white/60">{mod.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-white/60 uppercase tracking-wider">Access Level Preview</p>
                  <Key className="w-4 h-4 text-white/30" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {(ROLE_PERMISSIONS[newUser.role] || []).map((mod) => (
                    <span key={mod} className="px-3 py-1.5 bg-accent/20 text-accent text-xs rounded-lg font-bold uppercase tracking-wider">
                      {mod}
                    </span>
                  ))}
                  {newUser.modules.map((mod) => (
                    <span key={mod} className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs rounded-lg font-bold uppercase tracking-wider">
                      {mod}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-white/40 mt-2">Auto-generated password will be provided on creation</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-white/10 text-white/60 rounded-xl font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-accent to-accentDark text-white py-3 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#0b2535] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Edit User</h3>
              <button onClick={() => { setShowEditModal(false); setSelectedUser(null); }} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{selectedUser.first_name} {selectedUser.last_name}</p>
                  <p className="text-white/40">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    value={selectedUser.first_name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, first_name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    value={selectedUser.last_name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, last_name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Role</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none"
                >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value} className="bg-[#0b2535]">
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Department</label>
                <input
                  type="text"
                  value={selectedUser.department || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, department: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="Department name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  value={selectedUser.phone || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="+27 XX XXX XXXX"
                />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">Modules Access</p>
                <div className="flex flex-wrap gap-2">
                  {(ROLE_PERMISSIONS[selectedUser.role as UserRole] || []).map((mod) => (
                    <span key={mod} className="px-3 py-1.5 bg-accent/20 text-accent text-xs rounded-lg font-bold uppercase tracking-wider">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowEditModal(false); setSelectedUser(null); }}
                className="flex-1 px-4 py-3 border border-white/10 text-white/60 rounded-xl font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-accent to-accentDark text-white py-3 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
