/**
 * チェックリスト #413 4051e181「天岩戸神社と天安河原、日本神話のパワースポットを巡るプラン」の見直し（しおりえ(制作補助2)）
 * 車の旅。天岩戸神社 → 天安河原 → 高千穂峡 → 道の駅高千穂（昼食）→ 高千穂神社 → 槵觸神社 → 国見ヶ丘（7か所 09:00〜16:30）
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、確かめられない記述もあったので書き直す）。タイトルは内容に合っているのでそのまま
 * 天岩戸神社・天安河原の座標（32.731,131.3059／32.7295,131.3068）は約4km西の別の場所だったので直す
 * 既存の写真（天岩戸神社の社殿）は目で見て合っているので残す
 * 本文の出典（高千穂町観光協会）: 天岩戸神社 https://takachiho-kanko.info/sightseeing/6/ ／天安河原 https://takachiho-kanko.info/sightseeing/27/ ／
 *   高千穂峡 https://takachiho-kanko.info/sightseeing/18/ ／道の駅高千穂 https://takachiho-kanko.info/sightseeing/22/ ／高千穂神社 https://takachiho-kanko.info/sightseeing/5/ ／
 *   槵觸神社 https://takachiho-kanko.info/sightseeing/10/ ／国見ヶ丘 https://takachiho-kanko.info/sightseeing/8/
 * 座標の出典: OSM/Overpass（天岩戸神社（西本宮）32.7345037,131.3506899／くしふる神社 32.7099875,131.3138104）、
 *   Nominatim（天安河原 32.7378698,131.3532338／高千穂峡 viewpoint 32.7017851,131.3009390／道の駅高千穂 32.7085640,131.3010309／
 *   高千穂神社 32.7066706,131.3018922／国見ヶ丘 32.7191167,131.2811037）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-413-4051e181.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4051e181-6ad7-4f7a-8270-b9ed12c4231f";
const DAY1_ID = "0bd8ac8d-d309-42fa-830b-3844b8a416c4";
const IWATO_ID = "23da3003-48b5-4a7e-bc9c-454be4b3a9e5";
const YASUKAWARA_ID = "2baf1711-82e4-497b-9e46-792fc7f2916a";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "天照大神がお隠れになった天岩戸をまつる天岩戸神社と、八百万の神が集ったと伝わる天安河原から、真名井の滝が流れ落ちる高千穂峡へ。道の駅で昼食をとり、高千穂郷八十八社の総社・高千穂神社と、天孫降臨の地と伝わる槵觸神社にお参りして、最後は国見ヶ丘から高千穂の山々を見渡す、日本神話の舞台をめぐる日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  upd(IWATO_ID, 9, 0, 50, null, null, 32.734504, 131.35069,
    "天照大神がお隠れになった天岩戸を御神体としてまつる神社で、古事記・日本書紀に記される天岩戸神話を伝えています。弟の素戔嗚命の乱暴に怒った天照大神が籠もったと伝わる「天岩戸」は、西本宮から拝観できます（定時の案内があります）。岩戸川をはさんだ対岸には、天照大神をまつる東本宮があります。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  upd(YASUKAWARA_ID, 10, 0, 40, "walk", 10, 32.73787, 131.353234,
    "天岩戸神社の西本宮から岩戸川に沿って歩いて約10分。天照大神が岩戸にお隠れになったとき、天地が暗くなり、八百万の神がこの河原に集まって相談したと伝えられる大洞窟で、「仰慕ヶ窟」とも呼ばれます。祈願する人たちの手で積まれた無数の石が、神秘的な雰囲気をいっそう引き立てています。川沿いの道は足元に気をつけて歩きましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  cre("高千穂峡", 11, 10, 80, "car", 20, 32.701785, 131.300939, "宮崎県西臼杵郡高千穂町大字三田井御塩井",
    "天岩戸神社から車で約20分。阿蘇山の火山活動で噴き出した火砕流が冷え固まり、侵食されてできた峡谷で、高いところで100m、平均80mの断崖が東西に約7kmにわたって続き、国の名勝・天然記念物に指定されています。高さ約17mから水面に落ちる「真名井の滝」は、日本の滝百選に選ばれた高千穂峡のシンボルです。約1kmの遊歩道が整えられていますが、一部が通行止めになることがあるので、公式の案内で確かめておきましょう。滝の近くや川沿いは足元がぬれて滑りやすいので気をつけましょう。"),
  cre("道の駅高千穂（昼食）", 12, 45, 60, "car", 10, 32.708564, 131.301031, "宮崎県西臼杵郡高千穂町大字三田井1296-5",
    "高千穂峡から車で約10分。レストランや物産館がそろう道の駅で、となりの観光案内所には高千穂の各種観光パンフレットがそろっています。ここで昼食にしましょう。"),
  cre("高千穂神社", 13, 55, 45, "walk", 5, 32.706671, 131.301892, "宮崎県西臼杵郡高千穂町大字三田井1037",
    "道の駅から歩いて約5分。約1900年前の垂仁天皇の時代に創建されたと伝わる、高千穂郷八十八社の総社です。本殿と、所蔵する鉄造狛犬一対は国の重要文化財に指定されています。高千穂皇神と十社大明神をまつり、農産業や厄祓、縁結びの神として広く信仰を集めています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  cre("槵觸神社", 14, 55, 40, "car", 5, 32.709988, 131.31381, "宮崎県西臼杵郡高千穂町三田井713",
    "高千穂神社から車で約5分。記紀神話で天孫降臨の地と伝わる「槵觸の峰」にある神社です。古くは槵觸の峰そのものを御神体としてまつり、元禄7年（1694年）に社殿が建てられました。瓊々杵尊などをまつっています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  cre("国見ヶ丘", 15, 55, 35, "car", 15, 32.719117, 131.281104, "宮崎県西臼杵郡高千穂町押方",
    "槵觸神社から車で約15分。標高513mの丘で、雲海の名所として知られます。雲海は秋から初冬の早朝、条件がそろった日に見られます。雲海が出ていない時間でも、阿蘇の五岳や祖母連山などの大パノラマを楽しめます。民謡「正調刈干切唄」の発祥地でもあります。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${IWATO_ID},${YASUKAWARA_ID}`) throw new Error("構成が想定と違います");
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
