'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Users, ArrowRight, Check, ChevronRight, Sparkles,
  UserPlus, Calendar, Award, Clock, TrendingUp, Building2,
  FileText, Shield, Globe, CheckCircle2
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
  { value: '1,250+', label: 'Employees Managed', icon: Users },
  { value: '45%', label: 'Faster Onboarding', icon: Clock },
  { value: '60%', label: 'Time Saved', icon: TrendingUp },
  { value: '24/7', label: 'Support Available', icon: Globe },
];

const benefits = [
  { title: 'Streamlined Onboarding', desc: 'Get new employees up and running quickly with automated onboarding workflows' },
  { title: 'Centralized Records', desc: 'Keep all employee data, documents, and history in one secure location' },
  { title: 'Compliance Ready', desc: 'Built-in compliance with SADC labor laws and regulations' },
  { title: 'Self-Service Portal', desc: 'Employees can manage their own profiles, leave requests, and documents' },
];

export default function HRPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="applications" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-xs uppercase tracking-wider">Human Resources Module</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase">
              MANAGE YOUR
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                WORKFORCE EFFICIENTLY
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Complete employee lifecycle management from hiring to retirement. 
              Streamline HR processes, improve compliance, and empower your workforce 
              with our comprehensive HR module.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all">
                Schedule Demo
              </Link>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Employee Directory</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Leave Management</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Performance Reviews</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Attendance Tracking</span>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop"
                alt="HR Management"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 space-y-3">
                {/* Mini Dashboard */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Quick Overview</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">248</div>
                      <div className="text-[9px] text-white/40">Employees</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">12</div>
                      <div className="text-[9px] text-white/40">On Leave</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">3</div>
                      <div className="text-[9px] text-white/40">New Hires</div>
                    </div>
                  </div>
                </div>

                {/* Recent Employees */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Recent Employees</div>
                  <div className="space-y-2">
                    {[
                      { name: 'Sarah Johnson', role: 'Software Engineer' },
                      { name: 'Michael Chen', role: 'Product Manager' },
                      { name: 'Emma Wilson', role: 'UX Designer' },
                    ].map((emp, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{emp.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <div className="text-white text-xs font-medium">{emp.name}</div>
                          <div className="text-white/40 text-[9px]">{emp.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">45% Faster</div>
                  <div className="text-[10px] text-emerald-400">Onboarding Time</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">SADC Compliant</div>
                  <div className="text-[10px] text-blue-400">Labor Laws Built-in</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-[#0b2a38]/50 border border-white/10 rounded-2xl p-6 text-center">
                <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/40 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#061520]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-tight">
              POWERFUL HR FEATURES
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Everything you need to manage your workforce effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#0b2a38]/50 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/60">
                      <Check className="w-3 h-3 text-blue-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 uppercase">
                WHY CHOOSE OUR HR MODULE?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4 bg-[#0b2a38]/50 border border-white/10 rounded-xl p-5">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-white/50 text-sm">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=500&fit=crop"
                alt="HR Team"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b2535] via-transparent to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl p-10 text-center relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop"
              alt="Team"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase">
                READY TO SIMPLIFY HR?
              </h2>
              <p className="text-white/80 text-sm mb-6 max-w-lg mx-auto">
                Join hundreds of companies using LemurSystem HR to streamline their workforce management.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/free-trial" className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-white/90 transition flex items-center gap-2">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
