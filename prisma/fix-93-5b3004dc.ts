/**
 * #93 明神池と穂高神社奥宮、上高地の静寂を歩く1泊2日 (5b3004dc-8616-48a3-ba5f-69f65acc9c29)
 * 初日・最終日の見直し。
 *
 * 初日: 入口(沢渡/平湯からのバス)の記載がなく09:00開始だったため、法務の指摘で入口を
 * 実際に大きな駅である松本駅に直す。松本駅から電車とバス(新島々駅で乗り換え)で約80分
 * (環境省中部山岳国立公園管理事務所の時刻表で確認、遠い場所の例外)で1か所目(大正池)を
 * 11:50に直す。昼食が13:30の決まりに収まらないため、企画運営の判断で、大正池のすぐあとに
 * 新しいスポット「大正池のあたりで昼食」(バス停の点)を立てる。穂高神社奥宮・明神池の座標が
 * 実際の場所から約1.3km西にずれていたため(法務の指摘)、OSMの実在の点(奥宮=node4440389676、
 * 明神池=池のほとりの点)に直し、全区間を実測し直す。田代池・田代橋穂高橋(説明文に名前なし)
 * は両方残し滞在を短くする。穂高神社奥宮・明神池もあわせて短くし(89分)、終了を17:00に収める。
 *
 * 2日目(最終日): 宿は明神の山小屋とする(1日目の最後の一文)。1か所目(徳沢)に、宿からの
 * 行き方(明神から梓川沿いを歩いて実測52分)を追加。徳沢→河童橋の移動が実測96分(もとの
 * 120分は長すぎた)で直すと終了が早まるため、1か所目の開始を09:00→09:18(8:30〜9:30の範囲内)
 * に遅らせ、終了を見直す前と同じ16:30に保つ。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-93-5b3004dc.ts
 *   反映: npm run prod -- npx tsx prisma/fix-93-5b3004dc.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "e66681cc-ba7a-47ca-bb58-f6ef6aa4e883";
const DAY2_ID = "758c8dbc-bad2-4cc0-b73f-123c9615c72b";

const TAISHOIKE_ID = "26c82dcc-40d4-42ac-bf91-310d545fa2c9";
const TASHIROIKE_ID = "77ce6ac7-b372-49f6-9bca-115c3bfaf93c";
const TASHIROBASHI_ID = "c7535856-8757-4afd-adef-d32e93c197e7";
const KONASHIDAIRA_ID = "d7f3a0aa-1123-4191-bc44-3c3a1f6ca321";
const OKUMIYA_ID = "946aa899-31bf-4827-b43a-0c859ecefe9f";
const MYOJINIKE_ID = "f3f98d97-a9a5-4f4f-86cb-98bd3f5b281b";

const TOKUSAWA_ID = "ad366c9c-ecfc-4020-9448-519e83acd6f6";
const KAPPABASHI_ID = "488cafa7-f358-45bf-ac5c-61f6cedf8adb";
const SHIMIZUGAWA_ID = "9de4bfdd-60ae-4e36-b6a6-b1e5ff003887";
const WESTON_ID = "f708e440-2797-498c-b096-8751d6abc430";
const VISITOR_CENTER_ID = "163becc7-107f-41bf-89d5-21ab472e275f";

const VISITOR_CENTER_FIND =
  "なお、上高地は冬季は閉鎖されるため、出かける前に最新情報を確かめましょう。帰りは、上高地バスターミナルから、沢渡・平湯方面へのバスをご利用ください。";
const VISITOR_CENTER_REPLACE =
  "なお、上高地は冬季は閉鎖されるため、出かける前に最新情報を確かめましょう。帰りは、歩いて約5分の上高地バスターミナルから、バスと電車(新島々駅で乗り換え)で松本駅へ向かいましょう。帰りのバスの時刻は、公式の案内で確かめましょう。";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const TAISHOIKE_FIND = "上高地の旅は、大正池から始まります。";
const TAISHOIKE_REPLACE =
  "上高地の旅は、松本駅から電車とバス(新島々駅で乗り換え)で約80分の大正池のバス停に11:50ごろ着いたら、大正池から始まります。";
const TAISHOIKE_FIND2 = "この後は、梓川沿いの林間コースを歩いて、田代池へ向かいましょう。";
const TAISHOIKE_REPLACE2 =
  "この先は河童橋まで食事の場所が少ないので、大正池のあたりで昼食をとりましょう。松本などで買って持っていくのもよいでしょう。この後は、梓川沿いの林間コースを歩いて、田代池へ向かいましょう。";

const LUNCH_MEMO =
  "この先は河童橋まで食事の場所が少ないので、ここで昼食をとりましょう。松本などで買って持っていくのもよいでしょう。この後は、梓川沿いの林間コースを歩いて、田代池へ向かいましょう。";

const KONASHIDAIRA_FIND =
  "田代橋・穂高橋から歩いておよそ15分、小梨平に着きます。河童橋のすぐそばに広がる、ミズナラやカラマツなどの原生林に囲まれたキャンプ場で、食堂や売店もあります。木々に包まれた遊歩道を少し歩いて、ひと休みしましょう。ここで昼食にしましょう。この後は、河童橋を渡り、梓川左岸の遊歩道を歩いておよそ50分、穂高神社奥宮へ向かいましょう。";
const KONASHIDAIRA_REPLACE =
  "田代橋・穂高橋から歩いておよそ15分、小梨平に着きます。河童橋のすぐそばに広がる、ミズナラやカラマツなどの原生林に囲まれたキャンプ場で、食堂や売店もあります。木々に包まれた遊歩道を少し歩いて、ひと休みしましょう。この後は、河童橋を渡り、梓川左岸の遊歩道を歩いておよそ47分、穂高神社奥宮へ向かいましょう。";

const OKUMIYA_FIND =
  "小梨平から、河童橋を渡って梓川左岸の遊歩道を歩き、明神橋を渡って、歩いておよそ50分、穂高神社奥宮に着きます。";
const OKUMIYA_REPLACE =
  "小梨平から、河童橋を渡って梓川左岸の遊歩道を歩き、明神橋を渡って、歩いておよそ47分、穂高神社奥宮に着きます。";
const OKUMIYA_FIND2 = "この後は、神域内の明神池へ向かいましょう。";
const OKUMIYA_REPLACE2 = "この後は、歩いてすぐ、神域内の明神池へ向かいましょう。";

const MYOJINIKE_FIND = "穂高神社奥宮の神域内にある明神池に着きます。";
const MYOJINIKE_REPLACE = "穂高神社奥宮から歩いてすぐ、神域内にある明神池に着きます。";

const TOKUSAWA_FIND = "2日目は、明神からさらに奥へ進んだ徳沢から歩き始めます。";
const TOKUSAWA_REPLACE = "宿を出て、明神から梓川沿いを歩いておよそ52分、徳沢へ向かいます。";
const TOKUSAWA_FIND2 = "この後は、歩いておよそ120分、河童橋へ向かいましょう。";
const TOKUSAWA_REPLACE2 = "この後は、歩いておよそ96分、河童橋へ向かいましょう。";

const KAPPABASHI_FIND = "徳沢から歩いておよそ120分、上高地のシンボル・河童橋に着きます。";
const KAPPABASHI_REPLACE = "徳沢から歩いておよそ96分、上高地のシンボル・河童橋に着きます。";

const MYOJINIKE_LAST_FIND = "1日目はここまでです。今夜は、明神や徳沢方面の山小屋に泊まります。";
const MYOJINIKE_LAST_REPLACE = "1日目はここまでです。今夜は、明神のあたりの山小屋に泊まります。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [taishoike, konashidaira, okumiya, myojinike, tokusawa, kappabashi, visitorCenter] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: TAISHOIKE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KONASHIDAIRA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: OKUMIYA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MYOJINIKE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: TOKUSAWA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KAPPABASHI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: VISITOR_CENTER_ID } }),
  ]);

  for (const [label, text, find] of [
    ["大正池", taishoike.memo ?? "", TAISHOIKE_FIND],
    ["大正池(2)", taishoike.memo ?? "", TAISHOIKE_FIND2],
    ["小梨平", konashidaira.memo ?? "", KONASHIDAIRA_FIND],
    ["穂高神社奥宮", okumiya.memo ?? "", OKUMIYA_FIND],
    ["穂高神社奥宮(2)", okumiya.memo ?? "", OKUMIYA_FIND2],
    ["明神池", myojinike.memo ?? "", MYOJINIKE_FIND],
    ["明神池(最後)", myojinike.memo ?? "", MYOJINIKE_LAST_FIND],
    ["徳沢", tokusawa.memo ?? "", TOKUSAWA_FIND],
    ["徳沢(2)", tokusawa.memo ?? "", TOKUSAWA_FIND2],
    ["河童橋", kappabashi.memo ?? "", KAPPABASHI_FIND],
    ["上高地ビジターセンター", visitorCenter.memo ?? "", VISITOR_CENTER_FIND],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const m = {
    taishoike: taishoike.memo!.replace(TAISHOIKE_FIND, TAISHOIKE_REPLACE).replace(TAISHOIKE_FIND2, TAISHOIKE_REPLACE2),
    konashidaira: konashidaira.memo!.replace(KONASHIDAIRA_FIND, KONASHIDAIRA_REPLACE),
    okumiya: okumiya.memo!.replace(OKUMIYA_FIND, OKUMIYA_REPLACE).replace(OKUMIYA_FIND2, OKUMIYA_REPLACE2),
    myojinike: myojinike.memo!.replace(MYOJINIKE_FIND, MYOJINIKE_REPLACE).replace(MYOJINIKE_LAST_FIND, MYOJINIKE_LAST_REPLACE),
    tokusawa: tokusawa.memo!.replace(TOKUSAWA_FIND, TOKUSAWA_REPLACE).replace(TOKUSAWA_FIND2, TOKUSAWA_REPLACE2),
    kappabashi: kappabashi.memo!.replace(KAPPABASHI_FIND, KAPPABASHI_REPLACE),
    visitorCenter: visitorCenter.memo!.replace(VISITOR_CENTER_FIND, VISITOR_CENTER_REPLACE),
  };

  console.log("=== #93 初日・最終日の見直し ===\n");
  console.log("--- 初日(大正池のあたりで昼食を新設) ---");
  console.log("1. 大正池 11:50(25分、入口を追加):");
  console.log(m.taishoike.slice(0, 100));
  console.log("2. (新規)大正池のあたりで昼食 12:17(40分)");
  console.log("3. 田代池 13:13(12分←50分)");
  console.log("4. 田代橋・穂高橋 13:40(12分←55分)");
  console.log("5. 小梨平 14:17(25分←60分)");
  console.log("6. 穂高神社奥宮 15:29(30分←50分、座標を直す)");
  console.log("7. 明神池(最後) 16:01(59分←90分、座標を直す、終了17:00)");

  console.log("\n--- 2日目(宿は明神の山小屋) ---");
  console.log("1. 徳沢 09:18(70分、入口を追加):");
  console.log(m.tokusawa.slice(0, 60));
  console.log("2. 河童橋 12:04(85分、移動96分←120分)");
  console.log("3. 清水川 13:32(70分)");
  console.log("4. ウェストン碑 15:00(20分)");
  console.log("5. 上高地ビジターセンター(最後) 15:40(50分、終了16:30、見直す前と同じ)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      DAY1_ID,
      [
        { id: TAISHOIKE_ID, data: { visitTime: t(11, 50), stayDurationMin: 25, memo: m.taishoike } },
        {
          create: {
            name: "大正池のあたりで昼食",
            visitTime: t(12, 17),
            stayDurationMin: 40,
            lat: 36.228391,
            lng: 137.619692,
            memo: LUNCH_MEMO,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
          },
        },
        {
          id: TASHIROIKE_ID,
          data: {
            visitTime: t(13, 13),
            stayDurationMin: 12,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16 }] },
          },
        },
        {
          id: TASHIROBASHI_ID,
          data: {
            visitTime: t(13, 40),
            stayDurationMin: 12,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
          },
        },
        {
          id: KONASHIDAIRA_ID,
          data: {
            visitTime: t(14, 17),
            stayDurationMin: 25,
            memo: m.konashidaira,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 25 }] },
          },
        },
        {
          id: OKUMIYA_ID,
          data: {
            visitTime: t(15, 29),
            stayDurationMin: 30,
            lat: 36.2533195,
            lng: 137.6644024,
            memo: m.okumiya,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 47 }] },
          },
        },
        {
          id: MYOJINIKE_ID,
          data: {
            visitTime: t(16, 1),
            stayDurationMin: 59,
            lat: 36.254461,
            lng: 137.664775,
            memo: m.myojinike,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
          },
        },
      ],
      { tx }
    );

    await setDaySpotOrder(
      DAY2_ID,
      [
        { id: TOKUSAWA_ID, data: { visitTime: t(9, 18), stayDurationMin: 70, memo: m.tokusawa } },
        {
          id: KAPPABASHI_ID,
          data: {
            visitTime: t(12, 4),
            stayDurationMin: 85,
            memo: m.kappabashi,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 96 }] },
          },
        },
        { id: SHIMIZUGAWA_ID, data: { visitTime: t(13, 32), stayDurationMin: 70 } },
        { id: WESTON_ID, data: { visitTime: t(15, 0), stayDurationMin: 20 } },
        { id: VISITOR_CENTER_ID, data: { visitTime: t(15, 40), stayDurationMin: 50, memo: m.visitorCenter } },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
