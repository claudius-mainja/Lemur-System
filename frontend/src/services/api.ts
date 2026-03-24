import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  if (config.url && !config.url.endsWith('/')) {
    config.url = config.url + '/';
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string | null) => {
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(api(originalRequest));
              } else {
                reject(error);
              }
            },
            reject: (err: Error) => {
              reject(err);
            },
          });
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh/`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          const { access_token, refresh_token, user } = response.data;
          
          useAuthStore.getState().setAuth(user, access_token, refresh_token);
          processQueue(null, access_token);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          
          isRefreshing = false;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error);
          isRefreshing = false;
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        isRefreshing = false;
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
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
  }) => api.post('/auth/register/', data),

  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),

  logout: () => api.post('/auth/logout/'),

  getMe: () => api.get('/auth/me/'),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh/', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    }),
};

// HR API
export const hrApi = {
  // Employees
  getEmployees: (page = 1, limit = 50) => 
    api.get('/hr/employees/', { params: { page, limit } }),
  
  getEmployee: (id: string) => api.get(`/hr/employees/${id}/`),
  
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
  }) => api.post('/hr/employees/', {
    first_name: data.first_name || data.firstName,
    last_name: data.last_name || data.lastName,
    email: data.email,
    phone: data.phone,
    department: data.department || data.departmentId,
    position: data.position,
    hire_date: data.hire_date || data.hireDate,
    salary: data.salary,
  }),

  updateEmployee: (id: string, data: any) => api.put(`/hr/employees/${id}/`, data),
  
  deleteEmployee: (id: string) => api.delete(`/hr/employees/${id}/`),
  
  terminateEmployee: (id: string, data: any) => api.post(`/hr/employees/${id}/terminate/`, data),
  
  // Departments
  getDepartments: () => api.get('/hr/departments/'),
  
  createDepartment: (data: { name: string; description?: string }) => 
    api.post('/hr/departments/', data),

  updateDepartment: (id: string, data: any) => api.put(`/hr/departments/${id}/`, data),
  
  deleteDepartment: (id: string) => api.delete(`/hr/departments/${id}/`),
  
  // Leave Requests (uses 'leaves' endpoint)
  getLeaveRequests: () => api.get('/hr/leaves/'),
  
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
  }) => api.post('/hr/leaves/', {
    employee_id: data.employee_id || data.employeeId,
    leave_type: data.leave_type || data.leaveType,
    start_date: data.start_date || data.startDate,
    end_date: data.end_date || data.endDate,
    days: data.days,
    reason: data.reason,
  }),

  approveLeaveRequest: (id: string) => api.post(`/hr/leaves/${id}/approve/`),
  
  rejectLeaveRequest: (id: string) => api.post(`/hr/leaves/${id}/reject/`),
  
  // Leave Balances
  getLeaveBalances: () => api.get('/hr/leave-balances/'),
  
  createLeaveBalance: (data: any) => api.post('/hr/leave-balances/', data),
  
  // Attendance
  getAttendance: () => api.get('/hr/attendance/'),
  
  recordAttendance: (data: any) => api.post('/hr/attendance/', data),
  
  // Stats
  getStats: () => api.get('/hr/employees/'),
  
  // Leave
  getLeave: () => api.get('/hr/leaves/'),
  
  createLeave: (data: any) => api.post('/hr/leaves/', data),
  
  updateLeave: (id: string, data: any) => api.put(`/hr/leaves/${id}/`, data),
  
  // Contracts (stored locally for now)
  getContracts: () => Promise.resolve({ data: { data: [] } }),
};

// Employees API (HR Module)
export const employeesApi = {
  getAll: () => api.get('/hr/employees/'),
  
  getById: (id: string) => api.get(`/hr/employees/${id}/`),
  
  create: (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    department?: string;
    position?: string;
    start_date?: string;
    salary?: number;
  }) => api.post('/hr/employees/', data),

  update: (id: string, data: any) => api.put(`/hr/employees/${id}/`, data),
  
  delete: (id: string) => api.delete(`/hr/employees/${id}/`),
  
  getStats: () => api.get('/hr/employees/'),
};

// Leave API
export const leaveApi = {
  getAll: () => api.get('/hr/leaves/'),
  
  getById: (id: string) => api.get(`/hr/leaves/${id}/`),
  
  create: (data: {
    employee_id: string;
    employee_name: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    days: number;
    reason?: string;
  }) => api.post('/hr/leaves/', data),

  update: (id: string, data: any) => api.put(`/hr/leaves/${id}/`, data),
  
  updateStatus: (id: string, status: string) => 
    api.post(`/hr/leaves/${id}/approve/`, { status }),
  
  delete: (id: string) => api.delete(`/hr/leaves/${id}/`),
  
  getStats: () => api.get('/hr/leaves/'),
};

// Finance API
export const financeApi = {
  // Accounts
  getAccounts: () => api.get('/finance/accounts/'),
  
  createAccount: (data: any) => api.post('/finance/accounts/', data),
  
  // Invoices
  getInvoices: (page = 1, limit = 50, status?: string) => api.get('/finance/invoices/', { params: { page, limit, status } }),
  
  getInvoice: (id: string) => api.get(`/finance/invoices/${id}/`),
  
  createInvoice: (data: any) => api.post('/finance/invoices/', data),
  
  updateInvoice: (id: string, data: any) => api.put(`/finance/invoices/${id}/`, data),
  
  sendInvoice: (id: string) => api.post(`/finance/invoices/${id}/send/`, {}),
  
  cancelInvoice: (id: string) => api.post(`/finance/invoices/${id}/void/`, {}),
  
  // Quotations
  getQuotations: (page = 1, limit = 50) => api.get('/finance/quotations/', { params: { page, limit } }),
  
  createQuotation: (data: any) => api.post('/finance/quotations/', data),
  
  updateQuotation: (id: string, data: any) => api.put(`/finance/quotations/${id}/`, data),
  
  deleteQuotation: (id: string) => api.delete(`/finance/quotations/${id}/`),
  
  // Expenses
  getExpenses: (page = 1, limit = 50) => api.get('/finance/expenses/', { params: { page, limit } }),
  
  createExpense: (data: any) => api.post('/finance/expenses/', data),
  
  updateExpense: (id: string, data: any) => api.put(`/finance/expenses/${id}/`, data),
  
  deleteExpense: (id: string) => api.delete(`/finance/expenses/${id}/`),
  
  // Dashboard
  getDashboardStats: () => api.get('/finance/dashboard/'),
  
  // Reports
  generateReport: (data: any) => api.post('/finance/accounts/', data),
  
  // Customers (in finance module)
  getCustomers: (page = 1, limit = 50) => api.get('/finance/customers/', { params: { page, limit } }),
  
  createCustomer: (data: any) => api.post('/finance/customers/', data),
  
  updateCustomer: (id: string, data: any) => api.put(`/finance/customers/${id}/`, data),
  
  deleteCustomer: (id: string) => api.delete(`/finance/customers/${id}/`),
  
  // Products (in inventory module)
  getProducts: (page = 1, limit = 50) => api.get('/inventory/products/', { params: { page, limit } }),
  
  createProduct: (data: any) => api.post('/inventory/products/', data),
  
  updateProduct: (id: string, data: any) => api.put(`/inventory/products/${id}/`, data),
  
  deleteProduct: (id: string) => api.delete(`/inventory/products/${id}/`),
  
  // Bills
  getReceipts: (page = 1, limit = 50) => api.get('/finance/bills/', { params: { page, limit } }),
  
  createReceipt: (data: any) => api.post('/finance/bills/', data),
  
  updateReceipt: (id: string, data: any) => api.put(`/finance/bills/${id}/`, data),
  
  deleteReceipt: (id: string) => api.delete(`/finance/bills/${id}/`),
  
  // Sales
  getSales: (page = 1, limit = 50) => api.get('/finance/invoices/', { params: { page, limit } }),
};

// Customers API (Finance Module)
export const customersApi = {
  getAll: () => api.get('/finance/customers/'),
  
  getById: (id: string) => api.get(`/finance/customers/${id}/`),
  
  create: (data: {
    name: string;
    company?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    service_type?: string;
  }) => api.post('/finance/customers/', data),

  update: (id: string, data: any) => api.put(`/finance/customers/${id}/`, data),
  
  delete: (id: string) => api.delete(`/finance/customers/${id}/`),

  toggleActive: (id: string) => api.post(`/finance/customers/${id}/toggle_active/`),

  getTransactions: (id: string) => api.get(`/finance/customers/${id}/transactions/`),
};

// Products API (Inventory Module)
export const productsApi = {
  getAll: () => api.get('/inventory/products/'),
  
  getById: (id: string) => api.get(`/inventory/products/${id}/`),
  
  create: (data: {
    name: string;
    sku?: string;
    description?: string;
    category?: string;
    type?: string;
    unit_price?: number;
    quantity?: number;
    min_quantity?: number;
  }) => api.post('/inventory/products/', data),

  update: (id: string, data: any) => api.put(`/inventory/products/${id}/`, data),
  
  delete: (id: string) => api.delete(`/inventory/products/${id}/`),
};

// Invoices API (Finance Module)
export const invoicesApi = {
  getAll: () => api.get('/finance/invoices/'),
  
  getById: (id: string) => api.get(`/finance/invoices/${id}/`),
  
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
  }) => api.post('/finance/invoices/', data),

  update: (id: string, data: any) => api.put(`/finance/invoices/${id}/`, data),
  
  updateStatus: (id: string, status: string) => 
    api.post(`/finance/invoices/${id}/void/`, { status }),
  
  delete: (id: string) => api.delete(`/finance/invoices/${id}/`),
  
  getStats: () => api.get('/finance/dashboard/'),

  sendEmail: (id: string, emailSubject: string, emailBody: string) =>
    api.post(`/finance/invoices/${id}/send_email/`, {
      email_subject: emailSubject,
      email_body: emailBody,
    }),

  voidInvoice: (id: string, reason?: string) =>
    api.post(`/finance/invoices/${id}/void/`, { reason }),
};

// Quotations API (Finance Module)
export const quotationsApi = {
  getAll: () => api.get('/finance/quotations/'),
  
  getById: (id: string) => api.get(`/finance/quotations/${id}/`),
  
  create: (data: any) => api.post('/finance/quotations/', data),

  update: (id: string, data: any) => api.put(`/finance/quotations/${id}/`, data),
  
  delete: (id: string) => api.delete(`/finance/quotations/${id}/`),

  sendEmail: (id: string, emailSubject: string, emailBody: string) =>
    api.post(`/finance/quotations/${id}/send_email/`, {
      email_subject: emailSubject,
      email_body: emailBody,
    }),

  accept: (id: string) => api.post(`/finance/quotations/${id}/accept/`),

  reject: (id: string, reason: string) =>
    api.post(`/finance/quotations/${id}/reject/`, { reason }),

  convertToInvoice: (id: string, dueDate?: string) =>
    api.post(`/finance/quotations/${id}/convert_to_invoice/`, { due_date: dueDate }),
};

// Leads API (CRM Module)
export const leadsApi = {
  getAll: () => api.get('/crm/leads/'),
  
  getById: (id: string) => api.get(`/crm/leads/${id}/`),
  
  create: (data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    source?: string;
    value?: number;
    notes?: string;
  }) => api.post('/crm/leads/', data),

  update: (id: string, data: any) => api.put(`/crm/leads/${id}/`, data),
  
  updateStatus: (id: string, status: string) => 
    api.patch(`/crm/leads/${id}/`, { status }),
  
  delete: (id: string) => api.delete(`/crm/leads/${id}/`),
  
  getStats: () => api.get('/crm/analytics/'),
};

// Deals API (CRM Module) - uses opportunities endpoint
export const dealsApi = {
  getAll: () => api.get('/crm/opportunities/'),
  
  getById: (id: string) => api.get(`/crm/opportunities/${id}/`),
  
  create: (data: any) => api.post('/crm/opportunities/', data),

  update: (id: string, data: any) => api.put(`/crm/opportunities/${id}/`, data),
  
  delete: (id: string) => api.delete(`/crm/opportunities/${id}/`),
};

// Contacts API (CRM Module)
export const contactsApi = {
  getAll: () => api.get('/crm/contacts/'),
  
  getById: (id: string) => api.get(`/crm/contacts/${id}/`),
  
  create: (data: any) => api.post('/crm/contacts/', data),

  update: (id: string, data: any) => api.put(`/crm/contacts/${id}/`, data),
  
  delete: (id: string) => api.delete(`/crm/contacts/${id}/`),
};

// Activities API (CRM Module)
export const activitiesApi = {
  getAll: () => api.get('/crm/lead-activities/'),
  
  create: (data: any) => api.post('/crm/lead-activities/', data),

  update: (id: string, data: any) => api.put(`/crm/lead-activities/${id}/`, data),
};

// Inventory API (Supply Chain Module)
export const inventoryApi = {
  getAll: () => api.get('/inventory/products/'),
  
  getById: (id: string) => api.get(`/inventory/products/${id}/`),
  
  create: (data: {
    name: string;
    sku?: string;
    category?: string;
    quantity?: number;
    min_quantity?: number;
    unit_price?: number;
    supplier?: string;
  }) => api.post('/inventory/products/', data),

  update: (id: string, data: any) => api.put(`/inventory/products/${id}/`, data),
  
  delete: (id: string) => api.delete(`/inventory/products/${id}/`),
  
  getStats: () => api.get('/inventory/stock/'),
};

// Payroll API
export const payrollApi = {
  // Salary Structures
  getStructures: () => api.get('/payroll/salary-components/'),
  
  createStructure: (data: any) => api.post('/payroll/salary-components/', data),
  
  // Salaries
  getSalaries: () => api.get('/payroll/employee-salaries/'),
  
  getSalary: (id: string) => api.get(`/payroll/employee-salaries/${id}/`),
  
  getEmployeeSalaries: (employeeId: string) => 
    api.get(`/payroll/employee-salaries/`, { params: { employee: employeeId } }),
  
  createSalary: (data: any) => api.post('/payroll/employee-salaries/', data),
  
  updateSalary: (id: string, data: any) => api.put(`/payroll/employee-salaries/${id}/`, data),
  
  // Tax Configs
  getTaxConfigs: () => api.get('/payroll/tax-brackets/'),
  
  getActiveTaxConfig: () => api.get('/payroll/tax-brackets/', { params: { is_active: true } }),
  
  createTaxConfig: (data: any) => api.post('/payroll/tax-brackets/', data),
  
  // Payroll Runs
  getRuns: () => api.get('/payroll/runs/'),
  
  getRun: (id: string) => api.get(`/payroll/runs/${id}/`),
  
  createRun: (data: any) => api.post('/payroll/runs/', data),
  
  approveRun: (id: string) => api.post(`/payroll/runs/${id}/approve/`),
  
  markPaid: (id: string) => api.post(`/payroll/payslips/${id}/`),
  
  // Payroll Records
  getPayroll: (params?: { employee_id?: string; status?: string }) => 
    api.get('/payroll/payslips/', { params }),
  
  getPayrollRecord: (id: string) => api.get(`/payroll/payslips/${id}/`),
  
  createPayroll: (data: {
    employee_id: string;
    employee_name: string;
    basic_salary: number;
    allowances?: number;
    overtime?: number;
    bonuses?: number;
    pay_period: string;
    pay_date?: string;
  }) => api.post('/payroll/payslips/', data),
  
  updatePayroll: (id: string, data: any) => api.put(`/payroll/payslips/${id}/`, data),
  
  processAllPayroll: (pay_period: string) => api.post('/payroll/runs/', { pay_period }),
  
  // Payslips
  getPayslips: (params?: { employee_id?: string; pay_period?: string }) => 
    api.get('/payroll/payslips/', { params }),
  
  getPayslip: (id: string) => api.get(`/payroll/payslips/${id}/`),
  
  getEmployeePayslips: (employeeId: string) => 
    api.get('/payroll/payslips/', { params: { employee: employeeId } }),
  
  sendPayslip: (id: string) => api.post(`/payroll/payslips/${id}/`),
  
  // Summary
  getSummary: (pay_period?: string) => api.get('/payroll/runs/'),
  
  // Dashboard
  getDashboardStats: () => api.get('/payroll/runs/'),
};

// CRM Dashboard Stats
export const crmApi = {
  getDashboardStats: () => api.get('/crm/analytics/'),
  
  // Companies
  getCompanies: () => api.get('/crm/contacts/'),
  
  createCompany: (data: any) => api.post('/crm/contacts/', data),
  
  updateCompany: (id: string, data: any) => api.put(`/crm/contacts/${id}/`, data),
  
  deleteCompany: (id: string) => api.delete(`/crm/contacts/${id}/`),
  
  // Leads
  getLeads: () => api.get('/crm/leads/'),
  
  createLead: (data: any) => api.post('/crm/leads/', data),
  
  updateLead: (id: string, data: any) => api.put(`/crm/leads/${id}/`, data),
  
  deleteLead: (id: string) => api.delete(`/crm/leads/${id}/`),
  
  // Deals
  getDeals: (page = 1, limit = 50) => api.get('/crm/opportunities/', { params: { page, limit } }),
  
  createDeal: (data: any) => api.post('/crm/opportunities/', data),
  
  updateDeal: (id: string, data: any) => api.put(`/crm/opportunities/${id}/`, data),
  
  deleteDeal: (id: string) => api.delete(`/crm/opportunities/${id}/`),
  
  // Activities
  getActivities: () => api.get('/crm/lead-activities/'),
  
  createActivity: (data: any) => api.post('/crm/lead-activities/', data),
  
  updateActivity: (id: string, data: any) => api.put(`/crm/lead-activities/${id}/`, data),

  // Contacts
  getContacts: (page = 1, limit = 50) => api.get('/crm/contacts/', { params: { page, limit } }),
  
  getContact: (id: string) => api.get(`/crm/contacts/${id}/`),
  
  createContact: (data: any) => api.post('/crm/contacts/', data),
  
  updateContact: (id: string, data: any) => api.put(`/crm/contacts/${id}/`, data),
  
  deleteContact: (id: string) => api.delete(`/crm/contacts/${id}/`),
};

// Supply Chain API
export const supplyChainApi = {
  // Products
  getProducts: () => api.get('/inventory/products/'),
  
  getProduct: (id: string) => api.get(`/inventory/products/${id}/`),
  
  createProduct: (data: any) => api.post('/inventory/products/', data),
  
  updateProduct: (id: string, data: any) => api.put(`/inventory/products/${id}/`, data),
  
  deleteProduct: (id: string) => api.delete(`/inventory/products/${id}/`),
  
  // Inventory
  getInventory: () => api.get('/inventory/stock/'),
  
  getInventoryItem: (id: string) => api.get(`/inventory/stock/${id}/`),
  
  createInventoryItem: (data: any) => api.post('/inventory/stock/', data),
  
  updateInventoryItem: (id: string, data: any) => api.put(`/inventory/stock/${id}/`, data),
  
  deleteInventoryItem: (id: string) => api.delete(`/inventory/stock/${id}/`),
  
  // Vendors
  getVendors: () => api.get('/inventory/vendors/'),
  
  createVendor: (data: any) => api.post('/inventory/vendors/', data),
  
  updateVendor: (id: string, data: any) => api.put(`/inventory/vendors/${id}/`, data),
  
  deleteVendor: (id: string) => api.delete(`/inventory/vendors/${id}/`),
  
  // Dashboard
  getDashboardStats: () => api.get('/inventory/stock/'),
};

// Users API (for admin user management)
export const usersApi = {
  getAll: () => api.get('/auth/users/'),
  
  getById: (id: string) => api.get(`/auth/users/${id}/`),
  
  create: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
    department?: string;
    phone?: string;
  }) => api.post('/auth/users/', data),
  
  update: (id: string, data: any) => api.put(`/auth/users/${id}/`, data),
  
  delete: (id: string) => api.delete(`/auth/users/${id}/`),
  
  invite: (data: { email: string; role: string }) => api.post('/auth/users/', data),
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
  }) => api.post('/auth/register/', data),
  
  getAll: () => api.get('/superadmin/tenants/'),
  
  getById: (id: string) => api.get(`/superadmin/tenants/${id}/`),
  
  update: (id: string, data: any) => api.put(`/superadmin/tenants/${id}/`, data),
  
  getSettings: (id: string) => api.get(`/superadmin/tenants/${id}/`),
  
  getModules: (id: string) => api.get(`/superadmin/tenants/${id}/`),
};

// Productivity API
export const productivityApi = {
  // Events (Meetings)
  getMeetings: (params?: { start_date?: string; end_date?: string }) => 
    api.get('/productivity/events/', { params }),
  
  getMeeting: (id: string) => api.get(`/productivity/events/${id}/`),
  
  createMeeting: (data: {
    title: string;
    description?: string;
    meeting_type?: string;
    location?: string;
    meeting_link?: string;
    start_time: string;
    end_time: string;
    attendee_ids?: string;
    attendee_emails?: string;
    reminder?: number;
  }) => api.post('/productivity/events/', data),
  
  updateMeeting: (id: string, data: any) => api.put(`/productivity/events/${id}/`, data),
  
  deleteMeeting: (id: string) => api.delete(`/productivity/events/${id}/`),
  
  // Calendar Events
  getCalendarEvents: (params?: { start_date?: string; end_date?: string }) => 
    api.get('/productivity/events/', { params }),
  
  getCalendarEvent: (id: string) => api.get(`/productivity/events/${id}/`),
  
  createCalendarEvent: (data: {
    title: string;
    description?: string;
    event_type?: string;
    start_date: string;
    end_date: string;
    all_day?: boolean;
    location?: string;
    reminder?: number;
    color?: string;
    attendees?: string;
  }) => api.post('/productivity/events/', data),
  
  updateCalendarEvent: (id: string, data: any) => api.put(`/productivity/events/${id}/`, data),
  
  deleteCalendarEvent: (id: string) => api.delete(`/productivity/events/${id}/`),
  
  // Tasks
  getTasks: (params?: { status?: string; assigned_to?: string }) => 
    api.get('/productivity/tasks/', { params }),
  
  createTask: (data: {
    title: string;
    description?: string;
    project_id?: string;
    priority?: string;
    due_date?: string;
  }) => api.post('/productivity/tasks/', data),
  
  updateTask: (id: string, data: any) => api.put(`/productivity/tasks/${id}/`, data),
  
  completeTask: (id: string) => api.post(`/productivity/tasks/${id}/complete/`),
  
  deleteTask: (id: string) => api.delete(`/productivity/tasks/${id}/`),
  
  // Projects
  getProjects: () => api.get('/productivity/projects/'),
  
  getProject: (id: string) => api.get(`/productivity/projects/${id}/`),
  
  createProject: (data: {
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    budget?: number;
  }) => api.post('/productivity/projects/', data),
  
  updateProject: (id: string, data: any) => api.put(`/productivity/projects/${id}/`, data),
  
  deleteProject: (id: string) => api.delete(`/productivity/projects/${id}/`),
  
  // Stats
  getStats: () => api.get('/productivity/tasks/'),
};

// Currency API
export const currencyApi = {
  getSupportedCurrencies: () => api.get('/currencies'),
  
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => 
    api.post('/currency/convert', { amount, from_currency: fromCurrency, to_currency: toCurrency }),
  
  getServerTime: () => api.get('/time'),
};

// Finance API extras
export const financeApiExtra = {
  // Quotations
  getQuotations: (params?: { page?: number; limit?: number }) => 
    api.get('/finance/quotations/', { params }),
  
  createQuotation: (data: any) => api.post('/finance/quotations/', data),
  
  updateQuotation: (id: string, data: any) => api.put(`/finance/quotations/${id}/`, data),
  
  deleteQuotation: (id: string) => api.delete(`/finance/quotations/${id}/`),
  
  // Payments
  getPayments: () => api.get('/finance/bank-accounts/'),
  
  createPayment: (data: {
    invoice_id?: string;
    amount: number;
    payment_method?: string;
    reference?: string;
  }) => api.post('/finance/bank-accounts/', data),
  
  // Expenses
  getExpenses: () => api.get('/finance/expenses/'),
  
  createExpense: (data: {
    category: string;
    description?: string;
    amount: number;
    currency?: string;
    date?: string;
    vendor?: string;
  }) => api.post('/finance/expenses/', data),
  
  // Transactions
  getTransactions: () => api.get('/finance/journal-entries/'),
  
  createTransaction: (data: {
    type: string;
    category?: string;
    description?: string;
    amount: number;
    currency?: string;
    date?: string;
    reference?: string;
  }) => api.post('/finance/journal-entries/', data),
};

// Documents API
export const documentsApi = {
  getAll: () => api.get('/productivity/documents/'),
  
  getById: (id: string) => api.get(`/productivity/documents/${id}/`),
  
  create: (data: {
    title: string;
    description?: string;
    doc_type?: string;
    file_name?: string;
    file_path?: string;
    file_size?: number;
    mime_type?: string;
    version?: string;
    is_public?: boolean;
    folder?: string;
    tags?: string[];
  }) => api.post('/productivity/documents/', data),

  update: (id: string, data: any) => api.put(`/productivity/documents/${id}/`, data),
  
  delete: (id: string) => api.delete(`/productivity/documents/${id}/`),
  
  getFolders: () => api.get('/productivity/folders/'),
};

// Marketing API
export const marketingApi = {
  // Email Templates
  getEmailTemplates: () => api.get('/marketing/email-templates'),
  
  getEmailTemplate: (id: string) => api.get(`/marketing/email-templates/${id}`),
  
  createEmailTemplate: (data: {
    name: string;
    subject?: string;
    content?: string;
    html_content?: string;
    category?: string;
  }) => api.post('/marketing/email-templates', data),

  updateEmailTemplate: (id: string, data: any) => api.put(`/marketing/email-templates/${id}`, data),
  
  deleteEmailTemplate: (id: string) => api.delete(`/marketing/email-templates/${id}`),

  // Audience Segments
  getAudiences: () => api.get('/marketing/audiences'),
  
  getAudience: (id: string) => api.get(`/marketing/audiences/${id}`),
  
  createAudience: (data: {
    name: string;
    description?: string;
    criteria?: any;
  }) => api.post('/marketing/audiences', data),

  updateAudience: (id: string, data: any) => api.put(`/marketing/audiences/${id}`, data),
  
  deleteAudience: (id: string) => api.delete(`/marketing/audiences/${id}`),

  // Email Campaigns
  getCampaigns: () => api.get('/marketing/campaigns'),
  
  getCampaign: (id: string) => api.get(`/marketing/campaigns/${id}`),
  
  createCampaign: (data: {
    name: string;
    subject?: string;
    template_id?: string;
    audience_id?: string;
    scheduled_at?: string;
    status?: string;
  }) => api.post('/marketing/campaigns', data),

  updateCampaign: (id: string, data: any) => api.put(`/marketing/campaigns/${id}`, data),
  
  deleteCampaign: (id: string) => api.delete(`/marketing/campaigns/${id}`),
  
  sendCampaign: (id: string) => api.post(`/marketing/campaigns/${id}/send`, {}),
  
  scheduleCampaign: (id: string, scheduledAt: string) => 
    api.post(`/marketing/campaigns/${id}/schedule`, { scheduled_at: scheduledAt }),

  // Workflows
  getWorkflows: () => api.get('/marketing/workflows'),
  
  getWorkflow: (id: string) => api.get(`/marketing/workflows/${id}`),
  
  createWorkflow: (data: {
    name: string;
    description?: string;
    trigger_type?: string;
    is_active?: boolean;
  }) => api.post('/marketing/workflows', data),

  updateWorkflow: (id: string, data: any) => api.put(`/marketing/workflows/${id}`, data),
  
  deleteWorkflow: (id: string) => api.delete(`/marketing/workflows/${id}`),

  // Landing Pages
  getLandingPages: () => api.get('/marketing/landing-pages'),
  
  getLandingPage: (id: string) => api.get(`/marketing/landing-pages/${id}`),
  
  createLandingPage: (data: {
    name: string;
    url?: string;
    content?: string;
    is_published?: boolean;
  }) => api.post('/marketing/landing-pages', data),

  updateLandingPage: (id: string, data: any) => api.put(`/marketing/landing-pages/${id}`, data),
  
  deleteLandingPage: (id: string) => api.delete(`/marketing/landing-pages/${id}`),

  // Form Templates
  getFormTemplates: () => api.get('/marketing/form-templates'),
  
  getFormTemplate: (id: string) => api.get(`/marketing/form-templates/${id}`),
  
  createFormTemplate: (data: {
    name: string;
    fields?: any;
    webhook_url?: string;
  }) => api.post('/marketing/form-templates', data),

  updateFormTemplate: (id: string, data: any) => api.put(`/marketing/form-templates/${id}`, data),
  
  deleteFormTemplate: (id: string) => api.delete(`/marketing/form-templates/${id}`),

  // Marketing Assets
  getAssets: () => api.get('/marketing/assets'),
  
  getAsset: (id: string) => api.get(`/marketing/assets/${id}`),
  
  createAsset: (data: {
    name: string;
    asset_type?: string;
    url?: string;
    file_size?: number;
    tags?: string[];
  }) => api.post('/marketing/assets', data),

  updateAsset: (id: string, data: any) => api.put(`/marketing/assets/${id}`, data),
  
  deleteAsset: (id: string) => api.delete(`/marketing/assets/${id}`),

  // A/B Tests
  getABTests: () => api.get('/marketing/ab-tests'),
  
  getABTest: (id: string) => api.get(`/marketing/ab-tests/${id}`),
  
  createABTest: (data: {
    name: string;
    campaign_id?: string;
    variant_a?: string;
    variant_b?: string;
    split_percentage?: number;
  }) => api.post('/marketing/ab-tests', data),

  updateABTest: (id: string, data: any) => api.put(`/marketing/ab-tests/${id}`, data),
  
  deleteABTest: (id: string) => api.delete(`/marketing/ab-tests/${id}`),
  
  startABTest: (id: string) => api.post(`/marketing/ab-tests/${id}/start`, {}),
};

// Services API (Help Desk / Support)
export const servicesApi = {
  // Tickets
  getTickets: (params?: { status?: string; priority?: string }) => 
    api.get('/services/tickets/', { params }),
  
  getTicket: (id: string) => api.get(`/services/tickets/${id}/`),
  
  createTicket: (data: {
    subject: string;
    description?: string;
    priority?: string;
    category?: string;
    customer_id?: string;
    customer_name?: string;
    customer_email?: string;
  }) => api.post('/services/tickets/', data),

  updateTicket: (id: string, data: any) => api.put(`/services/tickets/${id}/`, data),
  
  closeTicket: (id: string) => api.post(`/services/tickets/${id}/close/`, {}),
  
  reopenTicket: (id: string) => api.post(`/services/tickets/${id}/reopen/`, {}),
  
  deleteTicket: (id: string) => api.delete(`/services/tickets/${id}/`),

  // Ticket Replies
  getTicketReplies: (ticketId: string) => api.get(`/services/tickets/${ticketId}/`),
  
  createTicketReply: (ticketId: string, data: {
    content: string;
    is_internal?: boolean;
  }) => api.post(`/services/tickets/${ticketId}/reply/`, data),

  // SLA Configs
  getSLAConfigs: () => api.get('/services/sla-configs/'),
  
  getSLAConfig: (id: string) => api.get(`/services/sla-configs/${id}/`),
  
  createSLAConfig: (data: {
    name: string;
    response_time_hours?: number;
    resolution_time_hours?: number;
    priority?: string;
  }) => api.post('/services/sla-configs/', data),

  updateSLAConfig: (id: string, data: any) => api.put(`/services/sla-configs/${id}/`, data),
  
  deleteSLAConfig: (id: string) => api.delete(`/services/sla-configs/${id}/`),

  // Knowledge Base Categories
  getKBCategories: () => api.get('/services/kb-categories/'),
  
  getKBCategory: (id: string) => api.get(`/services/kb-categories/${id}/`),
  
  createKBCategory: (data: {
    name: string;
    description?: string;
    parent_id?: string;
  }) => api.post('/services/kb-categories/', data),

  updateKBCategory: (id: string, data: any) => api.put(`/services/kb-categories/${id}/`, data),
  
  deleteKBCategory: (id: string) => api.delete(`/services/kb-categories/${id}/`),

  // Knowledge Base Articles
  getKBArticles: (params?: { category_id?: string }) => 
    api.get('/services/kb-articles/', { params }),
  
  getKBArticle: (id: string) => api.get(`/services/kb-articles/${id}/`),
  
  createKBArticle: (data: {
    title: string;
    content: string;
    category_id?: string;
    status?: string;
    tags?: string[];
  }) => api.post('/services/kb-articles/', data),

  updateKBArticle: (id: string, data: any) => api.put(`/services/kb-articles/${id}/`, data),
  
  deleteKBArticle: (id: string) => api.delete(`/services/kb-articles/${id}/`),

  // Escalation Rules
  getEscalationRules: () => api.get('/services/escalation-rules/'),
  
  getEscalationRule: (id: string) => api.get(`/services/escalation-rules/${id}/`),
  
  createEscalationRule: (data: {
    name: string;
    trigger_type?: string;
    trigger_value?: string;
    action_type?: string;
    action_target?: string;
    is_active?: boolean;
  }) => api.post('/services/escalation-rules/', data),

  updateEscalationRule: (id: string, data: any) => api.put(`/services/escalation-rules/${id}/`, data),
  
  deleteEscalationRule: (id: string) => api.delete(`/services/escalation-rules/${id}/`),

  // Service Reports
  getReports: (params?: { start_date?: string; end_date?: string }) => 
    api.get('/services/reports/', { params }),
  
  getReport: (id: string) => api.get(`/services/reports/${id}/`),
  
  createReport: (data: {
    name: string;
    report_type?: string;
    start_date?: string;
    end_date?: string;
    metrics?: any;
  }) => api.post('/services/reports/', data),

  updateReport: (id: string, data: any) => api.put(`/services/reports/${id}/`, data),
  
  deleteReport: (id: string) => api.delete(`/services/reports/${id}/`),

  // Satisfaction Surveys
  getSurveys: () => api.get('/services/surveys/'),
  
  getSurvey: (id: string) => api.get(`/services/surveys/${id}/`),
  
  createSurvey: (data: {
    name: string;
    questions?: any;
    is_active?: boolean;
  }) => api.post('/services/surveys/', data),

  updateSurvey: (id: string, data: any) => api.put(`/services/surveys/${id}/`, data),
  
  deleteSurvey: (id: string) => api.delete(`/services/surveys/${id}/`),
  
  sendSurvey: (id: string, ticketId: string) => 
    api.post(`/services/surveys/${id}/`, { ticket_id: ticketId }),
};

// Super Admin API
export const superadminApi = {
  // Dashboard Stats
  getDashboardStats: () => api.get('/superadmin/stats/dashboard/'),
  
  // Available Modules
  getModules: () => api.get('/superadmin/stats/modules/'),
  
  // Users Management
  getUsers: (page = 1, limit = 20) => 
    api.get('/superadmin/users/', { params: { page, limit } }),
  
  getUser: (id: string) => api.get(`/superadmin/users/${id}/`),
  
  createUser: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
    modules?: string[];
    department?: string;
    phone?: string;
  }) => api.post('/superadmin/users/', data),

  updateUser: (id: string, data: any) => api.put(`/superadmin/users/${id}/`, data),
  
  deleteUser: (id: string) => api.delete(`/superadmin/users/${id}/`),

  // Tenants Management
  getTenants: (page = 1, limit = 20) => 
    api.get('/superadmin/tenants/', { params: { page, limit } }),
  
  getTenant: (id: string) => api.get(`/superadmin/tenants/${id}/`),
  
  createTenant: (data: {
    name: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    industry?: string;
    country?: string;
    currency?: string;
    plan_code?: string;
  }) => api.post('/superadmin/tenants/', data),

  updateTenant: (id: string, data: any) => api.put(`/superadmin/tenants/${id}/`, data),
  
  deleteTenant: (id: string) => api.delete(`/superadmin/tenants/${id}/`),

  // Subscription Plans
  getPlans: () => api.get('/superadmin/subscription-plans/'),
  
  createPlan: (data: {
    name: string;
    code: string;
    description?: string;
    modules: string[];
    features: string[];
    price_monthly: number;
    price_yearly: number;
    max_users: number;
    max_storage_gb: number;
  }) => api.post('/superadmin/subscription-plans/', data),

  updatePlan: (id: string, data: any) => api.put(`/superadmin/subscription-plans/${id}/`, data),

  // User Groups
  getUserGroups: () => api.get('/superadmin/user-groups/'),
  
  createUserGroup: (data: {
    name: string;
    description?: string;
    permissions?: string[];
    modules?: string[];
  }) => api.post('/superadmin/user-groups/', data),

  updateUserGroup: (id: string, data: any) => api.put(`/superadmin/user-groups/${id}/`, data),
  
  deleteUserGroup: (id: string) => api.delete(`/superadmin/user-groups/${id}/`),

  // Module Permissions
  getModulePermissions: () => api.get('/superadmin/module-permissions/'),
  
  updateModulePermission: (id: string, data: any) => 
    api.put(`/superadmin/module-permissions/${id}/`, data),

  // Audit Logs
  getAuditLogs: (page = 1, limit = 50) => 
    api.get('/superadmin/audit-logs/', { params: { page, limit } }),
};

// Automation API
export const automationApi = {
  // Automation Settings
  getSettings: () => api.get('/automation/settings/'),
  
  getSetting: (id: string) => api.get(`/automation/settings/${id}/`),
  
  createSetting: (data: {
    module: string;
    setting_name: string;
    setting_key: string;
    value?: any;
    is_automated?: boolean;
    is_enabled?: boolean;
    schedule?: any;
    notification?: any;
  }) => api.post('/automation/settings/', data),

  updateSetting: (id: string, data: any) => api.put(`/automation/settings/${id}/`, data),
  
  deleteSetting: (id: string) => api.delete(`/automation/settings/${id}/`),
  
  toggleAutomated: (id: string) => api.post(`/automation/settings/${id}/toggle_automated/`),
  
  toggleEnabled: (id: string) => api.post(`/automation/settings/${id}/toggle_enabled/`),

  // Workflows
  getWorkflows: () => api.get('/automation/workflows/'),
  
  getWorkflow: (id: string) => api.get(`/automation/workflows/${id}/`),
  
  createWorkflow: (data: {
    name: string;
    description?: string;
    module: string;
    trigger_type?: string;
    trigger_config?: any;
    actions?: any[];
    conditions?: any[];
    is_automated?: boolean;
  }) => api.post('/automation/workflows/', data),

  updateWorkflow: (id: string, data: any) => api.put(`/automation/workflows/${id}/`, data),
  
  deleteWorkflow: (id: string) => api.delete(`/automation/workflows/${id}/`),
  
  activateWorkflow: (id: string) => api.post(`/automation/workflows/${id}/activate/`),
  
  pauseWorkflow: (id: string) => api.post(`/automation/workflows/${id}/pause/`),
  
  runWorkflow: (id: string) => api.post(`/automation/workflows/${id}/run/`),
  
  toggleWorkflowAutomated: (id: string) => api.post(`/automation/workflows/${id}/toggle_automated/`),

  // Workflow Logs
  getWorkflowLogs: () => api.get('/automation/workflow-logs/'),
  
  getWorkflowLog: (id: string) => api.get(`/automation/workflow-logs/${id}/`),

  // Scheduled Tasks
  getScheduledTasks: () => api.get('/automation/scheduled-tasks/'),
  
  getScheduledTask: (id: string) => api.get(`/automation/scheduled-tasks/${id}/`),
  
  createScheduledTask: (data: {
    name: string;
    task_type: string;
    module?: string;
    config?: any;
    cron_expression?: string;
    interval_minutes?: number;
    is_automated?: boolean;
  }) => api.post('/automation/scheduled-tasks/', data),

  updateScheduledTask: (id: string, data: any) => api.put(`/automation/scheduled-tasks/${id}/`, data),
  
  deleteScheduledTask: (id: string) => api.delete(`/automation/scheduled-tasks/${id}/`),
  
  toggleTaskActive: (id: string) => api.post(`/automation/scheduled-tasks/${id}/toggle_active/`),
  
  toggleTaskAutomated: (id: string) => api.post(`/automation/scheduled-tasks/${id}/toggle_automated/`),
  
  runScheduledTask: (id: string) => api.post(`/automation/scheduled-tasks/${id}/run/`),

  // Notification Templates
  getNotificationTemplates: () => api.get('/automation/notification-templates/'),
  
  getNotificationTemplate: (id: string) => api.get(`/automation/notification-templates/${id}/`),
  
  createNotificationTemplate: (data: {
    name: string;
    template_type: string;
    subject: string;
    body: string;
    variables?: string[];
  }) => api.post('/automation/notification-templates/', data),

  updateNotificationTemplate: (id: string, data: any) => api.put(`/automation/notification-templates/${id}/`, data),
  
  deleteNotificationTemplate: (id: string) => api.delete(`/automation/notification-templates/${id}/`),

  // Dashboard
  getDashboardStats: () => api.get('/automation/dashboard/stats/'),
  
  getModules: () => api.get('/automation/dashboard/modules/'),
};

// Organization API
export const organizationApi = {
  getOrganization: () => api.get('/auth/organization/'),
  
  updateOrganization: (data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    currency?: string;
  }) => api.put('/auth/organization/', data),

  getOrganizationStats: () => api.get('/auth/stats/'),
};

// Admin API
export const adminApi = {
  // Users
  getUsers: () => api.get('/auth/users/'),
  
  getUser: (id: string) => api.get(`/auth/users/${id}/`),
  
  createUser: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
    department?: string;
    phone?: string;
    modules?: string[];
    user_groups?: string[];
  }) => api.post('/auth/users/', data),

  updateUser: (id: string, data: any) => api.put(`/auth/users/${id}/`, data),
  
  deleteUser: (id: string) => api.delete(`/auth/users/${id}/`),

  // User Groups
  getUserGroups: () => api.get('/auth/user-groups/'),
  
  getUserGroup: (id: string) => api.get(`/auth/user-groups/${id}/`),
  
  createUserGroup: (data: {
    name: string;
    description?: string;
    module?: string;
    permissions?: any;
    modules_access?: string[];
  }) => api.post('/auth/user-groups/', data),

  updateUserGroup: (id: string, data: any) => api.put(`/auth/user-groups/${id}/`, data),
  
  deleteUserGroup: (id: string) => api.delete(`/auth/user-groups/${id}/`),
  
  addUserToGroup: (groupId: string, userId: string) => 
    api.post(`/auth/user-groups/${groupId}/add-user/`, { user_id: userId }),
  
  removeUserFromGroup: (groupId: string, userId: string) => 
    api.post(`/auth/user-groups/${groupId}/remove-user/`, { user_id: userId }),

  // Audit Logs
  getAuditLogs: () => api.get('/auth/audit-logs/'),

  // Subscription
  getSubscriptionPlans: () => api.get('/auth/subscription-plans/'),
  
  purchaseExtraUsers: (extraUsers: number) => 
    api.post('/auth/purchase-extra-users/', { extra_users: extraUsers }),
};

// Profile API
export const profileApi = {
  getProfile: () => api.get('/auth/me/'),
  
  updateProfile: (data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    department?: string;
  }) => api.put('/auth/me/update/', data),
};
