'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Building2, Mail, Lock, User, Check, Briefcase, Heart, ShoppingBag, Factory, Laptop, Wallet, GraduationCap, Truck, Hotel } from 'lucide-react';
import { useAuthStore, Industry, SubscriptionPlan } from '@/stores/auth.store';
import toast from 'react-hot-toast';

const industries: { id: Industry; name: string; icon: any; description: string }[] = [
  { id: 'technology', name: 'Technology', icon: Laptop, description: 'Software, IT, SaaS' },
  { id: 'finance', name: 'Finance', icon: Wallet, description: 'Banking, Insurance, Accounting' },
  { id: 'healthcare', name: 'Healthcare', icon: Heart, description: 'Hospitals, Clinics, Pharma' },
  { id: 'retail', name: 'Retail', icon: ShoppingBag, description: 'E-commerce, Stores, Wholesale' },
  { id: 'manufacturing', name: 'Manufacturing', icon: Factory, description: 'Production, Factories' },
  { id: 'education', name: 'Education', icon: GraduationCap, description: 'Schools, Universities' },
  { id: 'logistics', name: 'Logistics', icon: Truck, description: 'Transportation, Shipping' },
  { id: 'hospitality', name: 'Hospitality', icon: Hotel, description: 'Hotels, Restaurants' },
];

const plans: { id: SubscriptionPlan; name: string; price: string; features: string[] }[] = [
  { 
    id: 'starter', 
    name: 'Starter', 
    price: '$29/mo',
    features: ['Up to 10 employees', 'Basic HR features', 'Simple Invoicing', 'Email Support']
  },
  { 
    id: 'professional', 
    name: 'Professional', 
    price: '$99/mo',
    features: ['Up to 100 employees', 'All HR features', 'Advanced Finance', 'CRM & Marketing', 'Priority Support']
  },
  { 
    id: 'enterprise', 
    name: 'Enterprise', 
    price: '$299/mo',
    features: ['Unlimited employees', 'Full Suite', 'Custom Integrations', 'Dedicated Support', 'Advanced Analytics']
  },
];

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerOrgSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  industry: z.string().min(1, 'Please select an industry'),
  plan: z.string().min(1, 'Please select a plan'),
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
  const [step, setStep] = useState<'login' | 'register' | 'industry' | 'plan'>('login');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerOrgSchema),
    defaultValues: {
      industry: '',
      plan: '',
    }
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const demoUser = {
        id: 'demo-user-1',
        email: data.email,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        organizationId: 'demo-org-1',
        organizationName: 'Demo Organization',
        industry: 'technology' as Industry,
        subscription: 'enterprise' as SubscriptionPlan,
        modules: ['hr', 'finance', 'supply-chain', 'crm', 'payroll'],
      };
      setAuth(demoUser, 'demo-token', 'demo-refresh-token');
      toast.success('Welcome back!');
      router.push('/dashboard/hr');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterOrg = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'admin',
        organizationId: 'demo-org-' + Date.now(),
        organizationName: data.organizationName,
        industry: data.industry as Industry,
        subscription: data.plan as SubscriptionPlan,
        modules: data.plan === 'starter' ? ['hr', 'finance'] : 
                 data.plan === 'professional' ? ['hr', 'finance', 'crm'] : 
                 ['hr', 'finance', 'supply-chain', 'crm', 'payroll'],
      };
      setAuth(demoUser, 'demo-token', 'demo-refresh-token');
      toast.success(`Welcome to ${data.organizationName}!`);
      router.push('/dashboard/hr');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'industry') {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
          <div className="w-full max-w-3xl">
            <button onClick={() => setStep('register')} className="mb-6 text-slate-600 hover:text-slate-900 flex items-center gap-2">
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Your Industry</h2>
            <p className="text-slate-600 mb-8">This helps us customize your experience</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {industries.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => {
                    setSelectedIndustry(ind.id);
                    registerForm.setValue('industry', ind.id);
                    setStep('plan');
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary hover:shadow-lg ${
                    selectedIndustry === ind.id ? 'border-primary bg-primary/5' : 'border-slate-200'
                  }`}
                >
                  <ind.icon className="w-8 h-8 text-primary mb-2" />
                  <p className="font-medium text-slate-900">{ind.name}</p>
                  <p className="text-xs text-slate-500">{ind.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'plan') {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
          <div className="w-full max-w-4xl">
            <button onClick={() => setStep('industry')} className="mb-6 text-slate-600 hover:text-slate-900 flex items-center gap-2">
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Your Plan</h2>
            <p className="text-slate-600 mb-8">Select the features that fit your business</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    registerForm.setValue('plan', plan.id);
                  }}
                  className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-xl ${
                    selectedPlan === plan.id 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {selectedPlan === plan.id && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-white text-xs rounded-full mb-3">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                  <p className="text-xl font-bold text-slate-900">{plan.name}</p>
                  <p className="text-2xl font-bold text-primary mt-1">{plan.price}</p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" /> {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            <button
              onClick={() => registerForm.handleSubmit(onRegisterOrg)()}
              disabled={!selectedPlan || isLoading}
              className="mt-8 w-full bg-gradient-to-r from-primary to-blue-700 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-100">
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
            <p className="text-blue-100 text-sm">All-in-One Business Platform</p>
          </div>
        </div>
      </div>

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
                {isLogin ? 'Enter your credentials to access your account' : 'Start your 14-day free trial'}
              </p>
            </div>

            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
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
              <form onSubmit={registerForm.handleSubmit(() => setStep('industry'))} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
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
                  Continue
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
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
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
