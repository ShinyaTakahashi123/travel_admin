/**
 * #469 6321bfec（小田原・箱根湯本 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 3か所 09:30〜13:05（小田原城 →（車）石垣山一夜城 →（車）早雲寺）
 *   小田原城のあと城下のかまぼこ通りで昼食、石垣山へはバスが走る日が限られるのでタクシー（決まり8）、山を下りて入生田の博物館、箱根湯本の早雲寺と温泉へ（戻らない）
 *   小田原城天守閣 9:10〜10:25 →（歩き5分）報徳二宮神社（新規）10:30〜10:55 →（歩き10分）かまぼこ通り（新規・昼食）11:05〜12:15 →（タクシー15分）石垣山一夜城歴史公園 12:30〜13:25
 *   →（タクシー10分）生命の星・地球博物館（新規）13:35〜14:50 →（箱根登山鉄道と歩き25分）早雲寺 15:15〜15:55 →（歩き10分）箱根湯本温泉（新規）16:05〜16:50
 *   閉まる時刻: 天守閣 9:00〜17:00、生命の星・地球博物館 9:00〜16:30（入館16:00まで・月曜休館）。本文に時刻・曜日は書かない
 *   北条氏政・氏照の墓所は、いきさつが自害にかかわるので入れない
 * 本文の出典: 小田原城 https://odawaracastle.com/castlepark/tennsyukaku/ 、箱根ナビ https://www.hakonenavi.jp/spot/11164 （小田原駅から歩いて約10分）、報徳二宮神社 https://www.ninomiya.or.jp/info/ 、
 *   小田原市観光協会 https://www.odawara-kankou.com/spot/spot_area/kamabokodouri.html ・/access/kanko_bus/ 、小田原市 https://www.city.odawara.kanagawa.jp/public-i/park/ishigaki-p.html ・/kanko/spot/seimeinohositikyu.html 、
 *   箱根町観光協会 https://www.hakone.or.jp/529 （早雲寺）・/6892 （湯本温泉）
 * 座標の出典: OSM（小田原城天守閣 way 167050294／報徳二宮神社 way 558481071／小田原かまぼこ通り way 62217808／石垣山一夜城 way 1168866323／神奈川県立生命の星・地球博物館 node 1420830429／
 *   早雲寺 way 562114835／湯本橋 way 1160258229）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-469-6321bfec.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "6321bfec-5cd0-49d0-9442-6001d80afe1b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const BATH = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。";

const DESCRIPTION = "戦国大名・小田原北条氏の本拠だった小田原城と報徳二宮神社から、城下のかまぼこ通りへ。午後は秀吉の小田原攻めの本陣・石垣山一夜城、入生田の生命の星・地球博物館、北条氏の菩提寺・早雲寺をたずね、箱根湯本の温泉で締めくくる日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["小田原城", "石垣山一夜城歴史公園", "早雲寺"].join()) throw new Error("構成が想定と違います");
  const [castle, ishigaki, soun] = day.spots;

  const order = [
    { id: castle.id, data: { name: "小田原城天守閣", visitTime: t(9, 10), stayDurationMin: 75, transitMode: null, transitDurationMin: null, transitLine: null, lat: 35.251055, lng: 139.153425, address: "神奈川県小田原市城内",
      memo: "この旅は歩きと電車、タクシーでめぐります。JR・小田急線の小田原駅から歩いて約10分の小田原城天守閣へ。今の天守閣は、昭和35年に市制20周年の記念事業として、江戸時代の雛型や設計図をもとに外観を復元したもので、3重4階の天守櫓に付櫓・渡櫓がつく、高さ38.7mの天守です。館内では、戦国大名・小田原北条氏の歴史や、江戸時代の小田原城の役割などを紹介しています。標高約60mの最上階からは相模湾が一望でき、よく晴れた日には房総半島まで見わたせます。" } },
    { create: mk({ name: "報徳二宮神社", h: 10, m: 30, stay: 25, mode: "walk", min: 5, lat: 35.249852, lng: 139.152966, address: "神奈川県小田原市城内8-10",
      memo: "天守閣から歩いてすぐの、小田原城址公園の中の報徳二宮神社へ。明治27年（1894年）、二宮尊徳の教えを慕う伊豆・三河・遠江・駿河・甲斐・相模の6か国の報徳社の総意により、尊徳を御祭神として、生まれ故郷の小田原の、小田原城二の丸小峰曲輪の一角に創建された神社です。" + RESPECT }) },
    { create: mk({ name: "小田原かまぼこ通り", h: 11, m: 5, stay: 70, mode: "walk", min: 10, lat: 35.247833, lng: 139.160275, address: "神奈川県小田原市本町3丁目",
      memo: "城址公園から海の方へ歩いて、かまぼこ通りへ。かまぼこ屋の本店が並び、かつて魚市場だったこともあって、干物屋や鰹節屋、料亭、飲食店、和菓子屋などが軒を連ねる通りです。江戸から明治のころの、いちばん賑わった時代の風情を再現した通りとして紹介されています。このあたりで昼食にしましょう。" }) },
    { id: ishigaki.id, data: { visitTime: t(12, 30), stayDurationMin: 55, transitMode: "taxi", transitDurationMin: 15, transitLine: null, lat: 35.235771, lng: 139.128069, address: "神奈川県小田原市早川1383-12",
      memo: "石垣山へ向かう観光回遊バスは走る日が限られるので、かまぼこ通りからタクシーで石垣山一夜城歴史公園へ。天正18年（1590年）、豊臣秀吉が小田原北条氏を攻めたときに本陣として築いた城の跡で、のべ4万人を動員して約80日かけて築かれました。まわりの木を切りはらって、一夜で城ができたように見せたという話から「一夜城」と呼ばれます。近江の穴太衆による野面積みの石垣が残り、関東で最初に造られた総石垣の城とされます。国の史跡で、続日本100名城にも選ばれています。石垣には登らず、足元に気をつけましょう。" } },
    { create: mk({ name: "生命の星・地球博物館", h: 13, m: 35, stay: 75, mode: "taxi", min: 10, lat: 35.239386, lng: 139.121582, address: "神奈川県小田原市入生田499",
      memo: "石垣山からタクシーで山を下りて、入生田の神奈川県立生命の星・地球博物館へ。「地球」「生命」「神奈川」「共生」の視点から、46億年の地球の歴史を紹介する博物館で、恐竜やアンモナイトなどの化石や、実物の資料を詰めこんだ大きな百科事典「ジャンボブック」の展示があります。休館日は公式の案内で確かめましょう。" }) },
    { id: soun.id, data: { visitTime: t(15, 15), stayDurationMin: 40, transitMode: "train", transitDurationMin: 25, transitLine: "箱根登山鉄道", lat: 35.23013, lng: 139.103653, address: "神奈川県足柄下郡箱根町湯本405",
      memo: "入生田駅から箱根登山鉄道で箱根湯本駅へ。駅から歩いて約15分の早雲寺は、北条氏の2代・氏綱が、初代・早雲の遺言によって大永元年（1521年）に建てた臨済宗大徳寺派の寺で、北条五代の墓が残ります。国の重要文化財の「北条早雲像」が伝わり、鐘楼の大きな古い梵鐘は、秀吉が小田原を攻めたときに石垣山の一夜城で使われたといわれています。早雲の三男・幻庵の作といわれる枯山水の庭園もあります。" + RESPECT } },
    { create: mk({ name: "箱根湯本温泉", h: 16, m: 5, stay: 45, mode: "walk", min: 10, lat: 35.231328, lng: 139.100375, address: "神奈川県足柄下郡箱根町湯本",
      memo: "早雲寺から坂を下りて、早川と須雲川の流れに沿って温泉旅館やホテルが並ぶ箱根湯本温泉へ。箱根十七湯の中でいちばん古い歴史を持ち、伝承では天平10年（738年）の開湯といわれる温泉です。日帰りで入れる温泉で、旅の疲れをいやしましょう。" + BATH + "北条五代ゆかりの地をめぐる旅を、ここで締めくくりましょう。帰りは、箱根湯本駅から。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 天守閣 9:10 → 報徳二宮神社 10:30 → かまぼこ通り（昼食）11:05 →（タクシー）石垣山 12:30 →（タクシー）生命の星 13:35 →（登山鉄道）早雲寺 15:15 → 湯本温泉 16:05〜16:50");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
