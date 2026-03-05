'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, BarChart3, CheckCircle } from 'lucide-react';

const features = [
  { title: 'Email Campaigns', description: 'Create and send email marketing campaigns', icon: Mail },
  { title: 'Lead Nurturing', description: 'Automated lead nurturing workflows', icon: BarChart3 },
  { title: 'Marketing Analytics', description: 'Track campaign performance and ROI', icon: BarChart3 },
  { title: 'Landing Pages', description: 'Build conversion-optimized landing pages', icon: Mail },
  { title: 'Social Media', description: 'Schedule and manage social media posts', icon: BarChart3 },
  { title: 'Automation Workflows', description: 'Automate marketing tasks and follow-ups', icon: Mail },
];

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4"><div className="flex items-center justify-between h-16"><Link href="/" className="flex items-center gap-2"><div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl"><span className="text-white font-bold text-lg">L</span></div><span className="font-bold text-xl">LemurSystem</span></Link><div className="hidden md:flex gap-8"><Link href="/">Home</Link></div><div className="hidden md:flex gap-3"><Link href="/login">Log in</Link><Link href="/login" className="px-5 py-2.5 bg-primary text-white rounded-lg">Start Free Trial</Link></div></div></div>
      </nav>
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-indigo-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-8"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">Application</div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 uppercase">Marketing</h1>
              <p className="text-lg text-slate-600 mb-8">Automate your marketing efforts. Email campaigns, lead nurturing, and analytics all in one platform.</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-8 text-white">
              <Mail className="w-16 h-16 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Grow Your Business</h3>
              <ul className="space-y-3">{['Email campaigns', 'Lead nurturing', 'Analytics', 'Automation'].map((b, i) => (<li key={i} className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-200" />{b}</li>))}</ul>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 px-4"><div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">{features.map((f, i) => (<div key={i} className="border border-slate-200 rounded-xl p-6 hover:shadow-xl"><div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4"><f.icon className="w-6 h-6 text-indigo-600" /></div><h3 className="text-lg font-semibold mb-2">{f.title}</h3><p className="text-slate-600 text-sm">{f.description}</p></div>))}</div></section>
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-blue-700"><div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl font-bold text-white mb-6 uppercase">Start Your Free Trial</h2><Link href="/login" className="px-8 py-4 bg-white text-primary font-semibold rounded-xl">Start Free Trial</Link></div></section>
      <footer className="bg-slate-900 text-white py-12"><div className="max-w-7xl mx-auto text-center"><p className="text-slate-400">© 2026 LemurSystem.</p></div></footer>
    </div>
  );
}
