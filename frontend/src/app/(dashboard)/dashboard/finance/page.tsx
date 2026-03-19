'use client';

import { useState, useEffect, useCallback } from 'react';
import { financeApi } from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';
import { useDataStore } from '@/stores/data.store';
import { 
  Wallet, FileText, Plus, Search, MoreHorizontal, Download, Send,
  CheckCircle, Clock, XCircle, DollarSign, TrendingUp, TrendingDown,
  Edit, Trash2, Eye, CreditCard, Building2, FileSpreadsheet, Printer, X,
  Receipt, Users, Package, BarChart3, PieChart, FilePlus, Save, Mail,
  ArrowUpRight, ArrowDownRight, Calendar, Filter, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'dashboard' | 'invoices' | 'quotations' | 'customers' | 'products' | 'receipts' | 'sales' | 'expenses' | 'reports';

interface DashboardStats {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  totalInvoices: number;
  totalCustomers: number;
  totalProducts: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
  type: string;
  isActive: boolean;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  type: string;
  category?: string;
  unitPrice: number;
  unit?: string;
  costPrice: number;
  quantityInStock: number;
  isActive: boolean;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  type: string;
  status: string;
  customerName: string;
  customerEmail?: string;
  items: any[];
  subtotal: number;
  taxAmount: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  status: string;
  customerName: string;
  customerEmail?: string;
  items: any[];
  subtotal: number;
  taxAmount: number;
  total: number;
  issueDate: string;
  validUntil: string;
}

interface Receipt {
  id: string;
  receiptNumber: string;
  customerName: string;
  amount: number;
  receiptDate: string;
  paymentMethod?: string;
  notes?: string;
}

interface Expense {
  id: string;
  expenseNumber: string;
  category: string;
  description: string;
  amount: number;
  expenseDate: string;
  status: string;
  vendor?: string;
}

interface Sale {
  id: string;
  saleNumber: string;
  customerName: string;
  items: any[];
  subtotal: number;
  total: number;
  saleDate: string;
}

export default function FinanceDashboard() {
  const { invoices: storeInvoices, customers: storeCustomers, payroll: storePayroll, addInvoice, updateInvoice, addCustomer } = useDataStore();
  const [activeView, setActiveView] = useState<ViewTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    totalInvoices: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  
  // Data states
  const [invoices, setInvoices] = useState(storeInvoices as unknown as Invoice[]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [customers, setCustomers] = useState(storeCustomers as unknown as Customer[]);
  const [products, setProducts] = useState<Product[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Modal states
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreateQuotation, setShowCreateQuotation] = useState(false);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showCreateReceipt, setShowCreateReceipt] = useState(false);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showViewInvoice, setShowViewInvoice] = useState<Invoice | null>(null);
  const [showViewQuotation, setShowViewQuotation] = useState<Quotation | null>(null);

  // Form states
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const organizationId = useAuthStore.getState().user?.organization_id;

  const loadDashboardStats = useCallback(async () => {
    try {
      const response = await financeApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  const loadInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.getInvoices(1, 50, filterStatus === 'all' ? undefined : filterStatus);
      setInvoices(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  const loadQuotations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.getQuotations(1, 50);
      setQuotations(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load quotations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.getCustomers(1, 50);
      setCustomers(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.getProducts(1, 50);
      setProducts(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadReceipts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.getReceipts(1, 50);
      setReceipts(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load receipts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.getSales(1, 50);
      setSales(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load sales:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.getExpenses(1, 50);
      setExpenses(response.data.data || response.data || []);
    } catch (error) {
      setExpenses(useDataStore.getState().invoices as unknown as Expense[]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Form states for creating new items
  const [newInvoice, setNewInvoice] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  });

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    serviceType: '',
  });

  const [newQuotation, setNewQuotation] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    type: 'product',
    unitPrice: 0,
    quantity: 0,
    minQuantity: 0,
  });

  const [newExpense, setNewExpense] = useState({
    description: '',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    status: 'pending',
  });

  // Create handlers
  const handleCreateInvoice = () => {
    const invoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      customerId: newInvoice.customerId || Math.random().toString(36).substring(2, 10),
      customerName: newInvoice.customerName,
      customerEmail: newInvoice.customerEmail,
      items: newInvoice.items.filter(i => i.description).map((item, index) => ({
        id: String(index + 1),
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
      subtotal: newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      tax: newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * 0.15), 0),
      total: newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * 1.15), 0),
      status: 'draft' as const,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: newInvoice.dueDate,
    };
    
    const { addInvoice } = useDataStore.getState();
    addInvoice(invoiceData);
    
    const newInvoiceObj = {
      id: Math.random().toString(36).substring(2, 15),
      ...invoiceData,
    };
    
    setInvoices([newInvoiceObj as any, ...invoices]);
    setShowCreateInvoice(false);
    setNewInvoice({
      customerId: '',
      customerName: '',
      customerEmail: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
    });
    toast.success('Invoice created successfully');
  };

  const handleCreateCustomer = () => {
    const customer = {
      id: Math.random().toString(36).substring(2, 15),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      company: newCustomer.company,
      address: newCustomer.address,
      city: newCustomer.city,
      country: newCustomer.country || 'ZA',
      serviceType: newCustomer.serviceType,
      type: newCustomer.serviceType || 'customer',
      status: 'customer' as const,
      source: 'manual',
      totalSpent: 0,
      lastContact: new Date().toISOString(),
      assignedTo: '',
    };
    
    const { addCustomer } = useDataStore.getState();
    addCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      address: customer.address,
      city: customer.city,
      country: customer.country,
      status: customer.status,
      source: customer.source,
      totalSpent: 0,
      lastContact: customer.lastContact,
      assignedTo: '',
    });
    
    setCustomers([...customers, customer as any]);
    setShowCreateCustomer(false);
    setNewCustomer({ name: '', company: '', email: '', phone: '', address: '', city: '', country: '', serviceType: '' });
    toast.success('Customer created successfully');
  };

  const handleCreateQuotation = () => {
    const quotation = {
      id: Math.random().toString(36).substring(2, 15),
      quotationNumber: `QUO-${Date.now()}`,
      customerId: newQuotation.customerId,
      customerName: newQuotation.customerName,
      customerEmail: newQuotation.customerEmail,
      items: newQuotation.items.map((item, index) => ({
        id: String(index + 1),
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
      subtotal: newQuotation.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      tax: newQuotation.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * 0.15), 0),
      total: newQuotation.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * 1.15), 0),
      status: 'pending' as const,
      issueDate: new Date().toISOString().split('T')[0],
      validUntil: newQuotation.validUntil,
    };
    
    setQuotations([quotation as any, ...quotations]);
    setShowCreateQuotation(false);
    setNewQuotation({
      customerId: '',
      customerName: '',
      customerEmail: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
    });
    toast.success('Quotation created successfully');
  };

  const handleCreateProduct = () => {
    const product = {
      id: Math.random().toString(36).substring(2, 15),
      name: newProduct.name,
      sku: newProduct.sku || `SKU-${Date.now()}`,
      description: newProduct.description,
      category: newProduct.category || 'General',
      quantity: newProduct.quantity,
      minQuantity: newProduct.minQuantity || 5,
      unitPrice: newProduct.unitPrice,
      totalValue: newProduct.quantity * newProduct.unitPrice,
      vendorId: '',
      vendorName: '',
      location: 'Warehouse A',
      lastUpdated: new Date().toISOString(),
      status: newProduct.quantity > newProduct.minQuantity ? 'in_stock' as const : 'low_stock' as const,
    };
    
    setProducts([...products, product as any]);
    setShowCreateProduct(false);
    setNewProduct({ name: '', sku: '', description: '', category: '', type: 'product', unitPrice: 0, quantity: 0, minQuantity: 0 });
    toast.success('Product created successfully');
  };

  const handleCreateExpense = () => {
    const expense = {
      id: Math.random().toString(36).substring(2, 15),
      expenseNumber: `EXP-${Date.now()}`,
      description: newExpense.description,
      category: newExpense.category || 'General',
      amount: newExpense.amount,
      date: newExpense.date,
      vendor: newExpense.vendor,
      status: newExpense.status as 'pending' | 'approved' | 'rejected',
      paymentMethod: 'bank_transfer',
    };
    
    setExpenses([expense as any, ...expenses]);
    setShowCreateExpense(false);
    setNewExpense({
      description: '',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      status: 'pending',
    });
    toast.success('Expense created successfully');
  };

  const addInvoiceItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }],
    });
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const items = [...newInvoice.items];
    items[index] = { ...items[index], [field]: value };
    items[index].total = items[index].quantity * items[index].unitPrice;
    setNewInvoice({ ...newInvoice, items });
  };

  const removeInvoiceItem = (index: number) => {
    setNewInvoice({
      ...newInvoice,
      items: newInvoice.items.filter((_, i) => i !== index),
    });
  };

  const addQuotationItem = () => {
    setNewQuotation({
      ...newQuotation,
      items: [...newQuotation.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }],
    });
  };

  const updateQuotationItem = (index: number, field: string, value: any) => {
    const items = [...newQuotation.items];
    items[index] = { ...items[index], [field]: value };
    items[index].total = items[index].quantity * items[index].unitPrice;
    setNewQuotation({ ...newQuotation, items });
  };

  const removeQuotationItem = (index: number) => {
    setNewQuotation({
      ...newQuotation,
      items: newQuotation.items.filter((_, i) => i !== index),
    });
  };

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  useEffect(() => {
    if (activeView === 'invoices') loadInvoices();
    if (activeView === 'quotations') loadQuotations();
    if (activeView === 'customers') loadCustomers();
    if (activeView === 'products') loadProducts();
    if (activeView === 'receipts') loadReceipts();
    if (activeView === 'sales') loadSales();
    if (activeView === 'expenses') loadExpenses();
  }, [activeView, loadInvoices, loadQuotations, loadCustomers, loadProducts, loadReceipts, loadSales, loadExpenses]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      sent: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
      overdue: 'bg-red-100 text-red-800',
      partial: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Dashboard View
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> From paid invoices
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.pendingAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-yellow-600 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> Awaiting payment
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue Amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.overdueAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> Requires attention
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalInvoices}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">All time</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => { setActiveView('invoices'); setShowCreateInvoice(true); }}
          className="bg-primary text-white p-4 rounded-xl flex items-center gap-3 hover:bg-primary/90 transition"
        >
          <FilePlus className="w-5 h-5" />
          <span>New Invoice</span>
        </button>
        <button
          onClick={() => { setActiveView('quotations'); setShowCreateQuotation(true); }}
          className="bg-white text-gray-700 p-4 rounded-xl flex items-center gap-3 border border-gray-200 hover:bg-gray-50 transition"
        >
          <FileText className="w-5 h-5" />
          <span>New Quotation</span>
        </button>
        <button
          onClick={() => { setActiveView('customers'); setShowCreateCustomer(true); }}
          className="bg-white text-gray-700 p-4 rounded-xl flex items-center gap-3 border border-gray-200 hover:bg-gray-50 transition"
        >
          <Users className="w-5 h-5" />
          <span>Add Customer</span>
        </button>
        <button
          onClick={() => { setActiveView('expenses'); setShowCreateExpense(true); }}
          className="bg-white text-gray-700 p-4 rounded-xl flex items-center gap-3 border border-gray-200 hover:bg-gray-50 transition"
        >
          <Receipt className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
          <button onClick={() => setActiveView('invoices')} className="text-primary text-sm hover:underline">
            View All
          </button>
        </div>
        <div className="p-6">
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Create your first invoice to start tracking payments from your customers.</p>
              <button
                onClick={() => setActiveView('invoices')}
                className="bg-primary text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-primary/90"
              >
                <Plus className="w-5 h-5" /> Create First Invoice
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Invoice #</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.slice(0, 5).map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray50">
                      <td className="py-3 text-sm font-medium">{invoice.invoiceNumber}</td>
                      <td className="py-3 text-sm">{invoice.customerName}</td>
                      <td className="py-3 text-sm font-medium">{formatCurrency(invoice.total)}</td>
                      <td className="py-3">{getStatusBadge(invoice.status)}</td>
                      <td className="py-3 text-sm text-gray-500">{formatDate(invoice.dueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Invoices View
  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Invoices</h2>
        <button
          onClick={() => setShowCreateInvoice(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100 bg-gray50">
                <th className="p-4 font-medium">Invoice #</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Issue Date</th>
                <th className="p-4 font-medium">Due Date</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Found</h3>
                      <p className="text-gray-500 mb-6">Create your first invoice to get started.</p>
                      <button
                        onClick={() => setShowCreateInvoice(true)}
                        className="bg-primary text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-primary/90"
                      >
                        <Plus className="w-5 h-5" /> Create Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray50">
                    <td className="p-4 text-sm font-medium">{invoice.invoiceNumber}</td>
                    <td className="p-4 text-sm">{invoice.customerName}</td>
                    <td className="p-4 text-sm font-medium">{formatCurrency(invoice.total)}</td>
                    <td className="p-4">{getStatusBadge(invoice.status)}</td>
                    <td className="p-4 text-sm text-gray-500">{formatDate(invoice.issueDate)}</td>
                    <td className="p-4 text-sm text-gray-500">{formatDate(invoice.dueDate)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => setShowViewInvoice(invoice)} className="p-1 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Download className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Mail className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Quotations View
  const renderQuotations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Quotations</h2>
        <button
          onClick={() => setShowCreateQuotation(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> New Quotation
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100 bg-gray50">
                <th className="p-4 font-medium">Quotation #</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Valid Until</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : quotations.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No quotations found</td></tr>
              ) : (
                quotations.map((quotation) => (
                  <tr key={quotation.id} className="border-b border-gray-50 hover:bg-gray50">
                    <td className="p-4 text-sm font-medium">{quotation.quotationNumber}</td>
                    <td className="p-4 text-sm">{quotation.customerName}</td>
                    <td className="p-4 text-sm font-medium">{formatCurrency(quotation.total)}</td>
                    <td className="p-4">{getStatusBadge(quotation.status)}</td>
                    <td className="p-4 text-sm text-gray-500">{formatDate(quotation.validUntil)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => setShowViewQuotation(quotation)} className="p-1 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <FileText className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Customers View
  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Customers</h2>
        <button
          onClick={() => setShowCreateCustomer(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100 bg-gray50">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Company</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No customers found</td></tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray50">
                    <td className="p-4 text-sm font-medium">{customer.name}</td>
                    <td className="p-4 text-sm text-gray-500">{customer.email}</td>
                    <td className="p-4 text-sm text-gray-500">{customer.phone}</td>
                    <td className="p-4 text-sm">{customer.company || '-'}</td>
                    <td className="p-4">{getStatusBadge(customer.isActive ? 'active' : 'inactive')}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Products View
  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Products & Services</h2>
        <button
          onClick={() => setShowCreateProduct(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100 bg-gray50">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Unit Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-500">No products found</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray50">
                    <td className="p-4 text-sm font-medium">{product.name}</td>
                    <td className="p-4 text-sm text-gray-500">{product.sku || '-'}</td>
                    <td className="p-4 text-sm">{product.type}</td>
                    <td className="p-4 text-sm text-gray-500">{product.category || '-'}</td>
                    <td className="p-4 text-sm font-medium">{formatCurrency(product.unitPrice)}</td>
                    <td className="p-4 text-sm">{product.quantityInStock}</td>
                    <td className="p-4">{getStatusBadge(product.isActive ? 'active' : 'inactive')}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Receipts View
  const renderReceipts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Receipts</h2>
        <button
          onClick={() => setShowCreateReceipt(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> New Receipt
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100 bg-gray50">
                <th className="p-4 font-medium">Receipt #</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Payment Method</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : receipts.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No receipts found</td></tr>
              ) : (
                receipts.map((receipt) => (
                  <tr key={receipt.id} className="border-b border-gray-50 hover:bg-gray50">
                    <td className="p-4 text-sm font-medium">{receipt.receiptNumber}</td>
                    <td className="p-4 text-sm">{receipt.customerName}</td>
                    <td className="p-4 text-sm font-medium">{formatCurrency(receipt.amount)}</td>
                    <td className="p-4 text-sm text-gray-500">{formatDate(receipt.receiptDate)}</td>
                    <td className="p-4 text-sm">{receipt.paymentMethod || '-'}</td>
                    <td className="p-4">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Sales View
  const renderSales = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Sales</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100 bg-gray50">
                <th className="p-4 font-medium">Sale #</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No sales found</td></tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-50 hover:bg-gray50">
                    <td className="p-4 text-sm font-medium">{sale.saleNumber}</td>
                    <td className="p-4 text-sm">{sale.customerName}</td>
                    <td className="p-4 text-sm font-medium">{formatCurrency(sale.total)}</td>
                    <td className="p-4 text-sm text-gray-500">{formatDate(sale.saleDate)}</td>
                    <td className="p-4">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Expenses View
  const renderExpenses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Expenses</h2>
        <button
          onClick={() => setShowCreateExpense(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100 bg-gray50">
                <th className="p-4 font-medium">Expense #</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">No expenses found</td></tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-50 hover:bg-gray50">
                    <td className="p-4 text-sm font-medium">{expense.expenseNumber}</td>
                    <td className="p-4 text-sm">{expense.category}</td>
                    <td className="p-4 text-sm">{expense.description}</td>
                    <td className="p-4 text-sm font-medium text-red-600">{formatCurrency(expense.amount)}</td>
                    <td className="p-4 text-sm text-gray-500">{formatDate(expense.expenseDate)}</td>
                    <td className="p-4">{getStatusBadge(expense.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Reports View
  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Financial Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Income & Expense Report</h3>
          <p className="text-sm text-gray-500 mt-1">View income and expenses over time</p>
        </button>

        <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:shadow-md transition">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Profit & Loss</h3>
          <p className="text-sm text-gray-500 mt-1">View your profit and loss statement</p>
        </button>

        <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:shadow-md transition">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <PieChart className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Balance Sheet</h3>
          <p className="text-sm text-gray-500 mt-1">View your assets and liabilities</p>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pendingAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Wallet },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'quotations', label: 'Quotations', icon: FileSpreadsheet },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'receipts', label: 'Receipts', icon: Receipt },
    { id: 'sales', label: 'Sales', icon: DollarSign },
    { id: 'expenses', label: 'Expenses', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Finance</h1>
              <p className="text-sm text-gray-500">Manage invoices, customers & finances</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => loadDashboardStats()} className="p-2 hover:bg-gray-100 rounded-lg">
              <RefreshCw className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ViewTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    activeView === item.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'invoices' && renderInvoices()}
          {activeView === 'quotations' && renderQuotations()}
          {activeView === 'customers' && renderCustomers()}
          {activeView === 'products' && renderProducts()}
          {activeView === 'receipts' && renderReceipts()}
          {activeView === 'sales' && renderSales()}
          {activeView === 'expenses' && renderExpenses()}
          {activeView === 'reports' && renderReports()}
        </main>
      </div>

      {/* Create Invoice Modal */}
      {showCreateInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Create Invoice</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    value={newInvoice.customerName}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customerName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email *</label>
                  <input
                    type="email"
                    value={newInvoice.customerEmail}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customerEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items *</label>
                {newInvoice.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                      className="col-span-5 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeInvoiceItem(index)}
                      className="col-span-2 px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInvoiceItem}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  + Add Item
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input
                    type="text"
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-right text-gray-600">
                  Subtotal: <span className="font-bold">{formatCurrency(newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0))}</span>
                </p>
                <p className="text-right text-gray-600">
                  Tax (15%): <span className="font-bold">{formatCurrency(newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * 0.15), 0))}</span>
                </p>
                <p className="text-right text-xl font-bold text-gray-900">
                  Total: {formatCurrency(newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * 1.15), 0))}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowCreateInvoice(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleCreateInvoice} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Create Invoice</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Customer Modal */}
      {showCreateCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Add Customer</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={newCustomer.company}
                    onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type / Industry</label>
                <select
                  value={newCustomer.serviceType}
                  onChange={(e) => setNewCustomer({ ...newCustomer, serviceType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Service Type</option>
                  <option value="consulting">Consulting</option>
                  <option value="software">Software Development</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="services">Professional Services</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={newCustomer.country}
                    onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowCreateCustomer(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleCreateCustomer} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Add Customer</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Quotation Modal */}
      {showCreateQuotation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Create Quotation</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    value={newQuotation.customerName}
                    onChange={(e) => setNewQuotation({ ...newQuotation, customerName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email *</label>
                  <input
                    type="email"
                    value={newQuotation.customerEmail}
                    onChange={(e) => setNewQuotation({ ...newQuotation, customerEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items *</label>
                {newQuotation.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateQuotationItem(index, 'description', e.target.value)}
                      className="col-span-5 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateQuotationItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => updateQuotationItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeQuotationItem(index)}
                      className="col-span-2 px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addQuotationItem}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  + Add Item
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={newQuotation.validUntil}
                    onChange={(e) => setNewQuotation({ ...newQuotation, validUntil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-right text-xl font-bold text-gray-900">
                  Total: {formatCurrency(newQuotation.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * 1.15), 0))}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowCreateQuotation(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleCreateQuotation} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Create Quotation</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {showCreateProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Add Product</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product/Service Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Quantity</label>
                  <input
                    type="number"
                    value={newProduct.minQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, minQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                  <input
                    type="number"
                    value={newProduct.unitPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowCreateProduct(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleCreateProduct} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Add Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Expense Modal */}
      {showCreateExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Add Expense</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Category</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Travel">Travel</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Rent">Rent</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                  <input
                    type="text"
                    value={newExpense.vendor}
                    onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowCreateExpense(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleCreateExpense} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Add Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
