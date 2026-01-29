import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 환경변수에서 허용된 IP 목록을 가져옵니다
// Vercel 환경변수에 ALLOWED_IPS를 쉼표로 구분하여 설정하세요
// 예: "123.456.789.0,111.222.333.444"
function getAllowedIPs(): string[] {
  const allowedIPs = process.env.ALLOWED_IPS;
  if (!allowedIPs) {
    return [];
  }
  return allowedIPs.split(",").map((ip) => ip.trim());
}

function getClientIP(request: NextRequest): string | null {
  // Vercel에서는 x-forwarded-for 헤더를 통해 실제 클라이언트 IP를 전달합니다
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for는 "client, proxy1, proxy2" 형식일 수 있음
    return forwardedFor.split(",")[0].trim();
  }

  // x-real-ip 헤더도 확인
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP.trim();
  }

  return null;
}

export function middleware(request: NextRequest) {
  const allowedIPs = getAllowedIPs();

  // ALLOWED_IPS가 설정되지 않으면 모든 접근 허용 (개발 환경 등)
  if (allowedIPs.length === 0) {
    return NextResponse.next();
  }

  const clientIP = getClientIP(request);

  // IP를 확인할 수 없는 경우 차단
  if (!clientIP) {
    return new NextResponse("Forbidden: Unable to determine IP", {
      status: 403,
    });
  }

  // 허용된 IP 목록에 있는지 확인
  if (allowedIPs.includes(clientIP)) {
    return NextResponse.next();
  }

  // 허용되지 않은 IP는 403 반환
  return new NextResponse("Forbidden: Access denied", {
    status: 403,
  });
}

// 미들웨어를 적용할 경로 설정
// 모든 페이지와 API에 적용 (정적 파일 제외)
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 적용:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
