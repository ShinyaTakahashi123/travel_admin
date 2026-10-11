/**
 * #192 7c32856d の続き（しおりえ(制作補助2)）: 法務の確認で、昼食のスポット名と本文から商業施設の名前「西武秩父駅前温泉 祭の湯」を外す
 *   スポット名を「西武秩父駅前（昼食）」に、座標を OSM の西武秩父駅 n503873207（35.9902119,139.083122）にし、今宮坊の書き出しも「西武秩父駅前から」にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-192c-7c32856d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "7c32856d-87b9-465d-bd0c-8c3747032d79";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; newName?: string; lat?: number; lng?: number; from: string; to: string }[] = [
  {
    name: "西武秩父駅前温泉 祭の湯（昼食）",
    newName: "西武秩父駅前（昼食）",
    lat: 35.9902119,
    lng: 139.083122,
    from: "秩父の数多くのお祭りをテーマにした、西武秩父駅前の施設で、温泉のほか、食事やお土産の店がそろっています。ここで昼食にしましょう。",
    to: "駅前には、秩父のお祭りをテーマにした温泉や、食事・おみやげの店が集まる施設があるので、ここで昼食にしましょう。",
  },
  { name: "今宮坊（秩父札所14番）", from: "祭の湯から歩いて約15分。", to: "西武秩父駅前から歩いて約15分。" },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });
  const ops = PLAN.map((p) => {
    const s = spots.filter((x) => x.name === p.name);
    if (s.length !== 1) throw new Error(`${p.name} ${s.length}件`);
    const memo = s[0].memo ?? "";
    if (memo.split(p.from).length !== 2) throw new Error(`${p.name}: 直す文が見つからない`);
    const data: Record<string, unknown> = { memo: memo.replace(p.from, p.to) };
    if (p.newName) data.name = p.newName;
    if (p.lat) Object.assign(data, { lat: p.lat, lng: p.lng });
    console.log(`${p.name}${p.newName ? ` → ${p.newName}` : ""}${p.lat ? ` 座標 → ${p.lat},${p.lng}` : ""}:\n  ${data.memo}\n`);
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
