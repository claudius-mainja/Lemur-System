'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Zap, ArrowRight, Check, ChevronRight, TrendingUp, Shield,
  FileText, Calendar, MessageSquare, Users, Folder, Clipboard, Building2, CheckCircle2
} from 'lucide-react';

const features = [
  {
    title: 'Document Management',
    description: 'Store, organize, and share documents securely',
    icon: FileText,
    items: ['Version control', 'Folder organization', 'Full-text search', 'Access permissions', 'Document templates']
  },
  {
    title: 'Task Boards',
    description: 'Kanban-style task management for teams',
    icon: Clipboard,
    items: ['Drag-drop cards', 'Custom columns', 'Task assignments', 'Due dates', 'Progress tracking']
  },
  {
    title: 'Calendar & Scheduling',
    description: 'Shared calendar for events and deadlines',
    icon: Calendar,
    items: ['Event scheduling', 'Recurring events', 'Team availability', 'Reminders', 'Integration sync']
  },
  {
    title: 'Team Chat',
    description: 'Real-time messaging for team collaboration',
    icon: MessageSquare,
    items: ['Direct messages', 'Group channels', 'File sharing', 'Message threads', 'Read receipts']
  },
  {
    title: 'Project Tracking',
    description: 'Track project progress and milestones',
    icon: TrendingUp,
    items: ['Gantt charts', 'Milestone tracking', 'Budget monitoring', 'Resource allocation', 'Progress reports']
  },
  {
    title: 'File Sharing',
    description: 'Share files with internal and external users',
    icon: Folder,
    items: ['Secure sharing', 'Link expiration', 'Download tracking', 'Storage management', 'Preview files']
  }
];

const stats = [
  { value: '40%', label: 'More Productive', icon: Zap },
  { value: '60%', label: 'Faster Collaboration', icon: MessageSquare },
  { value: '80%', label: 'Time Saved on Admin', icon: Clock },
  { value: '100%', label: 'Secure & Compliant', icon: Shield },
];

const benefits = [
  { title: 'Centralized Workspace', desc: 'Keep all your documents, tasks, and communications in one organized location' },
  { title: 'Real-time Collaboration', desc: 'Work together seamlessly with instant messaging, comments, and notifications' },
  { title: 'Automated Workflows', desc: 'Set up automated task assignments, reminders, and approval workflows' },
  { title: 'Mobile Access', desc: 'Access your workspace from anywhere with our mobile app for iOS and Android' },
];

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function ProductivityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="applications" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full mb-6">
              <Zap className="w-4 h-4 text-pink-400" />
              <span className="text-pink-400 text-xs uppercase tracking-wider">Productivity Module</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase">
              BOOST YOUR TEAM'S
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent">
                PRODUCTIVITY
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Tools to keep your team organized. Documents, tasks, calendars, and collaboration 
              all in one powerful platform designed to help your team work smarter and faster.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg hover:shadow-xl hover:shadow-pink-500/30 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all">
                Schedule Demo
              </Link>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>Task Management</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>Team Chat</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>Document Sharing</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>Calendar Sync</span>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop"
                alt="Productivity"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 space-y-3">
                {/* Mini Dashboard */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Today's Tasks</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-pink-400">12</div>
                      <div className="text-[9px] text-white/40">Completed</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">8</div>
                      <div className="text-[9px] text-white/40">In Progress</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-amber-400">5</div>
                      <div className="text-[9px] text-white/40">Overdue</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Recent Activity</div>
                  <div className="space-y-2">
                    {[
                      { action: 'Sarah completed', task: 'Q1 Report Review' },
                      { action: 'Michael updated', task: 'Client Proposal' },
                      { action: 'Emma shared', task: 'Design Mockups' },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-pink-500/20 rounded-full flex items-center justify-center">
                          <Users className="w-3 h-3 text-pink-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-xs truncate">{activity.action} {activity.task}</div>
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
                  <div className="text-xs font-bold text-white">+40%</div>
                  <div className="text-[10px] text-emerald-400">More Productive</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Team Chat</div>
                  <div className="text-[10px] text-pink-400">24 Active Users</div>
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
                <stat.icon className="w-6 h-6 text-pink-400 mx-auto mb-2" />
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
              POWERFUL PRODUCTIVITY FEATURES
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Everything you need to keep your team organized and productive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#0b2a38]/50 border border-white/10 rounded-2xl p-6 hover:border-pink-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/60">
                      <Check className="w-3 h-3 text-pink-400 flex-shrink-0" />
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
                WHY CHOOSE OUR PRODUCTIVITY MODULE?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4 bg-[#0b2a38]/50 border border-white/10 rounded-xl p-5">
                    <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-pink-400" />
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
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=500&fit=crop"
                alt="Productivity"
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
          <div className="bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 rounded-2xl p-10 text-center relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop"
              alt="Team"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase">
                READY TO BOOST PRODUCTIVITY?
              </h2>
              <p className="text-white/80 text-sm mb-6 max-w-lg mx-auto">
                Join hundreds of teams using LemurSystem Productivity to work smarter and faster.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/free-trial" className="px-8 py-3 bg-white text-pink-600 font-medium rounded-lg hover:bg-white/90 transition flex items-center gap-2">
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
