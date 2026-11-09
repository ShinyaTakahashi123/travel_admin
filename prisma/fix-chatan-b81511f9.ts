/**
 * 美浜アメリカンビレッジ、北谷のサンセット(b81511f9)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の b81511f9 の欄。設計の表は企画運営・法務とも OK(11/04 20:48)。
 * - 美浜アメリカンビレッジは6章で行き先から外す(平成10年からの商業施設の集まりで、歴史的な町並みに当たらない)。ハンビー飛行場の跡地の話も入れない
 * - 日帰りは 16:30〜17:00 に終わり、日の入りより前なので、題から「サンセット」「ショッピング」を外す
 * - 普天満宮を足す(ほかのしおりでは使っていない)
 * - 点: アラハビーチ → natural=beach way541344402、サンセットビーチ → natural=beach way188840514(Nominatim の点)、
 *   昼食 → バス停 node1993232522(店でない点。名前はメモに書かない)、普天満宮 → place_of_worship way1017035026、
 *   中城城跡 → 北東の受付側の案内図「中城城跡案内図」node12421968405(企画運営の決定。史跡の中の点は使わない)
 * - 北谷では北谷町営駐車場 way189830737 に停め、昼食とサンセットビーチは歩いて回る
 * - 区間(routing.openstreetmap.de): 店→博物館 車 32.4→38、博物館→アラハ 車 5.0→10、アラハ→駐車場 車 3.5→9 ＋ 歩 2.2→3、
 *   昼食→サンセットビーチ 歩 6.5→7、サンセットビーチ→駐車場 歩 7.8→8 ＋ 車 8.5→14、普天満宮→中城城跡 車 8.8→14、
 *   中城城跡→中村家 車 2.0→7(前の版の歩き9は実測17.6より短い)、中村家→店 車 32.3→38(帰りの一文)
 * - 時刻: 9:30〜16:32
 * - 中城城跡の拝所は決まりの祈りの一文と「立ち入りが禁じられている場所には入らない」(法務)。護佐丸の墓にはふれない
 * - 表紙は美浜の写真なので、サンセットビーチの写真(b63e9851、Commons)に替える。美浜の写真は行き先と一緒に消える
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-chatan-b81511f9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "b81511f9-78dc-4833-99a4-ab6ed8662c71";
const DAY_ID = "b1b7e2d1-5374-4fb5-9bbe-66409ec1e46b";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Mode = "walk" | "car";
type Leg = [Mode, number];
const L = (...legs: Leg[]) => ({ deleteMany: {}, create: legs.map(([m, n], i) => ({ orderNo: i + 1, transitMode: m, transitDurationMin: n })) });
const C = (...legs: Leg[]) => ({ create: legs.map(([m, n], i) => ({ orderNo: i + 1, transitMode: m, transitDurationMin: n })) });

const MUSEUM = "a092ee80-3290-4c84-b22e-081870087bda";
const MIHAMA = "b73c64f0-94c1-4645-8300-813e39fe9270"; // 外す(写真 850e29eb も消える)
const SUNSET = "f09075c0-a91f-4699-b215-ecf43989506a";
const ARAHA = "45573490-d3ad-4870-9212-f4a5ae334b01";
const NAKAGUSUKU = "e64b6ecc-f2d9-4af2-9a61-d8183eef098a";
const NAKAMURA = "932ef8de-6ec0-454b-bad5-beafd67d4ddc";
const REMOVE = [MIHAMA];

const EXPECT: Record<string, string> = {
  [MUSEUM]: "北谷町立博物館", [MIHAMA]: "美浜アメリカンビレッジ", [SUNSET]: "サンセットビーチ",
  [ARAHA]: "安良波公園・アラハビーチ", [NAKAGUSUKU]: "中城城跡", [NAKAMURA]: "中村家住宅",
};
const PHOTOS_EXPECT = ["850e29eb-944b-49cb-87d1-a06e886d2fa0", "b63e9851-cb02-46fd-abea-1f9cff510b9c"].sort();

const TITLE_OLD = "美浜アメリカンビレッジ、北谷のサンセットとショッピングプラン";
const TITLE_NEW = "北谷の海辺と伊礼原遺跡、普天満宮と中城城跡をめぐる日帰りプラン";
const DESC_OLD =
  "カラフルな街並みが目印の美浜アメリカンビレッジ。万座毛とは違う、北谷ならではの異国情緒とサンセットを楽しむプランです。伊礼原遺跡に隣接する北谷町立博物館や、史実ゆかりの安良波公園・アラハビーチ、世界遺産の中城城跡もめぐります。";
const DESC_NEW =
  "縄文の遺跡と一体になった北谷町立博物館から、安良波公園とサンセットビーチの海辺へ。琉球八社の一つの普天満宮、世界遺産の中城城跡、中村家住宅まで、沖縄本島中部をレンタカーでめぐる日帰りプランです。";
const THUMB_OLD = "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/official-areas-17/mihama-depot-island-u119HGlSu9oGWymjL2jwDWtHrgbPcO.jpg";
const THUMB_NEW = "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/official-areas-17/chatan-sunset-beach-aLMbHpwQaijF6ApUXXw1KV0RbPDk3L.jpg";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  museum:
    "那覇空港の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ38分、北谷町立博物館に着きます。国指定史跡「伊礼原遺跡」と一体になった博物館で、町内の発掘調査から明らかになった沖縄の縄文時代について展示しています。博物館の外に広がる遺跡では、各所の解説板を見ながら、北谷に暮らした縄文人の生活にふれることができます。月曜日・祝日・毎月第4木曜日のほか、慰霊の日(6月23日)や年末年始も休館で、臨時の休館日もあるので、公式の案内で確かめましょう。この後は、車でおよそ10分、安良波公園・アラハビーチへ向かいましょう。",
  araha:
    "北谷町立博物館から車でおよそ10分、安良波公園・アラハビーチに着きます。全長およそ600mの白い砂浜が続くビーチのある公園です。園内には、1840年に北谷沖で座礁したイギリスの船「インディアン・オーク号」の乗組員を、北谷の人々が救い出し、帰国するまでの間もてなした歴史から、この船をかたどった遊具が置かれています。浜辺に沿って遊歩道もあります。遊泳するときは、遊泳期間や監視員の指示に従いましょう。この後は、車でおよそ9分、駐車場から歩いておよそ3分、北谷公園のあたりで昼食にしましょう。",
  lunch:
    "安良波公園・アラハビーチから車でおよそ9分、駐車場から歩いておよそ3分、北谷公園のあたりで昼食にしましょう。この後は、歩いておよそ7分、サンセットビーチへ向かいましょう。",
  sunset:
    "昼食の場所から歩いておよそ7分、北谷公園サンセットビーチに着きます。町なかにあるビーチで、東シナ海に沈む夕日が美しいことで知られる浜辺です。昼の間は、波打ち際を歩いたり、砂浜でのんびり過ごしたりできます。遊泳するときは、遊泳期間や監視員の指示に従いましょう。この後は、駐車場まで歩いておよそ8分、そこから車でおよそ14分、普天満宮へ向かいましょう。",
  futenma:
    `サンセットビーチから、駐車場まで歩いておよそ8分、そこから車でおよそ14分、普天満宮に着きます。琉球王国の時代に、王府から特別の扱いを受けた「琉球八社」の一つです。普天満の洞窟に琉球古神道の神をまつったことに始まり、1450年から1460年のころに熊野権現を合わせてまつったと伝えられています。${PRAY}この後は、車でおよそ14分、中城城跡へ向かいましょう。`,
  nakagusuku:
    `普天満宮から車でおよそ14分、中城城跡の入口に着きます。世界遺産「琉球王国のグスク及び関連遺産群」に登録され、国の史跡にも指定されている城跡です。一の郭と二の郭の石垣は、布積みと呼ばれる技法で積まれています。北の郭には大井戸があり、裏門には、ペリー探検隊の一行がエジプト式と評した精巧なアーチ門があります。城内には拝所もあります。${PRAY}立ち入りが禁じられている場所には入らないようにしましょう。高い石垣のまわりでは、足元に気をつけましょう。この後は、車でおよそ7分、中村家住宅へ向かいましょう。`,
  nakamura:
    "中城城跡から車でおよそ7分、中村家住宅に着きます。戦前の沖縄の住居建築の特色をすべて備えている建物とされ、国の重要文化財に指定されています。現存する建物は18世紀中ごろに建てられたと伝えられています。屋敷は東・南・西を琉球石灰岩の石垣で囲い、その内側に防風林の役目をする福木を植えて、台風に備えています。開館は9:00〜17:00(最終入場16:40)で、水曜日と木曜日は休館です。帰りは、那覇空港の近くまで車でおよそ38分。空港の近くで車を返しましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "北谷町立博物館(既存。点 node12357446756 のまま、始まり 9:00→9:30、入口の一文)",
    item: { id: MUSEUM, data: { lat: "26.323865", lng: "127.759455", visitTime: T(9, 30), stayDurationMin: 50, memo: M.museum } },
  },
  {
    label: "安良波公園・アラハビーチ(既存。点 natural=beach way541344402、車10)",
    item: { id: ARAHA, data: { lat: "26.304276", lng: "127.758538", visitTime: T(10, 30), stayDurationMin: 50, memo: M.araha, transitLegs: L(["car", 10]) } },
  },
  {
    label: "北谷公園のあたりで昼食(新規。点はバス停 node1993232522、店でない。車9＋歩き3)",
    item: {
      create: {
        name: "北谷公園のあたりで昼食", address: "沖縄県中頭郡北谷町美浜", lat: "26.314643", lng: "127.757988",
        visitTime: T(11, 32), stayDurationMin: 40, memo: M.lunch, transitLegs: C(["car", 9], ["walk", 3]),
      },
    },
  },
  {
    label: "サンセットビーチ(既存。点 natural=beach way188840514、歩き7)",
    item: { id: SUNSET, data: { lat: "26.313169", lng: "127.755097", visitTime: T(12, 19), stayDurationMin: 40, memo: M.sunset, transitLegs: L(["walk", 7]) } },
  },
  {
    label: "普天満宮(新規。点 place_of_worship way1017035026、歩き8＋車14)",
    item: {
      create: {
        name: "普天満宮", address: "沖縄県宜野湾市普天間1-27-10", lat: "26.29276", lng: "127.777091",
        visitTime: T(13, 21), stayDurationMin: 30, memo: M.futenma, transitLegs: C(["walk", 8], ["car", 14]),
      },
    },
  },
  {
    label: "中城城跡(既存。点 案内図 node12421968405、車25→14)",
    item: { id: NAKAGUSUKU, data: { lat: "26.285505", lng: "127.803464", visitTime: T(14, 5), stayDurationMin: 95, memo: M.nakagusuku, transitLegs: L(["car", 14]) } },
  },
  {
    label: "中村家住宅(既存。点 way461093135 のまま、歩き9→車7、帰りの一文)",
    item: { id: NAKAMURA, data: { lat: "26.289611", lng: "127.800542", visitTime: T(15, 47), stayDurationMin: 45, memo: M.nakamura, transitLegs: L(["car", 7]) } },
  },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true, thumbnailUrl: true } });
  if (it?.title !== TITLE_OLD || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  if (it?.thumbnailUrl !== THUMB_OLD) throw new Error(`表紙が想定と違います: ${it?.thumbnailUrl}`);
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true, url: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);
  if (!photos.some((p) => p.url === THUMB_NEW)) throw new Error("新しい表紙の写真が、サンセットビーチの写真の中にありません");

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節: そのまま\n表紙: 美浜の写真 → サンセットビーチの写真 ${THUMB_NEW}\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
    const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})。写真 850e29eb も消える`);
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 11:32(13:30より前)/ 終わり 中村家住宅 16:32(日帰りの 16:30〜17:00、最終入場 16:40 より前に着く)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW, thumbnailUrl: THUMB_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
