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
  Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Building2, Users, DollarSign, Globe, MapPin, 
  Zap, Check, ChevronLeft, ChevronRight, CreditCard, Shield, Star, Crown, Sparkles,
  CheckCircle, Package, User, LockKeyhole, ArrowUpRight
} from 'lucide-react';

const SADC_COUNTRIES = [
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R' },
  { code: 'BW', name: 'Botswana', currency: 'BWP', currencySymbol: 'P' },
  { code: 'SZ', name: 'Eswatini', currency: 'SZL', currencySymbol: 'E' },
  { code: 'LS', name: 'Lesotho', currency: 'LSL', currencySymbol: 'L' },
  { code: 'NA', name: 'Namibia', currency: 'NAD', currencySymbol: '$' },
  { code: 'ZM', name: 'Zambia', currency: 'ZMW', currencySymbol: 'ZK' },
  { code: 'ZW', name: 'Zimbabwe', currency: 'ZWL', currencySymbol: '$' },
  { code: 'MZ', name: 'Mozambique', currency: 'MZN', currencySymbol: 'MT' },
  { code: 'MW', name: 'Malawi', currency: 'MWK', currencySymbol: 'MK' },
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

const PLANS = {
  starter: {
    name: 'STARTER',
    price: 10.60,
    period: '/USER/MONTH',
    maxUsers: 5,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500',
    icon: Star,
    features: [
      'HR Module',
      'Finance Module',
      'Supply Chain',
      '10 GB Storage',
      'Email Support',
      'Basic Reporting',
    ],
    notIncluded: ['CRM', 'Payroll', 'Productivity', 'API Access', 'Custom Integrations'],
  },
  professional: {
    name: 'PROFESSIONAL',
    price: 20.50,
    period: '/USER/MONTH',
    maxUsers: 25,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-500',
    icon: Sparkles,
    features: [
      'All Starter Features',
      'CRM Module',
      'Payroll Module',
      'Productivity Suite',
      'Marketing Tools',
      'Help Desk',
      '100 GB Storage',
      'Priority Support',
      'Advanced Analytics',
      'API Access',
    ],
    notIncluded: ['Dedicated Account Manager', 'On-premise Deployment'],
  },
  enterprise: {
    name: 'ENTERPRISE',
    price: 45.00,
    period: '/USER/MONTH',
    maxUsers: 100,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500',
    icon: Crown,
    features: [
      'All Professional Features',
      'Unlimited Users',
      'Unlimited Storage',
      '24/7 Dedicated Support',
      'Custom Reporting',
      'SSO & Advanced Security',
      'Dedicated Account Manager',
      'On-premise Option',
      'SLA Guarantee',
      'Custom Training',
    ],
    notIncluded: [],
  },
};

const userDetailsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  organizationName: z.string().min(1, 'Organization name is required'),
  industry: z.string().min(1, 'Industry is required'),
  country: z.string().min(1, 'Country is required'),
  currency: z.string().min(1, 'Currency is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type UserDetails = z.infer<typeof userDetailsSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'professional' | 'enterprise'>('professional');
  const [userCount, setUserCount] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const { register: registerUser } = useAuthStore();

  const form = useForm<UserDetails>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      organizationName: '',
      industry: 'technology',
      country: 'ZA',
      currency: 'ZAR',
    },
  });

  const totalPrice = PLANS[selectedPlan].price * userCount;
  const country = SADC_COUNTRIES.find(c => c.code === form.watch('country')) || SADC_COUNTRIES[0];

  const handlePlanSelect = (plan: 'starter' | 'professional' | 'enterprise') => {
    setSelectedPlan(plan);
  };

  const handleUserCountChange = (change: number) => {
    const maxUsers = PLANS[selectedPlan].maxUsers;
    const newCount = userCount + change;
    if (newCount >= 1 && newCount <= maxUsers) {
      setUserCount(newCount);
    }
  };

  const handleNextFromStep1 = () => {
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    setStep(3);
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const formData = form.getValues();
      const result = await registerUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        organizationName: formData.organizationName,
        industry: formData.industry,
        country: formData.country,
        currency: formData.currency,
        plan: selectedPlan,
      });

      if (result.success) {
        setStep(4);
        toast.success('Payment successful! Welcome to LemurSystem!');
        setTimeout(() => {
          const modules = useAuthStore.getState().user?.modules || ['hr'];
          router.push(`/dashboard/${modules[0] || 'hr'}`);
        }, 2000);
      } else {
        toast.error(result.error || 'Registration failed');
        setPaymentProcessing(false);
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setPaymentProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-3 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            step >= s 
              ? 'bg-gradient-to-r from-accent to-accentDark text-white' 
              : 'bg-white/10 text-white/40'
          }`}>
            {step > s ? <Check className="w-4 h-4" /> : s}
          </div>
          {s < 4 && (
            <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-accent' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepLabels = () => (
    <div className="flex items-center justify-center gap-4 mb-6 text-xs uppercase tracking-wider">
      <span className={step >= 1 ? 'text-accent' : 'text-white/40'}>Select Plan</span>
      <span className={step >= 2 ? 'text-accent' : 'text-white/40'}>Your Details</span>
      <span className={step >= 3 ? 'text-accent' : 'text-white/40'}>Payment</span>
      <span className={step >= 4 ? 'text-accent' : 'text-white/40'}>Complete</span>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-20">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
            <div>
              <span className="text-white font-bold text-2xl tracking-tight">LEMUR<span className="text-accent">SYSTEM</span></span>
              <p className="text-white/50 text-xs tracking-[0.2em] uppercase">Enterprise ERP</p>
            </div>
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
            GET STARTED<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark">IN MINUTES</span>
          </h1>
          <p className="text-white/40 text-lg mb-8 font-light">
            Join thousands of African businesses already using LemurSystem to streamline their operations.
          </p>

          <div className="space-y-4">
            {[
              { icon: Shield, text: 'Bank-level security with 256-bit encryption' },
              { icon: Globe, text: 'Built for SADC region compliance' },
              { icon: Zap, text: '14-day free trial, no credit card required' },
              { icon: Users, text: 'Dedicated support team in Africa' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/60">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-2">
            {['South Africa', 'Botswana', 'Namibia', 'Zimbabwe'].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accentDark border-2 border-[#0b2535] flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
            ))}
          </div>
          <p className="text-white/40 text-sm">Trusted by 500+ businesses</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-y-auto">
        <div className="w-full max-w-xl">
          {renderStepLabels()}
          {renderStepIndicator()}

          {/* Step 1: Select Plan */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-2">
                  SELECT YOUR PLAN
                </h2>
                <p className="text-white/40 text-sm">Choose the package that fits your business needs</p>
              </div>

              <div className="grid gap-4">
                {Object.entries(PLANS).map(([key, plan]) => {
                  const Icon = plan.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => handlePlanSelect(key as any)}
                      className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                        selectedPlan === key 
                          ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20' 
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      {selectedPlan === key && (
                        <div className="absolute top-4 right-4 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                            <p className="text-white/40 text-sm">Up to {plan.maxUsers} users</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">${plan.price}</p>
                          <p className="text-white/40 text-xs">{plan.period}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {plan.features.slice(0, 4).map((feature, i) => (
                          <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                            {feature}
                          </span>
                        ))}
                        {plan.features.length > 4 && (
                          <span className="px-2 py-1 text-xs text-white/40">
                            +{plan.features.length - 4} more
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextFromStep1}
                className="w-full bg-gradient-to-r from-accent to-accentDark text-white py-4 px-6 rounded-xl font-bold uppercase tracking-wider hover:shadow-xl hover:shadow-accent/30 transition flex items-center justify-center gap-2"
              >
                Continue to Details
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: User Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-2">
                  YOUR DETAILS
                </h2>
                <p className="text-white/40 text-sm">Enter your organization and personal information</p>
              </div>

              <form onSubmit={form.handleSubmit(handleNextFromStep2)} className="space-y-4">
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
                        {SADC_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-[#0b2535]">{c.name}</option>
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
                        {SADC_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.currency} className="bg-[#0b2535]">
                            {c.currencySymbol} {c.currency}
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        {...form.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full pl-10 pr-10 py-3 border border-white/10 bg-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent placeholder-white/30 text-sm"
                        placeholder="Min 8 characters"
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
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Confirm Password</label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        {...form.register('confirmPassword')}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent placeholder-white/30 text-sm"
                        placeholder="Confirm password"
                      />
                    </div>
                    {form.formState.errors.confirmPassword && (
                      <p className="text-red-400 text-xs mt-1">{form.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-white/20 text-white/60 py-3 px-6 rounded-xl font-bold uppercase tracking-wider hover:bg-white/5 transition flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-accent to-accentDark text-white py-3 px-6 rounded-xl font-bold uppercase tracking-wider hover:shadow-xl hover:shadow-accent/30 transition flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-2">
                  COMPLETE YOUR ORDER
                </h2>
                <p className="text-white/40 text-sm">Review your order and complete payment</p>
              </div>

              {/* Order Summary */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-accent" />
                  Order Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${PLANS[selectedPlan].color} flex items-center justify-center`}>
                        <PLANS[selectedPlan].icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{PLANS[selectedPlan].name} Plan</p>
                        <p className="text-white/40 text-xs">{userCount} user{userCount > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <p className="text-white font-bold">${PLANS[selectedPlan].price}/user/mo</p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">Subtotal</span>
                      <span className="text-white">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">14-Day Free Trial</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                      <span className="text-white">Total Due Today</span>
                      <span className="text-accent">$0.00</span>
                    </div>
                  </div>

                  <p className="text-white/40 text-xs text-center">
                    You won't be charged until your trial ends. Cancel anytime.
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-accent" />
                  Payment Method
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <input type="radio" name="payment" id="card" checked className="accent-accent" />
                    <label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-white/60" />
                      <span className="text-white">Credit/Debit Card</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                      <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs text-white/60 mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-white/10 bg-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent placeholder-white/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-white/10 bg-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent placeholder-white/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-2">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 border border-white/10 bg-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent placeholder-white/30"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-white/40 text-xs flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Your payment is secured with 256-bit SSL encryption
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-white/20 text-white/60 py-3 px-6 rounded-xl font-bold uppercase tracking-wider hover:bg-white/5 transition flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={paymentProcessing}
                  className="flex-1 bg-gradient-to-r from-accent to-accentDark text-white py-3 px-6 rounded-xl font-bold uppercase tracking-wider hover:shadow-xl hover:shadow-accent/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {paymentProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Start Free Trial
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3 uppercase tracking-wider">
                PAYMENT APPROVED!
              </h2>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Your 14-day free trial has started. We're setting up your dashboard now...
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-white/60">
                  <Loader2 className="w-5 h-5 animate-spin text-accent" />
                  <span>Redirecting to your dashboard...</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-sm mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${PLANS[selectedPlan].color} flex items-center justify-center`}>
                      <PLANS[selectedPlan].icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold">{PLANS[selectedPlan].name} Plan</p>
                      <p className="text-white/40 text-sm">{userCount} user{userCount > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm text-left">
                    Trial ends in 14 days. Your card will be charged ${totalPrice.toFixed(2)}/month after the trial.
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className="text-center mt-6 text-white/30 text-xs">
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
