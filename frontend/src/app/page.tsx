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
  Hexagon, Triangle, Square, Diamond,
  ArrowUpRight, Check, Minus, Lock, Globe2, Zap as LightningBolt,
  CheckCircle2, Map, Image, Monitor, Users2, DollarSign, BarChart
} from 'lucide-react';

const applications = [
  { name: 'HUMAN RESOURCES', href: '/applications/hr', icon: Users, color: 'from-blue-500 to-cyan-500', desc: 'Employee management, leave tracking, recruitment', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop' },
  { name: 'FINANCE', href: '/applications/finance', icon: Wallet, color: 'from-emerald-500 to-teal-500', desc: 'Invoicing, accounting, financial reports', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop' },
  { name: 'CRM', href: '/applications/crm', icon: BarChart3, color: 'from-violet-500 to-purple-500', desc: 'Customer relationships, leads, sales pipeline', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop' },
  { name: 'PAYROLL', href: '/applications/payroll', icon: PiggyBank, color: 'from-orange-500 to-amber-500', desc: 'Salary processing, tax calculations, payslips', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop' },
  { name: 'SUPPLY CHAIN', href: '/applications/supply-chain', icon: Truck, color: 'from-indigo-500 to-violet-500', desc: 'Inventory, procurement, vendor management', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop' },
  { name: 'PRODUCTIVITY', href: '/applications/productivity', icon: FileText, color: 'from-cyan-500 to-blue-500', desc: 'Tasks, projects, team collaboration', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=300&fit=crop' },
  { name: 'MARKETING', href: '/applications/marketing', icon: Megaphone, color: 'from-fuchsia-500 to-pink-500', desc: 'Campaigns, email marketing, analytics', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop' },
  { name: 'SERVICES', href: '/applications/services', icon: HeadphonesIcon, color: 'from-rose-500 to-pink-500', desc: 'Customer support, ticketing, helpdesk', image: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=400&h=300&fit=crop' },
];

const stats = [
  { value: '99.9%', label: 'UPTIME GUARANTEE', icon: Cloud },
  { value: '50+', label: 'INTEGRATIONS', icon: Layers },
  { value: '24/7', label: 'SUPPORT', icon: HeadphonesIcon },
  { value: 'SADC', label: 'READY', icon: Globe },
];

const whyChoose = [
  { icon: Globe, title: 'BUILT FOR AFRICAN BUSINESS', desc: 'Designed specifically for SADC region businesses with local currencies, tax laws, and compliance requirements', image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600&h=400&fit=crop' },
  { icon: Zap, title: 'EASY TO USE', desc: 'Simple, intuitive interface that anyone can use without technical training - no IT team required', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop' },
  { icon: Shield, title: 'SAFE & SECURE', desc: 'Bank-level security with encrypted data, automatic backups, and reliable cloud infrastructure', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop' },
  { icon: TrendingUp, title: 'GROWS WITH YOU', desc: 'Start small and scale up as your business grows - add more users, modules, and features when needed', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
  { icon: Clock, title: 'SAVE TIME & MONEY', desc: 'Replace multiple expensive systems with one affordable solution - cut costs by up to 60%', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop' },
  { icon: HeadphonesIcon, title: 'LOCAL SUPPORT', desc: 'Get help from our SADC-based support team who understand your business needs', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop' },
];

const features = [
  { icon: Shield, title: 'BANK-LEVEL SECURITY', desc: '256-bit encryption with SOC2 compliance' },
  { icon: Cloud, title: 'CLOUD BASED', desc: 'Access from anywhere, any device' },
  { icon: Zap, title: 'FAST SETUP', desc: 'Get started in minutes, not months' },
  { icon: Handshake, title: 'SADC COMPLIANT', desc: 'Built for African regulations' },
];

const workflowSteps = [
  { icon: Users, title: 'Add Your Team', desc: 'Invite employees and set up roles' },
  { icon: Settings, title: 'Configure Modules', desc: 'Customize to your business needs' },
  { icon: BarChart, title: 'Track Everything', desc: 'Monitor performance in real-time' },
  { icon: Rocket, title: 'Grow Faster', desc: 'Scale your business with confidence' },
];

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (hasHydrated && isAuthenticated && isMounted) {
      router.push('/dashboard/hr');
    }
  }, [isAuthenticated, router, hasHydrated, isMounted]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!hasHydrated || !isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1a20] via-[#0b2f40] to-[#061c26] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a20] via-[#0b2f40] to-[#061c26] overflow-x-hidden" suppressHydrationWarning>
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
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0b2f40]/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-accent to-accentDark rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-lg text-white">LEMUR<span className="text-accent">SYSTEM</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {[
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
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link 
                href="/login" 
                className="px-4 py-2 text-white/70 hover:text-white text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/login?register=true" 
                className="px-5 py-2 bg-gradient-to-r from-accent to-accentDark text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-accent/30 transition-all"
              >
                Get Started
              </Link>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 text-white/70 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0b2f40]/98 backdrop-blur-xl border-t border-white/10 px-4 py-4 space-y-3">
            {[
              { name: 'Features', href: '/features' },
              { name: 'Pricing', href: '/pricing' },
              { name: 'Industries', href: '/industries' },
              { name: 'Documentation', href: '/docs' },
              { name: 'About', href: '/about' },
              { name: 'Contact', href: '/contact' },
            ].map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                className="block py-2 text-white/70 hover:text-white text-sm"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <Link href="/login" className="block py-2 text-white/70 text-sm">Sign In</Link>
              <Link href="/login?register=true" className="block text-center px-4 py-2 bg-gradient-to-r from-accent to-accentDark text-white text-sm rounded-lg">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Image */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-white/60 text-xs uppercase">#1 ERP for SADC Businesses</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
              <span className="block">RUN YOUR BUSINESS</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark">
                ALL IN ONE PLACE
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-6 max-w-lg mx-auto lg:mx-0">
              The complete business management solution for African businesses. 
              Manage HR, Finance, Customers, Inventory, and more from a single platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link 
                href="/free-trial" 
                className="px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-medium rounded-lg hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 border border-white/20 text-white/70 rounded-lg hover:border-white/40 hover:text-white transition-all"
              >
                Talk to Us
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((stat, i) => (
                <div 
                  key={i}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3"
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <stat.icon className="w-4 h-4 text-accent" />
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                  </div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Dashboard Preview with Real Image */}
          <div className="lg:col-span-6 relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accentDark rounded-2xl blur-xl opacity-30" />
            <div className="relative bg-[#0b2a38] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop" 
                alt="LemurSystem Dashboard"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b2a38] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-[#061c26]/90 backdrop-blur rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-white font-medium">Your Business Dashboard</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full">Live Preview</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="text-sm font-bold text-white">248</div>
                      <div className="text-[10px] text-white/40">Employees</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="text-sm font-bold text-white">$124K</div>
                      <div className="text-[10px] text-white/40">Revenue</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="text-sm font-bold text-white">1.2K</div>
                      <div className="text-[10px] text-white/40">Invoices</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section with Images */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#061c26]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Rocket className="w-4 h-4" />
              HOW IT WORKS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 uppercase tracking-wide">
              Get Started in 4 Simple Steps
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm">
              From signup to full deployment in minutes, not months
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent to-accentDark rounded-2xl flex items-center justify-center shadow-lg">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#0b2a38] border border-accent rounded-full flex items-center justify-center">
                    <span className="text-accent font-bold text-sm">{i + 1}</span>
                  </div>
                </div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-2">{step.title}</h3>
                <p className="text-white/40 text-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section with Images */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Layers className="w-4 h-4" />
              ALL-IN-ONE SOLUTION
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 uppercase tracking-wide">
              Everything You Need
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm">
              8 powerful business applications that work together seamlessly
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {applications.map((app, i) => (
              <Link 
                key={i} 
                href={app.href}
                className="group relative overflow-hidden rounded-xl bg-[#0b2a38]/50 border border-white/5 hover:border-accent/30 transition-all p-6"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${app.color} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">{app.name}</h3>
                <p className="text-white/60 text-xs mb-4 leading-relaxed">{app.desc}</p>
                <div className="flex items-center gap-1 text-accent text-xs font-medium">
                  View Module <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SADC Map Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#061c26]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Globe2 className="w-4 h-4" />
              ACROSS SADC
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 uppercase tracking-wide">
              Serving All SADC Countries
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm">
              Trusted by businesses throughout Southern Africa
            </p>
          </div>

          <div className="relative">
            <div className="relative w-full max-w-4xl mx-auto">
              <svg viewBox="0 0 800 600" className="w-full h-auto" style={{ filter: 'drop-shadow(0 0 20px rgba(126, 73, 222, 0.2))' }}>
                <path 
                  d="M180,120 Q200,100 250,95 L320,90 Q380,85 420,95 L480,100 Q520,110 550,130 L580,160 Q600,190 610,230 L615,280 Q610,320 590,350 L560,380 Q530,400 500,410 L450,420 Q400,430 350,425 L300,415 Q260,400 230,370 L200,340 Q170,310 160,270 L155,220 Q150,170 160,140 Z" 
                  fill="url(#africaGradient)" 
                  stroke="#7e49de" 
                  strokeWidth="2"
                  opacity="0.3"
                />
                <defs>
                  <linearGradient id="africaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0b2f40" />
                    <stop offset="100%" stopColor="#184250" />
                  </linearGradient>
                </defs>
                
                <path 
                  d="M200,180 Q220,170 260,165 L320,160 Q360,165 380,180 L390,210 Q385,250 360,270 L320,285 Q280,290 250,275 L210,250 Q180,220 190,195 Z" 
                  fill="url(#sadcGradient)" 
                  stroke="#7e49de" 
                  strokeWidth="2"
                  className="animate-pulse"
                />
                <defs>
                  <linearGradient id="sadcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7e49de" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#9e79ef" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                <g>
                  <circle cx="320" cy="320" r="8" fill="#7e49de" className="animate-ping" style={{ animationDuration: '2s' }} />
                  <circle cx="320" cy="320" r="12" fill="#7e49de" opacity="0.5" />
                  <text x="320" y="345" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">SOUTH AFRICA</text>
                </g>
                
                <g><circle cx="380" cy="260" r="6" fill="#9e79ef" /><text x="380" y="282" textAnchor="middle" fill="#fff" fontSize="8">Botswana</text></g>
                <g><circle cx="340" cy="180" r="6" fill="#9e79ef" /><text x="340" y="200" textAnchor="middle" fill="#fff" fontSize="8">Namibia</text></g>
                <g><circle cx="430" cy="290" r="6" fill="#9e79ef" /><text x="430" y="312" textAnchor="middle" fill="#fff" fontSize="8">Zimbabwe</text></g>
                <g><circle cx="420" cy="220" r="6" fill="#9e79ef" /><text x="420" y="242" textAnchor="middle" fill="#fff" fontSize="8">Zambia</text></g>
                <g><circle cx="480" cy="320" r="6" fill="#9e79ef" /><text x="480" y="342" textAnchor="middle" fill="#fff" fontSize="8">Mozambique</text></g>
                <g><circle cx="510" cy="240" r="6" fill="#9e79ef" /><text x="510" y="262" textAnchor="middle" fill="#fff" fontSize="8">Tanzania</text></g>
                <g><circle cx="460" cy="280" r="5" fill="#9e79ef" /><text x="460" y="300" textAnchor="middle" fill="#fff" fontSize="8">Malawi</text></g>
                <g><circle cx="580" cy="420" r="4" fill="#9e79ef" /><text x="580" y="438" textAnchor="middle" fill="#fff" fontSize="8">Mauritius</text></g>
                <g><circle cx="350" cy="360" r="4" fill="#9e79ef" /><text x="350" y="378" textAnchor="middle" fill="#fff" fontSize="8">Eswatini</text></g>
                <g><circle cx="335" cy="355" r="3" fill="#9e79ef" /><text x="335" y="370" textAnchor="middle" fill="#fff" fontSize="7">Lesotho</text></g>
                <g><circle cx="280" cy="200" r="6" fill="#9e79ef" /><text x="280" y="222" textAnchor="middle" fill="#fff" fontSize="8">Angola</text></g>
              </svg>
            </div>
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

      {/* Why Choose Section with Images */}
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
                className="group relative overflow-hidden rounded-3xl bg-[#0b2a38]/50 border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-40 object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b2a38] via-[#0b2a38]/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent to-accentDark rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2 uppercase tracking-wide">{item.title}</h3>
                  <p className="text-white/50 font-light text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-[#0b2a38] border border-white/10 rounded-3xl p-12 text-center overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop" 
              alt="Team collaboration"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accentDark">Simplify</span> Your Business?
              </h2>
              <p className="text-white/40 mb-6 max-w-lg mx-auto text-sm">
                Join hundreds of businesses already using LemurSystem to save time, 
                reduce costs, and grow their operations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link 
                  href="/free-trial" 
                  className="px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-medium rounded-lg hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/contact" 
                  className="px-8 py-3 border border-white/20 text-white/70 rounded-lg hover:border-white/40 hover:text-white transition-all"
                >
                  Contact Us
                </Link>
              </div>
              <p className="mt-6 text-white/30 text-xs">
                7-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#061c26] border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-accentDark rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="font-bold text-lg text-white">LEMUR<span className="text-accent">SYSTEM</span></span>
              </div>
              <p className="text-white/40 text-sm mb-4 max-w-xs">
                The most comprehensive cloud-based ERP solution for SADC businesses.
              </p>
              <div className="flex items-center gap-2 text-white/30 text-xs">
                <Globe2 className="w-4 h-4" />
                <span>Serving All SADC Countries</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-white/40 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/industries" className="hover:text-white transition-colors">Industries</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-white/40 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-white/40 text-sm">
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">
              © 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
