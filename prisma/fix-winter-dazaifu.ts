/**
 * 冬の特集の見直し(docs/content/20261102-winter-feature-rule-pass.md)。
 * 太宰府天満宮の初詣(3bc5f590、published)。
 *
 * 直すこと:
 *   1. 1か所目(太宰府天満宮)に入口(駅)からの行き方・分がない → 西鉄太宰府駅(railway=station
 *      node6063546670)からrouted-foot実測およそ9分を追加
 *   2. 太宰府天満宮参道の点(33.5202,130.532、小数4けた) → OSMの名前つきの道そのもの
 *      way45775591「太宰府天満宮参道」のNominatim中心(33.5195389,130.5334871)に直す。
 *      あわせて九州国立博物館からの移動をrouted-footで測り直し(新点で12.3分、旧10分)、
 *      transitLegとメモの書き出しに追加(現状は書き出しに分数の記載がなかった)
 *   3. 表参道に昼食の一文がない。「食べ歩き」の表現(決まり3章)も直す。あわせて、観世音寺への
 *      移動の分(バス20分、現状は書かれていなかった)も閉じの文に追加
 *   4. 太宰府政庁跡の書き出し「観世音寺から歩いておよそ10分」が、実際のtransitLeg(18分)と
 *      合っていない(2章)。18分に直す
 *   5. 最後の竈門神社に帰りの一文がない。西鉄太宰府駅までのバス(車実測4.8分から、既存の区間と
 *      同じ「太宰府ぐるっとバスまほろば号」でおよそ10分)を追加
 *   6. 太宰府政庁跡の閉じの文「すぐそばの竈門神社へ向かいましょう」が、実際はバスで25分の区間
 *      なので、「バスでおよそ25分」の形に直す(企画運営の指摘 2026-11-02)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-winter-dazaifu.ts
 *   反映: npm run prod -- npx tsx prisma/fix-winter-dazaifu.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const TENMANGU_SPOT_ID = "4505781e-2773-4cde-8632-0b5fc79c7c15";
const SANDO_SPOT_ID = "5e60c093-a2fe-4dde-818f-b53916e5e8b5";
const SANDO_LEG_ID = "f9733448-cbfe-4db3-b48a-05b30e881fd4";
const SEICHO_SPOT_ID = "2b72f519-5798-44de-ad4e-5984f6b2acf4";
const KAMADO_SPOT_ID = "ecb2f7c3-b6ec-435b-9acf-cb5dc3bdaddc";

const TENMANGU_FIND = "旅の始まりは太宰府天満宮です。";
const TENMANGU_REPLACE = "西鉄太宰府駅から歩いておよそ9分、太宰府天満宮に着きます。";

const SANDO_NEW_LAT = 33.5195389;
const SANDO_NEW_LNG = 130.5334871;
const SANDO_FIND =
  "続いては太宰府天満宮参道です。天満宮の表参道におよそ200mにわたって土産物店や飲食店が軒を連ね、中でも名物の梅ヶ枝餅は、太宰府ならではの味として親しまれています。梅ヶ枝餅の由来には諸説ありますが、左遷され軟禁同然の暮らしを強いられていた道真公を気の毒に思った近所の老婆が、好物だった餅を梅の枝に刺して差し入れたという言い伝えが広く知られています。参拝の余韻に浸りながら、焼きたての梅ヶ枝餅を味わう食べ歩きも、太宰府ならではの旅の楽しみです。静かに、敬意をもってお過ごしください。この後は、観世音寺へ向かいましょう。";
const SANDO_REPLACE =
  "九州国立博物館から歩いておよそ12分、太宰府天満宮参道に着きます。天満宮の表参道におよそ200mにわたって土産物店や飲食店が軒を連ね、中でも名物の梅ヶ枝餅は、太宰府ならではの味として親しまれています。梅ヶ枝餅の由来には諸説ありますが、左遷され軟禁同然の暮らしを強いられていた道真公を気の毒に思った近所の老婆が、好物だった餅を梅の枝に刺して差し入れたという言い伝えが広く知られています。ここで、焼きたての梅ヶ枝餅などの昼食をとりましょう。静かに、敬意をもってお過ごしください。この後は、バスでおよそ20分、観世音寺へ向かいましょう。";

const SEICHO_FIND = "観世音寺から歩いておよそ10分、太宰府政庁跡に着きます。";
const SEICHO_REPLACE = "観世音寺から歩いておよそ18分、太宰府政庁跡に着きます。";
const SEICHO_CLOSE_FIND = "すぐそばの竈門神社へ向かいましょう。";
const SEICHO_CLOSE_REPLACE = "バスでおよそ25分、竈門神社へ向かいましょう。";

const KAMADO_FIND = "静かに、敬意をもってお参りください。太宰府めぐりを、ここで締めくくりましょう。";
const KAMADO_REPLACE =
  "静かに、敬意をもってお参りください。太宰府めぐりを、ここで締めくくりましょう。見学を終えたら、バスでおよそ10分の西鉄太宰府駅から帰りましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  await prisma.$transaction(
    async (tx) => {
      const tenmangu = await tx.spot.findUniqueOrThrow({ where: { id: TENMANGU_SPOT_ID } });
      const sando = await tx.spot.findUniqueOrThrow({ where: { id: SANDO_SPOT_ID } });
      const seicho = await tx.spot.findUniqueOrThrow({ where: { id: SEICHO_SPOT_ID } });
      const kamado = await tx.spot.findUniqueOrThrow({ where: { id: KAMADO_SPOT_ID } });

      if (!tenmangu.memo?.includes(TENMANGU_FIND)) throw new Error("[想定と違います] 太宰府天満宮のメモに対象の文がありません");
      if (!sando.memo?.includes(SANDO_FIND)) throw new Error("[想定と違います] 表参道のメモに対象の文がありません");
      if (!seicho.memo?.includes(SEICHO_FIND)) throw new Error("[想定と違います] 政庁跡のメモに対象の文がありません");
      if (!seicho.memo?.includes(SEICHO_CLOSE_FIND)) throw new Error("[想定と違います] 政庁跡のメモに対象の閉じの文がありません");
      if (!kamado.memo?.includes(KAMADO_FIND)) throw new Error("[想定と違います] 竈門神社のメモに対象の文がありません");

      const newTenmanguMemo = tenmangu.memo.replace(TENMANGU_FIND, TENMANGU_REPLACE);
      const newSandoMemo = sando.memo.replace(SANDO_FIND, SANDO_REPLACE);
      const newSeichoMemo = seicho.memo!.replace(SEICHO_FIND, SEICHO_REPLACE).replace(SEICHO_CLOSE_FIND, SEICHO_CLOSE_REPLACE);
      const newKamadoMemo = kamado.memo!.replace(KAMADO_FIND, KAMADO_REPLACE);

      console.log("=== 太宰府天満宮 ===");
      console.log("直前:", tenmangu.memo);
      console.log("直後:", newTenmanguMemo);

      console.log("\n=== 太宰府天満宮参道 ===");
      console.log(`点 直前: lat=${sando.lat} lng=${sando.lng}`);
      console.log(`点 直後: lat=${SANDO_NEW_LAT} lng=${SANDO_NEW_LNG}`);
      console.log("transitLeg min 直前=10 直後=12");
      console.log("時刻 直前=12:30 直後=12:32(九州国立博物館10:50+90+歩12=12:32)");
      console.log("滞在 直前=50 直後=48(13:20に出てバス20で観世音寺13:40は変わらない)");
      console.log("直前:", sando.memo);
      console.log("直後:", newSandoMemo);

      console.log("\n=== 太宰府政庁跡 ===");
      console.log("直前:", seicho.memo);
      console.log("直後:", newSeichoMemo);

      console.log("\n=== 竈門神社 ===");
      console.log("直前:", kamado.memo);
      console.log("直後:", newKamadoMemo);

      await tx.spot.update({ where: { id: TENMANGU_SPOT_ID }, data: { memo: newTenmanguMemo } });
      await tx.spot.update({
        where: { id: SANDO_SPOT_ID },
        data: {
          lat: SANDO_NEW_LAT,
          lng: SANDO_NEW_LNG,
          memo: newSandoMemo,
          visitTime: new Date(Date.UTC(1970, 0, 1, 12, 32, 0)),
          stayDurationMin: 48,
        },
      });
      await tx.spotTransitLeg.update({ where: { id: SANDO_LEG_ID }, data: { transitDurationMin: 12 } });
      await tx.spot.update({ where: { id: SEICHO_SPOT_ID }, data: { memo: newSeichoMemo } });
      await tx.spot.update({ where: { id: KAMADO_SPOT_ID }, data: { memo: newKamadoMemo } });

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

  if (commit) console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
