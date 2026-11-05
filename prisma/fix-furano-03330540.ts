/**
 * 03330540(冬の富良野・美瑛の日帰り。レンタカー)の組み直し(2026-11-06、しおりえ(制作補助2))。
 * docs/specs/20261105-facility-rework.md(会社・店の施設を行き先にしない。注意2: ニングルテラス)。企画運営の判断(11/06 1時台)。
 * - ニングルテラス(最後。ホテルの施設)を外し、富良野市博物館にする(冬も開いている。季節は winter だけ)。
 *   メモの事実は富良野市 https://www.city.furano.hokkaido.jp/life/docs/801353.html から(観覧料は書かない)。
 *   点: OSM「富良野市博物館」tourism=museum の建物 way851737695 の点14個の平均 43.232628,142.378658
 * - 昼食(チーズ工房の中のピッツァ。14:40で13:30を過ぎている)を外し、四季彩の丘とワイン工場の間に「東２丁目通りのあたりで昼食」13:30・40分。
 *   上富良野の町にバス停の名前の点・案内板がない(名前のないバス停と宿の名前のバス停だけ)ので、通りの点 node5143126753(東２丁目通り、43.4557944,142.4680739)
 * - 区間(router.project-osrm.org の車。ceil(秒/60)+5): 四季彩の丘→昼食 718秒→車17、昼食→ワイン工場 796.1秒→車19、
 *   チーズ工房→博物館 605.4秒→車16、帰り 博物館→美瑛駅(OSM node264430307)2155.1秒→およそ41分
 * - 時刻: 四季彩の丘の滞在 51→50(昼食が13:30に始まるように。縮めるだけ)。ワイン工場 14:29、チーズ工房 15:22・30分(昼食を外す)、
 *   博物館 16:08・50分、16:58に出る(閉館17:00の前)
 * - 題・説明文からニングルテラスを外す(説明文の「幻想的な」も外す)
 * - 美瑛選果・ワイン工場の試飲の文は触らない(企画運営の指示。別の直し)
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-furano-03330540.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "03330540-baac-4c12-8b39-caa89a43bbcb";
const DAY_ID = "d9507dcc-77da-4114-a511-2be07b64763e";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (d: Date | null) => (d ? d.toISOString().slice(11, 16) : "--:--");
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

// 今の並び [id, 名前, 着, 滞在, 区間, 緯度, 経度]
const NOW: [string, string, string, number, string, string, string][] = [
  ["1c121dbd-bfe9-437c-82be-5ffa4535b178", "白ひげの滝", "09:00", 35, "", "43.474583", "142.639187"],
  ["1292b992-8ce5-4294-805c-4fc084efbcec", "青い池", "09:42", 50, "car7", "43.492569", "142.613641"],
  ["beebef9d-72a4-4ac2-9989-55bbafe669a9", "新栄の丘展望公園", "11:01", 20, "car29", "43.557776", "142.459093"],
  ["0c3d819b-579f-426b-9578-de2c648e4979", "美瑛選果", "11:33", 40, "car12", "43.590755", "142.454533"],
  ["d8f8c1ce-ca27-4bf9-b253-dcf2c819f351", "四季彩の丘", "12:23", 51, "car10", "43.529439", "142.464054"],
  ["4c1581da-23fc-4db6-8895-5dd900954cd6", "ふらのワイン工場", "13:47", 40, "car33", "43.358563", "142.373697"],
  ["d6fa1ae6-9244-4ce3-b768-62e5863f2f21", "富良野チーズ工房", "14:40", 66, "car13", "43.320669", "142.377185"],
  ["dad4eec9-8a9c-41e6-823a-4dfbafa05dd1", "ニングルテラス", "15:57", 60, "car11", "43.323431", "142.356339"],
];
const [SHIROHIGE, AOIIKE, SHINEI, SENKA, SHIKISAI, WINE, CHEESE, NINGLE] = NOW.map((r) => r[0]);

const TITLE_FROM = "白銀の青い池とニングルテラス、冬の富良野・美瑛を楽しむプラン";
const TITLE_TO = "白銀の青い池と冬の丘、富良野市博物館をめぐる冬の富良野・美瑛プラン";
const DESC_FROM = "夏とは違う幻想的な姿を見せる、冬の青い池。雪に包まれ夜はライトアップされるニングルテラスの森もあわせて楽しむ、冬の富良野・美瑛プランです。";
const DESC_TO = "夏とは違う姿を見せる、冬の青い池。雪の丘やワイン工場をめぐり、最後は富良野市博物館で富良野の自然と歴史にふれる、冬の富良野・美瑛プランです。";

const LUNCH_NAME = "東２丁目通りのあたりで昼食";
const LUNCH = "四季彩の丘から車でおよそ17分、上富良野の町なか、東２丁目通りのあたりに着きます。このあたりで昼食にしましょう。この後は、車でおよそ19分、ふらのワイン工場へ向かいましょう。";
const MUSEUM_NAME = "富良野市博物館";
const MUSEUM =
  "富良野チーズ工房から車でおよそ16分、山部にある富良野市博物館に着きます。富良野の自然、歴史、文化に関する資料を展示する総合博物館です。1階には、動物のはく製や昆虫の標本、地質や岩石の資料、先史時代の考古資料、開拓期の資料、農機具が並び、地質のコーナーにある活断層の断面のはぎ取り標本は、珍しい資料とされています。2階には林業や商業の資料、衣食住にまつわる生活の資料があり、「戦後のあゆみ」のコーナーでは、昭和30年代の民家の復元や、昭和に流行したおもちゃ、漫画、レコード、電化製品などから、戦後のあゆみをたどれます。開館は17時までで、毎週月曜日と年末年始は休館です。旅の締めくくりに、富良野の土地の成り立ちと暮らしにふれてみましょう。見学を終えたら、車でおよそ41分、美瑛駅へ戻り、車を返しましょう。";

const REPS: Record<string, [string, string][]> = {
  [SHIKISAI]: [["続いては、車でおよそ33分、ふらのワイン工場へ向かいましょう。", "続いては、車でおよそ17分、東２丁目通りのあたりへ向かいましょう。"]],
  [WINE]: [["四季彩の丘から車でおよそ33分、富良野市が直営する", "東２丁目通りのあたりから車でおよそ19分、富良野市が直営する"]],
  [CHEESE]: [
    ["併設のピッツァ工房では、富良野産の玉ねぎをのせた窯焼きピッツァも味わえるので、ここでゆっくりランチを楽しみましょう。雪景色を眺めながら温かい食事でひと息つけます。", ""],
    ["続いては、車でおよそ11分、ニングルテラスへ向かいましょう。", "続いては、車でおよそ16分、富良野市博物館へ向かいましょう。"],
  ],
};

const count = (s: string, sub: string) => s.split(sub).length - 1;
function applyReps(memo: string, reps: [string, string][], name: string) {
  for (const [a, b] of reps) {
    if (count(memo, a) !== 1) throw new Error(`${name}: 直す文が1か所ではありません「${a}」(${count(memo, a)})`);
    memo = memo.replace(a, b);
  }
  return memo;
}
// 直す文・新しい文に残ってはいけない言葉(美瑛選果・ワイン工場の試飲・四季彩の丘の店の文は、企画運営の指示で今回は触らない)
const BANNED = /ニングル|ホテル|プリンス|ピッツァ|ランチ|すぐ|定番|人気|おすすめ|ください|幻想的|無料|料金/g;

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true, seasons: true } });
  if (!it || it.title !== TITLE_FROM || it.description !== DESC_FROM) throw new Error(`題・説明文が想定と違います「${it?.title}」`);
  if (JSON.stringify(it.seasons) !== JSON.stringify(["winter"])) throw new Error(`季節が想定と違います ${it.seasons}`);
  const spots = await prisma.spot.findMany({
    where: { dayId: DAY_ID },
    orderBy: { orderNo: "asc" },
    select: { id: true, name: true, visitTime: true, stayDurationMin: true, lat: true, lng: true, memo: true, day: { select: { itineraryId: true } }, transitLegs: { orderBy: { orderNo: "asc" }, select: { transitMode: true, transitDurationMin: true } }, photos: { select: { id: true } } },
  });
  if (!spots.length || spots[0].day.itineraryId !== ITIN_ID) throw new Error("日が想定と違います");
  const now = spots.map((s) => [s.id, s.name, hm(s.visitTime), s.stayDurationMin, s.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+"), String(s.lat), String(s.lng)]);
  if (JSON.stringify(now) !== JSON.stringify(NOW)) throw new Error(`並びが想定と違います: ${JSON.stringify(now)}`);
  if (spots.find((s) => s.id === NINGLE)!.photos.length) throw new Error("外すスポットに写真があります");
  const memo = (id: string) => spots.find((s) => s.id === id)!.memo ?? "";
  const newMemo: Record<string, string> = {};
  for (const id of Object.keys(REPS)) newMemo[id] = applyReps(memo(id), REPS[id], spots.find((s) => s.id === id)!.name);

  const keep = (id: string): SpotOrderItem => ({ id, data: {} });
  const items: { label: string; item: SpotOrderItem }[] = [
    { label: "白ひげの滝(そのまま)", item: keep(SHIROHIGE) },
    { label: "青い池(そのまま)", item: keep(AOIIKE) },
    { label: "新栄の丘展望公園(そのまま)", item: keep(SHINEI) },
    { label: "美瑛選果(そのまま。企画運営の指示で今回は触らない)", item: keep(SENKA) },
    { label: "四季彩の丘(滞在51→50。結びを昼食へ)", item: { id: SHIKISAI, data: { stayDurationMin: 50, memo: newMemo[SHIKISAI] } } },
    { label: `${LUNCH_NAME}(新規。東２丁目通り node5143126753)`, item: { create: { name: LUNCH_NAME, lat: "43.455794", lng: "142.468074", visitTime: T(13, 30), stayDurationMin: 40, memo: LUNCH, transitLegs: C(["car", 17]) } } },
    { label: "ふらのワイン工場(13:47→14:29、車33→車19、書き出しを直す)", item: { id: WINE, data: { visitTime: T(14, 29), memo: newMemo[WINE], transitLegs: L(["car", 19]) } } },
    { label: "富良野チーズ工房(14:40→15:22、滞在66→30、昼食とピッツァの文を外す、結びを直す)", item: { id: CHEESE, data: { visitTime: T(15, 22), stayDurationMin: 30, memo: newMemo[CHEESE] } } },
    { label: `${MUSEUM_NAME}(新規。way851737695 の点14個の平均)`, item: { create: { name: MUSEUM_NAME, lat: "43.232628", lng: "142.378658", visitTime: T(16, 8), stayDurationMin: 50, memo: MUSEUM, transitLegs: C(["car", 16]) } } },
  ];

  const changed = [TITLE_TO, DESC_TO, LUNCH, MUSEUM, ...Object.values(newMemo)].join("\n");
  const left = changed.match(BANNED);
  if (left) throw new Error(`直したあとに残る言葉: ${left}`);

  console.log(`題 → ${TITLE_TO}\n説明文 → ${DESC_TO}`);
  for (const { label, item } of items) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const cur = "id" in item ? spots.find((s) => s.id === item.id) : undefined;
    const vt = d.visitTime instanceof Date ? hm(d.visitTime) : hm(cur?.visitTime ?? null);
    const st = (d.stayDurationMin as number | undefined) ?? cur?.stayDurationMin;
    const lg = d.transitLegs as { create?: Leg[] } | undefined;
    const ls = lg?.create ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : cur ? cur.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") || "(なし)" : "";
    const pt = d.lat ? `${d.lat},${d.lng}` : `${cur?.lat},${cur?.lng}`;
    console.log(`■ ${label}\n  着 ${vt}／滞在 ${st}／区間 ${ls}／点 ${pt}${d.memo ? `\n  メモ: ${d.memo}` : ""}`);
  }
  console.log(
    "■ [外す] ニングルテラス(写真なし)\n\n  12:23+50+17=13:30 昼食、+40+19=14:29 ワイン工場、+40+13=15:22 チーズ工房、+30+16=16:08 博物館、+50=16:58 に出る(閉館17:00の前)\n  言葉の確かめ: 題・説明文・新しいメモ・直したメモで、ニングル・ホテル・ピッツァ・ランチ・すぐ・定番・人気・おすすめ・ください・幻想的・無料・料金 0件"
  );
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_TO, description: DESC_TO } });
      await setDaySpotOrder(DAY_ID, items.map((r) => r.item), { tx, remove: [NINGLE] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
