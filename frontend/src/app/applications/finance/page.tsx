'use client';

import Link from 'next/link';
import { ArrowLeft, Wallet, Receipt, Building2, TrendingUp, PieChart, CreditCard, CheckCircle } from 'lucide-react';

const features = [
  { title: 'General Ledger', description: 'Complete chart of accounts with double-entry bookkeeping', icon: Wallet },
  { title: 'Accounts Payable', description: 'Track bills, payments, and vendor relationships', icon: CreditCard },
  { title: 'Accounts Receivable', description: 'Manage invoices, payments, and customer accounts', icon: Receipt },
  { title: 'Fixed Assets', description: 'Track and depreciate company assets', icon: Building2 },
  { title: 'Financial Reports', description: 'Generate balance sheets, P&L, and cash flow statements', icon: PieChart },
  { title: 'Budget Tracking', description: 'Compare actuals against budgets with variance analysis', icon: TrendingUp },
];

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl"><span className="text-white font-bold text-lg">L</span></div>
              <span className="font-bold text-xl">LemurSystem</span>
            </Link>
            <div className="hidden md:flex gap-8"><Link href="/">Home</Link><Link href="/pricing">Pricing</Link></div>
            <div className="hidden md:flex gap-3"><Link href="/login">Log in</Link><Link href="/login" className="px-5 py-2.5 bg-primary text-white rounded-lg">Start Free Trial</Link></div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-8"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">Application</div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 uppercase">Finance</h1>
              <p className="text-lg text-slate-600 mb-8">Comprehensive accounting and financial management. From invoicing to financial reporting, manage all your finances in one place.</p>
              <div className="flex flex-wrap gap-3">
                {['Accounting', 'Invoicing', 'Reporting', 'Assets'].map((tag, i) => (<span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">{tag}</span>))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-8 text-white">
              <Wallet className="w-16 h-16 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Complete Financial Control</h3>
              <p className="text-purple-100 mb-6">Real-time insights into your business finances.</p>
              <ul className="space-y-3">
                {['Real-time reporting', 'Multi-currency', 'Bank reconciliation', 'Tax compliance'].map((b, i) => (<li key={i} className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-purple-200" />{b}</li>))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 uppercase">Key Features</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((f, i) => (<div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl"><div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4"><f.icon className="w-6 h-6 text-purple-600" /></div><h3 className="text-lg font-semibold mb-2">{f.title}</h3><p className="text-slate-600 text-sm">{f.description}</p></div>))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl font-bold text-white mb-6 uppercase">Start Your Free Trial</h2><Link href="/login" className="px-8 py-4 bg-white text-primary font-semibold rounded-xl">Start Free Trial</Link></div>
      </section>

      <footer className="bg-slate-900 text-white py-12"><div className="max-w-7xl mx-auto text-center"><p className="text-slate-400">© 2026 LemurSystem. A product of Blacklemur Innovations.</p></div></footer>
    </div>
  );
}
