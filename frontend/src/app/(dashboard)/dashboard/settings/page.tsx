'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Settings as SettingsIcon, User, Building2, DollarSign, Globe, Shield,
  Bell, Lock, Users, Database, CreditCard, Mail, Phone, MapPin,
  Check, X, Loader2, Save, Eye, EyeOff, Palette, Clock, FileText,
  ChevronRight, Crown, Zap, Plus, Edit, Trash2, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States' },
  { code: 'EUR', name: 'Euro', symbol: '€', country: 'European Union' },
  { code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', country: 'South Africa' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', country: 'Canada' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', country: 'Switzerland' },
];

const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Asia/Dubai', label: 'Dubai' },
  { value: 'Australia/Sydney', label: 'Sydney' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, setUser, logout, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
  });

  const [organization, setOrganization] = useState({
    name: user?.organizationName || '',
    industry: user?.industry || '',
    currency: user?.currency || 'USD',
    timezone: user?.timezone || 'UTC',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    leaveRequests: true,
    invoices: true,
    payroll: true,
    marketing: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      setUser(profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrganizationUpdate = async () => {
    setIsLoading(true);
    try {
      setUser({ 
        organizationName: organization.name,
        industry: organization.industry as any,
        currency: organization.currency,
        timezone: organization.timezone,
      });
      toast.success('Organization settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'currency', label: 'Currency', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'users', label: 'Users', icon: Users, adminOnly: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Settings</h1>
          <p className="text-white/60 text-sm">Manage your account and organization settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                if (tab.adminOnly && user.role !== 'admin') return null;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-accent" />
                    Profile Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">First Name</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Last Name</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Department</label>
                      <input
                        type="text"
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleProfileUpdate}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-accent to-accentDark text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Changes
                </button>
              </div>
            )}

            {/* Organization Tab */}
            {activeTab === 'organization' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-accent" />
                    Organization Settings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Organization Name</label>
                      <input
                        type="text"
                        value={organization.name}
                        onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Industry</label>
                      <select
                        value={organization.industry}
                        onChange={(e) => setOrganization({ ...organization, industry: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none"
                      >
                        <option value="technology" className="bg-[#0b2535]">Technology</option>
                        <option value="retail" className="bg-[#0b2535]">Retail</option>
                        <option value="manufacturing" className="bg-[#0b2535]">Manufacturing</option>
                        <option value="healthcare" className="bg-[#0b2535]">Healthcare</option>
                        <option value="finance" className="bg-[#0b2535]">Finance</option>
                        <option value="education" className="bg-[#0b2535]">Education</option>
                        <option value="other" className="bg-[#0b2535]">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Timezone</label>
                      <select
                        value={organization.timezone}
                        onChange={(e) => setOrganization({ ...organization, timezone: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none"
                      >
                        {TIMEZONES.map((tz) => (
                          <option key={tz.value} value={tz.value} className="bg-[#0b2535]">{tz.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleOrganizationUpdate}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-accent to-accentDark text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Changes
                </button>
              </div>
            )}

            {/* Currency Tab */}
            {activeTab === 'currency' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-accent" />
                    Currency Settings
                  </h2>
                  <p className="text-white/60 text-sm mb-6">Select your preferred currency for transactions and reports.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {CURRENCIES.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          setOrganization({ ...organization, currency: curr.code });
                          setUser({ currency: curr.code });
                          toast.success(`Currency changed to ${curr.name}`);
                        }}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          organization.currency === curr.code
                            ? 'border-accent bg-accent/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-accent">{curr.symbol}</span>
                            <div>
                              <p className="font-medium text-white">{curr.name}</p>
                              <p className="text-xs text-white/40">{curr.country}</p>
                            </div>
                          </div>
                          <span className="text-xs text-white/40">{curr.code}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-accent" />
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                      { key: 'leaveRequests', label: 'Leave Requests', description: 'Get notified about new leave requests' },
                      { key: 'invoices', label: 'Invoice Updates', description: 'Invoice status changes and reminders' },
                      { key: 'payroll', label: 'Payroll Notifications', description: 'Payroll processing updates' },
                      { key: 'marketing', label: 'Marketing Updates', description: 'Product updates and announcements' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <p className="font-medium text-white">{item.label}</p>
                          <p className="text-sm text-white/40">{item.description}</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            notifications[item.key as keyof typeof notifications] ? 'bg-accent' : 'bg-white/20'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-accent" />
                    Security Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="font-medium text-white mb-2">Change Password</p>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="New password"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50 pr-12"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="font-medium text-white mb-2">Two-Factor Authentication</p>
                      <p className="text-sm text-white/40 mb-3">Add an extra layer of security to your account</p>
                      <button className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-accent" />
                      User Management
                    </h2>
                    <p className="text-white/60 text-sm mt-1">Manage your organization users</p>
                  </div>
                  <Link
                    href="/dashboard/settings/users"
                    className="bg-gradient-to-r from-accent to-accentDark text-white px-4 py-2 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover:shadow-lg hover:shadow-accent/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Manage Users
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
