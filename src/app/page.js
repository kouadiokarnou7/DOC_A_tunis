'use client'; 

import { useState } from 'react';
import { Film, Calendar, Users, Award, Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Film className="w-8 h-8" />,
      title: "Films Documentaires",
      description: "Découvrez une sélection exceptionnelle de documentaires du monde entier"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Programme",
      description: "Consultez le planning complet des projections et événements"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Jury International",
      description: "Des personnalités tunisiennes et internationales évaluent les œuvres"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Récompenses",
      description: "Les meilleurs documentaires seront récompensés"
    }
  ];

  const upcomingFilms = [
    {
      title: "Sahara Stories",
      director: "Amina Ben Salem",
      time: "14h00",
      date: "15 Nov 2025",
      venue: "Salle Carthage"
    },
    {
      title: "Mediterranean Voices",
      director: "Jean Dupont",
      time: "16h30",
      date: "15 Nov 2025",
      venue: "Salle Africa"
    },
    {
      title: "Tunis Underground",
      director: "Karim Essid",
      time: "19h00",
      date: "15 Nov 2025",
      venue: "Salle Carthage"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">Doc à Tunis</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#accueil" className="text-gray-300 hover:text-purple-400 transition">Accueil</a>
              <a href="#programme" className="text-gray-300 hover:text-purple-400 transition">Programme</a>
              <a href="#films" className="text-gray-300 hover:text-purple-400 transition">Films</a>
              <a href="#jury" className="text-gray-300 hover:text-purple-400 transition">Jury</a>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition">
                Connexion 
              </button>
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
              <a href="#accueil" className="block text-gray-300 hover:text-purple-400">Accueil</a>
              <a href="#programme" className="block text-gray-300 hover:text-purple-400">Programme</a>
              <a href="#films" className="block text-gray-300 hover:text-purple-400">Films</a>
              <a href="#jury" className="block text-gray-300 hover:text-purple-400">Jury</a>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full">
                Connexion 
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="accueil" className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Festival International des
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Films Documentaires
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Célébration du cinéma documentaire en Tunisie - Une manifestation dédiée au développement culturel et social
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition transform hover:scale-105">
              Voir le Programme
            </button>
            <button className="bg-transparent border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition">
              En savoir plus
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Pourquoi Doc à Tunis ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition transform hover:scale-105"
              >
                <div className="text-purple-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Films Section */}
      <section id="programme" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Projections à venir
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingFilms.map((film, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 hover:border-purple-400 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    {film.date}
                  </div>
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{film.title}</h3>
                <p className="text-gray-400 mb-4">Réalisateur: {film.director}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-400 font-semibold">{film.time}</span>
                  <span className="text-gray-500">{film.venue}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition">
              Voir tout le programme
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Rejoignez-nous pour cette édition exceptionnelle
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Découvrez des histoires captivantes à travers le prisme du documentaire
          </p>
          <button className="bg-white text-purple-900 hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-bold transition transform hover:scale-105">
            S'inscrire maintenant
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-4 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Film className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">Doc à Tunis</span>
          </div>
          <p className="text-gray-400 mb-4">
            Festival International des Films Documentaires en Tunisie
          </p>
          <div className="text-gray-500 text-sm">
            © 2025 Doc à Tunis. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
