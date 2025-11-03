"use client";
import { useFilm } from "@/hooks/useFilm";
import { Save, X } from "lucide-react";

export default function ModalFilm({ onClose, onSaved }) {
  const {
    filmData,
    handleChange,
    handleSubmit,
    isLoading,
    error,
    success,
    realisateurs,
    producteurs,
  } = useFilm();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-700">
            Enregistrement d'un Film
          </h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && (
          <p className="text-green-600 mb-3">Film enregistré avec succès.</p>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="codeFilm"
            value={filmData.codeFilm || ""}
            onChange={handleChange}
            placeholder="Code du film"
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="titre"
            value={filmData.titre || ""}
            onChange={handleChange}
            placeholder="Titre"
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="date"
            name="dateFilm"
            value={filmData.dateFilm || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="sujet"
            value={filmData.sujet || ""}
            onChange={handleChange}
            placeholder="Sujet"
            className="w-full p-2 border rounded"
          />

          {/* Sélection Réalisateur */}
          <select
            name="realisateur"
            value={filmData.realisateur || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionner un Réalisateur</option>
            {Array.isArray(realisateurs) &&
              realisateurs.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.nom} {r.prenom}
                </option>
              ))}
          </select>

          {/* Sélection Producteur */}
          <select
            name="producteur"
            value={filmData.producteur || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionner un Producteur</option>
            {Array.isArray(producteurs) &&
              producteurs.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.nom} {p.prenom}
                </option>
              ))}
          </select>

          {/* Upload image */}
          <div>
            <label className="block mb-1 font-medium">Image du Film</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
            {typeof filmData.image === "string" && filmData.image && (
              <img
                src={filmData.image}
                alt="Aperçu"
                className="w-24 h-24 mt-2 rounded object-cover border"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 flex justify-center items-center gap-2"
            >
              <Save size={18} /> {isLoading ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 flex justify-center items-center gap-2"
            >
              <X size={18} /> Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}