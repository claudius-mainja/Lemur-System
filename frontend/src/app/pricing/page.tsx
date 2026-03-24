'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Check, ChevronDown, ChevronUp, CreditCard, Users, Building2, 
  Shield, Zap, Clock, Globe, ArrowRight, Sparkles, DollarSign,
  BarChart3, Package, Truck, Phone, Mail, CheckCircle2, Star
} from 'lucide-react';

const pricingPlans = [
  {
    name: 'STARTER',
    description: 'Perfect for small businesses just getting started with basic business management needs.',
    price: 10.60,
    period: 'USER/MONTH',
    maxUsers: 6,
    applications: ['HR', 'Finance', 'Supply Chain'],
    storage: '10 GB',
    features: [
      'Up to 6 users',
      '3 Core Applications - HR, Finance & Supply Chain',
      '10 GB secure cloud storage',
      'Email support (48hr response)',
      'Basic reporting & dashboards',
      'Mobile app access (iOS & Android)',
      'Standard integrations (Excel export)',
      'Daily automated backups',
      'Core HR features (employee directory, basic leave)',
      'Basic invoicing & expense tracking',
      'Inventory management (up to 100 items)',
      'Onboarding guide & documentation',
    ],
    notIncluded: [
      'Advanced CRM features',
      'Automated payroll processing',
      'Productivity suite (tasks, projects)',
      'API access for integrations',
      'Custom integrations',
      'SSO authentication',
      'Priority support',
      'Advanced analytics',
      'Custom reporting',
    ],
    cta: 'BUY THIS PACKAGE',
    popular: false,
    color: 'from-primary to-secondary',
  },
  {
    name: 'PROFESSIONAL',
    description: 'Best for growing companies that need advanced features and multiple business modules.',
    price: 20.50,
    period: 'USER/MONTH',
    maxUsers: 12,
    applications: ['HR', 'Finance', 'CRM', 'Payroll', 'Productivity', 'Supply Chain'],
    storage: '100 GB',
    features: [
      'Up to 12 users (easily scalable)',
      '6 Complete Applications - HR, Finance, CRM, Payroll, Productivity & Supply Chain',
      '100 GB secure cloud storage',
      'Priority email & chat support (4hr response)',
      'Advanced reporting & analytics',
      'Mobile app access (iOS & Android)',
      'Full API access for custom integrations',
      'Custom integrations (QuickBooks, Xero, Slack)',
      'SSO authentication support',
      'Advanced HR features (performance reviews, recruitment)',
      'Complete payroll with tax compliance',
      'Full CRM with sales pipeline',
      'Project & task management',
      'Document management & collaboration',
      'Marketing automation tools',
      'Help desk & customer service',
      'Real-time sync across modules',
      'Custom workflows & automation',
      'Priority onboarding support',
    ],
    notIncluded: [
      'Dedicated account manager',
      'On-premise deployment option',
      '24/7 dedicated support',
      'Custom SLA guarantee',
      'White-label solutions',
    ],
    cta: 'BUY THIS PACKAGE',
    popular: true,
    color: 'from-accent to-accentDark',
  },
  {
    name: 'ENTERPRISE',
    description: 'Custom solutions for large organizations with specific requirements and unlimited scale.',
    price: null,
    period: 'CUSTOM',
    maxUsers: 'Unlimited',
    applications: ['All 8 Applications + Custom'],
    storage: 'Unlimited',
    features: [
      'Unlimited users - scale without limits',
      'All 8 Applications + Custom modules',
      'Unlimited secure cloud storage',
      '24/7 dedicated support with SLA guarantee',
      'Custom reporting & dashboards',
      'Full API access with documentation',
      'Unlimited custom integrations',
      'SSO & advanced security (HIPAA ready)',
      'Dedicated account manager',
      'On-premise deployment option',
      'White-label solutions available',
      'Custom SLA guarantee',
      'Custom training programs',
      'Priority feature requests',
      'Advanced audit logging',
      'Multi-organization support',
      'Custom data retention policies',
      'API rate limit increases',
      'Integration development support',
      'Executive business reviews (quarterly)',
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
    answer: 'Our 14-day free trial includes full access to all features in your chosen plan. No credit card required to start. You can explore everything before committing. All data is preserved if you decide to upgrade.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated based on your usage. Downgrading may limit access to features temporarily.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), bank transfers, and mobile payment methods popular in SADC countries including EcoCash, M-Pesa, and instant EFT.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use bank-level 256-bit AES encryption for data at rest and in transit. We are SOC 2 Type II compliant, perform daily automated backups, and maintain 99.99% uptime SLA.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'Starter plans receive email support with 48-hour response times. Professional plans include priority email and chat support with 4-hour response times. Enterprise plans receive 24/7 dedicated support with a dedicated account manager.',
  },
  {
    question: 'Can I add extra users beyond my plan limit?',
    answer: 'Yes! You can add extra users at $5/month each beyond your plan limit. This is perfect for seasonal growth or temporary team expansions.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes! Annual billing saves you 20% compared to monthly payments. Enterprise customers may qualify for additional volume discounts - contact our sales team for details.',
  },
  {
    question: 'Can I export my data if I decide to leave?',
    answer: 'Always. You own your data. Export all your data anytime in standard formats (CSV, Excel, JSON). We never lock you in - your business data belongs to you.',
  },
];

const comparisonFeatures = [
  { name: 'Users', starter: 'Up to 6', professional: 'Up to 12', enterprise: 'Unlimited' },
  { name: 'Cloud Storage', starter: '10 GB', professional: '100 GB', enterprise: 'Unlimited' },
  { name: 'Applications', starter: '3 Modules', professional: '6 Modules', enterprise: 'All + Custom' },
  { name: 'Support Response', starter: '48 hours', professional: '4 hours', enterprise: '24/7 Priority' },
  { name: 'Mobile App', starter: true, professional: true, enterprise: true },
  { name: 'API Access', starter: false, professional: true, enterprise: true },
  { name: 'SSO Authentication', starter: false, professional: true, enterprise: true },
  { name: 'Custom Integrations', starter: false, professional: true, enterprise: true },
  { name: 'Dedicated Account Manager', starter: false, professional: false, enterprise: true },
  { name: 'On-Premise Option', starter: false, professional: false, enterprise: true },
  { name: 'SLA Guarantee', starter: false, professional: false, enterprise: true },
  { name: 'Custom Training', starter: false, professional: false, enterprise: true },
];

const testimonials = [
  {
    name: 'Thabo Molefe',
    role: 'CEO',
    company: 'TechStart Johannesburg',
    quote: 'LemurSystem transformed how we manage our 50-person team. The payroll module alone saved us 20 hours per month.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Amara Nkosi',
    role: 'Operations Director',
    company: 'Logistics Pro Botswana',
    quote: 'The inventory management is incredible. We reduced stock discrepancies by 95% in the first quarter.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Carlos Mthethwa',
    role: 'Finance Manager',
    company: 'RetailMax Namibia',
    quote: 'Finally, an ERP that understands African business needs. Multi-currency support is seamless.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
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

      {/* Hero Section - Match About Page Style */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
              <DollarSign className="w-4 h-4 text-accent" />
              <span className="text-white/60 text-xs uppercase tracking-wider">Transparent Pricing</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase">
              SIMPLE, SCALABLE
              <br />
              <span className="bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark bg-clip-text text-transparent">
                PRICING PLANS
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Start free and scale as you grow. No hidden fees, no surprises. 
              Choose the plan that fits your business today and upgrade anytime as you expand.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
<Link href="/register" className="px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-medium rounded-lg hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center gap-2">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all">
                Talk to Sales
              </Link>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Check className="w-4 h-4 text-accent" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Check className="w-4 h-4 text-accent" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Check className="w-4 h-4 text-accent" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Check className="w-4 h-4 text-accent" />
                <span>Your data is portable</span>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accentDark rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-[#061c26] px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-xs text-white font-medium">Plan Overview</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Plan Cards Mini */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#061c26] rounded-lg p-3 text-center border border-white/5">
                    <div className="text-[10px] text-white/40 uppercase mb-1">Starter</div>
                    <div className="text-lg font-bold text-white">$10.60</div>
                    <div className="text-[9px] text-white/30">/user/mo</div>
                  </div>
                  <div className="bg-accent/20 rounded-lg p-3 text-center border border-accent/50">
                    <div className="text-[10px] text-accent uppercase mb-1">Professional</div>
                    <div className="text-lg font-bold text-white">$20.50</div>
                    <div className="text-[9px] text-white/30">/user/mo</div>
                  </div>
                  <div className="bg-[#061c26] rounded-lg p-3 text-center border border-white/5">
                    <div className="text-[10px] text-white/40 uppercase mb-1">Enterprise</div>
                    <div className="text-lg font-bold text-white">Custom</div>
                    <div className="text-[9px] text-white/30">pricing</div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-[#061c26] rounded-lg p-4">
                  <div className="text-[10px] text-white/40 uppercase mb-2">What's Included</div>
                  <div className="space-y-2">
                    {[
                      { icon: Users, text: 'Up to 12 users' },
                      { icon: Building2, text: '6 Business Modules' },
                      { icon: Shield, text: 'Enterprise Security' },
                      { icon: Globe, text: 'SADC Coverage' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <item.icon className="w-3 h-3 text-accent" />
                        <span className="text-[10px] text-white/70">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">No Hidden Fees</div>
                  <div className="text-[10px] text-emerald-400">Transparent pricing</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Save 20%</div>
                  <div className="text-[10px] text-accent">Annual billing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className={`text-sm font-bold uppercase ${billingCycle === 'monthly' ? 'text-white' : 'text-white/30'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors ${billingCycle === 'annual' ? 'bg-accent' : 'bg-white/20'}`}
            >
              <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${billingCycle === 'annual' ? 'left-8' : 'left-1'}`} />
            </button>
            <span className={`text-sm font-bold uppercase ${billingCycle === 'annual' ? 'text-white' : 'text-white/30'}`}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <span className="ml-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full">
                Save 20%
              </span>
            )}
          </div>

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
                          <p className="text-white/30 text-xs mt-2 uppercase tracking-wider">Billed annually - Save 20%</p>
                        )}
                      </>
                    ) : (
                      <div className="text-5xl font-bold text-white uppercase">Custom</div>
                    )}
                  </div>

                  <Link
                    href={plan.price === null ? "/contact" : `/create-account?plan=${plan.name.toLowerCase()}`}
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

      {/* Feature Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#061520]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3 uppercase tracking-wide">COMPARE PLANS</h2>
            <p className="text-white/40">See what's included in each plan</p>
          </div>

          <div className="bg-[#0b2535]/50 border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-white/5 border-b border-white/10">
              <div className="text-white/40 text-sm font-medium">Feature</div>
              <div className="text-center text-sm font-bold text-white">Starter</div>
              <div className="text-center text-sm font-bold text-accent">Professional</div>
              <div className="text-center text-sm font-bold text-white">Enterprise</div>
            </div>
            {comparisonFeatures.map((feature, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 last:border-0">
                <div className="text-white/60 text-sm">{feature.name}</div>
                <div className="text-center text-sm">
                  {typeof feature.starter === 'boolean' ? (
                    feature.starter ? <Check className="w-4 h-4 text-accent mx-auto" /> : <span className="text-white/30">—</span>
                  ) : (
                    <span className="text-white/70">{feature.starter}</span>
                  )}
                </div>
                <div className="text-center text-sm">
                  {typeof feature.professional === 'boolean' ? (
                    feature.professional ? <Check className="w-4 h-4 text-accent mx-auto" /> : <span className="text-white/30">—</span>
                  ) : (
                    <span className="text-white/70">{feature.professional}</span>
                  )}
                </div>
                <div className="text-center text-sm">
                  {typeof feature.enterprise === 'boolean' ? (
                    feature.enterprise ? <Check className="w-4 h-4 text-accent mx-auto" /> : <span className="text-white/30">—</span>
                  ) : (
                    <span className="text-white/70">{feature.enterprise}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3 uppercase tracking-wide">TRUSTED BY BUSINESSES</h2>
            <p className="text-white/40">See what our customers say about LemurSystem</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-[#0b2535]/50 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-white font-medium text-sm">{testimonial.name}</div>
                    <div className="text-white/40 text-xs">{testimonial.role}, {testimonial.company}</div>
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
              Join thousands of businesses already using LemurSystem. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-3 bg-white text-accent font-bold uppercase tracking-wider rounded-lg hover:bg-white/90 transition"
              >
                Start Free Trial
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 border-2 border-white text-white font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 transition"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
