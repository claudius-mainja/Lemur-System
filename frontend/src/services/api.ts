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

// Employees API (HR Module)
export const employeesApi = {
  getAll: () => api.get('/employees'),
  
  getById: (id: string) => api.get(`/employees/${id}`),
  
  create: (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    department?: string;
    position?: string;
    start_date?: string;
    salary?: number;
  }) => api.post('/employees', data),

  update: (id: string, data: any) => api.put(`/employees/${id}`, data),
  
  delete: (id: string) => api.delete(`/employees/${id}`),
  
  getStats: () => api.get('/employees/stats/summary'),
};

// Customers API (Finance Module)
export const customersApi = {
  getAll: () => api.get('/customers'),
  
  getById: (id: string) => api.get(`/customers/${id}`),
  
  create: (data: {
    name: string;
    company?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    service_type?: string;
  }) => api.post('/customers', data),

  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  
  delete: (id: string) => api.delete(`/customers/${id}`),
};

// Products API (Finance Module)
export const productsApi = {
  getAll: () => api.get('/products'),
  
  getById: (id: string) => api.get(`/products/${id}`),
  
  create: (data: {
    name: string;
    sku?: string;
    description?: string;
    category?: string;
    type?: string;
    unit_price?: number;
    quantity?: number;
    min_quantity?: number;
  }) => api.post('/products', data),

  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Invoices API (Finance Module)
export const invoicesApi = {
  getAll: () => api.get('/invoices'),
  
  getById: (id: string) => api.get(`/invoices/${id}`),
  
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
  }) => api.post('/invoices', data),

  update: (id: string, data: any) => api.put(`/invoices/${id}`, data),
  
  updateStatus: (id: string, status: string) => 
    api.patch(`/invoices/${id}/status`, { status }),
  
  delete: (id: string) => api.delete(`/invoices/${id}`),
  
  getStats: () => api.get('/invoices/stats/summary'),
};

// Leads API (CRM Module)
export const leadsApi = {
  getAll: () => api.get('/leads'),
  
  getById: (id: string) => api.get(`/leads/${id}`),
  
  create: (data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    source?: string;
    value?: number;
    notes?: string;
  }) => api.post('/leads', data),

  update: (id: string, data: any) => api.put(`/leads/${id}`, data),
  
  updateStatus: (id: string, status: string) => 
    api.patch(`/leads/${id}/status`, { status }),
  
  delete: (id: string) => api.delete(`/leads/${id}`),
  
  getStats: () => api.get('/leads/stats/summary'),
};

// Inventory API (Supply Chain Module)
export const inventoryApi = {
  getAll: () => api.get('/inventory'),
  
  getById: (id: string) => api.get(`/inventory/${id}`),
  
  create: (data: {
    name: string;
    sku?: string;
    category?: string;
    quantity?: number;
    min_quantity?: number;
    unit_price?: number;
    supplier?: string;
  }) => api.post('/inventory', data),

  update: (id: string, data: any) => api.put(`/inventory/${id}`, data),
  
  delete: (id: string) => api.delete(`/inventory/${id}`),
  
  getStats: () => api.get('/inventory/stats/summary'),
};

// Payroll API
export const payrollApi = {
  getAll: () => api.get('/payroll'),
  
  getById: (id: string) => api.get(`/payroll/${id}`),
  
  create: (data: {
    employee_id: string;
    employee_name: string;
    basic_salary: number;
    deductions?: number;
    bonuses?: number;
    pay_date?: string;
  }) => api.post('/payroll', data),

  update: (id: string, data: any) => api.put(`/payroll/${id}`, data),
  
  delete: (id: string) => api.delete(`/payroll/${id}`),
  
  getStats: () => api.get('/payroll/stats/summary'),
};

// Leave Requests API (HR Module)
export const leaveApi = {
  getAll: () => api.get('/leave-requests'),
  
  getById: (id: string) => api.get(`/leave-requests/${id}`),
  
  create: (data: {
    employee_id: string;
    employee_name: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    days: number;
    reason?: string;
  }) => api.post('/leave-requests', data),

  update: (id: string, data: any) => api.put(`/leave-requests/${id}`, data),
  
  updateStatus: (id: string, status: string) => 
    api.patch(`/leave-requests/${id}/status`, { status }),
  
  delete: (id: string) => api.delete(`/leave-requests/${id}`),
  
  getStats: () => api.get('/leave-requests/stats/summary'),
};
