"use client";

import { useState, useMemo, useCallback } from "react";
import ModalProducteur from "@/components/modal/ModalProducteur";
import ModalRealisateur from "@/components/modal/ModalRealisateur";
import ModalFilm from "@/components/modal/ModalFilm";
import * as LucideIcons from "lucide-react";
import useConnexion from "@/hooks/hookconnexion.js";
import { useFilms } from "@/hooks/useFilms";
import { useProducteurs } from "@/hooks/useProducteurs";
import { useRealisateurs } from "@/hooks/useRealisateurs";

// Extraction des icônes pour éviter les problèmes HMR
const { Film, Users, Loader2, Trash2, Search, X, LogOut } = LucideIcons;

export default function RespInspection() {
  const { user, logout } = useConnexion();
  
  // Hooks pour gérer les données
  const { films, isLoading: filmsLoading, deleteFilm, fetchFilms, addFilm } = useFilms();
  const { producteurs, isLoading: producteursLoading, fetchProducteurs, addProducteur } = useProducteurs();
  const { realisateurs, isLoading: realisateursLoading, fetchRealisateurs, addRealisateur } = useRealisateurs();

  const [showModalProducteur, setShowModalProducteur] = useState(false);
  const [showModalRealisateur, setShowModalRealisateur] = useState(false);
  const [showModalFilm, setShowModalFilm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // État de chargement global
  const loading = filmsLoading || producteursLoading || realisateursLoading;

  // Fonction de salutation mémorisée
  const getSalutation = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  }, []);

  // Gestion des sauvegardes avec useCallback
  const handleFilmSaved = useCallback(async (newFilm) => {
    try {
      addFilm(newFilm);
      await fetchFilms();
      setShowModalFilm(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du film:", error);
      alert("Erreur lors de l'ajout du film");
    }
  }, [addFilm, fetchFilms]);

  const handleProducteurSaved = useCallback(async (newProducteur) => {
    try {
      addProducteur(newProducteur);
      await fetchProducteurs();
      setShowModalProducteur(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du producteur:", error);
      alert("Erreur lors de l'ajout du producteur");
    }
  }, [addProducteur, fetchProducteurs]);

  const handleRealisateurSaved = useCallback(async (newRealisateur) => {
    try {
      addRealisateur(newRealisateur);
      await fetchRealisateurs();
      setShowModalRealisateur(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du réalisateur:", error);
      alert("Erreur lors de l'ajout du réalisateur");
    }
  }, [addRealisateur, fetchRealisateurs]);

  // Suppression d'un film
  const handleDeleteFilm = useCallback(async (codeFilm) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce film ?")) return;
    
    try {
      const success = await deleteFilm(codeFilm);
      if (!success) {
        alert("Erreur lors de la suppression du film");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du film");
    }
  }, [deleteFilm]);

  // Récupération des noms - optimisé
  const getRealisateurName = useCallback((film) => {
    if (film?.realisateur) {
      const fullName = `${film.realisateur.prenom || ""} ${film.realisateur.nom || ""}`.trim();
      return fullName || "N/A";
    }
    
    const code = film?.realisateurCode || film?.realisateur;
    if (!code) return "N/A";
    
    const real = realisateurs.find((r) => r.code === code);
    return real ? `${real.prenom} ${real.nom}`.trim() : code;
  }, [realisateurs]);

  const getProducteurName = useCallback((film) => {
    if (film?.producteur) {
      const fullName = `${film.producteur.prenom || ""} ${film.producteur.nom || ""}`.trim();
      return fullName || "N/A";
    }
    
    const code = film?.producteurCode || film?.producteur;
    if (!code) return "N/A";
    
    const prod = producteurs.find((p) => p.code === code);
    return prod ? `${prod.prenom} ${prod.nom}`.trim() : code;
  }, [producteurs]);

  // Fonction de filtrage optimisée avec useMemo
  const filteredFilms = useMemo(() => {
    if (!searchTerm.trim()) return films;
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    return films.filter((film) => {
      const realisateurName = getRealisateurName(film).toLowerCase();
      const producteurName = getProducteurName(film).toLowerCase();

      return (
        film.codeFilm?.toLowerCase().includes(searchLower) ||
        film.titre?.toLowerCase().includes(searchLower) ||
        realisateurName.includes(searchLower) ||
        producteurName.includes(searchLower)
      );
    });
  }, [films, searchTerm, getRealisateurName, getProducteurName]);

  // Fonction pour effacer la recherche
  const clearSearch = useCallback(() => setSearchTerm(""), []);

  // Composant Modal Wrapper pour éviter la répétition
  const ModalWrapper = ({ show, children }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        {children}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 p-6">
      {/* --- MODALES --- */}
      <ModalWrapper show={showModalProducteur}>
        <div className="w-full max-w-2xl animate-slideUp">
          <ModalProducteur
            onClose={() => setShowModalProducteur(false)}
            onSaved={handleProducteurSaved}
          />
        </div>
      </ModalWrapper>

      <ModalWrapper show={showModalRealisateur}>
        <div className="w-full max-w-2xl animate-slideUp">
          <ModalRealisateur
            onClose={() => setShowModalRealisateur(false)}
            onSaved={handleRealisateurSaved}
          />
        </div>
      </ModalWrapper>

      <ModalWrapper show={showModalFilm}>
        <div className="w-full max-w-3xl animate-slideUp">
          <ModalFilm
            onClose={() => setShowModalFilm(false)}
            onSaved={handleFilmSaved}
            realisateurs={realisateurs}
            producteurs={producteurs}
          />
        </div>
      </ModalWrapper>

      {/* --- CONTENU PRINCIPAL --- */}
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-purple-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 p-3 rounded-xl shadow-lg">
                  <Film size={32} className="text-white" />
                </div>
                Gestion Films - Resp Inspection
              </h1>
              <p className="text-gray-600 mt-2 ml-0 sm:ml-14">
                {loading
                  ? "Chargement des données..."
                  : `${filteredFilms.length} film(s) affiché(s) sur ${films.length} total`}
              </p>
            </div>

            {/* Informations utilisateur */}
            {user && (
              <div className="flex items-center gap-4 bg-gradient-to-br from-purple-50 to-violet-50 px-5 py-3 rounded-xl shadow-md border border-purple-200 hover:shadow-lg transition-shadow">
                <span className="text-gray-800 font-semibold whitespace-nowrap">
                  {getSalutation()}, {user.nomComplet}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 px-3 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label="Se déconnecter"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowModalProducteur(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
            aria-label="Ajouter un nouveau producteur"
          >
            <Users size={18} /> Nouveau Producteur
          </button>

          <button
            onClick={() => setShowModalRealisateur(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
            aria-label="Ajouter un nouveau réalisateur"
          >
            <Users size={18} /> Nouveau Réalisateur
          </button>

          <button
            onClick={() => setShowModalFilm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
            aria-label="Ajouter un nouveau film"
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
              className="w-full pl-12 pr-12 py-4 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-md hover:shadow-lg text-gray-700 placeholder-gray-400"
              aria-label="Rechercher un film"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600 transition-colors duration-200"
                aria-label="Effacer la recherche"
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
              résultat{filteredFilms.length > 1 ? "s" : ""} trouvé{filteredFilms.length > 1 ? "s" : ""} pour "{searchTerm}"
            </p>
          )}
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Chargement des films...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-100 to-violet-100 border-b-2 border-purple-300">
                    <th className="px-6 py-4 text-left font-bold text-purple-900 whitespace-nowrap">
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
                                className="mt-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                                className="mt-2 bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 text-white px-4 py-2 rounded-lg hover:from-fuchsia-700 hover:to-fuchsia-800 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                        className="border-b border-purple-50 hover:bg-purple-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                            {film.codeFilm}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {film.titre || "Sans titre"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {getRealisateurName(film)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {getProducteurName(film)}
                        </td>
                        <td className="px-6 py-4">
                          {film.image ? (
                            <img
                              src={film.image}
                              alt={film.titre || "Image du film"}
                              className="w-24 h-24 object-cover rounded-lg border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow duration-200"
                              loading="lazy"
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
                            className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 px-3 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                            aria-label={`Supprimer le film ${film.titre}`}
                          >
                            <Trash2 size={18} />
                            <span className="hidden sm:inline">Supprimer</span>
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

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}