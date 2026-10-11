/**
 * #154 26d252e6「比叡山延暦寺と三井寺、世界遺産の古刹を巡る大津日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜12:50 で、昼食と帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。もとの三井寺の本文は 1755b106 の三井寺の文とほぼ同じなので書き直す
 * 電車とケーブルカーと歩きの旅（京阪石山坂本線の三井寺駅から。帰りは坂本比叡山口駅から）:
 *   三井寺 9:30 → 西教寺 → 坂本（昼食）→ 比叡山延暦寺（東塔）→ 西塔 → 旧竹林院 16:47 → 坂本比叡山口駅
 * 三井寺は受付が16時までなので朝に回す。山の上の昼食は店の点しかないので、坂本の門前町で昼食にする
 * タイトル・季節はそのまま、説明文は書き直す
 * 大津のほかのしおり（1755b106・bbc2264b）の本文を読み、使っていない話で書いた（三井寺は御井と三天皇の産湯・創建の年・円珍・不死鳥・金堂・札所・晩鐘・弁慶の鐘を使わず、一切経蔵の八角輪蔵と
 *   三重塔と観音堂の再建。延暦寺は最澄の開創の年・母山・不滅の法灯・坂本ケーブルの長さを使わず、根本中堂の今の建物と大改修・大講堂・文殊楼・大黒堂）。西教寺・西塔・旧竹林院はほかのしおりにない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   三井寺 shiga-miidera.or.jp/treasure/building/08.htm（一切経蔵: 室町時代・重要文化財・回転式の八角輪蔵・もとは国清寺の経蔵で慶長7年に毛利輝元が移築）・/13.htm（三重塔: 室町時代・重要文化財・
 *   大和の比蘇寺の塔を秀吉が伏見城に移し、慶長5年に家康が三井寺に寄進）・/16.htm（観音堂: 西国三十三所の第十四番・本尊如意輪観音・貞享3年の火災のあと元禄2年に再建）・guide/（9時〜16時30分、16時受付終了）／
 *   西教寺 biwako-visitors.jp/spot/detail/88/（天台真盛宗の総本山・聖徳太子の創建と伝わる・真盛が再興・延暦寺焼き討ちのあと明智光秀が復興に尽力・光秀一族の墓・本堂は重要文化財・
 *   安土桃山から江戸の庭園・9:00〜16:30）と otsu.or.jp の西教寺のページ（京阪坂本駅から徒歩20分）／
 *   延暦寺 hieizan.or.jp/grounds/toudou.html（東塔: 延暦寺発祥の地・根本中堂は総本堂で本尊は薬師如来、国宝、今の建物は1642年・大講堂に各宗派の宗祖の木像、重文・文殊楼は山門、重文・大黒堂は大黒天信仰の発祥地・9:00〜16:00）／
 *   hieizan.or.jp/renovation/overview.html（根本中堂の大改修: 工事の期間中も参拝ができるように進める）／hieizan.or.jp/keidai/saitou（西塔: 東塔から西へ約1km・円澄が開いた・釈迦堂は延暦寺に現存する最古の建物、
 *   もとは園城寺の金堂で秀吉が1595年に移築・にない堂は常行堂と法華堂を廊下でつなぎ、弁慶が担ったとの言い伝え・浄土院は伝教大師の御廟・東塔からシャトルバスで5分）／hieizan.or.jp/tickets/（巡拝時間）／
 *   旧竹林院 biwako-visitors.jp/spot/detail/1284/（延暦寺の里坊のひとつで格式の高い寺院・庭園は国の名勝、大宮川の清流を取り入れた曲水、八王子山を借景・五重の石塔・大正年間の茶室2棟と四阿は市の文化財・
 *   9時〜17時、受付16時半まで・月曜休館）
 * 座標: OSM — 三井寺 node 4619790890（三井寺（園城寺）、place_of_worship）・西教寺 node 4796184322（place_of_worship）・坂本比叡山口駅 node 6408028891（station）・
 *   根本中堂 way 405835515・西塔 way 405858914（place_of_worship）・竹林院 way 428824206（place_of_worship、国土地理院の坂本五丁目2番13号の点と約35m）（way は Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-154-26d252e6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "26d252e6-106f-49b2-9b2f-90d29fa04455";
const DAY1_ID = "05a4ea84-30f6-4d9d-9065-3328bb41d630";
const ENRYAKU = "cc255b22-fac8-41e5-a6cf-a958e4ce1ee6";
const MIIDERA = "c4d9352e-4d44-47f6-8989-7cf99e05048b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "三井寺の八角の経蔵と三重塔から、明智光秀ゆかりの西教寺へ。門前町・坂本で昼食をとり、坂本ケーブルで比叡山へ上って、延暦寺の東塔と西塔をめぐります。最後は里坊の庭園・旧竹林院で締めくくる、電車とケーブルカーでたどる大津の日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(MIIDERA, { h: 9, m: 30, stay: 70, legs: [], lat: 35.0133901, lng: 135.8528467, address: "滋賀県大津市園城寺町246",
    memo: "この旅は電車とケーブルカーと歩きでめぐります。京阪石山坂本線の三井寺駅から歩いて約10分。室町時代の一切経蔵の中には、経典を納めた八角形の大きな輪蔵があり、回して動かせるつくりです。この経蔵は、毛利輝元が慶長7年（1602年）にほかの寺から移したものです。三重塔も、大和の寺の塔を豊臣秀吉が伏見城へ移し、のちに徳川家康がこの寺に寄せたと伝わります。高台の観音堂は、火災のあと元禄2年（1689年）に建て直されました。拝観の受付時間は公式の案内で確かめましょう。" + PRAY }, "三井寺"),
  cre("西教寺", { h: 11, m: 25, stay: 45, legs: [walk(10), train(15, "京阪石山坂本線（三井寺→坂本比叡山口）"), walk(20)], lat: 35.0811304, lng: 135.8663773, address: "滋賀県大津市坂本5-13-1",
    memo: "三井寺駅から京阪電車で坂本比叡山口駅へ行き、北へ歩いて約20分（あわせて約45分）。天台真盛宗の総本山で、聖徳太子が開いたと伝わり、室町時代に真盛が建て直しました。比叡山の焼き討ちのあと、坂本城主の明智光秀が寺の復興に力を尽くしたとされ、境内には光秀の一族の墓があります。重要文化財の本堂のほか、安土桃山時代から江戸時代にかけてつくられた庭も見られます。お墓の前では、手を合わせて静かにお参りしましょう。" + PRAY }),
  cre("坂本（昼食）", { h: 12, m: 30, stay: 45, legs: [walk(20)], lat: 35.0704684, lng: 135.8713346, address: "滋賀県大津市坂本",
    memo: "西教寺から歩いて約20分、坂本比叡山口駅のあたりへ。延暦寺の門前町として栄えた坂本の町で、昼食にしましょう。今も人が暮らしている町なので、静かに歩きましょう。" }),
  upd(ENRYAKU, { h: 13, m: 45, stay: 60, legs: [walk(11), train(11, "坂本ケーブル（ケーブル坂本→ケーブル延暦寺）"), walk(8)], lat: 35.0703449, lng: 135.8409361, address: "滋賀県大津市坂本本町4220",
    memo: "坂本ケーブルの乗り場まで歩いて約10分、ケーブルカーで比叡山の上へ上がり、歩いて約8分（あわせて約30分）。ケーブルカーに乗るときは係の人の案内に従いましょう。東塔は延暦寺が始まった地で、総本堂の根本中堂は、本尊の薬師如来をまつる国宝の建物です。今の建物は寛永19年（1642年）に完成したもので、大がかりな改修工事が続いていますが、工事の間も参拝できるようになっています。各宗派を開いた僧の木像をまつる大講堂や、延暦寺の山門にあたる文殊楼も重要文化財です。大黒天を信仰するならわしが始まった地とされる大黒堂もあります。巡拝の時間は公式の案内で確かめましょう。" + PRAY }, "比叡山延暦寺（東塔）"),
  cre("比叡山延暦寺（西塔）", { h: 14, m: 55, stay: 40, legs: [bus(5, "比叡山内シャトルバス（延暦寺バスセンター→西塔）"), walk(5)], lat: 35.0732805, lng: 135.8345073, address: "滋賀県大津市坂本本町4220",
    memo: "東塔からシャトルバスで約5分、西へ約1kmのところにあります。本堂の釈迦堂は、延暦寺に今ある建物のなかでいちばん古いとされ、もとは三井寺の金堂だったものを、文禄4年（1595年）に豊臣秀吉が移したものです。朝に訪ねた三井寺とのつながりも感じられます。常行堂と法華堂を廊下でつないだ「にない堂」には、弁慶が廊下を肩にかついだという言い伝えがあります。東塔との境には、伝教大師の御廟がある浄土院もあります。" + PRAY }),
  cre("旧竹林院", { h: 16, m: 12, stay: 35, legs: [walk(5), bus(5, "比叡山内シャトルバス（西塔→延暦寺バスセンター）"), walk(8), train(11, "坂本ケーブル（ケーブル延暦寺→ケーブル坂本）"), walk(8)], lat: 35.0715544, lng: 135.8658993, address: "滋賀県大津市坂本5-2-13",
    memo: "シャトルバスで東塔へ戻り、坂本ケーブルで坂本へ下りて、歩いて約8分（あわせて約35分）。延暦寺の高僧が隠居して暮らした里坊の一つで、延暦寺のなかでも格式の高い寺でした。国の名勝の庭は、大宮川の清らかな水を引き入れた流れを中心に、背後の八王子山を景色に取り込んでいます。大正時代に建てられた2棟の茶室と四阿は、大津市の文化財です。受付の時間と休館日は公式の案内で確かめましょう。帰りは、坂本比叡山口駅まで歩いて約10分です。" }),
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
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== [ENRYAKU, MIIDERA].join()) throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
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
