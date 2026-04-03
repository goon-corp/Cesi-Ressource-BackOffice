import React from 'react';

interface PaginationProps {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pageNumber,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const start = (pageNumber - 1) * pageSize + 1;
  const end = Math.min(pageNumber * pageSize, totalCount);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
      <p className="text-sm text-gray-600">
        Affichage de <span className="font-medium">{start}</span> à{' '}
        <span className="font-medium">{end}</span> sur{' '}
        <span className="font-medium">{totalCount}</span> résultats
      </p>

      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Précédent
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - pageNumber) <= 1)
          .reduce<(number | '...')[]>((acc, p, i, arr) => {
            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="px-3 py-2 text-sm text-gray-500">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium border transition-colors ${
                  p === pageNumber
                    ? 'bg-[#000091] text-white border-[#000091]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            )
          )}

        <button
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={pageNumber >= totalPages}
          className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Pagination;
