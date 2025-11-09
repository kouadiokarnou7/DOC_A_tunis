"use client";

import { useState, useEffect, useCallback } from "react";

export function useJuryAssignment() {
  const [assignments, setAssignments] = useState([]); // liste film ↔ jury
  const [jurys, setJurys] = useState([]); // liste des membres du jury
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Charger les jurys depuis l'API
  const loadJurys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/jurys");
      const data = await res.json();
      if (res.ok) {
        setJurys(data.data || []);
      } else {
        throw new Error(data.message || "Erreur chargement jurys");
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔹 Charger les assignments existants
  const loadAssignments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assignments"); // endpoint à créer
      const data = await res.json();
      if (res.ok) {
        setAssignments(data.data || []);
      } else {
        throw new Error(data.message || "Erreur chargement assignments");
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔹 Ajouter une assignation film ↔ jury
  const assignJury = async ({ filmCode, juryCodes, date, heure }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ films: [filmCode], jury: juryCodes, date, heure }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de l'assignation");
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
    if (!confirm("Confirmer la suppression de cette assignation ?")) return false;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/assignments?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur suppression assignation");
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
  const updateAssignment = async ({ id, filmCode, juryCode, date, heure }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assignments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, films: [filmCode], jury: juryCode, date, heure }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur mise à jour assignation");

      // Mettre à jour localement
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data.data[0] } : a))
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
