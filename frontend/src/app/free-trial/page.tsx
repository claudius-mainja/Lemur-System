'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth.store';
import { 
  Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Building2, Users, DollarSign, Globe, MapPin, Zap
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
  { value: 'other', label: 'Other' },
];

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  organizationName: z.string().min(1, 'Organization name is required'),
  industry: z.string().min(1, 'Industry is required'),
  country: z.string().min(1, 'Country is required'),
  currency: z.string().min(1, 'Currency is required'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function FreeTrialPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuthStore();

  const form = useForm<RegisterForm>({
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
    },
  });

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const country = SADC_COUNTRIES.find(c => c.code === data.country) || SADC_COUNTRIES[0];
      const trialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const result = await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        organizationName: data.organizationName,
        industry: data.industry as any,
        country: data.country,
        currency: country.currency,
        plan: 'professional',
      });
      
      if (result.success) {
        localStorage.setItem('erp-trial-info', JSON.stringify({
          isTrial: true,
          trialEndsAt: trialEndDate,
          plan: 'professional',
        }));
        toast.success('Welcome to your 7-day free trial!');
        router.push('/dashboard/hr');
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
          
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full mb-6">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-accent font-bold text-xs uppercase">7-Day Free Trial</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            TRY BEFORE<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark">YOU BUY</span>
          </h1>
          <p className="text-white/40 text-lg mb-8 font-light">
            Experience the full power of LemurSystem with no credit card required. 
            Get instant access to all features for 7 days.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/60">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-xs">✓</span>
              </div>
              <span>Full access to all modules</span>
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-xs">✓</span>
              </div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-xs">✓</span>
              </div>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-xs">✓</span>
              </div>
              <span>24/7 support included</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-sm">
            After your trial, choose a plan that fits your needs
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">LEMUR<span className="text-accent">SYSTEM</span></span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full mb-4">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-accent font-bold text-xs uppercase">7-Day Free Trial</span>
            </div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">
              START YOUR TRIAL
            </h2>
            <p className="text-white/40 text-sm">
              No credit card required
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onRegister)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">First Name</label>
                <input
                  {...form.register('firstName')}
                  className="w-full px-4 py-3 border border-white/10 bg-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent placeholder-white/30 text-sm"
                  placeholder="John"
                />
                {form.formState.errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Last Name</label>
                <input
                  {...form.register('lastName')}
                  className="w-full px-4 py-3 border border-white/10 bg-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent placeholder-white/30 text-sm"
                  placeholder="Doe"
                />
                {form.formState.errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Organization Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  {...form.register('organizationName')}
                  className="w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent placeholder-white/30 text-sm"
                  placeholder="Your Company Ltd"
                />
              </div>
              {form.formState.errors.organizationName && (
                <p className="text-red-400 text-xs mt-1">{form.formState.errors.organizationName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Country</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <select
                    {...form.register('country')}
                    className="w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent appearance-none text-sm"
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
                <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Currency</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <select
                    {...form.register('currency')}
                    className="w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent appearance-none text-sm"
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
              <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Industry</label>
              <select
                {...form.register('industry')}
                className="w-full px-4 py-3 border border-white/10 bg-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent appearance-none text-sm"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value} className="bg-[#0b2535]">{ind.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  {...form.register('email')}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent placeholder-white/30 text-sm"
                  placeholder="you@company.com"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-400 text-xs mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  {...form.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 border border-white/10 bg-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent placeholder-white/30 text-sm"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-white/30" /> : <Eye className="w-4 h-4 text-white/30" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-400 text-xs mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-accent to-accentDark text-white py-3 px-6 rounded-xl font-bold uppercase tracking-wider hover:shadow-xl hover:shadow-accent/30 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              START FREE TRIAL
            </button>
          </form>

          <p className="text-center mt-6 text-white/30 text-xs">
            By starting the trial, you agree to our{' '}
            <a href="#" className="text-accent">Terms of Service</a> and{' '}
            <a href="#" className="text-accent">Privacy Policy</a>
          </p>

          <p className="text-center mt-4 text-white/40 text-xs">
            Already have an account?{' '}
            <Link href="/login" className="text-accent font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
