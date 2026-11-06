/**
 * f750c1d6(那智の滝と熊野那智大社のプラン)の組み直し(2026-11-06、しおりえ(制作))。
 * docs/specs/20261105-facility-rework.md(会社・店の施設を行き先にしない)。企画運営・法務の判断(11/05〜11/06)。
 * - 2か所目「勝浦漁港にぎわい市場」(店のグルメ中心)を外す。代わりの行き先は足さず、
 *   くじらの博物館→那智の浜を直結(routing.openstreetmap.de routed-car 499.4秒→ceil+5=14分)。
 * - 補陀洛山寺のあとに「那智駅のあたりで昼食」を新設。点はOSM node13158195530(highway=bus_stop、
 *   name="那智駅")、33.644398,135.936362(OSM値を6桁に四捨五入)。13:30までに開始・40分(35〜45分の範囲)。
 *   区間(routed-foot/routed-car): 補陀洛山寺→昼食 133.3秒で歩3、昼食→大門坂(下の点) 333.5秒でceil+5=11。
 * - 大門坂の点を、坂の下の入口・碑のある側に揃える(企画運営11/06指示、同じ場所は同じ点)。
 *   OSM node7455647514(historic=memorial、name="大門坂")を直接API(/api/0.6/node/7455647514)で確かめ、
 *   lat33.6707046/lon135.9012075を6桁に四捨五入した33.670705,135.901208を使う(法務11/06指摘。
 *   4124d576が使っている33.670625,135.901225はこのnodeの値と9mほどずれており、そろえる先は
 *   node自体の値とする)。旧点(way124998079、坂の中ほど)から変更。
 *   区間を測り直し: 大門坂(新点)→那智の滝 routed-foot 1474.9秒→歩25分(変更なし)。
 * - 那智の滝→青岸渡寺・青岸渡寺→熊野那智大社・熊野那智大社→妙法山阿弥陀寺も、法務の指摘で測り直し:
 *   那智の滝→青岸渡寺 routed-foot 624.1秒→歩11分(旧12)。青岸渡寺→熊野那智大社 routed-foot 99.7秒→歩2分(旧3)。
 *   熊野那智大社→妙法山阿弥陀寺 routed-car 474.5秒→ceil+5=13分(旧15)。
 * - 時刻: 9:00始まりのまま、延ばしなし。妙法山阿弥陀寺を出るのが16:39(16:30〜17:00)。
 *   くじらの博物館9:00・65、那智の浜10:19・25、補陀洛山寺10:49・40、昼食11:32・40、
 *   大門坂12:23・45、那智の滝13:33・45、青岸渡寺14:29・35、熊野那智大社15:06・40、妙法山阿弥陀寺15:59・40。
 * - 市場の名前が出る文を直す(くじらの博物館・那智の浜・補陀洛山寺の結び/書き出し)。
 * - 「すぐ」を3か所直す(企画運営・法務11/06指示): 那智の浜「すぐ近くの補陀洛山寺へ」→「補陀洛山寺へ」、
 *   那智の滝「滝つぼのすぐそばまで近づく」→「滝つぼに近い場所から滝を見上げる」、熊野那智大社「歩いてすぐ」→「歩いておよそ2分」。
 * - 評価の言葉を2つ直す(法務11/06指示): 大門坂「神秘的な雰囲気を醸し出す」→削除、青岸渡寺「絶景」→「景色」。
 * - 那智の滝に祈りの一文を追加(法務11/06指摘。飛瀧神社のご神体)。4124d576の文をそのまま写さないよう、
 *   「お滝拝所舞台」周辺の2文は言いかえる(法務11/06指摘、文例をもとに書き直し)。
 * - 書き出し・結びに区間の分がないものに入れる・測り直した分にそろえる(企画運営・法務11/06指示):
 *   くじらの博物館の結び(車14分)、大門坂の結び(歩25分)、那智の滝の書き出し(歩25分)・結び(歩11分)、
 *   青岸渡寺の書き出し(歩11分、旧12)・結び(歩2分、「隣接する」も外す)、熊野那智大社の書き出し(歩2分)・結び(車13分)、
 *   妙法山阿弥陀寺の書き出し(車13分、旧15)。
 * - 「お参りください」(補陀洛山寺・熊野那智大社)は、今回それ自体を直す対象ではないため、244行の決まりどおり
 *   そのまま残す(企画運営11/06指示)。
 * - 旅の入口・帰りの分を追加(法務11/06指摘、61・104行)。駅はJR紀伊勝浦駅(企画運営11/06指示、借りる・返すを同じ駅に)。
 *   くじらの博物館の書き出し: 「JR紀伊勝浦駅の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ13分、…に着きます。」
 *   (routed-car 441.8秒→ceil+5=13)。妙法山阿弥陀寺の結びに帰りの一文を追加:
 *   「見学を終えたら、車でおよそ21分、紀伊勝浦駅の近くへ戻り、車を返しましょう。」(routed-car 954.2秒→ceil+5=21)。
 * - 確認モードは、変えない項目(時刻・滞在・区間・点)も今の値を読み込んで全部表示する(企画運営11/06指摘)。
 * - 写真: 外すスポット(市場)に写真は0件。既存の写真(那智の滝・熊野那智大社)はそのまま。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-katsuura-f750c1d6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (d: Date | null | undefined) => (d ? new Date(d).toISOString().slice(11, 16) : "--:--");
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

const KUJIRA = "79bd5f8b-bbe7-489c-afe2-a51cfaa411ad";
const ICHIBA = "36112a1a-1bdf-4b2c-9bdb-489f49637929"; // 外す
const NACHI_HAMA = "47a577fd-1967-48a5-9796-f66ae519d7c9";
const FUDARAKU = "6d196cff-a1e2-4da6-b239-e7e4bccdc2ab";
const DAIMONZAKA = "51ca4d2e-cbcd-40d9-bdd5-8feb63352f14";
const TAKI = "892bc11b-8203-448b-a2c9-f84b71c68da9";
const SEIGANTOJI = "196229bf-da92-4a7b-a3d3-dbd9f5a26709";
const TAISHA = "329afb91-9920-4801-b3a0-c1d598b5085b";
const MYOHOZAN = "a9f39a6f-04a1-4291-9e47-4d09f534bcbc";

const EXPECT: [string, string][] = [
  [KUJIRA, "太地町立くじらの博物館"],
  [ICHIBA, "勝浦漁港にぎわい市場"],
  [NACHI_HAMA, "那智の浜"],
  [FUDARAKU, "補陀洛山寺"],
  [DAIMONZAKA, "大門坂"],
  [TAKI, "那智の滝"],
  [SEIGANTOJI, "青岸渡寺"],
  [TAISHA, "熊野那智大社"],
  [MYOHOZAN, "妙法山阿弥陀寺"],
];
const PHOTOS_EXPECT = ["a682c656-7d0a-4ce6-897c-65b5a6e99356", "77f366c0-88e9-4506-9886-930b21578f1a"].sort();

const MEMO_FROM = {
  kujiraOpen: "1日目はレンタカーで、太地町立くじらの博物館から出発します。",
  kujira: "この後は車で、勝浦漁港にぎわい市場へ向かいましょう。",
  nachiHamaFirst: "勝浦漁港にぎわい市場から車でおよそ8分、那智の浜に着きます。",
  nachiHamaLast: "この後は、歩いておよそ5分、すぐ近くの補陀洛山寺へ向かいましょう。",
  fudarakuLast: "この後は、車でおよそ15分、熊野古道・大門坂へ向かいましょう。",
  taki: "大門坂を登った先、那智の滝(那智大滝)に着きます。",
  takiViewAndCare:
    "鳥居をくぐった先の「お滝拝所舞台」まで石段を上れば、滝つぼのすぐそばまで近づくことができます。石段は水しぶきで滑りやすいので、足元に気をつけて歩きましょう。この後は、青岸渡寺へ向かいましょう。",
  seigantojiFirst: "那智の滝から歩いておよそ12分、",
  seigantojiView: "絶景を望むことができます。",
  seigantojiLast: "この後は、隣接する熊野那智大社へ向かいましょう。",
  taishaFirst: "青岸渡寺から歩いてすぐ、",
  taishaLast: "この後は車で、妙法山阿弥陀寺へ向かいましょう。",
  myohozanFirst: "熊野那智大社から車でおよそ15分、",
  myohozanReturn: "那智の滝から始まった熊野詣を、この山の上で締めくくりましょう。",
};
const MEMO_TO = {
  kujiraOpen: "JR紀伊勝浦駅の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ13分、太地町立くじらの博物館に着きます。",
  kujira: "この後は車でおよそ14分、那智の浜へ向かいましょう。",
  nachiHamaFirst: "太地町立くじらの博物館から車でおよそ14分、那智の浜に着きます。",
  nachiHamaLast: "この後は、歩いておよそ5分、補陀洛山寺へ向かいましょう。",
  fudarakuLast: "この後は、歩いておよそ3分、那智駅のあたりへ向かいましょう。",
  taki: "大門坂から、石段の続く参道を歩いておよそ25分、那智の滝(那智大滝)に着きます。",
  takiViewAndCare:
    "鳥居をくぐった先には「お滝拝所舞台」があり、石段を上ったその舞台から、滝を下から仰ぐように眺められます。濡れた石段では、足を運ぶ場所を確かめながら進みましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ11分、青岸渡寺へ向かいましょう。",
  seigantojiFirst: "那智の滝から歩いておよそ11分、",
  seigantojiView: "景色を望むことができます。",
  seigantojiLast: "この後は、歩いておよそ2分、熊野那智大社へ向かいましょう。",
  taishaFirst: "青岸渡寺から歩いておよそ2分、",
  taishaLast: "この後は車でおよそ13分、妙法山阿弥陀寺へ向かいましょう。",
  myohozanFirst: "熊野那智大社から車でおよそ13分、",
  myohozanReturn:
    "那智の滝から始まった熊野詣を、この山の上で締めくくりましょう。見学を終えたら、車でおよそ21分、紀伊勝浦駅の近くへ戻り、車を返しましょう。",
};
const DAIMONZAKA_OLD_FIRST = "補陀洛山寺から車でおよそ15分、熊野古道・大門坂に着きます。";
const DAIMONZAKA_OLD_MID = "苔むした石段と、周囲を包む杉の巨木群が、神秘的な雰囲気を醸し出す、熊野古道らしい風情を色濃く残す道です。";
const DAIMONZAKA_OLD_LAST = "この後は、那智の滝へ向かいましょう。";
const DAIMONZAKA_NEW_FIRST = "那智駅のあたりから車でおよそ11分、熊野古道・大門坂に着きます。";
const DAIMONZAKA_NEW_MID = "苔むした石段と、周囲を包む杉の巨木群が続く、熊野古道らしい風情を色濃く残す道です。";
const DAIMONZAKA_NEW_LAST = "この後は、歩いておよそ25分、那智の滝へ向かいましょう。";

const LUNCH_MEMO = "補陀洛山寺から歩いておよそ3分、那智駅のあたりに着きます。このあたりで昼食にしましょう。この後は、車でおよそ11分、熊野古道・大門坂へ向かいましょう。";

const count = (s: string, sub: string) => s.split(sub).length - 1;

function replaceOnce(s: string, from: string, to: string, label: string): string {
  if (count(s, from) !== 1) throw new Error(`${label}: 想定の文が1回だけ見つかりません「${from}」`);
  return s.replace(from, to);
}

type SpotRow = {
  id: string;
  name: string;
  memo: string | null;
  dayId: string;
  visitTime: Date | null;
  stayDurationMin: number | null;
  lat: unknown;
  lng: unknown;
  transitLegs: { orderNo: number; transitMode: string; transitDurationMin: number | null }[];
  day: { itineraryId: string };
};

async function main() {
  const rows: { id: string }[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like $1`, `f750c1d6%`);
  if (rows.length !== 1) throw new Error("しおりが1本に決まりません");
  const it = await prisma.itinerary.findUnique({ where: { id: rows[0].id }, select: { id: true } });
  if (!it) throw new Error("しおりが見つかりません");

  const spots: SpotRow[] = await prisma.spot.findMany({
    where: { day: { itineraryId: it.id } },
    orderBy: { orderNo: "asc" },
    include: { transitLegs: { orderBy: { orderNo: "asc" } }, day: { select: { itineraryId: true } } },
  });
  if (JSON.stringify(spots.map((s) => [s.id, s.name])) !== JSON.stringify(EXPECT)) {
    throw new Error(`スポットが想定と違います: ${spots.map((s) => s.name).join(",")}`);
  }
  const DAY_ID = spots[0].dayId;
  if (spots.some((s) => s.dayId !== DAY_ID || s.day.itineraryId !== it.id)) throw new Error("日・しおりの対応が想定と違います");

  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true, spotId: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います ${photos.map((p) => p.id)}`);
  if (photos.some((p) => p.spotId === ICHIBA)) throw new Error("外すスポットに写真があります");

  const byId = new Map(spots.map((s) => [s.id, s]));
  const memo = (id: string) => byId.get(id)!.memo ?? "";

  let kujiraMemo = replaceOnce(memo(KUJIRA), MEMO_FROM.kujiraOpen, MEMO_TO.kujiraOpen, "くじらの博物館(書き出し)");
  kujiraMemo = replaceOnce(kujiraMemo, MEMO_FROM.kujira, MEMO_TO.kujira, "くじらの博物館(結び)");

  let nachiHamaMemo = replaceOnce(memo(NACHI_HAMA), MEMO_FROM.nachiHamaFirst, MEMO_TO.nachiHamaFirst, "那智の浜(書き出し)");
  nachiHamaMemo = replaceOnce(nachiHamaMemo, MEMO_FROM.nachiHamaLast, MEMO_TO.nachiHamaLast, "那智の浜(結び)");

  const fudarakuMemo = replaceOnce(memo(FUDARAKU), MEMO_FROM.fudarakuLast, MEMO_TO.fudarakuLast, "補陀洛山寺(結び)");

  let daimonzakaMemo = replaceOnce(memo(DAIMONZAKA), DAIMONZAKA_OLD_FIRST, DAIMONZAKA_NEW_FIRST, "大門坂(書き出し)");
  daimonzakaMemo = replaceOnce(daimonzakaMemo, DAIMONZAKA_OLD_MID, DAIMONZAKA_NEW_MID, "大門坂(評価の言葉)");
  daimonzakaMemo = replaceOnce(daimonzakaMemo, DAIMONZAKA_OLD_LAST, DAIMONZAKA_NEW_LAST, "大門坂(結び)");

  let takiMemo = replaceOnce(memo(TAKI), MEMO_FROM.taki, MEMO_TO.taki, "那智の滝(書き出し)");
  takiMemo = replaceOnce(takiMemo, MEMO_FROM.takiViewAndCare, MEMO_TO.takiViewAndCare, "那智の滝(すぐ・祈りの文・結び)");

  let seigantojiMemo = replaceOnce(memo(SEIGANTOJI), MEMO_FROM.seigantojiFirst, MEMO_TO.seigantojiFirst, "青岸渡寺(書き出し)");
  seigantojiMemo = replaceOnce(seigantojiMemo, MEMO_FROM.seigantojiView, MEMO_TO.seigantojiView, "青岸渡寺(絶景)");
  seigantojiMemo = replaceOnce(seigantojiMemo, MEMO_FROM.seigantojiLast, MEMO_TO.seigantojiLast, "青岸渡寺(結び)");

  let taishaMemo = replaceOnce(memo(TAISHA), MEMO_FROM.taishaFirst, MEMO_TO.taishaFirst, "熊野那智大社(書き出し)");
  taishaMemo = replaceOnce(taishaMemo, MEMO_FROM.taishaLast, MEMO_TO.taishaLast, "熊野那智大社(結び)");

  let myohozanMemo = replaceOnce(memo(MYOHOZAN), MEMO_FROM.myohozanFirst, MEMO_TO.myohozanFirst, "妙法山阿弥陀寺(書き出し)");
  myohozanMemo = replaceOnce(myohozanMemo, MEMO_FROM.myohozanReturn, MEMO_TO.myohozanReturn, "妙法山阿弥陀寺(帰りの一文)");

  const items: { label: string; item: SpotOrderItem }[] = [
    { label: "太地町立くじらの博物館(書き出し・結びを直す)", item: { id: KUJIRA, data: { memo: kujiraMemo } } },
    { label: "那智の浜(市場から直結、時刻・区間変更)", item: { id: NACHI_HAMA, data: { visitTime: T(10, 19), memo: nachiHamaMemo, transitLegs: L(["car", 14]) } } },
    { label: "補陀洛山寺(時刻・結びを直す)", item: { id: FUDARAKU, data: { visitTime: T(10, 49), memo: fudarakuMemo } } },
    {
      label: "那智駅のあたりで昼食(新規。OSM node13158195530 バス停)",
      item: { create: { name: "那智駅のあたりで昼食", lat: "33.644398", lng: "135.936362", visitTime: T(11, 32), stayDurationMin: 40, memo: LUNCH_MEMO, transitLegs: C(["walk", 3]) } },
    },
    {
      label: "大門坂(点をnode7455647514の値に変更。区間はそのまま)",
      item: { id: DAIMONZAKA, data: { lat: "33.670705", lng: "135.901208", visitTime: T(12, 23), memo: daimonzakaMemo, transitLegs: L(["car", 11]) } },
    },
    { label: "那智の滝(時刻・書き出し・祈りの文・結びを直す。区間はそのまま)", item: { id: TAKI, data: { visitTime: T(13, 33), memo: takiMemo, transitLegs: L(["walk", 25]) } } },
    { label: "青岸渡寺(時刻・区間・結びを直す)", item: { id: SEIGANTOJI, data: { visitTime: T(14, 29), memo: seigantojiMemo, transitLegs: L(["walk", 11]) } } },
    { label: "熊野那智大社(時刻・区間・書き出し・結びを直す)", item: { id: TAISHA, data: { visitTime: T(15, 6), memo: taishaMemo, transitLegs: L(["walk", 2]) } } },
    { label: "妙法山阿弥陀寺(時刻・区間・書き出しを直す)", item: { id: MYOHOZAN, data: { visitTime: T(15, 59), memo: myohozanMemo, transitLegs: L(["car", 13]) } } },
  ];

  // 確認モード用: 書き込むデータに無い項目は、今のDBの値を読んで埋める(企画運営11/06指摘)
  for (const { label, item } of items) {
    if ("id" in item) {
      const cur = byId.get(item.id)!;
      const d = item.data as Record<string, unknown>;
      const visitTime = (d.visitTime as Date | undefined) ?? cur.visitTime ?? undefined;
      const stayDurationMin = (d.stayDurationMin as number | undefined) ?? cur.stayDurationMin ?? undefined;
      const lat = (d.lat as string | undefined) ?? (cur.lat != null ? String(cur.lat) : undefined);
      const lng = (d.lng as string | undefined) ?? (cur.lng != null ? String(cur.lng) : undefined);
      const lg = d.transitLegs as { create?: Leg[] } | undefined;
      const legList = lg?.create ?? cur.transitLegs.map((l) => ({ orderNo: l.orderNo, transitMode: l.transitMode, transitDurationMin: l.transitDurationMin ?? 0 }));
      const ls = legList.length > 0 ? legList.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし・1か所目)";
      console.log(
        `■ ${label}\n  着 ${hm(visitTime)}／滞在 ${stayDurationMin ?? "?"}／区間 ${ls}／点 ${lat},${lng}${d.memo ? `\n  メモ: ${d.memo}` : ""}`
      );
    } else {
      const d = item.create as Record<string, unknown>;
      const lg = d.transitLegs as { create?: Leg[] };
      const ls = lg.create!.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+");
      console.log(`■ ${label}\n  着 ${hm(d.visitTime as Date)}／滞在 ${d.stayDurationMin}／区間 ${ls}／点 ${d.lat},${d.lng}\n  メモ: ${d.memo}`);
    }
  }
  console.log("■ [外す] 勝浦漁港にぎわい市場\n\n  終わり 妙法山阿弥陀寺 15:59+40=16:39(16:30〜17:00)");
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY_ID, items.map((r) => r.item), { tx, remove: [ICHIBA] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
