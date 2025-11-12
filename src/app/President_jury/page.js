"use client";

import { useState, useMemo } from "react";
import { Loader2, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button"; // si tu utilises shadcn
import useConnexion from "@/hooks/hookconnexion";
import { useSelectionPresident } from "@/hooks/useSelectionPresident";
import ModalSelection from "@/components/modal/ModalSelection";

export default function PagePresident() {
  const {  user, logout } = useConnexion();

  const {
    assignations = [], // <-- assure un tableau par défaut
    loading,
    fetchAssignations,
    handleSaveNote,
    handleDeleteNote,
  } = useSelectionPresident();

  const [selected, setSelected] = useState(null); 
  const [search, setSearch] = useState("");

  // filtre par titre de film ou nom/prenom du jury
  const filtered = useMemo(() => {
    if (!assignations || assignations.length === 0) return [];
    if (!search.trim()) return assignations;

    const q = search.trim().toLowerCase();
    return assignations.filter((a) => {
      const filmTitre = a.film?.titre?.toLowerCase() ?? "";
      const juryNom = `${a.jury?.nom ?? ""} ${a.jury?.prenom ?? ""}`.toLowerCase();
      return filmTitre.includes(q) || juryNom.includes(q);
    });
  }, [assignations, search]);

  const openModalFor = (assign) => setSelected(assign);

  const onSaveFromModal = async (filmCode, juryCode, note) => {
    await handleSaveNote(filmCode, juryCode, note);
    await fetchAssignations();
    setSelected(null);
  };

  const onDeleteFromModal = async (filmCode, juryCode) => {
    await handleDeleteNote(filmCode, juryCode);
    await fetchAssignations();
    setSelected(null);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Espace Président du Jury</h1>
        <div className="flex items-center gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher film ou jury..."
              className="pl-10 pr-3 py-2 border rounded-md w-72"
            />
          </div>

          {/* Utilisateur connecté */}
          {user && (
            <div className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                {user.nomComplet?.charAt(0)?.toUpperCase() ?? ""}
              </div>
              <div className="text-sm">
                <div className="text-xs text-gray-500">Connecté</div>
                <div className="font-semibold text-purple-700">{user.nomComplet}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-1" />
                Déconnexion
              </Button>
            </div>
          )}
        </div>
      </div>

      
{filtered && filtered.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="w-full border text-sm">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-2 border">Film</th>
          <th className="p-2 border">Jury</th>
          <th className="p-2 border">Salle</th>
          <th className="p-2 border">Date</th>
          <th className="p-2 border">Heure</th>
          <th className="p-2 border text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((a) => (
          <tr key={`${a.filmCode}-${a.juryCode}-${a.id ?? ""}`} className="hover:bg-gray-50">
            <td className="p-2 border">{a.film?.titre ?? a.filmCode}</td>
            <td className="p-2 border">{a.jury ? `${a.jury.nom} ${a.jury.prenom}` : a.juryCode}</td>
            <td className="p-2 border">{a.salle ?? "-"}</td>
            <td className="p-2 border">{a.dateAssignation ? new Date(a.dateAssignation).toLocaleDateString("fr-FR") : "-"}</td>
            <td className="p-2 border">{a.heure ?? "-"}</td>
            <td className="p-2 border text-center">
              {a.note != null ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="font-semibold text-green-700">{a.note}</div>
                  <button
                    onClick={async () => {
                      if (!confirm("Supprimer cette note ?")) return;
                      await onDeleteFromModal(a.filmCode, a.juryCode);
                    }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => setSelected(a)}
                    className="ml-2 text-sm text-gray-600 hover:underline"
                  >
                    Modifier
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openModalFor(a)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Noter
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p className="text-center text-gray-500 mt-4">Aucune assignation trouvée.</p>
)}



      {/* Modal de notation */}
      <ModalSelection
        isOpen={!!selected}
        assignation={selected}
        onClose={() => setSelected(null)}
        onSaveNote={onSaveFromModal}
        onDeleteNote={onDeleteFromModal}
      />
    </div>
  );
}
