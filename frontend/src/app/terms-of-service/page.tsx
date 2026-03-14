'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, Shield, CheckCircle, XCircle, Globe, CreditCard, ChevronRight } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #7e49de 0%, #412576 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="terms" />

      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-white/60 text-xs uppercase">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 uppercase">
            Terms of <span className="text-accent">Service</span>
          </h1>
          <p className="text-white/40 max-w-xl mx-auto">
            Last updated: March 2026
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-accent" />
              1. Acceptance of Terms
            </h2>
            <p className="text-white/60 leading-relaxed">
              By accessing and using LemurSystem, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-accent" />
              2. Description of Service
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              LemurSystem is a cloud-based Enterprise Resource Planning (ERP) platform providing:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>Human Resources Management</li>
              <li>Financial Accounting and Invoicing</li>
              <li>Customer Relationship Management</li>
              <li>Payroll Processing</li>
              <li>Supply Chain and Inventory Management</li>
              <li>Productivity Tools</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              3. User Obligations
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              As a user of LemurSystem, you agree to:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Not share your account with unauthorized persons</li>
              <li>Not use the service for any illegal purpose</li>
              <li>Not attempt to gain unauthorized access to any part of the system</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              4. Intellectual Property
            </h2>
            <p className="text-white/60 leading-relaxed">
              The LemurSystem platform, including all content, features, and functionality, is owned by Blacklemur Innovations and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our service without prior written consent.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-accent" />
              5. Prohibited Activities
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              You may not use the service to:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>Upload or transmit viruses, malware, or other harmful code</li>
              <li>Attempt to reverse engineer or disassemble any part of the service</li>
              <li>Interfere with the proper working of the service</li>
              <li>Collect or store personal data about other users without consent</li>
              <li>Engage in any activity that violates applicable laws</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              6. Payment Terms
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              Subscription fees are billed monthly or annually in advance. Fees are non-refundable unless otherwise specified. You authorize us to charge your payment method for any subscriptions.
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>Starter Plan: $10.60/user/month (up to 6 users)</li>
              <li>Professional Plan: $20.50/user/month (up to 50 users)</li>
              <li>Enterprise Plan: Custom pricing (unlimited users)</li>
              <li>Enterprise Plan: Custom pricing</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" />
              7. Limitation of Liability
            </h2>
            <p className="text-white/60 leading-relaxed">
              LemurSystem shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Our total liability shall not exceed the amount paid by you for the service in the twelve months preceding the claim.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              8. Termination
            </h2>
            <p className="text-white/60 leading-relaxed">
              Either party may terminate this agreement at any time. Upon termination, your right to use the service ceases immediately. We may suspend or terminate your account if you breach any terms of this agreement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              9. Governing Law
            </h2>
            <p className="text-white/60 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of South Africa. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of South Africa.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-accent" />
              10. Contact Information
            </h2>
            <p className="text-white/60 leading-relaxed">
              For questions about these Terms of Service, please contact us at: <span className="text-accent">support@lemursystem.com</span> or <span className="text-accent">+27 61 580 8228</span>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
