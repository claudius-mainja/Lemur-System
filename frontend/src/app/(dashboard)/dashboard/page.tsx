'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { hrApi } from '@/services/api';
import { 
  Users, Building2, Calendar, TrendingUp, DollarSign, Package, 
  FileText, Clock, CheckCircle, AlertCircle, ArrowRight, Bell, 
  Search, Settings, LogOut, Menu, X
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: TrendingUp },
  { name: 'Employees', href: '/dashboard/hr', icon: Users },
  { name: 'Finance', href: '/dashboard/finance', icon: DollarSign },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data: stats } = useQuery({
    queryKey: ['hr-stats'],
    queryFn: () => hrApi.getDashboardStats(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return null;
  }

  const statCards = [
    { 
      title: 'Total Employees', 
      value: stats?.data?.totalEmployees || 0, 
      icon: Users, 
      color: 'bg-gradient-to-br from-blue-500 to-blue-700',
      change: '+12%'
    },
    { 
      title: 'Departments', 
      value: stats?.data?.departments || 0, 
      icon: Building2, 
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      change: '+3'
    },
    { 
      title: 'Pending Leaves', 
      value: stats?.data?.pendingLeaves || 0, 
      icon: Calendar, 
      color: 'bg-gradient-to-br from-amber-500 to-yellow-600',
      change: '-5%'
    },
    { 
      title: 'New Hires', 
      value: 8, 
      icon: TrendingUp, 
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      change: '+25%'
    },
  ];

  const recentActivities = [
    { type: 'employee', message: 'New employee John Doe added', time: '2 hours ago', icon: Users },
    { type: 'leave', message: 'Leave request approved for Jane Smith', time: '4 hours ago', icon: Calendar },
    { type: 'payroll', message: 'Payroll for January processed', time: '1 day ago', icon: DollarSign },
    { type: 'inventory', message: 'Low stock alert: Office Supplies', time: '2 days ago', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
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
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="font-bold text-lg hidden sm:block">LemurSystem</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 lg:ml-64 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Welcome back, {user?.firstName}!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-500 text-sm font-medium">{card.change}</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{card.value}</h3>
                <p className="text-slate-500 text-sm">{card.title}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Recent Activities</h2>
                <button className="text-blue-600 text-sm font-medium flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <activity.icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 truncate">{activity.message}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Add Employee', icon: Users, href: '/dashboard/hr/employees/new' },
                  { name: 'Create Invoice', icon: DollarSign, href: '/dashboard/finance/invoices/new' },
                  { name: 'Leave Request', icon: Calendar, href: '/dashboard/hr/leave/new' },
                  { name: 'New Task', icon: CheckCircle, href: '/dashboard/tasks/new' },
                ].map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    className="flex flex-col items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                      <action.icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
