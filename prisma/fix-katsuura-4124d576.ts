/**
 * 4124d576(熊野古道 大門坂の日帰り)の組み直し(2026-11-06、しおりえ(制作補助2))。
 * docs/specs/20261105-facility-rework.md(会社・店の施設を行き先にしない)。企画運営の設計OK(11/06 1時台)。
 * - 勝浦漁港にぎわい市場(14:14・60分。中で昼食。13:30を過ぎている)を外し、「勝浦漁港のあたり」20分にする。
 *   店・グルメは書かない。メモの事実は那智勝浦町 https://www.town.nachikatsuura.wakayama.jp/info/62
 *   (延縄漁法による生鮮まぐろの水揚げ日本一・市場内に並べる・朝7時ごろ第2売場の展望スペースから競りを見学・休みの日あり)と
 *   和歌山県 https://www.pref.wakayama.lg.jp/prefg/081300/d00215232.html(九州や沖縄からも漁船が入港)から。
 *   点: OSM に「勝浦漁港」の名前の点がないため、港の道 県道236号 勝浦港湯川線の node13575018604(33.6261390,135.9430532)。点の例外(企画運営OK、法務に確認)
 * - 昼食は那智の滝のあとに「那智山勝浦線のあたりで昼食」11:59・40分(380行。滝の近くにバス停の点がないため、通り=県道 那智山勝浦線の node1389507586 33.6727491,135.8891263)
 * - 区間(routing.openstreetmap.de routed-foot): 滝→昼食 207.7秒で歩4、昼食→青岸渡寺 437.8秒で歩8、青岸渡寺→三重塔 200.6秒で歩4、
 *   三重塔→大社 278.2秒で歩5、JR那智駅→補陀洛山寺 131.3秒で3分
 * - 誤りの直し(企画運営OK): 補陀洛山寺の書き出し「JR紀伊勝浦駅から歩いておよそ8分」→「JR那智駅から歩いておよそ3分」。
 *   三重塔の点が青岸渡寺と同じだったのを、OSM の三重塔の建物 way351906993(building=pagoda、name=三重塔)の点5つの平均 33.671063,135.888875 に
 * - 「歩いてすぐ」3か所を「歩いておよそN分」に。那智の滝の「すぐそば」を言いかえる
 * - 題・説明文から「定番」を外す
 * - 法務の頼み(11/06 01:18): 那智の滝のメモの終わりにお祈りの文(242行)。那智の滝・三重塔の書き出しに分を入れる。熊野那智大社の「お参りください」を「お参りしましょう」に(244行)
 * - 時刻: 9:00始まりのまま。青岸渡寺 12:47・三重塔 13:21・大社 13:51・勝浦漁港のあたり 14:56・石垣記念館 15:26・くじらの博物館 16:03、16:58に出る
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-katsuura-4124d576.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "4124d576-4cd8-4086-b61e-9cd8a9576115";
const DAY_ID = "d165e800-ac6a-4b42-83e3-22e53457fe35";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (d: Date | null) => (d ? d.toISOString().slice(11, 16) : "--:--");
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

// 今の並び [id, 名前, 着, 滞在, 区間, 緯度, 経度]
const NOW: [string, string, string, number, string, string, string][] = [
  ["8ee8e37d-0ae6-4f08-ab08-24bdca0b52c5", "補陀洛山寺", "09:00", 35, "", "33.644736", "135.93442"],
  ["04b96850-bfb9-4028-b955-be7133557527", "熊野古道 大門坂", "09:45", 60, "bus10", "33.670625", "135.901225"],
  ["204b0fb3-cb5b-4d75-83bb-c1ba7dae3684", "那智の滝", "11:10", 45, "walk25", "33.675283", "135.887627"],
  ["d142e8c1-f751-4ab0-b1c2-02782eadc6f2", "青岸渡寺", "12:08", 30, "walk13", "33.669314", "135.889923"],
  ["fdc036a5-562c-4944-be83-4978783c31b3", "三重塔", "12:41", 25, "walk3", "33.669314", "135.889923"],
  ["1238e0e8-82db-4ba0-af2a-d73105538449", "熊野那智大社", "13:09", 40, "walk3", "33.668568", "135.890493"],
  ["90be5114-8adf-4f3a-9028-3372a2f6b5f8", "勝浦漁港にぎわい市場", "14:14", 60, "bus25", "33.626586", "135.943942"],
  ["24441e88-3cee-4937-a49b-521892611fa4", "太地町立石垣記念館", "15:24", 25, "bus10", "33.598328", "135.940308"],
  ["a185d199-6248-49a7-80db-7348ee275fda", "太地町立くじらの博物館", "16:01", 55, "walk12", "33.601873", "135.945778"],
];
const [FUDARAKU, DAIMON, TAKI, SEIGANTO, TOU, TAISHA, MARKET, ISHIGAKI, KUJIRA] = NOW.map((r) => r[0]);

const TITLE_FROM = "熊野古道 大門坂、世界遺産の参詣道を歩く定番日帰りプラン";
const TITLE_TO = "熊野古道 大門坂と那智山、勝浦漁港と太地の海をめぐる日帰りプラン";
const DESC_FROM = "苔むした石畳と杉並木が続く大門坂。世界遺産「紀伊山地の霊場と参詣道」を代表する、熊野古道観光の定番プランです。";
const DESC_TO = "苔むした石畳と杉並木が続く大門坂から、那智の滝と熊野那智大社へ。世界遺産「紀伊山地の霊場と参詣道」をたどり、午後は勝浦漁港と太地の町をめぐる日帰りプランです。";

const LUNCH_NAME = "那智山勝浦線のあたりで昼食";
const LUNCH = "那智の滝から歩いておよそ4分、那智山勝浦線のあたりに着きます。このあたりで昼食にしましょう。この後は、歩いておよそ8分、青岸渡寺へ向かいましょう。";
const PORT_NAME = "勝浦漁港のあたり";
const PORT =
  "熊野那智大社からバスでおよそ25分、山を下って勝浦漁港のあたりに着きます。勝浦漁港は、延縄（はえなわ）漁法による生まぐろの水揚げで日本一とされる港です。近海でとれた生まぐろが水揚げされ、市場の中に並べられます。九州や沖縄からも漁船が入港します。セリは早朝に行われ、朝7時ごろには、市場の展望スペースから入札の様子を見学できます。市場がお休みの日もあります。午後は、港の景色を眺めて過ごしましょう。この後は、バスでおよそ10分、太地町立石垣記念館へ向かいましょう。";

const REPS: Record<string, [string, string][]> = {
  [FUDARAKU]: [["旅の始まりは、JR紀伊勝浦駅から歩いておよそ8分の補陀洛山寺です。", "旅の始まりは、JR那智駅から歩いておよそ3分の補陀洛山寺です。"]],
  [TAKI]: [
    ["大門坂を登った先、那智の滝(那智大滝)に着きます。", "大門坂から歩いておよそ25分、那智の滝(那智大滝)に着きます。"],
    ["鳥居をくぐった先の「お滝拝所舞台」まで石段を上れば、滝つぼのすぐそばまで近づくことができます。", "鳥居の先の石段を進むと「お滝拝所舞台」があり、滝つぼに近い場所から滝を見上げることができます。"],
    ["この後は、参道を歩いておよそ13分、青岸渡寺へ向かいましょう。", "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ4分、那智山勝浦線のあたりへ向かいましょう。"],
  ],
  [SEIGANTO]: [
    ["那智の滝から参道を歩いておよそ13分、青岸渡寺に着きます。", "那智山勝浦線のあたりから歩いておよそ8分、青岸渡寺に着きます。"],
    ["この後は、歩いてすぐ、三重塔へ向かいましょう。", "この後は、歩いておよそ4分、三重塔へ向かいましょう。"],
  ],
  [TOU]: [
    ["青岸渡寺の本堂裏手、朱塗りの三重塔に着きます。", "青岸渡寺から歩いておよそ4分、朱塗りの三重塔に着きます。"],
    ["この後は、歩いてすぐ、熊野那智大社へ向かいましょう。", "この後は、歩いておよそ5分、熊野那智大社へ向かいましょう。"],
  ],
  [TAISHA]: [
    ["三重塔から歩いてすぐ、熊野那智大社に着きます。", "三重塔から歩いておよそ5分、熊野那智大社に着きます。"],
    ["静かに、敬意をもってお参りください。", "静かに、敬意をもってお参りしましょう。"],
    ["この後は、バスでおよそ25分、山を下って勝浦漁港にぎわい市場へ向かいましょう。", "この後は、バスでおよそ25分、山を下って勝浦漁港のあたりへ向かいましょう。"],
  ],
  [ISHIGAKI]: [["勝浦漁港にぎわい市場からバスでおよそ10分、", "勝浦漁港のあたりからバスでおよそ10分、"]],
};

const count = (s: string, sub: string) => s.split(sub).length - 1;
function applyReps(memo: string, reps: [string, string][], name: string) {
  for (const [a, b] of reps) {
    if (count(memo, a) !== 1) throw new Error(`${name}: 直す文が1か所ではありません「${a}」(${count(memo, a)})`);
    memo = memo.replace(a, b);
  }
  return memo;
}
// しおり全体に残ってはいけない言葉
const BANNED = /すぐ|定番|人気|おすすめ|カフェ|ください|洗練|絶好|にぎわい市場|寿司|丼|グルメ|無料|料金|解体ショー|代表する/g;

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true } });
  if (!it || it.title !== TITLE_FROM || it.description !== DESC_FROM) throw new Error(`題・説明文が想定と違います「${it?.title}」`);
  const spots = await prisma.spot.findMany({
    where: { dayId: DAY_ID },
    orderBy: { orderNo: "asc" },
    select: { id: true, name: true, visitTime: true, stayDurationMin: true, lat: true, lng: true, memo: true, day: { select: { itineraryId: true } }, transitLegs: { orderBy: { orderNo: "asc" }, select: { transitMode: true, transitDurationMin: true } }, photos: { select: { id: true } } },
  });
  if (!spots.length || spots[0].day.itineraryId !== ITIN_ID) throw new Error("日が想定と違います");
  const now = spots.map((s) => [s.id, s.name, hm(s.visitTime), s.stayDurationMin, s.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+"), String(s.lat), String(s.lng)]);
  if (JSON.stringify(now) !== JSON.stringify(NOW)) throw new Error(`並びが想定と違います: ${JSON.stringify(now)}`);
  if (spots.find((s) => s.id === MARKET)!.photos.length) throw new Error("外すスポットに写真があります");
  const memo = (id: string) => spots.find((s) => s.id === id)!.memo ?? "";
  const newMemo: Record<string, string> = {};
  for (const id of Object.keys(REPS)) newMemo[id] = applyReps(memo(id), REPS[id], spots.find((s) => s.id === id)!.name);

  const keep = (id: string): SpotOrderItem => ({ id, data: {} });
  const items: { label: string; item: SpotOrderItem }[] = [
    { label: "補陀洛山寺(書き出しの駅と分を直す)", item: { id: FUDARAKU, data: { memo: newMemo[FUDARAKU] } } },
    { label: "熊野古道 大門坂(そのまま)", item: keep(DAIMON) },
    { label: "那智の滝(「すぐそば」を言いかえ。結びを昼食へ)", item: { id: TAKI, data: { memo: newMemo[TAKI] } } },
    { label: `${LUNCH_NAME}(新規。県道 那智山勝浦線 node1389507586)`, item: { create: { name: LUNCH_NAME, lat: "33.672749", lng: "135.889126", visitTime: T(11, 59), stayDurationMin: 40, memo: LUNCH, transitLegs: C(["walk", 4]) } } },
    { label: "青岸渡寺(12:08→12:47、歩13→歩8)", item: { id: SEIGANTO, data: { visitTime: T(12, 47), memo: newMemo[SEIGANTO], transitLegs: L(["walk", 8]) } } },
    { label: "三重塔(12:41→13:21、歩3→歩4、点を way351906993 に)", item: { id: TOU, data: { visitTime: T(13, 21), lat: "33.671063", lng: "135.888875", memo: newMemo[TOU], transitLegs: L(["walk", 4]) } } },
    { label: "熊野那智大社(13:09→13:51、歩3→歩5)", item: { id: TAISHA, data: { visitTime: T(13, 51), memo: newMemo[TAISHA], transitLegs: L(["walk", 5]) } } },
    { label: `${PORT_NAME}(新規。県道 勝浦港湯川線 node13575018604。点の例外)`, item: { create: { name: PORT_NAME, lat: "33.626139", lng: "135.943053", visitTime: T(14, 56), stayDurationMin: 20, memo: PORT, transitLegs: C(["bus", 25]) } } },
    { label: "太地町立石垣記念館(15:24→15:26、書き出しを直す)", item: { id: ISHIGAKI, data: { visitTime: T(15, 26), memo: newMemo[ISHIGAKI] } } },
    { label: "太地町立くじらの博物館(16:01→16:03。16:58に出る)", item: { id: KUJIRA, data: { visitTime: T(16, 3) } } },
  ];

  // しおり全体(直したあと)の言葉の確かめ
  const after = [TITLE_TO, DESC_TO, ...items.map(({ item }) => ("id" in item ? ((item.data as { memo?: string }).memo ?? memo(item.id)) : (item.create.memo as string)))].join("\n");
  const left = after.match(BANNED);
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
    "■ [外す] 勝浦漁港にぎわい市場(写真なし)\n\n  11:10+45+4=11:59 昼食、+40+8=12:47 青岸渡寺、+30+4=13:21 三重塔、+25+5=13:51 大社、+40+25=14:56 勝浦漁港のあたり、+20+10=15:26 石垣記念館、+25+12=16:03 くじらの博物館、+55=16:58 に出る\n  言葉の確かめ: 題・説明文・全メモで禁止の言葉 0件"
  );
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_TO, description: DESC_TO } });
      await setDaySpotOrder(DAY_ID, items.map((r) => r.item), { tx, remove: [MARKET] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
