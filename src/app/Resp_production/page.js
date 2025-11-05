"use client";

import { useState } from "react";
import { useProjection } from "@/hooks/useprojection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Calendar, Film as FilmIcon, Send } from "lucide-react";
import ModalProjection from "@/components/modal/Addprojectionmodal";

export default function ProductionPage() {
  const { projections, isLoading, addProjection, deleteProjection } = useProjection();
  const [openModal, setOpenModal] = useState(false);

  const handleProjectionSaved = (newProjection) => {
    addProjection(newProjection);
    setOpenModal(false);
  };

  const publishProjections = () => {
    if (projections.length === 0) {
      alert("Aucune projection à publier !");
      return;
    }
    // Ici on pourra plus tard appeler le backend pour publier
    alert("Projections publiées dans le catalogue !");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 p-8">
      <Card className="max-w-6xl mx-auto shadow-xl border border-purple-100">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-purple-700 flex items-center gap-2">
            <Calendar className="text-purple-700" /> Gestion du Planning de Projection
          </CardTitle>

          <div className="flex gap-2">
            {/* Bouton pour ouvrir le modal */}
            <Button
              className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:opacity-90 flex items-center gap-2 shadow-lg hover:shadow-xl transition"
              onClick={() => setOpenModal(true)}
            >
              <Plus className="h-4 w-4" /> Nouvelle Projection
            </Button>

            {/* Bouton Publier */}
            <Button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 flex items-center gap-2 shadow-lg hover:shadow-xl transition"
              onClick={publishProjections}
            >
              <Send className="h-4 w-4" /> Publier
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Loader2 className="animate-spin text-purple-600 w-12 h-12 mx-auto mb-4" />
                <p className="text-gray-600">Chargement des projections...</p>
              </div>
            </div>
          ) : projections.length === 0 ? (
            <div className="text-center py-12">
              <FilmIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-4">
                Aucune projection planifiée pour le moment.
              </p>
              <Button
                onClick={() => setOpenModal(true)}
                className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter la première projection
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-purple-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-purple-100 to-violet-100 border-b-2 border-purple-300">
                    <TableHead className="font-bold text-purple-900">Film</TableHead>
                    <TableHead className="font-bold text-purple-900">Date</TableHead>
                    <TableHead className="font-bold text-purple-900">Heure</TableHead>
                    <TableHead className="font-bold text-purple-900">Salle</TableHead>
                    <TableHead className="font-bold text-purple-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projections.map((p) => (
                    <TableRow key={p.id} className="hover:bg-purple-50 transition">
                      <TableCell className="font-medium text-gray-800">{p.titreFilm || "N/A"}</TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(p.dateProjection).toLocaleDateString('fr-FR', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-gray-600">{p.heure}</TableCell>
                      <TableCell className="text-gray-600">{p.salle}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteProjection(p.id)}
                          className="flex items-center gap-1 hover:bg-red-700 transition"
                        >
                          <Trash2 size={16} /> Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- MODAL --- */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-purple-700 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Planifier une nouvelle projection
            </DialogTitle>
          </DialogHeader>
          <ModalProjection 
            onClose={() => setOpenModal(false)} 
            onSaved={handleProjectionSaved}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
