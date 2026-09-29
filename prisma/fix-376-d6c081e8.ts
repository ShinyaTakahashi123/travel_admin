/**
 * チェックリスト #376 d6c081e8「青島神社と鬼の洗濯板、南国宮崎の定番絶景日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 青島からバスで日南海岸を南へ（堀切峠・道の駅フェニックス・サンメッセ日南・鵜戸神宮）、最後に飫肥城下町（7か所 09:00〜16:50）
 * 既存の青島神社・鬼の洗濯板はIDのまま本文と時刻を直す。説明文の更新と並べ替えを1つのトランザクションで行う
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-376-d6c081e8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d6c081e8-2895-4363-ac7a-1fa21aababf5";
const DAY1_ID = "16453015-ba45-4c3d-a97d-2571e04cfa29";
const AOSHIMA_ID = "85623b80-766e-4f8b-a66c-20873dbf6ed2";
const SENTAKU_ID = "00764317-9293-4eab-8b90-f236031cca9f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "縁結びの神様として知られる青島神社と奇岩「鬼の洗濯板」から、バスで日南海岸を南へ。堀切峠の眺め、モアイ像が並ぶサンメッセ日南、断崖の洞窟に本殿がある鵜戸神宮をめぐり、最後は城下町・飫肥を歩く日帰りプランです。";

const MEMO_AOSHIMA =
  "JR日南線の青島駅から歩いて約10分、橋を渡った先の小さな島・青島に鎮まる神社です。日本神話「海幸彦・山幸彦」の物語で、山幸彦が海神の娘・豊玉姫と結ばれた地と伝えられ、縁結びの神様として親しまれています。御祭神は山幸彦こと彦火火出見命と、その妻・豊玉姫命。境内の奥には、ビロウの木々に囲まれた元宮があり、島そのものが古くから信仰の対象とされてきたことがうかがえます。参道には絵馬が連なる「祈りの古道」もあり、良縁を願う人々が多く訪れます。南国の植物に包まれた島全体が神域ですので、静かに、敬意をもってお参りください。";

const MEMO_SENTAKU =
  "青島のまわりを囲むように広がる「鬼の洗濯板」は、正式には「青島の隆起海床と奇形波蝕痕」という名で国の天然記念物に指定されている岩の連なりです。およそ700万年前の海の底でできた、硬い砂岩と軟らかい泥岩が交互に重なる地層が、少し傾いたまま持ち上がり、波に洗われるうちに軟らかい泥岩だけが削られて、硬い砂岩が板を並べたように残りました。遠くから見ると巨大な洗濯板のように見えることから、この名で呼ばれています。潮が引くと岩の上を歩けますが、濡れた岩は滑りやすく、潮が満ちると足場がなくなるので、潮の時間を確かめ、足元に気をつけましょう。見終えたら青島のバス停から、日南方面へ向かうバスに乗ります。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string; dur: number; line?: string; lat: number; lng: number; address: string; memo: string };

const NEW: NewSpot[] = [
  {
    name: "堀切峠",
    h: 10, m: 50, stay: 30, mode: "bus", dur: 20, line: "宮崎交通バス（青島→堀切峠）",
    lat: 31.776427, lng: 131.482289,
    address: "宮崎県宮崎市内海",
    memo:
      "青島からバスで少し南へ下ると、国道220号が海沿いの崖の上を越える堀切峠に着きます。日南海岸国定公園の中にあり、眼下には青島から続く「鬼の洗濯板」の岩の縞模様と、その先に広がる日向灘の青い海を一望できる、日南海岸を代表する眺めの一つです。道沿いは車の行き来が多いので、展望できる場所から、車に気をつけて眺めましょう。",
  },
  {
    name: "道の駅フェニックス",
    h: 11, m: 25, stay: 30, mode: "walk", dur: 5,
    lat: 31.775, lng: 131.483,
    address: "宮崎県宮崎市内海381-1",
    memo:
      "堀切峠から少し南へ歩くと、道の駅フェニックスです。堀切峠一帯の、海を見下ろす高台に立つ道の駅で、海側からは鬼の洗濯板と日向灘をもう一度ゆっくり眺められます。物産館には宮崎の特産品が並び、マンゴーなど宮崎らしい味のソフトクリームも人気です。ひと息ついたら、道の駅フェニックスのバス停からさらに南へ向かいましょう。",
  },
  {
    name: "サンメッセ日南",
    h: 12, m: 25, stay: 80, mode: "bus", dur: 30, line: "宮崎交通バス（道の駅フェニックス→サンメッセ日南）",
    lat: 31.662692, lng: 131.457928,
    address: "宮崎県日南市大字宮浦2650",
    memo:
      "道の駅フェニックスからバスでさらに南へ。太平洋を望む丘の上に、7体のモアイ像が並ぶ公園です。1992年から3年をかけて、日本のチームがイースター島で倒れていたモアイ（アフ・トンガリキ）を立て直したことへのお礼として、島の長老会と島民が日本での復元を認め、アフ・アキビの7体を復刻したと伝えられています。1体の高さは約5.5mあり、海を背にして並ぶ姿は迫力があります。園内にはレストランもあるので、ここで昼食にしましょう。休園日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "鵜戸神宮",
    h: 14, m: 5, stay: 70, mode: "bus", dur: 20, line: "宮崎交通バス（サンメッセ日南→鵜戸神宮）",
    lat: 31.650494, lng: 131.466816,
    address: "宮崎県日南市大字宮浦3232",
    memo:
      "鵜戸神宮のバス停から歩いて約10分、日向灘に面した断崖の洞窟の中に、朱塗りの本殿が建つ神社です。主祭神は鸕鶿草葺不合尊。海神の娘・豊玉姫がこの洞窟に産屋を建て、屋根を鵜の羽で葺き終える前に御子が生まれたことが、そのお名前の由来と伝えられています。参道の石段を下りて本殿へ向かう、珍しい造りも見どころです。本殿前からは、海に浮かぶ亀石のくぼみをめがけて「運玉」を投げる運試しができ、男性は左手、女性は右手で投げるならわしです。一帯は国の名勝にも指定されています。石段は急なところもあるので、足元に気をつけて歩きましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "飫肥城下町",
    h: 16, m: 10, stay: 40, mode: "bus", dur: 55, line: "宮崎交通バス（鵜戸神宮→飫肥城下、約40分）",
    lat: 31.62777, lng: 131.35178,
    address: "宮崎県日南市飫肥",
    memo:
      "鵜戸神宮からバスでおよそ40分、飫肥城下で降りると、石垣と武家屋敷の町並みが続く飫肥の城下町です。天正16年（1588年）に伊東祐兵が豊臣秀吉から飫肥の地を与えられ、明治の廃藩置県まで約280年、伊東氏5万1千石の城下町として栄えました。1977年には、九州で初めて国の重要伝統的建造物群保存地区に選ばれています。町の入口に立つ飫肥城の大手門は、樹齢100年を超える飫肥杉を使い、1978年に復元されたものです。資料館などは夕方に閉まるので、今日は大手門と石垣の続く町並みを歩いて旅を締めくくりましょう。帰りはJR日南線の飫肥駅から宮崎方面へ。列車の本数が多くないので、時刻は公式の時刻表で確かめてください。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID) throw new Error("日の構成が想定と違います");
  const ids = days[0].spots.map((s) => s.id).join(",");
  if (ids !== `${AOSHIMA_ID},${SENTAKU_ID}`) throw new Error(`既存スポットが想定と違います: ${ids}`);

  const order = [
    { id: AOSHIMA_ID, data: { visitTime: t(9, 0), stayDurationMin: 50, transitMode: null, transitDurationMin: null, transitLine: null, memo: MEMO_AOSHIMA } },
    { id: SENTAKU_ID, data: { visitTime: t(10, 0), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 10, transitLine: null, memo: MEMO_SENTAKU } },
    ...NEW.map(toCreate),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${gap} ${"id" in x ? (x.id === AOSHIMA_ID ? "青島神社(既存)" : "鬼の洗濯板(既存)") : d.name} ${String(d.memo).length}字`);
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
