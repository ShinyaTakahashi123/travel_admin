/**
 * #158の続き。法務の4点指摘に対応。
 * ①②座標2か所をOSM実点に修正: 伝承園(n704428818)・カッパ淵
 *   (w1301527676「カッパ淵」)。
 * ③常堅寺の結びを祈りの決まった一文に統一。
 * ④五百羅漢の結びを、亡くなった方々をしのぶ一文に直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-158d-388f880b.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "474a27d0-c16e-4db3-939f-db0aecd9ee0f";

async function main() {
  const denshoen = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "伝承園" } });
  const kappabuchi = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "カッパ淵" } });
  const jokenji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "常堅寺" } });
  const rakan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "五百羅漢" } });

  if (Number(denshoen.lat) === 39.3573373) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({ where: { id: denshoen.id }, data: { lat: 39.3573373, lng: 141.5692201 } });
  await prisma.spot.update({ where: { id: kappabuchi.id }, data: { lat: 39.3541754, lng: 141.5705352 } });

  await prisma.spot.update({
    where: { id: jokenji.id },
    data: {
      memo: jokenji.memo?.replace(
        "静かに、敬意をもって境内を巡りましょう。",
        "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。"
      ),
    },
  });

  await prisma.spot.update({
    where: { id: rakan.id },
    data: {
      memo: rakan.memo?.replace(
        "静かに、敬意をもって見学しましょう。",
        "亡くなった方々をしのぶ場所ですので、静かに、敬意をもって見学しましょう。"
      ),
    },
  });

  console.log("#158続き: 座標2か所を修正、常堅寺を祈りの決まった一文に、五百羅漢をしのぶ一文に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
