'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { adminApi, organizationApi } from '@/services/api';

interface OrganizationStats {
  total_users: number;
  active_users: number;
  max_users: number;
  max_users_total: number;
  extra_users: number;
  extra_users_cost: number;
  subscription: string;
  modules: string[];
  currency: string;
}

interface Organization {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  currency: string;
  subscription: string;
  modules: string[];
  max_users: number;
  extra_users: number;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  department: string;
  phone: string;
  is_active: boolean;
  modules: string[];
  user_groups: string[];
}

interface UserGroup {
  id: string;
  name: string;
  description: string;
  module: string;
  permissions: any;
  modules_access: string[];
  members: string[];
  member_count: number;
  is_active: boolean;
}

export default function AdminPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<OrganizationStats | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, orgRes, usersRes, groupsRes] = await Promise.all([
        organizationApi.getOrganizationStats().catch(() => ({ data: null })),
        organizationApi.getOrganization().catch(() => ({ data: null })),
        adminApi.getUsers().catch(() => ({ data: [] })),
        adminApi.getUserGroups().catch(() => ({ data: [] })),
      ]);
      
      setStats(statsRes.data);
      setOrganization(orgRes.data);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setGroups(Array.isArray(groupsRes.data) ? groupsRes.data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data: any) => {
    try {
      await adminApi.createUser(data);
      setShowUserModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (id: string, data: any) => {
    try {
      await adminApi.updateUser(id, data);
      setEditingUser(null);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminApi.deleteUser(id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete user');
    }
  };

  const handleCreateGroup = async (data: any) => {
    try {
      await adminApi.createUserGroup(data);
      setShowGroupModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create group');
    }
  };

  const handleUpdateGroup = async (id: string, data: any) => {
    try {
      await adminApi.updateUserGroup(id, data);
      setEditingGroup(null);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update group');
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm('Are you sure you want to delete this group?')) return;
    try {
      await adminApi.deleteUserGroup(id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete group');
    }
  };

  const handleAddUserToGroup = async (groupId: string, userId: string) => {
    try {
      await adminApi.addUserToGroup(groupId, userId);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to add user to group');
    }
  };

  const handlePurchaseExtraUsers = async (count: number) => {
    try {
      await adminApi.purchaseExtraUsers(count);
      loadData();
      alert(`Successfully added ${count} extra users!`);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to purchase extra users');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Admin</h1>
          <p className="text-gray-600">Manage your organization settings, users, and groups</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{organization?.name}</p>
          <p className="text-xs text-gray-400">Plan: {organization?.subscription}</p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'groups', label: 'User Groups' },
            { id: 'organization', label: 'Organization' },
            { id: 'subscription', label: 'Subscription' },
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

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{stats?.total_users || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              of {stats?.max_users_total || stats?.max_users || 0} allowed
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <p className="text-3xl font-bold text-green-600">{stats?.active_users || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">User Groups</h3>
            <p className="text-3xl font-bold text-purple-600">{groups.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Currency</h3>
            <p className="text-3xl font-bold text-gray-900">{stats?.currency || 'USD'}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Users</h2>
            {isAdmin && (
              <button
                onClick={() => { setEditingUser(null); setShowUserModal(true); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add User
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{u.first_name} {u.last_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.department || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {isAdmin && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => { setEditingUser(u); setShowUserModal(true); }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">User Groups</h2>
            {isAdmin && (
              <button
                onClick={() => { setEditingGroup(null); setShowGroupModal(true); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Group
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {groups.map((group) => (
              <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                  <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                    {group.module}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{group.description || 'No description'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{group.member_count || 0} members</span>
                  <div className="flex space-x-2">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => { setEditingGroup(group); setShowGroupModal(true); }}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {group.modules_access && group.modules_access.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {group.modules_access.map((mod: string) => (
                      <span key={mod} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {mod}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'organization' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Organization Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <p className="text-gray-900">{organization?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{organization?.email || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900">{organization?.phone || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <p className="text-gray-900">{organization?.address || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <p className="text-gray-900">{organization?.city || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <p className="text-gray-900">{organization?.country || 'US'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <p className="text-gray-900">{organization?.currency || 'USD'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enabled Modules</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {(organization?.modules || []).map((mod: string) => (
                  <span key={mod} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {mod}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Current Subscription</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Plan</label>
                <p className="text-xl font-bold text-gray-900 capitalize">{stats?.subscription || 'starter'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Base Users</label>
                <p className="text-xl font-bold text-gray-900">{stats?.max_users || 5}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Extra Users</label>
                <p className="text-xl font-bold text-gray-900">{stats?.extra_users || 0}</p>
                <p className="text-xs text-gray-500">${stats?.extra_users_cost || 0}/month</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Purchase Extra Users</h2>
            <p className="text-sm text-gray-600 mb-4">
              Need more users? Add extra users for $5.00/month each.
            </p>
            <div className="flex gap-4">
              {[1, 5, 10].map((count) => (
                <button
                  key={count}
                  onClick={() => handlePurchaseExtraUsers(count)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add {count} User{count > 1 ? 's' : ''} (+${count * 5})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showUserModal && (
        <UserModal
          user={editingUser}
          onClose={() => { setShowUserModal(false); setEditingUser(null); }}
          onSubmit={editingUser ? (data) => handleUpdateUser(editingUser.id, data) : handleCreateUser}
          existingUsers={users}
        />
      )}

      {showGroupModal && (
        <GroupModal
          group={editingGroup}
          users={users}
          onClose={() => { setShowGroupModal(false); setEditingGroup(null); }}
          onSubmit={editingGroup ? (data) => handleUpdateGroup(editingGroup.id, data) : handleCreateGroup}
          onAddUserToGroup={handleAddUserToGroup}
        />
      )}
    </div>
  );
}

function UserModal({ user, onClose, onSubmit, existingUsers }: {
  user: User | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  existingUsers: User[];
}) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    role: user?.role || 'employee',
    department: user?.department || '',
    phone: user?.phone || '',
    modules: user?.modules || [],
    user_groups: user?.user_groups || [],
  });

  const roles = ['admin', 'manager', 'hr', 'finance', 'accounting', 'employee', 'ordinary'];
  const modules = ['hr', 'finance', 'crm', 'payroll', 'productivity', 'inventory', 'marketing', 'services', 'operations'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !formData.password) {
      alert('Password is required for new users');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{user ? 'Edit User' : 'Add User'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              required
            />
          </div>
          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                required
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Module Access</label>
            <div className="flex flex-wrap gap-2">
              {modules.map((mod) => (
                <label key={mod} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.modules.includes(mod)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, modules: [...formData.modules, mod] });
                      } else {
                        setFormData({ ...formData, modules: formData.modules.filter((m) => m !== mod) });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{mod}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GroupModal({ group, users, onClose, onSubmit, onAddUserToGroup }: {
  group: UserGroup | null;
  users: User[];
  onClose: () => void;
  onSubmit: (data: any) => void;
  onAddUserToGroup: (groupId: string, userId: string) => void;
}) {
  const [formData, setFormData] = useState({
    name: group?.name || '',
    description: group?.description || '',
    module: group?.module || 'general',
    permissions: group?.permissions || {},
    modules_access: group?.modules_access || [],
  });
  const [selectedUser, setSelectedUser] = useState('');

  const modules = ['hr', 'finance', 'crm', 'payroll', 'productivity', 'inventory', 'marketing', 'services', 'operations', 'general'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddUser = () => {
    if (group && selectedUser) {
      onAddUserToGroup(group.id, selectedUser);
      setSelectedUser('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{group ? 'Edit Group' : 'Create Group'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Group Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Module</label>
            <select
              value={formData.module}
              onChange={(e) => setFormData({ ...formData, module: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
            >
              {modules.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Module Access</label>
            <div className="flex flex-wrap gap-2">
              {modules.map((mod) => (
                <label key={mod} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.modules_access.includes(mod)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, modules_access: [...formData.modules_access, mod] });
                      } else {
                        setFormData({ ...formData, modules_access: formData.modules_access.filter((m) => m !== mod) });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{mod}</span>
                </label>
              ))}
            </div>
          </div>
          
          {group && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Add Members</h3>
              <div className="flex space-x-2">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm border p-2"
                >
                  <option value="">Select a user</option>
                  {users.filter((u) => !group.members.includes(u.id)).map((u) => (
                    <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add
                </button>
              </div>
              {group.members && group.members.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Current members: {group.members.length}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {group ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
