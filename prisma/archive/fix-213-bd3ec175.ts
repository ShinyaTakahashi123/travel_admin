/**
 * #213 bd3ec175「光の王国、日本最大級のイルミネーションを楽しむ夜プラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 18:00〜20:00 の夜だけのプランで、本文は案内の話し方（「皆様」「存分にお楽しみください」）、「世界最大級ともいわれる」など確かめられない言い方があった。
 *   夜はスポットにしない決まり（仕様書 6）なので、昼は佐世保の九十九島と港町をめぐり、夕方にハウステンボスへ入って、夜のイルミネーションは最後のメモで案内する。
 *   「光の王国」「1300万球」「日本最大級」は今の公式のページで確かめられないので使わず、タイトル・説明文・スポットの名前を直す
 * 車の旅（JR佐世保駅でレンタカーを借りて返す）:
 *   展海峰 9:00 → 九十九島遊覧船パールクィーン（10:00頃の便）→ 九十九島水族館 海きらら → させぼ五番街（昼食）→ 海上自衛隊佐世保史料館 → 弓張岳展望台 → ハウステンボス 15:50〜17:00
 *   #442（ハウステンボスの昼）・#119（パレスハウステンボス）と重ならないよう、ハウステンボスの中の見どころは書かない
 * 本文の出典: 海風の国（佐世保・小値賀 観光公式）https://www.sasebo99.com/spot/<番号> —
 *   展海峰 274（標高165m・九十九島が180度・菜の花とコスモス）／九十九島パールシーリゾート 258（九十九島の玄関口・遊覧船・水族館・レストラン）／
 *   パールクィーン 261（約50分・10:00頃〜15:00頃の便・海の女王のイメージ・白い船体）／海きらら 291（約1,000種類の魚・100種類以上のクラゲ・3〜10月 9:00〜18:00、11〜2月 9:00〜17:00）／
 *   させぼ五番街 61222（佐世保駅みなと口から徒歩1分・海に面した商業施設・レストランやカフェ）／海上自衛隊佐世保史料館 263（佐世保水交社の一部を修復・7階の展望ロビー・旧海軍と海上自衛隊の歴史・護衛艦くらまの錨）／
 *   弓張岳展望台 265（五島灘と九十九島・佐世保港・市街地・夜景）／ハウステンボス 259（大村湾に面した敷地・季節の花・レンガ造りの街並みと運河・10:00〜21:00）
 *   イルミネーション: ハウステンボス公式 https://www.huistenbosch.co.jp/event/illumination/ （11月上旬〜2月下旬・星空の中を歩くような演出）→ 季節は秋・冬
 * 座標: OSM — 展海峰 node 2083152386／九十九島パールシーリゾート node 3023900936（遊覧船の乗り場）／海きらら way 1154324443（Nominatim の中心）／
 *   させぼ五番街 relation 10384846（同）／海上自衛隊佐世保史料館 node 1423807391／弓張岳展望台 way 543422675（同）／ハウステンボス way 552135649（同）
 * 入れなかった所: カトリック三浦町教会（OSM の点がない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-213-bd3ec175.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "bd3ec175-b1cc-43be-9169-ec9e31ecc71a";
const DAY_ID = "3027646e-7475-4ed6-a1b3-1f3153adeab4";
const HTB = "3481c24a-6e3d-4cd4-b99c-b6732b521d92";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const TITLE = "九十九島と港町・佐世保をめぐり、夜はハウステンボスのイルミネーションへ";
const DESCRIPTION =
  "展海峰から九十九島を見渡し、遊覧船と水族館で九十九島の海にふれたら、港町・佐世保で昼食をとって、海上自衛隊佐世保史料館と弓張岳展望台へ。夕方にハウステンボスへ入り、日が暮れたらイルミネーションに包まれる街を歩く、秋から冬のレンタカーの日帰りプランです。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY = [
  cre("展海峰", { h: 9, m: 0, stay: 45, mode: null, min: null, lat: 33.1323347, lng: 129.692917, address: "長崎県佐世保市下船越町399",
    memo: "この旅は車でめぐります。JR佐世保駅の近くでレンタカーを借りて、車で約25分。標高165mの展望台で、九十九島の島々と佐世保港が、180度のパノラマで目の前に広がります。展望台の下の園地には、春は菜の花、秋はコスモスが咲きます。" }),
  cre("九十九島遊覧船パールクィーン", { h: 10, m: 0, stay: 50, mode: "car", min: 15, lat: 33.1624548, lng: 129.6789408, address: "長崎県佐世保市鹿子前町1008",
    memo: "展海峰から車で約15分、九十九島の玄関口・九十九島パールシーリゾートへ。ここから出る遊覧船で、九十九島の南部を約50分かけてめぐります。海の女王をイメージした白い船で、島々の間をゆっくり進みます。便の時刻は公式の案内で確かめましょう。デッキでは手すりにつかまり、足元に気をつけましょう。" }),
  cre("九十九島水族館 海きらら", { h: 10, m: 55, stay: 50, mode: "walk", min: 5, lat: 33.1611395, lng: 129.6791481, address: "長崎県佐世保市鹿子前町1008",
    memo: "船を降りて歩いてすぐ。九十九島の海の世界を再現した水族館で、約1,000種類といわれる九十九島の魚たちや、100種類以上のクラゲなどを、海の中を歩いているように間近に見られます。" }),
  cre("させぼ五番街", { h: 12, m: 5, stay: 50, mode: "car", min: 20, lat: 33.1651162, lng: 129.7230944, address: "長崎県佐世保市新港町2-1",
    memo: "水族館から車で約20分、JR佐世保駅のみなと口のそばへ。海に面した商業施設で、海を眺めながら食事のできるレストランやカフェもあるので、ここで昼食にしましょう。" }),
  cre("海上自衛隊佐世保史料館（セイルタワー）", { h: 13, m: 10, stay: 60, mode: "car", min: 15, lat: 33.1738249, lng: 129.7135187, address: "長崎県佐世保市上町8-1",
    memo: "五番街から車で約15分。海軍の士官の集会所だった佐世保水交社の一部を修復した施設で、旧日本海軍と海上自衛隊の歴史や活動を、艦艇の模型や史料でわかりやすく紹介しています。7階には展望ロビーがあり、入口には護衛艦くらまの実物の錨が置かれています。休館日は公式の案内で確かめましょう。" }),
  cre("弓張岳展望台", { h: 14, m: 30, stay: 40, mode: "car", min: 20, lat: 33.1793625, lng: 129.7008186, address: "長崎県佐世保市小野町",
    memo: "史料館から車で約20分、山の上の展望台へ。西には五島灘と九十九島の島々、南には深い入り江の佐世保港、東には佐世保の市街地が見渡せます。" }),
  {
    id: HTB,
    data: {
      name: "ハウステンボス", visitTime: t(15, 50), stayDurationMin: 70, transitMode: "car", transitDurationMin: 40, transitLine: null,
      lat: 33.0862043, lng: 129.7883148, address: "長崎県佐世保市ハウステンボス町1-1",
      memo: "弓張岳から車で約40分、大村湾のほとりのハウステンボスへ。広い敷地に、季節の花が咲き、レンガ造りの街並みの間を運河がめぐります。秋から冬にかけては、日が暮れると街がイルミネーションに包まれ、星空の中を歩くような光の景色が広がります。イルミネーションの期間や点灯の時間、その日の営業時間は公式の案内で確かめましょう。夜の帰りは、レンタカーをJR佐世保駅の近くで返しましょう（車で約40分）。",
    },
  },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] → ${TITLE}`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== HTB) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${d.name}${"id" in x ? "(既存)" : ""} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION, seasons: ["autumn", "winter"] } });
      await setDaySpotOrder(DAY_ID, DAY, { tx });
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
