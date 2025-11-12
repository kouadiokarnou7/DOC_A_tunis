"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users as UsersIcon,
  Save,
  Film as FilmIcon,
  CheckCircle2,
  X
} from "lucide-react";

export default function AssignJuryModal({ isOpen, onClose, projection, jurys = [], onAssign }) {
  const [selectedJuryCodes, setSelectedJuryCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // message d'erreur visible

  useEffect(() => {
    setSelectedJuryCodes([]);
    setErrorMsg(""); // réinitialiser erreur si projection change
  }, [projection]);

  if (!projection) return null;

  const filmTitle = projection?.film?.titre || "";
  const filmCode = projection?.filmCode || "";
  const projectionDate = projection?.dateProjection
    ? new Date(projection.dateProjection).toISOString().split("T")[0]
    : "";
  const projectionHeure = projection?.heure || "";
  const projectionSalle = projection?.salle || "";

  // onAssign attend maintenant { filmCode, juryCodes, date, heure, salle }
const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg("");

  if (!filmCode) return setErrorMsg("Erreur : Film manquant !");
  if (!selectedJuryCodes.length) return setErrorMsg("Veuillez sélectionner au moins un membre du jury !");
  if (!projectionDate) return setErrorMsg("Erreur : Date de projection manquante !");
  if (!projectionHeure) return setErrorMsg("Erreur : Heure de projection manquante !");
  if (!projectionSalle) return setErrorMsg("Erreur : Salle de projection manquante !");

  setLoading(true);
  try {
    const result = await onAssign({
      filmCode,
      juryCodes: selectedJuryCodes,
      date: projectionDate,
      heure: projectionHeure,
      salle: projectionSalle
    });
    if (result) onClose();
  } catch (err) {
    console.error(err);
    setErrorMsg("Erreur lors de l'assignation. Veuillez réessayer.");
  } finally {
    setLoading(false);
  }
};

   

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-700 flex items-center gap-2">
            <UsersIcon className="w-6 h-6" />
            Assigner un Jury
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Carte projection */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-50">
            <CardContent className="p-5">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <FilmIcon className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-purple-900">Projection planifiée</h3>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <Label className="text-sm font-semibold text-gray-600 mb-2 block">Film</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-lg font-bold text-gray-900">{filmTitle || "Film non disponible"}</p>
                      {filmCode && (
                        <Badge variant="outline" className="mt-1 text-xs text-purple-600 border-purple-300">
                          Code: {filmCode}
                        </Badge>
                      )}
                    </div>
                    {filmCode && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affichage message d'erreur */}
          {errorMsg && (
            <div className="text-red-600 font-semibold bg-red-100 p-3 rounded-md">{errorMsg}</div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label className="text-base font-bold text-purple-900 flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-purple-600" />
                Sélectionner les membres du jury <span className="text-red-500">*</span>
              </Label>
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
                              setSelectedJuryCodes(selectedJuryCodes.filter((c) => c !== j.code));
                            }
                          }}
                          className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{j.prenom} {j.nom}</p>
                          {j.code && <p className="text-xs text-gray-500">Code: {j.code}</p>}
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-600" />}
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex items-center gap-2 px-6">
                <X className="w-4 h-4" /> Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading || selectedJuryCodes.length === 0}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white flex items-center gap-2 px-6 font-semibold shadow-lg"
              >
                <Save className="w-4 h-4" /> {loading ? "Enregistrement..." : "Assigner le jury"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
