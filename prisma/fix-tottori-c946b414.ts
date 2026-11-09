/**
 * 鳥取砂丘を歩く日帰り(c946b414)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の c946b414 の欄。
 * - 道の駅神話の里白うさぎを外す(メモが「少し遅めの昼食やお土産探しにぴったり」で直売所・レストランが中心。昼食も 13:50 で 13:30 を過ぎる)
 * - 昼食の行き先を足す(白兎海岸の案内板「みどころいっぱい白兎海岸」tourism=information node13665913780 の点、店でない。40分、13:02 に始まる。
 *   決まり379行目の順で、近くに名前のあるバス停が OSM にないため案内板)
 * - 白兎海岸を足す(OSM natural=beach node4491559162、20分)。道の駅を外して終わりが 16:30 に届かない分を、本物の行き先で埋める
 * - 点: 鳥取砂丘 → ビジターセンター node1423085173(d962010a と同じ)、砂の美術館 → way1420969865(d962010a と同じ)、
 *   白兎神社 → place_of_worship way663796832、鳥取城跡・久松公園 → 入口の碑「鳥取城跡 久松公園」node8024938325(城跡の点 node6098406250 は山頂のため)
 * - 区間(routing.openstreetmap.de): 鳥取駅→ビジターセンター 車 8.7→14(入口の一文)、ビジターセンター→美術館 歩 7.2≤15≤16 そのまま、
 *   美術館→昼食 車 12.0→17(今の車25は上限を超える)、昼食→白兎神社 歩 2.6→3、白兎神社→白兎海岸 歩 5.8→6、白兎海岸→鳥取城跡 車 10.0→15、
 *   鳥取城跡→鳥取駅 車 2.9〜3.4→9(帰りの一文、法務の測り直しで 9)
 * - 時刻: 9:30〜16:36。滞在は延ばさない
 * - 題・説明文から「定番」「日本最大級」「ラクダ乗り体験」(6章)を外す
 * - 砂の美術館は会期のあいだだけ開き、1月〜4月下旬は休館のため、季節から冬を外す(d962010a と同じ)
 * - 事実の直し: 鳥取城跡の「平成30年(2018)に復元された中ノ御門表門」→ 中ノ御門表門は令和3年(2021)春、平成30年(2018)秋は擬宝珠橋(鳥取県の公式)。
 *   「渇え殺し」(亡くなり方にふれる書き方)と出典のない文(東西16km・南北2.4km・千代川の砂、馬の背47m、「一期一会の芸術」、砂と水だけ、
 *   皮膚の回復、池田家)を外す。文は d962010a から写さない
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-tottori-c946b414.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "c946b414-7d46-4d6f-acba-2eeab3928a07";
const DAY_ID = "d587739b-97a4-4893-a5ac-82c654fa98d0";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Mode = "walk" | "car";
const L = (mode: Mode, min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: mode, transitDurationMin: min }] });
const C = (mode: Mode, min: number) => ({ create: [{ orderNo: 1, transitMode: mode, transitDurationMin: min }] });

const SAKYU = "9eaa6c89-964d-402b-8423-ca86774a5901";
const MUSEUM = "45377ad7-5a2e-4469-a9d2-ce5d4804b5d4";
const HAKUTO = "fb108060-6e49-427f-8020-65e1a10727a6";
const MICHINOEKI = "4e1427aa-a3c7-40f4-a3c6-66184e624752"; // 外す
const CASTLE = "9b357c9a-7ec8-41d4-8595-f8771e7d491b";

const EXPECT: Record<string, string> = {
  [SAKYU]: "鳥取砂丘", [MUSEUM]: "砂の美術館", [HAKUTO]: "白兎神社", [MICHINOEKI]: "道の駅神話の里白うさぎ", [CASTLE]: "鳥取城跡・久松公園",
};

const TITLE_OLD = "鳥取砂丘、日本最大級の砂丘を歩く定番日帰りプラン";
const TITLE_NEW = "鳥取砂丘と砂の美術館、因幡の白兎と鳥取城跡をめぐる日帰りプラン";
const DESC_OLD =
  "東西16kmに及ぶ日本最大級の砂丘。風紋や砂の丘「馬の背」を歩き、ラクダ乗り体験も楽しめるほか、砂の美術館や白兎神社、鳥取城跡まで足を延ばす、鳥取観光の定番プランです。";
const DESC_NEW =
  "海岸砂丘の鳥取砂丘と砂の美術館から、神話「因幡の白兎」ゆかりの白兎神社と白兎海岸、復元の進む鳥取城跡まで、レンタカーでめぐる日帰りプランです。";
const SEASONS_OLD = ["spring", "summer", "autumn", "winter"];
const SEASONS_NEW = ["spring", "summer", "autumn"];

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  sakyu:
    "JR鳥取駅の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ14分、鳥取砂丘ビジターセンターのそばに着きます。ここから砂丘へ歩き出しましょう。鳥取砂丘は昭和30年(1955)に国の天然記念物となった海岸砂丘で、指定の理由には、世界的に見ても大きい起伏のほか、風紋・砂簾・すり鉢といった砂丘ならではの地形や、ハマゴウなどの植物の群落が挙げられています。夏は砂が熱くなるので、靴をはき、水分をとりながら歩きましょう。この後は、歩いておよそ15分、砂の美術館へ向かいましょう。",
  museum:
    "鳥取砂丘から歩いておよそ15分、砂の美術館に着きます。2006年に始まった、砂でつくる彫刻「砂像」の展示で、毎年、海外から招かれた砂像彫刻家たちが作品を仕上げます。作品は会期の終わりとともに崩され、砂は次の展示に使い直されます。展示の入れ替えのあいだは休館になるので、会期は公式の案内で確かめましょう。この後は、車でおよそ17分、白兎海岸のあたりで昼食にしましょう。",
  lunch:
    "砂の美術館から車でおよそ17分、白兎海岸のあたりで昼食にしましょう。この後は、歩いておよそ3分、白兎神社へ向かいましょう。",
  hakuto:
    `昼食の場所から歩いておよそ3分、白兎神社に着きます。白兎神を主祭神とする神社で、『古事記』に記された「因幡の白兎」の神話の舞台とされています。和邇を欺いて毛皮をはがれた白兎は、大国主神に助けられ、境内の池で体を洗ったと伝えられています。白兎がそのお礼に大国主神と八上姫の縁を結んだことから、縁結びの神様としても知られています。境内の社叢は、日本海沿岸の原始林の特徴を残すものとして、国の天然記念物に指定されています。${PRAY}この後は、歩いておよそ6分、白兎海岸へ向かいましょう。`,
  coast:
    "白兎神社から歩いておよそ6分、白兎海岸に着きます。神話「因幡の白兎」の舞台として知られる白い砂の海岸で、沖には、白兎がいたとされる淤岐ノ島が浮かびます。「日本の渚百選」にも選ばれています。波打ち際では足元に気をつけましょう。この後は、車でおよそ15分、鳥取城跡・久松公園へ向かいましょう。",
  castle:
    "白兎海岸から車でおよそ15分、鳥取城跡・久松公園の入口に着きます。久松山を中心に広がる城跡で、「鳥取城跡附太閤ヶ平」として国の史跡に指定されています。平成の後期から復元を含む整備が進み、平成30年(2018)秋には大手橋の「擬宝珠橋」が、令和3年(2021)春には「中ノ御門表門」が完成しました。坂や石段もあるので、足元に気をつけて歩きましょう。帰りは、JR鳥取駅まで車でおよそ9分。駅の近くで車を返しましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  { label: "鳥取砂丘(点 ビジターセンター node1423085173、始まり 9:30、入口の一文)", item: { id: SAKYU, data: { lat: "35.543997", lng: "134.236608", visitTime: T(9, 30), stayDurationMin: 90, memo: M.sakyu } } },
  { label: "砂の美術館(点 way1420969865、歩き15そのまま)", item: { id: MUSEUM, data: { lat: "35.539965", lng: "134.237785", visitTime: T(11, 15), stayDurationMin: 90, memo: M.museum, transitLegs: L("walk", 15) } } },
  {
    label: "白兎海岸のあたりで昼食(新規。点は案内板 node13665913780、店でない)",
    item: { create: { name: "白兎海岸のあたりで昼食", address: "鳥取市白兎", lat: "35.525468", lng: "134.115345", visitTime: T(13, 2), stayDurationMin: 40, memo: M.lunch, transitLegs: C("car", 17) } },
  },
  { label: "白兎神社(点 way663796832、歩き3)", item: { id: HAKUTO, data: { lat: "35.524195", lng: "134.114756", visitTime: T(13, 45), stayDurationMin: 35, memo: M.hakuto, transitLegs: L("walk", 3) } } },
  {
    label: "白兎海岸(新規。点は natural=beach node4491559162)",
    item: { create: { name: "白兎海岸", address: "鳥取市白兎", lat: "35.526002", lng: "134.116762", visitTime: T(14, 26), stayDurationMin: 20, memo: M.coast, transitLegs: C("walk", 6) } },
  },
  { label: "鳥取城跡・久松公園(点 入口の碑 node8024938325、車20→15、帰りの一文)", item: { id: CASTLE, data: { lat: "35.507397", lng: "134.23604", visitTime: T(15, 1), stayDurationMin: 95, memo: M.castle, transitLegs: L("car", 15) } } },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true, seasons: true } });
  if (it?.title !== TITLE_OLD || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  if (JSON.stringify(it?.seasons) !== JSON.stringify(SEASONS_OLD)) throw new Error(`季節が想定と違います: ${JSON.stringify(it?.seasons)}`);
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節: ${SEASONS_OLD.join(",")} → ${SEASONS_NEW.join(",")}\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
    const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(`■ ${"id" in item ? "[既存]" : "[新規]"} ${label}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`);
  }
  console.log(`■ [外す] 道の駅神話の里白うさぎ (${MICHINOEKI})`);
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 13:02(13:30より前)/ 終わり 鳥取城跡 16:36(日帰りの 16:30〜17:00)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW, seasons: SEASONS_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: [MICHINOEKI] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
