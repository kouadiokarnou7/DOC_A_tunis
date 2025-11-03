"use client";

import { useEffect, useState } from 'react';
import { Plus, Users, Trash2, Edit, Phone, Calendar, Globe, Loader2 } from 'lucide-react';
import AddJuryModal from '@/components/modal/addjurymodal'; 
import { useJuryModal } from '@/hooks/hookjurymodal'; 

export default function JuryManagementPage() {
    const { 
        isOpen, 
        openModal, 
        closeModal, 
        handleJuryCreated,
        jurys,
        loadJurys,
        deleteJury 
    } = useJuryModal();

    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

    // Charger les jurys au montage du composant
    useEffect(() => {
        const fetchJurys = async () => {
            setIsLoading(true);
            await loadJurys();
            setIsLoading(false);
        };
        fetchJurys();
    }, [loadJurys]);

    const handleDelete = async (code, nom, prenom) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${prenom} ${nom} ?`)) {
            const success = await deleteJury(code);
            if (success) {
                setShowDeleteSuccess(true);
                setTimeout(() => setShowDeleteSuccess(false), 3000);
            } else {
                alert('Erreur lors de la suppression');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Message de succès suppression */}
                {showDeleteSuccess && (
                    <div className="mb-6 p-4 bg-violet-100 border border-violet-200 text-violet-800 rounded-lg flex items-center gap-2 shadow-md">
                        <span className="font-medium">✓ Jury supprimé avec succès</span>
                    </div>
                )}

                {/* En-tête */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-violet-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-3 rounded-xl shadow-lg">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                    Gestion des Membres du Jury
                                </h1>
                                <p className="text-gray-600 mt-1 flex items-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                                            <span>Chargement...</span>
                                        </>
                                    ) : (
                                        <span className="font-medium text-violet-700">
                                            {jurys.length} membre{jurys.length > 1 ? 's' : ''} enregistré{jurys.length > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={openModal}
                            className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            Ajouter un membre
                        </button>
                    </div>
                </div>

                {/* Contenu principal */}
                {isLoading ? (
                    // État de chargement
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-violet-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Loader2 className="w-8 h-8 animate-spin text-white" />
                            </div>
                            <p className="text-violet-700 font-medium">Chargement des membres du jury...</p>
                        </div>
                    </div>
                ) : (
                    // Liste des jurys
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jurys.length === 0 ? (
                            // État vide
                            <div className="col-span-full bg-white rounded-2xl shadow-xl p-12 text-center border border-violet-100">
                                <div className="bg-gradient-to-br from-violet-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-12 h-12 text-violet-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Aucun membre du jury
                                </h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                    Commencez par ajouter des membres du jury pour gérer votre équipe d'évaluation
                                </p>
                                <button
                                    onClick={openModal}
                                    className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all inline-flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-5 h-5" />
                                    Ajouter le premier membre
                                </button>
                            </div>
                        ) : (
                            // Cartes des jurys
                            jurys.map((jury) => (
                                <div 
                                    key={jury.code}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-violet-100 hover:border-violet-300"
                                >
                                    {/* En-tête de la carte */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-2">
                                                {jury.code}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 break-words">
                                                {jury.prenom} {jury.nom}
                                            </h3>
                                        </div>
                                        <div className="flex gap-1 ml-2">
                                            <button
                                                onClick={() => handleDelete(jury.code, jury.nom, jury.prenom)}
                                                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Informations */}
                                    <div className="space-y-3 text-sm">
                                        {jury.dateNaissance && (
                                            <div className="flex items-center gap-2 text-gray-600 bg-violet-50 p-2 rounded-lg">
                                                <Calendar className="w-4 h-4 text-violet-500 flex-shrink-0" />
                                                <span>
                                                    Né(e) le {new Date(jury.dateNaissance).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {jury.telephone && (
                                            <div className="flex items-center gap-2 text-gray-600 bg-violet-50 p-2 rounded-lg">
                                                <Phone className="w-4 h-4 text-violet-500 flex-shrink-0" />
                                                <span className="break-all">{jury.telephone}</span>
                                            </div>
                                        )}
                                        
                                        {jury.nationalite && (
                                            <div className="flex items-center gap-2 text-gray-600 bg-violet-50 p-2 rounded-lg">
                                                <Globe className="w-4 h-4 text-violet-500 flex-shrink-0" />
                                                <span>{jury.nationalite}</span>
                                            </div>
                                        )}

                                        {/* Afficher un message si aucune info supplémentaire */}
                                        {!jury.dateNaissance && !jury.telephone && !jury.nationalite && (
                                            <p className="text-gray-400 italic text-xs text-center py-2">
                                                Aucune information supplémentaire
                                            </p>
                                        )}
                                    </div>

                                    {/* Date de création */}
                                    {jury.dateCreation && (
                                        <div className="mt-4 pt-4 border-t border-violet-100 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-violet-400" />
                                                Ajouté le {new Date(jury.dateCreation).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isOpen && (
                <AddJuryModal 
                    onClose={closeModal}
                    onCreated={handleJuryCreated}
                />
            )}
        </div>
    );
}