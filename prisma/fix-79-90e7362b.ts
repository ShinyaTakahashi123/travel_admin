/**
 * #79 90e7362b（石打丸山・苗場ドラゴンドラ）ユーザー決定「全部直す」の対象
 * (D1現状15:10終了・D2現状14:50終了、いずれも16:30〜17:00の窓に届かず)。
 * 滞在を延ばさず(決まりA)、実在スポットを追加。縮めた分の付け替えはなし
 * (今回はどちらも既存スポットの滞在時間を縮めていない)。
 *
 * D1: 魚沼の里のあとに池田記念美術館(実在、南魚沼市浦佐、池田恒雄氏収集の
 * 池田コレクション約3,500点、OSM way 362867655)を追加。移動はOSRM実測
 * (8.8km/10分、車)。開館9:00-17:00・最終入館16:30(公式サイトで確認)、
 * 到着15:20は最終入館より前。
 *
 * D2: 宿場の湯のあとに道の駅みつまた(実在、湯沢町三俣、旧三国街道沿い、
 * OSM way 596962902)を追加。移動は「ドラゴンドラで田代側から苗場側の
 * 駐車場へ戻る(往路と同じ片道25分)」+「駐車場から車でおよそ15分」の
 * 合計40分(車の部分はOSRM実測7.7km/13分を15分に丸め)。営業は夏季
 * (5-11月)9-17時(公式サイトで確認)、到着15:30・発16:35はいずれも営業時間内。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const UONUMA_MEMO_TO_IKEDA =
  "雲洞庵から車でおよそ15分、霊峰・八海山のふもとに広がる魚沼の里に着きます。地酒「八海山」で知られる八海醸造が手がける、雪国の暮らしと文化を体感できる複合施設で、実際に酒を仕込む製造蔵「第二浩和蔵」や、ウイスキーやジンをつくる「深沢原蒸溜所」を見学できるほか、カフェやそば処、売店なども点在しています。敷地内は自由に歩いて回れるようになっていて、雪国ならではのひんやりとした「雪室」で貯蔵された食材を使った料理を味わうこともできます。ここで昼食にするのもおすすめです。お酒は20歳から。車を運転する人は飲まないでください。この後は、車でおよそ10分、池田記念美術館へ向かいましょう。";

const IKEDA_MEMO =
  "魚沼の里から車でおよそ10分、南魚沼市浦佐にある池田記念美術館に着きます。ベースボール・マガジン社の創業者で、野球殿堂入りも果たした池田恒雄氏が集めた「池田コレクション」、およそ3,500点を公開する美術館です。小泉八雲にまつわる文学資料室や、プロ野球・オリンピックなどの資料が並ぶスポーツ文化展示室のほか、洋画家・會津八一や、日本人と結婚して「ラグーザお玉」と呼ばれた女性洋画家エレオノラ・ラグーザの作品などが常設展として並びます。アート・文学・スポーツと幅広いテーマのコレクションをゆっくりお楽しみください。休館日は公式サイトで確かめてから訪れましょう。旅の1日目は、ここで終了です。お疲れさまでした。";

const SHUKUBA_MEMO_TO_MITSUMATA =
  "田代湖からロープウェーで下り、歩いておよそ25分、三国街道沿いにある町営の日帰り温泉施設、宿場の湯に着きます。平成7年(1995年)に開業した施設で、江戸時代に参勤交代の大名たちが越後と関東を行き来した三国街道の宿場町、二居の名にちなんで名づけられました。大浴場からは周囲の山並みを望むことができ、ゴンドラとロープウェーでの空中散歩や湖畔の散策で歩いた足を、ゆっくりと休められます。ここで昼食をとるのもおすすめです。このあとは、苗場ドラゴンドラで田代側から苗場側へ戻り(およそ25分)、駐車場から車でおよそ15分、道の駅みつまたへ向かいましょう。";

const MITSUMATA_MEMO =
  "苗場ドラゴンドラで苗場側の駐車場まで戻ったら、車でおよそ15分、旧三国街道沿いにある道の駅みつまたに着きます。新潟県指定文化財の池田家をイメージしたという建物に、三国街道を行き交った旅人たちの往時の風情が感じられます。地元でとれた野菜や特産品が並ぶ直売所、無農薬栽培のコーヒーが味わえるカフェ、和豚もち豚を使ったもつ煮が名物のレストランなどが集まっていて、足湯に浸かって、ゴンドラとロープウェーでの空中散歩や高原歩きの疲れを癒やすこともできます。定休日は公式サイトで確かめてから訪れましょう。旅の2日目は、ここで終了です。お疲れさまでした。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '90e7362b%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const day1Spots: SpotOrderItem[] = [
    { id: "a76b6f22-aef7-4583-b9f8-c0f676334e0b", data: {} }, // ザ・ヴェランダ石打丸山
    { id: "37b57065-330b-46c3-a830-b0ca7bfc9f05", data: {} }, // 雪国館
    { id: "c3cd42d6-fd9c-4b0c-881e-68d181d13bb2", data: {} }, // 雲洞庵
    {
      id: "a93af47a-691d-4d6b-b75d-1972a4aeacdc", // 魚沼の里
      data: { memo: UONUMA_MEMO_TO_IKEDA },
    },
    {
      create: {
        name: "池田記念美術館",
        address: "新潟県南魚沼市浦佐5493-3",
        lat: 37.164012,
        lng: 138.9336886,
        memo: IKEDA_MEMO,
        visitTime: t(15, 20),
        stayDurationMin: 75,
        transitMode: "car",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: "4281d1df-0ff5-463e-8c2a-3bcbbb287745", data: {} }, // 苗場ドラゴンドラ
    { id: "7537983a-0182-4735-abdd-ca7719d58721", data: {} }, // 田代ロープウェー
    { id: "7613be58-2b67-45ce-8954-de04380fa8b8", data: {} }, // 田代湖
    {
      id: "5fb99580-a6c8-440d-8374-8e545510eea1", // 宿場の湯
      data: { memo: SHUKUBA_MEMO_TO_MITSUMATA },
    },
    {
      create: {
        name: "道の駅みつまた",
        address: "新潟県南魚沼郡湯沢町三俣",
        lat: 36.9001148,
        lng: 138.7773457,
        memo: MITSUMATA_MEMO,
        visitTime: t(15, 30),
        stayDurationMin: 65,
        transitMode: "other",
        transitDurationMin: 40,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, spots] of [["Day1", day1Spots], ["Day2", day2Spots]] as const) {
    console.log(`\n-- ${label} --`);
    let prevEnd = -1;
    for (const x of spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = d.stayDurationMin as number | undefined;
      if (!vt || st == null) continue;
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      prevEnd = s0 + st;
    }
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
