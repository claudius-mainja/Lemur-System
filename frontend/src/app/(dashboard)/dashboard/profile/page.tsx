'use client';

import { useState, useRef } from 'react';
import { useAuthStore, Industry, SubscriptionPlan } from '@/stores/auth.store';
import { useDataStore } from '@/stores/data.store';
import { 
  User, Mail, Phone, MapPin, Building2, Camera, Save, Lock, Bell, Shield,
  CreditCard, CheckCircle, AlertCircle, Upload
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { settings, updateSettings } = useDataStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    company: user?.organizationName || '',
  });

  const [companySettings, setCompanySettings] = useState({
    companyName: settings.companyName,
    companyEmail: settings.companyEmail,
    companyPhone: settings.companyPhone,
    companyAddress: settings.companyAddress,
    currency: settings.currency,
    timezone: settings.timezone,
    taxRate: settings.taxRate,
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    leaveRequests: true,
    payrollUpdates: true,
    invoiceReminders: true,
    weeklyReports: false,
  });

  const handleProfileSave = () => {
    setUser({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
    });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCompanySave = () => {
    updateSettings(companySettings);
    toast.success('Company settings updated!');
  };

  const handleNotificationsSave = () => {
    toast.success('Notification preferences saved!');
  };

  const industryLabels: Record<Industry, string> = {
    technology: 'Technology & IT',
    retail: 'Retail & E-Commerce',
    manufacturing: 'Manufacturing',
    healthcare: 'Healthcare',
    education: 'Education',
    finance: 'Finance & Banking',
    construction: 'Construction',
    hospitality: 'Hospitality & Tourism',
    transportation: 'Transportation & Logistics',
    agriculture: 'Agriculture',
    mining: 'Mining & Resources',
    telecommunications: 'Telecommunications',
    realestate: 'Real Estate',
    legal: 'Legal Services',
    consulting: 'Consulting',
    other: 'Other',
  };

  const planLabels: Record<SubscriptionPlan, string> = {
    starter: 'Starter',
    professional: 'Professional',
    enterprise: 'Enterprise',
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" suppressHydrationWarning>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile & Settings</h1>
        <p className="text-slate-500">Manage your account and company settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-blue-700"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{profileData.firstName} {profileData.lastName}</h2>
            <p className="text-slate-500 capitalize">{user?.role}</p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {industryLabels[user?.industry as Industry || 'technology']}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                {planLabels[user?.subscription as SubscriptionPlan || 'enterprise']}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4">
            <h3 className="font-semibold text-slate-900 mb-4">Subscription Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Plan</span>
                <span className="font-medium">{planLabels[user?.subscription as SubscriptionPlan || 'enterprise']}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Industry</span>
                <span className="font-medium capitalize">{industryLabels[user?.industry as Industry || 'technology']}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Modules</span>
                <span className="font-medium">{user?.modules?.length || 0} enabled</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
              <button 
                onClick={() => isEditing ? handleProfileSave() : setIsEditing(true)}
                className="flex items-center gap-2 text-primary hover:text-blue-700 font-medium"
              >
                {isEditing ? <><Save className="w-4 h-4" /> Save</> : <><User className="w-4 h-4" /> Edit</>}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full pl-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none disabled:bg-slate-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none disabled:bg-slate-50"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                    className="w-full pl-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none disabled:bg-slate-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Company Settings</h3>
              <button 
                onClick={handleCompanySave}
                className="flex items-center gap-2 text-primary hover:text-blue-700 font-medium"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input 
                  type="text" 
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings({...companySettings, companyName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Email</label>
                <input 
                  type="email" 
                  value={companySettings.companyEmail}
                  onChange={(e) => setCompanySettings({...companySettings, companyEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input 
                  type="tel" 
                  value={companySettings.companyPhone}
                  onChange={(e) => setCompanySettings({...companySettings, companyPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                <select 
                  value={companySettings.currency}
                  onChange={(e) => setCompanySettings({...companySettings, currency: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                <select 
                  value={companySettings.timezone}
                  onChange={(e) => setCompanySettings({...companySettings, timezone: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tax Rate (%)</label>
                <input 
                  type="number" 
                  value={companySettings.taxRate}
                  onChange={(e) => setCompanySettings({...companySettings, taxRate: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Address</label>
                <input 
                  type="text" 
                  value={companySettings.companyAddress}
                  onChange={(e) => setCompanySettings({...companySettings, companyAddress: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Notification Preferences</h3>
              <button 
                onClick={handleNotificationsSave}
                className="flex items-center gap-2 text-primary hover:text-blue-700 font-medium"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive important alerts via email' },
                { key: 'leaveRequests', label: 'Leave Requests', desc: 'Get notified about leave requests' },
                { key: 'payrollUpdates', label: 'Payroll Updates', desc: 'Receive payroll processing notifications' },
                { key: 'invoiceReminders', label: 'Invoice Reminders', desc: 'Get reminders for due invoices' },
                { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly summary reports' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Security</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-slate-600" />
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Change Password</p>
                    <p className="text-sm text-slate-500">Update your password</p>
                  </div>
                </div>
                <span className="text-slate-400">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-500">Add an extra layer of security</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Enabled</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
