'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore, PLAN_CONFIG } from '@/stores/auth.store';
import { authApi, tenantsApi } from '@/services/api';
import { 
  Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, 
  Building2, Users, DollarSign, Package, BarChart3, Globe, MapPin
} from 'lucide-react';

const SADC_COUNTRIES = [
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', timezone: 'Africa/Johannesburg' },
  { code: 'BW', name: 'Botswana', currency: 'BWP', currencySymbol: 'P', timezone: 'Africa/Gaborone' },
  { code: 'SZ', name: 'Eswatini', currency: 'SZL', currencySymbol: 'E', timezone: 'Africa/Mbabane' },
  { code: 'LS', name: 'Lesotho', currency: 'LSL', currencySymbol: 'L', timezone: 'Africa/Maseru' },
  { code: 'NA', name: 'Namibia', currency: 'NAD', currencySymbol: '$', timezone: 'Africa/Windhoek' },
  { code: 'ZM', name: 'Zambia', currency: 'ZMW', currencySymbol: 'ZK', timezone: 'Africa/Lusaka' },
  { code: 'ZW', name: 'Zimbabwe', currency: 'ZWL', currencySymbol: '$', timezone: 'Africa/Harare' },
  { code: 'MZ', name: 'Mozambique', currency: 'MZN', currencySymbol: 'MT', timezone: 'Africa/Maputo' },
  { code: 'MW', name: 'Malawi', currency: 'MWK', currencySymbol: 'MK', timezone: 'Africa/Blantyre' },
  { code: 'AO', name: 'Angola', currency: 'AOA', currencySymbol: 'Kz', timezone: 'Africa/Luanda' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', currencySymbol: 'TSh', timezone: 'Africa/Dar_es_Salaam' },
  { code: 'MU', name: 'Mauritius', currency: 'MUR', currencySymbol: '₨', timezone: 'Indian/Mauritius' },
];

const INDUSTRIES = [
  { value: 'technology', label: 'Technology & IT' },
  { value: 'retail', label: 'Retail & E-Commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'construction', label: 'Construction' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'transportation', label: 'Transportation & Logistics' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'mining', label: 'Mining & Resources' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'other', label: 'Other' },
];

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  organizationId: z.string().optional(),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  organizationName: z.string().min(1, 'Organization name is required'),
  industry: z.string().min(1, 'Industry is required'),
  country: z.string().min(1, 'Country is required'),
  currency: z.string().min(1, 'Currency is required'),
  plan: z.enum(['starter', 'professional', 'enterprise']),
});

const planDetails = {
  starter: {
    name: 'Starter',
    price: 10.60,
    period: '/user/month',
    maxUsers: 6,
    features: ['HR', 'Finance', 'Supply Chain', '10 GB Storage', 'Email Support', 'Basic Reporting', 'Mobile App'],
    notIncluded: ['CRM', 'Payroll', 'Productivity', 'API Access', 'Custom Integrations', 'SSO'],
  },
  professional: {
    name: 'Professional',
    price: 20.50,
    period: '/user/month',
    maxUsers: 50,
    features: ['HR', 'Finance', 'CRM', 'Payroll', 'Productivity', 'Supply Chain', '100 GB Storage', 'Priority Support', 'Advanced Analytics', 'API Access', 'Custom Integrations', 'SSO'],
    notIncluded: ['Dedicated Account Manager', 'On-premise Deployment'],
  },
  enterprise: {
    name: 'Enterprise',
    price: null,
    period: 'Custom Pricing',
    maxUsers: 'Unlimited',
    features: ['All Applications + Custom', 'Unlimited Storage', '24/7 Dedicated Support', 'Custom Reporting & Dashboards', 'Full API Access', 'Custom Integrations', 'SSO & Advanced Security', 'Dedicated Account Manager', 'On-premise Option', 'SLA Guarantee', 'Custom Training'],
    notIncluded: [],
  },
};

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

type Industry = 'technology' | 'retail' | 'manufacturing' | 'healthcare' | 'education' | 'finance' | 'construction' | 'hospitality' | 'transportation' | 'other';
type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';

function getDashboardRoute(modules: string[]): string {
  const moduleOrder = ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'email', 'documents'];
  const availableModule = moduleOrder.find(m => modules.includes(m));
  return `/dashboard/${availableModule || 'hr'}`;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      organizationName: '',
      industry: 'technology',
      country: 'ZA',
      currency: 'ZAR',
      plan: 'starter',
    },
  });

  const selectedCountry = SADC_COUNTRIES.find(c => c.code === registerForm.watch('country'));

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data.email, data.password, data.organizationId);
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      toast.success('Welcome back!');
      router.push(getDashboardRoute(user.modules));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterOrg = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const country = SADC_COUNTRIES.find(c => c.code === data.country) || SADC_COUNTRIES[0];
      const response = await tenantsApi.register({
        name: data.organizationName,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        timezone: country.timezone,
        currency: country.currency,
        country: data.country,
        plan: data.plan,
      });
      const responseData = response.data;
      
      const userData = {
        id: responseData.userId,
        email: responseData.email,
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        role: 'admin',
        organizationId: responseData.tenantId,
        organizationName: data.organizationName,
        industry: data.industry as any,
        subscription: responseData.plan as any,
        modules: responseData.modules,
        currency: responseData.currency,
        timezone: country.timezone,
        country: responseData.country,
        isOnTrial: true,
      };
      
      setAuth(userData, responseData.accessToken, responseData.refreshToken);
      toast.success(`Welcome to ${data.organizationName}! Your 7-day free trial has started.`);
      router.push(getDashboardRoute(responseData.modules));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-blue-600 to-blue-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
            <span className="text-white font-bold text-2xl">LemurSystem</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-6">
            All-in-One Business Management
          </h1>
          <p className="text-blue-100 text-lg mb-12">
            Comprehensive ERP solution designed for African businesses. 
            Manage HR, Finance, CRM, Payroll, and more from a single platform.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, label: 'HR Management', desc: 'Employee lifecycle' },
              { icon: DollarSign, label: 'Finance', desc: 'Invoicing & accounting' },
              { icon: BarChart3, label: 'CRM', desc: 'Customer relationships' },
              { icon: Package, label: 'Payroll', desc: 'Automated salary processing' },
            ].map((feature, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <feature.icon className="w-6 h-6 text-white mb-2" />
                <p className="text-white font-medium">{feature.label}</p>
                <p className="text-blue-200 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-blue-200 text-sm">
            Trusted by businesses across Africa
          </p>
          <div className="flex gap-4 mt-4">
            {['South Africa', 'Kenya', 'Nigeria', 'Ghana'].map((country) => (
              <span key={country} className="text-white/60 text-sm">{country}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-dark-bg">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-text uppercase tracking-wide">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="text-dark-text-muted mt-2">
              {isLogin 
                ? 'Enter your credentials to access your dashboard' 
                : 'Start your 7-day free trial'}
            </p>
          </div>

          {isLogin ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2 uppercase tracking-wider">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
                  <input
                    {...loginForm.register('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-dark-border bg-dark-bg-tertiary text-dark-text rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="you@company.com"
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...loginForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="ml-2 text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegisterOrg)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input
                    {...registerForm.register('firstName')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="John"
                  />
                  {registerForm.formState.errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input
                    {...registerForm.register('lastName')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="Doe"
                  />
                  {registerForm.formState.errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Organization Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...registerForm.register('organizationName')}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="Your Company Ltd"
                  />
                </div>
                {registerForm.formState.errors.organizationName && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.organizationName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      {...registerForm.register('country')}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary"
                    >
                      {SADC_COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      {...registerForm.register('currency')}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary"
                    >
                      {SADC_COUNTRIES.map((country) => (
                        <option key={country.code} value={country.currency}>
                          {country.currencySymbol} {country.currency}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                <select
                  {...registerForm.register('industry')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.value} value={ind.value}>{ind.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...registerForm.register('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="you@company.com"
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...registerForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Select Plan</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['starter', 'professional', 'enterprise'] as const).map((plan) => (
                    <label
                      key={plan}
                      className={`border-2 rounded-xl p-3 cursor-pointer transition ${
                        registerForm.watch('plan') === plan
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        {...registerForm.register('plan')}
                        value={plan}
                        className="sr-only"
                      />
                      <p className="font-medium capitalize text-center text-sm">{plan}</p>
                      {planDetails[plan].price && (
                        <p className="text-xs text-center text-slate-500 mt-1">
                          ${planDetails[plan].price}/mo
                        </p>
                      )}
                      {!planDetails[plan].price && (
                        <p className="text-xs text-center text-slate-500 mt-1">Custom</p>
                      )}
                    </label>
                  ))}
                </div>
                
                {registerForm.watch('plan') && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900">{planDetails[registerForm.watch('plan')].name} Plan</h4>
                        <p className="text-sm text-slate-500">
                          {planDetails[registerForm.watch('plan')].price 
                            ? `$${planDetails[registerForm.watch('plan')].price}${planDetails[registerForm.watch('plan')].period}`
                            : planDetails[registerForm.watch('plan')].period}
                        </p>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Up to {planDetails[registerForm.watch('plan')].maxUsers} users
                      </span>
                    </div>
                    <div className="text-xs">
                      <p className="font-medium text-slate-700 mb-1">Included:</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {planDetails[registerForm.watch('plan')].features.map((f, i) => (
                          <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded">{f}</span>
                        ))}
                      </div>
                      {planDetails[registerForm.watch('plan')].notIncluded.length > 0 && (
                        <>
                          <p className="font-medium text-slate-700 mb-1">Not Included:</p>
                          <div className="flex flex-wrap gap-1">
                            {planDetails[registerForm.watch('plan')].notIncluded.map((f, i) => (
                              <span key={i} className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded">{f}</span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          <p className="text-center mt-8 text-slate-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? 'Start free trial' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
