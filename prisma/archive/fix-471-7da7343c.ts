/**
 * #471 7da7343c（出雲 御朱印 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 3か所で、時刻の並びが崩れていた（出雲大社 09:30〜11:10、稲佐の浜 15:38〜16:18 が2番目、日御碕神社 12:25〜13:35 が3番目）。
 *   稲佐の浜の「旧暦10月10日の夜」は決まり9（年中行事は月・季節まで）にあたり、日御碕神社には結びの定型文が残っていた
 *   → #454（出雲・稲佐の浜）と同じ道順・本文にそろえる（行き先の重なりは問題ない。#454 は法✅企✅済み）
 *   出雲大社 9:00〜10:15 →（歩き5分）古代出雲歴史博物館（新規）10:20〜11:30 →（歩き10分）神門通り（新規・昼食）11:40〜12:40
 *   →（一畑バス30分）日御碕神社 13:10〜13:50 →（歩き10分）出雲日御碕灯台（新規）14:00〜14:50 →（一畑バス30分）稲佐の浜 15:20〜16:00 →（歩き10分）奉納山公園（新規）16:10〜16:30
 *   説明文の「縁結びの神」は、ご利益の言い方になるので「だいこく様として親しまれる」に（#411 と同じ考え方）
 *   本文・座標・住所は、本番の #454（d686aaf2）の同じ名前のスポットからそのまま写す（打ち間違いを防ぐため、実行時に読み込む）
 * 本文の出典: #454 と同じ（出雲観光協会 https://izumo-kankou.gr.jp/676 ・/213 ・/678 ・https://www.izumo-kankou.gr.jp/677 ・/212 、しまね観光ナビ https://www.kankou-shimane.com/destination/20313 ）
 * 座標の出典: #454 と同じ OSM の点
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-471-7da7343c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7da7343c-0d38-4c30-8818-42ba7d184d2b";
const SOURCE_ID = "d686aaf2-9cd1-4c2a-a27f-87e042f9d717"; // #454
const COMMIT = process.argv.includes("--commit");

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from.slice(0, 30)}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["出雲大社", "稲佐の浜", "日御碕神社"].join()) throw new Error("構成が想定と違います");
  const byName = Object.fromEntries(day.spots.map((s) => [s.name, s]));

  const src = await prisma.itinerary.findUniqueOrThrow({ where: { id: SOURCE_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  const srcSpots = src.days[0].spots;
  const want = ["出雲大社", "島根県立古代出雲歴史博物館", "神門通り", "日御碕神社", "出雲日御碕灯台", "稲佐の浜", "奉納山公園"];
  if (srcSpots.map((s) => s.name).join() !== want.join()) throw new Error("#454 の構成が想定と違います");

  const order = srcSpots.map((s) => {
    const data = { visitTime: s.visitTime, stayDurationMin: s.stayDurationMin, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin, transitLine: s.transitLine, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo };
    return byName[s.name] ? { id: byName[s.name].id, data } : { create: { name: s.name, ...data } };
  });
  const description = rep(it.description ?? "", "をめぐり、出雲の社寺で御朱印をいただく日帰りプランです。", "をめぐって出雲の社寺で御朱印をいただき、古代出雲歴史博物館や出雲日御碕灯台、奉納山公園もたずねる日帰りプランです。");
  const description2 = rep(description, "縁結びの神・大国主大神を祀る出雲大社", "「だいこく様」として親しまれる大国主大神をまつる出雲大社");

  console.log(`説明文: ${description2}`);
  for (const s of srcSpots) console.log(`${s.visitTime?.toISOString().slice(11, 16)} +${s.stayDurationMin} ${s.transitMode ?? "-"}/${s.transitDurationMin ?? "-"} ${s.name}${byName[s.name] ? "（もとのスポット）" : "（新規）"}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: description2 } });
    await setDaySpotOrder(day.id, order as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
