'use client';

import { useState } from 'react';
import { Film, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <Film className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">Doc à Tunis</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#accueil" className="text-gray-300 hover:text-purple-400 transition">
              Accueil
            </a>
            <a href="#programme" className="text-gray-300 hover:text-purple-400 transition">
              Programme
            </a>
            <a href="#films" className="text-gray-300 hover:text-purple-400 transition">
              Films
            </a>
            <a href="#jury" className="text-gray-300 hover:text-purple-400 transition">
              Jury
            </a>
            <Link 
              href="/connexion"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition"
            >
              Connexion 
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-purple-500/20">
          <div className="px-4 py-4 space-y-3">
            <a 
              href="#accueil" 
              className="block text-gray-300 hover:text-purple-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </a>
            <a 
              href="#programme" 
              className="block text-gray-300 hover:text-purple-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Programme
            </a>
            <a 
              href="#films" 
              className="block text-gray-300 hover:text-purple-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Films
            </a>
            <a 
              href="#jury" 
              className="block text-gray-300 hover:text-purple-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Jury
            </a>
            <Link 
              href="/connexion"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-center"
            >
              Connexion 
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}