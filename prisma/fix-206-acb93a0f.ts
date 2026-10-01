/**
 * #206 acb93a0f「たつこ像と神秘の湖、日本一深い田沢湖を巡る定番日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜10:50 で、行き方・昼食・帰りの一言がなく、本文はツアーガイドの話し方（「皆様」「ご案内いたします」）。
 *   たつこ像の座標が湖の真ん中（39.725,140.661）になっていたので直す
 * 車で湖を時計回りに一周（JR田沢湖駅のそばの駅レンタカー 8:00〜18:00 https://www.ekiren.co.jp/office/detail/B00507 、店名は書かない）:
 *   田沢湖遊覧船（白浜 9:10発・約40分）→ 白浜と姫観音 → 御座石神社 → むらっこ物産館（昼食）→ たつこ像 → 漢槎宮（浮木神社）→ 思い出の潟分校 → 県民の森 → 姫塚公園 16:30 → 田沢湖駅
 *   遊覧船は4月中ごろ〜11月上旬、むらっこ物産館も4月〜11月の営業なので、季節は春・夏・秋
 * 本文の出典（仙北市の観光情報 https://www.city.semboku.akita.jp/sightseeing/spot/ ）: 田沢湖 04_tazawako.html （周囲約20km・水深423.4m 日本一）／遊覧船 04_yuuran.html ・
 *   https://tazawako-resthouse.jp/yuransen-2 （検索結果の要約: 9:10発・約40分で白浜に戻る・潟尻桟橋への寄港は中止中）／白浜 04_shirahama.html （以前は鳴き砂・遊歩道 約1km）／
 *   姫観音 04_himekan.html （昭和15年に玉川の強酸性の水を導入・滅びゆく魚とたつこ姫の慰霊・湖に向かって立つ）／御座石 04_goza.html （ござを敷いたような岩場・秋田藩主が腰をかけたと伝わる・たつこ姫を祭る神社）／
 *   むらっこ物産館 04_murakko.html （旬の野菜・西明寺栗・軽食コーナー・4月〜11月）／たつこ像 04_tatsukozou.html （舟越保武・昭和43年5月12日建立）／漢槎宮 04_ukigi.html （浮木神社・白木造りの社殿・浮木を祭る）／
 *   思い出の潟分校 04_katabunko.html （昭和49年に廃校・平成16年に一般公開）／県民の森 04_kenmin.html （昭和43年全国植樹祭・昭和53年全国育樹祭・各県の木を日本地図のように）／
 *   姫塚公園 04_himetsuka.html （平将門の娘・滝夜叉姫が落ちのび村の祖になったと伝わる）
 * 座標の出典: OSM — 田沢湖レストハウス node 6722076331（遊覧船の乗り場の前）／白浜 way 1278652792／姫観音像 node 10089664154／御座石神社 way 837055330／むらっこ物産館 way 279358408／
 *   浮木神社（潟尻） way 910016132／思い出の潟分校 way 279356305／県民の森 way 737324661／姫塚公園 way 775575411。
 *   推定: たつこ像は OSM に潟尻の点がないので、仙北市のページで「たつこ像のすぐそば」とされる漢槎宮（浮木神社）way 910016132 の点
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-206-acb93a0f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "acb93a0f-4b8d-457d-ac3b-f513903aed43";
const DAY_ID = "cb412991-fdf1-43da-b3e7-c568905e3424";
const TATSUKO = "0dbb5188-ef38-40dc-8508-21dd0568e071";
const GOZA = "a178351a-36c0-4ed4-9525-700fdfc260f8";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION =
  "水深423.4mと日本一の深さをもつ田沢湖を、遊覧船と車でぐるりとめぐる日帰りプランです。白浜から遊覧船で湖の上へ出て、御座石神社や金色のたつこ像、浮木神社など、たつこ姫の伝説にまつわる場所をたずね、昔の分校や県民の森にも立ち寄ります。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY = [
  cre("田沢湖遊覧船", { h: 9, m: 0, stay: 55, mode: null, min: null, lat: 39.7307174, lng: 140.69948, address: "秋田県仙北市田沢湖田沢字春山148",
    memo: "この旅は車でめぐります。JR田沢湖駅のそばでレンタカーを借りて、車で約15分の田沢湖の東岸・白浜へ。田沢湖は周囲約20kmのほぼ円い湖で、水深は423.4mと日本一の深さです。白浜を出る遊覧船は、湖の上をめぐって約40分で戻ってきます。運航の期間や便は公式の案内で確かめましょう。" }),
  cre("白浜と姫観音", { h: 10, m: 0, stay: 30, mode: "walk", min: 5, lat: 39.7379021, lng: 140.693983, address: "秋田県仙北市田沢湖田沢字春山",
    memo: "船を降りたら、湖岸の遊歩道を歩きます。白浜は、かつて鳴き砂として知られ、その白さから名づけられた浜です。湖畔には姫観音が湖に向かって立っています。昭和15年に、発電などのため玉川の強い酸性の水を湖に引き入れたことで、湖の多くの魚がいなくなりました。姫観音は、その魚たちと湖の神・たつこ姫を慰めるために、まわりの寺の住職たちが中心となって建てたものです。湖岸では足元に気をつけましょう。" }),
  upd(GOZA, { h: 10, m: 50, stay: 35, mode: "car", min: 20, lat: 39.7516066, lng: 140.6504775, address: "秋田県仙北市西木町桧木内字相内潟",
    memo: "白浜に戻って車に乗り、湖を時計回りに約20分、北岸の御座石へ。湖畔にござを敷いたような平らな岩場があり、昔、秋田藩主が田沢湖を遊覧したときに、ここに腰をかけて休んだと伝えられます。すぐ上には、湖の神・たつこ姫をまつる神社があります。" + RESPECT + "岩場では足元に気をつけましょう。" }),
  cre("むらっこ物産館", { h: 11, m: 45, stay: 60, mode: "car", min: 20, lat: 39.7145076, lng: 140.6260829, address: "秋田県仙北市西木町西明寺字潟尻119",
    memo: "御座石神社から車で約20分、湖の西側の潟尻へ。旬の野菜や山の幸が並ぶ物産館で、秋には大粒の西明寺栗とその加工品も並びます。軽食のコーナーでは、地元の農家の人たちが育てた米や野菜を使った手づくりの料理が味わえるので、ここで昼食にしましょう。冬は休業します。" }),
  upd(TATSUKO, { h: 12, m: 50, stay: 30, mode: "car", min: 5, lat: 39.7137454, lng: 140.6346944, address: "秋田県仙北市西木町西明寺字潟尻",
    memo: "物産館から車で約5分。永遠の若さと美しさを願い、湖の神になったと伝えられるたつこ姫のブロンズ像で、彫刻家・舟越保武がつくり、昭和43年に建てられました。金色の像が、澄んだ青い湖水を背に静かに立っています。" }),
  cre("漢槎宮（浮木神社）", { h: 13, m: 25, stay: 20, mode: "walk", min: 5, lat: 39.7137454, lng: 140.6346944, address: "秋田県仙北市西木町西明寺字潟尻",
    memo: "たつこ像のすぐそば。浮木神社とも呼ばれる、白木造りの社殿の神社で、湖に流れついた大きな浮木をまつったものといわれます。" + RESPECT }),
  cre("思い出の潟分校", { h: 14, m: 0, stay: 30, mode: "car", min: 15, lat: 39.6969654, lng: 140.6727864, address: "秋田県仙北市田沢湖潟字一ノ渡222-8",
    memo: "浮木神社から車で約15分、湖の南側へ。昭和49年に閉校した小学校の分校を直して、平成16年から公開している建物で、昔の学校の雰囲気を感じられます。" }),
  cre("県民の森", { h: 14, m: 50, stay: 50, mode: "car", min: 20, lat: 39.7193576, lng: 140.6959809, address: "秋田県仙北市田沢湖田沢",
    memo: "分校から車で約20分、湖の東側へ。昭和43年の全国植樹祭と昭和53年の全国育樹祭の会場になった森林公園で、全国の都道府県の木が、地域ごとに日本地図のように植えられています。森の中を歩くときは、歩きやすい靴で出かけましょう。" }),
  cre("姫塚公園", { h: 16, m: 0, stay: 30, mode: "car", min: 20, lat: 39.7250119, lng: 140.7196509, address: "秋田県仙北市田沢湖生保内字堂ノ前",
    memo: "県民の森から車で約20分、田沢湖駅の方へ戻ります。平安時代、天慶の乱のあとにこの地へ落ちのびた平将門の娘・滝夜叉姫が、村の祖になったと伝えられる場所です。見学のあとは、田沢湖駅のそばでレンタカーを返し、JRで帰りましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [TATSUKO, GOZA].join()) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${"id" in x ? (x.id === TATSUKO ? "たつこ像(既存)" : "御座石神社(既存)") : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, seasons: ["spring", "summer", "autumn"] } });
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
