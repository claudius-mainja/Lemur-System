'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Shield, Lock, FileText, Check, ArrowRight, Scale,
  Eye, Database, Server, Mail, Globe
} from 'lucide-react';

const legalDocs = [
  {
    title: 'Privacy Policy',
    description: 'Learn how we collect, use, and protect your personal information and data.',
    icon: Shield,
    href: '/privacy-policy',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Terms of Service',
    description: 'Read our terms and conditions governing your use of the LemurSystem platform.',
    icon: FileText,
    href: '/terms-of-service',
    color: 'from-violet-500 to-purple-500',
  },
  {
    title: 'Security',
    description: 'Discover our security practices, certifications, and how we protect your data.',
    icon: Lock,
    href: '/security',
    color: 'from-emerald-500 to-teal-500',
  },
];

const contactInfo = {
  email: 'legal@lemursystem.com',
  address: 'SADC Region, Africa',
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-accent/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <Navbar activePage="legal" />

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
            <Scale className="w-4 h-4 text-accent" />
            <span className="text-accent text-xs font-medium uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Legal Information
          </h1>
          <p className="text-white/50 text-lg">
            Important policies and information about your use of LemurSystem
          </p>
        </div>
      </section>

      {/* Legal Documents */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {legalDocs.map((doc, i) => (
              <Link 
                key={i} 
                href={doc.href}
                className="group bg-[#0b2535]/50 border border-white/10 rounded-2xl p-6 hover:border-accent/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${doc.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <doc.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{doc.title}</h2>
                <p className="text-white/50 text-sm mb-4 leading-relaxed">{doc.description}</p>
                <div className="flex items-center gap-2 text-accent text-sm font-medium">
                  Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0b2535]/50 border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Key Points Summary
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Privacy */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Your Data is Protected</h3>
                    <p className="text-white/50 text-sm">
                      We use 256-bit encryption and maintain strict access controls to protect your information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Data Ownership</h3>
                    <p className="text-white/50 text-sm">
                      You retain ownership of all your data. We never sell your information to third parties.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Transparent Pricing</h3>
                    <p className="text-white/50 text-sm">
                      Clear pricing with no hidden fees. Pay only for what you need.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Server className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Service Availability</h3>
                    <p className="text-white/50 text-sm">
                      We maintain 99.9% uptime with reliable infrastructure and support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-accent/10 to-accentDark/10 border border-accent/20 rounded-2xl p-8 text-center">
            <Globe className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-3">Have Questions?</h2>
            <p className="text-white/50 mb-4">
              Our legal team is here to help. Contact us for any legal inquiries.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href={`mailto:${contactInfo.email}`} 
                className="flex items-center gap-2 text-accent hover:text-white transition"
              >
                <Mail className="w-4 h-4" />
                {contactInfo.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/30 text-sm">
            Last updated: March 24, 2026
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
