'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Lock, Database, Globe, CheckCircle, Server, Eye, CreditCard, UserCheck, Bell, FileText, ChevronRight } from 'lucide-react';

const securityMeasures = [
  {
    icon: Lock,
    title: 'Encryption',
    description: 'All data is encrypted using AES-256 encryption at rest and TLS 1.3 in transit. We use industry-standard encryption protocols to protect your sensitive business data.',
  },
  {
    icon: UserCheck,
    title: 'Access Control',
    description: 'Role-based access control (RBAC) ensures users only access data appropriate to their role. Granular permissions allow fine-tuned control over system access.',
  },
  {
    icon: Eye,
    title: 'Audit Logging',
    description: 'Comprehensive audit trails track all user activities, data access, and system changes. Logs are retained for compliance and security analysis.',
  },
  {
    icon: Server,
    title: 'Infrastructure Security',
    description: 'Our cloud infrastructure is hosted in SOC 2 Type II certified data centers with 24/7 physical security, redundancy, and disaster recovery capabilities.',
  },
  {
    icon: Bell,
    title: 'Intrusion Detection',
    description: 'Continuous monitoring systems detect and respond to suspicious activities in real-time. Automated alerts notify our security team of potential threats.',
  },
  {
    icon: FileText,
    title: 'Data Backup',
    description: 'Daily automated backups with point-in-time recovery options. Backups are encrypted and stored in geographically separate locations.',
  },
];

const compliance = [
  { name: 'POPIA', description: 'South African data protection law compliance' },
  { name: 'GDPR', description: 'EU General Data Protection Regulation compliance' },
  { name: 'SOC 2 Type II', description: 'Security, availability, and confidentiality controls' },
  { name: 'ISO 27001', description: 'Information security management system certification' },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #7e49de 0%, #412576 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="security" />

      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-white/60 text-xs uppercase">Security</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 uppercase">
            Security <span className="text-accent">Commitment</span>
          </h1>
          <p className="text-white/40 max-w-xl mx-auto">
            How we protect your business data
          </p>
        </div>

        {/* Security Measures */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {securityMeasures.map((measure, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent/30 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center mb-4">
                <measure.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{measure.title}</h3>
              <p className="text-white/60 text-sm">{measure.description}</p>
            </div>
          ))}
        </div>

        {/* Compliance */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-accent" />
            Compliance & Certifications
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {compliance.map((item, i) => (
              <div key={i} className="bg-dark-card/50 border border-dark-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="text-white font-semibold">{item.name}</h3>
                </div>
                <p className="text-white/40 text-sm ml-11">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-accent" />
            Two-Factor Authentication
          </h2>
          <p className="text-white/60 leading-relaxed mb-4">
            Add an extra layer of security to your account with our optional two-factor authentication (2FA). 
            When enabled, you'll need to enter a verification code sent to your mobile device in addition to your password.
          </p>
          <ul className="space-y-2 text-white/60">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> SMS-based verification</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Authenticator app support (Google Authenticator, Authy)</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Backup codes for account recovery</li>
          </ul>
        </div>

        {/* Data Privacy */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-accent" />
            Data Privacy
          </h2>
          <p className="text-white/60 leading-relaxed mb-4">
            Your data belongs to you. We are committed to:
          </p>
          <ul className="space-y-3 text-white/60">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>Never selling your data to third parties</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>Providing data export capabilities so you can retrieve your information</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>Offering data deletion upon account termination</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>Processing data only as instructed by your organization</span>
            </li>
          </ul>
        </div>

        {/* Incident Response */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-accent" />
            Incident Response
          </h2>
          <p className="text-white/60 leading-relaxed mb-4">
            In the unlikely event of a security incident, we have established procedures to:
          </p>
          <ul className="space-y-3 text-white/60">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>Detect and contain security incidents promptly</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>Notify affected users within 72 hours of discovering a breach</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>Work with relevant authorities as required by law</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>Implement measures to prevent future incidents</span>
            </li>
          </ul>
        </div>

        {/* Contact Security Team */}
        <div className="bg-gradient-to-r from-accentDark via-accent to-primary rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2 uppercase">Report Security Issues</h2>
          <p className="text-white/60 mb-4">
            If you discover a security vulnerability, please contact our security team immediately.
          </p>
          <p className="text-white font-medium">security@lemursystem.com</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
