"use client";

import { useState, useEffect } from "react";

export function useProjection() {
  const [projections, setProjections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 🔹 Récupérer la liste des projections
  const fetchProjections = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projections");
      const data = await res.json();
      if (res.ok) {
        setProjections(data.data || []);
      } else {
        throw new Error(data.message || "Erreur lors du chargement des projections");
      }
    } catch (err) {
      setError(err.message);
      console.error("Erreur fetchProjections:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Ajouter une nouvelle projection (appelé depuis onSaved)
  const addProjection = (newProjection) => {
    setProjections((prev) => [...prev, newProjection]);
    setSuccess("Projection enregistrée avec succès");
  };

  // 🔹 Supprimer une projection
  const deleteProjection = async (idProjection) => {
    if (!confirm("Confirmer la suppression de cette projection ?")) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/projections/${idProjection}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la suppression");

      setProjections((prev) => prev.filter((p) => p.id !== idProjection));
      setSuccess("Projection supprimée");
    } catch (err) {
      setError(err.message);
      console.error("Erreur deleteProjection:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchProjections();
  }, []);

  return {
    projections,
    isLoading,
    error,
    success,
    fetchProjections,
    addProjection,
    deleteProjection,
  };
}