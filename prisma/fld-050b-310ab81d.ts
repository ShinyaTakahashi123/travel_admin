/**
 * #50 310ab81d 2日目の公園の真ん中の点を、メモに出てくる物の点に直す（しおりえ(制作補助2)、企画運営・法務 10/30。座標だけ、時刻は変えない）
 * - 白谷海浜公園: 公園の way 522497446 の値 → 白谷海水浴場（way 522486635、leisure=beach_resort）34.686041,137.231905
 *   クリスタルポルトから OSRM 20.0分（20分のまま）、蔵王山まで 9.0分（10分のまま）
 * - 岩屋緑地公園: 公園の way 492168614 の値 → 岩屋観音（node 4844383997）34.73116,137.426633
 *   博物館から OSRM 19.0分（20分のまま）、普門寺まで 13.2分（14分のまま）
 * あわせて「よいでしょう」を直す（法務 10/30）: サンテパルク・田原市博物館の昼食の一文
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-050b-310ab81d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ROWS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: "4f2e4508-23b0-49a7-a3c4-a4b6f162807c", from: [34.68516, 137.232569], to: [34.686041, 137.231905] },
  { id: "7b93c68f-3663-47d4-a426-42ea1ef90461", from: [34.73226, 137.429039], to: [34.73116, 137.426633] },
];

const TEXTS: { id: string; from: string; to: string }[] = [
  { id: "3d0d2fcf-5572-4127-8180-475fd81352d0", from: "地元の農畜産物を扱う直売所もあり、ここで昼食にするのもよいでしょう。", to: "地元の農畜産物を扱う直売所もあります。ここで昼食にしましょう。" },
  { id: "738b1811-8829-465c-a4da-caec35b185f6", from: "この付近で昼食にするのもよいでしょう。", to: "このあたりで昼食にしましょう。" },
];

async function main() {
  const memos: Record<string, string> = {};
  for (const x of TEXTS) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id: x.id } });
    if ((s.memo ?? "").split(x.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません`);
    memos[x.id] = s.memo!.replace(x.from, x.to);
    console.log(`${s.name}: ${x.from} → ${x.to}`);
  }
  for (const r of ROWS) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id: r.id }, include: { day: { select: { itineraryId: true } } } });
    if (!s.day.itineraryId.startsWith("310ab81d") || Number(s.lat) !== r.from[0] || Number(s.lng) !== r.from[1]) throw new Error(`${s.name}: いまの値が想定と違います（${s.lat},${s.lng}）`);
    console.log(`${s.name}: ${r.from.join(",")} → ${r.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    ...ROWS.map((r) => prisma.spot.update({ where: { id: r.id }, data: { lat: r.to[0], lng: r.to[1] } })),
    ...TEXTS.map((x) => prisma.spot.update({ where: { id: x.id }, data: { memo: memos[x.id] } })),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
