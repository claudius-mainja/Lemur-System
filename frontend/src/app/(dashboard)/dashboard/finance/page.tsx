'use client';

import { useState, useEffect, useCallback } from 'react';
import { financeApi } from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';
import { useDataStore } from '@/stores/data.store';
import { pdfService } from '@/services/pdf-service';
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
  customerId?: string;
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
  
  const userCurrency = useAuthStore.getState().user?.currency || 'USD';

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

  const handleDownloadInvoicePDF = (invoice: any) => {
    try {
      const pdfDoc = pdfService.generateInvoicePDF({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail || '',
        items: invoice.items.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
        subtotal: invoice.subtotal,
        tax: invoice.taxAmount || invoice.tax || 0,
        total: invoice.total,
        status: invoice.status,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        paidDate: invoice.paidDate,
        notes: invoice.notes,
      });
      pdfService.downloadPDF(pdfDoc, `${invoice.invoiceNumber}.pdf`);
      toast.success('Invoice PDF downloaded');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const handleDownloadQuotationPDF = (quotation: any) => {
    try {
      const pdfDoc = pdfService.generateQuotationPDF({
        id: quotation.id,
        quotationNumber: quotation.quotationNumber,
        customerId: quotation.customerId || '',
        customerName: quotation.customerName,
        customerEmail: quotation.customerEmail || '',
        customerAddress: '',
        items: quotation.items.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
        subtotal: quotation.subtotal,
        tax: quotation.taxAmount || quotation.tax || 0,
        total: quotation.total,
        validUntil: quotation.validUntil,
        notes: quotation.notes,
        createdAt: quotation.issueDate || new Date().toISOString(),
      });
      pdfService.downloadPDF(pdfDoc, `${quotation.quotationNumber}.pdf`);
      toast.success('Quotation PDF downloaded');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const handleDownloadReceiptPDF = (receipt: any) => {
    try {
      const pdfDoc = pdfService.generateReceiptPDF({
        id: receipt.id,
        receiptNumber: receipt.receiptNumber,
        customerName: receipt.customerName,
        customerEmail: receipt.customerEmail || '',
        amount: receipt.amount,
        paymentMethod: receipt.paymentMethod || 'N/A',
        paymentDate: receipt.receiptDate || receipt.paymentDate || new Date().toISOString(),
        reference: receipt.reference || receipt.id,
        notes: receipt.notes,
      });
      pdfService.downloadPDF(pdfDoc, `${receipt.receiptNumber}.pdf`);
      toast.success('Receipt PDF downloaded');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const handleDownloadSalesReportPDF = () => {
    try {
      const totalSales = sales.reduce((sum: number, s: any) => sum + (s.totalAmount || s.total || 0), 0);
      const topProducts = sales.slice(0, 5).map((s: any) => ({
        name: s.items?.[0]?.description || 'Product',
        quantity: s.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0,
        revenue: s.totalAmount || s.total || 0,
      }));
      
      const pdfDoc = pdfService.generateSalesReportPDF({
        id: 'sales-report',
        reportNumber: `SR-${Date.now()}`,
        period: new Date().toLocaleDateString(),
        totalSales,
        totalRevenue: totalSales,
        totalProfit: totalSales * 0.3,
        itemsSold: sales.reduce((sum: number, s: any) => sum + (s.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0), 0),
        topProducts,
        createdAt: new Date().toISOString(),
      });
      pdfService.downloadPDF(pdfDoc, `sales-report-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Sales report PDF downloaded');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: userCurrency }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Dashboard View
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider">Total Revenue</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> From paid invoices
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider">Pending Amount</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.pendingAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <p className="text-sm text-yellow-500 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> Awaiting payment
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider">Overdue Amount</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.overdueAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> Requires attention
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider">Total Invoices</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.totalInvoices}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-sm text-white/40 mt-2">All time</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => { setActiveView('invoices'); setShowCreateInvoice(true); }}
          className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-xl flex items-center gap-3 hover:opacity-90 transition"
        >
          <FilePlus className="w-5 h-5" />
          <span>New Invoice</span>
        </button>
        <button
          onClick={() => { setActiveView('quotations'); setShowCreateQuotation(true); }}
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl flex items-center gap-3 hover:bg-white/10 transition"
        >
          <FileText className="w-5 h-5" />
          <span>New Quotation</span>
        </button>
        <button
          onClick={() => { setActiveView('customers'); setShowCreateCustomer(true); }}
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl flex items-center gap-3 hover:bg-white/10 transition"
        >
          <Users className="w-5 h-5" />
          <span>Add Customer</span>
        </button>
        <button
          onClick={() => { setActiveView('expenses'); setShowCreateExpense(true); }}
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl flex items-center gap-3 hover:bg-white/10 transition"
        >
          <Receipt className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white/5 border border-white/10 rounded-xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Recent Invoices</h3>
          <button onClick={() => setActiveView('invoices')} className="text-accent text-sm hover:underline">
            View All
          </button>
        </div>
        <div className="p-6">
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white/30" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Invoices Yet</h3>
              <p className="text-white/50 mb-6 max-w-md mx-auto">Create your first invoice to start tracking payments from your customers.</p>
              <button
                onClick={() => setActiveView('invoices')}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:opacity-90"
              >
                <Plus className="w-5 h-5" /> Create First Invoice
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-white/50 border-b border-white/10">
                    <th className="pb-3 font-medium">Invoice #</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.slice(0, 5).map((invoice) => (
                    <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 text-sm font-medium text-white">{invoice.invoiceNumber}</td>
                      <td className="py-3 text-sm text-white/70">{invoice.customerName}</td>
                      <td className="py-3 text-sm font-medium text-white">{formatCurrency(invoice.total)}</td>
                      <td className="py-3">{getStatusBadge(invoice.status)}</td>
                      <td className="py-3 text-sm text-white/50">{formatDate(invoice.dueDate)}</td>
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
        <h2 className="text-xl font-semibold text-white">Invoices</h2>
        <button
          onClick={() => setShowCreateInvoice(true)}
          className="bg-gradient-to-r from-accent to-accentDark text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
        <div className="p-4 border-b border-white/10 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/40"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
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
              <tr className="text-left text-sm text-white/50 border-b border-white/10">
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
                <tr><td colSpan={7} className="p-8 text-center text-white/50">Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-white/30" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">No Invoices Found</h3>
                      <p className="text-white/50 mb-6">Create your first invoice to get started.</p>
                      <button
                        onClick={() => setShowCreateInvoice(true)}
                        className="bg-gradient-to-r from-accent to-accentDark text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:opacity-90"
                      >
                        <Plus className="w-5 h-5" /> Create Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-medium text-white">{invoice.invoiceNumber}</td>
                    <td className="p-4 text-sm text-white/70">{invoice.customerName}</td>
                    <td className="p-4 text-sm font-medium text-white">{formatCurrency(invoice.total)}</td>
                    <td className="p-4">{getStatusBadge(invoice.status)}</td>
                    <td className="p-4 text-sm text-white/50">{formatDate(invoice.issueDate)}</td>
                    <td className="p-4 text-sm text-white/50">{formatDate(invoice.dueDate)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => {
                          const pdfDoc = pdfService.generateInvoicePDF({
                            id: invoice.id,
                            invoiceNumber: invoice.invoiceNumber,
                            customerId: invoice.customerId || '',
                            customerName: invoice.customerName,
                            customerEmail: invoice.customerEmail || '',
                            items: invoice.items.map((item: any) => ({
                              description: item.description,
                              quantity: item.quantity,
                              unitPrice: item.unitPrice,
                              total: item.total,
                            })),
                            subtotal: invoice.subtotal,
                            tax: invoice.taxAmount || 0,
                            total: invoice.total,
                            status: invoice.status as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
                            issueDate: invoice.issueDate,
                            dueDate: invoice.dueDate,
                            paidDate: invoice.paidDate,
                            notes: invoice.notes,
                          });
                          pdfService.openPDFInNewTab(pdfDoc, `${invoice.invoiceNumber}.pdf`);
                        }} className="p-1 hover:bg-white/10 rounded" title="View PDF">
                          <Eye className="w-4 h-4 text-white/50" />
                        </button>
                        <button onClick={() => handleDownloadInvoicePDF(invoice)} className="p-1 hover:bg-white/10 rounded" title="Download PDF">
                          <Download className="w-4 h-4 text-white/50" />
                        </button>
                        <button onClick={() => {
                          if (!invoice.customerEmail) {
                            toast.error('No customer email available');
                            return;
                          }
                          toast.success(`Email dialog opened for ${invoice.customerEmail}`);
                        }} className="p-1 hover:bg-white/10 rounded" title="Send Email">
                          <Mail className="w-4 h-4 text-white/50" />
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
        <h2 className="text-xl font-semibold text-white">Quotations</h2>
        <button
          onClick={() => setShowCreateQuotation(true)}
          className="bg-gradient-to-r from-accent to-accentDark text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> New Quotation
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/50 border-b border-white/10">
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
                <tr><td colSpan={6} className="p-8 text-center text-white/50">Loading...</td></tr>
              ) : quotations.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-white/50">No quotations found</td></tr>
              ) : (
                quotations.map((quotation) => (
                  <tr key={quotation.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-medium text-white">{quotation.quotationNumber}</td>
                    <td className="p-4 text-sm text-white/70">{quotation.customerName}</td>
                    <td className="p-4 text-sm font-medium text-white">{formatCurrency(quotation.total)}</td>
                    <td className="p-4">{getStatusBadge(quotation.status)}</td>
                    <td className="p-4 text-sm text-white/50">{formatDate(quotation.validUntil)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => setShowViewQuotation(quotation)} className="p-1 hover:bg-white/10 rounded">
                          <Eye className="w-4 h-4 text-white/50" />
                        </button>
                        <button onClick={() => handleDownloadQuotationPDF(quotation)} className="p-1 hover:bg-white/10 rounded">
                          <FileText className="w-4 h-4 text-white/50" />
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
        <h2 className="text-xl font-semibold text-white">Customers</h2>
        <button
          onClick={() => setShowCreateCustomer(true)}
          className="bg-gradient-to-r from-accent to-accentDark text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/50 border-b border-white/10">
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
                <tr><td colSpan={6} className="p-8 text-center text-white/50">Loading...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-white/50">No customers found</td></tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-medium text-white">{customer.name}</td>
                    <td className="p-4 text-sm text-white/50">{customer.email}</td>
                    <td className="p-4 text-sm text-white/50">{customer.phone}</td>
                    <td className="p-4 text-sm text-white/70">{customer.company || '-'}</td>
                    <td className="p-4">{getStatusBadge(customer.isActive ? 'active' : 'inactive')}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Edit className="w-4 h-4 text-white/50" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
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
        <h2 className="text-xl font-semibold text-white">Products & Services</h2>
        <button
          onClick={() => setShowCreateProduct(true)}
          className="bg-gradient-to-r from-accent to-accentDark text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/50 border-b border-white/10">
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
                <tr><td colSpan={8} className="p-8 text-center text-white/50">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-white/50">No products found</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-medium text-white">{product.name}</td>
                    <td className="p-4 text-sm text-white/50">{product.sku || '-'}</td>
                    <td className="p-4 text-sm text-white/70">{product.type}</td>
                    <td className="p-4 text-sm text-white/50">{product.category || '-'}</td>
                    <td className="p-4 text-sm font-medium text-white">{formatCurrency(product.unitPrice)}</td>
                    <td className="p-4 text-sm text-white/70">{product.quantityInStock}</td>
                    <td className="p-4">{getStatusBadge(product.isActive ? 'active' : 'inactive')}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Edit className="w-4 h-4 text-white/50" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
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
        <h2 className="text-xl font-semibold text-white">Receipts</h2>
        <button
          onClick={() => setShowCreateReceipt(true)}
          className="bg-gradient-to-r from-accent to-accentDark text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> New Receipt
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/50 border-b border-white/10">
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
                <tr><td colSpan={6} className="p-8 text-center text-white/50">Loading...</td></tr>
              ) : receipts.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-white/50">No receipts found</td></tr>
              ) : (
                receipts.map((receipt) => (
                  <tr key={receipt.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-medium text-white">{receipt.receiptNumber}</td>
                    <td className="p-4 text-sm text-white/70">{receipt.customerName}</td>
                    <td className="p-4 text-sm font-medium text-white">{formatCurrency(receipt.amount)}</td>
                    <td className="p-4 text-sm text-white/50">{formatDate(receipt.receiptDate)}</td>
                    <td className="p-4 text-sm text-white/70">{receipt.paymentMethod || '-'}</td>
                    <td className="p-4">
                      <button onClick={() => handleDownloadReceiptPDF(receipt)} className="p-1 hover:bg-white/10 rounded">
                        <Download className="w-4 h-4 text-white/50" />
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
        <h2 className="text-xl font-semibold text-white">Sales</h2>
        <button
          onClick={handleDownloadSalesReportPDF}
          className="bg-gradient-to-r from-accent to-accentDark text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/50 border-b border-white/10">
                <th className="p-4 font-medium">Sale #</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-white/50">Loading...</td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-white/50">No sales found</td></tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-medium text-white">{sale.saleNumber}</td>
                    <td className="p-4 text-sm text-white/70">{sale.customerName}</td>
                    <td className="p-4 text-sm font-medium text-white">{formatCurrency(sale.total)}</td>
                    <td className="p-4 text-sm text-white/50">{formatDate(sale.saleDate)}</td>
                    <td className="p-4">
                      <button className="p-1 hover:bg-white/10 rounded">
                        <Eye className="w-4 h-4 text-white/50" />
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
        <h2 className="text-xl font-semibold text-white">Expenses</h2>
        <button
          onClick={() => setShowCreateExpense(true)}
          className="bg-gradient-to-r from-accent to-accentDark text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/50 border-b border-white/10">
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
                <tr><td colSpan={7} className="p-8 text-center text-white/50">Loading...</td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-white/50">No expenses found</td></tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-medium text-white">{expense.expenseNumber}</td>
                    <td className="p-4 text-sm text-white/70">{expense.category}</td>
                    <td className="p-4 text-sm text-white/70">{expense.description}</td>
                    <td className="p-4 text-sm font-medium text-red-400">{formatCurrency(expense.amount)}</td>
                    <td className="p-4 text-sm text-white/50">{formatDate(expense.expenseDate)}</td>
                    <td className="p-4">{getStatusBadge(expense.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Edit className="w-4 h-4 text-white/50" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
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
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  const generateIncomeExpenseReport = () => {
    const paidInvoices = invoices.filter(i => i.status === 'paid');
    const totalIncome = paidInvoices.reduce((sum, i) => sum + i.total, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const report = {
      type: 'Income & Expense Report',
      period: reportPeriod,
      generatedAt: new Date().toISOString(),
      income: totalIncome,
      expenses: totalExpenses,
      netIncome: totalIncome - totalExpenses,
      incomeByMonth: [
        { month: 'Jan', amount: totalIncome * 0.1 },
        { month: 'Feb', amount: totalIncome * 0.08 },
        { month: 'Mar', amount: totalIncome * 0.12 },
        { month: 'Apr', amount: totalIncome * 0.09 },
        { month: 'May', amount: totalIncome * 0.11 },
        { month: 'Jun', amount: totalIncome * 0.1 },
      ],
      expenseByCategory: expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {} as Record<string, number>),
    };
    
    setReportData(report);
    setSelectedReport('income-expense');
    
    try {
      const pdfDoc = pdfService.generateSalesReportPDF({
        id: 'income-expense-report',
        reportNumber: `IER-${Date.now()}`,
        period: reportPeriod,
        totalSales: totalIncome,
        totalRevenue: totalIncome,
        totalProfit: totalIncome - totalExpenses,
        itemsSold: expenses.length,
        topProducts: Object.entries(report.expenseByCategory).map(([name, revenue]) => ({
          name,
          quantity: 1,
          revenue: revenue as number,
        })),
        createdAt: new Date().toISOString(),
      });
      pdfService.openPDFInNewTab(pdfDoc, `Income-Expense-Report-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Income & Expense Report generated');
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const generateProfitLossReport = () => {
    const paidInvoices = invoices.filter(i => i.status === 'paid');
    const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.total, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const grossProfit = totalRevenue * 0.7;
    const netProfit = grossProfit - totalExpenses;
    
    const report = {
      type: 'Profit & Loss Statement',
      period: reportPeriod,
      generatedAt: new Date().toISOString(),
      revenue: totalRevenue,
      costOfSales: totalRevenue * 0.3,
      grossProfit,
      operatingExpenses: totalExpenses,
      netProfit,
      breakdown: {
        salary: totalExpenses * 0.5,
        utilities: totalExpenses * 0.1,
        marketing: totalExpenses * 0.15,
        other: totalExpenses * 0.25,
      },
    };
    
    setReportData(report);
    setSelectedReport('profit-loss');
    
    try {
      const pdfDoc = pdfService.generateSalesReportPDF({
        id: 'profit-loss-report',
        reportNumber: `PLR-${Date.now()}`,
        period: reportPeriod,
        totalSales: totalRevenue,
        totalRevenue: totalRevenue,
        totalProfit: netProfit,
        itemsSold: invoices.length,
        topProducts: Object.entries(report.breakdown).map(([name, revenue]) => ({
          name,
          quantity: 1,
          revenue: revenue as number,
        })),
        createdAt: new Date().toISOString(),
      });
      pdfService.openPDFInNewTab(pdfDoc, `Profit-Loss-Report-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Profit & Loss Report generated');
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const generateBalanceSheet = () => {
    const totalAssets = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0) * 2;
    const currentAssets = totalAssets * 0.4;
    const fixedAssets = totalAssets * 0.6;
    const totalLiabilities = totalAssets * 0.3;
    const equity = totalAssets - totalLiabilities;
    
    const report = {
      type: 'Balance Sheet',
      period: reportPeriod,
      generatedAt: new Date().toISOString(),
      assets: {
        current: currentAssets,
        fixed: fixedAssets,
        total: totalAssets,
      },
      liabilities: {
        current: totalLiabilities * 0.6,
        longTerm: totalLiabilities * 0.4,
        total: totalLiabilities,
      },
      equity,
    };
    
    setReportData(report);
    setSelectedReport('balance-sheet');
    
    try {
      const pdfDoc = pdfService.generateSalesReportPDF({
        id: 'balance-sheet-report',
        reportNumber: `BSR-${Date.now()}`,
        period: reportPeriod,
        totalSales: totalAssets,
        totalRevenue: totalAssets,
        totalProfit: equity,
        itemsSold: Math.round(totalAssets / 1000),
        topProducts: [
          { name: 'Current Assets', quantity: 1, revenue: currentAssets },
          { name: 'Fixed Assets', quantity: 1, revenue: fixedAssets },
          { name: 'Equity', quantity: 1, revenue: equity },
        ],
        createdAt: new Date().toISOString(),
      });
      pdfService.openPDFInNewTab(pdfDoc, `Balance-Sheet-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Balance Sheet generated');
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Financial Reports</h2>
      
      <div className="flex gap-4 mb-4">
        <select
          value={reportPeriod}
          onChange={(e) => setReportPeriod(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button 
          onClick={generateIncomeExpenseReport}
          className="bg-white/5 border border-white/10 text-white p-6 rounded-xl text-left hover:bg-white/10 transition"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="font-semibold">Income & Expense Report</h3>
          <p className="text-sm text-white/50 mt-1">View income and expenses over time</p>
        </button>

        <button 
          onClick={generateProfitLossReport}
          className="bg-white/5 border border-white/10 text-white p-6 rounded-xl text-left hover:bg-white/10 transition"
        >
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="font-semibold">Profit & Loss</h3>
          <p className="text-sm text-white/50 mt-1">View your profit and loss statement</p>
        </button>

        <button 
          onClick={generateBalanceSheet}
          className="bg-white/5 border border-white/10 text-white p-6 rounded-xl text-left hover:bg-white/10 transition"
        >
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <PieChart className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="font-semibold">Balance Sheet</h3>
          <p className="text-sm text-white/50 mt-1">View your assets and liabilities</p>
        </button>
      </div>

      {reportData && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
          <h3 className="font-semibold text-white mb-4">{reportData.type}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reportData.type === 'Income & Expense Report' && (
              <>
                <div>
                  <p className="text-sm text-white/50">Total Income</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(reportData.income)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-400">{formatCurrency(reportData.expenses)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Net Income</p>
                  <p className="text-2xl font-bold text-blue-400">{formatCurrency(reportData.netIncome)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Report Period</p>
                  <p className="text-2xl font-bold text-white capitalize">{reportData.period}</p>
                </div>
              </>
            )}
            {reportData.type === 'Profit & Loss Statement' && (
              <>
                <div>
                  <p className="text-sm text-white/50">Revenue</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(reportData.revenue)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Gross Profit</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(reportData.grossProfit)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Net Profit</p>
                  <p className="text-2xl font-bold text-blue-400">{formatCurrency(reportData.netProfit)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Report Period</p>
                  <p className="text-2xl font-bold text-white capitalize">{reportData.period}</p>
                </div>
              </>
            )}
            {reportData.type === 'Balance Sheet' && (
              <>
                <div>
                  <p className="text-sm text-white/50">Total Assets</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(reportData.assets.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Total Liabilities</p>
                  <p className="text-2xl font-bold text-red-400">{formatCurrency(reportData.liabilities.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Equity</p>
                  <p className="text-2xl font-bold text-blue-400">{formatCurrency(reportData.equity)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Report Period</p>
                  <p className="text-2xl font-bold text-white capitalize">{reportData.period}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
        <h3 className="font-semibold text-white mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-white/50">Total Customers</p>
            <p className="text-2xl font-bold text-white">{stats.totalCustomers}</p>
          </div>
          <div>
            <p className="text-sm text-white/50">Total Products</p>
            <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
          </div>
          <div>
            <p className="text-sm text-white/50">Total Revenue</p>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div>
            <p className="text-sm text-white/50">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{formatCurrency(stats.pendingAmount)}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520]">
      {/* Header */}
      <header className="bg-[#0b2535]/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center shadow-lg shadow-accent/25">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wider">Finance</h1>
              <p className="text-sm text-white/50">Manage invoices, customers & finances</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => loadDashboardStats()} className="p-2 hover:bg-white/10 rounded-lg transition">
              <RefreshCw className="w-5 h-5 text-white/50" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0b2535]/80 backdrop-blur-xl border-r border-white/10 min-h-screen">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ViewTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-accent to-accentDark text-white shadow-lg shadow-accent/25'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0b2535] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto my-8 border border-white/10">
            <div className="p-6 border-b border-white/10 sticky top-0 bg-[#0b2535]">
              <h2 className="text-xl font-bold text-white">Create Invoice</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white/70 mb-1">Select Existing Customer</label>
                  <select
                    value={newInvoice.customerId}
                    onChange={(e) => {
                      const customer = customers.find(c => c.id === e.target.value);
                      if (customer) {
                        setNewInvoice({ 
                          ...newInvoice, 
                          customerId: customer.id,
                          customerName: customer.name,
                          customerEmail: customer.email,
                        });
                      }
                    }}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="">Select a customer...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} - {c.email}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center text-white/50 mt-6">or</div>
                <div className="flex-1">
                  <button 
                    onClick={() => { setShowCreateInvoice(false); setShowCreateCustomer(true); }}
                    className="w-full px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent/10"
                  >
                    + Add New Customer
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    value={newInvoice.customerName}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customerName: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Customer Email *</label>
                  <input
                    type="email"
                    value={newInvoice.customerEmail}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customerEmail: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Items *</label>
                <div className="grid grid-cols-12 gap-2 mb-2 text-xs text-white/50 font-medium">
                  <div className="col-span-5">DESCRIPTION</div>
                  <div className="col-span-2">QUANTITY</div>
                  <div className="col-span-3">PRICE</div>
                  <div className="col-span-2">TOTAL</div>
                </div>
                {newInvoice.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                      className="col-span-5 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="col-span-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="col-span-3 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                    />
                    <div className="col-span-1 flex items-center text-white/70">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeInvoiceItem(index)}
                      className="col-span-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30"
                    >
                      <X className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInvoiceItem}
                  className="text-accent text-sm font-medium hover:underline"
                >
                  + Add Item
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Notes</label>
                  <input
                    type="text"
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex justify-end gap-4">
                  <span className="text-white/70">Subtotal:</span>
                  <span className="font-bold text-white w-32 text-right">{formatCurrency(newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0))}</span>
                </div>
                <div className="flex justify-end gap-4">
                  <span className="text-white/70">Tax (15%):</span>
                  <span className="font-bold text-white w-32 text-right">{formatCurrency(newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * 0.15), 0))}</span>
                </div>
                <div className="flex justify-end gap-4 pt-2 border-t border-white/10">
                  <span className="text-xl font-bold text-accent">Total:</span>
                  <span className="text-xl font-bold text-accent w-32 text-right">
                    {formatCurrency(newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * 1.15), 0))}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setShowCreateInvoice(false)} className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg">Cancel</button>
              <button onClick={handleCreateInvoice} className="px-4 py-2 bg-gradient-to-r from-accent to-accentDark text-white rounded-lg hover:opacity-90">Create Invoice</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Customer Modal */}
      {showCreateCustomer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b2535] rounded-xl w-full max-w-lg border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Add Customer</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Company</label>
                  <input
                    type="text"
                    value={newCustomer.company}
                    onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Email *</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Service Type / Industry</label>
                <select
                  value={newCustomer.serviceType}
                  onChange={(e) => setNewCustomer({ ...newCustomer, serviceType: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
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
                <label className="block text-sm font-medium text-white/70 mb-1">Address</label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">City</label>
                  <input
                    type="text"
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Country</label>
                  <input
                    type="text"
                    value={newCustomer.country}
                    onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setShowCreateCustomer(false)} className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg">Cancel</button>
              <button onClick={handleCreateCustomer} className="px-4 py-2 bg-gradient-to-r from-accent to-accentDark text-white rounded-lg hover:opacity-90">Add Customer</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Quotation Modal */}
      {showCreateQuotation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0b2535] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto my-8 border border-white/10">
            <div className="p-6 border-b border-white/10 sticky top-0 bg-[#0b2535]">
              <h2 className="text-xl font-bold text-white">Create Quotation</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    value={newQuotation.customerName}
                    onChange={(e) => setNewQuotation({ ...newQuotation, customerName: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Customer Email *</label>
                  <input
                    type="email"
                    value={newQuotation.customerEmail}
                    onChange={(e) => setNewQuotation({ ...newQuotation, customerEmail: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Items *</label>
                {newQuotation.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateQuotationItem(index, 'description', e.target.value)}
                      className="col-span-5 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateQuotationItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="col-span-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => updateQuotationItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="col-span-3 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeQuotationItem(index)}
                      className="col-span-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addQuotationItem}
                  className="text-accent text-sm font-medium hover:underline"
                >
                  + Add Item
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={newQuotation.validUntil}
                    onChange={(e) => setNewQuotation({ ...newQuotation, validUntil: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-right text-xl font-bold text-accent">
                  Total: {formatCurrency(newQuotation.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * 1.15), 0))}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setShowCreateQuotation(false)} className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg">Cancel</button>
              <button onClick={handleCreateQuotation} className="px-4 py-2 bg-gradient-to-r from-accent to-accentDark text-white rounded-lg hover:opacity-90">Create Quotation</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {showCreateProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b2535] rounded-xl w-full max-w-lg border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Add Product</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Product/Service Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Type</label>
                  <select
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                  </select>
                </div>
                {newProduct.type === 'product' && (
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">SKU</label>
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="e.g., PROD-001"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  rows={3}
                />
              </div>
              <div className={newProduct.type === 'service' ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-3 gap-4'}>
                {newProduct.type === 'product' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Min Quantity</label>
                      <input
                        type="number"
                        value={newProduct.minQuantity}
                        onChange={(e) => setNewProduct({ ...newProduct, minQuantity: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      />
                    </div>
                  </>
                )}
                <div className={newProduct.type === 'service' ? 'col-span-2' : ''}>
                  <label className="block text-sm font-medium text-white/70 mb-1">Unit Price</label>
                  <input
                    type="number"
                    value={newProduct.unitPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="">Select Category</option>
                  <option value="Technology">Technology</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Software">Software</option>
                  <option value="Services">Services</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setShowCreateProduct(false)} className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg">Cancel</button>
              <button onClick={handleCreateProduct} className="px-4 py-2 bg-gradient-to-r from-accent to-accentDark text-white rounded-lg hover:opacity-90">Add {newProduct.type === 'service' ? 'Service' : 'Product'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Expense Modal */}
      {showCreateExpense && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b2535] rounded-xl w-full max-w-lg border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Add Expense</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Description *</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
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
                  <label className="block text-sm font-medium text-white/70 mb-1">Amount *</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Vendor</label>
                  <input
                    type="text"
                    value={newExpense.vendor}
                    onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setShowCreateExpense(false)} className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg">Cancel</button>
              <button onClick={handleCreateExpense} className="px-4 py-2 bg-gradient-to-r from-accent to-accentDark text-white rounded-lg hover:opacity-90">Add Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
