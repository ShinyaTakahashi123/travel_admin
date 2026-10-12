/**
 * #230 ef328d28「幕張メッセと海浜幕張、イベントと海辺の景色を楽しむ日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 3か所 09:30〜13:40 で、昼食の一言・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。
 *   「人工海浜としては日本一の長さ」は出典が確かめられず、ショッピングモールが行き先になっていた（昼食の場所としてだけ残す）
 * 電車・バスと歩きの旅（JR京葉線 海浜幕張駅から）:
 *   幕張海浜公園 9:30 → 見浜園 → 幕張メッセ → イオンモール幕張新都心（昼食）→ 稲毛記念館 → 千葉市ゆかりの家・いなげ → 千葉市民ギャラリー・いなげ（旧神谷傳兵衛稲毛別荘）16:30 → 京成稲毛駅
 *   #b2615800（稲毛海浜公園・検見川の浜・幕張・千葉みなと）とは、幕張海浜公園・イオンモール・幕張メッセが重なるので、文は別に書いた
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典: 千葉県公式観光サイト ちば観光ナビ https://maruchiba.jp/spot/detail_<番号>.html —
 *   10609 見浜園（幕張海浜公園内の日本庭園・池泉回遊式・山、川、海、林を表現・鯉・季節の景観・茶室「松籟亭」・9:00〜17:00・月曜休）／
 *   10112 幕張メッセ（1989年開業の日本初の複合コンベンション施設・国際展示場、国際会議場、幕張イベントホールの3施設）／
 *   10571 稲毛記念館（稲毛エリアの自然と歴史の資料・3階の展望室から視界300度の東京湾・回遊式の日本庭園・茶室「海星庵」・9:00〜17:00）／
 *   10120 千葉市ゆかりの家・いなげ（明治中期から保養地として文人墨客が訪れた稲毛の別荘・愛新覚羅溥傑と浩の新婚生活の家・主屋と離れ・結霜ガラスや木瓜窓・9:00〜16:30）／
 *   10607・10119 千葉市民ギャラリー・いなげ、旧神谷傳兵衛稲毛別荘（「日本のワイン王」といわれた神谷傳兵衛が1918年に建てた洋館・初期の鉄筋コンクリート造・ぶどうの天井飾り・国の登録有形文化財・黒松の庭園・9:00〜17:15）
 *   幕張海浜公園は見浜園の出典の「幕張海浜公園内」とあわせて、公園の事実は書かない（海辺の公園であることと、見浜園への道だけ）
 * 座標: OSM — 幕張海浜公園 way 208037154（Cブロック）・見浜園 way 1222912385・幕張メッセ relation 16117426・イオンモール幕張新都心 way 695894961（いずれも Nominatim の中心）／
 *   稲毛記念館 node 1566648053（API で名前つきを確かめた）／国土地理院の住所検索の号の点 — ゆかりの家（稲毛区稲毛一丁目16番12号）・市民ギャラリー（稲毛区稲毛一丁目8番35号）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-230-ef328d28.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ef328d28-b822-4bfd-851d-1478a88bf499";
const DAY_ID = "96999f78-6d57-4e0c-a5b6-4755b8ef9607";
const PARK = "68076a4e-e83b-4015-aba3-b1e8f815843f";
const AEON = "6e50e20b-0ae2-4896-a98c-cde635fdfa3b";
const MESSE = "46cf740c-22fa-4b9e-bfd4-355839bf5b03";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });

const DESCRIPTION =
  "海浜幕張の海辺の公園と日本庭園の見浜園を歩き、幕張メッセを眺めてから昼食に。午後は稲毛へ移り、東京湾を見渡す稲毛記念館や、保養地だったころの面影を伝える「ゆかりの家」と、ワイン王・神谷傳兵衛の洋館をめぐる、電車とバスと歩きの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(PARK, { h: 9, m: 30, stay: 30, legs: [], lat: 35.6436473, lng: 140.040187, address: "千葉県千葉市美浜区ひび野2丁目",
    memo: "この旅は電車とバスと歩きでめぐります。JR京葉線の海浜幕張駅から歩いて約10分。幕張の海辺に広がる県立の公園で、広い芝生や木立の中を、潮風を感じながら歩けます。公園の中には、次に訪ねる日本庭園の見浜園もあります。自転車も通る道では、まわりに気をつけて歩きましょう。" }),
  cre("見浜園", { h: 10, m: 5, stay: 45, legs: [walk(5)], lat: 35.6430808, lng: 140.0394009, address: "千葉県千葉市美浜区ひび野2-116",
    memo: "公園の中を歩いて約5分。池を中心に、山や川、海、林を表した池泉回遊式の日本庭園で、池には鯉が泳ぎ、松の植え込みや水の流れを眺めながら一周できます。池の北側には、数寄屋造りの茶室「松籟亭」もあります。休園日は公式の案内で確かめましょう。池のまわりでは足元に気をつけましょう。" }),
  upd(MESSE, { h: 11, m: 5, stay: 25, legs: [walk(15)], lat: 35.6473019, lng: 140.0346524, address: "千葉県千葉市美浜区中瀬2-1",
    memo: "見浜園から歩いて約15分。1989年に開かれた、日本で初めての複合コンベンション施設とされ、国際展示場、国際会議場、幕張イベントホールの3つの施設からなります。展示会やコンサートが開かれていない日も、大きな建物を外から眺めながら歩けます。催しの日は人が多いので、まわりに気をつけましょう。" }),
  upd(AEON, { h: 11, m: 45, stay: 60, legs: [walk(15)], lat: 35.6546826, lng: 140.0304548, address: "千葉県千葉市美浜区豊砂1-1",
    memo: "幕張メッセから歩いて約15分。大きな商業施設の中に飲食店が集まっているので、ここで昼食にしましょう。" }),
  cre("稲毛記念館", { h: 13, m: 20, stay: 45, legs: [walk(15), { mode: "train", min: 5, line: "JR京葉線" }, { mode: "bus", min: 10 }, walk(5)], lat: 35.6198607, lng: 140.0607929, address: "千葉県千葉市美浜区高浜7-2-3",
    memo: "海浜幕張駅へ歩き、JR京葉線で稲毛海岸駅へ行き、路線バスに乗り換えて高浜南団地で降り、歩いて約5分（あわせて約35分）。稲毛の自然や歴史の資料を展示する記念館で、3階の総ガラス張りの展望室からは、視界300度に広がる東京湾を見渡せます。となりには回遊式の日本庭園もあります。休館日は公式の案内で確かめましょう。" }),
  cre("千葉市ゆかりの家・いなげ", { h: 14, m: 30, stay: 45, legs: [{ mode: "bus", min: 15 }, walk(10)], lat: 35.636356, lng: 140.08139, address: "千葉県千葉市稲毛区稲毛1-16-12",
    memo: "記念館の近くから路線バスで稲毛へ向かい、歩いて約10分（あわせて約25分）。明治の中ごろから保養地として多くの文人が訪れた稲毛に建てられた別荘のひとつで、清朝最後の皇帝の弟・愛新覚羅溥傑が、妻の浩と新婚の暮らしを送った家として知られています。木造平屋の主屋と離れには、障子の結霜ガラスや木瓜窓など、細やかな意匠が見られます。休館日は公式の案内で確かめましょう。" }),
  cre("千葉市民ギャラリー・いなげ（旧神谷傳兵衛稲毛別荘）", { h: 15, m: 20, stay: 70, legs: [walk(5)], lat: 35.634087, lng: 140.082932, address: "千葉県千葉市稲毛区稲毛1-8-35",
    memo: "ゆかりの家から歩いて約5分。黒松に囲まれた庭に、市民の美術や文化の展示を行うギャラリーと、「日本のワイン王」といわれた実業家・神谷傳兵衛が1918年に建てた洋館が並びます。地下1階・地上2階の洋館は、全国でも珍しい初期の鉄筋コンクリート造りで、ぶどうをかたどった天井の飾りなど、ワインを愛した主らしい意匠が見どころです。国の登録有形文化財に指定されています。休館日は公式の案内で確かめましょう。帰りは、歩いて約5分の京成稲毛駅へ向かいましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [PARK, AEON, MESSE].join()) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
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
