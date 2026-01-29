import { ReviewImage } from "./types";

interface FetchReviewImagesParams {
  startDate: string;
  endDate: string;
  serviceKey?: string;
  productId?: number | null;
  limit: number;
}

export async function fetchReviewImages(
  params: FetchReviewImagesParams
): Promise<ReviewImage[]> {
  const apiKey = process.env.REVIEW_API_KEY;
  const apiUrl = process.env.REVIEW_API_URL;

  if (!apiKey || !apiUrl) {
    throw new Error("REVIEW_API_KEY 또는 REVIEW_API_URL이 설정되지 않았습니다");
  }

  // API 호출 로직 (실제 API 스펙에 맞게 수정 필요)
  const queryParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
    limit: params.limit.toString(),
  });

  if (params.serviceKey) {
    queryParams.append("serviceKey", params.serviceKey);
  }

  if (params.productId) {
    queryParams.append("productId", params.productId.toString());
  }

  const response = await fetch(`${apiUrl}?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`리뷰 이미지 API 호출 실패: ${response.status}`);
  }

  const data = await response.json();

  // API 응답 형식에 맞게 매핑 (실제 응답 구조에 맞게 수정 필요)
  return data.map((item: Record<string, unknown>) => ({
    imageId: item.imageId || item.id,
    imageUrl: item.imageUrl || item.url,
    reviewId: item.reviewId,
    productId: item.productId,
    productName: item.productName || "상품명 없음",
    serviceKey: item.serviceKey || params.serviceKey || "UNKNOWN",
  }));
}

// 테스트용 더미 데이터 생성
export function generateDummyImages(count: number): ReviewImage[] {
  const serviceKeys = ["STAY_DOMESTIC", "STAY_OVERSEA", "SPACE_RENTAL"];
  const productNames = [
    "서울 강남 호텔",
    "제주 풀빌라",
    "부산 해운대 펜션",
    "도쿄 시부야 호텔",
    "오사카 난바 료칸",
    "강남 파티룸",
  ];

  return Array.from({ length: count }, (_, i) => ({
    imageId: 274981 + i,
    imageUrl: `https://picsum.photos/400/300?random=${i}`,
    reviewId: 1112181796 + i,
    productId: 30626 + (i % 10),
    productName: productNames[i % productNames.length],
    serviceKey: serviceKeys[i % serviceKeys.length],
  }));
}
