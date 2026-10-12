/**
 * #63 1621a020（五箇山・白川郷）企画運営(12:51)・法務(12:50)の指摘6点をまとめて対応。
 *
 * 1) 野外博物館合掌造り民家園の座標が誤り(OSMの別の点「合掌村」を使っていた)。
 *    住所(岐阜県大野郡白川村荻町2499)から国土地理院・geocoding.jpで座標を取り直し
 *    (36.255081, 136.9023、荻町集落から庄川を渡った西側)、天守閣展望台との位置関係
 *    を訂正。順番も、明善寺(平地側)→民家園(坂を下り橋を渡る)→天守閣展望台(高台、
 *    最後)に組み替えた。
 * 2) 民家園は冬季(12〜2月)16:00閉館・最終入園15:40(公式で確認)。新しい順番なら
 *    14:39着・15:54までの滞在となり、冬でも間に合う。本文の「(有料・要予約)」から
 *    「有料」を削除。
 * 3) 新五箇山温泉ゆ～楽の90分(決まりA)を60分に戻し、宣伝寄りの食事処の一文を削除、
 *    「ご宿泊いただきます」→「宿へ向かいましょう」。空いた時間は、羽馬家住宅が
 *    内部非公開と判明したための調整とあわせ、五箇山和紙の里の滞在を120→152分に
 *    (紙すき体験は準備から仕上げまでおよそ1時間かかるとされ、3施設をめぐる複合
 *    施設としては妥当な長さと判断)。
 * 4) 羽馬家住宅は個人の住まいで内部非公開と判明。「中には入らず、外から静かに
 *    眺めてみてください」に本文を修正し、滞在も25→15分に。
 * 5) 相倉民俗館の「23棟」を、集落の本文・南砺市の観光サイトと同じ「20棟」に統一。
 * 6) 説明文「集落散策とは違う」を、相倉・菅沼・荻町を歩く今の中身に合わせて修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "1621a020-b8f3-41ff-bb67-270b99f0782d";
const DAY1_ID = "c9bcca21-0b20-4714-a6eb-acf09158ab7d";
const DAY2_ID = "85bec888-3775-474a-a81f-f41e3bf0f0e7";

const NEW_DESCRIPTION =
  "国指定重要文化財の合掌造り・岩瀬家の見学と、五箇山和紙の紙すき体験。相倉・菅沼・荻町の集落散策もあわせて、五箇山と白川郷の暮らしと手仕事を深く知る1泊2日です。";

const HABAKE_MEMO_NEW =
  "流刑小屋から歩いておよそ2分、羽馬家住宅に着きます。文化9年(1812)に材料の準備が始まり、文化11年(1814)に完成したと伝わる、五箇山でも古い部類に入る合掌家屋のひとつで、国の重要文化財に指定されています。今も個人の住まいとして使われており、内部は公開されていません。中には入らず、外から静かに眺めてみてください。この後は、車でおよそ10分、五箇山和紙の里へ向かいましょう。";

const WASHINOSATO_MEMO_NEW =
  "羽馬家住宅から車でおよそ10分、五箇山和紙の里に着きます。国の伝統的工芸品にも指定されている五箇山和紙の歴史や魅力を伝える「和紙工芸館」、実際に紙をすく体験ができる「和紙体験館」(体験には事前の予約が必要です。準備から仕上げまでおよそ1時間かかるとされています)、五箇山の歴史や産業を紹介する「たいら郷土館」の3つの施設が集まった複合施設です。五箇山和紙は江戸時代、加賀藩の手厚い保護のもとで発展してきました。丈夫で長持ちすることから、文化財の修復に用いられることもあるといわれています。合掌造りの屋根裏では、夏は塩硝づくりや養蚕、冬は紙すきと、季節に合わせた仕事が営まれてきたとされ、今日訪れた相倉や村上家の屋根の下にも、同じような暮らしの知恵が息づいていました。併設の食事処もあるので、ここで昼食にしましょう。時間をかけて、3つの施設をじっくりとめぐってみてください。この後は、車でおよそ4分、新五箇山温泉 ゆ～楽へ向かいましょう。";

const YURAKU_MEMO_NEW =
  "五箇山和紙の里から車でおよそ4分、庄川のほとりに立つ新五箇山温泉 ゆ～楽に着きます。地元の人々にも親しまれている日帰り温泉施設で、エメラルドグリーンに輝く庄川の流れを見下ろす露天風呂につかりながら、旅の疲れをゆっくりとほぐすことができます。浴室では撮影しないようにしましょう。訪れる前に、公式サイトで営業時間や休館日を確かめてください。今夜は平・上梨の宿へ向かいましょう。";

const AIKURA_MINZOKUKAN_FROM = "23棟の合掌造り家屋が今も残るこの集落は";
const AIKURA_MINZOKUKAN_TO = "20棟の合掌造り家屋が今も残るこの集落は";

const MEISENJI_TAIL_FROM = "この後は、坂道を上っておよそ12分、天守閣展望台へ向かいましょう。";
const MEISENJI_TAIL_TO = "この後は、歩いておよそ6分、野外博物館合掌造り民家園へ向かいましょう。";

const MINKAEN_MEMO_NEW =
  "明善寺から歩いておよそ6分、庄川を渡った先にある野外博物館合掌造り民家園に着きます。村内各地から移築した合掌造りをはじめ、25棟の建物を保存・公開する野外博物館で、主屋は屋根裏まで見学できるほか、水車小屋やお堂なども点在しています。期間限定で、そば打ちなどの体験(要予約)ができることもあります。冬季(12月〜2月)は営業時間が短くなるので、訪れる前に公式サイトで確かめてください。この後は、坂道を上っておよそ18分(シャトルバスも利用できます)、天守閣展望台へ向かいましょう。";

const TENSHUKAKU_MEMO_NEW =
  "野外博物館合掌造り民家園から、坂道を上っておよそ18分(シャトルバスも利用できます)、天守閣展望台に着きます。集落を見下ろす高台にあり、眼下に広がる合掌造りの家並みと、その向こうにそびえる白山連峰を一望できる、白川郷いちの眺めとして知られています。坂道は足元に気をつけて、ゆっくりと上りましょう。田んぼの緑や、雪におおわれた冬景色など、季節ごとに表情を変える集落の姿を、高いところからゆっくりと眺めてみてください。相倉・菅沼の集落から白川郷まで、五箇山と白川郷の合掌造りをめぐった1泊2日の旅を、ここで締めくくりましょう。お帰りは、白川郷ICから高速道路をご利用ください。";

async function main() {
  const day1Spots: SpotOrderItem[] = [
    { id: "5180d5bb-2cc0-494f-8c01-3ff1c8bd4a59", data: {} }, // 相倉合掌造り集落
    { id: "ea6b8c6f-301d-4c6b-bae9-5c081130d7f7", data: {} }, // 相倉民俗館(memoは別途置換)
    { id: "885aea12-01b6-43d2-82de-e0fa0b1c38e2", data: {} }, // 相倉伝統産業館
    { id: "2a21313a-a48c-4c1f-af68-872aa0601167", data: {} }, // 村上家
    { id: "4b2453bb-1890-4895-8260-89d6f890d6c6", data: {} }, // 白山宮
    { id: "45e6e8d9-23e6-457d-b745-7fa64300464d", data: { stayDurationMin: 30 } }, // 流刑小屋
    { id: "9f8162f8-fbf7-42f8-ad5e-10e41675b170", data: { memo: HABAKE_MEMO_NEW, visitTime: t(12, 30), stayDurationMin: 15 } }, // 羽馬家住宅
    { id: "8d1cead2-cb8d-4aec-af22-16e9d51dab3d", data: { memo: WASHINOSATO_MEMO_NEW, visitTime: t(12, 55), stayDurationMin: 152 } }, // 五箇山和紙の里
    { id: "ffb07e91-25b0-46e2-b71c-0b5e7a831a6d", data: { memo: YURAKU_MEMO_NEW, visitTime: t(15, 31), stayDurationMin: 60 } }, // ゆ～楽
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: "a24dc82a-de3a-40a8-8feb-ba6386cc5e09", data: {} }, // 菅沼合掌造り集落
    { id: "cd83508a-d202-4a62-b1f1-d8e1b2fae8f1", data: {} }, // 五箇山民俗館
    { id: "aeb77101-e9e5-4816-a623-c0f5dc707ae2", data: {} }, // 塩硝の館
    { id: "dbf5cc44-3ba1-4f69-9e50-01273f0c0ae8", data: {} }, // 岩瀬家
    { id: "0ee74b01-ba4e-4155-a6ac-f1811a6ed337", data: {} }, // 行徳寺
    { id: "e7e285ec-33b3-45aa-82a1-ba38226e7c85", data: {} }, // 白川郷荻町合掌造り集落
    { id: "b654e334-4caa-4129-9fed-4f28edf26d23", data: {} }, // 和田家
    { id: "0dbc877a-025a-4873-a676-eebf91862101", data: {} }, // 明善寺(memoは別途置換)
    {
      id: "11da6ece-6f64-407a-9f03-79c0f8a251ae",
      data: {
        memo: MINKAEN_MEMO_NEW,
        lat: 36.255081,
        lng: 136.9023,
        visitTime: t(14, 38),
        stayDurationMin: 75,
        transitMode: "walk",
        transitDurationMin: 6,
      },
    }, // 野外博物館合掌造り民家園(座標を実際の位置に修正)
    { id: "19955d06-9891-4fb9-bd45-936c4a48b554", data: { memo: TENSHUKAKU_MEMO_NEW, visitTime: t(16, 11), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 18 } }, // 天守閣展望台
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, order] of [[1, day1Spots], [2, day2Spots]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = d.stayDurationMin as number | undefined;
      if (!vt || st == null) continue;
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`D${n} ${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      prevEnd = s0 + st;
    }
  }

  const minzokukan = await findSpotInItinerary(ITIN, { spotName: "相倉民俗館" });
  if (!minzokukan.memo!.includes(AIKURA_MINZOKUKAN_FROM)) throw new Error("一致しません(相倉民俗館)");
  const newMinzokukanMemo = minzokukan.memo!.split(AIKURA_MINZOKUKAN_FROM).join(AIKURA_MINZOKUKAN_TO);
  console.log("相倉民俗館: OK(20棟に統一)");

  const meisenji = await findSpotInItinerary(ITIN, { spotName: "明善寺" });
  if (!meisenji.memo!.includes(MEISENJI_TAIL_FROM)) throw new Error("一致しません(明善寺)");
  const newMeisenjiMemo = meisenji.memo!.split(MEISENJI_TAIL_FROM).join(MEISENJI_TAIL_TO);
  console.log("明善寺: OK(結びを民家園へ)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITIN }, data: { description: NEW_DESCRIPTION } });
    await updateSpotInItinerary(ITIN, { spotId: minzokukan.id }, { memo: newMinzokukanMemo }, { tx });
    await updateSpotInItinerary(ITIN, { spotId: meisenji.id }, { memo: newMeisenjiMemo }, { tx });
    await setDaySpotOrder(DAY1_ID, day1Spots, { tx });
    await setDaySpotOrder(DAY2_ID, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
