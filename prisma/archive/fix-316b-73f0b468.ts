/**
 * #316の続き(自己チェックの気づき)。
 * fix-316で以下を見落としていた:
 * 1. 瑞巌寺: 西行戻しの松公園から0.8kmしか離れていないのにcar10分に
 *    していた(近すぎる距離での車移動)。徒歩に変更。
 * 2. 観瀾亭: 五大堂から0.2kmを1分としていて速すぎた。3分に修正。
 * 3. 福浦橋が最後のスポットになったが、帰りの一言が無かった。
 * 4. 瑞巌寺・円通院・五大堂(いずれも寺社仏閣)に、配慮の一文が
 *    無かった(prayer-check.cjsで検出)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-316b-73f0b468.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "73f0b468-46de-471e-9d7c-4e24bf3e1b10";

async function main() {
  // 西行戻しの松公園: 車でめぐる旨の書き出しを、徒歩と車を使い分ける旨に修正
  const saigyo = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "西行戻しの松公園" },
  });
  const saigyoMemo = (saigyo.memo ?? "").replace(
    "この旅は、車でめぐります。",
    "この旅は、松島の中心部は歩いてめぐり、少し離れた松島湾遊覧船・福浦橋へは車で向かいます。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: saigyo.id }, { memo: saigyoMemo });

  // 瑞巌寺: 徒歩に変更・配慮の一文
  const zuiganji = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "瑞巌寺" },
  });
  let zuiganjiMemo = (zuiganji.memo ?? "").replace(
    "西行戻しの松公園からは車でおよそ10分です。",
    "西行戻しの松公園からは歩いておよそ10分です。"
  );
  zuiganjiMemo = zuiganjiMemo.replace(
    "みどころの多い境内をじっくりと巡ってみましょう。",
    "今も多くの参拝者が訪れる祈りの場ですので、静かに、敬意をもって巡ってみましょう。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: zuiganji.id }, {
    transitMode: "walk",
    transitDurationMin: 10,
    memo: zuiganjiMemo,
  });

  // 円通院: 配慮の一文
  const entsuin = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "円通院" },
  });
  const entsuinMemo = (entsuin.memo ?? "").replace(
    "静かな禅寺の空気の中、庭園めぐりを楽しんでみましょう。",
    "静かに、敬意をもって、禅寺の庭園めぐりを楽しんでみましょう。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: entsuin.id }, { memo: entsuinMemo });

  // 五大堂: 配慮の一文
  const godaido = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "五大堂" },
  });
  const godaidoMemo = (godaido.memo ?? "").replace(
    "床板の隙間から海面が見える「すかし橋」を渡っていきます。足元に気をつけながら渡ってみましょう。",
    "床板の隙間から海面が見える「すかし橋」を渡っていきます。足元に気をつけながら、静かに、敬意をもってお参りください。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: godaido.id }, { memo: godaidoMemo });

  // 観瀾亭: 徒歩の時間を修正
  const kanrantei = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "観瀾亭" },
  });
  const kanranteiMemo = (kanrantei.memo ?? "").replace(
    "五大堂からは歩いてすぐです。",
    "五大堂からは歩いておよそ3分です。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: kanrantei.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 13, 15)),
    transitDurationMin: 3,
    memo: kanranteiMemo,
  });

  // 観瀾亭の滞在延長分、後続の時刻を+2分カスケード
  const cruise = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "松島湾遊覧船" },
  });
  await updateSpotInItinerary(ITIN_ID, { spotId: cruise.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 14, 10)),
  });

  // 福浦橋: 時刻カスケード・帰りの一言
  const fukuura = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "福浦橋" },
  });
  const fukuuraMemo =
    (fukuura.memo ?? "") + " 見学を終えたら、車でJR松島海岸駅方面へ戻りましょう。";
  await updateSpotInItinerary(ITIN_ID, { spotId: fukuura.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 15, 18)),
    memo: fukuuraMemo,
  });

  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID } });
  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
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
