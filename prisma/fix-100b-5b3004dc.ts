/**
 * #100 5b3004dc の直し(2回目)。itinerary-audit.cjsで、田代池→穂高神社奥宮の
 * 移動(130分)が、直線距離2.9kmに対して遅すぎる(水増しの疑い)と指摘された。
 * 実際の遊歩道は河童橋経由でおよそ5.3km(公式ガイドの目安時間: 大正池-河童橋
 * 約60分・河童橋-明神 約50分の合算から、田代池-河童橋の残り約40分+50分=90分)
 * のため、直線距離だけでは実態と合わないが、90分がより実態に近い値と判断し、
 * 130分から90分に直す。短縮した40分は、決まりAに沿って、大正池(+10分)・
 * 穂高神社奥宮(+10分)・明神池(+30分、この旅の中心地であるため)に水増しでは
 * なく実在の内容として配分し直した(石造りの明神橋を渡って対岸の穂高神社奥宮へ
 * 向かう一文を追加)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const OKUMIYA_FROM = "田代池から河童橋のたもとを通り過ぎ、歩いておよそ130分、穂高神社奥宮に着きます。";
const OKUMIYA_TO = "田代池から河童橋のたもとを通り過ぎ、明神橋で梓川を渡って、歩いておよそ90分、穂高神社奥宮に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5b3004dc%'`);
  const itinId = rows[0].id;

  const taishoike = await findSpotInItinerary(itinId, { spotName: "大正池" });
  const okumiya = await findSpotInItinerary(itinId, { spotName: "穂高神社奥宮" });
  const myojinike = await findSpotInItinerary(itinId, { spotName: "明神池" });

  if (taishoike.stayDurationMin !== 100) throw new Error("大正池の値が想定外です");
  if (okumiya.transitDurationMin !== 130 || okumiya.stayDurationMin !== 40) throw new Error("穂高神社奥宮の値が想定外です");
  if (!okumiya.memo!.includes(OKUMIYA_FROM)) throw new Error("穂高神社奥宮の文言が想定外です");
  if (myojinike.stayDurationMin !== 110) throw new Error("明神池の値が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: taishoike.id }, { stayDurationMin: 110 });
  await updateSpotInItinerary(
    itinId,
    { spotId: okumiya.id },
    {
      memo: okumiya.memo!.replace(OKUMIYA_FROM, OKUMIYA_TO),
      transitDurationMin: 90,
      stayDurationMin: 50,
      visitTime: t(13, 30),
    }
  );
  await updateSpotInItinerary(itinId, { spotId: myojinike.id }, { visitTime: t(14, 25), stayDurationMin: 140 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
