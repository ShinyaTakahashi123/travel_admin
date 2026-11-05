/**
 * 1bd66235 の2日目の直し(2026-11-05、しおりえ(制作補助2))。企画運営・法務の判断(点そろえ 9dff914 のあとの組み直し)。
 * - 白兎神社・白兎海岸の滞在の中にあった昼食(「近くの道の駅には食事処もあるので、ここで昼食にしましょう。」)を、
 *   別の行き先「白兎海岸のあたりで昼食」に分ける。点は案内板「みどころいっぱい白兎海岸」tourism=information・information=board
 *   node13665913780(35.5254684,134.1153445)。白兎の近くに OSM のバス停がないため、規則380行の順で案内板。道の駅・店の名前は書かない。
 * - 区間(routing.openstreetmap.de): 白兎神社→案内板 156.9秒で歩3、案内板→鳥取城跡 618.9秒で車16(今の車16のまま)。
 * - 時刻: 白兎 11:41・滞在 80→37、昼食 12:21・40、鳥取城跡 13:17 のまま(11:41+37+3+40+16)。それより後と終わり 16:54 は変わらない。
 * - 祈りの一文は、規則242行のとおりメモの最後(結びの前)のまま(企画運営 11/05)。
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-tottori-day2-1bd66235.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const DAY_ID = "f3d8d6b8-1eb8-421e-9b06-02a79e1782ab";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (d: Date | null) => (d ? d.toISOString().slice(11, 16) : "--:--");

const SAKYU = "f9cb3c08-035b-4d66-a604-494ff75efb31";
const SUNA = "d69ea4cb-634d-41a8-b0e9-a6d78b45310d";
const HAKUTO = "caf86db0-19ba-4bc5-9cf9-7788eedffaaa";
const JOSEKI = "0df911db-2114-4dea-ba67-5f28ea46b096";
const MUSEUM = "d1de6450-5420-4b58-9d94-49d385a5b4bd";
const JINPU = "e56afb0a-9c39-472d-a230-10fbdb006604";
const WARABE = "f70aca8e-8129-4206-959f-b16841141512";
const MINGEI = "3ce74284-b894-4d6a-ab04-eaf0cd8b6a77";
const ORDER = [SAKYU, SUNA, HAKUTO, JOSEKI, MUSEUM, JINPU, WARABE, MINGEI];
const NAMES = ["鳥取砂丘", "砂の美術館", "白兎神社・白兎海岸", "鳥取城跡", "鳥取県立博物館", "仁風閣", "わらべ館", "鳥取民藝美術館"];

const HAKUTO_REPS: [string, string][] = [
  ["近くの道の駅には食事処もあるので、ここで昼食にしましょう。", ""],
  ["この後は、車でおよそ16分、市街に戻って鳥取城跡へ向かいましょう。", "この後は、歩いておよそ3分、白兎海岸のあたりへ向かいましょう。"],
];
const JOSEKI_REPS: [string, string][] = [["白兎神社・白兎海岸から車でおよそ16分、", "白兎海岸のあたりから車でおよそ16分、"]];
const LUNCH_MEMO =
  "白兎神社・白兎海岸から歩いておよそ3分、白兎海岸のあたりに着きます。このあたりで昼食にしましょう。この後は、車でおよそ16分、市街に戻って鳥取城跡へ向かいましょう。";

const count = (s: string, sub: string) => s.split(sub).length - 1;
function apply(memo: string, reps: [string, string][], name: string) {
  for (const [a, b] of reps) {
    if (count(memo, a) !== 1) throw new Error(`${name}: 直す文が1か所ではありません「${a}」(${count(memo, a)})`);
    memo = memo.replace(a, b);
  }
  return memo;
}

async function main() {
  const spots = await prisma.spot.findMany({
    where: { dayId: DAY_ID },
    orderBy: { orderNo: "asc" },
    select: { id: true, name: true, visitTime: true, stayDurationMin: true, memo: true, day: { select: { itineraryId: true } }, transitLegs: { select: { transitMode: true, transitDurationMin: true } } },
  });
  if (!spots.length || !spots[0].day.itineraryId.startsWith("1bd66235")) throw new Error("日が想定と違います");
  if (JSON.stringify(spots.map((s) => s.id)) !== JSON.stringify(ORDER)) throw new Error(`2日目のスポットが想定と違います: ${spots.map((s) => s.name).join(",")}`);
  spots.forEach((s, i) => { if (s.name !== NAMES[i]) throw new Error(`名前が想定と違います ${s.name}`); });
  const hak = spots[2], jo = spots[3];
  const legStr = (s: (typeof spots)[number]) => s.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+");
  if (hm(hak.visitTime) !== "11:41" || hak.stayDurationMin !== 80 || legStr(hak) !== "car20") throw new Error(`白兎の今の値が想定と違います ${hm(hak.visitTime)} ${hak.stayDurationMin} ${legStr(hak)}`);
  if (hm(jo.visitTime) !== "13:17" || jo.stayDurationMin !== 34 || legStr(jo) !== "car16") throw new Error(`鳥取城跡の今の値が想定と違います ${hm(jo.visitTime)} ${jo.stayDurationMin} ${legStr(jo)}`);
  const hakMemo = apply(hak.memo ?? "", HAKUTO_REPS, "白兎神社・白兎海岸");
  const joMemo = apply(jo.memo ?? "", JOSEKI_REPS, "鳥取城跡");
  if (/昼食|道の駅/.test(hakMemo)) throw new Error("白兎のメモに昼食・道の駅が残っています");

  const items: { label: string; item: SpotOrderItem }[] = [
    { label: "鳥取砂丘(そのまま)", item: { id: SAKYU, data: {} } },
    { label: "砂の美術館(そのまま)", item: { id: SUNA, data: {} } },
    { label: "白兎神社・白兎海岸(滞在 80→37、昼食の文を外し、結びを歩3に)", item: { id: HAKUTO, data: { stayDurationMin: 37, memo: hakMemo } } },
    {
      label: "白兎海岸のあたりで昼食(新規。点 案内板 node13665913780、歩3)",
      item: { create: { name: "白兎海岸のあたりで昼食", lat: "35.525468", lng: "134.115345", visitTime: T(12, 21), stayDurationMin: 40, memo: LUNCH_MEMO, transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] } } },
    },
    { label: "鳥取城跡(書き出しを「白兎海岸のあたりから」に。時刻・区間はそのまま)", item: { id: JOSEKI, data: { memo: joMemo } } },
    { label: "鳥取県立博物館(そのまま)", item: { id: MUSEUM, data: {} } },
    { label: "仁風閣(そのまま)", item: { id: JINPU, data: {} } },
    { label: "わらべ館(そのまま)", item: { id: WARABE, data: {} } },
    { label: "鳥取民藝美術館(そのまま)", item: { id: MINGEI, data: {} } },
  ];
  for (const { label, item } of items) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const cur = "id" in item ? spots.find((s) => s.id === item.id)! : null;
    const vt = d.visitTime instanceof Date ? hm(d.visitTime) : cur ? hm(cur.visitTime) : "--:--";
    const st = (d.stayDurationMin as number | undefined) ?? cur?.stayDurationMin;
    const lg = d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined;
    const ls = lg?.create ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : cur ? legStr(cur) || "(なし)" : "";
    console.log(`■ ${label}\n  着 ${vt}／滞在 ${st}／区間 ${ls}${d.lat ? `／点 ${d.lat},${d.lng}` : ""}${d.memo ? `\n  メモ: ${d.memo}` : ""}`);
  }
  console.log("\n  昼食 12:21(11:30〜13:30)。11:41+37+3=12:21、+40+16=13:17。鳥取城跡から後と終わり 16:54 は変わらない");
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(async (tx) => { await setDaySpotOrder(DAY_ID, items.map((r) => r.item), { tx }); }, { timeout: 60000 });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
