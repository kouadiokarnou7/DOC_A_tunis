"use client";

import { useState, useEffect } from "react";

export default function useNotesPresident() {
  const [films, setFilms] = useState([]);
  const [jurys, setJurys] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [resFilms, resJurys, resNotes] = await Promise.all([
          fetch("/api/films"),
          fetch("/api/jurys"),
          fetch("/api/notes"),
        ]);

        if (!resFilms.ok || !resJurys.ok || !resNotes.ok)
          throw new Error("Erreur de chargement des données");

        const filmsData = await resFilms.json();
        const jurysData = await resJurys.json();
        const notesData = await resNotes.json();

        setFilms(filmsData.data || filmsData);
        setJurys(jurysData.data || jurysData);
        setNotes(notesData.data || notesData);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setFilms([]);
        setJurys([]);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour enregistrer une note
  const saveNote = async (filmCode, juryCode, note) => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filmCode, juryCode, note }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement de la note");

      const saved = await res.json();
      setNotes((prev) => {
        const existing = prev.find(
          (n) => n.filmCode === filmCode && n.juryCode === juryCode
        );
        if (existing) existing.note = note;
        else prev.push(saved);
        return [...prev];
      });
    } catch (err) {
      console.error(err);
    }
  };

  return { films, jurys, notes, loading, saveNote };
}
