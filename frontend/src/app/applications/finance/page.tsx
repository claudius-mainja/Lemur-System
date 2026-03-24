'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  DollarSign, ArrowRight, Check, ChevronRight, TrendingUp, PieChart,
  Receipt, CreditCard, FileText, Wallet, Building2, CheckCircle2
} from 'lucide-react';

const features = [
  {
    title: 'General Ledger',
    description: 'Complete chart of accounts with double-entry bookkeeping',
    icon: BookOpen,
    items: ['Chart of accounts', 'Journal entries', 'Trial balance', 'Account reconciliation', 'Audit trails']
  },
  {
    title: 'Accounts Payable',
    description: 'Track bills, payments, and vendor relationships',
    icon: CreditCard,
    items: ['Bill management', 'Payment scheduling', 'Vendor credits', 'Early payment discounts', 'Aging reports']
  },
  {
    title: 'Accounts Receivable',
    description: 'Manage invoices, payments, and customer accounts',
    icon: Receipt,
    items: ['Invoice generation', 'Payment tracking', 'Customer credits', 'Collection management', 'Aging analysis']
  },
  {
    title: 'Financial Reporting',
    description: 'Generate balance sheets, P&L, and cash flow statements',
    icon: PieChart,
    items: ['Balance sheet', 'Profit & Loss', 'Cash flow', 'Custom reports', 'Export capabilities']
  },
  {
    title: 'Budget Management',
    description: 'Create and track budgets across departments',
    icon: FileText,
    items: ['Budget creation', 'Variance analysis', 'Department budgets', 'Forecast reports', 'Approval workflows']
  },
  {
    title: 'Asset Tracking',
    description: 'Manage and depreciate company assets',
    icon: Building2,
    items: ['Asset register', 'Depreciation schedules', 'Maintenance tracking', 'Asset valuation', 'Disposal management']
  }
];

const stats = [
  { value: '100%', label: 'Accurate Accounting', icon: CheckCircle2 },
  { value: '60%', label: 'Time Saved', icon: TrendingUp },
  { value: 'REAL-TIME', label: 'Financial Insights', icon: PieChart },
  { value: 'MULTI-CURRENCY', label: 'SADC Support', icon: DollarSign },
];

const benefits = [
  { title: 'Real-time Reporting', desc: 'Get instant visibility into your financial health with live dashboards and reports' },
  { title: 'Multi-currency Support', desc: 'Handle transactions in ZAR, BWP, NAD, USD and other SADC currencies' },
  { title: 'Tax Compliance', desc: 'Built-in compliance with SADC tax regulations and reporting requirements' },
  { title: 'Bank Integration', desc: 'Connect your bank accounts for automatic reconciliation and transaction imports' },
];

function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="applications" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-xs uppercase tracking-wider">Finance Module</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase">
              MANAGE YOUR
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                FINANCES EFFECTIVELY
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Complete financial management from invoicing to reporting. 
              Track expenses, manage cash flow, and gain real-time insights into your 
              business finances with comprehensive accounting tools.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all">
                Schedule Demo
              </Link>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Double-entry Accounting</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Multi-currency</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Tax Compliance</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Bank Reconciliation</span>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop"
                alt="Finance Management"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 space-y-3">
                {/* Mini Dashboard */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Financial Overview</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-emerald-400">+12.5%</div>
                      <div className="text-[9px] text-white/40">Revenue</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">R245K</div>
                      <div className="text-[9px] text-white/40">Expenses</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-amber-400">R892K</div>
                      <div className="text-[9px] text-white/40">Profit</div>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Recent Transactions</div>
                  <div className="space-y-2">
                    {[
                      { desc: 'Invoice #1245 - Client Payment', amount: '+R15,000', type: 'income' },
                      { desc: 'Office Supplies - Vendor Payment', amount: '-R2,340', type: 'expense' },
                      { desc: 'Consulting Services - Invoice #1246', amount: '+R45,000', type: 'income' },
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-white text-xs truncate">{tx.desc}</span>
                        <span className={`text-xs font-medium ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>{tx.amount}</span>
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
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">+23.5%</div>
                  <div className="text-[10px] text-emerald-400">Revenue Growth</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Cash Flow</div>
                  <div className="text-[10px] text-amber-400">Healthy Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-[#0b2a38]/50 border border-white/10 rounded-2xl p-6 text-center">
                <stat.icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/40 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#061520]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-tight">
              POWERFUL FINANCE FEATURES
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Everything you need to manage your business finances effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#0b2a38]/50 border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/60">
                      <Check className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 uppercase">
                WHY CHOOSE OUR FINANCE MODULE?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4 bg-[#0b2a38]/50 border border-white/10 rounded-xl p-5">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-white/50 text-sm">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=500&fit=crop"
                alt="Finance Dashboard"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b2535] via-transparent to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 rounded-2xl p-10 text-center relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop"
              alt="Finance"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase">
                READY TO STREAMLINE FINANCES?
              </h2>
              <p className="text-white/80 text-sm mb-6 max-w-lg mx-auto">
                Join hundreds of companies using LemurSystem Finance to manage their business finances.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/free-trial" className="px-8 py-3 bg-white text-amber-600 font-medium rounded-lg hover:bg-white/90 transition flex items-center gap-2">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
