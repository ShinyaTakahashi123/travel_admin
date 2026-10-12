/**
 * #367の続き。企画運営・法務の指摘に対応。
 *
 * 企画運営:
 * 1. 本町市場の滞在100分(決まりA、浮いた時間の配分だが実質延ばしすぎ)を
 *    65分に短縮。空いた時間に、新潟市美術館のそばにある旧齋藤家別邸
 *    (国指定名勝、大正7年築の近代和風建築、公式サイトで開館中を確認済み)
 *    を8か所目として追加。
 *
 * 法務(記録8aa5d2f):
 * ① 新潟県政記念館の「3つの府県だけで」にヘッジがなかったため
 *    「3つの府県だけとされ」に修正。
 * ② 白山神社の座標を、GSI住所点からOSM実点(w352707752「新潟総鎮守
 *    白山神社」、中心37.915499,139.037671)に修正。
 *
 * 新しい時刻(09:00〜16:47、8か所):
 * 白山神社(55)→白山公園(55)→新潟県政記念館(40)→りゅーとぴあ(40)
 * →本町市場・昼食(65)→旧齋藤家別邸(45)→新潟市美術館(75)→湊稲荷神社(40)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-367e-cde2cce6.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "93e13569-6bfe-4462-8f6e-3cbff8bb17e5";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const hakusanjinja = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "白山神社" } });
  const hakusanpark = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "白山公園" } });
  const kenseikinenkan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "新潟県政記念館" } });
  const ryutopia = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "りゅーとぴあ" } });
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "本町市場で昼食" } });
  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "新潟市美術館" } });
  const minatoinari = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "湊稲荷神社" } });

  if (lunch.stayDurationMin === 65) {
    console.log("already applied, skipping");
    return;
  }

  const kenseiOld = "明治期に建てられた県会議事堂が今も残るのは、新潟・京都・和歌山の3つの府県だけで、いずれも国の重要文化財に指定されています。";
  const kenseiNew = "明治期に建てられた県会議事堂が今も残るのは、新潟・京都・和歌山の3つの府県だけとされ、いずれも国の重要文化財に指定されています。";

  await setDaySpotOrder(DAY1_ID, [
    { id: hakusanjinja.id, data: { lat: 37.915499, lng: 139.037671 } },
    { id: hakusanpark.id, data: {} },
    {
      id: kenseikinenkan.id,
      data: { memo: kenseikinenkan.memo?.includes(kenseiOld) ? kenseikinenkan.memo.replace(kenseiOld, kenseiNew) : kenseikinenkan.memo },
    },
    { id: ryutopia.id, data: {} },
    {
      id: lunch.id,
      data: {
        stayDurationMin: 65,
        memo: lunch.memo?.replace(
          "お腹を満たしたら、歩いて新潟市美術館へ向かいましょう。",
          "お腹を満たしたら、歩いて旧齋藤家別邸へ向かいましょう。"
        ),
      },
    },
    {
      create: {
        name: "旧齋藤家別邸",
        address: "新潟市中央区西大畑町576",
        lat: 37.926187,
        lng: 139.040256,
        visitTime: T(13, 47),
        stayDurationMin: 45,
        memo: "本町市場から歩いて12分ほど、次に訪れるのは旧齋藤家別邸です。新潟の三大財閥の一つともいわれた豪商・齋藤家の四代目当主、齋藤喜十郎が、大正7年(1918)に迎賓館として建てた近代和風建築です。砂丘地形を生かした回遊式庭園を中心に、建物と庭園を一体で楽しめるよう設計されており、国の名勝に指定されています。日本遺産「みなとまち新潟」の構成文化財の一つでもあります。月曜は休館のことが多いので、公式サイトで確認してから訪れましょう。見学を終えたら、歩いて新潟市美術館へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12 }] },
      },
    },
    {
      id: bijutsukan.id,
      data: {
        visitTime: T(14, 36),
        memo: bijutsukan.memo?.replace(
          "本町市場から歩いて14分ほど、次に訪れるのは新潟市美術館です。",
          "旧齋藤家別邸から歩いて4分ほど、次に訪れるのは新潟市美術館です。"
        ),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
      },
    },
    { id: minatoinari.id, data: { visitTime: T(16, 7) } },
  ]);

  console.log("#367続き: 本町市場を65分に短縮、旧齋藤家別邸を追加、白山神社の座標・新潟県政記念館のヘッジを修正、09:00〜16:47着地");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
