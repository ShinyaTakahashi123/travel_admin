/**
 * #242 0c542f79「大仏さまと鹿に会える、奈良公園・東大寺の定番日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 5か所 09:00〜13:50 で終わりが早く、本文はすべて案内の話し方（「皆様」「ご案内いたします」「お疲れ様でございました」）。
 *   興福寺のスポットで「境内周辺の食事処」で昼食としていたが、寺は食事の場所ではない。猿沢池の本文は采女の悲しい伝説（入水の話）を書いていた
 *   奈良公園の写真は興福寺の五重塔なので、興福寺へ移す。座標は丸めた値だったので、OSM の点に直す
 * 奈良市のほかのしおり（443379ac・6ac70480・a37b8c79・7f972333・c97e2205・5ffdffa6）と、東大寺・奈良公園・春日大社・興福寺が重なるので、
 *   それぞれの本文を読み、使っていない話（大仏殿の大きさと江戸時代の再建の縮小、飛火野と公園の始まり、式年造替と春日燈籠、中金堂の再建と東金堂）で書いた。
 *   猿沢池は、ほかのしおりと同じ話（749年・放生会・南都八景）しか書けないので外し、ほかのしおりにない志賀直哉旧居と吉城園を加えた
 * 歩きの旅（近鉄奈良駅から歩いてめぐり、近鉄奈良駅に戻る）:
 *   東大寺 9:00 → 奈良公園（飛火野）→ 春日大社 → 志賀直哉旧居 → ならまち（昼食）→ 興福寺 → 吉城園 16:30 → 近鉄奈良駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   東大寺 https://www.todaiji.or.jp/information/daibutsuden/ （大仏殿は江戸時代に公慶上人が再建・国宝・世界最大級の木造建造物・東西57.012m、南北50.480m、高さ48.742m・
 *     天平と鎌倉の大仏殿は桁行11間（約88m）だったが財政難で7間に縮小）
 *   奈良県 奈良公園クイックガイド https://www.pref.nara.lg.jp/site/park/1001.html （明治13年(1880)2月14日開設・1923年名勝・1998年世界遺産）と、奈良市観光協会の検索結果（飛火野は春日大社表参道に面した芝生の原・鹿・御蓋山を望む）
 *   春日大社 https://www.kasugataisha.or.jp/zotai/ （20年ごとの式年造替で社殿の修理と御調度品の調製・若宮の参道に室町時代の燈籠の3分の2・境内に約3,000基・「春日燈籠」として全国の石燈籠に影響）
 *   志賀直哉旧居: 文化遺産オンライン https://online.bunka.go.jp/heritages/detail/239261 （志賀直哉が自ら設計し、京都の大工・下島松之助が昭和4年に完成・奈良県指定文化財・奈良学園セミナーハウス）、
 *     たびよみ https://tabi-mag.jp/na0015/ （昭和4年から13年まで9年暮らした・『暗夜行路』を完成・食堂に文化人が集い「高畑サロン」）、奈良市観光協会（9:30〜17:30、12月〜2月は16:30まで）
 *   ならまち: 奈良市観光協会 https://narashikanko.or.jp/feature/naramachi の検索結果（町家を生かしたカフェや食事の店・大和野菜、茶がゆ、柿の葉寿司など）
 *   興福寺 https://www.kohfukuji.com/property/a-0007/ 中金堂（伽藍の中心・6度の焼失と再建・平成30年10月に創建当初の様式で再建・正面37m、側面23m）と、
 *     検索結果の a-0003 東金堂（神亀3年(726)に聖武天皇が元正太上天皇の病気平癒を願って建立・今の建物は応永22年(1415)）・b-0009 阿修羅像（国宝館・奈良時代・像高153.4cm）
 *   吉城園 https://narashikanko.or.jp/spot/detail_10087.html （興福寺の子院・摩尼珠院の跡・池の庭、苔の庭、茶花の庭・春日山と若草山を借景・無料・最終入園16:30）
 * 座標: OSM — 大仏殿 way 43558119・飛火野 way 454304200・春日大社 way 1134481286・ならまち通り way 315638870・興福寺 way 1134439456・吉城園 way 97082273（Nominatim の中心）／
 *   奈良学園セミナーハウス志賀直哉旧居 node 2466214672
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-242-0c542f79.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0c542f79-2811-4a59-bfcb-34816ad72c3e";
const DAY_ID = "b4c276e8-6772-4e9c-b339-d52d577b24e0";
const TODAIJI = "8f2a43b8-b478-4f3f-a702-5f86fbf3397c";
const PARK = "ab0e4bb3-275b-4702-8d31-8ca0fdd756fd";
const KASUGA = "9e0ff62b-6abc-44a3-970d-10d0bbb903a9";
const KOFUKUJI = "594f6888-486d-4d67-943f-ff2caef8ee6a";
const SARUSAWA = "1a6b826a-14f9-4050-bcc6-e6628973463c";
const PAGODA_PHOTO = "4dffc7bb-b723-4d75-a1c1-3f16480b037d";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "江戸時代に再建された東大寺の大仏殿で大仏さまに会い、鹿の遊ぶ飛火野から燈籠の並ぶ春日大社へ。高畑の志賀直哉の旧居をたずね、ならまちで昼食。午後は興福寺の中金堂と仏像、静かな庭園・吉城園をめぐる、歩いて楽しむ奈良の日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(TODAIJI, { h: 9, m: 0, stay: 80, legs: [], lat: 34.689065, lng: 135.839873, address: "奈良県奈良市雑司町406-1",
    memo: "この旅は歩いてめぐります。近鉄奈良駅から東へ歩いて約20分。大仏さまをおさめる大仏殿は、戦の火で焼けたあと、江戸時代に公慶上人の力で建て直されたもので、国宝です。東西約57m、南北約50m、高さ約49mあり、世界でも最大級の木造の建物とされます。それでも、奈良時代と鎌倉時代の大仏殿は正面の幅が約88mあり、建て直すときにお金が足りず、今の大きさに縮められたといわれています。堂内では、明かりやスケッチ、三脚が使えないので気をつけましょう。" + PRAY }),
  upd(PARK, { h: 10, m: 40, stay: 30, legs: [walk(20)], lat: 34.680739, lng: 135.8408346, address: "奈良県奈良市春日野町",
    memo: "大仏殿から南へ歩いて約20分、奈良公園の飛火野へ。奈良公園は、明治13年（1880年）に、興福寺の古い境内などの景色を守るために開かれた公園です。飛火野は春日大社の表参道に面した広い芝生の原で、鹿が群れて過ごし、春日大社の神の山・御蓋山を望めます。鹿は野生の動物です。近づきすぎず、鹿せんべいのほかに食べ物を与えないようにしましょう。驚くと、かんだり角で突いたりすることもあります。" }),
  upd(KASUGA, { h: 11, m: 20, stay: 50, legs: [walk(10)], lat: 34.6805063, lng: 135.8460746, address: "奈良県奈良市春日野町160",
    memo: "飛火野から参道を東へ歩いて約10分。春日大社では、20年ごとに社殿を修理し、神の調度品を新しく整える「式年造替」が続けられてきました。参道や境内には約3,000基の燈籠が奉納されていて、若宮へ向かう参道には、室町時代に全国の社寺に納められた燈籠の3分の2が集まるといわれます。ここの燈籠の形は「春日燈籠」と呼ばれ、全国の石燈籠の形に影響を与えました。" + PRAY }),
  cre("志賀直哉旧居", { h: 12, m: 20, stay: 40, legs: [walk(10)], lat: 34.6778782, lng: 135.8436538, address: "奈良県奈良市高畑大道町",
    memo: "春日大社から南へ、高畑の町を歩いて約10分。作家・志賀直哉が自分で設計し、京都の大工の棟梁が昭和4年に建てた家で、奈良県の文化財です。志賀はここで9年暮らし、長編『暗夜行路』を書き上げました。広い食堂には作家や画家たちが集まり、「高畑サロン」と呼ばれたそうです。高畑は今も人が暮らす町なので、静かに歩きましょう。" }),
  cre("ならまち", { h: 13, m: 20, stay: 55, legs: [walk(20)], lat: 34.6796378, lng: 135.8289687, address: "奈良県奈良市光明院町",
    memo: "高畑から西へ歩いて約20分。江戸から明治のころの町家が残る町で、古い家を生かしたカフェや食事の店が多くあります。大和野菜を使った料理や茶がゆ、柿の葉寿司など、奈良らしい昼食をとりましょう。今も人が暮らし、商いをしている町なので、静かに歩きましょう。" }),
  upd(KOFUKUJI, { h: 14, m: 25, stay: 80, legs: [walk(10)], lat: 34.6829744, lng: 135.8318653, address: "奈良県奈良市登大路町48",
    memo: "ならまちから北へ歩いて約10分。寺の中心となる中金堂は、6度の焼失と再建をくり返したのち、平成30年に、創建当初の姿で建て直されました。正面37m、側面23mの大きなお堂です。東隣の東金堂は、奈良時代に聖武天皇が叔母の元正太上天皇の病気が治るよう願って建てたのが始まりで、今の建物は室町時代のものです。国宝館では、奈良時代につくられた阿修羅像（高さ約153cm）をはじめ、多くの仏像に会えます。五重塔は今、修理のため覆いの中にあります。" + PRAY }),
  cre("吉城園", { h: 15, m: 55, stay: 35, legs: [walk(10)], lat: 34.6851015, lng: 135.8372119, address: "奈良県奈良市登大路町",
    memo: "興福寺から東へ歩いて約10分。興福寺の子院・摩尼珠院があった場所につくられた庭園で、池の庭、苔の庭、茶花の庭の3つに分かれ、春日山や若草山を景色に取り入れています。入園は無料で、受付は16時30分までです。帰りは、歩いて約10分の近鉄奈良駅へ向かいましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [TODAIJI, PARK, KASUGA, KOFUKUJI, SARUSAWA].join()) throw new Error("構成が想定と違います");
  if (!it.days[0].spots[1].photos.some((p) => p.id === PAGODA_PHOTO)) throw new Error("奈良公園の写真が見つかりません");
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
  console.log(`\n説明文: ${DESCRIPTION}\n猿沢池を外す: ${SARUSAWA}\n五重塔の写真を奈良公園から興福寺へ移す: ${PAGODA_PHOTO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      const moved = await tx.photo.updateMany({ where: { id: PAGODA_PHOTO, spotId: PARK }, data: { spotId: KOFUKUJI, caption: "興福寺の五重塔" } });
      if (moved.count !== 1) throw new Error("写真を移せませんでした");
      await setDaySpotOrder(DAY_ID, DAY, { tx, remove: [SARUSAWA] });
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
