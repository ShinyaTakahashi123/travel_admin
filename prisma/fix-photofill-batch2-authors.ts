/**
 * 写真がなくなったしおりの写真探し。fill-photo-batch2で取得した撮影者名に、
 * MediaWikiの定型句や余計な語が混ざっていたものを整える(cleanAuthorNameの
 * 既存ルールに相当する手直し。法務の「掬茶」統一の指摘と同じ考え方)。
 * - 6ac78863(大正池): "photo: Qurren (talk) Taken with Canon IXY 10S" → "Qurren"
 * - 66258009(金鱗湖): "by Reggaeman" → "Reggaeman"
 * - 1d0aa24f(清津峡): "清兵衛 at Japanese Wikipedia" → "清兵衛"
 * - e8cf096c(水木しげるロード): "No machine-readable author provided. おぉたむすねィく探検隊 assumed (based on copyright claims)." → "おぉたむすねィく探検隊"
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const FIXES: { itinPrefix: string; spotName: string; from: string; to: string }[] = [
  { itinPrefix: "6ac78863", spotName: "大正池", from: "photo: Qurren (talk) Taken with Canon IXY 10S", to: "Qurren" },
  { itinPrefix: "66258009", spotName: "金鱗湖", from: "by Reggaeman", to: "Reggaeman" },
  { itinPrefix: "1d0aa24f", spotName: "清津峡渓谷トンネル", from: "清兵衛 at Japanese Wikipedia", to: "清兵衛" },
  {
    itinPrefix: "e8cf096c",
    spotName: "水木しげるロード",
    from: "No machine-readable author provided. おぉたむすねィく探検隊 assumed (based on copyright claims).",
    to: "おぉたむすねィく探検隊",
  },
];

async function main() {
  for (const f of FIXES) {
    const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '${f.itinPrefix}%'`);
    const itinId = rows[0].id;
    const photo = await prisma.photo.findFirst({ where: { spot: { name: f.spotName, day: { itineraryId: itinId } } } });
    if (!photo) throw new Error(`${f.itinPrefix}: 写真が見つかりません`);
    if (photo.author?.normalize("NFC") !== f.from.normalize("NFC")) {
      console.log(`差分あり: DB="${photo.author}"(len=${photo.author?.length}) vs 期待="${f.from}"(len=${f.from.length})`);
      for (let i = 0; i < Math.max(photo.author?.length ?? 0, f.from.length); i++) {
        if (photo.author?.[i] !== f.from[i]) {
          console.log(`  位置${i}: DB=${JSON.stringify(photo.author?.[i])}(${photo.author?.charCodeAt(i)}) 期待=${JSON.stringify(f.from[i])}(${f.from.charCodeAt(i)})`);
        }
      }
      throw new Error(`${f.itinPrefix}: 撮影者の文言が想定外です`);
    }
    console.log(`[確認OK] ${f.itinPrefix} "${f.from}" → "${f.to}"`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  for (const f of FIXES) {
    const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '${f.itinPrefix}%'`);
    const itinId = rows[0].id;
    const photo = await prisma.photo.findFirst({ where: { spot: { name: f.spotName, day: { itineraryId: itinId } } } });
    await prisma.photo.update({ where: { id: photo!.id }, data: { author: f.to } });
  }
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
