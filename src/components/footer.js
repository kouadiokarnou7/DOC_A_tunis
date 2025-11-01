'use client';

import { Film, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

export default function LandingFooter() {
  const footerLinks = {
    festival: [
      { name: 'À propos', href: '/a-propos' },
      { name: 'Programme', href: '/programme' },
      { name: 'Jury', href: '/jury' },
      { name: 'Partenaires', href: '/partenaires' }
    ],
    films: [
      { name: 'Sélection officielle', href: '/selection' },
      { name: 'Compétition', href: '/competition' },
      { name: 'Hors compétition', href: '/hors-competition' },
      { name: 'Rétrospectives', href: '/retrospectives' }
    ],
    infos: [
      { name: 'Billetterie', href: '/billetterie' },
      { name: 'Lieux', href: '/lieux' },
      { name: 'Accès', href: '/acces' },
      { name: 'Contact', href: '/contact' }
    ]
  };

  return (
    <footer className="bg-slate-900 border-t border-purple-500/20">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Colonne Logo & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-2 rounded-xl">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Doc à Tunis</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Festival International des Films Documentaires en Tunisie. Une célébration du cinéma documentaire 
              dédié au développement culturel et social.
            </p>
            {/* Réseaux sociaux */}
            <div className="flex gap-3">
              <a 
                href="#" 
                className="bg-slate-800 hover:bg-purple-600 text-gray-400 hover:text-white p-2 rounded-lg transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-slate-800 hover:bg-purple-600 text-gray-400 hover:text-white p-2 rounded-lg transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-slate-800 hover:bg-purple-600 text-gray-400 hover:text-white p-2 rounded-lg transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-slate-800 hover:bg-purple-600 text-gray-400 hover:text-white p-2 rounded-lg transition"
                aria-label="Youtube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Colonne Festival */}
          <div>
            <h3 className="text-white font-semibold mb-4">Festival</h3>
            <ul className="space-y-2">
              {footerLinks.festival.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne Films */}
          <div>
            <h3 className="text-white font-semibold mb-4">Films</h3>
            <ul className="space-y-2">
              {footerLinks.films.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne Infos pratiques */}
          <div>
            <h3 className="text-white font-semibold mb-4">Infos Pratiques</h3>
            <ul className="space-y-2">
              {footerLinks.infos.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section Contact */}
        <div className="border-t border-purple-500/20 pt-8 mb-8">
          <h3 className="text-white font-semibold mb-4">Nous Contacter</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 text-gray-400 text-sm">
              <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <span>Avenue Habib Bourguiba, Tunis 1000, Tunisie</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <Phone className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <span>+216 71 123 456</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <span>contact@docatunis.tn</span>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold mb-1">Restez informé</h3>
              <p className="text-gray-400 text-sm">Recevez les dernières actualités du festival</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 md:w-64 bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none text-sm"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-purple-500/20 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <div>
            © 2025 Doc à Tunis. Tous droits réservés.
          </div>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-purple-400 transition">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-purple-400 transition">
              Confidentialité
            </Link>
            <Link href="/cgv" className="hover:text-purple-400 transition">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}