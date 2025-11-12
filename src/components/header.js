'use client';

import { useState, useEffect } from 'react';
import { Film, Menu, X, LogOut, Calendar, Tv, Users, Award, Video, Newspaper } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/status');
        if (response.data.isAuthenticated && response.data.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error('Erreur vérification auth:', err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      try {
        await axios.post('/api/auth/logout');
        setUser(null);
        window.location.href = '/';
      } catch (err) {
        console.error('Erreur logout:', err);
      }
    }
  };

  const menuItems = [
    { href: '#accueil', label: 'Accueil', icon: Film },
    { href: '#programme', label: 'Programme', icon: Calendar },
    { href: '#catalogue', label: 'Catalogue Films', icon: Video },
    { href: '#projections', label: 'Projections', icon: Tv },
    { href: '#jury', label: 'Jury', icon: Users },
    { href: '#palmares', label: 'Palmarès', icon: Award },
    { href: '#actualites', label: 'Actualités', icon: Newspaper },
  ];

  return (
    <nav className="fixed w-full z-50 bg-gradient-to-r from-slate-900 via-purple-900/50 to-slate-900 backdrop-blur-md border-b border-purple-500/30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-fuchsia-600 p-2 rounded-xl shadow-lg">
                <Film className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-white drop-shadow-lg">Doc à Tunis</span>
              <p className="text-xs text-purple-300 font-medium">Festival International du Documentaire</p>
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 relative"
                >
                  <Icon className="w-4 h-4 text-purple-400 group-hover:text-fuchsia-400 transition" />
                  <span className="font-medium">{item.label}</span>
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              );
            })}
          </div>

          {/* User Section Desktop */}
          <div className="hidden lg:flex items-center">
            {user ? (
              <div className="relative group">
                <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 p-[2px] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="bg-white px-4 py-2.5 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {user.nomComplet?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Connecté</p>
                      <p className="font-bold text-purple-700 text-sm">{user.nomComplet}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="ml-2 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all font-semibold flex items-center gap-1.5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Déconnexion</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href="/connexion"
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-6 py-3 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
              >
                Connexion 
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-800/95 backdrop-blur-lg border-t border-purple-500/30 shadow-2xl">
          <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-purple-600/20 p-3 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 text-purple-400" />
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            })}
            
            {user ? (
              <div className="pt-4 mt-4 border-t border-purple-500/30 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 rounded-lg border border-purple-500/30">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user.nomComplet?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Connecté en tant que</p>
                    <p className="font-bold text-white">{user.nomComplet}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="pt-4 mt-4 border-t border-purple-500/30">
                <Link 
                  href="/connexion"
                  className="block w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-4 py-3 rounded-lg text-center font-bold shadow-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion 
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}