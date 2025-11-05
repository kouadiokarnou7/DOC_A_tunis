"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CalendarDays, Clock, Building, Save, X } from "lucide-react";

export default function ModalProjection({ onClose, onSaved }) {
  const [films, setFilms] = useState([]);
  const [form, setForm] = useState({
    filmCode: "",
    dateProjection: "",
    heure: "",
    salle: "",
  });
  const [loading, setLoading] = useState(false);

  // Lieux de cinéma connus en Tunisie
  const salles = [
    "CinéMadart - Carthage",
    "Le Colisée - Tunis",
    "CinéJamil - El Menzah 6",
    "CinéVog - Sousse",
    "CinéStar - Sfax",
    "Le Palace - Tunis",
    "Amilcar - La Marsa",
    "CinéAtlas - Tunis",
  ];

  useEffect(() => {
    async function fetchFilms() {
      try {
        const res = await fetch("/api/films");
        const data = await res.json();
        setFilms(data.data || []);
      } catch (error) {
        console.error("Erreur chargement films:", error);
      }
    }
    fetchFilms();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/projections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        onSaved?.(data.data);
        onClose();
      } else {
        alert(data.message || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Film */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            Film <span className="text-red-500">*</span>
          </Label>
          <Select 
            onValueChange={(val) => handleChange("filmCode", val)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un film" />
            </SelectTrigger>
            <SelectContent>
              {films.length === 0 ? (
                <SelectItem value="none" disabled>
                  Aucun film disponible
                </SelectItem>
              ) : (
                films.map((f) => (
                  <SelectItem key={f.codeFilm} value={f.codeFilm}>
                    {f.titre}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="dateProjection" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <CalendarDays className="w-4 h-4 text-purple-600" /> 
            Date de projection <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dateProjection"
            type="date"
            value={form.dateProjection}
            onChange={(e) => handleChange("dateProjection", e.target.value)}
            required
            className="w-full"
          />
        </div>

        {/* Heure */}
        <div className="space-y-2">
          <Label htmlFor="heure" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Clock className="w-4 h-4 text-purple-600" /> 
            Heure <span className="text-red-500">*</span>
          </Label>
          <Input
            id="heure"
            type="time"
            value={form.heure}
            onChange={(e) => handleChange("heure", e.target.value)}
            required
            className="w-full"
          />
        </div>

        {/* Salle */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Building className="w-4 h-4 text-purple-600" /> 
            Salle de cinéma <span className="text-red-500">*</span>
          </Label>
          <Select 
            onValueChange={(val) => handleChange("salle", val)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir une salle" />
            </SelectTrigger>
            <SelectContent>
              {salles.map((s, i) => (
                <SelectItem key={i} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-90 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> 
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
}