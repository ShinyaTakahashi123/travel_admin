/**
 * #339の続き。法務10:46の指摘5点に対応。
 * 1) 塚原温泉 火口乃泉の火口見学に、火山ガスへの注意の一文を追加。
 * 2) 塚原温泉「鉄イオンの多さが全国でも有数」にヘッジを追加。
 * 3) 天祖神社「由布院でも屈指の古社です」にヘッジを追加。
 * 4) 大杵社(御神木の中に神像)に祈りの一文を追加。
 * 5) 下ん湯に「長湯を避けて水分をとりましょう」の一言を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-339e-9da78e5d.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9da78e5d-1fdd-415d-bd06-46c13d62d732";

async function main() {
  const tsukahara = await prisma.spot.findFirstOrThrow({ where: { name: "塚原温泉 火口乃泉", day: { itineraryId: ITIN_ID } } });
  const tenso = await prisma.spot.findFirstOrThrow({ where: { name: "天祖神社", day: { itineraryId: ITIN_ID } } });
  const ooki = await prisma.spot.findFirstOrThrow({ where: { name: "大杵社", day: { itineraryId: ITIN_ID } } });
  const shimonyu = await prisma.spot.findFirstOrThrow({ where: { name: "下ん湯", day: { itineraryId: ITIN_ID } } });

  const tsukaharaOld1 = "鉄イオンの多さが全国でも有数、強い酸性の泉質として知られています。";
  const tsukaharaNext1 = "鉄イオンの多さが全国でも有数とされる、強い酸性の泉質として知られています。";
  const tsukaharaOld2 = "受付からおよそ5分歩くと、今も噴気を上げる火口を見学することもできます。";
  const tsukaharaNext2 =
    "受付からおよそ5分歩くと、今も噴気を上げる火口を見学することもできます。火山ガスが出ているため、立ち入りの決まりに従い、気分が悪くなったらすぐにその場を離れましょう。";
  if (!tsukahara.memo?.includes(tsukaharaOld1)) throw new Error("tsukahara anchor1 not found");
  if (!tsukahara.memo?.includes(tsukaharaOld2)) throw new Error("tsukahara anchor2 not found");

  const tensoOld = "由布院でも屈指の古社です。";
  const tensoNext = "由布院でも屈指の古社とされています。";
  if (!tenso.memo?.includes(tensoOld)) throw new Error("tenso anchor not found");

  const ookiOld = "幹の裏側には大きな空洞があり、中には神像が安置されています。長い年月を生き抜いてきた巨木の生命力を、間近で感じてみましょう。";
  const ookiNext =
    "幹の裏側には大きな空洞があり、中には神像が安置されています。大切に祀られている神像ですので、静かに、敬意をもってお参りください。長い年月を生き抜いてきた巨木の生命力を、間近で感じてみましょう。";
  if (!ooki.memo?.includes(ookiOld)) throw new Error("ooki anchor not found");

  const shimonyuOld = "ここでも、ほかの入浴客が写らないよう撮影は控え、譲り合って静かに利用しましょう。";
  const shimonyuNext = "ここでも、ほかの入浴客が写らないよう撮影は控え、長湯を避けて水分をとりながら、譲り合って静かに利用しましょう。";
  if (!shimonyu.memo?.includes(shimonyuOld)) throw new Error("shimonyu anchor not found");

  await updateSpotInItinerary(
    ITIN_ID,
    { spotId: tsukahara.id },
    { memo: tsukahara.memo.replace(tsukaharaOld1, tsukaharaNext1).replace(tsukaharaOld2, tsukaharaNext2) }
  );
  console.log("tsukahara: hedge + gas-caution added");

  await updateSpotInItinerary(ITIN_ID, { spotId: tenso.id }, { memo: tenso.memo.replace(tensoOld, tensoNext) });
  console.log("tenso: hedge added");

  await updateSpotInItinerary(ITIN_ID, { spotId: ooki.id }, { memo: ooki.memo.replace(ookiOld, ookiNext) });
  console.log("ooki: courtesy line added");

  await updateSpotInItinerary(ITIN_ID, { spotId: shimonyu.id }, { memo: shimonyu.memo.replace(shimonyuOld, shimonyuNext) });
  console.log("shimonyu: hydration caution added");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
