'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, Menu, X, ChevronRight, PiggyBank, Calculator, FileText, CreditCard, BarChart2, Shield } from 'lucide-react';

const features = [
  { title: 'Salary Processing', description: 'Process employee salaries with accuracy and speed', items: ['Multi-payroll schedules', 'Salary components', 'Deductions management', 'Bonus handling', 'Reimbursement processing'] },
  { title: 'Tax Calculations', description: 'Automated tax calculations and compliance', items: ['Tax bracket application', 'Withholding calculations', 'Tax form generation', 'Multi-state support', 'Year-end tax reports'] },
  { title: 'Payslip Generation', description: 'Generate detailed payslips for all employees', items: ['Digital payslips', 'Earnings breakdown', 'Deduction details', 'YTD summaries', 'Secure distribution'] },
  { title: 'Direct Deposit', description: 'Fast and secure direct deposit payments', items: ['Bank account management', 'Split deposits', 'Scheduled payments', 'Payment confirmation', 'Failed payment handling'] },
  { title: 'Payroll Reports', description: 'Comprehensive payroll reporting and analytics', items: ['Payroll summaries', 'Cost analysis', 'Tax reports', 'Audit trails', 'Custom reports'] },
  { title: 'Compliance', description: 'Stay compliant with labor laws and regulations', items: ['Labor law updates', 'Policy enforcement', 'Document retention', 'Audit support', 'Compliance alerts'] },
];

const stats = [
  { value: '99.9%', label: 'Payment accuracy' },
  { value: '50%', label: 'Time saved' },
  { value: '100%', label: 'Tax compliance' },
  { value: '10k+', label: 'Employees paid monthly' },
];

export default function PayrollPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl"><span className="text-white font-bold text-lg">L</span></div>
              <span className="font-bold text-xl">LemurSystem</span>
            </Link>
            <div className="hidden md:flex gap-8"><Link href="/" className="text-slate-600 hover:text-primary">Home</Link><Link href="/pricing" className="text-slate-600 hover:text-primary">Pricing</Link></div>
            <div className="hidden md:flex gap-3"><Link href="/login" className="text-slate-600 hover:text-primary">Log in</Link><Link href="/login" className="px-5 py-2.5 bg-primary text-white rounded-lg">Start Free Trial</Link></div>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
        {mobileMenuOpen && <div className="md:hidden bg-white border-t p-4"><div className="flex flex-col gap-4"><Link href="/">Home</Link><Link href="/pricing">Pricing</Link><Link href="/login">Log in</Link></div></div>}
      </nav>

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-8"><ArrowRight className="w-4 h-4 rotate-180" /> Back to Home</Link>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">Application</div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 uppercase">Payroll</h1>
              <p className="text-lg text-slate-600 mb-8">Streamline payroll processing with automated calculations, tax compliance, and direct deposit capabilities.</p>
              <div className="flex flex-wrap gap-3">
                {['Salary Processing', 'Tax Compliance', 'Direct Deposit', 'Reports'].map((tag, i) => (<span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">{tag}</span>))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-8 text-white">
              <PiggyBank className="w-16 h-16 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Effortless Payroll</h3>
              <p className="text-emerald-100 mb-6">Process payroll accurately and on time, every time.</p>
              <ul className="space-y-3">
                {['Automated calculations', 'Tax filing made easy', 'Direct deposit support', 'Full compliance'].map((b, i) => (<li key={i} className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-200" />{b}</li>))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">{stats.map((s, i) => (<div key={i} className="text-center p-6 bg-white rounded-xl shadow-sm"><div className="text-3xl font-bold text-primary mb-2">{s.value}</div><div className="text-slate-600 text-sm">{s.label}</div></div>))}</div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 uppercase">Key Features</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mb-4"><f.icon className="w-6 h-6 text-white" /></div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-600 text-sm mb-4">{f.description}</p>
              <ul className="space-y-2">{f.items.map((item, j) => (<li key={j} className="flex items-center gap-2 text-sm text-slate-500"><ChevronRight className="w-4 h-4 text-primary" />{item}</li>))}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl font-bold text-white mb-6 uppercase">Start Your Free Trial</h2><Link href="/login" className="px-8 py-4 bg-white text-primary font-semibold rounded-xl inline-flex items-center gap-2">Get Started <ArrowRight className="w-5 h-5" /></Link></div>
      </section>

      <footer className="bg-slate-900 text-white py-12"><div className="max-w-7xl mx-auto text-center"><p className="text-slate-400">© 2026 LemurSystem. A product of Blacklemur Innovations.</p></div></footer>
    </div>
  );
}
