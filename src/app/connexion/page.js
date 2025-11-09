'use client';
import { useState } from "react";
import useConnexion from "../../hooks/hookconnexion.js";
import { Eye, EyeOff } from "lucide-react";

export default function ConnexionPage() {
  const { login, error } = useConnexion();
  const [formdata, setFormdata] = useState({
    identifier: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="bg-slate-800/70 backdrop-blur-md p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Connexion</h2>

        {error && (
          <p className="text-red-500 mb-4 text-center bg-red-500/10 p-3 rounded-md border border-red-500/30">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="identifier" className="block text-gray-300 mb-2 font-medium">
              Nom d'utilisateur ou Email
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              onChange={handleChange}
              value={formdata.identifier}
              placeholder="Entrez votre username ou email"
              required
              className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2 font-medium">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={handleChange}
                value={formdata.password}
                placeholder="Entrez votre mot de passe"
                required
                className="w-full px-4 py-2 pr-10 rounded-md bg-slate-700 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-400">
            Pas encore de compte ?{" "}
            <a href="/inscription" className="text-purple-400 hover:text-purple-300 font-semibold transition">
              S'inscrire
            </a>
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
