'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useDataStore } from '@/stores/data.store';
import { useThemeStore } from '@/stores/theme.store';
import Link from 'next/link';
import { 
  Users, Wallet, Package, BarChart3, PiggyBank, Settings, LogOut, Menu, X,
  Search, Bell, ChevronDown, Home, FileText, Calendar, DollarSign, 
  UserCheck, ShoppingCart, TrendingUp, Building2, UserPlus, Clock,
  CheckCircle, XCircle, AlertCircle, Upload, Download, Plus, MoreHorizontal,
  Briefcase, CreditCard, Truck, Barcode, ArrowRight,
  Star, Crown, Zap, Shield, Activity, UsersRound, Receipt, PackageCheck,
  Target, UserCog, Building, Clock4, Wallet2, TrendingDown, Sparkles,
  ArrowUpRight, Mail, FileCheck, Zap as Lightning, HeadphonesIcon,
  MessageSquare, Video, Presentation, Palette, Code, Database, Moon, Sun
} from 'lucide-react';
import toast from 'react-hot-toast';

type TabId = 'hr' | 'finance' | 'supply-chain' | 'crm' | 'payroll' | 'productivity' | 'email' | 'documents';

const tabs = [
  { id: 'hr' as TabId, name: 'Human Resources', icon: Users, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500' },
  { id: 'finance' as TabId, name: 'Finance', icon: Wallet, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-500' },
  { id: 'crm' as TabId, name: 'CRM', icon: BarChart3, color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-500' },
  { id: 'payroll' as TabId, name: 'Payroll', icon: PiggyBank, color: 'from-green-500 to-green-600', bgColor: 'bg-green-500' },
  { id: 'productivity' as TabId, name: 'Productivity', icon: Zap, color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-500' },
  { id: 'supply-chain' as TabId, name: 'Supply Chain', icon: Package, color: 'from-orange-500 to-red-600', bgColor: 'bg-orange-500' },
  { id: 'email' as TabId, name: 'Email', icon: Mail, color: 'from-cyan-500 to-blue-600', bgColor: 'bg-cyan-500' },
  { id: 'documents' as TabId, name: 'Documents', icon: FileText, color: 'from-slate-500 to-slate-600', bgColor: 'bg-slate-500' },
];

const subscriptionFeatures = {
  starter: {
    name: 'Starter',
    price: 10.60,
    color: 'from-slate-400 to-slate-600',
    bgLight: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-300',
    icon: Star,
    features: ['HR Module', 'Finance', 'Supply Chain', '10 GB Storage', 'Email Support', 'Basic Reporting', 'Mobile App'],
    limits: { employees: 6, modules: 3, storageGB: 10 },
    allowedModules: ['hr', 'finance', 'supply-chain'],
  },
  professional: {
    name: 'Professional',
    price: 20.50,
    color: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    icon: Zap,
    features: ['HR Suite', 'Finance & Invoicing', 'CRM', 'Payroll', 'Productivity', 'Supply Chain', '100 GB Storage', 'Priority Support', 'Advanced Analytics', 'API Access', 'Custom Integrations', 'SSO'],
    limits: { employees: 50, modules: 6, storageGB: 100 },
    allowedModules: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain'],
  },
  enterprise: {
    name: 'Enterprise',
    price: null,
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    icon: Crown,
    features: ['All Applications + Custom', 'Unlimited Storage', '24/7 Dedicated Support', 'Custom Reporting & Dashboards', 'Full API Access', 'Custom Integrations', 'SSO & Advanced Security', 'Dedicated Account Manager', 'On-premise Option', 'SLA Guarantee', 'Custom Training'],
    limits: { employees: 'Unlimited', modules: 'Unlimited', storageGB: null },
    allowedModules: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'email', 'documents'],
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { employees, invoices, inventory, customers, leaveRequests, payroll, vendors, leads } = useDataStore();
  const { theme, toggleTheme } = useThemeStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('hr');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const subscription = subscriptionFeatures[user?.subscription || 'starter'];
  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (pathname) {
      const path = pathname.split('/').pop() || 'hr';
      const tab = tabs.find(t => t.id === path);
      if (tab) setActiveTab(tab.id);
    }
  }, [pathname]);

  if (!isAuthenticated) return null;

  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
  const lowStockItems = inventory.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').length;
  const newLeads = leads.filter(l => l.status === 'new').length;

  const notifications = [
    { type: 'leave', count: pendingLeaves, label: 'Pending Leaves', color: 'bg-amber-500', icon: Calendar },
    { type: 'invoice', count: overdueInvoices, label: 'Overdue Invoices', color: 'bg-red-500', icon: Receipt },
    { type: 'inventory', count: lowStockItems, label: 'Low Stock', color: 'bg-orange-500', icon: Package },
    { type: 'lead', count: newLeads, label: 'New Leads', color: 'bg-blue-500', icon: Users },
  ];

  const totalNotifications = notifications.reduce((acc, n) => acc + n.count, 0);

  const stats = {
    totalEmployees: employees.length,
    totalCustomers: customers.length,
    totalInvoices: invoices.length,
    totalVendors: vendors.length,
    pendingInvoices: invoices.filter(i => i.status === 'sent').length,
    paidInvoices: invoices.filter(i => i.status === 'paid').length,
    totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
    inventoryValue: inventory.reduce((sum, i) => sum + i.totalValue, 0),
  };

  const enabledModules = subscription.allowedModules;

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-br from-orange-600/20 to-transparent rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Top Navigation */}
      <nav className={`relative backdrop-blur-xl border-b ${isDark ? 'bg-dark-bg/80 border-dark-border' : 'bg-light-bg/80 border-light-border'} shadow-lg shadow-slate-200/50 fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 ${isDark ? 'text-dark-text-secondary hover:bg-dark-bg-tertiary' : 'text-light-text-secondary hover:bg-light-bg-tertiary'}`}
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link href="/dashboard/hr" className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-orange-500 to-blue-600 bg-size-200 animate-gradient rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-orange-500/50 transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <span className={`font-bold text-xl hidden sm:block bg-gradient-to-r bg-clip-text text-transparent ${isDark ? 'from-dark-text to-dark-text-secondary' : 'from-light-text to-light-text-secondary'}`}>LemurSystem</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-12 pr-4 py-2.5 ${isDark ? 'bg-dark-bg-tertiary text-dark-text border-dark-border' : 'bg-light-bg-secondary text-light-text border-light-border'} rounded-xl text-sm w-72 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all duration-300 border`}
                />
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-300 ${isDark ? 'text-dark-text-secondary hover:bg-dark-bg-tertiary' : 'text-light-text-secondary hover:bg-light-bg-tertiary'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="relative">
                <button className={`p-2.5 rounded-xl relative transition-all duration-300 ${isDark ? 'text-dark-text-secondary hover:bg-dark-bg-tertiary' : 'text-light-text-secondary hover:bg-light-bg-tertiary'}`}>
                  <Bell className="w-5 h-5" />
                  {totalNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                      {totalNotifications}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center gap-2 p-1.5 rounded-xl transition-all duration-300 ${isDark ? 'hover:bg-dark-bg-tertiary' : 'hover:bg-light-bg-tertiary'}`}
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-medium text-sm">
                      {userInitials}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className={`text-sm font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{user?.firstName} {user?.lastName}</p>
                    <p className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{subscription.name}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 hidden sm:block ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} />
                </button>

                {showProfileMenu && (
                  <div className={`absolute right-0 mt-3 w-80 backdrop-blur-xl rounded-2xl shadow-2xl border z-50 animate-fade-in-down overflow-hidden ${isDark ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'}`}>
                    <div className={`p-4 border-b ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">{userInitials}</span>
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{user?.firstName} {user?.lastName}</p>
                          <p className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{user?.email}</p>
                        </div>
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r ${subscription.color} text-white flex items-center gap-1`}>
                          <subscription.icon className="w-3 h-3" />
                          {subscription.name}
                        </span>
                      </div>
                      <p className={`text-sm font-medium ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{user?.organizationName}</p>
                      <p className={`text-xs capitalize ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{user?.industry} Industry</p>
                    </div>
                    
                    <div className={`p-4 bg-gradient-to-r ${isDark ? 'from-dark-bg-tertiary' : 'from-light-bg-tertiary'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Storage Used</p>
                          <p className={`text-sm font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{subscription.limits.storageGB} GB</p>
                        </div>
                        <div>
                          <p className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Max Users</p>
                          <p className={`text-sm font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{subscription.limits.employees}</p>
                        </div>
                        <div>
                          <p className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Modules</p>
                          <p className={`text-sm font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{enabledModules.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <p className={`text-xs mb-2 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Your Features</p>
                      <div className="flex flex-wrap gap-1.5">
                        {subscription.features.slice(0, 5).map((f, i) => (
                          <span key={i} className="px-2 py-1 bg-gradient-to-r from-blue-100 to-orange-100 text-blue-700 text-xs rounded-lg font-medium">
                            {f}
                          </span>
                        ))}
                        {subscription.features.length > 5 && (
                          <span className={`px-2 py-1 text-xs rounded-lg ${isDark ? 'bg-dark-bg-tertiary text-dark-text-muted' : 'bg-light-bg-tertiary text-light-text-muted'}`}>
                            +{subscription.features.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={`border-t ${isDark ? 'border-dark-border' : 'border-light-border'} p-2`}>
                      <Link href="/dashboard/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isDark ? 'text-dark-text-secondary hover:bg-dark-bg-tertiary hover:text-dark-text' : 'text-light-text-secondary hover:bg-light-bg-tertiary hover:text-light-text'}`}>
                        <UserCog className="w-4 h-4" />
                        <span className="text-sm font-medium">PROFILE & SETTINGS</span>
                      </Link>
                      <Link href="/docs" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isDark ? 'text-dark-text-secondary hover:bg-dark-bg-tertiary hover:text-dark-text' : 'text-light-text-secondary hover:bg-light-bg-tertiary hover:text-light-text'}`}>
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">DOCUMENTATION</span>
                      </Link>
                      <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20`}>
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">SIGN OUT</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Module Tabs */}
        <div className={`border-t ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-3 -mb-3 scrollbar-hide">
              {tabs.filter(tab => enabledModules.includes(tab.id)).map((tab, index) => (
                <Link
                  key={tab.id}
                  href={`/dashboard/${tab.id}`}
                  className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-orange-500/25 scale-105`
                      : `${isDark ? 'text-dark-text-secondary hover:bg-dark-bg-tertiary' : 'text-light-text-secondary hover:bg-light-bg-tertiary'} hover:scale-102`
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`p-1.5 rounded-lg ${activeTab === tab.id ? 'bg-white/20' : `${tab.bgColor}/10`}`}>
                    <tab.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider">{tab.name}</span>
                  {tab.id === 'hr' && pendingLeaves > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-red-500 rounded-full text-white text-xs flex items-center justify-center animate-bounce">
                      {pendingLeaves}
                    </span>
                  )}
                  {tab.id === 'finance' && overdueInvoices > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-white text-xs flex items-center justify-center animate-bounce">
                      {overdueInvoices}
                    </span>
                  )}
                  {tab.id === 'supply-chain' && lowStockItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-xs flex items-center justify-center animate-bounce">
                      {lowStockItems}
                    </span>
                  )}
                  {tab.id === 'crm' && newLeads > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white text-xs flex items-center justify-center animate-bounce">
                      {newLeads}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`pt-40 pb-8 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-orange-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-transparent to-orange-600/30" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      {subscription.name} PLAN
                    </span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2 uppercase tracking-wide">
                    Welcome back, {user?.firstName}! 👋
                  </h1>
                  <p className="text-blue-100 text-lg uppercase tracking-wide">
                    {user?.organizationName} • {user?.industry}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <p className="text-xs text-blue-200 uppercase tracking-wider">Employees</p>
                    <p className="text-2xl font-bold">{stats.totalEmployees}</p>
                  </div>
                  <div className="px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <p className="text-xs text-blue-200 uppercase tracking-wider">Revenue</p>
                    <p className="text-2xl font-bold">R{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <p className="text-xs text-blue-200 uppercase tracking-wider">Customers</p>
                    <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'EMPLOYEES', value: stats.totalEmployees, icon: Users, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500' },
              { label: 'REVENUE', value: `R${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-500' },
              { label: 'INVOICES', value: stats.totalInvoices, icon: Receipt, gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-500' },
              { label: 'INVENTORY', value: inventory.length, icon: Package, gradient: 'from-orange-500 to-amber-500', bg: 'bg-orange-500' },
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className={`group relative backdrop-blur-sm rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up ${isDark ? 'bg-dark-card/80 border-dark-border hover:border-blue-500/50' : 'bg-light-card/80 border-light-border hover:border-orange-500/50'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative z-10">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{stat.value}</p>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Alerts Section */}
          {totalNotifications > 0 && (
            <div className={`backdrop-blur-sm rounded-2xl border shadow-lg mb-8 overflow-hidden animate-fade-in-up ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
              <div className={`p-5 border-b ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
                <h3 className={`font-bold uppercase tracking-wider flex items-center gap-3 text-lg ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  ACTION REQUIRED
                  <span className="ml-auto px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold rounded-full">
                    {totalNotifications}
                  </span>
                </h3>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {notifications.filter(n => n.count > 0).map((notification, i) => (
                  <Link 
                    key={i}
                    href={`/dashboard/${notification.type === 'leave' ? 'hr' : notification.type === 'invoice' ? 'finance' : notification.type === 'inventory' ? 'supply-chain' : 'crm'}`}
                    className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 border ${isDark ? 'bg-dark-bg-tertiary border-dark-border hover:border-blue-500/50' : 'bg-light-bg-secondary border-light-border hover:border-orange-500/50'}`}
                  >
                    <div className={`w-14 h-14 ${notification.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <notification.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{notification.count}</p>
                      <p className={`text-sm font-medium uppercase tracking-wider ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{notification.label}</p>
                    </div>
                    <ArrowRight className={`w-5 h-5 ml-auto transition-transform group-hover:translate-x-1 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className={`backdrop-blur-sm rounded-2xl border shadow-lg mb-8 overflow-hidden animate-fade-in-up ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
            <div className={`p-5 border-b ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
              <h3 className={`font-bold uppercase tracking-wider flex items-center gap-3 text-lg ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                QUICK ACTIONS
              </h3>
            </div>
            <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {enabledModules.includes('hr') && (
                <Link href="/dashboard/hr" className="group flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 border border-blue-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <UserPlus className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">ADD EMPLOYEE</span>
                </Link>
              )}
              {enabledModules.includes('finance') && (
                <Link href="/dashboard/finance" className="group flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2 border border-purple-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Receipt className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-bold text-purple-700 uppercase tracking-wider">CREATE INVOICE</span>
                </Link>
              )}
              {enabledModules.includes('payroll') && (
                <Link href="/dashboard/payroll" className="group flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-2 border border-green-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Wallet2 className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-bold text-green-700 uppercase tracking-wider">RUN PAYROLL</span>
                </Link>
              )}
              {enabledModules.includes('crm') && (
                <Link href="/dashboard/crm" className="group flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-2xl hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-2 border border-pink-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-bold text-pink-700 uppercase tracking-wider">ADD LEAD</span>
                </Link>
              )}
              {enabledModules.includes('supply-chain') && (
                <Link href="/dashboard/supply-chain" className="group flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-2 border border-orange-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-bold text-orange-700 uppercase tracking-wider">ADD INVENTORY</span>
                </Link>
              )}
              {enabledModules.includes('productivity') && (
                <Link href="/dashboard/productivity" className="group flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-2 border border-amber-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Lightning className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-bold text-amber-700 uppercase tracking-wider">TASKS</span>
                </Link>
              )}
            </div>
          </div>

          {/* Module Cards */}
          <div className="mb-8">
            <h3 className={`font-bold uppercase tracking-wider text-xl mb-5 flex items-center gap-3 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              YOUR BUSINESS MODULES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tabs.filter(tab => enabledModules.includes(tab.id)).map((tab, index) => (
                <Link 
                  key={tab.id}
                  href={`/dashboard/${tab.id}`}
                  className={`group relative backdrop-blur-sm rounded-2xl p-6 border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-fade-in-up ${isDark ? 'bg-dark-card/80 border-dark-border hover:border-blue-500/50' : 'bg-light-card/80 border-light-border hover:border-orange-500/50'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tab.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${tab.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <tab.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className={`font-bold uppercase tracking-wider text-lg mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{tab.name}</h4>
                    <p className={`text-sm mb-4 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                      {tab.id === 'hr' && `${stats.totalEmployees} employees`}
                      {tab.id === 'finance' && `${stats.totalInvoices} invoices`}
                      {tab.id === 'supply-chain' && `${inventory.length} items`}
                      {tab.id === 'crm' && `${customers.length} customers`}
                      {tab.id === 'payroll' && `${payroll.length} records`}
                      {tab.id === 'productivity' && 'Manage tasks & projects'}
                      {tab.id === 'email' && 'Communication hub'}
                      {tab.id === 'documents' && 'File management'}
                    </p>
                    <span className="text-sm font-bold text-orange-500 flex items-center gap-1 group-hover:gap-2 transition-all uppercase tracking-wider">
                      MANAGE <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Plan Features Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-orange-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <subscription.icon className="w-6 h-6" />
                    <span className="text-xl font-bold uppercase tracking-wider">{subscription.name} PLAN FEATURES</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subscription.features.map((feature, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 uppercase tracking-wider">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {subscription.limits.storageGB === 100 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
                      <HeadphonesIcon className="w-5 h-5 text-green-400" />
                      <span className="text-sm font-bold uppercase tracking-wider">PRIORITY SUPPORT</span>
                    </div>
                  )}
                  {subscription.limits.storageGB === 10 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                      <Code className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-bold uppercase tracking-wider">API ACCESS</span>
                    </div>
                  )}
                  {subscription.limits.storageGB === null && (
                    <>
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
                        <HeadphonesIcon className="w-5 h-5 text-green-400" />
                        <span className="text-sm font-bold uppercase tracking-wider">24/7 SUPPORT</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-bold uppercase tracking-wider">SSO ENABLED</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="mt-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
