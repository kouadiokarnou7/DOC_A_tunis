"use client";

import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Users as UsersIcon, X, Save, Film as FilmIcon, MapPin, CheckCircle2 } from "lucide-react";

export default function AssignJuryModal({ onClose, projection, jurys = [], onAssign }) {
  const [selectedJuryCodes, setSelectedJuryCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Récupérer les informations de la projection
  const filmTitle = projection?.film?.titre || "Film non disponible";
  const filmCode = projection?.filmCode || "";
  const projectionDate = projection?.dateProjection 
    ? new Date(projection.dateProjection).toISOString().split('T')[0] 
    : "";
  const projectionDateFormatted = projection?.dateProjection
    ? new Date(projection.dateProjection).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "";
  const projectionHeure = projection?.heure || "";
  const projectionSalle = projection?.salle || "";

  // Pré-sélectionner les jurys déjà assignés à cette projection (optionnel)
  // Vous pouvez charger les assignments existants si nécessaire

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!projection?.filmCode) {
      alert("Erreur : Aucune projection sélectionnée !");
      return;
    }

    if (selectedJuryCodes.length === 0) {
      alert("Veuillez sélectionner au moins un membre du jury !");
      return;
    }

    setLoading(true);
    
    try {
      // Appeler la fonction onAssign avec les données de la projection
      const result = await onAssign({
        filmCode: projection.filmCode,
        juryCodes: selectedJuryCodes,
        date: projectionDate,
        heure: projectionHeure,
        salle: projectionSalle, 
      });

      if (result) {
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de l'assignation:", error);
      alert("Une erreur est survenue lors de l'assignation.");
    } finally {
      setLoading(false);
    }
  };

  if (!projection) {
    return null;
  }

  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-purple-700 flex items-center gap-2">
          <UsersIcon className="w-6 h-6" />
          Assigner un Jury
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 p-4">
        {/* Carte d'information sur la projection */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-50">
          <CardContent className="p-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <FilmIcon className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-purple-900">Projection planifiée</h3>
              </div>
              
              {/* Film */}
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <Label className="text-sm font-semibold text-gray-600 mb-2 block">Film</Label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-900">{filmTitle}</p>
                    {filmCode && (
                      <Badge variant="outline" className="mt-1 text-xs text-purple-600 border-purple-300">
                        Code: {filmCode}
                      </Badge>
                    )}
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              </div>

              {/* Date et Heure */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <Label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-purple-600" />
                    Date
                  </Label>
                  <p className="text-base font-semibold text-gray-900">{projectionDateFormatted}</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <Label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    Heure
                  </Label>
                  <p className="text-base font-semibold text-gray-900">{projectionHeure}</p>
                </div>
              </div>

              {/* Salle */}
              {projectionSalle && (
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <Label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    Salle
                  </Label>
                  <p className="text-base font-semibold text-gray-900">{projectionSalle}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

          {/* Formulaire de sélection du jury */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-bold text-purple-900 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-purple-600" />
              Sélectionner les membres du jury <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600 mb-3">
              Cochez un ou plusieurs membres du jury pour cette projection
            </p>
            
            {/* Liste des jurys avec checkboxes */}
            <div className="border-2 border-purple-200 rounded-lg p-4 bg-white max-h-64 overflow-y-auto space-y-3">
              {jurys.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucun jury disponible</p>
              ) : (
                jurys.map((j) => {
                  const isSelected = selectedJuryCodes.includes(j.code);
                  return (
                    <label
                      key={j.code}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedJuryCodes([...selectedJuryCodes, j.code]);
                          } else {
                            setSelectedJuryCodes(selectedJuryCodes.filter(code => code !== j.code));
                          }
                        }}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {j.prenom} {j.nom}
                        </p>
                        {j.code && (
                          <p className="text-xs text-gray-500">Code: {j.code}</p>
                        )}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      )}
                    </label>
                  );
                })
              )}
            </div>
            
            {/* Affichage des jurys sélectionnés */}
            {selectedJuryCodes.length > 0 && (
              <div className="mt-3 space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Membres sélectionnés ({selectedJuryCodes.length}) :
                </Label>
                <div className="flex flex-wrap gap-2">
                  {selectedJuryCodes.map((code) => {
                    const jury = jurys.find(j => j.code === code);
                    if (!jury) return null;
                    return (
                      <Badge 
                        key={code} 
                        className="bg-purple-100 text-purple-700 border-purple-300 px-3 py-1.5 text-sm font-semibold flex items-center gap-1"
                      >
                        <UsersIcon className="w-3 h-3" />
                        {jury.prenom} {jury.nom}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {jurys.length > 0 && selectedJuryCodes.length === 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                ⚠️ Veuillez sélectionner au moins un membre du jury
              </p>
            )}
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose} 
              className="flex items-center gap-2 px-6"
              disabled={loading}
            >
              <X className="w-4 h-4" /> Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading || selectedJuryCodes.length === 0}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white flex items-center gap-2 px-6 font-semibold shadow-lg"
            >
              <Save className="w-4 h-4" /> 
              {loading ? "Enregistrement..." : "Assigner le jury"}
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
