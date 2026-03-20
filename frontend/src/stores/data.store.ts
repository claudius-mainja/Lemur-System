'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  avatar?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  resumeUrl?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  employeeCount: number;
  budget: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  country: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  source: string;
  totalSpent: number;
  lastContact: string;
  assignedTo: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  value: number;
  assignedTo: string;
  createdAt: string;
  notes: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unitPrice: number;
  totalValue: number;
  vendorId: string;
  vendorName: string;
  location: string;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
  paymentMethod: 'bank_transfer' | 'cash' | 'check';
  status: 'pending' | 'processed' | 'failed';
  tax: number;
  benefits: number;
}

export interface AppSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  currency: string;
  timezone: string;
  taxRate: number;
}

export interface TenantProfile {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: string;
  position: string;
  accessLevel: 'full' | 'limited' | 'view_only';
  permissions: string[];
  modules: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  organizationId: string;
  avatarUrl?: string;
  phone?: string;
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalStorage: number;
  storageUsed: number;
  apiCalls: number;
  uptime: number;
  lastBackup: string;
  activeSessions: number;
}

export interface Contract {
  id: string;
  title: string;
  type: 'employment' | 'vendor' | 'client' | 'nda' | 'service';
  employeeId?: string;
  employeeName?: string;
  vendorId?: string;
  clientId?: string;
  startDate: string;
  endDate: string;
  value?: number;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  fileUrl?: string;
  fileName?: string;
  fileType?: 'pdf' | 'docx' | 'doc';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  unitPrice: number;
  currency?: string;
  unit: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface SocialPost {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
  content: string;
  mediaUrls: string[];
  scheduledFor?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  aiGenerated?: boolean;
  aiSource?: 'chatgpt' | 'perplexity' | 'manual';
  createdAt: string;
}

export interface SocialAccount {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
  accountName: string;
  accountId: string;
  accessToken?: string;
  pageUrl?: string;
  isConnected: boolean;
  connectedAt?: string;
}

export interface BankConfig {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountType: 'checking' | 'savings';
  branchCode: string;
  isActive: boolean;
}

export interface SalaryConfig {
  id: string;
  employeeId: string;
  bankConfigId: string;
  salaryAmount: number;
  paymentFrequency: 'monthly' | 'bi-weekly' | 'weekly';
  isAutomated: boolean;
  nextPaymentDate: string;
}

export interface PayslipConfig {
  id: string;
  employeeId: string;
  sendAutomatically: boolean;
  emailTemplate: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'ordered' | 'shipped' | 'received' | 'rejected';
  orderDate: string;
  expectedDelivery?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ProjectBrief {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ProjectMember {
  userId: string;
  userName: string;
  role: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  tax: number;
  total: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'other';
  description: string;
  issuedAt: string;
}

export interface SalesRecord {
  id: string;
  saleNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customerId: string;
  customerName: string;
  soldAt: string;
}

interface DataState {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  departments: Department[];
  invoices: Invoice[];
  customers: Customer[];
  leads: Lead[];
  vendors: Vendor[];
  inventory: InventoryItem[];
  payroll: PayrollRecord[];
  settings: AppSettings;
  tenantProfiles: TenantProfile[];
  contracts: Contract[];
  services: Service[];
  socialPosts: SocialPost[];
  socialAccounts: SocialAccount[];
  quotations: Quotation[];
  receipts: Receipt[];
  sales: SalesRecord[];
  bankConfigs: BankConfig[];
  salaryConfigs: SalaryConfig[];
  payslipConfigs: PayslipConfig[];
  orders: Order[];
  projectBriefs: ProjectBrief[];
  
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  setLeaveRequests: (requests: LeaveRequest[]) => void;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'createdAt'>) => void;
  updateLeaveRequest: (id: string, data: Partial<LeaveRequest>) => void;
  
  setDepartments: (departments: Department[]) => void;
  addDepartment: (department: Omit<Department, 'id'>) => void;
  
  setInvoices: (invoices: Invoice[]) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, data: Partial<Lead>) => void;
  
  setVendors: (vendors: Vendor[]) => void;
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (id: string, data: Partial<Vendor>) => void;
  
  setInventory: (items: InventoryItem[]) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => void;
  
  setPayroll: (records: PayrollRecord[]) => void;
  addPayrollRecord: (record: Omit<PayrollRecord, 'id'>) => void;
  updatePayrollRecord: (id: string, data: Partial<PayrollRecord>) => void;
  
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  setTenantProfiles: (profiles: TenantProfile[]) => void;
  addTenantProfile: (profile: Omit<TenantProfile, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTenantProfile: (id: string, data: Partial<TenantProfile>) => void;
  deleteTenantProfile: (id: string) => void;
  
  setContracts: (contracts: Contract[]) => void;
  addContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContract: (id: string, data: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  
  setServices: (services: Service[]) => void;
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateService: (id: string, data: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  setSocialPosts: (posts: SocialPost[]) => void;
  addSocialPost: (post: Omit<SocialPost, 'id' | 'createdAt'>) => void;
  updateSocialPost: (id: string, data: Partial<SocialPost>) => void;
  deleteSocialPost: (id: string) => void;
  
  setSocialAccounts: (accounts: SocialAccount[]) => void;
  addSocialAccount: (account: Omit<SocialAccount, 'id'>) => void;
  updateSocialAccount: (id: string, data: Partial<SocialAccount>) => void;
  deleteSocialAccount: (id: string) => void;

  setBankConfigs: (configs: BankConfig[]) => void;
  addBankConfig: (config: Omit<BankConfig, 'id'>) => void;
  updateBankConfig: (id: string, data: Partial<BankConfig>) => void;
  deleteBankConfig: (id: string) => void;

  setSalaryConfigs: (configs: SalaryConfig[]) => void;
  addSalaryConfig: (config: Omit<SalaryConfig, 'id'>) => void;
  updateSalaryConfig: (id: string, data: Partial<SalaryConfig>) => void;
  deleteSalaryConfig: (id: string) => void;

  setPayslipConfigs: (configs: PayslipConfig[]) => void;
  addPayslipConfig: (config: Omit<PayslipConfig, 'id'>) => void;
  updatePayslipConfig: (id: string, data: Partial<PayslipConfig>) => void;
  deletePayslipConfig: (id: string) => void;

  setOrders: (orders: Order[]) => void;
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  deleteOrder: (id: string) => void;

  setProjectBriefs: (briefs: ProjectBrief[]) => void;
  addProjectBrief: (brief: Omit<ProjectBrief, 'id'>) => void;
  deleteProjectBrief: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const emptySettings: AppSettings = {
  companyName: '',
  companyEmail: '',
  companyPhone: '',
  companyAddress: '',
  currency: 'USD',
  timezone: 'Africa/Johannesburg',
  taxRate: 15,
};

const initialEmployees: Employee[] = [];

const initialDepartments: Department[] = [];

const initialCustomers: Customer[] = [];

const initialLeads: Lead[] = [];

const initialVendors: Vendor[] = [];

const initialInventory: InventoryItem[] = [];

const initialInvoices: Invoice[] = [];

const initialPayroll: PayrollRecord[] = [];

const initialLeaveRequests: LeaveRequest[] = [];

const initialTenantProfiles: TenantProfile[] = [];

const initialContracts: Contract[] = [];

const initialServices: Service[] = [];

const initialSocialPosts: SocialPost[] = [];

const initialSocialAccounts: SocialAccount[] = [];

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      employees: initialEmployees,
      leaveRequests: initialLeaveRequests,
      departments: initialDepartments,
      invoices: initialInvoices,
      customers: initialCustomers,
      leads: initialLeads,
      vendors: initialVendors,
      inventory: initialInventory,
      payroll: initialPayroll,
      settings: emptySettings,
      tenantProfiles: initialTenantProfiles,
      contracts: initialContracts,
      services: initialServices,
      socialPosts: initialSocialPosts,
      socialAccounts: initialSocialAccounts,
      quotations: [],
      receipts: [],
      sales: [],
      bankConfigs: [],
      salaryConfigs: [],
      payslipConfigs: [],
      orders: [],
      projectBriefs: [],

      setEmployees: (employees) => set({ employees }),
      
      addEmployee: (employee) =>
        set((state) => ({
          employees: [...state.employees, { ...employee, id: generateId() }],
        })),

      updateEmployee: (id, data) =>
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        })),

      deleteEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
        })),

      setLeaveRequests: (requests) => set({ leaveRequests: requests }),
      
      addLeaveRequest: (request) =>
        set((state) => ({
          leaveRequests: [
            ...state.leaveRequests,
            { ...request, id: generateId(), createdAt: new Date().toISOString() },
          ],
        })),

      updateLeaveRequest: (id, data) =>
        set((state) => ({
          leaveRequests: state.leaveRequests.map((l) =>
            l.id === id ? { ...l, ...data } : l
          ),
        })),

      setDepartments: (departments) => set({ departments }),
      
      addDepartment: (department) =>
        set((state) => ({
          departments: [...state.departments, { ...department, id: generateId() }],
        })),

      setInvoices: (invoices) => set({ invoices }),
      
      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [...state.invoices, { ...invoice, id: generateId() }],
        })),

      updateInvoice: (id, data) =>
        set((state) => ({
          invoices: state.invoices.map((i) =>
            i.id === id ? { ...i, ...data } : i
          ),
        })),

      setCustomers: (customers) => set({ customers }),
      
      addCustomer: (customer) =>
        set((state) => ({
          customers: [...state.customers, { ...customer, id: generateId() }],
        })),

      updateCustomer: (id, data) =>
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      setLeads: (leads) => set({ leads }),
      
      addLead: (lead) =>
        set((state) => ({
          leads: [
            ...state.leads,
            { ...lead, id: generateId(), createdAt: new Date().toISOString() },
          ],
        })),

      updateLead: (id, data) =>
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...data } : l)),
        })),

      setVendors: (vendors) => set({ vendors }),
      
      addVendor: (vendor) =>
        set((state) => ({
          vendors: [...state.vendors, { ...vendor, id: generateId() }],
        })),

      updateVendor: (id, data) =>
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === id ? { ...v, ...data } : v
          ),
        })),

      setInventory: (items) => set({ inventory: items }),
      
      addInventoryItem: (item) =>
        set((state) => ({
          inventory: [...state.inventory, { ...item, id: generateId() }],
        })),

      updateInventoryItem: (id, data) =>
        set((state) => ({
          inventory: state.inventory.map((i) =>
            i.id === id ? { ...i, ...data } : i
          ),
        })),

      setPayroll: (records) => set({ payroll: records }),
      
      addPayrollRecord: (record) =>
        set((state) => ({
          payroll: [...state.payroll, { ...record, id: generateId() }],
        })),

      updatePayrollRecord: (id, data) =>
        set((state) => ({
          payroll: state.payroll.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      setTenantProfiles: (profiles) => set({ tenantProfiles: profiles }),
      
      addTenantProfile: (profile) =>
        set((state) => ({
          tenantProfiles: [
            ...state.tenantProfiles,
            {
              ...profile,
              id: generateId(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateTenantProfile: (id, data) =>
        set((state) => ({
          tenantProfiles: state.tenantProfiles.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
          ),
        })),

      deleteTenantProfile: (id) =>
        set((state) => ({
          tenantProfiles: state.tenantProfiles.filter((p) => p.id !== id),
        })),

      setContracts: (contracts) => set({ contracts }),
      
      addContract: (contract) =>
        set((state) => ({
          contracts: [
            ...state.contracts,
            {
              ...contract,
              id: generateId(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateContract: (id, data) =>
        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
          ),
        })),

      deleteContract: (id) =>
        set((state) => ({
          contracts: state.contracts.filter((c) => c.id !== id),
        })),

      setServices: (services) => set({ services }),
      
      addService: (service) =>
        set((state) => ({
          services: [
            ...state.services,
            {
              ...service,
              id: generateId(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateService: (id, data) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s
          ),
        })),

      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),

      setSocialPosts: (posts) => set({ socialPosts: posts }),
      
      addSocialPost: (post) =>
        set((state) => ({
          socialPosts: [
            ...state.socialPosts,
            {
              ...post,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateSocialPost: (id, data) =>
        set((state) => ({
          socialPosts: state.socialPosts.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      deleteSocialPost: (id) =>
        set((state) => ({
          socialPosts: state.socialPosts.filter((p) => p.id !== id),
        })),

      setSocialAccounts: (accounts) => set({ socialAccounts: accounts }),
      
      addSocialAccount: (account) =>
        set((state) => ({
          socialAccounts: [
            ...state.socialAccounts,
            {
              ...account,
              id: generateId(),
            },
          ],
        })),

      updateSocialAccount: (id, data) =>
        set((state) => ({
          socialAccounts: state.socialAccounts.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        })),

      deleteSocialAccount: (id) =>
        set((state) => ({
          socialAccounts: state.socialAccounts.filter((a) => a.id !== id),
        })),

      setBankConfigs: (configs) => set({ bankConfigs: configs }),
      addBankConfig: (config) =>
        set((state) => ({
          bankConfigs: [...state.bankConfigs, { ...config, id: generateId() }],
        })),
      updateBankConfig: (id, data) =>
        set((state) => ({
          bankConfigs: state.bankConfigs.map((b) =>
            b.id === id ? { ...b, ...data } : b
          ),
        })),
      deleteBankConfig: (id) =>
        set((state) => ({
          bankConfigs: state.bankConfigs.filter((b) => b.id !== id),
        })),

      setSalaryConfigs: (configs) => set({ salaryConfigs: configs }),
      addSalaryConfig: (config) =>
        set((state) => ({
          salaryConfigs: [...state.salaryConfigs, { ...config, id: generateId() }],
        })),
      updateSalaryConfig: (id, data) =>
        set((state) => ({
          salaryConfigs: state.salaryConfigs.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        })),
      deleteSalaryConfig: (id) =>
        set((state) => ({
          salaryConfigs: state.salaryConfigs.filter((s) => s.id !== id),
        })),

      setPayslipConfigs: (configs) => set({ payslipConfigs: configs }),
      addPayslipConfig: (config) =>
        set((state) => ({
          payslipConfigs: [...state.payslipConfigs, { ...config, id: generateId() }],
        })),
      updatePayslipConfig: (id, data) =>
        set((state) => ({
          payslipConfigs: state.payslipConfigs.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
      deletePayslipConfig: (id) =>
        set((state) => ({
          payslipConfigs: state.payslipConfigs.filter((p) => p.id !== id),
        })),

      setOrders: (orders) => set({ orders: orders }),
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, { ...order, id: generateId() }],
        })),
      updateOrder: (id, data) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, ...data } : o
          ),
        })),
      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        })),

      setProjectBriefs: (briefs) => set({ projectBriefs: briefs }),
      addProjectBrief: (brief) =>
        set((state) => ({
          projectBriefs: [...state.projectBriefs, { ...brief, id: generateId() }],
        })),
      deleteProjectBrief: (id) =>
        set((state) => ({
          projectBriefs: state.projectBriefs.filter((b) => b.id !== id),
        })),
    }),
    {
      name: 'lemur-data-store',
    }
  )
);
