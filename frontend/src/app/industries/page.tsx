'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, Factory, ShoppingCart, Truck, Building, Heart, Plane, GraduationCap, Home, Briefcase, Warehouse, Palmtree, Utensils, Car, Sparkles, Globe, Hexagon, Circle, Triangle, Menu, X } from 'lucide-react';

const industries = [
  {
    name: 'Retail & E-Commerce',
    description: 'Manage multiple stores, inventory, and online sales seamlessly',
    icon: ShoppingCart,
    color: 'from-accent to-accentDark',
    features: ['Point of Sale', 'Inventory Management', 'E-commerce Integration', 'Customer Loyalty'],
    countries: ['South Africa', 'Botswana', 'Namibia', 'Zimbabwe'],
  },
  {
    name: 'Manufacturing',
    description: 'Track production, manage supplies, and optimize operations',
    icon: Factory,
    color: 'from-primary to-secondary',
    features: ['Production Planning', 'Supply Chain', 'Quality Control', 'Cost Tracking'],
    countries: ['South Africa', 'Zambia', 'Mozambique', 'Tanzania'],
  },
  {
    name: 'Logistics & Transport',
    description: 'Fleet management, routing, and delivery tracking',
    icon: Truck,
    color: 'from-accentDark to-accent',
    features: ['Fleet Management', 'Route Optimization', 'Driver Tracking', 'Fuel Management'],
    countries: ['South Africa', 'Kenya', 'Uganda', 'DRC'],
  },
  {
    name: 'Healthcare',
    description: 'Patient management, appointments, and medical records',
    icon: Heart,
    color: 'from-accent to-accentDark',
    features: ['Patient Records', 'Appointment Scheduling', 'Billing', 'Inventory'],
    countries: ['South Africa', 'Nigeria', 'Ghana', 'Ethiopia'],
  },
  {
    name: 'Hospitality',
    description: 'Hotel management, reservations, and guest services',
    icon: Palmtree,
    color: 'from-primary to-secondary',
    features: ['Room Management', 'Restaurant POS', 'Guest Profiles', 'Revenue Management'],
    countries: ['South Africa', 'Mauritius', 'Seychelles', 'Kenya'],
  },
  {
    name: 'Education',
    description: 'School management, student records, and academics',
    icon: GraduationCap,
    color: 'from-accentDark to-accent',
    features: ['Student Management', 'Fee Collection', 'Attendance', 'Examination'],
    countries: ['South Africa', 'Zimbabwe', 'Botswana', 'Lesotho'],
  },
  {
    name: 'Real Estate',
    description: 'Property management, leasing, and sales tracking',
    icon: Home,
    color: 'from-accent to-accentDark',
    features: ['Property Listings', 'Lease Management', 'Tenant Portal', 'Maintenance'],
    countries: ['South Africa', 'Namibia', 'Zambia', 'Malawi'],
  },
  {
    name: 'Professional Services',
    description: 'Consulting, legal, and professional firm management',
    icon: Briefcase,
    color: 'from-primary to-secondary',
    features: ['Project Management', 'Time Tracking', 'Client Portal', 'Invoicing'],
    countries: ['South Africa', 'Botswana', 'Mauritius', 'Kenya'],
  },
];

const sadcCountries = [
  { name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', timezone: 'UTC+2' },
  { name: 'Botswana', flag: '🇧🇼', currency: 'BWP', timezone: 'UTC+2' },
  { name: 'Namibia', flag: '🇳🇦', currency: 'NAD', timezone: 'UTC+2' },
  { name: 'Zimbabwe', flag: '🇿🇼', currency: 'ZWL', timezone: 'UTC+2' },
  { name: 'Zambia', flag: '🇿🇲', currency: 'ZMW', timezone: 'UTC+2' },
  { name: 'Mozambique', flag: '🇲🇿', currency: 'MZN', timezone: 'UTC+2' },
  { name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', timezone: 'UTC+3' },
  { name: 'Kenya', flag: '🇰🇪', currency: 'KES', timezone: 'UTC+3' },
  { name: 'Mauritius', flag: '🇲🇺', currency: 'MUR', timezone: 'UTC+4' },
  { name: 'Eswatini', flag: '🇸🇿', currency: 'SZL', timezone: 'UTC+2' },
  { name: 'Lesotho', flag: '🇱🇸', currency: 'LSL', timezone: 'UTC+2' },
  { name: 'Malawi', flag: '🇲🇼', currency: 'MWK', timezone: 'UTC+2' },
];

export default function IndustriesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] animate-blob"
          style={{ background: 'linear-gradient(135deg, #7e49de 0%, #412576 50%, #0b2f40 100%)', top: '10%', right: '10%' }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px] animate-blob"
          style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%', animationDelay: '2s' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(11,47,64,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(11,47,64,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <Hexagon className="absolute top-40 right-40 w-20 h-20 text-accent/10 animate-float" />
        <Circle className="absolute bottom-40 left-40 w-16 h-16 text-primary/10 animate-float" style={{ animationDelay: '0.5s' }} />
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
                  className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                    item.name === 'INDUSTRIES' 
                      ? 'text-white bg-white/10' 
                      : 'text-dark-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login" className="px-5 py-2.5 text-dark-text-secondary hover:text-white transition-all duration-300 font-medium uppercase tracking-wider text-sm">
                Sign In
              </Link>
              <Link href="/login" className="px-6 py-2.5 bg-gradient-to-r from-accent to-accentDark text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 hover:-translate-y-0.5">
                GET STARTED
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
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/20 border border-accent/30 rounded-full text-sm mb-8 animate-fade-in">
            <Globe className="w-4 h-4 text-accent" />
            <span className="text-accent font-medium uppercase">SADC Region</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 uppercase">
            Built for
            <br />
            <span className="bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark bg-clip-text text-transparent">
              African Businesses
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-text-secondary mb-10 leading-relaxed max-w-2xl mx-auto">
            Tailored for the unique needs of SADC countries. 
            Local currencies, languages, and compliance built-in.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-accent to-accentDark text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-accent/30 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center gap-2">
              START FREE TRIAL <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 border-2 border-white/20 text-white/60 font-bold rounded-2xl hover:border-white hover:text-white transition-all duration-300 hover:-translate-y-1">
              CONTACT SALES
            </Link>
          </div>
        </div>
      </section>

      {/* SADC Countries */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sadcCountries.map((country, i) => (
              <div key={i} className="bg-dark-card/50 border border-dark-border rounded-2xl p-4 text-center hover:border-accent/30 transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-2">{country.flag}</div>
                <div className="text-white font-semibold text-sm">{country.name}</div>
                <div className="text-dark-text-muted text-xs">{country.currency}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 uppercase">
              INDUSTRIES WE SERVE
            </h2>
            <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
              Comprehensive solutions tailored to your industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="group bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-accent/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent/10"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${industry.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <industry.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{industry.name}</h3>
                <p className="text-dark-text-secondary text-sm mb-4">{industry.description}</p>
                <ul className="space-y-2">
                  {industry.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-dark-text-muted">
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

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accentDark via-accent to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 uppercase">
            Ready to Scale in SADC?
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Join hundreds of businesses across Southern Africa using LemurSystem
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-accent font-bold rounded-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center gap-2">
              START FREE TRIAL <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300">
              CONTACT SALES
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
