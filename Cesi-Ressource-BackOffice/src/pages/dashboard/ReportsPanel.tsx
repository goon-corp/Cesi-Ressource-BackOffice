import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { reportService } from '../../services/api/reportService';
import type { Report, ReportQuery } from '../../types/report.types';
import type { PaginatedResponse } from '../../types/common.types';
import { useApi } from '../../hooks/useApi';
import { usePagination } from '../../hooks/usePagination';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';

const ReportsPanel: React.FC = () => {
  const { pageNumber, pageSize, setPage } = usePagination(10);
  const [filterChecked, setFilterChecked] = useState<boolean | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const query: ReportQuery = {
    pageNumber,
    pageSize,
    isCheckedByModerator: filterChecked,
  };

  const { data, loading, error, refetch } = useApi<PaginatedResponse<Report>>(
    useCallback(
      () => reportService.getAll(query),
      [pageNumber, pageSize, filterChecked]
    )
  );

  const handleToggleCheck = async (report: Report) => {
    try {
      await reportService.update(report.id, {
        isCheckedByModerator: !report.isCheckedByModerator,
      });
      toast.success(
        report.isCheckedByModerator ? 'Signalement marqué à traiter' : 'Signalement traité'
      );
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await reportService.delete(deleteTarget.id);
      toast.success('Signalement supprimé');
      refetch();
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  const columns: Column<Report>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (r) => (
        <span className="font-mono text-xs text-gray-400">{r.id.slice(0, 8)}…</span>
      ),
    },
    {
      key: 'ressource',
      header: 'Ressource',
      render: (r) => (
        <span className="font-mono text-xs text-gray-500">{r.ressourceId.slice(0, 8)}…</span>
      ),
    },
    {
      key: 'user',
      header: 'Signalé par',
      render: (r) => (
        <span className="font-mono text-xs text-gray-500">{r.userId.slice(0, 8)}…</span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (r) => (
        <Badge
          label={r.isCheckedByModerator ? 'Traité' : 'À traiter'}
          variant={r.isCheckedByModerator ? 'success' : 'warning'}
        />
      ),
    },
    {
      key: 'created',
      header: 'Date',
      render: (r) => new Date(r.creationTime).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleToggleCheck(r)}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
              r.isCheckedByModerator
                ? 'border-yellow-200 text-yellow-600 hover:bg-yellow-50'
                : 'border-green-200 text-green-600 hover:bg-green-50'
            }`}
          >
            {r.isCheckedByModerator ? 'Rouvrir' : 'Marquer traité'}
          </button>
          <button
            onClick={() => setDeleteTarget(r)}
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
          Signalements
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Filtre :</span>
          {[
            { label: 'Tous', value: undefined },
            { label: 'À traiter', value: false },
            { label: 'Traités', value: true },
          ].map(({ label, value }) => (
            <button
              key={label}
              onClick={() => { setFilterChecked(value); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                filterChecked === value
                  ? 'bg-[#000091] text-white border-[#000091]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={loading}
        error={error}
        keyExtractor={(r) => r.id}
        emptyMessage="Aucun signalement trouvé"
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
          title="Supprimer le signalement"
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          confirmLabel="Supprimer"
          confirmVariant="danger"
          isLoading={actionLoading}
        >
          <p className="text-sm text-gray-600">
            Êtes-vous sûr de vouloir supprimer ce signalement ? Cette action est irréversible.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default ReportsPanel;
