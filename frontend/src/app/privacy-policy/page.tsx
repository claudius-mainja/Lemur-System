'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, Database, Mail, Globe, ChevronRight } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #7e49de 0%, #412576 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="privacy" />

      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-white/60 text-xs uppercase">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 uppercase">
            Privacy <span className="text-accent">Policy</span>
          </h1>
          <p className="text-white/40 max-w-xl mx-auto">
            Last updated: March 2026
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-accent" />
              1. Introduction
            </h2>
            <p className="text-white/60 leading-relaxed">
              LemurSystem ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by LemurSystem when you use our ERP platform and related services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-accent" />
              2. Information We Collect
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>Account information (name, email, phone number, company details)</li>
              <li>Business data you upload to the platform (employee records, financial data, customer information)</li>
              <li>Usage data and analytics</li>
              <li>Communication preferences</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-accent" />
              3. How We Use Your Information
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent" />
              4. Data Security
            </h2>
            <p className="text-white/60 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data, including encryption at rest and in transit, regular security assessments, and employee training on data protection. All data is stored in secure, SOC 2 compliant data centers.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" />
              5. Data Transfer
            </h2>
            <p className="text-white/60 leading-relaxed">
              Your information may be transferred to and maintained on computers located outside your state, province, country, or other governmental jurisdiction where the data protection laws may differ. By using LemurSystem, you consent to such transfer.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-accent" />
              6. Your Rights
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              Under data protection laws (including POPIA for South Africa), you have the right to:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request restriction of processing</li>
              <li>Request transfer of your data</li>
              <li>Withdraw consent</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-accent" />
              7. Data Retention
            </h2>
            <p className="text-white/60 leading-relaxed">
              We will retain your personal data only for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-accent" />
              8. Contact Us
            </h2>
            <p className="text-white/60 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at: <span className="text-accent">support@lemursystem.com</span> or <span className="text-accent">+27 61 580 8228</span>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
