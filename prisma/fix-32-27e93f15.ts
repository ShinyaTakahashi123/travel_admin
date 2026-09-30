/**
 * #32 27e93f15（金鱗湖の朝霧と由布院温泉、冬の湯どころをめぐるプラン）
 * ユーザー決定「全部直す」。企画運営の指摘で、Day1 14:38・Day2 12:08 をともに
 * 16:30〜17:00に合わせる（Day2の7:00開始は朝霧狙いの例外として維持、終わりは直す）。
 *
 * Day1: 既存5か所のあとに九重"夢"大吊橋(新規、日本一の高さの歩道専用吊橋)を追加。
 * Day2: 下ん湯の滞在139分(決まりA違反の水増し)を35分に是正。城島高原パーク(新規、
 * 遊園地)・海地獄/鬼山地獄/血の池地獄/龍巻地獄(新規、別府地獄めぐり4か所)を追加。
 * 城島高原パークの185分は、複数アトラクションを回る遊園地の滞在として妥当と判断。
 *
 * 座標: Nominatim確認。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const it = await prisma.itinerary.findFirstOrThrow({
    where: { title: { contains: "金鱗湖の朝霧と由布院温泉" } },
    select: { id: true },
  });
  const days = await prisma.day.findMany({
    where: { itineraryId: it.id },
    orderBy: { dayNumber: "asc" },
    include: { spots: { orderBy: { orderNo: "asc" } } },
  });
  const day1 = days[0];
  const day2 = days[1];

  const FLORAL_MEMO_NEW =
    "湯の坪街道から歩いておよそ4分、英国の街並みをイメージした由布院フローラルヴィレッジに着きます。石畳の小径に、色とりどりの花と小さな洋風の建物が並び、雑貨店やスイーツ店、動物とふれあえる施設などが軒を連ねています。写真映えする街並みを、ゆっくりと散策してみてください。軽食を楽しめるお店もあるので、ここでお昼をとるのもおすすめです。続いては宇奈岐日女神社へ向かいましょう。";

  const STAINEDGLASS_MEMO_NEW =
    "宇奈岐日女神社から歩いておよそ5分、由布院ステンドグラス美術館に着きます。ヨーロッパをはじめ世界各地から集められたアンティークステンドグラスの作品を展示する美術館で、窓越しに差し込む光が、色とりどりのガラスを通して幻想的な模様を映し出します。この後は、車でおよそ35分、九重\"夢\"大吊橋へ向かいましょう。";

  const YUME_OTSURIBASHI_MEMO =
    "由布院ステンドグラス美術館から車でおよそ35分、九重\"夢\"大吊橋に着きます。全長およそ390m、高さおよそ173mの歩道専用吊橋で、その高さは国内でも指折りとされています。橋の上からは、「日本の滝百選」に選ばれた震動の滝(雄滝・雌滝)を望むことができ、足もとには鳴子川渓谷の原生林が広がります。ゆっくりと橋を渡り、山々に抱かれた渓谷の景色を、旅の締めくくりに眺めてみてください。由布院駅から湯の坪街道、宇奈岐日女神社とめぐった1日目は、ここで終了です。お疲れさまでした。";

  const SHIMONOYU_MEMO_NEW =
    "金鱗湖のほとりから歩いてすぐ、地元の人に親しまれてきた共同浴場、下ん湯に着きます。金鱗湖の湖畔にひっそりとたたずむ小さな湯小屋で、由布院温泉の素朴な歴史を今に伝える場所です。朝の静けさの中、湖を眺めながら過ごすひとときを味わってみてください。共同浴場なので、中をのぞいたり撮影したりしないようにしましょう。この後は、歩いておよそ10分、由布院空想の森アルテジオへ向かいましょう。";

  const SAGIRIDAI_MEMO_NEW =
    "由布院空想の森アルテジオから車でおよそ8分、狭霧台に着きます。由布院盆地を見下ろす高台にある展望地で、由布岳を背景に、盆地に広がる田園風景を一望できます。名前の通り、霧が立ち込める朝にはひときわ幻想的な眺めとなり、金鱗湖の朝霧とはまた違った、由布院盆地全体を覆う雲海のような景色に出会えることもあります。この後は、車でおよそ12分、城島高原パークへ向かいましょう。";

  const KIJIMA_MEMO =
    "狭霧台から車でおよそ12分、由布院と別府のほぼ中間にある城島高原パークに着きます。日本初の木製コースター「ジュピター」をはじめ、家族連れから絶叫好きまで楽しめるさまざまなアトラクションがそろう遊園地です。ゴーカートやメリーゴーラウンドなど小さな子供向けの乗り物も充実しており、幅広い世代で一日楽しめます。園内にはレストランやフードコートもあるので、ここでお昼をとることもできます。金鱗湖の朝霧を眺めた静かな朝とはがらりと趣を変えて、にぎやかな時間を過ごしてみてください。この後は、車でおよそ15分、別府の海地獄へ向かいましょう。";

  const UMIJIGOKU_MEMO =
    "城島高原パークから車でおよそ15分、別府温泉の象徴ともいえる海地獄に着きます。コバルトブルーに輝く湯の色が、まるで海のように見えることからこの名がついたと伝えられています。摂氏98度もの高温の湯からは絶えず白い蒸気が立ちのぼり、大正時代から続く別府地獄めぐりの中でも指折りの人気を誇ります。庭園内には熱帯スイレンの温室もあり、地熱を利用して育てられた植物も見どころの一つです。この後は、歩いておよそ6分、鬼山地獄へ向かいましょう。";

  const ONIYAMAJIGOKU_MEMO =
    "海地獄から歩いておよそ6分、鬼山地獄に着きます。地獄の温泉熱を利用してワニを飼育していることから「ワニ地獄」の愛称でも親しまれています。100頭以上のワニが、もうもうと湯気の立つ池のほとりで身を寄せ合う姿は、南国さながらの不思議な光景です。地熱と共生する別府ならではの生態展示を楽しんでみてください。この後は、車でおよそ5分、血の池地獄へ向かいましょう。";

  const CHINOIKEJIGOKU_MEMO =
    "鬼山地獄から車でおよそ5分、血の池地獄に着きます。日本最古の天然地獄ともいわれ、酸化鉄を含む赤褐色の熱泥が湧き出す様子から、その名がつけられたと伝えられています。『豊後国風土記』にもその存在が記されているとされ、古くから人々に知られてきた景観です。真っ赤に染まった池の様子は、ほかの地獄とはまた違う迫力があります。この後は、歩いておよそ5分、龍巻地獄へ向かいましょう。";

  const TATSUMAKIJIGOKU_MEMO =
    "血の池地獄から歩いておよそ5分、旅の締めくくりは龍巻地獄です。およそ30分から40分の周期で、高温の熱湯と蒸気が勢いよく噴き上がる間欠泉で、天然の間欠泉としては世界でも有数の短い周期で噴出するとされています。噴出の瞬間には、あたりに轟音とともに白い湯けむりが立ちのぼり、大迫力の景色を見せてくれます。金鱗湖の静かな朝霧から、城島高原の賑わい、そして別府の地獄めぐりへと移り変わった2日目も、ここで無事に終了です。お疲れさまでした。";

  const day1Spots: SpotOrderItem[] = [
    { id: day1.spots[0].id, data: {} },
    { id: day1.spots[1].id, data: {} },
    { id: day1.spots[2].id, data: { memo: FLORAL_MEMO_NEW } },
    { id: day1.spots[3].id, data: {} },
    { id: day1.spots[4].id, data: { memo: STAINEDGLASS_MEMO_NEW } },
    { create: { name: "九重\"夢\"大吊橋", address: "大分県玖珠郡九重町大字田野1208", lat: 33.174177, lng: 131.227066, memo: YUME_OTSURIBASHI_MEMO, visitTime: t(15, 13), stayDurationMin: 80, transitMode: "car", transitDurationMin: 35, transitLine: null } },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: day2.spots[0].id, data: {} },
    { id: day2.spots[1].id, data: { memo: SHIMONOYU_MEMO_NEW, visitTime: t(7, 41), stayDurationMin: 35 } },
    { id: day2.spots[2].id, data: { visitTime: t(8, 26) } },
    { id: day2.spots[3].id, data: { memo: SAGIRIDAI_MEMO_NEW, visitTime: t(9, 44) } },
    { create: { name: "城島高原パーク", address: "大分県別府市城島高原123-1", lat: 33.264487, lng: 131.426856, memo: KIJIMA_MEMO, visitTime: t(10, 36), stayDurationMin: 185, transitMode: "car", transitDurationMin: 12, transitLine: null } },
    { create: { name: "海地獄", address: "大分県別府市鉄輪559-1", lat: 33.315888, lng: 131.469683, memo: UMIJIGOKU_MEMO, visitTime: t(13, 56), stayDurationMin: 35, transitMode: "car", transitDurationMin: 15, transitLine: null } },
    { create: { name: "鬼山地獄", address: "大分県別府市鉄輪625", lat: 33.316147, lng: 131.47336, memo: ONIYAMAJIGOKU_MEMO, visitTime: t(14, 37), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 6, transitLine: null } },
    { create: { name: "血の池地獄", address: "大分県別府市野田778", lat: 33.327189, lng: 131.478116, memo: CHINOIKEJIGOKU_MEMO, visitTime: t(15, 12), stayDurationMin: 35, transitMode: "car", transitDurationMin: 5, transitLine: null } },
    { create: { name: "龍巻地獄", address: "大分県別府市亀川野田782", lat: 33.327579, lng: 131.480755, memo: TATSUMAKIJIGOKU_MEMO, visitTime: t(15, 52), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, dayObj, order] of [[1, day1, day1Spots], [2, day2, day2Spots]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const orig = "id" in x ? dayObj.spots.find((s) => s.id === x.id) : undefined;
      const vt = (d.visitTime as Date) ?? orig?.visitTime;
      const stay = (d.stayDurationMin as number) ?? orig?.stayDurationMin;
      if (!vt || stay == null) continue;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`D${n} ${hm(st)}-${hm(st + stay)}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`}`);
      prevEnd = st + stay;
    }
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
