/**
 * #204 ac272e0b「大鳴門橋遊歩道「渦の道」と道の駅くるくる なると、鳴門1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 10:00〜10:50 / 1か所 09:30〜10:20 で、行き方・昼食・宿の一言がなく、本文はツアーガイドの話し方。
 *   道の駅くるくる なるとの住所が「鳴門町土佐泊浦大毛島」になっていたが、公式では「鳴門市大津町備前島字蟹田の越338-1」なので直す。
 *   その道の駅に付いていた写真は鳴門の渦潮の写真（場所が違う）なので外す（写真の控えのキーは渦潮として正しいので残す）
 *   説明文の「観潮船や美術館とは違う」に合わせ、うずしお観潮船と大塚国際美術館は入れない。#468・#397 の文は使わない
 * 車の旅（JR徳島駅の近くでレンタカーを借りて返す。徳島駅東のレンタカーは8時から https://store.nipponrentacar.co.jp/b/nrs/info/110211/ 、店名は書かない）。宿は鳴門
 * 1日目: 渦の道 9:30 → 大鳴門橋架橋記念館エディ → 千畳敷展望台 → 道の駅くるくる なると（2日目から・昼食）→ 大麻比古神社 → ドイツ橋 → 霊山寺 → 極楽寺 16:30
 * 2日目: 金泉寺 9:00 → 大日寺 → 地蔵寺 → 道の駅第九の里（昼食）→ 鳴門市ドイツ館 → 賀川豊彦記念館 → あすたむらんど徳島 16:30 → 徳島駅で車を返す
 * 本文の出典: 渦の道 https://www.uzunomichi.jp/ （渦上45m・展望室まで450m・足元のガラス窓・橋桁の空間を使った回遊式）／
 *   阿波ナビ（徳島県観光情報サイト）: エディ https://www.awanavi.jp/archives/spot/2890 ・千畳敷展望台 /3367 ・大麻比古神社 /1252 ・ドイツ橋 /2814 ・霊山寺 /2806 ・極楽寺 /2805 ・
 *     金泉寺 /2791 ・大日寺 /2790 ・地蔵寺 /2789 ・道の駅第九の里 /2073 ・賀川豊彦記念館 /2901 ・あすたむらんど /2880 （URLは https://www.awanavi.jp/archives/spot/<番号>）／
 *   道の駅くるくる なると https://www.kurukurunaruto.com/ （住所・食堂など）・docs/content/spot-memo-sources/徳島県.md（2022年オープン・鳴門金時やレンコンなどの特産品）／
 *   鳴門市ドイツ館 https://doitsukan.com/what.html （1917〜1920年の板東俘虜収容所・人権を尊重し自主的な活動を認めた・1918年6月1日に第九をアジアで初めて全曲演奏・住民との交流・第九シアター）
 * 開く時間（本文には書かない）: 渦の道 9時〜（10〜2月は17時まで）／ドイツ館・賀川豊彦記念館 9:30〜17:00（入館16:30まで）第4月曜休／第九の里の軽食 10〜16時／あすたむらんど 水曜休・入館は閉館30分前まで
 * 座標の出典: OSM — 渦の道 node 3283251861／エディ way 1104053882／千畳敷展望台 node 265064568／大麻比古神社 way 772422582／ドイツ橋 node 7211674175／霊山寺 way 416330224／
 *   極楽寺 node 314743789／金泉寺 node 314747817（第03番札所）／大日寺 node 9392203520／地蔵寺 node 14205283659／道の駅第九の里 way 437431960／鳴門市ドイツ館 way 320024675／
 *   賀川豊彦記念館 way 320024677／あすたむらんど徳島子ども科学館 node 1423658168。
 *   推定: 道の駅くるくる なるとは OSM に点がなく、国土地理院の住所検索も字までなので、OSM の地名「大津町備前島」node 7619155071 の点
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-204-ac272e0b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ac272e0b-8781-4d47-ad7b-3112e9c6bd53";
const DAY_IDS = ["2287660a-8097-4552-a33f-9982bbccb74f", "11a89edd-780e-48c8-b5a8-b5f227d77161"];
const UZU = "36c6baaa-c4bc-471e-9a34-0cfb7261ffef";
const KURU = "b1b4165e-0527-468f-84d6-52db502a8404";
const WRONG_PHOTO = "d8bdd1ce-db83-44d7-843e-989f961612f4";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION =
  "海の上45mから渦潮を見下ろす遊歩道「渦の道」と、鳴門の食がそろう道の駅くるくる なるとを入り口に、レンタカーでめぐる鳴門の1泊2日です。1日目は鳴門公園から大麻比古神社、ドイツ兵がつくったドイツ橋、四国八十八ヶ所の1番・2番札所へ。2日目は3番から5番の札所を歩き、ドイツ館と賀川豊彦記念館、あすたむらんど徳島をたずねます。観潮船や美術館とは違う角度から、鳴門の魅力にふれるプランです。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY1 = [
  upd(UZU, { h: 9, m: 30, stay: 50, mode: null, min: null, lat: 34.2361791, lng: 134.6421065, address: "徳島県鳴門市鳴門町土佐泊浦福池65",
    memo: "この旅は車でめぐります。JR徳島駅の近くでレンタカーを借りて、車で約45分の鳴門公園へ。大鳴門橋の橋桁の中の空間を使った海の上の遊歩道で、渦潮の真上45mの展望室まで、約450mの道が続きます。展望室では足元のガラス窓から鳴門海峡をのぞき込めます。渦潮が見ごろになる時間は日によって変わり、時間によっては渦が見られないこともあるので、公式の案内で確かめてから出かけましょう。" }),
  cre("大鳴門橋架橋記念館エディ", { h: 10, m: 25, stay: 40, mode: "walk", min: 5, lat: 34.2348678, lng: 134.6401008, address: "徳島県鳴門市鳴門町土佐泊浦福池65",
    memo: "渦の道から歩いて約5分。渦と橋をテーマにした記念館で、鳴門の渦潮が生まれるしくみや大鳴門橋のつくりを、映像や疑似体験の装置などを使って、いろいろな角度から紹介しています。休館日は公式の案内で確かめましょう。" }),
  cre("千畳敷展望台", { h: 11, m: 10, stay: 20, mode: "walk", min: 5, lat: 34.2370283, lng: 134.6424379, address: "徳島県鳴門市鳴門町土佐泊浦",
    memo: "エディから歩いて約5分。大鳴門橋をすぐ近くに見上げられる展望台で、橋の大きさが間近に感じられます。展望台のまわりでは足元に気をつけましょう。" }),
  upd(KURU, { h: 11, m: 55, stay: 70, mode: "car", min: 25, lat: 34.1614276, lng: 134.5786142, address: "徳島県鳴門市大津町備前島字蟹田の越338-1",
    memo: "千畳敷展望台から車で約25分。四国・徳島・鳴門の玄関口に2022年にできた道の駅で、鳴門金時やレンコンなど、このあたりの特産品を味わえる食のテーマパークです。館内には食堂などもあるので、ここで昼食にしましょう。" }),
  cre("大麻比古神社", { h: 13, m: 25, stay: 60, mode: "car", min: 20, lat: 34.1704008, lng: 134.5025201, address: "徳島県鳴門市大麻町板東字広塚13",
    memo: "道の駅から車で約20分、大麻町へ。県内でいちばんの格式をもつとされる神社で、農業や産業の守り神の天太玉命（大麻比古命）と、交通安全や厄除けの神の猿田彦命をまつっています。樹齢1000年と伝わる御神木の楠は、鳴門市の天然記念物です。" + RESPECT }),
  cre("ドイツ橋", { h: 14, m: 30, stay: 20, mode: "walk", min: 5, lat: 34.171666, lng: 134.502033, address: "徳島県鳴門市大麻町",
    memo: "大麻比古神社の境内から歩いて約5分。桜の名所の丸山公園の小さな谷川に架かる石の橋で、第一次世界大戦のころ、近くの収容所にいたドイツ兵が、母国の技を生かしてつくりました。この縁で、鳴門市はドイツのリューネブルク市と姉妹都市になっています。橋の上や川べりでは足元に気をつけましょう。" }),
  cre("霊山寺", { h: 14, m: 55, stay: 45, mode: "car", min: 5, lat: 34.1596113, lng: 134.502635, address: "徳島県鳴門市大麻町板東塚鼻126",
    memo: "ドイツ橋から神社の駐車場の車に戻り、車で約5分。四国八十八ヶ所霊場の第1番札所です。行基菩薩が開いたと伝えられ、弘法大師が四国霊場を開こうと願って21日間祈り、釈迦如来を刻んで本尊とし、八十八ヶ所の1番と定めたといわれます。今の本堂は昭和39年（1964年）に建て直されたものです。" + RESPECT }),
  cre("極楽寺", { h: 15, m: 45, stay: 45, mode: "car", min: 5, lat: 34.1561604, lng: 134.4902123, address: "徳島県鳴門市大麻町檜",
    memo: "霊山寺から車で約5分。四国八十八ヶ所の第2番札所で、行基菩薩が開いたと伝えられます。本尊の阿弥陀如来坐像は、国の重要文化財です。境内には、弘法大師が植えたとされる樹齢1200年あまりの「長命杉」がそびえ、高さは約31mあります。" + RESPECT + "このあとは、車で鳴門の宿へ向かいましょう。" }),
];

const DAY2 = [
  cre("金泉寺", { h: 9, m: 0, stay: 40, mode: null, min: null, lat: 34.1465835, lng: 134.4691245, address: "徳島県板野郡板野町大寺亀山下66",
    memo: "2日目も車でめぐります。宿から車で、板野町の金泉寺へ。四国八十八ヶ所の第3番札所で、境内の古井戸から黄金の仏像が現れたことにちなんで、金泉寺と名を改めたといわれます。その井戸は今も大師堂のそばにあります。源義経が屋島へ向かう途中、ここで兵を休めたという言い伝えも残ります。" + RESPECT }),
  cre("大日寺", { h: 9, m: 55, stay: 35, mode: "car", min: 15, lat: 34.1400763, lng: 134.4434805, address: "徳島県板野郡板野町黒谷",
    memo: "金泉寺から車で約15分。四国八十八ヶ所の第4番札所で、弘法大師が開いたと伝えられます。人里を離れた渓流のそばにある、とても静かな寺です。藩主・蜂須賀家の信仰も厚かったといわれます。" + RESPECT }),
  cre("地蔵寺", { h: 10, m: 40, stay: 45, mode: "car", min: 10, lat: 34.1371955, lng: 134.4319404, address: "徳島県板野郡板野町羅漢",
    memo: "大日寺から車で約10分。四国八十八ヶ所の第5番札所で、嵯峨天皇の勅願により弘法大師が開いたと伝えられます。境内の奥には、釈尊を中心に等身大の羅漢像が並ぶ五百羅漢があり、今の像は3度目に造り直されたものです。" + RESPECT }),
  cre("道の駅第九の里", { h: 11, m: 40, stay: 60, mode: "car", min: 15, lat: 34.1637988, lng: 134.4987203, address: "徳島県鳴門市大麻町桧字東山田53",
    memo: "地蔵寺から車で約15分、大麻町へ戻ります。ドイツ館と賀川豊彦記念館のある「ドイツ村公園」の中にある道の駅で、軽食のコーナーもあるので、ここで昼食にしましょう。" }),
  cre("鳴門市ドイツ館", { h: 12, m: 45, stay: 75, mode: "walk", min: 5, lat: 34.1646355, lng: 134.4990662, address: "徳島県鳴門市大麻町桧字東山田55-2",
    memo: "道の駅から歩いてすぐ。第一次世界大戦中の1917年から1920年まで、この地にあった板東俘虜収容所を伝える資料館です。収容所では、所長たちがドイツ兵の人権を尊重して自主的な活動を認め、兵たちは住民と交流しました。1918年6月1日には、ここでベートーヴェンの第九がアジアで初めて全曲演奏されたとされ、館内の第九シアターでは、そのときの様子を映像などで紹介しています。休館日は公式の案内で確かめましょう。" }),
  cre("賀川豊彦記念館", { h: 14, m: 5, stay: 45, mode: "walk", min: 5, lat: 34.1632775, lng: 134.4987576, address: "徳島県鳴門市大麻町檜字東山田50-2",
    memo: "ドイツ館から歩いてすぐ。「友愛・互助・平和」を説き、社会的に弱い立場の人々のために力を尽くした賀川豊彦の生涯と足跡を紹介する記念館です。休館日は公式の案内で確かめましょう。" }),
  cre("あすたむらんど徳島", { h: 15, m: 10, stay: 80, mode: "car", min: 20, lat: 34.1534022, lng: 134.4411706, address: "徳島県板野郡板野町那東字キビガ谷45-22",
    memo: "記念館から車で約20分。遊びや体験を通して科学する心を育てる大きな公園で、中心の子ども科学館では「科学技術と自然環境との調和」をテーマにした3つの展示や、プラネタリウムが楽しめます。休館日は公式の案内で確かめましょう。見学のあとは、車で約30分の徳島駅へ戻り、レンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.map((d) => d.id).join() !== DAY_IDS.join() || it.days[0].spots.map((s) => s.id).join() !== UZU || it.days[1].spots.map((s) => s.id).join() !== KURU) throw new Error("構成が想定と違います");
  const ph = it.days[1].spots[0].photos.find((p) => p.id === WRONG_PHOTO);
  if (!ph || !String(ph.sourceUrl).includes("Naruto_Whirlpools")) throw new Error("写真が想定と違います");
  if (it.thumbnailUrl === ph.url) throw new Error("表紙がこの写真です");
  [DAY1, DAY2].forEach((arr, i) => {
    console.log(`\n${i + 1}日目 ${arr.length}か所`);
    let prevEnd = -1;
    for (const x of arr) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${"id" in x ? (x.id === UZU ? "渦の道(既存)" : "くるくる(既存)") : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  });
  console.log(`\n外す写真: ${ph.sourceUrl}\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.photo.delete({ where: { id: WRONG_PHOTO } });
      await tx.spot.update({ where: { id: KURU }, data: { dayId: DAY_IDS[0], orderNo: 901 } });
      await setDaySpotOrder(DAY_IDS[0], DAY1, { tx });
      await setDaySpotOrder(DAY_IDS[1], DAY2, { tx });
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
