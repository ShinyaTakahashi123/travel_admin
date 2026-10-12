/**
 * #104 62d86c73 岡山県立博物館、岡山の歴史と文化財を学ぶプラン。
 * チェックリスト(20260929-itinerary-4spots-9to16)の決まりに合わせて組み直す。
 * 元は岡山県立博物館1か所(09:30〜10:40)のみで、4か所未満・終了とも決まりに
 * 合っていなかった。隣接する実在の行き先(岡山後楽園・岡山城・林原美術館)を
 * 追加し、8:30〜9:30開始・16:30〜17:00終了の形にした。あわせて元の文章の
 * ツアーガイド口調(皆様/本日ご案内するのは/お楽しみいただけたことでしょう)も
 * サイト標準の口調に直した。
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - 岡山後楽園: 34.66633,133.937395 / 岡山城: 34.6651763,133.9360446
 * - 林原美術館: 34.6636065,133.9333856
 *
 * 開いたURL(事実確認):
 * - 岡山後楽園(1700年完成・池田綱政・日本三名園とされる・14.4ha): https://ja.wikipedia.org/wiki/%E5%BE%8C%E6%A5%BD%E5%9C%92
 * - 岡山城(宇喜多秀家・烏城・1945年空襲焼失・再建): https://ja.wikipedia.org/wiki/%E5%B2%A1%E5%B1%B1%E5%9F%8E
 * - 林原美術館(1964年開館・池田家伝来品・林原一郎コレクション): https://ja.wikipedia.org/wiki/%E6%9E%97%E5%8E%9F%E7%BE%8E%E8%A1%93%E9%A4%A8
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "後楽園に隣接する岡山県立博物館で、岡山ゆかりの考古資料や美術工芸品を鑑賞したあと、岡山後楽園・岡山城・林原美術館まで、岡山の歴史と文化財をじっくり学ぶプランです。";

const MUSEUM_MEMO =
  "旅の始まりは岡山県立博物館です。昭和46年(1971)、特別名勝・岡山後楽園に隣接する外苑内に開館した歴史博物館で、「岡山県の歴史と文化」をテーマに、考古資料や美術工芸品、古文書、民俗資料、刀剣、備前焼など、およそ1万5000件の収蔵資料を有しています。中でも、国宝「赤韋威鎧」や、岡山にゆかりの深い刀剣「太刀 銘則宗」「太刀 銘長光」といった国指定重要文化財は見どころの一つです。岡山県南部には、良質な日本刀の産地として知られた備前国・備中国があり、岡山は今も「刀どころ」として知られています。この後は、歩いておよそ8分、岡山後楽園へ向かいましょう。";

const KORAKUEN_MEMO =
  "岡山県立博物館から歩いておよそ8分、岡山後楽園に着きます。岡山藩2代藩主・池田綱政が、14年の歳月をかけて元禄13年(1700)に完成させた大名庭園で、水戸の偕楽園、金沢の兼六園とあわせて、日本三名園の一つとされています。およそ14.4haの広大な園内には、唯心山からの見晴らしや、茶畑・花葉の池、能舞台を備えた延養亭など、見どころが点在しています。岡山城を借景にした庭園の眺めも、この庭園ならではの魅力です。園内の茶屋で昼食にするのもおすすめです。この後は、歩いておよそ4分、岡山城へ向かいましょう。";

const CASTLE_MEMO =
  "岡山後楽園から歩いておよそ4分、岡山城に着きます。宇喜多秀家が、石山城を取り込む形で新たに本丸を築いたのが始まりで、黒漆塗りの下見板が陽光を受けて烏の羽のように輝くことから「烏城」とも呼ばれています。天守は昭和20年(1945)の空襲で焼失しましたが、現在は再建され、内部は歴史資料を展示する施設として公開されています。最上階からは、後楽園や旭川、岡山市街を見渡すことができます。この後は、歩いておよそ6分、林原美術館へ向かいましょう。";

const HAYASHIBARA_MEMO =
  "岡山城から歩いておよそ6分、林原美術館に着きます。岡山城二の丸対面所跡に建つ美術館で、昭和39年(1964)に開館しました。旧岡山藩主・池田家に伝わった大名道具と、岡山の実業家・林原一郎が集めた美術品を中心に収蔵しています。能装束や狂言装束など、能楽にまつわる優品も数多く、大きな長屋門をくぐった先に広がる静かな展示室で、ゆっくりと鑑賞できます。岡山県立博物館、岡山の歴史と文化財を学ぶ旅はこれで終わりです。帰りは、路面電車かバスで岡山駅方面へお戻りください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '62d86c73%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const museum = await findSpotInItinerary(itinId, { spotName: "岡山県立博物館" });

  const day1Spots: SpotOrderItem[] = [
    { id: museum.id, data: { memo: MUSEUM_MEMO, visitTime: t(9, 0), stayDurationMin: 70, transitMode: null, transitDurationMin: null, transitLine: null } },
    {
      create: {
        name: "岡山後楽園",
        address: "岡山県岡山市北区後楽園",
        lat: 34.66633,
        lng: 133.937395,
        memo: KORAKUEN_MEMO,
        visitTime: t(10, 18),
        stayDurationMin: 215,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      create: {
        name: "岡山城",
        address: "岡山県岡山市北区丸の内",
        lat: 34.6651763,
        lng: 133.9360446,
        memo: CASTLE_MEMO,
        visitTime: t(13, 57),
        stayDurationMin: 90,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      create: {
        name: "林原美術館",
        address: "岡山県岡山市北区丸の内",
        lat: 34.6636065,
        lng: 133.9333856,
        memo: HAYASHIBARA_MEMO,
        visitTime: t(15, 33),
        stayDurationMin: 60,
        transitMode: "walk",
        transitDurationMin: 6,
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
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
