'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Book, ChevronRight, Users, Wallet, Package, BarChart3, PiggyBank, 
  Settings, Shield, Cloud, Zap, Globe, CheckCircle, ArrowRight,
  Menu, X, Printer, Download, Mail, Phone, MapPin, Calendar,
  DollarSign, FileText, Truck, UserCheck, Star, ExternalLink
} from 'lucide-react';

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'features', label: 'Features' },
  { id: 'modules', label: 'Modules' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'user-guide', label: 'User Guide' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'support', label: 'Support' },
];

const features = [
  { icon: Users, title: 'Human Resources', desc: 'Complete employee management system with leave tracking, recruitment, and performance reviews.' },
  { icon: PiggyBank, title: 'Payroll', desc: 'Automated salary processing, tax calculations, and direct deposit management.' },
  { icon: Wallet, title: 'Finance', desc: 'Full accounting suite with invoicing, accounts payable, and financial reports.' },
  { icon: Package, title: 'Supply Chain', desc: 'Inventory management, vendor relationships, and procurement tracking.' },
  { icon: BarChart3, title: 'CRM', desc: 'Lead tracking, customer management, and sales pipeline analytics.' },
  { icon: Shield, title: 'Security', desc: 'Enterprise-grade security with role-based access control and audit logs.' },
];

const modules = [
  {
    title: 'Human Resources',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    features: [
      'Employee Directory - Full employee database with profiles',
      'Leave Management - Request, approve, and track leave',
      'Department Management - Organize teams efficiently',
      'Employee Self-Service - View payslips and details',
      'Resume Upload - Store and manage resumes',
      'ID Card Generation - Print employee ID cards',
    ],
  },
  {
    title: 'Finance',
    icon: Wallet,
    color: 'from-purple-500 to-purple-600',
    features: [
      'Invoice Creation - Professional PDF invoices',
      'Invoice Tracking - Monitor payment status',
      'Accounts Receivable - Track customer payments',
      'Financial Reports - Revenue and expense analytics',
      'CSV Export - Download data for accounting',
    ],
  },
  {
    title: 'Payroll',
    icon: PiggyBank,
    color: 'from-green-500 to-green-600',
    features: [
      'Salary Processing - Calculate monthly payroll',
      'Tax Calculations - Automatic tax deductions',
      'Payment Tracking - Record payment history',
      'Department Breakdown - View costs by department',
      'Payslip Generation - Employee payment records',
    ],
  },
  {
    title: 'Supply Chain',
    icon: Package,
    color: 'from-orange-500 to-orange-600',
    features: [
      'Inventory Management - Track stock levels',
      'Low Stock Alerts - Automatic notifications',
      'Vendor Management - Supplier database',
      'Stock Valuation - Real-time inventory value',
      'Category Organization - Product categorization',
    ],
  },
  {
    title: 'CRM',
    icon: BarChart3,
    color: 'from-pink-500 to-pink-600',
    features: [
      'Customer Database - Full customer profiles',
      'Lead Management - Track potential clients',
      'Sales Pipeline - Visual sales funnel',
      'Source Tracking - Lead source analytics',
      'Customer Cards - Print customer ID cards',
    ],
  },
];

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [printMode, setPrintMode] = useState(false);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl text-slate-900">LemurSystem</span>
              </Link>
              <span className="hidden sm:block px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                Documentation v1.0
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="px-4 py-2 text-slate-600 hover:text-primary font-medium">
                Login
              </Link>
              <Link href="/dashboard/hr" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium">
                Go to Dashboard
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 md:hidden">
          <div className="p-4 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg ${
                  activeSection === section.id 
                    ? 'bg-primary text-white' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex pt-16">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Book className="w-5 h-5 text-primary" />
              <span className="font-semibold text-slate-900">Contents</span>
            </div>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    activeSection === section.id 
                      ? 'bg-primary text-white font-medium' 
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-700 font-medium mb-2">Need Help?</p>
              <p className="text-xs text-blue-600 mb-3">Contact our support team for assistance.</p>
              <a href="mailto:support@lemursystem.com" className="text-xs text-blue-700 underline">
                support@lemursystem.com
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-8 max-w-4xl mx-auto">
          {/* Title Section */}
          <section id="introduction" className="mb-16 scroll-mt-20">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
              <span>Documentation</span>
              <ChevronRight className="w-4 h-4" />
              <span>Version 1.0</span>
            </div>
            
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              LemurSystem ERP Documentation
            </h1>
            
            <div className="flex items-center gap-4 text-slate-600 mb-8">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                <span>Author: Claudius Mainja</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                <span>Blacklemur Innovations</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">All-In-One Business Platform</h2>
              <p className="text-blue-100 mb-6">
                LemurSystem is a comprehensive ERP solution designed to streamline your business operations. 
                Manage HR, Finance, Payroll, Supply Chain, and CRM all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login" className="px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-blue-50">
                  Get Started
                </Link>
                <button onClick={handlePrint} className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Print Documentation
                </button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Modules Section */}
          <section id="modules" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Module Overview</h2>
            <div className="space-y-8">
              {modules.map((module, i) => (
                <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className={`bg-gradient-to-r ${module.color} p-4 text-white`}>
                    <div className="flex items-center gap-3">
                      <module.icon className="w-6 h-6" />
                      <h3 className="text-lg font-semibold">{module.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="grid md:grid-cols-2 gap-3">
                      {module.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Getting Started Section */}
          <section id="getting-started" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Getting Started</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Step 1: Create Your Account</h3>
                <ol className="space-y-3 text-slate-600">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
                    <span>Visit the login page and click "Sign Up"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
                    <span>Enter your organization name and details</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
                    <span>Select your industry type</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">4</span>
                    <span>Choose your pricing plan</span>
                  </li>
                </ol>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Step 2: Industry Selection</h3>
                <p className="text-slate-600 mb-4">
                  Choose your industry to get customized features:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education', 'Logistics', 'Hospitality'].map((industry) => (
                    <div key={industry} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-center">
                      {industry}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Step 3: Pricing Plans</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-900">Starter</h4>
                    <p className="text-2xl font-bold text-primary">$29/mo</p>
                    <p className="text-sm text-slate-500 mt-2">Up to 10 employees</p>
                    <ul className="mt-3 space-y-1 text-sm text-slate-600">
                      <li>• Basic HR</li>
                      <li>• Simple Invoicing</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-primary">
                    <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">Recommended</span>
                    <h4 className="font-medium text-slate-900 mt-2">Professional</h4>
                    <p className="text-2xl font-bold text-primary">$99/mo</p>
                    <p className="text-sm text-slate-500 mt-2">Up to 100 employees</p>
                    <ul className="mt-3 space-y-1 text-sm text-slate-600">
                      <li>• All HR features</li>
                      <li>• Advanced Finance</li>
                      <li>• CRM & Marketing</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-900">Enterprise</h4>
                    <p className="text-2xl font-bold text-primary">$299/mo</p>
                    <p className="text-sm text-slate-500 mt-2">Unlimited employees</p>
                    <ul className="mt-3 space-y-1 text-sm text-slate-600">
                      <li>• Full Suite</li>
                      <li>• Custom Integrations</li>
                      <li>• Dedicated Support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* User Guide Section */}
          <section id="user-guide" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">User Guide</h2>
            
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Human Resources Module
                </h3>
                <div className="space-y-4 text-slate-600">
                  <div>
                    <h4 className="font-medium text-slate-900">Managing Employees</h4>
                    <p className="text-sm mt-1">
                      Add new employees by clicking "Add Employee" in the HR module. 
                      Fill in all required details including personal information, department, position, and salary.
                      You can also upload resumes and print employee ID cards.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Leave Requests</h4>
                    <p className="text-sm mt-1">
                      Employees can submit leave requests through the leave management tab.
                      Managers can approve or reject requests. All leave history is tracked and stored.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Exporting Data</h4>
                    <p className="text-sm mt-1">
                      Export employee lists to CSV for external processing or backup.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-purple-500" />
                  Finance Module
                </h3>
                <div className="space-y-4 text-slate-600">
                  <div>
                    <h4 className="font-medium text-slate-900">Creating Invoices</h4>
                    <p className="text-sm mt-1">
                      Create professional invoices by selecting a customer, adding line items with quantities and prices.
                      The system automatically calculates subtotal, tax, and total.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Invoice PDF Generation</h4>
                    <p className="text-sm mt-1">
                      Click the printer icon on any invoice to generate a professional PDF that can be printed or emailed to customers.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Tracking Payments</h4>
                    <p className="text-sm mt-1">
                      Monitor invoice status: Draft → Sent → Paid. Mark invoices as paid to update accounts receivable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-500" />
                  Supply Chain Module
                </h3>
                <div className="space-y-4 text-slate-600">
                  <div>
                    <h4 className="font-medium text-slate-900">Inventory Management</h4>
                    <p className="text-sm mt-1">
                      Track all inventory items with SKU, quantity, and pricing.
                      Low stock alerts help you maintain optimal inventory levels.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Vendor Management</h4>
                    <p className="text-sm mt-1">
                      Maintain vendor database with contact information, ratings, and order history.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-pink-500" />
                  CRM Module
                </h3>
                <div className="space-y-4 text-slate-600">
                  <div>
                    <h4 className="font-medium text-slate-900">Lead Pipeline</h4>
                    <p className="text-sm mt-1">
                      Track leads through stages: New → Contacted → Qualified → Proposal → Won
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Customer Database</h4>
                    <p className="text-sm mt-1">
                      Full customer profiles with contact information, purchase history, and source tracking.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-green-500" />
                  Payroll Module
                </h3>
                <div className="space-y-4 text-slate-600">
                  <div>
                    <h4 className="font-medium text-slate-900">Processing Payroll</h4>
                    <p className="text-sm mt-1">
                      Select employees and process monthly payroll with automatic tax calculations.
                      Add bonuses, deductions, and benefits.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Payment Records</h4>
                    <p className="text-sm mt-1">
                      Maintain complete payment history for each employee with detailed breakdowns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Profile & Settings */}
          <section className="mb-16 scroll-mt-20">
            <div className="border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-500" />
                Profile & Settings
              </h3>
              <div className="space-y-4 text-slate-600">
                <div>
                  <h4 className="font-medium text-slate-900">Account Settings</h4>
                  <p className="text-sm mt-1">
                    Update your personal information, company details, and notification preferences through the profile page.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Security</h4>
                  <p className="text-sm mt-1">
                    Two-factor authentication is enabled by default. Change your password anytime from settings.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Company Configuration</h4>
                  <p className="text-sm mt-1">
                    Set up company name, email, phone, currency, timezone, and tax rate in the settings.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section id="support" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Support & Contact</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Email Support</h3>
                    <p className="text-sm text-slate-500">24/7 Response Time</p>
                  </div>
                </div>
                <a href="mailto:support@lemursystem.com" className="text-primary hover:underline">
                  support@lemursystem.com
                </a>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Phone Support</h3>
                    <p className="text-sm text-slate-500">Business Hours Only</p>
                  </div>
                </div>
                <p className="text-slate-600">+1 (555) 000-1234</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Website</h3>
                    <p className="text-sm text-slate-500">Learn More</p>
                  </div>
                </div>
                <a href="https://lemursystem.com" className="text-primary hover:underline flex items-center gap-1">
                  www.lemursystem.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Headquarters</h3>
                    <p className="text-sm text-slate-500">New York, USA</p>
                  </div>
                </div>
                <p className="text-slate-600">123 Business Street<br />New York, NY 10001</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-200 pt-8 mt-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="font-semibold text-slate-900">LemurSystem</span>
                <span className="text-slate-500 text-sm">by Blacklemur Innovations</span>
              </div>
              <p className="text-sm text-slate-500">
                © 2026 LemurSystem. All rights reserved. Version 1.0
              </p>
            </div>
            <div className="mt-4 text-center text-xs text-slate-400">
              <p>Documentation authored by Claudius Mainja</p>
              <p className="mt-1">Product of Blacklemur Innovations</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function Building(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}
