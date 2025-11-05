"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export function useFilm() {
  const [filmData, setFilmData] = useState({
    codeFilm: "",
    titre: "",
    dateFilm: "",
    sujet: "",
    codeRealisateur: "",
    codeProducteur: "",
    image: null, // on stocke le File ici
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
          axios.get("/api/realisateurs"),
          axios.get("/api/producteurs"),
        ]);

        setRealisateurs(Array.isArray(realRes.data.data) ? realRes.data.data : []);
        setProducteurs(Array.isArray(prodRes.data.data) ? prodRes.data.data : []);
      } catch {
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
      setFilmData((prev) => ({ ...prev, image: file }));
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
      // Création du FormData
      const formData = new FormData();
      formData.append("codeFilm", filmData.codeFilm);
      formData.append("titre", filmData.titre);
      formData.append("dateFilm", filmData.dateFilm);
      formData.append("sujet", filmData.sujet);
      formData.append("codeRealisateur", filmData.codeRealisateur);
      formData.append("codeProducteur", filmData.codeProducteur);
      if (filmData.image) formData.append("image", filmData.image);

      // Envoi via Axios
      const response = await axios.post("/api/films", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.error || "Erreur lors de l'enregistrement.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erreur réseau ou serveur");
    } finally {
      setIsLoading(false);
    }
  };
  const deleteFilm = async (codeFilm) => {
    try {
      const response = await axios.delete(`/api/films/${codeFilm}`);
      if (response.data.success) {
        setSuccess(true);
      }
    }
    catch (err) {
      setError(err.response?.data?.error || "Erreur réseau ou serveur");
    }
    finally {
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
    deleteFilm,
  };
}
