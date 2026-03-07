'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { 
  Users, Wallet, PiggyBank, Package, FileText, Calendar, 
  TrendingUp, Shield, Zap, Globe, CheckCircle,
  ArrowRight, Menu, X, Cloud, Database, BarChart3, Mail, Settings, ShoppingCart, Truck, CreditCard, Building, Factory, Heart, Plane
} from 'lucide-react';
import { useState } from 'react';

const apps = [
  {
    name: 'Human Resources',
    description: 'Employee management, leave tracking, recruitment, and performance reviews.',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    href: '/applications/hr',
    features: ['Employee Directory', 'Leave Management', 'Recruitment', 'Performance Reviews'],
  },
  {
    name: 'Payroll',
    description: 'Automated salary processing, tax calculations, and compliance reporting.',
    icon: PiggyBank,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    href: '/applications/payroll',
    features: ['Salary Processing', 'Tax Calculations', 'Direct Deposit', 'Payslip Generation'],
  },
  {
    name: 'Finance',
    description: 'Complete accounting with general ledger, invoicing, and financial reports.',
    icon: Wallet,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    href: '/applications/finance',
    features: ['General Ledger', 'Accounts Payable', 'Financial Reports', 'Budget Tracking'],
  },
  {
    name: 'Supply Chain',
    description: 'Inventory management, procurement, and vendor relationship handling.',
    icon: Package,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    href: '/applications/supply-chain',
    features: ['Inventory Control', 'Purchase Orders', 'Vendor Management', 'Stock Alerts'],
  },
  {
    name: 'CRM',
    description: 'Lead tracking, customer management, sales pipelines, and analytics.',
    icon: BarChart3,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    href: '/applications/crm',
    features: ['Lead Management', 'Sales Pipeline', 'Contact Tracking', 'Activity Logs'],
  },
  {
    name: 'Productivity',
    description: 'Documents, tasks, calendars, and real-time team collaboration.',
    icon: FileText,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    href: '/applications/productivity',
    features: ['Document Management', 'Task Management', 'Team Calendar', 'Team Chat'],
  },
  {
    name: 'Services',
    description: 'Help desk tickets, service requests, and customer support tracking.',
    icon: Calendar,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    href: '/applications/services',
    features: ['Ticket System', 'SLA Tracking', 'Knowledge Base', 'Customer Portal'],
  },
  {
    name: 'Marketing',
    description: 'Integrated email marketing and automated notifications system.',
    icon: Mail,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    href: '/applications/marketing',
    features: ['Email Campaigns', 'Automated Alerts', 'Templates', 'Analytics'],
  },
];

const cloudFeatures = [
  { icon: Cloud, title: 'Cloud Native', description: 'Built for the cloud with auto-scaling' },
  { icon: Globe, title: 'Global CDN', description: 'Fast access from anywhere in the world' },
  { icon: Database, title: 'Auto Backups', description: 'Daily automated backups with retention' },
  { icon: Shield, title: 'Enterprise Security', description: 'SOC2 compliant with encryption at rest' },
];

const features = [
  { icon: Shield, title: 'Secure', description: 'Bank-level encryption and GDPR compliant' },
  { icon: Zap, title: 'Fast', description: 'Optimized for low-bandwidth networks' },
  { icon: Globe, title: 'Accessible', description: 'Works on any device, online or offline' },
  { icon: TrendingUp, title: 'Scalable', description: 'Grows with your business needs' },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard/hr');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center animate-float">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl text-slate-900 font-serif">LemurSystem</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-slate-600 hover:text-primary transition-all duration-300 hover:scale-105">Features</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-primary transition-all duration-300 hover:scale-105">Pricing</Link>
              <Link href="/industries" className="text-slate-600 hover:text-primary transition-all duration-300 hover:scale-105">Industries</Link>
              <Link href="/docs" className="text-slate-600 hover:text-primary transition-all duration-300 hover:scale-105">Docs</Link>
              <Link href="/about" className="text-slate-600 hover:text-primary transition-all duration-300 hover:scale-105">About</Link>
              <Link href="/contact" className="text-slate-600 hover:text-primary transition-all duration-300 hover:scale-105">Contact</Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-slate-700 font-medium hover:text-primary transition">
                Log in
              </Link>
              <Link href="/login" className="px-5 py-2.5 bg-gradient-to-r from-primary to-blue-700 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5">
                Start Free Trial
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3 animate-fade-in-down">
            <Link href="/features" className="block text-slate-600 py-2">Features</Link>
            <Link href="/pricing" className="block text-slate-600 py-2">Pricing</Link>
            <Link href="/industries" className="block text-slate-600 py-2">Industries</Link>
            <Link href="/docs" className="block text-slate-600 py-2">Documentation</Link>
            <Link href="/about" className="block text-slate-600 py-2">About</Link>
            <Link href="/contact" className="block text-slate-600 py-2">Contact</Link>
            <Link href="/login" className="block text-slate-700 py-2">Log in</Link>
            <Link href="/login" className="block text-center px-5 py-2.5 bg-gradient-to-r from-primary to-blue-700 text-white font-medium rounded-lg">
              Start Free Trial
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Cloud className="w-4 h-4" />
            Cloud-Based Business Platform
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-4 uppercase">
            All In One Business Platform
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-xl mx-auto">
            See your entire business clearly with our comprehensive cloud-based platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-blue-700 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5 animate-bounce-slow" />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-1">
              Schedule Demo
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-3 sm:p-6 shadow-2xl animate-float">
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              {/* App Grid Display */}
              <div className="p-8">
                <div className="text-center mb-8">
                  <p className="text-slate-400 text-sm uppercase tracking-wider">Applications</p>
                </div>
                <div className="grid grid-cols-4 gap-6">
                  {apps.map((app, i) => (
                    <Link key={i} href={app.href} className="group">
                      <div className={`w-20 h-20 ${app.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl cursor-pointer`}>
                        <app.icon className={`w-10 h-10 bg-gradient-to-br ${app.color} text-white rounded-xl p-2`} />
                      </div>
                      <p className="text-center text-xs text-slate-400 group-hover:text-white transition-colors">{app.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 font-serif">
              Powerful Applications
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to run your business, all integrated into one powerful platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apps.map((app, i) => (
              <Link key={i} href={app.href} className="group bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 hover:border-primary/20">
                <div className={`w-14 h-14 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3`}>
                  <app.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{app.name}</h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">{app.description}</p>
                <ul className="space-y-2">
                  {app.features?.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cloud Platform */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
              Cloud Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-serif">
              Built for the Modern Cloud
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Enterprise-grade cloud infrastructure with automatic scaling, global availability, and zero maintenance
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cloudFeatures.map((feature, i) => (
              <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">99.99%</div>
              <div className="text-slate-300">Uptime SLA</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-slate-300">Global Regions</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-slate-300">Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 font-serif">
              Built for Modern Business
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Advanced features that help you work smarter, not harder
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="text-center p-6 hover:bg-slate-50 rounded-2xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary via-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-serif">
            Ready to Transform Your Business?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Join thousands of businesses already using LemurSystem
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
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
                Simple, powerful, affordable.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/industries" className="hover:text-white transition">Industries</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
                <li><a href="#" className="hover:text-white transition">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Cloud className="w-4 h-4" />
              Powered by cloud infrastructure
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
