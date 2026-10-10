/**
 * #211 b7eb511a の追いの直し（しおりえ(制作補助2)、2026-10-01 企画運営の指摘「武家屋敷通りの60分は長い」）
 * 2日目の終わりを組み替え、武家屋敷通りを40分にして、福江の町の宗念寺を足す
 *   水ノ浦教会 →（車30分）武家屋敷通り 15:10〜15:50（ふるさと館の駐車場に停める）→（歩いて20分）六角井 16:10〜16:25 →（歩いて5分）宗念寺 16:30〜16:55 →（歩いて約25分で駐車場へ）
 * 宗念寺の出典: 五島の島たび【公式】モデルコース https://goto.nagasaki-tabinet.com/model/62242
 *   （市役所の北側・寛永11年（1634年）に22代盛利の実母 芳春尼の菩提寺として開基されたといわれる・坂部貞兵衛や藩絵師 大坪玄能の墓所・
 *     貞兵衛は伊能忠敬の測量に随行し、五島の西海岸の測量中に病に倒れ、忠敬に看取られたと伝わる・宗念寺で葬儀）
 *   座標: 国土地理院の住所検索（福江町16番）32.697536,128.841537
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-211c-b7eb511a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY2 = "ad0da497-c075-4c90-a305-1af3393b5cdb";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const REP: Record<string, [string, string][]> = {
  武家屋敷通り: [
    ["六角井から車で約5分。", "水ノ浦から車で約30分、福江の町へ戻ります。"],
    ["車はふるさと館の駐車場に停められます。", "車はふるさと館の駐車場に停めたまま、このあとは歩いてめぐります。"],
    ["帰りは、福江港や五島つばき空港でレンタカーを返しましょう。", ""],
  ],
  六角井: [["水ノ浦から車で約30分、福江の町へ戻ります。", "武家屋敷通りから歩いて約20分、唐人町の高台へ。"]],
};
const SOUNEN = {
  name: "宗念寺", visitTime: t(16, 30), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 5, transitLine: null,
  lat: 32.697536, lng: 128.841537, address: "長崎県五島市福江町16-1",
  memo: "六角井から歩いて約5分、市役所の北側へ。五島家22代・盛利の母、芳春尼の菩提寺として、江戸時代のはじめに開かれたといわれる寺です。境内には、伊能忠敬の測量に加わり、五島の西海岸を測量している途中で病に倒れた坂部貞兵衛や、五島藩の絵師・大坪玄能などの墓所があります。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。帰りは、ふるさと館の駐車場へ歩いて約25分で戻り、福江港や五島つばき空港でレンタカーを返しましょう。",
};
const PLAN: [string, number, number, number, string, number][] = [
  ["魚津ヶ崎公園", 9, 0, 60, "", 0],
  ["城岳展望所", 10, 15, 35, "", 0],
  ["高崎鼻（高崎草原）", 11, 15, 35, "", 0],
  ["辞本涯の碑", 12, 0, 30, "", 0],
  ["道の駅 遣唐使ふるさと館", 12, 45, 50, "", 0],
  ["水ノ浦教会", 14, 0, 40, "", 0],
  ["武家屋敷通り", 15, 10, 40, "car", 30],
  ["六角井", 16, 10, 15, "walk", 20],
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: DAY2 }, orderBy: { orderNo: "asc" } });
  const byName = Object.fromEntries(spots.map((s) => [s.name, s]));
  if (spots.map((s) => s.name).join() !== "魚津ヶ崎公園,城岳展望所,高崎鼻（高崎草原）,辞本涯の碑,道の駅 遣唐使ふるさと館,水ノ浦教会,六角井,武家屋敷通り") throw new Error("構成が想定と違います");
  const items: unknown[] = [];
  for (const [name, h, m, stay, mode, min] of PLAN) {
    const s = byName[name];
    const data: Record<string, unknown> = { visitTime: t(h, m), stayDurationMin: stay };
    if (mode) Object.assign(data, { transitMode: mode, transitDurationMin: min });
    if (REP[name]) {
      let memo = s.memo ?? "";
      for (const [a, b] of REP[name]) {
        if (!memo.includes(a)) throw new Error(`${name}: 本文が想定と違います（${a}）`);
        memo = memo.replace(a, b);
      }
      data.memo = memo;
      console.log(`${name}: ${memo}\n`);
    }
    items.push({ id: s.id, data });
  }
  items.push({ create: SOUNEN });
  console.log("武家屋敷通り 15:10〜15:50 → 六角井 16:10〜16:25 → 宗念寺 16:30〜16:55（新規）");
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
