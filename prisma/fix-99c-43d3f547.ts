/**
 * #99 43d3f547 の直し(3回目)。企画運営(2026-10-01 09:20)の指摘:
 * - 「中村藤吉本店」は1軒のお茶屋(店)なのでスポットにしない → 削除し、
 *   代わりに実在の寺院・興聖寺(道元禅師ゆかりの曹洞宗最初の寺)を追加
 * - 萬福寺100分→80分、石峰寺84分→35分(小さな寺で30〜40分)。空いた時間は
 *   新しい実在の行き先(興聖寺・長建寺)を足して埋めた
 * - 伏見稲荷90分は、四ツ辻までの参道を往復する時間であることを本文に明記
 * - 平等院の「10円硬貨」の記載が料金に見えるとの指摘。意匠の話とわかるよう、
 *   具体的な金額を出さない書き方に直す
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - 興聖寺: 34.8894639,135.8133996 / 長建寺: 34.9282364,135.7608881
 *
 * 開いたURL(事実確認):
 * - 興聖寺(1233年道元開山・日本曹洞宗最初の寺とされる・1645年永井尚政が伏見城の遺構で再興・琴坂): https://ja.wikipedia.org/wiki/%E8%88%88%E8%81%96%E5%AF%BA_(%E5%AE%87%E6%B2%BB%E5%B8%82)
 * - 長建寺(1699年建部内匠頭政宇・八臂弁財天・京都唯一の弁財天本尊とされる・竜宮門・閼伽水): https://ja.wikipedia.org/wiki/%E9%95%B7%E5%BB%BA%E5%AF%BA_(%E4%BA%AC%E9%83%BD%E5%B8%82)
 * - 伏見稲荷大社 四ツ辻往復の所要時間(本殿から往復およそ90分が目安): https://www.goriluckey.com/archives/20170207_fushimiinari-schedule.html
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const BYODOIN_FROM = "優美な姿から後に「鳳凰堂」と呼ばれるようになり、10円硬貨の意匠にも採用されています。";
const BYODOIN_TO = "優美な姿から後に「鳳凰堂」と呼ばれるようになり、硬貨の意匠にもなるほど、広く親しまれています。";

const KOSHOJI_MEMO =
  "曹洞宗の寺院で、道元禅師が天福元年(1233)に開いた、日本における曹洞宗最初の寺院とされています。もとは伏見深草にありましたが、正保2年(1645)、淀藩主・永井尚政によって、伏見城の遺構を用いて現在の宇治の地に再興されました。参道の「琴坂」は、紅葉の名所として知られ、谷川のせせらぎに琴の音を重ねた名が付けられたといわれています。静かな境内を歩きながら、禅寺ならではの凛とした空気を感じてみてください。参拝の際は、敬意を込めて手を合わせましょう。";

const CHOKENJI_MEMO =
  "真言宗醍醐派の寺院で、地元では「島の弁天さん」と呼ばれ親しまれています。元禄12年(1699)、伏見奉行・建部内匠頭政宇が中書島を開発した際に建てられました。本尊は、鎌倉時代後期の作と伝わる八臂弁財天で、弁財天を本尊とする寺は京都でもここだけとされています。中国風の竜宮門をくぐった先、本堂前に湧く「閼伽水」は、伏見の名水の一つに数えられています。参拝の際は、敬意を込めて手を合わせましょう。";

const FUSHIMIINARI_FROM = "稲荷山を登る参拝コースも人気です。時間に余裕があれば、四ツ辻までの参道を上り、伏見の街を見渡す眺めを楽しむのもおすすめです。";
const FUSHIMIINARI_TO = "稲荷山を登る参拝コースも人気です。千本鳥居を抜けて四ツ辻まで上り、伏見の街を見渡す眺めを楽しんでから本殿まで戻るコースは、往復およそ90分が目安です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '43d3f547%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const byodoin = await findSpotInItinerary(itinId, { spotName: "平等院" });
  const nakamura = await findSpotInItinerary(itinId, { spotName: "中村藤吉本店" });
  const genji = await findSpotInItinerary(itinId, { spotName: "宇治市源氏物語ミュージアム" });
  const ujigami = await findSpotInItinerary(itinId, { spotName: "宇治上神社" });
  const mimurotoji = await findSpotInItinerary(itinId, { spotName: "三室戸寺" });
  const manpukuji = await findSpotInItinerary(itinId, { spotName: "萬福寺" });

  const teradaya = await findSpotInItinerary(itinId, { spotName: "寺田屋" });
  const jikkokubune = await findSpotInItinerary(itinId, { spotName: "十石舟（伏見）" });
  const gekkeikan = await findSpotInItinerary(itinId, { spotName: "月桂冠大倉記念館" });
  const gokogu = await findSpotInItinerary(itinId, { spotName: "御香宮神社" });
  const fujinomori = await findSpotInItinerary(itinId, { spotName: "藤森神社" });
  const sekihoji = await findSpotInItinerary(itinId, { spotName: "石峰寺" });
  const fushimiinari = await findSpotInItinerary(itinId, { spotName: "伏見稲荷大社" });

  if (!byodoin.memo!.includes(BYODOIN_FROM)) throw new Error("平等院の文言が想定外です");
  if (!fushimiinari.memo!.includes(FUSHIMIINARI_FROM)) throw new Error("伏見稲荷大社の文言が想定外です");

  const byodoinMemo = byodoin.memo!.replace(BYODOIN_FROM, BYODOIN_TO);
  const fushimiinariMemo = fushimiinari.memo!.replace(FUSHIMIINARI_FROM, FUSHIMIINARI_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: byodoin.id, data: { memo: byodoinMemo } },
    { id: genji.id, data: { visitTime: t(10, 6), transitMode: "walk", transitDurationMin: 6, transitLine: null } },
    { id: ujigami.id, data: { visitTime: t(11, 16) } },
    {
      create: {
        name: "興聖寺",
        address: "京都府宇治市宇治山田",
        lat: 34.8894639,
        lng: 135.8133996,
        memo: KOSHOJI_MEMO,
        visitTime: t(12, 39),
        stayDurationMin: 55,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    { id: mimurotoji.id, data: { visitTime: t(13, 49), transitMode: "walk", transitDurationMin: 15, transitLine: null } },
    { id: manpukuji.id, data: { visitTime: t(15, 14), stayDurationMin: 80 } },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: teradaya.id, data: {} },
    { id: jikkokubune.id, data: {} },
    { id: gekkeikan.id, data: {} },
    {
      create: {
        name: "長建寺",
        address: "京都府京都市伏見区東柳町",
        lat: 34.9282364,
        lng: 135.7608881,
        memo: CHOKENJI_MEMO,
        visitTime: t(11, 34),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    { id: gokogu.id, data: { visitTime: t(12, 19), transitMode: "walk", transitDurationMin: 15, transitLine: null } },
    { id: fujinomori.id, data: { visitTime: t(13, 9) } },
    { id: sekihoji.id, data: { visitTime: t(14, 21), stayDurationMin: 35 } },
    { id: fushimiinari.id, data: { memo: fushimiinariMemo, visitTime: t(15, 1) } },
  ];

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx, remove: [nakamura.id] });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
