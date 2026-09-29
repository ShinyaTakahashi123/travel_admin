/**
 * チェックリスト #382 e424f663「眼鏡橋と長崎新地中華街、歴史とグルメを楽しむプラン」の見直し（しおりえ(制作補助2)）
 * 長崎歴史文化博物館 → 興福寺 → 眼鏡橋 → 出島 → 長崎新地中華街（昼食）→ 唐人屋敷跡 → 崇福寺 → 長崎孔子廟（8か所 09:00〜16:40、徒歩）
 * 既存の2か所はIDのまま直す（店の数・特定の店の元祖の話・言い切りを外す）。説明文の更新と並べ替えを1つのトランザクションで行う
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-382-e424f663.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e424f663-7440-40ba-b255-99be2356bd07";
const DAY1_ID = "039b46bc-0a91-47a6-999e-a203db428b9d";
const MEGANE_ID = "40124fd3-c234-4a7c-b8c7-151a299bf9a1";
const CHINA_ID = "b92bd692-cedc-4aa7-a253-6e6faa3e5aa0";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "日本で最も古いアーチ型の石橋とされる眼鏡橋と、長崎新地中華街を中心に、眼鏡橋を架けた僧ゆかりの興福寺、出島、唐人屋敷跡、唐寺の崇福寺、孔子廟まで、長崎と中国・オランダの交流の歴史をたどって歩く日帰りプランです。お昼は中華街で。";

const MEMO_MEGANE =
  "興福寺から歩いて約10分、中島川に架かる眼鏡橋です。寛永11年（1634年）、興福寺の2代住持で、中国江西省から来た僧・黙子如定が架けたと伝えられ、日本で最も古いアーチ型の石橋とされています。それまで中島川の橋の多くは木の橋で、大雨のたびに流されていたため、如定の指導のもと、興福寺ゆかりの中国の人々の寄進で石橋が築かれたといわれます。2つのアーチが川面に映ると眼鏡のように見えることから、この名で呼ばれるようになりました。1960年に国の重要文化財に指定され、1982年の長崎大水害で一部が壊れたあと、元の姿に復元されています。川沿いの遊歩道から、水面に映るアーチを眺めてみましょう。";

const MEMO_CHINA =
  "出島から歩いて約5分。横浜・神戸とあわせて日本三大中華街の一つともいわれる中華街です。江戸時代、中国からの貿易品を納める倉庫を建てるため、海を埋め立ててつくられた土地が始まりとされます。幕府が中国の船の入港を長崎に限ったことで、この町は中国との貿易の窓口として栄えました。十字に交わる通りに、中国料理の店や中華菓子、雑貨の店が並びます。ここで昼食にしましょう。長崎名物のちゃんぽんや皿うどんは、明治のころ、長崎で暮らす中国の人々の食文化から生まれたといわれます。";

type NewSpot = { name: string; h: number; m: number; stay: number; dur?: number; lat: number; lng: number; address: string; memo: string };

const BEFORE: NewSpot[] = [
  {
    name: "長崎歴史文化博物館", h: 9, m: 0, stay: 70, lat: 32.752923, lng: 129.879463, address: "長崎県長崎市立山1丁目1-1",
    memo:
      "JR長崎駅から歩いて約15分。江戸時代に長崎奉行所の立山役所があった場所に、2005年に開館した博物館です。大航海時代から江戸時代、明治のはじめまで、朝鮮・オランダ・中国など海外との交流の中で育まれた長崎の歴史と文化を紹介しています。奉行所の建物の一部は、江戸時代の絵図や発掘の成果をもとに復元されていて、当時の役所の雰囲気を感じられます。休館日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "興福寺", h: 10, m: 25, stay: 30, dur: 15, lat: 32.747588, lng: 129.883992, address: "長崎県長崎市寺町4-32",
    memo:
      "長崎歴史文化博物館から歩いて約15分。元和6年（1620年）ごろ、中国から来た真圓がこの地に開いた小さなお堂が始まりとされ、日本で最初の唐寺、日本の黄檗宗が始まった地といわれるお寺です。寛永9年（1632年）に来日した黙子如定が2代住持となって寺を整え、如定はこのあと訪れる眼鏡橋を架けたことでも知られています。中国風の朱色の門や本堂に、長崎と中国の深いつながりを感じられます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
];

const AFTER: NewSpot[] = [
  {
    name: "出島", h: 11, m: 50, stay: 60, dur: 15, lat: 32.743156, lng: 129.872925, address: "長崎県長崎市出島町6-1",
    memo:
      "眼鏡橋から中島川に沿って歩いて約15分。1636年、江戸幕府がポルトガル人を住まわせるため、海に築いた扇形の人工の島です。その後、オランダ商館がここに移され、鎖国の時代にヨーロッパとの貿易の窓口として使われました。国の史跡で、商館長の住まいや倉庫などの建物が、長い年月をかけて当時の姿に復元されています。建物をめぐりながら、オランダの人々がこの小さな島でどのように暮らしていたかを感じてみましょう。",
  },
];

const AFTER2: NewSpot[] = [
  {
    name: "唐人屋敷跡", h: 14, m: 15, stay: 30, dur: 10, lat: 32.738239, lng: 129.876701, address: "長崎県長崎市館内町",
    memo:
      "中華街から歩いて約10分。元禄2年（1689年）、長崎に来る中国の人々を一か所に住まわせるために造られた唐人屋敷の跡です。それまで町のあちこちで暮らしていた中国の人々は、この屋敷の中で暮らすことになりました。今は土神堂や天后堂などのお堂が残り、細い坂道と石段の続く町並みに、当時の面影をしのべます。お堂は祈りの場ですので、静かに、敬意をもって見学しましょう。住宅地の中なので、住まいの方の迷惑にならないよう静かに歩きましょう。",
  },
  {
    name: "崇福寺", h: 15, m: 0, stay: 40, dur: 15, lat: 32.742362, lng: 129.883912, address: "長崎県長崎市鍛冶屋町7-5",
    memo:
      "唐人屋敷跡から歩いて約15分。1629年、中国の福州から来た僧・超然によって開かれた唐寺で、「福州寺」とも呼ばれてきました。竜宮城を思わせる朱色の三門をくぐった先の第一峰門と大雄宝殿は、国宝に指定されています。とくに第一峰門は、細かく組み上げられた軒下の組物や鮮やかな彩色が見どころ。中国の建築の技を今に伝えるお寺です。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "長崎孔子廟", h: 16, m: 0, stay: 40, dur: 20, lat: 32.735478, lng: 129.872707, address: "長崎県長崎市大浦町10-36",
    memo:
      "崇福寺から歩いて約20分。1893年（明治26年）に、中国の清朝政府と長崎で暮らす中国の人々によって建てられた孔子廟です。鮮やかな黄色の瓦屋根の建物が並び、境内には孔子の弟子たちの石像が並んでいます。併設の中国歴代博物館では、中国の博物館が所蔵する文物を見ることができます。中国とのつながりをたどってきた一日の締めくくりにふさわしい場所です。祈りの場でもありますので、静かに、敬意をもって見学しましょう。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.dur ? "walk" : null, transitDurationMin: s.dur ?? null, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${MEGANE_ID},${CHINA_ID}`) throw new Error("構成が想定と違います");

  const order = [
    ...BEFORE.map(toCreate),
    { id: MEGANE_ID, data: { visitTime: t(11, 5), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 32.747136, lng: 129.880322, memo: MEMO_MEGANE } },
    ...AFTER.map(toCreate),
    { id: CHINA_ID, data: { visitTime: t(12, 55), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 5, transitLine: null, memo: MEMO_CHINA } },
    ...AFTER2.map(toCreate),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? (x.id === MEGANE_ID ? "眼鏡橋(既存)" : "長崎新地中華街(既存)") : d.name} ${String(d.memo).length}字`);
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
