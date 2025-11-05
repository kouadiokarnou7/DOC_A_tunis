"use client";

import { useState, useEffect } from "react";
import ModalProducteur from "@/components/modal/ModalProducteur";
import ModalRealisateur from "@/components/modal/ModalRealisateur";
import ModalFilm from "@/components/modal/ModalFilm";
import { Film, Users, Loader2, Trash2 } from "lucide-react";

export default function RespInspection() {
  const [producteurs, setProducteurs] = useState([]);
  const [realisateurs, setRealisateurs] = useState([]);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModalProducteur, setShowModalProducteur] = useState(false);
  const [showModalRealisateur, setShowModalRealisateur] = useState(false);
  const [showModalFilm, setShowModalFilm] = useState(false);

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodsRes, realsRes, filmsRes] = await Promise.all([
          fetch("/api/producteurs"),
          fetch("/api/realisateurs"),
          fetch("/api/films"),
        ]);

        const prodsData = await prodsRes.json();
        const realsData = await realsRes.json();
        const filmsData = await filmsRes.json();

        setProducteurs(prodsData.data || []);
        setRealisateurs(realsData.data || []);
        setFilms(filmsData.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilmSaved = (newFilm) => {
    setFilms((prev) => [...prev, newFilm]);
  };

  const handleProducteurSaved = (newProducteur) => {
    setProducteurs((prev) => [...prev, newProducteur]);
  };

  const handleRealisateurSaved = (newRealisateur) => {
    setRealisateurs((prev) => [...prev, newRealisateur]);
  };

  // Suppression d’un film
  const handleDeleteFilm = async (codeFilm) => {
    if (!confirm("Confirmer la suppression de ce film ?")) return;
    try {
      const res = await fetch(`/api/films/${codeFilm}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setFilms((prev) => prev.filter((f) => f.codeFilm !== codeFilm));
      } else {
        alert("Erreur lors de la suppression du film");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur de connexion au serveur");
    }
  };

  // Nom complet du réalisateur
  const getRealisateurName = (realisateurCode) => {
    if (!realisateurCode) return "N/A";
    if (typeof realisateurCode === "string" && !realisateurCode.startsWith("REAL")) {
      return realisateurCode;
    }
    const real = realisateurs.find((r) => r.code === realisateurCode);
    return real ? `${real.prenom} ${real.nom}` : realisateurCode;
  };

  // Nom complet du producteur
  const getProducteurName = (producteurCode) => {
    if (!producteurCode) return "N/A";
    if (typeof producteurCode === "string" && !producteurCode.startsWith("PROD")) {
      return producteurCode;
    }
    const prod = producteurs.find((p) => p.code === producteurCode);
    return prod ? `${prod.prenom} ${prod.nom}` : producteurCode;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-purple-100">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 p-3 rounded-xl">
              <Film size={32} className="text-white" />
            </div>
            Gestion Films - Resp Inspection
          </h1>
          <p className="text-gray-600 mt-2 ml-14">
            {loading ? "Chargement..." : `${films.length} film(s) enregistré(s)`}
          </p>
        </div>

        {/* Boutons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowModalProducteur(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
          >
            <Users size={18} /> Nouveau Producteur
          </button>

          <button
            onClick={() => setShowModalRealisateur(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
          >
            <Users size={18} /> Nouveau Réalisateur
          </button>

          <button
            onClick={() => setShowModalFilm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
          >
            <Film size={18} /> Nouveau Film
          </button>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Chargement des films...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-100 to-violet-100 border-b-2 border-purple-300">
                    <th className="px-6 py-4 text-left font-bold text-purple-900">Code Film</th>
                    <th className="px-6 py-4 text-left font-bold text-purple-900">Titre</th>
                    <th className="px-6 py-4 text-left font-bold text-purple-900">Réalisateur</th>
                    <th className="px-6 py-4 text-left font-bold text-purple-900">Producteur</th>
                    <th className="px-6 py-4 text-left font-bold text-purple-900">Image</th>
                    <th className="px-6 py-4 text-left font-bold text-purple-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {films.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <Film className="w-16 h-16 text-gray-300" />
                          <p className="text-gray-500 font-medium">Aucun film enregistré</p>
                          <button
                            onClick={() => setShowModalFilm(true)}
                            className="mt-2 bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 text-white px-4 py-2 rounded-lg hover:from-fuchsia-700 hover:to-fuchsia-800 transition"
                          >
                            Ajouter le premier film
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    films.map((film) => (
                      <tr
                        key={film.codeFilm}
                        className="border-b border-purple-50 hover:bg-purple-50 transition"
                      >
                        <td className="px-6 py-4">
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {film.codeFilm}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">{film.titre}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {getRealisateurName(film.realisateur?.code || film.realisateur)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {getProducteurName(film.producteur?.code || film.producteur)}
                        </td>
                        <td className="px-6 py-4">
                          {film.image ? (
                            <img
                              src={film.image}
                              alt={film.titre}
                              className="w-24 h-24 object-cover rounded border"
                            />
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteFilm(film.codeFilm)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 size={18} /> Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModalProducteur && (
        <ModalProducteur
          onClose={() => setShowModalProducteur(false)}
          onSaved={handleProducteurSaved}
        />
      )}
      {showModalRealisateur && (
        <ModalRealisateur
          onClose={() => setShowModalRealisateur(false)}
          onSaved={handleRealisateurSaved}
        />
      )}
      {showModalFilm && (
        <ModalFilm
          onClose={() => setShowModalFilm(false)}
          onSaved={handleFilmSaved}
          realisateurs={realisateurs}
          producteurs={producteurs}
        />
      )}
    </div>
  );
}
