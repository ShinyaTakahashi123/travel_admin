/**
 * 台帳の一括登録(2026-10-12, register-place-master.cjs --commit --no-photos --no-memorial)で
 * 「刈田嶺神社」の2つの分割候補(要確認14件のうちの1件)が、まとめ方の表示名
 * (「刈田嶺神社（宮城県刈田郡蔵王町）」)が偶然一致してしまい、2件目が「既存」として
 * スキップされ、そのスポット(刈田岳山頂側, id a3eb5373-...)が台帳に紐付かなかった。
 * この1件だけを、名前を変えて作り直す(ほかの3,476件には触れない)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const SPOT_ID = "a3eb5373-d02e-45c1-834e-5c010d9f71fb";
const NEW_NAME = "刈田嶺神社（刈田岳山頂）";
const DATA = {
  address: "宮城県刈田郡蔵王町刈田岳山頂",
  lat: 38.127749,
  lng: 140.448198,
  prefecture: "宮城県",
  category: "shrine",
  isWideArea: false,
  isMemorial: false,
  stayDurationMin: 45,
  websiteUrl: null as string | null,
  aliases: ["奥宮"],
};

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID }, select: { id: true, name: true, placeMasterId: true } });
  if (!spot) throw new Error("スポットが見つかりません: " + SPOT_ID);
  if (spot.placeMasterId !== null) throw new Error("すでに台帳に紐付いています: " + spot.placeMasterId);

  const existing = await prisma.placeMaster.findFirst({ where: { name: NEW_NAME } });
  if (existing) throw new Error("新しい名前がすでに使われています: " + NEW_NAME);

  const pref = await prisma.area.findFirst({ where: { level: "prefecture", name: DATA.prefecture }, select: { id: true } });
  if (!pref) throw new Error("都道府県が見つかりません: " + DATA.prefecture);

  console.log(`[確認OK] スポット「${spot.name}」(${SPOT_ID}) を新しい台帳「${NEW_NAME}」に紐付けます`);

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const place = await prisma.placeMaster.create({
    data: {
      name: NEW_NAME,
      address: DATA.address,
      lat: DATA.lat,
      lng: DATA.lng,
      prefectureAreaId: pref.id,
      category: DATA.category,
      isWideArea: DATA.isWideArea,
      isMemorial: DATA.isMemorial,
      stayDurationMin: DATA.stayDurationMin,
      websiteUrl: DATA.websiteUrl,
      source: "ai_collected",
      positionSource: null,
      verifiedAt: null,
    },
  });
  await prisma.placeMasterAlias.createMany({
    data: DATA.aliases.map((alias) => ({ placeMasterId: place.id, alias })),
  });
  await prisma.spot.update({ where: { id: SPOT_ID }, data: { placeMasterId: place.id } });
  console.log(`COMMITTED: place_master ${place.id} を作成し、スポット ${SPOT_ID} を紐付けました`);
}
main().finally(() => prisma.$disconnect());
