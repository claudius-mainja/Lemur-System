'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

const pricingPlans = [
  {
    name: 'STARTER',
    description: 'Perfect for small businesses just getting started',
    price: 10.60,
    period: 'USER/MONTH',
    maxUsers: 6,
    applications: ['HR', 'Finance', 'Supply Chain'],
    storage: '10 GB',
    features: [
      'Up to 6 users',
      '3 Applications - HR, Finance & Supply Chain',
      '10 GB cloud storage',
      'Email support',
      'Basic reporting',
      'Mobile app access',
    ],
    notIncluded: [
      'CRM',
      'Payroll',
      'Productivity',
      'API access',
      'Custom integrations',
      'SSO authentication',
      'Priority support',
      'Advanced analytics',
    ],
    cta: 'BUY THIS PACKAGE',
    popular: false,
    color: 'from-primary to-secondary',
  },
  {
    name: 'PROFESSIONAL',
    description: 'Best for growing companies with advanced needs',
    price: 20.50,
    period: 'USER/MONTH',
    maxUsers: 50,
    applications: ['HR', 'Finance', 'CRM', 'Payroll', 'Productivity', 'Supply Chain'],
    storage: '100 GB',
    features: [
      'Up to 50 users',
      '6 Applications - HR, Finance, CRM, Payroll, Productivity & Supply Chain',
      '100 GB cloud storage',
      'Priority email & chat support',
      'Advanced reporting & analytics',
      'Mobile app access',
      'API access',
      'Custom integrations',
      'SSO authentication',
    ],
    notIncluded: [
      'Dedicated account manager',
      'On-premise deployment',
      '24/7 dedicated support',
    ],
    cta: 'BUY THIS PACKAGE',
    popular: true,
    color: 'from-accent to-accentDark',
  },
  {
    name: 'ENTERPRISE',
    description: 'Custom solutions for large organizations',
    price: null,
    period: 'CUSTOM',
    maxUsers: 'Unlimited',
    applications: ['All 8 Applications + custom'],
    storage: 'Unlimited',
    features: [
      'Unlimited users',
      'All 8 Applications + custom',
      'Unlimited cloud storage',
      '24/7 dedicated support',
      'Custom reporting & dashboards',
      'Full API access',
      'Custom integrations',
      'SSO & advanced security',
      'Dedicated account manager',
      'On-premise deployment option',
      'SLA guarantee',
      'Custom training',
    ],
    notIncluded: [],
    cta: 'CONTACT SALES',
    popular: false,
    color: 'from-accentDark to-primary',
  },
];

const faqs = [
  {
    question: 'What is included in the free trial?',
    answer: 'Our 14-day free trial includes full access to all features in your chosen plan. No credit card required to start. You can explore everything before committing.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, bank transfers, and mobile payment methods popular in SADC countries.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use bank-level 256-bit encryption and are SOC 2 compliant. Your data is backed up daily.',
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-accent/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <Navbar activePage="pricing" />

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] flex items-center">
        <div className="text-center max-w-4xl mx-auto w-full">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
            CHOOSE THE RIGHT PLAN
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark">
              FOR YOUR BUSINESS
            </span>
          </h1>
          <p className="text-base text-white/40 mb-8 max-w-xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold uppercase ${billingCycle === 'monthly' ? 'text-white' : 'text-white/30'}`}>
              MONTHLY
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors ${billingCycle === 'annual' ? 'bg-accent' : 'bg-white/20'}`}
            >
              <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${billingCycle === 'annual' ? 'left-8' : 'left-1'}`} />
            </button>
            <span className={`text-sm font-bold uppercase ${billingCycle === 'annual' ? 'text-white' : 'text-white/30'}`}>
              ANNUAL
            </span>
            {billingCycle === 'annual' && (
              <span className="ml-2 px-3 py-1 bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider rounded-full">
                SAVE 20%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl overflow-hidden ${
                  plan.popular
                    ? 'bg-[#0b2535] border-2 border-accent shadow-xl'
                    : 'bg-[#0b2535]/50 border border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent to-accentDark text-white text-xs font-bold uppercase tracking-wider rounded-b-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">{plan.name}</h3>
                    <p className="text-white/40 text-sm">{plan.description}</p>
                  </div>

                  <div className="text-center mb-6">
                    {plan.price !== null ? (
                      <>
                        <div className="flex items-end justify-center gap-1">
                          <span className="text-5xl font-bold text-white">
                            ${billingCycle === 'annual' ? (plan.price * 0.8).toFixed(2) : plan.price.toFixed(2)}
                          </span>
                          <span className="text-white/40 text-sm mb-2 uppercase tracking-wider">/{plan.period}</span>
                        </div>
                        {billingCycle === 'annual' && (
                          <p className="text-white/30 text-xs mt-2 uppercase tracking-wider">Billed annually</p>
                        )}
                      </>
                    ) : (
                      <div className="text-5xl font-bold text-white uppercase">Custom</div>
                    )}
                  </div>

                  <Link
                    href={plan.price === null ? "/contact" : "/payment"}
                    className={`block w-full py-4 px-6 rounded-xl font-bold text-center transition-all duration-300 uppercase tracking-wider ${
                      plan.popular
                        ? 'bg-gradient-to-r from-accent to-accentDark text-white hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-1'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-white/60 font-medium">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-4 h-4 rounded-full border border-white/20" />
                        <span className="text-white/30">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#061520]/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3 uppercase tracking-wide">FREQUENTLY ASKED QUESTIONS</h2>
            <p className="text-white/40">Have questions? We're here to help.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#0b2535]/50 border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between"
                >
                  <span className="font-bold text-white uppercase tracking-wide text-sm">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-accent" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/40" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-white/40">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-accentDark via-accent to-primary rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide">
              READY TO GET STARTED?
            </h2>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              Join thousands of businesses already using LemurSystem
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/payment"
                className="px-8 py-3 bg-white text-accent font-bold uppercase tracking-wider rounded-lg hover:bg-white/90 transition"
              >
                BUY NOW
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 border-2 border-white text-white font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 transition"
              >
                CONTACT SALES
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
