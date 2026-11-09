/**
 * 赤間神宮と壇ノ浦古戦場、源平合戦ゆかりの地を巡るプラン(e25ac636)の組み直し(2026-11-05、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の e25ac636 の欄(組み直しが要るしおり)。11/05 0時に制作から制作補助2へ移った分。
 * - 門司の側(関門トンネル人道・和布刈神社・門司港レトロ地区)は e3e32914・22e33bac・04cfa60b・ba8c13f1 と重なるので外し、
 *   下関の側で組む。足りない分は長府(下関市立歴史博物館・功山寺)で足す(長府にほかのしおりはない。企画運営 11/05)。エリア「下関」はそのまま
 * - 点: 歴史博物館 tourism=museum way1363532446、功山寺 place_of_worship way382967845、壇ノ浦古戦場 tourism=attraction node2749799461、
 *   赤間神宮 着く側の門「水天門」way382828684(Nominatim 33.959381,130.948869。神社の点がなく、面の中心は使わない。企画運営 11/05)、
 *   日清講和記念館 tourism=museum way552006984、昼食 バス停「唐戸」node2427700460、亀山八幡宮 place_of_worship node2749717716、
 *   旧下関英国領事館 tourism=museum node5514642022、海響館 tourism=aquarium way221599485
 * - 区間(routing.openstreetmap.de routed-foot、秒から切り上げ): 博物館→功山寺 154.0→3、御裳川→壇ノ浦古戦場 102.7→2、
 *   壇ノ浦古戦場→水天門 792.1→14、水天門→日清講和記念館 62.9→2、日清講和記念館→唐戸 553.9→10、唐戸→亀山八幡宮 372.9→7、
 *   亀山八幡宮→英国領事館 221.5→4、英国領事館→海響館 533.2→9、海響館→海響館前のバス停 339.7→6(帰りの一文)
 * - 例外: 城下町長府のバス停⇔博物館・功山寺の歩きは、routed-foot が 2540.5秒(3.18km)の遠回りを返す(直線約700m、車の経路0.94km)ため、
 *   サンデン交通の公式「おでかけガイド」sandenkotsu.co.jp/bus/odekake/ の「城下町長府バス停下車 徒歩約10分」を使う(企画運営・法務 11/05)
 * - バス(サンデン交通 公式): 下関駅→城下町長府 約21分、海響館前→下関駅 約5分(おでかけガイド)。城下町長府→御裳川は、
 *   国道線(下り)の時刻表 sandenkotsu.co.jp/wp-content/uploads/2026/09/TT01_20261001.pdf の5ページ: 毎日運行の便で
 *   城下町長府 10:54→御裳川 11:05、11:06→11:17(乗車11)。功山寺を 10:48 に出て 10:58 にバス停、待ちは 10:54 と 11:06 の間隔の12を other にする
 * - 時刻: 9:30〜16:44。昼食 13:24
 * - 出典: 歴史博物館 city.shimonoseki.lg.jp/soshiki/107/(9:30〜17:00、月曜休)・shimohaku.jp/prof.html、
 *   功山寺 yamaguchi-tourism.jp/spot/detail_10468.html・kunishitei.bunka.go.jp/heritage/detail/102/3198(仏殿 国宝)、
 *   赤間神宮 yamaguchi-tourism.jp/spot/detail_10467.html(安徳天皇を祀る、竜宮城をイメージした水天門、安徳天皇阿弥陀寺御陵、宝物殿、前身の阿弥陀寺、平家一門の墓)、
 *   日清講和記念館 yamaguchi-tourism.jp/movie/detail_107.html(明治28年の講和会議は春帆楼、隣の記念館に調度品)、
 *   亀山八幡宮 yamaguchi-tourism.jp/spot/detail_15192.html、英国領事館 yamaguchi-tourism.jp/spot/detail_10612.html、海響館 kaikyokan.com(9:30〜17:30、最終入場17:00)
 * - 写真: 赤間神宮(表紙)・壇ノ浦古戦場の写真はそのまま
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-shimonoseki-e25ac636.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "e25ac636-ba75-49d3-a911-11a08c9df4d0";
const DAY_ID = "16b01197-b412-4ae6-b27e-8f8c1b7ab55a";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number; transitLine?: string };
const legs = (...xs: [string, number, string?][]): Leg[] =>
  xs.map(([mode, min, line], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min, ...(line ? { transitLine: line } : {}) }));
const L = (...xs: [string, number, string?][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number, string?][]) => ({ create: legs(...xs) });

const AKAMA = "30353d80-5117-4390-87df-9a53ab8d04f4";
const NISSHIN = "47089762-158c-410c-a0b5-b00424cc448e";
const DANNOURA = "0a4e69f2-e3db-47e9-8777-365ddf5e7d2e";
const JINDO = "98e70a7f-94fc-472d-911d-c8e10a1ac941"; // 外す
const MEKARI = "1d408660-4e44-4d10-81a9-9ee25434cdcf"; // 外す
const MOJIKO = "3d2f451c-88c1-42d8-8a67-4095a64da746"; // 外す
const RYOJIKAN = "cabc6753-bbbd-4195-8530-e1461f6524ba";
const KAMEYAMA = "6110845e-cf78-4a78-9e1c-ee0ae3673210";
const KAIKYOKAN = "19882f18-d0a9-4a19-bf7f-7ab1eb07eea0";
const REMOVE = [JINDO, MEKARI, MOJIKO];

const EXPECT: Record<string, string> = {
  [AKAMA]: "赤間神宮", [NISSHIN]: "日清講和記念館", [DANNOURA]: "壇ノ浦古戦場", [JINDO]: "関門トンネル人道", [MEKARI]: "和布刈神社",
  [MOJIKO]: "門司港レトロ地区", [RYOJIKAN]: "旧下関英国領事館", [KAMEYAMA]: "亀山八幡宮", [KAIKYOKAN]: "海響館（市立しものせき水族館）",
};
const PHOTOS_EXPECT = ["51b88d7e-2dc3-47e5-bc1d-04b72524ff49", "81413f96-aea1-4663-88fe-5b922c513742"].sort();

const TITLE_OLD = "赤間神宮と壇ノ浦古戦場、源平合戦ゆかりの地を巡るプラン";
const TITLE_NEW = "赤間神宮と壇ノ浦古戦場、城下町長府から唐戸まで下関の歴史をたどる日帰りプラン";
const DESC_OLD =
  "安徳天皇をまつる赤間神宮と、源平最後の合戦の地・壇ノ浦から、海の底の関門トンネル人道を歩いて門司へ渡り、連絡船で下関の唐戸に戻る日帰りプランです。明治の洋館や、講和会議の記念館もめぐり、関門海峡をはさむ町の歴史をたどります。";
const DESC_NEW =
  "バスで城下町長府へ向かい、下関市立歴史博物館と功山寺で下関の歴史にふれたあと、源平最後の合戦の地・壇ノ浦古戦場へ。安徳天皇をまつる赤間神宮と日清講和記念館をたずね、唐戸で昼食。午後は亀山八幡宮と旧下関英国領事館をめぐり、関門海峡に面した海響館で1日を終える日帰りプランです。歴史博物館は月曜日が休館日なので、事前に確かめましょう。";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  museum:
    "JR下関駅からバスでおよそ21分の城下町長府で降り、歩いておよそ10分、下関市立歴史博物館に着きます。長府の城下町の一角に建つ市立の博物館で、下関の歴史と文化を、資料や展示で紹介しています。開館は9:30〜17:00(入館は16:30まで)で、月曜日(祝日のときは翌平日)は休館です。この後は、歩いておよそ3分、功山寺へ向かいましょう。",
  kozanji:
    "下関市立歴史博物館から歩いておよそ3分、功山寺に着きます。鎌倉時代の終わりごろに開かれた曹洞宗の寺院で、禅宗様の仏殿は国宝に指定されています。幕末には、高杉晋作がこの寺で兵を挙げたことで知られ、境内には馬に乗った晋作の像が立っています。" +
    PRAY +
    "この後は、城下町長府のバス停まで歩いておよそ10分、バスでおよそ11分の御裳川へ向かいましょう。",
  dannoura:
    "功山寺から城下町長府のバス停まで歩いておよそ10分、バスでおよそ11分の御裳川で降り、歩いておよそ2分で壇ノ浦古戦場に着きます。バスの時刻は公式で確かめましょう。源氏と平家の最後の合戦の地とされる海辺で、今はみもすそ川公園として整えられ、関門海峡を行き交う船や、見上げるほど近くに架かる関門橋を眺められます。このあたりでは、静かに過ごしましょう。この後は、歩いておよそ14分、赤間神宮へ向かいましょう。",
  akama:
    "壇ノ浦古戦場から歩いておよそ14分、赤間神宮の水天門に着きます。源平の合戦にゆかりの深い安徳天皇をまつる神宮で、前身は阿弥陀寺という寺でした。竜宮城をイメージして建てられた朱色の水天門は、関門海峡のシンボルの一つとして知られています。境内には、安徳天皇阿弥陀寺御陵や平家一門の墓があり、宝物殿には貴重な資料が展示されています。御陵や墓のまわりでは、静かに過ごしましょう。" +
    PRAY +
    "開いている時間は、事前に確かめましょう。この後は、歩いておよそ2分、日清講和記念館へ向かいましょう。",
  nisshin:
    "赤間神宮から歩いておよそ2分、日清講和記念館に着きます。明治28年(1895)、日清戦争の講和会議が、隣の料亭「春帆楼」で開かれました。記念館では、講和会議で使われた調度品などで、会議の場のようすを伝えています。開いている時間は、事前に確かめましょう。静かに、敬意をもって見学しましょう。この後は、歩いておよそ10分、唐戸のあたりへ向かいましょう。",
  lunch:
    "日清講和記念館から歩いておよそ10分、唐戸のあたりに着きます。このあたりで昼食にしましょう。この後は、歩いておよそ7分、亀山八幡宮へ向かいましょう。",
  kameyama:
    "唐戸のあたりから歩いておよそ7分、亀山八幡宮に着きます。貞観元年(859)の創建と伝わる古い神社で、「関の氏神」として親しまれています。境内には、林芙美子の文学碑や大きなふくの像、幕末の亀山砲台の跡があります。" +
    PRAY +
    "この後は、歩いておよそ4分、旧下関英国領事館へ向かいましょう。",
  ryojikan:
    "亀山八幡宮から歩いておよそ4分、旧下関英国領事館に着きます。明治39年(1906)に建てられた赤れんがの建物で、領事館として使う目的で建てられたものとしては、国内に残るもっとも古い建物とされる、国の重要文化財です。保存修理を経て平成26年(2014)に再び公開され、1階の展示室で領事館の歴史にふれることができます。開いている時間は、事前に確かめましょう。この後は、歩いておよそ9分、海響館へ向かいましょう。",
  kaikyokan:
    "旧下関英国領事館から歩いておよそ9分、関門海峡に面した海響館に着きます。下関市立の水族館で、下関にゆかりの深いふぐの仲間の展示のほか、亜南極やサンゴ礁の海を再現した水槽など、さまざまな海の生きものを見ることができます。開館は9:30〜17:30(最終入場は17:00)です。旅を締めくくったら、海響館前のバス停まで歩いておよそ6分、JR下関駅までバスでおよそ5分です。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "下関市立歴史博物館(新規。1か所目。点 tourism=museum way1363532446)",
    item: { create: { name: "下関市立歴史博物館", address: "下関市長府川端2-2-27", lat: "33.995867", lng: "130.983876", visitTime: T(9, 30), stayDurationMin: 45, memo: M.museum } },
  },
  {
    label: "功山寺(新規。点 place_of_worship way382967845、歩き3)",
    item: { create: { name: "功山寺", address: "下関市長府川端", lat: "33.996062", lng: "130.981994", visitTime: T(10, 18), stayDurationMin: 30, memo: M.kozanji, transitLegs: C(["walk", 3]) } },
  },
  {
    label: "壇ノ浦古戦場(既存。点 tourism=attraction node2749799461。歩き10(公式)、待ち12、バス11、歩き2)",
    item: {
      id: DANNOURA,
      data: {
        lat: "33.964428", lng: "130.956194", visitTime: T(11, 23), stayDurationMin: 30, memo: M.dannoura,
        transitLegs: L(["walk", 10], ["other", 12], ["bus", 11, "国道線"], ["walk", 2]),
      },
    },
  },
  {
    label: "赤間神宮(既存。点 水天門 way382828684、歩き14。写真(表紙)はそのまま)",
    item: { id: AKAMA, data: { lat: "33.959381", lng: "130.948869", visitTime: T(12, 7), stayDurationMin: 40, memo: M.akama, transitLegs: L(["walk", 14]) } },
  },
  {
    label: "日清講和記念館(既存。点 tourism=museum way552006984、歩き2)",
    item: { id: NISSHIN, data: { lat: "33.959041", lng: "130.948352", visitTime: T(12, 49), stayDurationMin: 25, memo: M.nisshin, transitLegs: L(["walk", 2]) } },
  },
  {
    label: "唐戸のあたりで昼食(新規。点 バス停「唐戸」node2427700460、歩き10)",
    item: { create: { name: "唐戸のあたりで昼食", lat: "33.957751", lng: "130.942349", visitTime: T(13, 24), stayDurationMin: 40, memo: M.lunch, transitLegs: C(["walk", 10]) } },
  },
  {
    label: "亀山八幡宮(既存。点 place_of_worship node2749717716、歩き7)",
    item: { id: KAMEYAMA, data: { lat: "33.957491", lng: "130.945006", visitTime: T(14, 11), stayDurationMin: 20, memo: M.kameyama, transitLegs: L(["walk", 7]) } },
  },
  {
    label: "旧下関英国領事館(既存。点 tourism=museum node5514642022、歩き4)",
    item: { id: RYOJIKAN, data: { lat: "33.956938", lng: "130.943185", visitTime: T(14, 35), stayDurationMin: 30, memo: M.ryojikan, transitLegs: L(["walk", 4]) } },
  },
  {
    label: "海響館(既存・改名。点 tourism=aquarium way221599485、歩き9、帰りの一文)",
    item: { id: KAIKYOKAN, data: { name: "海響館", lat: "33.954431", lng: "130.942433", visitTime: T(15, 14), stayDurationMin: 90, memo: M.kaikyokan, transitLegs: L(["walk", 9]) } },
  },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true } });
  if (it?.title !== TITLE_OLD || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節・表紙: そのまま\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const lg = d.transitLegs as { create?: Leg[] } | undefined;
    const legsStr = lg?.create ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}${l.transitLine ? `(${l.transitLine})` : ""}`).join("+") : "(区間なし)";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})`);
  console.log("  写真: 赤間神宮(表紙)・壇ノ浦古戦場の写真はそのまま");
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 13:24(13:30より前)/ 終わり 海響館 16:44(日帰りの 16:30〜17:00)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
