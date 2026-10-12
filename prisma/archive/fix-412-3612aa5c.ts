/**
 * チェックリスト #412 3612aa5c「竹瓦温泉の砂湯と別府タワー、レトロな温泉街を楽しむプラン」の見直し（しおりえ(制作補助2)）
 * 竹瓦温泉 → 別府タワー →（タクシー）別府市竹細工伝統産業会館 →（タクシー）鉄輪温泉の街歩き（昼食）→ 湯けむり展望台 →（タクシー）みょうばん湯の里（6か所 09:00〜16:00）
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、確かめられない記述もあったので書き直す）。タイトルは内容に合っているのでそのまま
 * 既存の写真（竹瓦温泉の外観・別府タワー）は目で見て合っているので残す
 * 本文の出典: 竹瓦温泉 https://www.takegawara-onsen.com/ ・ https://beppu-tourism.com/onsen/takegawara-onsen/ ／別府タワー https://beppu-tourism.com/spot/beppu-tower/ ・ https://bepputower.co.jp/tower/ ／
 *   竹細工伝統産業会館 https://beppu-tourism.com/spot/beppu-city-traditional-bamboo-crafts-center/ ／鉄輪 https://beppu-tourism.com/feature/toji-stay/ ・ https://beppu-tourism.com/feature/jigokumushi/ ／
 *   湯けむり展望台 https://beppu-tourism.com/spot/yukemuri-tenbodai/ ／みょうばん湯の里 https://beppu-tourism.com/spot/myoban-yunosato/
 * 座標の出典: Nominatim（竹瓦温泉 33.2774490,131.5059764／別府タワー 33.2817106,131.5059243／別府市竹細工伝統産業会館 33.2979682,131.4848992／
 *   鉄輪はいでゆ坂の案内板の点 33.3154103,131.4791526／湯けむり展望台 33.3156943,131.4853007／みょうばん湯の里は「明礬温泉」の点 33.3173027,131.4533694（施設の点がないため））
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-412-3612aa5c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "3612aa5c-ab57-4826-8223-bff49f4d8f23";
const DAY1_ID = "ff773043-95db-4a9c-8e41-a8e1b11c209f";
const TAKEGAWARA_ID = "fbbdad88-dbab-4ab6-bac1-7cb5ab5b97ca";
const TOWER_ID = "8292366a-221d-4b45-84cd-9e58218c510d";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "明治から続く共同浴場・竹瓦温泉の砂湯で温まり、昭和32年から泉都のシンボルとして立つ別府タワーへ。別府竹細工の技にふれたら、湯けむりが立ちのぼる鉄輪の温泉街で地獄蒸しの昼食を。湯けむり展望台から街を見渡し、明礬の湯の花小屋を訪ねる、地獄めぐりとは違う別府の温泉街そのものを楽しむ日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  upd(TAKEGAWARA_ID, 9, 0, 60, null, null, 33.277449, 131.505976,
    "明治12年（1879年）に創設された、別府温泉のシンボル的な存在の共同浴場です。はじめは竹屋根葺きの浴場で、のちに瓦葺きに改築されたことから、この名がついたと伝えられています。今の建物は昭和13年（1938年）に建てられたもので、正面の唐破風造の豪華な屋根が目を引き、天井の高いロビーは昭和初期の面影を残しています。名物の砂湯は、浴衣を着て砂の上に横たわると、砂かけさんが温泉で温められた砂をかけてくれます。混み具合によっては待つこともあり、休みの日もあるので、公式の案内で確かめておきましょう。浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。"),
  upd(TOWER_ID, 10, 10, 40, "walk", 10, 33.281711, 131.505924,
    "竹瓦温泉から歩いて約10分。昭和32年（1957年）に建てられた泉都・別府のシンボルで、国の登録有形文化財です。大規模な改修を経てリニューアルオープンし、高さも100mになりました。17階と16階の展望フロアからは、別府の街並みや別府湾を360度見渡せます。17階には「別府タワー神社」や、竣工当時の設備の展示もあります。"),
  cre("別府市竹細工伝統産業会館", 11, 0, 50, "taxi", 10, 33.297968, 131.484899, "大分県別府市東荘園8丁目2",
    "別府タワーから車で約10分。国指定の伝統的工芸品「別府竹細工」の歴史や技法を学べる施設で、日用品からアートまで、さまざまな竹工芸品を鑑賞できます。照明から壁の装飾まで竹づくしの館内で、竹細工の世界に浸ってみましょう。事前に予約すれば、竹鈴や花籠づくりの体験もできます。休館日は公式の案内で確かめてから訪れましょう。"),
  cre("鉄輪温泉の街歩き（昼食）", 12, 5, 100, "taxi", 15, 33.31541, 131.479153, "大分県別府市風呂本",
    "竹細工伝統産業会館から車で約15分。700年以上前の鎌倉時代に、一遍上人が荒れる蒸気を鎮めて湯治場を開いたといわれる温泉街で、タンクのパイプや側溝、路地のあちこちから湯けむりが立ちのぼります。温泉の蒸気で食材を蒸す「地獄蒸し」は鉄輪ならではの調理法なので、昼食に味わってみましょう。湯けむりの出ているところは熱いので近づかず、足元に気をつけて歩きましょう。"),
  cre("湯けむり展望台", 13, 55, 30, "walk", 10, 33.315694, 131.485301, "大分県別府市北中",
    "鉄輪の街から歩いて約10分。別府の湯けむりを一望できる展望台で、扇山や鶴見岳も見渡せます。別府の湯けむりは、NHKが募集した「21世紀に残したい日本の風景」で富士山に次いで全国2位に選ばれ、「別府の湯けむり・温泉地景観」として国の重要文化的景観にも選ばれています。"),
  cre("みょうばん湯の里", 14, 45, 75, "taxi", 10, 33.317303, 131.453369, "大分県別府市明礬",
    "湯けむり展望台から車で約10分。明礬温泉のシンボル「湯の花小屋」が立ち並ぶ施設で、わら葺き屋根の小屋の中では、温泉の噴気と青粘土を利用して「湯の花」を1日1ミリずつ育てています。江戸時代から約300年続く製法は、国の重要無形民俗文化財に指定されています。明礬温泉の湯けむりも、国の重要文化的景観に選ばれています。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${TAKEGAWARA_ID},${TOWER_ID}`) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days[0].spots.map((s) => [s.id, s.name]));

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
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
