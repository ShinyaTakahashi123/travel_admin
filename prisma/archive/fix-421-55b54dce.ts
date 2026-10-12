/**
 * チェックリスト #421 55b54dce「備中松山城と頼久寺、石火矢町の武家屋敷をめぐる日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 車の旅。備中松山城 →（車）頼久寺 → 石火矢町ふるさと村 → 紺屋川筋（昼食）→ 高梁市郷土資料館 →（車）吹屋ふるさと村 → 旧吹屋小学校（7か所 09:00〜16:35）
 * 既存の3か所はIDのまま、本文を一文ずつ確かめて書き直す（開いた公式で確かめられない記述は外す）:
 *   - 備中松山城: 築城の年と人物、天和の大改修、重要文化財の内訳、日本三大山城、ふいご峠からの道のりとシャトルバスは、開いたページで確かめられないので外す
 *   - 頼久寺: 公式どおり「暦応2年（1339年）に足利尊氏が安国寺として建立」に。「白砂で海を表し」は公式の「海原を表現したサツキの大刈込」と合わないので直す。
 *     臨済宗・慶長10年ごろは確かめられないので外す
 * 既存の写真（城・頼久寺・石火矢町）は目で見て合っているので残す
 * 本文の出典（高梁市観光協会 https://takahasikanko.or.jp/modules/spot/index.php?content_id=N）: 備中松山城 1／頼久寺庭園 2／旧埴原家 4／石火矢町ふるさと村 57／
 *   紺屋川筋 55／郷土資料館 6／吹屋ふるさと村 21／旧吹屋小学校 50
 * 座標の出典: Nominatim（備中松山城 34.8087058,133.6221468／頼久寺 34.7973074,133.6190733／高梁市郷土資料館 34.7946902,133.6178613／
 *   吹屋ふるさと村 34.8596206,133.4711301／旧吹屋小学校 34.8629595,133.4705455）、OSM/Overpass（石火矢町 34.7992924,133.6182269／
 *   紺屋川筋は川沿いの高梁基督教会堂の点 34.7962277,133.6177665）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-421-55b54dce.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "55b54dce-3c63-4e62-b3c7-bf046d449f0f";
const DAY1_ID = "529633f5-824c-4333-93a4-6f5d6c8d8207";
const CASTLE_ID = "c2145e12-0de5-49fb-9a4f-f4de1c1e6b8c";
const RAIKYUJI_ID = "cac63fcb-3e5f-4395-a388-d87ba3d35a95";
const ISHIBIYA_ID = "66962e02-e546-4e1c-9ef5-3181b4b43922";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "現存12天守で唯一の山城とされる備中松山城から、小堀遠州ゆかりの庭園がある頼久寺、武家屋敷が連なる石火矢町ふるさと村、桜と柳の並木が続く紺屋川筋まで、高梁の城下町を歩きます。午後は車で、赤銅色の石州瓦とベンガラ色の町並みが続く吹屋ふるさと村へ。城下町とベンガラの町をめぐる日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  upd(CASTLE_ID, 9, 0, 90, null, null, 34.808706, 133.622147,
    "国の重要文化財で、「現存12天守」の一つ。天守が現存する唯一の山城とされています。標高430mの臥牛山小松山の山頂にそびえ、秋から春先にかけて、特に10月・11月には、雲海に包まれる幻想的な姿を見られることもあり、「天空の山城」とも呼ばれて親しまれています。平成30年7月豪雨のあとに住み着いた猫が「猫城主さんじゅーろー」として人気を集めていることでも知られます。山の上の城なので、歩きやすい靴で出かけましょう。駐車場や行き方は時期によって変わることがあるので、公式の案内で確かめてください。"),
  upd(RAIKYUJI_ID, 10, 50, 40, "car", 20, 34.797307, 133.619073,
    "備中松山城から車で約20分。暦応2年（1339年）に足利尊氏が安国寺として建立した禅寺です。庭園は国指定の名勝で、茶人で作庭家としても知られる小堀遠州の初期の作庭と伝えられています。鶴と亀を模した石組み（鶴亀の庭）や、海原を表現したサツキの大刈込があり、縁側からは愛宕山が借景として庭に生かされています。春はサツキ、秋は紅葉と、季節ごとに違う表情を楽しめます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  upd(ISHIBIYA_ID, 11, 35, 40, "walk", 5, 34.799292, 133.618227,
    "頼久寺から歩いてすぐ。備中松山城が建つ臥牛山の南麓に広がる城下町のうち、武家の町として営まれた石火矢町には、今も格式ある門構えの武家屋敷が250mにわたって立ち並び、岡山県のふるさと村に指定されています。通りの両脇には白壁の長屋門や土壁が続きます。通りの一角で公開されている旧埴原家は、江戸時代中期から後期にかけて近習役や番頭役などを務めた武士の住宅で、寺院建築や数寄屋風の要素を取り入れた珍しい造りから、市の重要文化財に指定されています。"),
  cre("紺屋川筋（昼食）", 12, 25, 60, "walk", 10, 34.796228, 133.617767, "岡山県高梁市鍜冶町",
    "石火矢町から歩いて約10分。高梁川に流れ込む紺屋川は、かつて備中松山城の外堀の役割を果たしていました。河畔には桜と柳の並木道が続き、県下最古の教会とされる高梁基督教会堂や、藩校有終館の跡などがあって、「日本の道100選」にも選ばれています。まわりの町なかで昼食にしましょう。"),
  cre("高梁市郷土資料館", 13, 30, 35, "walk", 5, 34.79469, 133.617861, "岡山県高梁市向町21",
    "紺屋川筋から歩いてすぐ。旧高梁小学校の本館を資料館にした施設で、本館は明治37年に建てられた洋風の木造建築です。2階の、樅材を使った節のない正目の格天井は見ごたえがあります。今では見かけなくなった珍しい農機具など、約3,000点の民具を展示しています。"),
  cre("吹屋ふるさと村", 14, 45, 60, "car", 40, 34.859621, 133.47113, "岡山県高梁市成羽町吹屋",
    "高梁の町から車で約40分。赤銅色の石州瓦とベンガラ色の外観で統一された町並みが整然と続く、江戸末期から明治にかけて吹屋の長者たちが残した町です。旦那衆が相談して石州（今の島根県）から宮大工の棟梁たちを招き、町全体を統一した考えのもとに建てたといわれます。岡山県のふるさと村、国の重要伝統的建造物群保存地区に選ばれ、「『ジャパンレッド』発祥の地～弁柄と銅の町・備中吹屋～」として日本遺産にも認定されています。"),
  cre("旧吹屋小学校", 15, 50, 40, "walk", 5, 34.86296, 133.470546, "岡山県高梁市成羽町吹屋1290-1",
    "町並みから歩いてすぐ。明治6年（1873年）に開校し、明治33年（1900年）に木造平屋建ての東校舎・西校舎が落成した学校で、2012年3月まで、現役最古の木造校舎として使われていたとされます。岡山県の重要文化財で、保存修理工事を経て再公開されました。公開の時間は公式の案内で確かめてから訪れましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${CASTLE_ID},${RAIKYUJI_ID},${ISHIBIYA_ID}`) throw new Error("構成が想定と違います");
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
