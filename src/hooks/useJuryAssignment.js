"use client";

import { useState, useEffect, useCallback } from "react";

export function useJuryAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [jurys, setJurys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les jurys
  const loadJurys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/jurys");
      const data = await res.json();
      if (res.ok) setJurys(data.data || []);
      else throw new Error(data.message || "Erreur chargement jurys");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les assignations
  const loadAssignments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assignments");
      const data = await res.json();
      if (res.ok) setAssignments(data.data || []);
      else throw new Error(data.message || "Erreur chargement assignments");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ajouter assignation

  const assignJury = async ({ filmCode, juryCodes, date, heure, salle }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filmCode,
          jurys: juryCodes,  // correspond bien à ton backend
          date,
          heure,
          salle,
        }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'assignation");
  
      setAssignments((prev) => [...prev, ...data.data]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  


  // Supprimer assignation
  const deleteAssignment = async (id) => {
    if (!confirm("Confirmer la suppression de cette assignation ?")) return false;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/assignments/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur suppression assignation");
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour assignation
  const updateAssignment = async ({ id, filmCode, juryCodes, date, heure }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filmCode, jury: juryCodes, date, heure }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur mise à jour assignation");

      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data.data } : a))
      );

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJurys();
    loadAssignments();
  }, [loadJurys, loadAssignments]);

  return {
    assignments,
    jurys,
    isLoading,
    error,
    assignJury,
    deleteAssignment,
    updateAssignment,
    loadJurys,
    loadAssignments,
  };
}
