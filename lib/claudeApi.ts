import Anthropic from "@anthropic-ai/sdk";
import { ImageAnalysis } from "./types";

const anthropic = new Anthropic();

export async function analyzeImage(
  imageUrl: string,
  prompt: string
): Promise<ImageAnalysis> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "url",
                url: imageUrl,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    // 응답에서 텍스트 추출
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("Claude 응답에 텍스트가 없습니다");
    }

    // JSON 파싱
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Claude 응답에서 JSON을 찾을 수 없습니다");
    }

    const result = JSON.parse(jsonMatch[0]) as ImageAnalysis;
    return result;
  } catch (error) {
    console.error("이미지 분석 실패:", error);
    return {
      shouldDelete: false,
      reason: `분석 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      category: "정상",
      confidence: 0,
    };
  }
}

export async function analyzeImageBatch(
  images: { imageId: number; imageUrl: string }[],
  prompt: string,
  onProgress?: (completed: number, total: number) => void
): Promise<Map<number, ImageAnalysis>> {
  const results = new Map<number, ImageAnalysis>();
  const total = images.length;

  // 병렬 처리 (동시에 5개씩)
  const batchSize = 5;
  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (img) => {
        const analysis = await analyzeImage(img.imageUrl, prompt);
        return { imageId: img.imageId, analysis };
      })
    );

    batchResults.forEach(({ imageId, analysis }) => {
      results.set(imageId, analysis);
    });

    if (onProgress) {
      onProgress(Math.min(i + batchSize, total), total);
    }
  }

  return results;
}
