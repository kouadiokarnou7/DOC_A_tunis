"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Users,
  Trash2,
  Phone,
  Calendar,
  Globe,
  Loader2,
  LogOut,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import AddJuryModal from "@/components/modal/addjurymodal";
import { useJuryModal } from "@/hooks/hookjurymodal";
import useConnexion from "@/hooks/hookconnexion";
import { Button } from "@/components/ui/button";

export default function JuryManagementPage() {
  const {
    isOpen,
    openModal,
    closeModal,
    handleJuryCreated,
    jurys,
    loadJurys,
    deleteJury,
  } = useJuryModal();

  const { user, loading, logout } = useConnexion();


  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Charger les jurys
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        await loadJurys();
      } catch (err) {
        console.error("Erreur lors du chargement des jurys:", err);
        setError("Impossible de charger les membres du jury");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [loadJurys]);

  const handleDelete = async (code, nom, prenom) => {
    if (!confirm(`Supprimer ${prenom} ${nom} ?`)) return;
    try {
      const success = await deleteJury(code);
      if (success) {
        setShowDeleteSuccess(true);
        setTimeout(() => setShowDeleteSuccess(false), 3000);
      } else setError("Erreur lors de la suppression");
    } catch (err) {
      console.error(err);
      setError("Erreur inattendue lors de la suppression");
    }
  };

  const formatDate = (date, opts = { day: "numeric", month: "long", year: "numeric" }) => {
    if (!date) return null;
    try {
      return new Date(date).toLocaleDateString("fr-FR", opts);
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Profil utilisateur */}
        <div className="flex justify-end">
        {loading ? (
  <div className="bg-white rounded-xl shadow-md px-6 py-4 flex items-center gap-3 border border-violet-100">
    <Loader2 className="w-5 h-5 animate-spin text-violet-600" />
    <span className="text-gray-600 font-medium">Chargement du profil...</span>
  </div>
) : user ? (
  <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 p-[2px] rounded-xl shadow-lg">
    <div className="bg-white px-5 py-3 rounded-xl flex flex-wrap items-center gap-3">
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white">
        {user.nomComplet?.charAt(0).toUpperCase() || "U"}
      </div>
      <div className="flex-1 min-w-[120px]">
        <p className="text-xs text-gray-500 font-medium uppercase">Connecté</p>
        <p className="font-bold text-purple-700 text-base">{user.nomComplet}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold"
        onClick={logout} // <-- corrigé ici
      >
        <LogOut className="w-4 h-4 mr-1.5" />
        <span className="hidden sm:inline">Déconnexion</span>
      </Button>
    </div>
  </div>
) : null}

        </div>

        {/* Notifications */}
        {showDeleteSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">
              Membre du jury supprimé avec succès
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 shadow-md">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800 flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-red-600 font-bold text-lg">
              ×
            </button>
          </div>
        )}

        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-violet-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Gestion des Membres du Jury
                </h1>
                <p className="text-gray-600 mt-1">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                      Chargement...
                    </span>
                  ) : (
                    <span className="font-medium text-violet-700">
                      {jurys.length} membre{jurys.length > 1 && "s"} enregistré
                      {jurys.length > 1 && "s"}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={openModal}
              disabled={isLoading}
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5 mr-2" /> Ajouter un membre
            </Button>
          </div>
        </div>

        {/* Liste des jurys */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-violet-600 mb-4" />
            <p className="text-violet-700 font-semibold">Chargement des membres...</p>
          </div>
        ) : jurys.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-violet-100">
            <div className="bg-gradient-to-br from-violet-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-violet-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aucun membre enregistré
            </h3>
            <p className="text-gray-500 mb-6">
              Cliquez sur le bouton ci-dessous pour en ajouter un.
            </p>
            <Button
              onClick={openModal}
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5 mr-2" /> Ajouter un membre
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jurys.map((jury) => (
              <div
                key={jury.code}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-violet-100 hover:border-violet-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="bg-violet-100 text-violet-800 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-2">
                      {jury.code}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800">
                      {jury.prenom} {jury.nom}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(jury.code, jury.nom, jury.prenom)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  {jury.dateNaissance && (
                    <div className="flex items-center gap-2 text-gray-700 bg-violet-50 p-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-violet-500" />
                      <span>Né(e) le {formatDate(jury.dateNaissance)}</span>
                    </div>
                  )}
                  {jury.telephone && (
                    <div className="flex items-center gap-2 text-gray-700 bg-violet-50 p-2 rounded-lg">
                      <Phone className="w-4 h-4 text-violet-500" />
                      <span>{jury.telephone}</span>
                    </div>
                  )}
                  {jury.nationalite && (
                    <div className="flex items-center gap-2 text-gray-700 bg-violet-50 p-2 rounded-lg">
                      <Globe className="w-4 h-4 text-violet-500" />
                      <span>{jury.nationalite}</span>
                    </div>
                  )}
                </div>

                {jury.dateCreation && (
                  <div className="mt-4 pt-4 border-t border-violet-100 text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    Ajouté le {formatDate(jury.dateCreation, { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpen && <AddJuryModal onClose={closeModal} onCreated={handleJuryCreated} />}
    </div>
  );
}
