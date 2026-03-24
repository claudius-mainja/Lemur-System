'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Mail, Send, Loader2, MessageSquare, CheckCircle, MapPin, Phone, Clock, 
  ArrowRight, Users, HeadphonesIcon, Briefcase, Handshake, Zap, Building2,
  MessageCircle, Video, Calendar, User
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  company: z.string().optional(),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactInfo = [
  { icon: Mail, title: 'Email Support', value: 'support@lemursystem.com', desc: 'We reply within 24 hours', color: 'from-blue-500 to-cyan-500', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop' },
  { icon: Phone, title: 'Phone', value: '+27 61 580 8228', desc: 'Mon-Fri, 9am-6pm SAST', color: 'from-green-500 to-emerald-500', image: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=400&h=300&fit=crop' },
  { icon: MapPin, title: 'Location', value: 'Johannesburg, South Africa', desc: 'SADC Headquarters', color: 'from-purple-500 to-pink-500', image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400&h=300&fit=crop' },
  { icon: Clock, title: 'Support Hours', value: '24/7 Enterprise Support', desc: 'For enterprise customers', color: 'from-amber-500 to-orange-500', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=300&fit=crop' },
];

const departments = [
  { name: 'Sales Team', desc: 'Questions about plans, pricing, and demos', icon: Building2, color: 'from-blue-500 to-cyan-500' },
  { name: 'Technical Support', desc: 'Help with setup, integration, and troubleshooting', icon: HeadphonesIcon, color: 'from-emerald-500 to-teal-500' },
  { name: 'Partnerships', desc: 'Reseller programs and integration partnerships', icon: Handshake, color: 'from-purple-500 to-pink-500' },
  { name: 'Media & Press', desc: 'Press inquiries and media coverage', icon: MessageSquare, color: 'from-amber-500 to-orange-500' },
];

const contactMethods = [
  { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with our team instantly' },
  { icon: Video, title: 'Video Call', desc: 'Schedule a personalized demo' },
  { icon: Calendar, title: 'Book Meeting', desc: 'Choose a time that works for you' },
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

      {/* Hero Section - Match About Page Style */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen max-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
              <MessageSquare className="w-4 h-4 text-accent" />
              <span className="text-white/60 text-xs uppercase tracking-wider">Get in Touch</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase">
              WE'D LOVE TO
              <br />
              <span className="bg-gradient-to-r from-accent via-[#9e79ef] to-accentDark bg-clip-text text-transparent">
                HEAR FROM YOU
              </span>
            </h1>
            
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Have questions about LemurSystem? Need help choosing the right plan? 
              Our team is here to help you find the perfect solution for your business.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-medium rounded-lg hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/docs" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition-all flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                View Docs
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">Support</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">&lt;1hr</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">Response</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">Countries</div>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accentDark rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0b2a38]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b2a38] via-transparent to-transparent" />
              
              <div className="p-6 space-y-4">
                {/* Contact Methods */}
                <div className="grid grid-cols-3 gap-3">
                  {contactMethods.map((method, i) => (
                    <div key={i} className="bg-[#061c26]/80 backdrop-blur rounded-xl p-3 text-center border border-white/5">
                      <method.icon className="w-5 h-5 text-accent mx-auto mb-1" />
                      <div className="text-[10px] text-white font-medium">{method.title}</div>
                    </div>
                  ))}
                </div>

                {/* Quick Contact Card */}
                <div className="bg-[#061c26]/80 backdrop-blur rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <HeadphonesIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Sales & Support</div>
                      <div className="text-white/40 text-xs">Available 24/7</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <Phone className="w-4 h-4" />
                    +27 61 580 8228
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Fast Response</div>
                  <div className="text-[10px] text-emerald-400">Within 1 hour</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#0b2a38]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Expert Team</div>
                  <div className="text-[10px] text-blue-400">SADC-based</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info with Images */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl bg-[#0b2a38]/50 border border-white/5 hover:border-accent/30 transition-all duration-300">
                <img 
                  src={info.image} 
                  alt={info.title}
                  className="w-full h-32 object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b2a38] via-[#0b2a38]/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${info.color} rounded-lg flex items-center justify-center mb-2 shadow-md`}>
                    <info.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{info.title}</h3>
                  <p className="text-accent font-medium text-xs mb-1">{info.value}</p>
                  <p className="text-white/50 text-xs">{info.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#061520]/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3 bg-[#0b2a38]/50 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accentDark rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white uppercase">Send Us a Message</h2>
                  <p className="text-white/40 text-sm">We'll get back to you within 24 hours</p>
                </div>
              </div>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                  <p className="text-white/50 mb-6">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setIsSubmitted(false)} className="text-accent hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input 
                          {...register('name')}
                          className="w-full pl-12 pr-4 py-3 bg-[#061c26] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent transition"
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input 
                          {...register('email')}
                          type="email"
                          className="w-full pl-12 pr-4 py-3 bg-[#061c26] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent transition"
                          placeholder="john@company.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input 
                        {...register('company')}
                        className="w-full pl-12 pr-4 py-3 bg-[#061c26] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent transition"
                        placeholder="Your company name (optional)"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Department *</label>
                    <select 
                      {...register('subject')}
                      className="w-full px-4 py-3 bg-[#061c26] border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition appearance-none"
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept.name} value={dept.name}>{dept.name} - {dept.desc}</option>
                      ))}
                    </select>
                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Message *</label>
                    <textarea 
                      {...register('message')}
                      rows={5}
                      className="w-full px-4 py-3 bg-[#061c26] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent transition resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-accent to-accentDark text-white font-bold rounded-xl hover:shadow-xl hover:shadow-accent/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-white uppercase">Our Departments</h2>
              
              <div className="space-y-4">
                {departments.map((dept, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl bg-[#0b2a38]/50 border border-white/5 p-5 hover:border-accent/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${dept.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <dept.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-0.5">{dept.name}</h3>
                        <p className="text-white/50 text-sm">{dept.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Need Immediate Help */}
              <div className="bg-gradient-to-r from-accent/10 to-accentDark/10 border border-accent/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-accent" />
                  <h3 className="text-white font-semibold">Need Immediate Help?</h3>
                </div>
                <p className="text-white/50 text-sm mb-4">
                  Check our documentation or start a live chat with our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/docs" className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg text-center hover:bg-accentDark transition flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    View Docs
                  </Link>
                  <Link href="/free-trial" className="px-4 py-2 border border-white/20 text-white text-sm font-medium rounded-lg text-center hover:border-white transition">
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop"
              alt="Team"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b2a38]/95 to-[#0b2a38]/80" />
            <div className="relative z-10 p-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-4 uppercase">
                Ready to Get Started?
              </h2>
              <p className="text-white/60 text-sm mb-6 max-w-lg mx-auto">
                Join thousands of businesses already using LemurSystem. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/free-trial" className="px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-medium rounded-lg hover:shadow-xl hover:shadow-accent/30 transition flex items-center gap-2">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/pricing" className="px-8 py-3 border border-white/20 text-white/60 rounded-lg hover:border-white/40 hover:text-white transition">
                  View Pricing
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
