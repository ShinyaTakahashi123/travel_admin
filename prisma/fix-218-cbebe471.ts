/**
 * #218 cbebe471「世界遺産・姫路城と好古園、白鷺城を巡る定番日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜12:40 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」「お楽しみいただけたことでしょう」）。
 *   「法隆寺とともに日本で最初に」など、確かめられない書き方もあった
 * 歩きの旅（JR姫路駅から）:
 *   姫路城 9:00 → 兵庫県立歴史博物館 → 男山千姫天満宮 → 好古園（昼食）→ 長壁神社 → 姫路船場別院本徳寺 → 播磨国総社 16:30 → 姫路駅
 *   #10（姫路 1泊2日: 美術館・動物園・文学館・書写山・水族館）と重ならないよう、城のまわりの寺社と歴史博物館をめぐる形にした
 * 移動は spot_transit_leg（transitLegs）に書く（2026-10-10 から。docs/handoff/spot-transit-leg-writing-guide.md）
 * 本文の出典: 【公式】姫路観光ナビ ひめのみち https://www.himeji-kanko.jp/spot/<番号>/ —
 *   姫路城 3（1333年に赤松則村が砦・秀吉・池田輝政・本多忠政が拡張・1617年に全容・白鷺城・1993年に日本で初めての世界文化遺産・平成27年に大天守保存修理・石垣の刻印 約50種類90個・9:00〜17:00 閉門16:00）／
 *   兵庫県立歴史博物館 56（1983年開館・丹下健三の基本設計・ガラス面に映る姫路城・1階の無料の展示・2階の城郭や祭り・10:00〜17:00・月曜休）／
 *   男山千姫天満宮 120（城の北西・千姫が本多家の繁栄を願って信仰した天神を祀ったといわれる）／
 *   好古園 4（平成4年開園・池泉回遊式・西御屋敷跡などの地割・9つの庭・時代劇のロケ地・茶室 双樹庵・庭を眺めて食事のできる店・9:00〜17:00）／
 *   長壁神社 121（刑部大神は刑部親王と富姫・姫山の地主神・歴代城主が祭祀・ゆかたまつり）／
 *   姫路船場別院本徳寺 124（1492年に英賀の浦の道場・1618年に現在地・真宗大谷派・1718年の本堂・明治天皇の行在所・9:00〜16:00）／
 *   播磨国総社 61（延暦6年 兵主神・のち射楯神を併祀・播磨国内の174座を合祀したと伝わる・榊原忠次寄進の石造大鳥居は県指定）
 * 座標: OSM — 姫路城 way 23707900（Nominatim の中心）／兵庫県立歴史博物館 node 1423054276／千姫天満宮 node 2500249136／好古園 way 236942009（同）／
 *   長壁神社 way 238042932（同。国土地理院の立町33番地とほぼ同じ）／船場本徳寺 way 680260017（同）／播磨国総社 射楯兵主神社 node 1665514788（node は API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-218-cbebe471.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "cbebe471-d545-4769-88c0-7036123b55de";
const DAY_ID = "aef2402f-09cd-4246-a330-abe6f608efee";
const SHIRO = "a7210e9d-9e10-43a2-8250-531ddf9ecdbe";
const KOKO = "6e5b4a2d-6a4e-448a-ba51-5a81524e33e0";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "「白鷺城」と呼ばれる世界遺産・姫路城から、城を映す兵庫県立歴史博物館、千姫ゆかりの男山千姫天満宮、城を借景にした好古園へ。好古園で昼食をとったら、城下の長壁神社や本徳寺、播磨国総社をめぐる、姫路を歩いて楽しむ日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(SHIRO, { h: 9, m: 0, stay: 120, legs: [], lat: 34.8393313, lng: 134.69402, address: "兵庫県姫路市本町68",
    memo: "この旅は歩いてめぐります。JR姫路駅から大手前通りを歩いて約20分。1333年に赤松則村が姫山に砦を築いたのが始まりとされ、のちに羽柴秀吉、池田輝政、本多忠政らが手を加えて、1617年に今の全体の姿が整いました。白く輝く姿が白鷺にたとえられ「白鷺城」とも呼ばれ、1993年には日本で初めての世界文化遺産のひとつに登録されています。石垣には、文様や文字を刻んだ刻印が約50種類隠れているので、探しながら歩くのもおすすめです。天守の階段は急なので、足元に気をつけましょう。" }),
  cre("兵庫県立歴史博物館", { h: 11, m: 10, stay: 50, legs: [{ mode: "walk", min: 10 }], lat: 34.841115, lng: 134.696872, address: "兵庫県姫路市本町68",
    memo: "城の北東へ歩いて約10分。1983年に開館した博物館で、建物は建築家・丹下健三の基本設計によるものです。ガラスの壁に姫路城が映る眺めも見どころです。兵庫の歴史のほか、城郭や祭り、子どもの文化についての展示があり、1階には昔の暮らしや遊びにふれられる展示もあります。休館日は公式の案内で確かめましょう。" }),
  cre("男山千姫天満宮", { h: 12, m: 20, stay: 20, legs: [{ mode: "walk", min: 20 }], lat: 34.841538, lng: 134.6889915, address: "兵庫県姫路市山野井町1-3",
    memo: "博物館から城の北側を回って、歩いて約20分。本多忠刻と結婚した千姫が、本多家の繁栄を願って信仰した天神を祀ったといわれる小さな社です。" + PRAY }),
  upd(KOKO, { h: 12, m: 50, stay: 80, legs: [{ mode: "walk", min: 10 }], lat: 34.837969, lng: 134.6896132, address: "兵庫県姫路市本町68",
    memo: "千姫天満宮から歩いて約10分。姫路城を借景にした池泉回遊式の日本庭園で、平成4年に開かれました。発掘調査で確かめられた西御屋敷や武家屋敷の跡などの地割を生かし、門や塀をくぐるたびに趣の違う9つの庭が現れます。茶の庭には数寄屋造の茶室もあります。庭を眺めながら食事のできる店があるので、ここで昼食にしましょう。池のまわりでは足元に気をつけましょう。" }),
  cre("長壁神社", { h: 14, m: 25, stay: 20, legs: [{ mode: "walk", min: 15 }], lat: 34.8314644, lng: 134.6899514, address: "兵庫県姫路市立町33",
    memo: "好古園から城の南の町なかへ歩いて約15分。古くから姫山の地主神として、歴代の城主に大切にされてきた刑部大神を祀る神社です。初夏の神事は、今では姫路の代表的な祭りのひとつ「ゆかたまつり」として親しまれています。" + PRAY }),
  cre("姫路船場別院本徳寺", { h: 14, m: 55, stay: 35, legs: [{ mode: "walk", min: 10 }], lat: 34.8337659, lng: 134.682892, address: "兵庫県姫路市地内町1-1",
    memo: "長壁神社から歩いて約10分。1492年に蓮如上人の命で、播磨の英賀の浦に建てられた道場が始まりとされ、1618年、城主・本多忠政の時代に今の地に開かれた真宗大谷派の寺です。広い境内には、1718年に落慶した本堂や、明治天皇が姫路を訪れたときに泊まった行在所の建物が残ります。拝観の時間は公式の案内で確かめましょう。" + PRAY }),
  cre("播磨国総社 射楯兵主神社", { h: 15, m: 50, stay: 40, legs: [{ mode: "walk", min: 20 }], lat: 34.8340079, lng: 134.6969366, address: "兵庫県姫路市総社本町190",
    memo: "本徳寺から大手前通りを越えて、歩いて約20分。社伝では、延暦6年に兵主神を祀り、のちに射楯神をあわせて祀ったといわれる神社で、播磨国内の多くの神々をまとめて祀ったと伝えられ、「播磨国総社」と呼ばれています。藩主が寄進した石造りの大鳥居は、県の文化財です。" + PRAY + "帰りは、歩いて約15分のJR姫路駅へ向かいましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [SHIRO, KOKO].join()) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = ((d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? []);
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    const nm = "id" in x ? it.days[0].spots.find((s) => s.id === x.id)!.name + "(既存)" : d.name;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${nm} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
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
