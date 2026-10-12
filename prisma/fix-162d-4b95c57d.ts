/**
 * #162の続き。prayer-check.cjsの指摘(9件すべて)に対応。寺社名のスポット
 * すべてに、祈りの決まった一文「今も祈りが続く場所ですので、静かに、
 * 敬意をもってお参りしましょう。」を追加した。既存(未変更)の報国寺・
 * 鶴岡八幡宮・明月院・円覚寺にも、この機会にあわせて追加した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-162d-4b95c57d.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "badac21c-fd67-45da-98d3-cff2ec258992";
const DAY2_ID = "66dbae38-0451-4b6b-87ff-9dc1068d1a1f";

const PRAYER = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

async function main() {
  const hokokuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "報国寺" } });
  const sugimotodera = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "杉本寺" } });
  const jomyoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "浄妙寺" } });
  const zuisenji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "瑞泉寺" } });
  const tsurugaoka = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "鶴岡八幡宮" } });
  const meigetsuin = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "明月院" } });
  const tokeiji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "東慶寺" } });
  const engakuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "円覚寺" } });
  const kaizoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "海蔵寺" } });

  if (hokokuji.memo?.includes(PRAYER)) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: hokokuji.id },
    data: {
      memo: hokokuji.memo!.replace(
        "竹の庭を満喫したら、鎌倉最古の寺と伝わる杉本寺へ向かいましょう。",
        `${PRAYER}竹の庭を満喫したら、鎌倉最古の寺と伝わる杉本寺へ向かいましょう。`
      ),
    },
  });
  await prisma.spot.update({
    where: { id: sugimotodera.id },
    data: {
      memo: sugimotodera.memo!.replace(
        "杉本寺の参拝を終えたら、歩いて浄妙寺へ向かいましょう。",
        `${PRAYER}杉本寺の参拝を終えたら、歩いて浄妙寺へ向かいましょう。`
      ),
    },
  });
  await prisma.spot.update({
    where: { id: jomyoji.id },
    data: {
      memo: jomyoji.memo!.replace(
        "見学を終えたら、歩いて瑞泉寺へ向かいましょう。",
        `${PRAYER}見学を終えたら、歩いて瑞泉寺へ向かいましょう。`
      ),
    },
  });
  await prisma.spot.update({
    where: { id: zuisenji.id },
    data: {
      memo: zuisenji.memo!.replace(
        "見学を終えたら、歩いて鶴岡八幡宮へ向かいましょう。",
        `${PRAYER}見学を終えたら、歩いて鶴岡八幡宮へ向かいましょう。`
      ),
    },
  });
  await prisma.spot.update({
    where: { id: tsurugaoka.id },
    data: {
      memo: tsurugaoka.memo!.replace(
        "見学を終えたら、今夜は鎌倉市内の宿に宿泊します。",
        `${PRAYER}見学を終えたら、今夜は鎌倉市内の宿に宿泊します。`
      ),
    },
  });
  await prisma.spot.update({
    where: { id: meigetsuin.id },
    data: {
      memo: meigetsuin.memo!.replace(
        "緑と歴史を堪能したら、歩いて東慶寺へ向かいましょう。",
        `${PRAYER}緑と歴史を堪能したら、歩いて東慶寺へ向かいましょう。`
      ),
    },
  });
  await prisma.spot.update({
    where: { id: tokeiji.id },
    data: {
      memo: tokeiji.memo!.replace(
        "見学を終えたら、歩いて北鎌倉駅のまわりへ向かい、お昼を食べましょう。",
        `${PRAYER}見学を終えたら、歩いて北鎌倉駅のまわりへ向かい、お昼を食べましょう。`
      ),
    },
  });
  await prisma.spot.update({
    where: { id: engakuji.id },
    data: {
      memo: engakuji.memo!.replace(
        "見学を終えたら、歩いて海蔵寺へ向かいましょう。",
        `${PRAYER}見学を終えたら、歩いて海蔵寺へ向かいましょう。`
      ),
    },
  });
  await prisma.spot.update({
    where: { id: kaizoji.id },
    data: {
      memo: kaizoji.memo!.replace(
        "竹の庭に始まり、紫陽花の参道、禅寺の庭園、そして清らかな井戸の水まで、",
        `${PRAYER}竹の庭に始まり、紫陽花の参道、禅寺の庭園、そして清らかな井戸の水まで、`
      ),
    },
  });

  console.log("#162続き: 寺社9か所すべてに祈りの決まった一文を追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
