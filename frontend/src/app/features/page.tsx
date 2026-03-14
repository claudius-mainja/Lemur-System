'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, Wallet, PiggyBank, Package, FileText, Calendar, 
  BarChart3, Mail, Shield, Zap, Globe, TrendingUp, 
  ArrowRight, Check, Cloud, Database, Lock, Smartphone,
  Workflow, HeadphonesIcon, Gauge, Cpu, Sparkles,
  Hexagon, Triangle, Circle, Menu, X, ArrowUpRight,
  Globe2, Zap as LightningBolt, CheckCircle2
} from 'lucide-react';

const modules = [
  {
    name: 'Human Resources',
    description: 'Complete HR management from hiring to retirement',
    icon: Users,
    features: ['Employee Directory', 'Leave Management', 'Recruitment Portal', 'Performance Reviews', 'Training Tracker', 'Document Storage'],
    color: 'from-primary to-secondary',
  },
  {
    name: 'Payroll',
    description: 'Automated salary processing with tax compliance',
    icon: PiggyBank,
    features: ['Salary Processing', 'Tax Calculations', 'Direct Deposit', 'Payslip Generation', 'Year-End Reports', 'Compliance Management'],
    color: 'from-secondary to-primary',
  },
  {
    name: 'Finance',
    description: 'Comprehensive accounting and financial management',
    icon: Wallet,
    features: ['General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets', 'Financial Reports', 'Budget Tracking'],
    color: 'from-accent to-accentDark',
  },
  {
    name: 'Supply Chain',
    description: 'End-to-end inventory and procurement control',
    icon: Package,
    features: ['Inventory Management', 'Purchase Orders', 'Vendor Portal', 'Stock Alerts', 'Reorder Points', 'Warehouse Tracking'],
    color: 'from-primary to-accent',
  },
  {
    name: 'CRM',
    description: 'Build stronger customer relationships',
    icon: BarChart3,
    features: ['Lead Management', 'Sales Pipeline', 'Contact Tracking', 'Activity Logs', 'Email Integration', 'Sales Forecasting'],
    color: 'from-accentDark to-accent',
  },
  {
    name: 'Productivity',
    description: 'Tools to keep your team organized',
    icon: FileText,
    features: ['Document Management', 'Task Boards', 'Team Calendar', 'Project Tracking', 'Team Chat', 'File Sharing'],
    color: 'from-secondary to-accent',
  },
  {
    name: 'Services',
    description: 'Deliver exceptional customer service',
    icon: Calendar,
    features: ['Ticket System', 'SLA Monitoring', 'Knowledge Base', 'Customer Portal', 'Service Reports', 'Escalation Rules'],
    color: 'from-primary to-secondary',
  },
  {
    name: 'Marketing',
    description: 'Automate your marketing efforts',
    icon: Mail,
    features: ['Email Campaigns', 'Lead Nurturing', 'Marketing Analytics', 'Landing Pages', 'Social Media', 'Automation Workflows'],
    color: 'from-accent to-accentDark',
  },
];

const features = [
  { icon: Cloud, title: 'CLOUD NATIVE', desc: 'Built for the cloud with auto-scaling infrastructure' },
  { icon: Database, title: 'AUTO BACKUPS', desc: 'Daily automated backups with 30-day retention' },
  { icon: Lock, title: 'BANK-LEVEL SECURITY', desc: '256-bit encryption with SOC 2 compliance' },
  { icon: Smartphone, title: 'MOBILE READY', desc: 'Native iOS and Android apps' },
  { icon: Cpu, title: 'API ACCESS', desc: 'RESTful APIs for custom integrations' },
  { icon: Workflow, title: 'WORKFLOW AUTOMATION', desc: 'Automate repetitive tasks with ease' },
  { icon: Gauge, title: 'REAL-TIME ANALYTICS', desc: 'Live dashboards and custom reports' },
  { icon: HeadphonesIcon, title: '24/7 SUPPORT', desc: 'Round-the-clock expert assistance' },
];

export default function FeaturesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModule, setActiveModule] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      {/* Background Pattern */}
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

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-[#0b2535]/90 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-accent/30 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <span className="font-bold text-2xl text-white tracking-tight">LEMUR<span className="text-accent">SYSTEM</span></span>
                <p className="text-xs text-white/50 tracking-[0.2em] uppercase">Enterprise ERP</p>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              {[
                { name: 'HOME', href: '/' },
                { name: 'FEATURES', href: '/features' },
                { name: 'PRICING', href: '/pricing' },
                { name: 'INDUSTRIES', href: '/industries' },
                { name: 'DOCS', href: '/docs' },
                { name: 'ABOUT', href: '/about' },
                { name: 'CONTACT', href: '/contact' },
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold text-white/60 hover:text-white tracking-wider transition-all duration-300 relative group"
                >
                  {item.name}
                  {item.name === 'FEATURES' && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent" />
                  )}
                </Link>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/login" className="px-6 py-2.5 text-white/60 font-semibold tracking-wider text-sm hover:text-white transition-colors">
                SIGN IN
              </Link>
              <Link href="/login" className="px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-bold tracking-wider text-sm rounded-lg hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5">
                GET STARTED
              </Link>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-white/60">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0b2535]/98 backdrop-blur-xl border-t border-white/10 px-4 py-4 space-y-2">
            {['HOME', 'FEATURES', 'PRICING', 'INDUSTRIES', 'DOCS', 'ABOUT', 'CONTACT'].map((item) => (
              <Link key={item} href={item === 'HOME' ? '/' : `/${item.toLowerCase()}`} className="block py-2 text-white/60 font-semibold tracking-wider text-sm hover:text-white">
                {item}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full mb-8">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-white/60 font-bold tracking-widest text-sm uppercase">POWERFUL FEATURES</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
            EVERYTHING YOU NEED
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark">
              TO RUN YOUR BUSINESS
            </span>
          </h1>
          <p className="text-xl text-white/40 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
            8 integrated modules that work seamlessly together. 
            From HR to accounting, we have got you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/login" className="px-10 py-4 bg-gradient-to-r from-accent to-accentDark text-white font-bold tracking-wider rounded-xl hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:-translate-y-1 flex items-center gap-3">
              START FREE TRIAL <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="px-10 py-4 border border-white/20 text-white/60 font-bold tracking-wider rounded-xl hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-300">
              VIEW PRICING
            </Link>
          </div>
        </div>
      </section>

      {/* Active Module Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#0b2535]/50 border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className={`inline-flex w-20 h-20 bg-gradient-to-br ${modules[activeModule].color} rounded-2xl items-center justify-center mb-6 shadow-lg`}>
                  {React.createElement(modules[activeModule].icon, { className: "w-10 h-10 text-white" })}
                </div>
                <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-tight">{modules[activeModule].name}</h2>
                <p className="text-white/40 text-lg mb-8 font-light">{modules[activeModule].description}</p>
                <div className="space-y-3">
                  {modules[activeModule].features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      <span className="text-white/60 font-medium uppercase tracking-wide text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {modules.map((module, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveModule(i)}
                    className={`p-4 rounded-2xl border transition-all duration-300 text-left ${
                      activeModule === i 
                        ? 'bg-white/10 border-accent/50' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center mb-3`}>
                      <module.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-white font-bold text-sm uppercase tracking-wide">{module.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#061520]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-tight">ALL MODULES</h2>
            <p className="text-white/40 font-light text-lg">Choose the tools that fit your business needs</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modules.map((module, i) => (
              <div 
                key={i}
                className="group bg-[#0b2535]/30 border border-white/5 rounded-3xl p-6 hover:border-accent/30 hover:bg-[#0b2535]/60 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${module.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <module.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2 uppercase tracking-wide">{module.name}</h3>
                <p className="text-white/40 text-sm mb-5 font-light">{module.description}</p>
                <ul className="space-y-2">
                  {module.features.slice(0, 3).map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-white/50 uppercase tracking-wide">
                      <Check className="w-3 h-3 text-accent flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-tight">PLATFORM FEATURES</h2>
            <p className="text-white/40 font-light text-lg">Built for modern businesses</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <div key={i} className="bg-[#0b2535]/30 border border-white/5 rounded-2xl p-6 hover:border-white/20 hover:bg-[#0b2535]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2 uppercase tracking-wider">{feature.title}</h3>
                <p className="text-white/40 text-xs font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0b2535] border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6 uppercase tracking-tight">
                READY TO GET STARTED?
              </h2>
              <p className="text-white/40 mb-10 max-w-md mx-auto text-lg font-light">
                Start your free trial today and see how LemurSystem can transform your business.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/login" className="px-10 py-4 bg-gradient-to-r from-accent to-accentDark text-white font-bold tracking-wider rounded-xl hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:-translate-y-1">
                  START FREE TRIAL
                </Link>
                <Link href="/contact" className="px-10 py-4 border border-white/20 text-white/60 font-bold tracking-wider rounded-xl hover:border-white/40 hover:text-white transition-all duration-300">
                  CONTACT SALES
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#061520] border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">LEMUR<span className="text-accent">SYSTEM</span></span>
            </div>
            <p className="text-white/30 text-sm uppercase tracking-wider">
              © 2026 LemurSystem. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
