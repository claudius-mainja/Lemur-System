'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ArrowRight, Users, Award, Globe, TrendingUp, Check, Star, 
  MapPin, Mail, Phone, Sparkles, Target, Lightbulb, Shield, 
  Heart, Zap, Rocket, Handshake, Building2, Clock, BarChart3,
  CheckCircle2, Layers, Puzzle, Megaphone, Cpu, Lock
} from 'lucide-react';

const goals = [
  {
    icon: Rocket,
    title: 'Democratize Enterprise Software',
    description: 'Make powerful business management tools accessible to every business in SADC, regardless of size or technical expertise.',
    color: 'from-accent to-accentDark',
  },
  {
    icon: Globe,
    title: 'Enable Regional Growth',
    description: 'Help SADC businesses compete globally by providing world-class technology with local expertise and compliance.',
    color: 'from-primary to-secondary',
  },
  {
    icon: Zap,
    title: 'Accelerate Digital Transformation',
    description: 'Guide businesses through their digital journey with intuitive tools and exceptional support.',
    color: 'from-accentDark to-accent',
  },
  {
    icon: Handshake,
    title: 'Build Lasting Partnerships',
    description: 'Become a trusted technology partner for our customers, understanding their unique challenges and goals.',
    color: 'from-secondary to-primary',
  },
];

const values = [
  {
    icon: Users,
    title: 'Customer Success',
    description: 'Your success is our success. We prioritize your business outcomes in every decision we make.',
    color: 'from-accent to-accentDark',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Innovation',
    description: 'We constantly evolve our platform to deliver cutting-edge features and improvements.',
    color: 'from-primary to-secondary',
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'Your data security is paramount. We maintain enterprise-grade security standards.',
    color: 'from-accentDark to-accent',
  },
  {
    icon: Heart,
    title: 'Local Relevance',
    description: 'We deeply understand SADC markets and build solutions tailored to regional needs.',
    color: 'from-accent to-accentDark',
  },
];

const features = [
  { icon: Cpu, title: 'Modern Technology', desc: 'Built on cutting-edge platforms' },
  { icon: Lock, title: 'Enterprise Security', desc: 'Bank-level encryption & compliance' },
  { icon: Globe, title: 'SADC Native', desc: 'Built for African businesses' },
  { icon: Layers, title: 'Modular Design', desc: 'Pay only for what you need' },
  { icon: Puzzle, title: 'Easy Integration', desc: 'Connect with your tools' },
  { icon: BarChart3, title: 'Smart Analytics', desc: 'Data-driven insights' },
];

const whatWeOffer = [
  {
    title: 'Complete Business Suite',
    description: '8 integrated modules covering HR, Finance, CRM, Payroll, Inventory, Productivity, Marketing, and Services.',
    icon: Building2,
  },
  {
    title: 'Local Compliance',
    description: 'Built-in support for SADC tax laws, currencies, and regulatory requirements across all 16 member states.',
    icon: Shield,
  },
  {
    title: 'Scalable Solution',
    description: 'Start small and grow as your business expands. Add users, modules, and features on demand.',
    icon: TrendingUp,
  },
  {
    title: 'Exceptional Support',
    description: '24/7 customer support from our SADC-based team who understand your local context.',
    icon: Heart,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'linear-gradient(135deg, #7e49de 0%, #412576 50%, #0b2f40 100%)', top: '10%', right: '10%' }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]"
          style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }}
        />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-secondary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <Navbar activePage="about" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-white/60 text-xs uppercase tracking-wider">About LemurSystem</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase">
              Empowering African
              <br />
              <span className="bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark bg-clip-text text-transparent">
                Businesses
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              We're on a mission to transform how businesses across SADC operate, 
              innovate, and grow. LemurSystem provides world-class ERP solutions 
              designed specifically for the unique needs of African enterprises.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-medium rounded-lg hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/features" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all">
                Explore Features
              </Link>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accentDark rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-[#061c26] px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-xs text-white font-medium">Our Mission & Vision</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Mission */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-white font-bold text-sm uppercase tracking-wider">Mission</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">
                    To provide affordable, powerful, and user-friendly enterprise software 
                    that helps SADC businesses streamline operations, increase productivity, 
                    and achieve sustainable growth.
                  </p>
                </div>

                {/* Vision */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-white font-bold text-sm uppercase tracking-wider">Vision</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">
                    To become the leading ERP platform in Africa, enabling businesses 
                    of all sizes to compete globally through digital transformation 
                    and operational excellence.
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#061c26] rounded-lg p-3 text-center border border-white/5">
                    <Building2 className="w-5 h-5 text-accent mx-auto mb-1" />
                    <div className="text-white font-bold text-xs">8 Modules</div>
                    <div className="text-white/40 text-[9px]">Complete Suite</div>
                  </div>
                  <div className="bg-[#061c26] rounded-lg p-3 text-center border border-white/5">
                    <Globe className="w-5 h-5 text-accent mx-auto mb-1" />
                    <div className="text-white font-bold text-xs">12 Countries</div>
                    <div className="text-white/40 text-[9px]">SADC Coverage</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">SADC Native</div>
                  <div className="text-[10px] text-emerald-400">Built for Africa</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#061520]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Layers className="w-4 h-4" />
              WHAT WE OFFER
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-tight">
              POWERFUL SOLUTIONS FOR MODERN BUSINESSES
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Everything you need to run your business efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whatWeOffer.map((offer, i) => (
              <div key={i} className="bg-[#0b2535]/30 border border-white/5 rounded-2xl p-6 hover:border-accent/30 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <offer.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{offer.title}</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">{offer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Target className="w-4 h-4" />
              OUR GOALS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-tight">
              WHAT WE AIM TO ACHIEVE
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Our mission drives everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {goals.map((goal, i) => (
              <div key={i} className="bg-[#0b2535]/30 border border-white/5 rounded-3xl p-8 hover:border-accent/30 transition-all duration-300 hover:-translate-y-2 group">
                <div className={`w-14 h-14 bg-gradient-to-br ${goal.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <goal.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{goal.title}</h3>
                <p className="text-white/50 font-light leading-relaxed">{goal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#061520]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Heart className="w-4 h-4" />
              OUR VALUES
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-tight">
              PRINCIPLES THAT GUIDE US
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              The foundation of everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-[#0b2535]/30 border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all duration-300 text-center">
                <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-4 h-4" />
              WHY CHOOSE US
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-tight">
              ENTERPRISE-GRADE PLATFORM
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Built with the latest technology for reliability and performance
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <div key={i} className="bg-[#0b2535]/30 border border-white/5 rounded-xl p-5 hover:border-white/20 transition-all flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-0.5">{feature.title}</h3>
                  <p className="text-white/40 text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-accentDark via-accent to-primary rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase">
                Ready to Transform Your Business?
              </h2>
              <p className="text-white/80 text-sm mb-6 max-w-lg mx-auto">
                Join hundreds of businesses across SADC using LemurSystem to streamline their operations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/free-trial" className="px-8 py-3 bg-white text-accent font-medium rounded-lg hover:bg-white/90 transition flex items-center gap-2">
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
