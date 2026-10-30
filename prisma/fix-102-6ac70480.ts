/**
 * #102 ならまちの古寺と西ノ京・平城宮跡をめぐる奈良1泊2日。
 * 初日・最終日の見直し（docs/content/20261029-first-last-day-times.md）。
 *
 * Day1 はもとは09:30開始・8か所(決まり: 泊まりの初日は10:45〜11:45開始・16:30〜17:00終了・
 * 3か所以上)。8か所すべて説明文に出てくる見どころのため、外さずに時刻を組み直す。
 * 移動は routed-foot で測り直し、もとの値とほぼ合っていた(興福寺→書道美術館11.4分・
 * 書道美術館→にぎわいの家4.4分・にぎわいの家→ならまち1.8分・ならまち→十輪院5.4分・
 * 十輪院→元興寺5.5分・元興寺→新薬師寺23.8分・新薬師寺→白毫寺14.2分)。滞在をもとの長さ
 * から短くして(決まりA)、10:45開始でも16:30〜17:00に収める。
 *
 * Day2 はもとから09:30開始・16:30終了・6か所で、決まりの範囲内のため変更なし。1か所目
 * (喜光寺)の書き出しも、近鉄奈良駅からの実際の乗りかえ・分数がすでに書かれているため
 * 変更なし。
 *
 * 座標(企画運営の指摘2026-10-30。#94で直した値にそろえる):
 *  - 興福寺: #94の値 34.682485,135.832225 に(もとから約120m)
 *  - 元興寺: #94の値 34.677815,135.831339 に(もとから約20m)
 *  - 薬師寺・唐招提寺・平城宮跡朱雀門ひろばは、もとから#94の値と完全一致のため変更なし
 *  - 書道美術館・にぎわいの家・十輪院・新薬師寺・白毫寺・喜光寺・東院庭園・平城宮跡資料館・
 *    朱雀門ひろばの昼食(天平うまし館)は、もとからOSMの名前のある点と6cm以内で一致のため変更なし
 *
 * 法務の指摘(2026-10-30 17:02): ならまち(昼食)の点が庚申堂(お堂)で、「ここで昼食に」が
 * 境内で食事をするように読めるおそれがある、との指摘があったが、法務の再確認(17:04)で
 * 近くの「西新屋町」はplace=neighbourhood(地名の点)で決まり上使えないとわかり、庚申堂の
 * 点のまま変更なしとなった。メモは「町家を改めた店の中には、食事のとれる店も点在して
 * いるので、ここで昼食にしましょう」で庚申堂の中で食べる書き方ではないため、文も変更なし。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-102-6ac70480.ts
 *   反映: npm run prod -- npx tsx prisma/fix-102-6ac70480.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "7e4f74cb-8c11-4e4d-b863-d2d2bd4a17d7";

const KOFUKUJI_ID = "2417b4b9-421f-48f9-bdbc-3aa4223ab997";
const SHODO_ID = "9aa7669d-6ec6-48a5-8852-5ebec5958ae4";
const NIGIWAI_ID = "b92c8c52-471f-40d3-9c3d-990dd4491234";
const NARAMACHI_ID = "737f6685-0b63-4904-8ee6-1cb533b3abe4";
const JURININ_ID = "30433502-9b10-466a-99db-bfa08a5bdfce";
const GANGOJI_ID = "001ce333-0d19-4d01-b949-32ee590d7c81";
const SHINYAKUSHIJI_ID = "02eeb0f0-0c29-49f7-a4ca-9f8c12c7e6e7";
const BYAKUGOJI_ID = "9a50d6bb-d7b4-4206-8a83-0928365603c3";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const KOFUKUJI_MEMO_OLD =
  "この旅は電車とバス、歩きでめぐります。近鉄奈良駅から歩いて約5分。南都七大寺の中でも、とくに奈良の町と深く結びついて発展した寺といわれます。1180年の南都焼き討ちで多くのお堂を失いましたが、すぐに建て直され、鎌倉時代には大和の国を実質的に治めるほどの力を持ちました。国宝館には、八部衆の一体で、奈良時代に漆で形づくられた高さ約153cmの阿修羅像をはじめ、天平と鎌倉の時代の仏像が並びます。五重塔は今、修理中です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const KOFUKUJI_MEMO_NEW =
  "この旅は電車とバス、歩きでめぐります。近鉄奈良駅に10時40分ごろ着いたら、歩いて約5分。南都七大寺の中でも、とくに奈良の町と深く結びついて発展した寺といわれます。1180年の南都焼き討ちで多くのお堂を失いましたが、すぐに建て直され、鎌倉時代には大和の国を実質的に治めるほどの力を持ちました。国宝館には、八部衆の一体で、奈良時代に漆で形づくられた高さ約153cmの阿修羅像をはじめ、天平と鎌倉の時代の仏像が並びます。五重塔は今、修理中です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const MEMO_PAIRS: { id: string; label: string; find: string; replace: string }[] = [
  {
    id: SHODO_ID,
    label: "書道美術館(書き出しの分数)",
    find: "興福寺から南へ、ならまちの入り口へ歩いて約10分。",
    replace: "興福寺から南へ、ならまちの入り口へ歩いて約11分。",
  },
  {
    id: NIGIWAI_ID,
    label: "にぎわいの家(書き出しの分数)",
    find: "美術館から歩いて約5分。",
    replace: "美術館から歩いて約4分。",
  },
  {
    id: SHINYAKUSHIJI_ID,
    label: "新薬師寺(書き出しの分数)",
    find: "元興寺から東へ、高畑の町を歩いて約25分。",
    replace: "元興寺から東へ、高畑の町を歩いて約24分。",
  },
];

const VISIT_TIMES: { id: string; h: number; m: number; stay: number }[] = [
  { id: KOFUKUJI_ID, h: 10, m: 45, stay: 50 },
  { id: SHODO_ID, h: 11, m: 46, stay: 30 },
  { id: NIGIWAI_ID, h: 12, m: 20, stay: 20 },
  { id: NARAMACHI_ID, h: 12, m: 42, stay: 45 },
  { id: JURININ_ID, h: 13, m: 32, stay: 30 },
  { id: GANGOJI_ID, h: 14, m: 7, stay: 40 },
  { id: SHINYAKUSHIJI_ID, h: 15, m: 11, stay: 40 },
  { id: BYAKUGOJI_ID, h: 16, m: 6, stay: 35 },
];

async function main() {
  const commit = process.argv.includes("--commit");

  const kofukuji = await prisma.spot.findFirstOrThrow({ where: { id: KOFUKUJI_ID } });
  if (kofukuji.memo !== KOFUKUJI_MEMO_OLD) {
    console.log("[想定と違います] 興福寺 のメモが想定と一致しません。処理を中止します。");
    return;
  }

  const ids = MEMO_PAIRS.map((p) => p.id);
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const memoById = new Map(spots.map((s) => [s.id, s.memo ?? ""]));
  for (const p of MEMO_PAIRS) {
    if (!memoById.get(p.id)!.includes(p.find)) {
      console.log(`[想定と違います] ${p.label} に「${p.find}」が見つかりません。処理を中止します。`);
      return;
    }
  }
  for (const p of MEMO_PAIRS) {
    memoById.set(p.id, memoById.get(p.id)!.replace(p.find, p.replace));
  }

  console.log("=== #102 Day1 新しい時刻 ===");
  for (const v of VISIT_TIMES) {
    console.log(`${v.id} => ${String(v.h).padStart(2, "0")}:${String(v.m).padStart(2, "0")} (${v.stay}分)`);
  }
  console.log("16:06+35=16:41 終了見込み");
  console.log("\n=== メモ(先頭) ===");
  console.log("[興福寺]\n" + KOFUKUJI_MEMO_NEW.slice(0, 80) + "\n");
  for (const id of ids) {
    console.log(memoById.get(id)!.slice(0, 60));
  }
  console.log("\n=== 座標 ===");
  console.log("興福寺 34.682485,135.832225 / 元興寺 34.677815,135.831339");
  console.log("ならまち(昼食): 変更なし(庚申堂の点のまま)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      DAY1_ID,
      [
        { id: KOFUKUJI_ID, data: { visitTime: t(10, 45), stayDurationMin: 50, lat: 34.682485, lng: 135.832225, memo: KOFUKUJI_MEMO_NEW } },
        { id: SHODO_ID, data: { visitTime: t(11, 46), stayDurationMin: 30, memo: memoById.get(SHODO_ID) } },
        { id: NIGIWAI_ID, data: { visitTime: t(12, 20), stayDurationMin: 20, memo: memoById.get(NIGIWAI_ID) } },
        { id: NARAMACHI_ID, data: { visitTime: t(12, 42), stayDurationMin: 45 } },
        { id: JURININ_ID, data: { visitTime: t(13, 32), stayDurationMin: 30 } },
        { id: GANGOJI_ID, data: { visitTime: t(14, 7), stayDurationMin: 40, lat: 34.677815, lng: 135.831339 } },
        { id: SHINYAKUSHIJI_ID, data: { visitTime: t(15, 11), stayDurationMin: 40, memo: memoById.get(SHINYAKUSHIJI_ID) } },
        { id: BYAKUGOJI_ID, data: { visitTime: t(16, 6), stayDurationMin: 35 } },
      ],
      { tx }
    );

    await tx.spotTransitLeg.updateMany({ where: { spotId: SHODO_ID }, data: { transitDurationMin: 11 } });
    await tx.spotTransitLeg.updateMany({ where: { spotId: NIGIWAI_ID }, data: { transitDurationMin: 4 } });
    await tx.spotTransitLeg.updateMany({ where: { spotId: SHINYAKUSHIJI_ID }, data: { transitDurationMin: 24 } });
  }, { timeout: 60000 });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
