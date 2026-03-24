'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ArrowRight, Check, Factory, ShoppingCart, Truck, Building, Heart, 
  Plane, GraduationCap, Home, Briefcase, Warehouse, Palmtree, 
  Utensils, Car, Sparkles, Globe, MapPin, DollarSign, Clock,
  Users, BarChart3, Package, Megaphone, Building2, Stethoscope,
  ShoppingBag, GraduationCap as Education, Home as RealEstate,
  Truck as Logistics, UtensilsCrossed, ArrowUpRight, Globe2,
  Layers, Target, Zap, TrendingUp, CheckCircle2, ChevronRight
} from 'lucide-react';

const industries = [
  {
    name: 'Retail & E-Commerce',
    description: 'Complete retail management solution for multi-store operations and online sales. Track inventory, manage customers, and grow your business across channels.',
    icon: ShoppingCart,
    color: 'from-amber-500 to-orange-500',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    features: [
      'Point of Sale (POS)',
      'Inventory Management', 
      'E-commerce Integration',
      'Customer Loyalty Programs',
      'Multi-Store Support',
      'Supplier Management',
      'Barcode Scanning',
      'Sales Analytics'
    ],
    modules: [
      { name: 'Supply Chain', href: '/applications/supply-chain' },
      { name: 'Finance', href: '/applications/finance' },
      { name: 'CRM', href: '/applications/crm' },
    ],
    countries: ['South Africa', 'Botswana', 'Namibia', 'Zimbabwe', 'Mozambique'],
    stat: '35% increase in sales',
  },
  {
    name: 'Manufacturing',
    description: 'End-to-end manufacturing management from production planning to quality control. Optimize operations and reduce costs with intelligent automation.',
    icon: Factory,
    color: 'from-blue-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
    features: [
      'Production Planning',
      'Bill of Materials',
      'Supply Chain Management',
      'Quality Control',
      'Cost Tracking',
      'Machine Scheduling',
      'Raw Material Inventory',
      'Work Order Management'
    ],
    modules: [
      { name: 'Supply Chain', href: '/applications/supply-chain' },
      { name: 'Finance', href: '/applications/finance' },
      { name: 'Productivity', href: '/applications/productivity' },
    ],
    countries: ['South Africa', 'Zambia', 'Mozambique', 'Tanzania', 'Kenya'],
    stat: '40% cost reduction',
  },
  {
    name: 'Healthcare',
    description: 'Comprehensive healthcare management for clinics, hospitals, and medical practices. Streamline patient care and administrative tasks.',
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&h=400&fit=crop',
    features: [
      'Patient Records (EMR)',
      'Appointment Scheduling',
      'Medical Billing',
      'Inventory Management',
      'Lab Integration',
      'Prescription Management',
      'Insurance Claims',
      'Patient Portal'
    ],
    modules: [
      { name: 'HR', href: '/applications/hr' },
      { name: 'Finance', href: '/applications/finance' },
      { name: 'Services', href: '/applications/services' },
    ],
    countries: ['South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Ethiopia'],
    stat: '60% admin time saved',
  },
  {
    name: 'Hospitality',
    description: 'All-in-one hospitality management for hotels, restaurants, and resorts. Delight guests with seamless experiences and efficient operations.',
    icon: UtensilsCrossed,
    color: 'from-emerald-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop',
    features: [
      'Property Management',
      'Restaurant POS',
      'Reservation System',
      'Guest Profiles',
      'Housekeeping Management',
      'Revenue Management',
      'Event Management',
      'Online Booking'
    ],
    modules: [
      { name: 'Finance', href: '/applications/finance' },
      { name: 'CRM', href: '/applications/crm' },
      { name: 'Productivity', href: '/applications/productivity' },
    ],
    countries: ['South Africa', 'Mauritius', 'Seychelles', 'Kenya', 'Tanzania'],
    stat: '25% revenue boost',
  },
  {
    name: 'Education',
    description: 'Modern school and university management system. Streamline admissions, academics, finances, and student services.',
    icon: GraduationCap,
    color: 'from-violet-500 to-purple-500',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
    features: [
      'Student Information System',
      'Fee Management',
      'Attendance Tracking',
      'Examination & Grades',
      'Staff Management',
      'Library Management',
      'Hostel Management',
      'Parent Portal'
    ],
    modules: [
      { name: 'HR', href: '/applications/hr' },
      { name: 'Finance', href: '/applications/finance' },
      { name: 'CRM', href: '/applications/crm' },
    ],
    countries: ['South Africa', 'Zimbabwe', 'Botswana', 'Lesotho', 'Eswatini'],
    stat: '50% faster enrollment',
  },
  {
    name: 'Real Estate',
    description: 'Powerful property management for agents, developers, and property managers. Track listings, tenants, and maintenance with ease.',
    icon: Home,
    color: 'from-indigo-500 to-blue-500',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
    features: [
      'Property Listings',
      'Lease Management',
      'Tenant Portal',
      'Maintenance Tracking',
      'Rent Collection',
      'Financial Reporting',
      'Document Storage',
      'Inspection Management'
    ],
    modules: [
      { name: 'Finance', href: '/applications/finance' },
      { name: 'CRM', href: '/applications/crm' },
      { name: 'Productivity', href: '/applications/productivity' },
    ],
    countries: ['South Africa', 'Namibia', 'Zambia', 'Malawi', 'Mauritius'],
    stat: '30% vacancy reduction',
  },
  {
    name: 'Professional Services',
    description: 'Elevate your consulting, legal, or professional services firm. Manage projects, time, clients, and billing all in one platform.',
    icon: Briefcase,
    color: 'from-slate-500 to-gray-600',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    features: [
      'Project Management',
      'Time Tracking',
      'Client Portal',
      'Invoice & Billing',
      'Resource Planning',
      'Document Management',
      'Expense Tracking',
      'Capacity Planning'
    ],
    modules: [
      { name: 'Finance', href: '/applications/finance' },
      { name: 'Productivity', href: '/applications/productivity' },
      { name: 'CRM', href: '/applications/crm' },
    ],
    countries: ['South Africa', 'Botswana', 'Mauritius', 'Kenya', 'Tanzania'],
    stat: '45% more billable hours',
  },
  {
    name: 'Logistics & Transport',
    description: 'Complete fleet and logistics management. Optimize routes, track deliveries, and manage your transportation business efficiently.',
    icon: Truck,
    color: 'from-cyan-500 to-blue-500',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
    features: [
      'Fleet Management',
      'Route Optimization',
      'Driver Tracking',
      'Fuel Management',
      'Maintenance Scheduling',
      'Delivery Tracking',
      'Warehouse Management',
      'Load Planning'
    ],
    modules: [
      { name: 'Supply Chain', href: '/applications/supply-chain' },
      { name: 'Finance', href: '/applications/finance' },
      { name: 'Productivity', href: '/applications/productivity' },
    ],
    countries: ['South Africa', 'Kenya', 'Uganda', 'DRC', 'Tanzania'],
    stat: '20% fuel cost savings',
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
  const [activeIndustry, setActiveIndustry] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'linear-gradient(135deg, #7e49de 0%, #412576 50%, #0b2f40 100%)', top: '10%', right: '10%' }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]"
          style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }}
        />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl" />
      </div>

      <Navbar activePage="industries" />

      {/* Hero Section - Updated with max-h-screen */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
              <Globe className="w-4 h-4 text-accent" />
              <span className="text-white/60 text-xs uppercase tracking-wider">SADC Region</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase">
              Built for
              <br />
              <span className="bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark bg-clip-text text-transparent">
                African Businesses
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0">
              Tailored for the unique needs of SADC countries. 
              Local currencies, languages, tax compliance, and industry-specific 
              features built right in.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-medium rounded-lg hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all">
                Contact Sales
              </Link>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Check className="w-4 h-4 text-accent" />
                <span>Local Currencies</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Check className="w-4 h-4 text-accent" />
                <span>Tax Compliance</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Check className="w-4 h-4 text-accent" />
                <span>Multi-language</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Check className="w-4 h-4 text-accent" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accentDark rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-[#061c26] px-4 py-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-accent" />
                    <span className="text-xs text-white font-medium">SADC Coverage</span>
                  </div>
                  <span className="text-[10px] text-white/40">12 Countries</span>
                </div>
              </div>

              {/* Map Preview */}
              <div className="p-4">
                <svg viewBox="0 0 400 300" className="w-full h-auto mb-4" style={{ filter: 'drop-shadow(0 0 10px rgba(126, 73, 222, 0.3))' }}>
                  <path 
                    d="M100,80 Q120,60 160,55 L200,50 Q240,45 270,55 L290,70 Q300,90 295,120 L290,150 Q285,180 270,200 L240,215 Q200,220 160,210 L130,195 Q100,175 95,140 L100,100 Q100,85 100,80 Z" 
                    fill="url(#africaGrad)" 
                    stroke="#7e49de" 
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  <defs>
                    <linearGradient id="africaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0b2f40" />
                      <stop offset="100%" stopColor="#184250" />
                    </linearGradient>
                  </defs>
                  
                  {/* SADC Region */}
                  <path 
                    d="M120,100 Q140,90 170,88 L210,85 Q240,90 255,105 L260,130 Q255,155 235,165 L195,172 Q155,170 135,155 L115,135 Q105,115 115,105 Z" 
                    fill="url(#sadcGrad)" 
                    stroke="#7e49de" 
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <defs>
                    <linearGradient id="sadcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7e49de" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#9e79ef" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>

                  {/* Country Dots */}
                  <circle cx="185" cy="130" r="4" fill="#7e49de" className="animate-ping" style={{ animationDuration: '2s' }} />
                  <circle cx="230" cy="100" r="3" fill="#9e79ef" />
                  <circle cx="160" cy="110" r="3" fill="#9e79ef" />
                  <circle cx="250" cy="130" r="3" fill="#9e79ef" />
                  <circle cx="195" cy="155" r="3" fill="#9e79ef" />
                  <circle cx="270" cy="120" r="3" fill="#9e79ef" />
                </svg>

                {/* Country Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#061c26] rounded-lg p-2 text-center border border-white/5">
                    <div className="text-lg font-bold text-white">12</div>
                    <div className="text-[9px] text-white/40 uppercase">Countries</div>
                  </div>
                  <div className="bg-[#061c26] rounded-lg p-2 text-center border border-white/5">
                    <div className="text-lg font-bold text-white">8</div>
                    <div className="text-[9px] text-white/40 uppercase">Industries</div>
                  </div>
                  <div className="bg-[#061c26] rounded-lg p-2 text-center border border-white/5">
                    <div className="text-lg font-bold text-white">9</div>
                    <div className="text-[9px] text-white/40 uppercase">Languages</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">SADC Ready</div>
                  <div className="text-[10px] text-emerald-400">Full compliance</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Local Currency</div>
                  <div className="text-[10px] text-accent">Auto conversion</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Showcase - Elaborative */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Target className="w-4 h-4" />
              INDUSTRY SOLUTIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-tight">
              EXPLORE {industries[activeIndustry].name.toUpperCase()}
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Click through to discover how LemurSystem serves your industry
            </p>
          </div>

          <div className="bg-[#0b2535]/50 border border-white/10 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Left - Details */}
              <div className="p-8 lg:p-12">
                <div className={`inline-flex w-16 h-16 bg-gradient-to-br ${industries[activeIndustry].color} rounded-2xl items-center justify-center mb-6 shadow-lg`}>
                  {React.createElement(industries[activeIndustry].icon, { className: "w-8 h-8 text-white" })}
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">{industries[activeIndustry].name}</h3>
                <p className="text-white/50 mb-6 leading-relaxed">{industries[activeIndustry].description}</p>
                
                {/* Result Stat */}
                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${industries[activeIndustry].color} rounded-lg flex items-center justify-center`}>
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-white/40 uppercase tracking-wider">Average Result</div>
                      <div className="text-white font-bold text-lg">{industries[activeIndustry].stat}</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {industries[activeIndustry].features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-white/70 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Related Modules */}
                <div className="border-t border-white/10 pt-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Related Modules</div>
                  <div className="flex flex-wrap gap-2">
                    {industries[activeIndustry].modules.map((mod, i) => (
                      <Link key={i} href={mod.href} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium hover:bg-accent/20 transition">
                        {mod.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Visual */}
              <div className="relative min-h-[400px] lg:min-h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0b2535] to-[#061c26]" />
                <img 
                  src={industries[activeIndustry].image} 
                  alt={industries[activeIndustry].name}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b2535] via-transparent to-transparent" />
                
                {/* Industry Icon Large */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className={`w-32 h-32 bg-gradient-to-br ${industries[activeIndustry].color} rounded-3xl flex items-center justify-center shadow-2xl opacity-90`}>
                    {React.createElement(industries[activeIndustry].icon, { className: "w-16 h-16 text-white" })}
                  </div>
                </div>
              </div>
            </div>

            {/* Industry Tabs */}
            <div className="border-t border-white/10 p-4">
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
                {industries.map((industry, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndustry(i)}
                    className={`p-3 rounded-xl border transition-all duration-300 ${
                      activeIndustry === i 
                        ? 'bg-white/10 border-accent/50' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${industry.color} rounded-lg flex items-center justify-center mx-auto mb-1.5`}>
                      <industry.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-white font-bold text-[9px] uppercase tracking-wide text-center leading-tight">
                      {industry.name.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SADC Countries Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#061520]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <MapPin className="w-4 h-4" />
              COVERAGE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-tight">SADC REGION COVERAGE</h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Serving all 16 SADC member states with local compliance and support
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {sadcCountries.map((country, i) => (
              <div key={i} className="bg-[#0b2535]/30 border border-white/5 rounded-xl p-4 text-center hover:border-accent/30 transition-all hover:-translate-y-1">
                <div className="text-3xl mb-2">{country.flag}</div>
                <div className="text-white font-medium text-sm mb-1">{country.name}</div>
                <div className="text-white/40 text-xs">{country.currency}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Industries Grid - Modern Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Layers className="w-4 h-4" />
              ALL INDUSTRIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-tight">SOLUTIONS FOR EVERY SECTOR</h2>
            <p className="text-white/40 font-light text-lg max-w-2xl mx-auto">
              Industry-specific features and compliance built right in
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, i) => (
              <div 
                key={i}
                className="group bg-[#0b2535]/30 border border-white/5 rounded-3xl p-6 hover:border-accent/30 hover:bg-[#0b2535]/60 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => setActiveIndustry(i)}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${industry.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <industry.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{industry.name}</h3>
                <p className="text-white/40 text-sm mb-5 font-light leading-relaxed">{industry.description}</p>
                
                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {industry.features.slice(0, 3).map((feature, j) => (
                    <span key={j} className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-white/50 uppercase tracking-wide">
                      {feature}
                    </span>
                  ))}
                </div>
                
                {/* Related Modules */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-xs text-accent">{industry.stat}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-accentDark via-accent to-primary rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase">
                Ready to Scale in SADC?
              </h2>
              <p className="text-white/80 text-sm mb-6 max-w-lg mx-auto">
                Join hundreds of businesses across Southern Africa using LemurSystem. 
                Get started with a free trial today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/free-trial" className="px-8 py-3 bg-white text-accent font-medium rounded-lg hover:bg-white/90 transition flex items-center gap-2">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
