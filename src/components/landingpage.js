'use client';

import { Film, Calendar, Users, Award } from 'lucide-react';

export default function LandingMain() {
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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section id="accueil" className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full">
            <span className="text-purple-400 text-sm font-semibold">🎬 Édition 2025 • Tunis, Tunisie</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Festival International des
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 mt-2">
              Films Documentaires
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Célébration du cinéma documentaire en Tunisie - Une manifestation dédiée au développement culturel et social
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a 
              href="#programme"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
            >
              Voir le Programme
            </a>
            <a
              href="#films"
              className="bg-transparent border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition"
            >
              En savoir plus
            </a>
          </div>
          {/* Stats rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-400">50+</div>
              <div className="text-sm text-gray-400">Films</div>
            </div>
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-400">30+</div>
              <div className="text-sm text-gray-400">Pays</div>
            </div>
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-400">10</div>
              <div className="text-sm text-gray-400">Jours</div>
            </div>
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-400">5000+</div>
              <div className="text-sm text-gray-400">Visiteurs</div>
            </div>
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
    </main>
  );
}