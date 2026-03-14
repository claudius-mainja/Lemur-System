'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { 
  Users, Wallet, PiggyBank, Package, FileText, Calendar, 
  TrendingUp, Shield, Zap, Globe, CheckCircle,
  ArrowRight, Menu, X, Cloud, Database, BarChart3, Mail, 
  Settings, ShoppingCart, Truck, CreditCard, Building, 
  Heart, Plane, Star, Sparkles, Rocket, Target,
  Layers, Briefcase, HeadphonesIcon, Megaphone,
  ChevronRight, Play, Award, Handshake, Clock,
  Hexagon, Triangle, Circle, Square, Diamond,
  ArrowUpRight, Check, Minus, Lock, Globe2, Zap as LightningBolt,
  CheckCircle2, Map
} from 'lucide-react';

const applications = [
  { name: 'HUMAN RESOURCES', href: '/applications/hr', icon: Users, color: 'from-primary to-secondary', desc: 'Employee management, leave tracking, recruitment' },
  { name: 'FINANCE', href: '/applications/finance', icon: Wallet, color: 'from-accent to-accentDark', desc: 'Invoicing, accounting, financial reports' },
  { name: 'CRM', href: '/applications/crm', icon: BarChart3, color: 'from-accentDark to-accent', desc: 'Customer relationships, leads, sales pipeline' },
  { name: 'PAYROLL', href: '/applications/payroll', icon: PiggyBank, color: 'from-secondary to-primary', desc: 'Salary processing, tax calculations, payslips' },
  { name: 'SUPPLY CHAIN', href: '/applications/supply-chain', icon: Truck, color: 'from-primary to-accent', desc: 'Inventory, procurement, vendor management' },
  { name: 'PRODUCTIVITY', href: '/applications/productivity', icon: FileText, color: 'from-secondary to-accent', desc: 'Tasks, projects, team collaboration' },
  { name: 'MARKETING', href: '/applications/marketing', icon: Megaphone, color: 'from-accent to-accentDark', desc: 'Campaigns, email marketing, analytics' },
  { name: 'SERVICES', href: '/applications/services', icon: HeadphonesIcon, color: 'from-primary to-secondary', desc: 'Customer support, ticketing, helpdesk' },
];

const stats = [
  { value: '99.9%', label: 'UPTIME GUARANTEE', icon: Cloud },
  { value: '50+', label: 'INTEGRATIONS', icon: Layers },
  { value: '24/7', label: 'SUPPORT', icon: HeadphonesIcon },
  { value: 'SADC', label: 'READY', icon: Globe },
];

const whyChoose = [
  { icon: Globe, title: 'BUILT FOR AFRICAN BUSINESS', desc: 'Designed specifically for SADC region businesses with local currencies, tax laws, and compliance requirements' },
  { icon: Zap, title: 'EASY TO USE', desc: 'Simple, intuitive interface that anyone can use without technical training - no IT team required' },
  { icon: Shield, title: 'SAFE & SECURE', desc: 'Bank-level security with encrypted data, automatic backups, and reliable cloud infrastructure' },
  { icon: TrendingUp, title: 'GROWS WITH YOU', desc: 'Start small and scale up as your business grows - add more users, modules, and features when needed' },
  { icon: Clock, title: 'SAVE TIME & MONEY', desc: 'Replace multiple expensive systems with one affordable solution - cut costs by up to 60%' },
  { icon: HeadphonesIcon, title: 'LOCAL SUPPORT', desc: 'Get help from our SADC-based support team who understand your business needs' },
];

const features = [
  { icon: Shield, title: 'BANK-LEVEL SECURITY', desc: '256-bit encryption with SOC2 compliance' },
  { icon: Cloud, title: 'CLOUD BASED', desc: 'Access from anywhere, any device' },
  { icon: Zap, title: 'FAST SETUP', desc: 'Get started in minutes, not months' },
  { icon: Handshake, title: 'SADC COMPLIANT', desc: 'Built for African regulations' },
];

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard/hr');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a20] via-[#0b2f40] to-[#061c26] overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-radial from-accent/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className={`relative z-50 border-b transition-all duration-500 ${scrolled ? 'bg-[#0b2f40]/95 backdrop-blur-lg border-white/10' : 'bg-transparent border-white/5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-accent/30 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <span className="font-bold text-2xl text-white tracking-tight">LEMUR<span className="text-accent">SYSTEM</span></span>
                <p className="text-xs text-white/50 tracking-[0.2em] uppercase">Enterprise ERP</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {[
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
                  className="text-sm font-semibold text-white/70 hover:text-white tracking-wider transition-all duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link 
                href="/login" 
                className="px-6 py-2.5 text-white/70 font-semibold tracking-wider text-sm hover:text-white transition-colors"
              >
                SIGN IN
              </Link>
              <Link 
                href="/login?register=true" 
                className="px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-bold tracking-wider text-sm rounded-lg hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                GET STARTED
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 text-white/70 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0b2f40]/98 backdrop-blur-xl border-t border-white/10 px-4 py-6 space-y-3">
            {[
              { name: 'FEATURES', href: '/features' },
              { name: 'PRICING', href: '/pricing' },
              { name: 'INDUSTRIES', href: '/industries' },
              { name: 'DOCUMENTATION', href: '/docs' },
              { name: 'ABOUT', href: '/about' },
              { name: 'CONTACT', href: '/contact' },
            ].map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                className="block py-3 text-white/70 font-semibold tracking-wider text-sm hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <Link href="/login" className="block py-3 text-white/70 font-semibold tracking-wider text-sm">SIGN IN</Link>
              <Link href="/login?register=true" className="block text-center px-6 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-bold tracking-wider text-sm rounded-lg">
                GET STARTED
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-8">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-white/60 font-medium tracking-wider text-sm uppercase">#1 ERP for SADC Businesses</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
              <span className="block">RUN YOUR BUSINESS</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark">
                ALL IN ONE PLACE
              </span>
            </h1>
            
            <p className="text-xl text-white/50 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              The complete business management solution trusted by companies across Africa. 
              Manage HR, Finance, Customers, Inventory, and more - without any technical knowledge needed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 mb-12">
              <Link 
                href="/login?register=true" 
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-accent to-accentDark text-white font-bold tracking-wider rounded-xl hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                START FREE TRIAL
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto px-10 py-4 border border-white/20 text-white/70 font-bold tracking-wider rounded-xl hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-3"
              >
                TALK TO US
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div 
                  key={i}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="w-5 h-5 text-accent" />
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Dashboard Preview */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accentDark rounded-3xl blur-2xl opacity-30" />
            <div className="relative bg-[#0b2a38] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-[#061c26] px-6 py-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-sm text-white/40 uppercase tracking-wider">LemurSystem Dashboard</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-500 uppercase">Live</span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-4 gap-3">
                  {applications.slice(0, 8).map((app, i) => (
                    <Link 
                      key={i} 
                      href={app.href}
                      className="group flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 hover:bg-white/5"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${app.color} shadow-lg group-hover:scale-110 transition-transform`}>
                        <app.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs text-white/50 uppercase tracking-wider">{app.name.split(' ')[0]}</span>
                    </Link>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                    <div className="text-lg font-bold text-white">98%</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Efficiency</div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-accent w-[98%]" />
                    </div>
                  </div>
                  <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                    <div className="text-lg font-bold text-white">2.4k</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Transactions</div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-accentDark w-[75%]" />
                    </div>
                  </div>
                  <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                    <div className="text-lg font-bold text-white">99+</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Performance</div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-secondary to-primary w-[99%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#061c26]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-accent/10 text-accent rounded-full text-sm font-bold uppercase tracking-wider mb-6">
              <Layers className="w-5 h-5" />
              ALL-IN-ONE SOLUTION
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              EVERYTHING YOU NEED
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg font-light">
              8 powerful business applications that work together seamlessly - 
              no need to buy or learn multiple systems
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {applications.map((app, i) => (
              <Link 
                key={i} 
                href={app.href}
                className="group bg-[#0b2a38]/50 border border-white/5 rounded-2xl p-5 hover:border-accent/30 hover:bg-[#0b2a38] transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${app.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2 uppercase tracking-wider">{app.name}</h3>
                <p className="text-white/40 text-xs font-light mb-3">{app.desc}</p>
                <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
                  <span>LEARN MORE</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary via-[#184250] to-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-0.5">{feature.title}</h3>
                  <p className="text-white/50 text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-accent/10 text-accent rounded-full text-sm font-bold uppercase tracking-wider mb-6">
              <CheckCircle2 className="w-5 h-5" />
              WHY CHOOSE LEMURSYSTEM
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              PERFECT FOR AFRICAN BUSINESSES
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg font-light">
              Built specifically for small and medium businesses in Southern Africa - 
              no complicated setup, no technical skills needed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, i) => (
              <div 
                key={i}
                className="bg-[#0b2a38]/50 border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-accentDark rounded-2xl flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3 uppercase tracking-wide">{item.title}</h3>
                <p className="text-white/50 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-[#0b2a38] border border-white/10 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
                READY TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accentDark">SIMPLIFY</span> YOUR BUSINESS?
              </h2>
              <p className="text-white/40 mb-10 max-w-lg mx-auto text-lg font-light">
                Join hundreds of businesses already using LemurSystem to save time, 
                reduce costs, and grow their operations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link 
                  href="/login?register=true" 
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-accent to-accentDark text-white font-bold tracking-wider rounded-xl hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  START FREE TRIAL
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/contact" 
                  className="w-full sm:w-auto px-10 py-4 border border-white/20 text-white/70 font-bold tracking-wider rounded-xl hover:border-white/40 hover:text-white transition-all duration-300"
                >
                  CONTACT US
                </Link>
              </div>
              <p className="mt-8 text-white/30 text-sm uppercase tracking-wider">
                14-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#061c26] border-t border-white/5 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl text-white tracking-tight">LEMUR<span className="text-accent">SYSTEM</span></span>
              </div>
              <p className="text-white/40 text-sm mb-5 max-w-xs font-light">
                The most comprehensive cloud-based ERP solution for SADC businesses. 
                Simple, powerful, and built for growth.
              </p>
              <div className="flex items-center gap-2 text-white/30 text-sm">
                <Globe2 className="w-4 h-4" />
                <span className="uppercase tracking-wider text-xs">Serving All SADC Countries</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">PRODUCT</h4>
              <ul className="space-y-3 text-white/40 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">FEATURES</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">PRICING</Link></li>
                <li><Link href="/industries" className="hover:text-white transition-colors">INDUSTRIES</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">CONTACT</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">COMPANY</h4>
              <ul className="space-y-3 text-white/40 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">ABOUT</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">BLOG</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CAREERS</a></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">CONTACT</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">LEGAL</h4>
              <ul className="space-y-3 text-white/40 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a></li>
                <li><a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SECURITY</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm uppercase tracking-wider">
              © 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
