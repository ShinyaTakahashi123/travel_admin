/**
 * チェックリスト #292 の修正記録(見直し)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * 本番でDay2が4か所・14:07終了と、決まり2(16:30〜17:00)に届いていなかった。
 * ユーザーの方針(「近くに実在の行き先が足りない」は例外にしない)にもとづき、
 * 実在するスポットを2件追加(どっこ沼の75分は変えず、水増しはしていない):
 *
 * 鳥兜山展望台(新規、蔵王中央ロープウェイ鳥兜駅からすぐ。山形市・上山市方面を
 * 一望、晴天時は月山も)・片貝沼(新規、OSM Nominatimで座標確認。ブナ林に囲まれた
 * 沼、固有種ザオウアザミの群生地)を追加。
 * 出典(直接開いたURL): https://zaochuoropeway.co.jp/jp/summer/sansaku.php
 * (蔵王中央ロープウェイ運営会社公式。「鳥兜山展望台」「片貝沼」の記載を確認)
 *
 * どっこ沼・上湯共同浴場の書き出し(「蔵王中央ロープウェイからは」「どっこ沼からは」)
 * も、新しい並びにあわせて修正。
 *
 * 結果、Day2は6か所09:30〜16:39(窓内)。
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292-44c030d6.ts
 * (実行済み。鳥兜山展望台の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day2 = itin.days[1];

  if (day2.spots.some((s) => s.name === "鳥兜山展望台")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const onsen = day2.spots.find((s) => s.name === "蔵王温泉大露天風呂")!;
  const ropeway = day2.spots.find((s) => s.name === "蔵王中央ロープウェイ")!;
  const dokko = day2.spots.find((s) => s.name === "どっこ沼")!;
  const kyodo = day2.spots.find((s) => s.name === "上湯・川原湯共同浴場")!;

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day2.id,
      [
        { id: onsen.id, data: {} },
        { id: ropeway.id, data: {} },
        {
          create: {
            name: "鳥兜山展望台",
            address: "山形市蔵王温泉",
            lat: 38.164078,
            lng: 140.393845,
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 14)),
            stayDurationMin: 40,
            transitMode: "walk",
            transitDurationMin: 2,
            memo:
              "蔵王中央ロープウェイの鳥兜駅からすぐです。鳥兜山展望台は、山形市街や上山市方面を見渡すことができる展望台です。空気の澄んだ日には、月山を望むこともできます。蔵王の山々に抱かれた眺めを、ゆっくりと楽しみましょう。",
          },
        },
        {
          id: dokko.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 19)),
            memo: dokko.memo!.replace(
              "蔵王中央ロープウェイからは、リフトと徒歩をあわせて25分ほどです。",
              "鳥兜山展望台からは、リフトと徒歩をあわせて25分ほどです。"
            ),
          },
        },
        {
          create: {
            name: "片貝沼",
            address: "山形市蔵王温泉",
            lat: 38.1606242,
            lng: 140.4233101,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 54)),
            stayDurationMin: 90,
            transitMode: "other",
            transitDurationMin: 20,
            memo:
              "どっこ沼からは、リフトと徒歩をあわせて20分ほどです。片貝沼は、深いブナ林に囲まれた、詩情ある風景が印象的な沼です。蔵王山系の固有種であるザオウアザミの群生地としても知られています。静かな沼のほとりを、のんびりと歩いてみましょう。",
          },
        },
        {
          id: kyodo.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 54)),
            memo: kyodo.memo!.replace(
              "どっこ沼からは、リフトと徒歩をあわせて30分ほどです。",
              "片貝沼からは、リフトと徒歩をあわせて30分ほどです。"
            ),
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day2.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
