export interface AnalyzeRequest {
  startDate: string;
  endDate: string;
  serviceKey?: string;
  productId?: number | null;
  limit: number;
  prompt?: string;
}

export interface ImageAnalysis {
  shouldDelete: boolean;
  reason: string;
  category: string;
  confidence: number;
}

export interface ReviewImage {
  imageId: number;
  imageUrl: string;
  reviewId: number;
  productId: number;
  productName: string;
  serviceKey: string;
  analysis?: ImageAnalysis;
}

export interface AnalyzeResponse {
  total: number;
  results: ReviewImage[];
}

export const SERVICE_KEYS = {
  ALL: "",
  STAY_DOMESTIC: "STAY_DOMESTIC",
  STAY_OVERSEA: "STAY_OVERSEA",
  SPACE_RENTAL: "SPACE_RENTAL",
} as const;

export const SERVICE_LABELS: Record<string, string> = {
  "": "전체",
  STAY_DOMESTIC: "국내숙소",
  STAY_OVERSEA: "해외숙소",
  SPACE_RENTAL: "공간대여",
};

export const CATEGORY_LABELS: Record<string, string> = {
  "음란": "음란/선정적",
  "광고": "광고/스팸",
  "무관": "숙소 무관",
  "정상": "정상",
};

export const DEFAULT_PROMPT = `이 이미지를 분석하여 숙소 리뷰 이미지로 적절한지 판단해주세요.

다음 기준에 따라 삭제 대상 여부를 판별해주세요:

1. 음란/선정적 이미지: 노출이 심하거나 성적인 내용이 포함된 이미지
2. 광고/스팸성 이미지: 홍보 문구, 연락처, 다른 서비스 광고가 포함된 이미지
3. 숙소와 무관한 이미지: 음식 사진, 셀카, 일반 풍경 등 숙소 시설과 관련 없는 이미지

응답은 반드시 다음 JSON 형식으로만 답변해주세요:
{
  "shouldDelete": true 또는 false,
  "reason": "판단 이유를 간단히 설명",
  "category": "음란", "광고", "무관", "정상" 중 하나,
  "confidence": 0.0 ~ 1.0 사이의 확신도
}`;
