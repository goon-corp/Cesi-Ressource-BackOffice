import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { tagService } from '../../services/api/tagService';
import type { Tag, CreateTagDto, UpdateTagDto, TagQuery } from '../../types/tag.types';
import type { PaginatedResponse } from '../../types/common.types';
import { useApi } from '../../hooks/useApi';
import { usePagination } from '../../hooks/usePagination';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; tag: Tag }
  | { type: 'delete'; tag: Tag }
  | null;

const TagsPanel: React.FC = () => {
  const { pageNumber, pageSize, setPage } = usePagination(10);
  const [modal, setModal] = useState<ModalState>(null);
  const [label, setLabel] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const query: TagQuery = { pageNumber, pageSize };

  const { data, loading, error, refetch } = useApi<PaginatedResponse<Tag>>(
    useCallback(() => tagService.getAll(query), [pageNumber, pageSize])
  );

  const openCreate = () => {
    setLabel('');
    setModal({ type: 'create' });
  };

  const openEdit = (tag: Tag) => {
    setLabel(tag.label);
    setModal({ type: 'edit', tag });
  };

  const handleCreate = async () => {
    if (!label.trim()) return;
    setActionLoading(true);
    try {
      const dto: CreateTagDto = { label: label.trim() };
      await tagService.create(dto);
      toast.success('Tag créé');
      refetch();
      setModal(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async () => {
    if (modal?.type !== 'edit' || !label.trim()) return;
    setActionLoading(true);
    try {
      const dto: UpdateTagDto = { label: label.trim() };
      await tagService.update(modal.tag.id, dto);
      toast.success('Tag mis à jour');
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
      await tagService.delete(modal.tag.id);
      toast.success('Tag supprimé');
      refetch();
      setModal(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  const columns: Column<Tag>[] = [
    {
      key: 'label',
      header: 'Label',
      render: (t) => (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#000091] ring-1 ring-inset ring-blue-600/20">
          {t.label}
        </span>
      ),
    },
    {
      key: 'created',
      header: 'Créé le',
      render: (t) =>
        t.creationTime
          ? new Date(t.creationTime).toLocaleDateString('fr-FR')
          : '—',
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (t) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEdit(t)}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Modifier
          </button>
          <button
            onClick={() => setModal({ type: 'delete', tag: t })}
            className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            Supprimer
          </button>
        </div>
      ),
    },
  ];

  const labelInput = (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
        Label
      </label>
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="w-full border border-gray-200 bg-[#FAF9F6] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#000091]"
        placeholder="Ex: santé, bien-être..."
        autoFocus
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800">
          Tags
        </h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#000091] hover:bg-blue-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouveau tag
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={loading}
        error={error}
        keyExtractor={(t) => t.id}
        emptyMessage="Aucun tag trouvé"
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

      {modal?.type === 'create' && (
        <Modal
          title="Créer un tag"
          onClose={() => setModal(null)}
          onConfirm={handleCreate}
          confirmLabel="Créer"
          isLoading={actionLoading}
        >
          {labelInput}
        </Modal>
      )}

      {modal?.type === 'edit' && (
        <Modal
          title="Modifier le tag"
          onClose={() => setModal(null)}
          onConfirm={handleEdit}
          confirmLabel="Enregistrer"
          isLoading={actionLoading}
        >
          {labelInput}
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <Modal
          title="Supprimer le tag"
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
          confirmLabel="Supprimer"
          confirmVariant="danger"
          isLoading={actionLoading}
        >
          <p className="text-sm text-gray-600">
            Êtes-vous sûr de vouloir supprimer le tag{' '}
            <span className="font-semibold text-gray-900">"{modal.tag.label}"</span> ?
          </p>
        </Modal>
      )}
    </div>
  );
};

export default TagsPanel;
