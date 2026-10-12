/**
 * #211 b7eb511a の追いの直し（しおりえ(制作補助2)、2026-10-01 法務の指摘）
 * ① 水ノ浦教会の点 node 1440833975 は、名前のない海岸線・岩礁の頂点だった（私の XML の読み取りの不具合で、次の要素のタグが付いて見えていた）。
 *    OSM の教会の点 node 6326615995「水ノ浦教会」（amenity=place_of_worship、Nominatim の住所 1643-1）32.7498517,128.7478804 に直す。
 *    実際の位置では道の駅から車で約15分なので、移動を25分→15分にし、以降を10分ずつ早める（終わりは 16:45）
 * ② 武家屋敷通りの「日本で数か所しか確かめられていない珍しいもの」を伝聞（〜とされます）に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-211d-b7eb511a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY2 = "ad0da497-c075-4c90-a305-1af3393b5cdb";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const PLAN: Record<string, [number, number]> = {
  水ノ浦教会: [13, 50],
  武家屋敷通り: [15, 0],
  六角井: [16, 0],
  宗念寺: [16, 20],
};
const REP: Record<string, [string, string][]> = {
  水ノ浦教会: [["道の駅から車で約25分、岐宿へ。", "道の駅から車で約15分、岐宿へ。"]],
  武家屋敷通り: [["日本で数か所しか確かめられていない珍しいものです。", "日本で数か所しか確かめられていない珍しいものとされます。"]],
};

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: DAY2 }, orderBy: { orderNo: "asc" } });
  if (spots.map((s) => s.name).join() !== "魚津ヶ崎公園,城岳展望所,高崎鼻（高崎草原）,辞本涯の碑,道の駅 遣唐使ふるさと館,水ノ浦教会,武家屋敷通り,六角井,宗念寺") throw new Error("構成が想定と違います");
  const items = spots.map((s) => {
    const data: Record<string, unknown> = {};
    if (PLAN[s.name]) data.visitTime = t(...PLAN[s.name]);
    if (REP[s.name]) {
      let memo = s.memo ?? "";
      for (const [a, b] of REP[s.name]) {
        if (!memo.includes(a)) throw new Error(`${s.name}: 本文が想定と違います`);
        memo = memo.replace(a, b);
      }
      data.memo = memo;
    }
    if (s.name === "水ノ浦教会") {
      if (Math.abs(Number(s.lat) - 32.734245) > 1e-5) throw new Error("水ノ浦の点が想定と違います");
      Object.assign(data, { lat: 32.7498517, lng: 128.7478804, transitDurationMin: 15 });
    }
    return { id: s.id, data };
  });
  console.log("水ノ浦教会 13:50〜14:30（車15分、点を node 6326615995 に）→ 武家屋敷通り 15:00〜15:40 → 六角井 16:00〜16:15 → 宗念寺 16:20〜16:45");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => setDaySpotOrder(DAY2, items as never, { tx }), { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
