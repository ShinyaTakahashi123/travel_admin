/**
 * #209 b1d9788b の追いの直し（しおりえ(制作補助2)、2026-10-01 法務の指摘）
 * - 五箇山民俗館の座標に、となりの塩硝の館の点を使うのは別の施設の点になるので不可。
 *   OSM の民俗館の点（node 479724758）は集落から約1km南の国道上にずれていて、国土地理院の住所検索も「菅沼436」は大字の点（地名の点）しか返さない。
 *   民俗館は「菅沼集落の中ほどに位置する」（とやま観光 https://www.info-toyama.com/attractions/41004 ）ので、
 *   民俗館を菅沼合掌造り集落のスポットの中で案内し、民俗館のスポットは外す（写真なし）
 * - 代わりに、村上家のそばの上梨白山宮を入れる（4か所以上・16:30 の終わりは変えない）
 *   出典: 五箇山総合案内所 国重文 村上家の周辺 https://gokayama-info.jp/みどころ/五箇山と世界遺産/国重文-村上家の周辺
 *   （1502年に創建・富山県最古の木造建築・白山菊理媛命・神仏習合の遺風・舞殿で神楽舞・こきりこ踊り）
 *   座標: OSM way 1342700013（白山宮、Nominatim の中心）
 * - （任意の指摘）相倉に「お寺では静かにお参りしましょう」の一言
 * - 時刻: 菅沼 9:00〜10:20 → 村上家 10:35〜11:20 → 白山宮 11:25〜11:45 → 相倉 12:00〜13:45（昼食）→ 和紙の里 14:00〜15:10 → 城端曳山会館 15:45〜16:30（変えない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-209c-b1d9788b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY_ID = "06523fb1-21a5-4f2d-90ff-21bb9abf5386";
const SUGA = "57b200e5-e969-4aab-97c5-79b44440853c";
const MINZOKU = "997638cb-3180-4e3e-91bd-f27da536342e";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const SUGA_FROM = "地元では、早朝や夕方の訪問を控えるようお願いしています。";
const SUGA_TO =
  "集落の中ほどにある五箇山民俗館では、山あいの村で使われてきた生活の道具、約200点が展示され、階段を上ると、合掌造りの屋根裏の組み方や、蚕を育てていた様子を間近に見られます。「籠の渡し」の展示もあります。向かいの塩硝の館は、修理のため休館が続いているので、公式の案内で確かめましょう。" + SUGA_FROM;
const AINO_FROM = "家々は今も住まいとして使われています。";
const AINO_TO = "お寺では、静かに、敬意をもってお参りしましょう。" + AINO_FROM;
const HAKUSAN = {
  name: "上梨白山宮", visitTime: t(11, 25), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 5, transitLine: null,
  lat: 36.4112167, lng: 136.9306337, address: "富山県南砺市上梨",
  memo: "村上家から歩いて約5分。白山菊理媛命をまつる神社で、1502年に建てられた本殿は、富山県で最も古い木造建築とされています。神と仏をあわせてまつっていた昔の名残が今も伝わり、祭礼のときには、境内の舞殿で神楽舞やこきりこ踊りが奉納されます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。",
};
// [名前, 時, 分, 滞在]
const PLAN: [string, number, number, number][] = [
  ["菅沼合掌造り集落", 9, 0, 80],
  ["村上家", 10, 35, 45],
  ["相倉合掌造り集落", 12, 0, 105],
  ["五箇山和紙の里", 14, 0, 70],
  ["城端曳山会館", 15, 45, 45],
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, orderBy: { orderNo: "asc" }, include: { photos: true } });
  const names = spots.map((s) => s.name);
  if (names.join() !== "菅沼合掌造り集落,五箇山民俗館,村上家,相倉合掌造り集落,五箇山和紙の里,城端曳山会館") throw new Error(`構成が想定と違います: ${names.join()}`);
  if (spots[1].id !== MINZOKU || spots[1].photos.length) throw new Error("民俗館が想定と違います");
  const byName = Object.fromEntries(spots.map((s) => [s.name, s]));
  const items: unknown[] = [];
  for (const [name, h, m, stay] of PLAN) {
    const s = byName[name];
    const data: Record<string, unknown> = { visitTime: t(h, m), stayDurationMin: stay };
    if (s.id === SUGA) {
      if (!s.memo?.includes(SUGA_FROM)) throw new Error("菅沼の本文が想定と違います");
      data.memo = s.memo.replace(SUGA_FROM, SUGA_TO);
    }
    if (name === "相倉合掌造り集落") {
      if (!s.memo?.includes(AINO_FROM)) throw new Error("相倉の本文が想定と違います");
      data.memo = s.memo.replace(AINO_FROM, AINO_TO);
    }
    items.push({ id: s.id, data });
    if (name === "村上家") items.push({ create: HAKUSAN });
    console.log(`${h}:${String(m).padStart(2, "0")} +${stay} ${name}`);
    if (name === "村上家") console.log(`11:25 +20 上梨白山宮（新規）`);
  }
  console.log(`\n外す: 五箇山民俗館（${MINZOKU}）\n菅沼の本文: ${String((items[0] as { data: { memo: string } }).data.memo)}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => setDaySpotOrder(DAY_ID, items as never, { remove: [MINZOKU], tx }), { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
