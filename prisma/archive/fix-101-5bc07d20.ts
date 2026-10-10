/**
 * #101 5bc07d20 倉敷美観地区、白壁の町並みを歩く定番日帰りプラン。
 * チェックリスト(20260929-itinerary-4spots-9to16)の決まりに合わせて組み直す。
 * 元は倉敷美観地区1か所(09:30〜11:10)のみで、4か所未満・終了とも決まりに
 * 合っていなかった。美観地区内の実在の行き先(大原美術館・倉敷考古館・
 * 倉敷民藝館・倉敷アイビースクエア・阿智神社)を追加し、8:30〜9:30開始・
 * 16:30〜17:00終了の形にした。あわせて元の文章のツアーガイド口調
 * (皆様/本日ご案内するのは/お楽しみください/お楽しみいただけたことでしょう)も
 * サイト標準の口調に直した。
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - 大原美術館: 34.5960325,133.7704385 / 倉敷考古館: 34.5960380,133.7718630
 * - 倉敷民藝館: 34.5954816,133.7715039 / 倉敷アイビースクエア: 34.5945975,133.7733913
 * - 阿智神社: 34.5975294,133.7734429
 *
 * 開いたURL(事実確認):
 * - 大原美術館(1930年開館・大原孫三郎・児島虎次郎・日本初の私立西洋美術館): https://www.ohara.or.jp/history/
 * - 倉敷考古館(1950年開館・米蔵)・倉敷民藝館(1948年開館・外村吉之介): https://okayamastyle.com/kurashiki-koukokan/ , https://kuratoco.com/kurashiki_mingeikan/
 * - 倉敷アイビースクエア(1888年創業の倉敷紡績工場跡): https://ja.wikipedia.org/wiki/%E5%80%89%E6%95%B7%E7%BE%8E%E8%A6%B3%E5%9C%B0%E5%8C%BA
 * - 阿智神社(鶴形山・宗像三女神・阿知の藤、県天然記念物): https://kuratoco.com/achijinja/ , https://ja.wikipedia.org/wiki/%E9%98%BF%E6%99%BA%E7%A5%9E%E7%A4%BE_(%E5%80%89%E6%95%B7%E5%B8%82)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const BIKAN_MEMO =
  "旅の始まりは倉敷美観地区です。寛永19年(1642)、江戸幕府の直轄地「天領」となった倉敷は、物資の集散地として栄え、倉敷川沿いには、商人たちが築いた蔵や豪壮な屋敷が立ち並びました。中でも綿仲買商人の筆頭格だった大原家は、倉敷川の両岸に店舗と蔵を構えて地域の発展を支え、その旧宅は国の重要文化財に指定されています。柳並木と白壁の土蔵が続く町並みは、昭和44年(1969)に倉敷市の「倉敷川畔美観地区」に指定され、昭和54年(1979)には国の重要伝統的建造物群保存地区にも選ばれました。川面をゆったりと進む川舟に揺られながら、江戸時代の情緒あふれる町並みを眺めてみてください。この後は、歩いてすぐ、大原美術館へ向かいましょう。";

const OHARA_MEMO =
  "倉敷美観地区から歩いてすぐ、大原美術館に着きます。実業家・大原孫三郎が、前年に亡くなった画家・児島虎次郎を記念して、昭和5年(1930)に開館した、日本で最初の西洋美術中心の私立美術館です。虎次郎がヨーロッパで買い付けたモネ、マティス、エル・グレコ、ゴーギャンなどの名画をはじめ、日本の近・現代美術や東洋の古美術品など、およそ3000件を収蔵しています。ギリシャ神殿風の本館は、美術館そのものが見どころのひとつです。この後は、歩いておよそ3分、倉敷考古館へ向かいましょう。";

const KOUKOKAN_MEMO =
  "大原美術館から歩いておよそ3分、倉敷考古館に着きます。江戸期の米蔵を改装した建物で、昭和25年(1950)に開館しました。旧石器時代から中世にいたる吉備地方の出土品や、備前焼などを展示しています。ここで昼食にしましょう。この後は、歩いてすぐ、倉敷民藝館へ向かいましょう。";

const MINGEIKAN_MEMO =
  "倉敷考古館から歩いてすぐ、倉敷民藝館に着きます。江戸後期の米蔵を改装した建物で、昭和23年(1948)、初代館長・外村吉之介によって開館しました。歴史的な建物を保存活用した日本で最初期の例のひとつとされています。暮らしの中で使われてきた、丈夫で美しい日本各地や世界の民藝品の数々を見て回れます。この後は、歩いておよそ6分、倉敷アイビースクエアへ向かいましょう。";

const IVYSQUARE_MEMO =
  "倉敷民藝館から歩いておよそ6分、倉敷アイビースクエアに着きます。明治21年(1888)創業の倉敷紡績(クラボウ)倉敷本社工場の跡地を活用した複合施設です。蔦(アイビー)が絡まる赤レンガの建物が、工場の面影を今に伝えています。敷地内にはホテルやレストラン、資料館などが集まり、赤レンガの町並みを眺めながら、思い思いに過ごせます。この後は、歩いておよそ12分、阿智神社へ向かいましょう。";

const ACHI_MEMO =
  "倉敷アイビースクエアから歩いておよそ12分、鶴形山の山頂に鎮座する阿智神社に着きます。海上交通の安全を司る宗像三女神を祀る、倉敷中央地区の総鎮守です。境内にある「阿知の藤」は、樹齢300年とも500年ともいわれる古い藤棚で、岡山県の天然記念物に指定されています。参拝の際は、敬意を込めて手を合わせましょう。山頂からは、白壁の町並みを見渡す眺めも楽しめます。倉敷美観地区、白壁の町並みを歩く旅はこれで終わりです。帰りは、JR倉敷駅まで、歩いておよそ15分です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5bc07d20%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const bikan = await findSpotInItinerary(itinId, { spotName: "倉敷美観地区" });

  const day1Spots: SpotOrderItem[] = [
    { id: bikan.id, data: { memo: BIKAN_MEMO, visitTime: t(9, 0), stayDurationMin: 100, transitMode: null, transitDurationMin: null, transitLine: null } },
    {
      create: {
        name: "大原美術館",
        address: "岡山県倉敷市中央一丁目",
        lat: 34.5960325,
        lng: 133.7704385,
        memo: OHARA_MEMO,
        visitTime: t(10, 42),
        stayDurationMin: 110,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "倉敷考古館",
        address: "岡山県倉敷市中央一丁目",
        lat: 34.596038,
        lng: 133.771863,
        memo: KOUKOKAN_MEMO,
        visitTime: t(12, 35),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "倉敷民藝館",
        address: "岡山県倉敷市中央一丁目",
        lat: 34.5954816,
        lng: 133.7715039,
        memo: MINGEIKAN_MEMO,
        visitTime: t(13, 12),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "倉敷アイビースクエア",
        address: "岡山県倉敷市本町",
        lat: 34.5945975,
        lng: 133.7733913,
        memo: IVYSQUARE_MEMO,
        visitTime: t(13, 58),
        stayDurationMin: 90,
        transitMode: "walk",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
    {
      create: {
        name: "阿智神社",
        address: "岡山県倉敷市本町",
        lat: 34.5975294,
        lng: 133.7734429,
        memo: ACHI_MEMO,
        visitTime: t(15, 40),
        stayDurationMin: 55,
        transitMode: "walk",
        transitDurationMin: 12,
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
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
