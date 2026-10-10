/**
 * #475 9754ee3c の1日目の組み直し（しおりえ(制作補助2)、企画運営 9/30 20:33・法務 9/30 20:28 の指摘）
 *   志高湖へのバス（36番）は志高湖畔に止まる便が1日に数本しかなく、決まった時刻に乗れないので志高湖をやめる
 *   → ロープウェイから別府駅へ下る36番のとちゅうの別府公園へ。昼食は竹瓦小路のあたり、別府タワーを足し、竹細工伝統産業会館で1日目を終える
 *   別府ロープウェイ 9:10〜9:20 → 鶴見岳の山上 9:30〜10:45 →（ロープウェイと36番のバス35分）別府公園（新規）11:20〜12:00 →（歩き20分）竹瓦小路（昼食）12:20〜13:20
 *   →（歩き5分）竹瓦温泉 13:25〜14:25 →（歩き10分）別府タワー（新規）14:35〜15:10 →（バス30分）別府市竹細工伝統産業会館 15:40〜16:35
 *   鶴見岳の山上に、活火山の一文を足す（法務・#474 と同じ）
 * 本文の出典: 36番の停留所（別府ロープウェイ→別府公園前→別府駅西口）https://www.navitime.co.jp/bus/route/00079439/ 、志高湖畔の便 https://www.navitime.co.jp/bus/diagram/timelist?departure=00087605&arrival=00507082&line=00079439 、
 *   別府市 https://www.city.beppu.oita.jp/sisetu/kouen_tyuusyajyou/03kouen_03-01beppu.html （別府公園）、別府タワー https://bepputower.co.jp/tower/
 * 座標の出典: OSM（別府公園 way 92357403／別府タワー way 1385316939）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-475c-9754ee3c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9754ee3c-be4b-4db8-838f-348335a26701";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const BATH = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。";

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  const d1 = it.days[0];
  const want = ["別府ロープウェイ", "鶴見岳の山上", "志高湖", "別府市竹細工伝統産業会館", "竹瓦温泉", "竹瓦小路"];
  if (d1.spots.map((s) => s.name).join() !== want.join()) throw new Error("1日目が想定と違います");
  const [ropeway, sanjo, shidaka, takezaiku, takegawara, alley] = d1.spots;
  if (shidaka.photos.length !== 0) throw new Error("志高湖に写真があります");

  const sanjoMemo = rep(sanjo.memo ?? "", "山道では足元に気をつけましょう。", "山道では足元に気をつけましょう。鶴見岳は活火山です。火山の情報や規制を、気象庁や現地の最新の案内で確かめましょう。");
  const description = rep(it.description ?? "", "1日目は別府ロープウェイで鶴見岳の山上へ上り、高原の志高湖でひと息。午後は別府の竹細工にふれ、竹瓦温泉と竹瓦小路へ。",
    "1日目は別府ロープウェイで鶴見岳の山上へ上り、別府公園を歩いて、竹瓦小路と竹瓦温泉、別府タワーへ。夕方は別府の竹細工にふれます。");

  const day1 = [
    { id: ropeway.id, data: {} },
    { id: sanjo.id, data: { memo: sanjoMemo } },
    { create: { name: "別府公園", visitTime: t(11, 20), stayDurationMin: 40, transitMode: "bus", transitDurationMin: 35, transitLine: "亀の井バス", lat: 33.281976, lng: 131.491103, address: "大分県別府市",
      memo: "ロープウェイで下り、亀の井バスの別府駅西口行きで別府公園前へ。広さ27.3haの公園で、明治40年に当時の皇太子（のちの大正天皇）が訪れるのに合わせて整えられた歴史があり、樹齢100年をこえる松が今も立ち並びます。" } },
    { id: alley.id, data: { visitTime: t(12, 20), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 20, transitLine: null,
      memo: "別府公園から東へ、別府駅の前を通って竹瓦小路へ。竹瓦温泉へ来る人が雨にぬれないようにと、大正10年（1921年）に作られた、現存する日本最古の木造アーケードとされます。このあたりで昼食にしましょう。" } },
    { id: takegawara.id, data: { visitTime: t(13, 25), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 5, transitLine: null,
      memo: "竹瓦小路を抜けて、竹瓦温泉へ。明治12年（1879年）に開かれた市営の温泉で、今の建物は昭和13年（1938年）に建てられた、唐破風の大きな屋根が目印です。ふつうの湯のほか、温泉で温めた砂に横たわる砂湯もあります。休みの日は公式の案内で確かめましょう。" + BATH } },
    { create: { name: "別府タワー", visitTime: t(14, 35), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 33.281711, lng: 131.505924, address: "大分県別府市北浜3丁目",
      memo: "竹瓦温泉から海の方へ歩いて、別府タワーへ。昭和32年から親しまれてきた観光塔で、国の登録有形文化財です。展望台からは、別府の街や別府湾、まわりの山々を360度見わたせます。" } },
    { id: takezaiku.id, data: { visitTime: t(15, 40), stayDurationMin: 55, transitMode: "bus", transitDurationMin: 30,
      memo: "別府タワーのそばからバスに乗り、竹細工伝産館前へ。別府の伝統の竹細工を紹介する施設で、展示室で作品や歴史を見られるほか、予約をすれば竹細工の体験もできます。休館日は公式の案内で確かめましょう。別府の高台と温泉をめぐる1日目を、ここで締めくくりましょう。今夜は、バスで別府駅へ戻って泊まります。" } },
  ];
  console.log(`説明文: ${description}`);
  console.log("1日目: ロープウェイ 9:10 → 鶴見岳 9:30 →（バス）別府公園 11:20 → 竹瓦小路（昼食）12:20 → 竹瓦温泉 13:25 → 別府タワー 14:35 →（バス）竹細工会館 15:40〜16:35");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await setDaySpotOrder(d1.id, day1 as any, { tx, remove: [shidaka.id] });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
