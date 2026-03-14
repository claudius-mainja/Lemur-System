'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, PLAN_CONFIG } from '@/stores/auth.store';
import toast from 'react-hot-toast';
import { 
  CreditCard, Smartphone, Wallet, Lock, Check, ArrowLeft, 
  Loader2, Shield, Building2, ArrowRight
} from 'lucide-react';

type PaymentMethod = 'card' | 'ecocash' | 'paypal' | 'payflex' | 'bank';

interface PlanDetails {
  name: string;
  price: number;
  period: string;
  features: string[];
}

export default function PaymentPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const plan = user?.subscription || 'starter';
  const planConfig = PLAN_CONFIG[plan];
  const planDetails: PlanDetails = {
    name: planConfig.name,
    price: planConfig.price || 0,
    period: planConfig.price ? '/month' : 'Custom',
    features: [...planConfig.features],
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    localStorage.setItem('erp-payment-status', JSON.stringify({
      plan: plan,
      status: 'active',
      paymentMethod: selectedMethod,
      paidAt: new Date().toISOString(),
    }));

    setIsProcessing(false);
    toast.success('Payment successful! Welcome to LemurSystem.');
    router.push('/dashboard/hr');
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, AMEX' },
    { id: 'ecocash', name: 'EcoCash', icon: Smartphone, desc: 'Mobile money Zimbabwe' },
    { id: 'paypal', name: 'PayPal', icon: Wallet, desc: 'Pay with your PayPal account' },
    { id: 'payflex', name: 'PayFlex', icon: Building2, desc: 'Buy now, pay later' },
    { id: 'bank', name: 'Bank Transfer', icon: Building2, desc: 'Direct bank payment' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] flex items-center justify-center p-4">
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
                <p className="text-white/40 text-sm">Choose your payment method</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div>
                <p className="text-white font-medium">{planDetails.name} Plan</p>
                <p className="text-white/40 text-sm">{planDetails.period}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {planDetails.price ? `$${planDetails.price}` : 'Custom'}
                </p>
                {planDetails.price && <p className="text-white/40 text-xs">per user/month</p>}
              </div>
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
            <form onSubmit={handlePayment}>
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

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-accent to-accentDark text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ${planDetails.price || 'Custom Price'}
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
