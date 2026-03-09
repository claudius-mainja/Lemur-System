import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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
  
  const organizationId = useAuthStore.getState().user?.organizationId;
  if (organizationId) {
    config.headers['X-Tenant-ID'] = organizationId;
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
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          const user = useAuthStore.getState().user;
          
          if (user && originalRequest.headers) {
            useAuthStore.getState().setAuth(user, accessToken, newRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
      } else {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string, organizationId?: string) =>
    api.post('/auth/login', { email, password, organizationId }),

  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationId: string;
  }) => api.post('/auth/register', data),

  logout: () => api.post('/auth/logout'),

  getProfile: () => api.get('/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/password/change', { currentPassword, newPassword }),

  forgotPassword: (email: string) => api.post('/auth/password/forgot', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/password/reset', { token, newPassword }),
};

export const tenantsApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    timezone?: string;
    currency?: string;
    language?: string;
    plan?: string;
  }) => api.post('/tenants/register', data),

  getAll: () => api.get('/tenants'),

  getById: (id: string) => api.get(`/tenants/${id}`),

  update: (id: string, data: any) => api.put(`/tenants/${id}`, data),

  getSettings: (id: string) => api.get(`/tenants/${id}/settings`),

  getModules: (id: string) => api.get(`/tenants/${id}/modules`),
};

export const hrApi = {
  getEmployees: (page = 1, limit = 10) =>
    api.get(`/hr/employees?page=${page}&limit=${limit}`),

  getEmployee: (id: string) => api.get(`/hr/employees/${id}`),

  createEmployee: (data: any) => api.post('/hr/employees', data),

  updateEmployee: (id: string, data: any) => api.put(`/hr/employees/${id}`, data),

  deleteEmployee: (id: string) => api.delete(`/hr/employees/${id}`),

  getDepartments: () => api.get('/hr/departments'),

  createDepartment: (data: any) => api.post('/hr/departments', data),

  getLeaveRequests: (employeeId?: string) =>
    api.get(`/hr/leave-requests${employeeId ? `?employeeId=${employeeId}` : ''}`),

  createLeaveRequest: (data: any) => api.post('/hr/leave-requests', data),

  approveLeaveRequest: (id: string) => api.put(`/hr/leave-requests/${id}/approve`),

  getLeaveBalances: () => api.get('/hr/leave-balances'),

  getLeaveTypes: () => api.get('/hr/leave-types'),

  getContracts: () => api.get('/hr/contracts'),
  getContract: (id: string) => api.get(`/hr/contracts/${id}`),
  createContract: (data: any) => api.post('/hr/contracts', data),
  updateContract: (id: string, data: any) => api.put(`/hr/contracts/${id}`, data),
  deleteContract: (id: string) => api.delete(`/hr/contracts/${id}`),
  signContract: (id: string, data: any) => api.post(`/hr/contracts/${id}/sign`, data),

  getDashboardStats: () => api.get('/hr/dashboard/stats'),
};

export const usersApi = {
  getCurrent: () => api.get('/users/me'),

  getAll: (page = 1, limit = 10) =>
    api.get(`/users?page=${page}&limit=${limit}`),

  getById: (id: string) => api.get(`/users/${id}`),

  update: (id: string, data: any) => api.put(`/users/${id}`, data),
};

export const financeApi = {
  // Accounts
  getAccounts: () => api.get('/finance/accounts'),
  createAccount: (data: any) => api.post('/finance/accounts', data),
  updateAccount: (id: string, data: any) => api.put(`/finance/accounts/${id}`, data),
  deleteAccount: (id: string) => api.delete(`/finance/accounts/${id}`),

  // Customers
  getCustomers: (page = 1, limit = 50) => api.get(`/finance/customers?page=${page}&limit=${limit}`),
  getCustomer: (id: string) => api.get(`/finance/customers/${id}`),
  createCustomer: (data: any) => api.post('/finance/customers', data),
  updateCustomer: (id: string, data: any) => api.put(`/finance/customers/${id}`, data),
  deleteCustomer: (id: string) => api.delete(`/finance/customers/${id}`),

  // Products
  getProducts: (page = 1, limit = 50) => api.get(`/finance/products?page=${page}&limit=${limit}`),
  getProduct: (id: string) => api.get(`/finance/products/${id}`),
  createProduct: (data: any) => api.post('/finance/products', data),
  updateProduct: (id: string, data: any) => api.put(`/finance/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/finance/products/${id}`),

  // Invoices
  getInvoices: (page = 1, limit = 50, status?: string) => 
    api.get(`/finance/invoices?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`),
  getInvoice: (id: string) => api.get(`/finance/invoices/${id}`),
  createInvoice: (data: any) => api.post('/finance/invoices', data),
  updateInvoice: (id: string, data: any) => api.put(`/finance/invoices/${id}`, data),
  deleteInvoice: (id: string) => api.delete(`/finance/invoices/${id}`),
  sendInvoice: (id: string) => api.post(`/finance/invoices/${id}/send`),
  markAsPaid: (id: string) => api.post(`/finance/invoices/${id}/mark-paid`),

  // Quotations
  getQuotations: (page = 1, limit = 50, status?: string) => 
    api.get(`/finance/quotations?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`),
  getQuotation: (id: string) => api.get(`/finance/quotations/${id}`),
  createQuotation: (data: any) => api.post('/finance/quotations', data),
  updateQuotation: (id: string, data: any) => api.put(`/finance/quotations/${id}`, data),
  deleteQuotation: (id: string) => api.delete(`/finance/quotations/${id}`),
  convertToInvoice: (id: string) => api.post(`/finance/quotations/${id}/convert-to-invoice`),

  // Receipts
  getReceipts: (page = 1, limit = 50) => api.get(`/finance/receipts?page=${page}&limit=${limit}`),
  getReceipt: (id: string) => api.get(`/finance/receipts/${id}`),
  createReceipt: (data: any) => api.post('/finance/receipts', data),
  updateReceipt: (id: string, data: any) => api.put(`/finance/receipts/${id}`, data),
  deleteReceipt: (id: string) => api.delete(`/finance/receipts/${id}`),

  // Sales
  getSales: (page = 1, limit = 50) => api.get(`/finance/sales?page=${page}&limit=${limit}`),
  getSale: (id: string) => api.get(`/finance/sales/${id}`),
  createSale: (data: any) => api.post('/finance/sales', data),
  deleteSale: (id: string) => api.delete(`/finance/sales/${id}`),

  // Credit Notes
  getCreditNotes: (page = 1, limit = 50) => api.get(`/finance/credit-notes?page=${page}&limit=${limit}`),
  getCreditNote: (id: string) => api.get(`/finance/credit-notes/${id}`),
  createCreditNote: (data: any) => api.post('/finance/credit-notes', data),

  // Expenses
  getExpenses: (page = 1, limit = 50, category?: string) => 
    api.get(`/finance/expenses?page=${page}&limit=${limit}${category ? `&category=${category}` : ''}`),
  getExpense: (id: string) => api.get(`/finance/expenses/${id}`),
  createExpense: (data: any) => api.post('/finance/expenses', data),
  updateExpense: (id: string, data: any) => api.put(`/finance/expenses/${id}`, data),
  deleteExpense: (id: string) => api.delete(`/finance/expenses/${id}`),

  // Payments
  getPayments: (page = 1, limit = 50) => api.get(`/finance/payments?page=${page}&limit=${limit}`),
  createPayment: (data: any) => api.post('/finance/payments', data),

  // Reports
  getDashboardStats: () => api.get('/finance/dashboard/stats'),
  getIncomeExpenseReport: (startDate: string, endDate: string) => 
    api.get(`/finance/reports/income-expense?startDate=${startDate}&endDate=${endDate}`),
  getProfitLossReport: (startDate: string, endDate: string) => 
    api.get(`/finance/reports/profit-loss?startDate=${startDate}&endDate=${endDate}`),
  getBalanceSheet: () => api.get('/finance/reports/balance-sheet'),
};

export const crmApi = {
  getContacts: (page = 1, limit = 50) => api.get(`/crm/contacts?page=${page}&limit=${limit}`),
  getContact: (id: string) => api.get(`/crm/contacts/${id}`),
  createContact: (data: any) => api.post('/crm/contacts', data),
  updateContact: (id: string, data: any) => api.put(`/crm/contacts/${id}`, data),
  deleteContact: (id: string) => api.delete(`/crm/contacts/${id}`),

  getDeals: (page = 1, limit = 50) => api.get(`/crm/deals?page=${page}&limit=${limit}`),
  createDeal: (data: any) => api.post('/crm/deals', data),
  updateDeal: (id: string, data: any) => api.put(`/crm/deals/${id}`, data),
  deleteDeal: (id: string) => api.delete(`/crm/deals/${id}`),

  getSocialAccounts: () => api.get('/crm/social-accounts'),
  createSocialAccount: (data: any) => api.post('/crm/social-accounts', data),
  deleteSocialAccount: (id: string) => api.delete(`/crm/social-accounts/${id}`),

  getScheduledPosts: () => api.get('/crm/scheduled-posts'),
  createScheduledPost: (data: any) => api.post('/crm/scheduled-posts', data),
  deleteScheduledPost: (id: string) => api.delete(`/crm/scheduled-posts/${id}`),

  getDashboardStats: () => api.get('/crm/dashboard/stats'),
};

export const payrollApi = {
  getEmployees: () => api.get('/payroll/employees'),
  getEmployee: (id: string) => api.get(`/payroll/employees/${id}`),
  createEmployee: (data: any) => api.post('/payroll/employees', data),
  updateEmployee: (id: string, data: any) => api.put(`/payroll/employees/${id}`, data),

  getPayrollRuns: (page = 1, limit = 50) => api.get(`/payroll/runs?page=${page}&limit=${limit}`),
  createPayrollRun: (data: any) => api.post('/payroll/runs', data),
  processPayrollRun: (id: string) => api.post(`/payroll/runs/${id}/process`),

  getPayslips: (employeeId?: string) => 
    api.get(`/payroll/payslips${employeeId ? `?employeeId=${employeeId}` : ''}`),

  getBanks: () => api.get('/payroll/banks'),
  getDashboardStats: () => api.get('/payroll/dashboard/stats'),
};

export const emailApi = {
  getEmails: (page = 1, limit = 50, folder?: string) => 
    api.get(`/email/emails?page=${page}&limit=${limit}${folder ? `&folder=${folder}` : ''}`),
  getEmail: (id: string) => api.get(`/email/emails/${id}`),
  sendEmail: (data: any) => api.post('/email/emails', data),
  deleteEmail: (id: string) => api.delete(`/email/emails/${id}`),
  getTemplates: () => api.get('/email/templates'),
  createTemplate: (data: any) => api.post('/email/templates', data),
};

export const documentsApi = {
  getDocuments: (folder?: string) => 
    api.get(`/documents${folder ? `?folder=${folder}` : ''}`),
  getDocument: (id: string) => api.get(`/documents/${id}`),
  uploadDocument: (file: File, data: {
    name?: string;
    description?: string;
    type?: string;
    folder?: string;
  }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.type) formData.append('type', data.type);
    if (data.folder) formData.append('folder', data.folder);
    return api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  downloadDocument: (id: string) => api.get(`/documents/${id}/download`, { responseType: 'blob' }),
  deleteDocument: (id: string) => api.delete(`/documents/${id}`),
};
