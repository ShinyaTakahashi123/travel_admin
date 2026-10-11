/**
 * #363 新緑の蔵王ロープウェイと大露天風呂、グリーンシーズンの蔵王日帰りプラン
 * (ca4cf898)。蔵王ロープウェイ・蔵王温泉大露天風呂の2か所・09:30〜13:00のみ
 * だったのを、蔵王温泉街を徒歩で回る5か所・09:00〜16:38に組み直す。旧文の古い
 * 案内口調(「皆様、本日ご案内するのは」「ご注意ください」「お楽しみください」)
 * も直した。
 *
 * - 蔵王温泉バスターミナル(昼食): OSM way310732755、38.1674322,140.3937007
 * - 酢川温泉神社: OSM way484655973、38.1694473,140.3987870
 * - 蔵王中央ロープウェイ・鳥兜駅: OSM way310732761、38.1657779,140.4152159
 *
 * 新しい時刻(09:00〜16:38、5か所):
 * 蔵王ロープウェイ(140)→蔵王温泉バスターミナル・昼食(60)→酢川温泉神社(25)
 * →蔵王中央ロープウェイ(60)→蔵王温泉大露天風呂(120)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-363-ca4cf898.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "e0bba595-adb5-4248-9871-7784c0081127";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const ropeway = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "蔵王ロープウェイ" } });
  if (ropeway.stayDurationMin === 140 && ropeway.memo?.includes("蔵王温泉バスターミナルへ向かいましょう")) {
    console.log("already applied, skipping");
    return;
  }
  const rotenburo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "蔵王温泉大露天風呂" } });

  await setDaySpotOrder(
    DAY1_ID,
    [
      {
        id: ropeway.id,
        data: {
          visitTime: T(9, 0),
          stayDurationMin: 140,
          memo: "山形駅からバスでおよそ40分の蔵王温泉から、山麓駅まで歩いて10分ほど、そこから山麓線と山頂線を乗り継いで地蔵山頂駅を目指す、蔵王の旅は蔵王ロープウェイから始まります。冬には樹氷に覆われるこの一帯も、新緑の季節にはまったく違う表情を見せてくれます。高山植物が咲き誇る斜面や、遠くに望む蔵王連峰の稜線を眺めながらの空中散歩は、爽やかな風とともに楽しむ、グリーンシーズンならではの魅力です。地蔵山頂駅の周辺には、冬の間は雪に埋もれている蔵王地蔵尊も、その姿をはっきりと見せてくれます。標高の高い場所ですので、夏場でも麓より肌寒く感じることがあります。羽織るものを一枚持っていくと安心です。見学を終えたら、歩いて蔵王温泉バスターミナルへ向かいましょう。",
        },
      },
      {
        create: {
          name: "蔵王温泉バスターミナルで昼食",
          address: "山形市蔵王温泉",
          lat: 38.1674322,
          lng: 140.3937007,
          visitTime: T(11, 30),
          stayDurationMin: 60,
          memo: "蔵王ロープウェイから歩いて10分ほど、お昼は蔵王温泉バスターミナル周辺で食事をとりましょう。蔵王温泉の中心にあるターミナルで、周辺には食堂やお土産店が集まっています。山歩きの後の体を休めながら、ゆっくりと食事を楽しみましょう。お腹を満たしたら、歩いて酢川温泉神社へ向かいましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
        },
      },
      {
        create: {
          name: "酢川温泉神社",
          address: "山形市蔵王温泉954",
          lat: 38.1694473,
          lng: 140.398787,
          visitTime: T(12, 37),
          stayDurationMin: 25,
          memo: "蔵王温泉バスターミナルから歩いて7分ほど、次に訪れるのは酢川温泉神社です。蔵王温泉の守り神として、古くから湯治に訪れる人々の信仰を集めてきたと伝えられる神社です。温泉街を見下ろす高台に鎮座し、石段を上ると、蔵王の山々を望む景色も広がります。静かに、敬意をもって参拝しましょう。見学を終えたら、歩いて蔵王中央ロープウェイへ向かいましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
        },
      },
      {
        create: {
          name: "蔵王中央ロープウェイ",
          address: "山形市蔵王温泉229",
          lat: 38.1657779,
          lng: 140.4152159,
          visitTime: T(13, 22),
          stayDurationMin: 60,
          memo: "酢川温泉神社から歩いて20分ほど、次に訪れるのは蔵王中央ロープウェイです。温泉駅から鳥兜駅まで、蔵王ロープウェイとは別のもう一つのロープウェイで空中散歩を楽しめます。鳥兜駅の展望台からは、蔵王温泉の町並みを見下ろしながら、新緑に覆われた山並みを一望できます。先ほど訪れた蔵王ロープウェイとは違う角度から、蔵王の自然を眺めてみましょう。見学を終えたら、歩いて蔵王温泉大露天風呂へ向かいましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 20 }] },
        },
      },
      {
        id: rotenburo.id,
        data: {
          visitTime: T(14, 38),
          stayDurationMin: 120,
          memo: "蔵王中央ロープウェイから歩いて16分ほど、旅の最後に訪れるのは蔵王温泉大露天風呂です。開湯1900年ちかいと伝えられる蔵王温泉の中で、渓流沿いに自然の巨石を組んだ湯船が広がる、開放的な造りのこの露天風呂は、一度に200人ほどが入れるといわれる広さを誇り、上流側が女湯、下流側が男湯に分かれています。強い酸性の硫黄泉は「美人づくりの湯」とも呼ばれ、肌によいとされてきました。新緑に包まれた森の中、川のせせらぎを聞きながらの湯あみは、この季節ならではの贅沢なひとときです。なお、積雪期にあたる12月から4月中旬ごろまでは冬期閉鎖となるため、この時期を外れたグリーンシーズンに訪れましょう。空中散歩と開放的な露天風呂で、蔵王の自然を存分に味わいましょう。",
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16 }] },
        },
      },
    ]
  );

  console.log("#363: 蔵王温泉バスターミナル・酢川温泉神社・蔵王中央ロープウェイを追加、09:00〜16:38着地");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
