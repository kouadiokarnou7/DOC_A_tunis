// hooks/useInscription.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function useInscription() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/auth/status');
                setIsAuthenticated(response.data.isAuthenticated);
                setUser(response.data.user);
            } catch (err) {
                setIsAuthenticated(false);
                setUser(null);
            }
        };
        checkAuth();
    }, []);

    // Fonction pour soumettre l'inscription
    const register = async (userInfo) => {
        try {
            setError(null);
            setLoading(true);
            
            // Normaliser les noms de champs
            const payload = {
                nomComplet: userInfo.nomComplet ?? userInfo.nomcomplet,
                email: userInfo.email,
                password: userInfo.password,
            };
            
            const response = await axios.post('/api/auth/register', payload);
            
            if (response.data.success) {
                setIsAuthenticated(true);
                setUser(response.data.user);
                // Redirection vers la page principale avec le nom d'utilisateur
                const username = encodeURIComponent(response.data.user?.nomComplet || '');
                router.push('/');
            } else {
                setError(response.data.message || 'Erreur lors de l\'inscription');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return {
        isAuthenticated,
        loading,
        error,
        user,
        register,
    };
}