/**
 * 泊まりのしおり初日・最終日の見直し（docs/specs/20261029-first-last-day-times.md）
 * チェックリスト #3 bbf0c72e（1泊2日・登山電車で紅葉の箱根へ。大涌谷・芦ノ湖をめぐる秋旅）
 *
 * 1日目: 箱根美術館を外し、彫刻の森美術館→箱根強羅公園→大涌谷→箱根ガラスの森美術館の
 *        4か所。11:10ごろ1か所目、16:50に出る
 * 2日目（1泊2日の最終日）: ユーザーの決定どおり変更なし
 *
 * 箱根美術館は、本文に「現在は改修工事のため休館しております」とあり、もともと見学できない
 * 案内だけのスポットだったため、時間を詰める対象として外した。あわせて説明文の
 * 「苔と紅葉の庭園」から「苔と」を外す（強羅公園に苔の庭はないため）
 *
 * 2026-10-29 企画運営・法務の指摘（1回目）を受けて見本を修正:
 * 1. 箱根湯本駅→彫刻の森駅の登山電車は、スイッチバックのため30〜41分ほどかかる
 *    （駅探の時刻表の例。時間帯で変わる）。もとの見本は「11時ごろ着→11:15」としていたが
 *    これでは短すぎたため、「箱根湯本駅に10時半ごろ着いたら」に変更し、彫刻の森美術館の
 *    到着を11:10（40分の見積もり）にした。移動の情報にも電車である旨を明記
 * 2. 初日に昼食がなかったため、箱根強羅公園のメモに昼食の一文を足し、滞在を45→60分に
 *    （+15分。強羅の駅周辺で昼食という前提）。この積み増し分、箱根ガラスの森美術館の
 *    滞在を75→60分に短縮し、16:50に出る形にした（大涌谷の滞在75分は変更していない）
 * 3. 箱根美術館を外したことで、しおりの表紙写真（箱根美術館、撮影者Hakone museum）の
 *    出典も消えるため、残るスポットの写真から大涌谷（撮影者663highland、CC BY 2.5）に
 *    差しかえた。大涌谷はタイトルにも名前のある見どころのため、表紙として適切と判断
 *    （特集「11月の3連休の紅葉」のSNS画像、確認済みX投稿の「表紙写真: Hakone museum」の
 *    行も変わるため、企画運営・法務に別途知らせた）
 * 4. 座標（けたの少ない点・度分秒からの換算とみられる点）をOSMの名前つきの点に直した:
 *    - 彫刻の森美術館: OSM node 5182750902（tourism=museum）35.244284,139.052083
 *      （もとの値は度分秒換算の丸め誤差とみられ、実際の点とは約45m離れていた）
 *    - 箱根強羅公園: OSM way 281489340（leisure=park）35.248639,139.045249
 *    - 箱根神社: OSM way 553740875（amenity=place_of_worship, Nominatimの中心）
 *      35.203973,139.025583（もとの値は約90mずれていた。法務の4点の指摘には
 *      入っていなかったが、独自に確認して見つけた）
 *    - 長安寺: OSM node 2525570245（amenity=place_of_worship）35.273470,139.012835
 *    - 仙石原すすき草原: 広い草原のため、境界の中心でなく、入口・案内の名前つきの点を
 *      使う（2026-10-29 法務の指摘で修正。最初に送ったway131014913は landuse=meadow
 *      の境界の中心だった）→ node 1436512588（tourism=viewpoint, name="すすきの草原"）
 *      35.260365,139.008836
 *    - 箱根海賊船（桃源台港）: OSM way 1221627057（amenity=ferry_terminal）
 *      35.237557,138.994573
 *    - 恩賜箱根公園・成川美術館: OSMの点（way 438040760・way 327550627）との差は
 *      数mのごく小さな丸め程度だったが、出典をそろえるため同じ値に更新した
 *    - 大涌谷・箱根ガラスの森美術館・箱根関所は、度分秒換算のチェックでも丸い値に
 *      ならず、問題なしと判断して変更していない
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

const ITINERARY_ID = "bbf0c72e-356a-4ba4-a0d8-d1079aa32493";
const DAY1_ID = "cf693c24-6aa4-4b74-9b19-53a4871b57e4";

const CHOKOKU = "8fa47c6b-ea71-4162-9c03-ebbc2346508c";
const HAKONE_MUSEUM = "a1006757-46c6-49d8-a052-bcb27d679b46"; // 削除
const GORA_PARK = "6a9dc7c0-ab28-4333-b93c-4f7f91cb5033";
const OWAKUDANI = "ac01a4ae-c0e5-466f-b682-9a724c6ab9e3";
const GLASS_FOREST = "57c8a329-1817-4024-bb49-c0d04e9da511";
const LALIQUE = "37c079f2-ffc5-4f37-ab59-2c5389ebf68d"; // 削除

const NAGAYASUJI = "95c763ee-5732-4215-98d1-c133aa947699";
const SUSUKI = "19d07854-41b6-46b6-8fdf-94b8afdbc767";
const KAIZOKUSEN = "a0c51b2c-7de1-4455-91bc-21baa59d13ca";
const HAKONE_JINJA = "4c0de086-5317-42f4-99c1-3b9e3267d717";
const ONSHI_PARK = "11e3a8ec-b84a-4a03-aa62-5d80948fe312";
const NARUKAWA = "2f06cbd6-0fbc-4578-a9b1-db46afb5233a";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const DESC_OLD =
  "箱根登山電車で強羅へ上り、苔と紅葉の庭園や大涌谷をめぐって強羅温泉に宿泊。2日目は仙石原の紅葉とすすき、海賊船で芦ノ湖を渡って箱根神社を訪ねる1泊2日プランです。例年の見頃は11月上旬〜下旬。乗り物を乗り継ぐ箱根ならではの周遊ルートです。";
const DESC_NEW =
  "箱根登山電車で強羅へ上り、紅葉の庭園や大涌谷をめぐって強羅温泉に宿泊。2日目は仙石原の紅葉とすすき、海賊船で芦ノ湖を渡って箱根神社を訪ねる1泊2日プランです。例年の見頃は11月上旬〜下旬。乗り物を乗り継ぐ箱根ならではの周遊ルートです。";

const THUMBNAIL_OLD =
  "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/koyo-2026/%25E7%25AE%25B1%25E6%25A0%25B9%25E7%25BE%258E%25E8%25A1%2593%25E9%25A4%25A8-xQjOwocMSM7vcl58zI5e5Vu66023zF.jpg";
const THUMBNAIL_NEW =
  "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/koyo-2026/%25E5%25A4%25A7%25E6%25B6%258C%25E8%25B0%25B7-GSbvqtakG1xhQPjm24S99cDCIqSg1l.jpg";

const CHOKOKU_MEMO_OLD =
  "紅葉の季節に箱根登山電車で向かうなら、彫刻の森駅からすぐの彫刻の森美術館から一日を始めましょう。昭和44年(1969)に開館した、日本で初めての野外美術館とされています。約7万平方メートルの敷地に、ロダンやヘンリー・ムーアといった巨匠たちの彫刻作品が箱根の自然の中に点在し、ピカソの作品を集めた「ピカソ館」も見どころの一つです。秋には、色づく木々と彫刻作品が織りなす景色も楽しめます。開放的な空間で、アートと自然が調和したひとときを過ごしてください。";
const CHOKOKU_MEMO_NEW =
  "箱根湯本駅に10時半ごろ着いたら、箱根登山電車で彫刻の森駅まで進みましょう（スイッチバックがあるため40分ほどかかります）。駅からすぐの彫刻の森美術館から一日を始めます。昭和44年(1969)に開館した、日本で初めての野外美術館とされています。約7万平方メートルの敷地に、ロダンやヘンリー・ムーアといった巨匠たちの彫刻作品が箱根の自然の中に点在し、ピカソの作品を集めた「ピカソ館」も見どころの一つです。秋には、色づく木々と彫刻作品が織りなす景色も楽しめます。開放的な空間で、アートと自然が調和したひとときを過ごしてください。";

const GORA_PARK_MEMO_OLD =
  "箱根美術館から歩いてすぐの箱根強羅公園は、大正3年（1914年）に開かれた、日本国内でもっとも歴史あるフランス式整型庭園です。上流階級の社交や保養の場として誕生した当初の面影を残しつつ、斜面地形をいかして噴水池や花壇を左右対称に配置した、幾何学的な庭園デザインが今に伝わっています。一般に開放されたのは戦後の1957年のことで、現在では公園全体が国登録記念物という文化財にも指定されています。園内では桜やつつじ、あじさいにバラと、一年を通じて何かしらの花が咲き誇り、秋になれば木々の紅葉も庭園に彩りを添えます。ガラス張りの『熱帯植物館』も見逃せないスポットで、日本にあるものとしては最古とされる大きなブーゲンビレアのほか、国内で初めて設けられたという熱帯ハーブの専門温室もあり、まるで南国を旅しているような気分にひたれます。花と緑を満喫したら、箱根を代表する火山地形、大涌谷へ向かいましょう。";
const GORA_PARK_MEMO_NEW =
  "彫刻の森美術館から箱根登山電車で強羅駅まで進み、駅から歩いて箱根強羅公園へ向かいましょう。大正3年（1914年）に開かれた、日本国内でもっとも歴史あるフランス式整型庭園です。上流階級の社交や保養の場として誕生した当初の面影を残しつつ、斜面地形をいかして噴水池や花壇を左右対称に配置した、幾何学的な庭園デザインが今に伝わっています。一般に開放されたのは戦後の1957年のことで、現在では公園全体が国登録記念物という文化財にも指定されています。園内では桜やつつじ、あじさいにバラと、一年を通じて何かしらの花が咲き誇り、秋になれば木々の紅葉も庭園に彩りを添えます。ガラス張りの『熱帯植物館』も見逃せないスポットで、日本にあるものとしては最古とされる大きなブーゲンビレアのほか、国内で初めて設けられたという熱帯ハーブの専門温室もあり、まるで南国を旅しているような気分にひたれます。強羅の駅周辺で昼食をとりましょう。花と緑を満喫したら、箱根を代表する火山地形、大涌谷へ向かいましょう。";

const GLASS_FOREST_MEMO_OLD =
  "大涌谷の火山景観を後にし、バスでおよそ25分、仙石原にある箱根ガラスの森美術館へ向かいましょう。ヴェネチアン・グラスの専門美術館で、大涌谷を望む庭園には、四季の花々と陽光にきらめくクリスタルガラスの作品が並びます。現代作家によるガラス作品を紹介する現代ガラス美術館のほか、ガラス作り体験ができる工房や、世界各国から集めたガラス製品を扱うミュージアムショップもあります。紅葉の庭園を眺めながら過ごす、優雅なひとときです。見学のあとは、すぐそばの箱根ラリック美術館へ向かいましょう。";
const GLASS_FOREST_MEMO_NEW =
  "大涌谷の火山景観を後にし、バスでおよそ25分、仙石原にある箱根ガラスの森美術館へ向かいましょう。ヴェネチアン・グラスの専門美術館で、大涌谷を望む庭園には、四季の花々と陽光にきらめくクリスタルガラスの作品が並びます。現代作家によるガラス作品を紹介する現代ガラス美術館のほか、ガラス作り体験ができる工房や、世界各国から集めたガラス製品を扱うミュージアムショップもあります。紅葉の庭園を眺めながら過ごす、優雅なひとときです。見学のあとは、強羅温泉へ向かいましょう。この夜は、強羅温泉の宿に泊まりましょう。";

const COORD_FIXES: { id: string; name: string; oldLat: string; oldLng: string; newLat: number; newLng: number }[] = [
  { id: CHOKOKU, name: "彫刻の森美術館", oldLat: "35.244719", oldLng: "139.051511", newLat: 35.244284, newLng: 139.052083 },
  { id: GORA_PARK, name: "箱根強羅公園", oldLat: "35.2486", oldLng: "139.0452", newLat: 35.248639, newLng: 139.045249 },
  { id: NAGAYASUJI, name: "長安寺", oldLat: "35.2735", oldLng: "139.0128", newLat: 35.27347, newLng: 139.012835 },
  { id: SUSUKI, name: "仙石原すすき草原", oldLat: "35.261", oldLng: "139.0065", newLat: 35.260365, newLng: 139.008836 },
  { id: KAIZOKUSEN, name: "箱根海賊船（桃源台港）", oldLat: "35.2376", oldLng: "138.9946", newLat: 35.237557, newLng: 138.994573 },
  { id: HAKONE_JINJA, name: "箱根神社", oldLat: "35.20475", oldLng: "139.025361", newLat: 35.203973, newLng: 139.025583 },
  { id: ONSHI_PARK, name: "恩賜箱根公園", oldLat: "35.196389", oldLng: "139.025917", newLat: 35.196324, newLng: 139.025957 },
  { id: NARUKAWA, name: "成川美術館", oldLat: "35.200028", oldLng: "139.031191", newLat: 35.200061, newLng: 139.031195 },
];

async function assertCurrentState() {
  const itinerary = await prisma.itinerary.findUnique({
    where: { id: ITINERARY_ID },
    select: { description: true, thumbnailUrl: true },
  });
  if (itinerary?.description !== DESC_OLD) {
    throw new Error(`description mismatch.\n現在値: ${itinerary?.description}`);
  }
  if (itinerary?.thumbnailUrl !== THUMBNAIL_OLD) {
    throw new Error(`thumbnailUrl mismatch.\n現在値: ${itinerary?.thumbnailUrl}`);
  }

  const spots = await prisma.spot.findMany({
    where: { id: { in: [CHOKOKU, GORA_PARK, OWAKUDANI, GLASS_FOREST, ...COORD_FIXES.map((f) => f.id)] } },
    select: { id: true, visitTime: true, stayDurationMin: true, memo: true, lat: true, lng: true },
  });
  const byId = new Map(spots.map((s) => [s.id, s]));

  const checks: [string, string, number, string][] = [
    [CHOKOKU, "09:00", 70, CHOKOKU_MEMO_OLD],
    [GORA_PARK, "10:50", 45, GORA_PARK_MEMO_OLD],
    [OWAKUDANI, "12:10", 75, ""],
    [GLASS_FOREST, "13:50", 80, GLASS_FOREST_MEMO_OLD],
  ];
  for (const [id, hhmm, stay, memo] of checks) {
    const s = byId.get(id);
    if (!s) throw new Error(`spot not found: ${id}`);
    const [h, m] = hhmm.split(":").map(Number);
    const expected = t(h, m).toISOString();
    if (s.visitTime?.toISOString() !== expected) {
      throw new Error(`${id}: visitTime mismatch. 現在値=${s.visitTime?.toISOString()} 期待値=${expected}`);
    }
    if (s.stayDurationMin !== stay) {
      throw new Error(`${id}: stayDurationMin mismatch. 現在値=${s.stayDurationMin} 期待値=${stay}`);
    }
    if (memo && s.memo !== memo) {
      throw new Error(`${id}: memo mismatch.\n現在値: ${s.memo}`);
    }
  }

  for (const f of COORD_FIXES) {
    const s = byId.get(f.id);
    if (!s) throw new Error(`spot not found: ${f.id}`);
    if (s.lat?.toString() !== f.oldLat || s.lng?.toString() !== f.oldLng) {
      throw new Error(`${f.name}(${f.id}): 座標が期待と不一致。現在値=${s.lat},${s.lng} 期待値=${f.oldLat},${f.oldLng}`);
    }
  }
}

async function main() {
  await assertCurrentState();
  console.log("前提の確認OK（現在のDBの値が期待どおり）。\n");

  console.log("===== 説明文・表紙 =====");
  console.log(`[説明文旧] ${DESC_OLD}\n[説明文新] ${DESC_NEW}\n`);
  console.log(`[表紙] 箱根美術館の写真 → 大涌谷の写真(663highland, CC BY 2.5)に変更\n`);

  console.log("===== 1日目 =====");
  console.log(`[削除] 箱根美術館(${HAKONE_MUSEUM})・箱根ラリック美術館(${LALIQUE})`);
  console.log(`[彫刻の森美術館] 09:00→11:10\n[旧memo] ${CHOKOKU_MEMO_OLD}\n[新memo] ${CHOKOKU_MEMO_NEW}\n`);
  console.log(`[箱根強羅公園] 10:50→12:35, stay45→60分（昼食の一文を追加。移動は彫刻の森美術館から電車5分+徒歩10分）\n[旧memo] ${GORA_PARK_MEMO_OLD}\n[新memo] ${GORA_PARK_MEMO_NEW}\n`);
  console.log(`[大涌谷] 12:10→14:10（変更なし: 滞在75分、移動はバス等35分のまま）\n`);
  console.log(`[箱根ガラスの森美術館] 13:50→15:50, stay80→60分（最後の行き先。16:50に出る。移動はバス25分のまま）\n[旧memo] ${GLASS_FOREST_MEMO_OLD}\n[新memo] ${GLASS_FOREST_MEMO_NEW}\n`);
  console.log("2日目は変更なし。");

  console.log("\n===== 座標の直し =====");
  for (const f of COORD_FIXES) {
    console.log(`[${f.name}] ${f.oldLat},${f.oldLng} → ${f.newLat},${f.newLng}`);
  }

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESC_NEW, thumbnailUrl: THUMBNAIL_NEW } });
    await setDaySpotOrder(
      DAY1_ID,
      [
        { id: CHOKOKU, data: { visitTime: t(11, 10), memo: CHOKOKU_MEMO_NEW, lat: 35.244284, lng: 139.052083 } },
        {
          id: GORA_PARK,
          data: {
            visitTime: t(12, 35),
            stayDurationMin: 60,
            memo: GORA_PARK_MEMO_NEW,
            lat: 35.248639,
            lng: 139.045249,
            transitLegs: {
              deleteMany: {},
              create: [
                { orderNo: 1, transitMode: "train", transitDurationMin: 5 },
                { orderNo: 2, transitMode: "walk", transitDurationMin: 10 },
              ],
            },
          },
        },
        { id: OWAKUDANI, data: { visitTime: t(14, 10) } },
        { id: GLASS_FOREST, data: { visitTime: t(15, 50), stayDurationMin: 60, memo: GLASS_FOREST_MEMO_NEW } },
      ],
      { remove: [HAKONE_MUSEUM, LALIQUE], tx }
    );

    for (const f of COORD_FIXES) {
      if ([CHOKOKU, GORA_PARK].includes(f.id)) continue; // 上のsetDaySpotOrderで反映済み
      await tx.spot.update({ where: { id: f.id }, data: { lat: f.newLat, lng: f.newLng } });
    }
  }, { timeout: 60000 });

  console.log("書き込みました。");
}

main().finally(() => prisma.$disconnect());
