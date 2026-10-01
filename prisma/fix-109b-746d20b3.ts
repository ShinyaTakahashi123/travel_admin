/**
 * #109 746d20b3(郡上八幡)の直し(2回目)。企画運営(2026-10-01 12:28)・
 * 法務(2026-10-01 12:29)の指摘。
 *
 * 企画運営の5点:
 * 1. 郡上八幡城116分は決まりAの水増し。60分(#36 1cfd3212と同じ実際の
 *    長さ)に戻し、空いた時間は郡上八幡旧庁舎記念館・職人町鍛冶屋町を
 *    新しく足した。この2か所は#36 1cfd3212でも使われているが、#36の
 *    実際の本文を確認し、取り上げる事実・文章とも書き分けた(旧庁舎
 *    記念館は#36が建物の建築技術を中心に書いているのに対し、こちらは
 *    もと町役場だった歴史を中心に。職人町鍛冶屋町は#36が改修の歴史
 *    〈遠藤常友・元禄5年の家帳〉を中心に書いているのに対し、こちらは
 *    今の町並みの様子を中心に書いた)。郡上八幡城自体の文言も、#36と
 *    ほぼ同じだった「最上階から城下町と吉田川を一望」のくだりを書き
 *    直し、司馬遼太郎の評(#36にはない)を加えて書き分けた。
 * 2. サンプルビレッジいわさきの公式の営業時間が10:00〜16:00(WebSearchで
 *    確認)で、1日目最初のスポットとして9:00着にすると開店前になって
 *    しまうと判明。順番を組み替え、屋外で時間の制約がないいがわ小径を
 *    1日目最初にし、いわさきは開店後の2番目に回した。いがわ小径の
 *    書き出しに朝の行き方(郡上八幡ICから車)を追加。
 * 3・法務 サンプルビレッジいわさきの「体験は有料・要予約のため」(料金の
 *    言葉)を「体験は予約が必要なため、訪れる前に公式サイトで確かめ
 *    ましょう」に直した。
 * 4. サンプルビレッジいわさきの滞在100分を、公式の体験時間(天ぷら体験
 *    基本コースで20分、全体でも15〜60分程度とWebSearchで確認)に合わせ、
 *    見学もあわせて55分にした。空いた時間は上記の新しい2か所で埋めた。
 * 5. 「公式サイトで確認してください」を「確かめましょう」に統一(博覧館・
 *    いわさきとも)。
 *
 * 新規2か所の座標は#36で使われている値をそのまま使用(同じ場所のため):
 * - 郡上八幡旧庁舎記念館 35.752441,136.959213
 * - 職人町・鍛冶屋町 35.75341,136.955917
 *
 * 事実確認(開いたURL):
 * - サンプルビレッジいわさきの営業時間(10:00〜16:00、体験受付15:00まで)・
 *   体験時間(天ぷら体験基本コース約20分、全体15〜60分程度):
 *   https://www.sowxp.co.jp/catalogs/5/courses/14696 ほか
 * - 郡上八幡旧庁舎記念館(昭和11年1936築・郡上郡八幡町役場として建設・
 *   平成6年1994まで役場として使用・平成10年1998登録有形文化財・
 *   翌年観光案内所にリニューアル): https://ja.wikipedia.org/wiki/郡上八幡旧庁舎記念館
 * - 郡上八幡博覧館の開館時間(9:30〜17:00、最終入館16:30): https://hakurankan.com/guide
 *
 * 新しい順番: いがわ小径→サンプルビレッジいわさき→やなか水のこみち→
 * 宗祇水→郡上八幡旧庁舎記念館(新規)→郡上八幡博覧館→職人町鍛冶屋町
 * (新規)→郡上八幡城。09:00〜16:30。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const IGAWA_MEMO =
  "郡上八幡ICから車でおよそ5分、旅の始まりはいがわ小径です。郡上八幡旧庁舎記念館の裏手を流れる島谷用水沿いの小径です。江戸時代から続く生活用水路で、かつては炊事や洗い物にも使われていました。長良川の支流・吉田川から引かれた清らかな水が絶えず流れ、アマゴやイワナなどの川魚のほか、たくさんの鯉が泳ぐ姿を眺められます。「水の町」と呼ばれる郡上八幡の暮らしぶりを間近に感じられるスポットです。この後は、車でおよそ15分、サンプルビレッジいわさきへ向かいましょう。";

const IWASAKI_MEMO =
  "いがわ小径から車でおよそ15分、サンプルビレッジいわさきに着きます。食品サンプルづくりを日本で初めて事業化したとされるのが、郡上八幡出身の岩崎瀧三です。昭和6年(1931)に精巧なオムライスの模型を完成させ、翌年に大阪で岩崎製作所を創業しました。昭和30年(1955)、故郷に貢献したいと郡上八幡に工場を設けたことをきっかけに、ここで技術を身につけた職人たちが独立し、郡上市は食品サンプルの一大産地となりました。天ぷらなど本物そっくりの食品サンプルづくりを実際に体験できます。体験は予約が必要なため、訪れる前に公式サイトで確かめましょう。この後は、車でおよそ10分、やなか水のこみちへ向かいましょう。";

const YANAKA_MEMO =
  "サンプルビレッジいわさきから車でおよそ10分、やなか水のこみちに着きます。昭和63年(1988)、生活道路だった小径を、長良川と吉田川で採れた玉石8万個を敷き詰めて整備した遊歩道です。小径沿いには小さな水路が流れ、柳並木とともに、郡上八幡らしい落ち着いた風情を醸し出しています。地元の住民による清掃活動で、今も美しい景観が保たれています。住宅のそばの小径ですので、静かに歩きましょう。周辺には食事処も点在しているので、この付近で昼食にしましょう。この後は、歩いておよそ3分、宗祇水へ向かいましょう。";

const SOGISUI_MEMO =
  "やなか水のこみちから歩いておよそ3分、宗祇水に着きます。文明3年(1471)、連歌の宗匠として知られた飯尾宗祇が、京へ帰る際にこの泉のほとりで東常縁と歌を交わし、郡上に滞在していた間はこの清水を愛して草庵を結んだと伝えられています。昭和60年(1985)、環境庁の名水百選の第1号に選ばれました。湧き出る水は、上流から飲用・米とぎや食べ物を洗う場・洗濯の順に使い分けられ、今も地域の人々によって大切に守られています。この後は、歩いておよそ6分、郡上八幡旧庁舎記念館へ向かいましょう。";

const KYUCHOSHA_MEMO =
  "宗祇水から歩いておよそ6分、郡上八幡旧庁舎記念館に着きます。昭和11年(1936)、郡上郡八幡町の役場として建てられ、平成6年(1994)まで実際に町役場として使われていました。平成10年(1998)に国の登録有形文化財となり、翌年には観光案内所として生まれ変わっています。館内には、昭和初期の雰囲気を再現した休憩スペースのほか、地元グルメの食事処やお土産店もあります。この後は、歩いておよそ4分、郡上八幡博覧館へ向かいましょう。";

const HAKURANKAN_MEMO =
  "郡上八幡旧庁舎記念館から歩いておよそ4分、郡上八幡博覧館に着きます。大正9年(1920)に建てられた旧税務署の建物を活用した博物館で、「水」「歴史」「わざ」「郡上おどり」の4つのコーナーで郡上八幡を紹介しています。「わざ」コーナーでは、郡上紬や郡上本染といった伝統工芸とともに、郡上八幡が発祥の地とされる食品サンプルも見られます。「郡上おどり」コーナーでは、国の重要無形民俗文化財に指定されている郡上おどり十種の踊り方を、映像やパネルで紹介するほか、館内での実演も行われています（実演の回数・時間は変わることがあるため、公式サイトで確かめましょう）。この後は、歩いておよそ3分、職人町・鍛冶屋町へ向かいましょう。";

const SHOKUNINMACHI_MEMO =
  "郡上八幡博覧館から歩いておよそ3分、職人町・鍛冶屋町に着きます。江戸時代の城下町の面影を今に伝える町並みで、格子戸の家々が軒を連ねています。通りの両脇を流れる水路では、今も地元の人が野菜や食器を洗う姿を見かけることがあり、水と暮らしが一体となった郡上八幡ならではの風景です。郡上本染の工房をはじめ、鍛冶屋や桶屋など、昔ながらの職人の仕事を伝える店も点在しています。今も人が暮らす町並みですので、家の敷地に入らず、静かに歩きましょう。この後は、歩いておよそ7分、郡上八幡城へ向かいましょう。";

const GUJOHACHIMANJO_MEMO =
  "職人町・鍛冶屋町から歩いておよそ7分、この旅の締めくくり、郡上八幡城に着きます。永禄2年(1559)、遠藤盛数がこの山に砦を築いたのが始まりとされ、現在の天守は昭和8年(1933)、大垣城を参考に再建された、日本最古の木造再建天守とされる4層5階の建物です。司馬遼太郎は、この城を「日本でもっとも美しい山城」と評しました。眼下に広がる城下町の家並みと、山あいを流れる吉田川の眺めを楽しみましょう。郡上八幡の水とものづくり、歴史をめぐる旅はこれで終わりです。帰りは、郡上八幡ICから東海北陸自動車道で戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '746d20b3%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const iwasaki = await findSpotInItinerary(itinId, { spotName: "サンプルビレッジいわさき" });
  const igawa = await findSpotInItinerary(itinId, { spotName: "いがわ小径" });
  const yanaka = await findSpotInItinerary(itinId, { spotName: "やなか水のこみち" });
  const sogisui = await findSpotInItinerary(itinId, { spotName: "宗祇水" });
  const hakurankan = await findSpotInItinerary(itinId, { spotName: "郡上八幡博覧館" });
  const jo = await findSpotInItinerary(itinId, { spotName: "郡上八幡城" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: igawa.id, data: { memo: IGAWA_MEMO, visitTime: t(9, 0), stayDurationMin: 45, transitMode: null, transitDurationMin: null } },
    { id: iwasaki.id, data: { memo: IWASAKI_MEMO, visitTime: t(10, 0), stayDurationMin: 55, transitMode: "car", transitDurationMin: 15 } },
    { id: yanaka.id, data: { memo: YANAKA_MEMO, visitTime: t(11, 5), stayDurationMin: 55, transitMode: "car", transitDurationMin: 10 } },
    { id: sogisui.id, data: { memo: SOGISUI_MEMO, visitTime: t(12, 3), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 3 } },
    {
      create: {
        name: "郡上八幡旧庁舎記念館",
        address: "岐阜県郡上市八幡町島谷520",
        lat: 35.752441,
        lng: 136.959213,
        memo: KYUCHOSHA_MEMO,
        visitTime: t(12, 29),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
    { id: hakurankan.id, data: { memo: HAKURANKAN_MEMO, visitTime: t(13, 13), stayDurationMin: 75, transitMode: "walk", transitDurationMin: 4 } },
    {
      create: {
        name: "職人町・鍛冶屋町",
        address: "岐阜県郡上市八幡町職人町",
        lat: 35.75341,
        lng: 136.955917,
        memo: SHOKUNINMACHI_MEMO,
        visitTime: t(14, 31),
        stayDurationMin: 52,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    { id: jo.id, data: { memo: GUJOHACHIMANJO_MEMO, visitTime: t(15, 30), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 7 } },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
