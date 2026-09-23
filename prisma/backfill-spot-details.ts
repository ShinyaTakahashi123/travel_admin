/**
 * 既存スポットへのmemo・websiteUrl反映スクリプト
 *
 * 実行方法: npx tsx prisma/backfill-spot-details.ts
 *
 * spots-data.ts の SPOTS には元々 memo（説明文）・websiteUrl（公式サイト）が無く、
 * それらを追加した後も、既にDBへ投入済みのしおり（＝スポット行）には反映されない
 * （seed-sample-itineraries.ts はタイトルの重複チェックで既存しおりをスキップするため）。
 * 本スクリプトは、既存の spot テーブルを名前でマッチングし、SPOTS の最新の
 * memo・websiteUrl で一括更新する（住所・緯度経度・その他フィールドは変更しない）。
 *
 * spots-data.ts はデータのみのファイルであり、DB書き込み等の副作用を持たないため、
 * これをimportしても本スクリプトの実行以外に余計な処理は走らない
 * （seed-sample-itineraries.ts を直接importすると、そのファイル末尾のmain()実行まで
 * 巻き込んでしまうため、ここでは必ずデータ専用モジュールの方を参照すること）。
 */

import { prisma } from "../src/lib/prisma";
import { SPOTS } from "./spots-data";

async function main() {
  let updatedTotal = 0;

  for (const pool of Object.values(SPOTS)) {
    for (const spot of pool) {
      const result = await prisma.spot.updateMany({
        where: { name: spot.name },
        data: { memo: spot.memo, websiteUrl: spot.websiteUrl },
      });
      if (result.count > 0) {
        console.log(`更新: ${spot.name}（${result.count}件）`);
        updatedTotal += result.count;
      }
    }
  }

  console.log(`完了: 合計${updatedTotal}件のスポットを更新しました`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
