import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "리뷰 이미지 검수",
  description: "리뷰 이미지를 AI로 분석하여 삭제 대상을 판별합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
