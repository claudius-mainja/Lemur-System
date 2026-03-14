'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  BookOpen, Code, Video, MessageCircle, Rocket, Database, Cloud, Shield, Zap, DollarSign, 
  Users, Package, BarChart2, Settings, ArrowRight, ChevronDown, ChevronRight, Menu, X,
  CheckCircle, AlertTriangle, Copy, Terminal, Database as DatabaseIcon, Mail, Globe,
  Smartphone, Lock, CreditCard, BarChart3, FileText, Truck, Calendar, Briefcase, Zap as Lightning
} from 'lucide-react';

const gettingStarted = [
  { title: 'Quick Start Guide', description: 'Get up and running in 5 minutes', icon: Rocket },
  { title: 'Account Setup', description: 'Configure your organization and users', icon: Users },
  { title: 'Basic Concepts', description: 'Understanding modules and workflows', icon: BookOpen },
  { title: 'First Steps', description: 'Create your first employee or invoice', icon: CheckCircle },
];

const modules = [
  { 
    title: 'Human Resources', 
    description: 'Complete HR management solution',
    icon: Users,
    features: [
      'Employee profiles and records',
      'Leave management and tracking',
      'Attendance and time tracking',
      'Performance reviews',
      'Employee self-service portal',
      'Document management'
    ]
  },
  { 
    title: 'Finance', 
    description: 'Comprehensive accounting and financial management',
    icon: DollarSign,
    features: [
      'General ledger and chart of accounts',
      'Accounts payable and receivable',
      'Invoice generation and tracking',
      'Expense management',
      'Financial reporting and analytics',
      'Multi-currency support for SADC'
    ]
  },
  { 
    title: 'CRM', 
    description: 'Customer relationship management',
    icon: BarChart3,
    features: [
      'Lead and opportunity tracking',
      'Contact management',
      'Sales pipeline visualization',
      'Customer communication history',
      'Quote generation',
      'Sales analytics'
    ]
  },
  { 
    title: 'Payroll', 
    description: 'Automated payroll processing',
    icon: CreditCard,
    features: [
      'Salary calculation and processing',
      'Tax compliance (PAYE, SDL, UIF)',
      'Payslip generation',
      'Bank payment processing',
      'Payroll reports',
      'Salary revisions tracking'
    ]
  },
  { 
    title: 'Supply Chain', 
    description: 'Inventory and procurement management',
    icon: Truck,
    features: [
      'Inventory tracking and management',
      'Purchase orders',
      'Vendor management',
      'Stock alerts and reordering',
      'Warehouse management',
      'Supply chain analytics'
    ]
  },
  { 
    title: 'Productivity', 
    description: 'Tools to boost team productivity',
    icon: Zap,
    features: [
      'Task management',
      'Project tracking',
      'Team collaboration',
      'Time tracking',
      'Document sharing',
      'Calendar integration'
    ]
  },
];

const integrations = [
  { name: 'QuickBooks', description: 'Accounting software integration', icon: Database },
  { name: 'Xero', description: 'Cloud accounting platform', icon: Cloud },
  { name: 'Slack', description: 'Team communication', icon: MessageCircle },
  { name: 'Microsoft 365', description: 'Office productivity suite', icon: Briefcase },
  { name: 'WhatsApp Business', description: 'Customer messaging', icon: Smartphone },
  { name: 'Payment Gateways', description: 'Stripe, PayPal, EcoCash', icon: CreditCard },
];

const apiEndpoints = [
  { method: 'GET', path: '/api/v1/employees', description: 'List all employees' },
  { method: 'POST', path: '/api/v1/employees', description: 'Create new employee' },
  { method: 'GET', path: '/api/v1/invoices', description: 'List all invoices' },
  { method: 'POST', path: '/api/v1/invoices', description: 'Create new invoice' },
  { method: 'GET', path: '/api/v1/customers', description: 'List all customers' },
  { method: 'POST', path: '/api/v1/customers', description: 'Create new customer' },
];

const securityFeatures = [
  { title: 'Data Encryption', description: 'All data encrypted at rest and in transit using AES-256', icon: Lock },
  { title: 'Role-Based Access', description: 'Granular permission controls for users', icon: Shield },
  { title: 'Audit Logging', description: 'Complete activity logs for compliance', icon: FileText },
  { title: 'Two-Factor Auth', description: 'Optional 2FA for enhanced security', icon: CheckCircle },
  { title: 'SSO Integration', description: 'Single sign-on with popular providers', icon: Globe },
  { title: 'Backup & Recovery', description: 'Daily automated backups with disaster recovery', icon: DatabaseIcon },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: Rocket },
    { id: 'modules', label: 'Core Modules', icon: Database },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'api', label: 'API Reference', icon: Code },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing & Pricing', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #7e49de 0%, #412576 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="docs" />

      <section className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto w-full mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="text-white/60 text-xs uppercase">Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 uppercase">
            Complete<br />
            <span className="bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark bg-clip-text text-transparent">Reference Guide</span>
          </h1>
          <p className="text-base text-white/40 mb-8 max-w-xl mx-auto">
            Everything you need to know about LemurSystem. Comprehensive guides, API references, and tutorials.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 lg:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex items-center justify-between w-full text-white">
                  <span className="font-medium">Documentation Menu</span>
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
              <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block space-y-1`}>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeSection === section.id
                        ? 'bg-accent text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Getting Started Section */}
            {activeSection === 'getting-started' && (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white uppercase">Getting Started</h2>
                      <p className="text-white/40 text-sm">Begin your journey with LemurSystem</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {gettingStarted.map((item, i) => (
                      <div key={i} className="bg-dark-card/50 border border-dark-border rounded-xl p-5 hover:border-accent/30 transition cursor-pointer">
                        <item.icon className="w-8 h-8 text-accent mb-3" />
                        <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                        <p className="text-white/40 text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-4 uppercase">Quick Start Steps</h3>
                  <div className="space-y-4">
                    {[
                      'Create your account and verify your email',
                      'Set up your organization details and business information',
                      'Add team members and assign roles',
                      'Configure your first module (HR, Finance, or CRM)',
                      'Import existing data or start fresh',
                      'Invite employees or customers to the platform'
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-white/60">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-accentDark via-accent to-primary rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-2 uppercase">Need Help?</h3>
                  <p className="text-white/60 mb-4">Our support team is available 24/7 to assist you</p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/contact" className="px-4 py-2 bg-white text-accent font-medium rounded-lg hover:bg-white/90 transition">
                      Contact Support
                    </Link>
                    <Link href="/free-trial" className="px-4 py-2 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition">
                      Start Free Trial
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Modules Section */}
            {activeSection === 'modules' && (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white uppercase">Core Modules</h2>
                      <p className="text-white/40 text-sm">Comprehensive business management tools</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {modules.map((module, i) => (
                      <div key={i} className="bg-dark-card/50 border border-dark-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                          className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accentDark rounded-lg flex items-center justify-center">
                              <module.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-white font-semibold">{module.title}</h3>
                              <p className="text-white/40 text-sm">{module.description}</p>
                            </div>
                          </div>
                          {expandedModule === i ? <ChevronDown className="w-5 h-5 text-white/60" /> : <ChevronRight className="w-5 h-5 text-white/60" />}
                        </button>
                        {expandedModule === i && (
                          <div className="px-5 pb-5 border-t border-dark-border">
                            <div className="pt-4 grid sm:grid-cols-2 gap-3">
                              {module.features.map((feature, j) => (
                                <div key={j} className="flex items-center gap-2 text-white/60 text-sm">
                                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Section */}
            {activeSection === 'integrations' && (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
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
                      <div key={i} className="bg-dark-card/50 border border-dark-border rounded-xl p-5 hover:border-accent/30 transition">
                        <integration.icon className="w-8 h-8 text-accent mb-3" />
                        <h3 className="text-white font-semibold mb-1">{integration.name}</h3>
                        <p className="text-white/40 text-sm">{integration.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-4 uppercase">Custom Integrations</h3>
                  <p className="text-white/60 mb-4">
                    Need a custom integration? Our API allows you to connect with virtually any service. 
                    Contact our development team for assistance.
                  </p>
                  <Link href="/contact" className="inline-flex items-center gap-2 text-accent hover:underline">
                    Request Custom Integration <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* API Section */}
            {activeSection === 'api' && (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white uppercase">API Reference</h2>
                      <p className="text-white/40 text-sm">Build custom integrations with our REST API</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-dark-bg rounded-xl p-4 font-mono text-sm">
                      <p className="text-white/60 mb-2">Base URL:</p>
                      <p className="text-accent">https://api.lemursystem.com/v1</p>
                    </div>

                    <div className="bg-dark-bg rounded-xl p-4 font-mono text-sm">
                      <p className="text-white/60 mb-2">Authentication:</p>
                      <p className="text-white">Authorization: Bearer YOUR_API_KEY</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-4 uppercase">Available Endpoints</h3>
                  <div className="space-y-3">
                    {apiEndpoints.map((endpoint, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-dark-card/50 border border-dark-border rounded-xl">
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
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white uppercase">Security</h2>
                      <p className="text-white/40 text-sm">How we protect your data</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {securityFeatures.map((feature, i) => (
                      <div key={i} className="bg-dark-card/50 border border-dark-border rounded-xl p-5">
                        <feature.icon className="w-8 h-8 text-accent mb-3" />
                        <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                        <p className="text-white/40 text-sm">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Billing Section */}
            {activeSection === 'billing' && (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accentDark rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white uppercase">Billing & Pricing</h2>
                      <p className="text-white/40 text-sm">Transparent pricing for every business size</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    {[
                      { name: 'Starter', price: 'R199/mo', desc: 'Up to 5 users' },
                      { name: 'Professional', price: 'R499/mo', desc: 'Up to 25 users' },
                      { name: 'Enterprise', price: 'Custom', desc: 'Unlimited users' },
                    ].map((plan, i) => (
                      <div key={i} className="bg-dark-card/50 border border-dark-border rounded-xl p-5 text-center">
                        <h3 className="text-white font-semibold mb-1">{plan.name}</h3>
                        <p className="text-accent text-xl font-bold mb-1">{plan.price}</p>
                        <p className="text-white/40 text-sm">{plan.desc}</p>
                      </div>
                    ))}
                  </div>

                  <Link href="/pricing" className="inline-flex items-center gap-2 text-accent hover:underline">
                    View Full Pricing Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-4 uppercase">Payment Methods</h3>
                  <p className="text-white/60 mb-4">
                    We accept all major credit cards, bank transfers, and mobile payment methods including:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Visa', 'MasterCard', 'American Express', 'Bank Transfer', 'EcoCash', 'M-Pesa'].map((method, i) => (
                      <span key={i} className="px-3 py-1 bg-dark-card border border-dark-border rounded-full text-white/60 text-sm">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
