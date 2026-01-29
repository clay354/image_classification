import { NextRequest, NextResponse } from "next/server";
import { ReviewImage } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { results }: { results: ReviewImage[] } = await request.json();

    // CSV 헤더
    const headers = [
      "이미지ID",
      "이미지URL",
      "리뷰ID",
      "상품ID",
      "상품명",
      "서비스",
      "삭제대상",
      "사유",
      "카테고리",
      "확신도",
    ];

    // CSV 행 생성
    const rows = results.map((item) => [
      item.imageId,
      item.imageUrl,
      item.reviewId,
      item.productId,
      `"${item.productName.replace(/"/g, '""')}"`,
      item.serviceKey,
      item.analysis?.shouldDelete ? "Y" : "N",
      `"${(item.analysis?.reason || "").replace(/"/g, '""')}"`,
      item.analysis?.category || "",
      item.analysis?.confidence?.toFixed(2) || "",
    ]);

    // CSV 문자열 생성
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n"
    );

    // BOM 추가 (Excel에서 한글 깨짐 방지)
    const bom = "\uFEFF";
    const csvWithBom = bom + csv;

    return new NextResponse(csvWithBom, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="review_analysis_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("CSV 내보내기 오류:", error);
    return NextResponse.json(
      { error: "CSV 생성 중 오류 발생" },
      { status: 500 }
    );
  }
}
