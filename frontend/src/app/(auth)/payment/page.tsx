'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, PLAN_CONFIG } from '@/stores/auth.store';
import toast from 'react-hot-toast';
import { 
  CreditCard, Smartphone, Wallet, Lock, Check, ArrowLeft, 
  Loader2, Shield, Star, Building2
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

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Store payment status
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Subscription</h1>
          <p className="text-slate-400">Choose your payment method to activate your {planDetails.name} plan</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
            
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
              <div>
                <p className="text-white font-medium">{planDetails.name} Plan</p>
                <p className="text-slate-400 text-sm">{planDetails.period}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {planDetails.price ? `$${planDetails.price}` : 'Custom'}
                </p>
                {planDetails.price && <p className="text-slate-400 text-sm">per user/month</p>}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-2">Included features:</p>
              <ul className="space-y-2">
                {planDetails.features.slice(0, 6).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-slate-300 text-sm">
                    <Check className="w-4 h-4 text-green-400" />
                    {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <Shield className="w-4 h-4" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <form onSubmit={handlePayment}>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Payment Method</h2>

              {/* Payment Methods */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedMethod === method.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <method.icon className={`w-6 h-6 mb-2 ${selectedMethod === method.id ? 'text-orange-500' : 'text-slate-600'}`} />
                    <p className="font-medium text-slate-900 text-sm">{method.name}</p>
                    <p className="text-xs text-slate-500">{method.desc}</p>
                  </button>
                ))}
              </div>

              {/* Card Details (shown when card is selected) */}
              {selectedMethod === 'card' && (
                <div className="space-y-4 mb-6 p-4 bg-slate-50 rounded-xl">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* EcoCash Details */}
              {selectedMethod === 'ecocash' && (
                <div className="space-y-4 mb-6 p-4 bg-slate-50 rounded-xl">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">EcoCash Number</label>
                    <input
                      type="tel"
                      placeholder="+263 77X XXX XXXX"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <p className="text-sm text-slate-500">You will receive an STK push prompt to confirm payment</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay ${planDetails.price || 'Custom Price'}
                  </>
                )}
              </button>

              <p className="text-center text-slate-500 text-sm mt-4 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Your payment is secured with 256-bit SSL encryption
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
