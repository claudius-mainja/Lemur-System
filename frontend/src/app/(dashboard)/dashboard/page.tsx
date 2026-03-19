'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useDataStore } from '@/stores/data.store';
import Link from 'next/link';
import {
  Users, Wallet, Package, BarChart3, PiggyBank, DollarSign,
  Building2, TrendingUp, ArrowUpRight, ArrowDownRight, Clock,
  FileText, Receipt, AlertCircle, Target, Package as PackageIcon,
  Calculator, Briefcase, CreditCard, Truck, Zap, Shield,
  CheckCircle, XCircle, Calendar, Activity, Users2, FilePlus,
  Plus, ArrowRight, Eye, MoreHorizontal, Search, Bell,
  UserPlus, RefreshCw, Clock4, DollarSignIcon
} from 'lucide-react';

const MODULE_CARDS = [
  { id: 'hr', name: 'Human Resources', icon: Users, color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200', description: 'Manage employees, departments, and attendance' },
  { id: 'finance', name: 'Finance', icon: Wallet, color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', borderColor: 'border-emerald-200', description: 'Invoices, expenses, and financial reports' },
  { id: 'crm', name: 'CRM', icon: Target, color: 'bg-violet-500', bgColor: 'bg-violet-50', textColor: 'text-violet-600', borderColor: 'border-violet-200', description: 'Customer relationships and lead tracking' },
  { id: 'payroll', name: 'Payroll', icon: Calculator, color: 'bg-orange-500', bgColor: 'bg-orange-50', textColor: 'text-orange-600', borderColor: 'border-orange-200', description: 'Salary processing and payslips' },
  { id: 'productivity', name: 'Productivity', icon: Zap, color: 'bg-cyan-500', bgColor: 'bg-cyan-50', textColor: 'text-cyan-600', borderColor: 'border-cyan-200', description: 'Tasks, projects, and collaboration' },
  { id: 'supply-chain', name: 'Supply Chain', icon: Truck, color: 'bg-indigo-500', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600', borderColor: 'border-indigo-200', description: 'Inventory and vendor management' },
  { id: 'automations', name: 'Automations', icon: Clock4, color: 'bg-pink-500', bgColor: 'bg-pink-50', textColor: 'text-pink-600', borderColor: 'border-pink-200', description: 'Workflow automation and triggers' },
  { id: 'settings', name: 'Settings', icon: Shield, color: 'bg-slate-500', bgColor: 'bg-slate-50', textColor: 'text-slate-600', borderColor: 'border-slate-200', description: 'User management and configuration' },
];

const QUICK_ACTIONS = [
  { name: 'Add Employee', icon: UserPlus, color: 'bg-blue-600 hover:bg-blue-700', module: 'hr' },
  { name: 'Create Invoice', icon: FilePlus, color: 'bg-emerald-600 hover:bg-emerald-700', module: 'finance' },
  { name: 'Add Lead', icon: Target, color: 'bg-violet-600 hover:bg-violet-700', module: 'crm' },
  { name: 'Process Payroll', icon: Calculator, color: 'bg-orange-600 hover:bg-orange-700', module: 'payroll' },
  { name: 'Create Task', icon: Plus, color: 'bg-cyan-600 hover:bg-cyan-700', module: 'productivity' },
  { name: 'Add Inventory', icon: PackageIcon, color: 'bg-indigo-600 hover:bg-indigo-700', module: 'supply-chain' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { employees, invoices, inventory, customers, leaveRequests, payroll, vendors, leads } = useDataStore();

  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : 'U';
  
  const getCurrencySymbol = (currency?: string) => {
    const symbols: Record<string, string> = { ZAR: 'R', USD: '$', EUR: '€', GBP: '£' };
    return symbols[currency || 'USD'] || '$';
  };
  const currencySymbol = getCurrencySymbol(user?.currency);

  const stats = {
    totalEmployees: employees?.length || 12,
    totalRevenue: invoices?.filter((i: any) => i.status === 'paid')?.reduce((sum: number, i: any) => sum + (i.total || 0), 0) || 45850,
    totalInvoices: invoices?.length || 48,
    totalCustomers: customers?.length || 156,
    pendingPayroll: payroll?.filter((p: any) => p.status === 'pending')?.length || 3,
    lowStockItems: inventory?.filter((p: any) => p.quantity < p.minQuantity)?.length || 5,
    pendingLeaves: leaveRequests?.filter((l: any) => l.status === 'pending')?.length || 3,
    newLeads: leads?.filter((l: any) => l.status === 'new')?.length || 8,
    activeTasks: 12,
  };

  const recentInvoices = invoices?.slice(0, 5) || [];
  const recentEmployees = employees?.slice(0, 5) || [];
  const pendingApprovals = [
    ...(leaveRequests?.filter((l: any) => l.status === 'pending')?.map((l: any) => ({ type: 'leave', ...l })) || []),
    ...(leads?.filter((l: any) => l.status === 'new')?.map((l: any) => ({ type: 'lead', ...l })) || []),
  ].slice(0, 5);

  const getModuleUrl = (module: string) => `/dashboard/${module}`;

  const availableModules = MODULE_CARDS.filter(card => {
    if (card.id === 'settings' || card.id === 'automations') return true;
    if (user?.role === 'admin') return true;
    return user?.modules?.includes(card.id);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': case 'approved': case 'active': case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'pending': case 'in_progress': case 'sent': return 'bg-amber-100 text-amber-700';
      case 'overdue': case 'rejected': case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.firstName || 'Admin'}!</h1>
            <p className="text-emerald-100 text-sm">Here's what's happening with your business today</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="flex items-center text-emerald-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
          <p className="text-sm text-gray-500 mt-1">Total Employees</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <DollarSignIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="flex items-center text-emerald-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +24%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{currencySymbol}{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-violet-600" />
            </div>
            <span className="flex items-center text-amber-600 text-sm font-medium">
              <ArrowDownRight className="w-4 h-4 mr-1" /> -5%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
          <p className="text-sm text-gray-500 mt-1">Total Invoices</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
            <span className="flex items-center text-emerald-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +18%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
          <p className="text-sm text-gray-500 mt-1">Total Customers</p>
        </div>
      </div>

      {/* Alert Cards */}
      {(stats.pendingLeaves > 0 || stats.lowStockItems > 0 || stats.newLeads > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">Action Required</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {stats.pendingLeaves > 0 && (
              <Link href="/dashboard/hr" className="px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-xl text-amber-800 text-sm font-medium transition-colors flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {stats.pendingLeaves} Leave Requests Pending
              </Link>
            )}
            {stats.lowStockItems > 0 && (
              <Link href="/dashboard/supply-chain" className="px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-xl text-amber-800 text-sm font-medium transition-colors flex items-center gap-2">
                <PackageIcon className="w-4 h-4" />
                {stats.lowStockItems} Low Stock Items
              </Link>
            )}
            {stats.newLeads > 0 && (
              <Link href="/dashboard/crm" className="px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-xl text-amber-800 text-sm font-medium transition-colors flex items-center gap-2">
                <Target className="w-4 h-4" />
                {stats.newLeads} New Leads
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.name}
              href={getModuleUrl(action.module)}
              className={`flex flex-col items-center gap-2 p-4 ${action.color} text-white rounded-xl transition-all hover:scale-105 hover:shadow-lg`}
            >
              <action.icon className="w-6 h-6" />
              <span className="text-xs font-medium text-center">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableModules.map((module) => (
            <Link
              key={module.id}
              href={getModuleUrl(module.id)}
              className={`bg-white rounded-2xl border ${module.borderColor} p-5 hover:shadow-lg hover:scale-105 transition-all group`}
            >
              <div className={`w-14 h-14 ${module.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <module.icon className={`w-7 h-7 ${module.textColor}`} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{module.name}</h4>
              <p className="text-sm text-gray-500">{module.description}</p>
              <div className={`mt-4 flex items-center text-sm font-medium ${module.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                Open Module <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Invoices</h3>
            <Link href="/dashboard/finance" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentInvoices.length > 0 ? recentInvoices.map((invoice: any) => (
              <div key={invoice.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">{invoice.customerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{currencySymbol}{(invoice.total || 0).toLocaleString()}</p>
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-gray-500">
                <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No invoices yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Employees */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Employees</h3>
            <Link href="/dashboard/hr" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentEmployees.length > 0 ? recentEmployees.map((employee: any) => (
              <div key={employee.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {employee.firstName?.[0] || employee.first_name?.[0] || '?'}{employee.lastName?.[0] || employee.last_name?.[0] || ''}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{employee.firstName || employee.first_name} {employee.lastName || employee.last_name}</p>
                    <p className="text-xs text-gray-500">{employee.department || employee.position || 'Employee'}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(employee.status || 'active')}`}>
                  {(employee.status || 'active').toUpperCase()}
                </span>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No employees yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Pending Approvals</h3>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
              {pendingApprovals.length} Pending
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingApprovals.map((item: any, index: number) => (
              <div key={index} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${item.type === 'leave' ? 'bg-blue-100' : 'bg-violet-100'} rounded-lg flex items-center justify-center`}>
                    {item.type === 'leave' ? (
                      <Clock className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Target className="w-5 h-5 text-violet-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {item.employeeName || item.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.type === 'leave' ? `${item.type} - ${item.days || 1} days` : item.company || item.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg text-emerald-600 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 transition-colors">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Feed */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { icon: Users, iconColor: 'text-blue-600', bgColor: 'bg-blue-100', text: 'New employee John Smith added to Engineering', time: '2 hours ago' },
            { icon: Receipt, iconColor: 'text-emerald-600', bgColor: 'bg-emerald-100', text: 'Invoice INV-2024-001 marked as paid - $5,500', time: '4 hours ago' },
            { icon: Target, iconColor: 'text-violet-600', bgColor: 'bg-violet-100', text: 'New lead Global Trade Inc from LinkedIn', time: '6 hours ago' },
            { icon: Calculator, iconColor: 'text-orange-600', bgColor: 'bg-orange-100', text: 'Payroll for January 2024 processed', time: '1 day ago' },
            { icon: PackageIcon, iconColor: 'text-indigo-600', bgColor: 'bg-indigo-100', text: 'Low stock alert: Webcam HD (3 remaining)', time: '1 day ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`w-9 h-9 ${activity.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.text}</p>
                <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
