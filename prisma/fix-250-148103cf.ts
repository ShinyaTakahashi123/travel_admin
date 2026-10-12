/**
 * #250 148103cf「金剛福寺、四国八十八ヶ所霊場・第三十八番札所を訪ねるプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜10:30 で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」）。
 * タイトルを内容に合わせて「金剛福寺から延光寺へ、第三十八番・第三十九番札所と足摺・宿毛をめぐる日帰りプラン」に変える
 * 土佐清水市・宿毛市のほかのしおり（9fa55366・47214a80: 足摺岬・唐人駄場・ジョン万次郎資料館・竜串・大堂海岸など、14e1c69b（承認待ち）: 金剛福寺の勅額・延光寺の行基と赤亀の縁起）の
 *   本文を読み、使っていない話で書いた（金剛福寺: 山号と院号・札所のあいだで最も長い道のり・広い境内、延光寺: 目洗い井戸と赤亀の石像）。臼碆・道の駅めじかの里・宿毛歴史館はほかのしおりにない。
 *   松尾のアコウは OSM に点がなく、国土地理院も大字の点だけなので入れなかった
 * 車の旅（土佐くろしお鉄道の中村駅の近くでレンタカーを借りて返す）:
 *   金剛福寺 9:30 → 臼碆・竜宮神社 → 道の駅めじかの里土佐清水（昼食）→ 延光寺 → 宿毛歴史館 16:30 → 中村駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   四国八十八ヶ所霊場会 https://88shikokuhenro.jp/sadazan-fudarakuin-kongohukuji/ 第38番 蹉跎山 補陀洛院 金剛福寺（四国最南端の足摺岬・37番から歩いて約30時間で札所のあいだで最も長い・
 *     太平洋を望む約12万平方メートルの境内・土佐の石を配した大きな池）／https://88shikokuhenro.jp/shakkizan-jisanin-enkoji/ 第39番 赤亀山 寺山院 延光寺（本堂の右の「目洗い井戸」は延暦年間に
 *     弘法大師が杖で突いて湧いたと伝わる・竜宮から赤い亀が鐘を背負って現れた伝説・赤亀の石像・その鐘は国の重要文化財）
 *   土佐清水市 https://www.city.tosashimizu.kochi.jp/kanko/g01_usubae.html 臼碆（岩の形が臼に似る・花崗岩の大絶壁・黒潮が最初に接岸する場所とされる・磯釣りの名所）と、
 *     こうち旅ネット https://kochi-tabi.jp/search_spot.html?id=7536（竜宮神社は臼碆の断崖の上・航海安全と豊漁の神社）／
 *     https://www.city.tosashimizu.kochi.jp/kanko/g04_mejikanosato.html 道の駅めじかの里土佐清水（令和5年4月にリニューアルした四国の最南端にある道の駅）と検索結果（レストランとカフェ）
 *   宿毛市 https://www.city.sukumo.kochi.jp/docs-26/p01080401.html 宿毛歴史館（江戸時代の城下町の模型・映像・宿毛ゆかりの21人の人物）と検索結果（8:30〜17:00・月曜休館）
 * 座標: OSM — 第38番札所 金剛福寺 way 1024256178・道の駅 めじかの里土佐清水 way 441711916（Nominatim の中心）／竜宮神社 node 4984012723・第39番札所 延光寺 node 4434097289・
 *   宿毛市立宿毛歴史館 node 1423734251（node は API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-250-148103cf.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "148103cf-f5e2-4d02-a45d-616245c31138";
const DAY_ID = "3cd2e210-ae26-4ccb-b900-26c974842183";
const KONGO = "55d8a0a8-0df5-4d30-bc08-f7ab25b8b9d0";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const TITLE = "金剛福寺から延光寺へ、第三十八番・第三十九番札所と足摺・宿毛をめぐる日帰りプラン";
const DESCRIPTION =
  "四国八十八ヶ所霊場の第三十八番札所・金剛福寺から、黒潮が最初に寄せるとされる臼碆の岬へ。昼食のあとは、お遍路の道をたどるように宿毛へ向かい、第三十九番札所・延光寺と、城下町の歴史を伝える宿毛歴史館を訪ねる、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(KONGO, { h: 9, m: 30, stay: 70, legs: [], lat: 32.7257405, lng: 133.0184468, address: "高知県土佐清水市足摺岬214-1",
    memo: "この旅は車でめぐります。土佐くろしお鉄道の中村駅の近くでレンタカーを借りて、車で約70分。四国の最南端、足摺岬に建つ第三十八番札所で、正式には「蹉跎山 補陀洛院 金剛福寺」といいます。ひとつ前の第三十七番札所から歩いて約30時間かかり、札所のあいだで最も長い道のりとされます。太平洋を望む約12万平方メートルの広い境内には、土佐の石を配した大きな池があります。" + PRAY }),
  cre("臼碆・竜宮神社", { h: 10, m: 55, stay: 40, legs: [car(15)], lat: 32.7302855, lng: 132.9664495, address: "高知県土佐清水市松尾",
    memo: "金剛福寺から海沿いを西へ、車で約15分。黒潮が日本列島に最初に寄せる場所とされる岬で、花崗岩の大きな断崖の下に、臼の形に似た岩が海に浮かんでいます。崖の上には、海の安全と豊漁を祈る竜宮神社がまつられています。断崖や岩場の先には近づかず、足元に気をつけましょう。" + PRAY }),
  cre("道の駅めじかの里土佐清水", { h: 12, m: 0, stay: 55, legs: [car(25)], lat: 32.7934566, lng: 132.8832269, address: "高知県土佐清水市三崎671-1",
    memo: "臼碆から車で約25分。四国の最南端にある道の駅とされ、令和5年に新しくなりました。名前の「めじか」は、この地で水揚げされる宗田鰹のことです。レストランやカフェがあるので、ここで昼食にしましょう。" }),
  cre("延光寺", { h: 14, m: 5, stay: 70, legs: [car(70)], lat: 32.9613141, lng: 132.7740727, address: "高知県宿毛市平田町中山",
    memo: "道の駅から北西へ、お遍路の道をたどるように車で約70分の宿毛へ。第三十九番札所で、山号は「赤亀山」です。本堂の右手には、弘法大師が杖で地面を突くと湧き出たと伝わる「目洗い井戸」があります。竜宮から赤い亀が鐘を背負って現れたという伝説にちなむ赤亀の石像も見られ、その鐘は国の重要文化財に指定されています。" + PRAY }),
  cre("宿毛歴史館", { h: 15, m: 30, stay: 60, legs: [car(15)], lat: 32.938777, lng: 132.730371, address: "高知県宿毛市中央2-7-14",
    memo: "延光寺から車で約15分、宿毛の町なかへ。宿毛の町の歴史と、宿毛ゆかりの人物を紹介する歴史館で、江戸時代の城下町を細かく再現した模型や映像、21人の人物の紹介などが並びます。休館日は公式の案内で確かめましょう。帰りは、車で約40分の中村駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== KONGO) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? "金剛福寺(既存)" : d.name} ${String(d.memo).length}字`);
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
