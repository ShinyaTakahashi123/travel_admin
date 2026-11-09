/**
 * #2 bb3ae76a「五稜郭と元町、函館の歴史と夜景を巡る旅」の組み直し（しおりえ(制作補助2)、企画運営 10/30 の案 (A)。fld-002 の文の直しのあと）
 * - 夜景は初日の夜に: 明治館の最後に、山麓駅まで歩いて約12分（foot 878m・11.7分）→ ロープウェイで山頂の夜景 → 宿、の一文。「100万ドルの夜景」は使わない
 * - 2日目:
 *   公会堂 84→40分 → 歩3（foot 194m）→ 元町のあたりで昼食 11:47〜12:27（点: 基坂の案内板 node 10614840796、店でない名前の点）→ 歩7（487m）→ ハリストス 12:34（もとのまま）…
 *   外国人墓地 14:03〜14:28 → タクシー15（OSRM 9.6分＋5。立待岬へのバスはない）→ 立待岬 14:43〜15:41（58分のまま）→ 歩21（1,582m）→
 *   函館八幡宮 16:02〜16:32（社殿 way 267157155）→ 歩13（938m）で谷地頭の電停 → 市電で函館駅前まで約15分（駅探 https://ekitan.com/transit/section/sf-8235/st-8227 、谷地頭 11:45→函館駅前 12:00、法務・企画運営 10/30）
 *   函館山ロープウェイ山麓駅は外す（夜景を初日に移したので、同じ場所を2日続けない）。終わりはもとの 16:36 より前
 * 出典: 立待岬・市電「函館駅前→谷地頭 約12分」・冬は車で行けない = 函館市の観光公式 https://www.hakodate.travel/en/?p=172667
 *   函館八幡宮 = 北海道の観光公式 https://www.visit-hokkaido.jp/spot/detail_11294.html（1445年創建と伝えられ、1880年に今の場所へ、大正の本殿、134段の石段）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-002b-bb3ae76a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const DAY2_ID = "acb1d5f1-79e2-464f-8070-219d23577bc3";
const MEIJI = "7c56eb57-6be0-4062-836e-b090186d92b7";
const ASA = "17ce145e-f78d-41d5-9d6c-a62841835075";
const BUN = "8f04f23f-62b4-45e3-8c82-d52335795f1f";
const KOKA = "3308a98d-939e-4737-ba44-fa09cb962337";
const HARI = "8006f46d-5387-4a00-9a08-bb1d210d908c";
const YOHA = "0d0e493f-c777-410a-a2fd-6f0e1518788a";
const BOCHI = "e01e6de3-104a-469b-a13f-43e618b95521";
const TACHI = "83d240bf-a232-4fbc-9ebd-8b44a485ca0d";
const SANROKU = "141f2cbd-a3d9-4fe9-b834-f0f7495419d9";
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: null }));

const EDITS: Record<string, { from: string; to: string }[]> = {
  [MEIJI]: [
    {
      from: "この夜は、函館駅のまわりの宿に泊まりましょう。",
      to: "夜は、歩いて約12分の函館山ロープウェイの山麓駅からロープウェイで山頂へ上がり、日本三大夜景の一つともいわれる夜景を見てから、宿へ向かいましょう。この夜は、函館駅のまわりの宿に泊まりましょう。",
    },
  ],
  [KOKA]: [{ from: "この後は、歩いておよそ6分、函館ハリストス正教会へ向かいましょう。", to: "この後は、歩いておよそ3分、基坂を下りた元町のあたりへ向かいましょう。" }],
  [HARI]: [{ from: "旧函館区公会堂から歩いておよそ6分、", to: "元町のあたりから歩いておよそ7分、" }],
  [BOCHI]: [{ from: "この後は、バスでおよそ20分、立待岬へ向かいましょう。", to: "この後は、タクシーでおよそ15分、立待岬へ向かいましょう。" }],
  [TACHI]: [
    {
      from: "外国人墓地からバスでおよそ20分、立待岬に着きます。",
      to: "外国人墓地からタクシーでおよそ15分、立待岬に着きます。冬は岬への道が車で通れません。この時期は、立待岬には寄らずに函館八幡宮へ向かいましょう。",
    },
    { from: "この後は、バスでおよそ15分、函館山ロープウェイの山麓駅へ向かいましょう。", to: "この後は、歩いておよそ21分、函館八幡宮へ向かいましょう。" },
  ],
};

const LUNCH = {
  name: "元町のあたりで昼食",
  lat: 41.765865,
  lng: 140.710099,
  address: "北海道函館市元町",
  memo: "旧函館区公会堂から基坂を下りて、歩いておよそ3分。元町のあたりで、昼食にしましょう。この後は、歩いておよそ7分、函館ハリストス正教会へ向かいましょう。",
};
const HACHIMAN = {
  name: "函館八幡宮",
  lat: 41.753767,
  lng: 140.710078,
  address: "北海道函館市谷地頭町2-5",
  memo:
    "立待岬から歩いておよそ21分、函館八幡宮に着きます。1445年の創建と伝えられ、北海道の開拓や航海、漁業を守る神として「八幡さん」の愛称で親しまれてきた神社です。明治13年(1880)に今の場所へ移り、大正時代に完成した本殿は、なだらかな屋根の曲線が美しい木造の建物です。社殿へは134段の石段を上ります。神社では、静かにお参りしましょう。五稜郭から元町、立待岬までをめぐった函館の2日間は、これで終わりです。お参りを終えたら、歩いて約13分の谷地頭の電停から市電に乗り、函館駅前まで約15分。帰りの電車や飛行機に乗りましょう。",
};

async function main() {
  const day2 = await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: true } } } });
  if (day2.itineraryId !== "bb3ae76a-3afb-4d83-87fb-b8a2989f663d" || day2.spots.map((s) => s.id).join() !== [ASA, BUN, KOKA, HARI, YOHA, BOCHI, TACHI, SANROKU].join())
    throw new Error("2日目の構成が想定と違います");
  const meiji = await prisma.spot.findUniqueOrThrow({ where: { id: MEIJI } });
  const all = [...day2.spots, meiji];
  const memos: Record<string, string> = {};
  for (const [id, edits] of Object.entries(EDITS)) {
    const s = all.find((x) => x.id === id)!;
    let m = s.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
      console.log(`${s.name} → ${e.to}`);
    }
    memos[id] = m;
  }
  const get = (id: string) => day2.spots.find((s) => s.id === id)!;
  const hm = (d: Date) => `${d.getUTCHours()}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  if (hm(get(KOKA).visitTime!) !== "11:04" || get(KOKA).stayDurationMin !== 84 || hm(get(HARI).visitTime!) !== "12:34" || hm(get(TACHI).visitTime!) !== "14:48")
    throw new Error("時刻が想定と違います");
  console.log("\n2日目（直したあと）");
  console.log("09:00 朝市 / 10:26 文学館 / 11:04-11:44 公会堂（84→40）/ 歩3 11:47-12:27 元町のあたりで昼食 / 歩7 12:34 ハリストス / 13:26 ヨハネ / 14:03-14:28 外国人墓地 /");
  console.log("タクシー15 14:43-15:41 立待岬 / 歩21 16:02-16:32 函館八幡宮 → 歩13 谷地頭 → 市電約15分 函館駅前。外す: 山麓駅");
  console.log(`昼食 ${LUNCH.lat},${LUNCH.lng} → ${LUNCH.memo}`);
  console.log(`八幡宮 ${HACHIMAN.lat},${HACHIMAN.lng} → ${HACHIMAN.memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const keep = (id: string) => ({ id, data: memos[id] ? { memo: memos[id] } : {} });
  const make = (x: typeof LUNCH, h: number, m: number, stay: number, legs: Leg[]) => ({
    create: { name: x.name, visitTime: t(h, m), stayDurationMin: stay, transitLegs: { create: legsCreate(legs) }, lat: x.lat, lng: x.lng, address: x.address, memo: x.memo },
  });
  await prisma.$transaction(
    async (tx) => {
      await tx.spot.update({ where: { id: MEIJI }, data: { memo: memos[MEIJI] } });
      await setDaySpotOrder(
        DAY2_ID,
        [
          keep(ASA),
          keep(BUN),
          { id: KOKA, data: { memo: memos[KOKA], stayDurationMin: 40 } },
          make(LUNCH, 11, 47, 40, [{ mode: "walk", min: 3 }]),
          { id: HARI, data: { memo: memos[HARI], transitLegs: { deleteMany: {}, create: legsCreate([{ mode: "walk", min: 7 }]) } } },
          keep(YOHA),
          keep(BOCHI),
          { id: TACHI, data: { memo: memos[TACHI], visitTime: t(14, 43), transitLegs: { deleteMany: {}, create: legsCreate([{ mode: "taxi", min: 15 }]) } } },
          make(HACHIMAN, 16, 2, 30, [{ mode: "walk", min: 21 }]),
        ] as never,
        { tx, remove: [SANROKU] }
      );
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
