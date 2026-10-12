/**
 * #160の続き。企画運営の3点・法務の2点に対応。
 * 企画運営:
 * ①②昼食95分→65分、伊佐爾波神社80分→40分に短縮(決まりA、時間合わせ
 *   だったため)。
 * ③空いた時間に宝厳寺(時宗の開祖・一遍上人の生誕地)を追加。既存の別の
 *   しおり2本とは異なり、一遍の生涯(踊り念仏・捨聖と呼ばれた生き方)を
 *   中心にした文にして重なりを避けた(出典: WebSearchで確認)。
 * 法務:
 * ①本館・椿の湯に、入浴のマナー(ほかの人を写さない・長湯を避ける・
 *   水分補給)の一文を追加。
 * ②本館の座標をw235751036のNominatimの中心(33.8520617,132.7864036)に修正。
 *
 * 新しい時刻(09:30〜16:35、7か所):
 * 道後温泉本館09:30(100)→圓満寺11:12(20)→昼食(道後商店街)11:35(65)→
 * 伊佐爾波神社12:44(40)→宝厳寺13:26(65)→椿の湯14:37(55)→
 * ぎやまんガラス美術館15:35(60)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-160b-41d548bb.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "4fa70190-2640-4afc-88af-d2ac7903a436";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const honkan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "道後温泉本館" } });
  const enmanji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "圓満寺" } });
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "道後商店街で昼食" } });
  const isaniwa = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "伊佐爾波神社" } });
  const tsubaki = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "椿の湯" } });
  const giyaman = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "ぎやまんガラス美術館" } });

  if (Number(honkan.lat) === 33.8520617) {
    console.log("already applied, skipping");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    {
      id: honkan.id,
      data: {
        lat: 33.8520617,
        lng: 132.7864036,
        memo: honkan.memo?.replace(
          "歴史ロマンあふれる湯屋建築をじっくりと味わいましょう。見学を終えたら、歩いて圓満寺へ向かいましょう。",
          "歴史ロマンあふれる湯屋建築をじっくりと味わいましょう。浴場ではほかの人を写さず、長湯は避けて、こまめに水分をとりましょう。見学を終えたら、歩いて圓満寺へ向かいましょう。"
        ),
      },
    },
    { id: enmanji.id, data: {} },
    { id: lunch.id, data: { stayDurationMin: 65 } },
    {
      id: isaniwa.id,
      data: {
        visitTime: T(12, 44),
        stayDurationMin: 40,
        memo: isaniwa.memo?.replace(
          "見学を終えたら、歩いて椿の湯へ向かいましょう。",
          "見学を終えたら、歩いて宝厳寺へ向かいましょう。"
        ),
      },
    },
    {
      create: {
        name: "宝厳寺",
        address: "松山市道後湯月町",
        lat: 33.851662,
        lng: 132.789976,
        visitTime: T(13, 26),
        stayDurationMin: 65,
        memo: "伊佐爾波神社から歩いて2分ほど、次に訪れるのは宝厳寺です。鎌倉時代、時宗を開いた一遍上人が生まれた地と伝えられています。一遍は35歳のころから、特定の寺を持たず、鉦や太鼓に合わせて念仏を唱えながら踊る「踊り念仏」を携え、生涯のほとんどを旅の中で過ごしながら、全国に教えを広めました。身の回りの一切を持たずに歩き続けたその生き方から、「捨聖」とも呼ばれています。境内には一遍上人の像が立ち、ふるさとに生まれたこの聖人の歩みを今に伝えています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。見学を終えたら、歩いて椿の湯へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
      },
    },
    {
      id: tsubaki.id,
      data: {
        memo: tsubaki.memo
          ?.replace("伊佐爾波神社から歩いて5分ほど", "宝厳寺から歩いて6分ほど")
          .replace(
            "もう一つの外湯をゆっくりと楽しみましょう。見学を終えたら、歩いてぎやまんガラス美術館へ向かいましょう。",
            "もう一つの外湯をゆっくりと楽しみましょう。浴場ではほかの人を写さず、長湯は避けて、こまめに水分をとりましょう。見学を終えたら、歩いてぎやまんガラス美術館へ向かいましょう。"
          ),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
      },
    },
    { id: giyaman.id, data: {} },
  ]);

  console.log("#160続き: 昼食・伊佐爾波神社の滞在を短縮し宝厳寺を追加、入浴マナーの一文・本館の座標を修正。09:30〜16:35に組み直し");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
