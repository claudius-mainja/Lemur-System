'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Check, Factory, ShoppingCart, Truck, Building, Heart, Plane, GraduationCap, Home, Briefcase, Warehouse, Palmtree, Utensils, Car, Sparkles, Globe } from 'lucide-react';

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
      </div>

      <Navbar activePage="industries" />

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] flex items-center">
        <div className="text-center max-w-3xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <Globe className="w-4 h-4 text-accent" />
            <span className="text-white/60 text-xs uppercase">SADC Region</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 uppercase">
            Built for
            <br />
            <span className="bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark bg-clip-text text-transparent">
              African Businesses
            </span>
          </h1>
          <p className="text-base text-white/40 mb-8 max-w-xl mx-auto">
            Tailored for the unique needs of SADC countries. 
            Local currencies, languages, and compliance built-in.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-medium rounded-lg hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* SADC Countries */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {sadcCountries.map((country, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center hover:border-white/20 transition">
                <div className="text-2xl mb-1">{country.flag}</div>
                <div className="text-white font-medium text-xs">{country.name}</div>
                <div className="text-white/40 text-[10px]">{country.currency}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#061520]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 uppercase">
              Industries We Serve
            </h2>
            <p className="text-white/40 text-sm max-w-xl mx-auto">
              Comprehensive solutions tailored to your industry
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="group bg-white/5 border border-white/10 rounded-xl p-5 hover:border-accent/50 transition-all hover:-translate-y-1"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${industry.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                  <industry.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-base mb-1">{industry.name}</h3>
                <p className="text-white/40 text-xs mb-3">{industry.description}</p>
                <ul className="space-y-1">
                  {industry.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[10px] text-white/50">
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
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-accentDark via-accent to-primary rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3 uppercase">
              Ready to Scale in SADC?
            </h2>
            <p className="text-white/80 text-sm mb-6">
              Join hundreds of businesses across Southern Africa using LemurSystem
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/free-trial" className="px-6 py-2.5 bg-white text-accent font-medium rounded-lg hover:bg-white/90 transition flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="px-6 py-2.5 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
