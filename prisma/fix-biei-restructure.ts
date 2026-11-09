/**
 * 組み直し、22c9a16c（青い池とラベンダー畑、パッチワークの丘を巡る日帰りプラン）。(v2)
 *
 * 必ず直す: スポット名「新富良野プリンスホテル・ニングルテラス」の宿の名前(6章) →
 * 「ニングルテラス」に(03330540と同じ名前・同じ点)。メモからも宿の名前を外す
 *
 * 点の直し:
 *  - ケンとメリーの木 43.5975,142.4256(約3.4km南西にずれ) → OSM tourism=attraction
 *    node4227680193 43.6091513,142.4642772 (v1で書き込みが抜けていたので、ここで直す)
 *  - 十勝岳望岳台 43.6497,142.6875(約22km北にずれ) → OSM tourism=viewpoint
 *    node725272731 43.4475603,142.6499437
 *  - 四季彩の丘 43.5464,142.4869(丸め) → 03330540と同じ点 43.528404,142.467338
 *  - ニングルテラス 43.3167,142.375 → 03330540と同じ点 43.323431,142.356339
 *  - 白ひげの滝は変更なし(03330540と既に同じ点)
 *
 * 題の「青い池」がスポットになかったため、白ひげの滝の次に、03330540と同じ点
 * (43.492569,142.613641)で新しいスポット「青い池」を追加。「ラベンダー畑」もスポットの
 * 文になかったため、四季彩の丘の花の一覧にラベンダーを追加(公式情報で6月下旬〜8月ごろに
 * 見頃と確認)
 *
 * 望岳台96分・白ひげの滝53分は、展望・滝の見学としては長すぎる(決まりA)ため、45分に縮める。
 * 空いた時間は、延ばさずに実在の行き先で埋める: 青い池の次に、03330540と同じ点
 * (43.590755,142.454533)の「美瑛選果」(JR美瑛駅そばの直売所。レストラン・軽食の店があり、
 * 公式で確認。花の季節〈4〜10月ごろ〉が前提のこの旅では、冬季休業の店にはかからない)を
 * 追加し、昼食の場所にする(40分)。望岳台は、遊歩道・避難シェルターの見学時間を公式で
 * 確かめられなかったため30分に縮め、残りは1か所目の始まりを9:00→9:30に遅らせて吸収
 * (日帰りの始まりの範囲8:30〜9:30の中)。四季彩の丘79分・ニングルテラス62分は、既存の
 * メモに根拠(四季彩の丘: 約30種の花・アルパカの餌やり・トラクターバス「ノロッコ号」。
 * ニングルテラス: 約15棟の工房＋カフェを回る)があるため、長さは変えない
 *
 * 旅の足(すべてrouted-car実測):
 *  ケンとメリーの木→望岳台31分／望岳台→白ひげの滝7分／白ひげの滝→青い池5分／
 *  青い池→美瑛選果21分／美瑛選果→四季彩の丘9分／四季彩の丘→ニングルテラス29分
 *  時刻: 09:30(45)→望岳台10:46(30)→白ひげの滝11:23(45)→青い池12:13(25)→
 *  美瑛選果12:59(昼食40)→四季彩の丘13:48(79)→ニングルテラス15:36(62)→終わり16:38
 *  (日帰りの発車16:30〜17:00の中)
 *
 * ニングルテラスの最後に、帰りの一文(車でどこへ戻るか)がなかったため追加
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "22c9a16c-f753-481c-b2a1-e2c542feb897";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const KENMARY_NAME = "ケンとメリーの木";
const BOGAKUDAI_NAME = "十勝岳望岳台";
const SHIRAHIGE_NAME = "白ひげの滝";
const SHIKISAI_NAME = "四季彩の丘";
const NINGLE_OLD_NAME = "新富良野プリンスホテル・ニングルテラス";
const NINGLE_NEW_NAME = "ニングルテラス";

const KENMARY_LAT = 43.6091513;
const KENMARY_LNG = 142.4642772;
const BOGAKUDAI_LAT = 43.4475603;
const BOGAKUDAI_LNG = 142.6499437;
const SHIKISAI_LAT = 43.528404;
const SHIKISAI_LNG = 142.467338;
const NINGLE_LAT = 43.323431;
const NINGLE_LNG = 142.356339;
const AOIKE_LAT = 43.492569;
const AOIKE_LNG = 142.613641;
const BISEISENKA_LAT = 43.590755;
const BISEISENKA_LNG = 142.454533;

const KENMARY_MEMO_OLD =
  "JR美瑛駅から車で約15分、丘の畑の中にぽつんと立つ一本の木が、この旅のスタートです。一見ポプラと呼ばれることが多いのですが、正式にはセイヨウハコヤナギ、通称イタリアヤマナラシという品種にあたります。1976年に放送された日産スカイライン(4代目)のCM「地図のない旅」のロケ地となり、劇中の主人公カップル「ケン」と「メリー」の名前にちなんでこの愛称で呼ばれるようになりました。樹齢は100年を超え、高さは約30mにも達する堂々とした姿です。木のまわりは今も農家の方が使っている私有地のため、道路から静かに眺め、畑の中へは立ち入らないようにしましょう。これから望岳台や白ひげの滝など、パッチワークの丘の名所をめぐっていきます。";
const KENMARY_MEMO_NEW = KENMARY_MEMO_OLD.replace(
  "JR美瑛駅から車で約15分、",
  "JR美瑛駅からレンタカーで約15分、"
).replace(
  "これから望岳台や白ひげの滝など、パッチワークの丘の名所をめぐっていきます。",
  "この後は、車でおよそ31分、十勝岳望岳台へ向かいましょう。"
);

const BOGAKUDAI_MEMO_OLD =
  "ケンとメリーの木から山側へ向かうと、大雪山国立公園の一角、標高約930mに広がる十勝岳望岳台に着きます。目の前には今も活動を続ける十勝岳(標高2077m)の荒々しい火口原が迫り、旭岳や美瑛岳、美瑛富士、上富良野岳といった山々も一望できる大パノラマが広がります。1926年(大正15年)の十勝岳噴火では、山体崩壊にともなう融雪型泥流が上富良野・美瑛の方面まで押し寄せ、多くの犠牲者を出す大きな災害になったと伝えられています。この出来事を題材にしたのが、作家・三浦綾子が1976年から新聞連載した小説『泥流地帯』です。現地には、万一の噴火に備えた緊急避難用の防災シェルターも整備されています。なお望岳台は積雪のため、例年12月から4月下旬ごろまで冬期閉鎖となるので、訪れる際は時期にご注意ください。";
const BOGAKUDAI_MEMO_NEW = BOGAKUDAI_MEMO_OLD.replace(
  "ケンとメリーの木から山側へ向かうと、大雪山国立公園の一角、標高約930mに広がる十勝岳望岳台に着きます。",
  "ケンとメリーの木から車でおよそ31分、大雪山国立公園の一角、標高約930mに広がる十勝岳望岳台に着きます。"
).replace(
  "なお望岳台は積雪のため、例年12月から4月下旬ごろまで冬期閉鎖となるので、訪れる際は時期にご注意ください。",
  "なお望岳台は積雪のため、例年12月から4月下旬ごろまで冬期閉鎖となるので、訪れる時期に気をつけましょう。この後は、車でおよそ7分、白ひげの滝へ向かいましょう。"
);

const SHIRAHIGE_MEMO_OLD =
  "望岳台を後にして美瑛川沿いへ下りていくと現れるのが、白ひげの滝です。切り立った岩の隙間から幾筋もの地下水がしみ出し、滝となって流れ落ちる様子が、白い髭のように見えることからこの名がつきました。落差は約30mで、川の上流から水が流れ込むのではなく、地下水がそのまま崖から染み出して滝になる「潜流瀑」という珍しいタイプの滝で、日本国内でもこうした滝は数少ないと言われています。この滝の水と、周辺から美瑛川に流れ込むアルミニウム成分を含んだ水が合わさることで、川面がコバルトブルーに輝く「ブルーリバー」という現象が起こります。実はこの美しい青は、少し下流にある名所・青い池の青さにもつながっているのです。橋の上から見下ろす眺めは涼しげで、夏でもひんやりとした空気を感じられます。";
const SHIRAHIGE_MEMO_NEW = SHIRAHIGE_MEMO_OLD.replace(
  "望岳台を後にして美瑛川沿いへ下りていくと現れるのが、白ひげの滝です。",
  "望岳台から車でおよそ7分、美瑛川沿いへ下りていくと現れるのが、白ひげの滝です。"
).replace(
  "橋の上から見下ろす眺めは涼しげで、夏でもひんやりとした空気を感じられます。",
  "橋の上から見下ろす眺めは涼しげで、夏でもひんやりとした空気を感じられます。この後は、車でおよそ5分、青い池へ向かいましょう。"
);

const AOIKE_MEMO =
  "白ひげの滝から車でおよそ5分、「青い池」に着きます。上流から流れ込むアルミニウム成分を含んだ水が光を反射し、コバルトブルーに見えると言われています。立ち枯れたカラマツが水面から突き出す光景も特徴のひとつで、水の色は天候や水量によって日々変わるため、同じ青さに出会えるとは限りません。遊歩道から、池の縁に沿って眺めてみましょう。この後は、車でおよそ21分、美瑛選果へ向かいましょう。";

const BISEISENKA_MEMO =
  "青い池から車でおよそ21分、美瑛の特産品をそろえた直売所「美瑛選果」に着きます。地元の野菜や乳製品を使った軽食の店やレストランもあるので、ここで昼食にしましょう。11月の初めからは食事の店が休みになるので、公式の案内で確かめましょう。昼食を終えたら、車でおよそ9分、四季彩の丘へ向かいましょう。";

const SHIKISAI_MEMO_OLD =
  "次に訪れるのは、丘一面に花の絨毯が広がる四季彩の丘です。例年4月下旬から10月下旬ごろにかけて、春のチューリップに始まり、初夏のポピー、夏のヒマワリ、秋のサルビアやダリア、ケイトウまで、約30種もの草花が虹のような帯になって咲き継いでいきます。訪れる時期によって表情がまったく違うので、写真を撮る人たちにも人気の場所です。園内にはアルパカ牧場が通年で営業していて、餌やり体験ができるので、花のシーズンでなくても楽しめます。歩くにはやや広い丘なので、トラクターバスの「ノロッコ号」に乗って、座ったまま花畑を一望するのもおすすめです。次はいよいよ、森の中のクラフト工房が並ぶニングルテラスへ向かいます。";
const SHIKISAI_MEMO_NEW = SHIKISAI_MEMO_OLD.replace(
  "次に訪れるのは、丘一面に花の絨毯が広がる四季彩の丘です。",
  "美瑛選果から車でおよそ9分、丘一面に花の絨毯が広がる四季彩の丘に着きます。"
).replace(
  "夏のヒマワリ、",
  "夏のラベンダーやヒマワリ、"
).replace(
  "座ったまま花畑を一望するのもおすすめです。",
  "座ったまま花畑を一望できます。"
).replace(
  "次はいよいよ、森の中のクラフト工房が並ぶニングルテラスへ向かいます。",
  "この後は、車でおよそ29分、森の中のクラフト工房が並ぶニングルテラスへ向かいましょう。"
);

const NINGLE_MEMO_OLD =
  "この旅の締めくくりは、新富良野プリンスホテルの敷地内にあるニングルテラスです。「ニングル」とは、脚本家・倉本聰氏の舞台作品に登場する、北海道の森に住むという身長15cmほどの「森の知恵者」に由来する名前で、その世界観に惹かれた作家たちが、森の中に工房を構えたのがこのテラスの始まりだと伝えられています。約15棟のログハウスが木立の中に点在し、それぞれの工房では、木工やガラス工芸などすべて一点物の作品を手に取ることができます。すぐそばには、倉本氏脚本のドラマ『優しい時間』(2005年放送)の舞台になった喫茶店「珈琲 森の時計」があり、撮影が終わったあとも変わらず営業を続けています。日が暮れると木立の間に明かりがともり、昼間とはまた違う幻想的な雰囲気に包まれます。一日の締めくくりに、ゆっくりお土産探しを楽しんでください。";
const NINGLE_MEMO_NEW =
  "四季彩の丘から車でおよそ29分、この旅の締めくくり、森の中にあるニングルテラスに着きます。「ニングル」とは、脚本家・倉本聰氏の舞台作品に登場する、北海道の森に住むという身長15cmほどの「森の知恵者」に由来する名前で、その世界観に惹かれた作家たちが、森の中に工房を構えたのがこのテラスの始まりだと伝えられています。約15棟のログハウスが木立の中に点在し、それぞれの工房では、木工やガラス工芸などすべて一点物の作品を手に取ることができます。すぐそばには、倉本氏脚本のドラマ『優しい時間』(2005年放送)の舞台になった喫茶店があり、撮影が終わったあとも変わらず営業を続けています。日が暮れると木立の間に明かりがともり、昼間とはまた違う幻想的な雰囲気に包まれます。一日の締めくくりに、ゆっくりお土産探しを楽しみましょう。帰りは、車でおよそ37分のJR美瑛駅へ戻り、レンタカーを返しましょう。";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const kenmary = await prisma.spot.findFirstOrThrow({ where: { name: KENMARY_NAME, day: { itineraryId: ITIN_ID } } });
  const bogakudai = await prisma.spot.findFirstOrThrow({ where: { name: BOGAKUDAI_NAME, day: { itineraryId: ITIN_ID } } });
  const shirahige = await prisma.spot.findFirstOrThrow({ where: { name: SHIRAHIGE_NAME, day: { itineraryId: ITIN_ID } } });
  const shikisai = await prisma.spot.findFirstOrThrow({ where: { name: SHIKISAI_NAME, day: { itineraryId: ITIN_ID } } });
  const ningle = await prisma.spot.findFirstOrThrow({ where: { name: NINGLE_OLD_NAME, day: { itineraryId: ITIN_ID } } });

  if (kenmary.memo !== KENMARY_MEMO_OLD) throw new Error("ケンとメリーの木: memo現在値が期待と不一致");
  if (bogakudai.memo !== BOGAKUDAI_MEMO_OLD) throw new Error("十勝岳望岳台: memo現在値が期待と不一致");
  if (shirahige.memo !== SHIRAHIGE_MEMO_OLD) throw new Error("白ひげの滝: memo現在値が期待と不一致");
  if (shikisai.memo !== SHIKISAI_MEMO_OLD) throw new Error("四季彩の丘: memo現在値が期待と不一致");
  if (ningle.memo !== NINGLE_MEMO_OLD) throw new Error("ニングルテラス(旧名): memo現在値が期待と不一致");

  console.log(`\n[${KENMARY_NAME}] 座標: 43.5975,142.4256 → ${KENMARY_LAT},${KENMARY_LNG}\n旧: ${KENMARY_MEMO_OLD}\n新: ${KENMARY_MEMO_NEW}`);
  console.log(`\n[${BOGAKUDAI_NAME}] 座標: 43.6497,142.6875 → ${BOGAKUDAI_LAT},${BOGAKUDAI_LNG}、滞在96→30分\n旧: ${BOGAKUDAI_MEMO_OLD}\n新: ${BOGAKUDAI_MEMO_NEW}`);
  console.log(`\n[${SHIRAHIGE_NAME}] 滞在53→45分\n旧: ${SHIRAHIGE_MEMO_OLD}\n新: ${SHIRAHIGE_MEMO_NEW}`);
  console.log(`\n[青い池(新規)] 座標: ${AOIKE_LAT},${AOIKE_LNG}\n${AOIKE_MEMO}`);
  console.log(`\n[美瑛選果(新規、昼食)] 座標: ${BISEISENKA_LAT},${BISEISENKA_LNG}\n${BISEISENKA_MEMO}`);
  console.log(`\n[${SHIKISAI_NAME}] 座標: 43.5464,142.4869 → ${SHIKISAI_LAT},${SHIKISAI_LNG}\n旧: ${SHIKISAI_MEMO_OLD}\n新: ${SHIKISAI_MEMO_NEW}`);
  console.log(`\n[${NINGLE_OLD_NAME} → ${NINGLE_NEW_NAME}] 座標: 43.3167,142.375 → ${NINGLE_LAT},${NINGLE_LNG}\n旧: ${NINGLE_MEMO_OLD}\n新: ${NINGLE_MEMO_NEW}`);

  console.log("\n[時刻・区間の組み直し]");
  console.log("ケンとメリーの木 09:30(45分、始まりを9:00→9:30に遅らせた)");
  console.log("→car31→望岳台 10:46(30分、96分から縮めた)");
  console.log("→car7→白ひげの滝 11:23(45分、53分から縮めた)");
  console.log("→car5→青い池 12:13(25分)");
  console.log("→car21→美瑛選果 12:59(昼食40分、始まり11:30〜13:30の中)");
  console.log("→car9→四季彩の丘 13:48(79分、変更なし)");
  console.log("→car29→ニングルテラス 15:36(62分、変更なし)");
  console.log("→終わり16:38（日帰りの発車16:30〜17:00の中）");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  const dayId = kenmary.dayId;

  await setDaySpotOrder(
    dayId,
    [
      { id: kenmary.id, data: { lat: KENMARY_LAT, lng: KENMARY_LNG, memo: KENMARY_MEMO_NEW, visitTime: t(9, 30) } },
      {
        id: bogakudai.id,
        data: {
          lat: BOGAKUDAI_LAT,
          lng: BOGAKUDAI_LNG,
          memo: BOGAKUDAI_MEMO_NEW,
          visitTime: t(10, 46),
          stayDurationMin: 30,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 31 }] },
        },
      },
      {
        id: shirahige.id,
        data: {
          memo: SHIRAHIGE_MEMO_NEW,
          visitTime: t(11, 23),
          stayDurationMin: 45,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 7 }] },
        },
      },
      {
        create: {
          name: "青い池",
          lat: AOIKE_LAT,
          lng: AOIKE_LNG,
          memo: AOIKE_MEMO,
          visitTime: t(12, 13),
          stayDurationMin: 25,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 5 }] },
        },
      },
      {
        create: {
          name: "美瑛選果",
          lat: BISEISENKA_LAT,
          lng: BISEISENKA_LNG,
          memo: BISEISENKA_MEMO,
          visitTime: t(12, 59),
          stayDurationMin: 40,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 21 }] },
        },
      },
      {
        id: shikisai.id,
        data: {
          lat: SHIKISAI_LAT,
          lng: SHIKISAI_LNG,
          memo: SHIKISAI_MEMO_NEW,
          visitTime: t(13, 48),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 9 }] },
        },
      },
      {
        id: ningle.id,
        data: {
          name: NINGLE_NEW_NAME,
          lat: NINGLE_LAT,
          lng: NINGLE_LNG,
          memo: NINGLE_MEMO_NEW,
          visitTime: t(15, 36),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 29 }] },
        },
      },
    ],
    { remove: [] }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
