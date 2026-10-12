/**
 * #153 245d49ce「広島市現代美術館と八丁堀、街なかアートとグルメの1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは各日1か所（10:00〜11:10 / 09:30〜10:50）で、昼食と宿・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。現代美術館の開館は10:00なので、1日目は郷土資料館から始める
 * 八丁堀（お好み村周辺）は、商業施設の名前を外して「八丁堀（昼食）」にし、1日目の昼食に移す
 * 歩きと路面電車・アストラムライン・JR・バスの旅（広島駅から。広島市内に泊まる）:
 *   1日目: 広島市郷土資料館 9:30 → 広島市現代美術館 → 広島市まんが図書館 → 八丁堀（昼食）→ 中工場 → 江波山気象館 16:30 → 宿
 *   2日目: 不動院 9:30 → ヌマジ交通ミュージアム → 本通（昼食）→ ひろしま美術館 → 三瀧寺 16:30 → 広島駅
 * タイトル・季節はそのまま、説明文は書き直す
 * 広島市のほかのしおり（3155fabf・78026dc9・998ecdfc・fb532960）の本文を読み、使っていない話で書いた（現代美術館は 78026dc9 の「日本で初めて」「三角屋根」「地下6割」を使わず、
 *   自然石・タイル・アルミの素材の変化と収集の3つの方針。縮景園・広島県立美術館・本通商店街・比治山公園はほかのしおりが使っているので入れない）。ほかの8か所はほかのしおりにない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   city.hiroshima.lg.jp/faq/facility/1001668/1002713.html（郷土資料館: 明治時代の旧陸軍宇品糧秣支廠・原爆で曲がった鉄骨を保存・郷土の歴史資料・宇品二丁目電停から300m・月曜休館）と
 *   dive-hiroshima.com 検索結果の同館（缶詰工場として建てられた）／hiroshima-moca.jp/moca/about（現代美術館: 1989年開館・全国で初めて現代美術に本格的に取り組む公立美術館・黒川紀章・
 *   自然石、タイル、アルミと変化する素材で過去から未来への時間・比治山公園・収集の3つの方針（戦後の現代美術、ヒロシマと現代美術、若手作家））・moca/guide（10:00〜17:00、月曜休館）／
 *   library.city.hiroshima.jp（まんが図書館: 比治山公園1-4・漫画と関連資料約155,000冊・月曜休館）／city.hiroshima.lg.jp/soshiki/93/13300.html と dive-hiroshima.com/en/explore/2011/
 *   （中工場: 谷口吉生の設計・平成16年竣工・建物の中央を通り抜ける「エコリアム」から海を望む・9:00〜16:30・祝日と8月6日と年末年始は休み）／city.hiroshima.lg.jp/faq/facility/1001668/1002714.html
 *   （江波山気象館: 昭和9年の旧広島気象台・爆心地から約3.7kmで爆風を受けた壁を保存・気象の展示・江波電停から約1,000m・月曜休館）／dive-hiroshima.com/en/explore/1132/（不動院: 平安末にはあったと考えられる・
 *   南北朝に安国寺の一つ・安国寺恵瓊が再興・福島正則の祈祷僧の宥珍が不動院と改めた・金堂は国宝・山のふもとで原爆の被害を免れた・アストラムライン不動院前駅）／
 *   vehicle.city.hiroshima.jp/about/（ヌマジ交通ミュージアム: 平成7年開館・2,000点以上の模型・直径20mのパノラマ・広島電鉄650形654号の被爆電車・9:00〜17:00、長楽寺駅から約5分・月曜休館）／
 *   hiroshima-museum.jp/outline/（ひろしま美術館: 昭和53年開館・原爆ドームをイメージした丸いドームの展示室・厳島神社の回廊をイメージした回廊・ゴッホ「ドービニーの庭」・印象派を中心とするフランス近代美術・月曜休館）／
 *   city.hiroshima.lg.jp/atomicbomb-peace/fukko/1021101/1026920/1026921/1020824.html（三瀧寺: 爆心地から3,180m・江戸末期から明治初期の木造建物・谷間に想親観音堂、鐘楼、稲荷社、三鬼権現堂、鎮守堂・
 *   原爆の爆風が斜面をかけあがり、境内の建物に大きな被害）／三瀧寺へは横川駅から可部線で三滝駅、歩いて15分（市の観光資料の検索結果）
 * 座標: OSM — 郷土資料館 way 121980863（museum、Nominatim の中心）・現代美術館 node 1375543445（museum）・まんが図書館 node 1375543446（library）・八丁堀 node 266052318（tram_stop）・
 *   江波山気象館 node 1423636508（museum）・不動院 node 2787767091（place_of_worship）・ヌマジ node 1423636267（museum）・本通 node 9623798507（station）・ひろしま美術館 relation 1398010（museum、中心）・
 *   三瀧寺 way 1231094379（place_of_worship、中心）／中工場は OSM に名前つきの点がない（レンタサイクルの点だけ）ので、国土地理院の番地の点（南吉島一丁目5番1号）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-153-245d49ce.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "245d49ce-4687-4b42-ac4c-f62e5d2c6072";
const DAY1_ID = "0157db9d-99c1-47d4-bd72-3be9e1d28d8c";
const DAY2_ID = "80161134-7f2c-4521-b5cc-12f24102fc41";
const MOCA = "c1271413-0d63-40a2-90b2-c91d0609cbe3";
const HATCHO = "bf2ac218-9bdf-4cbf-a5c8-c3f303cf5122";
const NAKA = { lat: 34.358875, lng: 132.442627 };
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "比治山の広島市現代美術館とまんが図書館、谷口吉生が設計した中工場、旧気象台の江波山気象館など、建物と美術をたどって街なかをめぐり、八丁堀で昼食を。2日目は国宝の金堂が残る不動院、乗り物の模型が並ぶヌマジ交通ミュージアム、ひろしま美術館、三瀧寺へ。平和記念公園や広島城とは違う広島を、路面電車とアストラムラインで歩く1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  cre("広島市郷土資料館", { h: 9, m: 30, stay: 60, legs: [], lat: 34.3660563, lng: 132.4615983, address: "広島県広島市南区宇品御幸2-6-20",
    memo: "この旅は歩きと路面電車などでめぐります。広島駅から路面電車（広島港行き）で宇品二丁目へ行き、歩いて約5分。明治時代に建てられた旧陸軍の宇品糧秣支廠の、缶詰工場だった赤れんがの建物を使った資料館で、広島の昔の暮らしと歴史の資料を紹介しています。館内には、原爆によって曲がった鉄骨が残されています。原爆で亡くなった方々をしのびながら、静かに見学しましょう。休館日は公式の案内で確かめましょう。" }),
  upd(MOCA, { h: 10, m: 55, stay: 80, legs: [walk(5), train(12, "広島電鉄（宇品二丁目→比治山下）"), walk(8)], lat: 34.386388, lng: 132.4733314, address: "広島県広島市南区比治山公園1-1",
    memo: "宇品二丁目から路面電車で比治山下へ行き、坂を上って歩いて約8分（あわせて約25分）。比治山公園の緑の中に建つ、平成元年（1989年）開館の美術館で、建築家・黒川紀章が設計しました。建物は下から自然石、タイル、アルミと素材が移り変わり、過去から未来への時の流れを表しています。戦後の現代美術、ヒロシマと現代美術、これからの若い作家という3つの柱で作品を集めています。休館日は公式の案内で確かめましょう。" }),
  cre("広島市まんが図書館", { h: 12, m: 18, stay: 37, legs: [walk(3)], lat: 34.3876911, lng: 132.4744661, address: "広島県広島市南区比治山公園1-4",
    memo: "美術館から公園の中を歩いて約3分。漫画と漫画に関わる資料を、約155,000冊集めた図書館です。図書館なので、館内では静かに過ごしましょう。休館日は公式の案内で確かめましょう。" }),
  upd(HATCHO, { h: 13, m: 15, stay: 50, legs: [walk(8), train(12, "広島電鉄（比治山下→的場町→八丁堀）")], lat: 34.3939271, lng: 132.4630449, address: "広島県広島市中区八丁堀",
    memo: "比治山を下りて比治山下から路面電車に乗り、的場町で乗り換えて八丁堀へ（あわせて約20分）。広島の街なかで、店の多いあたりです。このあたりで、広島のお好み焼きなどの昼食にしましょう。" }, "八丁堀（昼食）"),
  cre("中工場", { h: 14, m: 48, stay: 42, legs: [walk(3), train(20, "広島電鉄（八丁堀→舟入南町）"), walk(20)], lat: NAKA.lat, lng: NAKA.lng, address: "広島県広島市中区南吉島1-5-1",
    memo: "八丁堀から路面電車（江波行き）で舟入南町へ行き、歩いて約20分（あわせて約45分）。建築家・谷口吉生が設計し、平成16年（2004年）に完成したごみ処理場です。建物の真ん中を通り抜けるガラス張りの通路「エコリアム」は予約なしで歩けて、ごみ処理の設備を眺めたり、その先の海を望んだりできます。見学の時間と休みの日は公式の案内で確かめましょう。" }),
  cre("江波山気象館", { h: 15, m: 45, stay: 45, legs: [walk(15)], lat: 34.3661986, lng: 132.4350056, address: "広島県広島市中区江波南1-40-1",
    memo: "中工場から西へ歩いて約15分、江波山の上へ。昭和9年（1934年）に建てられた旧広島気象台の建物を使った、気象をテーマにした博物館です。爆心地から約3.7kmの地点で原爆の爆風を受けた壁が、当時のまま残されています。亡くなった方々をしのびながら、静かに見学しましょう。入館の時間と休館日は公式の案内で確かめましょう。今夜は、江波から路面電車で街なかへ戻り、広島市内の宿に泊まります。" }),
];

const DAY2: X[] = [
  cre("不動院", { h: 9, m: 30, stay: 40, legs: [], lat: 34.4270315, lng: 132.4711145, address: "広島県広島市東区牛田新町3-4-9",
    memo: "この日も路面電車やアストラムラインなどでめぐります。広島駅からバスで約15分。平安時代の終わりにはすでにあったと考えられる古いお寺で、南北朝時代には全国に置かれた安国寺の一つでした。のちに安国寺恵瓊が建て直し、広島藩主・福島正則に仕えた僧が「不動院」と名を改めたと伝わります。金堂は国宝です。山のふもとにあったため、原爆による大きな被害を免れたとされます。" + PRAY }),
  cre("ヌマジ交通ミュージアム", { h: 10, m: 30, stay: 80, legs: [walk(3), train(12, "アストラムライン（不動院前→長楽寺）"), walk(5)], lat: 34.4708894, lng: 132.428619, address: "広島県広島市安佐南区長楽寺2-12-2",
    memo: "不動院前駅からアストラムラインで長楽寺駅へ行き、歩いて約5分（あわせて約20分）。平成7年（1995年）に開館した乗り物と交通の博物館で、2,000点をこえる模型や、直径20mのパノラマで、飛行機や船、鉄道、自動車の歩みを紹介しています。被爆した広島電鉄の路面電車・650形654号の実物も見られます。休館日は公式の案内で確かめましょう。" }),
  cre("本通（昼食）", { h: 12, m: 30, stay: 50, legs: [walk(5), train(35, "アストラムライン（長楽寺→本通）")], lat: 34.3931587, lng: 132.4569775, address: "広島県広島市中区本通",
    memo: "長楽寺駅からアストラムラインで終点の本通駅へ（あわせて約40分）。駅のまわりで昼食にしましょう。" }),
  cre("ひろしま美術館", { h: 13, m: 30, stay: 75, legs: [walk(10)], lat: 34.3986211, lng: 132.4581085, address: "広島県広島市中区基町3-2",
    memo: "本通駅から北へ歩いて約10分、中央公園の中へ。昭和53年（1978年）に開館した美術館で、印象派を中心とするフランスの近代美術と、日本の近代の絵画を収めています。丸いドームの本館は原爆ドームを、まわりの回廊は厳島神社の回廊をイメージしてつくられました。ゴッホの「ドービニーの庭」が、館を代表する作品です。休館日は公式の案内で確かめましょう。" }),
  cre("三瀧寺", { h: 15, m: 30, stay: 60, legs: [walk(5), train(15, "広島電鉄（紙屋町→横川駅）"), walk(5), train(5, "JR可部線（横川→三滝）"), walk(15)], lat: 34.4199296, lng: 132.4384108, address: "広島県広島市西区三滝山411",
    memo: "紙屋町から路面電車で横川駅へ行き、JR可部線で三滝駅へ、歩いて約15分（あわせて約45分）。三滝山の谷あいに、江戸時代の終わりから明治のはじめに建てられた想親観音堂や鐘楼、稲荷社などの木造の建物が点在するお寺です。爆心地から約3kmはなれていましたが、原爆の爆風が斜面をかけ上がり、境内の建物に大きな被害が出ました。参拝の時間は公式の案内で確かめましょう。帰りは、三滝駅からJR可部線で広島駅へ戻りましょう。" + PRAY }),
];

function show(label: string, DAY: X[]) {
  console.log(`\n${label}`);
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? x.id.slice(0, 8) + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  const ids = it.days.map((d) => d.id + ":" + d.spots.map((s) => s.id).join());
  if (ids.join("|") !== `${DAY1_ID}:${MOCA}|${DAY2_ID}:${HATCHO}`) throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.spot.update({ where: { id: HATCHO }, data: { dayId: DAY1_ID, orderNo: 901 } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
      await setDaySpotOrder(DAY2_ID, DAY2, { tx });
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
