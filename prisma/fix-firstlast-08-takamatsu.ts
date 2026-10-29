/**
 * e9a900e3（高松・松山3泊4日）初日・最終日の見直し（2026-10-30）
 * 仕様: docs/specs/20261029-first-last-day-times.md
 * - 初日(Day1): 1か所目11時ごろ(10:45〜11:45)、16:30〜17:00に最後の行き先を出る、3か所以上
 * - 中の日(Day2・Day3): 直さない
 * - 最終日・2泊以上(Day4): 9時ごろ(今と同じ)、14:30〜15:00に最後の行き先を出る、3か所以上
 *
 * 初日: サンポート高松・北浜alleyを外し、タイトル・説明文の見どころ（栗林公園・高松中央
 * 商店街・香川県立ミュージアム・高松城跡・せとしるべ）の5か所に組み直す。説明文から
 * 「北浜alley」の記述を削除。移動はOSRM(routing.openstreetmap.de/routed-foot)の
 * 道のりルーティングで算出（既存区間もすべて測り直し）。
 *
 * 入口（企画運営・法務指摘で直し）: 1か所目＝入口に着く時刻＋移動。「高松駅に10時30分
 * ごろ着いたら、電車で栗林公園北口駅まで」とし、電車＋駅から公園までの徒歩をあわせて
 * 栗林公園11:45ではなく、着く時刻は従来どおり10:45とする（電車5〜9分+徒歩7分の幅を
 * 踏まえ、10:30+15分=10:45で合う）。
 *
 * 昼食（初日）: 高松中央商店街のメモにもともと「ここで昼食にしましょう」とあるため、
 * そのまま活かす。
 *
 * 最終日: 坊っちゃんからくり時計・宝厳寺を外し、タイトル・説明文の見どころ（石手寺・
 * 道後公園・伊佐爾波神社・道後温泉本館）と松山市立子規記念博物館を残した5か所に組み直す。
 * からくり時計のメモにあった昼食（道後商店街）の一文は、子規記念博物館のメモに移した。
 * 1か所目（石手寺）の時刻は、最終日の決まりどおり9:00のまま変更しない。
 *
 * 座標の直し（7章の決まり。企画運営・法務の全確認でOSM/Nominatimの値に）:
 * - 栗林公園: 広い庭園のため、面の中心(旧way 60252671)ではなく、北口駅から入る形に
 *   あわせた北門（#147と同じ方式）node 13329557001「北門入園券売場」を使う
 * - 高松中央商店街: メモが特に触れる丸亀町のガラスドームにあわせ、丸亀町商店街
 *   (OSM way 62159669)の点に（現在値は8つの商店街の中のどこでもない、やや離れた点だった）
 * - 香川県立ミュージアム・高松城跡（玉藻公園）・せとしるべは、いずれもOSM/Nominatimの値と
 *   ほぼ完全一致のため変更なし
 * - ロープウェー商店街・大街道（Day3、時刻は変更なし）: けたが少ない点だったため、
 *   OSM way 237265571「大街道」の値に
 * - 松山市立子規記念博物館（Day4）: 度分秒換算の形だったため、OSM node 1423739411の値に
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

// Day1
const RITSURIN = "4c762654-c5d6-4604-8fa6-142bf1b45a8e";
const SHOTENGAI = "9d820dff-3c1c-467a-b16b-ff544e34f3c8";
const MUSEUM = "24c3d1b8-f08c-46bd-baff-c169b81f8ec1";
const CASTLE = "57cb4763-b2b1-4dab-bb13-fe6305eec172";
const KITAHAMA = "9788e118-c590-4655-bda1-46d628d32a50"; // 削除
const SUNPORT = "a2bf0ff5-2851-4ac9-a361-f9f1eef5aea2"; // 削除
const SETOSHIRUBE = "9dbc72af-9dcd-49e0-94ce-4f5fa7dcc3aa";

// Day3（座標のみ）
const OHKAIDO = "4663218f-4705-45a8-b90a-11e5d48bf1c1";

// Day4
const ISHITEJI = "fa0d3fbb-63f1-4699-a45b-75e4c3190e07";
const DOGOKOEN = "d39003a0-a0e4-41ab-9923-35810ab1774e";
const SHIKI = "14b3e747-cebe-45ca-a54a-81167e85ae68";
const KARAKURI = "ed8069c9-425e-4dec-8365-2d27bd84fb57"; // 削除
const HOGONJI = "8507ca18-4547-40a0-b656-a60a47a6cd86"; // 削除
const ISANIWA = "465b1908-d5e6-4b02-bc7a-03b1c23fd30c";
const DOGOHONKAN = "11215e4d-a3f9-4a46-9837-282ac01829f0";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const DESC_OLD =
  "1日目は特別名勝・栗林公園から高松の商店街、県立ミュージアム、海の城・高松城跡、北浜alley、港のガラスの灯台へ。2日目は琴平の高燈籠と金丸座、785段の石段のこんぴらさん、弘法大師ゆかりの善通寺、石垣の丸亀城をめぐり、特急で松山へ。3日目は松山城と萬翠荘、坂の上の雲ミュージアムなど子規・漱石ゆかりの地を歩き、4日目は石手寺から道後公園、伊佐爾波神社をめぐって道後温泉本館へ。電車でめぐる高松・松山の3泊4日です。";
const DESC_NEW =
  "1日目は特別名勝・栗林公園から高松の商店街、県立ミュージアム、海の城・高松城跡、港のガラスの灯台へ。2日目は琴平の高燈籠と金丸座、785段の石段のこんぴらさん、弘法大師ゆかりの善通寺、石垣の丸亀城をめぐり、特急で松山へ。3日目は松山城と萬翠荘、坂の上の雲ミュージアムなど子規・漱石ゆかりの地を歩き、4日目は石手寺から道後公園、伊佐爾波神社をめぐって道後温泉本館へ。電車でめぐる高松・松山の3泊4日です。";

// ===== Day1 memo =====
const RITSURIN_MEMO_OLD =
  "高松の旅は、JR栗林公園北口駅から歩いてすぐの栗林公園から始めます。紫雲山を背景に、6つの池と13の築山を配した回遊式の大名庭園で、江戸時代に高松藩の歴代藩主が手を加えて完成させたといわれ、国の特別名勝に指定されています。池と松がつくる景色を眺めながら、ゆっくり歩きましょう。池のまわりでは足元に気をつけてください。";
const RITSURIN_MEMO_NEW =
  "高松駅に10時30分ごろ着いたら、電車で栗林公園北口駅まで進みましょう。高松の旅は、駅から歩いてすぐの栗林公園から始めます。紫雲山を背景に、6つの池と13の築山を配した回遊式の大名庭園で、江戸時代に高松藩の歴代藩主が手を加えて完成させたといわれ、国の特別名勝に指定されています。池と松がつくる景色を眺めながら、ゆっくり歩きましょう。池のまわりでは足元に気をつけましょう。";

const SHOTENGAI_MEMO_OLD =
  "栗林公園から北へ歩いて約20分。高松城の城下町として発展してきた商店街で、兵庫町・片原町・丸亀町・南新町など8つの商店街がつながり、アーケードの総延長は約2.7kmに及びます。丸亀町の広場には、高さ約32mのガラス張りのドームが立ちます。讃岐うどんの店も多いので、通りを歩きながら、ここで昼食にしましょう。";
const SHOTENGAI_MEMO_NEW =
  "栗林公園から北へ歩いて約27分。高松城の城下町として発展してきた商店街で、兵庫町・片原町・丸亀町・南新町など8つの商店街がつながり、アーケードの総延長は約2.7kmに及びます。丸亀町の広場には、高さ約32mのガラス張りのドームが立ちます。讃岐うどんの店も多いので、通りを歩きながら、ここで昼食にしましょう。";

const MUSEUM_MEMO_OLD =
  "商店街から北へ歩いて約15分。歴史博物館と美術館が一体になった県立のミュージアムで、古代から近代までの香川の歩みをたどる展示や、香川ゆかりの作家の美術作品を見られます。香川出身の弘法大師空海の生涯を、絵巻の流れに沿って紹介するコーナーもあります。明日訪ねる善通寺の背景を知っておきましょう。休館日は公式の案内で確かめてください。";
const MUSEUM_MEMO_NEW =
  "商店街から北へ歩いて約9分。歴史博物館と美術館が一体になった県立のミュージアムで、古代から近代までの香川の歩みをたどる展示や、香川ゆかりの作家の美術作品を見られます。香川出身の弘法大師空海の生涯を、絵巻の流れに沿って紹介するコーナーもあります。明日訪ねる善通寺の背景を知っておきましょう。休館日は公式の案内で確かめましょう。";

const SETOSHIRUBE_MEMO_OLD =
  "サンポートから海沿いの防波堤を歩いて約15分、防波堤の先に立つ赤い灯台です。1998年に明かりがともされた高さ約14mの灯台で、半透明のガラスブロックを積み上げてつくられた、世界で初めてのガラスの灯台とされています。夜は内側から赤く光ります。防波堤の上は海風が強い日もあるので、足元に気をつけて歩きましょう。歩いて高松駅の方へ戻り、今夜は高松に泊まります。";
const SETOSHIRUBE_MEMO_NEW =
  "高松城跡から歩いて約17分、防波堤の先に立つ赤い灯台です。1998年に明かりがともされた高さ約14mの灯台で、半透明のガラスブロックを積み上げてつくられた、世界で初めてのガラスの灯台とされています。夜は内側から赤く光ります。防波堤の上は海風が強い日もあるので、足元に気をつけて歩きましょう。歩いて高松駅の方へ戻り、今夜は高松に泊まります。";

// ===== Day4 memo =====
const DOGOKOEN_MEMO_OLD =
  "石手寺から道後へ歩いて戻り、約20分の道後公園へ。中世に伊予国を治めた河野氏の居城の跡で、14世紀の初めから16世紀の後半までのおよそ250年間続いた城とされています。約8.5ヘクタールの円形の敷地が国の史跡として残され、土塁や堀のほか、発掘調査をもとに復元された武家屋敷も見学できます。堀のそばでは足元に気をつけましょう。";
const DOGOKOEN_MEMO_NEW =
  "石手寺から道後へ歩いて戻り、約13分の道後公園へ。中世に伊予国を治めた河野氏の居城の跡で、14世紀の初めから16世紀の後半までのおよそ250年間続いた城とされています。約8.5ヘクタールの円形の敷地が国の史跡として残され、土塁や堀のほか、発掘調査をもとに復元された武家屋敷も見学できます。堀のそばでは足元に気をつけましょう。";

const SHIKI_MEMO_OLD =
  "道後公園の北の角にある、正岡子規を中心に松山ゆかりの文人たちの足跡をたどる文学博物館で、昭和56年（1981年）に開館しました。子規の生涯や、彼が目指した文学の世界を紹介する常設展示のほか、子規と夏目漱石が一時期ともに暮らした下宿「愚陀佛庵」の一部を再現した展示も見られます。昨日訪ねた愚陀佛庵とあわせて味わいましょう。休館日は公式の案内で確かめてください。";
const SHIKI_MEMO_NEW =
  "道後公園の北の角にある、正岡子規を中心に松山ゆかりの文人たちの足跡をたどる文学博物館で、昭和56年（1981年）に開館しました。子規の生涯や、彼が目指した文学の世界を紹介する常設展示のほか、子規と夏目漱石が一時期ともに暮らした下宿「愚陀佛庵」の一部を再現した展示も見られます。昨日訪ねた愚陀佛庵とあわせて味わいましょう。休館日は公式の案内で確かめましょう。見学を終えたら、道後商店街で昼食をとりましょう。";

const ISANIWA_MEMO_OLD =
  "宝厳寺から歩いて約5分。道後温泉を見下ろす長い石段の上に立つ神社で、10世紀の書物にもその名が見える古社です。今の社殿は寛文7年（1667年）、松山藩主・松平定長が建て替えたもので、京都の石清水八幡宮を模した「八幡造」の建築として、国の重要文化財に指定されています。社殿の前からは、道後の町並みを見渡せます。石段は急なので、足元に気をつけて上りましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const ISANIWA_MEMO_NEW =
  "道後商店街から歩いておよそ7分、伊佐爾波神社に着きます。道後温泉を見下ろす長い石段の上に立つ神社で、10世紀の書物にもその名が見える古社です。今の社殿は寛文7年（1667年）、松山藩主・松平定長が建て替えたもので、京都の石清水八幡宮を模した「八幡造」の建築として、国の重要文化財に指定されています。社殿の前からは、道後の町並みを見渡せます。石段は急なので、足元に気をつけて上りましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DOGOHONKAN_MEMO_OLD =
  "神社の石段を下りて、旅の最後は道後温泉本館へ。日本最古の温泉ともいわれる道後温泉の象徴の建物で、明治27年（1894年）に建てられた木造3階建ての本館は、国の重要文化財です。夏目漱石は小説『坊っちゃん』で、この温泉を「住田の温泉」として登場させました。令和6年（2024年）には、6年に及ぶ保存修理を終えて全館で営業を再開しています。日帰り入浴で、伝統の湯につかりましょう。ほかの入浴客を撮らないようにし、長湯に気をつけましょう。帰りは道後温泉駅から路面電車で松山市駅やJR松山駅へ。4日間の高松・松山の旅はここまでです。";
const DOGOHONKAN_MEMO_NEW =
  "神社の石段を下りて、旅の最後は道後温泉本館へ。日本最古の温泉ともいわれる道後温泉の象徴の建物で、明治27年（1894年）に建てられた木造3階建ての本館は、国の重要文化財です。夏目漱石は小説『坊っちゃん』で、この温泉を「住田の温泉」として登場させました。令和6年（2024年）には、6年に及ぶ保存修理を終えて全館で営業を再開しています。日帰り入浴で、伝統の湯につかりましょう。ほかの入浴客を撮らないようにし、長湯を避けて、こまめに水分をとりましょう。帰りは道後温泉駅から路面電車で松山市駅やJR松山駅へ。4日間の高松・松山の旅はここまでです。";

async function main() {
  const itinerary = await prisma.itinerary.findUniqueOrThrow({
    where: { id: "e9a900e3-b17f-4078-bea9-406de0c438d6" },
    include: { days: { orderBy: { dayNumber: "asc" } } },
  });
  const day1 = itinerary.days.find((d) => d.dayNumber === 1);
  const day4 = itinerary.days.find((d) => d.dayNumber === 4);
  if (!day1 || !day4) throw new Error("day1/day4 not found");

  if (itinerary.description !== DESC_OLD) throw new Error("description現在値が期待と不一致");

  const spots = await prisma.spot.findMany({
    where: { id: { in: [RITSURIN, SHOTENGAI, MUSEUM, SETOSHIRUBE, OHKAIDO, DOGOKOEN, SHIKI, ISANIWA, DOGOHONKAN] } },
  });
  const byId = new Map(spots.map((s) => [s.id, s]));
  const ritsurin = byId.get(RITSURIN)!;
  const shotengai = byId.get(SHOTENGAI)!;
  const museum = byId.get(MUSEUM)!;
  const setoshirube = byId.get(SETOSHIRUBE)!;
  const ohkaido = byId.get(OHKAIDO)!;
  const dogokoen = byId.get(DOGOKOEN)!;
  const shiki = byId.get(SHIKI)!;
  const isaniwa = byId.get(ISANIWA)!;
  const dogohonkan = byId.get(DOGOHONKAN)!;

  if (ritsurin.memo !== RITSURIN_MEMO_OLD) throw new Error("栗林公園: memo現在値が期待と不一致");
  if (shotengai.memo !== SHOTENGAI_MEMO_OLD) throw new Error("高松中央商店街: memo現在値が期待と不一致");
  if (museum.memo !== MUSEUM_MEMO_OLD) throw new Error("香川県立ミュージアム: memo現在値が期待と不一致");
  if (setoshirube.memo !== SETOSHIRUBE_MEMO_OLD) throw new Error("せとしるべ: memo現在値が期待と不一致");
  if (dogokoen.memo !== DOGOKOEN_MEMO_OLD) throw new Error("道後公園: memo現在値が期待と不一致");
  if (shiki.memo !== SHIKI_MEMO_OLD) throw new Error("子規記念博物館: memo現在値が期待と不一致");
  if (isaniwa.memo !== ISANIWA_MEMO_OLD) throw new Error("伊佐爾波神社: memo現在値が期待と不一致");
  if (dogohonkan.memo !== DOGOHONKAN_MEMO_OLD) throw new Error("道後温泉本館: memo現在値が期待と不一致");
  if (ritsurin.lat?.toString() !== "34.330333" || ritsurin.lng?.toString() !== "134.044403") {
    throw new Error(`栗林公園: 座標現在値が期待と不一致。現在値=${ritsurin.lat},${ritsurin.lng}`);
  }
  if (shotengai.lat?.toString() !== "34.34601" || shotengai.lng?.toString() !== "134.05054") {
    throw new Error(`高松中央商店街: 座標現在値が期待と不一致。現在値=${shotengai.lat},${shotengai.lng}`);
  }
  if (ohkaido.lat?.toString() !== "33.8395" || ohkaido.lng?.toString() !== "132.766") {
    throw new Error(`ロープウェー商店街・大街道: 座標現在値が期待と不一致。現在値=${ohkaido.lat},${ohkaido.lng}`);
  }
  if (shiki.lat?.toString() !== "33.849667" || shiki.lng?.toString() !== "132.787167") {
    throw new Error(`松山市立子規記念博物館: 座標現在値が期待と不一致。現在値=${shiki.lat},${shiki.lng}`);
  }
  console.log("前提の確認OK。\n");

  console.log("[説明文] 「北浜alley」の記述を削除");
  console.log("\n[初日] サンポート高松・北浜alleyを削除。新しい並び（移動はOSRM道のりで再計算）:");
  console.log("栗林公園(10:45,stay80)→[walk27]→商店街(12:32,stay70,昼食)→[walk9]→ミュージアム(13:51,stay75)→[walk7]→高松城跡(15:13,stay50)→[walk17]→せとしるべ(16:20,stay30、16:50出発)");
  console.log("\n[最終日] 坊っちゃんからくり時計・宝厳寺を削除。1か所目は9:00のまま。新しい並び:");
  console.log("石手寺(09:00,stay50)→[walk13]→道後公園(10:03,stay50)→[walk2]→子規記念博物館(10:55,stay75,昼食は道後商店街で)→[walk7]→伊佐爾波神社(12:17,stay45)→[walk5]→道後温泉本館(13:07,stay85、14:32出発)");
  console.log("[道後温泉本館] 入浴の一言に水分の言葉を追加（法務指摘）: 「長湯に気をつけましょう。」→「長湯を避けて、こまめに水分をとりましょう。」");
  console.log("\n[栗林公園] 座標 34.330333,134.044403 → 34.332144,134.043387（北門入園券売場、node 13329557001）");
  console.log("[高松中央商店街] 座標 34.34601,134.05054 → 34.3439482,134.050073（丸亀町商店街、OSM way 62159669）");
  console.log("[ロープウェー商店街・大街道] 座標 33.8395,132.766 → 33.8386908,132.7701017（大街道、OSM way 237265571）");
  console.log("[松山市立子規記念博物館] 座標 33.849667,132.787167 → 33.849701,132.787045（OSM node 1423739411）");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinerary.id }, data: { description: DESC_NEW } });
    await setDaySpotOrder(
      day1.id,
      [
        {
          id: RITSURIN,
          data: { visitTime: t(10, 45), memo: RITSURIN_MEMO_NEW, lat: 34.332144, lng: 134.043387 },
        },
        {
          id: SHOTENGAI,
          data: {
            visitTime: t(12, 32),
            memo: SHOTENGAI_MEMO_NEW,
            lat: 34.3439482,
            lng: 134.050073,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 27 }] },
          },
        },
        {
          id: MUSEUM,
          data: {
            visitTime: t(13, 51),
            memo: MUSEUM_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
          },
        },
        {
          id: CASTLE,
          data: {
            visitTime: t(15, 13),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
          },
        },
        {
          id: SETOSHIRUBE,
          data: {
            visitTime: t(16, 20),
            memo: SETOSHIRUBE_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 17 }] },
          },
        },
      ],
      { remove: [KITAHAMA, SUNPORT], tx }
    );

    await setDaySpotOrder(
      day4.id,
      [
        { id: ISHITEJI, data: {} },
        {
          id: DOGOKOEN,
          data: {
            visitTime: t(10, 3),
            memo: DOGOKOEN_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13 }] },
          },
        },
        {
          id: SHIKI,
          data: {
            visitTime: t(10, 55),
            memo: SHIKI_MEMO_NEW,
            lat: 33.849701,
            lng: 132.787045,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
          },
        },
        {
          id: ISANIWA,
          data: {
            visitTime: t(12, 17),
            memo: ISANIWA_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
          },
        },
        {
          id: DOGOHONKAN,
          data: {
            visitTime: t(13, 7),
            memo: DOGOHONKAN_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
          },
        },
      ],
      { remove: [KARAKURI, HOGONJI], tx }
    );

    await tx.spot.update({ where: { id: OHKAIDO }, data: { lat: 33.8386908, lng: 132.7701017 } });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
