"use client";

import { useState } from "react";
import { useProjection } from "@/hooks/useprojection";
import { useJuryAssignment } from "@/hooks/useJuryAssignment";
import useConnexion from "@/hooks/hookconnexion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { Loader2, Plus, Trash2, Calendar, Film, Send, Edit, Users, Clock, MapPin, CheckCircle2, XCircle, LogOut } from "lucide-react";
import ModalProjection from "@/components/modal/Addprojectionmodal";
import ModalJury from "@/components/modal/AssignJuryModal";

export default function ProductionPage() {
  const { projections, isLoading, addProjection, deleteProjection, fetchProjections } = useProjection();
  const { assignments, jurys, assignJury, deleteAssignment, loadAssignments } = useJuryAssignment();
  const { user, logout } = useConnexion();

  const [openModalProjection, setOpenModalProjection] = useState(false);
  const [openModalJury, setOpenModalJury] = useState(false);
  const [selectedProjection, setSelectedProjection] = useState(null);

  const handleProjectionSaved = async (newProjection) => {
    await fetchProjections();
    setOpenModalProjection(false);
  };

  const handleAssignJuryClick = (projection) => {
    setSelectedProjection(projection);
    setOpenModalJury(true);
  };

  const handleJuryAssign = async (data) => {
    try {
      const result = await assignJury(data);
      if (result) {
        // Recharger les assignments pour mettre à jour l'affichage
        await loadAssignments();
        setOpenModalJury(false);
      }
      return result;
    } catch (error) {
      console.error("Erreur lors de l'assignation:", error);
      alert("Erreur lors de l'assignation du jury.");
      return false;
    }
  };

  const publishProjection = (projection) => {
    const filmTitle = projection?.film?.titre || projection?.titre || "ce film";
    alert(`Projection de "${filmTitle}" publiée !`);
  };

  const getAssignedJury = (projection) => {
    return assignments
      .filter(a => a.filmCode === projection.filmCode)
      .map(a => `${a.jury?.prenom || ""} ${a.jury?.nom || ""}`)
      .filter(name => name.trim());
  };

  const handleLogout = () => {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      logout?.() || alert("Déconnexion");
    }
  };

  const handleDelete = (projectionId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette projection ?")) {
      deleteProjection(projectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-fuchsia-900 to-violet-950 p-4 md:p-8 relative overflow-hidden">
      {/* Effets de fond animés */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '700ms'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1000ms'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Header avec utilisateur connecté */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-sm bg-white/10 p-6 rounded-2xl border border-white/20 shadow-2xl">
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3 drop-shadow-lg">
              <div className="p-2 bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-xl shadow-lg">
                <Film className="w-8 h-8" />
              </div>
              Gestion des Projections
            </h1>
            <p className="text-purple-200 mt-2 font-medium ml-14">
              {isLoading 
                ? "Chargement..." 
                : `${projections.length} projection${projections.length !== 1 ? 's' : ''} planifiée${projections.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          
          {user && (
            <div className="relative group">
              <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 p-[2px] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-white px-5 py-3 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user.nomComplet?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Connecté</p>
                    <p className="font-bold text-purple-700">{user.nomComplet}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Déconnexion
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bouton Ajouter en haut */}
        <div className="flex justify-end">
          <Button
            className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 flex items-center gap-2 shadow-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300 font-bold text-lg px-6 py-6"
            onClick={() => setOpenModalProjection(true)}
          >
            <Plus className="h-6 w-6" /> Ajouter une projection
          </Button>
        </div>

        {/* Carte principale avec tableau */}
        <Card className="shadow-2xl border-2 border-purple-400/30 backdrop-blur-sm bg-white/95 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-violet-600 border-b-4 border-purple-800">
            <CardTitle className="text-2xl font-black text-white flex items-center gap-3 drop-shadow-md">
              <Calendar className="w-6 h-6" /> 
              Planning des Projections
              {projections.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-white text-purple-700 font-bold text-base px-3 py-1">
                  {projections.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-16">
                <Loader2 className="animate-spin text-purple-600 w-12 h-12 mb-4" />
                <span className="text-gray-600 font-medium">Chargement des projections...</span>
              </div>
            ) : projections.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-purple-100 to-fuchsia-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Film className="w-12 h-12 text-purple-600" />
                </div>
                <p className="text-gray-700 font-bold text-xl mb-2">Aucune projection planifiée</p>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">Commencez par ajouter votre première projection</p>
                <Button
                  onClick={() => setOpenModalProjection(true)}
                  className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 shadow-lg hover:scale-105 transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" /> Créer une projection
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-purple-100 to-fuchsia-100 border-b-2 border-purple-300 hover:bg-gradient-to-r hover:from-purple-100 hover:to-fuchsia-100">
                      <TableHead className="font-bold text-purple-900 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4" /> Film
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-purple-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Date
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-purple-900">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Heure
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-purple-900">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Salle
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-purple-900 min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" /> Jury
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-purple-900 text-right min-w-[300px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projections.map((p) => {
                      const filmTitle = p?.film?.titre || "Film non disponible";
                      const filmCode = p?.filmCode || "";
                      const juryList = getAssignedJury(p);
                      const hasJury = juryList.length > 0;
                      const isPublished = p?.statut === "publié";

                      return (
                        <TableRow key={p.id} className="hover:bg-purple-50 transition-colors border-b border-purple-100">
                          <TableCell className="font-medium">
                            <div className="flex flex-col gap-1">
                              <span className="text-gray-900 font-bold">{filmTitle}</span>
                              {filmCode && (
                                <Badge variant="outline" className="text-xs text-purple-600 border-purple-300 w-fit">
                                  {filmCode}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-purple-500" />
                              <span className="font-medium">
                                {new Date(p.dateProjection).toLocaleDateString("fr-FR", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700 font-semibold">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-purple-500" />
                              {p.heure}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-medium border-purple-300">
                              <MapPin className="w-3 h-3 mr-1" />
                              {p.salle}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {hasJury ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-sm text-gray-700 bg-green-50 px-2 py-1 rounded-md font-medium">
                                  {juryList.join(", ")}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <XCircle className="w-4 h-4 text-orange-400" />
                                <span className="text-sm text-gray-400 italic">Non assigné</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2 flex-wrap">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAssignJuryClick(p)}
                                className="hover:bg-purple-50 hover:text-purple-700 hover:border-purple-400 transition-all font-semibold"
                              >
                                <Users className="w-4 h-4 mr-1" />
                                {hasJury ? "Modifier" : "Assigner"}
                              </Button>

                              {!isPublished ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => alert("Modifier - À venir")}
                                    className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 transition-all"
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Modifier
                                  </Button>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => publishProjection(p)}
                                    className="bg-green-600 text-white hover:bg-green-700 border-green-600 transition-all font-semibold"
                                  >
                                    <Send className="w-4 h-4 mr-1" />
                                    Publier
                                  </Button>
                                </>
                              ) : (
                                <Badge className="bg-green-100 text-green-700 border-green-300 hover:bg-green-100 font-semibold">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Publié
                                </Badge>
                              )}

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(p.id)}
                                className="hover:bg-red-700 transition-all"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Supprimer
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Modal Projection */}
      <Dialog open={openModalProjection} onOpenChange={setOpenModalProjection}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-purple-700 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Planifier une nouvelle projection
            </DialogTitle>
          </DialogHeader>
          <ModalProjection 
            onClose={() => setOpenModalProjection(false)}
            onSaved={handleProjectionSaved}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Jury */}
      {openModalJury && (
        <ModalJury
          projection={selectedProjection}
          jurys={jurys}
          onClose={() => {
            setOpenModalJury(false);
            setSelectedProjection(null);
          }}
          onAssign={handleJuryAssign}
        />
      )}
    </div>
  );
}