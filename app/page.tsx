"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import PromptEditor from "@/components/PromptEditor";
import FilterBar, { FilterType } from "@/components/FilterBar";
import ImageList from "@/components/ImageList";
import { ReviewImage, DEFAULT_PROMPT, AnalyzeResponse } from "@/lib/types";

export default function Home() {
  // 검색 조건 상태
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [serviceKey, setServiceKey] = useState("");
  const [productId, setProductId] = useState("");
  const [limit, setLimit] = useState(20);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);

  // 결과 상태
  const [results, setResults] = useState<ReviewImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingImages, setFetchingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  // 이미지만 불러오기 (분석 없이)
  const handleFetchImages = async () => {
    setFetchingImages(true);
    setError(null);

    try {
      const response = await fetch("/api/fetch-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate,
          serviceKey: serviceKey || undefined,
          productId: productId ? parseInt(productId) : undefined,
          limit,
        }),
      });

      if (!response.ok) {
        throw new Error(`이미지 불러오기 실패: ${response.status}`);
      }

      const data: AnalyzeResponse = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setFetchingImages(false);
    }
  };

  // 분석 시작
  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate,
          serviceKey: serviceKey || undefined,
          productId: productId ? parseInt(productId) : undefined,
          limit,
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`분석 실패: ${response.status}`);
      }

      const data: AnalyzeResponse = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  // CSV 다운로드
  const handleExportCsv = async () => {
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results }),
      });

      if (!response.ok) {
        throw new Error("CSV 내보내기 실패");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `review_analysis_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : "CSV 다운로드 실패");
    }
  };

  // 삭제 대상 수 계산
  const deleteCount = results.filter((r) => r.analysis?.shouldDelete).length;

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">리뷰 이미지 검수</h1>

      {/* 검색 조건 */}
      <SearchForm
        startDate={startDate}
        endDate={endDate}
        serviceKey={serviceKey}
        productId={productId}
        limit={limit}
        loading={loading}
        fetchingImages={fetchingImages}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onServiceKeyChange={setServiceKey}
        onProductIdChange={setProductId}
        onLimitChange={setLimit}
        onFetchImages={handleFetchImages}
        onSubmit={handleAnalyze}
      />

      {/* 프롬프트 편집 (접을 수 있게) */}
      <details className="group">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
          프롬프트 편집 (클릭하여 펼치기)
        </summary>
        <div className="mt-2">
          <PromptEditor prompt={prompt} onPromptChange={setPrompt} />
        </div>
      </details>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* 필터 바 */}
      {results.length > 0 && (
        <FilterBar
          currentFilter={filter}
          onFilterChange={setFilter}
          totalCount={results.length}
          deleteCount={deleteCount}
          onExportCsv={handleExportCsv}
        />
      )}

      {/* 이미지 목록 */}
      <ImageList images={results} filter={filter} loading={loading} />
    </main>
  );
}
