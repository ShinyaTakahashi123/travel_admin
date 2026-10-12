/**
 * チェックリスト #292 の修正記録(見直し6、企画運営の指摘: Day2の窓)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * Day2の終了(16:05)が決まり2に届いていなかった。企画運営の指示どおり、
 * 中央高原の中で探すのではなく、帰り道にある実在の行き先を追加した。
 * 霞城公園(山形城跡、山形市)を、上湯・川原湯共同浴場のあとに追加。
 *
 * 事実確認(直接開いたURL):
 * https://www.city.yamagata-yamagata.lg.jp/kurashi/koen/1006541/1006545/1015528.html
 * (山形市公式。面積35.9ha、延文元年[1356]斯波兼頼が築城、11代城主・最上義光が
 * 整えた輪郭式の縄張りが原型、二ノ丸東大手門・本丸一文字門、開園時間は
 * 4-10月5:00-22:00・11-3月5:30-22:00で年中無休[閉まる時刻の心配なし])
 *
 * 座標はOSM Nominatim(霞城公園、leisure=park)で確認。
 *
 * 帰りの一言は、共同浴場から霞城公園(新しい旅の最後)へ移した。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292n-44c030d6.ts
 * (実行済み。霞城公園の有無で確認するため、再実行しても安全)
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

  if (day2.spots.some((s) => s.name === "霞城公園")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const onsen = day2.spots.find((s) => s.name === "蔵王温泉大露天風呂")!;
  const chuoRopeway = day2.spots.find((s) => s.name === "蔵王中央ロープウェイ")!;
  const tenbodai = day2.spots.find((s) => s.name === "鳥兜山展望台")!;
  const dokko = day2.spots.find((s) => s.name === "どっこ沼")!;
  const katakai = day2.spots.find((s) => s.name === "片貝沼")!;
  const chuoKogen = day2.spots.find((s) => s.name === "蔵王中央高原駅")!;
  const kyodo = day2.spots.find((s) => s.name === "上湯・川原湯共同浴場")!;

  const kaeriLine = "湯めぐりを終えたら、車や公共交通で山形市街・山形空港方面へ戻りましょう。";
  const shimekukuriLine = "蔵王の火山の絶景と温泉街をめぐった1泊2日を、ここで締めくくりましょう。";
  const kyodoMemoClean = kyodo
    .memo!.replace(" " + kaeriLine, "")
    .replace(kaeriLine, "")
    .replace(shimekukuriLine, "");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day2.id,
      [
        { id: onsen.id, data: {} },
        { id: chuoRopeway.id, data: {} },
        { id: tenbodai.id, data: {} },
        { id: dokko.id, data: {} },
        { id: katakai.id, data: {} },
        { id: chuoKogen.id, data: {} },
        { id: kyodo.id, data: { memo: kyodoMemoClean } },
        {
          create: {
            name: "霞城公園",
            address: "山形市霞城町",
            lat: 38.2555771,
            lng: 140.3282413,
            visitTime: new Date(Date.UTC(1970, 0, 1, 16, 25)),
            stayDurationMin: 30,
            transitMode: "car",
            transitDurationMin: 20,
            memo:
              "上湯・川原湯共同浴場からは、山形市街へ向かう帰り道の途中、車で20分ほどです。霞城公園は、山形城の本丸・二の丸跡を整備した、国指定史跡の公園です。延文元年(1356)、最上家の初代・斯波兼頼が築いたのが始まりと伝えられ、現在の輪郭式の縄張りは、11代城主・最上義光が整えたものが原型とされています。園内には、復元された二ノ丸東大手門や、最上義光の騎馬像があります。蔵王の火山の絶景と温泉街をめぐった1泊2日を、山形城下の歴史に触れながら締めくくりましょう。 見学を終えたら、車で山形市街・山形空港方面へ戻りましょう。",
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
