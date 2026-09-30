/**
 * #65 1bd66235（浦富海岸・鳥取）ユーザー決定「全部直す」の対象(旧D1 15:43・D2 16:07)。
 * 滞在を延ばさず(決まりA)、実在スポットを追加する。
 * Day1: 田後港のあとに岩美町立渚交流館(実在、山陰海岸ジオパークの自然体験施設)を
 * 追加。Day2: わらべ館のあとに鳥取民藝美術館(実在、吉田璋也が1949年に開いた
 * 民藝運動ゆかりの美術館)を追加。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY1_ID = "02ae506e-4f82-465b-895f-31ae07b187eb";
const DAY2_ID = "f3d8d6b8-1eb8-421e-9b06-02a79e1782ab";

const TAJIRI_MEMO_NEW =
  "城原海岸から車でおよそ11分、田後港に着きます。古くから漁業が営まれてきた実際の漁港で、遊覧船の乗り場ではありません。1949年に運輸省指定港湾、1951年には避難港の指定を受けた歴史ある港で、山陰海岸国立公園内にあり、前面に好漁場が広がることから漁業が盛んに行われてきました。現在も松葉ガニ(ズワイガニ)漁の水揚げ港として活気にあふれています。港を見渡せる展望台や、階段を上った先にたたずむ神社、入り組んだ路地の続く町並みなど、小さな漁村ならではの風情もあわせて楽しめます。港の近くには食事処もあるので、ここで昼食にしましょう。にぎやかな漁港の活気と、静かな漁村の暮らしぶりを、ゆっくりと味わってみてください。この後は、車でおよそ5分、岩美町立渚交流館へ向かいましょう。";

const NAGISA_MEMO =
  "田後港から車でおよそ5分、岩美町立渚交流館に着きます。山陰海岸ジオパークの浦富海岸エリアを紹介する自然体験施設で、シュノーケリングやシーカヤックなど海のアクティビティの拠点にもなっています。館内では、海と貝のアクセサリー作りやテラコッタ陶芸といった、気軽に参加できるものづくり体験も楽しめます(体験は有料・要予約のものがあります)。浦富海岸の成り立ちや生き物について、展示を通して学んでみてください。この後は、車でおよそ10分、岩井廃寺塔跡へ向かいましょう。";

const IWAI_HAIJI_FROM = "田後港から車でおよそ12分、岩井廃寺塔跡に着きます。";
const IWAI_HAIJI_TO = "岩美町立渚交流館から車でおよそ10分、岩井廃寺塔跡に着きます。";

const WARABEKAN_TAIL_FROM = "浦富海岸から鳥取砂丘、そして鳥取市街まで、山陰の海と歴史をめぐった1泊2日の旅を、ここで締めくくりましょう。";
const WARABEKAN_TAIL_TO = "この後は、歩いておよそ15分、鳥取民藝美術館へ向かいましょう。";

const MINGEI_MEMO =
  "わらべ館から歩いておよそ15分、鳥取民藝美術館に着きます。鳥取出身の医師・吉田璋也が、柳宗悦を中心とする民藝運動に共鳴し、昭和24年(1949)に開いた美術館です。日本・朝鮮半島・中国・西洋などから集めた陶磁器や木工品、染織品と、吉田の指導のもとで生み出された鳥取の新作民藝を、あわせておよそ5000点収蔵しています。実用の中に美を見いだす民藝の心にふれながら、鳥取の手仕事の奥深さを感じてみてください。浦富海岸から鳥取砂丘、そして鳥取市街まで、山陰の海と歴史をめぐった1泊2日の旅を、ここで締めくくりましょう。お帰りは、歩いておよそ3分のJR鳥取駅からご利用ください。";

async function main() {
  const day1Spots: SpotOrderItem[] = [
    { id: "4983ae59-3725-443b-9ac0-a3b21f8240a6", data: {} },
    { id: "da0ea19d-5ccf-4224-a871-bb429ca664b4", data: {} },
    { id: "b87e5154-f2d2-4eb3-b13a-9a618cc3fbd6", data: {} },
    { id: "95e07ea9-9dfd-4fa7-a69e-44f398c7c8d3", data: {} },
    { id: "5d33c763-0b98-4616-8c8f-9db69cbc3cbb", data: { memo: TAJIRI_MEMO_NEW } },
    {
      create: {
        name: "岩美町立渚交流館",
        address: "鳥取県岩美郡岩美町牧谷690-20",
        lat: 35.5930674,
        lng: 134.3386226,
        memo: NAGISA_MEMO,
        visitTime: t(14, 1),
        stayDurationMin: 45,
        transitMode: "car",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    { id: "fdf4e393-eda5-4ae1-9913-5da06a703afa", data: { visitTime: t(14, 56), stayDurationMin: 20, transitMode: "car", transitDurationMin: 10 } },
    { id: "1b93e755-c494-4c95-8cb3-c323fe11d865", data: { visitTime: t(15, 18), stayDurationMin: 25 } },
    { id: "c0d6958b-c01c-4793-9dc8-bb5b754b41ba", data: { visitTime: t(15, 46), stayDurationMin: 45 } },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: "f9cb3c08-035b-4d66-a604-494ff75efb31", data: {} },
    { id: "d69ea4cb-634d-41a8-b0e9-a6d78b45310d", data: {} },
    { id: "caf86db0-19ba-4bc5-9cf9-7788eedffaaa", data: {} },
    { id: "0df911db-2114-4dea-ba67-5f28ea46b096", data: {} },
    { id: "d1de6450-5420-4b58-9d94-49d385a5b4bd", data: {} },
    { id: "e56afb0a-9c39-472d-a230-10fbdb006604", data: {} },
    { id: "f70aca8e-8129-4206-959f-b16841141512", data: {} }, // わらべ館(memoは下で個別置換)
    {
      create: {
        name: "鳥取民藝美術館",
        address: "鳥取県鳥取市栄町651",
        lat: 35.4961166,
        lng: 134.22716,
        memo: MINGEI_MEMO,
        visitTime: t(16, 22),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 15,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, order] of [[1, day1Spots], [2, day2Spots]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = d.stayDurationMin as number | undefined;
      if (!vt || st == null) continue;
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`D${n} ${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      prevEnd = s0 + st;
    }
  }

  const iwaiHaiji = await prisma.spot.findUniqueOrThrow({ where: { id: "fdf4e393-eda5-4ae1-9913-5da06a703afa" } });
  if (!iwaiHaiji.memo!.includes(IWAI_HAIJI_FROM)) throw new Error("一致しません(岩井廃寺塔跡)");
  const newIwaiHaijiMemo = iwaiHaiji.memo!.split(IWAI_HAIJI_FROM).join(IWAI_HAIJI_TO);

  const warabekan = await prisma.spot.findUniqueOrThrow({ where: { id: "f70aca8e-8129-4206-959f-b16841141512" } });
  if (!warabekan.memo!.includes(WARABEKAN_TAIL_FROM)) throw new Error("一致しません(わらべ館)");
  const newWarabekanMemo = warabekan.memo!.replace(WARABEKAN_TAIL_FROM, WARABEKAN_TAIL_TO);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: iwaiHaiji.id }, data: { memo: newIwaiHaijiMemo } });
    await tx.spot.update({ where: { id: warabekan.id }, data: { memo: newWarabekanMemo } });
    await setDaySpotOrder(DAY1_ID, day1Spots, { tx });
    await setDaySpotOrder(DAY2_ID, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
