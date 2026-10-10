/**
 * #84 bb9c4e59（那須平成の森とフラワーワールド、高原リゾートでのんびり1泊2日）
 *
 * 決まり4か所以上・9時〜17時の見直し。既存はDay1が那須平成の森(10:00開始で窓外)の
 * 1か所、Day2が那須フラワーワールドの1か所のみで、両日とも4か所未満・Day1は開始も
 * 規定外だった。決まりAにもとづき実在するスポットを追加。座標はNominatim(OSM)で確認。
 *
 * Day1(那須湯本・御用邸エリア): 殺生石(新規、九尾の狐伝説、おくのほそ道の風景地)→
 * 那須温泉神社(新規、鹿の湯開湯伝説、芭蕉句碑)→鹿の湯(新規、およそ1300年の歴史を持つ
 * 共同浴場、日帰り入浴)→那須平成の森(既存、開始を9:00に修正)→那須どうぶつ王国(新規、
 * 昼食の一言)の5か所。
 *
 * Day2(那須塩原・南部エリア): 那須フラワーワールド(既存)→那須ガーデンアウトレット
 * (新規、昼食の一言)→那須野が原公園(新規、サンサンタワー展望塔、日本遺産)→千本松牧場
 * (新規、130年あまりの歴史)の4か所。フラワーワールドから千本松牧場にかけて、
 * 東(140.08)から西(139.94)・北(37.11)から南(36.93)への一方向。
 *
 * 「入場無料の交流ゾーン」のような決まり9抵触は既存本文になし(念のため確認済み)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "参拝の際は、敬意を持ってお参りしましょう。";

// ---- Day1 ----
const SESSHOSEKI_MEMO =
  "旅の始まりは殺生石です。那須湯本の温泉街の奥、硫黄の匂いが漂う一帯にある岩で、平安時代の伝説によれば、帝をたぶらかそうとした九尾の狐が退治されたあと、その怨念がこの石に宿り、近づく人や生き物の命を奪い続けたと伝えられています。俳人・松尾芭蕉も『おくのほそ道』の旅の途中でこの地を訪れて句を残しており、あたり一帯は「おくのほそ道の風景地」として国の名勝にも指定されています。今も硫化水素などのガスが発生しているため、柵の外から見学し、柵の中には立ち入らないようにしましょう。この後は、歩いておよそ5分、那須温泉神社へ向かいましょう。";

const ONSENJINJA_MEMO =
  "殺生石から歩いておよそ5分、那須温泉神社に着きます。7世紀、狩人の狩野三郎行広が、傷を負わせた鹿が温泉で傷を癒やしているのを見つけたという「鹿の湯」開湯の伝説にちなんでまつられた神社で、那須温泉の守り神として親しまれてきました。松尾芭蕉も殺生石を訪れる前にこの神社に参詣したと伝えられ、境内には芭蕉の句碑も残っています。石段を上った先の静かな境内から、那須の山あいの空気を感じてみてください。" +
  RESPECT +
  "この後は、歩いておよそ5分、鹿の湯へ向かいましょう。";

const SHIKANOYU_MEMO =
  "那須温泉神社から歩いておよそ5分、那須温泉発祥の湯として知られる鹿の湯に着きます。7世紀、狩人が傷ついた鹿を追ってこの地にたどり着き、鹿が湯につかって傷を癒やしているのを見つけたのが始まりと伝えられ、およそ1300年の歴史を持つ共同浴場です。硫黄を含む白く濁った湯で、温度の異なる木の湯船がいくつも並んでいるのが特徴です。熱めの湯が中心のため、まずはぬるい湯船から順に体を慣らしていくのが昔ながらの入り方とされています。日帰り入浴もできるので、歴史ある一湯につかって旅の疲れを癒やしてみてください。この後は、車でおよそ8分、那須平成の森へ向かいましょう。";

const HEISEINOMORI_MEMO_NEW =
  "鹿の湯から車でおよそ8分、那須連峰の麓に広がる那須平成の森に着きます。この森は、もともと1926年に開かれた那須御用邸の敷地の一部でした。動植物の記録を残したいという上皇陛下(当時天皇)のお考えを受け、栃木県立博物館が平成9年度から13年度にかけて自然環境の調査を行いました。そして「国民が自然にふれあえる場として活用してはどうか」という上皇陛下のお考えから、御在位20年の節目に、御用邸用地の約半分にあたる約560ヘクタールが宮内庁から環境省へと移管され、2011年5月22日に開園したと伝えられています。園内は、自由に散策できる「ふれあいの森」と、専門のインタープリターが同行して案内してくれる「学びの森」の2つのエリアに分かれています。見どころは、幅約2m・落差約20mを誇る「駒止の滝」です。かつては葉が落ちる冬の季節でなければ全容を見ることができませんでしたが、2011年の開園にあわせて観瀑台が整備され、周囲の山並みとともにその姿を眺められるようになりました。なお、御用邸用地の残り半分は、現在も皇室が使用される那須御用邸として存続しており、平成の森はそのすぐ隣に位置しています。自然の記憶と皇室の歴史が重なり合う、静かで特別な森をゆっくりとお楽しみください。この後は、車でおよそ8分、那須どうぶつ王国へ向かいましょう。";

const OUKOKU_MEMO =
  "那須平成の森から車でおよそ8分、那須連峰を望む高原に広がる那須どうぶつ王国に着きます。屋内施設が中心の「王国タウン」と、大自然の中に広がる「王国ファーム」の2つのエリアからなり、その間はワンニャンバスと呼ばれるシャトルで行き来できます。王国タウンでは、話題のマヌルネコや、希少種のスナネコ、ライチョウなどに間近で出会えるほか、フクロウやアルパカへのエサやり体験も人気です。王国ファームでは、広々とした牧場で羊やヤギとふれあえるほか、猛禽類が空を舞うバードパフォーマンスも見応えがあります。ここで昼食にするのもおすすめです。屋内施設も多いので、天気を気にせずゆっくり過ごせます。殺生石から鹿の湯、那須平成の森とめぐった、高原リゾートの1日目は、ここで終了です。お疲れさまでした。";

// ---- Day2 ----
const FLOWERWORLD_MEMO_NEW =
  "2日目は、那須連峰を背景に四季折々の花が咲き誇る那須フラワーワールドから始めましょう。那須高原の広々とした敷地に、季節ごとにさまざまな花々が植えられ、多くの人々の目を楽しませてきました。春にはチューリップやネモフィラ、アイスランドポピーが一面に咲き誇り、初夏にかけてはルピナスやバラが彩りを添えます。秋にはケイトウやブルーサルビアなど、季節ごとに表情を変える花畑が広がるのが、このフラワーワールドの大きな魅力です。雄大な那須連峰を背景に、色とりどりの花々が広がる景色は、写真撮影にもぴったりの美しさです。なお那須フラワーワールドには、福島県に「白河フラワーワールド」という姉妹施設もありますので、訪れる際はお間違えのないようご注意ください。広い花畑をゆっくりと歩きながら、季節の花々が織りなす那須高原ならではの景色を、心ゆくまでお楽しみください。この後は、車でおよそ25分、那須ガーデンアウトレットへ向かいましょう。";

const OUTLET_MEMO =
  "那須フラワーワールドから車でおよそ25分、那須連峰を望む高原にある那須ガーデンアウトレットに着きます。緑豊かな敷地に、国内外のさまざまなブランドのショップが立ち並ぶ屋外型のアウトレットモールで、買い物だけでなく、開放的な高原の空気を感じながら散策するだけでも気持ちの良い時間を過ごせます。地元の食材を使ったグルメも楽しめるので、ここで昼食にするのもおすすめです。この後は、車でおよそ12分、那須野が原公園へ向かいましょう。";

const NASUNOGAHARA_MEMO =
  "那須ガーデンアウトレットから車でおよそ12分、那須野が原公園に着きます。この公園を含む那須野が原の開拓の歴史は、日本遺産にも認定されています。園のシンボルであるサンサンタワーは、開園10周年を記念して整備された展望塔で、牧歌的な那須野が原の雰囲気にあわせて、サイロをイメージした姿をしています。高さおよそ33.3mの最上階からは、日本でも有数の広さを誇る扇状地・那須野が原を360度見渡すことができ、晴れた日には那須連峰の山並みも一望できます。芝生の広場も広がっているので、ここでゆっくり体を休めるのもよいでしょう。この後は、車でおよそ5分、千本松牧場へ向かいましょう。";

const SENBONMATSU_MEMO =
  "那須野が原公園から車でおよそ5分、130年あまりの歴史を持つ観光牧場、千本松牧場に着きます。広々とした敷地には、ウサギやモルモット、羊、ヤギなどとふれあえる「どうぶつふれあい広場」をはじめ、サイクリングや乗馬、ロードトレインなど、家族で楽しめるアクティビティがそろっています。搾りたての牛乳を使ったソフトクリームや乳製品も名物で、旅の締めくくりに味わってみてください。敷地内には足湯もあり、歩き疲れた足をゆっくり休めることもできます。那須フラワーワールドからガーデンアウトレット、那須野が原公園とめぐった、高原リゾートの旅も、ここで無事に終了です。お疲れさまでした。";

async function main() {
  const it = await prisma.itinerary.findFirstOrThrow({
    where: { title: { contains: "那須平成の森とフラワーワールド" } },
    select: { id: true },
  });
  const days = await prisma.day.findMany({
    where: { itineraryId: it.id },
    orderBy: { dayNumber: "asc" },
    include: { spots: { orderBy: { orderNo: "asc" } } },
  });
  if (days.length !== 2) throw new Error(`日数が想定と違います: ${days.length}`);
  const day1 = days[0];
  const day2 = days[1];
  if (day1.spots.length !== 1 || day1.spots[0].name !== "那須平成の森") throw new Error("Day1構成が想定と違います");
  if (day2.spots.length !== 1 || day2.spots[0].name !== "那須フラワーワールド") throw new Error("Day2構成が想定と違います");
  const HEISEINOMORI = day1.spots[0].id;
  const FLOWERWORLD = day2.spots[0].id;

  const day1Spots: SpotOrderItem[] = [
    { create: { name: "殺生石", address: "栃木県那須郡那須町湯本", lat: 37.101572, lng: 139.999027, memo: SESSHOSEKI_MEMO, visitTime: t(9, 0), stayDurationMin: 30, transitMode: null, transitDurationMin: null, transitLine: null } },
    { create: { name: "那須温泉神社", address: "栃木県那須郡那須町湯本182", lat: 37.09996, lng: 139.9989996, memo: ONSENJINJA_MEMO, visitTime: t(9, 35), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
    { create: { name: "鹿の湯", address: "栃木県那須郡那須町湯本181", lat: 37.098262, lng: 140.001112, memo: SHIKANOYU_MEMO, visitTime: t(10, 5), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
    { id: HEISEINOMORI, data: { memo: HEISEINOMORI_MEMO_NEW, visitTime: t(11, 3), stayDurationMin: 90, transitMode: "car", transitDurationMin: 8, transitLine: null } },
    { create: { name: "那須どうぶつ王国", address: "栃木県那須郡那須町大島1042-1", lat: 37.132046, lng: 140.040406, memo: OUKOKU_MEMO, visitTime: t(12, 41), stayDurationMin: 150, transitMode: "car", transitDurationMin: 8, transitLine: null } },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: FLOWERWORLD, data: { memo: FLOWERWORLD_MEMO_NEW, visitTime: t(9, 30), stayDurationMin: 90, transitMode: null, transitDurationMin: null, transitLine: null } },
    { create: { name: "那須ガーデンアウトレット", address: "栃木県那須塩原市塩野崎184-7", lat: 36.965791, lng: 139.991287, memo: OUTLET_MEMO, visitTime: t(11, 25), stayDurationMin: 90, transitMode: "car", transitDurationMin: 25, transitLine: null } },
    { create: { name: "那須野が原公園", address: "栃木県那須塩原市千本松801", lat: 36.930741, lng: 139.948012, memo: NASUNOGAHARA_MEMO, visitTime: t(13, 7), stayDurationMin: 60, transitMode: "car", transitDurationMin: 12, transitLine: null } },
    { create: { name: "千本松牧場", address: "栃木県那須塩原市千本松532", lat: 36.926659, lng: 139.93575, memo: SENBONMATSU_MEMO, visitTime: t(14, 12), stayDurationMin: 90, transitMode: "car", transitDurationMin: 5, transitLine: null } },
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

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
