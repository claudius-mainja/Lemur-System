'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Users, Wallet, PiggyBank, Package, FileText, Calendar, 
  BarChart3, Mail, Shield, Zap, Globe, TrendingUp, 
  ArrowRight, Check, Cloud, Database, Lock, Smartphone,
  Workflow, HeadphonesIcon, Gauge, Cpu, Sparkles,
  Hexagon, Triangle, Circle, Menu, X, ArrowUpRight,
  Globe2, Zap as LightningBolt, CheckCircle2, Building2,
  CreditCard, FileStack, CalendarDays, MessageSquare,
  BarChart, ShoppingCart, Megaphone, Ticket, UsersRound,
  Briefcase, TrendingDown, Receipt, Boxes, Target,
  Layers, Play, ChevronRight, Settings,
  BrainCircuit, Bot, Puzzle, BoxesIcon,
  ArrowUp, ArrowDown, DollarSign, PieChart, LineChart
} from 'lucide-react';

const modules = [
  {
    name: 'Human Resources',
    href: '/applications/hr',
    description: 'Complete HR management from hiring to retirement. Streamline your workforce operations with powerful tools for employee lifecycle management.',
    icon: Users,
    features: ['Employee Directory', 'Leave Management', 'Recruitment Portal', 'Performance Reviews', 'Training Tracker', 'Document Storage', 'Attendance Tracking', 'Employee Self-Service'],
    color: 'from-blue-500 to-cyan-500',
    highlight: 'Simplify your HR processes',
    stat: '45% faster onboarding',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop',
  },
  {
    name: 'Payroll',
    href: '/applications/payroll',
    description: 'Automated salary processing with tax compliance. Ensure accurate and timely payments while staying compliant with regional regulations.',
    icon: PiggyBank,
    features: ['Salary Processing', 'Tax Calculations', 'Direct Deposit', 'Payslip Generation', 'Year-End Reports', 'Compliance Management', 'Reimbursement Processing', 'Statutory Deductions'],
    color: 'from-emerald-500 to-teal-500',
    highlight: 'Error-free payroll processing',
    stat: '99.9% accuracy rate',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
  },
  {
    name: 'Finance',
    href: '/applications/finance',
    description: 'Comprehensive accounting and financial management. Gain real-time visibility into your financial health with powerful reporting tools.',
    icon: Wallet,
    features: ['General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets', 'Financial Reports', 'Budget Tracking', 'Cash Flow Management', 'Multi-Currency Support'],
    color: 'from-amber-500 to-orange-500',
    highlight: 'Complete financial control',
    stat: '60% time savings',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  },
  {
    name: 'Supply Chain',
    href: '/applications/supply-chain',
    description: 'End-to-end inventory and procurement control. Optimize your supply chain with real-time tracking and intelligent automation.',
    icon: Package,
    features: ['Inventory Management', 'Purchase Orders', 'Vendor Portal', 'Stock Alerts', 'Reorder Points', 'Warehouse Tracking', 'Barcode Scanning', 'Supplier Management'],
    color: 'from-violet-500 to-purple-500',
    highlight: 'Optimize inventory levels',
    stat: '30% cost reduction',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
  },
  {
    name: 'CRM',
    href: '/applications/crm',
    description: 'Build stronger customer relationships. Convert leads to customers and nurture relationships with powerful sales and marketing tools.',
    icon: BarChart3,
    features: ['Lead Management', 'Sales Pipeline', 'Contact Tracking', 'Activity Logs', 'Email Integration', 'Sales Forecasting', 'Opportunity Tracking', 'Customer Segmentation'],
    color: 'from-rose-500 to-pink-500',
    highlight: 'Boost sales performance',
    stat: '25% revenue growth',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
  },
  {
    name: 'Productivity',
    href: '/applications/productivity',
    description: 'Tools to keep your team organized. Enhance collaboration with document management, task tracking, and real-time communication.',
    icon: FileText,
    features: ['Document Management', 'Task Boards', 'Team Calendar', 'Project Tracking', 'Team Chat', 'File Sharing', 'Time Tracking', 'Wiki & Notes'],
    color: 'from-indigo-500 to-blue-500',
    highlight: 'Supercharge team collaboration',
    stat: '40% productivity boost',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop',
  },
  {
    name: 'Services',
    href: '/applications/services',
    description: 'Deliver exceptional customer service. Manage support tickets, knowledge base, and customer interactions all in one place.',
    icon: Calendar,
    features: ['Ticket System', 'SLA Monitoring', 'Knowledge Base', 'Customer Portal', 'Service Reports', 'Escalation Rules', 'Multi-Channel Support', 'CSAT Surveys'],
    color: 'from-cyan-500 to-blue-500',
    highlight: 'Delight your customers',
    stat: '90% faster resolution',
    image: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=600&h=400&fit=crop',
  },
  {
    name: 'Marketing',
    href: '/applications/marketing',
    description: 'Automate your marketing efforts. Create, manage, and analyze marketing campaigns across multiple channels with ease.',
    icon: Mail,
    features: ['Email Campaigns', 'Lead Nurturing', 'Marketing Analytics', 'Landing Pages', 'Social Media', 'Automation Workflows', 'A/B Testing', 'ROI Tracking'],
    color: 'from-fuchsia-500 to-pink-500',
    highlight: 'Scale your marketing',
    stat: '3x leads conversion',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  },
];

const platformFeatures = [
  { icon: Cloud, title: 'Cloud Native', desc: 'Built for the cloud with auto-scaling infrastructure', stat: '99.99%' },
  { icon: Database, title: 'Auto Backups', desc: 'Daily automated backups with 30-day retention', stat: '30 days' },
  { icon: Lock, title: 'Bank-Level Security', desc: '256-bit encryption with SOC 2 compliance', stat: '256-bit' },
  { icon: Smartphone, title: 'Mobile Ready', desc: 'Native iOS and Android apps', stat: 'iOS & Android' },
  { icon: Cpu, title: 'API Access', desc: 'RESTful APIs for custom integrations', stat: '50+' },
  { icon: BrainCircuit, title: 'AI Powered', desc: 'Intelligent automation and insights', stat: 'AI/ML' },
  { icon: Gauge, title: 'Real-Time Analytics', desc: 'Live dashboards and custom reports', stat: 'Real-time' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Round-the-clock expert assistance', stat: '24/7' },
];

const integrationHighlights = [
  { icon: ShoppingCart, name: 'E-Commerce', count: '15+' },
  { icon: Building2, name: 'Banks', count: '20+' },
  { icon: Globe, name: 'Payment Gateways', count: '10+' },
  { icon: Boxes, name: 'Shipping', count: '8+' },
];

export default function FeaturesPage() {
  const [activeModule, setActiveModule] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-accent/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-secondary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <Navbar activePage="features" />

      {/* Hero Section - Updated with max-h-screen and faded backgrounds */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-white/60 text-xs uppercase tracking-wider">Powerful Business Suite</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              <span className="block">EVERYTHING YOU NEED</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark">
                TO RUN YOUR BUSINESS
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0">
              8 integrated modules that work seamlessly together. 
              From HR to accounting, from inventory to customer service - 
              we've built the complete business management solution.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-medium rounded-lg hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/pricing" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all">
                View Pricing
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">Modules</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">Integrations</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">9</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">Countries</div>
              </div>
            </div>
          </div>

          {/* Right - Visual Dashboard Preview */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accentDark rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Browser Header */}
              <div className="bg-[#061c26] px-4 py-3 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="text-xs text-white/40 uppercase tracking-wider">LemurSystem Dashboard</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-500 uppercase">Live</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-5">
                {/* Module Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {modules.slice(0, 8).map((mod, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${mod.color}`}>
                        <mod.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[8px] text-white/50 uppercase">{mod.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400">+12.5%</span>
                    </div>
                    <div className="text-lg font-bold text-white">$124K</div>
                    <div className="text-[9px] text-white/40 uppercase">Revenue</div>
                  </div>
                  <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-[10px] text-blue-400">+8</span>
                    </div>
                    <div className="text-lg font-bold text-white">248</div>
                    <div className="text-[9px] text-white/40 uppercase">Employees</div>
                  </div>
                  <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <ShoppingCart className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] text-amber-400">+23%</span>
                    </div>
                    <div className="text-lg font-bold text-white">1.2K</div>
                    <div className="text-[9px] text-white/40 uppercase">Orders</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <ArrowUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Sales Up</div>
                  <div className="text-[10px] text-emerald-400">+15% this week</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">New Hire</div>
                  <div className="text-[10px] text-blue-400">3 applications</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
          <div className="flex flex-col items-center gap-2 text-white/30">
            <span className="text-[10px] uppercase tracking-widest">Scroll to explore</span>
            <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
              <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Active Module Showcase - Modern & Elaborative */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Layers className="w-4 h-4" />
              EXPLORE MODULES
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-tight">
              DISCOVER {modules[activeModule].name.toUpperCase()}
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Click through to explore each module's capabilities
            </p>
          </div>

          <div className="bg-[#0b2535]/50 border border-white/10 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Left - Module Details */}
              <div className="p-8 lg:p-12">
                <div className={`inline-flex w-16 h-16 bg-gradient-to-br ${modules[activeModule].color} rounded-2xl items-center justify-center mb-6 shadow-lg`}>
                  {React.createElement(modules[activeModule].icon, { className: "w-8 h-8 text-white" })}
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">{modules[activeModule].name}</h3>
                <p className="text-white/50 mb-6 leading-relaxed">{modules[activeModule].description}</p>
                
                {/* Highlight */}
                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${modules[activeModule].color} rounded-lg flex items-center justify-center`}>
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-white/40 uppercase tracking-wider">Key Benefit</div>
                      <div className="text-white font-medium">{modules[activeModule].highlight}</div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-white/40 uppercase tracking-wider">Average Result</div>
                      <div className="text-white font-bold text-lg">{modules[activeModule].stat}</div>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-3">
                  {modules[activeModule].features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-white/70 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Visual */}
              <div className="relative min-h-[400px] lg:min-h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0b2535] to-[#061c26]" />
                <img 
                  src={modules[activeModule].image} 
                  alt={modules[activeModule].name}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b2535] via-transparent to-transparent" />
                
                {/* Module Icon Large */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className={`w-32 h-32 bg-gradient-to-br ${modules[activeModule].color} rounded-3xl flex items-center justify-center shadow-2xl opacity-90`}>
                    {React.createElement(modules[activeModule].icon, { className: "w-16 h-16 text-white" })}
                  </div>
                </div>
              </div>
            </div>

            {/* Module Selector Tabs */}
            <div className="border-t border-white/10 p-4">
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
                {modules.map((module, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveModule(i)}
                    className={`p-3 rounded-xl border transition-all duration-300 ${
                      activeModule === i 
                        ? 'bg-white/10 border-accent/50' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${module.color} rounded-lg flex items-center justify-center mx-auto mb-1.5`}>
                      <module.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-white font-bold text-[9px] uppercase tracking-wide text-center leading-tight">{module.name.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Modules Grid - Modern Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#061520]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <BoxesIcon className="w-4 h-4" />
              COMPLETE SUITE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-tight">ALL BUSINESS MODULES</h2>
            <p className="text-white/40 font-light text-lg max-w-2xl mx-auto">
              Everything you need to run your business efficiently
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, i) => (
              <Link 
                key={i}
                href={module.href}
                className="group bg-[#0b2535]/30 border border-white/5 rounded-3xl p-6 hover:border-accent/30 hover:bg-[#0b2535]/60 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${module.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <module.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{module.name}</h3>
                <p className="text-white/40 text-sm mb-5 font-light leading-relaxed">{module.description}</p>
                
                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {module.features.slice(0, 3).map((feature, j) => (
                    <span key={j} className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-white/50 uppercase tracking-wide">
                      {feature}
                    </span>
                  ))}
                </div>
                
                {/* Mini Stats & Link */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-xs text-accent">{module.stat}</span>
                  </div>
                  <span className="text-xs text-white/50 flex items-center gap-1">
                    Learn More <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0b2535]/30 border border-white/5 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  <Puzzle className="w-4 h-4" />
                  INTEGRATIONS
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight">CONNECT EVERYTHING</h2>
                <p className="text-white/50 mb-8 leading-relaxed">
                  LemurSystem integrates seamlessly with your favorite tools and services. 
                  Connect your e-commerce stores, payment gateways, shipping providers, and more.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {integrationHighlights.map((item, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <item.icon className="w-6 h-6 text-accent mb-2" />
                      <div className="text-2xl font-bold text-white">{item.count}</div>
                      <div className="text-xs text-white/40 uppercase">{item.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {modules.map((mod, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 flex flex-col items-center gap-2 border border-white/5 hover:border-accent/30 transition-all">
                    <div className={`w-10 h-10 bg-gradient-to-br ${mod.color} rounded-lg flex items-center justify-center`}>
                      <mod.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] text-white/50 uppercase">{mod.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#061520]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Bot className="w-4 h-4" />
              PLATFORM POWER
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-tight">ENTERPRISE-GRADE FEATURES</h2>
            <p className="text-white/40 font-light text-lg max-w-2xl mx-auto">
              Built for performance, security, and scalability
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature, i) => (
              <div key={i} className="bg-[#0b2535]/30 border border-white/5 rounded-2xl p-6 hover:border-white/20 hover:bg-[#0b2535]/50 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{feature.title}</h3>
                <p className="text-white/40 text-sm font-light mb-3">{feature.desc}</p>
                <div className="inline-block px-2 py-1 bg-accent/10 rounded text-xs text-accent font-medium">
                  {feature.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0b2535] border border-white/10 rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase">
                Ready to Get Started?
              </h2>
              <p className="text-white/40 mb-6 max-w-md mx-auto text-sm">
                Start your free trial today and see how LemurSystem can transform your business.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-medium rounded-lg hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center gap-2">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all">
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
