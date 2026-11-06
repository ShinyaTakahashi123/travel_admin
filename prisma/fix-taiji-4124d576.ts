/**
 * 4124d576（熊野古道 大門坂と那智山、勝浦漁港と太地の海をめぐる日帰りプラン）の午後の組み直し（しおりえ(制作補助2)、2026-11-06）
 * 企画運営の割り当て（11/06 9時台）: 帰りの文に分を入れる／那智の滝のメモを ad835f73 と20字以上同じにしない／ほかのバス区間を公式で確かめる。
 * 確かめると、午後は時刻表どおりに乗れなかった（企画運営 11/06「案1で」）:
 *   - 勝浦漁港のあたり→石垣記念館「バス10」: 熊野御坊南海バスの勝浦営業所 運行系統図（2026年4月1日改正）に勝浦→太地の路線がなく、
 *     太地町の町営じゅんかんバス（令和8年3月14日改正）は太地町内となぎだけで勝浦へ行かない
 *   - 熊野那智大社→勝浦漁港「バス25」: 大社を出て1分後の便に乗る形で、バス停まで歩く分がなかった
 *   → 大社のあと、那智山のバス停（OSM highway=bus_stop node3578364302、routed-foot 5.42分→6）から那智山線（系統32）で紀伊勝浦駅へ
 *     （那智山 13:57 発→紀伊勝浦駅 14:23 着＝26分。熊野御坊南海バス 那智山線時刻表 2026年4月1日改正）、
 *     紀伊勝浦駅で待ち27分、JR紀勢本線（きのくに線）下り 紀伊勝浦 14:50 発→太地 14:57（7分。JRおでかけネット 区間時刻表 2026-11-06）、
 *     太地駅（OSM node9677252168）→石垣記念館 routed-foot 28.20分→29（着 15:26 は今と同じ）
 *   - 法務（09:55）: バス停に着く分と発車の分が同じ13:57だったため、大社を13:46に出て13:52にバス停に着き、バスを待つ5分（other5）を入れる。大社の結びに「バスの時刻は、公式の時刻表で確かめましょう。」
 *   - 勝浦漁港のあたり（20分）は、紀伊勝浦駅から往復 10.62分×2 で待ち時間に5分しか残らないため外す（企画運営「合わなければ外す」）。
 *     題・説明文の「勝浦漁港」も外す
 *   - 石垣記念館→くじらの博物館 walk12 は routed-foot 12.68分→13（短すぎるので直す）。博物館 16:04・47分（55から縮める）→16:51に出る
 *   - 帰り（案A）: くじら館のバス停（OSM node7777174685、博物館から 0.91分）から町営じゅんかんバスで太地駅へ（くじら館 16:56→太地駅 17:04＝8分）。
 *     便の発車時刻はメモに書かない
 *   - 13:57 の便に合わせるため、午前の滞在を縮める（延ばさない）: 那智の滝 45→35、昼食 40→35、青岸渡寺 30→25、三重塔 25→20、熊野那智大社 40→20
 * 那智の滝のメモ: ad835f73 と同じ事実のまま、文を書きかえる（20字以上の一致なし）。出典は前回の確認のとおり
 * 出典: 熊野御坊南海バス https://kumanogobobus.nankai-nanki.jp/local/熊野エリア/（那智山線時刻表・勝浦営業所運行系統図 2026年4月1日改正）／
 *   太地町 https://www.town.taiji.wakayama.jp/kurashi/bus/files/R8.3.14.pdf ／ JRおでかけネット https://timetable.jr-odekake.net/line-timetable/2314 ／
 *   和歌山県「県民の友」2026年3月号（くじらの博物館 8:30〜17:00）
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-taiji-4124d576.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "4124d576-4cd8-4086-b61e-9cd8a9576115";
const DAY_ID = "d165e800-ac6a-4b42-83e3-22e53457fe35";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (d: Date | null) => (d ? d.toISOString().slice(11, 16) : "--:--");
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number; transitLine: string | null };
const legs = (...xs: [string, number, string?][]): Leg[] => xs.map(([mode, min, line], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min, transitLine: line ?? null }));
const L = (...xs: [string, number, string?][]) => ({ deleteMany: {}, create: legs(...xs) });

const NOW: [string, string, string, number, string, string, string][] = [
  ["8ee8e37d-0ae6-4f08-ab08-24bdca0b52c5", "補陀洛山寺", "09:00", 35, "", "33.644736", "135.93442"],
  ["04b96850-bfb9-4028-b955-be7133557527", "熊野古道 大門坂", "09:45", 60, "bus10", "33.670705", "135.901208"],
  ["204b0fb3-cb5b-4d75-83bb-c1ba7dae3684", "那智の滝", "11:10", 45, "walk25", "33.675283", "135.887627"],
  ["0365920f-010f-4e51-8526-fc246c19e9ab", "那智山勝浦線のあたりで昼食", "11:59", 40, "walk4", "33.672749", "135.889126"],
  ["d142e8c1-f751-4ab0-b1c2-02782eadc6f2", "青岸渡寺", "12:47", 30, "walk8", "33.669314", "135.889923"],
  ["fdc036a5-562c-4944-be83-4978783c31b3", "三重塔", "13:21", 25, "walk4", "33.671063", "135.888875"],
  ["1238e0e8-82db-4ba0-af2a-d73105538449", "熊野那智大社", "13:51", 40, "walk5", "33.668568", "135.890493"],
  ["c506a413-ea15-429d-b027-48128f4f0ede", "勝浦漁港のあたり", "14:56", 20, "bus25", "33.626139", "135.943053"],
  ["24441e88-3cee-4937-a49b-521892611fa4", "太地町立石垣記念館", "15:26", 25, "bus10", "33.598328", "135.940308"],
  ["a185d199-6248-49a7-80db-7348ee275fda", "太地町立くじらの博物館", "16:03", 55, "walk12", "33.601873", "135.945778"],
];
const [FUDARAKU, DAIMON, TAKI, LUNCH, SEIGANTO, TOWER, TAISHA, GYOKO, ISHIGAKI, KUJIRA] = NOW.map((r) => r[0]);

const TITLE_FROM = "熊野古道 大門坂と那智山、勝浦漁港と太地の海をめぐる日帰りプラン";
const TITLE_TO = "熊野古道 大門坂と那智山、鯨とともに歩んできた太地の町をめぐる日帰りプラン";
const DESC_FROM = "苔むした石畳と杉並木が続く大門坂から、那智の滝と熊野那智大社へ。世界遺産「紀伊山地の霊場と参詣道」をたどり、午後は勝浦漁港と太地の町をめぐる日帰りプランです。";
const DESC_TO = "苔むした石畳と杉並木が続く大門坂から、那智の滝と熊野那智大社へ。世界遺産「紀伊山地の霊場と参詣道」をたどり、午後はバスと電車で太地へ向かい、鯨とともに歩んできた町をめぐる日帰りプランです。";

const M_TAKI =
  "大門坂から歩いておよそ25分、那智の滝（那智大滝）に着きます。落差133m、幅13mの滝で、華厳の滝・袋田の滝と並ぶ「日本三名瀑」の一つともいわれます。熊野那智大社の別宮・飛瀧神社では、社殿を建てずにこの滝そのものをご神体としてまつっていて、自然を神として敬う古い信仰の形が見られます。流れ落ちる水が三つの筋に分かれて見えることから「三筋の滝」の名もあり、1972年に「那智大滝」の名で国の名勝となりました。鳥居をくぐって石段を進んだ先の「お滝拝所舞台」からは、滝つぼの近くで滝を見上げられます。滝のそばの石段は水しぶきでぬれていることがあるので、ゆっくり足元を確かめながら歩きましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ4分、那智山勝浦線のあたりへ向かいましょう。";

const REPS: Record<string, [string, string][]> = {
  [TAISHA]: [
    [
      "この後は、バスでおよそ25分、山を下って勝浦漁港のあたりへ向かいましょう。",
      "この後は、那智山のバス停まで歩いておよそ6分。那智山線のバスでおよそ26分、山を下って紀伊勝浦駅へ向かい、JR紀勢本線に乗りかえて、およそ7分の太地駅へ向かいましょう。紀伊勝浦駅では、電車を待つ時間があります。バスの時刻は、公式の時刻表で確かめましょう。",
    ],
  ],
  [ISHIGAKI]: [
    ["勝浦漁港のあたりからバスでおよそ10分、", "JR太地駅から歩いておよそ29分、"],
    ["この後は、歩いておよそ12分、太地町立くじらの博物館へ向かいましょう。", "この後は、歩いておよそ13分、太地町立くじらの博物館へ向かいましょう。"],
  ],
  [KUJIRA]: [
    ["太地町立石垣記念館から歩いておよそ12分、", "太地町立石垣記念館から歩いておよそ13分、"],
    ["お帰りは、バスなどで紀伊勝浦駅方面へ戻りましょう。", "帰りは、くじら館のバス停から町営じゅんかんバスでおよそ8分、JR太地駅へ向かいましょう。バスの時刻は、町の時刻表で確かめましょう。"],
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
// しおり全体（題・説明文・全メモ）に残ってはいけない言葉
const BANNED = /勝浦漁港|すぐ|おすすめ|ください|定番|よいでしょう|バスなどで/g;

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true } });
  if (!it || it.title !== TITLE_FROM || it.description !== DESC_FROM) throw new Error("題・説明文が想定と違います");
  const spots = await prisma.spot.findMany({
    where: { dayId: DAY_ID },
    orderBy: { orderNo: "asc" },
    select: { id: true, name: true, visitTime: true, stayDurationMin: true, lat: true, lng: true, memo: true, day: { select: { itineraryId: true } }, transitLegs: { orderBy: { orderNo: "asc" }, select: { transitMode: true, transitDurationMin: true } }, photos: { select: { id: true } } },
  });
  if (!spots.length || spots[0].day.itineraryId !== ITIN_ID) throw new Error("日が想定と違います");
  const now = spots.map((s) => [s.id, s.name, hm(s.visitTime), s.stayDurationMin, s.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+"), String(s.lat), String(s.lng)]);
  if (JSON.stringify(now) !== JSON.stringify(NOW)) throw new Error(`並びが想定と違います: ${JSON.stringify(now)}`);
  if (spots.find((s) => s.id === GYOKO)!.photos.length) throw new Error("外すスポットに写真があります");
  const memo = (id: string) => spots.find((s) => s.id === id)!.memo ?? "";
  const nm: Record<string, string> = {};
  for (const id of Object.keys(REPS)) nm[id] = applyReps(memo(id), REPS[id], spots.find((s) => s.id === id)!.name);

  const keep = (id: string): SpotOrderItem => ({ id, data: {} });
  const items: { label: string; item: SpotOrderItem }[] = [
    { label: "補陀洛山寺(そのまま)", item: keep(FUDARAKU) },
    { label: "熊野古道 大門坂(そのまま)", item: keep(DAIMON) },
    { label: "那智の滝(滞在45→35。メモを書きかえ)", item: { id: TAKI, data: { stayDurationMin: 35, memo: M_TAKI } } },
    { label: "那智山勝浦線のあたりで昼食(11:59→11:49、40→35)", item: { id: LUNCH, data: { visitTime: T(11, 49), stayDurationMin: 35 } } },
    { label: "青岸渡寺(12:47→12:32、30→25)", item: { id: SEIGANTO, data: { visitTime: T(12, 32), stayDurationMin: 25 } } },
    { label: "三重塔(13:21→13:01、25→20)", item: { id: TOWER, data: { visitTime: T(13, 1), stayDurationMin: 20 } } },
    { label: "熊野那智大社(13:51→13:26、40→20。結びを書きかえ)", item: { id: TAISHA, data: { visitTime: T(13, 26), stayDurationMin: 20, memo: nm[TAISHA] } } },
    {
      label: "太地町立石垣記念館(15:26のまま。区間 bus10→歩6+バスを待つ5+バス26+待ち27+JR7+歩29。書き出しと結び)",
      item: { id: ISHIGAKI, data: { memo: nm[ISHIGAKI], transitLegs: L(["walk", 6], ["other", 5], ["bus", 26, "那智山線"], ["other", 27], ["train", 7, "JR紀勢本線"], ["walk", 29]) } },
    },
    { label: "太地町立くじらの博物館(16:03→16:04、walk12→13、55→47。書き出しと帰りの文)", item: { id: KUJIRA, data: { visitTime: T(16, 4), stayDurationMin: 47, memo: nm[KUJIRA], transitLegs: L(["walk", 13]) } } },
  ];

  const after = [TITLE_TO, DESC_TO, ...items.map(({ item }) => ("id" in item ? ((item.data as { memo?: string }).memo ?? memo(item.id)) : ""))].join("\n");
  const left = after.match(BANNED);
  if (left) throw new Error(`直したあとに残る言葉: ${left}`);

  console.log(`題 → ${TITLE_TO}\n説明文 → ${DESC_TO}`);
  let prevEnd: number | null = null;
  for (const { label, item } of items) {
    const cur = spots.find((s) => "id" in item && s.id === item.id)!;
    const d = (item as { data: Record<string, unknown> }).data;
    const vt = (d.visitTime as Date | undefined) ?? cur.visitTime!;
    const st = (d.stayDurationMin as number | undefined) ?? cur.stayDurationMin!;
    const lg = d.transitLegs as { create?: Leg[] } | undefined;
    const legList = lg?.create ? lg.create.map((l) => [l.transitMode, l.transitDurationMin, l.transitLine] as const) : cur.transitLegs.map((l) => [l.transitMode, l.transitDurationMin ?? 0, null] as const);
    const legMin = legList.reduce((a, l) => a + l[1], 0);
    if (prevEnd !== null && prevEnd + legMin * 60000 !== vt.getTime()) throw new Error(`${label}: 時刻のつながりが合いません`);
    prevEnd = vt.getTime() + st * 60000;
    const ls = legList.map((l) => `${l[0]}${l[1]}${l[2] ? `(${l[2]})` : ""}`).join("+") || "(なし)";
    console.log(`■ ${label}\n  着 ${hm(vt)}／滞在 ${st}／区間 ${ls}／点 ${cur.lat},${cur.lng}${d.memo ? `\n  メモ: ${d.memo}` : ""}`);
  }
  console.log(`■ [外す] 勝浦漁港のあたり(写真なし)\n\n  最後の出発 ${hm(new Date(prevEnd!))}／時刻のつながり: すべて合っています\n  言葉の確かめ: 題・説明文・全メモで ${BANNED.source} 0件`);
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_TO, description: DESC_TO } });
      await setDaySpotOrder(DAY_ID, items.map((r) => r.item), { tx, remove: [GYOKO] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
