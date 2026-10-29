/**
 * 初日・最終日の見直し #133 15c4b54a「宿坊に泊まり精進料理と朝の勤行を体験する、高野山1泊2日修行の旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま。2日目の奥の院 6:00 は朝の勤行の例外）
 * いまの初日（8か所）: 大門 9:00 → 女人堂 → 徳川家霊台 → 壇上伽藍 → 金剛峯寺 →（昼食）→ 高野山霊宝館 → 金剛三昧院 → 苅萱堂 15:45〜16:30
 * 直した初日（6か所）: ケーブルカーの高野山駅に11時ごろ → バスで大門 11:20 → 徳川家霊台 → 壇上伽藍 →（昼食）→ 金剛峯寺 → 高野山霊宝館 → 金剛三昧院 16:08〜16:38 → 宿坊
 *   入口と1か所目（企画運営 10/29）: 高野山駅から南海りんかんバスで大門まで約16分（rurubu.jp/andmore/spot/80032274）。
 *     2024年8月から高野山駅前〜女人堂のバス専用道が通れず、バスは大門まわりで、女人堂には止まらない（town.koya.wakayama.jp/kurashi/information/31722.html）
 *   女人堂・苅萱堂は外す（2日目は今のままで入れる時間がない。タイトル・説明文に出てこない。写真なし。苅萱の物語は2日目の学文路苅萱堂にある）
 *   大門→徳川家霊台は、道のりで約1.9km（OSRM）なので歩いて約25分
 *   昼食: 壇上伽藍のあと（13:25〜。歩いて10分の金剛峯寺までのあいだ）。もとは金剛峯寺のあとに「途中で腹ごしらえ」だった
 *   閉まる時刻（決まり7）: 高野山霊宝館 通年 9:00〜17:00・入館は30分前まで（reihokan.or.jp/riyo/）→ 15:18 に着く。
 *     金剛三昧院 8:00〜17:00（navitime.co.jp/category/07/30344/）→ 16:38 に出る
 *   移動の時間は延ばさず、滞在を短くした（大門 30→20分、徳川家霊台 30→20分、壇上伽藍 80→50分、金剛峯寺 70→50分、霊宝館 60→40分、金剛三昧院 40→30分）
 * 説明文・タイトルは変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-133-15c4b54a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "15c4b54a-4550-4e04-aff3-eed3074bffa0";
const DAY1_ID = "22de0c23-255b-4488-a0e9-723d476e7c69";
const DAIMON = "3696ac46-7602-44bb-90d8-e82d34a9c631";
const NYONIN = "ae02b3ed-418a-4304-818e-7afcab1f8855";
const TOKUGAWA = "16b176f5-117c-4fce-9f2f-480a187f53c7";
const GARAN = "6425a765-df8b-4124-aadc-8447c1038631";
const KONGOBU = "3cc20d63-84c8-44c6-b249-f37e733b0d39";
const REIHOKAN = "d50d486d-874a-42f4-a58a-a17acfdc1f29";
const SANMAI = "572ab4d2-6663-47a3-b828-70ccecbf182d";
const KARUKAYA = "17440323-7a37-4743-b495-08281d33bf02";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [DAIMON]: [
    {
      from: "高野山の玄関口、大門から旅を始めましょう。",
      to: "この旅はバスと歩きでめぐります。ケーブルカーの高野山駅に11時ごろ着いたら、路線バスで約16分の「大門」で降り、高野山の西の玄関口・大門から旅を始めます。バスの時刻は公式の案内で確かめましょう。",
    },
    { from: "門をくぐったら、歩いて女人堂へ向かいましょう。", to: "この後は、歩いておよそ25分、徳川家霊台へ向かいましょう。" },
  ],
  [GARAN]: [{ from: "参拝のあとは、高野山真言宗の総本山、金剛峯寺へ向かいましょう。", to: "参拝のあとは、近くで昼食にしてから、高野山真言宗の総本山、金剛峯寺へ向かいましょう。" }],
  [KONGOBU]: [{ from: "参拝を終えたら、途中で腹ごしらえをしながら、歩いて高野山霊宝館へ向かいましょう。", to: "参拝を終えたら、歩いて高野山霊宝館へ向かいましょう。" }],
  [SANMAI]: [{ from: "参拝を終えたら、歩いて苅萱堂へ向かいましょう。", to: "この夜は、山内の宿坊に泊まりましょう。精進料理をいただき、宿坊によっては翌朝の勤行に参加できます。" }],
  // 法務 10/29: 家康・秀忠をまつる霊屋なので、お墓の一文（手を合わせは使わない）
  [TOKUGAWA]: [{ from: "参拝を終えたら、歩いて壇上伽藍へ向かいましょう。", to: "霊台のまわりでは、静かに過ごしましょう。この後は、歩いて壇上伽藍へ向かいましょう。" }],
};

// 座標（決まり7章）。金剛峯寺は OSM way 1363855538（amenity=place_of_worship）。
// 壇上伽藍は境内全体の地物がないので、本文で「シンボル」とされる根本大塔の建物 OSM way 393585969（企画運営 10/29 OK）。
// 2日目の奥の院は OSM node 4874774415「奥之院」（tourism=attraction。landuse の中心は使わない。企画運営 10/29 OK）
const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: KONGOBU, from: [34.2128, 135.585], to: [34.213882, 135.583687] },
  { id: GARAN, from: [34.2144, 135.5828], to: [34.213437, 135.579962] },
  { id: "369b3f67-f0fc-4deb-bdf0-7b7a56241906", from: [34.2128, 135.5892], to: [34.217343, 135.60383] },
];

// 壇上伽藍 13:25 に出て、近くで昼食（約45分）、歩いて10分で金剛峯寺 14:20
const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[]; gap?: number }[] = [
  { id: DAIMON, h: 11, m: 20, stay: 20, legs: [] },
  { id: TOKUGAWA, h: 12, m: 5, stay: 20, legs: [walk(25)] },
  { id: GARAN, h: 12, m: 35, stay: 50, legs: [walk(10)] },
  { id: KONGOBU, h: 14, m: 20, stay: 50, legs: [walk(10)], gap: 45 },
  { id: REIHOKAN, h: 15, m: 18, stay: 40, legs: [walk(8)] },
  { id: SANMAI, h: 16, m: 8, stay: 30, legs: [walk(10)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [DAIMON, NYONIN, TOKUGAWA, GARAN, KONGOBU, REIHOKAN, SANMAI, KARUKAYA].join()) throw new Error("1日目の構成が想定と違います");
  for (const s of d1.spots.filter((x) => x.id === NYONIN || x.id === KARUKAYA)) if (s.photos.length) throw new Error(`外すスポットに写真があります: ${s.name}`);
  const memoOf = (id: string) => {
    let m = d1.spots.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id] ?? []) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: memoOf(p.id) } : {}) } }));
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0) + (p.gap ?? 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${p.gap ? `（その前に昼食${p.gap}分）` : ""}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  const allSpots = it.days.flatMap((d) => d.spots);
  for (const c of COORDS) {
    const s = allSpots.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  console.log(`\n外すスポット: ${NYONIN}（女人堂）・${KARUKAYA}（苅萱堂）`);
  console.log(`\n説明文は変えない: ${it.description}`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [NYONIN, KARUKAYA] });
      for (const c of COORDS) await tx.spot.update({ where: { id: c.id }, data: { lat: c.to[0], lng: c.to[1] } });
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
