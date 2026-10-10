/**
 * チェックリスト #381 e25ac636「赤間神宮と壇ノ浦古戦場、源平合戦ゆかりの地を巡るプラン」の見直し（しおりえ(制作補助2)）
 * 赤間神宮 → 日清講和記念館 → 壇ノ浦古戦場 → 関門トンネル人道で門司へ → 和布刈神社 → 門司港レトロ地区（昼食）
 * → 連絡船で唐戸へ → 旧下関英国領事館 → 亀山八幡宮 → 海響館（9か所 09:00〜16:35）
 * 既存の2か所はIDのまま直す。説明文の更新と並べ替えを1つのトランザクションで行う
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-381-e25ac636.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e25ac636-ba75-49d3-a911-11a08c9df4d0";
const DAY1_ID = "16b01197-b412-4ae6-b27e-8f8c1b7ab55a";
const AKAMA_ID = "30353d80-5117-4390-87df-9a53ab8d04f4";
const DANNOURA_ID = "0a4e69f2-e3db-47e9-8777-365ddf5e7d2e";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "安徳天皇をまつる赤間神宮と、源平最後の合戦の地・壇ノ浦から、海の底の関門トンネル人道を歩いて門司へ渡り、連絡船で下関の唐戸に戻る日帰りプランです。明治の洋館や、講和会議の記念館もめぐり、関門海峡をはさむ町の歴史をたどります。";

const MEMO_AKAMA =
  "JR下関駅からバスで約10分、赤間神宮前で降りてすぐです。寿永4年（1185年）の壇ノ浦の戦いで、わずか8歳で海に沈まれたと伝わる安徳天皇をまつる神宮です。はじめは貞観元年（859年）に開かれた阿弥陀寺で、建久2年（1191年）には天皇をしのぶ御影堂が建てられました。明治の神仏分離で神社となり、今の姿になっています。竜宮城を思わせる朱塗りの水天門は、『平家物語』で二位の尼が語る「波の下の都」にちなみ、戦災からの復興にあわせて昭和32年（1957年）に建てられたものです。境内には、小泉八雲の『怪談』で知られる「耳なし芳一」をまつる芳一堂もあります。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const MEMO_DANNOURA =
  "日清講和記念館から歩いて約15分。寿永4年（1185年）、源氏と平家の最後の合戦が繰り広げられた海を望む場所で、今は「みもすそ川公園」として整えられています。園内には、船から船へと飛び移る「八艘飛び」の姿の源義経像と、碇を担いで海に身を投じたと伝わる平知盛像が向かい合って立ち、安徳天皇が入水されたと伝わる旨を記した碑もあります。目の前の海は、関門海峡でいちばん幅の狭い「早鞆の瀬戸」で、今も速い潮が渦を巻いて流れています。幕末の下関戦争で長州藩が据えた砲台を再現した大砲も並びます。多くの人が命を落とした合戦の地でもあるので、静かに見学しましょう。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string; dur: number; line?: string; lat: number; lng: number; address: string; memo: string };

const JINDO_ETC: NewSpot[] = [
  {
    name: "関門トンネル人道", h: 11, m: 25, stay: 25, mode: "walk", dur: 5, lat: 33.96556, lng: 130.95606, address: "山口県下関市みもすそ川町",
    memo:
      "みもすそ川公園のすぐそばの人道入口からエレベーターで下り、海の底を歩いて門司へ渡ります。1958年に開通した、関門海峡の下を通る長さ約780mの歩行者用のトンネルで、15分ほどで九州側に着きます。途中には山口県と福岡県の県境の線が引かれていて、陸では接していない2つの県を、歩いてまたぐことができます。自転車は押して通るなど、トンネルの決まりを守って歩きましょう。",
  },
  {
    name: "和布刈神社", h: 11, m: 55, stay: 25, mode: "walk", dur: 5, lat: 33.960883, lng: 130.96224, address: "福岡県北九州市門司区門司",
    memo:
      "人道の門司側の出口から歩いてすぐ、関門海峡に面して立つ神社です。神功皇后が三韓から戻ったのち、仲哀天皇9年に創建されたと伝えられます。毎年、旧暦の元日の早朝に、神職が冬の海に入ってワカメを刈り取り、神前に供える「和布刈神事」が古くから続いています。境内の石段の先はすぐ海で、目の前を大きな船が行き交い、対岸には今歩いてきた下関の町が見えます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "門司港レトロ地区", h: 12, m: 35, stay: 60, mode: "bus", dur: 15, line: "路線バス（和布刈神社付近→門司港駅）",
    lat: 33.9481, lng: 130.9639, address: "福岡県北九州市門司区",
    memo:
      "和布刈神社からバスで門司港駅へ。明治から大正にかけて、大陸との貿易の港として栄えた門司港には、国の重要文化財の門司港駅をはじめ、旧門司税関や旧大阪商船など、当時の洋風の建物が今も残っています。港の周りを歩きながら、ここで昼食にしましょう。門司港の名物として知られる「焼きカレー」を出す店も多くあります。",
  },
  {
    name: "旧下関英国領事館", h: 13, m: 55, stay: 30, mode: "other", dur: 20,
    lat: 33.956938, lng: 130.943185, address: "山口県下関市唐戸町",
    memo:
      "門司港の桟橋から関門連絡船でおよそ5分、下関の唐戸桟橋に戻り、歩いてすぐです。明治39年（1906年）に建てられた、れんが造りの建物で、日本に残る領事館として建てられた建物の中でもっとも古いとされ、国の重要文化財に指定されています。建物の中では、領事館の歴史についての展示を見ることができます。休館日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "亀山八幡宮", h: 14, m: 30, stay: 25, mode: "walk", dur: 5, lat: 33.957464, lng: 130.945144, address: "山口県下関市中之町",
    memo:
      "旧英国領事館から歩いて約5分。貞観元年（859年）に創建されたと伝わる古い神社で、「関の氏神」として下関の人々に親しまれてきました。境内には大きなふぐの像があり、幕末に長州藩が外国船を砲撃した亀山砲台の跡もあります。高台の境内からは、唐戸の町と関門海峡を見下ろせます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "海響館（市立しものせき水族館）", h: 15, m: 5, stay: 90, mode: "walk", dur: 10, lat: 33.95443, lng: 130.942411, address: "山口県下関市あるかぽーと6-1",
    memo:
      "亀山八幡宮から歩いて約10分、関門海峡に面した水族館です。下関の名物にちなんで、さまざまな種類のふぐの仲間を展示しているほか、関門海峡の速い潮の流れを再現した水槽もあります。2025年8月のリニューアルでは、アシカの仲間を間近に見られる新しい展示も加わりました。海峡の町をめぐった旅を、ここで締めくくりましょう。帰りは唐戸からバスでJR下関駅へ向かいます。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${AKAMA_ID},${DANNOURA_ID}`) throw new Error("構成が想定と違います");

  const order = [
    { id: AKAMA_ID, data: { visitTime: t(9, 0), stayDurationMin: 50, transitMode: null, transitDurationMin: null, transitLine: null, lat: 33.959981, lng: 130.948495, memo: MEMO_AKAMA } },
    toCreate({
      name: "日清講和記念館", h: 9, m: 55, stay: 30, mode: "walk", dur: 5, lat: 33.959041, lng: 130.948352, address: "山口県下関市阿弥陀寺町4-3",
      memo:
        "赤間神宮のとなりにある記念館です。明治28年（1895年）の春、日清戦争を終わらせるための講和会議が、ここに隣り合う料亭「春帆楼」で開かれ、日本側の伊藤博文・陸奥宗光と、清の李鴻章らが話し合って下関条約が結ばれました。記念館は、この会議の歴史を後の世に伝えるため、昭和12年（1937年）に開館し、会議で使われた机や椅子などの調度品を、当時の配置で見ることができます。",
    }),
    { id: DANNOURA_ID, data: { visitTime: t(10, 40), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 15, transitLine: null, lat: 33.96528, lng: 130.956739, memo: MEMO_DANNOURA } },
    ...JINDO_ETC.map(toCreate),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? (x.id === AKAMA_ID ? "赤間神宮(既存)" : "壇ノ浦古戦場(既存)") : d.name} ${String(d.memo).length}字`);
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
