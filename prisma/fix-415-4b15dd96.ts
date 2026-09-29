/**
 * チェックリスト #415 4b15dd96「弘前れんが倉庫美術館と藤田記念庭園、アートと庭園を巡るプラン」の見直し（しおりえ(制作補助2)）
 * 歩きの旅。弘前れんが倉庫美術館 → 最勝院五重塔 → 長勝寺（禅林街）→ 藤田記念庭園（昼食）→ 弘前公園（弘前城）→ 旧弘前市立図書館 → 旧東奥義塾外人教師館 → 弘前市立観光館・山車展示館（8か所 09:00〜16:40）
 * 長勝寺は16時までで冬の間は休館なので午前に。弘前城天守は保存修理で内部公開を休止しているので、その旨を本文に（日付は書かない）
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、確かめられない記述もあったので書き直す）。タイトルは内容に合っているのでそのまま
 * 美術館の座標（40.6053,140.4661）は約800m離れていたので OSM の点に直す。既存の写真（美術館の外観・庭園）は目で見て合っているので残す
 * 本文の出典（弘前観光コンベンション協会）: 美術館 https://www.hirosaki-kanko.or.jp/details.html?id=CNT00403311620143766 ／最勝院五重塔 ?id=API00100000021 ／
 *   長勝寺 ?id=API00100000020 ／藤田記念庭園 ?id=CNT00403311739456075 ／弘前公園 ?id=API00100002197 ／弘前城天守 ?id=CNT00403311729226724 ／
 *   旧弘前市立図書館 ?id=API00100000023 ／旧東奥義塾外人教師館 ?id=CNT00403281507467095 ／観光館・山車展示館 ?id=CNT00403311722218655
 * 座標の出典: OSM/Overpass（れんが倉庫美術館 relation 40.5980415,140.4728018）、Nominatim（最勝院 40.5965849,140.4686445／長勝寺 40.5987207,140.4507090／
 *   藤田記念庭園 40.6040352,140.4603670／弘前城 40.6079291,140.4636605／旧弘前市立図書館 40.6027017,140.4658439／旧東奥義塾外人教師館 40.6027370,140.4661902／
 *   弘前市立観光館 40.6031238,140.4653187）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-415-4b15dd96.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4b15dd96-716f-4925-bfe3-86275452108e";
const DAY1_ID = "f1be12a6-4995-4c32-85d5-f6b4f7b095de";
const MUSEUM_ID = "08a52b3e-59f0-47a5-ac74-f1e1dd9ff818";
const GARDEN_ID = "5e6591e0-4aaf-4102-bba3-4cbba6d9c5e5";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "煉瓦倉庫を生まれ変わらせた弘前れんが倉庫美術館で現代アートにふれ、最勝院の五重塔と、津軽家の菩提寺・長勝寺が建つ禅林街へ。岩木山を望む藤田記念庭園で昼食をとり、弘前城のある弘前公園を歩いたら、明治の洋館や津軽塗・山車の展示をめぐる、弘前のアートと庭園、歴史ある建物を楽しむ日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string, extra: Record<string, unknown> = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  upd(MUSEUM_ID, 9, 0, 70, null, null, 40.598042, 140.472802,
    "明治・大正期に建てられ、弘前の風景をつくってきた吉野町煉瓦倉庫を改修して、2020年に開館した美術館です。「記憶の継承」と「風景の創生」をコンセプトに、築100年を超える煉瓦造の建物本来の姿を生かしながら、現代アートの展示空間へと生まれ変わらせました。弘前や東北の歴史・文化を受け継ぎつつ、この土地や建物に呼応する国内外のアーティストの作品を紹介しています。休館日や開館時間は季節で変わるので、公式の案内で確かめてから訪れましょう。"),
  cre("最勝院五重塔", 10, 20, 30, "walk", 10, 40.596585, 140.468645, "青森県弘前市銅屋町63",
    "美術館から歩いて約10分。3代藩主の信義が計画し、明暦2年に着工、寛文7年に完成した五重塔で、東北一の美塔といわれています。釘を使わずに江戸時代に建てられ、国の重要文化財に指定されています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  cre("長勝寺（禅林街）", 11, 10, 45, "walk", 20, 40.598721, 140.450709, "青森県弘前市西茂森1-23-8",
    "最勝院から歩いて約20分。曹洞宗の寺が並ぶ禅林街の奥にある、津軽家最初の菩提寺です。津軽家の先祖・大浦光信の死後、その子の盛信が父のために創建し、慶長15年（1610年）に2代信枚が弘前城の築城とともに今の地に移したとされています。境内には鎌倉時代の梵鐘や、歴代藩主と奥方の霊廟、蒼龍窟の五百羅漢などがあります。冬の間は休館するので、公式の案内で確かめてから訪れましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  upd(GARDEN_ID, 12, 15, 75, "walk", 20, 40.604035, 140.460367,
    "長勝寺から歩いて約20分。大正8年に、日本商工会議所の初代会頭・藤田謙一氏が邸宅を構える際、東京から庭師を招いてつくらせた江戸風の庭園で、弘前市が市制100周年を記念して整備し、開園しました。高さ13mの崖をはさんで、岩木山を望む借景式の高台部と、池を中心にした池泉回遊式の低地部に分かれています。高台部の洋館や日本間などは、大正時代をしのぶ貴重な建物です。洋館には喫茶室もあるので、ここで昼食にしましょう。",
    { name: "藤田記念庭園（昼食）" }),
  cre("弘前公園（弘前城）", 13, 35, 75, "walk", 5, 40.607929, 140.463661, "青森県弘前市大字下白銀町1",
    "藤田記念庭園から歩いてすぐ。弘前藩2代藩主・津軽信枚が1611年（慶長16年）に築いた弘前城のある公園で、400年を経て今も残る天守、3つの櫓、5つの城門は国の重要文化財です。今の三層の天守は、江戸時代に造られた天守としては東北で唯一とされています。天守は保存修理のため内部の公開を休止しているので、外からその姿を眺めましょう。桜や紅葉の名所としても知られています。"),
  cre("旧弘前市立図書館", 15, 0, 20, "walk", 10, 40.602702, 140.465844, "青森県弘前市下白銀町2-1",
    "弘前公園から歩いて約10分、追手門広場にある洋館です。明治39年に日露戦争の戦勝記念として建てられ、昭和6年まで市立図書館として使われました。八角形の双塔をもつ、ルネッサンス様式の木造モルタル3階建てです。"),
  cre("旧東奥義塾外人教師館", 15, 25, 30, "walk", 5, 40.602737, 140.46619, "青森県弘前市下白銀町2-1",
    "旧弘前市立図書館のとなり。明治5年に県内で最初に開校した私学校・東奥義塾に招かれた外国人宣教師のための館で、明治33年（1900年）にアメリカのメソジスト・ミッションボードが設計し、堀江佐吉らが建てました。煙突やベイウィンドウが味わい深く、内部は当時の生活を再現しています。1階には喫茶店もあります。"),
  cre("弘前市立観光館・山車展示館", 16, 0, 40, "walk", 5, 40.603124, 140.465319, "青森県弘前市下白銀町2-1",
    "追手門広場にある観光の拠点です。弘前ねぷたが飾られた1階にはお土産コーナーがあり、2階では津軽塗が下地から完成するまでの48の工程を分かりやすく展示しています。となりの山車展示館では、藩政時代から続く弘前八幡宮の祭礼の山車7台と、津軽剛情張大太鼓を見られます。旅の最後に、お土産を選びましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${MUSEUM_ID},${GARDEN_ID}`) throw new Error("構成が想定と違います");
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
