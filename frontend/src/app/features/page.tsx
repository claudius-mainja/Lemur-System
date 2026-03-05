'use client';

import Link from 'next/link';
import { 
  Users, Wallet, PiggyBank, Package, FileText, Calendar, 
  BarChart3, Mail, Shield, Zap, Globe, TrendingUp, 
  ArrowRight, Check, Cloud, Database, Lock, Smartphone,
  Workflow, HeadphonesIcon, Gauge, Cpu
} from 'lucide-react';

const modules = [
  {
    name: 'Human Resources',
    description: 'Complete HR management from hiring to retirement',
    icon: Users,
    features: ['Employee Directory', 'Leave Management', 'Recruitment Portal', 'Performance Reviews', 'Training Tracker', 'Document Storage'],
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Payroll',
    description: 'Automated salary processing with tax compliance',
    icon: PiggyBank,
    features: ['Salary Processing', 'Tax Calculations', 'Direct Deposit', 'Payslip Generation', 'Year-End Reports', 'Compliance Management'],
    color: 'from-green-500 to-green-600',
  },
  {
    name: 'Finance',
    description: 'Comprehensive accounting and financial management',
    icon: Wallet,
    features: ['General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets', 'Financial Reports', 'Budget Tracking'],
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Supply Chain',
    description: 'End-to-end inventory and procurement control',
    icon: Package,
    features: ['Inventory Management', 'Purchase Orders', 'Vendor Portal', 'Stock Alerts', 'Reorder Points', 'Warehouse Tracking'],
    color: 'from-orange-500 to-orange-600',
  },
  {
    name: 'CRM',
    description: 'Build stronger customer relationships',
    icon: BarChart3,
    features: ['Lead Management', 'Sales Pipeline', 'Contact Tracking', 'Activity Logs', 'Email Integration', 'Sales Forecasting'],
    color: 'from-pink-500 to-pink-600',
  },
  {
    name: 'Productivity',
    description: 'Tools to keep your team organized',
    icon: FileText,
    features: ['Document Management', 'Task Boards', 'Team Calendar', 'Project Tracking', 'Team Chat', 'File Sharing'],
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    name: 'Services',
    description: 'Deliver exceptional customer service',
    icon: Calendar,
    features: ['Ticket System', 'SLA Monitoring', 'Knowledge Base', 'Customer Portal', 'Service Reports', 'Escalation Rules'],
    color: 'from-amber-500 to-amber-600',
  },
  {
    name: 'Marketing',
    description: 'Automate your marketing efforts',
    icon: Mail,
    features: ['Email Campaigns', 'Lead Nurturing', 'Marketing Analytics', 'Landing Pages', 'Social Media', 'Automation Workflows'],
    color: 'from-indigo-500 to-indigo-600',
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
  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl text-slate-900 font-serif">LemurSystem</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-slate-600 hover:text-slate-900 transition">Home</Link>
              <span className="text-primary font-medium">Features</span>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition">Pricing</Link>
              <Link href="/industries" className="text-slate-600 hover:text-slate-900 transition">Industries</Link>
              <Link href="/about" className="text-slate-600 hover:text-slate-900 transition">About</Link>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-slate-700 font-medium hover:text-slate-900 transition">
                Log in
              </Link>
              <Link href="/login" className="px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            Powerful Features
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6 font-serif animate-fade-in-up">
            Everything You Need to Run Your Business
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            8 integrated modules that work seamlessly together. 
            From HR to accounting, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-primary hover:text-primary transition">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 font-serif">
              8 Powerful Applications
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              All the tools you need to manage every aspect of your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{module.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{module.description}</p>
                <ul className="space-y-2">
                  {module.features.slice(0, 4).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 font-serif">
              Enterprise-Grade Platform
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built for performance, security, and scalability
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 hover:bg-slate-50 rounded-2xl transition-all duration-300 hover:shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-serif">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition">
              Start Free Trial
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition">
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl font-serif">LemurSystem</span>
              </div>
              <p className="text-slate-400 text-sm">
                Cloud-based ERP solution for small to medium businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><span className="text-white">Features</span></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/industries" className="hover:text-white transition">Industries</Link></li>
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800">
            <p className="text-slate-400 text-sm text-center">
              © 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
