'use client';

import Link from 'next/link';
import { ArrowRight, Check, Factory, ShoppingCart, Truck, Building, Heart, Plane, GraduationCap, Home, Briefcase, Warehouse, Palmtree, Utensils, Car } from 'lucide-react';

const industries = [
  {
    name: 'Retail & E-Commerce',
    description: 'Manage multiple stores, inventory, and online sales seamlessly',
    icon: ShoppingCart,
    color: 'from-pink-500 to-rose-600',
    features: ['Point of Sale', 'Inventory Management', 'E-commerce Integration', 'Customer Loyalty'],
    countries: ['South Africa', 'Botswana', 'Namibia', 'Zimbabwe'],
  },
  {
    name: 'Manufacturing',
    description: 'Track production, manage supplies, and optimize operations',
    icon: Factory,
    color: 'from-blue-500 to-blue-600',
    features: ['Production Planning', 'Supply Chain', 'Quality Control', 'Cost Tracking'],
    countries: ['South Africa', 'Zambia', 'Mozambique', 'Tanzania'],
  },
  {
    name: 'Logistics & Transport',
    description: 'Fleet management, routing, and delivery tracking',
    icon: Truck,
    color: 'from-green-500 to-green-600',
    features: ['Fleet Management', 'Route Optimization', 'Driver Tracking', 'Fuel Management'],
    countries: ['South Africa', 'Kenya', 'Uganda', 'Democratic Republic of Congo'],
  },
  {
    name: 'Healthcare',
    description: 'Patient management, appointments, and medical records',
    icon: Heart,
    color: 'from-red-500 to-red-600',
    features: ['Patient Records', 'Appointment Scheduling', 'Billing', 'Inventory'],
    countries: ['South Africa', 'Nigeria', 'Ghana', 'Ethiopia'],
  },
  {
    name: 'Hospitality',
    description: 'Hotel management, reservations, and guest services',
    icon: Palmtree,
    color: 'from-amber-500 to-orange-600',
    features: ['Room Management', 'Restaurant POS', 'Guest Profiles', 'Revenue Management'],
    countries: ['South Africa', 'Mauritius', 'Seychelles', 'Kenya'],
  },
  {
    name: 'Education',
    description: 'School management, student records, and academics',
    icon: GraduationCap,
    color: 'from-purple-500 to-purple-600',
    features: ['Student Management', 'Fee Collection', 'Attendance', 'Examination'],
    countries: ['South Africa', 'Zimbabwe', 'Botswana', 'Lesotho'],
  },
  {
    name: 'Real Estate',
    description: 'Property management, leasing, and sales tracking',
    icon: Home,
    color: 'from-cyan-500 to-cyan-600',
    features: ['Property Listings', 'Lease Management', 'Tenant Portal', 'Maintenance'],
    countries: ['South Africa', 'Namibia', 'Zambia', 'Malawi'],
  },
  {
    name: 'Professional Services',
    description: 'Consulting, legal, and professional firm management',
    icon: Briefcase,
    color: 'from-indigo-500 to-indigo-600',
    features: ['Project Management', 'Time Tracking', 'Client Portal', 'Invoicing'],
    countries: ['South Africa', 'Botswana', 'Mauritius', 'Kenya'],
  },
];

const sadcCountries = [
  'South Africa', 'Angola', 'Botswana', 'Democratic Republic of Congo',
  'Eswatini', 'Lesotho', 'Madagascar', 'Malawi', 'Mauritius',
  'Mozambique', 'Namibia', 'Seychelles', 'Tanzania', 'Zambia', 'Zimbabwe'
];

export default function IndustriesPage() {
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
              <Link href="/features" className="text-slate-600 hover:text-slate-900 transition">Features</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition">Pricing</Link>
              <span className="text-primary font-medium">Industries</span>
              <Link href="/about" className="text-slate-600 hover:text-slate-900 transition">About</Link>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-slate-700 font-medium hover:text-slate-900 transition">
                Log in
              </Link>
              <Link href="/login" className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition">
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
            Industries We Serve
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6 font-serif animate-fade-in-up">
            Solutions for Every Industry
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Tailored business management solutions designed specifically for 
            the unique needs of SADC region businesses.
          </p>
        </div>

        {/* SADC Countries */}
        <div className="mt-12 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center font-serif">Serving the SADC Region</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {sadcCountries.map((country, index) => (
              <span key={index} className="px-4 py-2 bg-white rounded-full text-sm text-slate-600 hover:bg-primary hover:text-white transition-all duration-300 cursor-default">
                {country}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${industry.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <industry.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{industry.name}</h3>
                <p className="text-slate-600 mb-4 text-sm">{industry.description}</p>
                
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Key Features</p>
                  <div className="flex flex-wrap gap-2">
                    {industry.features.map((feature, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Available In</p>
                  <div className="flex flex-wrap gap-1">
                    {industry.countries.map((country, i) => (
                      <span key={i} className="text-xs text-slate-500">
                        {country}{i < industry.countries.length - 1 ? ' • ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SADC Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 font-serif">
              Why SADC Businesses Choose LemurSystem
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built with local expertise and understanding of African business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Local Currency Support',
                description: 'Support for ZAR, BWP, NAD, ZMW, MWK, and other SADC currencies.',
                icon: '💰',
              },
              {
                title: 'Tax Compliance',
                description: 'Built-in VAT, GST, and regional tax calculations for all SADC countries.',
                icon: '📋',
              },
              {
                title: 'Multi-Language',
                description: 'Available in English, and support for local languages across the region.',
                icon: '🌍',
              },
              {
                title: 'Local Payment Methods',
                description: 'Integration with PayNow, PayFlex, SnapScan, EFT, and more.',
                icon: '💳',
              },
              {
                title: 'Regional Support',
                description: '24/7 support from our team based in Southern Africa.',
                icon: '📞',
              },
              {
                title: 'Data Localization',
                description: 'Data centers in South Africa ensuring compliance with local regulations.',
                icon: '🔒',
              },
            ].map((item, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-serif">
            Ready to Transform Your Industry?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Join businesses across SADC already using LemurSystem
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition">
              Contact Sales
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
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><span className="text-white">Industries</span></li>
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
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
