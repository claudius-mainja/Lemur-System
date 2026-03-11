'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, Book, Code, Database, Cloud, Shield, Zap, Rocket, FileText, Video, MessageCircle, Mail, Hexagon, Circle, Triangle, ChevronRight, Menu, X } from 'lucide-react';

const docsSections = [
  {
    title: 'Getting Started',
    icon: Rocket,
    color: 'from-blue-500 to-blue-600',
    articles: ['Quick Start Guide', 'Installation', 'Basic Concepts', 'First Steps', 'Account Setup', 'User Management'],
  },
  {
    title: 'Core Modules',
    icon: Database,
    color: 'from-blue-600 to-cyan-500',
    articles: ['HR Management', 'Finance & Accounting', 'CRM', 'Payroll', 'Inventory', 'Supply Chain'],
  },
  {
    title: 'Integrations',
    icon: Code,
    color: 'from-orange-500 to-orange-600',
    articles: ['API Reference', 'Webhooks', 'Third-party Apps', 'Custom Development', 'REST API', 'GraphQL'],
  },
  {
    title: 'Security',
    icon: Shield,
    color: 'from-orange-600 to-amber-500',
    articles: ['Authentication', 'Permissions', 'Data Encryption', 'Compliance', 'GDPR', 'SSO Setup'],
  },
  {
    title: 'Reports',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    articles: ['Financial Reports', 'HR Reports', 'Custom Reports', 'Analytics', 'Dashboards', 'Export Options'],
  },
  {
    title: 'Support',
    icon: MessageCircle,
    color: 'from-orange-500 to-orange-600',
    articles: ['Help Center', 'Video Tutorials', 'Contact Support', 'Community Forum', 'Training', 'FAQs'],
  },
];

const resources = [
  { icon: Book, title: 'Documentation', desc: 'Comprehensive guides and tutorials', count: '50+ articles' },
  { icon: Video, title: 'Video Tutorials', desc: 'Step-by-step video guides', count: '100+ videos' },
  { icon: Code, title: 'API Reference', desc: 'Developer documentation', count: 'Full API' },
  { icon: MessageCircle, title: 'Community', desc: 'Join our developer community', count: '5K+ members' },
];

export default function DocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] animate-blob"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #f97316 100%)', top: '10%', left: '10%' }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px] animate-blob"
          style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #f59e0b 100%)', bottom: '20%', right: '10%', animationDelay: '2s' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0px,transparent_1px)] bg.03)_1-[size:50px_50px]" />
        <Hexagon className="absolute top-40 left-40 w-20 h-20 text-blue-500/10 animate-float" />
        <Circle className="absolute top-1/3 right-40 w-16 h-16 text-orange-500/10 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-blue-500 to-accent rounded-2xl flex items-center justify-center animate-float-3d">
                <span className="text-white font-bold text-xl">L</span>
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
                    item.name === 'Docs' 
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
              <Link href="/login" className="px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5">
                Start Free Trial
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
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500/20 border border-green-500/30 rounded-full text-sm mb-8 animate-fade-in">
            <Book className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">DOCUMENTATION</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 font-serif">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Get Started
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-text-secondary mb-10 leading-relaxed max-w-2xl mx-auto">
            Comprehensive documentation, tutorials, and resources to help you build with LemurSystem.
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search documentation..."
                className="w-full px-6 py-4 bg-dark-card border border-dark-border rounded-2xl text-white placeholder-dark-text-muted focus:outline-none focus:border-green-500 transition"
              />
              <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, i) => (
              <div key={i} className="bg-dark-card/50 border border-dark-border rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 bg-gradient-to-br ${resource.icon === Book ? 'from-green-500 to-emerald-500' : resource.icon === Video ? 'from-blue-500 to-cyan-500' : resource.icon === Code ? 'from-purple-500 to-pink-500' : 'from-amber-500 to-orange-500'} rounded-xl flex items-center justify-center mb-4`}>
                  <resource.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">{resource.title}</h3>
                <p className="text-dark-text-muted text-sm mb-2">{resource.desc}</p>
                <span className="text-green-400 text-xs font-medium">{resource.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Docs Sections */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-serif">
              EXPLORE OUR DOCS
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {docsSections.map((section, index) => (
              <div
                key={index}
                className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/10"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center mb-4`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.articles.map((article, i) => (
                    <li key={i}>
                      <a href="#" className="flex items-center gap-2 text-sm text-dark-text-muted hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 via-cyan-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-serif">
            Need Help?
          </h2>
          <p className="text-cyan-100 text-lg mb-10">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-white text-green-600 font-bold rounded-2xl hover:bg-green-50 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center gap-2">
              Contact Support <Mail className="w-5 h-5" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300">
              Get Started
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
