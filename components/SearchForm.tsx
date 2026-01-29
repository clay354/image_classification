"use client";

import { SERVICE_KEYS, SERVICE_LABELS } from "@/lib/types";

interface SearchFormProps {
  startDate: string;
  endDate: string;
  serviceKey: string;
  productId: string;
  limit: number;
  loading: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onServiceKeyChange: (value: string) => void;
  onProductIdChange: (value: string) => void;
  onLimitChange: (value: number) => void;
  onSubmit: () => void;
}

export default function SearchForm({
  startDate,
  endDate,
  serviceKey,
  productId,
  limit,
  loading,
  onStartDateChange,
  onEndDateChange,
  onServiceKeyChange,
  onProductIdChange,
  onLimitChange,
  onSubmit,
}: SearchFormProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">검색 조건</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            시작일
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            종료일
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            서비스
          </label>
          <select
            value={serviceKey}
            onChange={(e) => onServiceKeyChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(SERVICE_KEYS).map(([key, value]) => (
              <option key={key} value={value}>
                {SERVICE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상품ID (선택)
          </label>
          <input
            type="text"
            value={productId}
            onChange={(e) => onProductIdChange(e.target.value)}
            placeholder="상품ID 입력"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            최대 개수
          </label>
          <input
            type="number"
            value={limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value) || 10)}
            min={1}
            max={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={onSubmit}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-md text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "분석 중..." : "검수 시작"}
          </button>
        </div>
      </div>
    </div>
  );
}
