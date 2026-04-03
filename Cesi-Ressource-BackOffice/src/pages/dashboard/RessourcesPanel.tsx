import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ressourceService } from '../../services/api/ressourceService';
import type { Ressource, RessourceQuery } from '../../types/ressource.types';
import { useApi } from '../../hooks/useApi';
import { usePagination } from '../../hooks/usePagination';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import type { PaginatedResponse } from '../../types/common.types';

const RessourcesPanel: React.FC = () => {
  const { pageNumber, pageSize, setPage } = usePagination(10);
  const [deleteTarget, setDeleteTarget] = useState<Ressource | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const query: RessourceQuery = { pageNumber, pageSize };

  const { data, loading, error, refetch } = useApi<PaginatedResponse<Ressource>>(
    useCallback(() => ressourceService.getAll(query), [pageNumber, pageSize])
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await ressourceService.delete(deleteTarget.id);
      toast.success('Ressource supprimée');
      refetch();
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  const columns: Column<Ressource>[] = [
    {
      key: 'title',
      header: 'Titre',
      render: (r) => (
        <div>
          <p className="font-medium text-gray-900">{r.title}</p>
          <p className="text-xs text-gray-400 line-clamp-1">{r.description}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (r) => <span className="text-sm text-gray-600">{r.type ?? '—'}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (r) => (
        <Badge label={r.status ?? '—'} variant="info" />
      ),
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.tags?.map((t) => (
            <Badge key={t.id} label={t.label} variant="neutral" />
          )) ?? '—'}
        </div>
      ),
    },
    {
      key: 'views',
      header: 'Vues',
      render: (r) => <span className="text-sm text-gray-600">{r.viewCount ?? 0}</span>,
    },
    {
      key: 'created',
      header: 'Créé le',
      render: (r) =>
        r.creationTime
          ? new Date(r.creationTime).toLocaleDateString('fr-FR')
          : '—',
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <button
          onClick={() => setDeleteTarget(r)}
          className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
        >
          Supprimer
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800">
          Ressources
        </h2>
        <span className="text-sm text-gray-400">
          {data?.totalCount ?? 0} entrée{(data?.totalCount ?? 0) > 1 ? 's' : ''}
        </span>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={loading}
        error={error}
        keyExtractor={(r) => r.id}
        emptyMessage="Aucune ressource trouvée"
      />

      {data && data.totalPages > 1 && (
        <Pagination
          pageNumber={pageNumber}
          totalPages={data.totalPages}
          totalCount={data.totalCount}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}

      {deleteTarget && (
        <Modal
          title="Supprimer la ressource"
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          confirmLabel="Supprimer"
          confirmVariant="danger"
          isLoading={actionLoading}
        >
          <p className="text-sm text-gray-600">
            Êtes-vous sûr de vouloir supprimer la ressource{' '}
            <span className="font-semibold text-gray-900">"{deleteTarget.title}"</span> ?
            Cette action est irréversible.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default RessourcesPanel;
