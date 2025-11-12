import { useState, useEffect } from "react";

export function useSelectionPresident() {
  const [jurys, setJurys] = useState([]);
  const [films, setFilms] = useState([]);
  const [assignations, setAssignations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAssignations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assignments");
      const data = await res.json();
      setAssignations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors du fetch des assignations :", err);
      setAssignations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resJ, resF] = await Promise.all([
          fetch("/api/jurys"),
          fetch("/api/films"),
        ]);

        const dataJurys = await resJ.json();
        const dataFilms = await resF.json();

        setJurys(Array.isArray(dataJurys) ? dataJurys : []);
        setFilms(Array.isArray(dataFilms) ? dataFilms : []);
      } catch (err) {
        console.error("Erreur lors du chargement des jurys/films :", err);
        setJurys([]);
        setFilms([]);
      }
    };

    fetchData();
    fetchAssignations();
  }, []);

  // ---- Envoi de la note ----
  const handleSaveNote = async (filmCode, juryCode, note) => {
    const parsed = parseFloat(note);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 10) return;

    try {
      const res = await fetch(`/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filmCode, juryCode, note: parsed }),
      });
      const data = await res.json();
      if (!data.success) console.error(data.error);
      await fetchAssignations();
    } catch (err) {
      console.error("Erreur lors de l'envoi de la note :", err);
    }
  };

  const handleDeleteNote = async (filmCode, juryCode) => {
    try {
      const res = await fetch(`/api/notes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filmCode, juryCode }),
      });
      const data = await res.json();
      if (!data.success) console.error(data.error);
      await fetchAssignations();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };
  

  return {
    jurys,
    films,
    assignations,
    loading,
    fetchAssignations,
    handleSaveNote,
    handleDeleteNote,
  };
}
