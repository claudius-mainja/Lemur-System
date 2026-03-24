'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  HeadphonesIcon, ArrowRight, Check, ChevronRight, TrendingUp, Shield,
  Clock, BookOpen, User, FileText, Building2, CheckCircle2, AlertTriangle
} from 'lucide-react';

const features = [
  {
    title: 'Ticket System',
    description: 'Manage customer support tickets efficiently',
    icon: HeadphonesIcon,
    items: ['Multi-channel tickets', 'Ticket routing', 'Priority levels', 'Ticket history', 'Internal notes']
  },
  {
    title: 'SLA Monitoring',
    description: 'Track service level agreements and response times',
    icon: Clock,
    items: ['SLA timers', 'Breach alerts', 'SLA reports', 'Priority mapping', 'Automatic warnings']
  },
  {
    title: 'Knowledge Base',
    description: 'Self-service help center for customers',
    icon: BookOpen,
    items: ['Article management', 'Categories', 'Search optimization', 'Article feedback', 'Version control']
  },
  {
    title: 'Customer Portal',
    description: 'Portal for customers to submit and track tickets',
    icon: User,
    items: ['Ticket submission', 'Status tracking', 'Profile management', 'Communication hub', 'Satisfaction surveys']
  },
  {
    title: 'Service Reports',
    description: 'Generate reports on support performance',
    icon: TrendingUp,
    items: ['Response times', 'Resolution rates', 'Agent performance', 'Customer satisfaction', 'Trend analysis']
  },
  {
    title: 'Escalation',
    description: 'Automatic escalation for urgent issues',
    icon: AlertTriangle,
    items: ['Auto-escalation rules', 'Manager alerts', 'Priority boosting', 'Escalation history', 'SLA recovery']
  }
];

const stats = [
  { value: '85%', label: 'Faster Resolution', icon: Clock },
  { value: '95%', label: 'Customer Satisfaction', icon: User },
  { value: '40%', label: 'Reduce Workload', icon: HeadphonesIcon },
  { value: '24/7', label: 'Support Coverage', icon: Shield },
];

const benefits = [
  { title: 'Omnichannel Support', desc: 'Manage support tickets from email, chat, phone, and social media in one unified inbox' },
  { title: 'AI-Powered Suggestions', desc: 'Get intelligent suggestions for ticket responses and knowledge base articles' },
  { title: 'SLA Management', desc: 'Never miss a deadline with automated SLA tracking and breach alerts' },
  { title: 'Customer Self-Service', desc: 'Reduce ticket volume with a comprehensive knowledge base and FAQ section' },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="applications" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <HeadphonesIcon className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-xs uppercase tracking-wider">Services Module</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase">
              DELIVER EXCELLENT
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
                CUSTOMER SERVICE
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Help desk tickets, service requests, and support tracking all in one platform. 
              Deliver world-class customer support and build lasting relationships with your customers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-2">
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
                <span>Ticket Management</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>SLA Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Knowledge Base</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Customer Portal</span>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                alt="Customer Service"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 space-y-3">
                {/* Mini Dashboard */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Support Overview</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">45</div>
                      <div className="text-[9px] text-white/40">Open</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-emerald-400">89%</div>
                      <div className="text-[9px] text-white/40">SLA Met</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-blue-400">4.8</div>
                      <div className="text-[9px] text-white/40">CSAT Score</div>
                    </div>
                  </div>
                </div>

                {/* Recent Tickets */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Recent Tickets</div>
                  <div className="space-y-2">
                    {[
                      { id: 'TKT-4521', subject: 'Login Issue', priority: 'High', status: 'Open' },
                      { id: 'TKT-4520', subject: 'Billing Question', priority: 'Medium', status: 'Pending' },
                      { id: 'TKT-4519', subject: 'Feature Request', priority: 'Low', status: 'Resolved' },
                    ].map((ticket, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <div className="text-white text-xs">{ticket.subject}</div>
                          <div className="text-white/40 text-[9px]">{ticket.id}</div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          ticket.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                          ticket.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {ticket.priority}
                        </span>
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
                  <div className="text-xs font-bold text-white">+85%</div>
                  <div className="text-[10px] text-emerald-400">Faster Resolution</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">SLA</div>
                  <div className="text-[10px] text-blue-400">Always Met</div>
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
              POWERFUL SERVICES FEATURES
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Everything you need to deliver exceptional customer support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#0b2a38]/50 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
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
                WHY CHOOSE OUR SERVICES MODULE?
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
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=500&fit=crop"
                alt="Customer Service"
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
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 rounded-2xl p-10 text-center relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop"
              alt="Customer Service"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase">
                READY TO DELIVER EXCELLENT SUPPORT?
              </h2>
              <p className="text-white/80 text-sm mb-6 max-w-lg mx-auto">
                Join hundreds of companies using LemurSystem Services to build customer loyalty.
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
