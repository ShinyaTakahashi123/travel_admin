import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// driverAdapters経由でWASM版クエリエンジンを使う構成。開発機がWindows ARM64であり、
// ネイティブのquery engineバイナリ(x64専用でビルドされる)がロードできない
// ("not a valid Win32 application")ため、pgドライバアダプタ経由の接続に固定している。
// 本番環境(x64/Linux等)でもこのまま動作するため、この構成を分岐させる必要はない。

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Neon(サーバーレスPostgres)は一定時間アイドルが続くとcomputeがスリープし、
// 復帰直後の最初の接続だけ "Can't reach database server"(P1001) で失敗することがある
// (Neon公式ドキュメントでも既知の挙動としてリトライを推奨している)。
// 通常のDB障害まで無限にリトライしないよう、1回だけ間を置いて再試行する。
function isTransientConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("Can't reach database server") || message.includes("P1001");
}

// 権利侵害の申告・開示請求への対応のためだけに記録しているIPアドレスは、
// 誤ってRSC payload等で外部に漏らさないよう、明示的に取得しない限り既定で除外する
// (取得する場合は `prisma.comment.findMany({ omit: { ipAddress: false } })` のように上書きする)
function createPrismaClient() {
  return new PrismaClient({
    adapter,
    omit: {
      comment: { ipAddress: true },
      request: { ipAddress: true },
      itinerary: { submittedIp: true },
    },
  }).$extends({
    query: {
      async $allOperations({ args, query }) {
        try {
          return await query(args);
        } catch (error) {
          if (!isTransientConnectionError(error)) throw error;
          await new Promise((resolve) => setTimeout(resolve, 800));
          return await query(args);
        }
      },
    },
  });
}

type PrismaClientWithRetry = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientWithRetry | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
