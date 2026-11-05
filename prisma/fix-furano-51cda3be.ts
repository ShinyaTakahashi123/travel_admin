/**
 * 51cda3be(花と丘の富良野・美瑛 1泊2日。レンタカー)の組み直し(2026-11-06、しおりえ(制作補助2))。
 * docs/specs/20261105-facility-rework.md(注意2: ニングルテラスと、同じホテルの施設の風のガーデンを行き先にしない)。企画運営の判断(11/06 1時台)。
 * 2日目:
 * - 風のガーデン(写真1枚。スポットと一緒に消える)・ニングルテラスを外し、富良野市博物館 → 鳥沼公園 にする
 *   博物館: 点は 03330540 と同じ(OSM way851737695 の点14個の平均 43.232628,142.378658)。出典 富良野市 https://www.city.furano.hokkaido.jp/life/docs/801353.html
 *   鳥沼公園: 公園の入口・案内所に名前のある点が OSM にないので、着く側の点は OSM「鳥沼公園Ｐ」way583279456 の点4つの平均 43.342602,142.435563(車で着くため)。
 *   出典 富良野市 https://www.city.furano.hokkaido.jp/life/docs/801444.html(湧水・風致公園・ハンノキやヤチダモの湿地林・1920年に町有地)、
 *   ふらの観光協会 https://www.furanotourism.com/jp/spot/spot_D.php?id=405(透明度が高い沼・水面に映る木々・水芭蕉やザゼンソウ・蛍・紅葉)。季節(春〜秋)と合う
 * - 区間(router.project-osrm.org の車。ceil(秒/60)+5): 麓郷の森→博物館 1441.9秒→車30、博物館→鳥沼公園Ｐ 895.4秒→車20、
 *   帰り 鳥沼公園Ｐ→富良野駅(OSM node264430570)407.6秒→およそ12分
 * - 時刻: 麓郷の森 13:23・41 → 博物館 14:34・50 → 鳥沼公園 15:44・46 → 16:30に出る(もとと同じ。1泊2日の最終日は遅くしない)
 * - 青い池の「人気スポット」「神秘的な」「絶景」を言いかえる。拓真館の「名作の数々」を「作品」に(法務 01:35)
 * 1日目:
 * - 四季彩の丘の中の昼食(園内のレストラン)を外し、ファーム富田と拓真館の間に「東２丁目通りのあたりで昼食」12:01・40分
 *   (点は 03330540 と同じ node5143126753。上富良野の町に名前のあるバス停・案内板の点がない)。
 *   区間: ファーム富田→昼食 407.7秒→車12、昼食→拓真館 955.4秒→車21。拓真館 13:02・50 → 四季彩の丘 14:02・20(67→20。昼食の40分と寄り道の7分を除く。縮めるだけ)
 *   → パッチワークの路 14:50 から後はもとのまま
 * - 説明文から風のガーデン・評価の言葉(満喫・神秘的・フォトジェニック)を外す
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-furano-51cda3be.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "51cda3be-9832-4e7b-ac74-42bb780ebb89";
const DAY1 = "247d8d25-0b4c-493e-938c-05e886670c54";
const DAY2 = "4d603678-1f9c-4005-8fb8-891cdc3ba057";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (d: Date | null) => (d ? d.toISOString().slice(11, 16) : "--:--");
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

type Row = [string, string, string, number, string, string, string];
const NOW1: Row[] = [
  ["9ff2fb29-8bb4-4764-b39e-e243469b727a", "ファーム富田", "10:59", 50, "", "43.41796", "142.427787"],
  ["5b93110d-f4f6-4efb-93ad-6665c5636bf5", "拓真館", "12:15", 50, "car26", "43.530032", "142.489592"],
  ["13577c2d-4cd3-4804-a5e9-9396cb565c5a", "四季彩の丘", "13:15", 67, "car10", "43.529439", "142.464054"],
  ["a748d767-73c1-487f-a0c0-3aff0f57d80a", "美瑛の丘（パッチワークの路）", "14:50", 62, "car28", "43.639022", "142.545116"],
  ["6e08566d-a89e-475d-99cd-b8c3bbad659f", "北西の丘展望公園", "16:10", 45, "car18", "43.60519", "142.45661"],
];
const NOW2: Row[] = [
  ["540daa36-d0eb-49c9-8aa1-3ecc30b1b8ec", "三愛の丘展望公園", "09:00", 40, "", "43.557239", "142.47816"],
  ["c01534dc-01a0-48ec-b691-62ec590e325d", "白ひげの滝", "10:10", 41, "car30", "43.474583", "142.639187"],
  ["d856f50f-6249-4ad1-b030-b445e2ab1587", "青い池", "10:58", 45, "car7", "43.493322", "142.614637"],
  ["2ad9097e-de70-494c-9b48-20d61b351932", "道の駅びえい「白金ビルケ」", "11:52", 35, "car9", "43.503288", "142.597034"],
  ["79b8f6c9-ad7d-49c4-aec2-50921654be2d", "麓郷の森", "13:23", 41, "car56", "43.312197", "142.540455"],
  ["119cf6f3-f263-4a1c-9e3c-4aea9f0de373", "風のガーデン", "14:37", 55, "car33", "43.323301", "142.354089"],
  ["53efefcb-272e-4429-b23c-5ef8b129423d", "ニングルテラス", "15:43", 47, "walk11", "43.323431", "142.356339"],
];
const [TOMITA, TAKUSHIN, SHIKISAI, PATCH, HOKUSEI] = NOW1.map((r) => r[0]);
const [SANAI, SHIROHIGE, AOIIKE, BIRKE, ROKUGO, KAZE, NINGLE] = NOW2.map((r) => r[0]);

const DESC_FROM =
  "1日目はファーム富田のラベンダー畑や拓真館の写真、四季彩の丘の花々、パッチワークの路や北西の丘の丘陵風景を満喫し、2日目は三愛の丘展望公園から白ひげの滝、青い池の神秘的な水面、麓郷の森、風のガーデンまで。花と丘の絶景を1泊2日でめぐるフォトジェニックなプランです。";
const DESC_TO =
  "1日目はファーム富田のラベンダー畑や拓真館の写真、四季彩の丘の花々、パッチワークの路や北西の丘の丘陵風景をめぐり、2日目は三愛の丘展望公園から白ひげの滝、青い池、麓郷の森、富良野市博物館、鳥沼公園まで。花と丘の風景を1泊2日でめぐるプランです。";

const LUNCH_NAME = "東２丁目通りのあたりで昼食";
const LUNCH = "ファーム富田から車でおよそ12分、上富良野町の役場に近い東２丁目通りのあたりに着きます。この通りのまわりで昼食にしましょう。この後は、車でおよそ21分、美瑛の拓真館へ向かいましょう。";
const MUSEUM_NAME = "富良野市博物館";
const MUSEUM =
  "麓郷の森から車でおよそ30分、山部の富良野市博物館に着きます。富良野の自然と歴史、文化をまとめて紹介する、市の総合博物館です。1階では、動物のはく製や昆虫の標本、岩石などの自然の資料とあわせて、先史時代の考古資料、開拓のころの資料や農機具を見ることができます。地質のコーナーには、活断層の断面をはぎ取った標本もあり、希少な資料とされています。2階は林業や商業の資料、衣食住の道具が中心で、「戦後のあゆみ」のコーナーには昭和30年代の民家が復元されています。富良野の暮らしの移り変わりを、資料でたどってみましょう。毎週月曜日と年末年始は休館です。この後は、車でおよそ20分、鳥沼公園へ向かいましょう。";
const TORINUMA_NAME = "鳥沼公園";
const TORINUMA =
  "富良野市博物館から車でおよそ20分、2日間の旅の締めくくりは、富良野市の郊外にある鳥沼公園です。豊富な湧き水をたたえる鳥沼を中心とした市の公園で、水の透明度が高く、水面に周りの木々が映ります。園内には、開拓より前の富良野盆地の風景を一部に残すとされる、ハンノキやヤチダモの湿地林が残っています。1920年に当時の富良野町の町有地となり、「鳥沼公園」と呼ばれるようになりました。春には水芭蕉やザゼンソウ、夏には蛍、秋には紅葉が見られます。沼のほとりを静かに歩き、2日間の旅を締めくくりましょう。見学を終えたら、車でおよそ12分の富良野駅の近くでレンタカーを返し(返す手続きに15分ほど)、帰りましょう。";

const REPS: Record<string, [string, string][]> = {
  [TOMITA]: [["この後は、車でおよそ26分、美瑛の拓真館へ向かいましょう。", "この後は、車でおよそ12分、東２丁目通りのあたりへ向かいましょう。"]],
  [TAKUSHIN]: [
    ["ファーム富田から車でおよそ26分、丘の道を進むと見えてくるのが、", "東２丁目通りのあたりから車でおよそ21分、丘の道を進むと見えてくるのが、"],
    ["館内で名作の数々を見たあとに", "館内で作品を見たあとに"],
  ],
  [SHIKISAI]: [["園内のレストランで、花畑を眺めながら昼食をとりましょう。", ""]],
  [AOIIKE]: [
    ["結果としてこの絶景が生まれたのだと伝えられています。", "結果としてこの景色が生まれたのだと伝えられています。"],
    ["あの神秘的な青が生まれるという仕組みです。", "あの青い色が生まれるという仕組みです。"],
    ["一躍世界的な人気スポットとなりました。", "一躍、世界に知られる場所になりました。"],
  ],
  [ROKUGO]: [["この後は、車でおよそ33分、風のガーデンへ向かいましょう。", "この後は、車でおよそ30分、富良野市博物館へ向かいましょう。"]],
};

const count = (s: string, sub: string) => s.split(sub).length - 1;
function applyReps(memo: string, reps: [string, string][], name: string) {
  for (const [a, b] of reps) {
    if (count(memo, a) !== 1) throw new Error(`${name}: 直す文が1か所ではありません「${a}」(${count(memo, a)})`);
    memo = memo.replace(a, b);
  }
  return memo;
}
const BANNED = /絶景|名作|ニングル|風のガーデン|ホテル|プリンス|喫茶|レストラン|ランチ|すぐ|定番|人気|おすすめ|ください|満喫|神秘的|フォトジェニック|無料|料金/g;

async function load(dayId: string, now: Row[]) {
  const spots = await prisma.spot.findMany({
    where: { dayId },
    orderBy: { orderNo: "asc" },
    select: { id: true, name: true, visitTime: true, stayDurationMin: true, lat: true, lng: true, memo: true, day: { select: { itineraryId: true } }, transitLegs: { orderBy: { orderNo: "asc" }, select: { transitMode: true, transitDurationMin: true } }, photos: { select: { id: true } } },
  });
  if (!spots.length || spots[0].day.itineraryId !== ITIN_ID) throw new Error("日が想定と違います");
  const cur = spots.map((s) => [s.id, s.name, hm(s.visitTime), s.stayDurationMin, s.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+"), String(s.lat), String(s.lng)]);
  if (JSON.stringify(cur) !== JSON.stringify(now)) throw new Error(`並びが想定と違います: ${JSON.stringify(cur)}`);
  return spots;
}

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { description: true, seasons: true, thumbnailUrl: true } });
  if (!it || it.description !== DESC_FROM) throw new Error("説明文が想定と違います");
  if (JSON.stringify(it.seasons) !== JSON.stringify(["spring", "summer", "autumn"])) throw new Error(`季節が想定と違います ${it.seasons}`);
  const s1 = await load(DAY1, NOW1);
  const s2 = await load(DAY2, NOW2);
  const all = [...s1, ...s2];
  if (all.find((s) => s.id === NINGLE)!.photos.length) throw new Error("ニングルテラスに写真があります");
  const kazePhotos = all.find((s) => s.id === KAZE)!.photos.length;
  if (kazePhotos !== 1) throw new Error(`風のガーデンの写真が1枚ではありません(${kazePhotos})`);
  if (it.thumbnailUrl && /%25E9%25A2%25A8|kaze/i.test(it.thumbnailUrl)) throw new Error("表紙が風のガーデンの写真かもしれません");
  const memo = (id: string) => all.find((s) => s.id === id)!.memo ?? "";
  const newMemo: Record<string, string> = {};
  for (const id of Object.keys(REPS)) newMemo[id] = applyReps(memo(id), REPS[id], all.find((s) => s.id === id)!.name);

  const keep = (id: string): SpotOrderItem => ({ id, data: {} });
  const day1: { label: string; item: SpotOrderItem }[] = [
    { label: "ファーム富田(結びを昼食へ)", item: { id: TOMITA, data: { memo: newMemo[TOMITA] } } },
    { label: `${LUNCH_NAME}(新規。03330540 と同じ点 node5143126753)`, item: { create: { name: LUNCH_NAME, lat: "43.455794", lng: "142.468074", visitTime: T(12, 1), stayDurationMin: 40, memo: LUNCH, transitLegs: C(["car", 12]) } } },
    { label: "拓真館(12:15→13:02、車26→車21、書き出しを直す、「名作の数々」→「作品」)", item: { id: TAKUSHIN, data: { visitTime: T(13, 2), memo: newMemo[TAKUSHIN], transitLegs: L(["car", 21]) } } },
    { label: "四季彩の丘(13:15→14:02、滞在67→20、園内のレストランの昼食の文を外す)", item: { id: SHIKISAI, data: { visitTime: T(14, 2), stayDurationMin: 20, memo: newMemo[SHIKISAI] } } },
    { label: "美瑛の丘（パッチワークの路）(そのまま 14:50)", item: keep(PATCH) },
    { label: "北西の丘展望公園(そのまま 16:10)", item: keep(HOKUSEI) },
  ];
  const day2: { label: string; item: SpotOrderItem }[] = [
    { label: "三愛の丘展望公園(そのまま)", item: keep(SANAI) },
    { label: "白ひげの滝(そのまま)", item: keep(SHIROHIGE) },
    { label: "青い池(「人気スポット」「神秘的な」「絶景」を言いかえ)", item: { id: AOIIKE, data: { memo: newMemo[AOIIKE] } } },
    { label: "道の駅びえい「白金ビルケ」(そのまま)", item: keep(BIRKE) },
    { label: "麓郷の森(結びを博物館へ)", item: { id: ROKUGO, data: { memo: newMemo[ROKUGO] } } },
    { label: `${MUSEUM_NAME}(新規。03330540 と同じ点)`, item: { create: { name: MUSEUM_NAME, lat: "43.232628", lng: "142.378658", visitTime: T(14, 34), stayDurationMin: 50, memo: MUSEUM, transitLegs: C(["car", 30]) } } },
    { label: `${TORINUMA_NAME}(新規。鳥沼公園Ｐ way583279456)`, item: { create: { name: TORINUMA_NAME, lat: "43.342602", lng: "142.435563", visitTime: T(15, 44), stayDurationMin: 46, memo: TORINUMA, transitLegs: C(["car", 20]) } } },
  ];

  const changed = [DESC_TO, LUNCH, MUSEUM, TORINUMA, ...Object.values(newMemo)].join("\n");
  const left = changed.match(BANNED);
  if (left) throw new Error(`直したあとに残る言葉: ${left}`);

  console.log(`説明文 → ${DESC_TO}`);
  for (const [title, rows, spots] of [["1日目", day1, s1], ["2日目", day2, s2]] as const) {
    console.log(`-- ${title}`);
    for (const { label, item } of rows) {
      const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
      const cur = "id" in item ? spots.find((s) => s.id === item.id) : undefined;
      const vt = d.visitTime instanceof Date ? hm(d.visitTime) : hm(cur?.visitTime ?? null);
      const st = (d.stayDurationMin as number | undefined) ?? cur?.stayDurationMin;
      const lg = d.transitLegs as { create?: Leg[] } | undefined;
      const ls = lg?.create ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : cur ? cur.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") || "(なし)" : "";
      const pt = d.lat ? `${d.lat},${d.lng}` : `${cur?.lat},${cur?.lng}`;
      console.log(`■ ${label}\n  着 ${vt}／滞在 ${st}／区間 ${ls}／点 ${pt}${d.memo ? `\n  メモ: ${d.memo}` : ""}`);
    }
  }
  console.log(
    "■ [外す] 風のガーデン(写真1枚はスポットと一緒に消える)・ニングルテラス(写真なし)\n\n" +
      "  1日目: 10:59+50+12=12:01 昼食、+40+21=13:02 拓真館、+50+10=14:02 四季彩の丘、+20+28=14:50 パッチワークの路(もとのまま)\n" +
      "  2日目: 13:23+41+30=14:34 博物館、+50+20=15:44 鳥沼公園、+46=16:30 に出る(もとと同じ)\n" +
      "  言葉の確かめ: 説明文・新しいメモ・直したメモで、絶景・名作・ニングル・風のガーデン・ホテル・喫茶・レストラン・ランチ・すぐ・定番・人気・おすすめ・ください・満喫・神秘的・フォトジェニック・無料・料金 0件"
  );
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { description: DESC_TO } });
      await setDaySpotOrder(DAY1, day1.map((r) => r.item), { tx });
      await setDaySpotOrder(DAY2, day2.map((r) => r.item), { tx, remove: [KAZE, NINGLE] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
