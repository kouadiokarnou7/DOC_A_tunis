"use client";

import { useState, useEffect, useCallback } from "react";

export function useProducteurs() {
  const [producteurs, setProducteurs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 🔹 Récupérer la liste des producteurs
  const fetchProducteurs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/producteurs");
      const data = await res.json();
      if (res.ok) {
        setProducteurs(data.data || []);
      } else {
        throw new Error(data.message || "Erreur lors du chargement des producteurs");
      }
    } catch (err) {
      setError(err.message);
      console.error("Erreur fetchProducteurs:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔹 Ajouter un nouveau producteur
  const addProducteur = useCallback((newProducteur) => {
    setProducteurs((prev) => [...prev, newProducteur]);
    setSuccess("Producteur enregistré avec succès");
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchProducteurs();
  }, [fetchProducteurs]);

  return {
    producteurs,
    isLoading,
    error,
    success,
    fetchProducteurs,
    addProducteur,
  };
}

