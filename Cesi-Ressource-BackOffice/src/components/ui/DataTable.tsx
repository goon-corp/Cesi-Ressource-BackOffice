import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  error: string | null;
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
}

function DataTable<T>({
  columns,
  data,
  loading,
  error,
  emptyMessage = 'Aucun résultat',
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-sm border border-gray-200 shadow-sm">
      <table className="w-full border-collapse bg-white text-left text-sm text-gray-600">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan={columns.length}>
                <LoadingSpinner />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-red-500 text-sm">
                {error}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-6 py-4 ${col.className ?? ''}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
