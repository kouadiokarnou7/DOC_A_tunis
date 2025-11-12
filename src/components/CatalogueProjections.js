"use client"; // important si tu utilises useState/useEffect côté client

import { useState, useEffect } from "react";

export default function CatalogueProjections() {
  const [publishedProjections, setPublishedProjections] = useState([]);

  const loadProjections = async () => {
    try {
      const res = await fetch("/api/assignments");
      const data = await res.json();
      if (res.ok && data.data) {
        const projections = data.data.map((assign) => {
          const film = assign.film || {};
          return {
            id: assign.id,
            titre: film.titre || "Titre non disponible",
            resume: film.resume || "Résumé non disponible",
            image: film.image || "/placeholder.png",
            date: assign.dateAssignation ? new Date(assign.dateAssignation).toLocaleDateString() : "",
            heure: assign.heure || "",
            salle: assign.salle || "",
          };
        });
        setPublishedProjections(projections);
      }
    } catch (err) {
      console.error("Erreur chargement projections :", err);
    }
  };

  useEffect(() => {
    loadProjections();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {publishedProjections.map((p) => (
        <div key={p.id} className="border p-4 rounded-lg shadow-lg bg-white">
          <img src={p.image} alt={p.titre} className="w-full h-48 object-cover rounded" />
          <h2 className="mt-2 text-lg font-bold">{p.titre}</h2>
          <p className="text-gray-600 mt-1">{p.resume}</p>
          <p className="mt-2 text-sm text-gray-500">
            {p.date} à {p.heure} - Salle: {p.salle}
          </p>
        </div>
      ))}
    </div>
  );
}
