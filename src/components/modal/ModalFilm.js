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

  // Liste directe des sujets
  const sujets = [
    "Drame",
    "Comédie",
    "Action",
    "Documentaire",
    "Animation",
    "Romance",
    "Thriller",
    "Science-fiction",
    "Horreur",
    "Aventure",
    "Biopic",
    "Musical",
    "Historique",
    "Fantastique",
  ];

  const submit = async (e) => {
    await handleSubmit(e);
    if (success && onSaved) onSaved(filmData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
          <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400">
            Enregistrement d'un Film
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">Film enregistré avec succès.</p>}

        <form onSubmit={submit} className="space-y-3">
          <input
            type="text"
            name="codeFilm"
            value={filmData.codeFilm || ""}
            onChange={handleChange}
            placeholder="Code du film"
            required
            className="w-full p-2 border rounded bg-transparent"
          />

          <input
            type="text"
            name="titre"
            value={filmData.titre || ""}
            onChange={handleChange}
            placeholder="Titre"
            required
            className="w-full p-2 border rounded bg-transparent"
          />

          <input
            type="date"
            name="dateFilm"
            value={filmData.dateFilm || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-transparent"
          />

          {/* Sélecteur de sujet */}
          <select
            name="sujet"
            value={filmData.sujet || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-transparent"
          >
            <option value="">Sélectionner un sujet</option>
            {sujets.map((s, idx) => (
              <option key={idx} value={s}>
                {s}
              </option>
            ))}
          </select>

          <textarea
            name="resume"
            value={filmData.resume || ""}
            onChange={handleChange}
            placeholder="Résumé du film"
            className="w-full p-2 border rounded bg-transparent h-24"
          />

          <select
            name="codeRealisateur"
            value={filmData.codeRealisateur || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-transparent"
          >
            <option value="">Sélectionner un Réalisateur</option>
            {realisateurs.map((r) => (
              <option key={r.code} value={r.code}>
                {r.prenom} {r.nom}
              </option>
            ))}
          </select>

          <select
            name="codeProducteur"
            value={filmData.codeProducteur || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-transparent"
          >
            <option value="">Sélectionner un Producteur</option>
            {producteurs.map((p) => (
              <option key={p.code} value={p.code}>
                {p.prenom} {p.nom}
              </option>
            ))}
          </select>

          <div>
            <label className="block mb-1 font-medium">Image du Film</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
            {filmData.image && (
              <img
                src={
                  typeof filmData.image === "string"
                    ? filmData.image
                    : URL.createObjectURL(filmData.image)
                }
                alt="Aperçu"
                className="w-24 h-24 mt-2 rounded object-cover border"
              />
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 flex justify-center items-center gap-2 transition"
            >
              <Save size={18} /> {isLoading ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 flex justify-center items-center gap-2 transition"
            >
              <X size={18} /> Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
