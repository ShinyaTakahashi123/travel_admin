/**
 * #355の続き。企画運営の指摘3点に対応。
 * 1. 移動手段をレンタカーに統一(出雲市駅で借りて出雲市駅で返す)。タクシーだった
 *    旧大社駅→灯台の区間を車に、最後の結びをバスから「車で出雲市駅へ戻り返却」に変更。
 *    出雲弥生の森博物館の書き出しにも「レンタカーを借り」を追加。
 * 2. 出雲大社の本殿の高さの文と1744年/国宝の文を1文にまとめ、#50との重複をさらに解消。
 * 3. 出雲弥生の森博物館「四隅突出型墳丘墓(よすみ)」の読みがなを
 *    「(よすみとっしゅつがたふんきゅうぼ)」に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-355f-bb5348fc.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bb5348fc-c7db-472c-82fc-5ddb3db3253b";

async function main() {
  const yayoi = await prisma.spot.findFirstOrThrow({ where: { name: "出雲弥生の森博物館", day: { itineraryId: ITIN_ID } } });
  const old1 = "出雲市駅から車でおよそ6分、出雲観光は出雲弥生の森博物館から始まります。国指定史跡「西谷墳墓群」に隣接する博物館で、弥生時代後期から終末期にかけて造られた、出雲地方特有の四隅突出型墳丘墓(よすみ)6基をはじめ、";
  const new1 = "出雲市駅の近くでレンタカーを借り、車でおよそ6分、出雲観光は出雲弥生の森博物館から始まります。国指定史跡「西谷墳墓群」に隣接する博物館で、弥生時代後期から終末期にかけて造られた、出雲地方特有の四隅突出型墳丘墓(よすみとっしゅつがたふんきゅうぼ)6基をはじめ、";
  if (!yayoi.memo?.includes(old1)) throw new Error("出雲弥生の森博物館: anchor not found");
  await updateSpotInItinerary(ITIN_ID, { spotId: yayoi.id }, { memo: yayoi.memo.replace(old1, new1) });

  const izumotaisha = await prisma.spot.findFirstOrThrow({ where: { name: "出雲大社", day: { itineraryId: ITIN_ID } } });
  const old2 = "大国主大神をお祀りするこの古社の御本殿は、地上からおよそ24mの高さを誇る、国内でも有数の規模を持つ神社建築です。現在の社殿は江戸時代の延享元年(1744)に建てられたもので、国宝に指定されています。";
  const new2 = "大国主大神をお祀りするこの古社の御本殿は、延享元年(1744)に建てられた現在の社殿で、地上からおよそ24mの高さを誇る、国内でも有数の規模を持つ神社建築として国宝に指定されています。";
  if (!izumotaisha.memo?.includes(old2)) throw new Error("出雲大社: anchor not found");
  await updateSpotInItinerary(ITIN_ID, { spotId: izumotaisha.id }, { memo: izumotaisha.memo.replace(old2, new2) });

  const toudai = await prisma.spot.findFirstOrThrow({ where: { name: "出雲日御碕灯台", day: { itineraryId: ITIN_ID } }, include: { transitLegs: true } });
  if (toudai.transitLegs[0]?.transitMode !== "car") {
    await updateSpotInItinerary(ITIN_ID, { spotId: toudai.id }, {
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 16 }] },
    });
  }

  const hinomisakijinja = await prisma.spot.findFirstOrThrow({ where: { name: "日御碕神社", day: { itineraryId: ITIN_ID } } });
  const old3 = "バスで出雲市駅・いずも縁結び空港方面へ戻り、縁結びの神様と古代出雲の歴史に触れた1日を振り返りましょう。";
  const new3 = "車で出雲市駅へ戻ってレンタカーを返却し、縁結びの神様と古代出雲の歴史に触れた1日を振り返りましょう。";
  if (hinomisakijinja.memo?.includes(old3)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: hinomisakijinja.id }, { memo: hinomisakijinja.memo.replace(old3, new3) });
  }

  console.log("#355: 移動手段をレンタカーに統一、出雲大社の文を1文に、四隅突出型墳丘墓の読みがなを修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
