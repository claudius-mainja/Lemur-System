'use client';

import { useState, useEffect } from 'react';
import { useStore as useZustandStore } from 'zustand';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/services/api';

export type Industry = 'technology' | 'retail' | 'manufacturing' | 'healthcare' | 'education' | 'finance' | 'construction' | 'hospitality' | 'transportation' | 'agriculture' | 'mining' | 'telecommunications' | 'realestate' | 'legal' | 'consulting' | 'other';
export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';
export type UserRole = 'admin' | 'super_admin' | 'hr' | 'finance' | 'manager' | 'employee' | 'accountant' | 'ordinary';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'settings', 'users'],
  super_admin: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'settings', 'users', 'dashboard'],
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
  full_name?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
  organization?: string;
  organization_id?: string;
  organization_name?: string;
  organizationName?: string;
  industry?: Industry;
  subscription?: SubscriptionPlan;
  modules: string[];
  user_groups?: string[];
  currency?: string;
  timezone?: string;
  country?: string;
  isOnTrial?: boolean;
  trialEndsAt?: string;
  isActive?: boolean;
  is_active?: boolean;
  phone?: string;
  serverTime?: string;
  extra_users?: number;
  extra_users_cost?: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  serverTime: string | null;
  hasHydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (userData: Partial<User>) => void;
  setServerTime: (time: string) => void;
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
  setHasHydrated: (state: boolean) => void;
}

const mapApiUser = (apiUser: any): User => ({
  id: apiUser.id,
  email: apiUser.email,
  first_name: apiUser.first_name,
  last_name: apiUser.last_name,
  full_name: apiUser.full_name || `${apiUser.first_name} ${apiUser.last_name}`,
  firstName: apiUser.first_name,
  lastName: apiUser.last_name,
  role: (apiUser.role as UserRole) || 'admin',
  department: apiUser.department,
  organization: apiUser.organization || apiUser.organization_id,
  organization_id: apiUser.organization_id || apiUser.organization,
  organization_name: apiUser.organization_name || (apiUser.organization && typeof apiUser.organization === 'object' ? apiUser.organization.name : undefined),
  organizationName: apiUser.organization_name || (apiUser.organization && typeof apiUser.organization === 'object' ? apiUser.organization.name : undefined),
  industry: apiUser.industry || 'other',
  subscription: apiUser.subscription || apiUser.plan || 'starter',
  modules: apiUser.modules || [],
  user_groups: apiUser.user_groups || [],
  currency: apiUser.currency || 'USD',
  timezone: apiUser.timezone || 'UTC',
  country: apiUser.country || 'US',
  isOnTrial: apiUser.is_on_trial || true,
  trialEndsAt: apiUser.trial_ends_at,
  isActive: apiUser.is_active,
  phone: apiUser.phone,
  extra_users: apiUser.extra_users || 0,
  extra_users_cost: apiUser.extra_users_cost || 0,
});

const STORAGE_VERSION = 'v2';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      serverTime: null,
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

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

      setServerTime: (time) => set({ serverTime: time }),

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
          localStorage.removeItem(`erp-auth-${STORAGE_VERSION}`);
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
            const serverTime = data.server_time || new Date().toISOString();
            set({
              user: { ...user, serverTime },
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              isAuthenticated: true,
              isLoading: false,
              serverTime,
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
            let user = mapApiUser(loginData.user);
            
            const modulesFromPlan = [...(PLAN_CONFIG[data.plan as SubscriptionPlan]?.modules || [])];
            user = { ...user, modules: modulesFromPlan };
            
            const serverTime = loginData.server_time || new Date().toISOString();
            set({
              user: { ...user, serverTime },
              accessToken: loginData.access_token,
              refreshToken: loginData.refresh_token,
              isAuthenticated: true,
              isLoading: false,
              serverTime,
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
      name: `erp-auth-${STORAGE_VERSION}`,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        serverTime: state.serverTime,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

export function useHydratedAuth() {
  const store = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (store.hasHydrated) {
      setHydrated(true);
    }
  }, [store.hasHydrated]);

  return { ...store, hydrated };
}
