import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { userService } from '../../services/api/userService';
import type { User, UpdateUserDto } from '../../types/user.types';
import { useApi } from '../../hooks/useApi';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

type ModalState =
  | { type: 'edit'; user: User }
  | { type: 'delete'; user: User }
  | null;

const UsersPanel: React.FC = () => {
  const { data: users, loading, error, refetch } = useApi<User[]>(userService.getAll);
  const [modal, setModal] = useState<ModalState>(null);
  const [formData, setFormData] = useState<UpdateUserDto>({});
  const [actionLoading, setActionLoading] = useState(false);

  const openEdit = useCallback((user: User) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      isActive: user.isActive,
      userRoleId: user.userRoleId,
    });
    setModal({ type: 'edit', user });
  }, []);

  const handleEdit = async () => {
    if (modal?.type !== 'edit') return;
    setActionLoading(true);
    try {
      await userService.update(modal.user.id, formData);
      toast.success('Utilisateur mis à jour');
      refetch();
      setModal(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (modal?.type !== 'delete') return;
    setActionLoading(true);
    try {
      await userService.delete(modal.user.id);
      toast.success('Utilisateur supprimé');
      refetch();
      setModal(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await userService.toggleActive(user.id, !user.isActive);
      toast.success(user.isActive ? 'Compte désactivé' : 'Compte activé');
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Utilisateur',
      render: (u) => (
        <div>
          <p className="font-medium text-gray-900">
            {u.firstName} {u.lastName}
          </p>
          <p className="text-xs text-gray-400">@{u.userName}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (u) => (
        <Badge
          label={u.isActive ? 'Actif' : 'Inactif'}
          variant={u.isActive ? 'success' : 'danger'}
        />
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (u) => (
        <span className="text-gray-600 text-sm">
          {u.userRole?.roleLabel ?? '—'}
        </span>
      ),
    },
    {
      key: 'created',
      header: 'Créé le',
      render: (u) =>
        u.creationTime
          ? new Date(u.creationTime).toLocaleDateString('fr-FR')
          : '—',
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (u) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleToggleActive(u)}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
              u.isActive
                ? 'border-red-200 text-red-600 hover:bg-red-50'
                : 'border-green-200 text-green-600 hover:bg-green-50'
            }`}
          >
            {u.isActive ? 'Désactiver' : 'Activer'}
          </button>
          <button
            onClick={() => openEdit(u)}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Modifier
          </button>
          <button
            onClick={() => setModal({ type: 'delete', user: u })}
            className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            Supprimer
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800">
          Utilisateurs
        </h2>
        <span className="text-sm text-gray-400">
          {users?.length ?? 0} entrée{(users?.length ?? 0) > 1 ? 's' : ''}
        </span>
      </div>

      <DataTable
        columns={columns}
        data={users ?? []}
        loading={loading}
        error={error}
        keyExtractor={(u) => u.id}
        emptyMessage="Aucun utilisateur trouvé"
      />

      {modal?.type === 'edit' && (
        <Modal
          title="Modifier l'utilisateur"
          onClose={() => setModal(null)}
          onConfirm={handleEdit}
          confirmLabel="Enregistrer"
          isLoading={actionLoading}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.firstName ?? ''}
                  onChange={(e) => setFormData((f) => ({ ...f, firstName: e.target.value }))}
                  className="w-full border border-gray-200 bg-[#FAF9F6] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#000091]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.lastName ?? ''}
                  onChange={(e) => setFormData((f) => ({ ...f, lastName: e.target.value }))}
                  className="w-full border border-gray-200 bg-[#FAF9F6] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#000091]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={formData.userName ?? ''}
                onChange={(e) => setFormData((f) => ({ ...f, userName: e.target.value }))}
                className="w-full border border-gray-200 bg-[#FAF9F6] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#000091]"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive ?? false}
                onChange={(e) => setFormData((f) => ({ ...f, isActive: e.target.checked }))}
                className="h-4 w-4 accent-[#000091]"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Compte actif
              </label>
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <Modal
          title="Supprimer l'utilisateur"
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
          confirmLabel="Supprimer"
          confirmVariant="danger"
          isLoading={actionLoading}
        >
          <p className="text-sm text-gray-600">
            Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
            <span className="font-semibold text-gray-900">
              {modal.user.firstName} {modal.user.lastName}
            </span>{' '}
            ? Cette action est irréversible.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default UsersPanel;
