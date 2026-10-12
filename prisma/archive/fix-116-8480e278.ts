/**
 * #116 8480e278(猪苗代湖)の組み直し。既存は猪苗代湖1か所(09:30〜11:00)
 * のみだったため、野口英世記念館・会津民俗館・天鏡閣・諸橋近代美術館
 * ・磐梯山噴火記念館を追加し、猪苗代から裏磐梯まで北上する1日に
 * 組んだ。案内口調(「皆様」)も修正。
 *
 * 猪苗代湖(既存)→野口英世記念館(昼食)→会津民俗館→天鏡閣→
 * 諸橋近代美術館→磐梯山噴火記念館、09:30〜16:30。
 *
 * 事実確認(開いたURL、検索結果の要約):
 * - 野口英世記念館/生家: 生家は文政6年(1823)建築の農家主屋(寄棟造
 *   茅葺)、2019年登録有形文化財。野口英世(幼名・清作)は明治9年
 *   (1876)生まれ: bunka.nii.ac.jp等
 * - 会津民俗館: 野口英世記念館から徒歩3分、会津地方の伝統的な古民家
 *   が軒を連ねる施設: gurutto-aizu.com等
 * - 天鏡閣: 旧有栖川宮家・高松宮家の翁島別邸、本館・別館・表門が
 *   昭和54年(1979)国の重要文化財指定: jalan.net等
 * - 諸橋近代美術館: サルバドール・ダリの作品346点を所蔵、スペイン・
 *   アメリカに次ぐ世界3番目のダリ美術館とされる(アジア最大の
 *   ダリコレクション): crea.bunshun.jp等
 * - 磐梯山噴火記念館: 明治21年(1888)7月15日の磐梯山水蒸気爆発(小磐梯
 *   山頂崩壊・477人犠牲・岩屑なだれが川をせき止め桧原湖など湖沼群が
 *   誕生)から100年を記念して昭和63年(1988)開館: weblio.jp、
 *   bousai.go.jp等(死者数は公式統計の事実記載のみ、死に方の描写はせず)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const INAWASHIROKO_FROM = "皆様、本日ご案内するのは猪苗代湖です。猪苗代駅からバスで15分ほどのこちらは、";
const INAWASHIROKO_TO = "猪苗代駅前でレンタカーを借りて、今日はまず猪苗代湖から始まります。";

const INAWASHIROKO_END_FROM = "湖畔を歩けば、澄んだ水と雄大な山並みが織りなす、福島県を代表する景観をゆったりと味わっていただけます。";
const INAWASHIROKO_END_TO =
  "湖畔を歩けば、澄んだ水と雄大な山並みが織りなす、福島県を代表する景観をゆったりと味わえます。この後は、車でおよそ15分、野口英世記念館へ向かいましょう。";

const NOGUCHI_MEMO =
  "猪苗代湖から車でおよそ15分、野口英世記念館に着きます。千円紙幣の肖像でも知られる細菌学者・野口英世は、明治9年(1876)、この地に生まれました。幼名は清作といいます。記念館には、文政6年(1823)に建てられた生家の農家主屋(寄棟造・茅葺)が残されていて、国の登録有形文化財に指定されています。館内では、黄熱病の研究などで世界的に活躍した野口英世の歩みを、遺品や資料とともにたどれます。このあたりには食事処も多いので、見学のあとは、このあたりで昼食にしましょう。この後は、歩いておよそ3分、会津民俗館へ向かいましょう。";

const MINZOKUKAN_MEMO =
  "野口英世記念館から歩いておよそ3分、会津民俗館に着きます。会津地方の古い民家を移築・保存した施設で、かやぶき屋根の建物が軒を連ねています。昔の暮らしの道具や、会津地方の民俗資料も展示されていて、当時の暮らしぶりを感じられます。野口英世記念館とあわせて、会津の歴史と文化にふれるひとときを過ごしましょう。この後は、車でおよそ7分、天鏡閣へ向かいましょう。";

const TENKYOKAKU_MEMO =
  "会津民俗館から車でおよそ7分、天鏡閣に着きます。もとは有栖川宮家、のちに高松宮家の別邸として建てられた洋館で、猪苗代湖を見下ろす高台に立っています。本館・別館・表門は、昭和54年(1979)に国の重要文化財に指定されました。内部には、当時の洋風の調度品がそのまま残されていて、皇族の避暑地としての優雅な暮らしぶりをうかがうことができます。この後は、車でおよそ25分、諸橋近代美術館へ向かいましょう。";

const MOROHASHI_MEMO =
  "天鏡閣から車でおよそ25分、裏磐梯の諸橋近代美術館に着きます。シュルレアリスムの巨匠・サルバドール・ダリの作品346点を所蔵する美術館で、スペインのダリ劇場美術館、アメリカのダリ美術館に次ぐ、世界で3番目のダリ美術館とされています。磐梯山の麓、五色沼のそばという自然豊かな環境の中で、ダリの独創的な作品世界にひたることができます。この後は、車でおよそ4分、磐梯山噴火記念館へ向かいましょう。";

const FUNKA_MEMO =
  "諸橋近代美術館から車でおよそ4分、この旅の締めくくり、磐梯山噴火記念館に着きます。明治21年(1888)7月15日、磐梯山で起きた水蒸気爆発から100年を記念して、昭和63年(1988)に開館しました。この噴火では、小磐梯と呼ばれた山頂部分が大きく崩れ、477人の犠牲者を出す大きな被害をもたらしました。崩れ落ちた岩や土砂は川をせき止め、桧原湖をはじめとする大小の湖沼群を生み出しました。映像や展示を通して、磐梯山の壮大な自然の成り立ちと、火山とともにある暮らしを学べます。猪苗代湖から裏磐梯までをめぐる旅はこれで終わりです。レンタカーは、帰りに猪苗代駅前で返却しましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8480e278%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const inawashiroko = await findSpotInItinerary(itinId, { spotName: "猪苗代湖" });

  if (!inawashiroko.memo!.includes(INAWASHIROKO_FROM)) throw new Error("猪苗代湖の書き出しが想定外です");
  if (!inawashiroko.memo!.includes(INAWASHIROKO_END_FROM)) throw new Error("猪苗代湖の結びが想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    {
      id: inawashiroko.id,
      data: {
        memo: inawashiroko
          .memo!.replace(INAWASHIROKO_FROM, INAWASHIROKO_TO)
          .replace(INAWASHIROKO_END_FROM, INAWASHIROKO_END_TO),
      },
    },
    {
      create: {
        name: "野口英世記念館",
        address: "福島県耶麻郡猪苗代町大字三ツ和字前田81",
        lat: 37.5361443,
        lng: 140.0738806,
        memo: NOGUCHI_MEMO,
        visitTime: t(11, 15),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 15,
        transitLine: null,
      },
    },
    {
      create: {
        name: "会津民俗館",
        address: "福島県耶麻郡猪苗代町大字三ツ和",
        lat: 37.5356039,
        lng: 140.0751439,
        memo: MINZOKUKAN_MEMO,
        visitTime: t(12, 17),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "天鏡閣",
        address: "福島県耶麻郡猪苗代町翁沢御殿山1048-21",
        lat: 37.5212863,
        lng: 140.043482,
        memo: TENKYOKAKU_MEMO,
        visitTime: t(12, 59),
        stayDurationMin: 55,
        transitMode: "car",
        transitDurationMin: 7,
        transitLine: null,
      },
    },
    {
      create: {
        name: "諸橋近代美術館",
        address: "福島県耶麻郡北塩原村大字大西亜1093-23",
        lat: 37.6538545,
        lng: 140.0965274,
        memo: MOROHASHI_MEMO,
        visitTime: t(14, 19),
        stayDurationMin: 75,
        transitMode: "car",
        transitDurationMin: 25,
        transitLine: null,
      },
    },
    {
      create: {
        name: "磐梯山噴火記念館",
        address: "福島県耶麻郡北塩原村大字桧原字裏磐梯1093-697",
        lat: 37.6597561,
        lng: 140.0793817,
        memo: FUNKA_MEMO,
        visitTime: t(15, 38),
        stayDurationMin: 52,
        transitMode: "car",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
