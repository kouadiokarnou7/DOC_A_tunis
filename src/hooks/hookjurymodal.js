// hooks/useJuryModal.js
"use client";

import { useState, useCallback } from 'react';

export function useJuryModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [jurys, setJurys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ouvrir le modal
    const openModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    // Fermer le modal
    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    // Gérer la création d'un jury
    const handleJuryCreated = useCallback((newJury) => {
        setJurys(prev => [...prev, newJury]);
        console.log('Nouveau jury créé:', newJury);
    }, []);

    // Charger tous les jurys depuis l'API
    const loadJurys = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/jurys');
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors du chargement');
            }
            
            setJurys(result.data || []);
            return result.data || [];
        } catch (err) {
            console.error('Erreur lors du chargement des jurys:', err);
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Supprimer un jury
    const deleteJury = useCallback(async (code) => {
        try {
            const response = await fetch(`/api/jurys/${code}`, {
                method: 'DELETE',
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de la suppression');
            }
            
            setJurys(prev => prev.filter(j => j.code !== code));
            return true;
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
            setError(err.message);
            return false;
        }
    }, []);

    // Mettre à jour un jury
    const updateJury = useCallback(async (code, updatedData) => {
        try {
            const response = await fetch(`/api/jurys/${code}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de la mise à jour');
            }
            
            setJurys(prev => prev.map(j => j.code === code ? result.data : j));
            return true;
        } catch (err) {
            console.error('Erreur lors de la mise à jour:', err);
            setError(err.message);
            return false;
        }
    }, []);

    // Récupérer un jury spécifique
    const getJury = useCallback(async (code) => {
        try {
            const response = await fetch(`/api/jurys/${code}`);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de la récupération');
            }
            
            return result.data;
        } catch (err) {
            console.error('Erreur lors de la récupération du jury:', err);
            setError(err.message);
            return null;
        }
    }, []);

    return {
        isOpen,
        openModal,
        closeModal,
        handleJuryCreated,
        jurys,
        loadJurys,
        deleteJury,
        updateJury,
        getJury,
        loading,
        error
    };
}