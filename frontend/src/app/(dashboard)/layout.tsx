'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useDataStore } from '@/stores/data.store';
import Link from 'next/link';
import { 
  Users, Wallet, Package, BarChart3, PiggyBank, Settings, LogOut, Menu, X,
  Search, Bell, ChevronDown, Home, FileText, Calendar, DollarSign, 
  UserCheck, ShoppingCart, TrendingUp, Building2, UserPlus, Clock,
  CheckCircle, XCircle, AlertCircle, Upload, Download, Plus, MoreHorizontal,
  Briefcase, CreditCard, Truck, Barcode, ArrowRight,
  Star, Crown, Zap, Shield, Activity, UsersRound, Receipt, PackageCheck,
  Target, UserCog, Building, Clock4, Wallet2, TrendingDown
} from 'lucide-react';
import toast from 'react-hot-toast';

type TabId = 'hr' | 'finance' | 'supply-chain' | 'crm' | 'payroll';

const tabs = [
  { id: 'hr' as TabId, name: 'Human Resources', icon: Users, color: 'from-blue-500 to-blue-600' },
  { id: 'finance' as TabId, name: 'Finance', icon: Wallet, color: 'from-purple-500 to-purple-600' },
  { id: 'supply-chain' as TabId, name: 'Supply Chain', icon: Package, color: 'from-orange-500 to-orange-600' },
  { id: 'crm' as TabId, name: 'CRM', icon: BarChart3, color: 'from-pink-500 to-pink-600' },
  { id: 'payroll' as TabId, name: 'Payroll', icon: PiggyBank, color: 'from-green-500 to-green-600' },
];

const subscriptionFeatures = {
  starter: {
    name: 'Starter',
    color: 'bg-slate-100 text-slate-700',
    icon: Star,
    features: ['HR Module', 'Finance', 'Payroll', '3 Modules Total'],
    limits: { employees: 10, modules: 3 }
  },
  professional: {
    name: 'Professional',
    color: 'bg-blue-100 text-blue-700',
    icon: Zap,
    features: ['Full HR Suite', 'Finance & Invoicing', 'CRM', 'Payroll', 'Supply Chain', '5 Modules Total'],
    limits: { employees: 50, modules: 5 }
  },
  enterprise: {
    name: 'Enterprise',
    color: 'bg-amber-100 text-amber-700',
    icon: Crown,
    features: ['Full Suite', 'Supply Chain', 'Email', 'Documents', 'Custom Integrations', 'Unlimited Modules'],
    limits: { employees: 'Unlimited', modules: 'Unlimited' }
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
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('hr');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickStats, setShowQuickStats] = useState(true);

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
    { type: 'leave', count: pendingLeaves, label: 'Pending Leaves', color: 'bg-amber-500' },
    { type: 'invoice', count: overdueInvoices, label: 'Overdue Invoices', color: 'bg-red-500' },
    { type: 'inventory', count: lowStockItems, label: 'Low Stock', color: 'bg-orange-500' },
    { type: 'lead', count: newLeads, label: 'New Leads', color: 'bg-blue-500' },
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

  const enabledModules = user?.modules || ['hr', 'finance'];

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link href="/dashboard/hr" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="font-bold text-lg hidden sm:block">LemurSystem</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
                  <Bell className="w-5 h-5" />
                  {totalNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {totalNotifications}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {userInitials}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.subscription} Plan</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${subscription.color} flex items-center gap-1`}>
                          <subscription.icon className="w-3 h-3" />
                          {subscription.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                      <p className="text-xs text-slate-500 mt-1">{user?.organizationName}</p>
                    </div>
                    
                    <div className="px-4 py-2 bg-slate-50">
                      <p className="text-xs text-slate-500 mb-1">Industry</p>
                      <p className="text-sm font-medium capitalize">{user?.industry}</p>
                    </div>
                    
                    <div className="px-4 py-2">
                      <p className="text-xs text-slate-500 mb-1">Enabled Modules</p>
                      <div className="flex flex-wrap gap-1">
                        {enabledModules.map(m => (
                          <span key={m} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded capitalize">
                            {m.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 mt-2 pt-2">
                      <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50">
                        <UserCog className="w-4 h-4" />
                        Profile & Settings
                      </Link>
                      <Link href="/docs" className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50">
                        <FileText className="w-4 h-4" />
                        Documentation
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Module Tabs */}
        <div className="border-t border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto py-2 -mb-2">
              {tabs.filter(tab => enabledModules.includes(tab.id)).map((tab) => (
                <Link
                  key={tab.id}
                  href={`/dashboard/${tab.id}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.name}</span>
                  {tab.id === 'hr' && pendingLeaves > 0 && (
                    <span className="w-5 h-5 bg-amber-500 rounded-full text-white text-xs flex items-center justify-center">
                      {pendingLeaves}
                    </span>
                  )}
                  {tab.id === 'finance' && overdueInvoices > 0 && (
                    <span className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {overdueInvoices}
                    </span>
                  )}
                  {tab.id === 'supply-chain' && lowStockItems > 0 && (
                    <span className="w-5 h-5 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center">
                      {lowStockItems}
                    </span>
                  )}
                  {tab.id === 'crm' && newLeads > 0 && (
                    <span className="w-5 h-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
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
      <main className="pt-32 pb-8">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-primary via-blue-600 to-blue-700 rounded-2xl p-6 mb-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="text-blue-100">
                  {user?.organizationName} • {subscription.name} Plan
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white/10 rounded-lg">
                  <p className="text-xs text-blue-200">Industry</p>
                  <p className="font-medium capitalize">{user?.industry}</p>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-lg">
                  <p className="text-xs text-blue-200">Employees</p>
                  <p className="font-medium">{stats.totalEmployees} / {subscription.limits.employees}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalEmployees}</p>
                  <p className="text-xs text-slate-500">Employees</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Revenue</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalInvoices}</p>
                  <p className="text-xs text-slate-500">Invoices</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{inventory.length}</p>
                  <p className="text-xs text-slate-500">Inventory Items</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          {totalNotifications > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 mb-6">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Action Required
                </h3>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {notifications.filter(n => n.count > 0).map((notification, i) => (
                  <Link 
                    key={i}
                    href={`/dashboard/${notification.type === 'leave' ? 'hr' : notification.type === 'invoice' ? 'finance' : notification.type === 'inventory' ? 'supply-chain' : 'crm'}`}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                  >
                    <div className={`w-8 h-8 ${notification.color} rounded-lg flex items-center justify-center`}>
                      {notification.type === 'leave' && <Calendar className="w-4 h-4 text-white" />}
                      {notification.type === 'invoice' && <Receipt className="w-4 h-4 text-white" />}
                      {notification.type === 'inventory' && <Package className="w-4 h-4 text-white" />}
                      {notification.type === 'lead' && <Users className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{notification.count}</p>
                      <p className="text-xs text-slate-500">{notification.label}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 mb-6">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Quick Actions</h3>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {enabledModules.includes('hr') && (
                <Link href="/dashboard/hr" className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                  <UserPlus className="w-8 h-8 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Add Employee</span>
                </Link>
              )}
              {enabledModules.includes('finance') && (
                <Link href="/dashboard/finance" className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition">
                  <Receipt className="w-8 h-8 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Create Invoice</span>
                </Link>
              )}
              {enabledModules.includes('payroll') && (
                <Link href="/dashboard/payroll" className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition">
                  <Wallet2 className="w-8 h-8 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Run Payroll</span>
                </Link>
              )}
              {enabledModules.includes('crm') && (
                <Link href="/dashboard/crm" className="flex flex-col items-center gap-2 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition">
                  <Target className="w-8 h-8 text-pink-600" />
                  <span className="text-sm font-medium text-pink-700">Add Lead</span>
                </Link>
              )}
            </div>
          </div>

          {/* Module Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {tabs.filter(tab => enabledModules.includes(tab.id)).map((tab) => (
              <Link 
                key={tab.id}
                href={`/dashboard/${tab.id}`}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${tab.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <tab.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{tab.name}</h3>
                <p className="text-sm text-slate-500 mb-3">
                  {tab.id === 'hr' && `${stats.totalEmployees} employees`}
                  {tab.id === 'finance' && `${stats.totalInvoices} invoices`}
                  {tab.id === 'supply-chain' && `${inventory.length} items`}
                  {tab.id === 'crm' && `${customers.length} customers`}
                  {tab.id === 'payroll' && `${payroll.length} records`}
                </p>
                <span className="text-sm text-primary font-medium flex items-center gap-1">
                  Manage <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>

          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  );
}
