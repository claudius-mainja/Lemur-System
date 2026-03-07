'use client';

import { useState } from 'react';
import { useDataStore, Invoice, InvoiceItem } from '@/stores/data.store';
import { 
  Wallet, FileText, Plus, Search, MoreHorizontal, Download, Send,
  CheckCircle, Clock, XCircle, DollarSign, TrendingUp, TrendingDown,
  Edit, Trash2, Eye, CreditCard, Building2, FileSpreadsheet, Printer, X
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'invoices' | 'accounts' | 'reports';

export default function FinanceDashboard() {
  const { invoices, customers, addInvoice, updateInvoice, settings } = useDataStore();
  const [activeView, setActiveView] = useState<ViewTab>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showViewInvoice, setShowViewInvoice] = useState<Invoice | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
    pendingAmount: invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.total, 0),
    overdueAmount: invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0),
    totalInvoices: invoices.length,
  };

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...invoiceItems];
    (newItems[index] as any)[field] = value;
    newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    setInvoiceItems(newItems);
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const calculateTax = () => calculateSubtotal() * (settings.taxRate / 100);
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const generateInvoicePDF = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
              .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
              .company { font-size: 24px; font-weight: bold; }
              .invoice-title { font-size: 32px; color: #4F46E5; }
              .invoice-number { font-size: 14px; color: #666; margin-top: 5px; }
              .dates { text-align: right; }
              .bill-to { margin-bottom: 30px; }
              .bill-to h3 { font-size: 14px; color: #666; margin-bottom: 5px; }
              table { width: 100%; border-collapse: collapse; margin: 30px 0; }
              th { background: #f3f4f6; padding: 12px; text-align: left; font-size: 12px; color: #666; text-transform: uppercase; }
              td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
              .text-right { text-align: right; }
              .totals { margin-top: 20px; }
              .totals .row { display: flex; justify-content: flex-end; padding: 5px 0; }
              .totals .label { width: 150px; text-align: right; color: #666; }
              .totals .value { width: 150px; text-align: right; font-weight: bold; }
              .totals .total { font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
              .status { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
              .status-paid { background: #d1fae5; color: #065f46; }
              .status-sent { background: #dbeafe; color: #1e40af; }
              .status-overdue { background: #fee2e2; color: #991b1b; }
              .status-draft { background: #f3f4f6; color: #374151; }
              .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="company">${settings.companyName}</div>
                <div style="color: #666; font-size: 14px;">${settings.companyEmail}</div>
                <div style="color: #666; font-size: 14px;">${settings.companyPhone}</div>
                <div style="color: #666; font-size: 14px;">${settings.companyAddress}</div>
              </div>
              <div>
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-number">${invoice.invoiceNumber}</div>
                <span class="status status-${invoice.status}">${invoice.status}</span>
              </div>
            </div>
            
            <div class="bill-to">
              <h3>Bill To:</h3>
              <div style="font-weight: bold;">${invoice.customerName}</div>
              <div style="color: #666;">${invoice.customerEmail}</div>
            </div>

            <div class="dates">
              <div><strong>Issue Date:</strong> ${invoice.issueDate}</div>
              <div><strong>Due Date:</strong> ${invoice.dueDate}</div>
              ${invoice.paidDate ? `<div><strong>Paid Date:</strong> ${invoice.paidDate}</div>` : ''}
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="text-right">Quantity</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">$${item.unitPrice.toFixed(2)}</td>
                    <td class="text-right">$${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div class="row">
                <span class="label">Subtotal:</span>
                <span class="value">$${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div class="row">
                <span class="label">Tax (${settings.taxRate}%):</span>
                <span class="value">$${invoice.tax.toFixed(2)}</span>
              </div>
              <div class="row total">
                <span class="label">Total:</span>
                <span class="value">$${invoice.total.toFixed(2)}</span>
              </div>
            </div>

            ${invoice.notes ? `<div style="margin-top: 30px;"><strong>Notes:</strong><p>${invoice.notes}</p></div>` : ''}

            <div class="footer">
              <p>Thank you for your business!</p>
              <p>Generated by LemurSystem ERP | ${new Date().toLocaleDateString()}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    toast.success('Invoice PDF generated!');
  };

  const exportInvoicesCSV = () => {
    const headers = ['Invoice #', 'Customer', 'Amount', 'Issue Date', 'Due Date', 'Status', 'Paid Date'];
    const rows = invoices.map(inv => [
      inv.invoiceNumber, inv.customerName, inv.total, inv.issueDate, inv.dueDate, inv.status, inv.paidDate || '-'
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Invoices exported to CSV!');
  };

  const handleCreateInvoice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const customer = customers.find(c => c.id === formData.get('customerId'));
    
    const newInvoice = {
      invoiceNumber: `INV-${Date.now()}`,
      customerId: formData.get('customerId') as string,
      customerName: customer?.name || '',
      customerEmail: customer?.email || '',
      items: invoiceItems.filter(i => i.description),
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      status: 'draft' as const,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: formData.get('dueDate') as string,
    };
    
    addInvoice(newInvoice);
    setShowCreateInvoice(false);
    setInvoiceItems([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    toast.success('Invoice created successfully!');
  };

  const handleSendInvoice = (id: string) => {
    updateInvoice(id, { status: 'sent' });
    toast.success('Invoice sent to customer!');
  };

  const handleMarkPaid = (id: string) => {
    updateInvoice(id, { 
      status: 'paid', 
      paidDate: new Date().toISOString().split('T')[0] 
    });
    toast.success('Invoice marked as paid!');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'sent': return 'bg-blue-100 text-blue-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance</h1>
          <p className="text-slate-500">Manage invoices, accounts, and financial reports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveView('invoices')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'invoices' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Invoices
          </button>
          <button onClick={() => setActiveView('accounts')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'accounts' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Accounts
          </button>
          <button onClick={() => setActiveView('reports')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'reports' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">${stats.pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">${stats.overdueAmount.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Overdue</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalInvoices}</p>
              <p className="text-sm text-slate-500">Total Invoices</p>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'invoices' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
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
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={exportInvoicesCSV} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Export CSV
              </button>
              <button onClick={() => setShowCreateInvoice(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create Invoice
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Invoice #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Issue Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{invoice.invoiceNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{invoice.customerName}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">${invoice.total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{invoice.issueDate}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{invoice.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setShowViewInvoice(invoice)} className="p-1 hover:bg-slate-100 rounded" title="View">
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                        <button onClick={() => generateInvoicePDF(invoice)} className="p-1 hover:bg-slate-100 rounded" title="Print/PDF">
                          <Printer className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded" title="Download">
                          <Download className="w-4 h-4 text-slate-400" />
                        </button>
                        {invoice.status === 'draft' && (
                          <button onClick={() => handleSendInvoice(invoice.id)} className="p-1 hover:bg-blue-50 rounded" title="Send">
                            <Send className="w-4 h-4 text-blue-600" />
                          </button>
                        )}
                        {invoice.status === 'sent' && (
                          <button onClick={() => handleMarkPaid(invoice.id)} className="p-1 hover:bg-green-50 rounded" title="Mark Paid">
                            <CheckCircle className="w-4 h-4 text-green-600" />
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

      {activeView === 'accounts' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Accounts Receivable</h3>
          <div className="space-y-4">
            {customers.filter(c => c.status === 'customer').map((customer) => {
              const customerInvoices = invoices.filter(i => i.customerId === customer.id && i.status !== 'paid');
              const totalDue = customerInvoices.reduce((sum, i) => sum + i.total, 0);
              return (
                <div key={customer.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {customer.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{customer.name}</p>
                      <p className="text-sm text-slate-500">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">${totalDue.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">{customerInvoices.length} invoice(s)</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeView === 'reports' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-700 mb-2">Revenue by Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Paid</span>
                  <span className="font-medium text-green-600">${stats.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pending</span>
                  <span className="font-medium text-blue-600">${stats.pendingAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Overdue</span>
                  <span className="font-medium text-red-600">${stats.overdueAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-700 mb-2">Invoice Statistics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Invoices</span>
                  <span className="font-medium">{stats.totalInvoices}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Paid</span>
                  <span className="font-medium text-green-600">{invoices.filter(i => i.status === 'paid').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Collection Rate</span>
                  <span className="font-medium">{stats.totalInvoices > 0 ? Math.round((stats.totalRevenue / (stats.totalRevenue + stats.pendingAmount + stats.overdueAmount)) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Create Invoice</h2>
              <button onClick={() => setShowCreateInvoice(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
                  <select name="customerId" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input name="dueDate" type="date" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Invoice Items</label>
                <div className="space-y-2">
                  {invoiceItems.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-28 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                      />
                      <div className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-right">
                        ${item.total.toFixed(2)}
                      </div>
                      <button type="button" onClick={() => removeInvoiceItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addInvoiceItem} className="mt-2 text-sm text-primary hover:text-blue-700 font-medium">
                  + Add Item
                </button>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax ({settings.taxRate}%)</span>
                      <span className="font-medium">${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateInvoice(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Create Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Invoice {showViewInvoice.invoiceNumber}</h2>
              <button onClick={() => setShowViewInvoice(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-6">
                <div>
                  <p className="font-medium text-slate-900">{showViewInvoice.customerName}</p>
                  <p className="text-sm text-slate-500">{showViewInvoice.customerEmail}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(showViewInvoice.status)}`}>
                    {showViewInvoice.status}
                  </span>
                  <p className="text-sm text-slate-500 mt-1">Issued: {showViewInvoice.issueDate}</p>
                  <p className="text-sm text-slate-500">Due: {showViewInvoice.dueDate}</p>
                </div>
              </div>

              <table className="w-full mb-6">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Item</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Qty</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Price</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {showViewInvoice.items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-sm">{item.description}</td>
                      <td className="px-3 py-2 text-sm text-right">{item.quantity}</td>
                      <td className="px-3 py-2 text-sm text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-3 py-2 text-sm text-right">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-end">
                  <div className="w-48 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span>${showViewInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax</span>
                      <span>${showViewInvoice.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${showViewInvoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button onClick={() => generateInvoicePDF(showViewInvoice)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" /> Print / PDF
                </button>
                {showViewInvoice.status === 'draft' && (
                  <button onClick={() => { handleSendInvoice(showViewInvoice.id); setShowViewInvoice(null); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Send Invoice
                  </button>
                )}
                {showViewInvoice.status === 'sent' && (
                  <button onClick={() => { handleMarkPaid(showViewInvoice.id); setShowViewInvoice(null); }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Mark as Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
