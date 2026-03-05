'use client';

import Link from 'next/link';
import { ArrowRight, Users, Award, Globe, TrendingUp, Check, Star, MapPin, Mail, Phone } from 'lucide-react';

const values = [
  {
    icon: Users,
    title: 'Customer First',
    description: 'We prioritize our customers success in everything we do',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Innovation',
    description: 'We constantly improve our platform to stay ahead',
  },
  {
    icon: Globe,
    title: 'Regional Focus',
    description: 'Serving businesses across the SADC region',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We maintain the highest standards in everything',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl text-slate-900 font-serif">LemurSystem</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-slate-600 hover:text-slate-900 transition">Home</Link>
              <Link href="/features" className="text-slate-600 hover:text-slate-900 transition">Features</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition">Pricing</Link>
              <Link href="/industries" className="text-slate-600 hover:text-slate-900 transition">Industries</Link>
              <span className="text-primary font-medium">About</span>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-slate-700 font-medium hover:text-slate-900 transition">
                Log in
              </Link>
              <Link href="/login" className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Award className="w-4 h-4" />
            About LemurSystem
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6 font-serif animate-fade-in-up">
            Empowering Businesses Since 2017
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            We're on a mission to make enterprise-grade business management 
            accessible to companies of all sizes across Africa.
          </p>
          <p className="text-lg font-medium text-primary animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            A Product of Blacklemur Innovations
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 font-serif">
                Our Story
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  LemurSystem was founded in 2017 with a simple vision: to democratize 
                  enterprise resource planning for small and medium businesses across Africa.
                </p>
                <p>
                  We believed that every business deserves access to the same powerful 
                  tools that large corporations use, without the complexity or cost.
                </p>
                <p>
                  Today, we're proud to serve businesses across the SADC region, 
                  helping them streamline operations, improve efficiency, and grow their businesses.
                </p>
                <p>
                  But we're just getting started. Our commitment to innovation and 
                  customer success remains stronger than ever.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 text-white">
                <div className="text-4xl font-bold mb-2">2017</div>
                <div className="text-blue-100">Founded</div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="text-4xl font-bold text-primary mb-2">SADC</div>
                <div className="text-slate-600">Region Focus</div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="text-4xl font-bold text-primary mb-2">8</div>
                <div className="text-slate-600">Applications</div>
              </div>
              <div className="bg-gradient-to-br from-accent to-orange-600 rounded-2xl p-6 text-white">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-orange-100">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 font-serif">
            Our Values
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="text-center p-6 hover:bg-slate-50 rounded-2xl transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                <value.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h3>
              <p className="text-slate-600 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 font-serif">
              Why Choose LemurSystem?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built specifically for African businesses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Local Support',
                description: '24/7 support from our team based in Southern Africa, available in multiple local languages.',
                icon: Globe,
              },
              {
                title: 'Regional Expertise',
                description: 'Built with understanding of SADC business requirements, tax laws, and compliance.',
                icon: Award,
              },
              {
                title: 'Scalable Solutions',
                description: 'From startup to enterprise, our platform grows with your business needs.',
                icon: TrendingUp,
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-serif">
            Join Our Journey
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Start your free trial today and see how LemurSystem can transform your business
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl font-serif">LemurSystem</span>
              </div>
              <p className="text-slate-400 text-sm">
                Cloud-based ERP solution for small to medium businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/industries" className="hover:text-white transition">Industries</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><span className="text-white">About</span></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800">
            <p className="text-slate-400 text-sm text-center">
              © 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
