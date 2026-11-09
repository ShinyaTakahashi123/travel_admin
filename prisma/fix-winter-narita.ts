/**
 * 冬の特集の見直し(docs/content/20261102-winter-feature-rule-pass.md)。
 * 成田山新勝寺の初詣(708a13d8、published)。
 *
 * 直すこと:
 *   1. 成田山表参道の点(35.7838,140.3176、小数4けた)を、OSMの名前つきの地物に直す。
 *      店の点は使わない決まり(企画運営2026-11-02)のため、名前のある道way1017790798「表参道」の
 *      頂点node2300346786(タグなしの道の頂点、現在の点から64m、35.7838614,140.3168953)を使用。
 *      点が変わったため、成田山書道美術館→表参道の移動をrouted-footで測り直し(新点で12.1分、
 *      旧10分)、transitLegとメモの文を12分に直す
 *   2. 表参道に昼食の一文がない。あわせて「食べ歩き」の表現(決まり3章)も直す
 *   3. 最後の佐倉武家屋敷通りに帰りの一文がない。佐倉駅までrouted-foot実測(21.4分)を追加
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-winter-narita.ts
 *   反映: npm run prod -- npx tsx prisma/fix-winter-narita.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const SANDO_SPOT_ID = "d5cf73e2-4d90-4d23-a96d-13772cbbbdd2";
const SANDO_LEG_ID = "900965e3-4969-446a-996a-e2c0f4f1cd63";
const YASHIKI_SPOT_ID = "ca8ccc45-8470-4885-ba08-9dc9e69e9c1a";

const NEW_LAT = 35.7838614;
const NEW_LNG = 140.3168953;

const SANDO_MEMO_FIND =
  "成田山書道美術館から歩いておよそ10分、成田山表参道に着きます。成田山新勝寺まで続くおよそ800メートルのこの参道には、江戸時代の面影を残す趣ある建物が軒を連ねています。江戸時代、成田詣でが盛んになると、長旅の疲れを癒やす鰻料理が参拝客の評判を呼び、以来この参道は鰻の名店が並ぶ通りとしても知られるようになりました。新年の参拝のあとは、できたての鰻に舌鼓を打ちながら、参道の食べ歩きも楽しみましょう。新しい1年の始まりを、成田の門前町で心穏やかに迎えましょう。";
const SANDO_MEMO_REPLACE =
  "成田山書道美術館から歩いておよそ12分、成田山表参道に着きます。成田山新勝寺まで続くおよそ800メートルのこの参道には、江戸時代の面影を残す趣ある建物が軒を連ねています。江戸時代、成田詣でが盛んになると、長旅の疲れを癒やす鰻料理が参拝客の評判を呼び、以来この参道は鰻の名店が並ぶ通りとしても知られるようになりました。ここで鰻料理の昼食をとりましょう。新しい1年の始まりを、成田の門前町で心穏やかに迎えましょう。";

const YASHIKI_MEMO_FIND =
  "通りの散策自体はいつでもできるので、「小江戸」とも呼ばれる佐倉の歴史ある空気を感じながら、新しい1年の始まりを、しずかな武家町の散策で締めくくりましょう。";
const YASHIKI_MEMO_REPLACE =
  "通りの散策自体はいつでもできるので、「小江戸」とも呼ばれる佐倉の歴史ある空気を感じながら、新しい1年の始まりを、しずかな武家町の散策で締めくくりましょう。見学を終えたら、歩いておよそ21分の佐倉駅から帰りましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  await prisma.$transaction(
    async (tx) => {
      const sando = await tx.spot.findUniqueOrThrow({ where: { id: SANDO_SPOT_ID } });
      const yashiki = await tx.spot.findUniqueOrThrow({ where: { id: YASHIKI_SPOT_ID } });
      if (!sando.memo?.includes(SANDO_MEMO_FIND)) throw new Error("[想定と違います] 表参道のメモに対象の文がありません");
      if (!yashiki.memo?.includes(YASHIKI_MEMO_FIND)) throw new Error("[想定と違います] 武家屋敷通りのメモに対象の文がありません");

      console.log("=== 成田山表参道 ===");
      console.log(`点 直前: lat=${sando.lat} lng=${sando.lng}`);
      console.log(`点 直後: lat=${NEW_LAT} lng=${NEW_LNG}`);
      console.log(`transitLeg min 直前=10 直後=12`);
      console.log(`時刻 直前=12:25 直後=12:27(書道美術館11:35+40+歩12=12:27)`);
      console.log(`滞在 直前=50 直後=48(13:15に出て電車15で宗吾霊堂13:30は変わらない)`);
      console.log("メモ 直前:", sando.memo);
      console.log("メモ 直後:", sando.memo.replace(SANDO_MEMO_FIND, SANDO_MEMO_REPLACE));

      console.log("\n=== 佐倉武家屋敷通り ===");
      console.log("メモ 直前:", yashiki.memo);
      console.log("メモ 直後:", yashiki.memo!.replace(YASHIKI_MEMO_FIND, YASHIKI_MEMO_REPLACE));

      await tx.spot.update({
        where: { id: SANDO_SPOT_ID },
        data: {
          lat: NEW_LAT,
          lng: NEW_LNG,
          memo: sando.memo.replace(SANDO_MEMO_FIND, SANDO_MEMO_REPLACE),
          visitTime: new Date(Date.UTC(1970, 0, 1, 12, 27, 0)),
          stayDurationMin: 48,
        },
      });
      await tx.spotTransitLeg.update({ where: { id: SANDO_LEG_ID }, data: { transitDurationMin: 12 } });
      await tx.spot.update({ where: { id: YASHIKI_SPOT_ID }, data: { memo: yashiki.memo!.replace(YASHIKI_MEMO_FIND, YASHIKI_MEMO_REPLACE) } });

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
