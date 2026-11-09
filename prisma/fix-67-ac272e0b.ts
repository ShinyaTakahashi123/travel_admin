/**
 * #67(大鳴門橋遊歩道「渦の道」と道の駅くるくる なると、鳴門1泊2日、
 * ac272e0b)の初日を、仕様書 docs/specs/20261029-first-last-day-times.md
 * と itinerary-rules.md の「入口と1か所目」の決まりに合わせて組み直す。
 * 最終日(2日目)は1泊2日のため今のまま変更しない。
 *
 * 【直す前】Day1は09:30開始・8か所(渦の道→エディ→千畳敷展望台→
 * 道の駅くるくる なると→大麻比古神社→ドイツ橋→霊山寺→極楽寺)、
 * 16:30終了。
 *
 * 【直した内容】説明文に名前のある見どころ(渦の道〔鳴門公園〕・道の駅
 * くるくる なると・大麻比古神社・ドイツ橋・霊山寺・極楽寺)はすべて
 * 残した。説明文に名前のない2か所(大鳴門橋架橋記念館エディ・千畳敷
 * 展望台、いずれも鳴門公園内の付帯施設)を外した。渦の道→道の駅くるくる
 * なるとの新しい区間は、エディ・千畳敷展望台を飛ばして直接向かう形に
 * なるため、OSRM(driving)で23.6km/25分と実測した。
 *
 * 入口(JR徳島駅)から1か所目(渦の道)までは、入口に着く時刻＋レンタカーの
 * 手続き(約15分)＋車の移動(もとの文の「約45分」)で考える(企画運営の
 * 指摘、決まりのまとめ1章)。渦の道を11:45着のまま保つため、入口の着く
 * 時刻を「11時ごろ」ではなく「10時45分ごろ」にした(10:45+15分+45分=
 * 11:45)。#130と同じ考え方。
 *
 * 霊山寺・極楽寺(ともに四国八十八ヶ所札所)の納経受付は7:00〜17:00
 * (旅行ガイドサイトで確認、公式の最新情報ではない)。16:40終了なら
 * 17時の受付終了に間に合う。この終了時刻に収めるため、道の駅(70→45分)・
 * 大麻比古神社(60→35分)・ドイツ橋(20→15分)の滞在を短くした。
 *
 * 1日目最後の極楽寺には、もとから宿の一文(「このあとは、車で鳴門の宿へ
 * 向かいましょう。」)があったため、本文は直さず残した(極楽寺の本文は
 * 今回変更していないため)。
 *
 * 新しい時刻(Day1、11:45〜16:40、6か所): 渦の道11:45(50)→
 * 道の駅くるくる なると13:00(45、昼食)→大麻比古神社14:05(35)→
 * ドイツ橋14:45(15)→霊山寺15:05(45)→極楽寺15:55(45)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-67-ac272e0b.ts
 *   反映: npm run prod -- npx tsx prisma/fix-67-ac272e0b.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "2287660a-8097-4552-a33f-9982bbccb74f";

const UZU_ID = "36c6baaa-c4bc-471e-9a34-0cfb7261ffef"; // 渦の道
const EDDY_ID = "153f9a36-827b-4846-8d8a-717f4bc16a62"; // 大鳴門橋架橋記念館エディ(削除)
const SENJOJIKI_ID = "d4897d7f-0a58-4d03-9077-70cc3c4ad9ec"; // 千畳敷展望台(削除)
const MICHINOEKI_ID = "b1b4165e-0527-468f-84d6-52db502a8404"; // 道の駅くるくる なると
const OASA_ID = "c025260c-da97-4576-99d7-0e260ed39cc2"; // 大麻比古神社
const DOITSU_ID = "5282b044-6244-481f-b468-469b93a82a80"; // ドイツ橋
const RYOZEN_ID = "4404f456-6606-47a5-b49c-62a682303b3a"; // 霊山寺
const GOKURAKU_ID = "98e06ce0-2b5f-4e32-b5bc-fbf5c5ca3d7a"; // 極楽寺

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const UZU_MEMO =
  "この旅は車でめぐります。JR徳島駅に10時45分ごろ着いたら、駅の近くでレンタカーの手続きをして、車で約45分の鳴門公園へ。大鳴門橋の橋桁の中の空間を使った海の上の遊歩道で、渦潮の真上45mの展望室まで、約450mの道が続きます。展望室では足元のガラス窓から鳴門海峡をのぞき込めます。渦潮が見ごろになる時間は日によって変わり、時間によっては渦が見られないこともあるので、公式の案内で確かめてから出かけましょう。見学を終えたら、車で道の駅くるくる なるとへ向かいましょう。";

const MICHINOEKI_MEMO =
  "渦の道から車で約25分。四国・徳島・鳴門の玄関口に2022年にできた道の駅で、鳴門金時やレンコンなど、このあたりの特産品を味わえる食のテーマパークです。館内には食堂などもあるので、ここで昼食にしましょう。食事を終えたら、車で大麻比古神社へ向かいましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [uzu, michinoeki, oasa, doitsu, ryozen, gokuraku] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: UZU_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MICHINOEKI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: OASA_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: DOITSU_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: RYOZEN_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: GOKURAKU_ID, dayId: DAY1_ID } }),
  ]);

  console.log("=== #67 Day1 直す前→直した後 ===\n");
  console.log("[削除] 大鳴門橋架橋記念館エディ・千畳敷展望台(説明文に名前のない鳴門公園内の付帯施設)");
  console.log("");
  console.log(`[1] 渦の道（大鳴門橋遊歩道） (id=${uzu.id})`);
  console.log("  旧visitTime:", uzu.visitTime, " → 新visitTime: 11:45  新stay: 50(無変更)");
  console.log("  新memo:", UZU_MEMO);
  console.log("");
  console.log(`[2] 道の駅くるくる なると (id=${michinoeki.id})`);
  console.log("  旧visitTime:", michinoeki.visitTime, " 旧stay:", michinoeki.stayDurationMin, "→ 新visitTime: 13:00  新stay: 45");
  console.log("  新memo:", MICHINOEKI_MEMO);
  console.log("");
  console.log(`[3] 大麻比古神社 (id=${oasa.id}) — 本文は無修正、滞在のみ短縮`);
  console.log("  旧visitTime:", oasa.visitTime, " 旧stay:", oasa.stayDurationMin, "→ 新visitTime: 14:05  新stay: 35");
  console.log("");
  console.log(`[4] ドイツ橋 (id=${doitsu.id}) — 本文は無修正、滞在を短縮`);
  console.log("  旧visitTime:", doitsu.visitTime, " 旧stay:", doitsu.stayDurationMin, "→ 新visitTime: 14:45  新stay: 15");
  console.log("");
  console.log(`[5] 霊山寺 (id=${ryozen.id}) — 本文は無修正、時刻のみ`);
  console.log("  旧visitTime:", ryozen.visitTime, " → 新visitTime: 15:05 (stay 45、無変更)");
  console.log("");
  console.log(`[6] 極楽寺 (id=${gokuraku.id}) — 本文は無修正、時刻のみ`);
  console.log("  旧visitTime:", gokuraku.visitTime, " → 新visitTime: 15:55 (stay 45、無変更)");
  console.log("");
  console.log("Day1 新しい時刻: 渦の道11:45(50)→道の駅くるくる なると13:00(45、昼食)→大麻比古神社14:05(35)→ドイツ橋14:45(15)→霊山寺15:05(45)→極楽寺15:55(45、〜16:40)");
  console.log("霊山寺・極楽寺の納経受付は7:00〜17:00(旅行ガイドで確認)。16:40終了なら間に合う。");
  console.log("Day2(最終日)は1泊2日のため無変更。");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      {
        id: uzu.id,
        data: { visitTime: T(11, 45), memo: UZU_MEMO },
      },
      {
        id: michinoeki.id,
        data: {
          visitTime: T(13, 0),
          stayDurationMin: 45,
          memo: MICHINOEKI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 25 }] },
        },
      },
      { id: oasa.id, data: { visitTime: T(14, 5), stayDurationMin: 35 } },
      { id: doitsu.id, data: { visitTime: T(14, 45), stayDurationMin: 15 } },
      { id: ryozen.id, data: { visitTime: T(15, 5) } },
      { id: gokuraku.id, data: { visitTime: T(15, 55) } },
    ],
    { remove: [EDDY_ID, SENJOJIKI_ID] }
  );

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
