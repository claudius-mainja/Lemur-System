import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Industry = 'technology' | 'retail' | 'manufacturing' | 'healthcare' | 'education' | 'finance' | 'construction' | 'hospitality' | 'transportation' | 'agriculture' | 'mining' | 'telecommunications' | 'realestate' | 'legal' | 'consulting' | 'other';
export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';

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
    features: ['email_support', 'priority_support', 'basic_reporting', 'advanced_analytics', 'mobile_app', 'api_access', 'custom_integrations', 'sso'],
    storageGB: 100,
  },
  enterprise: {
    name: 'Enterprise',
    price: null,
    maxUsers: null,
    modules: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'email', 'documents'],
    features: ['email_support', 'priority_support', 'dedicated_support_24_7', 'basic_reporting', 'advanced_analytics', 'custom_reporting', 'mobile_app', 'api_access', 'custom_integrations', 'sso', 'advanced_security', 'dedicated_account_manager', 'on_premise', 'sla_guarantee', 'custom_training'],
    storageGB: null,
  },
} as const;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
  organizationId: string;
  organizationName: string;
  industry: Industry;
  subscription: SubscriptionPlan;
  modules: string[];
  currency: string;
  timezone: string;
  country: string;
  isOnTrial: boolean;
  trialEndsAt?: string;
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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

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

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),
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
