/**
 * a99d53ff(美瑛の丘をめぐる日帰りドライブ。四季すべて)の組み直し(2026-11-06、しおりえ(制作補助2))。
 * docs/specs/20261105-facility-rework.md(注意2: ニングルテラス。宿の名前・喫茶店の店名を残さない)。企画運営の判断(11/06 1時台)・法務の頼み(01:38)。
 * - 「新富良野プリンスホテル・ニングルテラス」(最後。写真なし)を外し、富良野市博物館にする(冬も開いている)。
 *   点は 03330540・51cda3be と同じ(OSM way851737695 の点14個の平均 43.232628,142.378658)。文は2本から写さず言いかえ。
 *   出典 富良野市 https://www.city.furano.hokkaido.jp/life/docs/801353.html(休館は毎週月曜日・年末年始 12/31〜1/5)
 * - 昼食: 今は行き先がなく、白ひげの滝のメモに「少し早めの昼食をとるのにも良いタイミング」だけ。この文を外し、
 *   「十勝岳温泉美瑛線のあたりで昼食」13:21・40分。白金温泉の名前のあるバス停は宿泊施設の名前のものだけ(329行で使わない)、案内板は名前なし、
 *   道の駅は使わない(企画運営)ので、通りの点: 道道966号 十勝岳温泉美瑛線(secondary)node1093911813(43.4741873,142.6373297)
 * - 区間: 白ひげの滝→昼食 routed-foot 107.4秒→歩2、昼食→四季彩の丘 router.project-osrm.org 1266.8秒→車27(ceil22+5)、
 *   四季彩の丘→博物館 1978.8秒→車38、帰り 博物館→美瑛駅(OSM node264430307)2155.1秒→およそ41分
 * - 拓真館→青い池 車20 は測ると 1103.7秒→車24(短すぎる誤り。企画運営・法務 01:4x)。拓真館の結び・青い池の書き出しと結びに分を入れる
 * - 時刻: 青い池 11:54 → 白ひげの滝 12:44・35 → 昼食 13:21・40 → 四季彩の丘 14:28・50(70→50。縮めるだけ)→ 博物館 15:56・60 → 16:56に出る(閉館17:00の前)
 * - 文: 青い池の「美瑛を代表する」を外す(法務)。四季彩の丘の書き出しの向きの誤り(丘を南へ下ると)を直し、「おすすめ」を言いかえ、結びを博物館へ。
 *   白ひげの滝の書き出しの向きの誤り(丘をさらに北へ進むと)も直す(企画運営)。説明文の「定番」「ニングルテラス」を外す。題はそのまま(企画運営)
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-furano-a99d53ff.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "a99d53ff-3c29-4825-9442-ab95c5561aea";
const DAY_ID = "39f32685-7f83-45fa-bf40-70e0d1d25f7f";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (d: Date | null) => (d ? d.toISOString().slice(11, 16) : "--:--");
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

const NOW: [string, string, string, number, string, string, string][] = [
  ["92f01680-40f7-4395-9975-eeca0082c050", "美瑛の丘（パッチワークの路）", "09:00", 60, "", "43.639022", "142.545116"],
  ["a524d249-8e1d-442e-9a23-fe826d315093", "三愛の丘展望公園", "10:15", 30, "car15", "43.557239", "142.47816"],
  ["ba71d611-af91-46da-b5bc-725b9b9ed7f9", "拓真館", "11:00", 30, "car15", "43.530032", "142.489592"],
  ["2d955448-02ba-4ab6-a323-02bfcb3cba6b", "青い池", "11:50", 40, "car20", "43.492569", "142.613641"],
  ["65505c5e-4f6f-473d-ba47-ec47a6099c08", "白ひげの滝", "12:40", 35, "car10", "43.474583", "142.639187"],
  ["37db0381-d349-4844-af66-c3cb5cb168f1", "四季彩の丘", "13:43", 70, "car28", "43.529439", "142.464054"],
  ["d934f62a-48de-4ccc-a47a-75f6110461b8", "新富良野プリンスホテル・ニングルテラス", "15:33", 60, "car40", "43.3167", "142.375"],
];
const [PATCH, SANAI, TAKUSHIN, AOIIKE, SHIROHIGE, SHIKISAI, NINGLE] = NOW.map((r) => r[0]);

const DESC_FROM = "美瑛特有の「パッチワークの路」と呼ばれる丘陵地帯を、車で気ままに走り抜け、富良野のニングルテラスまで足を延ばすドライブプラン。定番とは違う美瑛の魅力を発見できます。";
const DESC_TO = "美瑛の「パッチワークの路」と呼ばれる丘陵地帯を車でめぐり、青い池や白ひげの滝、四季彩の丘を経て、富良野市博物館まで足を延ばすドライブプランです。";

const LUNCH_NAME = "十勝岳温泉美瑛線のあたりで昼食";
const LUNCH = "白ひげの滝から歩いておよそ2分、白金温泉を通る道道、十勝岳温泉美瑛線のあたりに着きます。このあたりで昼食にしましょう。この後は、車でおよそ27分、四季彩の丘へ向かいましょう。";
const MUSEUM_NAME = "富良野市博物館";
const MUSEUM =
  "四季彩の丘から車でおよそ38分、美瑛の丘から南へ足を延ばすと、山部の富良野市博物館です。この土地の自然、歴史、文化を、一つの館でたどることができます。1階には、動物のはく製、昆虫の標本、岩石、農機具、開拓期の資料、先史時代の考古資料などが並びます。なかでも、活断層の断面をはぎ取った地質の標本は、希少な資料とされています。2階は、林業や商業、衣食住の暮らしの資料のほか、「戦後のあゆみ」として、昭和に流行したおもちゃや電化製品、復元された昭和30年代の民家などが展示されています。休館日は、毎週月曜日と年末年始(12月31日から1月5日)です。ドライブの締めくくりに、富良野の土地と暮らしの歩みをたどってみましょう。見学のあとは、車でおよそ41分、美瑛駅へ戻りましょう。";

const REPS: Record<string, [string, string][]> = {
  [TAKUSHIN]: [["写真とはまた違う角度から丘の風景を味わってみましょう。", "写真とはまた違う角度から丘の風景を味わってみましょう。この後は、車でおよそ24分、青い池へ向かいましょう。"]],
  [AOIIKE]: [
    ["続いて向かうのが、美瑛を代表する景勝地・青い池です。", "拓真館から車でおよそ24分、美瑛の景勝地・青い池に着きます。"],
    ["自然の池ならではの一面も知っておくと、より楽しめるはずです。", "自然の池ならではの一面も知っておくと、より楽しめるはずです。この後は、車でおよそ10分、白ひげの滝へ向かいましょう。"],
  ],
  [SHIROHIGE]: [
    ["青い池から車で丘をさらに北へ進むと、白ひげの滝に着きます。", "青い池から車でおよそ10分、白ひげの滝に着きます。"],
    ["橋の上から見下ろす眺めは涼しげで、少し早めの昼食をとるのにも良いタイミングです。", "橋の上からは、滝を見下ろすことができます。この後は、歩いておよそ2分、十勝岳温泉美瑛線のあたりへ向かいましょう。"],
  ],
  [SHIKISAI]: [
    ["白ひげの滝から車で丘を南へ下ると、", "十勝岳温泉美瑛線のあたりから車でおよそ27分、"],
    ["座ったまま花畑を一望するのもおすすめです。", "座ったまま花畑を一望することもできます。"],
    ["次は、車で1時間弱の富良野へ向かい、森の中のニングルテラスを訪れます。", "この後は、車でおよそ38分、富良野市博物館へ向かいましょう。"],
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
// しおり全体(題を除く)に残ってはいけない言葉。宿・喫茶店の名前はしおり全体で確かめる
const BANNED = /ニングル|プリンス|ホテル|喫茶|珈琲|森の時計|すぐ|定番|人気|おすすめ|ください|代表する|幻想的|無料|料金/g;

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true, seasons: true } });
  if (!it || it.description !== DESC_FROM) throw new Error("説明文が想定と違います");
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
    { label: "美瑛の丘（パッチワークの路）(そのまま)", item: keep(PATCH) },
    { label: "三愛の丘展望公園(そのまま)", item: keep(SANAI) },
    { label: "拓真館(結びに分を足す)", item: { id: TAKUSHIN, data: { memo: newMemo[TAKUSHIN] } } },
    { label: "青い池(11:50→11:54、車20→車24、書き出しに分・「美瑛を代表する」を外す・結びを足す)", item: { id: AOIIKE, data: { visitTime: T(11, 54), memo: newMemo[AOIIKE], transitLegs: L(["car", 24]) } } },
    { label: "白ひげの滝(12:40→12:44。書き出しの向きの誤りを直す。昼食の文を外し、結びを足す)", item: { id: SHIROHIGE, data: { visitTime: T(12, 44), memo: newMemo[SHIROHIGE] } } },
    { label: `${LUNCH_NAME}(新規。道道966号 node1093911813)`, item: { create: { name: LUNCH_NAME, lat: "43.474187", lng: "142.63733", visitTime: T(13, 21), stayDurationMin: 40, memo: LUNCH, transitLegs: C(["walk", 2]) } } },
    { label: "四季彩の丘(13:43→14:28、車28→車27、滞在70→50、書き出しの向き・おすすめ・結びを直す)", item: { id: SHIKISAI, data: { visitTime: T(14, 28), stayDurationMin: 50, memo: newMemo[SHIKISAI], transitLegs: L(["car", 27]) } } },
    { label: `${MUSEUM_NAME}(新規。03330540・51cda3be と同じ点)`, item: { create: { name: MUSEUM_NAME, lat: "43.232628", lng: "142.378658", visitTime: T(15, 56), stayDurationMin: 60, memo: MUSEUM, transitLegs: C(["car", 38]) } } },
  ];

  // しおり全体(題を除く。直したあと)の言葉の確かめ
  const after = [DESC_TO, ...items.map(({ item }) => ("id" in item ? ((item.data as { memo?: string }).memo ?? memo(item.id)) : (item.create.memo as string)))].join("\n");
  const left = after.match(BANNED);
  if (left) throw new Error(`直したあとに残る言葉: ${left}`);
  if (/ニングル|プリンス|ホテル/.test(it.title)) throw new Error("題に施設・宿の名前があります");

  console.log(`題(そのまま) ${it.title}／季節 ${it.seasons}\n説明文 → ${DESC_TO}`);
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
    "■ [外す] 新富良野プリンスホテル・ニングルテラス(写真なし)\n\n  11:00+30+24=11:54 青い池、+40+10=12:44 白ひげの滝、+35+2=13:21 昼食、+40+27=14:28 四季彩の丘、+50+38=15:56 博物館、+60=16:56 に出る(閉館17:00の前)\n  言葉の確かめ: 説明文・全メモで ニングル・プリンス・ホテル・喫茶・珈琲・森の時計・すぐ・定番・人気・おすすめ・ください・代表する・幻想的・無料・料金 0件"
  );
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { description: DESC_TO } });
      await setDaySpotOrder(DAY_ID, items.map((r) => r.item), { tx, remove: [NINGLE] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
