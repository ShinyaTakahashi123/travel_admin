import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getActiveAdmin } from "@/lib/admin-guard";

export async function POST(request: Request): Promise<NextResponse> {
  const admin = await getActiveAdmin();
  if (!admin) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // クライアント側でcanvasに描き直したJPEGだけを受け付ける
        // (受け付ける拡張子・サイズの最終確認はサーバー側(assertValidThemeImageUrl)で行う)
        return {
          allowedContentTypes: ["image/jpeg"],
          maximumSizeInBytes: 400 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "アップロードに失敗しました" },
      { status: 400 }
    );
  }
}
