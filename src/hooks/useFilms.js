"use client";

import { useState, useEffect, useCallback } from "react";

export function useFilms() {
  const [films, setFilms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 🔹 Récupérer la liste des films
  const fetchFilms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/films");
      const data = await res.json();
      if (res.ok) {
        setFilms(data.data || []);
      } else {
        throw new Error(data.message || "Erreur lors du chargement des films");
      }
    } catch (err) {
      setError(err.message);
      console.error("Erreur fetchFilms:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔹 Ajouter un nouveau film
  const addFilm = useCallback((newFilm) => {
    setFilms((prev) => [...prev, newFilm]);
    setSuccess("Film enregistré avec succès");
  }, []);

  // 🔹 Supprimer un film
  const deleteFilm = useCallback(async (codeFilm) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/films/${codeFilm}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la suppression");

      setFilms((prev) => prev.filter((f) => f.codeFilm !== codeFilm));
      setSuccess("Film supprimé");
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Erreur deleteFilm:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  return {
    films,
    isLoading,
    error,
    success,
    fetchFilms,
    addFilm,
    deleteFilm,
  };
}

