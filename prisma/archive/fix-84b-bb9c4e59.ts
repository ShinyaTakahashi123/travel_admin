/**
 * #84 bb9c4e59（那須平成の森とフラワーワールド）企画運営の再指摘への対応。
 *
 * 1) 那須ガーデンアウトレットを削除（店・商売の宣伝にあたるため）。昼食の一言は
 *    那須どうぶつ王国(Day1)・那須野が原公園(Day2)に移した。
 * 2) 候補のうち、地理的に無理なく一方向で回れるものを追加。
 *    Day1: 那須ロープウェイ(新規、山麓駅から山頂駅まで4分、茶臼岳9合目)・
 *    那須高原展望台(新規、恋人の聖地)を追加し、山の上から那須湯本へ下る順に。
 *    八幡のつつじ群落・南ヶ丘牧場は、経路が逆方向になり一方向で回れないため見送り
 *    (那須歴史探訪館は実在確認できず見送り)。
 *    Day2: 那須野が原博物館(新規)・那須疏水公園(新規、旧取水施設のある那須疏水の
 *    歴史公園)・乃木神社(新規、配慮の一文)を追加。フラワーワールドから那須疏水公園→
 *    那須野が原公園→千本松牧場→那須野が原博物館→乃木神社の、北から南への一方向。
 * 3) 滞在の長さ(決まりA): 那須どうぶつ王国150分は昼食込みと明記、那須平成の森90分は
 *    「ふれあいの森」を歩く前提と明記、千本松牧場90分は具体的な過ごし方を明記。
 * 4) 那須フラワーワールドのチューリップは例年4月下旬〜5月下旬が見頃、開園期間は
 *    例年4月下旬〜10月下旬(公式で確認)。本文は特定の日付を書かず「春には」の表現の
 *    ままとした(決まり9)。那須ロープウェイの春の運行開始日(例年3月中旬)も、本文には
 *    具体的な日付を書かず「冬季は運休することがある」旨の案内にとどめた。
 *
 * 座標はNominatim(OSM)で確認。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { updateSpotInItinerary, findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "参拝の際は、敬意を持ってお参りしましょう。";
const ITIN = "bb9c4e59-3518-4a44-9e66-3544ddfc3b45";

// ---- Day1 additions ----
const ROPEWAY_MEMO =
  "旅の始まりは那須ロープウェイです。那須連峰の主峰・茶臼岳の9合目まで、山麓駅からおよそ4分で結ぶロープウェイで、山頂駅の展望台からは、那須の山並みや遠く関東平野まで見渡す大パノラマが広がります。冬季は運休することがあるため、訪れる前に運行状況を確かめておきましょう。標高およそ1,700mの高原の空気を、旅の始まりに感じてみてください。この後は、車でおよそ8分、那須高原展望台へ向かいましょう。";

const TENBODAI_MEMO =
  "那須ロープウェイから車でおよそ8分、標高およそ1,048mに位置する那須高原展望台に着きます。平成22年(2010)、「恋人の聖地」として全国で100番目に選ばれた展望スポットで、晴れた日には八溝山系まで見渡す大パノラマが広がります。那須温泉街から那須湯本へ下っていく途中にあり、これから向かう那須の町並みを一望できる、旅の見通しにぴったりの場所です。この後は、車でおよそ5分、殺生石へ向かいましょう。";

const SESSHOSEKI_MEMO_NEW =
  "那須高原展望台から車でおよそ5分、那須湯本の温泉街の奥、硫黄の匂いが漂う一帯にある殺生石に着きます。平安時代の伝説によれば、帝をたぶらかそうとした九尾の狐が退治されたあと、その怨念がこの石に宿り、近づく人や生き物の命を奪い続けたと伝えられています。俳人・松尾芭蕉も『おくのほそ道』の旅の途中でこの地を訪れて句を残しており、あたり一帯は「おくのほそ道の風景地」として国の名勝にも指定されています。今も硫化水素などのガスが発生しているため、柵の外から見学し、柵の中には立ち入らないようにしましょう。この後は、歩いておよそ5分、那須温泉神社へ向かいましょう。";

const HEISEINOMORI_MEMO_V2 =
  "鹿の湯から車でおよそ8分、那須連峰の麓に広がる那須平成の森に着きます。この森は、もともと1926年に開かれた那須御用邸の敷地の一部でした。動植物の記録を残したいという上皇陛下(当時天皇)のお考えを受け、栃木県立博物館が平成9年度から13年度にかけて自然環境の調査を行いました。そして「国民が自然にふれあえる場として活用してはどうか」という上皇陛下のお考えから、御在位20年の節目に、御用邸用地の約半分にあたる約560ヘクタールが宮内庁から環境省へと移管され、2011年5月22日に開園したと伝えられています。園内は、自由に散策できる「ふれあいの森」と、専門のインタープリターが同行して案内してくれる「学びの森」の2つのエリアに分かれており、今回は自由に歩ける「ふれあいの森」を散策します。見どころは、幅約2m・落差約20mを誇る「駒止の滝」です。かつては葉が落ちる冬の季節でなければ全容を見ることができませんでしたが、2011年の開園にあわせて観瀑台が整備され、周囲の山並みとともにその姿を眺められるようになりました。なお、御用邸用地の残り半分は、現在も皇室が使用される那須御用邸として存続しており、平成の森はそのすぐ隣に位置しています。自然の記憶と皇室の歴史が重なり合う、静かで特別な森をゆっくりとお楽しみください。この後は、車でおよそ8分、那須どうぶつ王国へ向かいましょう。";

const OUKOKU_MEMO_V2 =
  "那須平成の森から車でおよそ8分、那須連峰を望む高原に広がる那須どうぶつ王国に着きます。屋内施設が中心の「王国タウン」と、大自然の中に広がる「王国ファーム」の2つのエリアからなり、その間はワンニャンバスと呼ばれるシャトルで行き来できます。王国タウンでは、話題のマヌルネコや、希少種のスナネコ、ライチョウなどに間近で出会えるほか、フクロウやアルパカへのエサやり体験も人気です。王国ファームでは、広々とした牧場で羊やヤギとふれあえるほか、猛禽類が空を舞うバードパフォーマンスも見応えがあります。園内にはレストランや軽食コーナーもあるので、ここで昼食をとりながら、ゆっくり2時間半ほどかけて園内を回るとよいでしょう。屋内施設も多いので、天気を気にせずゆっくり過ごせます。那須ロープウェイから那須湯本、那須平成の森とめぐった、高原リゾートの1日目は、ここで終了です。お疲れさまでした。";

// ---- Day2: remove outlet, add new spots ----
const FLOWERWORLD_MEMO_V2 =
  "2日目は、那須連峰を背景に四季折々の花が咲き誇る那須フラワーワールドから始めましょう。那須高原の広々とした敷地に、季節ごとにさまざまな花々が植えられ、多くの人々の目を楽しませてきました。春にはチューリップやネモフィラ、アイスランドポピーが一面に咲き誇り、初夏にかけてはルピナスやバラが彩りを添えます。秋にはケイトウやブルーサルビアなど、季節ごとに表情を変える花畑が広がるのが、このフラワーワールドの大きな魅力です。雄大な那須連峰を背景に、色とりどりの花々が広がる景色は、写真撮影にもぴったりの美しさです。なお那須フラワーワールドには、福島県に「白河フラワーワールド」という姉妹施設もありますので、訪れる際はお間違えのないようご注意ください。広い花畑をゆっくりと歩きながら、季節の花々が織りなす那須高原ならではの景色を、心ゆくまでお楽しみください。この後は、車でおよそ20分、那須疏水公園へ向かいましょう。";

const SOSUI_MEMO =
  "那須フラワーワールドから車でおよそ20分、那須疏水公園に着きます。那須疏水は明治18年(1885)、政府の直轄事業として開削された用水路で、琵琶湖疏水・安積疏水とあわせて日本三大疏水の一つとされることもあります。荒れ地だった那須野が原に水を引き、広大な農地への開拓を可能にした、この地域の歴史を語るうえで欠かせない存在です。公園内には、現在の取水施設ができる前の明治期の旧取水施設が残されており、東水門・西水門などが国の重要文化財に指定されています。水と人の手によって切り拓かれてきた那須野が原の歴史に、静かに思いをはせてみてください。この後は、車でおよそ18分、那須野が原公園へ向かいましょう。";

const NASUNOGAHARA_MEMO_V2 =
  "那須疏水公園から車でおよそ18分、那須野が原公園に着きます。この公園を含む那須野が原の開拓の歴史は、日本遺産にも認定されています。園のシンボルであるサンサンタワーは、開園10周年を記念して整備された展望塔で、牧歌的な那須野が原の雰囲気にあわせて、サイロをイメージした姿をしています。高さおよそ33.3mの最上階からは、日本でも有数の広さを誇る扇状地・那須野が原を360度見渡すことができ、晴れた日には那須連峰の山並みも一望できます。売店や芝生の広場もあるので、ここで昼食にするのもおすすめです。この後は、車でおよそ5分、千本松牧場へ向かいましょう。";

const SENBONMATSU_MEMO_V2 =
  "那須野が原公園から車でおよそ5分、130年あまりの歴史を持つ観光牧場、千本松牧場に着きます。広々とした敷地には、ウサギやモルモット、羊、ヤギなどとふれあえる「どうぶつふれあい広場」をはじめ、サイクリングや乗馬、ロードトレインなど、家族で楽しめるアクティビティがそろっています。たとえば、動物とふれあったあとサイクリングで敷地を回り、搾りたての牛乳を使ったソフトクリームで一休みする、といった過ごし方ができます。敷地内には足湯もあり、歩き疲れた足をゆっくり休めることもできます。この後は、車でおよそ10分、那須野が原博物館へ向かいましょう。";

const NASUNOGAHARA_MUSEUM_MEMO =
  "千本松牧場から車でおよそ10分、那須野が原博物館に着きます。平成16年(2004)に開館した博物館で、「那須野が原の開拓と自然・文化の営み」をテーマに、この地域の歴史や民俗、考古、自然、文学などを幅広く紹介しています。江戸時代まで水に乏しい荒れ地だった那須野が原が、那須疏水の開削を機に一大農業地帯へと変わっていった歩みを、資料や模型を通してたどることができます。先ほど那須疏水公園で見た景色の背景にある物語を、ここでじっくり学んでみてください。この後は、車でおよそ8分、乃木神社へ向かいましょう。";

const NOGIJINJA_MEMO =
  "那須野が原博物館から車でおよそ8分、乃木神社に着きます。日露戦争で第三軍司令官を務めた軍人・乃木希典と、その妻・静子をまつる神社で、乃木夫妻が晩年を過ごした別邸の敷地内に、大正5年(1916)に社殿が建てられました。明治天皇の崩御を追って夫妻が殉死したのち、地元の人々の間で「乃木夫妻をまつる神社を」という声が高まり、創建に至ったと伝えられています。静かな杜に包まれた境内から、乃木夫妻ゆかりの那須野が原の歴史にふれてみてください。" +
  RESPECT +
  "那須フラワーワールドから那須疏水、那須野が原とめぐった、高原リゾートの旅も、ここで無事に終了です。お疲れさまでした。";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({
    where: { itinerary: { id: ITIN }, dayNumber: 1 },
    include: { spots: { orderBy: { orderNo: "asc" } } },
  });
  const day2 = await prisma.day.findFirstOrThrow({
    where: { itinerary: { id: ITIN }, dayNumber: 2 },
    include: { spots: { orderBy: { orderNo: "asc" } } },
  });

  const byName1 = (n: string) => {
    const s = day1.spots.find((x) => x.name === n);
    if (!s) throw new Error(`Day1に見つかりません: ${n}`);
    return s.id;
  };
  const byName2 = (n: string) => {
    const s = day2.spots.find((x) => x.name === n);
    if (!s) throw new Error(`Day2に見つかりません: ${n}`);
    return s.id;
  };

  const SESSHOSEKI = byName1("殺生石");
  const ONSENJINJA = byName1("那須温泉神社");
  const SHIKANOYU = byName1("鹿の湯");
  const HEISEINOMORI = byName1("那須平成の森");
  const OUKOKU = byName1("那須どうぶつ王国");

  const FLOWERWORLD = byName2("那須フラワーワールド");
  const OUTLET = day2.spots.find((s) => s.name === "那須ガーデンアウトレット")?.id;
  const NASUNOGAHARA_PARK = byName2("那須野が原公園");
  const SENBONMATSU = byName2("千本松牧場");

  const day1Spots: SpotOrderItem[] = [
    { create: { name: "那須ロープウェイ", address: "栃木県那須郡那須町大字湯本那須岳国有林", lat: 37.124759, lng: 139.975126, memo: ROPEWAY_MEMO, visitTime: t(9, 0), stayDurationMin: 50, transitMode: null, transitDurationMin: null, transitLine: null } },
    { create: { name: "那須高原展望台", address: "栃木県那須郡那須町大字湯本", lat: 37.10501, lng: 139.995422, memo: TENBODAI_MEMO, visitTime: t(9, 58), stayDurationMin: 20, transitMode: "car", transitDurationMin: 8, transitLine: null } },
    { id: SESSHOSEKI, data: { memo: SESSHOSEKI_MEMO_NEW, visitTime: t(10, 23), stayDurationMin: 30, transitMode: "car", transitDurationMin: 5, transitLine: null } },
    { id: ONSENJINJA, data: { visitTime: t(10, 58), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
    { id: SHIKANOYU, data: { visitTime: t(11, 28), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
    { id: HEISEINOMORI, data: { memo: HEISEINOMORI_MEMO_V2, visitTime: t(12, 26), stayDurationMin: 90, transitMode: "car", transitDurationMin: 8, transitLine: null } },
    { id: OUKOKU, data: { memo: OUKOKU_MEMO_V2, visitTime: t(14, 4), stayDurationMin: 150, transitMode: "car", transitDurationMin: 8, transitLine: null } },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: FLOWERWORLD, data: { memo: FLOWERWORLD_MEMO_V2, visitTime: t(9, 30), stayDurationMin: 90, transitMode: null, transitDurationMin: null, transitLine: null } },
    { create: { name: "那須疏水公園", address: "栃木県那須塩原市西岩崎", lat: 37.03803, lng: 139.985095, memo: SOSUI_MEMO, visitTime: t(11, 20), stayDurationMin: 35, transitMode: "car", transitDurationMin: 20, transitLine: null } },
    { id: NASUNOGAHARA_PARK, data: { memo: NASUNOGAHARA_MEMO_V2, visitTime: t(12, 13), stayDurationMin: 60, transitMode: "car", transitDurationMin: 18, transitLine: null } },
    { id: SENBONMATSU, data: { memo: SENBONMATSU_MEMO_V2, visitTime: t(13, 18), stayDurationMin: 90, transitMode: "car", transitDurationMin: 5, transitLine: null } },
    { create: { name: "那須野が原博物館", address: "栃木県那須塩原市三島5-3", lat: 36.899845, lng: 139.969099, memo: NASUNOGAHARA_MUSEUM_MEMO, visitTime: t(14, 58), stayDurationMin: 50, transitMode: "car", transitDurationMin: 10, transitLine: null } },
    { create: { name: "乃木神社", address: "栃木県那須塩原市石林483", lat: 36.887713, lng: 140.002543, memo: NOGIJINJA_MEMO, visitTime: t(15, 56), stayDurationMin: 35, transitMode: "car", transitDurationMin: 8, transitLine: null } },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, order] of [[1, day1Spots], [2, day2Spots]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      const stay = d.stayDurationMin as number;
      const label = "id" in x ? "(既存更新)" : `(新規)${d.name}`;
      console.log(`D${n} ${hm(st)}-${hm(st + stay)} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}分${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${label}${d.memo ? ` memo${String(d.memo).length}字` : ""}`);
      prevEnd = st + stay;
    }
    console.log(`D${n} 終了: ${hm(prevEnd)}`);
  }
  console.log(`那須ガーデンアウトレットは削除対象: ${OUTLET ?? "(既に無い)"}`);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, OUTLET ? { remove: [OUTLET], tx } : { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
