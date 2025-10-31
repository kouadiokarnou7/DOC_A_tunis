'use client';
import { useMemo, useState } from 'react';
import { 
  Users, UserPlus, Shield, Eye, Edit, Trash2, 
  CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Search 
} from 'lucide-react';
import AdminLayout from './layout';
import AddUserModal from '@/components/modal/AddUserModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const usersPerPage = 3; // ✅ nombre d'utilisateurs par page

  // Données récupérées depuis l'API
  const [users, setUsers] = useState([]);

  // Rôles mockés
  const roles = [
    {
      id: 'resp_inspection',
      name: 'Responsable Inspection',
      description: 'Gère les inspections, affecte les inspecteurs et valide les rapports.',
      permissions: ['Voir dossiers', 'Assigner inspecteurs', 'Valider inspections'],
    },
    {
      id: 'resp_production',
      name: 'Responsable Production',
      description: 'Supervise la production et la conformité documentaire.',
      permissions: ['Voir dossiers', 'Valider conformité', 'Générer rapports'],
    },
    {
      id: 'president_jury',
      name: 'Président Jury',
      description: 'Pilote les comités, arbitre et signe les décisions.',
      permissions: ['Voir dossiers', 'Planifier séances', 'Signer décisions'],
    },
    {
      id: 'membre_jury',
      name: 'Membre Jury',
      description: 'Participe aux évaluations et formulaires de notation.',
      permissions: ['Voir dossiers', 'Noter dossiers'],
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Gère l\'ensemble des fonctionnalités du système.',
      permissions: ['Voir dossiers', 'Assigner inspecteurs', 'Valider inspections', 'Planifier séances', 'Signer décisions'],
    },
    {
      id: 'utilisateur',
      name: 'Utilisateur',
      description: 'Accède aux dossiers et aux fonctionnalités limitées.',
      permissions: ['Voir dossiers', 'Noter dossiers'],
    }
  ];

  // Statistiques
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Actif').length;
  const inactiveUsers = totalUsers - activeUsers;
  const totalRoles = new Set(users.map((u) => u.role)).size;

  // ✅ Filtrage par recherche
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (page - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const goToPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  // Graphique (répartition par rôle)
  const chartData = useMemo(() => {
    const map = new Map();
    (users || []).forEach((u) => {
      map.set(u.role, (map.get(u.role) || 0) + 1);
    });
    return Array.from(map.entries()).map(([role, count]) => ({ role, count }));
  }, [users]);

  const navigation = [
    { name: 'Utilisateurs', icon: <Users className="w-5 h-5" />, id: 'users' },
    { name: 'Rôles & Permissions', icon: <Shield className="w-5 h-5" />, id: 'roles' },
  ];

  const sidebarNav = (
    <nav className="p-4 space-y-2">
      {navigation.map((item) => (
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
    <div className="space-y-6">
      {activeTab === 'users' && (
        <>
          {/* Statistiques */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardDescription className="text-gray-400">Utilisateurs</CardDescription>
                <CardTitle className="text-white text-3xl">{totalUsers}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription className="text-gray-400">Actifs</CardDescription>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <CardTitle className="text-white text-3xl">{activeUsers}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription className="text-gray-400">Inactifs</CardDescription>
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                </div>
                <CardTitle className="text-white text-3xl">{inactiveUsers}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardDescription className="text-gray-400">Rôles</CardDescription>
                <CardTitle className="text-white text-3xl">{totalRoles}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Tableau Utilisateurs */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-2xl font-bold text-white">Gestion des Utilisateurs</h2>

              {/* ✅ Barre de recherche */}
              <div className="flex items-center bg-slate-700 rounded-lg px-3 py-2 w-full sm:w-72">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-white w-full focus:outline-none placeholder-gray-400"
                />
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <UserPlus className="w-5 h-5" />
                Ajouter
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
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-4 px-4 text-white font-medium">{user.name}</td>
                        <td className="py-4 px-4 text-gray-400">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">{user.role}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              user.status === 'Actif'
                                ? 'bg-green-600/20 text-green-400'
                                : 'bg-red-600/20 text-red-400'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-end gap-2">
                            <button className="text-blue-400 hover:text-blue-300 p-2">
                              <Eye className="w-5 h-5" />
                            </button>
                            <button className="text-yellow-400 hover:text-yellow-300 p-2">
                              <Edit className="w-5 h-5" />
                            </button>
                            <button className="text-red-400 hover:text-red-300 p-2">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-gray-400 py-4">
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination */}
            <div className="flex justify-between items-center mt-4 text-gray-400">
              <button
                onClick={goToPrevPage}
                disabled={page === 1}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700 text-white'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>

              <span>
                Page <strong>{page}</strong> sur <strong>{totalPages}</strong>
              </span>

              <button
                onClick={goToNextPage}
                disabled={page === totalPages}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700 text-white'
                }`}
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Graphique */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Répartition des utilisateurs par rôle</CardTitle>
              <CardDescription className="text-gray-400">Vue d'ensemble des équipes</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ users: { label: 'Utilisateurs', color: 'hsl(262 83% 58%)' } }}
                className="h-[300px]"
              >
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" tick={{ fill: 'rgb(148 163 184)' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'rgb(148 163 184)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Bar dataKey="count" name="Utilisateurs" fill="var(--color-users)" radius={[6, 6, 0, 0]} />
                  <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Rôles & Permissions</h2>
              <p className="text-gray-400 text-sm">Définir les accès par profil</p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
              Nouveau Rôle
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role) => (
              <Card key={role.id} className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">{role.name}</CardTitle>
                  <CardDescription className="text-gray-400">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {role.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="bg-slate-700 text-gray-200 border border-slate-600 px-3 py-1 rounded-full text-xs"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm">
                      Modifier
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm">
                      Attribuer
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onCreated={() => {
            setPage(1);
          }}
        />
      )}
    </div>
  );

  return <AdminLayout sidebarNav={sidebarNav}>{mainContent}</AdminLayout>;
}
