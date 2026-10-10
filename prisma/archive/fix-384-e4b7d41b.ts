/**
 * チェックリスト #384 e4b7d41b「湯畑と西の河原公園、草津温泉街を歩く定番日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 湯畑 → 熱乃湯 → 光泉寺 → 地蔵源泉 → 大滝乃湯（昼食）→ 白根神社 → 西の河原公園 → 温泉図書館（8か所 09:00〜16:30、徒歩）
 * 既存の3か所はIDのまま直す。説明文の更新と並べ替えを1つのトランザクションで行う
 * 座標の出典: OSM/Overpass（名勝「湯畑」の案内板 36.62266,138.59655／光泉寺 36.62181,138.59529／地蔵源泉 36.62259,138.59821／大滝乃湯 36.62296,138.60166／温泉図書館 36.62070,138.59650）、
 *   Nominatim（熱乃湯 36.622706,138.596322／白根神社 36.624675,138.59626）、西の河原公園は確認済みの公開中しおりの値（36.624302,138.589495）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-384-e4b7d41b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e4b7d41b-b1a3-464f-ba14-431c01970e13";
const DAY1_ID = "988ba620-6357-4286-a7a7-036266f2e99e";
const YUBATAKE_ID = "1eb12528-7efd-4cac-92d2-ffb08392d105";
const KOSENJI_ID = "d54de6d9-6bbc-4d12-b727-58fe85a45e5f";
const SAINOKAWARA_ID = "25d2bbcf-18bc-40f7-a331-fedba0fd50ca";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "もうもうと湯けむりが上がる湯畑を中心に、湯もみと踊りのショー、源泉ゆかりのお寺や神社、温泉の町の歴史を伝える図書館まで、草津の温泉街を歩いてめぐる日帰りプランです。お昼は日帰り温泉の大滝乃湯で、湯は大滝乃湯と西の河原公園の露天風呂で楽しめます。";

const MEMO_YUBATAKE =
  "JR長野原草津口駅や万座・鹿沢口駅からバスで草津温泉バスターミナルへ、そこから歩いて約5分です。草津のシンボルといえる源泉で、毎分およそ4,000リットルもの熱い湯が湧き出し、あたりには湯けむりと硫黄の香りが立ちこめます。湯畑には7本の木の樋が架けられ、高温の源泉を空気にさらして冷ましながら、湯の花を採る仕組みになっています。今の姿に整えられたのは1975年のことで、芸術家・岡本太郎がデザインに関わったとされています。まずは湯けむりの中で、草津の空気を感じましょう。";

const MEMO_KOSENJI =
  "熱乃湯から歩いて約5分、湯畑を見下ろす高台に立つお寺です。養老5年（721年）、行基がこの地を訪れ、温泉で人々の病を癒やそうと薬師堂を建てたのが始まりと伝えられています。その後、この地を治めた湯本氏によって、温泉の守り神である白根明神の別当寺として再興されたといわれます。石段を上った境内からは、湯けむりを上げる湯畑を見渡せます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const MEMO_SAINOKAWARA =
  "白根神社から歩いて約15分、温泉街の西の端に広がる河原です。あちこちから温泉が湧き出して小川となり、流れ落ちる滝や池をつくっています。強い酸性の湯のために草木が育ちにくい独特の景色から、古くは「鬼の泉水」とも呼ばれて恐れられていたと伝えられます。奥には広い露天風呂があり、川のせせらぎを聞きながら湯につかることもできます。露天風呂では、ほかの入浴客をじろじろ見たり、カメラを向けたりせず、施設の決まりに従いましょう。河原の湯は熱いところもあるので、手を入れたりしないようにしましょう。";

type NewSpot = { name: string; h: number; m: number; stay: number; dur: number; lat: number; lng: number; address: string; memo: string };

const NEW = {
  netsunoyu: {
    name: "熱乃湯", h: 9, m: 45, stay: 30, dur: 5, lat: 36.622706, lng: 138.596322, address: "群馬県吾妻郡草津町草津",
    memo:
      "湯畑のすぐ前にある、湯もみと踊りのショーを見られる建物です。草津の源泉はとても熱く、そのままでは入れないため、長い板で湯をかき混ぜて冷ます「湯もみ」が昔から行われてきました。湯をもみながら皆で唄う「草津節」とともに、その様子を間近で見られます。ショーの時間や、湯もみを体験できる回は公式の案内で確かめてください。",
  },
  jizo: {
    name: "地蔵源泉（目洗い地蔵）", h: 10, m: 55, stay: 20, dur: 10, lat: 36.622592, lng: 138.598214, address: "群馬県吾妻郡草津町草津",
    memo:
      "光泉寺から歩いて約10分、湯畑の東の路地にある小さな源泉です。そばの地蔵堂にまつられる「目洗い地蔵」には、江戸時代、目の病に悩んでいた人が、夢に現れた地蔵菩薩に告げられてこの湯で目を洗ったところ治り、感謝して地蔵を建てたという話が伝わります。共同浴場の地蔵の湯や足湯もあるひっそりとした一角で、湯畑のにぎわいとは違う草津の顔にふれられます。お地蔵さまの前では、静かに、敬意をもって手を合わせましょう。",
  },
  otaki: {
    name: "大滝乃湯", h: 11, m: 25, stay: 100, dur: 10, lat: 36.622961, lng: 138.601663, address: "群馬県吾妻郡草津町草津",
    memo:
      "地蔵源泉から歩いて約10分の日帰り温泉です。温度の違う湯船を、ぬるい湯から順に入って体をならしていく「合わせ湯」ができるのが特徴で、昔ながらの草津の入り方を体験できます。館内には食事処もあるので、ひと風呂浴びたあと、ここで昼食にしましょう。浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。",
  },
  shirane: {
    name: "白根神社", h: 13, m: 20, stay: 30, dur: 15, lat: 36.624675, lng: 138.59626, address: "群馬県吾妻郡草津町草津",
    memo:
      "大滝乃湯から歩いて約15分、温泉街を見下ろす高台の神社です。西にそびえる草津白根山への信仰が始まりと考えられ、今も山の上に奥宮があります。祭神は、草津温泉を開いたという伝説の残る日本武尊で、明治6年（1873年）に今の場所へ移されました。広い境内には、たくさんの石楠花が植えられています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  library: {
    name: "草津町温泉図書館", h: 15, m: 55, stay: 35, dur: 20, lat: 36.6207, lng: 138.5965, address: "群馬県吾妻郡草津町草津",
    memo:
      "西の河原公園から歩いて約20分、草津温泉バスターミナルの建物の3階にある図書館です。町の図書館と温泉の資料館を合わせて2015年に生まれ、温泉にまつわる本や資料にふれることができます。明るく広い閲覧の場所で、今日めぐった湯の町の歴史をふり返りながら、帰りのバスを待つのにもちょうどよいところです。休館日があるので、公式の案内で確かめてから訪れましょう。",
  },
};

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: "walk", transitDurationMin: s.dur, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${YUBATAKE_ID},${KOSENJI_ID},${SAINOKAWARA_ID}`) throw new Error("構成が想定と違います");

  const order = [
    { id: YUBATAKE_ID, data: { visitTime: t(9, 0), stayDurationMin: 40, transitMode: null, transitDurationMin: null, transitLine: null, lat: 36.62266, lng: 138.59655, memo: MEMO_YUBATAKE } },
    toCreate(NEW.netsunoyu),
    { id: KOSENJI_ID, data: { visitTime: t(10, 20), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 36.62181, lng: 138.59529, memo: MEMO_KOSENJI } },
    toCreate(NEW.jizo),
    toCreate(NEW.otaki),
    toCreate(NEW.shirane),
    { id: SAINOKAWARA_ID, data: { visitTime: t(14, 5), stayDurationMin: 90, transitMode: "walk", transitDurationMin: 15, transitLine: null, memo: MEMO_SAINOKAWARA } },
    toCreate(NEW.library),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const nm = "id" in x ? ({ [YUBATAKE_ID]: "湯畑", [KOSENJI_ID]: "光泉寺", [SAINOKAWARA_ID]: "西の河原公園" } as Record<string, string>)[x.id] + "(既存)" : d.name;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${nm} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
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
