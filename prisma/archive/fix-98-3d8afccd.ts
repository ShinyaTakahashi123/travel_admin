/**
 * #98 3d8afccd 相倉合掌造り集落、世界遺産の山里を歩く定番日帰りプラン。
 * チェックリスト(20260929-itinerary-4spots-9to16)の決まりに合わせて組み直す。
 * 元は相倉合掌造り集落1か所(09:30〜11:10)のみで、4か所未満・終了とも決まりに
 * 合っていなかった。五箇山・白川郷の世界遺産構成資産(相倉・菅沼・荻町)と、
 * 国指定重要文化財の合掌造り2棟(村上家・岩瀬家)を実在の行き先として追加し、
 * 8:30〜9:30開始・16:30〜17:00終了の形にした。あわせて元の文章のツアーガイド
 * 口調(皆様/お越しくださいました/お楽しみください/お過ごしくださいませ)も
 * サイト標準の口調に直した。移動は、この一帯に路線バスの本数が少なく、
 * 世界遺産バスも全区間を頻繁につなぐものではないため、レンタカーを想定した
 * (新高岡駅・高岡駅が一般的な起点)。
 *
 * 新規に追加したスポットの座標:
 * - 村上家: Nominatim(「村上家 南砺市」)で確認(36.4105654,136.9309668)
 * - 岩瀬家: 所在地(富山県南砺市西赤尾町)をNominatim・GSI住所検索の両方で確認
 *   (36.383419,136.851166、字レベルの点。建物個別の点はNominatim/GSIとも
 *   見つからなかったため、地区の実在する点をそのまま使用)
 * - 菅沼合掌造り集落: 集落内にある「塩硝の館」をNominatimで確認した点を使用
 *   (36.4041163,136.8869617)
 * - 白川郷(荻町合掌造り集落): Nominatim(「白川郷 岐阜県」)で確認(36.2573454,136.9068317)
 *
 * 開いたURL(事実確認):
 * - 相倉合掌造り集落(24棟・五箇山最大・1995年世界遺産登録): https://www.travel.co.jp/guide/article/40982/
 * - 村上家(1958年重要文化財、建築年代は諸説、こきりこ節): https://ja.wikipedia.org/wiki/%E6%9D%91%E4%B8%8A%E5%AE%B6%E4%BD%8F%E5%AE%85 , https://www.murakamike.jp/about.html
 * - 岩瀬家(西赤尾町857-1、約300年前・8年がかり、五箇山白川郷で最大、1958年重文): https://iwaseke.jp/%e4%ba%94%e7%ae%87%e5%b1%b1/
 * - 菅沼合掌造り集落(9戸、塩硝の館、五箇山民俗館): https://suganuma.info/about
 * - 白川郷荻町集落(1995年世界遺産、3集落中最大規模): https://www.kankou-gifu.jp/article/detail_11.html
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "相倉合掌造り集落、世界遺産の山里を歩く定番日帰りプラン";
const DESCRIPTION =
  "白川郷とともに世界遺産に登録された、五箇山・相倉合掌造り集落を起点に、村上家・菅沼合掌造り集落・岩瀬家、そして岐阜県の白川郷までめぐる、レンタカーでの日帰りプランです。";

const AINOKURA_MEMO =
  "旅の始まりは相倉合掌造り集落です。新高岡駅や高岡駅でレンタカーを借りて、東海北陸自動車道で向かいましょう。庄川を見下ろす高台に、合掌造りと茅葺きの家々が寄り添うように並ぶ、五箇山を代表する集落です。1995年、白川郷・菅沼とともに世界文化遺産「白川郷・五箇山の合掌造り集落」に登録されました。20棟の合掌造りと4棟の茅葺き家屋、あわせて24棟が残り、五箇山でもっとも大きい合掌集落とされています。建物の多くは江戸末期から明治にかけてのもので、最も古いものは17世紀にさかのぼるといわれています。この集落は今も変わらず人々の暮らしの場で、「人が住まう世界遺産」とも呼ばれています。窓越しに家の中をのぞき込むようなことは控え、住民の暮らしに敬意を払いながら、静かな山里の風景を眺めてみてください。この後は、車でおよそ10分、村上家へ向かいましょう。";

const MURAKAMIKE_MEMO =
  "相倉から車でおよそ10分、村上家に着きます。合掌造りの古い形式をよく残す建物として、1958年(昭和33年)に国の重要文化財に指定されました。地元にはおよそ350年前の建築と伝わりますが、建てられた時期には諸説あります。囲炉裏を囲みながら、五箇山地方に伝わる民謡「こきりこ節」を聞くこともできます。日本最古級の民謡のひとつともいわれる調べに耳を傾けながら、ひとときを過ごしてみてください。この後は、車でおよそ10分、菅沼合掌造り集落へ向かいましょう。";

const SUGANUMA_MEMO =
  "村上家から車でおよそ10分、菅沼合掌造り集落に着きます。9戸の合掌造り家屋が残る、相倉より小さな集落です。相倉・白川郷とともに、1995年に世界文化遺産に登録されました。集落内には、江戸時代にこの地方の主産業だった塩硝(えんしょう、火薬の原料)づくりの歴史を伝える「塩硝の館」と、菅沼でもっとも古い合掌造りを改築した「五箇山民俗館」があり、暮らしの道具などおよそ300点が展示されています。ここで昼食にしましょう。この後は、車でおよそ10分、岩瀬家へ向かいましょう。";

const IWASEKE_MEMO =
  "菅沼から車でおよそ10分、岩瀬家に着きます。およそ300年前、8年の歳月をかけて建てられたと伝わる、五箇山・白川郷を通じてもっとも大きい合掌造り家屋です。1958年(昭和33年)、国の重要文化財に指定されました。5層になった建物の中では、養蚕や塩硝づくりに使われた道具なども見学できます。この後は、車でおよそ30分、白川郷へ向かいましょう。";

const SHIRAKAWAGO_MEMO =
  "岩瀬家から車でおよそ30分、富山県から岐阜県に入り、白川郷・荻町集落に着きます。相倉・菅沼とあわせて、1995年に世界文化遺産「白川郷・五箇山の合掌造り集落」に登録された3つの集落の中でも、もっとも規模の大きい集落です。庄川沿いに合掌造りの家々が立ち並び、城山天守閣展望台からは、集落全体を見渡す眺めを楽しめます。国の重要文化財に指定されている和田家をはじめ、内部を見学できる合掌造りの家屋も点在しています。相倉・菅沼の静かな佇まいから、白川郷の賑わいまで、世界遺産の山里をめぐる旅はこれで終わりです。帰りは、来た道を戻り、レンタカーを返却しましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '3d8afccd%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const ainokura = await findSpotInItinerary(itinId, { spotName: "相倉合掌造り集落" });

  const day1Spots: SpotOrderItem[] = [
    {
      id: ainokura.id,
      data: { memo: AINOKURA_MEMO, visitTime: t(9, 0), stayDurationMin: 90, transitMode: null, transitDurationMin: null, transitLine: null },
    },
    {
      create: {
        name: "村上家",
        address: "富山県南砺市上梨",
        lat: 36.4105654,
        lng: 136.9309668,
        memo: MURAKAMIKE_MEMO,
        visitTime: t(10, 40),
        stayDurationMin: 45,
        transitMode: "car",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    {
      create: {
        name: "菅沼合掌造り集落",
        address: "富山県南砺市菅沼",
        lat: 36.4041163,
        lng: 136.8869617,
        memo: SUGANUMA_MEMO,
        visitTime: t(11, 35),
        stayDurationMin: 70,
        transitMode: "car",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    {
      create: {
        name: "岩瀬家",
        address: "富山県南砺市西赤尾町",
        lat: 36.383419,
        lng: 136.851166,
        memo: IWASEKE_MEMO,
        visitTime: t(12, 55),
        stayDurationMin: 40,
        transitMode: "car",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    {
      create: {
        name: "白川郷",
        address: "岐阜県大野郡白川村荻町",
        lat: 36.2573454,
        lng: 136.9068317,
        memo: SHIRAKAWAGO_MEMO,
        visitTime: t(14, 5),
        stayDurationMin: 145,
        transitMode: "car",
        transitDurationMin: 30,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- D1 ---");
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt) { console.log("(visitTime未変更)"); continue; }
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { title: TITLE, description: DESCRIPTION } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
