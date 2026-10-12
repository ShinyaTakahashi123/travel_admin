/**
 * #60 fb4c9c64（有田・伊万里）企画運営(12:24)・法務(12:24)の指摘6点をまとめて対応。
 * 1) 窯元通り137→70分(決まりA水増し。鍋島藩窯公園の本文と内容が重なっていた点も、
 *    公園側の該当文を削除して解消)。空いた時間は、伊万里市陶器商家資料館の滞在
 *    (85分は商家1軒の見学として長め)を55分に短縮して分離し、伊万里駅前・伊万里川
 *    沿いの町なか散策(実在、伊万里駅前の古伊万里人形、白壁土蔵群が残るあいあい通り
 *    ※伊万里市公式PDF https://www.city.imari.lg.jp/secure/18351/TM01imari.pdf で
 *    確認、90分、まちなか2時間コースとして伊万里市観光協会も紹介)を新設。
 * 2) 鍋島藩窯公園の結び「伊万里・有田焼伝統産業会館へ」を、実際の次(伊万里鍋島焼
 *    会館)に合わせて修正。
 * 3) 案内口調(「皆様、本日ご案内するのは」「ご宿泊いただきます」「旅の2日目に
 *    ご案内するのは」「お楽しみください」「お楽しみいただけたことでしょう」
 *    「ご利用ください」)を「〜しましょう」「〜です」に統一。「記念にもぴったり
 *    です」も控えめに。
 * 4) 説明文「窯元通りとは違う」が、窯元通りを含む今の中身と逆になっていたため
 *    書き直し。
 * 5) 窯元通りの「めおとし」の言い伝えは出典を確認できなかったため削除。
 *
 * 座標: 伊万里駅前・町なか散策は伊万里駅(OSM node 6375703822)を実在の代替
 * アンカーに使用(人形・あいあい通りは駅のすぐそば)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "fb4c9c64-c7cb-4f7a-addd-c6eec4080b84";
const DAY2_ID = "b6ac32ca-f4ee-43ef-b124-09ee5ad33e72";

const NEW_DESCRIPTION =
  "有田焼のルーツを伝える有田町歴史民俗資料館と、伊万里商人の暮らしを伝える陶器商家資料館、そして大川内山の窯元通りまで。やきもの産業の歴史と、今も息づく窯元の技をめぐる1泊2日です。";

const ARITA_MUSEUM_MEMO_OPENING_FROM = "皆様、本日ご案内するのは有田町歴史民俗資料館です。";
const ARITA_MUSEUM_MEMO_OPENING_TO = "1日目は、有田町歴史民俗資料館からです。";

const MIFUNEYAMA_FROM = "今夜はこの近くの宿にご宿泊いただきます。";
const MIFUNEYAMA_TO = "今夜はこの近くの宿にお泊まりください。";

const SHOKKA_MEMO_NEW =
  "2日目は、伊万里市陶器商家資料館からです。江戸時代、伊万里港周辺は「千軒在所」と呼ばれるほど多くの陶器商家が軒を連ね、有田や周辺で焼かれた磁器を大阪や江戸へと積み出す一大拠点として栄えました。この資料館は、文政8年(1825)に建てられた陶器商・犬塚家の屋敷を修復・公開したもので、間口が狭く奥行きの深い、鰻の寝床のような伝統的な商家の造りを今に伝えています。白壁の土蔵造りの外観は重厚な風格を漂わせ、陶磁器を大阪や江戸へ積極的に出荷していた当時の伊万里商人の繁栄ぶりをしのばせます。この後は、歩いておよそ4分、伊万里駅前・伊万里川沿いの町なかへ向かいましょう。";

const MACHINAKA_MEMO =
  "伊万里市陶器商家資料館から歩いておよそ4分、伊万里駅前に着きます。駅前には、伊万里焼でつくられた大きな人形が並び、旅の記念に写真を撮る人も多いスポットです。ここから伊万里川沿いに広がる町なかを歩いてみましょう。川沿いの「あいあい通り」には、江戸時代から続く白壁の土蔵群が今も残り、伊万里津として栄えた頃の面影を伝えています。今も商いを続ける店が軒を連ねているので、この前後でお好みの店に立ち寄って、お昼をとるのもおすすめです。昨日訪れた有田の窯元の歴史とあわせて、やきものを商った町の歴史にふれるひとときを過ごしましょう。この後は、歩いておよそ11分、伊萬里神社へ向かいましょう。";

const IMARI_JINJA_FROM = "伊万里市陶器商家資料館から歩いておよそ9分、伊萬里神社に着きます。";
const IMARI_JINJA_TO = "伊万里駅前から歩いておよそ11分、伊萬里神社に着きます。";

const NABESHIMA_PARK_MEMO_NEW =
  "伊萬里神社からバスでおよそ20分、大川内山にある鍋島藩窯公園に着きます。延宝3年(1675)、佐賀藩・鍋島家がこの地に御用窯を移して以来、将軍家や大名への献上品として、採算を度外視した最高級の磁器「鍋島」がつくられてきました。技術の流出を防ぐため、周囲を山に囲まれたこの谷あいには関所が設けられ、明治になるまでその存在は広く知られていなかったといい、「秘窯の里」と呼ばれています。公園内には、当時の関所や登り窯、陶工の家などが復元され、今も30ほどの窯元が伝統の技を受け継いでいます。山あいに静かにたたずむ焼き物の里の風情を、ゆっくりと味わいましょう。この後は、歩いておよそ4分、大川内山の玄関口にある伊万里鍋島焼会館へ向かいましょう。";

const KAMAMOTODORI_MEMO_NEW =
  "伊万里鍋島焼会館から歩いておよそ4分、大川内山の窯元通りに着きます。谷あいの坂道におよそ30軒の窯元が軒を連ね、それぞれの窯ならではの器や作風を見比べながら歩けます。窯元の軒先から聞こえてくる風鈴の音色にも耳を傾けながら、山あいに静かにたたずむ焼き物の里の風情を、ゆっくりと味わいましょう。この後は、歩いておよそ4分、伊万里・有田焼伝統産業会館へ向かいましょう。";

const SANGYOKAIKAN_MEMO_NEW =
  "大川内山の窯元通りから歩いておよそ4分、伊万里・有田焼伝統産業会館に着きます。伊万里焼・有田焼の歴史や製法を紹介する施設で、大川内山の窯元めぐりの拠点としても利用されています。館内では、湯のみや皿などに絵付けを行う体験もでき、自分だけの器を作れます。旅の締めくくりに、伊万里・有田で受け継がれてきたやきものの技にふれましょう。有田町歴史民俗資料館と伊万里の商家、やきものの町の歴史をめぐった1泊2日でした。お帰りは、伊万里駅からバス・電車に乗りましょう。";

async function main() {
  // ---------- Day1: 口調のみ ----------
  const aritaMuseum = await findSpotInItinerary(ITIN, { spotName: "有田町歴史民俗資料館" });
  if (!aritaMuseum.memo!.includes(ARITA_MUSEUM_MEMO_OPENING_FROM)) throw new Error("一致しません(有田町歴史民俗資料館)");
  const newAritaMuseumMemo = aritaMuseum.memo!.split(ARITA_MUSEUM_MEMO_OPENING_FROM).join(ARITA_MUSEUM_MEMO_OPENING_TO);

  const mifuneyama = await findSpotInItinerary(ITIN, { spotName: "御船山楽園" });
  if (!mifuneyama.memo!.includes(MIFUNEYAMA_FROM)) throw new Error("一致しません(御船山楽園)");
  const newMifuneyamaMemo = mifuneyama.memo!.split(MIFUNEYAMA_FROM).join(MIFUNEYAMA_TO);

  // ---------- Day2 ----------
  const day2Spots: SpotOrderItem[] = [
    { id: "6c9f9754-0c75-4dda-9d36-a49526b28634", data: { memo: SHOKKA_MEMO_NEW, stayDurationMin: 55 } }, // 資料館
    {
      create: {
        name: "伊万里駅前・伊万里川沿いの町なか",
        address: "佐賀県伊万里市新天町",
        lat: 33.2719012,
        lng: 129.8760752,
        memo: MACHINAKA_MEMO,
        visitTime: t(9, 59),
        stayDurationMin: 90,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    { id: "e744d089-834b-4906-83d7-f7698615e57d", data: { memo: IMARI_JINJA_TO, visitTime: t(11, 40), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 11 } }, // 伊萬里神社
    { id: "e0ab5c7f-a3c3-4384-a724-8e7a58d665e7", data: { memo: NABESHIMA_PARK_MEMO_NEW, visitTime: t(12, 35), stayDurationMin: 75, transitMode: "bus", transitDurationMin: 20 } }, // 鍋島藩窯公園
    { id: "a98d9881-f3f0-488c-ab42-3cfc02fd308e", data: { visitTime: t(13, 54), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 4 } }, // 伊万里鍋島焼会館
    { id: "33f778b6-3fcb-40cf-b72f-0c9125016515", data: { memo: KAMAMOTODORI_MEMO_NEW, visitTime: t(14, 43), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 4 } }, // 窯元通り
    { id: "987b1f3d-528f-46b5-8cc0-bd87cdab4a0c", data: { memo: SANGYOKAIKAN_MEMO_NEW, visitTime: t(15, 57), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 4 } }, // 伝統産業会館
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day2Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt || st == null) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITIN }, data: { description: NEW_DESCRIPTION } });
    await updateSpotInItinerary(ITIN, { spotId: aritaMuseum.id }, { memo: newAritaMuseumMemo }, { tx });
    await updateSpotInItinerary(ITIN, { spotId: mifuneyama.id }, { memo: newMifuneyamaMemo }, { tx });
    await setDaySpotOrder(DAY2_ID, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
