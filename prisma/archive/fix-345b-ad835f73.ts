/**
 * #345の続き。企画運営11:29・法務11:29の指摘対応。
 * 1) タイトルの「パワースポット」を外す。
 * 2) 説明文「熊野古道随一の絶景」にヘッジを追加。
 * 3) 勝浦漁港85分(水増し)→45分、はまゆ90分(水増し)→65分に戻し、空いた
 *    時間は実在の補陀洛山寺・浜の宮王子跡(那智駅のそば、世界遺産の構成
 *    資産)を新規に追加して埋めた。
 * 4) はまゆ「入ってすぐに肌がしっとりとするのが特徴です」(効能の言い方)
 *    を外す。
 * 5) 大門坂(苔むした石段)に、滑りやすさへの注意を追加。
 * 補陀洛渡海については、法務の指摘どおり、亡くなり方には触れない書き方
 * にした(渡海船の復元模型の展示という史実のみを記載)。
 *
 * 座標は補陀洛山寺のみNominatimで新規確認(2026-10-01)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-345b-ad835f73.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "ad835f73-423a-47da-9130-7f2c5e7c289b";
const DAY1_ID = "1981b15a-6ab2-4216-9f42-185f9ef3d6ba";

const DAIMONZAKA_ID = "90b9d410-b4df-4b60-8bc7-3948f7a30311";
const NACHINOTAKI_ID = "5934fa83-9f22-41a4-b951-769e93b1a30b";
const KATSUURAKO_ID = "53e7c6a4-bfd1-4447-8ce7-b89db086eb6e";
const HAMAYU_ID = "943da7b6-7431-46db-b6ff-d163e92d9eab";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const already = await prisma.spot.findFirst({ where: { name: "補陀洛山寺・浜の宮王子跡", dayId: DAY1_ID } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const titleOld = "熊野那智大社と那智の滝、絶景の熊野古道パワースポット旅";
  const titleNext = "熊野那智大社と那智の滝、大門坂の熊野古道を歩く日帰りプラン";
  if (itin.title !== titleOld) throw new Error("title anchor mismatch: " + itin.title);

  const descOld = "熊野古道随一の絶景を楽しむプランです。";
  const descNext = "熊野古道随一ともいわれる絶景を楽しむプランです。";
  if (!itin.description?.includes(descOld)) throw new Error("description anchor not found");

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: { title: titleNext, description: itin.description.replace(descOld, descNext) },
  });
  console.log("title and description updated");

  const daimonzaka = await prisma.spot.findFirstOrThrow({ where: { id: DAIMONZAKA_ID } });
  const nachinotaki = await prisma.spot.findFirstOrThrow({ where: { id: NACHINOTAKI_ID } });
  const katsuurako = await prisma.spot.findFirstOrThrow({ where: { id: KATSUURAKO_ID } });
  const hamayu = await prisma.spot.findFirstOrThrow({ where: { id: HAMAYU_ID } });

  const daimonzakaOld = "鬱蒼とした杉木立の中、石畳を踏みしめながら、熊野古道の雰囲気をじっくりと味わってみましょう。";
  const daimonzakaNext =
    "苔むした石畳は、雨のあとなど滑りやすいので、歩きやすい靴で足元に気をつけて上りましょう。鬱蒼とした杉木立の中、石畳を踏みしめながら、熊野古道の雰囲気をじっくりと味わってみましょう。";
  if (!daimonzaka.memo?.includes(daimonzakaOld)) throw new Error("daimonzaka anchor not found");

  const nachinotakiOld = "見学を終えたら、バスで大門坂駐車場へ戻って車に乗り、およそ25分の勝浦漁港へ向かいましょう。";
  const nachinotakiNext = "見学を終えたら、バスで大門坂駐車場へ戻って車に乗り、およそ16分の補陀洛山寺・浜の宮王子跡へ向かいましょう。";
  if (!nachinotaki.memo?.includes(nachinotakiOld)) throw new Error("nachinotaki anchor not found");

  const katsuurakoOld = "那智の滝からは、バスで大門坂駐車場へ戻って車に乗り、およそ25分です。";
  const katsuurakoNext = "補陀洛山寺・浜の宮王子跡からは、車でおよそ6分です。";
  if (!katsuurako.memo?.includes(katsuurakoOld)) throw new Error("katsuurako anchor not found");

  const hamayuOld =
    "那智勝浦温泉は、保温性の高い塩化物泉で、「出船入船の湯」とも呼ばれ、入ってすぐに肌がしっとりとするのが特徴です。浴場では";
  const hamayuNext = "那智勝浦温泉は、保温性の高い塩化物泉で、「出船入船の湯」とも呼ばれます。浴場では";
  if (!hamayu.memo?.includes(hamayuOld)) throw new Error("hamayu anchor not found");

  const seigantoji = await prisma.spot.findFirstOrThrow({ where: { id: "29c44310-e822-459b-a8a3-53f73cae2ca8" } });
  const taisha = await prisma.spot.findFirstOrThrow({ where: { id: "680c8321-fb92-49e2-9516-88cf55df10a2" } });

  await setDaySpotOrder(DAY1_ID, [
    { id: daimonzaka.id, data: { memo: daimonzaka.memo.replace(daimonzakaOld, daimonzakaNext) } },
    { id: seigantoji.id, data: {} },
    { id: taisha.id, data: {} },
    { id: nachinotaki.id, data: { memo: nachinotaki.memo.replace(nachinotakiOld, nachinotakiNext) } },
    {
      create: {
        name: "補陀洛山寺・浜の宮王子跡",
        address: "東牟婁郡那智勝浦町浜ノ宮348",
        lat: 33.6447358,
        lng: 135.9344197,
        visitTime: t(13, 31),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 16,
        memo:
          "那智の滝からは、バスで大門坂駐車場へ戻って車に乗り、およそ16分です。補陀洛山寺は、那智駅のすぐそばに建つ天台宗の寺院で、本尊の千手観音像は国の重要文化財に指定されています。境内には、小さな船で南方の観音浄土「補陀洛」を目指したという、古くからの信仰を伝える渡海船の実物大の復元模型が展示されています。隣接する浜の宮王子跡は、熊野古道の参詣者が祈りを捧げた王子社の一つで、樟の大木が今もその歴史を見守っています。世界遺産「紀伊山地の霊場と参詣道」の構成資産の一つでもあるこの場所で、熊野古道の歴史に触れてみましょう。今も法要が営まれる祈りの場ですので、境内では静かに、敬意をもってお参りください。続いては、車でおよそ6分の勝浦漁港へ向かいましょう。",
      },
    },
    {
      id: katsuurako.id,
      data: {
        visitTime: t(14, 37),
        stayDurationMin: 45,
        transitMode: "car",
        transitDurationMin: 6,
        memo: katsuurako.memo.replace(katsuurakoOld, katsuurakoNext),
      },
    },
    {
      id: hamayu.id,
      data: { visitTime: t(15, 26), stayDurationMin: 65, memo: hamayu.memo.replace(hamayuOld, hamayuNext) },
    },
  ]);

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
