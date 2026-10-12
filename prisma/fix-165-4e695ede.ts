/**
 * #165 4e695ede「喜多院と本丸御殿、川越の歴史と信仰をたどる日帰り旅」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 3か所 09:30〜12:28 で、昼食と帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」「感じていただけることでしょう」）
 * 川越大師仲店通りの写真（commons File:TokiNoKane_Kawagoe_2013Feb.JPG）は時の鐘の写真で場所が違うので外す。座標も時の鐘の近く（35.92514,139.48578）だったので、喜多院門前通りに直し、昼食の場所にする
 * 歩きの旅（川越駅からバスで喜多院のあたりへ。帰りは本川越駅へ歩く）:
 *   成田山川越別院 9:30 → 喜多院 → 喜多院門前通り（昼食）→ 三芳野神社 → 川越城本丸御殿 → 川越市立博物館 → 川越市立美術館 → 川越城中ノ門堀跡 16:40 → 本川越駅
 * タイトル・季節はそのまま、説明文は書き直す
 * 川越のほかのしおり（ced5ac2b・8f454536）の本文を読み、使っていない話で書いた（喜多院は830年の創建・天海・家光誕生の間・春日局の化粧の間・五百羅漢でなく、寛永15年の大火と江戸城紅葉山からの移築・
 *   客殿の本尊。本丸御殿は1457年・1848年・唯一の遺構・杉戸絵・車寄せ・人形・17万石・松平信綱でなく、もとの16棟・1025坪と明治の解体、家老詰所の払い下げと移築。博物館は江戸〜明治の重点でなく、
 *   蔵造りの町並みの大型模型と建築の工程）。成田山・三芳野神社・美術館・中ノ門堀跡はほかのしおりにない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（川越市 city.kawagoe.saitama.jp）:
 *   /kanko/k-spots/1011583/1011587.html（成田山川越別院: 嘉永3年に千葉出身の石川照温が創建・真言密教の寺・成田山新勝寺の別院・本尊は不動明王、地元では「お不動様」・喜多院の北・境内の蚤の市）／
 *   喜多院 kawagoe.com/kitain（寛永15年の大火でほとんどを焼失・家光が江戸城紅葉山から客殿・書院などを移築・客殿は無量寿殿とも呼ばれ本尊阿弥陀如来・本堂参拝9:00〜16:30）と
 *   /kurashi/bunka/.../1003802.html（客殿は国の重要文化財）（検索結果で確かめた）／
 *   /kurashi/bunka/1003787/1003798/1003884/1003885/1003894.html（三芳野神社: 大同年間の創始と伝わる・太田道真・道灌父子が河越城を築いたとき北野天満宮を合祀し、城の鎮守として本丸内に・
 *   寛永元年に家光が酒井忠勝に復興を命じ翌年遷宮・幕府直営社）と /kanko/k-spots/1011572/1011580.html（社殿は県指定文化財・「とおりゃんせ」発祥の地とされる）／
 *   /kurashi/bunka/1003787/1003798/1003828/1003829/1003836.html（本丸御殿: もとは16棟・建坪1025坪、明治維新後に解体され玄関と大広間だけが残る・昭和42年に県の有形文化財・家老詰所は明治5年に払い下げられ、
 *   昭和63年度に今の場所へ復元移築・家老の居室が残るのは全国的に珍しい）と /museum/honmaru/1014722.html（江戸の北の守り）／
 *   /shisei/shisetsu/kanko/1013319/1013320.html（博物館: 城下町の資料・蔵造りの町並みを再現した大型模型と建築工程の展示・9:00〜17:00・月曜と第4金曜休館）／
 *   /shisei/shisetsu/kanko/1013319/1013321.html（美術館: 川越ゆかりの作家を中心に日本近現代美術・相原求一朗記念室・タッチアートコーナー・9:00〜17:00・月曜休館）／
 *   /kurashi/bunka/1003787/1004082.html（中ノ門堀跡: 城の堀跡として唯一残る・寛永16年に藩主となった松平信綱の改修で造られたと考えられる・西大手門から本丸への侵入を防ぐ・平成20〜21年度に整備、土塀と冠木門）
 * 座標: OSM — 成田山川越別院 way 1058024591・喜多院 way 135224390（place_of_worship）・喜多院門前通り way 36713392（道）・川越市立博物館 way 868558929・川越市立美術館 way 868558928（museum）（Nominatim の中心）／
 *   三芳野神社 node 746234067（place_of_worship）・川越城本丸御殿 node 1420171772（museum）・川越城中ノ堀跡 node 735957639（historic=ruins）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-165-4e695ede.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4e695ede-8aaa-438c-a9e6-c702480b316f";
const DAY1_ID = "587b314b-27e5-45a9-8bae-7aee9173083a";
const KITAIN = "5c3d283c-fe65-49fe-a784-1e4311440828";
const NAKAMISE = "ec05745e-bdab-4f4d-b342-930632a28986";
const HONMARU = "684e75e6-46ed-4df8-a6af-95dbdca78db0";
const REMOVE_PHOTOS = ["3c16205a-3828-498b-a47c-dc45ddd44009"];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "定番の蔵造りの町並みから少し離れて、お不動様の成田山川越別院と、江戸城の建物を移した喜多院へ。門前で昼食をとり、川越城の鎮守・三芳野神社、本丸御殿、博物館と美術館、城の堀跡をたどる、川越の城と信仰の歴史を歩いてめぐる日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  cre("成田山川越別院", { h: 9, m: 30, stay: 25, legs: [], lat: 35.9193156, lng: 139.4888188, address: "埼玉県川越市",
    memo: "この旅は歩いてめぐります。川越駅からバスで約10分、喜多院のあたりへ。喜多院の北にある、成田山新勝寺の別院です。江戸時代の終わりの嘉永3年（1850年）に、千葉出身の石川照温が開いた真言密教の寺で、本尊の不動明王は、地元で「お不動様」と呼ばれて親しまれています。境内に骨董品が並ぶ蚤の市が開かれる日もあります。" + PRAY }),
  upd(KITAIN, { h: 10, m: 0, stay: 80, legs: [walk(5)], lat: 35.9178236, lng: 139.4889051, address: "埼玉県川越市小仙波町1-20-1",
    memo: "成田山から南へ歩いて約5分。寛永15年（1638年）の大火で、寺のほとんどが焼けてしまいました。そのとき3代将軍・家光が、江戸城の紅葉山にあった建物を移して建て直させ、客殿や庫裏、翌年には書院が再び建てられました。無量寿殿とも呼ばれる客殿の奥の仏間には、本尊の阿弥陀如来がまつられ、国の重要文化財です。拝観の時間は公式の案内で確かめましょう。" + PRAY }),
  upd(NAKAMISE, { h: 11, m: 30, stay: 50, legs: [walk(10)], lat: 35.9178508, lng: 139.4928226, address: "埼玉県川越市小仙波町",
    memo: "喜多院から東へ歩いて約10分、門前の通りへ。喜多院の門前に続く通りで、このあたりで昼食にしましょう。今も人が暮らし、商いをしている町なので、静かに歩きましょう。" }, "喜多院門前通り（昼食）"),
  cre("三芳野神社", { h: 12, m: 35, stay: 25, legs: [walk(15)], lat: 35.9242257, lng: 139.4924551, address: "埼玉県川越市郭町2-25-11",
    memo: "門前通りから北へ歩いて約15分、川越城の本丸のあたりへ。平安時代のはじめの大同年間に始まったと伝わる神社で、室町時代に太田道真・道灌の父子が城を築いたとき、天神さまを合わせてまつり、城の鎮守として本丸の中に置かれました。江戸時代のはじめに、3代将軍・家光が酒井忠勝に命じて建て直させ、その後も幕府が直接まもる神社として格式を保ちました。わらべうた「とおりゃんせ」の発祥の地ともいわれます。" + PRAY }),
  upd(HONMARU, { h: 13, m: 5, stay: 60, legs: [walk(5)], lat: 35.9245029, lng: 139.4914968, address: "埼玉県川越市郭町2-13-1",
    memo: "三芳野神社から歩いて約5分。江戸の北の守りとされた川越城の本丸御殿で、もとは16棟、建坪1,025坪もの広さがありましたが、明治維新のあとに取り壊され、今は玄関と大広間の部分が残っています。家老が詰めた部屋の建物は、明治5年（1872年）に城の外へ払い下げられたのち、昭和63年度に今の場所へ移して建て直されました。藩の政治を支えた家老の部屋が残るのは、全国でも珍しいとされます。休館日は公式の案内で確かめましょう。" }),
  cre("川越市立博物館", { h: 14, m: 10, stay: 60, legs: [walk(5)], lat: 35.9258523, lng: 139.491508, address: "埼玉県川越市郭町2-30-1",
    memo: "本丸御殿から北へ歩いて約5分。川越の歴史の資料を順を追って紹介する博物館で、城下町の資料に加え、蔵造りの町並みを再現した大きな模型や、蔵造りの建物ができるまでの工程の展示があります。休館日は公式の案内で確かめましょう。" }),
  cre("川越市立美術館", { h: 15, m: 13, stay: 60, legs: [walk(3)], lat: 35.9257128, lng: 139.490825, address: "埼玉県川越市郭町2-30-1",
    memo: "博物館のとなり。川越にゆかりのある作家を中心に、日本の近現代の美術を集めて展示する美術館です。画家・相原求一朗の作品を紹介する記念室や、作品にふれて楽しめるタッチアートコーナーもあります。休館日は公式の案内で確かめましょう。" }),
  cre("川越城中ノ門堀跡", { h: 16, m: 23, stay: 17, legs: [walk(10)], lat: 35.9246981, lng: 139.4881569, address: "埼玉県川越市郭町",
    memo: "美術館から西へ歩いて約10分。川越城の堀の跡として、今まで残る唯一のものとされます。寛永16年（1639年）に藩主となった松平信綱が城を大きく改めたときに造られたと考えられ、西の大手門から本丸へ敵が攻め入るのを防ぐ役目がありました。今は堀のほか、土塀や門も整えられています。帰りは、本川越駅まで歩いて約20分です。" }),
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
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== [KITAIN, NAKAMISE, HONMARU].join()) throw new Error("構成が想定と違います");
  const ph = it.days[0].spots[1].photos;
  if (ph.map((p) => p.id).join() !== REMOVE_PHOTOS.join() || ph.some((p) => p.url === it.thumbnailUrl)) throw new Error("外す写真が想定と違います");
  show("1日目", DAY1);
  console.log(`\n説明文: ${DESCRIPTION}\n写真 ${REMOVE_PHOTOS.join()} を外す（表紙ではない）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.photo.deleteMany({ where: { id: { in: REMOVE_PHOTOS } } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
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
