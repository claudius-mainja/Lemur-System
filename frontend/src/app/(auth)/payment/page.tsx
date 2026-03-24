'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore, PLAN_CONFIG, SubscriptionPlan } from '@/stores/auth.store';
import toast from 'react-hot-toast';
import { 
  CreditCard, Smartphone, Wallet, Lock, Check, ArrowLeft, 
  Loader2, Shield, Building2, ArrowRight, UserPlus, SmartphoneNfc, ShieldCheck
} from 'lucide-react';

type PaymentMethod = 'card' | 'ecocash' | 'paypal' | 'payflex' | 'bank' | 'mpesa';

interface PlanDetails {
  name: string;
  price: number;
  period: string;
  features: string[];
  maxUsers: number | null;
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [numUsers, setNumUsers] = useState(1);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const planParam = (searchParams?.get('plan') as SubscriptionPlan) || user?.subscription || 'starter';
  const usersParam = parseInt(searchParams?.get('users') || '1');
  const orgName = searchParams?.get('org') || 'Your Organization';
  
  useEffect(() => {
    setNumUsers(usersParam);
  }, [usersParam]);
  
  const planConfig = PLAN_CONFIG[planParam];
  const pricePerUser = planConfig?.price || 0;
  const maxUsers = planConfig?.maxUsers;
  
  const calculateTotal = () => {
    if (!pricePerUser) return 0;
    const base = pricePerUser * numUsers;
    if (billingCycle === 'annual') {
      return base * 12 * 0.8;
    }
    return base;
  };
  
  const monthlyEquivalent = billingCycle === 'annual' ? calculateTotal() / 12 : calculateTotal();

  const planDetails: PlanDetails = {
    name: planConfig?.name || 'Starter',
    price: monthlyEquivalent,
    period: '/user/month',
    features: [...(planConfig?.features || [])],
    maxUsers: maxUsers,
  };

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const paymentStatus = {
      subscription: planParam,
      users: numUsers,
      billingCycle,
      status: 'active',
      paymentMethod: selectedMethod,
      paidAt: new Date().toISOString(),
      paymentVerified: true,
    };

    localStorage.setItem('erp-payment-status', JSON.stringify(paymentStatus));

    const { setUser } = useAuthStore.getState();
    setUser({
      id: user?.id || 'admin-' + Date.now(),
      email: user?.email || 'admin@example.com',
      first_name: user?.first_name || 'Super',
      last_name: user?.last_name || 'Admin',
      role: 'super_admin',
      organization_id: user?.organization_id || 'org-' + Date.now(),
      organization_name: orgName,
      subscription: planParam,
      modules: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'settings', 'users', 'dashboard'],
      currency: 'USD',
      is_active: true,
      isActive: true,
    });

    setIsProcessing(false);
    toast.success('Welcome to LemurSystem! Your account is now active.');
    router.push('/dashboard');
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, AMEX' },
    { id: 'mpesa', name: 'M-Pesa', icon: SmartphoneNfc, desc: 'Mobile money Kenya' },
    { id: 'ecocash', name: 'EcoCash', icon: Smartphone, desc: 'Mobile money Zimbabwe' },
    { id: 'paypal', name: 'PayPal', icon: Wallet, desc: 'Pay with your PayPal account' },
    { id: 'payflex', name: 'PayFlex', icon: Building2, desc: 'Buy now, pay later' },
    { id: 'bank', name: 'Bank Transfer', icon: Building2, desc: 'Direct bank payment' },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] flex items-center justify-center p-4" suppressHydrationWarning>
      <div className="w-full max-w-4xl">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan Summary */}
          <div className="bg-[#0b2a38] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-accentDark rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Complete Your Subscription</h2>
                <p className="text-white/40 text-sm">Review your order for {orgName}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div>
                <p className="text-white font-medium">{planDetails.name} Plan</p>
                <p className="text-white/40 text-sm">{numUsers} user(s)</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  ${monthlyEquivalent.toFixed(2)}
                </p>
                <p className="text-white/40 text-xs">per user/month</p>
              </div>
            </div>
            
            {/* Billing Cycle Toggle */}
            <div className="mb-4">
              <div className="flex items-center justify-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-white/40'}`}>MONTHLY</span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${billingCycle === 'annual' ? 'bg-accent' : 'bg-white/20'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${billingCycle === 'annual' ? 'left-7' : 'left-1'}`} />
                </button>
                <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-white' : 'text-white/40'}`}>ANNUAL</span>
                {billingCycle === 'annual' && (
                  <span className="ml-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">SAVE 20%</span>
                )}
              </div>
            </div>
            
            {/* User Count Selector */}
            {pricePerUser > 0 && (
              <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-sm flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Number of Users
                  </span>
                  <span className="text-white font-bold">{numUsers}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={typeof maxUsers === 'number' ? maxUsers : 100}
                  value={numUsers}
                  onChange={(e) => setNumUsers(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between mt-2 text-xs text-white/30">
                  <span>1</span>
                  <span>Max: {typeof maxUsers === 'number' ? maxUsers : 'Unlimited'}</span>
                </div>
              </div>
            )}
            
            {/* Price Breakdown */}
            <div className="space-y-2 mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex justify-between text-white/60 text-sm">
                <span>Price per user</span>
                <span>${pricePerUser.toFixed(2)}/month</span>
              </div>
              <div className="flex justify-between text-white/60 text-sm">
                <span>Number of users</span>
                <span>× {numUsers}</span>
              </div>
              {billingCycle === 'annual' && (
                <div className="flex justify-between text-green-400 text-sm">
                  <span>Annual discount (20%)</span>
                  <span>-${(pricePerUser * numUsers * 12 * 0.2).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-accent">${calculateTotal().toFixed(2)}/{billingCycle === 'annual' ? 'year' : 'month'}</span>
              </div>
              {billingCycle === 'annual' && (
                <p className="text-white/40 text-xs text-center">
                  Equivalent to ${monthlyEquivalent.toFixed(2)}/month billed annually
                </p>
              )}
            </div>

            <div className="mb-4">
              <p className="text-white/40 text-xs mb-2">Included features:</p>
              <ul className="space-y-1.5">
                {planDetails.features.slice(0, 6).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-white/60 text-xs">
                    <Check className="w-3 h-3 text-green-400" />
                    {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-green-400 text-xs">
                <Shield className="w-3 h-3" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleCompletePayment}>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Method</h3>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      selectedMethod === method.id
                        ? 'border-accent bg-accent/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <method.icon className={`w-5 h-5 mb-1 ${selectedMethod === method.id ? 'text-accent' : 'text-slate-600'}`} />
                    <p className="font-medium text-slate-900 text-xs">{method.name}</p>
                  </button>
                ))}
              </div>

              {selectedMethod === 'card' && (
                <div className="space-y-3 mb-4 p-4 bg-slate-50 rounded-xl">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">CVV</label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        placeholder="123"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'ecocash' && (
                <div className="space-y-3 mb-4 p-4 bg-slate-50 rounded-xl">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">EcoCash Number</label>
                    <input
                      type="tel"
                      placeholder="+263 77X XXX XXXX"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-sm"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500">You will receive an STK push prompt to confirm payment</p>
                </div>
              )}

              {selectedMethod === 'mpesa' && (
                <div className="space-y-3 mb-4 p-4 bg-slate-50 rounded-xl">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">M-Pesa Number</label>
                    <input
                      type="tel"
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-sm"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500">You will receive an STK push prompt to confirm payment</p>
                </div>
              )}

              {selectedMethod === 'paypal' && (
                <div className="mb-4 p-4 bg-slate-50 rounded-xl text-center">
                  <p className="text-sm text-slate-600">You will be redirected to PayPal to complete your payment</p>
                </div>
              )}

              {selectedMethod === 'payflex' && (
                <div className="mb-4 p-4 bg-slate-50 rounded-xl text-center">
                  <p className="text-sm text-slate-600">You will be redirected to PayFlex to complete your payment</p>
                </div>
              )}

              {selectedMethod === 'bank' && (
                <div className="mb-4 p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 mb-2">Bank details will be sent to your email after this step.</p>
                </div>
              )}

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Secure Payment</p>
                    <p className="text-xs text-slate-600 mt-1">Your payment is processed securely.</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Complete Payment ${calculateTotal().toFixed(2)} {billingCycle === 'annual' ? 'Annually' : 'Monthly'}
                  </>
                )}
              </button>

              <p className="text-center text-slate-400 text-xs mt-4 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                Your payment is secured with 256-bit SSL encryption
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
