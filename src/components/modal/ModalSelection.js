"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

export default function ModalSelection({
  isOpen,
  onClose,
  assignation,
  onSaveNote,
  onDeleteNote,
}) {
  const [note, setNote] = useState(assignation?.note || "");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !assignation) return null;

  const handleSave = async () => {
    if (note === "" || isNaN(note) || note < 0 || note > 10) {
      alert("Veuillez entrer une note valide entre 0 et 10.");
      return;
    }
    setLoading(true);
    await onSaveNote(assignation.filmCode, assignation.juryCode, parseFloat(note));
    setLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer la note ?")) return;
    setLoading(true);
    await onDeleteNote(assignation.filmCode, assignation.juryCode);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <X size={20} />
        </button>

        {/* Titre */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Notation du film
        </h2>

        {/* Informations principales */}
        <div className="space-y-2 mb-4 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Film :</span>{" "}
            {assignation.film?.titre || "Non disponible"}
          </p>
        
          <p>
            <span className="font-semibold">Jury :</span>{" "}
            {assignation.jury?.nom} {assignation.jury?.prenom}
          </p>
        </div>

        {/* Champ de note */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">
            Note sur 10 :
          </label>
          <input
            type="number"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            min="0"
            max="10"
            step="0.5"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:underline text-sm"
          >
            Supprimer
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
