import type { Metadata } from "next";
import "./globals.css";

// ⚠️ next/font/google（Noto Sans JP）は使わない方針にしている。Next.js 16の
// Turbopack本番ビルドがGoogle Fontsのフェッチに失敗することがあり
// （"Can't resolve '@vercel/turbopack-next/internal/font/google/font'"）、
// Vercelのビルドが落ちる事例が確認されたため。OS標準の日本語フォントに
// フォールバックする構成にして、ビルド時のネットワーク依存をなくしている。

export const metadata: Metadata = {
  title: "旅しおり 管理者サイト",
  description: "旅しおりプラットフォームの内部運営ツール",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
