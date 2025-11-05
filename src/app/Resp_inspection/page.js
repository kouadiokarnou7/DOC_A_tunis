"use client";

import { useState, useEffect } from "react";
import ModalProducteur from "@/components/modal/ModalProducteur";
import ModalRealisateur from "@/components/modal/ModalRealisateur";
import ModalFilm from "@/components/modal/ModalFilm";
import { Film, Users, Loader2, Trash2, Search, X } from "lucide-react";

export default function RespInspection() {
  const [producteurs, setProducteurs] = useState([]);
  const [realisateurs, setRealisateurs] = useState([]);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModalProducteur, setShowModalProducteur] = useState(false);
  const [showModalRealisateur, setShowModalRealisateur] = useState(false);
  const [showModalFilm, setShowModalFilm] = useState(false);

  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState("");

  // Charger les données
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

  // Gestion des sauvegardes
  const handleFilmSaved = (newFilm) => setFilms((prev) => [...prev, newFilm]);
  const handleProducteurSaved = (newProducteur) =>
    setProducteurs((prev) => [...prev, newProducteur]);
  const handleRealisateurSaved = (newRealisateur) =>
    setRealisateurs((prev) => [...prev, newRealisateur]);

  // Suppression d'un film
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

  // Récupération des noms
  const getRealisateurName = (realisateurCode) => {
    if (!realisateurCode) return "N/A";
    const real = realisateurs.find((r) => r.code === realisateurCode);
    return real ? `${real.prenom} ${real.nom}` : realisateurCode;
  };

  const getProducteurName = (producteurCode) => {
    if (!producteurCode) return "N/A";
    const prod = producteurs.find((p) => p.code === producteurCode);
    return prod ? `${prod.prenom} ${prod.nom}` : producteurCode;
  };

  // Fonction de filtrage des films
  const filteredFilms = films.filter((film) => {
    const searchLower = searchTerm.toLowerCase();
    const realisateurName = getRealisateurName(
      film.realisateur?.code || film.realisateur
    ).toLowerCase();
    const producteurName = getProducteurName(
      film.producteur?.code || film.producteur
    ).toLowerCase();

    return (
      film.codeFilm?.toLowerCase().includes(searchLower) ||
      film.titre?.toLowerCase().includes(searchLower) ||
      realisateurName.includes(searchLower) ||
      producteurName.includes(searchLower)
    );
  });

  // Fonction pour effacer la recherche
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 p-6">
      {/* --- MODALES CENTRÉES --- */}
      {showModalProducteur && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <ModalProducteur
              onClose={() => setShowModalProducteur(false)}
              onSaved={handleProducteurSaved}
            />
          </div>
        </div>
      )}

      {showModalRealisateur && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <ModalRealisateur
              onClose={() => setShowModalRealisateur(false)}
              onSaved={handleRealisateurSaved}
            />
          </div>
        </div>
      )}

      {showModalFilm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl">
            <ModalFilm
              onClose={() => setShowModalFilm(false)}
              onSaved={handleFilmSaved}
              realisateurs={realisateurs}
              producteurs={producteurs}
            />
          </div>
        </div>
      )}

      {/* --- CONTENU PRINCIPAL --- */}
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
            {loading
              ? "Chargement..."
              : `${filteredFilms.length} film(s) affiché(s) sur ${films.length}`}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowModalProducteur(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:scale-105 transition shadow-lg hover:shadow-xl"
          >
            <Users size={18} /> Nouveau Producteur
          </button>

          <button
            onClick={() => setShowModalRealisateur(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-3 rounded-xl hover:scale-105 transition shadow-lg hover:shadow-xl"
          >
            <Users size={18} /> Nouveau Réalisateur
          </button>

          <button
            onClick={() => setShowModalFilm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 text-white px-6 py-3 rounded-xl hover:scale-105 transition shadow-lg hover:shadow-xl"
          >
            <Film size={18} /> Nouveau Film
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par code, titre, réalisateur ou producteur..."
              className="w-full pl-12 pr-12 py-4 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-md text-gray-700 placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-2 ml-1">
              <span className="font-semibold text-purple-600">
                {filteredFilms.length}
              </span>{" "}
              résultat(s) trouvé(s) pour "{searchTerm}"
            </p>
          )}
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
                    <th className="px-6 py-4 text-left font-bold text-purple-900">
                      Code Film
                    </th>
                    <th className="px-6 py-4 text-left font-bold text-purple-900">
                      Titre
                    </th>
                    <th className="px-6 py-4 text-left font-bold text-purple-900">
                      Réalisateur
                    </th>
                    <th className="px-6 py-4 text-left font-bold text-purple-900">
                      Producteur
                    </th>
                    <th className="px-6 py-4 text-left font-bold text-purple-900">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left font-bold text-purple-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFilms.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          {searchTerm ? (
                            <>
                              <Search className="w-16 h-16 text-gray-300" />
                              <p className="text-gray-500 font-medium">
                                Aucun film trouvé pour "{searchTerm}"
                              </p>
                              <button
                                onClick={clearSearch}
                                className="mt-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition shadow-lg"
                              >
                                Effacer la recherche
                              </button>
                            </>
                          ) : (
                            <>
                              <Film className="w-16 h-16 text-gray-300" />
                              <p className="text-gray-500 font-medium">
                                Aucun film enregistré
                              </p>
                              <button
                                onClick={() => setShowModalFilm(true)}
                                className="mt-2 bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 text-white px-4 py-2 rounded-lg hover:from-fuchsia-700 hover:to-fuchsia-800 transition shadow-lg"
                              >
                                Ajouter le premier film
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredFilms.map((film) => (
                      <tr
                        key={film.codeFilm}
                        className="border-b border-purple-50 hover:bg-purple-50 transition"
                      >
                        <td className="px-6 py-4">
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {film.codeFilm}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {film.titre}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {getRealisateurName(
                            film.realisateur?.code || film.realisateur
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {getProducteurName(
                            film.producteur?.code || film.producteur
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {film.image ? (
                            <img
                              src={film.image}
                              alt={film.titre}
                              className="w-24 h-24 object-cover rounded-lg border-2 border-purple-200 shadow-md"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                              <Film className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteFilm(film.codeFilm)}
                            className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 px-3 py-2 rounded-lg transition"
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
    </div>
  );
}