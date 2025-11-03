"use client";
import { useState, useEffect } from "react";

export function useFilm() {
  const [filmData, setFilmData] = useState({
    codeFilm: "",
    titre: "",
    dateFilm: "",
    sujet: "",
    codeRealisateur: "", // correspond à l'API
    codeProducteur: "",  // correspond à l'API
    image: "",           // base64
  });

  const [realisateurs, setRealisateurs] = useState([]);
  const [producteurs, setProducteurs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Charger les réalisateurs et producteurs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [realRes, prodRes] = await Promise.all([
          fetch("/api/realisateurs"),
          fetch("/api/producteurs"),
        ]);

        const realData = await realRes.json();
        const prodData = await prodRes.json();

        setRealisateurs(Array.isArray(realData.data) ? realData.data : []);
        setProducteurs(Array.isArray(prodData.data) ? prodData.data : []);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
        setRealisateurs([]);
        setProducteurs([]);
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
          setFilmData((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFilmData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    if (!filmData.codeRealisateur || !filmData.codeProducteur) {
      setError("Veuillez sélectionner un réalisateur et un producteur");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/films", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filmData),
      });

      if (response.ok) {
        setSuccess(true);
        // Optionnel : reset du formulaire
        // setFilmData({ codeFilm: "", titre: "", dateFilm: "", sujet: "", codeRealisateur: "", codeProducteur: "", image: "" });
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de l'enregistrement.");
      }
    } catch {
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
