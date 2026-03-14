'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Check, ChevronRight, PiggyBank, Calculator, FileText, CreditCard, BarChart2, Shield } from 'lucide-react';

const features = [
  { title: 'Salary Processing', description: 'Process employee salaries with accuracy and speed', items: ['Multi-payroll schedules', 'Salary components', 'Deductions management', 'Bonus handling', 'Reimbursement processing'] },
  { title: 'Tax Calculations', description: 'Automated tax calculations and compliance', items: ['Tax bracket application', 'Withholding calculations', 'Tax form generation', 'Multi-state support', 'Year-end tax reports'] },
  { title: 'Payslip Generation', description: 'Generate detailed payslips for all employees', items: ['Digital payslips', 'Earnings breakdown', 'Deduction details', 'YTD summaries', 'Secure distribution'] },
  { title: 'Direct Deposit', description: 'Fast and secure direct deposit payments', items: ['Bank account management', 'Split deposits', 'Scheduled payments', 'Payment confirmation', 'Failed payment handling'] },
  { title: 'Payroll Reports', description: 'Comprehensive payroll reporting and analytics', items: ['Payroll summaries', 'Cost analysis', 'Tax reports', 'Audit trails', 'Custom reports'] },
  { title: 'Compliance', description: 'Stay compliant with labor laws and regulations', items: ['Labor law updates', 'Policy enforcement', 'Document retention', 'Audit support', 'Compliance alerts'] },
];

const stats = [
  { value: '99.9%', label: 'PAYMENT ACCURACY' },
  { value: '50%', label: 'TIME SAVED' },
  { value: '100%', label: 'TAX COMPLIANCE' },
  { value: '10K+', label: 'EMPLOYEES PAID MONTHLY' },
];

export default function PayrollPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #f97316 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #f59e0b 100%)', bottom: '20%', left: '10%' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <Navbar activePage="applications" />

      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-6 border border-blue-500/30">APPLICATION</div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 uppercase font-serif">Payroll</h1>
            <p className="text-lg text-slate-400 mb-8">Streamline payroll processing with automated calculations, tax compliance, and direct deposit capabilities.</p>
            <div className="flex flex-wrap gap-3">
              {['Salary Processing', 'Tax Compliance', 'Direct Deposit', 'Reports'].map((tag, i) => (<span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full border border-slate-700">{tag}</span>))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl p-8 text-white">
            <PiggyBank className="w-16 h-16 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Effortless Payroll</h3>
            <p className="text-blue-100 mb-6">Process payroll accurately and on time, every time.</p>
            <ul className="space-y-3">
              {['Automated calculations', 'Tax filing made easy', 'Direct deposit support', 'Full compliance'].map((b, i) => (<li key={i} className="flex items-center gap-2"><Check className="w-5 h-5 text-blue-200" />{b}</li>))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">{stats.map((s, i) => (<div key={i} className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700"><div className="text-3xl font-bold text-white mb-2">{s.value}</div><div className="text-slate-400 text-sm">{s.label}</div></div>))}</div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 uppercase">Key Features</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-orange-500/30 transition-all hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{f.description}</p>
              <ul className="space-y-2">{f.items.map((item, j) => (<li key={j} className="flex items-center gap-2 text-sm text-slate-500"><ChevronRight className="w-4 h-4 text-orange-500" />{item}</li>))}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-orange-500">
        <div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl font-bold text-white mb-6 uppercase">START YOUR FREE TRIAL</h2><Link href="/login" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl inline-flex items-center gap-2">Get Started <ArrowRight className="w-5 h-5" /></Link></div>
      </section>

      <Footer />
    </div>
  );
}
