"use client";

import { useState } from "react";
import { ReviewImage, SERVICE_LABELS, CATEGORY_LABELS } from "@/lib/types";

interface ImageCardProps {
  image: ReviewImage;
}

export default function ImageCard({ image }: ImageCardProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 1500);
  };

  const { analysis } = image;
  const shouldDelete = analysis?.shouldDelete ?? false;

  return (
    <div
      className={`bg-white rounded-lg shadow overflow-hidden border-2 ${
        shouldDelete ? "border-red-400" : "border-green-400"
      }`}
    >
      {/* 이미지 */}
      <div className="relative aspect-video bg-gray-100">
        <img
          src={image.imageUrl}
          alt={`리뷰 이미지 ${image.imageId}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* 판별 결과 배지 */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white ${
            shouldDelete ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {shouldDelete ? "삭제대상" : "정상"}
        </div>
      </div>

      {/* 정보 영역 */}
      <div className="p-4 space-y-3">
        {/* 분석 결과 */}
        {analysis && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  shouldDelete
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {CATEGORY_LABELS[analysis.category] || analysis.category}
              </span>
              <span className="text-xs text-gray-500">
                확신도: {(analysis.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-sm text-gray-600">{analysis.reason}</p>
          </div>
        )}

        {/* 메타 정보 */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <InfoItem
            label="이미지ID"
            value={image.imageId.toString()}
            onCopy={() =>
              copyToClipboard(image.imageId.toString(), "imageId")
            }
            copied={copied === "imageId"}
          />
          <InfoItem
            label="리뷰ID"
            value={image.reviewId.toString()}
            onCopy={() =>
              copyToClipboard(image.reviewId.toString(), "reviewId")
            }
            copied={copied === "reviewId"}
          />
          <InfoItem
            label="상품ID"
            value={image.productId.toString()}
            onCopy={() =>
              copyToClipboard(image.productId.toString(), "productId")
            }
            copied={copied === "productId"}
          />
          <InfoItem
            label="서비스"
            value={SERVICE_LABELS[image.serviceKey] || image.serviceKey}
          />
        </div>

        {/* 상품명 */}
        <div
          className="text-sm font-medium text-gray-800 cursor-pointer hover:text-blue-600 truncate"
          onClick={() => copyToClipboard(image.productName, "productName")}
          title={`${image.productName} (클릭하여 복사)`}
        >
          {image.productName}
          {copied === "productName" && (
            <span className="ml-2 text-xs text-green-600">복사됨!</span>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div
      className={`${onCopy ? "cursor-pointer hover:bg-gray-50" : ""} p-1 rounded`}
      onClick={onCopy}
      title={onCopy ? "클릭하여 복사" : undefined}
    >
      <span className="text-gray-500">{label}: </span>
      <span className="font-medium text-gray-800">{value}</span>
      {copied && <span className="ml-1 text-green-600">복사됨!</span>}
    </div>
  );
}
