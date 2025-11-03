"use client";
import { useRealisateur } from "../../hooks/useRealisateur";
import { Save, X } from "lucide-react";

export default function ModalRealisateur({ onClose }) {
  const {
    data,
    handleChange,
    handleSubmit,
    isLoading,
    success,
    error,
  } = useRealisateur();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto relative">
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>

      <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
        Enregistrement du Réalisateur
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="code"
          placeholder="Code"
          value={data.code}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={data.nom}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="prenom"
          placeholder="Prénom"
          value={data.prenom}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="date"
          name="dateNaissance"
          value={data.dateNaissance}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
        >
          <Save size={18} /> {isLoading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>

      {success && <p className="text-green-600 mt-3">Réalisateur enregistré.</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}
