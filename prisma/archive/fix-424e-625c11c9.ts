/**
 * #424 625c11c9 の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 仕様の決まり3「最終日も16:30〜17:00まで」）
 * 3日目: 三室戸寺 → 宇治上神社 → 宇治橋 → 平等院 → 平等院表参道（昼食）→ 縣神社（新規）→ 浮島十三重石塔（新規）→ 宇治神社（新規）→ 興聖寺（新規）→ 恵心院（新規）（10か所 09:00〜16:30）
 *   興聖寺の拝観は16:00まで、恵心院は17:00まで（そうだ京都、行こう。）なので、興聖寺を先、恵心院を最後に。本文には時刻を書かない
 *   興聖寺の再興の年は、宇治市観光協会（1649年）と「そうだ京都、行こう。」（慶安元年・1648年）で違うので、年は書かない
 * 本文の出典: 宇治市観光協会 https://www.kyoto-uji-kankou.or.jp/tourism.html（興聖寺・宇治神社・恵心院・あがた神社・十三重石塔）、
 *   そうだ京都、行こう。 https://souda-kyoto.jp/guide/spot/koushouji.html ・/eshinin.html 、宇治市 https://www.city.uji.kyoto.jp/soshiki/3/7521.html（興聖寺・琴坂）
 * 座標の出典: Nominatim（縣神社 34.8885411,135.8057702／浮島十三重塔 34.8883272,135.8102999／宇治神社 34.8908505,135.8104162／興聖寺 34.8894639,135.8133996／恵心院 34.8902899,135.8111510）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-424e-625c11c9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "625c11c9-1f5c-40dd-b510-9e93c517f6ff";
const DAY3_ID = "3a170255-f7a5-4f86-b483-24a654fd9bb9";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const cre = (name: string, h: number, m: number, stay: number, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: "walk", transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

async function main() {
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY3_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  if (day.spots.map((s) => s.name).join() !== ["三室戸寺", "宇治上神社", "宇治橋", "宇治平等院", "平等院表参道"].join()) throw new Error("3日目が想定と違います");
  const omote = day.spots[4];
  const from = "ここで昼食をとり、宇治のお茶を味わって、旅を締めくくりましょう。";
  if (!omote.memo?.includes(from)) throw new Error("表参道の本文が想定と違います");
  const omoteMemo = omote.memo.replace(from, "ここで昼食をとり、宇治のお茶を味わいましょう。");

  const order = [
    ...day.spots.slice(0, 4).map((s) => ({ id: s.id, data: {} })),
    { id: omote.id, data: { memo: omoteMemo } },
    cre("縣神社", 13, 35, 15, 5, 34.888541, 135.80577, "京都府宇治市宇治蓮華",
      "表参道から歩いてすぐの縣（あがた）神社へ。木花開耶姫をまつる神社で、平等院が建てられたときにはその鎮守になったとも伝えられています。毎年6月には、「暗夜の奇祭」といわれる県祭りが行われます。" + RESPECT),
    cre("浮島十三重石塔", 14, 0, 20, 10, 34.888327, 135.8103, "京都府宇治市宇治",
      "宇治川の中の島（塔の島）へ渡り、浮島十三重石塔へ。高さ約15mの、国内最大級とされる石塔で、1286年に西大寺の僧・叡尊が建てました。朝廷の命で宇治橋を修復した叡尊は、網代や漁具を埋めてその上にこの石塔を建て、魚の霊の供養と宇治橋の安全を祈ったといわれます。川べりでは足元に気をつけましょう。"),
    cre("宇治神社", 14, 30, 25, 10, 34.890851, 135.810416, "京都府宇治市宇治",
      "中の島から橋を渡って宇治神社へ。菟道稚郎子をまつる神社で、このあたりは応神天皇の別荘で、菟道稚郎子の宮殿・桐原日桁宮の跡といわれています。明治元年（1868年）までは、宇治上神社が「離宮上社」、宇治神社が「離宮下社」と呼ばれ、一体のものでした。" + RESPECT),
    cre("興聖寺", 15, 5, 50, 10, 34.889464, 135.8134, "京都府宇治市宇治",
      "宇治神社から歩いて興聖寺へ。道元禅師が深草に開いた寺を、江戸時代の初めにこの地に再興した曹洞宗の寺です。宇治川から山門へ続く坂道は、小川のせせらぎの音と坂の形が琴に似ていることから「琴坂」と呼ばれ、春は新緑、秋は紅葉が美しい道です。坂を登りきると、中国風の竜宮造りの山門が迎えてくれます。拝観の時間は公式の案内で確かめましょう。" + RESPECT),
    cre("恵心院", 16, 0, 30, 5, 34.89029, 135.811151, "京都府宇治市宇治",
      "旅の締めくくりは恵心院へ。『源氏物語』宇治十帖で、宇治川に身を投げた浮舟を助ける横川の僧都のモデルといわれる恵心僧都が、1005年に再興したと伝えられる寺です。境内には季節ごとに花が咲き、「花の寺」としても知られています。" + RESPECT + "伏見と宇治をめぐった3日間の旅を、ここで締めくくりましょう。帰りは、歩いてすぐの京阪宇治駅から。"),
  ];
  console.log("3日目: …平等院表参道 12:45〜13:30（昼食）→ 縣神社 13:35 → 浮島十三重石塔 14:00 → 宇治神社 14:30 → 興聖寺 15:05〜15:55 → 恵心院 16:00〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => { await setDaySpotOrder(DAY3_ID, order, { tx }); }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
