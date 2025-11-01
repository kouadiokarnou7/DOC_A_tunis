"use client";

import React, { useState } from "react";
import {
  Film,
  Users,
  Search,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Image as ImageIcon,
} from "lucide-react";

const FormulaireInspection = () => {
  const [activeForm, setActiveForm] = useState("liste");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  // États pour le film
  const [filmData, setFilmData] = useState({
    codeFilm: "",
    titre: "",
    dateFilm: "",
    sujet: "",
    image: null,
  });

  // États pour réalisateur
  const [realisateurData, setRealisateurData] = useState({
    code: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
  });

  // États pour producteur
  const [producteurData, setProducteurData] = useState({
    code: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
  });

  const [realisateurConfirmed, setRealisateurConfirmed] = useState(false);
  const [producteurConfirmed, setProducteurConfirmed] = useState(false);

  // Films existants
  const [films, setFilms] = useState([
    {
      codeFilm: "F001",
      titre: "Histoire de Tunis",
      dateFilm: "2024-05-15",
      sujet: "Histoire",
      realisateur: "Ahmed Ben Ali",
      producteur: "Mohamed Trabelsi",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg",
    },
  ]);

  const showNotif = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const rechercherPersonne = (code, type) => {
    const personnesExistantes = {
      R001: {
        code: "R001",
        nom: "Ben Ali",
        prenom: "Ahmed",
        dateNaissance: "1975-03-12",
      },
      P001: {
        code: "P001",
        nom: "Trabelsi",
        prenom: "Mohamed",
        dateNaissance: "1970-11-08",
      },
    };

    if (personnesExistantes[code]) {
      if (type === "realisateur") setRealisateurData(personnesExistantes[code]);
      else setProducteurData(personnesExistantes[code]);
      showNotif(`${type} trouvé dans la base`, "success");
    } else showNotif("Personne non trouvée", "info");
  };

  const confirmerRealisateur = () => {
    if (
      !realisateurData.code ||
      !realisateurData.nom ||
      !realisateurData.prenom ||
      !realisateurData.dateNaissance
    )
      return showNotif("Champs du réalisateur incomplets", "error");
    setRealisateurConfirmed(true);
    showNotif("Réalisateur confirmé");
  };

  const confirmerProducteur = () => {
    if (
      !producteurData.code ||
      !producteurData.nom ||
      !producteurData.prenom ||
      !producteurData.dateNaissance
    )
      return showNotif("Champs du producteur incomplets", "error");
    setProducteurConfirmed(true);
    showNotif("Producteur confirmé");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageURL = URL.createObjectURL(file);
    setFilmData({ ...filmData, image: imageURL });
  };

  const enregistrerFilm = () => {
    if (
      !filmData.codeFilm ||
      !filmData.titre ||
      !filmData.dateFilm ||
      !filmData.sujet
    )
      return showNotif("Veuillez remplir tous les champs du film", "error");
    if (!realisateurConfirmed || !producteurConfirmed)
      return showNotif("Veuillez confirmer le réalisateur et le producteur", "error");

    const nouveauFilm = {
      ...filmData,
      realisateur: `${realisateurData.prenom} ${realisateurData.nom}`,
      producteur: `${producteurData.prenom} ${producteurData.nom}`,
    };

    setFilms([...films, nouveauFilm]);
    showNotif("Film enregistré avec succès !");
    setTimeout(() => {
      resetForm();
      setActiveForm("liste");
    }, 1500);
  };

  const resetForm = () => {
    setFilmData({ codeFilm: "", titre: "", dateFilm: "", sujet: "", image: null });
    setRealisateurData({ code: "", nom: "", prenom: "", dateNaissance: "" });
    setProducteurData({ code: "", nom: "", prenom: "", dateNaissance: "" });
    setRealisateurConfirmed(false);
    setProducteurConfirmed(false);
  };

  const supprimerFilm = (codeFilm) => {
    setFilms(films.filter((f) => f.codeFilm !== codeFilm));
    showNotif("Film supprimé", "success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 p-6">
      {showNotification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
            notificationType === "success"
              ? "bg-green-500"
              : notificationType === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          } text-white`}
        >
          {notificationType === "success" ? (
            <CheckCircle size={24} />
          ) : (
            <AlertCircle size={24} />
          )}
          <span className="font-medium">{notificationMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl shadow-2xl p-8 mb-6 text-white">
          <div className="flex items-center gap-4 mb-2">
            <Film size={40} />
            <div>
              <h1 className="text-3xl font-bold">Gestion des Films</h1>
              <p className="text-purple-100 mt-1">Module Inspection - Doc à Tunis</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setActiveForm("liste")}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold ${
              activeForm === "liste"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-700 hover:bg-purple-50"
            }`}
          >
            <Eye size={20} /> Liste
          </button>
          <button
            onClick={() => {
              setActiveForm("nouveau");
              resetForm();
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold ${
              activeForm === "nouveau"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-700 hover:bg-purple-50"
            }`}
          >
            <Film size={20} /> Nouveau Film
          </button>
        </div>

        {activeForm === "liste" && (
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center gap-2">
              <Eye size={28} /> Films enregistrés
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-100 border-b-2 border-purple-300">
                    <th className="px-4 py-3 text-left text-sm font-bold text-purple-900">Image</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-purple-900">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-purple-900">Titre</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-purple-900">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-purple-900">Sujet</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-purple-900">Réalisateur</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-purple-900">Producteur</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-purple-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {films.map((film, i) => (
                    <tr key={i} className="border-b hover:bg-purple-50">
                      <td className="px-4 py-3">
                        <img
                          src={film.image}
                          alt="Film"
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                      </td>
                      <td className="px-4 py-3">{film.codeFilm}</td>
                      <td className="px-4 py-3">{film.titre}</td>
                      <td className="px-4 py-3">{film.dateFilm}</td>
                      <td className="px-4 py-3">{film.sujet}</td>
                      <td className="px-4 py-3">{film.realisateur}</td>
                      <td className="px-4 py-3">{film.producteur}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => supprimerFilm(film.codeFilm)}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {films.length === 0 && (
                <p className="text-center text-gray-500 mt-8">Aucun film enregistré</p>
              )}
            </div>
          </div>
        )}

        {activeForm === "nouveau" && (
          <div className="space-y-6">
            {/* Réalisateur */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                <Users size={28} /> 1. Réalisateur{" "}
                {realisateurConfirmed && <CheckCircle className="text-green-500" />}
              </h2>
              <input
                type="text"
                placeholder="Code réalisateur"
                value={realisateurData.code}
                onChange={(e) =>
                  setRealisateurData({ ...realisateurData, code: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded"
              />
              <button
                onClick={() => rechercherPersonne(realisateurData.code, "realisateur")}
                className="bg-violet-500 text-white px-4 py-2 rounded mb-3"
              >
                <Search size={18} /> Rechercher
              </button>
              <input
                type="text"
                placeholder="Nom"
                value={realisateurData.nom}
                onChange={(e) =>
                  setRealisateurData({ ...realisateurData, nom: e.target.value })
                }
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Prénom"
                value={realisateurData.prenom}
                onChange={(e) =>
                  setRealisateurData({ ...realisateurData, prenom: e.target.value })
                }
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="date"
                value={realisateurData.dateNaissance}
                onChange={(e) =>
                  setRealisateurData({
                    ...realisateurData,
                    dateNaissance: e.target.value,
                  })
                }
                className="w-full mb-3 p-2 border rounded"
              />
              <button
                onClick={confirmerRealisateur}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                <CheckCircle size={18} /> Confirmer
              </button>
            </div>

            {/* Producteur */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                <Users size={28} /> 2. Producteur{" "}
                {producteurConfirmed && <CheckCircle className="text-green-500" />}
              </h2>
              <input
                type="text"
                placeholder="Code producteur"
                value={producteurData.code}
                onChange={(e) =>
                  setProducteurData({ ...producteurData, code: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded"
              />
              <button
                onClick={() => rechercherPersonne(producteurData.code, "producteur")}
                className="bg-violet-500 text-white px-4 py-2 rounded mb-3"
              >
                <Search size={18} /> Rechercher
              </button>
              <input
                type="text"
                placeholder="Nom"
                value={producteurData.nom}
                onChange={(e) =>
                  setProducteurData({ ...producteurData, nom: e.target.value })
                }
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Prénom"
                value={producteurData.prenom}
                onChange={(e) =>
                  setProducteurData({ ...producteurData, prenom: e.target.value })
                }
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="date"
                value={producteurData.dateNaissance}
                onChange={(e) =>
                  setProducteurData({
                    ...producteurData,
                    dateNaissance: e.target.value,
                  })
                }
                className="w-full mb-3 p-2 border rounded"
              />
              <button
                onClick={confirmerProducteur}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                <CheckCircle size={18} /> Confirmer
              </button>
            </div>

            {/* Film */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                <Film size={28} /> 3. Informations du Film
              </h2>
              <input
                type="text"
                placeholder="Code film"
                value={filmData.codeFilm}
                onChange={(e) =>
                  setFilmData({ ...filmData, codeFilm: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Titre"
                value={filmData.titre}
                onChange={(e) => setFilmData({ ...filmData, titre: e.target.value })}
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                type="date"
                value={filmData.dateFilm}
                onChange={(e) =>
                  setFilmData({ ...filmData, dateFilm: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Sujet"
                value={filmData.sujet}
                onChange={(e) => setFilmData({ ...filmData, sujet: e.target.value })}
                className="w-full mb-3 p-2 border rounded"
              />

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image du Film
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border p-2 rounded-lg"
                  />
                  {filmData.image && (
                    <img
                      src={filmData.image}
                      alt="Aperçu"
                      className="w-20 h-20 rounded-lg object-cover border"
                    />
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={enregistrerFilm}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Save size={20} /> Enregistrer
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setActiveForm("liste");
                  }}
                  className="px-8 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  <X size={20} /> Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default FormulaireInspection;
