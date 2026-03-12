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
  Hexagon, Triangle, Circle, Square, Diamond
} from 'lucide-react';

const allPages = [
  { name: 'Dashboard HR', href: '/dashboard/hr', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { name: 'Dashboard Finance', href: '/dashboard/finance', icon: Wallet, color: 'from-purple-500 to-pink-500' },
  { name: 'Dashboard CRM', href: '/dashboard/crm', icon: BarChart3, color: 'from-rose-500 to-orange-500' },
  { name: 'Dashboard Payroll', href: '/dashboard/payroll', icon: PiggyBank, color: 'from-green-500 to-emerald-500' },
  { name: 'Dashboard Supply Chain', href: '/dashboard/supply-chain', icon: Package, color: 'from-amber-500 to-yellow-500' },
  { name: 'Productivity', href: '/dashboard/productivity', icon: FileText, color: 'from-violet-500 to-purple-500' },
  { name: 'HR Application', href: '/applications/hr', icon: Users, color: 'from-blue-400 to-blue-600' },
  { name: 'Finance App', href: '/applications/finance', icon: Wallet, color: 'from-purple-400 to-purple-600' },
  { name: 'CRM App', href: '/applications/crm', icon: BarChart3, color: 'from-pink-400 to-rose-600' },
  { name: 'Payroll App', href: '/applications/payroll', icon: PiggyBank, color: 'from-green-400 to-green-600' },
  { name: 'Supply Chain', href: '/applications/supply-chain', icon: Truck, color: 'from-orange-400 to-orange-600' },
  { name: 'Services', href: '/applications/services', icon: HeadphonesIcon, color: 'from-teal-400 to-cyan-600' },
  { name: 'Marketing', href: '/applications/marketing', icon: Megaphone, color: 'from-indigo-400 to-indigo-600' },
  { name: 'Productivity App', href: '/applications/productivity', icon: FileText, color: 'from-cyan-400 to-blue-500' },
  { name: 'Features', href: '/features', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { name: 'Pricing', href: '/pricing', icon: CreditCard, color: 'from-emerald-400 to-green-600' },
  { name: 'Industries', href: '/industries', icon: Building, color: 'from-slate-400 to-slate-600' },
  { name: 'Documentation', href: '/docs', icon: FileText, color: 'from-gray-400 to-gray-600' },
  { name: 'About', href: '/about', icon: Award, color: 'from-amber-400 to-yellow-600' },
  { name: 'Contact', href: '/contact', icon: Mail, color: 'from-rose-400 to-pink-600' },
];

const stats = [
  { value: '10K+', label: 'Active Users', icon: Users },
  { value: '99.9%', label: 'Uptime', icon: Cloud },
  { value: '50+', label: 'Integrations', icon: Layers },
  { value: '24/7', label: 'Support', icon: HeadphonesIcon },
];

const testimonials = [
  { name: 'Sarah Johnson', role: 'CEO, TechStart', text: 'LemurSystem transformed our business operations completely.' },
  { name: 'Michael Chen', role: 'Director, MegaCorp', text: 'The best ERP solution we have ever used. Highly recommended!' },
  { name: 'Emily Davis', role: 'Manager, InnovateCo', text: 'Outstanding support and incredible features. Worth every penny.' },
];

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard/hr');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % allPages.slice(0, 8).length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] animate-blob"
          style={{ 
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #06b6d4 100%)',
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px] animate-blob"
          style={{ 
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #f59e0b 100%)',
            bottom: '20%',
            right: '10%',
            animationDelay: '2s',
            transform: `translate(${-mousePosition.x * 0.015}px, ${-mousePosition.y * 0.015}px)`
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating Shapes */}
        <Hexagon className="absolute top-20 right-20 w-20 h-20 text-primary/10 animate-float" />
        <Triangle className="absolute bottom-40 left-20 w-16 h-16 text-accent/10 animate-float" style={{ animationDelay: '1s' }} />
        <Circle className="absolute top-1/3 left-1/4 w-12 h-12 text-purple-500/10 animate-float" style={{ animationDelay: '0.5s' }} />
        <Square className="absolute bottom-1/4 right-1/3 w-14 h-14 text-cyan-500/10 animate-float" style={{ animationDelay: '1.5s' }} />
        <Diamond className="absolute top-1/2 right-1/4 w-10 h-10 text-green-500/10 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary via-blue-500 to-accent rounded-2xl flex items-center justify-center animate-float-3d">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-50 blur-lg group-hover:opacity-75 transition-opacity" />
              </div>
              <div>
                <span className="font-bold text-2xl text-white font-serif tracking-tight">LemurSystem</span>
                <p className="text-xs text-dark-text-muted -mt-1">Enterprise ERP</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { name: 'Features', href: '/features' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Industries', href: '/industries' },
                { name: 'Docs', href: '/docs' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map((item, i) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-dark-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 text-sm font-medium"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link 
                href="/login" 
                className="px-5 py-2.5 text-dark-text-secondary hover:text-white transition-all duration-300 font-medium"
              >
                Log in
              </Link>
              <Link 
                href="/login" 
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 text-dark-text-secondary hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-dark-bg/95 backdrop-blur-xl border-t border-dark-border px-4 py-6 space-y-3 animate-fade-in-down">
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
                className="block py-3 text-dark-text-secondary hover:text-white transition"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-dark-border space-y-3">
              <Link href="/login" className="block py-3 text-dark-text-secondary">Log in</Link>
              <Link href="/login" className="block text-center px-5 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-medium rounded-xl">
                Start Free Trial
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full text-sm mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Next-Gen Cloud ERP Platform</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 font-serif uppercase">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Transform
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent">
                Your Business
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-dark-text-secondary mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience the future of enterprise management. 
              All-in-one platform with AI-powered insights, 
              real-time analytics, and seamless integration.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary via-blue-500 to-blue-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  Start Free Trial
                  <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                </span>
              </Link>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto px-8 py-4 border-2 border-dark-border text-dark-text-secondary font-bold rounded-2xl hover:border-primary hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div 
                  key={i}
                  className="bg-dark-card/50 backdrop-blur border border-dark-border rounded-2xl p-4 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <stat.icon className="w-6 h-6 text-primary mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-dark-text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Interactive Dashboard Preview */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-accent rounded-3xl blur-2xl opacity-30" />
            
            {/* Main Card */}
            <div className="relative bg-dark-card border border-dark-border rounded-3xl overflow-hidden animate-float shadow-2xl">
              {/* Header */}
              <div className="bg-dark-bg-secondary px-6 py-4 flex items-center justify-between border-b border-dark-border">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-sm text-dark-text-muted">LemurSystem Dashboard</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-500">Live</span>
                </div>
              </div>

              {/* App Grid */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <p className="text-dark-text-muted text-sm uppercase tracking-widest">Interactive Preview</p>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  {allPages.slice(0, 8).map((page, i) => (
                    <Link 
                      key={i} 
                      href={page.href}
                      className={`group relative transition-all duration-500 ${activeDemo === i ? 'scale-110' : 'hover:scale-105'}`}
                    >
                      <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2
                        bg-gradient-to-br ${page.color} opacity-80 group-hover:opacity-100
                        transition-all duration-300 group-hover:shadow-lg
                        ${activeDemo === i ? 'shadow-lg shadow-white/20' : ''}
                      `}>
                        <page.icon className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-center text-xs text-dark-text-muted group-hover:text-white transition-colors">
                        {page.name.split(' ')[0]}
                      </p>
                      
                      {activeDemo === i && (
                        <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-pulse-border" />
                      )}
                    </Link>
                  ))}
                </div>

                {/* Demo Stats */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="bg-dark-bg-secondary rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">98%</div>
                    <div className="text-xs text-dark-text-muted">Efficiency</div>
                    <div className="h-1 bg-dark-border rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-cyan-500 w-[98%]" />
                    </div>
                  </div>
                  <div className="bg-dark-bg-secondary rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">2.4k</div>
                    <div className="text-xs text-dark-text-muted">Transactions</div>
                    <div className="h-1 bg-dark-border rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[75%]" />
                    </div>
                  </div>
                  <div className="bg-dark-bg-secondary rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">99+</div>
                    <div className="text-xs text-dark-text-muted">Performance</div>
                    <div className="h-1 bg-dark-border rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-[99%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Pages Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
              <Layers className="w-4 h-4" />
              Complete Platform
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-serif">
              Explore All Modules
            </h2>
            <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
              From HR to Finance, CRM to Supply Chain - everything your business needs
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {allPages.map((page, i) => (
              <Link 
                key={i} 
                href={page.href}
                className="group bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${page.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <page.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-primary transition-colors">
                  {page.name}
                </h3>
                <div className="flex items-center gap-1 text-dark-text-muted text-sm">
                  <span>Explore</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary via-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Bank-Level Security', desc: '256-bit encryption with SOC2 compliance' },
              { icon: Cloud, title: 'Cloud Native', desc: '99.99% uptime with global CDN' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for speed on any device' },
              { icon: Handshake, title: 'SADC Ready', desc: 'Built for African businesses' },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                <p className="text-blue-200 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Testimonials
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-serif">
              Loved by Businesses
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div 
                key={i}
                className="bg-dark-card border border-dark-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-dark-text-secondary mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${['from-blue-500', 'from-purple-500', 'from-green-500'][i]} to-transparent flex items-center justify-center text-white font-bold`}>
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-dark-text-muted text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-600/20 to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.2)_0%,transparent_70%)]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6 font-serif uppercase">
            Ready to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Transform</span>?
          </h2>
          <p className="text-xl text-dark-text-secondary mb-10 max-w-2xl mx-auto">
            Join thousands of businesses already using LemurSystem to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-primary via-blue-500 to-blue-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center gap-3 group"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contact" 
              className="w-full sm:w-auto px-10 py-5 border-2 border-dark-border text-dark-text-secondary font-bold rounded-2xl hover:border-white hover:text-white transition-all duration-300"
            >
              Contact Sales
            </Link>
          </div>
          <p className="mt-6 text-dark-text-muted">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-bg-secondary border-t border-dark-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl text-white font-serif">LemurSystem</span>
              </div>
              <p className="text-dark-text-muted text-sm mb-6 max-w-sm">
                The most comprehensive cloud-based ERP solution for SADC businesses. 
                Simple, powerful, and built for growth.
              </p>
              <div className="flex items-center gap-2 text-dark-text-muted text-sm">
                <Cloud className="w-4 h-4" />
                Powered by cloud infrastructure
              </div>
            </div>
            
            {/* Links */}
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
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-dark-text-muted text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
                <li><a href="#" className="hover:text-white transition">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-dark-text-muted text-sm">
              © 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-dark-text-muted text-sm">
                <Globe className="w-4 h-4" />
                SADC Countries Supported
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
