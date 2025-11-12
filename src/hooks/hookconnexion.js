



// hooks/useConnexion.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function useConnexion() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Vérifier le statut de connexion de l'utilisateur
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/auth/status');
                setIsAuthenticated(response.data.isAuthenticated);
                setUser(response.data.user);
            } catch (err) {
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    // Fonction pour rediriger selon le rôle
    const redirectByRole = (role) => {
        switch (role) {
            case 'ADMIN':
                router.push('/administrateurs');
                break;
            case 'RESPONSABLE_INSPECTION':
                router.push('/Resp_inspection');
                break;
            case 'RESPONSABLE_PRODUCTION':
                router.push('/Resp_production');
                break;
            case 'PRESIDENT_JURY':
            case 'PRESIDENT_JURÉS':
                router.push('/President_jury');
                break;
                  
            case 'UTILISATEUR':
            default:
                router.push('/');
                break;
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            setLoading(true);
            
            // Normaliser les noms de champs (identifier -> email)
            const payload = {
                email: credentials.email ?? credentials.identifier,
                password: credentials.password,
            };
            
            const response = await axios.post('/api/auth/login', payload);
            
            if (response.data.success) {
                setIsAuthenticated(true);
                setUser(response.data.user);
                
                // Redirection selon le rôle
                redirectByRole(response.data.user.role);
            } else {
                setError(response.data.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la connexion.');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await axios.post('/api/auth/logout');
            setIsAuthenticated(false);
            setUser(null);
            router.push('/connexion');
        } catch (err) {
            setError('Une erreur est survenue lors de la déconnexion.');
        } finally {
            setLoading(false);
        }
    };

    return { 
        isAuthenticated, 
        loading, 
        error, 
        user, 
        login, 
        logout 
    };
}