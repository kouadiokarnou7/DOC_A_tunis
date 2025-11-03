"use client";

import { useState } from "react";

export function useFormulaireFilm() {
  const [activeForm, setActiveForm] = useState("liste");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  // Film
  const [filmData, setFilmData] = useState({
    codeFilm: "",
    titre: "",
    dateFilm: "",
    sujet: "",
    image: null,
  });

  // Réalisateur
  const [realisateurData, setRealisateurData] = useState({
    code: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
  });

  // Producteur
  const [producteurData, setProducteurData] = useState({
    code: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
  });

  const [realisateurConfirmed, setRealisateurConfirmed] = useState(false);
  const [producteurConfirmed, setProducteurConfirmed] = useState(false);

  // Liste des films
  const [films, setFilms] = useState([]);

  // Notification
  const showNotif = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Rechercher une personne simulée
  const rechercherPersonne = (code, type) => {
    const personnesExistantes = {
      R001: { code: "R001", nom: "Ben Ali", prenom: "Ahmed", dateNaissance: "1975-03-12" },
      P001: { code: "P001", nom: "Trabelsi", prenom: "Mohamed", dateNaissance: "1970-11-08" },
    };

    if (personnesExistantes[code]) {
      if (type === "realisateur") setRealisateurData(personnesExistantes[code]);
      else setProducteurData(personnesExistantes[code]);
      showNotif(`${type} trouvé dans la base`, "success");
    } else showNotif("Personne non trouvée", "info");
  };

  // Confirmer
  const confirmerRealisateur = () => {
    if (!realisateurData.code || !realisateurData.nom || !realisateurData.prenom || !realisateurData.dateNaissance)
      return showNotif("Champs du réalisateur incomplets", "error");
    setRealisateurConfirmed(true);
    showNotif("Réalisateur confirmé");
  };

  const confirmerProducteur = () => {
    if (!producteurData.code || !producteurData.nom || !producteurData.prenom || !producteurData.dateNaissance)
      return showNotif("Champs du producteur incomplets", "error");
    setProducteurConfirmed(true);
    showNotif("Producteur confirmé");
  };

  // Upload image
  const handleImageUpload = (file) => {
    if (!file) return;
    const imageURL = URL.createObjectURL(file);
    setFilmData({ ...filmData, image: imageURL });
  };

  // Enregistrer film
  const enregistrerFilm = () => {
    if (!filmData.codeFilm || !filmData.titre || !filmData.dateFilm || !filmData.sujet)
      return showNotif("Veuillez remplir tous les champs du film", "error");
    if (!realisateurConfirmed || !producteurConfirmed)
      return showNotif("Veuillez confirmer le réalisateur et le producteur", "error");

    const nouveauFilm = {
      ...filmData,
      realisateur: `${realisateurData.prenom} ${realisateurData.nom}`,
      producteur: `${producteurData.prenom} ${producteurData.nom}`,
    };

    setFilms([...films, nouveauFilm]);
    showNotif("Film enregistré avec succès !");
    resetForm();
    setActiveForm("liste");
  };

  // Supprimer film
  const supprimerFilm = (codeFilm) => {
    setFilms(films.filter((f) => f.codeFilm !== codeFilm));
    showNotif("Film supprimé", "success");
  };

  // Reset formulaire
  const resetForm = () => {
    setFilmData({ codeFilm: "", titre: "", dateFilm: "", sujet: "", image: null });
    setRealisateurData({ code: "", nom: "", prenom: "", dateNaissance: "" });
    setProducteurData({ code: "", nom: "", prenom: "", dateNaissance: "" });
    setRealisateurConfirmed(false);
    setProducteurConfirmed(false);
  };

  return {
    activeForm,
    setActiveForm,
    showNotification,
    notificationMessage,
    notificationType,
    showNotif,
    filmData,
    setFilmData,
    realisateurData,
    setRealisateurData,
    producteurData,
    setProducteurData,
    realisateurConfirmed,
    setRealisateurConfirmed,
    producteurConfirmed,
    setProducteurConfirmed,
    films,
    rechercherPersonne,
    confirmerRealisateur,
    confirmerProducteur,
    handleImageUpload,
    enregistrerFilm,
    supprimerFilm,
    resetForm,
  };
}
