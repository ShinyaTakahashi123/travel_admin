/**
 * 見直しのあとにまとめて直す点(docs/content/20261030-after-review-coord-todo.md)の1番。
 * #111(33100ce1)の「日御碕の遊歩道」spot f542a416 の点を直す。
 *
 * 今の点(35.432264,132.62518)はOSMの小島「オノカメ」(place=islet, node 6329613314)と
 * 完全一致で、遊歩道・展望所の点ではない。OSM(api/0.6/map, bbox指定)・地理院地図のどちらにも
 * 名前のある遊歩道・展望所は見つからなかったため、点がない場合の例外として、経島と
 * 日御碕の集落の間の海岸沿いにある、名前のないtourism=viewpointの点を使う
 * (法務・企画運営のOK 2026-11-02。理由: OSM/地理院に名前のある遊歩道・展望所がない／
 * ベンチ2つ・ピクニック施設(node 12709487853)が隣にある／経島→ここ→集落の並びと
 * 歩く分が合う)。
 *
 * 新点: node 12709515147 (tourism=viewpoint) 35.4326320,132.6277764
 * 旧点からの移動: 約196m(オノカメは沖合の岩礁で、遊歩道そのものの点ではなかったため)
 *
 * 前後の歩く分の確認(routed-foot実測。許す範囲=測った値×1.5+5):
 *   経島→遊歩道: 今6分・実測6.1分 → 変わらない
 *   遊歩道→日御碕の集落: 今4分・実測3.8分 → 変わらない
 *
 * メモの文面について(企画運営の判断 2026-11-02): 「沖合に浮かぶ権現島などの小島」の
 * 権現島は、GSIの地名検索でこの灯台より800m以上東にある別の場所と確認された。この
 * 地点から見える景観の説明として確かでないため、島の名前を外し、確かめられる書き方
 * (「沖合に浮かぶ小島」)に直す。見た景色の内容そのものは変更しない。
 *
 * 直すのは、このSpotのlat/lngと、メモの「権現島などの」の文字列のみ。
 * 滞在時間・前後のtransitLegsは変更しない。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-111-hinomisaki-yuhodo.ts
 *   反映: npm run prod -- npx tsx prisma/fix-111-hinomisaki-yuhodo.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const SPOT_ID = "f542a416-37a8-45b8-b1a7-35c2ba4eb89f";
const NEW_LAT = 35.432632;
const NEW_LNG = 132.6277764;

const MEMO_FIND = "柱状節理や洞穴が見られる荒々しい海岸線と、沖合に浮かぶ権現島などの小島を眺めながら歩ける、日御碕ならではの散策路です。";
const MEMO_REPLACE = "柱状節理や洞穴が見られる荒々しい海岸線と、沖合に浮かぶ小島を眺めながら歩ける、日御碕ならではの散策路です。";

async function main() {
  const commit = process.argv.includes("--commit");

  await prisma.$transaction(
    async (tx) => {
      const spot = await tx.spot.findUniqueOrThrow({ where: { id: SPOT_ID } });
      if (spot.name !== "日御碕の遊歩道") {
        throw new Error(`[想定と違います] 名前が違います: ${spot.name}`);
      }
      if (!spot.memo || !spot.memo.includes(MEMO_FIND)) {
        throw new Error(`[想定と違います] メモに対象の文が見つかりません: ${spot.memo}`);
      }
      const newMemo = spot.memo.replace(MEMO_FIND, MEMO_REPLACE);

      console.log(`=== ${spot.name} (${spot.id}) ===`);
      console.log(`点 直前: lat=${spot.lat} lng=${spot.lng}`);
      console.log(`点 直後: lat=${NEW_LAT} lng=${NEW_LNG}`);
      console.log(`\nメモ 直前: ${spot.memo}`);
      console.log(`\nメモ 直後: ${newMemo}`);

      await tx.spot.update({ where: { id: SPOT_ID }, data: { lat: NEW_LAT, lng: NEW_LNG, memo: newMemo } });

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
