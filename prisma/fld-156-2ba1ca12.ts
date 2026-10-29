/**
 * 初日・最終日の見直し #156 2ba1ca12「北方文化博物館と新潟古町、豪農の館と花街情緒をめぐる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。初日に昼食の行がなかったので足す。2日目は歩きの時間が道のりと合っていなかったので直す（終わりは今と同じ）
 * いまの初日（6か所・昼食なし）: 北方文化博物館 9:00 → 新津鉄道資料館 → 古津八幡山遺跡 → 新津美術館 → 新潟県立植物園 → 石油の世界館 15:33〜16:33
 * 直した初日（6か所）: JR新潟駅に11時ごろ → 駅の近くでレンタカー（手続きに15分ほど）→ 車で約20分（OSRM 14分＋駐車）→
 *   北方文化博物館 11:35 → 新津鉄道資料館 → 新津駅のまわり（昼食 13:30〜。足す）→ 古津八幡山遺跡 → 新潟県立植物園 → 石油の世界館 16:10〜16:35
 *   新津美術館を外す（11時からでは時間が足りず、昼食を入れるため。カフェは約10.5㎡と小さく昼食の場所にしにくい city.niigata.lg.jp の公募資料）
 *   閉まる時刻: 植物園の観賞温室 入館16:00まで（15:20 に着く。museum.or.jp/museum/3027）、石油の世界館 入館16:30まで（16:10 に着く。niigata-kankou.or.jp/spot/5613）
 *   車（OSRM＋駐車5分）: 北方→鉄道 6分（10のまま）、鉄道→新津駅 5分→10、新津駅→古津 9分→15、古津→植物園 4分→10、植物園→石油 5分→10（4→10）
 *   滞在はどれも、もとより短い（北方 90→55、鉄道 60→40、古津 60→40、植物園 90→40、石油 60→25）
 *   石油の世界館の「確かめてください」「ご宿泊ください」を直し、宿は2日目の始まり（新潟市の中心部・白山神社）に合わせる
 * 2日目（終わりは今と同じ）: 歩き（routing.openstreetmap.de の foot）白山神社→古町（鍋茶屋）1,355m・19分（13→19）、古町→旧齋藤家別邸 722m・10分（8→10）、
 *   旧齋藤家別邸→砂丘館 468m・7分（5→7）、砂丘館→新潟市美術館 969m・13分（6→13）。古町の滞在 90→80分、美術館 85→78分で合わせ、萬代橋 14:53 からはもとのまま
 *   2日目の昼食（企画運営・法務 10/30）: 古町（9:54〜）の「お昼ごはんを兼ねて」を外し、旧齋藤家別邸（11:24〜）の書き出しに「このあたりで昼食」（OSM: 福竜軒 約180m、そば処 新ばし 約260m）。
 *   古町のメモから、今も営業している料亭の名前（「新潟に鍋茶屋あり」）を外す（法務）。点は鍋茶屋の way のまま
 * 座標（itinerary-rules 7章）: 北方文化博物館 way 744674936／新津鉄道資料館 way 449619613（いまは約70m東）／
 *   古津八幡山遺跡 node 2455664500（いまは約600m北の「古津」の地名の点）／白山神社 way 352707752「新潟総鎮守 白山神社」／
 *   古町 → メモにある老舗料亭 way 418238075「鍋茶屋」（いまは古町通六番町の通りの点）／旧齋藤家別邸 way 351038885／砂丘館 way 417570738／
 *   新潟市美術館 way 420436751（いまは隣の西大畑公園の中心）／萬代橋 way 49238701（いまは約400m東の「万代一丁目」の地名の点）／
 *   みなとぴあ way 351085666「歴史博物館本館」（敷地の way は公園なので使わない）／新津駅（昼食）way 406762114「新津駅」
 *   植物園・石油の世界館は OSM に名前のある点がなく（植物園は公園の面だけ）、国土地理院の番地のまま
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-156-2ba1ca12.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "2ba1ca12-3f17-43db-bc93-28771cf32be8";
const DAY1_ID = "e4836137-5604-47bb-9d45-939f46950be4";
const HOPPO = "84232034-cb1f-4da4-9740-5622024a921e";
const TETSUDO = "f9c8e404-7505-47cd-9ccf-3fa212ccefd9";
const FURUTSU = "332c4259-5cf5-432f-9758-21daa47eac6c";
const NIITSU_ART = "bb5190f6-111a-456c-b10f-c3c679e917ee";
const GARDEN = "f4fe31d7-bd67-489d-ac42-6c1bbb568bff";
const SEKIYU = "b07324dd-f1f2-4fe5-9853-b3346ba0dfdf";
const HAKUSAN = "6746a0fa-5aef-4edb-96f4-d6c578a87b71";
const FURUMACHI = "f9a92919-bffc-4ad5-86b9-f362e76168b6";
const SAITO = "7884ab28-8c1b-49c8-94a7-5d7eb1de39bb";
const SAKYU = "85da8e46-a567-4e78-868d-0daedb3d9658";
const NIIGATA_ART = "61e94bd4-efed-494b-86e9-79a49aa755fd";
const BANDAI = "fcf545c3-9d59-4810-b4e1-2eb277963791";
const MINATOPIA = "b75d4803-f95b-4b51-8563-aa3161021a63";
const ORIG_ORDER = [HOPPO, TETSUDO, FURUTSU, NIITSU_ART, GARDEN, SEKIYU];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const LUNCH = {
  name: "新津駅のまわり（昼食）",
  lat: 37.799933,
  lng: 139.120406,
  address: "新潟県新潟市秋葉区新津本町",
  memo: "新津鉄道資料館から車で約10分。新津駅のまわりで昼食にしましょう。",
  h: 13,
  m: 30,
  stay: 45,
  legs: [car(10)],
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [HOPPO]: [
    {
      from: "本日は、越後を代表する大地主・伊藤家の邸宅を公開する「豪農の館」、北方文化博物館からスタートです。",
      to: "この旅は車でめぐります。JR新潟駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約20分。越後を代表する大地主・伊藤家の邸宅を公開する「豪農の館」、北方文化博物館が旅の始まりです。",
    },
  ],
  [TETSUDO]: [{ from: "見学を終えたら、車で古津八幡山遺跡へ向かいましょう。", to: "見学を終えたら、車で新津駅へ向かいましょう。" }],
  [FURUTSU]: [
    { from: "新津鉄道資料館を見学したら、車で古津八幡山遺跡へ向かいましょう。", to: "昼食のあとは、新津駅から車で約15分、古津八幡山遺跡へ向かいましょう。" },
    { from: "見学を終えたら、車で新津美術館へ向かいましょう。", to: "見学を終えたら、車で新潟県立植物園へ向かいましょう。" },
  ],
  [GARDEN]: [{ from: "新津美術館を見学したら、車で新潟県立植物園へ向かいましょう。", to: "古津八幡山遺跡を見学したら、車で新潟県立植物園へ向かいましょう。" }],
  [SEKIYU]: [
    { from: "定休日など詳しくは公式サイトで確かめてください。", to: "定休日など詳しくは公式サイトで確かめましょう。" },
    { from: "今夜はこの近くの宿にご宿泊ください。", to: "この夜は、車で約25分の新潟市の中心部の宿に泊まりましょう。" },
  ],
};
const DAY2_MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [FURUMACHI]: [
    {
      from: "中でも弘化3年(1846)創業の老舗料亭は、文人や政財界の著名人からも愛され、「新潟に鍋茶屋あり」とうたわれるほどの存在感を放ってきました。",
      to: "中には、弘化3年(1846)創業で、文人や政財界の著名人からも愛されてきた老舗料亭もあります。",
    },
    {
      from: "通り沿いには、新潟の郷土料理を味わえるお店も点在しているので、お昼ごはんを兼ねて、老舗の味を楽しみながらそぞろ歩きましょう。",
      to: "通り沿いには、新潟の郷土料理を味わえるお店も点在しています。町並みを眺めながら、そぞろ歩きましょう。",
    },
  ],
  [SAITO]: [{ from: "古町を散策したら、歩いて旧齋藤家別邸へ向かいましょう。", to: "古町を散策したら、歩いて旧齋藤家別邸へ向かいましょう。着いたら、まずこのあたりで昼食にしましょう。" }],
};
const DAY2_TIMES: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: FURUMACHI, h: 9, m: 54, stay: 80, legs: [walk(19)] },
  { id: SAITO, h: 11, m: 24, stay: 60, legs: [walk(10)] },
  { id: SAKYU, h: 12, m: 31, stay: 45, legs: [walk(7)] },
  { id: NIIGATA_ART, h: 13, m: 29, stay: 78, legs: [walk(13)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: HOPPO, from: [37.829617, 139.152147], to: [37.829538, 139.152068] },
  { id: TETSUDO, from: [37.802372, 139.141739], to: [37.801767, 139.141835] },
  { id: FURUTSU, from: [37.769344, 139.110336], to: [37.764256, 139.114994] },
  { id: HAKUSAN, from: [37.915577, 139.037735], to: [37.915499, 139.037671] },
  { id: FURUMACHI, from: [37.921053, 139.045062], to: [37.924021, 139.046183] },
  { id: SAITO, from: [37.926456, 139.040268], to: [37.926187, 139.040256] },
  { id: SAKYU, from: [37.925949, 139.036423], to: [37.925675, 139.036384] },
  { id: NIIGATA_ART, from: [37.927345, 139.041382], to: [37.928441, 139.042058] },
  { id: BANDAI, from: [37.916508, 139.056747], to: [37.919579, 139.053138] },
  { id: MINATOPIA, from: [37.930187, 139.057632], to: [37.929819, 139.057797] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: HOPPO, h: 11, m: 35, stay: 55, legs: [] },
  { id: TETSUDO, h: 12, m: 40, stay: 40, legs: [car(10)] },
  { id: "LUNCH", h: LUNCH.h, m: LUNCH.m, stay: LUNCH.stay, legs: LUNCH.legs },
  { id: FURUTSU, h: 14, m: 30, stay: 40, legs: [car(15)] },
  { id: GARDEN, h: 15, m: 20, stay: 40, legs: [car(10)] },
  { id: SEKIYU, h: 16, m: 10, stay: 25, legs: [car(10)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== ORIG_ORDER.join()) throw new Error("1日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const DAY1 = PLAN.map((p) =>
    p.id === "LUNCH"
      ? { create: { name: LUNCH.name, visitTime: t(LUNCH.h, LUNCH.m), stayDurationMin: LUNCH.stay, transitLegs: { create: legsCreate(LUNCH.legs) }, lat: LUNCH.lat, lng: LUNCH.lng, address: LUNCH.address, memo: LUNCH.memo } }
      : { id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }
  );
  const art = d1.spots.find((s) => s.id === NIITSU_ART)!;
  console.log(`\n外す: ${art.name}（写真 ${art.photos.length} 枚も消える）`);
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id);
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s ? `${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）` : `${LUNCH.name}（新しく足す）: ${LUNCH.memo}`}`);
    if (MEMO_EDITS[p.id]) for (const e of MEMO_EDITS[p.id]) console.log(`  → ${e.to}`);
    prevEnd = st + p.stay;
  }
  // 2日目: 白山神社 9:00〜9:35 → 古町 9:54 → 旧齋藤家別邸 11:24 → 砂丘館 12:31 → 新潟市美術館 13:29〜14:47 → 車6 → 萬代橋 14:53（もとのまま）
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const hak = d2.spots.find((s) => s.id === HAKUSAN);
  const ban = d2.spots.find((s) => s.id === BANDAI);
  if (!hak || hmOf(hak.visitTime) !== "09:00" || hak.stayDurationMin !== 35 || !ban || hmOf(ban.visitTime) !== "14:53") throw new Error("2日目の構成が想定と違います");
  console.log("\n2日目:");
  let pe = 9 * 60 + 35;
  for (const p of DAY2_TIMES) {
    const st = p.h * 60 + p.m;
    const s = d2.spots.find((x) => x.id === p.id)!;
    console.log(`  ${hm(st)}-${hm(st + p.stay)} walk${p.legs[0].min} (前から${st - pe}分${st - pe !== p.legs[0].min ? " ⚠" : ""}) ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
    pe = st + p.stay;
  }
  console.log(`  → car6 (前から${14 * 60 + 53 - pe}分) 萬代橋 14:53（もとのまま）`);
  for (const [id, edits] of Object.entries(DAY2_MEMO_EDITS)) console.log(`  2日目 ${all.find((s) => s.id === id)?.name}: ${apply(id, edits)}`);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [NIITSU_ART] });
      for (const p of DAY2_TIMES) await tx.spot.update({ where: { id: p.id }, data: timeLegs(p.h, p.m, p.stay, p.legs) });
      for (const [id, edits] of Object.entries(DAY2_MEMO_EDITS)) await tx.spot.update({ where: { id }, data: { memo: apply(id, edits) } });
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
