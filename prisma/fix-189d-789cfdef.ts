/**
 * #189 789cfdef の続き（しおりえ(制作補助2)）: 法務の確認で座標を直す
 *   ① 遊覧船の点を、宿の点（w132681165 大歩危峡まんなか、tourism=hotel）から、乗り場の OSM n3507936599「観光遊覧船」（man_made=pier、33.8858927,133.7604679）に変える
 *   ② 乗り場から妖怪街道（n13439217201）までは約610mなので、歩きを約9分にする（13:04〜13:31）。定福寺へは歩いて約9分戻り、車で約25分（あわせて約34分、着くのは14:05のまま）
 *   ③ ひの字渓谷は、英語名の viewpoint n6003737088 から、16m先の日本語名の n4063645196「ひの字渓谷」（33.908947,133.8187019）に変える
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-189d-789cfdef.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "789cfdef-1580-4fda-ada3-4bc8709e05a9";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type L = { mode: "walk" | "car"; min: number };
const PLAN: { name: string; lat?: number; lng?: number; h?: number; m?: number; stay?: number; legs?: L[]; from?: string; to?: string }[] = [
  { name: "大歩危峡観光遊覧船（昼食と遊覧）", lat: 33.8858927, lng: 133.7604679 },
  { name: "ひの字渓谷", lat: 33.908947, lng: 133.8187019 },
  { name: "山城大歩危妖怪村（妖怪街道）", h: 13, m: 4, stay: 27, legs: [{ mode: "walk", min: 9 }], from: "遊覧船の乗り場から歩いて約6分。", to: "遊覧船の乗り場から歩いて約9分。" },
  { name: "定福寺", h: 14, m: 5, stay: 60, legs: [{ mode: "walk", min: 9 }, { mode: "car", min: 25 }], from: "車で約28分（あわせて約34分）", to: "車で約25分（あわせて約34分）" },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });
  const ops = PLAN.map((p) => {
    const s = spots.filter((x) => x.name === p.name);
    if (s.length !== 1) throw new Error(`${p.name} ${s.length}件`);
    let memo = s[0].memo ?? "";
    if (p.from) {
      if (memo.split(p.from).length !== 2) throw new Error(`${p.name}: 直す文が見つからない`);
      memo = memo.replace(p.from, p.to!);
    }
    const data: Record<string, unknown> = { memo };
    if (p.lat) Object.assign(data, { lat: p.lat, lng: p.lng });
    if (p.h !== undefined) Object.assign(data, { visitTime: t(p.h, p.m!), stayDurationMin: p.stay, transitLegs: { deleteMany: {}, create: p.legs!.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: null })) } });
    console.log(`${p.name}: ${p.lat ? `座標 ${s[0].lat},${s[0].lng} → ${p.lat},${p.lng} ` : ""}${p.h !== undefined ? `${p.h}:${String(p.m).padStart(2, "0")} 滞在${p.stay}分 ${p.legs!.map((l) => l.mode + l.min).join("+")}` : ""}`);
    return { id: s[0].id, data };
  });
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const o of ops) await tx.spot.update({ where: { id: o.id }, data: o.data });
  });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
