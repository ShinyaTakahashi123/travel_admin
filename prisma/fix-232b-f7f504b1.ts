/**
 * #232 f7f504b1 の1日目の最後の直し（しおりえ(制作補助2)、企画運営の判断 10/11）
 * 日本玩具博物館は、2026年9月・10月は土日祝のみ開館の時期があり、平日の旅で行けない日が多いので外し、姫路科学館に替える（#218・#10 と重ならない）
 * 出典: ひめのみち https://www.himeji-kanko.jp/spot/62/ （1993年開館の総合科学館・2〜4階に「地球と郷土の自然」「身のまわりの科学」「私たちの宇宙」の常設展示・直径27mドームの日本最大級のプラネタリウム・
 *   神姫バス「星の子館前」下車すぐ・9時30分〜17時 入館16時30分・常設展示は最低1時間、プラネタリウムは約45分）／姫路市 https://www.city.himeji.lg.jp/atom/info/index.html （毎週火曜休館・住所 姫路市青山1470-15）
 * 座標: OSM 姫路科学館 node 1423058941（API で名前つきを確かめた）
 * 移動は spot_transit_leg（transitLegs）に書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-232b-f7f504b1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f7f504b1-6c02-407f-9648-fd54bf0edf68";
const DAY1 = "92a464b8-d17e-472e-b640-90ad9b9eeadc";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DESCRIPTION =
  "1日目は世界遺産の姫路城から、城を借景にした好古園、兵庫県立歴史博物館、大きなプラネタリウムのある姫路科学館へ。2日目はレンタカーで「播磨の小京都」と呼ばれる龍野の城下町と、そうめんや醤油の資料館を訪ね、海の宿駅として栄えた室津の町まで足をのばす1泊2日です。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  const d1 = it.days[0];
  const toy = d1.spots.find((s) => s.name === "日本玩具博物館");
  if (d1.id !== DAY1 || !toy || d1.spots[d1.spots.length - 1].id !== toy.id) throw new Error("構成が想定と違います");
  const sci = {
    name: "姫路科学館", visitTime: t(15, 0), stayDurationMin: 90, lat: 34.851724, lng: 134.626934, address: "兵庫県姫路市青山1470-15",
    memo: "博物館から姫路駅へ歩き、神姫バスで「星の子館前」へ（あわせて約55分）。1993年に開かれた総合科学館で、「地球と郷土の自然」「身のまわりの科学」「私たちの宇宙」をテーマにした常設展示と、直径27mのドームをもつ日本最大級とされるプラネタリウムがあります。常設展示とプラネタリウムの両方を見るなら、早めに入館しましょう。休館日は公式の案内で確かめましょう。帰りはバスで姫路へ戻り、姫路の宿に泊まりましょう。日が暮れると姫路城の天守がライトアップされるので、時間があれば、夜の姿を眺めに出かけるのもよいでしょう。",
    transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 25, transitLine: null }, { orderNo: 2, transitMode: "bus", transitDurationMin: 30, transitLine: "神姫バス" }] },
  };
  console.log(`外す: 日本玩具博物館\n足す: 姫路科学館 15:00 滞在90分 walk25+bus30\n${sci.memo}\n\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1, [...d1.spots.filter((s) => s.id !== toy.id).map((s) => ({ id: s.id, data: {} })), { create: sci }], { tx, remove: [toy.id] });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
