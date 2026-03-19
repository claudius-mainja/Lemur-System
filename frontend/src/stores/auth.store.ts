import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, employeesApi } from '@/services/api';

export type Industry = 'technology' | 'retail' | 'manufacturing' | 'healthcare' | 'education' | 'finance' | 'construction' | 'hospitality' | 'transportation' | 'agriculture' | 'mining' | 'telecommunications' | 'realestate' | 'legal' | 'consulting' | 'other';
export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';
export type UserRole = 'admin' | 'hr' | 'finance' | 'manager' | 'employee' | 'accountant' | 'ordinary';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'settings', 'users'],
  hr: ['hr', 'productivity'],
  finance: ['finance', 'payroll'],
  accountant: ['finance', 'reports'],
  manager: ['hr', 'finance', 'crm', 'productivity'],
  employee: ['productivity', 'profile'],
  ordinary: ['profile'],
};

export const PLAN_CONFIG = {
  starter: {
    name: 'Starter',
    price: 10.60,
    maxUsers: 6,
    modules: ['hr', 'finance', 'supply-chain'],
    features: ['email_support', 'basic_reporting', 'mobile_app'],
    storageGB: 10,
  },
  professional: {
    name: 'Professional',
    price: 20.50,
    maxUsers: 50,
    modules: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain'],
    features: ['email_support', 'priority_support', 'basic_reporting', 'advanced_analytics', 'mobile_app', 'api_access', 'custom_integrations', 'ss0'],
    storageGB: 100,
  },
  enterprise: {
    name: 'Enterprise',
    price: null,
    maxUsers: null,
    modules: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'email', 'documents'],
    features: ['email_support', 'priority_support', 'dedicated_support_24_7', 'basic_reporting', 'advanced_analytics', 'custom_reporting', 'mobile_app', 'api_access', 'custom_integrations', 'ss0', 'advanced_security', 'dedicated_account_manager', 'on_premise', 'sla_guarantee', 'custom_training'],
    storageGB: null,
  },
} as const;

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
  organization_id?: string;
  organization_name?: string;
  organizationName?: string;
  industry?: Industry;
  subscription?: SubscriptionPlan;
  modules: string[];
  currency?: string;
  timezone?: string;
  country?: string;
  isOnTrial?: boolean;
  trialEndsAt?: string;
  isActive?: boolean;
  is_active?: boolean;
  phone?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (userData: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName: string;
    industry: Industry;
    country: string;
    currency: string;
    plan: SubscriptionPlan;
  }) => Promise<{ success: boolean; error?: string }>;
  clearAuth: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

const mapApiUser = (apiUser: any): User => ({
  id: apiUser.id,
  email: apiUser.email,
  first_name: apiUser.first_name,
  last_name: apiUser.last_name,
  firstName: apiUser.first_name,
  lastName: apiUser.last_name,
  role: (apiUser.role as UserRole) || 'admin',
  department: apiUser.department,
  organization_id: apiUser.organization_id,
  organization_name: apiUser.organization_name,
  organizationName: apiUser.organization_name,
  industry: apiUser.industry || 'other',
  subscription: apiUser.subscription || apiUser.plan || 'starter',
  modules: ROLE_PERMISSIONS[apiUser.role as UserRole] || ROLE_PERMISSIONS.employee,
  currency: apiUser.currency || 'ZAR',
  timezone: 'Africa/Johannesburg',
  country: apiUser.country || 'ZA',
  isOnTrial: apiUser.is_on_trial || true,
  trialEndsAt: apiUser.trial_ends_at,
  isActive: apiUser.is_active,
  phone: apiUser.phone,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        }),

      setUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      logout: () => {
        try {
          authApi.logout();
        } catch (e) {
          // Ignore logout API errors
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('erp-auth');
          localStorage.removeItem('erp-users');
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(email, password);
          const data = response.data;
          
          if (data.access_token) {
            const user = mapApiUser(data.user);
            set({
              user,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
          }
          
          return { success: false, error: 'Invalid response from server' };
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.detail || error.response?.data?.message || 'Login failed. Please check your credentials.';
          return { success: false, error: message };
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          // Register the user
          const response = await authApi.register({
            email: data.email,
            password: data.password,
            first_name: data.firstName,
            last_name: data.lastName,
            organization_name: data.organizationName,
            industry: data.industry,
            country: data.country,
            currency: data.currency,
            plan: data.plan,
          });
          
          const loginData = response.data;
          
          if (loginData.access_token) {
            const user = mapApiUser(loginData.user);
            set({
              user,
              accessToken: loginData.access_token,
              refreshToken: loginData.refresh_token,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
          }
          
          return { success: false, error: 'Registration response invalid' };
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.detail || error.response?.data?.message || 'Registration failed. Please try again.';
          return { success: false, error: message };
        }
      },
    }),
    {
      name: 'erp-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
