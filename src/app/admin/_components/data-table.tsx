"use client";

import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  cell: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  renderCard: (row: T) => React.ReactNode;
  emptyMessage: string;
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  renderCard,
  emptyMessage,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-white/12 bg-[#081224]/65 p-8 text-center text-sm text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-[1.75rem] border border-white/8 bg-[#081224]/80 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-200">
            <thead className="bg-white/4 text-left text-[11px] uppercase tracking-[0.24em] text-slate-500">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-4 font-semibold">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={getRowId(row)}
                  className="border-t border-white/8 align-top text-slate-200"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn("px-4 py-4", column.className)}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">{data.map((row) => renderCard(row))}</div>
    </>
  );
}
