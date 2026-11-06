/**
 * e6eb7aab(あべのキューズモールと路面電車、下町ショッピング日帰りプラン)の組み直し(2026-11-06、しおりえ(制作補助2))。
 * docs/specs/20261105-facility-rework.md・docs/content/20261102-daytrip-coord-scan.md(組み直しの欄)。
 * 企画運営の答え(11/06 9時台): 阪堺の公式(hankai.co.jp)は 503 のまま。市・府にも電車の区間の分がないため、電車に乗らない歩きの旅にする
 *   (11/04 の「公式を待つ」案1は取りやめ)。ハルカスは 6ff2703e・6d8232c0 にあるので外す。目的タグ ショッピング→神社・城・史跡。
 * 法務の頼み(09:19): 晴明の創建は社伝の形／帝塚山古墳は「まわりでは、静かに過ごしましょう」、中に入る書き方をしない／
 *   「絶景」を写さない／粉浜は「粉浜商店街のあたり」・店や食べ物を書かない・通りの点／住吉公園の「最古」は同じ文に「とされます」。
 * 外す: 阪堺電車天王寺駅前停留場(写真1)・あべのキューズモール(写真1)・あべのハルカス。表紙は桃ヶ池公園の写真にする。
 * 足す: 万代池公園・帝塚山古墳・生根神社・浅澤社。粉浜商店街→「粉浜商店街のあたりで昼食」に改名。
 * 点(OSM):
 *   桃ヶ池公園 股ヶ池明神 amenity=place_of_worship way1464192606 の平均(名前のある入口・案内板・バス停が OSM・地理院にない。企画運営の例外)
 *   晴明・阿倍王子・住吉大社は 6ff2703e と同じ点(そのまま／住吉大社は 34.61271,135.493 から直す)
 *   万代池公園 「自動車文庫ステーション万代池公園北東入口」node11607277109(大阪市立図書館の名前。企画運営の例外)
 *   帝塚山古墳 解説板「史跡 帝塚山古墳」node7288786968(企画運営の例外)
 *   生根神社 「生根神社（上の天神）」amenity=place_of_worship node6153472445
 *   昼食 「粉浜商店街」highway=pedestrian way181266164 の北の端 node1916987741(生の値)
 *   浅澤社 amenity=place_of_worship way530933348 の平均／高燈籠「住吉高灯籠」way905461343 の平均
 * 歩く区間(routing.openstreetmap.de routed-foot、秒→分の切り上げ): 南田辺駅 node7829466031→桃ヶ池 10.57→11、→晴明 16.65→17、→阿倍王子 2.14→3、
 *   →万代池 21.73→22、→古墳 12.39→13、→生根 14.76→15、→昼食 14.34→15、→住吉大社 9.19→10、→浅澤社 6.58→7、→高燈籠 11.93→12、
 *   →南海住吉大社駅 node3981964288 6.05→7
 * 時刻: 9:30・30 →10:17・25 →10:45・20 →11:27・25 →12:05・15 →12:35・20 →13:10・45(昼食) →14:05・80(外周門16:00の前に出る) →15:32・20 →16:04・30 →16:34に出る
 * 出典: 阿倍野区 https://www.city.osaka.lg.jp/abeno/cmsfiles/contents/0000001/1570/map.pdf ／
 *   住吉区 https://www.city.osaka.lg.jp/sumiyoshi/cmsfiles/contents/0000308/308446/201910111.pdf ／
 *   大阪市 https://www.city.osaka.lg.jp/toshikeikaku/cmsfiles/contents/0000162/162573/sumiyosi_3.pdf ／
 *   住吉大社 https://www.sumiyoshitaisha.net/(about/origin.html・grounds/honden.html・grounds/highlights.html・grounds/massya.html・access/) ／
 *   観光庁 https://www.mlit.go.jp/tagengo-db/R3-00155.html ／ 大阪府 https://www.pref.osaka.lg.jp/otori/jigyouinfo/150yurai.html・
 *   https://www.pref.osaka.lg.jp/documents/11546/135shunenn_2.pdf・https://www.pref.osaka.lg.jp/documents/11547/pamphlet.pdf
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-abeno-e6eb7aab.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "e6eb7aab-6ea8-4039-90ee-6f45ccd39770";
const DAY_ID = "81a42f59-92b6-4e13-b3fa-bc56af6ad0e9";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (d: Date | null) => (d ? d.toISOString().slice(11, 16) : "--:--");
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number; transitLine: string | null };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min, transitLine: null }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

const NOW: [string, string, string, number, string, string, string][] = [
  ["21e1be16-67d4-45b6-af62-62b36bb3b21c", "阪堺電車天王寺駅前停留場", "09:00", 15, "", "34.64585", "135.51279"],
  ["a877166a-489c-4439-84f6-6023cf3719c8", "桃ヶ池公園", "09:40", 30, "train25", "34.629854", "135.520358"],
  ["a06c1f35-03ee-4091-bf65-9318bfbb2441", "安倍晴明神社", "10:25", 30, "walk15", "34.631763", "135.509199"],
  ["4dc7640d-413f-48c0-b324-f9391e0af022", "阿倍王子神社", "11:00", 25, "walk5", "34.630954", "135.509179"],
  ["6e5c2445-cbdb-4314-835c-9aa84a5ce732", "住吉大社", "11:45", 70, "train20", "34.61271", "135.493"],
  ["a5934452-930e-4ff3-866a-a6b1b551f2be", "粉浜商店街", "13:05", 60, "walk10", "34.61429", "135.49044"],
  ["5405f2c9-384e-461b-b6c1-1a4664fec090", "住吉公園・高燈籠", "14:15", 30, "walk10", "34.6123", "135.48837"],
  ["de4a681a-f4ca-41d5-97ca-018f1edae0b1", "あべのキューズモール", "15:15", 60, "train30", "34.644972", "135.511583"],
  ["77993327-3dad-4387-ab17-ef472e2c9f8a", "あべのハルカス", "16:20", 40, "walk5", "34.645769", "135.514007"],
];
const [HANKAI, MOMO, SEIMEI, OJI, TAISHA, KOHAMA, KOEN, QS, HARUKAS] = NOW.map((r) => r[0]);

const TITLE_FROM = "あべのキューズモールと路面電車、下町ショッピング日帰りプラン";
const TITLE_TO = "安倍晴明神社と住吉大社、阿倍野から住吉へ古社と古墳を歩く日帰りプラン";
const DESC_FROM =
  "大阪に今も残る路面電車・阪堺電車に乗って、安倍晴明ゆかりの神社や、住吉大社とその門前の粉浜商店街など、下町の沿線をめぐる日帰りプランです。最後は天王寺に戻り、あべのキューズモールでの買い物と、あべのハルカスからの眺めで締めくくります。";
const DESC_TO =
  "桃ヶ池公園から歩きはじめ、安倍晴明神社や熊野九十九王子の一つの阿倍王子神社、万代池公園、国の史跡の帝塚山古墳、生根神社をめぐって住吉へ。粉浜商店街のあたりで昼食をとり、住吉大社と浅澤社にお参りして、最後は住吉公園の高燈籠を訪ねる、歩きの日帰りプランです。";
const THUMB_FROM =
  "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/batch2/%25E3%2581%2582%25E3%2581%25B9%25E3%2581%25AE%25E3%2582%25AD%25E3%2583%25A5%25E3%2583%25BC%25E3%2582%25BA%25E3%2583%25A2%25E3%2583%25BC%25E3%2583%25AB-fxihsNP5SBa1PsFpYgoWFq4Kqhb3vs.jpg";
const THUMB_TO =
  "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/batch2/%25E6%25A1%2583%25E3%2583%25B6%25E6%25B1%25A0%25E5%2585%25AC%25E5%259C%2592-s8Jw9YxFOBi0ESpmWPY0pv9JHE5aTr.jpg";
const TAG_SHOPPING = "a899db93-32dc-46cc-b56f-1f0804290cbf";
const TAG_SHRINE = "03867653-6a39-44e6-9374-4fd0a0902f58"; // 神社
const TAG_HISTORY = "ca1705d5-ea4b-40a0-9525-0280f9ffc340"; // 城・史跡
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const M_MOMO =
  "JR阪和線の南田辺駅から歩いておよそ11分。桃ヶ池は古くからある池で、上町台地と我孫子丘陵のあいだの低い土地にあり、かつては猫間川につながっていたといわれます。「脛ケ池」「百ケ池」「股ケ池」など、いくつもの書き方で「モモが池」と呼ばれてきました。池のほとりには小さなお社もあります。" +
  PRAY;
const M_SEIMEI =
  "桃ヶ池公園から西へ歩いておよそ17分。陰陽道の祖として知られる安倍晴明をまつる神社です。社伝では、平安時代の寛弘4年（1007年）に一条天皇の命により創られたと伝えられ、今の社殿は大正14年（1925年）に造り直されたものです。" +
  PRAY;
const M_OJI =
  "安倍晴明神社から南へ歩いておよそ3分。「阿倍権現縁記」には仁徳天皇が開いたと伝えられ、古代にこの地を本拠とした阿倍氏が建てたという説もあります。平安時代に熊野詣でが盛んになると、熊野九十九王子の第二王子社としてにぎわいました。このあたりには、大阪の八軒家と紀州の熊野三山を結んだ熊野街道が通っていました。" +
  PRAY;
const N_BANDAI = "万代池公園";
const M_BANDAI =
  "阿倍王子神社から南へ歩いておよそ22分。昭和15年（1940年）6月に開かれた、広さ約4.4haの公園です。池のまわりには桜が植えられ、春の花のころには、池に浮かぶ小島から花の景色を眺められます。公園の近くの帝塚山三丁目には、路面電車の阪堺電車が走っています。住吉区を南北に走るこの電車は、1900年に大阪馬車鉄道として開業したのがはじまりです。池のまわりを歩いてみましょう。";
const N_KOFUN = "帝塚山古墳";
const M_KOFUN =
  "万代池公園から西へ歩いておよそ13分。大阪市内に残る4つの古墳の一つで、5世紀ごろの前方後円墳が、ほぼもとの形のまま残っているとされ、国の史跡に指定されています。葬られた人はわかっていませんが、近くに住まいがあった豪族・大伴金村の墓という説があり、地元では浦島太郎の墓とも言い伝えられています。外の道から墳丘を眺めましょう。古墳のまわりでは、静かに過ごしましょう。";
const N_IKUNE = "生根神社";
const M_IKUNE =
  "帝塚山古墳から北西へ歩いておよそ15分。延喜式神名帳（927年）にも名が見える古い神社で、江戸時代には住吉大社の摂社でした。檜皮ぶきの本殿は、正面の千鳥破風や扉の飾りに桃山時代の華やかな様式を残し、大阪府の有形文化財に指定されています。境内のクスノキなどの木々は、大阪市の保存樹林になっています。" +
  PRAY;
const N_LUNCH = "粉浜商店街のあたりで昼食";
const M_LUNCH =
  "生根神社から南へ歩いておよそ15分。南海本線の粉浜駅と住吉大社のあいだに続く粉浜商店街のあたりで、昼食にしましょう。地元の人の暮らしの場でもあるので、通行のじゃまにならないように歩きましょう。";
const M_TAISHA =
  "粉浜商店街から南へ歩いておよそ10分。社伝では神功皇后摂政11年（211年）にまつられたと伝わる、摂津国一之宮の神社です。4棟の本殿はどれも大阪湾のある西を向いて建ち、神社建築の中でも最も古い様式の一つといわれる「住吉造」で、いずれも国宝です。正面の池に架かる「反橋」は、長さ約20m・高さ約3.6mで、いちばん急なところは約48度の傾きがあり、今の石の橋脚は、淀君が豊臣秀頼の成長を願って奉納したと伝えられます。反橋は傾きが急なので、手すりを持ってゆっくり渡りましょう。門の閉まる時間は、公式の案内で確かめましょう。" +
  PRAY;
const N_ASAZAWA = "浅澤社";
const M_ASAZAWA =
  "住吉大社から南へ歩いておよそ7分。住吉大社の境外末社で、「住吉の弁天さま」ともいわれ、芸能や美容の守り神としてあがめられてきました。このあたりには古くから「浅澤沼」があり、カキツバタの名所として万葉集にも詠まれています。今も毎年5月ごろ、社を囲む池にカキツバタが咲きます。" +
  PRAY;
const M_KOEN =
  "浅澤社から西へ歩いておよそ12分。明治6年（1873年）の太政官布達を受けて、同じ年の8月に開かれた公園で、大阪で最も古い公園とされます。開かれたときは住吉大社の社域の全域が公園とされ、のちに社域と分かれました。公園の中を東西に通る「潮掛道」は、昔は住吉大社へお参りする船人などが歩いた参道でした。西の端に立つ高燈籠は、昭和49年（1974年）に復元されたものです。帰りは南海本線の住吉大社駅まで歩いておよそ7分。";

// しおり全体(題・説明文・全メモ)に残ってはいけない言葉
const BANNED = /すぐ|定番|人気|おすすめ|ください|絶景|代表する|キューズ|ハルカス|ショッピング|買い物|手を合わせ|(?<!商)店|店(?!街)|料金|無料|ランチ|グルメ|唯一|日本一|一番/g;

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true, thumbnailUrl: true, seasons: true, purposeTags: { select: { purposeTagId: true } } } });
  if (!it || it.title !== TITLE_FROM || it.description !== DESC_FROM || it.thumbnailUrl !== THUMB_FROM) throw new Error("題・説明文・表紙が想定と違います");
  if (JSON.stringify(it.purposeTags.map((t) => t.purposeTagId)) !== JSON.stringify([TAG_SHOPPING])) throw new Error(`目的タグが想定と違います: ${JSON.stringify(it.purposeTags)}`);
  const spots = await prisma.spot.findMany({
    where: { dayId: DAY_ID },
    orderBy: { orderNo: "asc" },
    select: { id: true, name: true, visitTime: true, stayDurationMin: true, lat: true, lng: true, memo: true, day: { select: { itineraryId: true } }, transitLegs: { orderBy: { orderNo: "asc" }, select: { transitMode: true, transitDurationMin: true } }, photos: { select: { url: true } } },
  });
  if (!spots.length || spots[0].day.itineraryId !== ITIN_ID) throw new Error("日が想定と違います");
  const now = spots.map((s) => [s.id, s.name, hm(s.visitTime), s.stayDurationMin, s.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+"), String(s.lat), String(s.lng)]);
  if (JSON.stringify(now) !== JSON.stringify(NOW)) throw new Error(`並びが想定と違います: ${JSON.stringify(now)}`);
  if (spots.find((s) => s.id === MOMO)!.photos[0]?.url !== THUMB_TO) throw new Error("桃ヶ池公園の写真が表紙の新しい値と違います");
  const removed = [HANKAI, QS, HARUKAS];
  const keptPhotoUrls = spots.filter((s) => !removed.includes(s.id)).flatMap((s) => s.photos.map((p) => p.url));
  if (keptPhotoUrls.includes(THUMB_FROM)) throw new Error("外す行き先の写真が残ります");

  const items: { label: string; item: SpotOrderItem }[] = [
    { label: "桃ヶ池公園(9:40→9:30、train25→なし、点を股ヶ池明神に、メモ書きかえ)", item: { id: MOMO, data: { visitTime: T(9, 30), stayDurationMin: 30, lat: "34.630415", lng: "135.520635", memo: M_MOMO, transitLegs: { deleteMany: {} } } } },
    { label: "安倍晴明神社(10:25→10:17、walk15→17、滞在30→25、メモ書きかえ)", item: { id: SEIMEI, data: { visitTime: T(10, 17), stayDurationMin: 25, memo: M_SEIMEI, transitLegs: L(["walk", 17]) } } },
    { label: "阿倍王子神社(11:00→10:45、walk5→3、滞在25→20、メモ書きかえ)", item: { id: OJI, data: { visitTime: T(10, 45), stayDurationMin: 20, memo: M_OJI, transitLegs: L(["walk", 3]) } } },
    { label: `${N_BANDAI}(新規。node11607277109)`, item: { create: { name: N_BANDAI, lat: "34.620202", lng: "135.503867", visitTime: T(11, 27), stayDurationMin: 25, memo: M_BANDAI, transitLegs: C(["walk", 22]) } } },
    { label: `${N_KOFUN}(新規。解説板 node7288786968)`, item: { create: { name: N_KOFUN, lat: "34.621575", lng: "135.497079", visitTime: T(12, 5), stayDurationMin: 15, memo: M_KOFUN, transitLegs: C(["walk", 13]) } } },
    { label: `${N_IKUNE}(新規。node6153472445)`, item: { create: { name: N_IKUNE, lat: "34.62602", lng: "135.490128", visitTime: T(12, 35), stayDurationMin: 20, memo: M_IKUNE, transitLegs: C(["walk", 15]) } } },
    { label: `${N_LUNCH}(粉浜商店街を改名。13:05→13:10、walk10→15、滞在60→45、点を北の端 node1916987741 に)`, item: { id: KOHAMA, data: { name: N_LUNCH, visitTime: T(13, 10), stayDurationMin: 45, lat: "34.617418", lng: "135.490822", memo: M_LUNCH, transitLegs: L(["walk", 15]) } } },
    { label: "住吉大社(11:45→14:05、train20→walk10、滞在70→80、点を 6ff2703e と同じに、メモ書きかえ)", item: { id: TAISHA, data: { visitTime: T(14, 5), stayDurationMin: 80, lat: "34.613003", lng: "135.493101", memo: M_TAISHA, transitLegs: L(["walk", 10]) } } },
    { label: `${N_ASAZAWA}(新規。way530933348 の平均)`, item: { create: { name: N_ASAZAWA, lat: "34.610714", lng: "135.494472", visitTime: T(15, 32), stayDurationMin: 20, memo: M_ASAZAWA, transitLegs: C(["walk", 7]) } } },
    { label: "住吉公園・高燈籠(14:15→16:04、walk10→12、点を way905461343 の平均に、メモ書きかえ)", item: { id: KOEN, data: { visitTime: T(16, 4), stayDurationMin: 30, lat: "34.61323", lng: "135.486848", memo: M_KOEN, transitLegs: L(["walk", 12]) } } },
  ];

  const all = [TITLE_TO, DESC_TO, ...items.map(({ item }) => ("id" in item ? (item.data as { memo: string }).memo : (item.create.memo as string)))].join("\n");
  const left = all.match(BANNED);
  if (left) throw new Error(`直したあとに残る言葉: ${left}`);

  console.log(`題 → ${TITLE_TO}\n説明文 → ${DESC_TO}\n表紙 → 桃ヶ池公園の写真\n目的タグ ショッピング → 神社・城・史跡／季節 ${it.seasons}（そのまま）`);
  let prevEnd: number | null = null;
  for (const { label, item } of items) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = d.stayDurationMin as number;
    const lg = d.transitLegs as { create?: Leg[] };
    const legMin = (lg.create ?? []).reduce((a, l) => a + l.transitDurationMin, 0);
    const ls = lg.create ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(なし)";
    if (prevEnd !== null && prevEnd + legMin * 60000 !== vt.getTime()) throw new Error(`${label}: 時刻のつながりが合いません`);
    prevEnd = vt.getTime() + st * 60000;
    const cur = "id" in item ? spots.find((s) => s.id === item.id)! : null;
    const pt = d.lat ? `${d.lat},${d.lng}` : `${cur!.lat},${cur!.lng}（そのまま）`;
    console.log(`■ ${label}\n  着 ${hm(vt)}／滞在 ${st}／区間 ${ls}／点 ${pt}\n  メモ: ${d.memo}`);
  }
  console.log(`■ [外す] 阪堺電車天王寺駅前停留場(写真1)・あべのキューズモール(写真1)・あべのハルカス(写真なし)\n\n  最後の出発 ${hm(new Date(prevEnd!))}／時刻のつながり: すべて合っています\n  言葉の確かめ: 題・説明文・全メモで ${BANNED.source} 0件`);
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_TO, description: DESC_TO, thumbnailUrl: THUMB_TO } });
      await tx.itineraryPurposeTag.deleteMany({ where: { itineraryId: ITIN_ID, purposeTagId: TAG_SHOPPING } });
      await tx.itineraryPurposeTag.createMany({ data: [TAG_SHRINE, TAG_HISTORY].map((purposeTagId) => ({ itineraryId: ITIN_ID, purposeTagId })) });
      await setDaySpotOrder(DAY_ID, items.map((r) => r.item), { tx, remove: [HANKAI, QS, HARUKAS] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
