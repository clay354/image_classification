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
    const hasApiConfig = process.env.REVIEW_API_URL && process.env.REVIEW_API_KEY;

    try {
      images = await fetchReviewImages({
        startDate,
        endDate,
        serviceKey,
        productId,
        limit,
      });
    } catch (err) {
      console.error("리뷰 API 호출 실패:", err);

      // 환경변수가 설정된 경우 에러 반환, 아니면 더미 데이터
      if (hasApiConfig) {
        throw err;
      }
      console.log("환경변수 미설정, 더미 데이터 사용");
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
