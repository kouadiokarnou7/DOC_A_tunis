
'use client';
import { useState } from "react";
import useConnexion from "@/hooks/useConnexion";

export default function ConnexionPage() {
  const { login, error } = useConnexion();
  const [formdata, setFormdata] = useState({
    identifier: "", // Un seul champ pour username ou email
    password: ""
  });

  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formdata);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-slate-800/70 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Connexion</h2>
        
        {error && (
          <p className="text-red-500 mb-4 text-center bg-red-500/10 p-3 rounded-md border border-red-500/30">
            {error}
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-gray-300 mb-2">
              Nom d'utilisateur ou Email
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              onChange={handleChange}
              value={formdata.identifier}
              className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Entrez votre username ou email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={formdata.password}
              className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Pas encore de compte ?{" "}
            <a href="/inscription" className="text-purple-400 hover:text-purple-300 font-semibold">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}