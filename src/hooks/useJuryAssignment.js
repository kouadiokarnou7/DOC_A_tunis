"use client";

import { useState, useEffect, useCallback } from "react";

export function useJuryAssignment() {
  const [assignments, setAssignments] = useState([]); // liste film ↔ jury
  const [jurys, setJurys] = useState([]); // liste des membres du jury
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Charger les jurys depuis l'API
  const loadJurys = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jurys");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur chargement jurys");
      setJurys(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔹 Charger les assignations existantes
  const loadAssignments = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/assignments");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur chargement assignations");
      setAssignments(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔹 Ajouter une assignation film ↔ jury (plusieurs jurys possibles)
  const assignJury = async ({ filmCode, juryCodes, date, heure, salle }) => {
    if (!filmCode || !juryCodes?.length || !date || !heure || !salle) {
      setError("Champs obligatoires manquants !");
      return false;
    }

    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ films: [filmCode], juryCodes, date, heure, salle }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'assignation");

      setAssignments((prev) => [...prev, ...data.data]);
      return true;
    } catch (err) {
      setError(err.message);
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Supprimer une assignation
  const deleteAssignment = async (id) => {
    if (!id) return false;
    if (!confirm("Confirmer la suppression de cette assignation ?")) return false;

    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/assignments?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur suppression assignation");

      setAssignments((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Mettre à jour une assignation
  const updateAssignment = async ({ id, filmCode, juryCodes, date, heure, salle }) => {
    if (!id || !filmCode || !juryCodes?.length || !date || !heure || !salle) {
      setError("Champs obligatoires manquants !");
      return false;
    }

    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/assignments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, films: [filmCode], juryCodes, date, heure, salle }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur mise à jour assignation");

      // Mettre à jour localement
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data.data.find(d => d.id === id) } : a))
      );

      return true;
    } catch (err) {
      setError(err.message);
      console.error(err);
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
