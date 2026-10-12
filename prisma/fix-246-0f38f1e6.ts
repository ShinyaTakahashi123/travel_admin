/**
 * #246 0f38f1e6「五色沼湖沼群、コバルトブルーの沼を歩くプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜11:00 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」）。
 * タイトルを内容に合わせて「五色沼の毘沙門沼から桧原湖へ、裏磐梯の湖と沼をめぐる日帰りプラン」に変える
 * 季節は、毘沙門沼の手こぎボートと桧原湖の遊覧船が冬に休み、小野川不動滝は冬の個人のトレッキングが危険なので、春・夏・秋にする
 * 北塩原村・猪苗代町のほかのしおり（e1871a37・c3b9522c: 五色沼自然探勝路を全部歩く・裏磐梯ビジターセンター・磐梯山噴火記念館、8480e278: 諸橋近代美術館など）と
 *   行き先が重ならないよう、五色沼は毘沙門沼だけにし、中瀬沼・レンゲ沼・桧原湖・小野川不動滝・曽原湖をめぐる。毘沙門沼の文は、ほかの2本が書いた
 *   「1888年の噴火・約3.6kmの探勝路・水の成分」を使わずに書いた
 * 車の旅（JR猪苗代駅の近くでレンタカーを借りて返す）:
 *   毘沙門沼 9:00 → 中瀬沼探勝路 → レンゲ沼 → 道の駅裏磐梯（昼食）→ 桧原湖遊覧船 → 小野川不動滝 → 曽原湖 16:30 → 猪苗代駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   裏磐梯観光協会 https://www.urabandai-inf.com/?page_id=141 五色沼湖沼群（名前は5つの沼ではなく、天候や季節、見る角度で変わるさまざまな色から・最大の毘沙門沼で手こぎボート・
 *     2016年にミシュラン・グリーンガイドで一つ星）／?page_id=24968 桧原湖（裏磐梯で最大の湖・大小の島・周囲約31km・最大水深31m・遊覧船から磐梯山）／
 *     ?page_id=24988 小野川不動滝（落差25m・不動明王をまつる・水は磐梯高原の百貫清水から・小野川湧水は名水百選・片道約1km、約30分、高低差70m、急な階段あり・冬の個人のトレッキングは大変危険）
 *   裏磐梯ビジターセンター https://urabandai-vc.jp/trekking/3nakase/ 中瀬沼探勝路（片道約1.3km・入口から展望台まで約20分・磐梯山の噴火口と中瀬沼を眺望・噴火でできた流れ山）／
 *     /trekking/4renge/ レンゲ沼（一周約0.7km、約15分・夏にジュンサイやヒツジグサの花・カイツブリなどの水鳥・高低差の少ない周回コース）／
 *     /trekking/5sohara/ 曽原湖畔探勝路（片道1.5km、約20分・ゴムチップ舗装・まわりにジュンサイ沼・初夏に地元の人がジュンサイを摘む）
 *   たびよみ https://tabi-mag.jp/hs0072/ 桧原湖遊覧船（裏磐梯高原駅近くの湖畔から・島めぐり約35分・大型の遊覧船・4月下旬〜11月上旬）
 *   道の駅裏磐梯: よむの道の駅 https://yomuno.jp/michinoeki/fukushima/280 （レストラン・軽食・展望台・直売所・冬期は営業時間短縮と定休日あり）
 * 座標: OSM — 中瀬沼 node 8772022117・レンゲ沼 node 8772074417・桧原湖遊覧船 node 2926986212・不動滝 node 6518466845（node は API で名前つきを確かめた）／
 *   毘沙門沼 relation 14127212・曽原湖 relation 2314065・道の駅裏磐梯 way 440603170（Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-246-0f38f1e6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0f38f1e6-8366-4f6e-a646-428078f069e4";
const DAY_ID = "f5fb9d81-5337-489e-82c1-03153162c75b";
const BISHAMON = "1dd4c2c8-de83-4a9f-9002-3e075d88964d";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const TITLE = "五色沼の毘沙門沼から桧原湖へ、裏磐梯の湖と沼をめぐる日帰りプラン";
const DESCRIPTION =
  "五色沼でいちばん大きな毘沙門沼から、噴火口を望む中瀬沼の展望台、水鳥の遊ぶレンゲ沼へ。昼食のあとは遊覧船で桧原湖の島々をめぐり、名水の流れ落ちる小野川不動滝と静かな曽原湖を歩く、裏磐梯の湖と沼のレンタカーの日帰りプランです。";
const SEASONS = ["spring", "summer", "autumn"];

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(BISHAMON, { h: 9, m: 0, stay: 60, legs: [], lat: 37.6516397, lng: 140.0889542, address: "福島県耶麻郡北塩原村桧原",
    memo: "この旅は車でめぐります。JR猪苗代駅の近くでレンタカーを借りて、車で約25分。五色沼の沼の中でいちばん大きな沼です。「五色」は沼の数ではなく、天気や季節、見る角度によって、エメラルドグリーンやコバルトブルーなどさまざまに変わる水の色を表すといわれます。2016年には、ミシュラン・グリーンガイドで一つ星に選ばれました。毘沙門沼では手こぎボートに乗って、水の上から沼を眺めることもできます。ボートに乗るときは、係の人の案内に従いましょう。沼のほとりの道は雨のあとにぬかるむので、足元に気をつけましょう。" }),
  cre("中瀬沼探勝路", { h: 10, m: 10, stay: 50, legs: [car(10)], lat: 37.6707856, lng: 140.068781, address: "福島県耶麻郡北塩原村桧原",
    memo: "毘沙門沼から車で約10分。入口から約20分歩くと展望台に着き、荒々しい磐梯山の噴火口と、噴火によってできた中瀬沼を見渡せます。道の途中には、噴火でできた小さな丘「流れ山」がいくつも見られます。" }),
  cre("レンゲ沼", { h: 11, m: 5, stay: 25, legs: [car(5)], lat: 37.6752317, lng: 140.0723416, address: "福島県耶麻郡北塩原村桧原",
    memo: "中瀬沼の入口から車で約5分。一周約0.7km、15分ほどで歩ける小さな沼で、高低差の少ない道がめぐっています。夏にはジュンサイやヒツジグサの花が咲き、カイツブリなどの水鳥も見られます。水鳥には近づきすぎず、食べ物を与えないようにしましょう。" }),
  cre("道の駅裏磐梯", { h: 11, m: 45, stay: 70, legs: [car(15)], lat: 37.6647356, lng: 140.0435291, address: "福島県耶麻郡北塩原村大字桧原字南黄連沢山1157",
    memo: "レンゲ沼から車で約15分。レストランや軽食の店、地元の産物を並べる直売所、展望台のある道の駅です。ここで昼食にしましょう。冬のあいだは営業の時間や休みの日が変わるので、公式の案内で確かめましょう。" }),
  cre("桧原湖遊覧船", { h: 13, m: 5, stay: 65, legs: [car(10)], lat: 37.6531118, lng: 140.063261, address: "福島県耶麻郡北塩原村桧原",
    memo: "道の駅から車で約10分、裏磐梯高原駅の近くの湖畔の乗り場へ。桧原湖は裏磐梯でいちばん大きな湖で、周囲は約31kmあり、大小の島が浮かんでいます。大きな遊覧船で約35分かけて島々をめぐり、湖の上から磐梯山を眺めましょう。遊覧船は春から秋に運航し、冬は休みます。出航の時刻は公式の案内で確かめ、乗るときは係の人の案内に従いましょう。" }),
  cre("小野川不動滝", { h: 14, m: 30, stay: 65, legs: [car(20)], lat: 37.691122, lng: 140.1226598, address: "福島県耶麻郡北塩原村桧原",
    memo: "乗り場から車で約20分。小野川湖の上流にある、落差約25mの大きな滝で、不動明王がまつられていることから、この名がつきました。水は磐梯高原の百貫清水から流れ出たもので、小野川湧水は名水百選に選ばれています。駐車場から滝までは片道約1km、30分ほどの道で、急な階段もあるので、歩きやすい靴で足元に気をつけて歩きましょう。" + PRAY }),
  cre("曽原湖", { h: 15, m: 50, stay: 40, legs: [car(15)], lat: 37.6851003, lng: 140.0712379, address: "福島県耶麻郡北塩原村桧原",
    memo: "不動滝から車で約15分。湖のほとりに約1.5kmの歩きやすい道が続く、静かな湖です。まわりにはジュンサイの沼が点在し、初夏には地元の人がジュンサイを摘む姿も見られます。摘み取りの仕事のじゃまにならないよう、静かに歩きましょう。帰りは、車で約35分のJR猪苗代駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== BISHAMON) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? "毘沙門沼(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}\n季節: ${SEASONS.join(",")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION, seasons: SEASONS } });
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
