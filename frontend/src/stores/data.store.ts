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
  isConnected: boolean;
  connectedAt?: string;
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

const initialEmployees: Employee[] = [
  { id: '1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@company.com', phone: '+1 555-0101', department: 'Engineering', position: 'Senior Developer', salary: 85000, hireDate: '2023-01-15', status: 'active' },
  { id: '2', firstName: 'Michael', lastName: 'Chen', email: 'michael.chen@company.com', phone: '+1 555-0102', department: 'Sales', position: 'Sales Manager', salary: 75000, hireDate: '2022-06-01', status: 'active' },
  { id: '3', firstName: 'Emily', lastName: 'Williams', email: 'emily.williams@company.com', phone: '+1 555-0103', department: 'Marketing', position: 'Marketing Director', salary: 90000, hireDate: '2021-03-20', status: 'active' },
  { id: '4', firstName: 'James', lastName: 'Brown', email: 'james.brown@company.com', phone: '+1 555-0104', department: 'Engineering', position: 'DevOps Engineer', salary: 80000, hireDate: '2022-09-10', status: 'active' },
  { id: '5', firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.anderson@company.com', phone: '+1 555-0105', department: 'Human Resources', position: 'HR Manager', salary: 70000, hireDate: '2021-11-05', status: 'active' },
  { id: '6', firstName: 'David', lastName: 'Martinez', email: 'david.martinez@company.com', phone: '+1 555-0106', department: 'Finance', position: 'Financial Analyst', salary: 72000, hireDate: '2023-02-28', status: 'active' },
  { id: '7', firstName: 'Jennifer', lastName: 'Taylor', email: 'jennifer.taylor@company.com', phone: '+1 555-0107', department: 'Operations', position: 'Operations Manager', salary: 78000, hireDate: '2022-04-15', status: 'active' },
  { id: '8', firstName: 'Robert', lastName: 'Wilson', email: 'robert.wilson@company.com', phone: '+1 555-0108', department: 'Engineering', position: 'Frontend Developer', salary: 72000, hireDate: '2023-05-22', status: 'active' },
];

const initialDepartments: Department[] = [
  { id: '1', name: 'Engineering', managerId: '1', managerName: 'Sarah Johnson', employeeCount: 3, budget: 250000 },
  { id: '2', name: 'Sales', managerId: '2', managerName: 'Michael Chen', employeeCount: 1, budget: 150000 },
  { id: '3', name: 'Marketing', managerId: '3', managerName: 'Emily Williams', employeeCount: 1, budget: 120000 },
  { id: '4', name: 'Human Resources', managerId: '5', managerName: 'Lisa Anderson', employeeCount: 1, budget: 80000 },
  { id: '5', name: 'Finance', managerId: '6', managerName: 'David Martinez', employeeCount: 1, budget: 95000 },
  { id: '6', name: 'Operations', managerId: '7', managerName: 'Jennifer Taylor', employeeCount: 1, budget: 100000 },
];

const initialCustomers: Customer[] = [
  { id: '1', name: 'Acme Corporation', email: 'contact@acme.com', phone: '+1 555-1001', company: 'Acme Corp', address: '123 Business Ave', city: 'New York', country: 'USA', status: 'customer', source: 'Website', totalSpent: 45000, lastContact: '2024-01-15', assignedTo: 'Michael Chen' },
  { id: '2', name: 'TechStart Inc', email: 'info@techstart.io', phone: '+1 555-1002', company: 'TechStart', address: '456 Innovation Blvd', city: 'San Francisco', country: 'USA', status: 'customer', source: 'Referral', totalSpent: 32000, lastContact: '2024-01-10', assignedTo: 'Michael Chen' },
  { id: '3', name: 'Global Solutions', email: 'sales@globalsol.com', phone: '+1 555-1003', company: 'Global Solutions', address: '789 Enterprise Way', city: 'Chicago', country: 'USA', status: 'prospect', source: 'LinkedIn', totalSpent: 0, lastContact: '2024-01-12', assignedTo: 'Michael Chen' },
  { id: '4', name: 'StartupXYZ', email: 'hello@startupxyz.com', phone: '+1 555-1004', company: 'StartupXYZ', address: '321 Launch Pad', city: 'Austin', country: 'USA', status: 'lead', source: 'Website', totalSpent: 0, lastContact: '2024-01-08', assignedTo: 'Michael Chen' },
];

const initialLeads: Lead[] = [
  { id: '1', name: 'John Smith', email: 'john@newcompany.com', phone: '+1 555-2001', company: 'NewCo', source: 'LinkedIn', status: 'new', value: 15000, assignedTo: 'Michael Chen', createdAt: '2024-01-15', notes: 'Interested in enterprise plan' },
  { id: '2', name: 'Maria Garcia', email: 'maria@anotherco.com', phone: '+1 555-2002', company: 'AnotherCo', source: 'Website', status: 'contacted', value: 22000, assignedTo: 'Michael Chen', createdAt: '2024-01-10', notes: 'Follow up next week' },
  { id: '3', name: 'Robert Lee', email: 'robert@freshstart.io', phone: '+1 555-2003', company: 'FreshStart', source: 'Referral', status: 'qualified', value: 35000, assignedTo: 'Michael Chen', createdAt: '2024-01-05', notes: 'Ready for proposal' },
];

const initialVendors: Vendor[] = [
  { id: '1', name: 'TechSupply Co', email: 'orders@techsupply.com', phone: '+1 555-3001', address: '100 Supply Chain Rd', city: 'Dallas', country: 'USA', category: 'Technology', rating: 4.5, totalOrders: 45, totalSpent: 125000, status: 'active' },
  { id: '2', name: 'Office Essentials', email: 'sales@officeess.com', phone: '+1 555-3002', address: '200 Commerce St', city: 'Houston', country: 'USA', category: 'Office Supplies', rating: 4.2, totalOrders: 78, totalSpent: 45000, status: 'active' },
  { id: '3', name: 'CloudServices Pro', email: 'support@cloudservices.com', phone: '+1 555-3003', address: '300 Cloud Ave', city: 'Seattle', country: 'USA', category: 'Cloud Services', rating: 4.8, totalOrders: 12, totalSpent: 85000, status: 'active' },
];

const initialInventory: InventoryItem[] = [
  { id: '1', name: 'MacBook Pro 16"', sku: 'MBP-16-001', category: 'Electronics', quantity: 25, minQuantity: 10, unitPrice: 2499, totalValue: 62475, vendorId: '1', vendorName: 'TechSupply Co', location: 'Warehouse A', lastUpdated: '2024-01-15', status: 'in_stock' },
  { id: '2', name: 'Dell Monitor 27"', sku: 'MON-27-001', category: 'Electronics', quantity: 45, minQuantity: 15, unitPrice: 599, totalValue: 26955, vendorId: '1', vendorName: 'TechSupply Co', location: 'Warehouse A', lastUpdated: '2024-01-14', status: 'in_stock' },
  { id: '3', name: 'Wireless Keyboard', sku: 'KB-WL-001', category: 'Accessories', quantity: 8, minQuantity: 20, unitPrice: 89, totalValue: 712, vendorId: '1', vendorName: 'TechSupply Co', location: 'Warehouse B', lastUpdated: '2024-01-13', status: 'low_stock' },
  { id: '4', name: 'USB-C Hub', sku: 'HUB-UC-001', category: 'Accessories', quantity: 3, minQuantity: 15, unitPrice: 45, totalValue: 135, vendorId: '1', vendorName: 'TechSupply Co', location: 'Warehouse B', lastUpdated: '2024-01-12', status: 'out_of_stock' },
  { id: '5', name: 'Office Chair', sku: 'CHAIR-OF-001', category: 'Furniture', quantity: 30, minQuantity: 10, unitPrice: 350, totalValue: 10500, vendorId: '2', vendorName: 'Office Essentials', location: 'Warehouse C', lastUpdated: '2024-01-11', status: 'in_stock' },
  { id: '6', name: 'Standing Desk', sku: 'DESK-ST-001', category: 'Furniture', quantity: 12, minQuantity: 5, unitPrice: 650, totalValue: 7800, vendorId: '2', vendorName: 'Office Essentials', location: 'Warehouse C', lastUpdated: '2024-01-10', status: 'in_stock' },
];

const initialInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2024-001', customerId: '1', customerName: 'Acme Corporation', customerEmail: 'contact@acme.com', items: [{ description: 'Enterprise License - Annual', quantity: 1, unitPrice: 15000, total: 15000 }], subtotal: 15000, tax: 2250, total: 17250, status: 'paid', issueDate: '2024-01-01', dueDate: '2024-01-31', paidDate: '2024-01-15' },
  { id: '2', invoiceNumber: 'INV-2024-002', customerId: '2', customerName: 'TechStart Inc', customerEmail: 'info@techstart.io', items: [{ description: 'Professional License - Annual', quantity: 1, unitPrice: 8000, total: 8000 }], subtotal: 8000, tax: 1200, total: 9200, status: 'sent', issueDate: '2024-01-10', dueDate: '2024-02-10' },
  { id: '3', invoiceNumber: 'INV-2024-003', customerId: '1', customerName: 'Acme Corporation', customerEmail: 'contact@acme.com', items: [{ description: 'Implementation Services', quantity: 10, unitPrice: 150, total: 1500 }], subtotal: 1500, tax: 225, total: 1725, status: 'paid', issueDate: '2023-12-15', dueDate: '2024-01-15', paidDate: '2023-12-28' },
  { id: '4', invoiceNumber: 'INV-2024-004', customerId: '3', customerName: 'Global Solutions', customerEmail: 'sales@globalsol.com', items: [{ description: 'Starter License - Monthly', quantity: 1, unitPrice: 499, total: 499 }], subtotal: 499, tax: 75, total: 574, status: 'overdue', issueDate: '2023-12-01', dueDate: '2023-12-31' },
];

const initialPayroll: PayrollRecord[] = [
  { id: '1', employeeId: '1', employeeName: 'Sarah Johnson', department: 'Engineering', baseSalary: 85000, bonuses: 5000, deductions: 12000, netSalary: 78000, paymentDate: '2024-01-25', paymentMethod: 'bank_transfer', status: 'processed', tax: 8500, benefits: 3500 },
  { id: '2', employeeId: '2', employeeName: 'Michael Chen', department: 'Sales', baseSalary: 75000, bonuses: 8000, deductions: 10500, netSalary: 72500, paymentDate: '2024-01-25', paymentMethod: 'bank_transfer', status: 'processed', tax: 7500, benefits: 3000 },
  { id: '3', employeeId: '3', employeeName: 'Emily Williams', department: 'Marketing', baseSalary: 90000, bonuses: 3000, deductions: 13500, netSalary: 79500, paymentDate: '2024-01-25', paymentMethod: 'bank_transfer', status: 'processed', tax: 9000, benefits: 4500 },
];

const initialLeaveRequests: LeaveRequest[] = [
  { id: '1', employeeId: '1', employeeName: 'Sarah Johnson', type: 'annual', startDate: '2024-02-15', endDate: '2024-02-22', days: 5, reason: 'Family vacation', status: 'pending', createdAt: '2024-01-10' },
  { id: '2', employeeId: '4', employeeName: 'James Brown', type: 'sick', startDate: '2024-01-20', endDate: '2024-01-21', days: 2, reason: 'Medical appointment', status: 'pending', createdAt: '2024-01-18' },
  { id: '3', employeeId: '2', employeeName: 'Michael Chen', type: 'personal', startDate: '2024-02-01', endDate: '2024-02-02', days: 2, reason: 'Personal matters', status: 'approved', approvedBy: 'Sarah Johnson', approvedDate: '2024-01-12', createdAt: '2024-01-08' },
];

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

const initialContracts: Contract[] = [
  { id: '1', title: 'Employment Agreement - Sarah Johnson', type: 'employment', employeeId: '1', employeeName: 'Sarah Johnson', startDate: '2023-01-15', endDate: '2026-01-14', value: 255000, status: 'active', fileName: 'sarah_employment.pdf', fileType: 'pdf', createdAt: '2023-01-10', updatedAt: '2024-01-15' },
  { id: '2', title: 'Employment Agreement - Michael Chen', type: 'employment', employeeId: '2', employeeName: 'Michael Chen', startDate: '2022-06-01', endDate: '2025-05-31', value: 225000, status: 'active', fileName: 'michael_employment.pdf', fileType: 'pdf', createdAt: '2022-05-20', updatedAt: '2024-01-10' },
  { id: '3', title: 'Service Agreement - TechSupply Co', type: 'vendor', vendorId: '1', startDate: '2024-01-01', endDate: '2024-12-31', value: 125000, status: 'active', fileName: 'techsupply_service.pdf', fileType: 'pdf', createdAt: '2023-12-15', updatedAt: '2024-01-01' },
  { id: '4', title: 'NDA - Acme Corporation', type: 'nda', clientId: '1', startDate: '2024-01-01', endDate: '2026-01-01', status: 'active', fileName: 'acme_nda.pdf', fileType: 'pdf', createdAt: '2023-12-20', updatedAt: '2024-01-01' },
];

const initialServices: Service[] = [
  { id: '1', name: 'Consulting Services', description: 'Professional business consulting', category: 'Consulting', unitPrice: 150, unit: 'hour', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-15' },
  { id: '2', name: 'Software Development', description: 'Custom software development services', category: 'Technology', unitPrice: 200, unit: 'hour', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-15' },
  { id: '3', name: 'Cloud Hosting', description: 'Managed cloud hosting services', category: 'Technology', unitPrice: 500, unit: 'month', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-15' },
  { id: '4', name: 'Training Workshop', description: 'Employee training sessions', category: 'Education', unitPrice: 2500, unit: 'session', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-15' },
  { id: '5', name: 'Support Services', description: 'Technical support and maintenance', category: 'Support', unitPrice: 100, unit: 'hour', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-15' },
];

const initialSocialPosts: SocialPost[] = [
  { id: '1', platform: 'linkedin', content: 'Excited to announce our new product launch! #innovation #technology', mediaUrls: [], scheduledFor: '2024-01-25T10:00:00', status: 'scheduled', aiGenerated: true, aiSource: 'chatgpt', createdAt: '2024-01-20' },
  { id: '2', platform: 'twitter', content: 'Check out our latest case study on digital transformation.', mediaUrls: [], publishedAt: '2024-01-18T14:00:00', status: 'published', aiGenerated: false, createdAt: '2024-01-15' },
  { id: '3', platform: 'facebook', content: 'We are hiring! Join our amazing team and help us build the future.', mediaUrls: [], status: 'draft', createdAt: '2024-01-22' },
];

const initialSocialAccounts: SocialAccount[] = [
  { id: '1', platform: 'linkedin', accountName: 'LemurSystem', accountId: 'lemur-123', isConnected: true, connectedAt: '2024-01-01' },
  { id: '2', platform: 'twitter', accountName: '@LemurSystem', accountId: 'lemur-twitter-456', isConnected: true, connectedAt: '2024-01-01' },
  { id: '3', platform: 'facebook', accountName: 'LemurSystem Official', accountId: 'lemur-fb-789', isConnected: false },
  { id: '4', platform: 'instagram', accountName: '@lemursystem', accountId: 'lemur-ig-101', isConnected: false },
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
      contracts: initialContracts,
      services: initialServices,
      socialPosts: initialSocialPosts,
      socialAccounts: initialSocialAccounts,
      quotations: [],
      receipts: [],
      sales: [],

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
    }),
    {
      name: 'lemur-data-store',
    }
  )
);
