"use client";

import { useState } from "react";
import { X, User, Calendar, Phone, Globe, Hash } from 'lucide-react';

export default function AddJuryModal({ onClose, onCreated }) {
    const [formdata, setFormdata] = useState({
        code: "",
        nom: "",
        prenom: "",
        dateNaissance: "",
        telephone: "",
        nationalite: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { code, nom, prenom, dateNaissance, telephone, nationalite } = formdata;

        // Validation
        if (!code.trim() || !nom.trim() || !prenom.trim()) {
            setError("Veuillez remplir tous les champs obligatoires (code, nom, prénom)");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Appel à l'API
            const response = await fetch('/api/jurys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code.trim(),
                    nom: nom.trim(),
                    prenom: prenom.trim(),
                    dateNaissance: dateNaissance.trim(),
                    telephone: telephone.trim(),
                    nationalite: nationalite.trim(),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de l\'enregistrement');
            }

            // Notifier le parent
            if (onCreated && result.data) {
                onCreated(result.data);
            }

            // Fermer le modal
            onClose();
        } catch (err) {
            console.error("Erreur:", err);
            setError(err.message || "Erreur lors de l'enregistrement. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* En-tête */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <User className="w-6 h-6 text-indigo-600" />
                        Ajouter un membre du jury
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full"
                        disabled={loading}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Message d'erreur */}
                {error && (
                    <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        {error}
                    </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Hash className="w-4 h-4 inline mr-1" />
                            Code du jury *
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={formdata.code}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="Ex: JURY001"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Nom et Prénom */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom *
                            </label>
                            <input
                                type="text"
                                name="nom"
                                value={formdata.nom}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                placeholder="Nom de famille"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prénom *
                            </label>
                            <input
                                type="text"
                                name="prenom"
                                value={formdata.prenom}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                placeholder="Prénom"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Date de naissance */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Date de naissance
                        </label>
                        <input
                            type="date"
                            name="dateNaissance"
                            value={formdata.dateNaissance}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            disabled={loading}
                        />
                    </div>

                    {/* Téléphone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Téléphone
                        </label>
                        <input
                            type="tel"
                            name="telephone"
                            value={formdata.telephone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="+225 XX XX XX XX XX"
                            disabled={loading}
                        />
                    </div>

                    {/* Nationalité */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Globe className="w-4 h-4 inline mr-1" />
                            Nationalité
                        </label>
                        <input
                            type="text"
                            name="nationalite"
                            value={formdata.nationalite}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="Ex: Ivoirienne"
                            disabled={loading}
                        />
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}