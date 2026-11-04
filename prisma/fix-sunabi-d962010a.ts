/**
 * 砂の美術館(d962010a)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の d962010a の欄。
 * - 道の駅きなんせ岩美を外す(メモが買い物目当て。点もコンビニの点。帰り道とは逆の方角なので、帰りの一文にも入れない)
 * - 点: 砂の美術館 → museum way1420969865、鳥取砂丘 → ビジターセンター node1423085173(c946b414 とそろえる)、
 *   鳥取砂丘こどもの国 → 入口ゲート node4375609496、浦富海岸 → 鴨ヶ磯展望駐車場 node13528187102(着く側の名前のある点、7章)
 * - 昼食の行き先を足す(バス停「砂丘会館(鳥取砂丘)」node5677464788 の点、店でない。45分、12:31 に始まる)
 * - 区間(routed-foot/routed-car): 鳥取駅→美術館 車 8.6→14、美術館→ビジターセンター 歩 7.2≤9≤16 そのまま、
 *   ビジターセンター→昼食 歩 1.9→2、昼食→こどもの国 車 3.2→9(歩くと40分なので車に)、こどもの国→鴨ヶ磯 車 13.2≤18≤25 そのまま、
 *   鴨ヶ磯→鳥取駅 車 15.8→21
 * - 始まり 9:30、終わり 16:30(日帰りの 16:30〜17:00 に合わせて浦富海岸を 75→77、企画運営 11/04。もとの 16:35 より遅くしない)
 * - 砂の美術館は会期のあいだ(今の会期は 4/24〜1/3)だけ開き、次の展示の制作のため休館する(公式の営業案内・よくある質問)。
 *   冬(1〜4月)の多くは休館なので、季節から冬を外す案(企画運営・法務に確かめる)
 * - 事実の直し: 出典のない文(「砂と少しの水だけ」「ほかにはほとんど例がない」「日本の地質百選」「馬の背 47m」「19ヘクタール」
 *   「千貫松島 10m」「遊覧船」)を外す。こどもの国は鳥取県立(公式の施設情報の規程名)、有料の遊具は勧めない
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-sunabi-d962010a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "d962010a-b73e-42c5-8fd0-ddfeddcb52b8";
const DAY_ID = "82ce9c39-8eb1-44ea-bd4e-fbf6570a1750";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const L = (mode: "walk" | "car", min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: mode, transitDurationMin: min }] });

const MUSEUM = "bf5bbc71-39f9-4107-bf6c-b2bdeb398959";
const SAKYU = "6ee2bbd4-a134-4a41-a038-a4857d158576";
const KODOMO = "70175627-4023-4b18-875e-d88637a20e6f";
const URADOME = "44d624a4-192f-4395-8a2d-d6f5709d42bf";
const MICHINOEKI = "3a4333ca-aa7c-477e-9a9b-e699e8b7d6f2"; // 外す

const EXPECT: Record<string, string> = {
  [MUSEUM]: "砂の美術館", [SAKYU]: "鳥取砂丘", [KODOMO]: "鳥取砂丘こどもの国", [URADOME]: "浦富海岸", [MICHINOEKI]: "道の駅きなんせ岩美",
};

const TITLE = "砂の美術館、砂でできた彫刻の世界を楽しむプラン";
const DESC_OLD =
  "「砂で世界旅行」をテーマに、毎年異なる国をモチーフにした砂像を展示する砂の美術館。鳥取砂丘のすぐそばで楽しむ、砂像アートのプランです。";
const DESC_NEW =
  "「砂で世界旅行」をテーマに、会期ごとに国や地域を変えて砂像を展示する砂の美術館から、鳥取砂丘、鳥取砂丘こどもの国、浦富海岸の景色まで、車でめぐる日帰りプランです。";
const SEASONS_OLD = ["spring", "summer", "autumn", "winter"];
const SEASONS_NEW = ["spring", "summer", "autumn"];

const M = {
  museum:
    "JR鳥取駅から車でおよそ14分、砂の美術館に着きます。砂を素材にした彫刻「砂像」を専門に展示する美術館で、2006年に砂像を展示するプロジェクトとして始まり、のちに世界で初めてとされる砂像専門の屋内展示施設が整えられました。「砂で世界旅行」をテーマに、毎年海外から砂像彫刻家を招き、会期ごとに国や地域を変えた作品を展示しています。会期が終わると作品はすべて崩され、その砂は次の作品に生まれ変わります。展示の入れ替えのあいだは休館になるので、会期は公式の案内で確かめましょう。この後は、歩いておよそ9分、鳥取砂丘へ向かいましょう。",
  sakyu:
    "砂の美術館から歩いておよそ9分、鳥取砂丘ビジターセンターのそばから砂丘へ出ます。海岸砂丘として大きな起伏をもち、風紋などの砂丘ならではの地形や植物の群落が学術的に貴重とされ、昭和30年(1955)に国の天然記念物に指定されました。山陰海岸国立公園に含まれ、砂丘のうち131ヘクタールは特別保護地区として、特に厳しく守られています。砂に足を取られやすいので、歩きやすい靴で歩きましょう。この後は、歩いておよそ2分、砂丘の入口のあたりで昼食にしましょう。",
  lunch:
    "鳥取砂丘から歩いておよそ2分、砂丘の入口のあたりで、昼食にしましょう。この後は、車でおよそ9分、鳥取砂丘こどもの国へ向かいましょう。",
  kodomo:
    "昼食の場所から車でおよそ9分、鳥取砂丘こどもの国の入口に着きます。1973年に設立された鳥取県立の施設で、2000年にリニューアルされました。砂丘のそばの広い園内には、遊具の広場や芝生の広場、水で遊べる場所のほか、木工工房や砂の工房もあります。休園日は公式の案内で確かめましょう。この後は、車でおよそ18分、浦富海岸へ向かいましょう。",
  uradome:
    "鳥取砂丘こどもの国から車でおよそ18分、浦富海岸の鴨ヶ磯の展望駐車場に着きます。島や洞門、砂浜が続くリアス式の海岸で、昭和2年(1927)に国の名勝・天然記念物に指定されました。山陰海岸国立公園と山陰海岸ジオパークに含まれ、日本の白砂青松100選にも選ばれています。崖のそばには寄りすぎず、足もとに気をつけて景色を楽しみましょう。帰りは、JR鳥取駅まで車でおよそ21分です。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  { label: "砂の美術館(点 way1420969865、始まり 9:30、入口の一文)", item: { id: MUSEUM, data: { lat: "35.539965", lng: "134.237785", visitTime: T(9, 30), stayDurationMin: 80, memo: M.museum } } },
  { label: "鳥取砂丘(点 ビジターセンター node1423085173、歩き9)", item: { id: SAKYU, data: { lat: "35.543997", lng: "134.236608", visitTime: T(10, 59), stayDurationMin: 90, memo: M.sakyu, transitLegs: L("walk", 9) } } },
  {
    label: "砂丘の入口のあたりで昼食(新規。点はバス停 node5677464788、店でない)",
    item: { create: { name: "砂丘の入口のあたりで昼食", address: "鳥取市福部町湯山", lat: "35.54328", lng: "134.237127", visitTime: T(12, 31), stayDurationMin: 45, memo: M.lunch, transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] } } },
  },
  { label: "鳥取砂丘こどもの国(点 入口ゲート node4375609496、歩き15→車9)", item: { id: KODOMO, data: { lat: "35.53442", lng: "134.225515", visitTime: T(13, 25), stayDurationMin: 90, memo: M.kodomo, transitLegs: L("car", 9) } } },
  { label: "浦富海岸(点 鴨ヶ磯展望駐車場 node13528187102、車18、75→77、帰りの一文)", item: { id: URADOME, data: { lat: "35.58861", lng: "134.30266", visitTime: T(15, 13), stayDurationMin: 77, memo: M.uradome, transitLegs: L("car", 18) } } },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true, seasons: true } });
  if (it?.title !== TITLE || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  if (JSON.stringify(it?.seasons) !== JSON.stringify(SEASONS_OLD)) throw new Error(`季節が想定と違います: ${JSON.stringify(it?.seasons)}`);
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);

  console.log(`題: ${TITLE}(変えない)\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節: ${SEASONS_OLD.join(",")} → ${SEASONS_NEW.join(",")}\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
    const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(`■ ${"id" in item ? "[既存]" : "[新規]"} ${label}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`);
  }
  console.log(`■ [外す] 道の駅きなんせ岩美 (${MICHINOEKI})`);
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 12:31(13:30より前)/ 終わり 浦富海岸 16:30(もとは 16:35)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { description: DESC_NEW, seasons: SEASONS_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: [MICHINOEKI] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
