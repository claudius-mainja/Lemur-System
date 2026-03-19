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

const initialTenantProfiles: TenantProfile[] = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'Admin User',
    userEmail: 'admin@company.com',
    department: 'Administration',
    position: 'System Administrator',
    accessLevel: 'full',
    permissions: ['all'],
    modules: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'settings', 'users'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    organizationId: 'org-1',
  },
  {
    id: '2',
    userId: 'user-2',
    userName: 'HR Manager',
    userEmail: 'hr@company.com',
    department: 'Human Resources',
    position: 'HR Manager',
    accessLevel: 'limited',
    permissions: ['hr', 'employees', 'leave'],
    modules: ['hr', 'productivity'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    organizationId: 'org-1',
  },
  {
    id: '3',
    userId: 'user-3',
    userName: 'Finance Manager',
    userEmail: 'finance@company.com',
    department: 'Finance',
    position: 'Finance Manager',
    accessLevel: 'limited',
    permissions: ['finance', 'invoices', 'expenses'],
    modules: ['finance', 'payroll'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    organizationId: 'org-1',
  },
];

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
    }),
    {
      name: 'lemur-data-store',
    }
  )
);
