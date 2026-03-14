import Link from 'next/link';
import { Globe2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#061c26] border-t border-white/5 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-accentDark rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-lg text-white">LEMUR<span className="text-accent">SYSTEM</span></span>
            </div>
            <p className="text-white/40 text-sm mb-3 max-w-xs">
              The most comprehensive cloud-based ERP solution for SADC businesses.
            </p>
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <Globe2 className="w-4 h-4" />
              <span>Serving All SADC Countries</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-white/40 text-sm">
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/industries" className="hover:text-white transition-colors">Industries</Link></li>
              <li><Link href="/free-trial" className="hover:text-white transition-colors">Free Trial</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-white/40 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-white/40 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">
            &copy; 2026 LemurSystem. A product of Blacklemur Innovations. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
