/**
 * #163の続き。企画運営の指摘3点・法務の指摘(座標4か所)に対応。
 * ①兼六園「…由来するのだそうです」→「由来するとされます」(「〜そうです」
 *   は使わない決まり)。
 * ②石浦神社「縁結びのご利益でも親しまれており」(法務点検用語の「ご利益」)
 *   →「縁結びの神社として親しまれており」。
 * ③石浦神社の結び「歩いてお昼を食べに行きましょう」→実際の行き先名
 *   「歩いてしいのき迎賓館へ向かいましょう」。
 * ④法務指摘: 座標4か所をOSM実点に修正(兼六園・金沢城公園・
 *   しいのき迎賓館・三十間長屋)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-163d-4bb849f5.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "515a906f-e44c-48e7-9563-9a2aaf9deaee";

async function main() {
  const kenrokuen = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "兼六園" } });
  const ishiura = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "石浦神社" } });
  const castle = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "金沢城公園" } });
  const shiinoki = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "しいのき迎賓館で昼食" } });
  const nagaya = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "三十間長屋" } });

  if (!kenrokuen.memo?.includes("由来するのだそうです")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: kenrokuen.id },
    data: {
      lat: 36.5624267,
      lng: 136.6623546,
      memo: kenrokuen.memo!.replace("由来するのだそうです。", "由来するとされます。"),
    },
  });

  await prisma.spot.update({
    where: { id: ishiura.id },
    data: {
      memo: ishiura
        .memo!.replace("縁結びのご利益でも親しまれており", "縁結びの神社として親しまれており")
        .replace(
          "見学を終えたら、歩いてお昼を食べに行きましょう。",
          "見学を終えたら、歩いてしいのき迎賓館へ向かいましょう。"
        ),
    },
  });

  await prisma.spot.update({ where: { id: castle.id }, data: { lat: 36.5657619, lng: 136.659447 } });
  await prisma.spot.update({ where: { id: shiinoki.id }, data: { lat: 36.5624698, lng: 136.6578715 } });
  await prisma.spot.update({ where: { id: nagaya.id }, data: { lat: 36.5648868, lng: 136.6581472 } });

  console.log("#163続き: 兼六園の「〜そうです」を修正、石浦神社の「ご利益」の言葉と結びを修正、座標4か所をOSM実点に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
