"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export function useFilm() {
  const [filmData, setFilmData] = useState({
    codeFilm: "",
    titre: "",
    dateFilm: "",
    sujet: "",
    resume: "",
    codeRealisateur: "",
    codeProducteur: "",
    image: null,
  });

  const [realisateurs, setRealisateurs] = useState([]);
  const [producteurs, setProducteurs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Charger réalisateurs + producteurs
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

  const resetForm = () => {
    setFilmData({
      codeFilm: "",
      titre: "",
      dateFilm: "",
      sujet: "",
      resume: "",
      codeRealisateur: "",
      codeProducteur: "",
      image: null,
    });
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
      const formData = new FormData();
      for (const key in filmData) {
        if (filmData[key]) formData.append(key, filmData[key]);
      }

      const response = await axios.post("/api/films", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setSuccess(true);
        resetForm(); 
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
    } catch (err) {
      setError(err.response?.data?.error || "Erreur réseau ou serveur");
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
    deleteFilm,
  };
}
