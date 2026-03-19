'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Users, ArrowRight, Check, ChevronRight,
  UserPlus, Calendar, Award, Clock, TrendingUp
} from 'lucide-react';

const features = [
  {
    title: 'Employee Management',
    description: 'Complete employee lifecycle management from hiring to retirement',
    icon: Users,
    items: ['Employee Directory', 'Personal Profiles', 'Employment History', 'Document Storage', 'ID Card Generation']
  },
  {
    title: 'Leave Management',
    description: 'Streamlined leave requests and approval workflows',
    icon: Calendar,
    items: ['Leave Requests', 'Approval Workflows', 'Leave Balances', 'Calendar View', 'Leave Reports']
  },
  {
    title: 'Recruitment',
    description: 'End-to-end hiring process management',
    icon: UserPlus,
    items: ['Job Postings', 'Application Tracking', 'Resume Management', 'Interview Scheduling', 'Offer Letters']
  },
  {
    title: 'Performance Reviews',
    description: 'Track and manage employee performance',
    icon: Award,
    items: ['Review Cycles', 'Goal Tracking', '360 Feedback', 'Performance Reports', 'Development Plans']
  },
  {
    title: 'Time & Attendance',
    description: 'Monitor employee attendance and time worked',
    icon: Clock,
    items: ['Attendance Tracking', 'Time Sheets', 'Overtime Management', 'Late Arrivals', 'Monthly Reports']
  },
  {
    title: 'Reports & Analytics',
    description: 'Comprehensive HR insights and reporting',
    icon: TrendingUp,
    items: ['Headcount Reports', 'Turnover Analysis', 'Diversity Metrics', 'Cost Analysis', 'Custom Reports']
  }
];

const stats = [
  { value: '1,250+', label: 'Employees Managed' },
  { value: '98%', label: 'User Satisfaction' },
  { value: '50+', label: 'Companies Using' },
  { value: '24/7', label: 'Support Available' }
];

export default function HRPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #7e49de 0%, #9e79ef 50%, #412576 100%)', bottom: '20%', left: '10%' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(11,47,64,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(11,47,64,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <Navbar activePage="applications" />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/20 border border-primary/30 rounded-full text-sm mb-8 animate-fade-in">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">HUMAN RESOURCES</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 font-serif uppercase">
            Human Resources
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-accentDark bg-clip-text text-transparent">
              Management
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-text-secondary mb-10 leading-relaxed max-w-2xl mx-auto">
            Complete employee lifecycle management from hiring to retirement. 
            Streamline HR processes with our comprehensive module.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 border-2 border-dark-border text-dark-text-secondary font-bold rounded-2xl hover:border-primary hover:text-white transition-all duration-300 hover:-translate-y-1">
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-dark-card/50 border border-dark-border rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-dark-text-muted text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-serif">
              FEATURES
            </h2>
            <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
              Everything you need to manage your workforce effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-accent/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent/10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-text-secondary text-sm mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-dark-text-muted">
                      <Check className="w-3 h-3 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary via-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-serif">
            READY TO GET STARTED?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Join hundreds of companies using LemurSystem HR
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-bold rounded-2xl hover:bg-blue-50 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-bg-secondary border-t border-dark-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-white">LemurSystem</span>
            </div>
            <p className="text-dark-text-muted text-sm">
              © 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <Footer />
    </div>
  );
}
