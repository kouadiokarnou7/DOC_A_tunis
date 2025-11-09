"use client";

import { useState, useEffect, useCallback } from "react";

export function useRealisateurs() {
  const [realisateurs, setRealisateurs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 🔹 Récupérer la liste des réalisateurs
  const fetchRealisateurs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/realisateurs");
      const data = await res.json();
      if (res.ok) {
        setRealisateurs(data.data || []);
      } else {
        throw new Error(data.message || "Erreur lors du chargement des réalisateurs");
      }
    } catch (err) {
      setError(err.message);
      console.error("Erreur fetchRealisateurs:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔹 Ajouter un nouveau réalisateur
  const addRealisateur = useCallback((newRealisateur) => {
    setRealisateurs((prev) => [...prev, newRealisateur]);
    setSuccess("Réalisateur enregistré avec succès");
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchRealisateurs();
  }, [fetchRealisateurs]);

  return {
    realisateurs,
    isLoading,
    error,
    success,
    fetchRealisateurs,
    addRealisateur,
  };
}

