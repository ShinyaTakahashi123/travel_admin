/**
 * #414 441b998a の追いの修正その2（しおりえ(制作補助2)、企画運営の指摘）
 * - 1日目（日曜）の最後に横山隆一記念まんが館を足す（月曜休館なので日曜の1日目に）。自由民権記念館から車で約10分、15:55〜16:45
 *   出典: https://www.city.kochi.kochi.jp/site/kanko/mangakan.html ・ https://www.kfca.jp/mangakan/
 *   座標: Nominatim「高知市文化プラザ・かるぽーと」33.5582314,133.5473031（まんが館はかるぽーとの中）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-414c-441b998a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "441b998a-82ce-43fd-849a-ee82c277dd46";
const DAY1_ID = "c56a49e0-4fb8-4b5c-bf0c-ac9ccfa49c27";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const NEW_SPOT = {
  create: {
    name: "横山隆一記念まんが館", visitTime: t(15, 55), stayDurationMin: 50, transitMode: "taxi", transitDurationMin: 10, transitLine: null,
    lat: 33.558231, lng: 133.547303, address: "高知県高知市九反田2-1 高知市文化プラザかるぽーと内",
    memo: "自由民権記念館から車で約10分、高知市文化プラザかるぽーとの中にあります。高知市の名誉市民で、日本の漫画家として初めて文化功労者となった横山隆一氏を記念したまんが館です。代表作「フクちゃん」をテーマに、のぞき穴やだまし絵などの仕掛けのあるコーナーや、アトリエの再現、珍しいコレクションの展示など、遊び心いっぱいの展示を楽しめます。休館日は公式の案内で確かめてから訪れましょう。",
  },
};

async function main() {
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY1_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID || day.spots.length !== 5 || day.spots[4].name !== "高知市立自由民権記念館") throw new Error("構成が想定と違います");
  const order = [...day.spots.map((s) => ({ id: s.id, data: {} })), NEW_SPOT];
  console.log(day.spots.map((s) => s.name).join(" → ") + " → " + NEW_SPOT.create.name);
  console.log(NEW_SPOT.create.memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY1_ID, order, { tx });
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: (await tx.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID } })).description!.replace("龍馬の生まれたまち記念館と自由民権記念館で、土佐の人と歴史にふれます。", "龍馬の生まれたまち記念館と自由民権記念館で土佐の人と歴史にふれ、最後はまんが館へ。") } });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
