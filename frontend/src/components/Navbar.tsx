'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activePage?: string;
}

export default function Navbar({ activePage }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Industries', href: '/industries' },
    { name: 'Docs', href: '/docs' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Free Trial', href: '/free-trial' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0b2f40]/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-accent to-accentDark rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-bold text-lg text-white">LEMUR<span className="text-accent">SYSTEM</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`text-sm transition-colors ${
                  activePage === item.name.toLowerCase() 
                    ? 'text-white font-semibold' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-4 py-2 text-white/70 hover:text-white text-sm transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/create-account" 
              className="px-5 py-2 bg-gradient-to-r from-accent to-accentDark text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-accent/30 transition-all"
            >
              Get Started
            </Link>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-white/70 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b2f40]/98 backdrop-blur-xl border-t border-white/10 px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              className="block py-2 text-white/70 hover:text-white text-sm"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <Link href="/login" className="block py-2 text-white/70 text-sm">Sign In</Link>
            <Link href="/create-account" className="block text-center px-4 py-2 bg-gradient-to-r from-accent to-accentDark text-white text-sm rounded-lg">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
