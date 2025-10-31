'use client';
import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import useInscription from '@/hooks/admin/inscription';

export default function AddUserModal({ onClose, onCreated }) {
  const { register, loading, error } = useInscription();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.fullname.value.trim();
    const email = form.email.value.trim();
    const role = form.role.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
   

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      await register({
        nomComplet: name,
        email,
        role,
        motDePasse: password,
      });
      onCreated?.();
      onClose?.();
    } catch (_) {}
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-purple-500/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Ajouter un utilisateur</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-800 rounded p-2">
            {String(error)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom complet */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Nom complet</label>
            <input
              name="fullname"
              type="text"
              required
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
              placeholder="Ex: Amina Benali"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
              placeholder="email@doctunis.tn"
            />
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Rôle</label>
            <select
              name="role"
              required
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
            >
              <option value="RESPONSABLE_INSPECTION">Responsable Inspection</option>
              <option value="RESPONSABLE_PRODUCTION">Responsable Production</option>
              <option value="PRESIDENT_JURY">Président Jury</option>
              <option value="RESPONSABLE_JURES">Responsable jurés</option>
              <option value="ADMIN">Admin</option>
              <option value="UTILISATEUR">Utilisateur</option>
            </select>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Mot de passe</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none pr-10"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                required
                minLength={6}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none pr-10"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? 'Création…' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
