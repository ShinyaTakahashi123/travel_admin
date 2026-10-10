/**
 * #423 61ec95e9 の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 仕様の決まり3「最終日も16:30〜17:00まで」）
 * 2日目: 闇無浜神社 → 福澤諭吉旧居・福澤記念館 → 大江医家史料館 → 合元寺 →（昼食）→ 中津城（新規）→（車）羅漢寺（新規）→ 青の洞門・競秀峰（新規）（7か所 09:00〜16:30）
 *   羅漢寺の入山は15:30まで（公式）なので、中津城のあとすぐ車で向かい、青の洞門を最後にする
 * 本文の出典: 中津耶馬渓観光協会 https://nakatsuyaba.com/pages/N/（中津城 129／羅漢寺 106／青の洞門 114／競秀峰 200）
 * 座標の出典: Nominatim（中津城 33.6066484,131.1863802／羅漢寺 33.4815199,131.1866660／青の洞門 33.4993279,131.1726041）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-423b-61ec95e9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "61ec95e9-752c-4fff-a7d4-b5b0f251159b";
const DAY2_ID = "e176cb3d-259f-4e20-a96d-6156ae9a6143";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  const names = ["闇無浜神社", "福澤諭吉旧居・福澤記念館", "大江医家史料館", "合元寺"];
  if (day.spots.map((s) => s.name).join() !== names.join()) throw new Error("2日目が想定と違います");
  const gogan = day.spots[3];
  const from = "中津の歴史と信仰をたどる旅を、ここで締めくくりましょう。";
  if (!gogan.memo?.includes(from)) throw new Error("合元寺の本文が想定と違います");
  const goganMemo = gogan.memo.replace(from, "このあと、寺町のあたりで昼食にしましょう。");

  const order = [
    ...day.spots.slice(0, 3).map((s) => ({ id: s.id, data: {} })),
    { id: gogan.id, data: { memo: goganMemo } },
    { create: { name: "中津城", visitTime: t(13, 35), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 33.606648, lng: 131.18638, address: "大分県中津市二ノ丁1273-2",
      memo: "昼食のあとは、中津川の河口に建つ中津城へ。九州で最も古い近世城郭とされ、天正16年（1588年）に黒田官兵衛（孝高）が造営を始めました。そのあと細川氏、小笠原氏と城主が代わり、享保2年（1717年）に奥平昌成が入ってからは、明治4年（1871年）の廃城まで中津藩主の居城でした。堀に海水が入って潮の満ち引きで水かさが変わる水城で、日本三大水城の一つとされます。本丸の北側には、黒田時代と細川時代の石垣の継ぎ目も見られます。天守閣の中は奥平家歴史資料館になっていて、奥平家に伝わる甲冑などが展示されています。" } },
    { create: { name: "羅漢寺", visitTime: t(14, 50), stayDurationMin: 50, transitMode: "car", transitDurationMin: 25, transitLine: null, lat: 33.48152, lng: 131.186666, address: "大分県中津市本耶馬渓町跡田",
      memo: "中津城から車で、耶馬渓の羅漢寺へ。曹洞宗の寺院で、無漏窟に坐す日本最古とされる石造の五百羅漢像や、千体地蔵尊をはじめ、数千体の石仏が境内の岩屋にまつられています。石仏群は国の重要文化財です。巨大な岩壁に伽藍が溶け込む羅漢山は、耶馬渓を代表する景勝地としても知られています。駐車場から本堂までは石段を登って15〜20分ほどかかり、入山できる時間も決まっているので、公式の案内で確かめてから出かけましょう。石段では足元に気をつけましょう。" + RESPECT } },
    { create: { name: "青の洞門・競秀峰", visitTime: t(15, 50), stayDurationMin: 40, transitMode: "car", transitDurationMin: 10, transitLine: null, lat: 33.499328, lng: 131.172604, address: "大分県中津市本耶馬渓町樋田",
      memo: "旅の締めくくりは、山国川沿いの青の洞門へ。江戸時代、競秀峰の岩壁に鎖を命綱にした危険な道で人や馬が命を落とすのを見た禅海和尚が、享保20年（1735年）から、雇った石工たちとノミと鎚だけで掘り進め、30年余りたった明和元年（1764年）に完成させたトンネルです。今もノミの跡が残っています。頭上に連なる競秀峰は、耶馬渓を代表する名勝で、約1kmにわたって岩峰が並びます。洞門の中は車も通るので、歩くときは気をつけましょう。中津の歴史と耶馬渓の景色をめぐる旅を、ここで締めくくりましょう。帰りは、車で中津駅のほうへ戻ります。" } },
  ];
  console.log("2日目: 闇無浜神社 09:00 → 福澤 09:50 → 大江医家 11:15 → 合元寺 12:10〜12:40 →（昼食）→ 中津城 13:35〜14:25 →（車25分）羅漢寺 14:50〜15:40 →（車10分）青の洞門・競秀峰 15:50〜16:30");
  console.log(`合元寺の最後: …${goganMemo.slice(-60)}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => { await setDaySpotOrder(DAY2_ID, order, { tx }); }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
