/**
 * #99 43d3f547 伏見稲荷から平等院へ。朱と新緑に包まれる伏見・宇治めぐり。
 * チェックリスト(20260929-itinerary-4spots-9to16)の決まりに合わせて組み直す。
 * 元はD1 5か所(09:00〜14:35)・D2 5か所(09:00〜14:30)で、終了が16:30〜17:00に
 * 届いていなかった。あわせて、タイトルに「平等院へ」とあるのに肝心の平等院が
 * スポットに入っていない抜けも見つかったため、D1の最初に追加した。
 * D2は月桂冠大倉記念館・御香宮神社(いずれも伏見の酒蔵通り沿い、実在)を追加。
 * 既存スポットの滞在時間も、決まりAに沿って実在の内容を足す形で延ばした
 * (三室戸寺: 庭園を巡る一文を追加して70分に/萬福寺: 他の伽藍を見て回る一文を
 * 追加して100分に/伏見稲荷大社: 四ツ辻までの参道を上る案内を追加して90分に)。
 * 既存スポットの文章自体は、ツアーガイド口調ではなく、すでにサイト標準の
 * 落ち着いた書き方だったため、そのまま活かした。
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - 平等院: 34.8895001,135.8074525
 * - 月桂冠大倉記念館: 34.9288793,135.7616285
 * - 御香宮神社: 34.9340912,135.7673930
 *
 * 開いたURL(事実確認):
 * - 平等院(1052年・藤原頼通・鳳凰堂・国宝鳳凰像・10円硬貨): https://www.kyoto-su.ac.jp/about/koho/sagi/2021/10_01_sagi.html
 * - 月桂冠大倉記念館(1637年創業・1909年の酒蔵を改装・京都市有形民俗文化財): https://souda-kyoto.jp/blog/01269.html
 * - 御香宮神社(862年社殿修造の記録・御香水・名水百選・伏見城大手門の表門): https://ja.wikipedia.org/wiki/%E5%BE%A1%E9%A6%99%E5%AE%AE%E7%A5%9E%E7%A4%BE
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const BYODOIN_MEMO =
  "『源氏物語』の舞台としても知られる、宇治を代表する世界遺産です。平安時代、関白・藤原道長の別荘だった宇治殿を、子の頼通が永承7年(1052)に寺に改めたのが始まりと伝えられています。翌年に建てられた阿弥陀堂は、優美な姿から後に「鳳凰堂」と呼ばれるようになり、10円硬貨の意匠にも採用されています。屋根に据えられた一対の鳳凰像は国宝に指定され、旧一万円紙幣の鳳凰の意匠のモデルになったとも伝えられています。堂内に安置される本尊・阿弥陀如来坐像も国宝で、平安時代を代表する仏師・定朝の作と伝わります。1994年、宇治上神社とともに「古都京都の文化財」として世界遺産に登録されました。朝の静けさの中、池に姿を映す鳳凰堂の眺めを楽しんでみてください。";

const GENJI_MEMO_APPEND = "この後は、宇治橋界隈で昼食を済ませてから、宇治上神社へ向かいましょう。";

const MIMUROTOJI_APPEND = "本堂までの石段を上りながら、四季折々の花と向き合う時間を、ゆっくりと過ごせる寺です。";

const MANPUKUJI_APPEND = "広い境内には、他にも法堂・斎堂・伽藍堂など見どころが点在し、ひとつひとつじっくりと見て回れます。";

const GEKKEIKAN_MEMO =
  "寛永14年(1637)に創業した月桂冠の酒造りの歴史を伝える資料館です。明治42年(1909)に建てられた酒蔵を改装しており、仕込みに使われた木桶や酒樽、櫂など、京都市の有形民俗文化財に指定された古い酒造用具の数々を間近に見学できます。記念館の周辺には、伏見城の外堀だった濠川が流れ、白壁の酒蔵が水面に映る風景は、酒どころ・伏見を象徴する眺めとして親しまれています。見学の最後には、利き酒も楽しめます。";

const GOKOGU_MEMO =
  "伏見全体の氏神として崇敬される神社です。創建の詳しい由緒は分かっていませんが、貞観4年(862)に社殿を修造した記録が残ります。この年、境内から良い香りの水が湧き出し、その水を飲むと病が治ったという言い伝えから、時の清和天皇より「御香宮」の名を賜ったと伝えられています。この水は「御香水」として、今も境内で湧き、環境省の名水百選にも選ばれています。表門は、元和8年(1622)に徳川頼房が伏見城の大手門を拝領して寄進したものと伝わり、国の重要文化財に指定されています。界隈で昼食を済ませてから、藤森神社へ向かいましょう。";

const FUSHIMIINARI_APPEND = "時間に余裕があれば、四ツ辻までの参道を上り、伏見の街を見渡す眺めを楽しむのもおすすめです。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '43d3f547%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const nakamura = await findSpotInItinerary(itinId, { spotName: "中村藤吉本店" });
  const genji = await findSpotInItinerary(itinId, { spotName: "宇治市源氏物語ミュージアム" });
  const ujigami = await findSpotInItinerary(itinId, { spotName: "宇治上神社" });
  const mimurotoji = await findSpotInItinerary(itinId, { spotName: "三室戸寺" });
  const manpukuji = await findSpotInItinerary(itinId, { spotName: "萬福寺" });

  const teradaya = await findSpotInItinerary(itinId, { spotName: "寺田屋" });
  const jikkokubune = await findSpotInItinerary(itinId, { spotName: "十石舟（伏見）" });
  const fujinomori = await findSpotInItinerary(itinId, { spotName: "藤森神社" });
  const sekihoji = await findSpotInItinerary(itinId, { spotName: "石峰寺" });
  const fushimiinari = await findSpotInItinerary(itinId, { spotName: "伏見稲荷大社" });

  if (!genji.memo!.includes("平安貴族の暮らしぶりや物語の世界にふれられます。")) throw new Error("宇治市源氏物語ミュージアムの文言が想定外です");
  if (!mimurotoji.memo!.includes("ひときわ瑞々しい景色が楽しめます。")) throw new Error("三室戸寺の文言が想定外です");
  if (!manpukuji.memo!.includes("国宝に指定されています。")) throw new Error("萬福寺の文言が想定外です");
  if (!fushimiinari.memo!.includes("稲荷山を登る参拝コースも人気です。")) throw new Error("伏見稲荷大社の文言が想定外です");

  const day1Spots: SpotOrderItem[] = [
    {
      create: {
        name: "平等院",
        address: "京都府宇治市宇治蓮華",
        lat: 34.8895001,
        lng: 135.8074525,
        memo: BYODOIN_MEMO,
        visitTime: t(9, 0),
        stayDurationMin: 60,
        transitMode: null,
        transitDurationMin: null,
        transitLine: null,
      },
    },
    { id: nakamura.id, data: { visitTime: t(10, 3), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 3, transitLine: null } },
    {
      id: genji.id,
      data: {
        memo: genji.memo + GENJI_MEMO_APPEND,
        visitTime: t(10, 58),
        stayDurationMin: 65,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    { id: ujigami.id, data: { visitTime: t(12, 8), stayDurationMin: 75, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
    {
      id: mimurotoji.id,
      data: {
        memo: mimurotoji.memo + MIMUROTOJI_APPEND,
        visitTime: t(13, 33),
        stayDurationMin: 70,
        transitMode: "train",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    {
      id: manpukuji.id,
      data: {
        memo: manpukuji.memo + MANPUKUJI_APPEND,
        visitTime: t(14, 58),
        stayDurationMin: 100,
        transitMode: "train",
        transitDurationMin: 15,
        transitLine: null,
      },
    },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: teradaya.id, data: { visitTime: t(9, 0), stayDurationMin: 50, transitMode: null, transitDurationMin: null, transitLine: null } },
    { id: jikkokubune.id, data: { visitTime: t(9, 55), stayDurationMin: 41, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
    {
      create: {
        name: "月桂冠大倉記念館",
        address: "京都府京都市伏見区南浜町",
        lat: 34.9288793,
        lng: 135.7616285,
        memo: GEKKEIKAN_MEMO,
        visitTime: t(10, 46),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    {
      create: {
        name: "御香宮神社",
        address: "京都府京都市伏見区御香宮門前町",
        lat: 34.9340912,
        lng: 135.767393,
        memo: GOKOGU_MEMO,
        visitTime: t(11, 43),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 12,
        transitLine: null,
      },
    },
    { id: fujinomori.id, data: { visitTime: t(12, 33), stayDurationMin: 67, transitMode: "train", transitDurationMin: 15, transitLine: null } },
    { id: sekihoji.id, data: { visitTime: t(13, 45), stayDurationMin: 84, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
    {
      id: fushimiinari.id,
      data: {
        memo: fushimiinari.memo + FUSHIMIINARI_APPEND,
        visitTime: t(15, 14),
        stayDurationMin: 90,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, spots] of [["D1", day1Spots], ["D2", day2Spots]] as const) {
    console.log(`--- ${label} ---`);
    let prevEnd = -1;
    for (const x of spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = d.stayDurationMin as number | undefined;
      if (!vt) { console.log("(visitTime未変更)"); continue; }
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      if (st != null) prevEnd = s0 + st;
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
