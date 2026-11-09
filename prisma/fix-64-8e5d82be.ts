/**
 * #64(伊根の舟屋と丹後の海を満喫する、1泊2日のんびり漁村旅、8e5d82be)の
 * 初日を、仕様書 docs/specs/20261029-first-last-day-times.md と、
 * 企画運営が追記した「入口と1か所目」の決まり(入口は10:30より早く
 * ならない・1か所目は入口+移動時間で10:45〜11:45・入口の名前と移動時間を
 * 1か所目のメモに書く)に合わせて組み直す。最終日(2日目)は1泊2日のため
 * 今のまま変更しない。
 *
 * 【直す前】Day1は09:30開始・7か所(伊根の舟屋→伊根湾めぐり遊覧船→
 * 舟屋の里公園→経ヶ岬灯台→立岩→琴引浜→夕日ヶ浦海岸)、16:30終了。
 *
 * 【直した内容】
 * ①経ヶ岬灯台: 丹後半島の最北端への大きな寄り道(往復で車60分)で、
 *   タイトル・説明文の見どころ(伊根の舟屋・琴引浜)に当たらないため外した
 *   (写真1枚も外れる)。
 * ②立岩: 初回案では伊根の舟屋を10:50着にしていたが、企画運営の指摘で
 *   「天橋立駅から伊根まで車で40〜50分かかり、10:50着だと駅に9時台に
 *   着くことになる」と判明。入口(天橋立駅)に11時ごろ着く前提に直すと、
 *   伊根の舟屋の到着は11:45ごろになり、その後ろの時間が足りなくなるため、
 *   立岩も外した(初日は3か所以上の決まりは、5か所で満たす)。
 * ③伊根の舟屋の書き出しに、入口(天橋立駅)に11時ごろ着く前提と、そこから
 *   レンタカーで伊根まで(およそ45分)の移動を明記。法務の指摘で、
 *   「日本を代表する漁村風景です」(評価の言い切り)を「全国でも珍しい
 *   漁村の風景です」に修正。
 * ④舟屋の里公園: もとの文に移動の書き出し・結びがなかったため追加。
 *   「旅の合間に…ひと休みしましょう」を「ここで…昼食にしましょう」に
 *   直して、昼食の決まりに合わせた。結びは、立岩を外したため琴引浜への
 *   案内に変更。
 * ⑤琴引浜: もとの文に移動の書き出し・結びがなかったため追加。書き出しは
 *   立岩を外したため舟屋の里公園からの移動に変更。
 * ⑥伊根湾めぐり遊覧船・夕日ヶ浦海岸は本文無修正、時刻のみ変更
 *   (伊根湾めぐり遊覧船のみ滞在35→30分。本文の「およそ25分かけて周遊」に
 *   合わせた)。
 *
 * 新しい時刻(Day1、11:45〜16:47、5か所): 伊根の舟屋11:45(60、天橋立駅から
 * 車およそ45分)→伊根湾めぐり遊覧船12:50(30)→舟屋の里公園13:27(40、
 * 昼食)→琴引浜14:52(50)→夕日ヶ浦海岸15:57(50)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-64-8e5d82be.ts
 *   反映: npm run prod -- npx tsx prisma/fix-64-8e5d82be.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "f51d2b29-11a0-446b-855b-418859fe4263";

const FUNAYA_ID = "5702fe5d-9a15-4712-93dd-2458a6ca1179"; // 伊根の舟屋
const YUKAKU_ID = "70247481-a970-461b-8ffb-1d5451143dfb"; // 伊根湾めぐり遊覧船
const SATOKOEN_ID = "6e4c3124-22dd-45b4-943b-314e6e1fb419"; // 舟屋の里公園
const KYOGAMISAKI_ID = "b5bf8025-4254-4f4e-baf1-817dcbdbabe2"; // 経ヶ岬灯台(削除)
const TATEIWA_ID = "f56cecb1-b5df-4591-a5b0-8d0512873fb7"; // 立岩(削除)
const KOTOHIKI_ID = "b5eb3a4e-4f3a-42fa-91ca-571dc90b77ef"; // 琴引浜
const YUHIGAURA_ID = "0e607273-4823-4e4a-96e5-9a990726d1d2"; // 夕日ヶ浦海岸

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const FUNAYA_MEMO =
  "天橋立駅に11時ごろ着いたら、駅前でレンタカーを借りて、車でおよそ45分、旅はまず伊根の舟屋から始まります。1階が船のガレージ、2階が住居という、全国でも珍しい漁村の風景です。もとは山の中腹に住居を構えていた集落でしたが、18世紀ごろ、漁をしやすいように海のすぐそばへ移り住むようになったと伝えられています。現在も約230軒の舟屋が軒を連ね、2005年には漁村として全国で初めてとされる、国の重要伝統的建造物群保存地区に選定されました。舟屋は今も人が暮らす住まいです。敷地や桟橋に入ったり、住まいや人に向けて撮影したりしないようにしましょう。のんびり歩いて、独特の景観を写真におさめましょう。見学を終えたら、車で伊根湾めぐり遊覧船へ向かいましょう。";

const SATOKOEN_MEMO =
  "伊根湾めぐり遊覧船から車でおよそ7分、舟屋の里公園に着きます。伊根湾と舟屋群を高台から一望できる展望公園です。道の駅も併設されており、レストランや売店も充実。眼下に広がる約230軒の舟屋の眺めは、伊根ならではの独特な景観をひと目で楽しめる絶好のスポットです。ここで、新鮮な海の幸を味わいながら昼食にしましょう。食事を終えたら、車で琴引浜へ向かいましょう。";

const KOTOHIKI_MEMO =
  "舟屋の里公園から車でおよそ45分、琴引浜に着きます。歩くと「キュッキュッ」と鳴る、全国でも数少ない「鳴き砂」の海岸です。砂の主成分である石英の粒が、きれいな水と空気でよく洗われることで表面の摩擦が大きくなり、力が加わると砂粒同士がまとまって振動し、あの独特の音が生まれるのだそうです。国の天然記念物にも指定される貴重な砂浜、きれいな海を保つためにごみを残さないよう心がけましょう。この後は、車でおよそ15分、夕日ヶ浦海岸へ向かいましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [funaya, yukaku, satokoen, kotohiki, yuhigaura] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: FUNAYA_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: YUKAKU_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SATOKOEN_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KOTOHIKI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: YUHIGAURA_ID, dayId: DAY1_ID } }),
  ]);

  console.log("=== #64 Day1 直す前→直した後(組み直し版) ===\n");
  console.log("[削除] 経ヶ岬灯台 id=" + KYOGAMISAKI_ID + "(写真1枚も外れる)");
  console.log("[削除] 立岩 id=" + TATEIWA_ID + "(入口着を11時ごろに直した結果、時間が足りないため外した)");
  console.log("");
  console.log(`[1] 伊根の舟屋 (id=${funaya.id})`);
  console.log("  旧visitTime:", funaya.visitTime, " 旧stay:", funaya.stayDurationMin, "→ 新visitTime: 11:45  新stay: 60(無変更)");
  console.log("  旧memo:", funaya.memo);
  console.log("  新memo:", FUNAYA_MEMO);
  console.log("");
  console.log(`[2] 伊根湾めぐり遊覧船 (id=${yukaku.id}) — 本文は無修正`);
  console.log("  旧visitTime:", yukaku.visitTime, " 旧stay:", yukaku.stayDurationMin, "→ 新visitTime: 12:50  新stay: 30");
  console.log("");
  console.log(`[3] 舟屋の里公園 (id=${satokoen.id})`);
  console.log("  旧visitTime:", satokoen.visitTime, " 旧stay:", satokoen.stayDurationMin, "→ 新visitTime: 13:27  新stay: 40(無変更)");
  console.log("  旧memo:", satokoen.memo);
  console.log("  新memo:", SATOKOEN_MEMO);
  console.log("");
  console.log(`[4] 琴引浜 (id=${kotohiki.id})`);
  console.log("  旧visitTime:", kotohiki.visitTime, " 旧stay:", kotohiki.stayDurationMin, "→ 新visitTime: 14:52  新stay: 50(無変更)");
  console.log("  旧memo:", kotohiki.memo);
  console.log("  新memo:", KOTOHIKI_MEMO);
  console.log("");
  console.log(`[5] 夕日ヶ浦海岸 (id=${yuhigaura.id}) — 本文・滞在は無修正、時刻のみ`);
  console.log("  旧visitTime:", yuhigaura.visitTime, " 新visitTime: 15:57 (stay 50、無変更)");
  console.log("");
  console.log("Day1 新しい時刻: 伊根の舟屋11:45(60)→伊根湾めぐり遊覧船12:50(30)→舟屋の里公園13:27(40、昼食)→琴引浜14:52(50)→夕日ヶ浦海岸15:57(50、〜16:47)");
  console.log("Day2(最終日)は1泊2日のため無変更。");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: funaya.id, data: { visitTime: T(11, 45), memo: FUNAYA_MEMO } },
      { id: yukaku.id, data: { visitTime: T(12, 50), stayDurationMin: 30 } },
      {
        id: satokoen.id,
        data: {
          visitTime: T(13, 27),
          memo: SATOKOEN_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 7 }] },
        },
      },
      {
        id: kotohiki.id,
        data: {
          visitTime: T(14, 52),
          memo: KOTOHIKI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 45 }] },
        },
      },
      { id: yuhigaura.id, data: { visitTime: T(15, 57) } },
    ],
    { remove: [KYOGAMISAKI_ID, TATEIWA_ID] }
  );

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
