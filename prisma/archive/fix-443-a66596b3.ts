/**
 * チェックリスト #443 a66596b3「鴨川シーワールドとシャチのパフォーマンス、家族で楽しむ房総日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 車の旅。鴨川シーワールド（既存、9:00開館）→（昼食）→ 誕生寺（新規）→ 仁右衛門島（新規）→ 大山千枚田（新規）（4か所 09:00〜16:35）
 * 既存本文は話し言葉で、開いた公式で確かめられない記述（送迎バスで約10分、昭和45年の開業、「気性の荒い動物」とされたシャチの飼育に挑戦、信頼関係の継承）があったので、公式の説明で書き直す
 * シーワールドの中は、公式で確かめられる展示とパフォーマンスの種類だけを書き、時刻・料金・期間限定の催しは書かない
 * 写真: 鴨川シーワールドの入口の写真（Volfgang、人の顔はぼかし済み）は合っているので残す
 * 本文の出典: 鴨川シーワールド https://www.kamogawa-seaworld.jp/ （営業時間 9:00〜）・/aquarium_charm/（展示テーマ、変更や中止）・/facilities/area/（施設）・/guide/program/orca/（オーシャンスタジアム）、
 *   鴨川市 https://www.city.kamogawa.lg.jp/site/kamogawa-kanko/999.html（誕生寺）・/850.html（仁右衛門島）・/816.html（大山千枚田）
 * 座標の出典: Nominatim（鴨川シーワールド 35.1160530,140.1205360／誕生寺 35.1181737,140.1987981／仁右衛門島 35.0771915,140.1041149／大山千枚田 35.1299603,139.9749635）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-443-a66596b3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "a66596b3-acab-4036-9ba8-f2d1e8ca2618";
const DAY1_ID = "ae358d95-bc3c-4575-b78d-82b907a9e80e";
const SEAWORLD = "140066e8-bd29-46fa-aa61-94b89d601bd3";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "太平洋を背にしたシャチのパフォーマンスで知られる鴨川シーワールドで午前をたっぷり過ごし、午後は日蓮聖人の生まれた地に建つ誕生寺、手こぎの渡し舟で渡る仁右衛門島、日本の棚田百選の大山千枚田へ。海と里山の房総を車でめぐる、家族で楽しめる日帰りプランです。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  {
    id: SEAWORLD,
    data: {
      visitTime: t(9, 0), stayDurationMin: 180, transitMode: null, transitDurationMin: null, transitLine: null, lat: 35.116053, lng: 140.120536,
      memo: "今日は車（レンタカーなど）でめぐります。旅の始まりは、朝から開いている鴨川シーワールドへ。「海の世界との出会い」をテーマに、自然環境を再現した生きものの展示とパフォーマンスが楽しめる水族館です。雄大な太平洋を背景にした「オーシャンスタジアム」では、シャチの豪快なジャンプや水しぶきに圧倒されます。ほかにも、イルカやベルーガ、アシカのパフォーマンス、川の源流から海までを再現した「エコアクアローム」、太平洋の自然環境を再現した「ロッキーワールド」など、見どころがたくさんあります。パフォーマンスの時間や内容は、天候や動物の状態で変わることがあるので、当日の案内で確かめましょう。このあと、鴨川のあたりで昼食にしましょう。",
    },
  },
  cre("誕生寺", 13, 15, 45, "car", 15, 35.118174, 140.198798, "千葉県鴨川市小湊183",
    "昼食のあとは、車で小湊の誕生寺へ。日蓮聖人が生まれた地に、建治2年（1276年）に建てられた寺です。明応7年と元禄16年の2度の大地震と津波で水没したこともあり、今の場所に移って堂が建て直されました。宝暦8年（1758年）の大火で多くの建物が焼けましたが、宝永3年（1706年）に建てられたと伝わる仁王門だけは焼け残り、県内でも最大規模の仁王門とされ、県の有形文化財に指定されています。境内に漂う線香の香りと海からの磯風の香りは、環境省の「かおり風景百選」にも選ばれています。" + RESPECT),
  cre("仁右衛門島", 14, 30, 60, "car", 30, 35.077192, 140.104115, "千葉県鴨川市太海浜445",
    "誕生寺から車で、太海の仁右衛門島へ。南房総の海に浮かぶ約3万㎡の島で、千葉県指定の名勝です。昔から島の持ち主の平野仁右衛門の家が一戸だけ住んでいることから、この名で呼ばれています。今も珍しい二丁櫓の手こぎの渡し舟に乗って島へ渡ります。源頼朝や日蓮聖人の伝説で知られ、島内には歌人たちが島の四季を詠んだ碑もあります。天気や海の状態によって渡し舟が出ない日もあるので、公式の案内で確かめましょう。舟の乗り降りや島の岩場では、足元に気をつけましょう。"),
  cre("大山千枚田", 15, 55, 40, "car", 25, 35.12996, 139.974964, "千葉県鴨川市釜沼",
    "旅の締めくくりは、房総半島のほぼ真ん中にある大山千枚田へ。東京から一番近い棚田として知られ、平成11年（1999年）に農林水産省の「日本の棚田百選」に選ばれました。千葉県指定名勝の「鴨川大山千枚田」と、まわりの里山や集落の姿は、自然と人々の営みが育んできた貴重な景観です。田んぼは地元の方々が大切に育てているものなので、あぜ道や田んぼには入らず、決められた場所から眺めましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== SEAWORLD) throw new Error("構成が想定と違います");

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? "鴨川シーワールド(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
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
