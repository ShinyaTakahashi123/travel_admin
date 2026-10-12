/**
 * 2026-09-30 最終日を16:30まで延ばした7本の、説明文（紹介文）の追いの修正（しおりえ(制作補助2)、法務の指摘「足した行き先が説明文に入っていない」）
 *   #423 61ec95e9・#424 625c11c9・#425 6e2f29bb・#426 6e5b2d45・#428 7a65702f・#431 83518f0d・#432 87674ca9 の説明文に、足した行き先を入れる
 *   あわせて #432 伊勢神宮 内宮の本文「およそ2000年前、垂仁天皇の御代から五十鈴川のほとりにまつられている」→「…まつられているとされる」（法務）
 * 1本ずつ、今の文の一部を確かめてから置き換える（違っていたら止まる）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-0930-desc-lastday.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const items: { id: string; from: string; to: string }[] = [
  { id: "61ec95e9-752c-4fff-a7d4-b5b0f251159b", from: "福澤諭吉旧居、赤壁の合元寺まで。", to: "福澤諭吉旧居、赤壁の合元寺をめぐり、午後は中津城から車で耶馬渓の羅漢寺と青の洞門へ。" },
  { id: "625c11c9-1f5c-40dd-b510-9e93c517f6ff", from: "平等院表参道で宇治茶の香りにふれます。", to: "平等院表参道で宇治茶の香りにふれたら、宇治川のほとりの宇治神社や興聖寺、恵心院まで歩きます。" },
  { id: "6e2f29bb-45c2-494a-83c1-8e42e11552c1", from: "鴻の湯と地蔵湯へ。", to: "鴻の湯と地蔵湯へ。午後は極楽寺から、バスで日和山海岸と城崎マリンワールドへ。" },
  { id: "6e5b2d45-92e1-4cfe-913d-b80babce8573", from: "本多忠勝ゆかりの大多喜城と城下町へ。房総の渓谷と城下町をめぐる、車の1泊2日です。", to: "本多忠勝ゆかりの大多喜城と城下町を歩き、午後は外房の勝浦へ。八幡岬、鵜原理想郷、海中展望塔をめぐります。房総の渓谷と城下町、海をめぐる車の1泊2日です。" },
  { id: "7a65702f-5c0b-4b5b-a3b7-922d2f9ed73e", from: "毛利家墓所、洞春寺、八坂神社へ。", to: "毛利家墓所、洞春寺、八坂神社、大内氏の館跡に建つ龍福寺をめぐり、午後は十朋亭維新館や菜香亭、豊栄神社・野田神社へ。" },
  { id: "83518f0d-2bb9-44db-a3f1-bf8193c73dcf", from: "札幌市時計台を訪ね、すすきののラーメン横丁で昼食。最後はサッポロビール博物館で開拓とビールの歴史にふれる、札幌の名所とグルメを詰め込んだ1泊2日です。", to: "札幌市時計台を訪ね、サッポロビール博物館で開拓とビールの歴史にふれたら、すすきのから明治の洋館・豊平館と中島公園へ。札幌の名所とグルメを詰め込んだ1泊2日です。" },
  { id: "87674ca9-f370-4383-9108-f19d9f510274", from: "漁具のビン玉が並ぶビン玉ロードを訪ねる、志摩半島のリアス海岸を楽しむ車の1泊2日です。", to: "漁具のビン玉が並ぶビン玉ロードを訪ね、午後は伊雑宮と伊勢神宮 内宮へお参りする、志摩半島のリアス海岸と伊勢を楽しむ車の1泊2日です。" },
];
const NAIKU_ID = "87674ca9-f370-4383-9108-f19d9f510274";
const NAIKU_FROM = "五十鈴川のほとりにまつられている、天照大御神をおまつりするお宮です。";
const NAIKU_TO = "五十鈴川のほとりにまつられているとされる、天照大御神をおまつりするお宮です。";

async function main() {
  const plans: { id: string; description: string }[] = [];
  for (const x of items) {
    const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: x.id }, select: { description: true, title: true } });
    if (!it.description?.includes(x.from)) throw new Error(`${x.id.slice(0, 8)} の説明文が想定と違います`);
    const description = it.description.replace(x.from, x.to);
    plans.push({ id: x.id, description });
    console.log(`■ ${x.id.slice(0, 8)} ${it.title}\n  ${description}`);
  }
  const naiku = await findSpotInItinerary(NAIKU_ID, { dayNumber: 2, spotName: "伊勢神宮 内宮" });
  if (!naiku.memo?.includes(NAIKU_FROM)) throw new Error("内宮の本文が想定と違います");
  const naikuMemo = naiku.memo.replace(NAIKU_FROM, NAIKU_TO);
  console.log(`内宮: ${naikuMemo.slice(0, 90)}…`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plans) await tx.itinerary.update({ where: { id: p.id }, data: { description: p.description } });
    await updateSpotInItinerary(NAIKU_ID, { dayNumber: 2, spotId: naiku.id }, { memo: naikuMemo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
