'use client';

import Link from 'next/link';
import { useThemeStore } from '@/stores/theme.store';
import { ArrowLeft, Users, UserCheck, UserPlus, GraduationCap, FileText, Calendar, CheckCircle, Clock, Star } from 'lucide-react';

const features = [
  {
    title: 'Employee Directory',
    description: 'Complete employee database with profiles, contacts, and organizational structure.',
    icon: Users,
  },
  {
    title: 'Leave Management',
    description: 'Automated leave requests, approvals, and leave balance tracking.',
    icon: Calendar,
  },
  {
    title: 'Recruitment',
    description: 'Post jobs, track applicants, and manage the hiring pipeline.',
    icon: UserPlus,
  },
  {
    title: 'Performance Reviews',
    description: 'Goal setting, performance tracking, and review cycles.',
    icon: UserCheck,
  },
  {
    title: 'Training & Development',
    description: 'Track employee training, certifications, and skills development.',
    icon: GraduationCap,
  },
  {
    title: 'Document Management',
    description: 'Store and manage employee documents, contracts, and records.',
    icon: FileText,
  },
];

const benefits = [
  'Reduce administrative workload by 70%',
  'Improve employee self-service',
  'Ensure compliance with labor laws',
  'Streamline onboarding process',
  'Track employee performance',
  'Manage benefits administration',
];

export default function HRPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md ${isDark ? 'bg-dark-bg/90 border-dark-border' : 'bg-light-bg/90 border-light-border'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className={`font-bold text-xl ${isDark ? 'text-dark-text' : 'text-light-text'}`}>LemurSystem</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className={`font-medium transition ${isDark ? 'text-dark-text-secondary hover:text-dark-text' : 'text-light-text-secondary hover:text-light-text'}`}>Home</Link>
              <Link href="/features" className={`font-medium transition ${isDark ? 'text-dark-text-secondary hover:text-dark-text' : 'text-light-text-secondary hover:text-light-text'}`}>Features</Link>
              <Link href="/pricing" className={`font-medium transition ${isDark ? 'text-dark-text-secondary hover:text-dark-text' : 'text-light-text-secondary hover:text-light-text'}`}>Pricing</Link>
              <Link href="/industries" className={`font-medium transition ${isDark ? 'text-dark-text-secondary hover:text-dark-text' : 'text-light-text-secondary hover:text-light-text'}`}>Industries</Link>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className={`px-4 py-2 font-medium transition ${isDark ? 'text-dark-text-secondary hover:text-dark-text' : 'text-light-text-secondary hover:text-light-text'}`}>Log in</Link>
              <Link href="/login" className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 via-dark-bg to-orange-600/10">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className={`inline-flex items-center gap-2 font-medium mb-8 ${isDark ? 'text-dark-text-secondary hover:text-dark-text' : 'text-light-text-secondary hover:text-light-text'}`}>
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-orange-500/20 text-blue-400 rounded-full text-sm font-medium mb-6 border border-blue-500/30">
                Application
              </div>
              <h1 className={`text-4xl sm:text-5xl font-bold mb-6 uppercase tracking-wide ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                Human Resources
              </h1>
              <p className={`text-lg mb-8 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                Complete HR management solution to handle the entire employee lifecycle from hiring to retirement. Streamline HR processes, improve employee experience, and ensure compliance.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Employee Management', 'Leave Tracking', 'Recruitment', 'Performance'].map((tag, i) => (
                  <span key={i} className={`px-3 py-1 text-sm rounded-full ${isDark ? 'bg-dark-bg-tertiary text-dark-text-secondary' : 'bg-light-bg-tertiary text-light-text-secondary'}`}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl p-8 text-white shadow-2xl shadow-blue-500/20">
              <Users className="w-16 h-16 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Manage Your Workforce Effectively</h3>
              <p className="text-white/80 mb-6">From recruitment to retirement, LemurSystem HR handles it all.</p>
              <ul className="space-y-3">
                {benefits.slice(0, 4).map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-white/60" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 uppercase tracking-wide ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Key Features</h2>
            <p className={`max-w-2xl mx-auto ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Everything you need to manage your human resources effectively</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className={`backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-dark-card/80 border-dark-border hover:border-blue-500/50' : 'bg-light-card/80 border-light-border hover:border-orange-500/50'}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/30">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{feature.title}</h3>
                <p className={`text-sm ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/10 to-orange-600/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl font-bold mb-6 uppercase tracking-wide ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Why Choose LemurSystem HR?</h2>
              <ul className="space-y-4">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Employees', value: '10,000+' },
                { label: 'Companies', value: '500+' },
                { label: 'Countries', value: '15+' },
                { label: 'Satisfaction', value: '98%' },
              ].map((stat, i) => (
                <div key={i} className={`backdrop-blur-sm rounded-xl p-6 text-center border ${isDark ? 'bg-dark-card/80 border-dark-border' : 'bg-light-card/80 border-light-border'}`}>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent mb-1">{stat.value}</div>
                  <div className={`text-sm ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6 uppercase">Start Your Free Trial</h2>
          <p className="text-white/80 mb-8">Experience the power of LemurSystem HR today. No credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-white/90 transition shadow-lg">Start Free Trial</Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition">Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 ${isDark ? 'bg-dark-bg border-t border-dark-border' : 'bg-light-bg-secondary border-t border-light-border'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className={isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}>© 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
