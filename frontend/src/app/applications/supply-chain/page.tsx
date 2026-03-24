'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Package, ArrowRight, Check, ChevronRight, TrendingUp, Shield,
  Truck, Warehouse, ShoppingCart, BarChart3, Building2, CheckCircle2
} from 'lucide-react';

const features = [
  {
    title: 'Inventory Management',
    description: 'Track stock levels across multiple warehouses',
    icon: Package,
    items: ['Multi-warehouse tracking', 'Stock valuations', 'Batch tracking', 'Serial number management', 'Inventory reports']
  },
  {
    title: 'Purchase Orders',
    description: 'Create and manage purchase orders with vendors',
    icon: ShoppingCart,
    items: ['PO creation', 'Vendor approval workflow', 'Order tracking', 'Partial receiving', 'PO history']
  },
  {
    title: 'Vendor Management',
    description: 'Manage vendor relationships and performance',
    icon: Truck,
    items: ['Vendor database', 'Performance ratings', 'Contract management', 'Vendor portal', 'Payment terms']
  },
  {
    title: 'Stock Alerts',
    description: 'Automated alerts for low stock levels',
    icon: BarChart3,
    items: ['Low stock notifications', 'Reorder alerts', 'Expiry warnings', 'Custom thresholds', 'Email alerts']
  },
  {
    title: 'Warehouse Management',
    description: 'Complete warehouse management and tracking',
    icon: Warehouse,
    items: ['Bin locations', 'Pick and pack', 'Stock transfers', 'Cycle counting', 'Warehouse reports']
  },
  {
    title: 'Reorder Points',
    description: 'Automatic reorder suggestions based on demand',
    icon: TrendingUp,
    items: ['Demand forecasting', 'Safety stock', 'Auto-reorder rules', 'Vendor lead times', 'Purchase suggestions']
  }
];

const stats = [
  { value: '35%', label: 'Reduce Stockouts', icon: Package },
  { value: '25%', label: 'Lower Carrying Costs', icon: Warehouse },
  { value: '50%', label: 'Faster Fulfillment', icon: Truck },
  { value: '100%', label: 'Traceability', icon: Shield },
];

const benefits = [
  { title: 'Real-time Visibility', desc: 'Track inventory across all warehouses in real-time with instant updates and alerts' },
  { title: 'Automated Reordering', desc: 'Set reorder points and let the system automatically generate purchase orders when stock is low' },
  { title: 'Barcode Scanning', desc: 'Speed up receiving, picking, and counting with barcode scanner integration' },
  { title: 'Multi-location Support', desc: 'Manage inventory across multiple warehouses and store locations seamlessly' },
];

export default function SupplyChainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0b2f40 100%)', top: '10%', right: '10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ background: 'linear-gradient(135deg, #0b2f40 0%, #184250 50%, #7e49de 100%)', bottom: '20%', left: '10%' }} />
      </div>

      <Navbar activePage="applications" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
              <Package className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-xs uppercase tracking-wider">Supply Chain Module</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase">
              OPTIMIZE YOUR
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
                SUPPLY CHAIN
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              End-to-end inventory and procurement control. Manage your entire supply chain 
              from procurement to delivery with real-time visibility and automated processes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium rounded-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all">
                Schedule Demo
              </Link>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Inventory Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Purchase Orders</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Vendor Management</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Stock Alerts</span>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop"
                alt="Supply Chain Management"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 space-y-3">
                {/* Mini Dashboard */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Inventory Overview</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">4,520</div>
                      <div className="text-[9px] text-white/40">SKUs</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-amber-400">12</div>
                      <div className="text-[9px] text-white/40">Low Stock</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-cyan-400">3</div>
                      <div className="text-[9px] text-white/40">Warehouses</div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-[#061c26] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-2">Pending Orders</div>
                  <div className="space-y-2">
                    {[
                      { id: 'PO-2024-156', vendor: 'Tech Supplies Ltd', amount: 'R45,000', status: 'Pending' },
                      { id: 'PO-2024-157', vendor: 'Office World', amount: 'R12,500', status: 'Approved' },
                      { id: 'PO-2024-158', vendor: 'Industrial Parts Co', amount: 'R78,200', status: 'Processing' },
                    ].map((order, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <div className="text-white text-xs">{order.vendor}</div>
                          <div className="text-white/40 text-[9px]">{order.id}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 text-xs">{order.amount}</div>
                          <div className="text-white/40 text-[9px]">{order.status}</div>
                        </div>
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
                  <div className="text-xs font-bold text-white">+35%</div>
                  <div className="text-[10px] text-emerald-400">Less Stockouts</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Warehouse className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Real-time</div>
                  <div className="text-[10px] text-cyan-400">Inventory Sync</div>
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
                <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
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
              POWERFUL SUPPLY CHAIN FEATURES
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Everything you need to manage your supply chain efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#0b2a38]/50 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/60">
                      <Check className="w-3 h-3 text-cyan-400 flex-shrink-0" />
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
                WHY CHOOSE OUR SUPPLY CHAIN MODULE?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4 bg-[#0b2a38]/50 border border-white/10 rounded-xl p-5">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-cyan-400" />
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
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=500&fit=crop"
                alt="Supply Chain"
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
          <div className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-teal-500 rounded-2xl p-10 text-center relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=400&fit=crop"
              alt="Supply Chain"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase">
                READY TO OPTIMIZE SUPPLY CHAIN?
              </h2>
              <p className="text-white/80 text-sm mb-6 max-w-lg mx-auto">
                Join hundreds of companies using LemurSystem Supply Chain to manage their operations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/free-trial" className="px-8 py-3 bg-white text-cyan-600 font-medium rounded-lg hover:bg-white/90 transition flex items-center gap-2">
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
