/**
 * チェックリスト #430 7ffb8f61「波戸岬の絶景と老舗酒蔵、呼子半島をドライブする1泊2日」の見直し（しおりえ(制作補助2)）
 * 車の旅。1日目: 七ツ釜（新規）→ 呼子大橋・弁天遊歩橋（新規）→ 風の見える丘公園（新規）→ 田島神社（新規）→（昼食）→ 波戸岬 → 玄海海中展望塔（新規）（6か所 09:00〜16:30）
 *        2日目: 浜野浦の棚田（新規）→ 唐津城（新規）→ 唐津神社（新規）→（昼食）→ 虹の松原（新規）（4か所 09:00〜14:00。帰る日）
 * 2日目の「松浦一酒造」を外す: 酒蔵は伊万里市山代町楠久にあり（https://www.asobo-saga.jp/spots/detail/425337e8-9422-470c-888e-148e26e49650 ・ http://www.matsuuraichi.com/ ）、しおりの住所「唐津市呼子町呼子1875」と座標（呼子）が合っていない。説明文の「呼子に江戸期から続く老舗酒蔵」も誤り。
 *   お店（酒造会社）の名前を出さない決まりにも当たるので、スポットごと外し、タイトルの「老舗酒蔵」も外す
 * タイトル: 「波戸岬と七ツ釜の絶景、東松浦半島と唐津をめぐるドライブ1泊2日」（「呼子半島」は一般には東松浦半島と呼ばれるため）
 * 既存の波戸岬の本文は、公式で確かめられない記述（江戸から明治の古式捕鯨など）があったので書き直す
 * 写真: 波戸岬の写真は合っているので残す（松浦一酒造は写真なし）
 * 本文の出典: 唐津観光協会 https://www.karatsu-kankou.jp/spots/detail/N/（虹の松原 1／七ツ釜 4／波戸岬 49／玄海海中展望塔 51／呼子大橋 54／唐津城 181／唐津神社 189／
 *   田島神社 223／風の見える丘公園 399）、玄海町 浜野浦の棚田 https://www.town.genkai.lg.jp/site/kankou/1288.html
 * 座標の出典: Nominatim（七ツ釜 33.5489629,129.9319578／呼子大橋 33.5435459,129.8808347／風の見える丘公園 33.5494966,129.8815525／田島神社 33.5558032,129.8905404／
 *   波戸岬 33.5552756,129.8465907／玄海海中展望塔 33.5559504,129.8522992／浜野浦の棚田展望台 33.4892254,129.8473687／唐津城 33.4535132,129.9781934／
 *   唐津神社 33.4521798,129.9695900／虹ノ松原駅 33.4410618,130.0162027（松原のそば））
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-430-7ffb8f61.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7ffb8f61-d19a-40e0-bb07-3e43d3908ca2";
const DAY1_ID = "b349b945-082d-4ac4-a1c7-c2b43c5a6b15";
const DAY2_ID = "208cbe9a-4ad8-4f7f-9840-2dbc91c44df4";
const HADO = "c9b5c06f-53dd-4d8f-bf39-ad32d35a62d9";
const BREWERY = "0f01f810-340c-4003-92d8-61c112812774";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "波戸岬と七ツ釜の絶景、東松浦半島と唐津をめぐるドライブ1泊2日";
const DESCRIPTION =
  "玄界灘の荒波が削った七ツ釜から、呼子大橋を渡った加部島の田島神社、九州の最西北端とされる波戸岬と海中展望塔をめぐり、波戸岬の近くに泊まります。2日目は浜野浦の棚田から唐津へ向かい、唐津城と唐津神社、虹の松原へ。東松浦半島の海の景色と城下町をめぐる、車の1泊2日です。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const day1 = [
  cre("七ツ釜", 9, 0, 50, null, null, 33.548963, 129.931958, "佐賀県唐津市屋形石",
    "旅の始まりは七ツ釜へ。国の天然記念物で、玄武岩が玄界灘の荒波に削られてできた海食洞です。柱のように規則正しく並ぶ岩肌は柱状節理と呼ばれ、溶岩が冷えて固まるときに縮んでできたものです。いちばん大きな洞窟は間口3m、奥行き110mあり、波の状況によっては遊覧船で中に入ることもできます。岸の上から眺めるときは、崖に近づきすぎないようにしましょう。"),
  cre("呼子大橋・弁天遊歩橋", 10, 10, 30, "car", 20, 33.543546, 129.880835, "佐賀県唐津市呼子町殿ノ浦",
    "七ツ釜から車で呼子へ。呼子大橋は平成元年（1989年）に開通した、呼子と加部島を結ぶ全長728mの斜張橋です。夕日を背にしたシルエットは、呼子の新しいビューポイントにもなっています。橋のたもとの弁天島には、足もとが海の遊歩橋「弁天遊歩橋」（220m）がかかっていて、呼子大橋を見上げながら散歩できます。"),
  cre("風の見える丘公園", 10, 45, 30, "car", 5, 33.549497, 129.881553, "佐賀県唐津市呼子町加部島3279-1",
    "呼子大橋を渡った加部島の、小高い丘の上にある公園です。建物や風車があり、公園からは玄界灘を一望できます。休みの日は公式の案内で確かめてから訪れましょう。"),
  cre("田島神社", 11, 20, 40, "car", 5, 33.555803, 129.89054, "佐賀県唐津市呼子町加部島3965-1",
    "加部島の田島神社は、県内最古の神社とされ、海上交通の守護神、商売や交通の守護神として信仰を集めています。境内には、佐用姫の魂を鎮めるための望夫石をまつる佐用姫神社や、豊臣秀吉が必勝を祈って槍を突き立てると、その気迫で割れてしまったという伝説が残る大石「太閤石」があります。" + RESPECT + "このあと、呼子の町で昼食にしましょう。"),
  {
    id: HADO,
    data: {
      visitTime: t(13, 40), stayDurationMin: 90, transitMode: "car", transitDurationMin: 25, transitLine: null, lat: 33.555276, lng: 129.846591,
      memo: "呼子から車で波戸岬へ。九州の最西北端とされる岬で、日本の渚百選に選ばれた、玄海国定公園の景勝地です。目の前には玄界灘が広がり、夕日が沈む時間帯の景色もおすすめです。「恋人の聖地」のサテライトにも認定されています。岬の名物・さざえのつぼ焼きも味わえます。",
    },
  },
  cre("玄海海中展望塔", 15, 15, 75, "walk", 5, 33.55595, 129.852299, "佐賀県唐津市鎮西町波戸1628-1",
    "波戸岬の海岸から、陸地と86mの桟橋でつながった海中展望塔へ。海上デッキからは玄界灘の島々を見渡せ、24個の海中窓からは、約30種類の魚が泳ぐ様子や、海藻、貝類をありのままに見ることができます。一帯の海は日本海流と対馬海流が合流するため、美しい熱帯魚が見られることもあります。今夜は波戸岬の近くに泊まります。"),
];

const day2 = [
  cre("浜野浦の棚田", 9, 0, 40, null, null, 33.489225, 129.847369, "佐賀県東松浦郡玄海町",
    "2日目は玄海町の浜野浦の棚田へ。小さな入り江に面した斜面を、海岸から駆け上がる階段のように棚田が幾重にも覆い、面積11.5haの中に大小283枚の田んぼが連なっています。「千枚田」とも呼ばれ、主にコシヒカリが作られています。例年4月から田んぼの水張りが始まり、5月には田植えが終わります。棚田は地元の人の田んぼなので、中には入らず、展望台から眺めましょう。"),
  cre("唐津城", 10, 20, 60, "car", 40, 33.453513, 129.978193, "佐賀県唐津市東城内8-1",
    "浜野浦の棚田から車で唐津へ。唐津城は、豊臣秀吉の家臣・寺沢志摩守広高が慶長7年（1602年）から7年の歳月をかけて完成させたと伝えられる城で、「舞鶴城」とも呼ばれます。今の天守閣は昭和41年（1966年）に完成したもので、平成29年（2017年）に天守閣の中がリニューアルされました。桜や藤の名所としても知られています。"),
  cre("唐津神社", 11, 35, 30, "walk", 15, 33.45218, 129.96959, "佐賀県唐津市西城内",
    "唐津城から歩いて約15分、町の中心にある唐津神社へ。入口の白い鳥居が印象的な、奈良時代に建てられたといわれる古い社で、住吉三神と神田宗次をまつっています。唐津最大の祭り「唐津くんち」はこの神社の秋季例大祭で、例年11月に14台の曳山が町をめぐります。" + RESPECT + "このあと、町なかで昼食にしましょう。"),
  cre("虹の松原", 13, 15, 45, "car", 15, 33.441062, 130.016203, "佐賀県唐津市東唐津〜浜玉町",
    "唐津湾に沿って、虹の弧のように連なる松原です。唐津藩の初代藩主・寺沢広高が防風林・防潮林として植えたのが始まりで、全長約4.5km、幅約500mにわたって、約100万本の松が続くといわれます。三保の松原、気比の松原とともに日本三大松原の一つともいわれ、国の特別名勝に指定されています。松原の緑と海を眺めながら、旅を締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== HADO || days[1].spots.map((s) => s.id).join() !== BREWERY) throw new Error("構成が想定と違います");
  if (days[1].spots[0].photos.length !== 0) throw new Error("松浦一酒造に写真があります");
  console.log(`タイトル: ${TITLE}\n説明文: ${DESCRIPTION}\n外すスポット: ${days[1].spots[0].name}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, order] of [[1, day1], [2, day2]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`D${n} ${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? "波戸岬(既存)" : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
      await setDaySpotOrder(DAY2_ID, day2, { tx, remove: [BREWERY] });
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
