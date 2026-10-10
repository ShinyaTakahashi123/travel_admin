/**
 * #474 91dbe03a の追いの直し（しおりえ(制作補助2)、企画運営 9/30 20:15・法務 9/30 20:11 の指摘）
 *   道の駅阿蘇の40分は長い滞在（決まりA）→ 30分にし、米塚のあとに西巌殿寺（本坊）を足す: 米塚 15:05〜15:25 →（車10分）西巌殿寺 15:35〜16:00 →（車5分）道の駅阿蘇 16:05〜16:35
 *   草千里ヶ浜に、活火山の一文（法務・#304 と同じ）と、冬の山の道の一文（企画運営）を足す
 * 本文の出典: 阿蘇市観光協会 https://www.asocity-kanko.jp/spot/saigandenji/ （西巌殿寺。ご利益の部分は書かない）
 * 座標の出典: 西巌殿寺（本坊）は OSM に点がないので、地理院の住所検索（阿蘇市黒川1114番地）32.93121,131.078705
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-474c-91dbe03a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "91dbe03a-f372-4db4-92c6-c97ab9246310";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  const day = it.days[0];
  const want = ["大観峰", "阿蘇神社", "門前町商店街", "草千里ヶ浜", "阿蘇火山博物館", "米塚", "道の駅阿蘇"];
  if (day.spots.map((s) => s.name).join() !== want.join()) throw new Error("構成が想定と違います");
  const [daikanbo, jinja, monzen, kusasenri, museum, komezuka, michinoeki] = day.spots;

  const kusaMemo = rep(kusasenri.memo ?? "", "草原の散策では、足元に気をつけましょう。",
    "草原の散策では、足元に気をつけましょう。阿蘇山は今も活動を続ける火山です。火山ガスや規制の情報を、気象庁や現地の最新の案内で確かめましょう。冬は山の上の道が凍ることがあるので、冬用のタイヤや道路の情報を確かめておきましょう。");
  const michiMemo = rep(michinoeki.memo ?? "", "山を下りて、JR阿蘇駅前の道の駅阿蘇へ。阿蘇のみやげをさがしたり、ひと休みしたりしましょう。",
    "西巌殿寺から車ですぐの、JR阿蘇駅前の道の駅阿蘇へ。阿蘇のみやげをさがしましょう。");

  const order = [
    { id: daikanbo.id, data: {} },
    { id: jinja.id, data: {} },
    { id: monzen.id, data: {} },
    { id: kusasenri.id, data: { memo: kusaMemo } },
    { id: museum.id, data: {} },
    { id: komezuka.id, data: {} },
    { create: { name: "西巌殿寺", visitTime: t(15, 35), stayDurationMin: 25, transitMode: "car", transitDurationMin: 10, transitLine: null, lat: 32.93121, lng: 131.078705, address: "熊本県阿蘇市黒川1114",
      memo: "米塚から山を下り、阿蘇駅のそばの坊中にある西巌殿寺へ。天台宗の寺で、古くから阿蘇山の修験道の拠点とされてきました。本堂は2001年の火事で焼けて礎石だけが残りますが、山門をくぐって石段を上った本堂の跡には、阿蘇檜や公孫樹の古木が見られます。石段では足元に気をつけましょう。" + RESPECT } },
    { id: michinoeki.id, data: { visitTime: t(16, 5), stayDurationMin: 30, transitDurationMin: 5, memo: michiMemo } },
  ];
  console.log(`草千里: …${kusaMemo.slice(-110)}`);
  console.log(`道の駅: ${michiMemo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day.id, order as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
