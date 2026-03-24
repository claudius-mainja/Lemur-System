'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Users, ArrowRight, Check, ChevronRight, TrendingUp, Target,
  BarChart3, DollarSign, Mail, Phone, Building2, CheckCircle2, UserPlus
} from 'lucide-react';

const features = [
  {
    title: 'Lead Management',
    description: 'Track leads through the entire sales lifecycle from first contact to close',
    icon: UserPlus,
    items: ['Lead capture forms', 'Lead scoring', 'Lead assignment', 'Lead nurturing', 'Conversion tracking']
  },
  {
    title: 'Contact Management',
    description: 'Comprehensive customer profiles with interaction history',
    icon: Users,
    items: ['Contact database', 'Interaction timeline', 'Company profiles', 'Contact segmentation', 'Duplicate detection']
  },
  {
    title: 'Sales Pipeline',
    description: 'Visual pipeline to manage deals and opportunities effectively',
    icon: BarChart3,
    items: ['Drag-drop kanban', 'Deal stages', 'Win/loss analysis', 'Pipeline forecasting', 'Stage automation']
  },
  {
    title: 'Deal Tracking',
    description: 'Monitor deals from proposal to close with full visibility',
    icon: DollarSign,
    items: ['Deal value tracking', 'Probability scoring', 'Close date predictions', 'Competitive insights', 'Quote generation']
  },
  {
    title: 'Communication Tools',
    description: 'Connect email and phone for seamless communication within CRM',
    icon: Mail,
    items: ['Email sync', 'Template library', 'Mail merge', 'Open tracking', 'Send scheduling']
  },
  {
    title: 'Analytics & Reports',
    description: 'AI-powered analytics for sales insights and decisions',
    icon: Target,
    items: ['Sales dashboards', 'Performance metrics', 'Trend analysis', 'Custom reports', 'Export capabilities']
  }
];

const stats = [
  { value: '45%', label: 'Increase in Conversions', icon: TrendingUp },
  { value: '3.2X', label: 'More Leads Tracked', icon: UserPlus },
  { value: '89%', label: 'Faster Follow-ups', icon: Phone },
  { value: '24/7', label: 'Real-time Insights', icon: BarChart3 },
];

const benefits = [
  { title: '360° Customer View', desc: 'Get a complete picture of every customer with consolidated data from all touchpoints' },
  { title: 'Automated Workflows', desc: 'Save time with automated lead nurturing, follow-ups, and task creation' },
  { title: 'Sales Forecasting', desc: 'Predict future revenue with AI-powered forecasting based on pipeline data' },
  { title: 'Mobile Access', desc: 'Access your CRM on the go with our mobile app for iOS and Android' },
];

export default function CRMPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="applications" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6">
              <Users className="w-4 h-4 text-violet-400" />
              <span className="text-violet-400 text-xs uppercase tracking-wider">CRM Module</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase">
              BUILD STRONGER
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-violet-500 bg-clip-text text-transparent">
                CUSTOMER RELATIONSHIPS
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Manage leads, track opportunities, and grow your sales with powerful automation tools. 
              Build lasting customer relationships with our comprehensive CRM solution designed 
              for SADC businesses.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all">
                Schedule Demo
              </Link>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span>Lead Management</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span>Sales Pipeline</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span>Email Integration</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span>Analytics Dashboard</span>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                alt="CRM Management"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 space-y-3">
                {/* Mini Dashboard */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Pipeline Overview</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-violet-400">R1.2M</div>
                      <div className="text-[9px] text-white/40">Pipeline</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">24</div>
                      <div className="text-[9px] text-white/40">Active Deals</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-emerald-400">68%</div>
                      <div className="text-[9px] text-white/40">Win Rate</div>
                    </div>
                  </div>
                </div>

                {/* Recent Leads */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Recent Leads</div>
                  <div className="space-y-2">
                    {[
                      { name: 'Tech Solutions Ltd', stage: 'Qualified', value: 'R85,000' },
                      { name: 'Global Trade Co', stage: 'Proposal', value: 'R120,000' },
                      { name: 'AfriTech Startup', stage: 'Negotiation', value: 'R45,000' },
                    ].map((lead, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <div className="text-white text-xs">{lead.name}</div>
                          <div className="text-white/40 text-[9px]">{lead.stage}</div>
                        </div>
                        <div className="text-violet-400 text-xs font-medium">{lead.value}</div>
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
                  <div className="text-xs font-bold text-white">+45%</div>
                  <div className="text-[10px] text-emerald-400">More Conversions</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">AI-Powered</div>
                  <div className="text-[10px] text-violet-400">Lead Scoring</div>
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
                <stat.icon className="w-6 h-6 text-violet-400 mx-auto mb-2" />
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
              POWERFUL CRM FEATURES
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Everything you need to manage customer relationships effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#0b2a38]/50 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/60">
                      <Check className="w-3 h-3 text-violet-400 flex-shrink-0" />
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
                WHY CHOOSE OUR CRM MODULE?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4 bg-[#0b2a38]/50 border border-white/10 rounded-xl p-5">
                    <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-violet-400" />
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
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=500&fit=crop"
                alt="CRM Team"
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
          <div className="bg-gradient-to-r from-violet-600 via-violet-500 to-purple-500 rounded-2xl p-10 text-center relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop"
              alt="CRM"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase">
                READY TO GROW YOUR SALES?
              </h2>
              <p className="text-white/80 text-sm mb-6 max-w-lg mx-auto">
                Join hundreds of companies using LemurSystem CRM to build stronger customer relationships.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/free-trial" className="px-8 py-3 bg-white text-violet-600 font-medium rounded-lg hover:bg-white/90 transition flex items-center gap-2">
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
