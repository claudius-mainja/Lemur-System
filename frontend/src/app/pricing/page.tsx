'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ChevronDown, ChevronUp, ArrowRight, Star, Users, Building2, Globe, Shield, Zap, HeadphonesIcon } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small businesses just getting started',
    price: 10.60,
    period: 'user/month',
    features: [
      'Up to 10 users',
      '5 Applications',
      '10 GB cloud storage',
      'Email support',
      'Basic reporting',
      'Mobile app access',
    ],
    notIncluded: [
      'API access',
      'Custom integrations',
      'Priority support',
      'Advanced analytics',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'Best for growing companies with advanced needs',
    price: 20.50,
    period: 'user/month',
    features: [
      'Up to 50 users',
      'All 8 Applications',
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
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: null,
    period: 'custom',
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
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  {
    question: 'What is included in the free trial?',
    answer: 'Our 14-day free trial includes full access to all features in your chosen plan. No credit card required to start. You can explore everything before committing.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard), PayPal, EFT payments, PayNow, PayFlex, SnapScan, and bank transfers for annual Enterprise plans.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Security is our top priority. We use bank-level 256-bit encryption, are SOC 2 Type II certified, and comply with GDPR. Your data is automatically backed up daily across multiple geographic regions.',
  },
  {
    question: 'What happens when my trial ends?',
    answer: 'At the end of your 14-day trial, you can choose a plan that fits your needs. If you don\'t subscribe, your account will be paused, and you can resume anytime with no data loss.',
  },
  {
    question: 'Can I import data from my current system?',
    answer: 'Yes! We offer free data migration assistance for all plans. Our team will help you import data from Excel, CSV, or most popular ERP systems at no extra cost.',
  },
  {
    question: 'Do you offer onboarding support?',
    answer: 'Professional and Enterprise plans include free onboarding sessions with our implementation specialists. Starter plans include access to our comprehensive knowledge base and video tutorials.',
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl text-slate-900 font-serif">LemurSystem</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-slate-600 hover:text-slate-900 transition">Home</Link>
              <Link href="/features" className="text-slate-600 hover:text-slate-900 transition">Features</Link>
              <Link href="/pricing" className="text-primary font-medium">Pricing</Link>
              <Link href="/industries" className="text-slate-600 hover:text-slate-900 transition">Industries</Link>
              <Link href="/about" className="text-slate-600 hover:text-slate-900 transition">About</Link>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-slate-700 font-medium hover:text-slate-900 transition">
                Log in
              </Link>
              <Link href="/login" className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Star className="w-4 h-4" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6 font-serif animate-fade-in-up">
            Choose the Right Plan for Your Business
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Start free and scale as you grow. No hidden fees, no surprises. 
            Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors ${billingCycle === 'annual' ? 'bg-primary' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${billingCycle === 'annual' ? 'left-8' : 'left-1'}`} />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-500'}`}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <span className="ml-2 px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                plan.popular
                  ? 'bg-gradient-to-b from-primary to-blue-700 text-white transform scale-105 shadow-2xl'
                  : 'bg-white border-2 border-slate-100 hover:border-primary/30 hover:shadow-2xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-sm font-semibold rounded-full animate-bounce-slow">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="text-center mb-6">
                {plan.price !== null ? (
                  <>
                    <div className="flex items-end justify-center gap-1">
                      <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                        ${billingCycle === 'annual' ? (plan.price * 0.8).toFixed(2) : plan.price.toFixed(2)}
                      </span>
                      <span className={`text-sm mb-1 ${plan.popular ? 'text-blue-100' : 'text-slate-500'}`}>
                        /{plan.period}
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className={`text-xs mt-1 ${plan.popular ? 'text-blue-100' : 'text-slate-500'}`}>
                        Billed annually
                      </p>
                    )}
                  </>
                ) : (
                  <div className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    Custom
                  </div>
                )}
              </div>

              <Link
                href="/login"
                className={`block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'bg-white text-primary hover:bg-blue-50'
                    : 'bg-primary text-white hover:bg-blue-700'
                }`}
              >
                {plan.cta}
              </Link>

              <div className="mt-6 space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-primary'} flex-shrink-0`} />
                    <span className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <X className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    <span className="text-sm text-slate-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Everything You Need</h2>
            <p className="text-slate-600">Powerful features that help your business thrive</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'HR Management', desc: 'Complete employee lifecycle management' },
              { icon: Building2, title: 'Finance', desc: 'General ledger, invoicing, and reporting' },
              { icon: Globe, title: 'Supply Chain', desc: 'Inventory and procurement automation' },
              { icon: Shield, title: 'Security', desc: 'Enterprise-grade data protection' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Frequently Asked Questions</h2>
            <p className="text-slate-600">Have questions? We're here to help.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between"
                >
                  <span className="font-medium text-slate-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-slate-600 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">Still have questions?</p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
              Contact Support <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-serif">
            Ready to Transform Your Business?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Join thousands of businesses already using LemurSystem
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl font-serif">LemurSystem</span>
              </div>
              <p className="text-slate-400 text-sm">
                Cloud-based ERP solution for small to medium businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
                <li><span className="text-white">Pricing</span></li>
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800">
            <p className="text-slate-400 text-sm text-center">
              © 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
