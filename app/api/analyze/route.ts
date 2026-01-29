import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequest, AnalyzeResponse, DEFAULT_PROMPT } from "@/lib/types";
import { fetchReviewImages, generateDummyImages } from "@/lib/reviewApi";
import { analyzeImage } from "@/lib/claudeApi";

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { startDate, endDate, serviceKey, productId, limit, prompt } = body;

    // 프롬프트 설정
    const analysisPrompt = prompt || DEFAULT_PROMPT;

    // 리뷰 이미지 가져오기
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

    // Claude로 각 이미지 분석
    const results = await Promise.all(
      images.map(async (image) => {
        const analysis = await analyzeImage(image.imageUrl, analysisPrompt);
        return {
          ...image,
          analysis,
        };
      })
    );

    const response: AnalyzeResponse = {
      total: results.length,
      results,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("분석 API 오류:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "분석 중 오류 발생" },
      { status: 500 }
    );
  }
}
