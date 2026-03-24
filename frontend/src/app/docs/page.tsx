'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  BookOpen, Code, Video, MessageCircle, Rocket, Database, Cloud, Shield, Zap, DollarSign, 
  Users, Package, BarChart2, Settings, ArrowRight, ChevronDown, ChevronUp, ChevronRight, Menu, X,
  CheckCircle, AlertTriangle, Copy, Terminal, DatabaseIcon, Mail, Globe,
  Smartphone, Lock, CreditCard, BarChart3, FileText, Truck, Calendar, Briefcase,
  Play, Clock, Target, Lightbulb, Wrench, Book, GraduationCap, Phone
} from 'lucide-react';

const gettingStarted = [
  { 
    title: 'Quick Start Guide', 
    description: 'Get up and running in 5 minutes with our step-by-step tutorial', 
    icon: Rocket,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
  },
  { 
    title: 'Account Setup', 
    description: 'Configure your organization, settings, and user permissions', 
    icon: Settings,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
  },
  { 
    title: 'Core Concepts', 
    description: 'Understanding modules, workflows, and data relationships', 
    icon: Lightbulb,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop',
  },
  { 
    title: 'First Steps', 
    description: 'Create your first employee, invoice, or customer record', 
    icon: Target,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
  },
];

const moduleGuides = [
  { 
    title: 'Human Resources', 
    description: 'Complete HR management with employee records, leave tracking, attendance, and performance reviews.',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Employee profiles and records management',
      'Leave management and approval workflows',
      'Attendance and time tracking',
      'Performance reviews and goal setting',
      'Employee self-service portal',
      'Document management and contracts',
      'Recruitment and applicant tracking',
      'Training and certification tracking',
    ],
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=250&fit=crop',
  },
  { 
    title: 'Finance & Accounting', 
    description: 'Comprehensive accounting with invoicing, expenses, and financial reporting.',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    features: [
      'Chart of accounts and general ledger',
      'Accounts payable and receivable',
      'Invoice generation and tracking',
      'Expense management and receipts',
      'Financial reporting and analytics',
      'Multi-currency support for SADC',
      'Budget management and tracking',
      'Tax configuration and compliance',
    ],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
  },
  { 
    title: 'Customer Relationship Management', 
    description: 'Build stronger customer relationships with lead tracking and sales management.',
    icon: BarChart3,
    color: 'from-violet-500 to-purple-500',
    features: [
      'Lead capture and qualification',
      'Sales pipeline visualization',
      'Contact management and history',
      'Quote and proposal generation',
      'Email campaigns and tracking',
      'Customer segmentation',
      'Sales forecasting',
      'Integration with marketing automation',
    ],
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop',
  },
  { 
    title: 'Payroll', 
    description: 'Automated payroll processing with tax compliance for SADC countries.',
    icon: CreditCard,
    color: 'from-orange-500 to-amber-500',
    features: [
      'Salary calculation and processing',
      'Tax compliance (PAYE, SDL, UIF)',
      'Payslip generation and distribution',
      'Bank payment processing',
      'Payroll reports and analytics',
      'Salary revisions tracking',
      'Leave encashment calculations',
      'Year-end tax certificates',
    ],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
  },
  { 
    title: 'Supply Chain & Inventory', 
    description: 'End-to-end inventory and procurement management.',
    icon: Truck,
    color: 'from-indigo-500 to-violet-500',
    features: [
      'Multi-warehouse inventory tracking',
      'Purchase orders and supplier management',
      'Stock alerts and reorder points',
      'Barcode scanning support',
      'Vendor performance tracking',
      'Delivery tracking',
      'Stock valuation methods',
      'Supply chain analytics',
    ],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop',
  },
  { 
    title: 'Productivity Suite', 
    description: 'Tools to boost team collaboration and efficiency.',
    icon: Zap,
    color: 'from-cyan-500 to-blue-500',
    features: [
      'Task and project management',
      'Team calendar and scheduling',
      'Document collaboration',
      'Real-time team chat',
      'Time tracking and billing',
      'File sharing and versioning',
      'Meeting scheduling',
      'Wiki and knowledge base',
    ],
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=250&fit=crop',
  },
];

const integrations = [
  { name: 'QuickBooks', description: 'Sync accounting data automatically', icon: Database, connected: true },
  { name: 'Xero', description: 'Cloud accounting integration', icon: Cloud, connected: true },
  { name: 'Slack', description: 'Team notifications and alerts', icon: MessageCircle, connected: true },
  { name: 'Microsoft 365', description: 'Office productivity suite', icon: Briefcase, connected: true },
  { name: 'WhatsApp Business', description: 'Customer messaging', icon: Smartphone, connected: false },
  { name: 'PayPal', description: 'Payment processing', icon: CreditCard, connected: true },
  { name: 'EcoCash', description: 'Mobile money (Zimbabwe)', icon: Smartphone, connected: false },
  { name: 'M-Pesa', description: 'Mobile money (Kenya/Tanzania)', icon: Smartphone, connected: false },
  { name: 'Stripe', description: 'Online payments', icon: CreditCard, connected: false },
];

const apiEndpoints = [
  { method: 'GET', path: '/api/v1/employees/', description: 'List all employees with pagination', status: 'stable' },
  { method: 'POST', path: '/api/v1/employees/', description: 'Create a new employee record', status: 'stable' },
  { method: 'GET', path: '/api/v1/invoices/', description: 'List all invoices with filters', status: 'stable' },
  { method: 'POST', path: '/api/v1/invoices/', description: 'Create and send an invoice', status: 'stable' },
  { method: 'GET', path: '/api/v1/customers/', description: 'List all CRM contacts', status: 'stable' },
  { method: 'POST', path: '/api/v1/payroll/run/', description: 'Execute payroll processing', status: 'beta' },
];

const securityFeatures = [
  { title: 'Data Encryption', description: 'AES-256 encryption at rest and in transit', icon: Lock, verified: true },
  { title: 'Role-Based Access', description: 'Granular permissions for users and teams', icon: Shield, verified: true },
  { title: 'Audit Logging', description: 'Complete activity logs for compliance', icon: FileText, verified: true },
  { title: 'Two-Factor Auth', description: 'Optional 2FA for enhanced account security', icon: Lock, verified: true },
  { title: 'SSO Integration', description: 'SAML/OIDC single sign-on support', icon: Globe, verified: false },
  { title: 'Backup & Recovery', description: 'Daily automated backups, 30-day retention', icon: DatabaseIcon, verified: true },
];

const videoTutorials = [
  { title: 'Getting Started with LemurSystem', duration: '5:30', thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=180&fit=crop' },
  { title: 'Setting Up Your First Module', duration: '8:45', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=180&fit=crop' },
  { title: 'Managing Employees', duration: '12:20', thumbnail: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&h=180&fit=crop' },
  { title: 'Creating Invoices', duration: '6:15', thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=180&fit=crop' },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: Rocket },
    { id: 'modules', label: 'Module Guides', icon: Book },
    { id: 'videos', label: 'Video Tutorials', icon: Video },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'api', label: 'API Reference', icon: Code },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #7e49de 0%, #412576 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="docs" />

      {/* Hero Section - Match About Page Style */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-accent" />
              <span className="text-white/60 text-xs uppercase tracking-wider">Documentation</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase">
              EVERYTHING YOU NEED TO
              <br />
              <span className="bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark bg-clip-text text-transparent">
                SUCCEED WITH LEMURSYSTEM
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Comprehensive guides, video tutorials, API documentation, and expert tips 
              to help you get the most out of your LemurSystem experience.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-medium rounded-lg hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Get Support
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">Guides</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">20+</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">Video Tutorials</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">Support</div>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accentDark rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-[#061c26] px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span className="text-xs text-white font-medium">Documentation Index</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                {sections.map((section, i) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activeSection === section.id 
                        ? 'bg-accent/20 text-accent border border-accent/30' 
                        : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{section.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Getting Started Section */}
        {activeSection === 'getting-started' && (
          <div className="space-y-8">
            {/* Quick Start Cards */}
            <div className="bg-[#0b2535]/50 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white uppercase">Getting Started</h2>
                  <p className="text-white/40 text-sm">Begin your journey with LemurSystem</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {gettingStarted.map((item, i) => (
                  <div key={i} className="bg-[#061c26] border border-white/5 rounded-xl overflow-hidden hover:border-accent/30 transition cursor-pointer group">
                    <img src={item.image} alt={item.title} className="w-full h-24 object-cover opacity-70 group-hover:opacity-100 transition" />
                    <div className="p-4">
                      <item.icon className="w-6 h-6 text-accent mb-2" />
                      <h3 className="text-white font-semibold mb-1 text-sm">{item.title}</h3>
                      <p className="text-white/40 text-xs">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Start Steps */}
            <div className="bg-[#0b2535]/50 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 uppercase">Quick Start Steps</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { step: 1, title: 'Create Your Account', desc: 'Sign up with your email and verify your account. No credit card required for the trial.' },
                  { step: 2, title: 'Set Up Organization', desc: 'Add your business details, logo, and configure your currency and tax settings.' },
                  { step: 3, title: 'Add Team Members', desc: 'Invite your team and assign roles based on their responsibilities.' },
                  { step: 4, title: 'Configure Modules', desc: 'Set up your first module - HR, Finance, CRM, or any that fits your needs.' },
                  { step: 5, title: 'Import or Add Data', desc: 'Import existing data from spreadsheets or add records directly.' },
                  { step: 6, title: 'Go Live!', desc: 'Start using LemurSystem and explore additional modules as needed.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent/20 text-accent rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{item.step}</div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{item.title}</h4>
                      <p className="text-white/40 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gradient-to-r from-accentDark via-accent to-primary rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 uppercase">Need Help Getting Started?</h3>
                  <p className="text-white/60">Our support team is available 24/7 to assist you</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact" className="px-6 py-3 bg-white text-accent font-medium rounded-lg hover:bg-white/90 transition flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contact Support
                  </Link>
                  <Link href="/free-trial" className="px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modules Section */}
        {activeSection === 'modules' && (
          <div className="space-y-8">
            <div className="bg-[#0b2535]/50 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white uppercase">Module Guides</h2>
                  <p className="text-white/40 text-sm">In-depth tutorials for each business module</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {moduleGuides.map((module, i) => (
                  <div key={i} className="bg-[#061c26] border border-white/5 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition"
                    >
                      <div className="flex items-center gap-4">
                        <img src={module.image} alt={module.title} className="w-16 h-12 object-cover rounded-lg" />
                        <div className="text-left">
                          <h3 className="text-white font-semibold">{module.title}</h3>
                          <p className="text-white/40 text-sm">{module.description}</p>
                        </div>
                      </div>
                      {expandedModule === i ? <ChevronUp className="w-5 h-5 text-white/60" /> : <ChevronDown className="w-5 h-5 text-white/60" />}
                    </button>
                    {expandedModule === i && (
                      <div className="px-5 pb-5 border-t border-white/5">
                        <div className="pt-4 grid sm:grid-cols-2 gap-3">
                          {module.features.map((feature, j) => (
                            <div key={j} className="flex items-center gap-2 text-white/60 text-sm">
                              <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex gap-3">
                          <Link href={`/features#${module.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-accent text-sm hover:underline flex items-center gap-1">
                            Learn More <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Videos Section */}
        {activeSection === 'videos' && (
          <div className="space-y-8">
            <div className="bg-[#0b2535]/50 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white uppercase">Video Tutorials</h2>
                  <p className="text-white/40 text-sm">Step-by-step visual guides</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {videoTutorials.map((video, i) => (
                  <div key={i} className="bg-[#061c26] border border-white/5 rounded-xl overflow-hidden hover:border-accent/30 transition cursor-pointer group">
                    <div className="relative">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-32 object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                          <Play className="w-5 h-5 text-gray-900 ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-[10px] text-white">{video.duration}</div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-white text-sm font-medium">{video.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Integrations Section */}
        {activeSection === 'integrations' && (
          <div className="space-y-8">
            <div className="bg-[#0b2535]/50 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-accentDark to-accent rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white uppercase">Integrations</h2>
                  <p className="text-white/40 text-sm">Connect with your favorite tools</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.map((integration, i) => (
                  <div key={i} className={`bg-[#061c26] border rounded-xl p-5 transition ${integration.connected ? 'border-white/5 hover:border-accent/30' : 'border-amber-500/20'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <integration.icon className="w-8 h-8 text-accent" />
                      {integration.connected ? (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase rounded-full">Connected</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase rounded-full">Coming Soon</span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold mb-1">{integration.name}</h3>
                    <p className="text-white/40 text-sm">{integration.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Wrench className="w-5 h-5 text-accent" />
                  <h3 className="text-white font-semibold">Need a Custom Integration?</h3>
                </div>
                <p className="text-white/50 text-sm mb-4">
                  Don't see your preferred tool? Our API allows you to connect with virtually any service. Contact our development team for assistance.
                </p>
                <Link href="/contact" className="text-accent text-sm hover:underline flex items-center gap-1">
                  Request Custom Integration <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* API Section */}
        {activeSection === 'api' && (
          <div className="space-y-8">
            <div className="bg-[#0b2535]/50 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white uppercase">API Reference</h2>
                  <p className="text-white/40 text-sm">Build custom integrations with our REST API</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-[#061c26] rounded-xl p-4">
                  <p className="text-white/40 text-sm mb-2">Base URL:</p>
                  <code className="text-accent font-mono">https://api.lemursystem.com/v1</code>
                </div>

                <div className="bg-[#061c26] rounded-xl p-4">
                  <p className="text-white/40 text-sm mb-2">Authentication:</p>
                  <code className="text-white font-mono">Authorization: Bearer YOUR_API_KEY</code>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-4 uppercase">Available Endpoints</h3>
              <div className="space-y-3">
                {apiEndpoints.map((endpoint, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-[#061c26] border border-white/5 rounded-xl">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                      endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                      endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-white flex-1 font-mono text-sm">{endpoint.path}</code>
                    <span className="text-white/40 text-sm">{endpoint.description}</span>
                    {endpoint.status === 'beta' && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase rounded-full">Beta</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Section */}
        {activeSection === 'security' && (
          <div className="space-y-8">
            <div className="bg-[#0b2535]/50 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white uppercase">Security</h2>
                  <p className="text-white/40 text-sm">How we protect your data</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {securityFeatures.map((feature, i) => (
                  <div key={i} className="bg-[#061c26] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <feature.icon className="w-8 h-8 text-accent" />
                      {feature.verified && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-white/40 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-[#061c26] border border-white/5 rounded-xl">
                <h3 className="text-white font-semibold mb-3">Compliance Certifications</h3>
                <div className="flex flex-wrap gap-3">
                  {['SOC 2 Type II', 'GDPR Compliant', 'ISO 27001', 'PCI DSS Level 1'].map((cert, i) => (
                    <span key={i} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">{cert}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
