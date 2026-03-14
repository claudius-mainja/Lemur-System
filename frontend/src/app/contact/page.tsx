'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Send, Loader2, MessageSquare, CheckCircle, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

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
  { icon: Phone, title: 'Phone', value: '+27 61 580 8228', desc: 'Mon-Fri, 9am-6pm SAST', color: 'from-green-500 to-emerald-500' },
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520] overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%)', top: '10%', left: '10%' }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]"
          style={{ background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #ec4899 100%)', bottom: '20%', right: '10%' }}
        />
      </div>

      <Navbar activePage="contact" />

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] flex items-center">
        <div className="text-center max-w-3xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <MessageSquare className="w-4 h-4 text-accent" />
            <span className="text-white/60 text-xs uppercase">Get in Touch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 uppercase">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark">Us</span>
          </h1>
          <p className="text-base text-white/40 mb-8 max-w-xl mx-auto">
            Have questions about LemurSystem? Our team is here to help you find the right solution for your business.
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
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-serif uppercase">
            Ready to Get Started?
          </h2>
          <p className="text-white/60 text-sm mb-6">
            Join thousands of businesses already using LemurSystem
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/free-trial" className="px-6 py-2.5 bg-white text-accent font-medium rounded-lg hover:bg-white/90 transition flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="px-6 py-2.5 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
