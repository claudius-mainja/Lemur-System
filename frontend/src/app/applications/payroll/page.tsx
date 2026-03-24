'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Calculator, ArrowRight, Check, ChevronRight, TrendingUp, Shield,
  PiggyBank, CreditCard, FileText, Clock, Building2, CheckCircle2, Banknote
} from 'lucide-react';

const features = [
  {
    title: 'Salary Processing',
    description: 'Process employee salaries with accuracy and speed',
    icon: Banknote,
    items: ['Multi-payroll schedules', 'Salary components', 'Deductions management', 'Bonus handling', 'Reimbursement processing']
  },
  {
    title: 'Tax Calculations',
    description: 'Automated tax calculations and compliance',
    icon: Calculator,
    items: ['Tax bracket application', 'Withholding calculations', 'Tax form generation', 'Multi-state support', 'Year-end tax reports']
  },
  {
    title: 'Payslip Generation',
    description: 'Generate detailed payslips for all employees',
    icon: FileText,
    items: ['Digital payslips', 'Earnings breakdown', 'Deduction details', 'YTD summaries', 'Secure distribution']
  },
  {
    title: 'Direct Deposit',
    description: 'Fast and secure direct deposit payments',
    icon: CreditCard,
    items: ['Bank account management', 'Split deposits', 'Scheduled payments', 'Payment confirmation', 'Failed payment handling']
  },
  {
    title: 'Payroll Reports',
    description: 'Comprehensive payroll reporting and analytics',
    icon: TrendingUp,
    items: ['Payroll summaries', 'Cost analysis', 'Tax reports', 'Audit trails', 'Custom reports']
  },
  {
    title: 'Compliance',
    description: 'Stay compliant with labor laws and regulations',
    icon: Shield,
    items: ['Labor law updates', 'Policy enforcement', 'Document retention', 'Audit support', 'Compliance alerts']
  }
];

const stats = [
  { value: '99.9%', label: 'Payment Accuracy', icon: CheckCircle2 },
  { value: '50%', label: 'Time Saved', icon: Clock },
  { value: '100%', label: 'Tax Compliance', icon: Shield },
  { value: '10K+', label: 'Employees Paid Monthly', icon: Building2 },
];

const benefits = [
  { title: 'Automated Calculations', desc: 'Eliminate manual errors with automated salary, tax, and deduction calculations' },
  { title: 'SADC Tax Compliance', desc: 'Built-in compliance with South African SARS and other SADC country tax regulations' },
  { title: 'Direct Bank Integration', desc: 'Seamless integration with major South African banks for direct deposit processing' },
  { title: 'Employee Self-Service', desc: 'Employees can view payslips, update banking details, and request leave' },
];

export default function PayrollPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="applications" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
              <PiggyBank className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-xs uppercase tracking-wider">Payroll Module</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase">
              SIMPLIFY YOUR
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent">
                PAYROLL PROCESSING
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Streamline payroll processing with automated calculations, tax compliance, 
              and direct deposit capabilities. Pay your employees accurately and on time, 
              every time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all">
                Schedule Demo
              </Link>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Automated Taxes</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Direct Deposit</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Tax Compliance</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Payslip Generation</span>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop"
                alt="Payroll Management"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 space-y-3">
                {/* Mini Dashboard */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Payroll Summary - March 2026</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">248</div>
                      <div className="text-[9px] text-white/40">Employees</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-emerald-400">R4.2M</div>
                      <div className="text-[9px] text-white/40">Total Payroll</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-amber-400">R892K</div>
                      <div className="text-[9px] text-white/40">Tax Deductions</div>
                    </div>
                  </div>
                </div>

                {/* Recent Payslips */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Processed This Month</div>
                  <div className="space-y-2">
                    {[
                      { name: 'Sarah Johnson', net: 'R28,500', status: 'Paid' },
                      { name: 'Michael Chen', net: 'R35,200', status: 'Paid' },
                      { name: 'Emma Wilson', net: 'R24,800', status: 'Pending' },
                    ].map((payslip, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <div className="text-white text-xs">{payslip.name}</div>
                          <div className="text-white/40 text-[9px]">Net Pay: {payslip.net}</div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${payslip.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {payslip.status}
                        </span>
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
                  <div className="text-xs font-bold text-white">99.9%</div>
                  <div className="text-[10px] text-emerald-400">Accuracy Rate</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">SARS</div>
                  <div className="text-[10px] text-emerald-400">Tax Compliant</div>
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
                <stat.icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
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
              POWERFUL PAYROLL FEATURES
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Everything you need to manage payroll accurately and efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#0b2a38]/50 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/60">
                      <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
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
                WHY CHOOSE OUR PAYROLL MODULE?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4 bg-[#0b2a38]/50 border border-white/10 rounded-xl p-5">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-emerald-400" />
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
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=500&fit=crop"
                alt="Payroll"
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
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 rounded-2xl p-10 text-center relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop"
              alt="Payroll"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase">
                READY TO SIMPLIFY PAYROLL?
              </h2>
              <p className="text-white/80 text-sm mb-6 max-w-lg mx-auto">
                Join hundreds of companies using LemurSystem Payroll to process salaries accurately and on time.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/free-trial" className="px-8 py-3 bg-white text-emerald-600 font-medium rounded-lg hover:bg-white/90 transition flex items-center gap-2">
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
