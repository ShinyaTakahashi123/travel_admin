/**
 * #23の直し。法務・企画運営の指摘(2026-10-13)に対応。
 * 1. (法務)「西日本最高峰」の「最」は、メモと同じ決まり(同じ文の中でぼかす)がかかる。
 *   題は「霊峰・石鎚山の麓」に変え(「最」を使わない)、説明文・本社のメモ(既存、
 *   今回未修正だった箇所)は「西日本で最も高いとされる」の形に直す
 * 2. (企画運営)伊曽乃神社「毎年10月15日・16日に行われる例大祭」: 本文に日付は
 *   書かない決まりのため「毎年秋に行われる例大祭」に直す
 * 3. (企画運営)「成就社のあたり（昼食）」の座標が中宮成就社と全く同じ点だったため、
 *   OSMの建物データから、旅館・食事処が集まる集落側の実点に置き直す
 * 4. (企画運営、任意)武丈公園のメモに、桜の季節以外も楽しめる旨の一文を追加
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "e8927e1c-6138-4102-b06f-d041ab191b68";
const HONSHA_SPOT_ID = "d965042c-6d92-4d26-9c80-9e59e2c988cd";

const NEW_TITLE = "石鎚神社と石鎚登山ロープウェイ、霊峰・石鎚山の麓をめぐる日帰りプラン";
const NEW_DESCRIPTION =
  "ロープウェイで中宮成就社へ上り、西日本で最も高いとされる石鎚山を神とあがめてきた信仰にふれます。下山後は、山麓の石鎚神社 口之宮本社、伊予国一宮格の伊曽乃神社、加茂川沿いの桜の名所・武丈公園をめぐる日帰りプランです。";

const LUNCH_PM_ID_PLACEHOLDER = "成就社のあたり";
const NEW_LUNCH_LAT = 33.7899978;
const NEW_LUNCH_LNG = 133.1286562;

async function main() {
  const honsha = await prisma.spot.findUnique({ where: { id: HONSHA_SPOT_ID } });
  const isono = await prisma.spot.findFirst({ where: { name: "伊曽乃神社" } });
  const bujo = await prisma.spot.findFirst({ where: { name: "武丈公園" } });
  const lunch = await prisma.spot.findFirst({ where: { name: "成就社のあたり（昼食）" } });
  if (!honsha?.memo || !isono?.memo || !bujo?.memo || !lunch) throw new Error("想定と違います");

  const newHonshaMemo = honsha.memo.replace(
    "西日本最高峰・石鎚山(標高1,982m)を神体山とする石鎚神社の本社です。",
    "西日本で最も高いとされる石鎚山(標高1,982m)を神体山とする石鎚神社の本社です。"
  );
  const newIsonoMemo = isono.memo.replace(
    "毎年10月15日・16日に行われる例大祭「西条まつり」は、",
    "毎年秋に行われる例大祭「西条まつり」は、"
  );
  const newBujoMemo = bujo.memo + "桜の季節以外も、加茂川沿いの散策を楽しめます。";
  if (newHonshaMemo === honsha.memo || newIsonoMemo === isono.memo) throw new Error("置換対象が見つかりません");

  console.log("[確認OK] 題を「霊峰・石鎚山の麓」に直す(「最」を使わない)");
  console.log("[確認OK] 説明文・本社のメモの「西日本最高峰」を「西日本で最も高いとされる」に直す");
  console.log("[確認OK] 伊曽乃神社の例大祭の日付を削除");
  console.log("[確認OK] 昼食エリアの座標を集落側の実点に直す(" + LUNCH_PM_ID_PLACEHOLDER + ")");
  console.log("[確認OK] 武丈公園のメモに季節を問わず楽しめる旨の一文を追加");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { title: NEW_TITLE, description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: HONSHA_SPOT_ID }, data: { memo: newHonshaMemo } });
  await prisma.spot.update({ where: { id: isono.id }, data: { memo: newIsonoMemo } });
  await prisma.spot.update({ where: { id: bujo.id }, data: { memo: newBujoMemo } });

  await prisma.placeMaster.update({
    where: { id: lunch.placeMasterId! },
    data: { lat: NEW_LUNCH_LAT, lng: NEW_LUNCH_LNG, positionSource: "osm" },
  });
  await prisma.spot.update({ where: { id: lunch.id }, data: { lat: NEW_LUNCH_LAT, lng: NEW_LUNCH_LNG } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
