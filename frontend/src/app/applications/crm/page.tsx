'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Check, ChevronRight, BarChart3, Users, DollarSign, Mail, Phone, Target, TrendingUp } from 'lucide-react';

const features = [
  { title: 'Lead Management', description: 'Track leads through the entire sales lifecycle from first contact to close', items: ['Lead capture forms', 'Lead scoring', 'Lead assignment', 'Lead nurturing', 'Conversion tracking'] },
  { title: 'Contact Management', description: 'Comprehensive customer profiles with interaction history', items: ['Contact database', 'Interaction timeline', 'Company profiles', 'Contact segmentation', 'Duplicate detection'] },
  { title: 'Sales Pipeline', description: 'Visual pipeline to manage deals and opportunities effectively', items: ['Drag-drop kanban', 'Deal stages', 'Win/loss analysis', 'Pipeline forecasting', 'Stage automation'] },
  { title: 'Deal Tracking', description: 'Monitor deals from proposal to close with full visibility', items: ['Deal value tracking', 'Probability scoring', 'Close date predictions', 'Competitive insights', 'Quote generation'] },
  { title: 'Email Integration', description: 'Connect email for seamless communication within CRM', items: ['Email sync', 'Template library', 'Mail merge', 'Open tracking', 'Send scheduling'] },
  { title: 'Analytics', description: 'AI-powered analytics for sales insights and decisions', items: ['Sales dashboards', 'Performance metrics', 'Trend analysis', 'Custom reports', 'Export capabilities'] },
];

const stats = [
  { value: '45%', label: 'INCREASE IN CONVERSIONS' },
  { value: '3.2X', label: 'MORE LEADS TRACKED' },
  { value: '89%', label: 'FASTER FOLLOW-UPS' },
  { value: '24/7', label: 'REAL-TIME INSIGHTS' },
];

export default function CRMPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #7e49de 0%, #9e79ef 50%, #412576 100%)', bottom: '20%', left: '10%' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(11,47,64,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(11,47,64,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <Navbar activePage="applications" />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                </Link>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login" className="px-5 py-2.5 text-dark-text-secondary hover:text-white transition-all duration-300 font-medium">Log in</Link>
              <Link href="/login" className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5">Start Free Trial</Link>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-dark-text-secondary">{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
        {mobileMenuOpen && <div className="lg:hidden bg-dark-bg/95 backdrop-blur-xl border-t border-dark-border px-4 py-6 space-y-3">{['Home', 'Features', 'Pricing', 'Industries', 'Docs', 'About', 'Contact'].map((item) => (<Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="block py-3 text-dark-text-secondary hover:text-white">{item}</Link>))}</div>}
      </nav>

      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6 border border-accent/30">APPLICATION</div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 uppercase font-serif">CRM</h1>
            <p className="text-lg text-dark-text-secondary mb-8">Build stronger customer relationships. Manage leads, track opportunities, and grow your sales with powerful automation tools.</p>
            <div className="flex flex-wrap gap-3">
              {['Lead Management', 'Sales Pipeline', 'Analytics', 'Automation'].map((tag, i) => (<span key={i} className="px-3 py-1 bg-dark-bg-tertiary text-dark-text-secondary text-sm rounded-full border border-dark-border">{tag}</span>))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-accent to-accentDark rounded-2xl p-8 text-white">
            <BarChart3 className="w-16 h-16 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Grow Your Customer Base</h3>
            <p className="text-accent-100 mb-6">Powerful tools to convert and retain customers.</p>
            <ul className="space-y-3">
              {['Lead tracking & scoring', 'Sales pipeline visualization', 'Customer insights', 'AI-powered forecasting'].map((b, i) => (<li key={i} className="flex items-center gap-2"><Check className="w-5 h-5 text-accent-200" />{b}</li>))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">{stats.map((s, i) => (<div key={i} className="text-center p-6 bg-dark-card/50 rounded-xl border border-dark-border"><div className="text-3xl font-bold text-white mb-2">{s.value}</div><div className="text-dark-text-muted text-sm">{s.label}</div></div>))}</div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-bg-secondary/30">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 uppercase">Key Features</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="bg-dark-card/50 border border-dark-border rounded-xl p-6 hover:border-accent/30 transition-all hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-dark-text-secondary text-sm mb-4">{f.description}</p>
              <ul className="space-y-2">{f.items.map((item, j) => (<li key={j} className="flex items-center gap-2 text-sm text-dark-text-muted"><ChevronRight className="w-4 h-4 text-accent" />{item}</li>))}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl font-bold text-white mb-6 uppercase">START YOUR FREE TRIAL</h2><Link href="/login" className="px-8 py-4 bg-white text-accent font-semibold rounded-xl inline-flex items-center gap-2">Get Started <ArrowRight className="w-5 h-5" /></Link></div>
      </section>

      <Footer />
    </div>
  );
}
