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
  {
    id: 'emp-001',
    firstName: 'Thabo',
    lastName: 'Mokoena',
    email: 'thabo.mokoena@company.co.za',
    phone: '+27 82 123 4567',
    department: 'Executive',
    position: 'Managing Director',
    salary: 125000,
    hireDate: '2020-01-15',
    status: 'active',
    address: '45 Sandton Drive, Johannesburg',
    emergencyContact: 'Nomalanga Mokoena',
    emergencyPhone: '+27 83 456 7890',
  },
  {
    id: 'emp-002',
    firstName: 'Amara',
    lastName: 'Okonkwo',
    email: 'amara.okonkwo@company.co.za',
    phone: '+27 84 234 5678',
    department: 'Human Resources',
    position: 'HR Manager',
    salary: 75000,
    hireDate: '2021-03-20',
    status: 'active',
    address: '78 Park Avenue, Sandton',
    emergencyContact: 'Chidi Okonkwo',
    emergencyPhone: '+27 83 567 8901',
  },
  {
    id: 'emp-003',
    firstName: 'Pieter',
    lastName: 'van der Merwe',
    email: 'pieter.vandermerwe@company.co.za',
    phone: '+27 82 345 6789',
    department: 'Finance',
    position: 'Financial Controller',
    salary: 85000,
    hireDate: '2020-06-10',
    status: 'active',
    address: '123 Sunset Boulevard, Cape Town',
    emergencyContact: 'Marie van der Merwe',
    emergencyPhone: '+27 83 678 9012',
  },
  {
    id: 'emp-004',
    firstName: 'Lerato',
    lastName: 'Dlamini',
    email: 'lerato.dlamini@company.co.za',
    phone: '+27 73 456 7890',
    department: 'Sales',
    position: 'Sales Executive',
    salary: 45000,
    hireDate: '2022-01-05',
    status: 'active',
    address: '56 Rose Street, Johannesburg',
    emergencyContact: 'Sibusiso Dlamini',
    emergencyPhone: '+27 82 789 0123',
  },
  {
    id: 'emp-005',
    firstName: 'Fatima',
    lastName: 'Ahmed',
    email: 'fatima.ahmed@company.co.za',
    phone: '+27 83 567 8901',
    department: 'IT',
    position: 'Systems Administrator',
    salary: 65000,
    hireDate: '2021-09-15',
    status: 'active',
    address: '89 Tech Park, Pretoria',
    emergencyContact: 'Yusuf Ahmed',
    emergencyPhone: '+27 84 890 1234',
  },
  {
    id: 'emp-006',
    firstName: 'Kyle',
    lastName: 'Hendricks',
    email: 'kyle.hendricks@company.co.za',
    phone: '+27 72 678 9012',
    department: 'Operations',
    position: 'Operations Manager',
    salary: 60000,
    hireDate: '2021-11-01',
    status: 'on_leave',
    address: '34 Industrial Road, Durban',
    emergencyContact: 'Susan Hendricks',
    emergencyPhone: '+27 83 901 2345',
  },
];

const initialDepartments: Department[] = [
  { id: 'dept-001', name: 'Executive', managerId: 'emp-001', managerName: 'Thabo Mokoena', employeeCount: 1, budget: 500000 },
  { id: 'dept-002', name: 'Human Resources', managerId: 'emp-002', managerName: 'Amara Okonkwo', employeeCount: 2, budget: 250000 },
  { id: 'dept-003', name: 'Finance', managerId: 'emp-003', managerName: 'Pieter van der Merwe', employeeCount: 3, budget: 400000 },
  { id: 'dept-004', name: 'Sales', managerId: 'emp-004', managerName: 'Lerato Dlamini', employeeCount: 5, budget: 800000 },
  { id: 'dept-005', name: 'IT', managerId: 'emp-005', managerName: 'Fatima Ahmed', employeeCount: 4, budget: 350000 },
  { id: 'dept-006', name: 'Operations', managerId: 'emp-006', managerName: 'Kyle Hendricks', employeeCount: 6, budget: 600000 },
];

const initialCustomers: Customer[] = [
  {
    id: 'cust-001',
    name: 'MegaMart Retail Group',
    email: 'accounts@megamart.co.za',
    phone: '+27 11 123 4567',
    company: 'MegaMart Retail Group',
    address: '100 Commerce Street, Johannesburg',
    city: 'Johannesburg',
    country: 'South Africa',
    status: 'customer',
    source: 'Referral',
    totalSpent: 450000,
    lastContact: '2024-01-15',
    assignedTo: 'emp-004',
  },
  {
    id: 'cust-002',
    name: 'TechCorp Solutions',
    email: 'procurement@techcorp.co.za',
    phone: '+27 12 234 5678',
    company: 'TechCorp Solutions',
    address: '200 Innovation Drive, Pretoria',
    city: 'Pretoria',
    country: 'South Africa',
    status: 'customer',
    source: 'Website',
    totalSpent: 280000,
    lastContact: '2024-01-20',
    assignedTo: 'emp-004',
  },
  {
    id: 'cust-003',
    name: 'Global Exports PTY',
    email: 'finance@globalexports.co.za',
    phone: '+27 31 345 6789',
    company: 'Global Exports PTY',
    address: '50 Harbor Road, Durban',
    city: 'Durban',
    country: 'South Africa',
    status: 'customer',
    source: 'Trade Show',
    totalSpent: 620000,
    lastContact: '2024-01-18',
    assignedTo: 'emp-004',
  },
  {
    id: 'cust-004',
    name: 'HealthFirst Medical',
    email: 'admin@healthfirst.co.za',
    phone: '+27 21 456 7890',
    company: 'HealthFirst Medical',
    address: '75 Medical Centre, Cape Town',
    city: 'Cape Town',
    country: 'South Africa',
    status: 'prospect',
    source: 'Cold Call',
    totalSpent: 0,
    lastContact: '2024-01-22',
    assignedTo: 'emp-004',
  },
];

const initialLeads: Lead[] = [
  {
    id: 'lead-001',
    name: 'SolarTech Industries',
    email: 'ceo@solartech.co.za',
    phone: '+27 82 111 2222',
    company: 'SolarTech Industries',
    source: 'Website',
    status: 'new',
    value: 150000,
    assignedTo: 'emp-004',
    createdAt: '2024-01-25',
    notes: 'Interested in ERP solution for manufacturing operations',
  },
  {
    id: 'lead-002',
    name: 'EduLearn Academy',
    email: 'director@edulearn.ac.za',
    phone: '+27 83 222 3333',
    company: 'EduLearn Academy',
    source: 'Referral',
    status: 'contacted',
    value: 75000,
    assignedTo: 'emp-004',
    createdAt: '2024-01-20',
    notes: 'Looking for student management system',
  },
  {
    id: 'lead-003',
    name: 'FarmFresh Co-op',
    email: 'manager@farmfresh.co.za',
    phone: '+27 84 333 4444',
    company: 'FarmFresh Co-op',
    source: 'Trade Show',
    status: 'qualified',
    value: 200000,
    assignedTo: 'emp-004',
    createdAt: '2024-01-15',
    notes: 'Requires inventory management for agricultural products',
  },
];

const initialVendors: Vendor[] = [
  {
    id: 'vend-001',
    name: 'Office Supplies SA',
    email: 'orders@officesupplies.co.za',
    phone: '+27 11 555 1234',
    address: '25 Station Street, Johannesburg',
    city: 'Johannesburg',
    country: 'South Africa',
    category: 'Office Supplies',
    rating: 4.5,
    totalOrders: 45,
    totalSpent: 125000,
    status: 'active',
  },
  {
    id: 'vend-002',
    name: 'TechHardware Solutions',
    email: 'sales@techhardware.co.za',
    phone: '+27 12 666 2345',
    address: '80 Tech Avenue, Pretoria',
    city: 'Pretoria',
    country: 'South Africa',
    category: 'IT Equipment',
    rating: 4.8,
    totalOrders: 28,
    totalSpent: 480000,
    status: 'active',
  },
  {
    id: 'vend-003',
    name: 'Industrial Cleaning Services',
    email: 'info@industrialclean.co.za',
    phone: '+27 31 777 3456',
    address: '15 Factory Lane, Durban',
    city: 'Durban',
    country: 'South Africa',
    category: 'Cleaning Services',
    rating: 4.2,
    totalOrders: 12,
    totalSpent: 36000,
    status: 'active',
  },
];

const initialInventory: InventoryItem[] = [
  {
    id: 'inv-001',
    name: 'Dell Laptop XPS 15',
    sku: 'DELL-XPS15-001',
    category: 'Electronics',
    quantity: 15,
    minQuantity: 5,
    unitPrice: 25000,
    totalValue: 375000,
    vendorId: 'vend-002',
    vendorName: 'TechHardware Solutions',
    location: 'Warehouse A',
    lastUpdated: '2024-01-25',
    status: 'in_stock',
  },
  {
    id: 'inv-002',
    name: 'Office Chair Ergonomic',
    sku: 'OFFICE-CHAIR-002',
    category: 'Furniture',
    quantity: 8,
    minQuantity: 10,
    unitPrice: 3500,
    totalValue: 28000,
    vendorId: 'vend-001',
    vendorName: 'Office Supplies SA',
    location: 'Warehouse B',
    lastUpdated: '2024-01-24',
    status: 'low_stock',
  },
  {
    id: 'inv-003',
    name: 'HP Printer LaserJet',
    sku: 'HP-LJ-003',
    category: 'Electronics',
    quantity: 3,
    minQuantity: 5,
    unitPrice: 8500,
    totalValue: 25500,
    vendorId: 'vend-002',
    vendorName: 'TechHardware Solutions',
    location: 'Warehouse A',
    lastUpdated: '2024-01-23',
    status: 'low_stock',
  },
  {
    id: 'inv-004',
    name: 'Standing Desk',
    sku: 'FURN-SD-004',
    category: 'Furniture',
    quantity: 0,
    minQuantity: 3,
    unitPrice: 7500,
    totalValue: 0,
    vendorId: 'vend-001',
    vendorName: 'Office Supplies SA',
    location: 'Warehouse B',
    lastUpdated: '2024-01-20',
    status: 'out_of_stock',
  },
  {
    id: 'inv-005',
    name: 'Wireless Mouse',
    sku: 'TECH-WM-005',
    category: 'Accessories',
    quantity: 50,
    minQuantity: 20,
    unitPrice: 450,
    totalValue: 22500,
    vendorId: 'vend-002',
    vendorName: 'TechHardware Solutions',
    location: 'Warehouse A',
    lastUpdated: '2024-01-26',
    status: 'in_stock',
  },
];

const initialInvoices: Invoice[] = [
  {
    id: 'inv-2024-001',
    invoiceNumber: 'INV-2024-001',
    customerId: 'cust-001',
    customerName: 'MegaMart Retail Group',
    customerEmail: 'accounts@megamart.co.za',
    items: [
      { description: 'ERP License - Annual', quantity: 1, unitPrice: 150000, total: 150000 },
      { description: 'Implementation Services', quantity: 40, unitPrice: 2500, total: 100000 },
    ],
    subtotal: 250000,
    tax: 37500,
    total: 287500,
    status: 'paid',
    issueDate: '2024-01-05',
    dueDate: '2024-02-05',
    paidDate: '2024-01-28',
    notes: 'Annual ERP license and implementation',
  },
  {
    id: 'inv-2024-002',
    invoiceNumber: 'INV-2024-002',
    customerId: 'cust-002',
    customerName: 'TechCorp Solutions',
    customerEmail: 'procurement@techcorp.co.za',
    items: [
      { description: 'Cloud Hosting - Monthly', quantity: 12, unitPrice: 8500, total: 102000 },
      { description: 'Support Package - Premium', quantity: 1, unitPrice: 48000, total: 48000 },
    ],
    subtotal: 150000,
    tax: 22500,
    total: 172500,
    status: 'sent',
    issueDate: '2024-01-20',
    dueDate: '2024-02-20',
    notes: 'Annual cloud hosting and premium support',
  },
  {
    id: 'inv-2024-003',
    invoiceNumber: 'INV-2024-003',
    customerId: 'cust-003',
    customerName: 'Global Exports PTY',
    customerEmail: 'finance@globalexports.co.za',
    items: [
      { description: 'Custom Integration Development', quantity: 1, unitPrice: 350000, total: 350000 },
    ],
    subtotal: 350000,
    tax: 52500,
    total: 402500,
    status: 'overdue',
    issueDate: '2023-12-15',
    dueDate: '2024-01-15',
    notes: 'Custom integration for shipping logistics',
  },
];

const initialPayroll: PayrollRecord[] = [
  {
    id: 'pay-2024-01',
    employeeId: 'emp-001',
    employeeName: 'Thabo Mokoena',
    department: 'Executive',
    baseSalary: 125000,
    bonuses: 25000,
    deductions: 31250,
    netSalary: 118750,
    paymentDate: '2024-01-31',
    paymentMethod: 'bank_transfer',
    status: 'processed',
    tax: 25000,
    benefits: 6250,
  },
  {
    id: 'pay-2024-02',
    employeeId: 'emp-002',
    employeeName: 'Amara Okonkwo',
    department: 'Human Resources',
    baseSalary: 75000,
    bonuses: 10000,
    deductions: 16125,
    netSalary: 68875,
    paymentDate: '2024-01-31',
    paymentMethod: 'bank_transfer',
    status: 'processed',
    tax: 15000,
    benefits: 3750,
  },
  {
    id: 'pay-2024-03',
    employeeId: 'emp-003',
    employeeName: 'Pieter van der Merwe',
    department: 'Finance',
    baseSalary: 85000,
    bonuses: 15000,
    deductions: 18750,
    netSalary: 81250,
    paymentDate: '2024-01-31',
    paymentMethod: 'bank_transfer',
    status: 'processed',
    tax: 17000,
    benefits: 4250,
  },
  {
    id: 'pay-2024-04',
    employeeId: 'emp-004',
    employeeName: 'Lerato Dlamini',
    department: 'Sales',
    baseSalary: 45000,
    bonuses: 35000,
    deductions: 12000,
    netSalary: 68000,
    paymentDate: '2024-01-31',
    paymentMethod: 'bank_transfer',
    status: 'processed',
    tax: 9000,
    benefits: 2250,
  },
  {
    id: 'pay-2024-05',
    employeeId: 'emp-005',
    employeeName: 'Fatima Ahmed',
    department: 'IT',
    baseSalary: 65000,
    bonuses: 8000,
    deductions: 13875,
    netSalary: 59125,
    paymentDate: '2024-01-31',
    paymentMethod: 'bank_transfer',
    status: 'processed',
    tax: 13000,
    benefits: 3250,
  },
];

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-001',
    employeeId: 'emp-006',
    employeeName: 'Kyle Hendricks',
    type: 'annual',
    startDate: '2024-01-28',
    endDate: '2024-02-02',
    days: 4,
    reason: 'Family vacation',
    status: 'approved',
    approvedBy: 'emp-001',
    approvedDate: '2024-01-25',
    createdAt: '2024-01-20',
  },
  {
    id: 'leave-002',
    employeeId: 'emp-004',
    employeeName: 'Lerato Dlamini',
    type: 'sick',
    startDate: '2024-01-26',
    endDate: '2024-01-26',
    days: 1,
    reason: 'Medical appointment',
    status: 'pending',
    createdAt: '2024-01-25',
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
    }),
    {
      name: 'lemur-data-store',
    }
  )
);
