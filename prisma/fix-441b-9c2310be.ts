/**
 * #441 9c2310be の追いの修正（しおりえ(制作補助2)、監査の「言い切り?」「近いのにcar10分」への対応）
 *   - 長屋「最大の規模を誇り」・口羽家住宅「最大規模の長屋門」・反射炉「萩のほか…にしかない」・恵美須ヶ鼻「萩藩で最初の」を「とされる」でぼかす
 *   - 堀内・平安古「全国で最初の重伝建に選ばれ」→ 公式どおり「制度が始まった昭和51年に…選ばれ」
 *   - 反射炉→恵美須ヶ鼻（0.6km）・明神池→笠山山頂（0.7km、坂の上の山頂へ）は車5分に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-441b-9c2310be.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "9c2310be-66b4-4b74-a67f-481c454404a5";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

type Fix = { day: number; name: string; reps: [string, string][]; extra?: Record<string, unknown> };
const fixes: Fix[] = [
  { day: 1, name: "旧厚狭毛利家萩屋敷長屋", reps: [["萩に残る武家屋敷の中で最大の規模を誇り、", "萩に残る武家屋敷の中で最大の規模とされ、"]] },
  { day: 1, name: "堀内の武家屋敷町", reps: [["昭和51年（1976年）、平安古とともに、全国で最初の重要伝統的建造物群保存地区に選ばれました。", "国の重要伝統的建造物群保存地区の制度が始まった昭和51年（1976年）に、平安古とともに選ばれています。"]] },
  { day: 1, name: "口羽家住宅", reps: [["萩に残る門の中で最大規模の長屋門で、", "萩に残る門の中で最大規模とされる長屋門で、"]] },
  { day: 1, name: "平安古の武家屋敷町", reps: [["堀内とともに、全国で最初の重要伝統的建造物群保存地区に選ばれた町並みです。", "昭和51年（1976年）、堀内とともに国の重要伝統的建造物群保存地区に選ばれた町並みです。"]] },
  { day: 2, name: "萩反射炉", reps: [["韮山（静岡県）と旧集成館（鹿児島県）にしかない貴重なもので、", "韮山（静岡県）と旧集成館（鹿児島県）にしかないとされる貴重なもので、"]] },
  { day: 2, name: "恵美須ヶ鼻造船所跡", reps: [["反射炉から車で、", "反射炉から車ですぐの"], ["萩藩で最初の西洋式木造帆船", "萩藩で最初とされる西洋式木造帆船"]], extra: { visitTime: t(9, 30), transitDurationMin: 5, stayDurationMin: 35 } },
  { day: 2, name: "笠山", reps: [], extra: { visitTime: t(10, 50), transitDurationMin: 5, stayDurationMin: 70 } },
];

async function main() {
  const plans: { id: string; day: number; data: Record<string, unknown> }[] = [];
  for (const f of fixes) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: f.day, spotName: f.name });
    let memo = s.memo ?? "";
    for (const [from, to] of f.reps) {
      if (!memo.includes(from)) throw new Error(`${f.name}: 本文が想定と違います: ${from}`);
      memo = memo.replace(from, to);
    }
    const data: Record<string, unknown> = { ...(f.reps.length ? { memo } : {}), ...(f.extra ?? {}) };
    plans.push({ id: s.id, day: f.day, data });
    console.log(`D${f.day} ${f.name}: ${f.reps.length ? memo : ""} ${f.extra ? JSON.stringify(f.extra) : ""}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plans) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: p.day, spotId: p.id }, p.data, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
