'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { 
  Users, Plus, Search, MoreHorizontal, Trash2, Edit, Shield, 
  UserCheck, UserX, Mail, Phone, Building2, X, Save, AlertCircle, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

type UserRole = 'admin' | 'hr' | 'finance' | 'marketing' | 'employee' | 'manager';

interface OrganizationUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'settings'],
  hr: ['hr', 'productivity'],
  finance: ['finance', 'payroll'],
  marketing: ['crm', 'productivity'],
  manager: ['hr', 'finance', 'crm', 'productivity'],
  employee: ['productivity'],
};

const ROLE_LABELS: Record<UserRole, { label: string; description: string; color: string }> = {
  admin: { label: 'Administrator', description: 'Full access to all modules', color: 'bg-red-500/20 text-red-400' },
  hr: { label: 'HR Manager', description: 'HR and Productivity modules', color: 'bg-blue-500/20 text-blue-400' },
  finance: { label: 'Finance Manager', description: 'Finance and Payroll modules', color: 'bg-green-500/20 text-green-400' },
  marketing: { label: 'Marketing', description: 'CRM and Productivity modules', color: 'bg-purple-500/20 text-purple-400' },
  manager: { label: 'Manager', description: 'Multiple department access', color: 'bg-amber-500/20 text-amber-400' },
  employee: { label: 'Employee', description: 'Productivity module only', color: 'bg-slate-500/20 text-slate-400' },
};

const DEPARTMENTS = [
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'IT',
  'Customer Service',
  'Production',
  'Administration',
];

const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

export default function UserManagementPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<OrganizationUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<OrganizationUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'employee' as UserRole,
    phone: '',
    department: '',
    sendInvite: true,
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      router.push('/dashboard/hr');
      return;
    }

    const storedUsers = localStorage.getItem('organization-users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      const defaultUsers: OrganizationUser[] = [
        {
          id: generateId(),
          email: currentUser.email,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          role: 'admin',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ];
      setUsers(defaultUsers);
      localStorage.setItem('organization-users', JSON.stringify(defaultUsers));
    }
    setIsLoading(false);
  }, [currentUser, router]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('organization-users', JSON.stringify(users));
    }
  }, [users, isLoading]);

  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = () => {
    if (!newUser.email || !newUser.firstName || !newUser.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (users.find(u => u.email === newUser.email)) {
      toast.error('User with this email already exists');
      return;
    }

    const user: OrganizationUser = {
      id: generateId(),
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      phone: newUser.phone,
      department: newUser.department,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, user]);
    setNewUser({ email: '', firstName: '', lastName: '', role: 'employee', phone: '', department: '', sendInvite: true });
    setShowAddUser(false);
    toast.success(`User created${newUser.sendInvite ? ' and invite sent' : ''}`);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
    toast.success('User updated successfully');
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      toast.error('You cannot delete your own account');
      return;
    }

    setUsers(users.filter(u => u.id !== userId));
    toast.success('User deleted');
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
    const user = users.find(u => u.id === userId);
    toast.success(`User ${user?.isActive ? 'deactivated' : 'activated'}`);
  };

  const getRoleBadge = (role: UserRole) => {
    const config = ROLE_LABELS[role];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">User Management</h1>
              <p className="text-sm text-gray-500">Manage team members and access permissions</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddUser(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Users', value: users.length, color: 'bg-blue-500' },
            { label: 'Active Users', value: users.filter(u => u.isActive).length, color: 'bg-green-500' },
            { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'bg-red-500' },
            { label: 'Departments', value: [...new Set(users.map(u => u.department).filter(Boolean))].length, color: 'bg-purple-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Modules</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-medium">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.department || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.isActive ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {ROLE_PERMISSIONS[user.role].map((mod) => (
                          <span key={mod} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded capitalize">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`p-2 rounded-lg ${user.isActive ? 'hover:bg-red-50' : 'hover:bg-green-50'}`}
                        >
                          {user.isActive ? <UserX className="w-4 h-4 text-red-500" /> : <UserCheck className="w-4 h-4 text-green-500" />}
                        </button>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Add New User</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {Object.entries(ROLE_LABELS).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role Description */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">{ROLE_LABELS[newUser.role].label}</p>
                <p className="text-xs text-gray-500 mt-1">{ROLE_LABELS[newUser.role].description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">Access to:</span>{' '}
                  {ROLE_PERMISSIONS[newUser.role].join(', ')}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newUser.sendInvite}
                    onChange={(e) => setNewUser({ ...newUser, sendInvite: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Send invitation email</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowAddUser(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleCreateUser} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Create User</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Edit User</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editingUser.firstName}
                    onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editingUser.lastName}
                    onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {Object.entries(ROLE_LABELS).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={editingUser.department || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">{ROLE_LABELS[editingUser.role].label}</p>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Access to:</span>{' '}
                  {ROLE_PERMISSIONS[editingUser.role].join(', ')}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleUpdateUser} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
