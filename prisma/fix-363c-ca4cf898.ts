/**
 * #363の続き。企画運営(4点)・法務(6点、記録7cc19c7・訂正df2c809)の指摘に対応。
 *
 * 法務の追加分:
 * ② 大露天風呂に入浴マナー(撮影しない・長湯をしない・水分をとる)の一文を追加。
 * ③④ 蔵王ロープウェイ・大露天風呂の写真が、雪景色・無関係の看板など実際と
 *    合わない写真だったため削除(写真は2枚ともこの1枚ずつのみで、他に差し替え
 *    候補がないため削除とした)。表紙(thumbnailUrl)も同じ写真だったため空にした。
 * ⑤ 蔵王ロープウェイの座標をOSM way310732765(山麓駅、38.161649,140.395166)に、
 *    蔵王中央ロープウェイの座標を、山上の鳥兜駅ではなく乗り場の温泉駅
 *    (OSM way310732763、38.164846,140.395669)に修正。
 * ⑥ 蔵王山は活火山のため、地蔵山頂駅の本文に火山情報を確かめる一文を追加。
 * (参考・任意) 酢川温泉神社の石段に、足元の注意の一文を追加。
 *
 * 企画運営の4点指摘。
 * 1. 大露天風呂の120分(決まりA)を65分に短縮し、空いた時間にドッコ沼(蔵王中央
 *    ロープウェイの鳥兜駅から歩いて8分、OSM way765938412)を追加。
 * 2. 蔵王ロープウェイの140分は、地蔵山頂駅周辺を歩く(遊歩道・蔵王地蔵尊見学)
 *    時間を含むことを本文にはっきり書いた。
 * 3. 大露天風呂の「強い酸性の硫黄泉は『美人づくりの湯』とも呼ばれ、肌によい
 *    とされてきました」は効き目をうたう言い方のため、泉質の事実だけに修正。
 * 4. 説明文の「夏山リフトの空中散歩」→「ロープウェイの空中散歩」に修正
 *    (行程はロープウェイのため)。
 *
 * 新しい時刻(09:00〜16:30、6か所):
 * 蔵王ロープウェイ(140)→昼食(60)→酢川温泉神社(25)→蔵王中央ロープウェイ(60)
 * →ドッコ沼(35)→蔵王温泉大露天風呂(65)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-363c-ca4cf898.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "ca4cf898-7e26-4db6-89da-0d1af4d45c81";
const DAY1_ID = "e0bba595-adb5-4248-9871-7784c0081127";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const oldDesc = "新緑や高山植物が広がる夏山リフトの空中散歩と、";
  const newDesc = "新緑や高山植物が広がるロープウェイの空中散歩と、";
  if (itin.description?.includes(oldDesc)) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: itin.description.replace(oldDesc, newDesc) } });
    console.log("説明文: 「夏山リフト」を「ロープウェイ」に修正");
  } else {
    console.log("説明文: 既に対応済み");
  }

  const ropeway = await prisma.spot.findFirstOrThrow({ where: { name: "蔵王ロープウェイ", day: { itineraryId: ITIN_ID } } });
  const oldRopeway = "地蔵山頂駅の周辺には、冬の間は雪に埋もれている蔵王地蔵尊も、その姿をはっきりと見せてくれます。";
  const newRopeway =
    "地蔵山頂駅に着いたら、周辺に整備された遊歩道を歩いてみましょう。冬の間は雪に埋もれている蔵王地蔵尊も、その姿をはっきりと見せてくれます。蔵王山は今も活動する火山のため、出かける前に火山の情報を確かめましょう。";
  if (ropeway.memo?.includes(oldRopeway) || ropeway.lat?.toString() === "38.161118") {
    const memo = ropeway.memo?.includes(oldRopeway) ? ropeway.memo.replace(oldRopeway, newRopeway) : ropeway.memo;
    await updateSpotInItinerary(ITIN_ID, { spotId: ropeway.id }, {
      memo,
      lat: 38.161649,
      lng: 140.395166,
    });
    console.log("蔵王ロープウェイ: 山頂で歩くこと・火山情報の確認を明記、座標を実点に修正");
  } else {
    console.log("蔵王ロープウェイ: 既に対応済み");
  }

  // 法務③④: 写真が実際と合わないため削除し、表紙も空にする
  const badRopewayPhoto = await prisma.photo.findFirst({ where: { spotId: ropeway.id, sourceUrl: "https://commons.wikimedia.org/wiki/File:Yamagata-zao_ski_1_(200712).jpg" } });
  if (badRopewayPhoto) {
    await prisma.photo.delete({ where: { id: badRopewayPhoto.id } });
    console.log("蔵王ロープウェイ: 雪景色の写真を削除");
  }
  if (itin.thumbnailUrl?.includes("%25E8%2594%25B5%25E7%258E%258B%25E3%2583%25AD")) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { thumbnailUrl: null } });
    console.log("表紙(thumbnailUrl)を空にした");
  }

  const rotenburo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "蔵王温泉大露天風呂" } });

  // 法務③: 大露天風呂の写真も実際と合わないため削除
  const badRotenburoPhoto = await prisma.photo.findFirst({ where: { spotId: rotenburo.id, sourceUrl: "https://commons.wikimedia.org/wiki/File:220430_ZaoOnsen_Yamagata_Yamagata_pref_Japan24s3.jpg" } });
  if (badRotenburoPhoto) {
    await prisma.photo.delete({ where: { id: badRotenburoPhoto.id } });
    console.log("蔵王温泉大露天風呂: 温泉街の坂道の写真を削除");
  }

  const chuoRopeway = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "蔵王中央ロープウェイ" } });
  if (chuoRopeway.lat?.toString() === "38.1657779") {
    await updateSpotInItinerary(ITIN_ID, { spotId: chuoRopeway.id }, { lat: 38.164846, lng: 140.395669 });
    console.log("蔵王中央ロープウェイ: 座標を乗り場(温泉駅)の実点に修正");
  }

  if (rotenburo.stayDurationMin === 65) {
    console.log("Day1後半: 既に対応済み");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: ropeway.id, data: {} },
      { id: (await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "蔵王温泉バスターミナルで昼食" } })).id, data: {} },
      {
        id: await (async () => {
          const suzukawa = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "酢川温泉神社" } });
          const oldSuzukawa = "石段を上ると、蔵王の山々を望む景色も広がります。";
          const newSuzukawa = "石段を上ると、蔵王の山々を望む景色も広がりますが、段差が急なため、足元に気をつけましょう。";
          if (suzukawa.memo?.includes(oldSuzukawa)) {
            await prisma.spot.update({ where: { id: suzukawa.id }, data: { memo: suzukawa.memo.replace(oldSuzukawa, newSuzukawa) } });
            console.log("酢川温泉神社: 石段の足元の一文を追加");
          }
          return suzukawa.id;
        })(),
        data: {},
      },
      {
        id: chuoRopeway.id,
        data: {
          memo: chuoRopeway.memo?.replace("見学を終えたら、歩いて蔵王温泉大露天風呂へ向かいましょう。", "見学を終えたら、歩いてドッコ沼へ向かいましょう。"),
        },
      },
      {
        create: {
          name: "ドッコ沼",
          address: "山形市蔵王温泉",
          lat: 38.1691769,
          lng: 140.4184544,
          visitTime: T(14, 30),
          stayDurationMin: 35,
          memo: "蔵王中央ロープウェイから歩いて8分ほど、次に訪れるのはドッコ沼です。密教の法具「独鈷(とっこ)」に似た形をしていることが名の由来と伝えられる、神秘的な沼です。沼のほとりには蔵王大権現が祀られ、蔵王地蔵尊・蔵王大黒天とあわせて「蔵王三神」と呼ばれています。新緑に囲まれた沼の水面を眺めながら、静かな時間を過ごしましょう。見学を終えたら、歩いて蔵王温泉大露天風呂へ向かいましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
        },
      },
      {
        id: rotenburo.id,
        data: {
          visitTime: T(15, 25),
          stayDurationMin: 65,
          memo: "ドッコ沼から歩いて20分ほど、旅の最後に訪れるのは蔵王温泉大露天風呂です。開湯1900年ちかいと伝えられる蔵王温泉の中で、渓流沿いに自然の巨石を組んだ湯船が広がる、開放的な造りのこの露天風呂は、一度に200人ほどが入れるといわれる広さを誇り、上流側が女湯、下流側が男湯に分かれています。強い酸性の硫黄泉が、川のせせらぎを聞きながらの湯あみを引き立てます。新緑に包まれた森の中で過ごす、この季節ならではの贅沢なひとときです。ほかの入浴客を撮影しない、長湯を避ける、水分をとるなど、マナーに気をつけて利用しましょう。なお、積雪期にあたる12月から4月中旬ごろまでは冬期閉鎖となるため、この時期を外れたグリーンシーズンに訪れましょう。空中散歩と開放的な露天風呂で、蔵王の自然を存分に味わいましょう。湯あみを終えたら、バスで山形駅へ戻り、グリーンシーズンの蔵王を巡る日帰り旅を締めくくりましょう。",
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 20 }] },
        },
      },
    ],
    { remove: [] }
  );

  console.log("#363続き: ドッコ沼を追加、大露天風呂を65分に短縮、09:00〜16:30着地");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
