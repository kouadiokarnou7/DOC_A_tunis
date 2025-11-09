"use client";

import { useState } from "react";
import useInscription from "@/hooks/hookinscription";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function InscriptionPage() {
    const { isAuthenticated, loading, error, register } = useInscription();
    const [formdata, setFormdata] = useState({
        nomcomplet: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationError, setValidationError] = useState("");

    const handleChange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
        setValidationError("");
    };

    const validateForm = () => {
        if (formdata.nomcomplet.trim().length < 3) {
            setValidationError("Le nom complet doit contenir au moins 3 caractères");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formdata.email)) {
            setValidationError("Veuillez entrer un email valide");
            return false;
        }

        if (formdata.password.length < 6) {
            setValidationError("Le mot de passe doit contenir au moins 6 caractères");
            return false;
        }

        if (formdata.password !== formdata.confirmPassword) {
            setValidationError("Les mots de passe ne correspondent pas");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const { confirmPassword, ...userData } = formdata;
        await register(userData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="bg-slate-800/70 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Inscription</h2>
                
                {(error || validationError) && (
                    <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/30">
                        <p className="text-red-500 text-center text-sm">
                            {validationError || error}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nomcomplet" className="block text-gray-300 mb-2">
                            Nom complet
                        </label>
                        <input 
                            type="text" 
                            id="nomcomplet" 
                            name="nomcomplet" 
                            onChange={handleChange} 
                            value={formdata.nomcomplet} 
                            className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400" 
                            placeholder="Entrez votre nom complet" 
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-300 mb-2">
                            Email
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            onChange={handleChange} 
                            value={formdata.email} 
                            className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400" 
                            placeholder="votre@email.com" 
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-300 mb-2">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                id="password" 
                                name="password" 
                                onChange={handleChange} 
                                value={formdata.password} 
                                className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400" 
                                placeholder="Minimum 6 caractères" 
                                required 
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword" 
                                name="confirmPassword" 
                                onChange={handleChange} 
                                value={formdata.confirmPassword} 
                                className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400" 
                                placeholder="Confirmez votre mot de passe" 
                                required 
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Inscription en cours..." : "S'inscrire"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Vous avez déjà un compte ?{" "}
                        <Link 
                            href="/connexion"
                            className="text-purple-400 hover:text-purple-300 font-semibold"
                        >
                            Se connecter
                        </Link>
                    </p>
                    <p className="text-gray-400">
            Retour vers la page d'accueil :{" "}
            <a href="/" className="text-purple-400 hover:text-purple-300 font-semibold transition">
              Accueil
            </a>
          </p>
                </div>
            </div>
        </div>
    );
}