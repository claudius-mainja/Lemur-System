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

interface StoredUser {
  email: string;
  password: string;
  user: User;
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
  demoLogin: () => void;
  login: (email: string, password: string) => { success: boolean; error?: string };
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
  }) => { success: boolean; error?: string };
}

const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

const getStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('erp-users');
  return stored ? JSON.parse(stored) : [];
};

const saveUser = (user: StoredUser) => {
  const users = getStoredUsers();
  const existingIndex = users.findIndex(u => u.email === user.email);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem('erp-users', JSON.stringify(users));
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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

      demoLogin: () => {
        const demoUser: User = {
          id: generateId(),
          email: 'demo@lemursystem.com',
          firstName: 'Demo',
          lastName: 'User',
          role: 'admin',
          organizationId: generateId(),
          organizationName: 'Demo Company',
          industry: 'technology',
          subscription: 'professional',
          modules: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain'],
          currency: 'ZAR',
          timezone: 'Africa/Johannesburg',
          country: 'ZA',
          isOnTrial: true,
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        set({
          user: demoUser,
          accessToken: 'demo-token-' + generateId(),
          refreshToken: 'demo-refresh-' + generateId(),
          isAuthenticated: true,
          isLoading: false,
        });
      },

      login: (email: string, password: string) => {
        const users = getStoredUsers();
        const foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const accessToken = generateId();
          const refreshToken = generateId();
          set({
            user: foundUser.user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        }
        
        return { success: false, error: 'Invalid email or password' };
      },

      register: (data) => {
        const users = getStoredUsers();
        
        if (users.find(u => u.email === data.email)) {
          return { success: false, error: 'User with this email already exists' };
        }

        const organizationId = generateId();
        const modules = [...PLAN_CONFIG[data.plan].modules];
        
        const newUser: User = {
          id: generateId(),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'admin',
          organizationId,
          organizationName: data.organizationName,
          industry: data.industry,
          subscription: data.plan,
          modules,
          currency: data.currency,
          timezone: 'Africa/Johannesburg',
          country: data.country,
          isOnTrial: true,
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };

        saveUser({ email: data.email, password: data.password, user: newUser });

        const accessToken = generateId();
        const refreshToken = generateId();
        set({
          user: newUser,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
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
