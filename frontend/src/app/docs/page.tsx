'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Code, Video, MessageCircle, Rocket, Database, Cloud, Shield, Zap, DollarSign, Users, Package, BarChart2, Settings, ArrowRight } from 'lucide-react';

const docsSections = [
  { title: 'Getting Started', icon: Rocket, color: 'from-accent to-accentDark', desc: 'Set up your account and get running in minutes' },
  { title: 'Core Modules', icon: Database, color: 'from-primary to-secondary', desc: 'HR, Finance, CRM, Payroll and more' },
  { title: 'Integrations', icon: Zap, color: 'from-accentDark to-accent', desc: 'Connect with your favorite tools' },
  { title: 'API Reference', icon: Code, color: 'from-accent to-accentDark', desc: 'Developer documentation' },
  { title: 'Security', icon: Shield, color: 'from-primary to-secondary', desc: 'Data protection and compliance' },
  { title: 'Billing', icon: DollarSign, color: 'from-accentDark to-accent', desc: 'Plans, pricing and payments' },
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = docsSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #7e49de 0%, #412576 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="docs" />

      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] flex items-center">
        <div className="text-center max-w-3xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="text-white/60 text-xs uppercase">Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 uppercase">
            Complete<br />
            <span className="bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark bg-clip-text text-transparent">Reference Guide</span>
          </h1>
          <p className="text-base text-white/40 mb-8 max-w-xl mx-auto">
            Everything you need to know about LemurSystem. Comprehensive guides and references.
          </p>
          
          <div className="max-w-md mx-auto mb-6">
            <input 
              type="text" 
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent text-sm"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-md mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-lg font-bold text-white">50+</div>
              <div className="text-[10px] text-white/40 uppercase">Modules</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-lg font-bold text-white">100+</div>
              <div className="text-[10px] text-white/40 uppercase">Features</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-lg font-bold text-white">12</div>
              <div className="text-[10px] text-white/40 uppercase">Countries</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-lg font-bold text-white">24/7</div>
              <div className="text-[10px] text-white/40 uppercase">Support</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSections.map((section, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition cursor-pointer">
                <div className={`w-10 h-10 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center mb-3`}>
                  <section.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-base mb-1">{section.title}</h3>
                <p className="text-white/40 text-xs">{section.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-accentDark via-accent to-primary rounded-2xl p-6 text-center">
            <h2 className="text-lg font-bold text-white mb-2 uppercase">Ready to Get Started?</h2>
            <p className="text-white/60 text-sm mb-4">Join thousands of businesses already using LemurSystem</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <Link href="/free-trial" className="px-5 py-2 bg-white text-accent font-medium rounded-lg hover:bg-white/90 transition">Start Free Trial</Link>
              <Link href="/contact" className="px-5 py-2 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
