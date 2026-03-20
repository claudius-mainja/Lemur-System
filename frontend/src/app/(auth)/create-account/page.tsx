'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore, PLAN_CONFIG } from '@/stores/auth.store';
import { 
  Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Building2, Users, DollarSign, Package, BarChart3, Globe, MapPin, UserPlus, ShieldCheck
} from 'lucide-react';

const SADC_COUNTRIES = [
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', timezone: 'America/New_York' },
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

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  organizationName: z.string().min(1, 'Organization name is required'),
  industry: z.string().min(1, 'Industry is required'),
  country: z.string().min(1, 'Country is required'),
  currency: z.string().min(1, 'Currency is required'),
  plan: z.enum(['starter', 'professional', 'enterprise']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const planDetails = {
  starter: {
    name: 'STARTER',
    price: 10.60,
    period: '/USER/MONTH',
    maxUsers: 6,
  },
  professional: {
    name: 'PROFESSIONAL',
    price: 20.50,
    period: '/USER/MONTH',
    maxUsers: 50,
  },
  enterprise: {
    name: 'ENTERPRISE',
    price: null,
    period: 'CUSTOM PRICING',
    maxUsers: 'Unlimited',
  },
};

type RegisterForm = z.infer<typeof registerSchema>;

function CreateAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [numUsers, setNumUsers] = useState(1);
  const { register: registerUser } = useAuthStore();
  
  const defaultPlan = (searchParams?.get('plan') as 'starter' | 'professional' | 'enterprise') || 'starter';

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      organizationName: '',
      industry: 'technology',
      country: 'US',
      currency: 'USD',
      plan: defaultPlan,
    },
  });
  
  useEffect(() => {
    const plan = searchParams?.get('plan') as 'starter' | 'professional' | 'enterprise';
    if (plan && ['starter', 'professional', 'enterprise'].includes(plan)) {
      form.setValue('plan', plan);
      if (plan === 'starter') setNumUsers(1);
      else if (plan === 'professional') setNumUsers(10);
    }
  }, [searchParams, form]);

  const selectedPlan = form.watch('plan');
  const planConfig = PLAN_CONFIG[selectedPlan];
  const maxUsers = planConfig?.maxUsers || 1;
  const minUsers = 1;
  
  const calculateTotal = () => {
    if (!planConfig?.price) return null;
    return planConfig.price * numUsers;
  };

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const result = await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        organizationName: data.organizationName,
        industry: data.industry as any,
        country: data.country,
        currency: data.currency,
        plan: data.plan,
      });
      
      if (result.success) {
        toast.success(`Welcome to ${data.organizationName}!`);
        router.push(`/payment?plan=${data.plan}&users=${numUsers}&org=${encodeURIComponent(data.organizationName)}`);
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error: any) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-20">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
            <div>
              <span className="text-white font-bold text-2xl tracking-tight">LEMUR<span className="text-accent">SYSTEM</span></span>
              <p className="text-white/50 text-xs tracking-[0.2em] uppercase">Enterprise ERP</p>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            ALL-IN-ONE<br/>
            BUSINESS<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark">MANAGEMENT</span>
          </h1>
          <p className="text-white/40 text-lg mb-12 font-light">
            Comprehensive ERP solution designed for African businesses. 
            Manage HR, Finance, CRM, Payroll, and more from a single platform.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, label: 'HR MANAGEMENT', desc: 'Employee lifecycle' },
              { icon: DollarSign, label: 'FINANCE', desc: 'Invoicing & accounting' },
              { icon: BarChart3, label: 'CRM', desc: 'Customer relationships' },
              { icon: Package, label: 'PAYROLL', desc: 'Automated salary processing' },
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-accent mb-3" />
                <p className="text-white font-bold text-sm uppercase tracking-wider">{feature.label}</p>
                <p className="text-white/40 text-xs mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-sm uppercase tracking-wider">
            Trusted by businesses across Africa
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520]">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">LEMUR<span className="text-accent">SYSTEM</span></span>
            </div>
            <h2 className="text-3xl font-bold text-white uppercase tracking-widest mb-3">
              CREATE ACCOUNT
            </h2>
            <p className="text-white/40 font-light">
              START YOUR 7-DAY FREE TRIAL
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onRegister)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-white/60 mb-3 uppercase tracking-wider">First Name</label>
                <input
                  {...form.register('firstName')}
                  className="w-full px-4 py-4 border border-white/10 bg-white/5 text-white rounded-2xl focus:ring-2 focus:ring-accent focus:border-accent placeholder-white/30"
                  placeholder="John"
                />
                {form.formState.errors.firstName && (
                  <p className="text-red-400 text-sm mt-2">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-white/60 mb-3 uppercase tracking-wider">Last Name</label>
                <input
                  {...form.register('lastName')}
                  className="w-full px-4 py-4 border border-white/10 bg-white/5 text-white rounded-2xl focus:ring-2 focus:ring-accent focus:border-accent placeholder-white/30"
                  placeholder="Doe"
                />
                {form.formState.errors.lastName && (
                  <p className="text-red-400 text-sm mt-2">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-white/60 mb-3 uppercase tracking-wider">Organization Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  {...form.register('organizationName')}
                  className="w-full pl-12 pr-4 py-4 border border-white/10 bg-white/5 text-white rounded-2xl focus:ring-2 focus:ring-accent focus:border-accent placeholder-white/30"
                  placeholder="Your Company Ltd"
                />
              </div>
              {form.formState.errors.organizationName && (
                <p className="text-red-400 text-sm mt-2">{form.formState.errors.organizationName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-white/60 mb-3 uppercase tracking-wider">Country</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <select
                    {...form.register('country')}
                    className="w-full pl-12 pr-4 py-4 border border-white/10 bg-white/5 text-white rounded-2xl focus:ring-2 focus:ring-accent focus:border-accent appearance-none"
                  >
                    {SADC_COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code} className="bg-[#0b2535]">
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-white/60 mb-3 uppercase tracking-wider">Currency</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <select
                    {...form.register('currency')}
                    className="w-full pl-12 pr-4 py-4 border border-white/10 bg-white/5 text-white rounded-2xl focus:ring-2 focus:ring-accent focus:border-accent appearance-none"
                  >
                    {SADC_COUNTRIES.map((country) => (
                      <option key={country.code} value={country.currency} className="bg-[#0b2535]">
                        {country.currencySymbol} {country.currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-white/60 mb-3 uppercase tracking-wider">Industry</label>
              <select
                {...form.register('industry')}
                className="w-full px-4 py-4 border border-white/10 bg-white/5 text-white rounded-2xl focus:ring-2 focus:ring-accent focus:border-accent appearance-none"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value} className="bg-[#0b2535]">{ind.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white/60 mb-3 uppercase tracking-wider">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  {...form.register('email')}
                  type="email"
                  className="w-full pl-12 pr-4 py-4 border border-white/10 bg-white/5 text-white rounded-2xl focus:ring-2 focus:ring-accent focus:border-accent placeholder-white/30"
                  placeholder="you@company.com"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-400 text-sm mt-2">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-white/60 mb-3 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  {...form.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-12 pr-14 py-4 border border-white/10 bg-white/5 text-white rounded-2xl focus:ring-2 focus:ring-accent focus:border-accent placeholder-white/30"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-white/30" /> : <Eye className="w-5 h-5 text-white/30" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-400 text-sm mt-2">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-white/60 mb-3 uppercase tracking-wider">Select Plan</label>
              <div className="grid grid-cols-3 gap-3">
                {(['starter', 'professional', 'enterprise'] as const).map((plan) => (
                  <label
                    key={plan}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition ${
                      form.watch('plan') === plan
                        ? 'border-accent bg-accent/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <input
                      type="radio"
                      {...form.register('plan')}
                      value={plan}
                      onClick={() => {
                        if (plan === 'starter') setNumUsers(1);
                        else if (plan === 'professional') setNumUsers(10);
                      }}
                      className="sr-only"
                    />
                    <p className="font-bold text-center text-sm uppercase tracking-wider text-white">{plan}</p>
                    {planDetails[plan].price && (
                      <p className="text-xs text-center text-white/40 mt-1">${planDetails[plan].price}/user</p>
                    )}
                    {!planDetails[plan].price && (
                      <p className="text-xs text-center text-white/40 mt-1">Custom</p>
                    )}
                  </label>
                ))}
              </div>
            </div>
            
            {PLAN_CONFIG[selectedPlan]?.price && (
              <div>
                <label className="block text-sm font-bold text-white/60 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Number of Users
                </label>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/60 text-sm">Users: <span className="text-white font-bold">{numUsers}</span></span>
                    <span className="text-accent font-bold">
                      ${calculateTotal()?.toFixed(2)}/month
                    </span>
                  </div>
                  <input
                    type="range"
                    min={minUsers}
                    max={typeof maxUsers === 'number' ? maxUsers : 100}
                    value={numUsers}
                    onChange={(e) => setNumUsers(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between mt-2 text-xs text-white/30">
                    <span>1 user</span>
                    <span>Max: {typeof maxUsers === 'number' ? maxUsers : 'Unlimited'}</span>
                  </div>
                  <p className="text-white/40 text-xs mt-3">
                    ${PLAN_CONFIG[selectedPlan]?.price}/user/month × {numUsers} users
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-accent to-accentDark text-white py-4 px-6 rounded-2xl font-bold uppercase tracking-wider hover:shadow-xl hover:shadow-accent/30 transition flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'CREATE ACCOUNT'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center mt-8 text-white/40 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-accent font-bold uppercase tracking-wider hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CreateAccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    }>
      <CreateAccountContent />
    </Suspense>
  );
}
