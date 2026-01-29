"use client";

import { CATEGORY_LABELS } from "@/lib/types";

export type FilterType = "all" | "delete" | "keep" | string;

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalCount: number;
  deleteCount: number;
  onExportCsv: () => void;
}

export default function FilterBar({
  currentFilter,
  onFilterChange,
  totalCount,
  deleteCount,
  onExportCsv,
}: FilterBarProps) {
  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: `전체 (${totalCount})` },
    { key: "delete", label: `삭제대상 (${deleteCount})` },
    { key: "keep", label: `정상 (${totalCount - deleteCount})` },
    ...Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
      key,
      label,
    })),
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              currentFilter === key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <button
        onClick={onExportCsv}
        disabled={totalCount === 0}
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          totalCount === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        CSV 다운로드
      </button>
    </div>
  );
}
