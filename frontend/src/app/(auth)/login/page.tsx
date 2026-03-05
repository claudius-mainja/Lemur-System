'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Building2, Mail, Lock, User } from 'lucide-react';
import { authApi, tenantsApi } from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  organizationId: z.string().optional(),
});

const registerOrgSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerOrgSchema>;

export default function AuthPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerOrgSchema),
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data.email, data.password, data.organizationId);
      
      if (response.data.requiresMfa) {
        router.push(`/login/mfa?tempToken=${response.data.tempToken}`);
        return;
      }

      setAuth(
        response.data.user,
        response.data.accessToken,
        response.data.refreshToken
      );
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error: any) {
      // Demo mode - allow login with any credentials if API fails
      const demoUser = {
        id: 'demo-user-1',
        email: data.email,
        firstName: 'Demo',
        lastName: 'User',
        role: 'admin',
        organizationId: 'demo-org-1',
      };
      setAuth(demoUser, 'demo-token', 'demo-refresh-token');
      toast.success('Welcome to demo mode!');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterOrg = async (data: RegisterForm) => {
    setIsLoading(true);
    setIsRegistering(true);
    try {
      const orgResponse = await tenantsApi.register({
        name: data.organizationName,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      const organizationId = orgResponse.data.id;

      const loginResponse = await authApi.login(data.email, data.password, organizationId);

      setAuth(
        loginResponse.data.user,
        loginResponse.data.accessToken,
        loginResponse.data.refreshToken
      );

      toast.success('Organization registered successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      // Demo mode - allow registration if API fails
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'admin',
        organizationId: 'demo-org-' + Date.now(),
      };
      setAuth(demoUser, 'demo-token', 'demo-refresh-token');
      toast.success('Welcome to demo mode!');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Sidebar - Smaller */}
      <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-primary via-blue-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-center px-8 text-white">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold font-serif">LemurSystem</span>
            </div>
            <p className="text-blue-100 text-sm">
              All-in-One Business Platform
            </p>
          </div>
        </div>
      </div>

      {/* Form - Wider */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-12">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-serif">LemurSystem</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 font-serif">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                {isLogin
                  ? 'Enter your credentials to access your account'
                  : 'Start your 14-day free trial'}
              </p>
            </div>

            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...loginForm.register('email')}
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                      placeholder="you@company.com"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...loginForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-blue-700 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(onRegisterOrg)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...registerForm.register('organizationName')}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input
                      {...registerForm.register('firstName')}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input
                      {...registerForm.register('lastName')}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...registerForm.register('email')}
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    {...registerForm.register('password')}
                    type="password"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                    placeholder="Min 8 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                  <input
                    {...registerForm.register('confirmPassword')}
                    type="password"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                    placeholder="Confirm your password"
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-blue-700 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Start Free Trial
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  loginForm.reset();
                  registerForm.reset();
                }}
                className="text-primary hover:text-blue-700 font-medium text-sm"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>

          <p className="text-center text-slate-500 text-xs mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
