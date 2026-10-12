/**
 * チェックリスト #385 e6eb7aab「あべのキューズモールと路面電車、下町ショッピング日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 阪堺電車天王寺駅前停留場 → 桃ヶ池公園 → 安倍晴明神社 → 阿倍王子神社 → 住吉大社 → 粉浜商店街（昼食）→ 住吉公園・高燈籠
 * → あべのキューズモール → あべのハルカス（9か所 09:00〜17:00、阪堺電車・徒歩）
 * 既存の3か所はIDのまま直す（桃ヶ池公園の座標は近くの交番の点だったので、池の点に直す）。説明文の更新と並べ替えを1つのトランザクションで行う
 * 座標の出典: OSM/Overpass（阪堺電車 天王寺駅前 34.64585,135.51279／住吉大社 34.61271,135.49300／住吉公園 34.61230,135.48837）、
 *   Nominatim（桃ヶ池 water/pond 34.6298536,135.5203581／安倍晴明神社 34.6317634,135.5091994／阿倍王子神社 34.6309543,135.5091793／粉浜商店街 34.6142898,135.4904405／あべのハルカス 34.6457685,135.5140068）、
 *   あべのキューズモールは既存の値のまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-385-e6eb7aab.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e6eb7aab-6ea8-4039-90ee-6f45ccd39770";
const DAY1_ID = "81a42f59-92b6-4e13-b3fa-bc56af6ad0e9";
const QS_ID = "de4a681a-f4ca-41d5-97ca-018f1edae0b1";
const HANKAI_ID = "21e1be16-67d4-45b6-af62-62b36bb3b21c";
const MOMO_ID = "a877166a-489c-4439-84f6-6023cf3719c8";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "大阪に今も残る路面電車・阪堺電車に乗って、安倍晴明ゆかりの神社や、住吉大社とその門前の粉浜商店街など、下町の沿線をめぐる日帰りプランです。最後は天王寺に戻り、あべのキューズモールでの買い物と、あべのハルカスからの眺めで締めくくります。";

const MEMO_HANKAI =
  "JR・地下鉄の天王寺駅から歩いてすぐ、阪堺電車の天王寺駅前停留場から旅を始めましょう。大阪に今も残る路面電車で、そのはじまりは1900年に開業した「大阪馬車鉄道」にさかのぼります。名前のとおり、開業のころはレールの上を馬が車両を引いて走っていました。その後、南海鉄道との合併をへて1910年に電化され、今の電車の姿になりました。道路の上をゆっくり走る電車の窓から、下町の町並みを眺めていきましょう。";

const MEMO_MOMO =
  "阪堺電車の上町線で松虫へ向かい、歩いて約15分。地元の人々の憩いの場になっている池のある公園です。池の名には「百ヶ池」「股ヶ池」など、いくつもの書き方が残っていて、名前の由来にも諸説あります。飛鳥時代、聖徳太子の命でこの池の大蛇が退治されたという伝説も残り、池のほとりの「股ヶ池明神」は、その霊を鎮めるために江戸時代の天明年間に建てられたと伝えられます。明治から大正のころ、このあたりは農村で、池は田畑を潤すため池として使われていました。お社の前では、静かに、敬意をもって手を合わせましょう。";

const MEMO_QS =
  "天王寺駅前に戻り、あべのキューズモールへ。2011年4月に開業した、天王寺駅のすぐそばの大きなショッピングモールで、1970年代から続いてきた阿倍野の再開発の中心となる施設として整えられました。「キューズ」という名前は、英語で「始まりの合図」を意味する「CUE」などに由来するといわれます。自然の光を取り入れた吹き抜けや、屋外の通路が気持ちのよい館内で、買い物を楽しみましょう。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string; dur: number; line?: string; lat: number; lng: number; address: string; memo: string };

const SEIMEI: NewSpot = {
  name: "安倍晴明神社", h: 10, m: 25, stay: 30, mode: "walk", dur: 15, lat: 34.631763, lng: 135.509199, address: "大阪府大阪市阿倍野区阿倍野元町",
  memo:
    "桃ヶ池公園から歩いて約15分。平安時代の陰陽師・安倍晴明が生まれた地と伝えられる場所にある神社です。晴明が亡くなったあと、その死を惜しんだ花山法皇によって、寛弘4年（1007年）に創建されたと伝わります。晴明は、阿倍野の豪族の父と、葛の葉という名の白狐の母の間に生まれたという伝説も残ります。いったん衰えたのち、大正時代にすぐ南の阿倍王子神社の末社として再興されました。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
};

const AFTER: NewSpot[] = [
  {
    name: "阿倍王子神社", h: 11, m: 0, stay: 25, mode: "walk", dur: 5, lat: 34.630954, lng: 135.509179, address: "大阪府大阪市阿倍野区阿倍野元町9-4",
    memo:
      "安倍晴明神社から歩いてすぐ。平安時代、京から熊野へ参詣する道すじに置かれた「九十九王子」の一つで、大阪府内に今も残る唯一の王子社とされています。後鳥羽上皇が熊野へ詣でたころには、京から数えて4番目の王子だったといわれ、熊野への長い旅の祈りの場として大切にされてきました。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "住吉大社", h: 11, m: 45, stay: 70, mode: "train", dur: 20, line: "阪堺電車上町線（東天下茶屋→住吉鳥居前）",
    lat: 34.61271, lng: 135.493, address: "大阪府大阪市住吉区住吉2丁目9-89",
    memo:
      "東天下茶屋から阪堺電車に乗り、住吉鳥居前で降りてすぐ。全国の住吉神社の総本社で、神功皇后によって211年にまつられたと伝えられます。第一本宮から第四本宮まで4棟の本殿は「住吉造」と呼ばれる、神社建築の中でも最も古い形式の一つとされ、いずれも国宝です。入口の池に架かる「反橋」は、長さ約20m・高さ約3.6mで、急な傾きの太鼓橋として知られ、その石の橋脚は、淀君が豊臣秀頼の成長を願って奉納したと伝えられます。橋は傾きが急なので、手すりを持ってゆっくり渡りましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "粉浜商店街", h: 13, m: 5, stay: 60, mode: "walk", dur: 10, lat: 34.61429, lng: 135.49044, address: "大阪府大阪市住之江区粉浜",
    memo:
      "住吉大社から北へ歩いて約10分。南海本線の粉浜駅と住吉大社駅の間に、南北およそ350mにわたって続く、昔ながらの雰囲気の商店街です。住吉大社の門前町として親しまれ、総菜や鮮魚、和菓子などの店が並びます。ここで昼食にしましょう。地元の人々の暮らしの場でもあるので、店先では通行のじゃまにならないように歩きましょう。",
  },
  {
    name: "住吉公園・高燈籠", h: 14, m: 15, stay: 30, mode: "walk", dur: 10, lat: 34.6123, lng: 135.48837, address: "大阪府大阪市住之江区",
    memo:
      "粉浜商店街から歩いて約10分。明治6年（1873年）の太政官布達で開かれた、大阪で最も古い公園の一つとされる公園で、もとは住吉大社の境内の一部でした。公園の西の端に立つ「高燈籠」は、鎌倉時代の終わりごろに住吉大社への献灯として建てられたと伝わる灯台で、日本で最も古い灯台ともいわれます。今の高燈籠は1974年に復元されたもので、かつてはここより西へ約200mの海辺に立っていたそうです。昔はこのあたりまで海が迫っていたことを思い浮かべてみましょう。",
  },
];

const HARUKAS: NewSpot = {
  name: "あべのハルカス", h: 16, m: 20, stay: 40, mode: "walk", dur: 5, lat: 34.645769, lng: 135.514007, address: "大阪府大阪市阿倍野区阿倍野筋1丁目1-43",
  memo:
    "キューズモールから歩いてすぐ、2014年に開業した高さ300mのビルです。最上階の展望台「ハルカス300」からは、大阪の町並みを360度見渡せ、晴れた日には遠くの山並みまで見渡せます。今日電車で走った住吉や阿倍野のあたりを、上から探してみましょう。展望台の入場の時間は公式の案内で確かめてください。",
};

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${QS_ID},${HANKAI_ID},${MOMO_ID}`) throw new Error("構成が想定と違います");

  const order = [
    { id: HANKAI_ID, data: { visitTime: t(9, 0), stayDurationMin: 15, transitMode: null, transitDurationMin: null, transitLine: null, lat: 34.64585, lng: 135.51279, memo: MEMO_HANKAI } },
    { id: MOMO_ID, data: { visitTime: t(9, 40), stayDurationMin: 30, transitMode: "train", transitDurationMin: 25, transitLine: "阪堺電車上町線（天王寺駅前→松虫）", lat: 34.629854, lng: 135.520358, memo: MEMO_MOMO } },
    toCreate(SEIMEI),
    ...AFTER.map(toCreate),
    { id: QS_ID, data: { visitTime: t(15, 15), stayDurationMin: 60, transitMode: "train", transitDurationMin: 30, transitLine: "阪堺電車上町線（住吉鳥居前→天王寺駅前）", memo: MEMO_QS } },
    toCreate(HARUKAS),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const nm = "id" in x ? ({ [QS_ID]: "あべのキューズモール", [HANKAI_ID]: "阪堺電車天王寺駅前停留場", [MOMO_ID]: "桃ヶ池公園" } as Record<string, string>)[x.id] + "(既存)" : d.name;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${nm} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
