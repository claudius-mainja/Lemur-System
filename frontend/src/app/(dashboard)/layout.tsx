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
  MessageSquare, Video, Presentation, Palette, Code, Database, Moon, Sun, Link as LinkIcon,
  Grid3X3, LayoutDashboard, Gauge, ActivitySquare
} from 'lucide-react';
import toast from 'react-hot-toast';

type TabId = 'hr' | 'finance' | 'supply-chain' | 'crm' | 'payroll' | 'productivity' | 'email' | 'documents' | 'integrations' | 'automations' | 'users' | 'admin';

const tabs = [
  { id: 'admin' as TabId, name: 'ADMIN', icon: Crown, color: 'from-accent to-accentDark', bgColor: 'bg-accent', adminOnly: true },
  { id: 'hr' as TabId, name: 'HUMAN RESOURCES', icon: Users, color: 'from-primary to-secondary', bgColor: 'bg-primary' },
  { id: 'finance' as TabId, name: 'FINANCE', icon: Wallet, color: 'from-accent to-accentDark', bgColor: 'bg-accent' },
  { id: 'crm' as TabId, name: 'CRM', icon: BarChart3, color: 'from-accent to-accentDark', bgColor: 'bg-accent' },
  { id: 'payroll' as TabId, name: 'PAYROLL', icon: PiggyBank, color: 'from-secondary to-primary', bgColor: 'bg-secondary' },
  { id: 'productivity' as TabId, name: 'PRODUCTIVITY', icon: Zap, color: 'from-accentDark to-accent', bgColor: 'bg-accentDark' },
  { id: 'supply-chain' as TabId, name: 'SUPPLY CHAIN', icon: Package, color: 'from-primary to-accent', bgColor: 'bg-primary' },
  { id: 'email' as TabId, name: 'EMAIL', icon: Mail, color: 'from-secondary to-accent', bgColor: 'bg-secondary' },
  { id: 'documents' as TabId, name: 'DOCUMENTS', icon: FileText, color: 'from-primary to-secondary', bgColor: 'bg-primary' },
  { id: 'integrations' as TabId, name: 'INTEGRATIONS', icon: LinkIcon, color: 'from-accent to-accentDark', bgColor: 'bg-accent' },
  { id: 'automations' as TabId, name: 'AUTOMATIONS', icon: Zap as typeof Settings, color: 'from-accentDark to-accent', bgColor: 'bg-accentDark' },
  { id: 'users' as TabId, name: 'USERS', icon: Shield, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-500', adminOnly: true },
];

const subscriptionFeatures = {
  starter: {
    name: 'STARTER',
    price: 10.60,
    color: 'from-primary to-secondary',
    bgLight: 'bg-primary/10',
    textColor: 'text-primary',
    borderColor: 'border-primary',
    icon: Star,
    features: ['HR Module', 'Finance', 'Supply Chain', '10 GB Storage', 'Email Support', 'Basic Reporting', 'Mobile App', 'Integrations'],
    limits: { employees: 6, modules: 3, storageGB: 10 },
    allowedModules: ['hr', 'finance', 'supply-chain', 'integrations'],
  },
  professional: {
    name: 'PROFESSIONAL',
    price: 20.50,
    color: 'from-accent to-accentDark',
    bgLight: 'bg-accent/10',
    textColor: 'text-accent',
    borderColor: 'border-accent',
    icon: Zap,
    features: ['HR Suite', 'Finance & Invoicing', 'CRM', 'Payroll', 'Productivity', 'Supply Chain', '100 GB Storage', 'Priority Support', 'Advanced Analytics', 'API Access', 'Custom Integrations', 'SSO', 'Automations'],
    limits: { employees: 50, modules: 6, storageGB: 100 },
    allowedModules: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'integrations', 'automations'],
  },
  enterprise: {
    name: 'ENTERPRISE',
    price: null,
    color: 'from-accentDark to-primary',
    bgLight: 'bg-accentDark/10',
    textColor: 'text-accentDark',
    borderColor: 'border-accentDark',
    icon: Crown,
    features: ['All Applications + Custom', 'Unlimited Storage', '24/7 Dedicated Support', 'Custom Reporting & Dashboards', 'Full API Access', 'Custom Integrations', 'SSO & Advanced Security', 'Dedicated Account Manager', 'On-premise Option', 'SLA Guarantee', 'Custom Training', 'Advanced Automations'],
    limits: { employees: 'Unlimited', modules: 'Unlimited', storageGB: null },
    allowedModules: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'email', 'documents', 'integrations', 'automations'],
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
    } else if (user) {
      const roleModules: Record<string, string> = {
        admin: '/dashboard/admin',
        hr: '/dashboard/hr',
        finance: '/dashboard/finance',
        accountant: '/dashboard/finance',
        manager: '/dashboard/hr',
        employee: '/dashboard/productivity',
        ordinary: '/dashboard/profile',
      };
      
      if (pathname === '/dashboard' || pathname === '/dashboard/') {
        const redirectTo = roleModules[user.role] || '/dashboard/hr';
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, router, user, pathname]);

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
    { type: 'leave', count: pendingLeaves, label: 'PENDING LEAVES', color: 'bg-amber-500', icon: Calendar },
    { type: 'invoice', count: overdueInvoices, label: 'OVERDUE INVOICES', color: 'bg-red-500', icon: Receipt },
    { type: 'inventory', count: lowStockItems, label: 'LOW STOCK', color: 'bg-orange-500', icon: Package },
    { type: 'lead', count: newLeads, label: 'NEW LEADS', color: 'bg-blue-500', icon: Users },
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
    <div className={`min-h-screen transition-all duration-500 bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520]`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-accent/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Top Navigation */}
      <nav className="relative backdrop-blur-xl border-b border-white/10 bg-[#0b2535]/90 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Link href="/dashboard/hr" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-accent/30 transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl text-white tracking-tight hidden sm:block">LEMUR<span className="text-accent">SYSTEM</span></span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="SEARCH..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 placeholder-white/30 uppercase tracking-wider"
                />
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <div className="relative">
                <button className="p-2 rounded-lg relative text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  <Bell className="w-4 h-4" />
                  {totalNotifications > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                      {totalNotifications}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-accent to-accentDark rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {userInitials}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-white">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-white/40 uppercase tracking-wider">{subscription.name}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-white/40 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 bg-[#0b2535]/95 z-50 animate-fade-in-down overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent to-accentDark rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">{userInitials}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-white">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-white/40">{user?.email}</p>
                        </div>
                        <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-gradient-to-r ${subscription.color} text-white flex items-center gap-1`}>
                          <subscription.icon className="w-3 h-3" />
                          {subscription.name}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-white/60">{user?.organizationName}</p>
                      <p className="text-xs text-white/40 uppercase tracking-wider">{user?.industry} Industry</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-white/40 uppercase tracking-wider">Storage</p>
                          <p className="text-sm font-bold text-white">{subscription.limits.storageGB} GB</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40 uppercase tracking-wider">Max Users</p>
                          <p className="text-sm font-bold text-white">{subscription.limits.employees}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40 uppercase tracking-wider">Modules</p>
                          <p className="text-sm font-bold text-white">{enabledModules.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Your Features</p>
                      <div className="flex flex-wrap gap-1.5">
                        {subscription.features.slice(0, 5).map((f, i) => (
                          <span key={i} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-lg font-medium uppercase tracking-wider">
                            {f}
                          </span>
                        ))}
                        {subscription.features.length > 5 && (
                          <span className="px-2 py-1 text-xs rounded-lg text-white/40">
                            +{subscription.features.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-white/10 p-2">
                      <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200">
                        <UserCog className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wider">PROFILE & SETTINGS</span>
                      </Link>
                      <Link href="/docs" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wider">DOCUMENTATION</span>
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wider">SIGN OUT</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Module Tabs */}
        <div className="border-t border-white/10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-3 -mb-3 scrollbar-hide">
              {tabs.filter(tab => (enabledModules.includes(tab.id) || (tab.adminOnly && user?.role === 'admin'))).map((tab, index) => (
                <Link
                  key={tab.id}
                  href={`/dashboard/${tab.id}`}
                  className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-accent/25 scale-105`
                      : `text-white/40 hover:text-white hover:bg-white/5 hover:scale-102`
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`p-1.5 rounded-lg ${activeTab === tab.id ? 'bg-white/20' : `bg-white/5`}`}>
                    <tab.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider">{tab.name}</span>
                  {tab.id === 'hr' && pendingLeaves > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent to-accentDark rounded-full text-white text-xs flex items-center justify-center animate-bounce font-bold">
                      {pendingLeaves}
                    </span>
                  )}
                  {tab.id === 'finance' && overdueInvoices > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-accentDark to-primary rounded-full text-white text-xs flex items-center justify-center animate-bounce font-bold">
                      {overdueInvoices}
                    </span>
                  )}
                  {tab.id === 'supply-chain' && lowStockItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent to-primary rounded-full text-white text-xs flex items-center justify-center animate-bounce font-bold">
                      {lowStockItems}
                    </span>
                  )}
                  {tab.id === 'crm' && newLeads > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary to-secondary rounded-full text-white text-xs flex items-center justify-center animate-bounce font-bold">
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
      <main className={`pt-36 pb-8 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-[#0b2535]/50 border border-white/10 rounded-3xl p-8 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-4 py-1.5 bg-accent/20 text-accent rounded-full text-xs font-bold uppercase tracking-wider">
                      {subscription.name} PLAN
                    </span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
                    WELCOME BACK, {user?.firstName?.toUpperCase()}!
                  </h1>
                  <p className="text-white/40 font-light">
                    {user?.organizationName} • {user?.industry?.toUpperCase()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-white/40 uppercase tracking-wider">Employees</p>
                    <p className="text-2xl font-bold text-white">{stats.totalEmployees}</p>
                  </div>
                  <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-white/40 uppercase tracking-wider">Revenue</p>
                    <p className="text-2xl font-bold text-white">R{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-white/40 uppercase tracking-wider">Customers</p>
                    <p className="text-2xl font-bold text-white">{stats.totalCustomers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'EMPLOYEES', value: stats.totalEmployees, icon: Users, gradient: 'from-primary to-secondary' },
              { label: 'REVENUE', value: `R${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, gradient: 'from-accent to-accentDark' },
              { label: 'INVOICES', value: stats.totalInvoices, icon: Receipt, gradient: 'from-accentDark to-accent' },
              { label: 'INVENTORY', value: inventory.length, icon: Package, gradient: 'from-secondary to-primary' },
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="group rounded-2xl p-5 border border-white/10 bg-[#0b2535]/30 hover:border-white/20 hover:bg-[#0b2535]/50 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Alerts Section */}
          {totalNotifications > 0 && (
            <div className="backdrop-blur-sm rounded-3xl border border-white/10 bg-[#0b2535]/30 mb-8 overflow-hidden animate-fade-in-up">
              <div className="p-6 border-b border-white/10">
                <h3 className="font-bold uppercase tracking-widest flex items-center gap-4 text-xl text-white">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-accentDark rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  ACTION REQUIRED
                  <span className="ml-auto px-4 py-1.5 bg-gradient-to-r from-accent to-accentDark text-white text-sm font-bold rounded-full">
                    {totalNotifications}
                  </span>
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {notifications.filter(n => n.count > 0).map((notification, i) => (
                  <Link 
                    key={i}
                    href={`/dashboard/${notification.type === 'leave' ? 'hr' : notification.type === 'invoice' ? 'finance' : notification.type === 'inventory' ? 'supply-chain' : 'crm'}`}
                    className="group flex items-center gap-4 p-5 rounded-2xl border border-white/10 hover:border-accent/50 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`w-16 h-16 ${notification.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <notification.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{notification.count}</p>
                      <p className="text-xs font-bold text-white/40 uppercase tracking-wider">{notification.label}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-white/40 group-hover:translate-x-1 group-hover:text-white transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="rounded-2xl border border-white/10 bg-[#0b2535]/30 mb-8">
            <div className="px-6 py-5 border-b border-white/10">
              <h3 className="font-bold uppercase tracking-widest flex items-center gap-3 text-white">
                <Zap className="w-5 h-5 text-accent" />
                QUICK ACTIONS
              </h3>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {enabledModules.includes('hr') && (
                <Link href="/dashboard/hr" className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all duration-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Add Employee</span>
                </Link>
              )}
              {enabledModules.includes('finance') && (
                <Link href="/dashboard/finance" className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-transparent hover:border-accent/30 hover:bg-accent/5 transition-all duration-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">Create Invoice</span>
                </Link>
              )}
              {enabledModules.includes('payroll') && (
                <Link href="/dashboard/payroll" className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-transparent hover:border-secondary/30 hover:bg-secondary/5 transition-all duration-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center">
                    <Wallet2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">Run Payroll</span>
                </Link>
              )}
              {enabledModules.includes('crm') && (
                <Link href="/dashboard/crm" className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-transparent hover:border-accentDark/30 hover:bg-accentDark/5 transition-all duration-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-accentDark to-accent rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-accentDark uppercase tracking-wider">Add Lead</span>
                </Link>
              )}
              {enabledModules.includes('supply-chain') && (
                <Link href="/dashboard/supply-chain" className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all duration-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Add Inventory</span>
                </Link>
              )}
              {enabledModules.includes('productivity') && (
                <Link href="/dashboard/productivity" className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-transparent hover:border-secondary/30 hover:bg-secondary/5 transition-all duration-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accentDark rounded-xl flex items-center justify-center">
                    <Lightning className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">Tasks</span>
                </Link>
              )}
            </div>
          </div>

          {/* Module Cards */}
          <div className="mb-8">
              <h3 className="font-bold text-xl uppercase tracking-widest mb-6 flex items-center gap-3 text-white">
                <Building2 className="w-5 h-5 text-accent" />
                YOUR BUSINESS MODULES
              </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tabs.filter(tab => (enabledModules.includes(tab.id) || (tab.adminOnly && user?.role === 'admin'))).map((tab, index) => {
                return (
                <Link 
                  key={tab.id}
                  href={`/dashboard/${tab.id}`}
                  className="group rounded-2xl p-5 border border-white/10 bg-[#0b2535]/30 hover:border-white/20 hover:bg-[#0b2535]/50 transition-all duration-200 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className={`w-14 h-14 bg-gradient-to-br ${tab.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                      <tab.icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-bold text-white text-lg mb-2 uppercase tracking-wide">{tab.name}</h4>
                    <p className="text-sm text-white/40 font-light mb-4">
                      {tab.id === 'hr' && `${stats.totalEmployees} employees`}
                      {tab.id === 'finance' && `${stats.totalInvoices} invoices`}
                      {tab.id === 'supply-chain' && `${inventory.length} items`}
                      {tab.id === 'crm' && `${customers.length} customers`}
                      {tab.id === 'payroll' && `${payroll.length} records`}
                      {tab.id === 'productivity' && 'Manage tasks & projects'}
                      {tab.id === 'email' && 'Communication hub'}
                      {tab.id === 'documents' && 'File management'}
                    </p>
                    <span className="text-sm font-bold text-accent flex items-center gap-2 group-hover:gap-3 transition-all uppercase tracking-wider">
                      MANAGE <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Plan Features Banner */}
          <div className="bg-[#0b2535]/50 border border-white/10 rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <subscription.icon className="w-6 h-6 text-accent" />
                  <span className="font-bold text-white uppercase tracking-wider text-lg">{subscription.name} PLAN FEATURES</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subscription.features.slice(0, 4).map((feature, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/5 text-white/60 text-xs rounded-lg font-medium uppercase tracking-wider">
                      {feature}
                    </span>
                  ))}
                  {subscription.features.length > 4 && (
                    <span className="px-3 py-1.5 text-white/30 text-xs uppercase tracking-wider">+{subscription.features.length - 4} more</span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                {subscription.limits.storageGB === 100 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-xl">
                    <HeadphonesIcon className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">Priority Support</span>
                  </div>
                )}
                {subscription.limits.storageGB === 10 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl">
                    <Code className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">API Access</span>
                  </div>
                )}
                {subscription.limits.storageGB === null && (
                  <>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-xl">
                      <HeadphonesIcon className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-bold text-green-500 uppercase tracking-wider">24/7 Support</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-xl">
                      <Shield className="w-4 h-4 text-accent" />
                      <span className="text-xs font-bold text-accent uppercase tracking-wider">SSO</span>
                    </div>
                  </>
                )}
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
