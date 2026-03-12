'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, Menu, X, ChevronRight, Wallet, CreditCard, Receipt, FileText, TrendingUp, PieChart, Hexagon, Circle } from 'lucide-react';

const features = [
  { title: 'General Ledger', description: 'Complete chart of accounts with double-entry bookkeeping', items: ['Chart of accounts', 'Journal entries', 'Trial balance', 'Account reconciliation', 'Audit trails'] },
  { title: 'Accounts Payable', description: 'Track bills, payments, and vendor relationships', items: ['Bill management', 'Payment scheduling', 'Vendor credits', 'Early payment discounts', 'Aging reports'] },
  { title: 'Accounts Receivable', description: 'Manage invoices, payments, and customer accounts', items: ['Invoice generation', 'Payment tracking', 'Customer credits', 'Collection management', 'Aging analysis'] },
  { title: 'Invoicing', description: 'Create and send professional invoices', items: ['Custom invoices', 'Recurring invoices', 'Multi-currency', 'Invoice templates', 'Payment links'] },
  { title: 'Expense Management', description: 'Track and manage business expenses', items: ['Expense categories', 'Receipt capture', 'Approval workflows', 'Expense reports', 'Policy compliance'] },
  { title: 'Financial Reports', description: 'Generate balance sheets, P&L, and cash flow statements', items: ['Balance sheet', 'Profit & Loss', 'Cash flow', 'Custom reports', 'Export capabilities'] },
];

const stats = [
  { value: '100%', label: 'ACCURATE ACCOUNTING' },
  { value: '60%', label: 'TIME SAVED' },
  { value: 'REAL-TIME', label: 'FINANCIAL INSIGHTS' },
  { value: 'MULTI-CURRENCY', label: 'SADC SUPPORT' },
];

export default function FinancePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #f97316 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #f59e0b 100%)', bottom: '20%', left: '10%' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <span className="font-bold text-2xl text-white font-serif">LemurSystem</span>
                <p className="text-xs text-slate-400 -mt-1">Enterprise ERP</p>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {[{ name: 'HOME', href: '/' }, { name: 'FEATURES', href: '/features' }, { name: 'PRICING', href: '/pricing' }, { name: 'INDUSTRIES', href: '/industries' }, { name: 'DOCS', href: '/docs' }, { name: 'ABOUT', href: '/about' }, { name: 'CONTACT', href: '/contact' }].map((item) => (
                <Link key={item.name} href={item.href} className="px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5">
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login" className="px-5 py-2.5 text-slate-400 hover:text-white transition-all duration-300 font-medium">Log in</Link>
              <Link href="/login" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5">Start Free Trial</Link>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-400">{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
        {mobileMenuOpen && <div className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-4 py-6 space-y-3">{['Home', 'Features', 'Pricing', 'Industries', 'Docs', 'About', 'Contact'].map((item) => (<Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="block py-3 text-slate-400 hover:text-white">{item}</Link>))}</div>}
      </nav>

      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-6 border border-blue-500/30">APPLICATION</div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 uppercase font-serif">Finance</h1>
            <p className="text-lg text-slate-400 mb-8">Comprehensive accounting and financial management. From invoicing to financial reporting, manage all your finances in one place.</p>
            <div className="flex flex-wrap gap-3">
              {['Accounting', 'Invoicing', 'Reporting', 'Assets'].map((tag, i) => (<span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full border border-slate-700">{tag}</span>))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl p-8 text-white">
            <Wallet className="w-16 h-16 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Complete Financial Control</h3>
            <p className="text-blue-100 mb-6">Real-time insights into your business finances.</p>
            <ul className="space-y-3">
              {['Real-time reporting', 'Multi-currency', 'Bank reconciliation', 'Tax compliance'].map((b, i) => (<li key={i} className="flex items-center gap-2"><Check className="w-5 h-5 text-blue-200" />{b}</li>))}
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
        <div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl font-bold text-white mb-6 uppercase">Start Your Free Trial</h2><Link href="/login" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl inline-flex items-center gap-2">Get Started <ArrowRight className="w-5 h-5" /></Link></div>
      </section>

      <footer className="bg-slate-900 border-t border-slate-800 text-white py-12"><div className="max-w-7xl mx-auto text-center"><p className="text-slate-400">© 2026 LemurSystem. A product of Blacklemur Innovations.</p></div></footer>
    </div>
  );
}
