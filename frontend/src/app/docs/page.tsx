'use client';

import { useState } from 'react';
import { ArrowRight, Check, Book, Code, Database, Cloud, Shield, Zap, Rocket, FileText, Video, MessageCircle, Mail, Hexagon, Circle, ChevronRight, Menu, X, Search, BookOpen, Users, CreditCard, Wallet, Package, Truck, BarChart2, Settings, Lock, Globe, FileCheck, HelpCircle, Play, Download, ExternalLink, Cpu, Link2, Server, Smartphone, Mail as MailIcon, Clock, Star, ArrowUpRight, Layers, Workflow, PieChart, Target, TrendingUp, Calendar, FileSearch, UserCheck, Briefcase, DollarSign } from 'lucide-react';

const docsSections = [
  {
    title: 'GETTING STARTED',
    icon: Rocket,
    color: 'from-blue-500 to-blue-600',
    content: `Welcome to LemurSystem! This section will guide you through the initial setup and configuration of your ERP system.

## Quick Start Guide
1. Create your account at lemursystem.com
2. Verify your email address
3. Complete company profile setup
4. Add team members and assign roles
5. Configure modules based on your needs

## Installation
LemurSystem is a cloud-based solution requiring no installation. Simply access it through any modern web browser or download our mobile apps for iOS and Android.

## Basic Concepts
- **Workspaces**: Organized containers for different departments or projects
- **Modules**: Individual functional areas (HR, Finance, CRM, etc.)
- **Workflows**: Automated business processes
- **Integrations**: Connect with external tools and services

## First Steps
After initial setup, we recommend:
1. Configuring your company profile
2. Setting up user roles and permissions
3. Importing existing data
4. Creating your first workflow
5. Training your team

## Account Setup
Your account includes:
- Company profile management
- Multiple workspace support
- Custom branding options
- Backup and recovery
- 24/7 technical support

## User Management
Manage users with granular permissions:
- Role-based access control
- Department assignments
- Activity logging
- Multi-factor authentication
- Single sign-on (SSO) support`
  },
  {
    title: 'CORE MODULES',
    icon: Database,
    color: 'from-blue-600 to-cyan-500',
    content: `LemurSystem offers comprehensive modules for all your business needs.

## HR Management
The HR module provides complete employee lifecycle management:

**Features:**
- Employee database with profiles
- Leave management and approvals
- Recruitment and onboarding
- Performance reviews
- Time and attendance tracking
- Document management
- Benefits administration
- Compliance reporting

**Benefits:**
- 50% reduction in administrative time
- Improved employee experience
- Better compliance management
- Data-driven HR decisions

## Finance & Accounting
Complete financial management solution:

**Features:**
- General ledger
- Accounts payable/receivable
- Invoicing and billing
- Expense management
- Asset tracking
- Budget management
- Financial reporting
- Multi-currency support

**SADC Support:**
- Zambia (ZMW)
- South Africa (ZAR)
- Botswana (BWP)
- Namibia (NAD)
- And 8 more SADC currencies

## CRM
Build stronger customer relationships:

**Features:**
- Lead management
- Contact database
- Sales pipeline
- Email integration
- Marketing automation
- Customer segmentation
- Activity tracking
- Sales forecasting

## Payroll
Streamlined payroll processing:

**Features:**
- Salary calculations
- Tax compliance
- Payslip generation
- Direct deposit
- Payroll reports
- Multiple pay schedules
- Deductions management
- Year-end processing

## Inventory
Complete inventory control:

**Features:**
- Stock tracking
- Multi-warehouse support
- Batch and serial numbers
- Reorder points
- Barcode scanning
- Stock alerts
- Inventory reports
- Integration with purchasing

## Supply Chain
End-to-end supply chain management:

**Features:**
- Purchase orders
- Vendor management
- Supplier portals
- Delivery tracking
- Quality control
- Cost analysis
- Demand planning
- Logistics coordination`
  },
  {
    title: 'INTEGRATIONS',
    icon: Code,
    color: 'from-orange-500 to-orange-600',
    content: `Extend LemurSystem with powerful integrations.

## API Reference
Our RESTful API allows developers to:
- Access all modules programmatically
- Create custom integrations
- Build new functionality
- Automate workflows
- Sync data in real-time

**Base URL:** api.lemursystem.com/v1

**Authentication:**
- API Keys
- OAuth 2.0
- JWT Tokens

## Webhooks
Receive real-time notifications for:
- New leads created
- Invoice status changes
- Employee updates
- Inventory alerts
- Custom events

## Third-Party Apps
Pre-built integrations with:
- Microsoft 365
- Google Workspace
- Slack
- Zoom
- QuickBooks
- Xero
- Shopify
- WooCommerce

## Custom Development
Build custom solutions:
- Custom modules
- Branded portals
- Mobile apps
- Industry-specific features
- Workflow builders

## REST API
Complete REST API coverage:
- CRUD operations
- Batch processing
- File uploads
- Pagination
- Filtering
- Sorting

## GraphQL
Alternative API option:
- Flexible queries
- Real-time subscriptions
- Type-safe responses
- Reduced payload size`
  },
  {
    title: 'SECURITY',
    icon: Shield,
    color: 'from-orange-600 to-amber-500',
    content: `Enterprise-grade security for your data.

## Authentication
Secure access to your account:
- Multi-factor authentication (MFA)
- Single sign-on (SSO)
- Password policies
- Session management
- Device management
- Biometric login (mobile)

## Permissions
Granular access control:
- Role-based access control (RBAC)
- Custom roles
- Department-level permissions
- Field-level security
- Record-level access
- Audit trails

## Data Encryption
Protect your data at all levels:
- AES-256 encryption at rest
- TLS 1.3 in transit
- Field-level encryption
- Key management
- Data masking
- Secure backups

## Compliance
Meet regulatory requirements:
- GDPR compliance
- POPIA (South Africa)
- Data residency options
- Privacy controls
- Right to deletion
- Data portability

## SSO Setup
Enterprise single sign-on:
- SAML 2.0
- OAuth 2.0 / OpenID Connect
- Active Directory integration
- Okta integration
- Azure AD support
- Custom IdP support`
  },
  {
    title: 'REPORTS',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    content: `Powerful reporting and analytics.

## Financial Reports
Comprehensive financial insights:
- Balance sheets
- Profit & Loss statements
- Cash flow statements
- Trial balance
- General ledger
- Accounts aging
- Budget vs Actual
- Custom financial reports

## HR Reports
People analytics:
- Headcount reports
- Turnover analysis
- Leave balances
- Attendance reports
- Salary analysis
- Benefits utilization
- Diversity metrics
- Training compliance

## Custom Reports
Build your own reports:
- Drag-and-drop builder
- Custom calculations
- Conditional formatting
- Charts and graphs
- Scheduled reports
- Email delivery
- Export options

## Analytics
Data-driven insights:
- Real-time dashboards
- Trend analysis
- Forecasting
- Benchmarking
- KPI tracking
- Custom metrics
- drill-down analysis

## Dashboards
Visual dashboards for:
- Executive overview
- Department views
- Role-specific dashboards
- Custom widgets
- Interactive charts
- Mobile-optimized

## Export Options
Flexible export formats:
- PDF
- Excel
- CSV
- Word
- PowerPoint
- API access
- Scheduled exports`
  },
  {
    title: 'SUPPORT',
    icon: MessageCircle,
    color: 'from-orange-500 to-orange-600',
    content: `We're here to help you succeed.

## Help Center
Self-service resources:
- Knowledge base
- Video tutorials
- User guides
- Best practices
- FAQ section
- Community forums
- Webinars
- Product updates

## Video Tutorials
Learn with visual guides:
- Getting started series
- Module deep-dives
- Feature highlights
- Tips and tricks
- Advanced features
- Integration guides
- Mobile app tutorials

## Contact Support
Get help when you need it:
- Email support
- Live chat
- Phone support
- Priority support
- Dedicated account manager
- Onboarding assistance
- Technical support

## Community Forum
Connect with other users:
- Discussion boards
- Feature requests
- User tips
- Success stories
- Beta testing
- Product feedback

## Training
Comprehensive learning:
- Online academy
- Certification programs
- On-site training
- Webinars
- Documentation
- Getting started guides
- Advanced courses

## FAQs
Common questions answered:
- Account & Billing
- Technical Issues
- Features & Pricing
- Security & Compliance
- Integrations
- Data & Storage`
  },
];

const features = [
  { icon: Rocket, title: 'Quick Setup', desc: 'Get started in minutes, not days' },
  { icon: Shield, title: 'Secure', desc: 'Enterprise-grade security' },
  { icon: Cloud, title: 'Cloud-Based', desc: 'Access anywhere, anytime' },
  { icon: Users, title: 'Team Collaboration', desc: 'Work together seamlessly' },
];

const stats = [
  { value: '50+', label: 'ARTICLES' },
  { value: '24/7', label: 'SUPPORT' },
  { value: '99.9%', label: 'UPTIME' },
  { value: '5K+', label: 'USERS' },
];

export default function DocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState(0);

  const filteredSections = docsSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #f97316 100%)', top: '10%', left: '10%' }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]"
          style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #f59e0b 100%)', bottom: '20%', right: '10%' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <span className="font-bold text-2xl text-white font-serif">LemurSystem</span>
                <p className="text-xs text-slate-400 -mt-1">Enterprise ERP</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              {[
                { name: 'HOME', href: '/' },
                { name: 'FEATURES', href: '/features' },
                { name: 'PRICING', href: '/pricing' },
                { name: 'INDUSTRIES', href: '/industries' },
                { name: 'DOCS', href: '/docs' },
                { name: 'ABOUT', href: '/about' },
                { name: 'CONTACT', href: '/contact' },
              ].map((item) => (
                <a 
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                    item.name === 'DOCS' 
                      ? 'text-white bg-white/10' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <a href="/login" className="px-5 py-2.5 text-slate-400 hover:text-white transition-all duration-300 font-medium">
                Log in
              </a>
              <a href="/login" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5">
                Start Free Trial
              </a>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-400">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-4 py-6 space-y-3">
            {['Home', 'Features', 'Pricing', 'Industries', 'Docs', 'About', 'Contact'].map((item) => (
              <a key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="block py-3 text-slate-400 hover:text-white">
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm mb-8">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-medium">DOCUMENTATION</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 font-serif uppercase">
            COMPLETE
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent">
              REFERENCE GUIDE
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about LemurSystem. Comprehensive guides, tutorials, and references for all modules and features.
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-serif">
              DOCUMENTATION SECTIONS
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Click on any section to explore detailed documentation
            </p>
          </div>

          <div className="space-y-4">
            {filteredSections.map((section, index) => (
              <div 
                key={index}
                className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === index ? -1 : index)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center`}>
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                  </div>
                  <ChevronRight className={`w-6 h-6 text-slate-400 transition-transform ${expandedSection === index ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === index && (
                  <div className="px-6 pb-6 border-t border-slate-700">
                    <div className="pt-6">
                      <div className="prose prose-invert max-w-none">
                        {section.content.split('\n').map((line, i) => {
                          if (line.startsWith('## ')) {
                            return <h3 key={i} className="text-xl font-bold text-white mt-6 mb-3">{line.replace('## ', '')}</h3>;
                          }
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <p key={i} className="text-orange-400 font-semibold my-2">{line.replace(/\*\*/g, '')}</p>;
                          }
                          if (line.startsWith('- ')) {
                            return <li key={i} className="text-slate-300 ml-4">{line.replace('- ', '')}</li>;
                          }
                          if (line.match(/^\d+\./)) {
                            return <li key={i} className="text-slate-300 ml-4 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
                          }
                          if (line.trim() === '') {
                            return <br key={i} />;
                          }
                          return <p key={i} className="text-slate-300 my-1">{line}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-serif">
              QUICK LINKS
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center hover:border-blue-500/30 transition-all">
              <Play className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Video Tutorials</h3>
              <p className="text-slate-400 mb-4">Watch step-by-step guides to get started quickly</p>
              <span className="text-blue-400 text-sm font-medium">Coming Soon</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center hover:border-orange-500/30 transition-all">
              <Download className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Download Guides</h3>
              <p className="text-slate-400 mb-4">PDF guides for offline reading and reference</p>
              <span className="text-orange-400 text-sm font-medium">Coming Soon</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center hover:border-cyan-500/30 transition-all">
              <HelpCircle className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">FAQs</h3>
              <p className="text-slate-400 mb-4">Answers to the most commonly asked questions</p>
              <span className="text-cyan-400 text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-serif">
            NEED MORE HELP?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Can't find what you're looking for? Our support team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/contact" className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center gap-2">
              Contact Support <Mail className="w-5 h-5" />
            </a>
            <a href="/login" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300">
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl text-white font-serif">LemurSystem</span>
              </div>
              <p className="text-slate-400 text-sm">
                Cloud-based ERP solution for SADC businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="/features" className="hover:text-white transition">Features</a></li>
                <li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="/industries" className="hover:text-white transition">Industries</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="/about" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
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
