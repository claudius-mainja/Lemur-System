'use client';

import Link from 'next/link';
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
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl text-slate-900">LemurSystem</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-slate-600 hover:text-slate-900">Home</Link>
              <Link href="/features" className="text-slate-600 hover:text-slate-900">Features</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900">Pricing</Link>
              <Link href="/industries" className="text-slate-600 hover:text-slate-900">Industries</Link>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-slate-700 font-medium hover:text-slate-900">Log in</Link>
              <Link href="/login" className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-blue-700">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                Application
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 uppercase">
                Human Resources
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Complete HR management solution to handle the entire employee lifecycle from hiring to retirement. Streamline HR processes, improve employee experience, and ensure compliance.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Employee Management', 'Leave Tracking', 'Recruitment', 'Performance'].map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white">
              <Users className="w-16 h-16 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Manage Your Workforce Effectively</h3>
              <p className="text-blue-100 mb-6">From recruitment to retirement, LemurSystem HR handles it all.</p>
              <ul className="space-y-3">
                {benefits.slice(0, 4).map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-200" />
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4 uppercase">Key Features</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Everything you need to manage your human resources effectively</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 uppercase">Why Choose LemurSystem HR?</h2>
              <ul className="space-y-4">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{benefit}</span>
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
                <div key={i} className="bg-white rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-slate-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6 uppercase">Start Your Free Trial</h2>
          <p className="text-blue-100 mb-8">Experience the power of LemurSystem HR today. No credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition">Start Free Trial</Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition">Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400">© 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
