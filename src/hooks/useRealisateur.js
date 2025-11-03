"use client";
import { useState } from "react";

export function useRealisateur() {
  const [data, setData] = useState({
    code: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/realisateurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Échec de l'enregistrement");
      setSuccess(true);
      setData({ code: "", nom: "", prenom: "", dateNaissance: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, handleChange, handleSubmit, isLoading, success, error };
}
