import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          const { access_token, refresh_token, user } = response.data;
          const currentUser = useAuthStore.getState().user;
          
          if (currentUser && originalRequest.headers) {
            useAuthStore.getState().setAuth(user, access_token, refresh_token);
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } else {
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    organization_name: string;
    industry: string;
    country: string;
    currency: string;
    plan: string;
  }) => api.post('/auth/register', data),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  getMe: () => api.get('/auth/me'),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    }),
};

// HR API
export const hrApi = {
  // Dashboard Stats
  getDashboardStats: () => api.get('/hr/dashboard/stats'),
  
  // Employees
  getEmployees: (page = 1, limit = 50) => 
    api.get('/hr/employees', { params: { page, limit } }),
  
  getEmployee: (id: string) => api.get(`/hr/employees/${id}`),
  
  createEmployee: (data: {
    first_name?: string;
    firstName?: string;
    last_name?: string;
    lastName?: string;
    email: string;
    phone?: string;
    department?: string;
    departmentId?: string;
    position?: string;
    hire_date?: string;
    hireDate?: string;
    salary?: number;
  }) => api.post('/hr/employees', {
    first_name: data.first_name || data.firstName,
    last_name: data.last_name || data.lastName,
    email: data.email,
    phone: data.phone,
    department: data.department || data.departmentId,
    position: data.position,
    hire_date: data.hire_date || data.hireDate,
    salary: data.salary,
  }),

  updateEmployee: (id: string, data: any) => api.put(`/hr/employees/${id}`, data),
  
  deleteEmployee: (id: string) => api.delete(`/hr/employees/${id}`),
  
  terminateEmployee: (id: string, data: any) => api.post(`/hr/employees/${id}/terminate`, data),
  
  // Departments
  getDepartments: () => api.get('/hr/departments'),
  
  createDepartment: (data: { name: string; description?: string }) => 
    api.post('/hr/departments', data),

  updateDepartment: (id: string, data: any) => api.put(`/hr/departments/${id}`, data),
  
  deleteDepartment: (id: string) => api.delete(`/hr/departments/${id}`),
  
  // Leave Requests
  getLeaveRequests: () => api.get('/hr/leave-requests'),
  
  createLeaveRequest: (data: {
    employee_id?: string;
    employeeId?: string;
    leave_type?: string;
    leaveType?: string;
    start_date?: string;
    startDate?: string;
    end_date?: string;
    endDate?: string;
    days?: number;
    reason?: string;
  }) => api.post('/hr/leave-requests', {
    employee_id: data.employee_id || data.employeeId,
    leave_type: data.leave_type || data.leaveType,
    start_date: data.start_date || data.startDate,
    end_date: data.end_date || data.endDate,
    days: data.days,
    reason: data.reason,
  }),

  approveLeaveRequest: (id: string) => api.put(`/hr/leave-requests/${id}/approve`),
  
  // Leave Balances
  getLeaveBalances: () => api.get('/hr/leave-balances'),
  
  createLeaveBalance: (data: any) => api.post('/hr/leave-balances', data),
  
  // Attendance
  getAttendance: () => api.get('/hr/attendance'),
  
  recordAttendance: (data: any) => api.post('/hr/attendance', data),
  
  // Stats
  getStats: () => api.get('/hr/stats'),
  
  // Leave
  getLeave: () => api.get('/hr/leave'),
  
  createLeave: (data: any) => api.post('/hr/leave', data),
  
  updateLeave: (id: string, data: any) => api.put(`/hr/leave/${id}`, data),
  
  getLeaveStats: () => api.get('/hr/leave/stats'),
  
  // Contracts (stored locally for now)
  getContracts: () => Promise.resolve({ data: { data: [] } }),
};

// Employees API (HR Module)
export const employeesApi = {
  getAll: () => api.get('/hr/employees'),
  
  getById: (id: string) => api.get(`/hr/employees/${id}`),
  
  create: (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    department?: string;
    position?: string;
    start_date?: string;
    salary?: number;
  }) => api.post('/hr/employees', data),

  update: (id: string, data: any) => api.put(`/hr/employees/${id}`, data),
  
  delete: (id: string) => api.delete(`/hr/employees/${id}`),
  
  getStats: () => api.get('/hr/stats'),
};

// Leave API
export const leaveApi = {
  getAll: () => api.get('/hr/leave-requests'),
  
  getById: (id: string) => api.get(`/hr/leave-requests/${id}`),
  
  create: (data: {
    employee_id: string;
    employee_name: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    days: number;
    reason?: string;
  }) => api.post('/hr/leave-requests', data),

  update: (id: string, data: any) => api.put(`/hr/leave-requests/${id}`, data),
  
  updateStatus: (id: string, status: string) => 
    api.put(`/hr/leave-requests/${id}/approve`, { status }),
  
  delete: (id: string) => api.delete(`/hr/leave-requests/${id}`),
  
  getStats: () => api.get('/hr/leave/stats'),
};

// Finance API
export const financeApi = {
  // Accounts
  getAccounts: () => api.get('/finance/accounts'),
  
  createAccount: (data: any) => api.post('/finance/accounts', data),
  
  // Invoices
  getInvoices: (page = 1, limit = 50, status?: string) => api.get('/finance/invoices', { params: { page, limit, status } }),
  
  getInvoice: (id: string) => api.get(`/finance/invoices/${id}`),
  
  createInvoice: (data: any) => api.post('/finance/invoices', data),
  
  updateInvoice: (id: string, data: any) => api.put(`/finance/invoices/${id}`, data),
  
  sendInvoice: (id: string) => api.post(`/finance/invoices/${id}/send`, {}),
  
  cancelInvoice: (id: string) => api.post(`/finance/invoices/${id}/cancel`, {}),
  
  // Quotations
  getQuotations: (page = 1, limit = 50) => api.get('/finance/quotations', { params: { page, limit } }),
  
  createQuotation: (data: any) => api.post('/finance/quotations', data),
  
  updateQuotation: (id: string, data: any) => api.put(`/finance/quotations/${id}`, data),
  
  deleteQuotation: (id: string) => api.delete(`/finance/quotations/${id}`),
  
  // Payments
  getPayments: () => api.get('/finance/payments'),
  
  createPayment: (data: any) => api.post('/finance/payments', data),
  
  // Expenses
  getExpenses: (page = 1, limit = 50) => api.get('/finance/expenses', { params: { page, limit } }),
  
  createExpense: (data: any) => api.post('/finance/expenses', data),
  
  updateExpense: (id: string, data: any) => api.put(`/finance/expenses/${id}`, data),
  
  deleteExpense: (id: string) => api.delete(`/finance/expenses/${id}`),
  
  // Transactions
  getTransactions: () => api.get('/finance/transactions'),
  
  // Dashboard
  getDashboardStats: () => api.get('/finance/dashboard/stats'),
  
  // Reports
  generateReport: (data: any) => api.post('/finance/reports/financial', data),
  
  // Customers (alias for companies)
  getCustomers: (page = 1, limit = 50) => api.get('/crm/companies', { params: { page, limit } }),
  
  createCustomer: (data: any) => api.post('/crm/companies', data),
  
  updateCustomer: (id: string, data: any) => api.put(`/crm/companies/${id}`, data),
  
  deleteCustomer: (id: string) => api.delete(`/crm/companies/${id}`),
  
  // Products
  getProducts: (page = 1, limit = 50) => api.get('/inventory/products', { params: { page, limit } }),
  
  createProduct: (data: any) => api.post('/inventory/products', data),
  
  updateProduct: (id: string, data: any) => api.put(`/inventory/products/${id}`, data),
  
  deleteProduct: (id: string) => api.delete(`/inventory/products/${id}`),
  
  // Receipts
  getReceipts: (page = 1, limit = 50) => api.get('/finance/receipts', { params: { page, limit } }),
  
  createReceipt: (data: any) => api.post('/finance/receipts', data),
  
  updateReceipt: (id: string, data: any) => api.put(`/finance/receipts/${id}`, data),
  
  deleteReceipt: (id: string) => api.delete(`/finance/receipts/${id}`),
  
  // Sales
  getSales: (page = 1, limit = 50) => api.get('/finance/sales', { params: { page, limit } }),
};

// Customers API (Finance Module)
export const customersApi = {
  getAll: () => api.get('/crm/companies'),
  
  getById: (id: string) => api.get(`/crm/companies/${id}`),
  
  create: (data: {
    name: string;
    company?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    service_type?: string;
  }) => api.post('/crm/companies', data),

  update: (id: string, data: any) => api.put(`/crm/companies/${id}`, data),
  
  delete: (id: string) => api.delete(`/crm/companies/${id}`),
};

// Products API (Finance Module)
export const productsApi = {
  getAll: () => api.get('/inventory/products'),
  
  getById: (id: string) => api.get(`/inventory/products/${id}`),
  
  create: (data: {
    name: string;
    sku?: string;
    description?: string;
    category?: string;
    type?: string;
    unit_price?: number;
    quantity?: number;
    min_quantity?: number;
  }) => api.post('/inventory/products', data),

  update: (id: string, data: any) => api.put(`/inventory/products/${id}`, data),
  
  delete: (id: string) => api.delete(`/inventory/products/${id}`),
};

// Invoices API (Finance Module)
export const invoicesApi = {
  getAll: () => api.get('/finance/invoices'),
  
  getById: (id: string) => api.get(`/finance/invoices/${id}`),
  
  create: (data: {
    customer_id?: string;
    customer_name: string;
    customer_email?: string;
    items: Array<{
      product_id?: string;
      product_name: string;
      description?: string;
      quantity: number;
      unit_price: number;
    }>;
    due_date?: string;
    notes?: string;
  }) => api.post('/finance/invoices', data),

  update: (id: string, data: any) => api.put(`/finance/invoices/${id}`, data),
  
  updateStatus: (id: string, status: string) => 
    api.patch(`/finance/invoices/${id}/status`, { status }),
  
  delete: (id: string) => api.delete(`/finance/invoices/${id}`),
  
  getStats: () => api.get('/finance/dashboard/stats'),
};

// Leads API (CRM Module)
export const leadsApi = {
  getAll: () => api.get('/crm/leads'),
  
  getById: (id: string) => api.get(`/crm/leads/${id}`),
  
  create: (data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    source?: string;
    value?: number;
    notes?: string;
  }) => api.post('/crm/leads', data),

  update: (id: string, data: any) => api.put(`/crm/leads/${id}`, data),
  
  updateStatus: (id: string, status: string) => 
    api.patch(`/crm/leads/${id}/status`, { status }),
  
  delete: (id: string) => api.delete(`/crm/leads/${id}`),
  
  getStats: () => api.get('/crm/dashboard/stats'),
};

// Deals API (CRM Module)
export const dealsApi = {
  getAll: () => api.get('/crm/deals'),
  
  getById: (id: string) => api.get(`/crm/deals/${id}`),
  
  create: (data: any) => api.post('/crm/deals', data),

  update: (id: string, data: any) => api.put(`/crm/deals/${id}`, data),
  
  delete: (id: string) => api.delete(`/crm/deals/${id}`),
};

// Contacts API (CRM Module)
export const contactsApi = {
  getAll: () => api.get('/crm/contacts'),
  
  getById: (id: string) => api.get(`/crm/contacts/${id}`),
  
  create: (data: any) => api.post('/crm/contacts', data),

  update: (id: string, data: any) => api.put(`/crm/contacts/${id}`, data),
  
  delete: (id: string) => api.delete(`/crm/contacts/${id}`),
};

// Activities API (CRM Module)
export const activitiesApi = {
  getAll: () => api.get('/crm/activities'),
  
  create: (data: any) => api.post('/crm/activities', data),

  update: (id: string, data: any) => api.put(`/crm/activities/${id}`, data),
};

// Inventory API (Supply Chain Module)
export const inventoryApi = {
  getAll: () => api.get('/supply-chain/inventory'),
  
  getById: (id: string) => api.get(`/supply-chain/inventory/${id}`),
  
  create: (data: {
    name: string;
    sku?: string;
    category?: string;
    quantity?: number;
    min_quantity?: number;
    unit_price?: number;
    supplier?: string;
  }) => api.post('/supply-chain/inventory', data),

  update: (id: string, data: any) => api.put(`/supply-chain/inventory/${id}`, data),
  
  delete: (id: string) => api.delete(`/supply-chain/inventory/${id}`),
  
  getStats: () => api.get('/supply-chain/dashboard/stats'),
};

// Payroll API
export const payrollApi = {
  // Salary Structures
  getStructures: () => api.get('/payroll/structures'),
  
  createStructure: (data: any) => api.post('/payroll/structures', data),
  
  // Salaries
  getSalaries: () => api.get('/payroll/salaries'),
  
  getSalary: (id: string) => api.get(`/payroll/salaries/${id}`),
  
  getEmployeeSalaries: (employeeId: string) => 
    api.get(`/payroll/salaries/employee/${employeeId}`),
  
  createSalary: (data: any) => api.post('/payroll/salaries', data),
  
  updateSalary: (id: string, data: any) => api.put(`/payroll/salaries/${id}`, data),
  
  // Tax Configs
  getTaxConfigs: () => api.get('/payroll/tax-configs'),
  
  getActiveTaxConfig: () => api.get('/payroll/tax-configs/active'),
  
  createTaxConfig: (data: any) => api.post('/payroll/tax-configs', data),
  
  // Payroll Runs
  getRuns: () => api.get('/payroll/runs'),
  
  getRun: (id: string) => api.get(`/payroll/runs/${id}`),
  
  createRun: (data: any) => api.post('/payroll/runs', data),
  
  approveRun: (id: string) => api.post(`/payroll/runs/${id}/approve`, {}),
  
  markPaid: (id: string) => api.post(`/payroll/runs/${id}/mark-paid`, {}),
  
  // Payslips
  getPayslips: (employeeId: string) => 
    api.get(`/payroll/payslips/employee/${employeeId}`),
  
  // Dashboard
  getDashboardStats: () => api.get('/payroll/dashboard/stats'),
};

// CRM Dashboard Stats
export const crmApi = {
  getDashboardStats: () => api.get('/crm/dashboard/stats'),
  
  // Companies
  getCompanies: () => api.get('/crm/companies'),
  
  createCompany: (data: any) => api.post('/crm/companies', data),
  
  updateCompany: (id: string, data: any) => api.put(`/crm/companies/${id}`, data),
  
  deleteCompany: (id: string) => api.delete(`/crm/companies/${id}`),
  
  // Leads
  getLeads: () => api.get('/crm/leads'),
  
  createLead: (data: any) => api.post('/crm/leads', data),
  
  updateLead: (id: string, data: any) => api.put(`/crm/leads/${id}`, data),
  
  deleteLead: (id: string) => api.delete(`/crm/leads/${id}`),
  
  // Deals
  getDeals: (page = 1, limit = 50) => api.get('/crm/deals', { params: { page, limit } }),
  
  createDeal: (data: any) => api.post('/crm/deals', data),
  
  updateDeal: (id: string, data: any) => api.put(`/crm/deals/${id}`, data),
  
  deleteDeal: (id: string) => api.delete(`/crm/deals/${id}`),
  
  // Activities
  getActivities: () => api.get('/crm/activities'),
  
  createActivity: (data: any) => api.post('/crm/activities', data),
  
  updateActivity: (id: string, data: any) => api.put(`/crm/activities/${id}`, data),

  // Contacts
  getContacts: (page = 1, limit = 50) => api.get('/crm/contacts', { params: { page, limit } }),
  
  getContact: (id: string) => api.get(`/crm/contacts/${id}`),
  
  createContact: (data: any) => api.post('/crm/contacts', data),
  
  updateContact: (id: string, data: any) => api.put(`/crm/contacts/${id}`, data),
  
  deleteContact: (id: string) => api.delete(`/crm/contacts/${id}`),
  
  // Social Accounts
  getSocialAccounts: () => api.get('/crm/social-accounts'),
  
  createSocialAccount: (data: any) => api.post('/crm/social-accounts', data),
  
  deleteSocialAccount: (id: string) => api.delete(`/crm/social-accounts/${id}`),
  
  // Campaigns
  getCampaigns: () => api.get('/crm/campaigns'),
  
  createCampaign: (data: any) => api.post('/crm/campaigns', data),
  
  updateCampaign: (id: string, data: any) => api.put(`/crm/campaigns/${id}`, data),
  
  deleteCampaign: (id: string) => api.delete(`/crm/campaigns/${id}`),
  
  // Tasks
  getTasks: () => api.get('/crm/tasks'),
  
  createTask: (data: any) => api.post('/crm/tasks', data),
  
  updateTask: (id: string, data: any) => api.put(`/crm/tasks/${id}`, data),
  
  deleteTask: (id: string) => api.delete(`/crm/tasks/${id}`),
  
  // Scheduled Posts
  getScheduledPosts: () => api.get('/crm/scheduled-posts'),
  
  createScheduledPost: (data: any) => api.post('/crm/scheduled-posts', data),
  
  deleteScheduledPost: (id: string) => api.delete(`/crm/scheduled-posts/${id}`),
};

// Supply Chain API
export const supplyChainApi = {
  // Products
  getProducts: () => api.get('/supply-chain/products'),
  
  getProduct: (id: string) => api.get(`/supply-chain/products/${id}`),
  
  createProduct: (data: any) => api.post('/supply-chain/products', data),
  
  updateProduct: (id: string, data: any) => api.put(`/supply-chain/products/${id}`, data),
  
  deleteProduct: (id: string) => api.delete(`/supply-chain/products/${id}`),
  
  // Inventory
  getInventory: () => api.get('/supply-chain/inventory'),
  
  getInventoryItem: (id: string) => api.get(`/supply-chain/inventory/${id}`),
  
  createInventoryItem: (data: any) => api.post('/supply-chain/inventory', data),
  
  updateInventoryItem: (id: string, data: any) => api.put(`/supply-chain/inventory/${id}`, data),
  
  deleteInventoryItem: (id: string) => api.delete(`/supply-chain/inventory/${id}`),
  
  // Vendors
  getVendors: () => api.get('/supply-chain/vendors'),
  
  createVendor: (data: any) => api.post('/supply-chain/vendors', data),
  
  updateVendor: (id: string, data: any) => api.put(`/supply-chain/vendors/${id}`, data),
  
  deleteVendor: (id: string) => api.delete(`/supply-chain/vendors/${id}`),
  
  // Dashboard
  getDashboardStats: () => api.get('/supply-chain/dashboard/stats'),
};

// Users API (for admin user management)
export const usersApi = {
  getAll: () => api.get('/users'),
  
  getById: (id: string) => api.get(`/users/${id}`),
  
  create: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
    department?: string;
    phone?: string;
  }) => api.post('/users', data),
  
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  
  delete: (id: string) => api.delete(`/users/${id}`),
  
  invite: (data: { email: string; role: string }) => api.post('/users/invite', data),
};

// Tenants API
export const tenantsApi = {
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country: string;
    plan: string;
  }) => api.post('/tenants/register', data),
  
  getAll: () => api.get('/tenants'),
  
  getById: (id: string) => api.get(`/tenants/${id}`),
  
  update: (id: string, data: any) => api.put(`/tenants/${id}`, data),
  
  getSettings: (id: string) => api.get(`/tenants/${id}/settings`),
  
  getModules: (id: string) => api.get(`/tenants/${id}/modules`),
};
