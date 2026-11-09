/**
 * 見直しのあとにまとめて直す点(docs/content/20261030-after-review-coord-todo.md)の2番。
 * 桧木内川堤の点がある角館の3本のうち、#114(7f8fb644)・#116(c4f58fdd)はすでに
 * 「桜並木ポケットパーク」node 7454945415 (leisure=park, 39.5996573,140.5598501) に
 * 直し済み。残る2本(チェックリスト外の日帰り/1泊プラン)を同じ点にそろえる。
 *
 * 対象:
 *   - c10810bd-7737-4403-a98b-d1e852c8d138（桧木内川堤の桜並木、絶景フォトスポットを楽しむ角館プラン）spot 1d090ec7
 *   - afb492ce-ab6d-4aeb-9879-5cea0ad0624b（武家屋敷通りを歩く、「みちのくの小京都」角館さんぽ日帰りプラン）spot da92ce0c
 *
 * 直すのは2つのSpotの lat/lng だけ。名前・メモ・滞在時間・前後の歩き分数は変更しない。
 *
 * 旧点(39.599654,140.558631)は堤の上の道の無名の点で、routed-foot実測で隣接区間が
 * 2.1km/28分という明らかな迂回(異常値)になることを確認した(新点では399m/5.3分)。
 * 新点は旧点から東へ約104m。
 *
 * 前後の歩く分の確認(法務OK 2026-11-02 00:59。許す範囲=測った値×1.5+5):
 *   c10810bd: 桧木内川堤→武家屋敷通り（内町） 今10分・新点のrouted-foot実測5.3分 → 変わらない
 *   afb492ce: 平福記念美術館→桧木内川堤 今5分・新点のrouted-foot実測4.3分 → 変わらない
 *   (メモの分・transitLegsの分は変更しない)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-kakunodate-hinoki-coord.ts
 *   反映: npm run prod -- npx tsx prisma/fix-kakunodate-hinoki-coord.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const NEW_LAT = 39.5996573;
const NEW_LNG = 140.5598501;

const TARGETS = [
  { spotId: "1d090ec7-d947-4fed-ab6d-71ce0d8515ad", itineraryId: "c10810bd-7737-4403-a98b-d1e852c8d138" },
  { spotId: "da92ce0c-597c-4aab-9231-e00daea317d0", itineraryId: "afb492ce-ab6d-4aeb-9879-5cea0ad0624b" },
];

async function main() {
  const commit = process.argv.includes("--commit");

  await prisma.$transaction(
    async (tx) => {
      for (const t of TARGETS) {
        const spot = await tx.spot.findUniqueOrThrow({ where: { id: t.spotId } });
        if (spot.name !== "桧木内川堤") {
          throw new Error(`[想定と違います] spot ${t.spotId} の名前が「桧木内川堤」ではありません: ${spot.name}`);
        }
        console.log(`\n=== ${t.itineraryId} / ${spot.name} (${spot.id}) ===`);
        console.log(`直前: lat=${spot.lat} lng=${spot.lng}`);
        console.log(`直後: lat=${NEW_LAT} lng=${NEW_LNG}`);
        console.log(`前後の歩く分: 変更なし（上のコメント参照、法務OKの許す範囲内）`);
        await tx.spot.update({ where: { id: t.spotId }, data: { lat: NEW_LAT, lng: NEW_LNG } });
      }

      if (!commit) {
        console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
        throw new Error("DRY_RUN_ROLLBACK");
      }
    },
    { timeout: 60000 }
  ).catch((e) => {
    if (e.message === "DRY_RUN_ROLLBACK") return;
    throw e;
  });

  if (commit) {
    console.log("\n[--commit] 書き込みました。");
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
