/**
 * #79 90e7362b 企画運営の指摘3点(2026-09-30 18:00)への対応。
 * 1) D1開始が10:00で決まり2(8:30〜9:30)に外れていた。ザ・ヴェランダ石打丸山の
 *    ゴンドラは夏季(この旅の季節)9:30始発(公式サイトで確認)のため、開始を
 *    09:30に変更(以降の時刻も30分早める)。
 * 2) 魚沼の里の120分は長すぎた。酒蔵見学+昼食として70分に短縮。
 * 3) 空いた時間は、魚沼の里のあとに西福寺開山堂(実在、魚沼市大浦、石川雲蝶の
 *    彫刻で知られる古刹、OSM way 1203024446)を新規に追加して埋めた(決まりA、
 *    縮めた分をほかへ移さない)。拝観時間(4-11月 9:00-15:30、公式サイトで確認)
 *    に収まるよう、池田記念美術館より先に訪れる順に変更。移動はOSRM実測
 *    (魚沼の里→西福寺 13.2km/14分、西福寺→池田記念美術館 4.7km/7分)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const UONUMA_MEMO =
  "雲洞庵から車でおよそ15分、霊峰・八海山のふもとに広がる魚沼の里に着きます。地酒「八海山」で知られる八海醸造が手がける、雪国の暮らしと文化を体感できる複合施設で、実際に酒を仕込む製造蔵「第二浩和蔵」や、ウイスキーやジンをつくる「深沢原蒸溜所」を見学できるほか、カフェやそば処、売店なども点在しています。敷地内は自由に歩いて回れるようになっていて、雪国ならではのひんやりとした「雪室」で貯蔵された食材を使った料理を味わうこともできます。ここで昼食にするのもおすすめです。お酒は20歳から。車を運転する人は飲まないでください。この後は、車でおよそ14分、西福寺開山堂へ向かいましょう。";

const SAIFUKUJI_MEMO =
  "魚沼の里から車でおよそ14分、魚沼市大浦にある西福寺開山堂に着きます。天文3年(1534年)に芳室祖春大和尚が開いたと伝わる曹洞宗の古刹で、江戸時代の名匠・石川雲蝶が手がけた堂内外の彫刻の数々から「日本のミケランジェロ」とも呼ばれています。天井を埋め尽くす大彫刻「道元禅師猛虎調伏の図」をはじめ、透かし彫りの繊細さと極彩色の鮮やかさに満ちた作品の数々をじっくりとご覧ください。拝観時間・拝観料・ガイドの申し込みは公式サイトで確かめてから訪れましょう。この後は、車でおよそ7分、池田記念美術館へ向かいましょう。";

const IKEDA_MEMO =
  "西福寺開山堂から車でおよそ7分、南魚沼市浦佐にある池田記念美術館に着きます。ベースボール・マガジン社の創業者で、野球殿堂入りも果たした池田恒雄氏が集めた「池田コレクション」、およそ3,500点を公開する美術館です。小泉八雲にまつわる文学資料室や、プロ野球・オリンピックなどの資料が並ぶスポーツ文化展示室のほか、洋画家・會津八一や、日本人と結婚して「ラグーザお玉」と呼ばれた女性洋画家エレオノラ・ラグーザの作品などが常設展として並びます。アート・文学・スポーツと幅広いテーマのコレクションをゆっくりお楽しみください。休館日は公式サイトで確かめてから訪れましょう。この後は、宿へ戻ってゆっくりお休みください。旅の1日目は、ここで終了です。お疲れさまでした。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '90e7362b%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const day1Spots: SpotOrderItem[] = [
    {
      id: "a76b6f22-aef7-4583-b9f8-c0f676334e0b", // ザ・ヴェランダ石打丸山
      data: { visitTime: t(9, 30) },
    },
    {
      id: "37b57065-330b-46c3-a830-b0ca7bfc9f05", // 雪国館
      data: { visitTime: t(10, 50) },
    },
    {
      id: "c3cd42d6-fd9c-4b0c-881e-68d181d13bb2", // 雲洞庵
      data: { visitTime: t(11, 45) },
    },
    {
      id: "a93af47a-691d-4d6b-b75d-1972a4aeacdc", // 魚沼の里
      data: { visitTime: t(12, 40), stayDurationMin: 70, memo: UONUMA_MEMO },
    },
    {
      create: {
        name: "西福寺開山堂",
        address: "新潟県魚沼市大浦174",
        lat: 37.1936651,
        lng: 138.9566007,
        memo: SAIFUKUJI_MEMO,
        visitTime: t(14, 4),
        stayDurationMin: 65,
        transitMode: "car",
        transitDurationMin: 14,
        transitLine: null,
      },
    },
    {
      id: "1a9754d8-9c8f-424e-8de6-fb2e626fa5a2", // 池田記念美術館
      data: { visitTime: t(15, 16), memo: IKEDA_MEMO, transitDurationMin: 7 },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = {
    "a76b6f22-aef7-4583-b9f8-c0f676334e0b": 70, // ザ・ヴェランダ石打丸山
    "37b57065-330b-46c3-a830-b0ca7bfc9f05": 35, // 雪国館
    "c3cd42d6-fd9c-4b0c-881e-68d181d13bb2": 40, // 雲洞庵
  };
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
