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

  getDashboardStats: () => api.get('/hr/dashboard/stats'),
};

export const usersApi = {
  getCurrent: () => api.get('/users/me'),

  getAll: (page = 1, limit = 10) =>
    api.get(`/users?page=${page}&limit=${limit}`),

  getById: (id: string) => api.get(`/users/${id}`),

  update: (id: string, data: any) => api.put(`/users/${id}`, data),
};
