/**
 * #68 357983ef D1(15:55)。企画運営の指摘・提案。門前町商店街→黒川温泉の間に
 * 大観峰(実在、ミルクロード沿いの外輪山展望地、OSM way 477419441「大観峰展望所」)
 * を追加。行って戻る形にならない経路上の追加。滞在30〜40分の指示どおり35分。
 * 崖・強風の一文を入れる。区間の車移動時間(25分/25分)は企画運営の見立てにもとづく。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY1_ID = "533914b0-13e4-4c74-b32b-8fd3a97a5ed9";

const MONZEN_MEMO_TO_DAIKANBO =
  "阿蘇神社の参道沿いに広がる門前町商店街に着きます。「水基めぐり」と呼ばれる、阿蘇の伏流水を汲める水汲み場が20か所以上点在しており、不老長寿の水として親しまれています。およそ35の店が軒を連ね、阿蘇の郷土料理や馬肉料理、スイーツなどの食べ歩きも楽しめます。ここで昼食にしましょう。水基めぐりをしながら、昔ながらの商店街の雰囲気をゆっくりと味わってみてください。この後は、車でおよそ25分、ミルクロード沿いの大観峰へ向かいましょう。";

const DAIKANBO_MEMO =
  "門前町商店街から車でおよそ25分、牧場地帯を抜ける「ミルクロード」沿いの大観峰に着きます。阿蘇外輪山の北側に位置する展望地で、標高およそ936m、阿蘇五岳を一望できる代表的なビューポイントの一つです。中岳の噴煙、根子岳のギザギザとした稜線、寝ている涅槃像に見立てられる阿蘇五岳の全景など、カルデラの雄大なスケールを実感できます。展望所の縁は切り立った崖になっているところがあり、風も強いので、柵の外には出ず、足元に気をつけてお過ごしください。大パノラマをゆっくりと眺めてみてください。この後は、車でおよそ25分、黒川温泉へ向かいましょう。";

const KUROKAWA_MEMO_OPENER_FROM = "門前町商店街から車でおよそ25分、旅館が軒を連ねる黒川温泉に着きます。";
const KUROKAWA_MEMO_OPENER_TO = "大観峰から車でおよそ25分、旅館が軒を連ねる黒川温泉に着きます。";

async function main() {
  const kurokawa = await prisma.spot.findUniqueOrThrow({ where: { id: "2c1f6f97-a446-4825-a280-78cdac404a3d" } });
  if (!kurokawa.memo!.includes(KUROKAWA_MEMO_OPENER_FROM)) throw new Error("一致しません(黒川温泉)");
  const kurokawaNewMemo = kurokawa.memo!.split(KUROKAWA_MEMO_OPENER_FROM).join(KUROKAWA_MEMO_OPENER_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: "49f1923d-bca5-412b-9741-04da635b33b5", data: {} }, // 満願寺
    { id: "7d5ad213-414f-413d-a5b8-022f111a81dc", data: {} }, // 瀬の本高原
    { id: "f2fd7d3b-4063-43cb-90d7-8a4f70d263fd", data: {} }, // 押戸石の丘
    { id: "3587435c-17c3-46c2-9bc5-e25baf68b1bc", data: {} }, // 阿蘇神社
    {
      id: "15d842fd-97b8-48e1-87e9-e6926f4e6225", // 門前町商店街
      data: { memo: MONZEN_MEMO_TO_DAIKANBO },
    },
    {
      create: {
        name: "大観峰",
        address: "熊本県阿蘇市山田",
        lat: 32.9956615,
        lng: 131.0670948,
        memo: DAIKANBO_MEMO,
        visitTime: t(14, 25),
        stayDurationMin: 35,
        transitMode: "car",
        transitDurationMin: 25,
        transitLine: null,
      },
    },
    {
      id: "2c1f6f97-a446-4825-a280-78cdac404a3d", // 黒川温泉
      data: { memo: kurokawaNewMemo, visitTime: t(15, 25), stayDurationMin: 90, transitMode: "car", transitDurationMin: 25 },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt || st == null) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY1_ID, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
