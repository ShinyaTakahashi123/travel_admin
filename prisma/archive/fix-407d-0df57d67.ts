/**
 * #407 0df57d67 の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 決まり2「最後の行き先を出るのが16:30〜17:00」、昼食・帰り・車の一言）
 * 1日目（車）: 耶馬渓橋 → 青の洞門 → 古羅漢の景 → 羅漢寺 → 道の駅 耶馬トピア（昼食）→ 一目八景 → 耶馬溪ダム → 耶馬渓ダム記念公園「溪石園」（新規）（8か所 09:00〜16:30）
 *   一目八景とダムの順を入れ替え（奥の一目八景へ先に行き、帰り道にダムと溪石園に寄る）、溪石園を足す
 *   本文: 最初に車の旅の一言、耶馬トピアに昼食の一言、最後に帰りの一言。説明文も合わせる
 * 本文の出典: 中津耶馬渓観光協会 https://nakatsuyaba.com/pages/183/ （耶馬渓ダム記念公園「溪石園」、年中無休）
 * 座標の出典: 溪石園は OSM に点がなく、地理院の住所検索は大字の中心しか返さないので、すぐ上にあるダムの堤の点（OSM way 491477033 33.438975,131.133171）を使う
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-407d-0df57d67.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0df57d67-3dc2-4af0-8b22-74933cfcc298";
const DAY1_ID = "b6e48c48-1a85-4649-baa2-d03eb32c5a69";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY1_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  const want = ["耶馬渓橋（オランダ橋）", "青の洞門", "古羅漢の景", "羅漢寺", "道の駅 耶馬トピア（昼食）", "耶馬溪ダム", "一目八景"];
  if (day.spots.map((s) => s.name).join() !== want.join()) throw new Error("1日目が想定と違います");
  const [bridge, domon, korakan, rakanji, topia, dam, hitome] = day.spots;

  const bridgeMemo = "この旅は車（レンタカーなど）でめぐります。旅の始まりは耶馬渓橋へ。" + (bridge.memo ?? "");
  const topiaMemo = rep(topia.memo ?? "", "羅漢寺から車で約15分。", "羅漢寺から車で約15分。ここで昼食にしましょう。");
  const hitomeMemo = rep(hitome.memo ?? "", "耶馬溪ダムから車で約25分、深耶馬溪の中心にある景勝地です。", "耶馬トピアから車で約35分。深耶馬溪の中心にある景勝地です。");
  const damMemo = rep(dam.memo ?? "", "耶馬トピアから車で約20分。", "一目八景から車で約25分、帰り道に耶馬溪ダムへ。");
  const description = rep(
    rep(it.description ?? "", "昼食をとってから、耶馬溪ダムを経て、", "昼食をとってから、"),
    "深耶馬溪の一目八景へ。", "深耶馬溪の一目八景へ。帰り道に耶馬溪ダムと、ダムのふもとの日本庭園・溪石園に立ち寄ります。");

  const order = [
    { id: bridge.id, data: { memo: bridgeMemo } },
    { id: domon.id, data: {} },
    { id: korakan.id, data: {} },
    { id: rakanji.id, data: {} },
    { id: topia.id, data: { memo: topiaMemo } },
    { id: hitome.id, data: { memo: hitomeMemo, visitTime: t(14, 20), stayDurationMin: 60, transitMode: "car", transitDurationMin: 35 } },
    { id: dam.id, data: { memo: damMemo, visitTime: t(15, 45), stayDurationMin: 20, transitMode: "car", transitDurationMin: 25 } },
    { create: { name: "耶馬渓ダム記念公園「溪石園」", visitTime: t(16, 10), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 33.438975, lng: 131.133171, address: "大分県中津市耶馬溪町大字大島2286-1",
      memo: "ダムのふもとにある耶馬渓ダム記念公園「溪石園」へ。1987年（昭和62年）に耶馬溪ダムの完成を記念して造られた、広さ2万㎡の日本庭園です。数万個の石とダムの水を使って耶馬溪の渓流を再現していて、50種2万本の樹木と池や岩、滝が、季節ごとに美しい景色を見せてくれます。池や石のまわりでは足元に気をつけましょう。耶馬渓の絶景と信仰をめぐる旅を、ここで締めくくりましょう。帰りは、レンタカーを返す場所まで安全運転で。" } },
  ];
  console.log(`説明文: ${description}`);
  console.log(`耶馬渓橋: ${bridgeMemo.slice(0, 40)}…`);
  console.log(`耶馬トピア: ${topiaMemo.slice(0, 40)}…`);
  console.log(`一目八景: ${hitomeMemo.slice(0, 40)}…`);
  console.log(`ダム: ${damMemo.slice(0, 40)}…`);
  console.log("1日目: …羅漢寺 → 耶馬トピア 12:30〜13:45（昼食）→（車35分）一目八景 14:20〜15:20 →（車25分）耶馬溪ダム 15:45〜16:05 → 溪石園 16:10〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await setDaySpotOrder(DAY1_ID, order, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
