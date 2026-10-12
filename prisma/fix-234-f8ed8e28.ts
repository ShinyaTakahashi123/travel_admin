/**
 * #234 f8ed8e28「富山市ガラス美術館で現代アートにふれる、隈研吾建築めぐりプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜11:00 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ようこそ」「心に残るひとときとなりますように」）。
 *   タイトルの「隈研吾建築めぐり」は、行程に隈研吾の建物がひとつしかないので、内容に合わせてタイトルを変える
 * タイトル: 「富山市ガラス美術館と富山ガラス工房、ガラスの街から呉羽山をめぐる日帰りプラン」
 * 車の旅（富山駅の近くでレンタカーを借りて返す）:
 *   富山市ガラス美術館 9:30 → 富山ガラス工房（昼食・併設のカフェ）→ 富山市民俗民芸村 → 五百羅漢 → 呉羽山公園展望台 16:30 → 富山駅
 *   #2cc9028d・#d6beaf2d（富山市内）とはガラス美術館だけ重なるので、両方の文が使っている隈研吾の外観・ルーバー・チフーリの話は避け、“つくる・育てる・見せる”と企画展・図書館の話で書いた
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典: 富山市公式観光サイト https://www.toyamashi-kankoukyoukai.jp/spot/<名前>/ —
 *   toyama-glassart-museum 富山市ガラス美術館（隈研吾の複合施設「TOYAMAキラリ」・立山連峰をイメージした外観・県産材ルーバーの光・6階のデイル・チフーリの「グラス・アート・ガーデン」・
 *     ガラス造形研究所、ガラス工房、ガラス美術館の“つくる・育てる・見せる”・図書館やカフェも併設・第1、第3水曜休館）／
 *   garasukobo 富山ガラス工房（国内外のガラス作家の創作と発信の拠点・展示、販売、制作体験・吹きガラスやペーパーウェイトの体験・カフェ併設・富山駅からバスで約20分）／
 *   minzokumingeimura 富山市民俗民芸村（呉羽山のふもと・9つの博物館・民芸合掌館、売薬資料館、篁牛人記念美術館・茶室「円山庵」・土人形工房・周辺に五百羅漢と呉羽山展望台）／
 *   kurehayama-kouen-tenboudai 呉羽山公園展望台（東に立山連峰、北に富山湾、遠く能登半島・雪の立山は11月〜6月ごろ・北陸新幹線と立山連峰の撮影スポット・近くに民俗民芸村や五百羅漢）
 *   五百羅漢: とやま観光ナビ https://www.info-toyama.com/articles/kurehayama-yuhei （数百体の石像・坐像と立像・高さはほぼ一定・一体ずつ違う顔）と、
 *     富山市公式観光サイトの検索結果（石像は無料で見学でき、長慶寺が管理）
 * 座標: OSM — 富山市ガラス美術館 node 3769895563・富山ガラス工房 node 2971297433・富山市民俗民芸村 node 1420914768・五百羅漢 node 4355000050・呉羽山展望台 node 5251970981
 *   （node は API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-234-f8ed8e28.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f8ed8e28-a91b-4a49-b95a-9df98e7a2ecb";
const DAY_ID = "84305fb1-a746-419c-8b62-91a343de5974";
const MUSEUM = "0245c1af-dc03-408f-a3c7-7481f43c6636";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const TITLE = "富山市ガラス美術館と富山ガラス工房、ガラスの街から呉羽山をめぐる日帰りプラン";
const DESCRIPTION =
  "隈研吾が手がけた建物の中にある富山市ガラス美術館で現代のガラスの作品を見て、作家たちの創作の拠点・富山ガラス工房へ。午後は呉羽山のふもとの民俗民芸村や五百羅漢を歩き、立山連峰と富山湾を見渡す展望台で締めくくる、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(MUSEUM, { h: 9, m: 30, stay: 90, legs: [], lat: 36.6883464, lng: 137.2149413, address: "富山県富山市西町5-1",
    memo: "この旅は車でめぐります。富山駅の近くでレンタカーを借りて、車で約10分（美術館には駐車場がないので、近くの駐車場に停めます）。富山市には、ガラス作家を育てる学校、作家が作品を生み出す工房、そして作品を見せる美術館がそろっていて、この美術館はその「見せる」役目を担っています。国内外の作家による企画展も開かれ、訪れるたびに新しい作品に出会えます。同じ建物には市立図書館やカフェも入っているので、展示を見たあとに本の並ぶ空間を歩いてみるのもよいでしょう。休館日は公式の案内で確かめましょう。" }),
  cre("富山ガラス工房", { h: 11, m: 30, stay: 90, legs: [car(30)], lat: 36.6953677, lng: 137.1464069, address: "富山県富山市古沢152",
    memo: "美術館から車で約30分、市の西の古沢へ。国内外のガラス作家が集まる創作と発信の拠点で、富山にゆかりのある作家の器やオブジェの展示・販売があり、吹きガラスなどの制作体験もできます（体験は公式の案内で確かめましょう）。併設のカフェで昼食をとり、作品をゆっくり眺めましょう。工房の中では、熱い炉やガラスに近づかないよう気をつけましょう。" }),
  cre("富山市民俗民芸村", { h: 13, m: 25, stay: 95, legs: [car(25)], lat: 36.7102644, lng: 137.1890906, address: "富山県富山市安養坊",
    memo: "工房から車で約25分、呉羽山のふもとへ。民芸や美術、歴史、民俗など、富山の暮らしと文化を伝える9つの博物館が点在する“文化の里”です。合掌造りの建物を生かした民芸合掌館や、富山の伝統産業を紹介する売薬資料館、郷土の画家・篁牛人の記念美術館などを歩いてめぐれます。茶室では、抹茶と和菓子もいただけます。休館日は公式の案内で確かめましょう。" }),
  cre("五百羅漢", { h: 15, m: 5, stay: 25, legs: [{ mode: "walk", min: 5 }], lat: 36.7115031, lng: 137.1900716, address: "富山県富山市長岡新",
    memo: "民俗民芸村から歩いて約5分。呉羽山の斜面に、座った姿や立った姿の石像が数百体並び、一体ずつ顔が違うのが見どころです。近くの長慶寺が守っている石像です。" + PRAY + "坂道や石段では足元に気をつけましょう。" }),
  cre("呉羽山公園展望台", { h: 15, m: 45, stay: 45, legs: [{ mode: "walk", min: 10 }, car(5)], lat: 36.7090313, lng: 137.1855047, address: "富山県富山市安養坊",
    memo: "五百羅漢から車へ歩いて戻り、車で約5分（あわせて約15分）。富山市の中心の西にある呉羽山の上の展望台で、東に立山連峰、北に富山湾、晴れた日には遠く能登半島までを見渡せます。雪をいただいた立山連峰がとくに美しいのは、例年11月から6月ごろです。帰りは、車で約15分の富山駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== MUSEUM) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? "富山市ガラス美術館(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
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
