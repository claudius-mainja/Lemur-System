'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Users, Wallet, PiggyBank, Package, FileText, Calendar, 
  BarChart3, Mail, Shield, Zap, Globe, TrendingUp, 
  ArrowRight, Check, Cloud, Database, Lock, Smartphone,
  Workflow, HeadphonesIcon, Gauge, Cpu, Sparkles,
  Hexagon, Triangle, Circle, Square, Diamond, Menu, X
} from 'lucide-react';

const modules = [
  {
    name: 'Human Resources',
    description: 'Complete HR management from hiring to retirement',
    icon: Users,
    features: ['Employee Directory', 'Leave Management', 'Recruitment Portal', 'Performance Reviews', 'Training Tracker', 'Document Storage'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Payroll',
    description: 'Automated salary processing with tax compliance',
    icon: PiggyBank,
    features: ['Salary Processing', 'Tax Calculations', 'Direct Deposit', 'Payslip Generation', 'Year-End Reports', 'Compliance Management'],
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Finance',
    description: 'Comprehensive accounting and financial management',
    icon: Wallet,
    features: ['General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets', 'Financial Reports', 'Budget Tracking'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Supply Chain',
    description: 'End-to-end inventory and procurement control',
    icon: Package,
    features: ['Inventory Management', 'Purchase Orders', 'Vendor Portal', 'Stock Alerts', 'Reorder Points', 'Warehouse Tracking'],
    color: 'from-orange-500 to-amber-500',
  },
  {
    name: 'CRM',
    description: 'Build stronger customer relationships',
    icon: BarChart3,
    features: ['Lead Management', 'Sales Pipeline', 'Contact Tracking', 'Activity Logs', 'Email Integration', 'Sales Forecasting'],
    color: 'from-rose-500 to-pink-500',
  },
  {
    name: 'Productivity',
    description: 'Tools to keep your team organized',
    icon: FileText,
    features: ['Document Management', 'Task Boards', 'Team Calendar', 'Project Tracking', 'Team Chat', 'File Sharing'],
    color: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Services',
    description: 'Deliver exceptional customer service',
    icon: Calendar,
    features: ['Ticket System', 'SLA Monitoring', 'Knowledge Base', 'Customer Portal', 'Service Reports', 'Escalation Rules'],
    color: 'from-amber-500 to-yellow-500',
  },
  {
    name: 'Marketing',
    description: 'Automate your marketing efforts',
    icon: Mail,
    features: ['Email Campaigns', 'Lead Nurturing', 'Marketing Analytics', 'Landing Pages', 'Social Media', 'Automation Workflows'],
    color: 'from-violet-500 to-indigo-500',
  },
];

const features = [
  { icon: Cloud, title: 'Cloud Native', desc: 'Built for the cloud with auto-scaling infrastructure' },
  { icon: Database, title: 'Auto Backups', desc: 'Daily automated backups with 30-day retention' },
  { icon: Lock, title: 'Bank-Level Security', desc: '256-bit encryption with SOC 2 compliance' },
  { icon: Smartphone, title: 'Mobile Ready', desc: 'Native iOS and Android apps' },
  { icon: Cpu, title: 'API Access', desc: 'RESTful APIs for custom integrations' },
  { icon: Workflow, title: 'Workflow Automation', desc: 'Automate repetitive tasks with ease' },
  { icon: Gauge, title: 'Real-time Analytics', desc: 'Live dashboards and custom reports' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Round-the-clock expert assistance' },
];

export default function FeaturesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] animate-blob"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #06b6d4 100%)', top: '10%', right: '10%' }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px] animate-blob"
          style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #f59e0b 100%)', bottom: '20%', left: '10%', animationDelay: '2s' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <Hexagon className="absolute top-40 right-40 w-20 h-20 text-primary/10 animate-float" />
        <Triangle className="absolute bottom-40 left-40 w-16 h-16 text-accent/10 animate-float" style={{ animationDelay: '1s' }} />
        <Circle className="absolute top-1/3 left-1/4 w-12 h-12 text-purple-500/10 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary via-blue-500 to-accent rounded-2xl flex items-center justify-center animate-float-3d">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-2xl text-white font-serif">LemurSystem</span>
                <p className="text-xs text-dark-text-muted -mt-1">Enterprise ERP</p>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {[
                { name: 'Home', href: '/' },
                { name: 'Features', href: '/features' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Industries', href: '/industries' },
                { name: 'Docs', href: '/docs' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                    item.name === 'Features' 
                      ? 'text-white bg-white/10' 
                      : 'text-dark-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login" className="px-5 py-2.5 text-dark-text-secondary hover:text-white transition-all duration-300 font-medium">
                Log in
              </Link>
              <Link href="/login" className="px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-dark-text-secondary">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden bg-dark-bg/95 backdrop-blur-xl border-t border-dark-border px-4 py-6 space-y-3">
            {['Home', 'Features', 'Pricing', 'Industries', 'Docs', 'About', 'Contact'].map((item) => (
              <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="block py-3 text-dark-text-secondary hover:text-white">
                {item}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/20 border border-primary/30 rounded-full text-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">POWERFUL FEATURES</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 font-serif">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent">
              To Run Your Business
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-text-secondary mb-10 leading-relaxed max-w-2xl mx-auto">
            8 integrated modules that work seamlessly together. 
            From HR to accounting, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary via-blue-500 to-blue-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 border-2 border-dark-border text-dark-text-secondary font-bold rounded-2xl hover:border-primary hover:text-white transition-all duration-300 hover:-translate-y-1">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-serif">
              8 POWERFUL APPLICATIONS
            </h2>
            <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
              All the tools you need to manage every aspect of your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <div
                key={index}
                className="group bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{module.name}</h3>
                <p className="text-dark-text-secondary text-sm mb-4">{module.description}</p>
                <ul className="space-y-2">
                  {module.features.slice(0, 4).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-dark-text-muted">
                      <Check className="w-3 h-3 text-primary flex-shrink-0" />
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
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-serif">
              ENTERPRISE-GRADE PLATFORM
            </h2>
            <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
              Built for performance, security, and scalability
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-dark-card/50 border border-dark-border rounded-2xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-text-muted text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary via-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-serif uppercase">
            Ready to Get Started?
          </h2>
          <p className="text-blue-200 text-lg mb-10">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-bold rounded-2xl hover:bg-blue-50 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300">
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-bg-secondary border-t border-dark-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl text-white font-serif">LemurSystem</span>
              </div>
              <p className="text-dark-text-muted text-sm">
                Cloud-based ERP solution for SADC businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-dark-text-muted text-sm">
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/industries" className="hover:text-white transition">Industries</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-dark-text-muted text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-dark-text-muted text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-dark-border">
            <p className="text-dark-text-muted text-sm text-center">
              © 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
