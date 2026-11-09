/**
 * たらい舟体験とトキの森公園、佐渡の自然と文化を楽しむプラン(881f9752)の組み直し(2026-11-05、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の 881f9752 の欄(組み直しが要るしおり)。11/05 0時に制作から制作補助2へ移った分。
 * - 「前の晩に渡って一泊し」は決まり(前泊を前提にしない)に合わないので、直江津港→小木港の朝のカーフェリーで渡る日帰りにする(企画運営 B1)
 *   入口は小木港(遠い場所の例外、itinerary-rules.md 63行目)。船は 3/20〜11/23 だけなので季節から冬を外す
 * - 佐渡西三川ゴールドパーク・佐渡歴史伝説館は佐渡汽船グループの施設(公式のレンタカーのページ)なので6章で外す。小木家にも触れない
 * - たらい舟は会社名・値段・時刻を書かずに残す(法務 11/04)。北のトキの森から回り、小木港のそばで終わる並び(企画運営)
 * - 点(Nominatim の中心か OSM の node を6けたに丸めたもの): トキ資料展示館 way682819113、妙宣寺 way681764294、
 *   昼食 バス停「真野新町」node11152068322(API で名前とバス停を確かめた点)、宿根木 案内板「宿根木ガイドマップ」node9960873300、小木民俗博物館 way682917698、
 *   矢島・経島 tourism=attraction way683064233、たらい舟 乗り場の建物 way682931421
 * - 区間(routing.openstreetmap.de routed-car は秒から切り上げ＋5、routed-foot は切り上げ):
 *   小木港ターミナル way682931403→トキ 1919.9秒→37、トキ→妙宣寺 776.3→18、妙宣寺→真野新町 215.7→9、真野新町→宿根木 1225.7→26、
 *   宿根木→博物館(歩) 125.7→3、博物館→矢島・経島 168.1→8、矢島・経島→たらい舟 196.4→9、たらい舟→小木港ターミナル 174.3→8(帰り)
 * - 時刻: 小木港 9:50 着、降りるのに10分、レンタカーの手続き15分で 10:15 に出て、トキ 10:52。たらい舟を 16:40 に出て、港 16:48、
 *   車を返して(約10分) 16:58。17:25 の出港まで27分(25分以上、64行目)
 * - 出典: 船 sadokisen.co.jp/timetable/wp-json/sadokisen/v1/timetable(C2)、レンタカー sadokisen.co.jp/rentacar/・/rentacar/2026/03/19/post02/、
 *   トキ env.go.jp/nature/kisho/wildlifecenter/sado-toki.html・visitsado.com/spot/detail0015/、妙宣寺 visitsado.com/spot/detail0107/、
 *   宿根木 visitsado.com/spot/detail0121/、小木民俗博物館 city.sado.niigata.jp/site/museum/458.html、
 *   矢島・経島 visitsado.com/spot/detail0152/・detail0153/、たらい舟 niigata-kankou.or.jp/spot/detail_8870.html・visitsado.com/spot/detail0153/・detail0866/
 * - 写真: たらい舟(表紙)とトキの森の写真はそのまま
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-sado-881f9752.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "881f9752-bf82-464c-b6b7-0ff8e038f904";
const DAY_ID = "32c01b45-7653-4e00-8cfa-66864d1ee724";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

const TARAI = "639281e1-00db-470e-916e-35bd6cdf3328";
const SHUKUNEGI = "99c564cb-231b-4212-a22f-941c25d15939";
const GOLD = "94ceca92-5004-4c04-b41e-31cb47abd5fb"; // 外す
const TOKI = "dc70ec68-e44a-4b9a-b686-448998a11c50";
const DENSETSU = "57316677-40b1-4bcd-936b-2b91d42156fa"; // 外す
const MYOSEN = "50a0143b-646e-47b0-a1e5-548d136db1e4";
const REMOVE = [GOLD, DENSETSU];

const EXPECT: Record<string, string> = {
  [TARAI]: "たらい舟（小木港）", [SHUKUNEGI]: "宿根木集落", [GOLD]: "佐渡西三川ゴールドパーク",
  [TOKI]: "トキの森公園", [DENSETSU]: "佐渡歴史伝説館", [MYOSEN]: "妙宣寺",
};
const PHOTOS_EXPECT = ["eeaa8f88-8065-4c9e-8b51-a4ccd276a81a", "eec3a599-bfc5-4a44-bb0b-345b4201898f"].sort();

const TITLE_OLD = "たらい舟体験とトキの森公園、佐渡の自然と文化を楽しむプラン";
const TITLE_NEW = "小木のたらい舟と宿根木、トキの森公園をめぐる佐渡の日帰りプラン";
const DESC_OLD =
  "佐渡島南部の小木港で乗るたらい舟体験から、船大工の集落・宿根木、砂金採り体験の西三川ゴールドパーク、特別天然記念物トキに出会えるトキの森公園、佐渡の歴史と伝説を伝える佐渡歴史伝説館、五重塔が立つ妙宣寺まで。佐渡ならではの体験と自然、歴史を一日でめぐるプランです。島内は路線バスの本数が少ないため、レンタカーでの移動がおすすめです。";
const DESC_NEW =
  "直江津港から朝のカーフェリーで小木港へ渡り、レンタカーで島をめぐる日帰りプラン。トキに会えるトキの森公園と、五重塔の立つ妙宣寺をたずねたあと、船大工の集落・宿根木と小木民俗博物館で北前船の時代にふれ、矢島・経島の入り江を歩き、小木港でたらい舟に乗ります。船とレンタカーは春から秋(11月下旬まで)だけなので、運航日を公式で確かめましょう。";
const SEASONS_OLD = ["spring", "summer", "autumn", "winter"];
const SEASONS_NEW = ["spring", "summer", "autumn"];

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  toki:
    "直江津港から朝のカーフェリーで小木港へ渡ります。運航日と時刻は公式で確かめましょう。船を降りたら、港のそばでレンタカーを借りて(手続きに15分ほど)、車でおよそ37分、島の中ほどのトキの森公園に着きます。トキ資料展示館では、トキの保護の歴史や生態、飼育下で増やして野生に帰す取り組みを、多くの資料で紹介しています。展示館から続く観察回廊からは、となりの佐渡トキ保護センターで飼育されているトキの一部を見ることができ、トキふれあいプラザの大きなケージでは、飛んだり、えさを探したりする様子を間近で観察できます。平成11年(1999)に中国からつがいのトキが贈られてから飼育下での繁殖が進み、平成20年(2008)からは島の中での放鳥が続いています。3月から11月は無休で、冬には休園日があるので、休園日は公式で確かめましょう。この後は、車でおよそ18分、妙宣寺へ向かいましょう。",
  myosen:
    "トキの森公園から車でおよそ18分、妙宣寺に着きます。日蓮に仕えた遠藤為盛(阿佛房日得)が、1278年に妻の千日尼とともに自宅を寺として開いたのが始まりと伝わる、日蓮宗の佐渡三本山の一つです。かつては佐渡の守護代、本間氏の居城があった場所とされます。境内に立つ五重塔は、相川の宮大工の親子が手がけたもので、日光東照宮の五重塔を模したと伝わり、新潟県で唯一の五重塔とされています。" +
    PRAY +
    "この後は、車でおよそ9分、真野の町へ向かいましょう。",
  lunch: "妙宣寺から車でおよそ9分、真野の町に着きます。このあたりで昼食にしましょう。この後は、車でおよそ26分、島の南の宿根木へ向かいましょう。",
  shukunegi:
    "真野の町から車でおよそ26分、宿根木の集落に着きます。中世から港があり、江戸時代の後期から明治の初めにかけて、北前船の仕事で栄えた集落です。小さな入り江に面して、船板などを使った板壁の家が100棟あまり建て込み、国の重要伝統的建造物群保存地区に選ばれています。宿根木ならではの「石置木羽葺屋根」の家や、舟の形をした「三角家」が見られ、集落の家々が船の仕事とともに歩んだ歴史を今に伝えています。今も人が暮らす集落です。家の敷地に入ったり、住民の方を撮ったりせず、静かに歩きましょう。この後は、歩いておよそ3分、小木民俗博物館へ向かいましょう。",
  museum:
    "宿根木の集落から歩いておよそ3分、佐渡国小木民俗博物館に着きます。大正9年(1920)に建てられた宿根木小学校の木造校舎をそのまま使った、佐渡市の博物館です。小木のあたりの暮らしや海運にかかわる資料が並び、このうち「南佐渡の漁撈用具」と「船大工用具及び磯舟」は、国の重要有形民俗文化財に指定されています。となりの展示館には、江戸時代の史料をもとに実物大で復原された千石船「白山丸」があり、船の中にも入ることができます。開館は8:30〜17:00(入館は16:30まで)です。この後は、車でおよそ8分、矢島・経島へ向かいましょう。",
  yajima:
    "小木民俗博物館から車でおよそ8分、入り江に浮かぶ矢島・経島に着きます。2つの島は赤い太鼓橋でつながり、遊歩道から歩いて渡ることができます。矢島は質のよい矢竹がとれた島で、『平家物語』で源頼政がヌエを退治した矢も、矢島のものといわれます。経島は、日蓮の放免状を携えた弟子の日朗が嵐で流れ着き、お経を読んで一夜を明かしたことから、その名が付いたとされます。このあたりの海岸は「佐渡小木海岸」として、国の天然記念物と名勝に指定されています。この後は、車でおよそ9分、小木港へ向かいましょう。",
  tarai:
    "矢島・経島から車でおよそ9分、小木港のたらい舟の乗り場に着きます。たらい舟は、地元で「はんぎり(半切り)」とも呼ばれる、杉と竹で作られる小舟で、小木半島の人々の暮らしに欠かせない漁の道具でした。小木の海岸は、1802年の小木地震で2mほど隆起したといわれ、入り組んだ岩礁が続きます。小回りのきくたらい舟は、そうした岩場の磯で行う「磯ねぎ漁」に使われてきました。小木港の穏やかな海で、たらい舟に乗ることができます。営業時間は季節で変わるので、公式で確かめましょう。舟の上では船頭の案内に従い、揺れに気をつけましょう。旅を締めくくったら、小木港のそばで車を返し、船で帰りましょう。帰りの便の時刻は公式で確かめましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "トキの森公園(既存。1か所目へ。点 トキ資料展示館 way682819113、区間なし。書き出しに船・レンタカー・車37)",
    item: { id: TOKI, data: { lat: "38.037931", lng: "138.421946", visitTime: T(10, 52), stayDurationMin: 60, memo: M.toki, transitLegs: { deleteMany: {} } } },
  },
  {
    label: "妙宣寺(既存。点 way681764294、車18)",
    item: { id: MYOSEN, data: { lat: "37.97143", lng: "138.373107", visitTime: T(12, 10), stayDurationMin: 30, memo: M.myosen, transitLegs: L(["car", 18]) } },
  },
  {
    label: "真野の町のあたりで昼食(新規。点 バス停「真野新町」node11152068322、車9)",
    item: { create: { name: "真野の町のあたりで昼食", lat: "37.969751", lng: "138.347114", visitTime: T(12, 49), stayDurationMin: 40, memo: M.lunch, transitLegs: C(["car", 9]) } },
  },
  {
    label: "宿根木集落(既存。点 案内板「宿根木ガイドマップ」node9960873300、車26)",
    item: { id: SHUKUNEGI, data: { lat: "37.807389", lng: "138.243282", visitTime: T(13, 55), stayDurationMin: 50, memo: M.shukunegi, transitLegs: L(["car", 26]) } },
  },
  {
    label: "佐渡国小木民俗博物館(新規。点 tourism=museum way682917698、歩き3)",
    item: {
      create: {
        name: "佐渡国小木民俗博物館", address: "佐渡市宿根木270-2", lat: "37.807903", lng: "138.244934",
        visitTime: T(14, 48), stayDurationMin: 45, memo: M.museum, transitLegs: C(["walk", 3]),
      },
    },
  },
  {
    label: "矢島・経島(新規。点 tourism=attraction way683064233、車8)",
    item: { create: { name: "矢島・経島", address: "佐渡市小木町", lat: "37.807573", lng: "138.265847", visitTime: T(15, 41), stayDurationMin: 20, memo: M.yajima, transitLegs: C(["car", 8]) } },
  },
  {
    label: "たらい舟（小木港）(既存。最後へ。点 乗り場の建物 way682931421、車9、帰りの一文)",
    item: { id: TARAI, data: { lat: "37.814664", lng: "138.279579", visitTime: T(16, 10), stayDurationMin: 30, memo: M.tarai, transitLegs: L(["car", 9]) } },
  },
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
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節: ${SEASONS_OLD.join(",")} → ${SEASONS_NEW.join(",")}\n表紙: そのまま(たらい舟の写真)\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const lg = d.transitLegs as { create?: Leg[]; deleteMany?: object } | undefined;
    const legsStr = lg?.create ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : lg?.deleteMany ? "(区間を消す)" : "(区間なし)";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})`);
  console.log("  写真2枚(たらい舟・トキの森)はそのまま");
  console.log("\n  始まり 10:52(遠い場所の例外。小木港 9:50 着)/ 昼食 12:49(13:30より前)/ 終わり たらい舟 16:40(日帰りの 16:30〜17:00)/ 港 16:48、車を返して 16:58、出港 17:25 まで27分");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW, seasons: SEASONS_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
