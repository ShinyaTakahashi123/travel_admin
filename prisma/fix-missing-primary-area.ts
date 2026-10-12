/**
 * 都道府県(primaryArea)が未設定の公開中・公式しおり10本に、正しい都道府県を設定する。
 * しおりの中身(文・スポット)は変えない。スポットの実際の住所(東京都墨田区・福岡県太宰府市など)
 * で確かめてから都道府県を決めた(docs/content/20261012-place-master-dryrun.md 5-(1)参照)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const TARGETS: { itinId: string; title: string; prefecture: string; evidence: string }[] = [
  { itinId: "0c3184ff-3941-434a-807b-2285e927ce24", title: "雷門とスカイツリー、下町情緒あふれる浅草さんぽプラン", prefecture: "東京都", evidence: "東京スカイツリー=墨田区、浅草寺=台東区" },
  { itinId: "8d044992-9b50-48ea-9beb-05be5076a217", title: "スクランブル交差点と竹下通り、若者の街を巡る日帰りプラン", prefecture: "東京都", evidence: "渋谷スクランブルスクエア=渋谷区" },
  { itinId: "9f58d4de-de1f-4ee2-9719-0aeadfc7fd0f", title: "天満宮と九州国立博物館、太宰府の歴史と文化を巡る旅", prefecture: "福岡県", evidence: "坂本八幡宮=太宰府市" },
  { itinId: "0b3b850e-f174-49fe-8413-158011680085", title: "レインボーブリッジと台場の歴史、お台場満喫日帰りプラン", prefecture: "東京都", evidence: "潮風公園=品川区、豊洲市場=江東区" },
  { itinId: "8aa6d1e5-c110-4e37-b4fa-916fc19c8417", title: "自然と文学、吉祥寺・三鷹をのんびり楽しむ旅", prefecture: "東京都", evidence: "吉祥寺サンロード商店街=武蔵野市" },
  { itinId: "ecdd6ad8-31a0-4e4d-9816-7297a3025225", title: "金峯山寺と吉水神社、桜と信仰の山・吉野を歩く旅", prefecture: "奈良県", evidence: "神武天皇陵=橿原市、吉野水分神社=吉野郡吉野町" },
  { itinId: "cf6ae961-1b58-486b-8b4f-fcae6f7e0516", title: "渋谷の絶景展望台と明治神宮の杜、対照的な魅力を巡る旅", prefecture: "東京都", evidence: "氷川神社(渋谷)=渋谷区" },
  { itinId: "c27fe728-37c2-4ca0-9bac-06451d485ff2", title: "海辺の絶景とデジタルアート、お台場を楽しむ旅", prefecture: "東京都", evidence: "お台場海浜公園=港区" },
  { itinId: "56395886-d541-4396-b650-e006867bef6a", title: "浅草寺の参道と上野の森、上野・浅草満喫旅", prefecture: "東京都", evidence: "浅草花やしき・上野恩賜公園=台東区" },
  { itinId: "1a3f2d39-810f-4662-a2c0-b1751331a3ed", title: "櫛田神社と中洲屋台、博多の伝統と活気を巡る旅", prefecture: "福岡県", evidence: "キャナルシティ博多=福岡市博多区" },
];

async function main() {
  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));

  for (const t of TARGETS) {
    const itin = await prisma.itinerary.findUnique({ where: { id: t.itinId }, select: { id: true, title: true, primaryAreaId: true } });
    if (!itin) throw new Error(`しおりが見つかりません: ${t.itinId}`);
    if (itin.title !== t.title) throw new Error(`タイトルが想定外です: ${itin.title} (期待: ${t.title})`);
    if (itin.primaryAreaId !== null) throw new Error(`すでにprimaryAreaIdが設定されています: ${t.itinId}`);
    const areaId = prefMap.get(t.prefecture);
    if (!areaId) throw new Error(`都道府県が見つかりません: ${t.prefecture}`);
    console.log(`[確認OK] ${t.title} → ${t.prefecture}（根拠: ${t.evidence}）`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  for (const t of TARGETS) {
    const areaId = prefMap.get(t.prefecture)!;
    await prisma.itinerary.update({ where: { id: t.itinId }, data: { primaryAreaId: areaId } });
    console.log(`更新: ${t.title} → ${t.prefecture}`);
  }
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
