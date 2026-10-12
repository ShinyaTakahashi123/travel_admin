/**
 * #374の続き。法務の指摘に対応(記録 d68522d)。
 * ①座標3か所を、法務が示したOSM実点に修正:
 *   熱田神宮 → r8453890(Nominatimの中心、35.1254307,136.9092535)
 *   大須商店街 → 万松寺通 w43552201 の中心(35.1589696,136.9037519)
 *   名古屋市役所本庁舎 → node n1423950541(35.1813862,136.9063875)
 *   (いずれも隣接区間の徒歩・電車の分数への影響はごくわずかで、そのまま)
 * ②大須観音・万松寺の結びを、祈りの決まった一文
 *   「今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。」に統一
 * ③三輪神社「縁結びの神社です」を、信仰の形の言い回しに直す
 * (熱田神宮のヘッジ・市役所本庁舎の結びの「ください」は、企画運営の指摘で
 *  fix-374bにて対応済みのため、今回は対象外)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-374c-d4fc7a52.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "c026e077-d36a-4405-80ae-88308a469a2f";

async function main() {
  const atsuta = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "熱田神宮" } });
  const osu = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "大須商店街" } });
  const osukannon = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "大須観音" } });
  const miwa = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "三輪神社" } });
  const banshoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "万松寺" } });
  const yakusho = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "名古屋市役所本庁舎" } });

  if (Number(atsuta.lat) === 35.1254307) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({ where: { id: atsuta.id }, data: { lat: 35.1254307, lng: 136.9092535 } });
  await prisma.spot.update({ where: { id: osu.id }, data: { lat: 35.1589696, lng: 136.9037519 } });
  await prisma.spot.update({ where: { id: yakusho.id }, data: { lat: 35.1813862, lng: 136.9063875 } });

  await prisma.spot.update({
    where: { id: osukannon.id },
    data: {
      memo: osukannon.memo?.replace(
        "本堂をはじめ、境内の仏像や堂宇を、静かに、敬意をもって巡りましょう。",
        "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。"
      ),
    },
  });

  await prisma.spot.update({
    where: { id: banshoji.id },
    data: {
      memo: banshoji.memo?.replace(
        "静かに、敬意をもって境内を巡りましょう。",
        "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。"
      ),
    },
  });

  await prisma.spot.update({
    where: { id: miwa.id },
    data: {
      memo: miwa.memo?.replace(
        "大物主神をまつったのが始まりと伝えられる、縁結びの神社です。",
        "大物主神をまつったのが始まりと伝えられる神社で、縁結びの神社として知られています。"
      ),
    },
  });

  console.log("#374続き: 座標3か所を法務指摘のOSM実点に修正、大須観音・万松寺の結びを祈りの決まった一文に、三輪神社を信仰の形に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
