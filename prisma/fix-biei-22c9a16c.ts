/**
 * 22c9a16c(青い池とラベンダー畑、パッチワークの丘を巡る日帰りプラン)の点ごと組み直し。
 *
 * 1. 美瑛選果(JAびえいが運営する直売所・レストランの複合施設、6章により行き先にしない)を、
 *    公共の道の駅「道の駅びえい『丘のくら』」(OSM way1094400433、highway=services)に替える。
 * 2. 四季彩の丘→(旧)美瑛選果の区間を、実測(OSRM routed-car)で測り直す(9分→16分に)。
 *    青い池→道の駅の区間は、実測19.8分の範囲内(21分のまま)。
 * 3. ニングルテラス(新富良野プリンスホテルの敷地内、6章により行き先にしない。a99d53ff・
 *    03330540・51cda3beと同じ判断)を外し、新栄の丘展望公園(OSM node4226581297、
 *    tourism=viewpoint、公共の展望公園)・北西の丘展望公園(51cda3beと同じ点)の2か所に替える。
 * 4. 四季彩の丘の点そのものの直しは、4本に影響するため別スクリプト(fix-shikisainooka-4itin.ts)
 *    で行う。このスクリプトでは四季彩の丘の点は変えない。
 *
 * 使い方: npm run prod -- npx tsx prisma/fix-biei-22c9a16c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

const ITINERARY_ID = "22c9a16c-f753-481c-b2a1-e2c542feb897";
const DAY_ID = "f0910243-467c-41df-b54b-415c68b3c874";

const OLD_DESCRIPTION =
  "1本の木が丘に立つケンとメリーの木から、十勝岳を望む望岳台、轟音とともに流れ落ちる白ひげの滝、コバルトブルーの青い池、昼食をとる美瑛選果、色とりどりの花が咲く四季彩の丘、森の中にクラフト工房が並ぶニングルテラスまで。富良野・美瑛の丘の風景を1日で回るプランです。";
const NEW_DESCRIPTION =
  "1本の木が丘に立つケンとメリーの木から、十勝岳を望む望岳台、轟音とともに流れ落ちる白ひげの滝、コバルトブルーの青い池、昼食をとる道の駅、色とりどりの花が咲く四季彩の丘、丘陵地帯を見渡す展望公園まで。富良野・美瑛の丘の風景を1日で回るプランです。";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

// [1]-[4] は変更なし。各スポットの id と、着時刻・滞在・区間(新しい値)を1か所にまとめる。
const SPOTS: {
  label: string;
  id?: string; // 既存スポットを残す場合。なければ新規作成
  name: string;
  lat: number;
  lng: number;
  visitTime: Date;
  stayDurationMin: number;
  memo: string;
  legMin: number | null; // このスポットに着くまでの車の分。先頭はnull
}[] = [
  {
    label: "ケンとメリーの木(変更なし)",
    id: "234fc458-5f82-4d8d-a54e-c913ab86d1ea",
    name: "ケンとメリーの木",
    lat: 43.609151,
    lng: 142.464277,
    visitTime: T(9, 30),
    stayDurationMin: 45,
    memo: "JR美瑛駅の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ9分、丘の畑の中にぽつんと立つ一本の木が、この旅のスタートです。一見ポプラと呼ばれることが多いのですが、正式にはセイヨウハコヤナギ、通称イタリアヤマナラシという品種にあたります。1976年に放送された日産スカイライン(4代目)のCM「地図のない旅」のロケ地となり、劇中の主人公カップル「ケン」と「メリー」の名前にちなんでこの愛称で呼ばれるようになりました。樹齢は100年を超え、高さは約30mにも達する堂々とした姿です。木のまわりは今も農家の方が使っている私有地のため、道路から静かに眺め、畑の中へは立ち入らないようにしましょう。この後は、車でおよそ31分、十勝岳望岳台へ向かいましょう。",
    legMin: null,
  },
  {
    label: "十勝岳望岳台(変更なし)",
    id: "01368d7f-bdbe-47c3-a366-7d4f3de8354d",
    name: "十勝岳望岳台",
    lat: 43.44756,
    lng: 142.649944,
    visitTime: T(10, 46),
    stayDurationMin: 30,
    memo: "ケンとメリーの木から車でおよそ31分、大雪山国立公園の一角、標高約930mに広がる十勝岳望岳台に着きます。目の前には今も活動を続ける十勝岳(標高2077m)の荒々しい火口原が迫り、旭岳や美瑛岳、美瑛富士、上富良野岳といった山々も一望できる大パノラマが広がります。1926年(大正15年)の十勝岳噴火では、山体崩壊にともなう融雪型泥流が上富良野・美瑛の方面まで押し寄せ、多くの犠牲者を出す大きな災害になったと伝えられています。この出来事を題材にしたのが、作家・三浦綾子が1976年から新聞連載した小説『泥流地帯』です。現地には、万一の噴火に備えた緊急避難用の防災シェルターも整備されています。なお望岳台は積雪のため、例年12月から4月下旬ごろまで冬期閉鎖となるので、訪れる時期に気をつけましょう。この後は、車でおよそ7分、白ひげの滝へ向かいましょう。",
    legMin: 31,
  },
  {
    label: "白ひげの滝(変更なし)",
    id: "a6ed5fc4-b3b8-4a7d-a85c-9d850d903de3",
    name: "白ひげの滝",
    lat: 43.474583,
    lng: 142.639187,
    visitTime: T(11, 23),
    stayDurationMin: 45,
    memo: "望岳台から車でおよそ7分、美瑛川沿いへ下りていくと現れるのが、白ひげの滝です。切り立った岩の隙間から幾筋もの地下水がしみ出し、滝となって流れ落ちる様子が、白い髭のように見えることからこの名がつきました。落差は約30mで、川の上流から水が流れ込むのではなく、地下水がそのまま崖から染み出して滝になる「潜流瀑」という珍しいタイプの滝で、日本国内でもこうした滝は数少ないと言われています。この滝の水と、周辺から美瑛川に流れ込むアルミニウム成分を含んだ水が合わさることで、川面がコバルトブルーに輝く「ブルーリバー」という現象が起こります。実はこの美しい青は、少し下流にある名所・青い池の青さにもつながっているのです。橋の上から見下ろす眺めは涼しげで、夏でもひんやりとした空気を感じられます。この後は、車でおよそ5分、青い池へ向かいましょう。",
    legMin: 7,
  },
  {
    label: "青い池(変更なし。結びの行き先名だけ変更)",
    id: "45631dc0-11d8-48bc-8b08-9c969b370356",
    name: "青い池",
    lat: 43.492569,
    lng: 142.613641,
    visitTime: T(12, 13),
    stayDurationMin: 25,
    memo: "白ひげの滝から車でおよそ5分、「青い池」に着きます。上流から流れ込むアルミニウム成分を含んだ水が光を反射し、コバルトブルーに見えると言われています。立ち枯れたカラマツが水面から突き出す光景も特徴のひとつで、水の色は天候や水量によって日々変わるため、同じ青さに出会えるとは限りません。遊歩道から、池の縁に沿って眺めてみましょう。この後は、車でおよそ25分、道の駅びえい「丘のくら」へ向かいましょう。",
    legMin: 5,
  },
  {
    label: "道の駅びえい「丘のくら」(旧:美瑛選果。行き先替え)",
    id: "744bf371-4915-4bc6-97dd-2ab99d17e61e",
    name: "道の駅びえい「丘のくら」",
    lat: 43.592280,
    lng: 142.463979,
    visitTime: T(13, 3),
    stayDurationMin: 40,
    memo: "青い池から車でおよそ25分、JR美瑛駅のそばにある道の駅びえい「丘のくら」に着きます。大正時代に建てられた、美瑛軟石づくりの石造りの倉庫を改装した建物で、地元の食材を使う食堂や、町内の売り場がある休憩施設です。ここで昼食にしましょう。昼食を終えたら、車でおよそ16分、四季彩の丘へ向かいましょう。",
    legMin: 25,
  },
  {
    label: "四季彩の丘(視点・結びの行き先名・分を変更。点は別スクリプトで直す)",
    id: "163b256d-d919-4f96-bf11-c789d57480b9",
    name: "四季彩の丘",
    lat: 43.528404,
    lng: 142.467338,
    visitTime: T(13, 59),
    stayDurationMin: 79,
    memo: "道の駅びえい「丘のくら」から車でおよそ16分、丘一面に花の絨毯が広がる四季彩の丘に着きます。例年4月下旬から10月下旬ごろにかけて、春のチューリップに始まり、初夏のポピー、夏のラベンダーやヒマワリ、秋のサルビアやダリア、ケイトウまで、約30種もの草花が虹のような帯になって咲き継いでいきます。訪れる時期によって、丘の表情がまったく違って見えます。この後は、車でおよそ12分、新栄の丘展望公園へ向かいましょう。",
    legMin: 16,
  },
  {
    label: "新栄の丘展望公園(新規。旧ニングルテラスの行を差し替え)",
    id: "0d9b4434-1393-4bf4-b1e0-7c210e339068",
    name: "新栄の丘展望公園",
    lat: 43.557639,
    lng: 142.459465,
    visitTime: T(15, 30),
    stayDurationMin: 20,
    memo: "四季彩の丘から車でおよそ12分、美瑛町美馬牛にある新栄の丘展望公園に着きます。なだらかな丘の上に広がる、入園無料の展望公園です。東側には十勝岳連峰がそびえ、麦やじゃがいもの畑が広がる丘陵地帯を、360度にわたって見渡せます。この後は、車でおよそ15分、北西の丘展望公園へ向かいましょう。",
    legMin: 12,
  },
  {
    label: "北西の丘展望公園(新規。この旅の締めくくり)",
    name: "北西の丘展望公園",
    lat: 43.60519,
    lng: 142.45661,
    visitTime: T(16, 5),
    stayDurationMin: 45,
    memo: "新栄の丘展望公園から車でおよそ15分、美瑛の丘めぐりの締めくくりとなる北西の丘展望公園に着きます。ゆるやかな丘の上に、ピラミッド形をした白い展望台が立っていて、階段を上ると、十勝岳連峰まで続く丘陵地帯をぐるりと見渡せます。園内には季節ごとの花々も植えられ、ラベンダーが咲く時期には、紫の畝と丘の起伏が織りなす眺めを楽しめます。見学を終えたら、車でおよそ10分のJR美瑛駅でレンタカーを返して、帰りましょう。",
    legMin: 15,
  },
];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  console.log("\n【説明文】");
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID } });
  if (it.description !== OLD_DESCRIPTION) {
    throw new Error(`説明文が期待と不一致です。現在: ${it.description}`);
  }
  console.log(`旧: ${OLD_DESCRIPTION}`);
  console.log(`新: ${NEW_DESCRIPTION}`);

  console.log("\n【スポット】");
  for (const s of SPOTS) {
    console.log(`[${s.label}]`);
    console.log(`  名前: ${s.name}`);
    console.log(`  点: ${s.lat},${s.lng}`);
    console.log(`  着: ${s.visitTime.toISOString().slice(11, 16)} 滞在: ${s.stayDurationMin}分 区間: ${s.legMin === null ? "(先頭)" : s.legMin + "分(車)"}`);
    console.log(`  memo: ${s.memo}`);
    console.log();
  }

  const last = SPOTS[SPOTS.length - 1];
  const endMin = last.visitTime.getUTCHours() * 60 + last.visitTime.getUTCMinutes() + last.stayDurationMin + 10; // +10=北西の丘展望公園→JR美瑛駅
  const endH = Math.floor(endMin / 60);
  const endM = endMin % 60;
  console.log(`最後(${last.name})発、JR美瑛駅着: ${endH}:${String(endM).padStart(2, "0")}(16:30〜17:00に収まる想定)`);

  if (!commit) {
    console.log("\n(確認モード。--commit で書き込みます)");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: NEW_DESCRIPTION } });

    await setDaySpotOrder(
      DAY_ID,
      SPOTS.map((s) =>
        s.id
          ? { id: s.id, data: { name: s.name, lat: s.lat, lng: s.lng, visitTime: s.visitTime, stayDurationMin: s.stayDurationMin, memo: s.memo } }
          : { create: { name: s.name, lat: s.lat, lng: s.lng, visitTime: s.visitTime, stayDurationMin: s.stayDurationMin, memo: s.memo } }
      ),
      { tx }
    );

    // 区間(車の分)を、新しい並びに合わせて1件ずつ作り直す(先頭スポットは区間なし)
    const spots = await tx.spot.findMany({ where: { dayId: DAY_ID }, orderBy: { orderNo: "asc" } });
    for (let i = 0; i < spots.length; i++) {
      const legMin = SPOTS[i].legMin;
      await tx.spotTransitLeg.deleteMany({ where: { spotId: spots[i].id } });
      if (legMin !== null) {
        await tx.spotTransitLeg.create({
          data: { spotId: spots[i].id, orderNo: 1, transitMode: "car", transitDurationMin: legMin },
        });
      }
    }
  });
  console.log("\n書き込みました。");
}
main().finally(() => prisma.$disconnect());
