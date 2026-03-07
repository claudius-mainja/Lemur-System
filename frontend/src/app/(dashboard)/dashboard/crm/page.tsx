'use client';

import { useState } from 'react';
import { useDataStore, Customer, Lead } from '@/stores/data.store';
import { 
  BarChart3, Users, UserPlus, Plus, Search, MoreHorizontal, Phone, Mail, MapPin,
  TrendingUp, DollarSign, Star, Edit, Trash2, CheckCircle, XCircle, Clock,
  FileSpreadsheet, Eye, X, Printer, Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'customers' | 'leads' | 'analytics';

export default function CRMDashboard() {
  const { customers, leads, addCustomer, updateCustomer, addLead, updateLead, employees } = useDataStore();
  const [activeView, setActiveView] = useState<ViewTab>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showViewCustomer, setShowViewCustomer] = useState<Customer | null>(null);
  const [showViewLead, setShowViewLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalCustomers: customers.filter(c => c.status === 'customer').length,
    totalLeads: leads.length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    conversionRate: leads.length > 0 ? Math.round((leads.filter(l => l.status === 'won').length / leads.length) * 100) : 0,
  };

  const exportCustomersCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'City', 'Country', 'Status', 'Total Spent', 'Last Contact'];
    const rows = customers.map(c => [
      c.name, c.company, c.email, c.phone, c.city, c.country, c.status, c.totalSpent, c.lastContact
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Customers exported to CSV!');
  };

  const exportLeadsCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Source', 'Status', 'Value', 'Assigned To', 'Created'];
    const rows = leads.map(l => [
      l.name, l.company, l.email, l.phone, l.source, l.status, l.value, l.assignedTo, l.createdAt
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Leads exported to CSV!');
  };

  const printCustomerCard = (customer: Customer) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Customer Card - ${customer.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .card { border: 2px solid #333; border-radius: 10px; padding: 20px; max-width: 400px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
              .photo { width: 80px; height: 80px; background: #EC4899; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; margin: 0 auto 15px; }
              .name { font-size: 20px; font-weight: bold; text-align: center; }
              .company { font-size: 14px; color: #666; text-align: center; margin-bottom: 15px; }
              .info { margin: 8px 0; }
              .label { font-weight: bold; color: #666; font-size: 12px; }
              .status { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; margin-top: 10px; }
              .footer { text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ccc; font-size: 10px; color: #666; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <div class="photo">${customer.name[0]}</div>
                <div class="name">${customer.name}</div>
                <div class="company">${customer.company}</div>
                <span class="status" style="background: #d1fae5; color: #065f46;">${customer.status}</span>
              </div>
              <div class="info"><span class="label">Email:</span> ${customer.email}</div>
              <div class="info"><span class="label">Phone:</span> ${customer.phone}</div>
              <div class="info"><span class="label">Location:</span> ${customer.city}, ${customer.country}</div>
              <div class="info"><span class="label">Total Spent:</span> $${customer.totalSpent.toLocaleString()}</div>
              <div class="info"><span class="label">Source:</span> ${customer.source}</div>
              <div class="footer">LemurSystem CRM | Generated ${new Date().toLocaleDateString()}</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      customer: 'bg-green-100 text-green-700',
      prospect: 'bg-blue-100 text-blue-700',
      lead: 'bg-purple-100 text-purple-700',
      inactive: 'bg-slate-100 text-slate-700',
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-amber-100 text-amber-700',
      qualified: 'bg-purple-100 text-purple-700',
      proposal: 'bg-orange-100 text-orange-700',
      won: 'bg-green-100 text-green-700',
      lost: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const handleAddCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addCustomer({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      country: formData.get('country') as string,
      status: 'lead' as const,
      source: formData.get('source') as string,
      totalSpent: 0,
      lastContact: new Date().toISOString().split('T')[0],
      assignedTo: formData.get('assignedTo') as string,
    });
    setShowAddCustomer(false);
    toast.success('Customer added!');
  };

  const handleAddLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addLead({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      source: formData.get('source') as string,
      status: 'new' as const,
      value: parseFloat(formData.get('value') as string) || 0,
      assignedTo: formData.get('assignedTo') as string,
      notes: formData.get('notes') as string,
    });
    setShowAddLead(false);
    toast.success('Lead added!');
  };

  const handleUpdateLeadStatus = (id: string, status: string) => {
    updateLead(id, { status: status as any });
    toast.success(`Lead status updated to ${status}!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CRM</h1>
          <p className="text-slate-500">Manage customers, leads, and sales pipeline</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveView('customers')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'customers' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Customers
          </button>
          <button onClick={() => setActiveView('leads')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'leads' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Leads
          </button>
          <button onClick={() => setActiveView('analytics')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'analytics' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalCustomers}</p>
              <p className="text-sm text-slate-500">Customers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalLeads}</p>
              <p className="text-sm text-slate-500">Total Leads</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.conversionRate}%</p>
              <p className="text-sm text-slate-500">Conversion Rate</p>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'customers' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="customer">Customer</option>
                <option value="prospect">Prospect</option>
                <option value="lead">Lead</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={exportCustomersCSV} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Export
              </button>
              <button onClick={() => setShowAddCustomer(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Customer
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total Spent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-medium">
                          {customer.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.city}, {customer.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{customer.company}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <a href={`mailto:${customer.email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {customer.email}
                        </a>
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {customer.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">${customer.totalSpent.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setShowViewCustomer(customer)} className="p-1 hover:bg-slate-100 rounded" title="View">
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                        <button onClick={() => printCustomerCard(customer)} className="p-1 hover:bg-slate-100 rounded" title="Print Card">
                          <Printer className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'leads' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={exportLeadsCSV} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Export
              </button>
              <button onClick={() => setShowAddLead(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Lead
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lead</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                          {lead.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{lead.name}</p>
                          <p className="text-xs text-slate-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{lead.company}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">${lead.value.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{lead.source}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setShowViewLead(lead)} className="p-1 hover:bg-slate-100 rounded" title="View">
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                        {lead.status === 'new' && (
                          <button onClick={() => handleUpdateLeadStatus(lead.id, 'contacted')} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                            Contact
                          </button>
                        )}
                        {lead.status === 'contacted' && (
                          <button onClick={() => handleUpdateLeadStatus(lead.id, 'qualified')} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200">
                            Qualify
                          </button>
                        )}
                        {lead.status === 'qualified' && (
                          <button onClick={() => handleUpdateLeadStatus(lead.id, 'proposal')} className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200">
                            Proposal
                          </button>
                        )}
                        {lead.status === 'proposal' && (
                          <button onClick={() => handleUpdateLeadStatus(lead.id, 'won')} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">
                            Won
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Lead Sources</h3>
            <div className="space-y-3">
              {['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Advertisement'].map((source) => {
                const count = leads.filter(l => l.source === source).length;
                const percentage = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
                return (
                  <div key={source} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-600">{source}</span>
                        <span className="text-sm font-medium">{count} ({percentage}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                      </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Pipeline Overview</h3>
            <div className="space-y-3">
              {['new', 'contacted', 'qualified', 'proposal', 'won'].map((stage) => {
                const count = leads.filter(l => l.status === stage).length;
                const value = leads.filter(l => l.status === stage).reduce((sum, l) => sum + l.value, 0);
                const colors: Record<string, string> = {
                  new: 'bg-blue-500',
                  contacted: 'bg-amber-500',
                  qualified: 'bg-purple-500',
                  proposal: 'bg-orange-500',
                  won: 'bg-green-500',
                };
                return (
                  <div key={stage} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${colors[stage]}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">{stage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{count}</p>
                      <p className="text-xs text-slate-500">${value.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showViewCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Customer Details</h2>
              <button onClick={() => setShowViewCustomer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {showViewCustomer.name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{showViewCustomer.name}</h3>
                  <p className="text-slate-500">{showViewCustomer.company}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(showViewCustomer.status)}`}>
                    {showViewCustomer.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{showViewCustomer.email}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium">{showViewCustomer.phone}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="font-medium">{showViewCustomer.city}, {showViewCustomer.country}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Total Spent</p>
                  <p className="font-medium">${showViewCustomer.totalSpent.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Source</p>
                  <p className="font-medium">{showViewCustomer.source}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Last Contact</p>
                  <p className="font-medium">{showViewCustomer.lastContact}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => printCustomerCard(showViewCustomer)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" /> Print Card
                </button>
                <button onClick={() => setShowViewCustomer(null)} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">Add Customer</h2>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input name="name" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input name="email" type="email" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input name="phone" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <input name="company" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                  <select name="source" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Advertisement">Advertisement</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input name="city" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                  <input name="country" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input name="address" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned To</label>
                <select name="assignedTo" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                  {employees.map(e => <option key={e.id} value={`${e.firstName} ${e.lastName}`}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddCustomer(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Add Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">Add Lead</h2>
            </div>
            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input name="name" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input name="email" type="email" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input name="phone" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <input name="company" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lead Value</label>
                  <input name="value" type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                  <select name="source" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Advertisement">Advertisement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assigned To</label>
                  <select name="assignedTo" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                    {employees.map(e => <option key={e.id} value={`${e.firstName} ${e.lastName}`}>{e.firstName} {e.lastName}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea name="notes" rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddLead(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Add Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
