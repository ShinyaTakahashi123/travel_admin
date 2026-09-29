/**
 * チェックリスト #394 f6221e55「金刀比羅宮、785段の石段を登る「こんぴらさん」定番プラン」の見直し（しおりえ(制作補助2)）
 * 旧金毘羅大芝居（金丸座）→ 金刀比羅宮 → 鞘橋と門前町（昼食）→ 高灯籠 →（JR土讃線）旧善通寺偕行社 → 総本山善通寺（6か所 09:00〜16:30）
 * 既存の金刀比羅宮はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」だったので書き直す。配慮の一文も「敬意」を入れる）
 * 座標の出典: Nominatim（旧金毘羅大芝居 34.1846170,133.8180025／金刀比羅宮 place_of_worship 34.1839885,133.8093897／高燈籠 34.1913460,133.8192529／
 *   旧善通寺偕行社 34.2276170,133.7877498／善通寺 五重塔 34.2259721,133.7767726）、OSM/Overpass（鞘橋 34.185643,133.821650）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-394-f6221e55.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f6221e55-7af6-415d-824e-98eb7b07e9f3";
const DAY1_ID = "d7abee51-6305-4491-9d1b-46db065643e4";
const KONPIRA_ID = "e1d6d32b-268e-41e5-baf0-2bebd82387e8";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "「こんぴらさん」の愛称で親しまれる金刀比羅宮へ、御本宮まで785段の石段を上る定番プラン。現存する日本最古の芝居小屋・金丸座や、屋根のある鞘橋、高さ27mの高灯籠など門前町の見どころもめぐり、午後は電車で善通寺へ足をのばして、弘法大師の生まれた地の大寺院を訪ねる日帰りプランです。";

const MEMO_KONPIRA =
  "金丸座から歩いて約10分、石段の参道の入口へ。海の神様として信仰を集める大物主神と、崇徳天皇をまつる神社で、「こんぴらさん」の愛称で親しまれています。参道の入口から御本宮までは785段、さらに奥社までは1368段の石段が続きます。江戸時代には全国から多くの人が「こんぴら参り」に訪れ、飼い主の代わりに犬がお参りしたという「こんぴら狗」の言い伝えも残ります。境内の表書院には、円山応挙の障壁画（国の重要文化財）が伝わります。御本宮の近くからは讃岐平野を見渡せます。石段は長く急なところもあるので、歩きやすい靴で、休みながら自分のペースで上りましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string | null; dur: number | null; line?: string; lat: number; lng: number; address: string; memo: string };
const cre = (s: NewSpot) => ({ create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } });

const KANAMARU = cre({
  name: "旧金毘羅大芝居（金丸座）", h: 9, m: 0, stay: 40, mode: null, dur: null, lat: 34.184617, lng: 133.818003, address: "香川県仲多度郡琴平町乙1241",
  memo:
    "金刀比羅宮の門前町にある芝居小屋です。天保6年（1835年）に建てられた、現存する日本最古の芝居小屋として、国の重要文化財に指定されています。回り舞台やせりなどの舞台の仕掛けは、今もすべて人の力で動かす造りで、江戸時代の芝居小屋の雰囲気を伝えています。公演が開かれる時期などは見学できないことがあるので、公式の案内で確かめてから訪れましょう。",
});

const AFTER: NewSpot[] = [
  {
    name: "鞘橋と門前町（昼食）", h: 12, m: 30, stay: 50, mode: "walk", dur: 10, lat: 34.185643, lng: 133.82165, address: "香川県仲多度郡琴平町",
    memo:
      "石段を下りて門前町へ。鞘橋は、刀の鞘のような形をした屋根のある珍しい橋で、今の橋は明治2年（1869年）に建てられ、国の登録有形文化財になっています。例大祭などの神事のときだけ使われる橋なので、ふだんは渡らず、そばから眺めましょう。門前町には食事のできる店があるので、ここで昼食にしましょう。",
  },
  {
    name: "高灯籠", h: 13, m: 30, stay: 15, mode: "walk", dur: 10, lat: 34.191346, lng: 133.819253, address: "香川県仲多度郡琴平町",
    memo:
      "門前町から歩いて約10分、琴平駅のすぐそばに立つ、高さ27mの大きな灯籠です。江戸時代の終わりに完成し、日本一高い灯籠とされています。金刀比羅宮への献灯として毎晩明かりがともされ、夜道を行く人の目印にもなったと伝えられます。国の重要有形民俗文化財に指定されています。",
  },
  {
    name: "旧善通寺偕行社", h: 14, m: 15, stay: 40, mode: "train", dur: 30, line: "JR土讃線（琴平→善通寺、約7分。善通寺駅から徒歩約5分）",
    lat: 34.227617, lng: 133.78775, address: "香川県善通寺市",
    memo:
      "善通寺駅から歩いてすぐ。明治36年（1903年）、この地に置かれた陸軍第十一師団の将校たちの社交の場として建てられた洋館です。木造平屋建てで、外観は簡明なルネサンス様式の造りです。完成したその年には、のちの大正天皇が香川を訪れた際の休憩所として使われたと伝えられます。2001年に国の重要文化財に指定されました。開館の時間は公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "総本山善通寺", h: 15, m: 10, stay: 80, mode: "walk", dur: 15, lat: 34.225972, lng: 133.776773, address: "香川県善通寺市善通寺町",
    memo:
      "偕行社から歩いて約15分。弘法大師空海が生まれた地に建つお寺で、高野山の金剛峯寺、京都の東寺と並ぶ弘法大師の三大霊跡の一つとされ、四国八十八ヶ所霊場の第75番札所でもあります。唐から帰った大師が、父から寄進された土地に大同2年（807年）に建て始め、寺の名は父の名にちなむと伝えられます。金堂や五重塔の建つ「伽藍」と呼ばれる東院と、大師の生まれた佐伯家の邸宅跡とされる「誕生院」の西院からなる広い境内です。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。帰りは善通寺駅へ歩いて戻ります。",
  },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== KONPIRA_ID) throw new Error("構成が想定と違います");

  const order = [
    KANAMARU,
    { id: KONPIRA_ID, data: { visitTime: t(9, 50), stayDurationMin: 150, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 34.183989, lng: 133.80939, memo: MEMO_KONPIRA } },
    ...AFTER.map(cre),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? "金刀比羅宮(既存)" : d.name} ${String(d.memo).length}字`);
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
