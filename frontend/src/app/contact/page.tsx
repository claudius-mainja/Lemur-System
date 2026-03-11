'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Send, Loader2, MessageSquare, CheckCircle, MapPin, Phone, Clock, ArrowRight, Sparkles, Hexagon, Circle, Triangle, Menu, X } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  company: z.string().optional(),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactInfo = [
  { icon: Mail, title: 'Email', value: 'support@lemursystem.com', desc: 'We reply within 24 hours', color: 'from-blue-500 to-cyan-500' },
  { icon: Phone, title: 'Phone', value: '+27 10 123 4567', desc: 'Mon-Fri, 9am-6pm SAST', color: 'from-green-500 to-emerald-500' },
  { icon: MapPin, title: 'Location', value: 'Johannesburg, South Africa', desc: 'SADC Headquarters', color: 'from-purple-500 to-pink-500' },
  { icon: Clock, title: 'Hours', value: '24/7 Support', desc: 'Enterprise plans', color: 'from-amber-500 to-orange-500' },
];

const departments = [
  { name: 'Sales', desc: 'Questions about plans and pricing' },
  { name: 'Support', desc: 'Technical help and troubleshooting' },
  { name: 'Partnerships', desc: 'Reseller and integration opportunities' },
  { name: 'Media', desc: 'Press and media inquiries' },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-dark-bg overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] animate-blob"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%)', top: '10%', left: '10%' }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px] animate-blob"
          style={{ background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #ec4899 100%)', bottom: '20%', right: '10%', animationDelay: '2s' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <Hexagon className="absolute top-40 right-40 w-20 h-20 text-blue-500/10 animate-float" />
        <Circle className="absolute bottom-40 left-40 w-16 h-16 text-orange-500/10 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-blue-500 to-accent rounded-2xl flex items-center justify-center animate-float-3d">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <span className="font-bold text-2xl text-white font-serif">LemurSystem</span>
                <p className="text-xs text-dark-text-muted -mt-1">Enterprise ERP</p>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {[
                { name: 'Home', href: '/' },
                { name: 'Features', href: '/features' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Industries', href: '/industries' },
                { name: 'Docs', href: '/docs' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                    item.name === 'Contact' 
                      ? 'text-white bg-white/10' 
                      : 'text-dark-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login" className="px-5 py-2.5 text-dark-text-secondary hover:text-white transition-all duration-300 font-medium">
                Log in
              </Link>
              <Link href="/login" className="px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5">
                Start Free Trial
              </Link>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-dark-text-secondary">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden bg-dark-bg/95 backdrop-blur-xl border-t border-dark-border px-4 py-6 space-y-3">
            {['Home', 'Features', 'Pricing', 'Industries', 'Docs', 'About', 'Contact'].map((item) => (
              <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="block py-3 text-dark-text-secondary hover:text-white">
                {item}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-medium">CONTACT US</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 font-serif">
            Get in Touch
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
              We're Here to Help
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-text-secondary mb-10 leading-relaxed max-w-2xl mx-auto">
            Have questions about LemurSystem? Our team is ready to assist you. 
            Reach out and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <div key={i} className="bg-dark-card/50 border border-dark-border rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mb-4`}>
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">{info.title}</h3>
                <p className="text-blue-400 font-medium text-sm mb-1">{info.value}</p>
                <p className="text-dark-text-muted text-xs">{info.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-dark-card border border-dark-border rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 font-serif">SEND US A MESSAGE</h2>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                  <p className="text-dark-text-secondary mb-6">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setIsSubmitted(false)} className="text-blue-400 hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-dark-text-secondary mb-2">Name *</label>
                      <input 
                        {...register('name')}
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-dark-text-muted focus:outline-none focus:border-blue-500 transition"
                        placeholder="Your name"
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-text-secondary mb-2">Email *</label>
                      <input 
                        {...register('email')}
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-dark-text-muted focus:outline-none focus:border-blue-500 transition"
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Company</label>
                    <input 
                      {...register('company')}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-dark-text-muted focus:outline-none focus:border-blue-500 transition"
                      placeholder="Company name (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Subject *</label>
                    <select 
                      {...register('subject')}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept.name} value={dept.name}>{dept.name} - {dept.desc}</option>
                      ))}
                    </select>
                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Message *</label>
                    <textarea 
                      {...register('message')}
                      rows={5}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-dark-text-muted focus:outline-none focus:border-blue-500 transition resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Departments */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 font-serif">DEPARTMENTS</h2>
              <div className="space-y-4">
                {departments.map((dept, i) => (
                  <div key={i} className="bg-dark-card/50 border border-dark-border rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:-translate-x-1">
                    <h3 className="text-white font-semibold mb-1">{dept.name}</h3>
                    <p className="text-dark-text-muted text-sm">{dept.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-2">Need Immediate Help?</h3>
                <p className="text-dark-text-secondary text-sm mb-4">
                  Check our documentation or start a live chat with our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/docs" className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg text-center hover:bg-blue-600 transition">
                    View Docs
                  </Link>
                  <Link href="/login" className="px-4 py-2 border border-dark-border text-white text-sm font-medium rounded-lg text-center hover:border-white transition">
                    Live Chat
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-serif">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Join thousands of businesses already using LemurSystem
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-bg-secondary border-t border-dark-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl text-white font-serif">LemurSystem</span>
              </div>
              <p className="text-dark-text-muted text-sm">
                Cloud-based ERP solution for SADC businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-dark-text-muted text-sm">
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/industries" className="hover:text-white transition">Industries</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-dark-text-muted text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-dark-text-muted text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-dark-border">
            <p className="text-dark-text-muted text-sm text-center">
              © 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
