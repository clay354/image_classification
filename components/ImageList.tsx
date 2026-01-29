"use client";

import { ReviewImage } from "@/lib/types";
import ImageCard from "./ImageCard";
import { FilterType } from "./FilterBar";

interface ImageListProps {
  images: ReviewImage[];
  filter: FilterType;
  loading: boolean;
}

export default function ImageList({ images, filter, loading }: ImageListProps) {
  // 필터링
  const filteredImages = images.filter((image) => {
    const analysis = image.analysis;
    if (!analysis) return filter === "all";

    switch (filter) {
      case "all":
        return true;
      case "delete":
        return analysis.shouldDelete;
      case "keep":
        return !analysis.shouldDelete;
      default:
        // 카테고리 필터
        return analysis.category === filter;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">이미지 분석 중...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
        <p className="text-gray-500">
          검색 조건을 입력하고 검수를 시작하세요.
        </p>
      </div>
    );
  }

  if (filteredImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
        <p className="text-gray-500">
          해당 필터에 맞는 이미지가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredImages.map((image) => (
        <ImageCard key={image.imageId} image={image} />
      ))}
    </div>
  );
}
