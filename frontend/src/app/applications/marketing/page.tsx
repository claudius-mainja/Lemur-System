'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Mail, ArrowRight, Check, ChevronRight, TrendingUp, Shield,
  Users, Zap, Globe, BarChart3, Building2, CheckCircle2, Megaphone
} from 'lucide-react';

const features = [
  {
    title: 'Email Campaigns',
    description: 'Create and send email marketing campaigns',
    icon: Mail,
    items: ['Campaign builder', 'Audience segmentation', 'A/B testing', 'Scheduling', 'Delivery optimization']
  },
  {
    title: 'Lead Nurturing',
    description: 'Automated lead nurturing workflows',
    icon: Users,
    items: ['Workflow builder', 'Behavior triggers', 'Drip campaigns', 'Lead scoring', 'Personalization']
  },
  {
    title: 'Marketing Automation',
    description: 'Automate marketing tasks and follow-ups',
    icon: Zap,
    items: ['Multi-channel automation', 'Trigger-based actions', 'Wait conditions', 'Action sequences', 'Campaign tracking']
  },
  {
    title: 'Landing Pages',
    description: 'Build conversion-optimized landing pages',
    icon: Globe,
    items: ['Drag-drop builder', 'Mobile responsive', 'Conversion forms', 'A/B testing', 'Analytics integration']
  },
  {
    title: 'Analytics & ROI',
    description: 'Track campaign performance and ROI',
    icon: BarChart3,
    items: ['Real-time dashboards', 'Conversion tracking', 'ROI analysis', 'Custom reports', 'Export capabilities']
  },
  {
    title: 'Templates Library',
    description: 'Ready-to-use templates for campaigns',
    icon: Megaphone,
    items: ['Email templates', 'Landing page templates', 'Workflow templates', 'Custom branding', 'Template library']
  }
];

const stats = [
  { value: '35%', label: 'Higher Open Rates', icon: Mail },
  { value: '50%', label: 'More Conversions', icon: TrendingUp },
  { value: '4X', label: 'ROI on Average', icon: BarChart3 },
  { value: '80%', label: 'Time Saved', icon: Zap },
];

const benefits = [
  { title: 'Multi-channel Campaigns', desc: 'Reach customers through email, SMS, and social media from one platform' },
  { title: 'AI-Powered Insights', desc: 'Get intelligent recommendations for optimizing your marketing campaigns' },
  { title: 'Automated Follow-ups', desc: 'Set up automated sequences to nurture leads and close more sales' },
  { title: 'Detailed Analytics', desc: 'Track every click, open, and conversion with comprehensive analytics dashboards' },
];

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="applications" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
              <Megaphone className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 text-xs uppercase tracking-wider">Marketing Module</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase">
              GROW YOUR BUSINESS
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                WITH SMART MARKETING
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Automate your marketing efforts. Email campaigns, lead nurturing, and analytics 
              all in one powerful platform designed to help you convert leads into customers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all">
                Schedule Demo
              </Link>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-orange-400" />
                <span>Email Campaigns</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-orange-400" />
                <span>Lead Nurturing</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-orange-400" />
                <span>Marketing Automation</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-orange-400" />
                <span>Analytics Dashboard</span>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
                alt="Marketing Analytics"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 space-y-3">
                {/* Mini Dashboard */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Campaign Performance</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-emerald-400">35%</div>
                      <div className="text-[9px] text-white/40">Open Rate</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">4.2%</div>
                      <div className="text-[9px] text-white/40">Click Rate</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-orange-400">2.1%</div>
                      <div className="text-[9px] text-white/40">Conversion</div>
                    </div>
                  </div>
                </div>

                {/* Recent Campaigns */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Recent Campaigns</div>
                  <div className="space-y-2">
                    {[
                      { name: 'Spring Sale Email', sent: '12,500', status: 'Active' },
                      { name: 'Product Launch', sent: '8,200', status: 'Scheduled' },
                      { name: 'Newsletter #45', sent: '15,000', status: 'Completed' },
                    ].map((campaign, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <div className="text-white text-xs">{campaign.name}</div>
                          <div className="text-white/40 text-[9px]">{campaign.sent} sent</div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          campaign.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                          campaign.status === 'Scheduled' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-white/10 text-white/40'
                        }`}>
                          {campaign.status}
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
                  <div className="text-xs font-bold text-white">+50%</div>
                  <div className="text-[10px] text-emerald-400">More Conversions</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">4X ROI</div>
                  <div className="text-[10px] text-orange-400">Average Return</div>
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
                <stat.icon className="w-6 h-6 text-orange-400 mx-auto mb-2" />
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
              POWERFUL MARKETING FEATURES
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Everything you need to run effective marketing campaigns
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#0b2a38]/50 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/60">
                      <Check className="w-3 h-3 text-orange-400 flex-shrink-0" />
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
                WHY CHOOSE OUR MARKETING MODULE?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4 bg-[#0b2a38]/50 border border-white/10 rounded-xl p-5">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-orange-400" />
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
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=500&fit=crop"
                alt="Marketing"
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
          <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-2xl p-10 text-center relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop"
              alt="Marketing"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase">
                READY TO GROW YOUR BUSINESS?
              </h2>
              <p className="text-white/80 text-sm mb-6 max-w-lg mx-auto">
                Join hundreds of companies using LemurSystem Marketing to convert more leads into customers.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/free-trial" className="px-8 py-3 bg-white text-orange-600 font-medium rounded-lg hover:bg-white/90 transition flex items-center gap-2">
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
