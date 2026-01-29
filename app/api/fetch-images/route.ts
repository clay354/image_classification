import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequest } from "@/lib/types";
import { fetchReviewImages, generateDummyImages } from "@/lib/reviewApi";

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { startDate, endDate, serviceKey, productId, limit } = body;

    // 리뷰 이미지 가져오기 (분석 없이)
    let images;
    try {
      images = await fetchReviewImages({
        startDate,
        endDate,
        serviceKey,
        productId,
        limit,
      });
    } catch {
      // API 호출 실패 시 더미 데이터 사용 (개발용)
      console.log("리뷰 API 호출 실패, 더미 데이터 사용");
      images = generateDummyImages(Math.min(limit, 20));
    }

    return NextResponse.json({
      total: images.length,
      results: images,
    });
  } catch (error) {
    console.error("이미지 불러오기 API 오류:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "이미지 불러오기 중 오류 발생" },
      { status: 500 }
    );
  }
}
