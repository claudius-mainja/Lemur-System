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
  resumeUrl?: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
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
  
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'createdAt'>) => void;
  updateLeaveRequest: (id: string, data: Partial<LeaveRequest>) => void;
  
  addDepartment: (department: Omit<Department, 'id'>) => void;
  
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, data: Partial<Lead>) => void;
  
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (id: string, data: Partial<Vendor>) => void;
  
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => void;
  
  addPayrollRecord: (record: Omit<PayrollRecord, 'id'>) => void;
  updatePayrollRecord: (id: string, data: Partial<PayrollRecord>) => void;
  
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialEmployees: Employee[] = [
  {
    id: 'emp-001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    position: 'Software Engineer',
    salary: 85000,
    hireDate: '2023-01-15',
    status: 'active',
    address: '123 Main St, New York, NY 10001',
    emergencyContact: 'Jane Smith',
    emergencyPhone: '+1 (555) 987-6543',
  },
  {
    id: 'emp-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Human Resources',
    position: 'HR Manager',
    salary: 75000,
    hireDate: '2022-06-01',
    status: 'active',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    emergencyContact: 'Mike Johnson',
    emergencyPhone: '+1 (555) 876-5432',
  },
  {
    id: 'emp-003',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@company.com',
    phone: '+1 (555) 345-6789',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 70000,
    hireDate: '2023-03-20',
    status: 'active',
    address: '789 Pine Rd, Chicago, IL 60601',
    emergencyContact: 'Lisa Brown',
    emergencyPhone: '+1 (555) 765-4321',
  },
  {
    id: 'emp-004',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@company.com',
    phone: '+1 (555) 456-7890',
    department: 'Marketing',
    position: 'Marketing Specialist',
    salary: 65000,
    hireDate: '2023-07-10',
    status: 'on_leave',
    address: '321 Elm St, Houston, TX 77001',
    emergencyContact: 'Robert Davis',
    emergencyPhone: '+1 (555) 654-3210',
  },
  {
    id: 'emp-005',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@company.com',
    phone: '+1 (555) 567-8901',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 95000,
    hireDate: '2021-11-05',
    status: 'active',
    address: '654 Maple Dr, Seattle, WA 98101',
    emergencyContact: 'Jennifer Wilson',
    emergencyPhone: '+1 (555) 543-2109',
  },
  {
    id: 'emp-006',
    firstName: 'Jessica',
    lastName: 'Martinez',
    email: 'jessica.martinez@company.com',
    phone: '+1 (555) 678-9012',
    department: 'Sales',
    position: 'Sales Representative',
    salary: 60000,
    hireDate: '2024-01-08',
    status: 'active',
    address: '987 Cedar Ln, Miami, FL 33101',
    emergencyContact: 'Carlos Martinez',
    emergencyPhone: '+1 (555) 432-1098',
  },
];

const initialDepartments: Department[] = [
  { id: 'dept-001', name: 'Engineering', managerId: 'emp-005', managerName: 'David Wilson', employeeCount: 15, budget: 500000 },
  { id: 'dept-002', name: 'Human Resources', managerId: 'emp-002', managerName: 'Sarah Johnson', employeeCount: 5, budget: 150000 },
  { id: 'dept-003', name: 'Finance', managerId: 'emp-003', managerName: 'Michael Brown', employeeCount: 8, budget: 250000 },
  { id: 'dept-004', name: 'Marketing', managerId: 'emp-004', managerName: 'Emily Davis', employeeCount: 10, budget: 300000 },
  { id: 'dept-005', name: 'Sales', managerId: 'emp-006', managerName: 'Jessica Martinez', employeeCount: 12, budget: 400000 },
];

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-001',
    employeeId: 'emp-004',
    employeeName: 'Emily Davis',
    type: 'maternity',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    days: 65,
    reason: 'Maternity leave',
    status: 'approved',
    approvedBy: 'Sarah Johnson',
    approvedDate: '2024-01-25',
    createdAt: '2024-01-20',
  },
  {
    id: 'leave-002',
    employeeId: 'emp-001',
    employeeName: 'John Smith',
    type: 'annual',
    startDate: '2024-03-15',
    endDate: '2024-03-22',
    days: 5,
    reason: 'Family vacation',
    status: 'pending',
    createdAt: '2024-03-01',
  },
];

const initialInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2024-001',
    customerId: 'cust-001',
    customerName: 'Acme Corporation',
    customerEmail: 'billing@acme.com',
    items: [
      { description: 'Web Development Services', quantity: 1, unitPrice: 15000, total: 15000 },
      { description: 'UI/UX Design', quantity: 1, unitPrice: 5000, total: 5000 },
    ],
    subtotal: 20000,
    tax: 2000,
    total: 22000,
    status: 'paid',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    paidDate: '2024-02-10',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2024-002',
    customerId: 'cust-002',
    customerName: 'TechStart Inc',
    customerEmail: 'accounts@techstart.io',
    items: [
      { description: 'Monthly Retainer - January', quantity: 1, unitPrice: 5000, total: 5000 },
      { description: 'Additional Development Hours', quantity: 20, unitPrice: 150, total: 3000 },
    ],
    subtotal: 8000,
    tax: 800,
    total: 8800,
    status: 'sent',
    issueDate: '2024-02-01',
    dueDate: '2024-03-01',
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2024-003',
    customerId: 'cust-003',
    customerName: 'Global Solutions Ltd',
    customerEmail: 'finance@globalsolutions.com',
    items: [
      { description: 'Consulting Services', quantity: 40, unitPrice: 200, total: 8000 },
      { description: 'Travel Expenses', quantity: 1, unitPrice: 2500, total: 2500 },
    ],
    subtotal: 10500,
    tax: 1050,
    total: 11550,
    status: 'overdue',
    issueDate: '2024-01-10',
    dueDate: '2024-02-10',
  },
];

const initialCustomers: Customer[] = [
  { id: 'cust-001', name: 'Acme Corporation', email: 'billing@acme.com', phone: '+1 (555) 111-2222', company: 'Acme Corp', address: '100 Business Ave', city: 'New York', country: 'USA', status: 'customer', source: 'Website', totalSpent: 150000, lastContact: '2024-02-15', assignedTo: 'Jessica Martinez' },
  { id: 'cust-002', name: 'TechStart Inc', email: 'accounts@techstart.io', phone: '+1 (555) 222-3333', company: 'TechStart', address: '200 Innovation Blvd', city: 'San Francisco', country: 'USA', status: 'customer', source: 'Referral', totalSpent: 85000, lastContact: '2024-02-20', assignedTo: 'Jessica Martinez' },
  { id: 'cust-003', name: 'Global Solutions Ltd', email: 'finance@globalsolutions.com', phone: '+1 (555) 333-4444', company: 'Global Solutions', address: '300 Enterprise Way', city: 'Chicago', country: 'USA', status: 'customer', source: 'LinkedIn', totalSpent: 45000, lastContact: '2024-01-15', assignedTo: 'David Wilson' },
  { id: 'cust-004', name: 'StartupXYZ', email: 'hello@startupxyz.com', phone: '+1 (555) 444-5555', company: 'StartupXYZ', address: '400 Founder St', city: 'Austin', country: 'USA', status: 'prospect', source: 'Cold Call', totalSpent: 0, lastContact: '2024-02-25', assignedTo: 'Jessica Martinez' },
];

const initialLeads: Lead[] = [
  { id: 'lead-001', name: 'Enterprise Co', email: 'contact@enterprise.com', phone: '+1 (555) 555-6666', company: 'Enterprise Co', source: 'Website', status: 'qualified', value: 50000, assignedTo: 'Jessica Martinez', createdAt: '2024-02-01', notes: 'Interested in full suite of services' },
  { id: 'lead-002', name: 'SmallBiz LLC', email: 'owner@smallbiz.com', phone: '+1 (555) 666-7777', company: 'SmallBiz LLC', source: 'Referral', status: 'new', value: 10000, assignedTo: 'Jessica Martinez', createdAt: '2024-02-20', notes: 'Looking for basic HR software' },
];

const initialVendors: Vendor[] = [
  { id: 'vend-001', name: 'TechSupplies Inc', email: 'sales@techsupplies.com', phone: '+1 (555) 111-0001', address: '500 Tech Park', city: 'San Jose', country: 'USA', category: 'Technology', rating: 4.5, totalOrders: 150, totalSpent: 250000, status: 'active' },
  { id: 'vend-002', name: 'Office Essentials Co', email: 'orders@officeessentials.com', phone: '+1 (555) 222-0002', address: '600 Supply Dr', city: 'Dallas', country: 'USA', category: 'Office Supplies', rating: 4.8, totalOrders: 300, totalSpent: 75000, status: 'active' },
  { id: 'vend-003', name: 'CloudServices Pro', email: 'support@cloudservices.com', phone: '+1 (555) 333-0003', address: '700 Cloud Ave', city: 'Seattle', country: 'USA', category: 'Software', rating: 4.9, totalOrders: 50, totalSpent: 180000, status: 'active' },
];

const initialInventory: InventoryItem[] = [
  { id: 'invt-001', name: 'MacBook Pro 16"', sku: 'TECH-LAP-001', category: 'Technology', quantity: 25, minQuantity: 10, unitPrice: 2499, totalValue: 62475, vendorId: 'vend-001', vendorName: 'TechSupplies Inc', location: 'Warehouse A', lastUpdated: '2024-02-15', status: 'in_stock' },
  { id: 'invt-002', name: 'Dell Monitor 27"', sku: 'TECH-MON-002', category: 'Technology', quantity: 8, minQuantity: 15, unitPrice: 450, totalValue: 3600, vendorId: 'vend-001', vendorName: 'TechSupplies Inc', location: 'Warehouse A', lastUpdated: '2024-02-18', status: 'low_stock' },
  { id: 'invt-003', name: 'Office Chair Ergonomic', sku: 'FURN-CHR-001', category: 'Furniture', quantity: 50, minQuantity: 20, unitPrice: 350, totalValue: 17500, vendorId: 'vend-002', vendorName: 'Office Essentials Co', location: 'Warehouse B', lastUpdated: '2024-02-10', status: 'in_stock' },
  { id: 'invt-004', name: 'Standing Desk', sku: 'FURN-DSK-002', category: 'Furniture', quantity: 0, minQuantity: 10, unitPrice: 600, totalValue: 0, vendorId: 'vend-002', vendorName: 'Office Essentials Co', location: 'Warehouse B', lastUpdated: '2024-02-20', status: 'out_of_stock' },
  { id: 'invt-005', name: 'Wireless Keyboard', sku: 'TECH-KEY-003', category: 'Technology', quantity: 100, minQuantity: 30, unitPrice: 89, totalValue: 8900, vendorId: 'vend-001', vendorName: 'TechSupplies Inc', location: 'Warehouse A', lastUpdated: '2024-02-22', status: 'in_stock' },
];

const initialPayroll: PayrollRecord[] = [
  { id: 'pay-001', employeeId: 'emp-001', employeeName: 'John Smith', department: 'Engineering', baseSalary: 85000, bonuses: 5000, deductions: 2500, netSalary: 7083, paymentDate: '2024-02-28', paymentMethod: 'bank_transfer', status: 'processed', tax: 2125, benefits: 500 },
  { id: 'pay-002', employeeId: 'emp-002', employeeName: 'Sarah Johnson', department: 'Human Resources', baseSalary: 75000, bonuses: 3000, deductions: 2000, netSalary: 6083, paymentDate: '2024-02-28', paymentMethod: 'bank_transfer', status: 'processed', tax: 1875, benefits: 500 },
  { id: 'pay-003', employeeId: 'emp-003', employeeName: 'Michael Brown', department: 'Finance', baseSalary: 70000, bonuses: 2500, deductions: 1800, netSalary: 5833, paymentDate: '2024-02-28', paymentMethod: 'bank_transfer', status: 'processed', tax: 1750, benefits: 500 },
  { id: 'pay-004', employeeId: 'emp-005', employeeName: 'David Wilson', department: 'Engineering', baseSalary: 95000, bonuses: 8000, deductions: 3000, netSalary: 8083, paymentDate: '2024-02-28', paymentMethod: 'bank_transfer', status: 'processed', tax: 2375, benefits: 500 },
];

const initialSettings: AppSettings = {
  companyName: 'LemurSystem Inc.',
  companyEmail: 'info@lemursystem.com',
  companyPhone: '+1 (555) 000-1234',
  companyAddress: '123 Business Street, New York, NY 10001',
  currency: 'USD',
  timezone: 'America/New_York',
  taxRate: 10,
};

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
      settings: initialSettings,

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

      addDepartment: (department) =>
        set((state) => ({
          departments: [...state.departments, { ...department, id: generateId() }],
        })),

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
    }),
    {
      name: 'lemur-data-store',
    }
  )
);
