'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Check, ChevronRight, Wallet, CreditCard, Receipt, FileText, TrendingUp, PieChart } from 'lucide-react';

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #7e49de 0%, #9e79ef 50%, #412576 100%)', bottom: '20%', left: '10%' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(11,47,64,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(11,47,64,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <Navbar activePage="applications" />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6 border border-accent/30">APPLICATION</div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 uppercase font-serif">Finance</h1>
            <p className="text-lg text-dark-text-secondary mb-8">Comprehensive accounting and financial management. From invoicing to financial reporting, manage all your finances in one place.</p>
            <div className="flex flex-wrap gap-3">
              {['Accounting', 'Invoicing', 'Reporting', 'Assets'].map((tag, i) => (<span key={i} className="px-3 py-1 bg-dark-bg-tertiary text-dark-text-secondary text-sm rounded-full border border-dark-border">{tag}</span>))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-8 text-white">
            <Wallet className="w-16 h-16 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Complete Financial Control</h3>
            <p className="text-primary-100 mb-6">Real-time insights into your business finances.</p>
            <ul className="space-y-3">
              {['Real-time reporting', 'Multi-currency', 'Bank reconciliation', 'Tax compliance'].map((b, i) => (<li key={i} className="flex items-center gap-2"><Check className="w-5 h-5 text-primary-200" />{b}</li>))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">{stats.map((s, i) => (<div key={i} className="text-center p-6 bg-dark-card/50 rounded-xl border border-dark-border"><div className="text-3xl font-bold text-white mb-2">{s.value}</div><div className="text-dark-text-muted text-sm">{s.label}</div></div>))}</div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-bg-secondary/30">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 uppercase">Key Features</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="bg-dark-card/50 border border-dark-border rounded-xl p-6 hover:border-accent/30 transition-all hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-dark-text-secondary text-sm mb-4">{f.description}</p>
              <ul className="space-y-2">{f.items.map((item, j) => (<li key={j} className="flex items-center gap-2 text-sm text-dark-text-muted"><ChevronRight className="w-4 h-4 text-accent" />{item}</li>))}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl font-bold text-white mb-6 uppercase">START YOUR FREE TRIAL</h2><Link href="/login" className="px-8 py-4 bg-white text-accent font-semibold rounded-xl inline-flex items-center gap-2">Get Started <ArrowRight className="w-5 h-5" /></Link></div>
      </section>

      <Footer />
    </div>
  );
}
