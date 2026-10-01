/**
 * #343の続き。企画運営12:57転送の法務指摘2点+できれば2点に対応。
 * 1) 洞窟観音(観音像39体を安置)に、祈りの一文を追加。
 * 2) 綿貫観音山古墳(古墳=お墓)に、静かに見学する一言を追加。
 * 3)(できれば) 山上碑・金井沢碑にも、静かに見学する一言を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-343f-a4ee710d.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "a4ee710d-7872-4fb5-8bb1-6b7b796cdcbd";

async function main() {
  const dokutsu = await prisma.spot.findFirstOrThrow({ where: { name: "洞窟観音・徳明園", day: { itineraryId: ITIN_ID } } });
  const kofun = await prisma.spot.findFirstOrThrow({ where: { name: "綿貫観音山古墳", day: { itineraryId: ITIN_ID } } });
  const yamanoue = await prisma.spot.findFirstOrThrow({ where: { name: "山上碑", day: { itineraryId: ITIN_ID } } });
  const kanaizawa = await prisma.spot.findFirstOrThrow({ where: { name: "金井沢碑", day: { itineraryId: ITIN_ID } } });

  const dokutsuOld = "動力のない時代に、人の手だけでここまでの規模をつくり上げた執念に、驚かされることでしょう。";
  const dokutsuNext =
    "動力のない時代に、人の手だけでここまでの規模をつくり上げた執念に、驚かされることでしょう。今も祈りが続く場ですので、静かに、敬意をもってお参りください。";
  if (!dokutsu.memo?.includes(dokutsuOld)) throw new Error("dokutsu anchor not found");

  const kofunOld = "墳丘の上に登って、当時の東国を治めた王の墓の大きさを、実際に歩いて感じてみましょう。";
  const kofunNext =
    "古墳はお墓でもありますので、静かに見学しましょう。墳丘の上に登って、当時の東国を治めた王の墓の大きさを、実際に歩いて感じてみましょう。";
  if (!kofun.memo?.includes(kofunOld)) throw new Error("kofun anchor not found");

  const yamanoueOld = "小さな石碑に刻まれた、1300年以上前の人々の祈りに触れてみましょう。";
  const yamanoueNext = "石碑のまわりでは、静かに見学しましょう。小さな石碑に刻まれた、1300年以上前の人々の祈りに触れてみましょう。";
  if (!yamanoue.memo?.includes(yamanoueOld)) throw new Error("yamanoue anchor not found");

  const kanaizawaOld =
    "当時の家族のあり方や、仏教が地方にまで広がっていた様子を伝える、貴重な史料とされています。山上碑と同じく「上野三碑」の一つとして、ユネスコの「世界の記憶」に登録されています。";
  const kanaizawaNext =
    "当時の家族のあり方や、仏教が地方にまで広がっていた様子を伝える、貴重な史料とされています。山上碑と同じく「上野三碑」の一つとして、ユネスコの「世界の記憶」に登録されています。石碑のまわりでは、静かに見学しましょう。";
  if (!kanaizawa.memo?.includes(kanaizawaOld)) throw new Error("kanaizawa anchor not found");

  await updateSpotInItinerary(ITIN_ID, { spotId: dokutsu.id }, { memo: dokutsu.memo.replace(dokutsuOld, dokutsuNext) });
  console.log("dokutsu: prayer line added");

  await updateSpotInItinerary(ITIN_ID, { spotId: kofun.id }, { memo: kofun.memo.replace(kofunOld, kofunNext) });
  console.log("kofun: quiet-viewing line added");

  await updateSpotInItinerary(ITIN_ID, { spotId: yamanoue.id }, { memo: yamanoue.memo.replace(yamanoueOld, yamanoueNext) });
  console.log("yamanoue: quiet-viewing line added");

  await updateSpotInItinerary(ITIN_ID, { spotId: kanaizawa.id }, { memo: kanaizawa.memo.replace(kanaizawaOld, kanaizawaNext) });
  console.log("kanaizawa: quiet-viewing line added");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
