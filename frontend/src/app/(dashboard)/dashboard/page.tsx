'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, ROLE_PERMISSIONS } from '@/stores/auth.store';
import { useDataStore } from '@/stores/data.store';
import Link from 'next/link';
import {
  Users, Wallet, Package, BarChart3, PiggyBank, DollarSign,
  Building2, TrendingUp, ArrowUpRight, ArrowDownRight, Clock,
  FileText, Receipt, AlertCircle, Target, Package as PackageIcon,
  Calculator, Briefcase, CreditCard, Truck, Zap, Shield,
  CheckCircle, XCircle, Calendar, Activity, Users2, FilePlus,
  Plus, ArrowRight, Eye, MoreHorizontal, Search, Bell,
  UserPlus, RefreshCw, Clock4, Mail, MessageSquare, Video,
  Settings, Crown, Sparkles, BriefcaseIcon, Handshake, FileCheck,
  Timer, BellDot, Play, Pause, Coffee, LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  ZAR: 'R',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
};

interface Notification {
  id: string;
  type: 'leave' | 'invoice' | 'inventory' | 'lead' | 'payroll' | 'general';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, hasHydrated } = useAuthStore();
  const { 
    employees, invoices, inventory, customers, leaveRequests, 
    payroll, vendors, leads, tenantProfiles, hasHydrated: dataHydrated 
  } = useDataStore();

  const [activeView, setActiveView] = useState<string>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeTrackerActive, setTimeTrackerActive] = useState(false);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const firstLogin = !localStorage.getItem('lemur-logged-in-before');
      setIsFirstLogin(firstLogin);
      if (firstLogin) {
        localStorage.setItem('lemur-logged-in-before', 'true');
      }
    }
  }, []);

  const currency = user?.currency || 'USD';
  const currencySymbol = CURRENCY_SYMBOLS[currency] || '$';
  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : 'U';
  
  const isHydrated = hasHydrated && dataHydrated && isMounted;

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const pendingLeaves = leaveRequests.filter((l: any) => l.status === 'pending').length;
    const overdueInvoices = invoices.filter((i: any) => i.status === 'overdue').length;
    const lowStock = inventory.filter((i: any) => i.quantity < i.minQuantity).length;
    const newLeads = leads.filter((l: any) => l.status === 'new').length;

    const newNotifications: Notification[] = [];
    
    if (pendingLeaves > 0) {
      newNotifications.push({
        id: '1',
        type: 'leave',
        title: 'Pending Leave Requests',
        message: `${pendingLeaves} leave request(s) awaiting approval`,
        time: 'Just now',
        read: false,
        link: '/dashboard/hr'
      });
    }
    if (overdueInvoices > 0) {
      newNotifications.push({
        id: '2',
        type: 'invoice',
        title: 'Overdue Invoices',
        message: `${overdueInvoices} invoice(s) are overdue`,
        time: 'Just now',
        read: false,
        link: '/dashboard/finance'
      });
    }
    if (lowStock > 0) {
      newNotifications.push({
        id: '3',
        type: 'inventory',
        title: 'Low Stock Alert',
        message: `${lowStock} item(s) running low on stock`,
        time: 'Just now',
        read: false,
        link: '/dashboard/supply-chain'
      });
    }
    if (newLeads > 0) {
      newNotifications.push({
        id: '4',
        type: 'lead',
        title: 'New Leads',
        message: `${newLeads} new lead(s) to follow up`,
        time: 'Just now',
        read: false,
        link: '/dashboard/crm'
      });
    }

    setNotifications(newNotifications);
  }, [leaveRequests, invoices, inventory, leads]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeTrackerActive && timerStart) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - timerStart.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeTrackerActive, timerStart]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimeTracker = () => {
    if (timeTrackerActive) {
      setTimeTrackerActive(false);
      toast.success(`Time tracked: ${formatTime(elapsedTime)}`);
    } else {
      setTimerStart(new Date());
      setTimeTrackerActive(true);
      toast.success('Time tracker started');
    }
  };

  const getUserModules = () => {
    if (user?.modules && user.modules.length > 0) {
      return user.modules;
    }
    const userRole = user?.role || 'employee';
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    
    if (userRole === 'admin') {
      return ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'automations', 'settings'];
    }
    return permissions;
  };

  const userModules = getUserModules();

  const MODULE_CONFIG = [
    { 
      id: 'hr', 
      name: 'HR', 
      icon: Users, 
      gradient: 'from-blue-500 to-cyan-500',
      hasSubMenu: true,
      subItems: [
        { label: 'Employees', link: '/dashboard/hr', icon: Users },
        { label: 'Departments', link: '/dashboard/hr', icon: Building2 },
        { label: 'Leave Requests', link: '/dashboard/hr', icon: Calendar },
        { label: 'Attendance', link: '/dashboard/hr', icon: Clock },
        { label: 'Contracts', link: '/dashboard/hr', icon: FileCheck },
        { label: 'Analytics', link: '/dashboard/hr', icon: BarChart3 },
      ]
    },
    { 
      id: 'finance', 
      name: 'Finance', 
      icon: Wallet, 
      gradient: 'from-emerald-500 to-teal-500',
      hasSubMenu: true,
      subItems: [
        { label: 'Invoices', link: '/dashboard/finance', icon: FileText },
        { label: 'Quotations', link: '/dashboard/finance', icon: FileText },
        { label: 'Receipts', link: '/dashboard/finance', icon: Receipt },
        { label: 'Sales', link: '/dashboard/finance', icon: TrendingUp },
        { label: 'Products', link: '/dashboard/finance', icon: PackageIcon },
        { label: 'Services', link: '/dashboard/finance', icon: BriefcaseIcon },
        { label: 'Expenses', link: '/dashboard/finance', icon: CreditCard },
        { label: 'Analytics', link: '/dashboard/finance', icon: BarChart3 },
      ]
    },
    { 
      id: 'crm', 
      name: 'CRM', 
      icon: Target, 
      gradient: 'from-violet-500 to-purple-500',
      hasSubMenu: true,
      subItems: [
        { label: 'Leads', link: '/dashboard/crm', icon: Users },
        { label: 'Customers', link: '/dashboard/crm', icon: Handshake },
        { label: 'Deals', link: '/dashboard/crm', icon: TrendingUp },
        { label: 'Activities', link: '/dashboard/crm', icon: Activity },
        { label: 'Social Media', link: '/dashboard/crm', icon: MessageSquare },
        { label: 'Analytics', link: '/dashboard/crm', icon: BarChart3 },
      ]
    },
    { 
      id: 'payroll', 
      name: 'Payroll', 
      icon: Calculator, 
      gradient: 'from-orange-500 to-amber-500',
      hasSubMenu: true,
      subItems: [
        { label: 'Salaries', link: '/dashboard/payroll', icon: DollarSign },
        { label: 'Payslips', link: '/dashboard/payroll', icon: FileText },
        { label: 'Tax Config', link: '/dashboard/payroll', icon: Calculator },
        { label: 'Run Payroll', link: '/dashboard/payroll', icon: Play },
        { label: 'Analytics', link: '/dashboard/payroll', icon: BarChart3 },
      ]
    },
    { 
      id: 'productivity', 
      name: 'Productivity', 
      icon: Zap, 
      gradient: 'from-cyan-500 to-blue-500',
      hasSubMenu: true,
      subItems: [
        { label: 'Tasks', link: '/dashboard/productivity', icon: CheckCircle },
        { label: 'Projects', link: '/dashboard/productivity', icon: BriefcaseIcon },
        { label: 'Calendar', link: '/dashboard/productivity', icon: Calendar },
        { label: 'Meetings', link: '/dashboard/productivity', icon: Video },
        { label: 'Time Tracker', link: '/dashboard/productivity', icon: Timer },
      ]
    },
    { 
      id: 'supply-chain', 
      name: 'Supply Chain', 
      icon: Truck, 
      gradient: 'from-indigo-500 to-violet-500',
      hasSubMenu: true,
      subItems: [
        { label: 'Inventory', link: '/dashboard/supply-chain', icon: Package },
        { label: 'Vendors', link: '/dashboard/supply-chain', icon: Handshake },
        { label: 'Orders', link: '/dashboard/supply-chain', icon: FileText },
        { label: 'Analytics', link: '/dashboard/supply-chain', icon: BarChart3 },
      ]
    },
  ];

  const stats = {
    totalEmployees: employees?.length || 0,
    totalRevenue: invoices?.filter((i: any) => i.status === 'paid')?.reduce((sum: number, i: any) => sum + (i.total || 0), 0) || 0,
    totalInvoices: invoices?.length || 0,
    totalCustomers: customers?.length || 0,
    pendingPayroll: payroll?.filter((p: any) => p.status === 'pending')?.length || 0,
    lowStockItems: inventory?.filter((p: any) => p.quantity < p.minQuantity)?.length || 0,
    pendingLeaves: leaveRequests?.filter((l: any) => l.status === 'pending')?.length || 0,
    newLeads: leads?.filter((l: any) => l.status === 'new')?.length || 0,
  };

  const recentInvoices = invoices?.slice(0, 5) || [];
  const recentEmployees = employees?.slice(0, 5) || [];
  const pendingApprovals = [
    ...(leaveRequests?.filter((l: any) => l.status === 'pending')?.map((l: any) => ({ type: 'leave', ...l })) || []),
    ...(leads?.filter((l: any) => l.status === 'new')?.map((l: any) => ({ type: 'lead', ...l })) || []),
  ].slice(0, 5);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    router.push('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="space-y-4">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {isFirstLogin 
                ? `Welcome to LemurSystem, ${user?.firstName || 'User'}!` 
                : `Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, ${user?.firstName || 'User'}!`}
            </h1>
            <p className="text-white/70 text-sm">
              {user?.organizationName || 'Your Organization'} • {user?.industry ? user.industry.charAt(0).toUpperCase() + user.industry.slice(1) : 'General'}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-lg text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-lg text-sm font-medium">
              {currencySymbol} {user?.currency || 'USD'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center`}>
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalEmployees}</p>
          <p className="text-xs text-white/40 uppercase tracking-wider">Employees</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center`}>
              <Receipt className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalInvoices}</p>
          <p className="text-xs text-white/40 uppercase tracking-wider">Invoices</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center`}>
              <Building2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalCustomers}</p>
          <p className="text-xs text-white/40 uppercase tracking-wider">Customers</p>
        </div>
      </div>

      {/* Time Tracker & Notifications Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Time Tracker */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
              <Timer className="w-4 h-4 text-accent" />
              Time Tracker
            </h3>
            <button
              onClick={toggleTimeTracker}
              className={`p-2 rounded-lg transition-all ${timeTrackerActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'}`}
            >
              {timeTrackerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-3xl font-bold text-white font-mono">{formatTime(elapsedTime)}</p>
          <p className="text-xs text-white/40 mt-1">{timeTrackerActive ? 'Tracking time...' : 'Click play to start'}</p>
        </div>

        {/* Notifications */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
              <BellDot className="w-4 h-4 text-accent" />
              Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-accent text-white text-xs rounded-full">{unreadCount}</span>
              )}
            </h3>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
            >
              {showNotifications ? <Eye className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            </button>
          </div>
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.slice(0, 2).map((notif) => (
                <Link
                  key={notif.id}
                  href={notif.link || '#'}
                  className={`block p-2 rounded-lg ${notif.read ? 'bg-white/5' : 'bg-accent/10 border border-accent/20'} hover:bg-white/5 transition-colors`}
                >
                  <p className="text-sm text-white font-medium">{notif.title}</p>
                  <p className="text-xs text-white/40">{notif.message}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/40">No new notifications</p>
          )}
        </div>

        {/* Quick Currency Info */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-accent" />
            Currency Settings
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-lg font-bold">
              {currencySymbol}
            </span>
            <div>
              <p className="text-white font-medium">{currency}</p>
              <p className="text-xs text-white/40">Default currency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      {(stats.pendingLeaves > 0 || stats.lowStockItems > 0 || stats.newLeads > 0) && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-amber-400 uppercase tracking-wider">Action Required</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.pendingLeaves > 0 && (
              <Link href="/dashboard/hr" className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl text-amber-300 text-sm font-medium transition-colors flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {stats.pendingLeaves} Leave Requests
              </Link>
            )}
            {stats.lowStockItems > 0 && (
              <Link href="/dashboard/supply-chain" className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl text-amber-300 text-sm font-medium transition-colors flex items-center gap-2">
                <PackageIcon className="w-4 h-4" />
                {stats.lowStockItems} Low Stock Items
              </Link>
            )}
            {stats.newLeads > 0 && (
              <Link href="/dashboard/crm" className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl text-amber-300 text-sm font-medium transition-colors flex items-center gap-2">
                <Target className="w-4 h-4" />
                {stats.newLeads} New Leads
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Recent Invoices</h3>
            <Link href="/dashboard/finance" className="text-xs text-accent hover:text-accent/80 font-medium transition-colors">
              View All
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentInvoices.length > 0 ? recentInvoices.map((invoice: any) => (
              <div key={invoice.id} className="px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-white/40">{invoice.customerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{currencySymbol}{(invoice.total || 0).toLocaleString()}</p>
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                    invoice.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                    invoice.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {invoice.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-white/40">
                <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No invoices yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Employees */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Recent Employees</h3>
            <Link href="/dashboard/hr" className="text-xs text-accent hover:text-accent/80 font-medium transition-colors">
              View All
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentEmployees.length > 0 ? recentEmployees.map((employee: any) => (
              <div key={employee.id} className="px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {employee.firstName?.[0] || '?'}{employee.lastName?.[0] || ''}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{employee.firstName} {employee.lastName}</p>
                    <p className="text-xs text-white/40">{employee.department || employee.position || 'Employee'}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400">
                  {(employee.status || 'active').toUpperCase()}
                </span>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-white/40">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No employees yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Pending Approvals</h3>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
              {pendingApprovals.length} Pending
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {pendingApprovals.map((item: any, index: number) => (
              <div key={index} className="px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${item.type === 'leave' ? 'bg-blue-500/20' : 'bg-violet-500/20'} rounded-lg flex items-center justify-center`}>
                    {item.type === 'leave' ? (
                      <Calendar className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Target className="w-5 h-5 text-violet-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{item.employeeName || item.name || 'Unknown'}</p>
                    <p className="text-xs text-white/40">{item.type === 'leave' ? `${item.type} - ${item.days || 1} days` : item.company || item.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-emerald-400 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
