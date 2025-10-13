'use client';
import { useState } from 'react';
import { Users, UserPlus, Shield, Eye, Edit, Trash2 } from 'lucide-react';
import AdminLayout from './layout';
import AddUserModal from '../../components/AddUserModal';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const users = [
    { id: 1, name: "Amina Benali", email: "amina@doctunis.tn", role: "Responsable Inspection", status: "Actif" },
    { id: 2, name: "Karim Essid", email: "karim@doctunis.tn", role: "Responsable Production", status: "Actif" }
  ];

  const navigation = [
    { name: 'Utilisateurs', icon: <Users className="w-5 h-5" />, id: 'users' },
    { name: 'Rôles & Permissions', icon: <Shield className="w-5 h-5" />, id: 'roles' }
  ];

  const sidebarNav = (
    <nav className="p-4 space-y-2">
      {navigation.map(item => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
            ${activeTab === item.id ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}
          `}
        >
          {item.icon}
          <span className="font-medium">{item.name}</span>
        </button>
      ))}
    </nav>
  );

  const mainContent = (
    <>
      {activeTab === 'users' && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Gestion des Utilisateurs</h2>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <UserPlus className="w-5 h-5" />
              Ajouter Utilisateur
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Nom</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Rôle</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Statut</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-4 px-4 text-white font-medium">{user.name}</td>
                    <td className="py-4 px-4 text-gray-400">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        user.status === 'Actif' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button className="text-blue-400 hover:text-blue-300 p-2"><Eye className="w-5 h-5" /></button>
                        <button className="text-yellow-400 hover:text-yellow-300 p-2"><Edit className="w-5 h-5" /></button>
                        <button className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showAddUserModal && <AddUserModal onClose={() => setShowAddUserModal(false)} />}
    </>
  );


  return (
    
    <AdminLayout sidebarNav={sidebarNav}>
      {mainContent}
    </AdminLayout>
    
    
  );
}
