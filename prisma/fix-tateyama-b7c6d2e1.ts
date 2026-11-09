/**
 * 立山黒部アルペンルートの高原バス旅(b7c6d2e1)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の b7c6d2e1 の欄。設計の表は企画運営・法務とも OK(11/04 21時ごろ)。
 * - 例外（最終便）: 公式 https://www.alpen-route.com/diainfo/ に「室堂からの最終便は15:30発です！」(11月)。季節に秋(11月)が入るため、
 *   室堂を 16:30 に出る組み方はできない。決まり121行目の例外で早く終わる。最終便の1本前(室堂 14:30)に乗る形にする(企画運営)
 * - 時刻は 11月の時刻表(alpen-route.com/timetable/ の 11/4〜11/30 の PDF、毎日運行の便)の実際の便から決める:
 *   電鉄富山 7:14→立山駅 8:20、ケーブルカー 8:40→美女平 8:47、高原バス 美女平 10:00→室堂 10:50、
 *   帰り 室堂 14:30→美女平 15:20、ケーブルカー 15:30→立山駅 15:37、電車 16:06→電鉄富山 17:04(土日祝)・17:05(平日)
 * - みくりが池温泉は宿の名前(決まり329)で、宿の中の食事なので外す。雷鳥沢は公式の目安で室堂ターミナルから片道60分あり、最終便に間に合わないので外す。
 *   立山駅は乗り換えだけなので行き先にせず、最初のメモの書き出しにする。行き先の数は6のまま(例外にしない)
 * - 足す: みくりが池・みどりが池(点「みどりが池園地」tourism=viewpoint node14234715315)、
 *   立山室堂(点 tourism=attraction node6338912687。文化遺産オンライン 145941・173982)、
 *   室堂ターミナルのあたりで昼食(点 駅の建物「室堂駅」way197896678、店でない)
 * - 点: 室堂平 → バス停「室堂」node8456480871(aec8eadc・f3ee1b04 と同じ、企画運営)、エンマ台 → tourism=viewpoint node6029730701
 * - 区間: エンマ台へは 待ち other13 ＋ 高原バス bus50 ＋ 歩き25(公式「室堂ターミナルからの移動時間：徒歩25分」)。
 *   ほかの歩き(routed-foot): エンマ台→園地 1.9→5、園地→立山室堂 2.6→5、立山室堂→室堂駅 7.3→8、室堂駅→バス停 0m→1
 * - 時刻: 美女平 8:47 〜 室堂平 14:25。例外（最終便）
 * - 雷鳥沢の写真は行き先と一緒に消える。表紙(室堂平の写真)と美女平の写真はそのまま
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-tateyama-b7c6d2e1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "b7c6d2e1-473e-40cd-aea7-80a10b6761ee";
const DAY_ID = "7eab968d-ee12-4666-84c3-5d8cc364a32b";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Mode = "walk" | "bus" | "other";
type Leg = [Mode, number];
const L = (...legs: Leg[]) => ({ deleteMany: {}, create: legs.map(([m, n], i) => ({ orderNo: i + 1, transitMode: m, transitDurationMin: n })) });
const C = (...legs: Leg[]) => ({ create: legs.map(([m, n], i) => ({ orderNo: i + 1, transitMode: m, transitDurationMin: n })) });

const TATEYAMA = "955675ed-d1fd-45b5-a8e9-bcc42222980a"; // 外す(最初のメモの書き出しにする)
const BIJO = "420e34ea-0c08-4f65-9b13-e98233bd8a85";
const MURODO = "0cfab8d2-3bbc-48c4-9d35-5f20426ff982";
const ENMA = "52a55c8c-baba-4169-a776-9a1ab787b57a";
const RAICHO = "65593df2-92a1-41e4-aafb-6c7e386e6d91"; // 外す(写真 c9d0efc7 も消える)
const ONSEN = "58daea88-1603-47b0-9a42-b6ce9c88e908"; // 外す
const REMOVE = [TATEYAMA, RAICHO, ONSEN];

const EXPECT: Record<string, string> = {
  [TATEYAMA]: "立山駅", [BIJO]: "美女平", [MURODO]: "室堂平", [ENMA]: "エンマ台", [RAICHO]: "雷鳥沢", [ONSEN]: "みくりが池温泉",
};
const PHOTOS_EXPECT = ["2804ed44-7e67-4ddf-9ac5-90f3e53bcf42", "7afb3665-c5f5-4c69-9cee-9c4e798dd9ce", "c9d0efc7-2e11-4888-9790-f7b20a6a81f5"].sort();

const TITLE = "立山黒部アルペンルートで行く、絶景の高原バス旅日帰りプラン";
const DESC_OLD_HEAD = "ケーブルカーと高原バスを乗り継ぎ、標高2450mの室堂平へ。みくりが池や雷鳥沢を歩き、日本一高い場所にあるとされる温泉にも立ち寄る";
// 季節: 公式の服装の案内「4月から6月ごろは、室堂平周辺や弥陀ケ原高原の散策道は雪に埋もれています」で、エンマ台・立山室堂まで歩けるか確かめられないため、春を外す(企画運営、1章)。
// 11月は秋のままにし、室堂平のメモに公式の服装の案内に合わせた雪の注意を入れる(企画運営)
const SEASONS_OLD = ["spring", "summer", "autumn"];
const SEASONS_NEW = ["summer", "autumn"];
const DESC_NEW =
  "ケーブルカーと高原バスを乗り継ぎ、美女平の森から標高約2450mの室堂平へ。エンマ台、みくりが池・みどりが池、国の重要文化財の立山室堂をめぐる、立山黒部アルペンルートの日帰りプランです。";

const M = {
  bijo:
    "電鉄富山駅から電車でおよそ66分、立山駅でケーブルカーに乗り換えて、待ちを含めておよそ27分、標高約977mの美女平に着きます。美女平のまわりの森は、広葉樹林や樹齢数百年のタテヤマスギの巨木が点在し、森林浴の森100選にも選ばれています。散策道が整備されていて、森林浴や野鳥の観察、自然の観察を気軽に楽しめます。この後は、高原バスに乗り、待ちを含めておよそ63分で室堂ターミナルへ。そこから歩いておよそ25分、エンマ台へ向かいましょう。",
  enma:
    "美女平から、待ちを含めて高原バスでおよそ63分、室堂ターミナルから歩いておよそ25分、エンマ台に着きます。東側には立山三山と山崎圏谷、西側には地獄谷と大日連山を望む展望地です。地獄谷は熱活動が今も続く火口群で、火山ガスが立ちのぼる様子が見えます。遊歩道から外れないようにしましょう。この後は、歩いておよそ5分、みくりが池・みどりが池へ向かいましょう。",
  ike:
    "エンマ台から歩いておよそ5分、みくりが池とみどりが池のほとりに着きます。夏のみくりが池は、澄んだ湖面に立山三山を映し、風のない日には「逆さ立山」が見られることもあります。となりの小ぶりなみどりが池からも、立山三山を望めます。まわりのハイマツには、ライチョウがひそんでいることがあります。見かけても近づかず、そっと見守りましょう。この後は、歩いておよそ5分、立山室堂へ向かいましょう。",
  hut:
    "みくりが池・みどりが池から歩いておよそ5分、立山室堂に着きます。江戸時代中期(1726年)の北棟と、江戸時代後期(1771年)の南棟からなる建物で、平成7年(1995)に国の重要文化財に指定されています。この後は、歩いておよそ8分、室堂ターミナルのあたりで昼食にしましょう。",
  lunch:
    "立山室堂から歩いておよそ8分、室堂ターミナルのあたりで昼食にしましょう。この後は、歩いておよそ1分、室堂平へ向かいましょう。",
  murodo:
    "昼食の場所から歩いておよそ1分、標高約2450mの室堂平に着きます。ターミナルの前には、200年から300年の歳月をかけて立山の自然にろ過されたとされる「立山玉殿の湧水」があります。夏は高山植物、秋は紅葉と、季節ごとに違う景色が広がります。標高が高く、夏でも気温が低く天気が急に変わりやすいので、上着と歩きやすい靴で、遊歩道から外れないようにしましょう。11月は雪が積もり始め、雪の上を歩くこともあるので、防寒の上着と、防水で滑りにくい靴を用意しましょう。雪や天気で散策道が通れないときは、現地の案内に従いましょう。帰りは、高原バスとケーブルカーで、待ちを含めて立山駅までおよそ72分、立山駅から電鉄富山駅までは電車でおよそ59分です。最終便の時刻を公式で確かめましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "美女平(既存。点そのまま、始まり 8:47。最初になるので区間を消す。入口の一文)",
    item: { id: BIJO, data: { visitTime: T(8, 47), stayDurationMin: 60, memo: M.bijo, transitLegs: { deleteMany: {} } } },
  },
  {
    label: "エンマ台(既存。点 tourism=viewpoint node6029730701、待ち13＋高原バス50＋歩き25)",
    item: { id: ENMA, data: { lat: "36.582769", lng: "137.596594", visitTime: T(11, 15), stayDurationMin: 20, memo: M.enma, transitLegs: L(["other", 13], ["bus", 50], ["walk", 25]) } },
  },
  {
    label: "みくりが池・みどりが池(新規。点「みどりが池園地」tourism=viewpoint node14234715315、歩き5)",
    item: {
      create: {
        name: "みくりが池・みどりが池", address: "中新川郡立山町芦峅寺 室堂平", lat: "36.579792", lng: "137.599736",
        visitTime: T(11, 40), stayDurationMin: 30, memo: M.ike, transitLegs: C(["walk", 5]),
      },
    },
  },
  {
    label: "立山室堂(新規。点 tourism=attraction node6338912687、歩き5)",
    item: {
      create: {
        name: "立山室堂", address: "中新川郡立山町芦峅寺 室堂平", lat: "36.577381", lng: "137.600892",
        visitTime: T(12, 15), stayDurationMin: 20, memo: M.hut, transitLegs: C(["walk", 5]),
      },
    },
  },
  {
    label: "室堂ターミナルのあたりで昼食(新規。点 駅の建物「室堂駅」way197896678、店でない。歩き8)",
    item: {
      create: {
        name: "室堂ターミナルのあたりで昼食", address: "中新川郡立山町芦峅寺 室堂平", lat: "36.577396", lng: "137.595545",
        visitTime: T(12, 43), stayDurationMin: 45, memo: M.lunch, transitLegs: C(["walk", 8]),
      },
    },
  },
  {
    label: "室堂平(既存。点 バス停「室堂」node8456480871、aec8eadc・f3ee1b04 と同じ。歩き1、帰りの一文。例外（最終便）)",
    item: { id: MURODO, data: { lat: "36.577141", lng: "137.595687", visitTime: T(13, 29), stayDurationMin: 56, memo: M.murodo, transitLegs: L(["walk", 1]) } },
  },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true, seasons: true } });
  if (!it || it.title !== TITLE || !it.description?.startsWith(DESC_OLD_HEAD)) throw new Error("題か説明文が想定と違います");
  if (JSON.stringify(it.seasons) !== JSON.stringify(SEASONS_OLD)) throw new Error(`季節が想定と違います: ${JSON.stringify(it.seasons)}`);
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);

  console.log(`題: そのまま（${TITLE}）\n説明文:\n  ${it.description}\n→ ${DESC_NEW}\n季節: ${SEASONS_OLD.join(",")} → ${SEASONS_NEW.join(",")}\n表紙: そのまま\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
    const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})${id === RAICHO ? "。写真 c9d0efc7 も消える" : ""}`);
  console.log("\n  始まり 8:47(8:30〜9:30)/ 昼食 12:43(13:30より前)/ 終わり 室堂平 14:25(例外（最終便）。室堂 14:30 の便に乗る)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { description: DESC_NEW, seasons: SEASONS_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
