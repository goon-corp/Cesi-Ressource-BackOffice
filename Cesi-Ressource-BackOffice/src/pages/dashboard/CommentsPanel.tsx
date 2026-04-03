import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { commentService } from '../../services/api/commentService';
import type { Comment, UpdateCommentDto } from '../../types/comment.types';
import { useApi } from '../../hooks/useApi';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

type ModalState =
  | { type: 'edit'; comment: Comment }
  | { type: 'delete'; comment: Comment }
  | null;

const CommentsPanel: React.FC = () => {
  const { data: comments, loading, error, refetch } = useApi<Comment[]>(
    useCallback(() => commentService.getAll(), [])
  );
  const [modal, setModal] = useState<ModalState>(null);
  const [content, setContent] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const openEdit = (comment: Comment) => {
    setContent(comment.content);
    setModal({ type: 'edit', comment });
  };

  const handleEdit = async () => {
    if (modal?.type !== 'edit' || !content.trim()) return;
    setActionLoading(true);
    try {
      const dto: UpdateCommentDto = { content: content.trim() };
      await commentService.update(modal.comment.id, dto);
      toast.success('Commentaire mis à jour');
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
      await commentService.delete(modal.comment.id);
      toast.success('Commentaire supprimé');
      refetch();
      setModal(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  const columns: Column<Comment>[] = [
    {
      key: 'content',
      header: 'Contenu',
      render: (c) => (
        <p className="text-sm text-gray-700 max-w-xs line-clamp-2">{c.content}</p>
      ),
    },
    {
      key: 'user',
      header: 'Auteur',
      render: (c) => (
        <span className="font-mono text-xs text-gray-500">{c.userId.slice(0, 8)}…</span>
      ),
    },
    {
      key: 'ressource',
      header: 'Ressource',
      render: (c) => (
        <span className="font-mono text-xs text-gray-500">{c.ressourceId.slice(0, 8)}…</span>
      ),
    },
    {
      key: 'reply',
      header: 'Réponse à',
      render: (c) =>
        c.commentId ? (
          <span className="font-mono text-xs text-gray-400">{c.commentId.slice(0, 8)}…</span>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        ),
    },
    {
      key: 'created',
      header: 'Date',
      render: (c) => new Date(c.creationTime).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEdit(c)}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Modifier
          </button>
          <button
            onClick={() => setModal({ type: 'delete', comment: c })}
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
          Commentaires
        </h2>
        <span className="text-sm text-gray-400">
          {comments?.length ?? 0} entrée{(comments?.length ?? 0) > 1 ? 's' : ''}
        </span>
      </div>

      <DataTable
        columns={columns}
        data={comments ?? []}
        loading={loading}
        error={error}
        keyExtractor={(c) => c.id}
        emptyMessage="Aucun commentaire trouvé"
      />

      {modal?.type === 'edit' && (
        <Modal
          title="Modifier le commentaire"
          onClose={() => setModal(null)}
          onConfirm={handleEdit}
          confirmLabel="Enregistrer"
          isLoading={actionLoading}
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
              Contenu
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 bg-[#FAF9F6] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#000091] resize-none"
            />
          </div>
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <Modal
          title="Supprimer le commentaire"
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
          confirmLabel="Supprimer"
          confirmVariant="danger"
          isLoading={actionLoading}
        >
          <p className="text-sm text-gray-600">
            Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.
          </p>
          <blockquote className="mt-3 border-l-2 border-gray-200 pl-3 text-sm italic text-gray-500 line-clamp-3">
            {modal.comment.content}
          </blockquote>
        </Modal>
      )}
    </div>
  );
};

export default CommentsPanel;
