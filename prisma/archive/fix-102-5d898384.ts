/**
 * #102 5d898384 大仏さまと江ノ電、鎌倉の定番社寺と海を巡る日帰りプラン。
 * チェックリスト(20260929-itinerary-4spots-9to16)の決まりに合わせて組み直す。
 * 元は4か所(09:00〜13:20)で終了が16:30〜17:00に届いていなかった。あわせて、
 * タイトルに「江ノ電」「海を巡る」とあるのに、江ノ電にも海にも実際には
 * 立ち寄らない抜けがあったため、長谷寺のあとに由比ヶ浜・稲村ヶ崎(いずれも
 * 江ノ電で移動)を追加した。既存4スポットの文章はすでにツアーガイド口調では
 * なくサイト標準の書き方だったため、長谷寺の結びの一文だけ、最後のスポット
 * としての締めから次への案内に直した。
 *
 * 新規に追加したスポットの座標(Nominatim・GSI住所検索で確認):
 * - 由比ヶ浜: 35.3128167,139.541414(江ノ電由比ヶ浜駅付近の停留所)
 * - 稲村ヶ崎(新田義貞徒渉伝説地): 35.3016363888889,139.525558083333(GSI住所検索)
 *
 * 開いたURL(事実確認):
 * - 由比ヶ浜(1884年・長与専斎・夏目漱石『こころ』の舞台): https://ekinote.net/stations/00009127/posts/6394bd0d-fe5a-4535-ba84-3e16c2a32124/
 * - 稲村ヶ崎(新田義貞徒渉伝説・1333年鎌倉幕府滅亡・日本の歴史公園100選): https://miurahantou.jp/inamuragasaki-kouen/
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "鎌倉大仏や鶴岡八幡宮など、古都・鎌倉の定番スポットに加え、江ノ電に乗って由比ヶ浜・稲村ヶ崎の海辺の景色も楽しむ王道プランです。";

const HASEDERA_FROM = "鶴岡八幡宮から小町通り、高徳院、そして長谷寺へと巡ってきた今日の旅、最後は海を望む見晴台からの眺めで締めくくってはいかがでしょうか。";
const HASEDERA_TO = "境内高台の見晴台から海の眺めを楽しんだら、この後は、江ノ電に乗って由比ヶ浜へ向かいましょう。";

const YUIGAHAMA_MEMO =
  "長谷寺から江ノ電に乗り、ひと駅先の由比ヶ浜へ向かいます。明治17年(1884)、医学博士の長与専斎の勧めをきっかけに海水浴場として知られるようになり、夏目漱石の小説『こころ』の舞台としても描かれた、鎌倉を代表する海岸です。滑川を境に、東側は材木座海岸、西側が由比ヶ浜と呼ばれています。波打ち際を歩きながら、江の島や、晴れた日には富士山まで見渡せる、鎌倉の海の景色を眺めてみてください。この後は、江ノ電でさらに西へ、稲村ヶ崎へ向かいましょう。";

const INAMURAGASAKI_MEMO =
  "由比ヶ浜から江ノ電でさらに西へ、稲村ヶ崎に着きます。元弘3年(1333)、鎌倉幕府を攻めた新田義貞が、ここから稲村ヶ崎の海を渡って鎌倉へ攻め入ったと伝えられています。義貞が潮の引くことを念じて太刀を海に投げ入れたところ、みるみる潮が引いて軍勢を進めることができたという言い伝えから、「稲村ヶ崎(新田義貞徒渉伝説地)」として親しまれ、稲村ケ崎公園は「日本の歴史公園100選」にも選ばれています。江の島や富士山まで見渡せる景色は、鎌倉でも指折りの夕景スポットとして知られています。鶴岡八幡宮から小町通り、高徳院、長谷寺、そして海辺の由比ヶ浜・稲村ヶ崎へと、大仏さまと江ノ電、鎌倉の定番社寺と海を巡る旅はこれで終わりです。帰りは、稲村ヶ崎駅から江ノ電で鎌倉駅方面へお戻りください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5d898384%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const tsurugaoka = await findSpotInItinerary(itinId, { spotName: "鶴岡八幡宮" });
  const komachi = await findSpotInItinerary(itinId, { spotName: "小町通り" });
  const koutokuin = await findSpotInItinerary(itinId, { spotName: "高徳院（鎌倉大仏）" });
  const hasedera = await findSpotInItinerary(itinId, { spotName: "長谷寺" });

  if (!hasedera.memo!.includes(HASEDERA_FROM)) throw new Error("長谷寺の文言が想定外です");

  const day1Spots: SpotOrderItem[] = [
    { id: tsurugaoka.id, data: {} },
    { id: komachi.id, data: {} },
    { id: koutokuin.id, data: {} },
    { id: hasedera.id, data: { memo: hasedera.memo!.replace(HASEDERA_FROM, HASEDERA_TO) } },
    {
      create: {
        name: "由比ヶ浜",
        address: "神奈川県鎌倉市由比ガ浜",
        lat: 35.3128167,
        lng: 139.541414,
        memo: YUIGAHAMA_MEMO,
        visitTime: t(13, 30),
        stayDurationMin: 60,
        transitMode: "train",
        transitDurationMin: 10,
        transitLine: "江ノ島電鉄線",
      },
    },
    {
      create: {
        name: "稲村ヶ崎",
        address: "神奈川県鎌倉市稲村ガ崎",
        lat: 35.3016363888889,
        lng: 139.525558083333,
        memo: INAMURAGASAKI_MEMO,
        visitTime: t(14, 45),
        stayDurationMin: 110,
        transitMode: "train",
        transitDurationMin: 15,
        transitLine: "江ノ島電鉄線",
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
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
