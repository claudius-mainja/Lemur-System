'use client';

import Link from 'next/link';
import { ArrowLeft, PiggyBank, DollarSign, CreditCard, Receipt, Calculator, FileCheck, Shield, CheckCircle } from 'lucide-react';

const features = [
  { title: 'Salary Processing', description: 'Automated salary calculations with multiple pay schedules', icon: DollarSign },
  { title: 'Tax Calculations', description: 'Automatic tax deductions and compliance reporting', icon: Calculator },
  { title: 'Direct Deposit', description: 'Secure bank transfers to employee accounts', icon: CreditCard },
  { title: 'Payslip Generation', description: 'Generate and distribute digital payslips', icon: FileCheck },
  { title: 'Year-End Reports', description: 'Complete tax reports and IRP5 generation', icon: Receipt },
  { title: 'Compliance Management', description: 'Stay compliant with labor laws and tax regulations', icon: Shield },
];

const benefits = [
  'Reduce payroll processing time by 80%',
  'Eliminate payroll errors',
  'Ensure tax compliance',
  'Secure employee data',
  'Multi-currency support',
  'Audit trail for all transactions',
];

export default function PayrollPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl text-slate-900">LemurSystem</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-slate-600 hover:text-slate-900">Home</Link>
              <Link href="/features" className="text-slate-600 hover:text-slate-900">Features</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900">Pricing</Link>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-slate-700 font-medium">Log in</Link>
              <Link href="/login" className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">Application</div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 uppercase">Payroll</h1>
              <p className="text-lg text-slate-600 mb-8">Automated salary processing with tax compliance. Handle payroll accurately and efficiently with built-in tax calculations for SADC countries.</p>
              <div className="flex flex-wrap gap-3">
                {['Salary Processing', 'Tax Calculations', 'Direct Deposit', 'Payslips'].map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-8 text-white">
              <PiggyBank className="w-16 h-16 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Simplify Your Payroll</h3>
              <p className="text-green-100 mb-6">Automated calculations, compliant reporting, and secure payments.</p>
              <ul className="space-y-3">
                {benefits.slice(0, 4).map((b, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-200" />{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 uppercase">Key Features</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6 uppercase">Start Your Free Trial</h2>
          <p className="text-blue-100 mb-8">Try LemurSystem Payroll today. No credit card required.</p>
          <Link href="/login" className="px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition">Start Free Trial</Link>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400">© 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
