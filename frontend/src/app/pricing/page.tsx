'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ChevronDown, ChevronUp, ArrowRight, Star, Users, Building2, Globe, Shield, Zap, HeadphonesIcon, Sparkles, Hexagon, Circle, Triangle, Menu } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small businesses just getting started',
    price: 10.60,
    period: 'user/month',
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
    cta: 'Start Free Trial',
    popular: false,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Professional',
    description: 'Best for growing companies with advanced needs',
    price: 20.50,
    period: 'user/month',
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
    cta: 'Start Free Trial',
    popular: true,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: null,
    period: 'custom',
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
    cta: 'Contact Sales',
    popular: false,
    color: 'from-amber-500 to-orange-500',
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] animate-blob"
          style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f43f5e 100%)', top: '10%', left: '10%' }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px] animate-blob"
          style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #f59e0b 100%)', bottom: '20%', right: '10%', animationDelay: '2s' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <Hexagon className="absolute top-40 left-20 w-20 h-20 text-purple-500/10 animate-float" />
        <Circle className="absolute top-1/3 right-40 w-16 h-16 text-pink-500/10 animate-float" style={{ animationDelay: '0.5s' }} />
        <Triangle className="absolute bottom-40 right-1/4 w-14 h-14 text-orange-500/10 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-blue-500 to-accent rounded-2xl flex items-center justify-center animate-float-3d">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <span className="font-bold text-2xl text-white font-serif">LemurSystem</span>
                <p className="text-xs text-dark-text-muted -mt-1">Enterprise ERP</p>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {[
                { name: 'Home', href: '/' },
                { name: 'Features', href: '/features' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Industries', href: '/industries' },
                { name: 'Docs', href: '/docs' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                    item.name === 'Pricing' 
                      ? 'text-white bg-white/10' 
                      : 'text-dark-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login" className="px-5 py-2.5 text-dark-text-secondary hover:text-white transition-all duration-300 font-medium">
                Log in
              </Link>
              <Link href="/login" className="px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5">
                Start Free Trial
              </Link>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-dark-text-secondary">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden bg-dark-bg/95 backdrop-blur-xl border-t border-dark-border px-4 py-6 space-y-3">
            {['Home', 'Features', 'Pricing', 'Industries', 'Docs', 'About', 'Contact'].map((item) => (
              <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="block py-3 text-dark-text-secondary hover:text-white">
                {item}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm mb-8 animate-fade-in">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 font-medium">SIMPLE, TRANSPARENT PRICING</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 font-serif uppercase">
            Choose the Right Plan
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              For Your Business
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-text-secondary mb-10 leading-relaxed max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises. 
            Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-dark-text-muted'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors ${billingCycle === 'annual' ? 'bg-purple-500' : 'bg-dark-border'}`}
            >
              <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${billingCycle === 'annual' ? 'left-8' : 'left-1'}`} />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-white' : 'text-dark-text-muted'}`}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <span className="ml-2 px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                plan.popular
                  ? 'bg-gradient-to-b from-purple-500 to-pink-600 text-white transform scale-105 shadow-2xl shadow-purple-500/25'
                  : 'bg-dark-card border-2 border-dark-border hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-full animate-bounce-slow">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-white' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? 'text-purple-100' : 'text-dark-text-muted'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="text-center mb-6">
                {plan.price !== null ? (
                  <>
                    <div className="flex items-end justify-center gap-1">
                      <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-white'}`}>
                        ${billingCycle === 'annual' ? (plan.price * 0.8).toFixed(2) : plan.price.toFixed(2)}
                      </span>
                      <span className={`text-sm mb-2 ${plan.popular ? 'text-purple-100' : 'text-dark-text-muted'}`}>
                        /{plan.period}
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className={`text-xs mt-2 ${plan.popular ? 'text-purple-100' : 'text-dark-text-muted'}`}>
                        Billed annually
                      </p>
                    )}
                  </>
                ) : (
                  <div className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-white'}`}>
                    Custom
                  </div>
                )}
              </div>

              <Link
                href="/login"
                className={`block w-full py-4 px-6 rounded-xl font-bold text-center transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'bg-white text-purple-600 hover:bg-purple-50'
                    : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg'
                }`}
              >
                {plan.cta}
              </Link>

              <div className="mt-8 space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-primary'} flex-shrink-0`} />
                    <span className={`text-sm ${plan.popular ? 'text-purple-100' : 'text-dark-text-secondary'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <X className="w-5 h-5 text-dark-text-muted flex-shrink-0" />
                    <span className="text-sm text-dark-text-muted">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">EVERYTHING YOU NEED</h2>
            <p className="text-dark-text-secondary">Powerful features that help your business thrive</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'HR Management', desc: 'Complete employee lifecycle management', color: 'from-blue-500 to-cyan-500' },
              { icon: Building2, title: 'Finance', desc: 'General ledger, invoicing, and reporting', color: 'from-purple-500 to-pink-500' },
              { icon: Globe, title: 'Supply Chain', desc: 'Inventory and procurement automation', color: 'from-orange-500 to-amber-500' },
              { icon: Shield, title: 'Security', desc: 'Enterprise-grade data protection', color: 'from-green-500 to-emerald-500' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 bg-dark-card/50 border border-dark-border rounded-2xl hover:border-primary/30 transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-dark-text-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-bg-secondary/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">FREQUENTLY ASKED QUESTIONS</h2>
            <p className="text-dark-text-secondary">Have questions? We're here to help.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-purple-500/30 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between"
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-dark-text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-dark-text-muted" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-dark-text-secondary animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-dark-text-secondary mb-4">Still have questions?</p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-purple-400 font-medium hover:underline">
              Contact Support <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-serif uppercase">
            Ready to Transform Your Business?
          </h2>
          <p className="text-purple-100 text-lg mb-10">
            Join thousands of businesses already using LemurSystem
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-purple-600 font-bold rounded-2xl hover:bg-purple-50 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-bg-secondary border-t border-dark-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl text-white font-serif">LemurSystem</span>
              </div>
              <p className="text-dark-text-muted text-sm">
                Cloud-based ERP solution for SADC businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-dark-text-muted text-sm">
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/industries" className="hover:text-white transition">Industries</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-dark-text-muted text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-dark-text-muted text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-dark-border">
            <p className="text-dark-text-muted text-sm text-center">
              © 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
