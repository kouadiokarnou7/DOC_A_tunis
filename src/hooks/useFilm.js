// hooks/useFilm.js
"use client";
import { useState, useEffect } from "react";

export function useFilm() {
  // ✅ Initialisation : realisateur et producteur sont des CHAÎNES VIDES, pas des objets !
  const [filmData, setFilmData] = useState({
    codeFilm: "",
    titre: "",
    dateFilm: "",
    sujet: "",
    realisateur: "", // ← STRING (code), pas un objet
    producteur: "",  // ← STRING (code)
    image: "",
  });

  const [realisateurs, setRealisateurs] = useState([]);
  const [producteurs, setProducteurs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Charger les réalisateurs et producteurs (exemple avec fetch)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [realRes, prodRes] = await Promise.all([
          fetch("/api/realisateurs"),
          fetch("/api/producteurs"),
        ]);
        const realisateursData = await realRes.json();
        const producteursData = await prodRes.json();
        setRealisateurs(realisateursData);
        setProducteurs(producteursData);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilmData((prev) => ({
            ...prev,
            image: reader.result, // base64 string
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      // ✅ Ici, value est toujours une chaîne (même pour <select>)
      setFilmData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/films", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filmData),
      });

      if (response.ok) {
        setSuccess(true);
        // Réinitialiser ou appeler onSaved si besoin
      } else {
        const data = await response.json();
        setError(data.message || "Erreur lors de l'enregistrement.");
      }
    } catch (err) {
      setError("Erreur réseau.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    filmData,
    handleChange,
    handleSubmit,
    isLoading,
    error,
    success,
    realisateurs,
    producteurs,
  };
}