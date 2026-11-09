/**
 * 3155fabf（尾道・広島・宮島3泊4日）初日・最終日の見直し（2026-10-30）
 * 仕様: docs/specs/20261029-first-last-day-times.md
 * - 初日(Day1): 1か所目11時ごろ(10:45〜11:45)、16:30〜17:00に最後の行き先を出る、3か所以上
 * - 中の日(Day2・Day3): 直さない
 * - 最終日・2泊以上(Day4): 9時ごろ(今と同じ)、14:30〜15:00に最後の行き先を出る、3か所以上
 *
 * 初日: 尾道市立美術館・尾道商業会議所記念館・持光寺を外し、タイトルの見どころ
 * （浄土寺・千光寺）を残して浄土寺→尾道本通り商店街(昼食)→西國寺→艮神社→千光寺→
 * 光明寺→天寧寺三重塔の7か所に組み直す。移動はOSRM(routing.openstreetmap.de/routed-foot)の
 * 道のりルーティングで算出。
 * （法務指摘、2026-10-30 2回目: 尾道本通り商店街の点を直したことで移動時間が短くなり、
 * 初日の出発が16:21と決まりの16:30〜17:00を割ったため、外していた光明寺（もとの滞在
 * 30分・メモ・写真をそのまま使う）を千光寺と天寧寺三重塔の間に戻して16:59出発に調整）
 *
 * 最終日(Day4): 宝物館・紅葉谷公園を外し、タイトル・説明文の見どころ（千畳閣・厳島神社・
 * 大願寺・大聖院・町家通り）と多宝塔・宮島歴史民俗資料館を残した7か所に。厳島神社→大願寺
 * のみ新しい区間（OSRM道のり）、ほかは既存の移動時間をそのまま使う。
 *
 * 座標の直し（法務の全スポット確認・2026-10-30、7章の決まり。OSM/Nominatimの値に。
 * 時刻の変更はなし）:
 * - 浄土寺(Day1): OSM node 3399246645
 * - 原爆ドーム(Day3): OSM relation 1506282（building=ruinsの建物そのものの輪郭。広い
 *   公園の中心ではなく建物の外形のため、そのまま使う）
 * - 平和記念公園(Day3): 広い公園のため、企画運営指摘によりrelation 1971933の中心では
 *   なく、メモに合う名前のある点「原爆死没者慰霊碑」(OSM node 1805765497)を使う
 * - 広島平和記念資料館(Day3): OSM way 60867023（本館）
 * - 広島城(Day3): OSM way 105823448（天守閣）
 * - 縮景園(Day3): 広い庭園のため、way 69827593の中心ではなく、池泉回遊式庭園の中心的な
 *   池「濯纓池」(OSM relation 1877272)を使う
 * - 千畳閣・五重塔(Day4): OSM way 142668904
 * - 厳島神社(Day4): 境内地のlanduse境界ではなく、本殿の建物(OSM way 1306168431)を使う
 * - 尾道市街地～向島（しまなみ海道起点、Day2）: 名前の点が見つからないため、近くの実在の
 *   地点として尾道駅(OSM node 8122138840)を使う
 * - 因島水軍城(Day2): OSM node 1423630174
 * - しおまち商店街(Day2): OSM node 11021211105
 * - 尾道本通り商店街(Day1): 商店街自体の線はOSMになし。7章の決まりどおり、通りに面した
 *   名前のある地物「おのみち歴史博物館」(OSM node 1423626575)の点を使う（法務指摘、生データ
 *   API api.openstreetmap.org/api/0.6/map で確認。Overpassが不調だったための代替手段）。
 *   点が動いたため、浄土寺→商店街・商店街→西國寺の移動も測り直した
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

// Day1
const JODOJI = "d282e1a2-1af6-480a-b256-0c5ad025b5bd";
const SAIKOKUJI = "9446a7cb-6c21-4135-a2fa-ae222a061425";
const USHITORA = "55054999-2cf2-4a70-87f4-947d8a114474";
const BIJUTSUKAN = "45838f6f-2a85-4dc5-bcc0-e39232ea332a"; // 削除
const SENKOJI = "1896e114-fb21-4e20-bd8a-a2f3b017ae67";
const HONDORI = "4de9187d-bf29-4c19-bf58-5433f8f3d1ed";
const KAIGISHO = "30b2168b-03a5-489e-addc-915d7b93605a"; // 削除
const JIKOJI = "92feceb8-8533-4bfd-89db-b284ae621a41"; // 削除
const KOMYOJI = "b73b7baf-11ba-46a5-b08d-6f385825942d"; // 戻す（千光寺と天寧寺の間）
const TENNEIJI = "d7acb4d0-f901-4299-9d43-92fde6196b1f";

// Day2（座標のみ）
const MUKOJIMA = "45634adf-f0f3-40d2-b798-acb2b0281848";
const SUIGUNJO = "8df47243-148e-4a06-8263-cfdad1fbc2d5";
const SHIOMACHI = "5d958fd4-0b2c-41b5-bc2a-fe4c960acaba";

// Day3（座標のみ）
const GENBAKU_DOME = "869fd9d6-b0c4-4ef0-86e6-dbbc03f047c2";
const HEIWA_PARK = "e58d2a6b-c6ce-4cf0-8086-d608cabf272c";
const SHIRYOKAN = "460a89cd-1848-4e79-820e-1570709f17d5";
const HIROSHIMAJO = "418e5b4b-04a5-4584-914c-f7b5a4376729";
const SHUKKEIEN = "44c21ebf-c114-40d7-b590-1eff0aecd350";

// Day4
const SENJOKAKU = "a81848a0-16d3-4f80-80bc-1543d0a7320e";
const ITSUKUSHIMA = "d6d055ce-06c1-4f24-9dc9-37be299dea43";
const HOUMOTSUKAN = "140f966c-63c5-41f9-b894-83681fd92db7"; // 削除
const DAIGANJI = "7299c238-5295-4d14-b7e3-37011a9c733a";
const TAHOTO = "c69f6e57-3640-476a-a79a-eeec8a906c37";
const REKISHI_MINZOKU = "210da0cd-105f-43b9-b5b3-7592948dd832";
const MACHIYA = "7f57cfab-041d-4634-9b6a-5f41610f79b0";
const DAISHOIN = "60099eec-aba7-4db8-99a6-a85d8a4220c9";
const MOMIJIDANI = "4d6ecc87-ecbd-4eed-a377-9b0375ed18be"; // 削除

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

// ===== Day1 memo =====
const JODOJI_MEMO_OLD =
  "坂の町・尾道の旅は、尾道駅から尾道水道沿いを東へ歩いて約25分の浄土寺から始めます。本堂と多宝塔が国宝に、山門と阿弥陀堂が国の重要文化財に指定されている、尾道を代表する名刹です。本堂の内陣には、建武3年（1336年）に足利尊氏がこもって祈ったと伝わる部屋が残ります。国の名勝に指定された庭園もあわせて拝観できます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const JODOJI_MEMO_NEW =
  "尾道駅に11時20分ごろ着いたら、尾道水道沿いを東へ歩いておよそ25分の浄土寺から、坂の町・尾道の旅を始めましょう。本堂と多宝塔が国宝に、山門と阿弥陀堂が国の重要文化財に指定されている、尾道を代表する名刹です。本堂の内陣には、建武3年（1336年）に足利尊氏がこもって祈ったと伝わる部屋が残ります。国の名勝に指定された庭園もあわせて拝観できます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const HONDORI_MEMO_OLD =
  "千光寺から石段と坂道を下って約15分、尾道本通り商店街で昼食にしましょう。港町として栄えた尾道の歴史とともに発展してきた商店街で、芙美子通り・土堂中通り・本町センター街・絵のまち通り・尾道通りの5つの通りが、およそ1.2km続きます。猫をモチーフにした雑貨や土産物の店も見られます。";
const HONDORI_MEMO_NEW =
  "浄土寺から歩いておよそ15分、尾道本通り商店街で昼食にしましょう。港町として栄えた尾道の歴史とともに発展してきた商店街で、芙美子通り・土堂中通り・本町センター街・絵のまち通り・尾道通りの5つの通りが、およそ1.2km続きます。猫をモチーフにした雑貨や土産物の店も見られます。食事を終えたら、西國寺へ向かいましょう。";

const SAIKOKUJI_MEMO_OLD =
  "浄土寺から西へ歩いて約10分。天平年間（729〜749年）に行基が開いたと伝えられる、真言宗醍醐派の大本山です。広島県の重要文化財の仁王門には、健脚を願って奉納された、長さ2mを超える大草鞋が掛けられています。石段を上った先の金堂は国の重要文化財で、足利6代将軍・義教が寄進したと伝わる三重塔とともに、室町時代の趣を今に伝えます。石段では足元に気をつけましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const SAIKOKUJI_MEMO_NEW =
  "尾道本通り商店街から坂道を上って約18分。天平年間（729〜749年）に行基が開いたと伝えられる、真言宗醍醐派の大本山です。広島県の重要文化財の仁王門には、健脚を願って奉納された、長さ2mを超える大草鞋が掛けられています。石段を上った先の金堂は国の重要文化財で、足利6代将軍・義教が寄進したと伝わる三重塔とともに、室町時代の趣を今に伝えます。石段では足元に気をつけましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const SENKOJI_MEMO_OLD =
  "美術館から坂道を下って約10分。大同元年（806年）に弘法大師空海が開いたと伝えられる古刹で、尾道港を見下ろす標高約140mの山の中腹に立ちます。境内の巨岩「玉の岩」には、かつて頂の宝珠が夜ごと海を照らしたという伝説が残り、このあたりが古く「玉の浦」と呼ばれた由来ともいわれます。貞享3年（1686年）に建てられた本堂は、この地方では珍しい舞台造りです。境内からは尾道水道と向島の眺めが広がります。石段や岩場では足元に気をつけましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const SENKOJI_MEMO_NEW =
  "艮神社から坂道を下って約7分。大同元年（806年）に弘法大師空海が開いたと伝えられる古刹で、尾道港を見下ろす標高約140mの山の中腹に立ちます。境内の巨岩「玉の岩」には、かつて頂の宝珠が夜ごと海を照らしたという伝説が残り、このあたりが古く「玉の浦」と呼ばれた由来ともいわれます。貞享3年（1686年）に建てられた本堂は、この地方では珍しい舞台造りです。境内からは尾道水道と向島の眺めが広がります。石段や岩場では足元に気をつけましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const TENNEIJI_MEMO_OLD =
  "光明寺から坂道を上って約10分。もとは至徳3年（1386年）に建てられた五重塔で、江戸時代に上の2層が取り払われ、今の三重塔の姿になったと伝えられます。瓦屋根が幾重にも重なる坂の町を背にして立つ塔は、尾道らしい風景として親しまれています。塔のそばからは、石に猫の絵を描いた「福石猫」が置かれた細い坂道「猫の細道」が続きます。天寧寺の境内の一部なので、静かに見学しましょう。坂道を下って尾道の宿へ。今夜は尾道に泊まります。";
const TENNEIJI_MEMO_NEW =
  "光明寺から坂道を上って約5分。もとは至徳3年（1386年）に建てられた五重塔で、江戸時代に上の2層が取り払われ、今の三重塔の姿になったと伝えられます。瓦屋根が幾重にも重なる坂の町を背にして立つ塔は、尾道らしい風景として親しまれています。塔のそばからは、石に猫の絵を描いた「福石猫」が置かれた細い坂道「猫の細道」が続きます。天寧寺の境内の一部なので、静かに見学しましょう。坂道を下って尾道の宿へ。今夜は尾道に泊まります。";

const KOMYOJI_MEMO_OLD =
  "持光寺から歩いて約5分。国の重要文化財の木造千手観音立像（浪分観音）を伝える寺です。境内には、江戸時代の第12代横綱・陣幕久五郎夫妻の墓や顕彰碑があり、樹齢およそ400年と伝えられる尾道市の天然記念物「蟠龍の松」も枝を広げています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const KOMYOJI_MEMO_NEW =
  "千光寺から歩いて約5分。国の重要文化財の木造千手観音立像（浪分観音）を伝える寺です。境内には、江戸時代の第12代横綱・陣幕久五郎夫妻の墓や顕彰碑があり、樹齢およそ400年と伝えられる尾道市の天然記念物「蟠龍の松」も枝を広げています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

// ===== Day4 memo =====
const DAIGANJI_MEMO_OLD =
  "宝物館から歩いてすぐ。正式な名を亀居山放光院大願寺という真言宗の寺で、建仁年間（1201〜1203年）に僧・了海が再興したと伝わります。明治元年（1868年）の神仏分離令までは、多くの社寺の修理や造営を担ってきました。本堂には、弘法大師作と伝わる薬師如来坐像など、国の重要文化財の仏像4体がまつられ、本尊の厳島弁財天は日本三大弁財天の一つとされます。慶応2年（1866年）には、第2次長州戦争の講和の会談がこの寺の書院で開かれました。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const DAIGANJI_MEMO_NEW =
  "厳島神社から歩いて約4分。正式な名を亀居山放光院大願寺という真言宗の寺で、建仁年間（1201〜1203年）に僧・了海が再興したと伝わります。明治元年（1868年）の神仏分離令までは、多くの社寺の修理や造営を担ってきました。本堂には、弘法大師作と伝わる薬師如来坐像など、国の重要文化財の仏像4体がまつられ、本尊の厳島弁財天は日本三大弁財天の一つとされます。慶応2年（1866年）には、第2次長州戦争の講和の会談がこの寺の書院で開かれました。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DAISHOIN_MEMO_OLD =
  "町家通りから山すその方へ歩いて約15分。大同元年（806年）、唐から帰った弘法大師が弥山で修行して開いたと伝わる、真言宗御室派の大本山です。観音堂には十一面観音菩薩像、勅願堂には波切不動明王坐像がまつられ、摩尼殿は弥山三鬼大権現の祈祷所です。石段が多いので足元に気をつけましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const DAISHOIN_MEMO_NEW =
  "町家通りから山すその方へ歩いて約15分。大同元年（806年）、唐から帰った弘法大師が弥山で修行して開いたと伝わる、真言宗御室派の大本山です。観音堂には十一面観音菩薩像、勅願堂には波切不動明王坐像がまつられ、摩尼殿は弥山三鬼大権現の祈祷所です。石段が多いので足元に気をつけましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。帰りは宮島桟橋から船で宮島口へ渡り、JRで広島駅へ。4日間の尾道・広島・宮島の旅はここまでです。";

async function main() {
  const itinerary = await prisma.itinerary.findUniqueOrThrow({
    where: { id: "3155fabf-7e37-4803-9bdb-66a7c7dc732a" },
    include: { days: { orderBy: { dayNumber: "asc" } } },
  });
  const day1 = itinerary.days.find((d) => d.dayNumber === 1);
  const day4 = itinerary.days.find((d) => d.dayNumber === 4);
  if (!day1 || !day4) throw new Error("day1/day4 not found");

  const spots = await prisma.spot.findMany({
    where: {
      id: {
        in: [
          JODOJI, HONDORI, SAIKOKUJI, SENKOJI, KOMYOJI, TENNEIJI,
          DAIGANJI, DAISHOIN, SENJOKAKU, ITSUKUSHIMA,
          MUKOJIMA, SUIGUNJO, SHIOMACHI,
          GENBAKU_DOME, HEIWA_PARK, SHIRYOKAN, HIROSHIMAJO, SHUKKEIEN,
        ],
      },
    },
  });
  const byId = new Map(spots.map((s) => [s.id, s]));
  const jodoji = byId.get(JODOJI)!;
  const hondori = byId.get(HONDORI)!;
  const saikokuji = byId.get(SAIKOKUJI)!;
  const senkoji = byId.get(SENKOJI)!;
  const komyoji = byId.get(KOMYOJI)!;
  const tenneiji = byId.get(TENNEIJI)!;
  const daiganji = byId.get(DAIGANJI)!;
  const daishoin = byId.get(DAISHOIN)!;
  const senjokaku = byId.get(SENJOKAKU)!;
  const itsukushima = byId.get(ITSUKUSHIMA)!;
  const mukojima = byId.get(MUKOJIMA)!;
  const suigunjo = byId.get(SUIGUNJO)!;
  const shiomachi = byId.get(SHIOMACHI)!;
  const genbaku = byId.get(GENBAKU_DOME)!;
  const heiwa = byId.get(HEIWA_PARK)!;
  const shiryokan = byId.get(SHIRYOKAN)!;
  const hiroshimajo = byId.get(HIROSHIMAJO)!;
  const shukkeien = byId.get(SHUKKEIEN)!;

  if (jodoji.memo !== JODOJI_MEMO_OLD) throw new Error("浄土寺: memo現在値が期待と不一致");
  if (hondori.memo !== HONDORI_MEMO_OLD) throw new Error("尾道本通り商店街: memo現在値が期待と不一致");
  if (saikokuji.memo !== SAIKOKUJI_MEMO_OLD) throw new Error("西國寺: memo現在値が期待と不一致");
  if (senkoji.memo !== SENKOJI_MEMO_OLD) throw new Error("千光寺: memo現在値が期待と不一致");
  if (komyoji.memo !== KOMYOJI_MEMO_OLD) throw new Error("光明寺: memo現在値が期待と不一致");
  if (tenneiji.memo !== TENNEIJI_MEMO_OLD) throw new Error("天寧寺三重塔: memo現在値が期待と不一致");
  if (daiganji.memo !== DAIGANJI_MEMO_OLD) throw new Error("大願寺: memo現在値が期待と不一致");
  if (daishoin.memo !== DAISHOIN_MEMO_OLD) throw new Error("大聖院: memo現在値が期待と不一致");
  if (jodoji.lat?.toString() !== "34.411621" || jodoji.lng?.toString() !== "133.210571") {
    throw new Error(`浄土寺: 座標現在値が期待と不一致。現在値=${jodoji.lat},${jodoji.lng}`);
  }
  if (hondori.lat?.toString() !== "34.40911" || hondori.lng?.toString() !== "133.20544") {
    throw new Error(`尾道本通り商店街: 座標現在値が期待と不一致。現在値=${hondori.lat},${hondori.lng}`);
  }
  if (senjokaku.lat?.toString() !== "34.297304" || senjokaku.lng?.toString() !== "132.320269") {
    throw new Error(`千畳閣: 座標現在値が期待と不一致。現在値=${senjokaku.lat},${senjokaku.lng}`);
  }
  if (itsukushima.lat?.toString() !== "34.296022" || itsukushima.lng?.toString() !== "132.319894") {
    throw new Error(`厳島神社: 座標現在値が期待と不一致。現在値=${itsukushima.lat},${itsukushima.lng}`);
  }
  if (mukojima.lat?.toString() !== "34.4053" || mukojima.lng?.toString() !== "133.1917") {
    throw new Error(`尾道市街地〜向島: 座標現在値が期待と不一致。現在値=${mukojima.lat},${mukojima.lng}`);
  }
  if (suigunjo.lat?.toString() !== "34.328392" || suigunjo.lng?.toString() !== "133.165939") {
    throw new Error(`因島水軍城: 座標現在値が期待と不一致。現在値=${suigunjo.lat},${suigunjo.lng}`);
  }
  if (shiomachi.lat?.toString() !== "34.30404" || shiomachi.lng?.toString() !== "133.086996") {
    throw new Error(`しおまち商店街: 座標現在値が期待と不一致。現在値=${shiomachi.lat},${shiomachi.lng}`);
  }
  if (genbaku.lat?.toString() !== "34.395556" || genbaku.lng?.toString() !== "132.453611") {
    throw new Error(`原爆ドーム: 座標現在値が期待と不一致。現在値=${genbaku.lat},${genbaku.lng}`);
  }
  if (heiwa.lat?.toString() !== "34.392722" || heiwa.lng?.toString() !== "132.452361") {
    throw new Error(`平和記念公園: 座標現在値が期待と不一致。現在値=${heiwa.lat},${heiwa.lng}`);
  }
  if (shiryokan.lat?.toString() !== "34.39155" || shiryokan.lng?.toString() !== "132.453098") {
    throw new Error(`広島平和記念資料館: 座標現在値が期待と不一致。現在値=${shiryokan.lat},${shiryokan.lng}`);
  }
  if (hiroshimajo.lat?.toString() !== "34.40275" || hiroshimajo.lng?.toString() !== "132.45903") {
    throw new Error(`広島城: 座標現在値が期待と不一致。現在値=${hiroshimajo.lat},${hiroshimajo.lng}`);
  }
  if (shukkeien.lat?.toString() !== "34.399722" || shukkeien.lng?.toString() !== "132.467472") {
    throw new Error(`縮景園: 座標現在値が期待と不一致。現在値=${shukkeien.lat},${shukkeien.lng}`);
  }
  console.log("前提の確認OK。\n");

  console.log("[初日] 尾道市立美術館・尾道商業会議所記念館・持光寺を削除。光明寺はいったん外したが、尾道本通り商店街の点が動いて初日が16:21出発になったため戻した（法務指摘）。新しい並び:");
  console.log("浄土寺(11:45)→商店街(12:34,昼食)→西國寺(13:47)→艮神社(14:47)→千光寺(15:14)→光明寺(15:59)→天寧寺三重塔(16:34、16:59出発)");
  console.log("\n[最終日] 宝物館・紅葉谷公園を削除。新しい並び（移動はOSRM道のりで再計算。資料館の滞在は40分のまま延ばさない。1か所目を9:02にずらして14:30出発に合わせる）:");
  console.log("千畳閣(09:02)→厳島神社(09:42)→大願寺(10:46)→多宝塔(11:08)→宮島歴史民俗資料館(11:25)→町家通り(12:15)→大聖院(13:30、14:30出発)");
  console.log("\n[座標の直し（法務の全確認、2026-10-30）]");
  console.log("浄土寺→34.4119587,133.2107802（node 3399246645）");
  console.log("千畳閣・五重塔→34.2973039,132.3202692（way 142668904）");
  console.log("厳島神社→34.2958503,132.3200083（本殿、way 1306168431。landuse境界でなく建物）");
  console.log("尾道市街地～向島→34.4048206,133.1931084（尾道駅、node 8122138840。近くの名前の点なし）");
  console.log("因島水軍城→34.327973,133.166409（node 1423630174）");
  console.log("しおまち商店街→34.3040398,133.086996200000（node 11021211105）");
  console.log("原爆ドーム→34.3954661,132.4535245（relation 1506282、建物そのものの輪郭）");
  console.log("平和記念公園→34.3929718,132.4525711（原爆死没者慰霊碑、node 1805765497。広い公園のため中心でなく名前のある点）");
  console.log("広島平和記念資料館→34.3918121,132.4521048（本館、way 60867023）");
  console.log("広島城→34.4027467,132.4590558（天守閣、way 105823448）");
  console.log("縮景園→34.4004715,132.4672666（濯纓池、relation 1877272。広い庭園のため中心でなく池の点）");
  console.log("尾道本通り商店街→34.4097846,133.2049428（通りに面したおのみち歴史博物館、node 1423626575。商店街自体の線はOSMになし。7章の決まりどおり）");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: JODOJI, data: { visitTime: t(11, 45), memo: JODOJI_MEMO_NEW, lat: 34.4119587, lng: 133.2107802 } },
        {
          id: HONDORI,
          data: {
            visitTime: t(12, 34),
            memo: HONDORI_MEMO_NEW,
            lat: 34.4097846,
            lng: 133.2049428,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
          },
        },
        {
          id: SAIKOKUJI,
          data: {
            visitTime: t(13, 47),
            memo: SAIKOKUJI_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13 }] },
          },
        },
        {
          id: USHITORA,
          data: {
            visitTime: t(14, 47),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
          },
        },
        {
          id: SENKOJI,
          data: {
            visitTime: t(15, 14),
            memo: SENKOJI_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
          },
        },
        {
          id: KOMYOJI,
          data: {
            visitTime: t(15, 59),
            memo: KOMYOJI_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
          },
        },
        {
          id: TENNEIJI,
          data: {
            visitTime: t(16, 34),
            memo: TENNEIJI_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
          },
        },
      ],
      { remove: [BIJUTSUKAN, KAIGISHO, JIKOJI], tx }
    );

    await setDaySpotOrder(
      day4.id,
      [
        { id: SENJOKAKU, data: { visitTime: t(9, 2), lat: 34.2973039, lng: 132.3202692 } },
        { id: ITSUKUSHIMA, data: { visitTime: t(9, 42), lat: 34.2958503, lng: 132.3200083 } },
        {
          id: DAIGANJI,
          data: {
            visitTime: t(10, 46),
            memo: DAIGANJI_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
          },
        },
        {
          id: TAHOTO,
          data: {
            visitTime: t(11, 8),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
          },
        },
        {
          id: REKISHI_MINZOKU,
          data: {
            visitTime: t(11, 25),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
          },
        },
        { id: MACHIYA, data: { visitTime: t(12, 15) } },
        { id: DAISHOIN, data: { visitTime: t(13, 30), memo: DAISHOIN_MEMO_NEW } },
      ],
      { remove: [HOUMOTSUKAN, MOMIJIDANI], tx }
    );

    await tx.spot.update({ where: { id: MUKOJIMA }, data: { lat: 34.4048206, lng: 133.1931084 } });
    await tx.spot.update({ where: { id: SUIGUNJO }, data: { lat: 34.327973, lng: 133.166409 } });
    await tx.spot.update({ where: { id: SHIOMACHI }, data: { lat: 34.3040398, lng: 133.0869962 } });
    await tx.spot.update({ where: { id: GENBAKU_DOME }, data: { lat: 34.3954661, lng: 132.4535245 } });
    await tx.spot.update({ where: { id: HEIWA_PARK }, data: { lat: 34.3929718, lng: 132.4525711 } });
    await tx.spot.update({ where: { id: SHIRYOKAN }, data: { lat: 34.3918121, lng: 132.4521048 } });
    await tx.spot.update({ where: { id: HIROSHIMAJO }, data: { lat: 34.4027467, lng: 132.4590558 } });
    await tx.spot.update({ where: { id: SHUKKEIEN }, data: { lat: 34.4004715, lng: 132.4672666 } });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
