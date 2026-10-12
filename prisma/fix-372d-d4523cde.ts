/**
 * #372の続き。企画運営(3点)・法務(記録59661c8、2点)の指摘に対応。
 *
 * 企画運営1/法務②: 座標4か所を度分秒の丸めた値からOSM実点に修正。
 *   - 千葉城: n1420728788「千葉市立郷土博物館（千葉城）」35.604560,140.127101
 *   - 千葉神社: w24025378「千葉神社」の中心 35.611779,140.123762
 *   - 千葉駅で昼食: n237498814「千葉」(千葉駅) 35.613405,140.112423
 *   - 加曽利貝塚: w324006938「加曽利貝塚」の中心 35.623414,140.164600
 * 企画運営2/法務(参考): 千葉神社の「お参りください」(案内役の言い方)を
 *   「お参りしましょう」に修正。
 * 企画運営3: 千葉市動物公園のレッサーパンダ「風太」について、2026年7月5日
 *   に23歳の誕生日を迎え、今も元気に暮らしていることを確認した
 *   (https://kumanichi.com/articles/2010269 「レッサーパンダ風太、23歳
 *   飼育員「来年もこの場所で」」)。過去形だった本文を現在形に修正。
 * 法務①: 加曽利貝塚の「全国有数の規模の貝塚です」に同一文のヘッジが
 *   なかったため「全国有数の規模とされる貝塚です」に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-372d-d4523cde.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "305fcdd7-999d-4c5b-9e64-79445ec2bf41";

async function main() {
  const jo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千葉城（千葉市立郷土博物館）" } });
  const jinja = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千葉神社" } });
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千葉駅で昼食" } });
  const kaizuka = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "加曽利貝塚" } });
  const zoo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千葉市動物公園" } });

  if (jo.lat?.toString() === "35.6046") {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({ where: { id: jo.id }, data: { lat: 35.6046, lng: 140.127101 } });

  await prisma.spot.update({
    where: { id: jinja.id },
    data: {
      lat: 35.611779,
      lng: 140.123762,
      memo: jinja.memo?.replace(
        "境内では静かに、敬意をもってお参りください。",
        "境内では静かに、敬意をもってお参りしましょう。"
      ),
    },
  });

  await prisma.spot.update({ where: { id: lunch.id }, data: { lat: 35.613405, lng: 140.112423 } });

  await prisma.spot.update({
    where: { id: kaizuka.id },
    data: {
      lat: 35.623414,
      lng: 140.1646,
      memo: kaizuka.memo?.replace(
        "8の字型につながる全国有数の規模の貝塚です。",
        "8の字型につながる全国有数の規模とされる貝塚です。"
      ),
    },
  });

  await prisma.spot.update({
    where: { id: zoo.id },
    data: {
      memo: zoo.memo?.replace(
        "レッサーパンダの「風太」が暮らしていたことでも知られています。",
        "レッサーパンダの「風太」が今も元気に暮らしていることでも知られています。"
      ),
    },
  });

  console.log("#372続き: 座標4か所・千葉神社の言い方・加曽利貝塚のヘッジ・風太の現在形を修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
