"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ModalNote({ isOpen, film, jury, films, jurys, onSave, onClose }) {
  const [selectedFilm, setSelectedFilm] = useState(film?.codeFilm || "");
  const [selectedJury, setSelectedJury] = useState(jury?.codeJury || "");
  const [note, setNote] = useState("");

  useEffect(() => {
    setSelectedFilm(film?.codeFilm || "");
    setSelectedJury(jury?.codeJury || "");
  }, [film, jury]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Ajouter / Modifier une note</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Sélection du film */}
        <label className="block text-sm font-medium mb-1">Film</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedFilm}
          onChange={e => setSelectedFilm(e.target.value)}
        >
          <option value="">-- Choisir un film --</option>
          {films.map(f => (
            <option key={f.codeFilm} value={f.codeFilm}>{f.titre}</option>
          ))}
        </select>

        {/* Sélection du jury */}
        <label className="block text-sm font-medium mb-1 mt-3">Jury</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedJury}
          onChange={e => setSelectedJury(e.target.value)}
        >
          <option value="">-- Choisir un jury --</option>
          {jurys.map(j => (
            <option key={j.codeJury} value={j.codeJury}>
              {j.nom} {j.prenom}
            </option>
          ))}
        </select>

        {/* Note */}
        <label className="block text-sm font-medium mb-1 mt-3">Note</label>
        <input
          type="number"
          min="0"
          max="10"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              if (!selectedFilm || !selectedJury) return alert("Choisissez un film et un jury");
              onSave(selectedFilm, selectedJury, note);
              onClose();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
