/**
 * チェックリスト #316 の修正記録(ふだんの見直し)。
 * しおり「松島湾遊覧船と福浦橋、島めぐりの絶景クルーズプラン」
 * (73f0b468-46de-471e-9d7c-4e24bf3e1b10)
 *
 * 本番で2か所09:30〜11:40のみで、決まり(4か所以上・終了16:30〜17:00)に
 * 届いていないことが判明。松島の代表的な実在スポットを4つ追加した。
 *
 * 出典: https://www.zuiganji.or.jp/ (瑞巌寺公式。天長5年(828)創建と伝わる、
 * 伊達政宗の菩提寺、本堂・庫裡及び廊下が国宝)
 * 出典: https://www.entuuin.or.jp/ (円通院公式。伊達光宗の霊廟、正保2年
 * (1645)開創、4つの庭園、支倉常長ゆかりの西洋バラ)
 * 出典: https://www.town.miyagi-matsushima.lg.jp/page/1199.html (五大堂、
 * 松島町公式。大同2年(807)坂上田村麻呂の毘沙門堂が最初、現在の建物は
 * 慶長9年(1604)伊達政宗建立、国重要文化財)
 * 出典: https://www.town.miyagi-matsushima.lg.jp/page/1140.html (観瀾亭、
 * 松島町公式。伏見桃山城の茶室を伊達家が移築、五代藩主吉村の命名)
 * 出典: https://www.jalan.net/kankou/spt_04401ac2100140677/ 等(西行戻しの
 * 松公園。松島湾を一望する高台、西行法師の伝説)
 *
 * 座標はすべてNominatim(OSM)の名称一致ノード。観瀾亭のみOSMに名称一致が
 * 無かったため、GSI住所検索(フルの番地「松島町内56番地」)で確認。
 *
 * 松島湾遊覧船・福浦橋の書き出しを、他のしおりと合わせて通常の文体に
 * 直した。松島湾遊覧船は最初のスポットでなくなったため、観瀾亭からの
 * 案内文に変更。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-316-73f0b468.ts
 * (実行済み。瑞巌寺の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "73f0b468-46de-471e-9d7c-4e24bf3e1b10";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];

  if (day1.spots.some((s) => s.name === "瑞巌寺")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const cruise = day1.spots.find((s) => s.name === "松島湾遊覧船")!;
  const fukuura = day1.spots.find((s) => s.name === "福浦橋")!;

  const cruiseMemo = (cruise.memo ?? "")
    .replace(
      "皆様、本日ご案内するのは松島湾遊覧船です。JR松島海岸駅から歩いて5分ほどの乗り場から、",
      "観瀾亭からは車でおよそ10分です。松島湾遊覧船は、"
    )
    .replace(
      "海の上から松島湾の全景を眺めたら、続いては福浦島へと続く朱塗りの橋、福浦橋へとご案内いたします。",
      "海の上から、松島湾の全景を眺めてみましょう。続いては、車でおよそ8分の福浦橋へ向かいましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: cruise.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 14, 8)),
    transitMode: "car",
    transitDurationMin: 10,
    memo: cruiseMemo,
  });

  const fukuuraMemo = (fukuura.memo ?? "").replace("皆様、続いてご案内するのは福浦橋です。", "松島湾遊覧船からは車でおよそ8分です。福浦橋は、");
  await updateSpotInItinerary(ITIN_ID, { spotId: fukuura.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 15, 16)),
    stayDurationMin: 75,
    memo: fukuuraMemo,
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        {
          create: {
            name: "西行戻しの松公園",
            address: "宮城郡松島町松島字犬田2",
            lat: 38.3673179,
            lng: 141.0529378,
            visitTime: new Date(Date.UTC(1970, 0, 1, 8, 30)),
            stayDurationMin: 30,
            transitMode: null,
            transitDurationMin: null,
            memo:
              "この旅は、車でめぐります。ご案内するのは西行戻しの松公園です。松島湾を見下ろす高台にある公園で、園内の白衣観音展望台からは、松島湾に浮かぶ島々や、遠く金華山まで見渡すことができます。歌人・西行法師が諸国行脚の折、この地で出会った童子との禅問答に敗れ、松島行きを断念したという言い伝えが、公園の名の由来です。松島の旅の始まりに、まずは高台から全景を眺めてみましょう。",
          },
        },
        {
          create: {
            name: "瑞巌寺",
            address: "宮城郡松島町松島91",
            lat: 38.3721758,
            lng: 141.0595579,
            visitTime: new Date(Date.UTC(1970, 0, 1, 9, 10)),
            stayDurationMin: 120,
            transitMode: "car",
            transitDurationMin: 10,
            memo:
              "西行戻しの松公園からは車でおよそ10分です。瑞巌寺は、天長5年(828)、慈覚大師によって創建されたと伝わる、奥州随一の禅寺です。仙台藩祖・伊達政宗の菩提寺として知られ、現在の建物は慶長14年(1609)、政宗が桃山様式の粋を尽くし、5年の歳月をかけて完成させたものです。本堂・庫裡及び廊下は国宝に指定されており、豪華な内部装飾や障壁画、伊達家ゆかりの品々の数々を見ることができます。松林と石畳の参道沿いには洞窟群も残り、みどころの多い境内をじっくりと巡ってみましょう。",
          },
        },
        {
          create: {
            name: "円通院",
            address: "宮城郡松島町松島字町内67",
            lat: 38.3712885,
            lng: 141.0599598,
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 12)),
            stayDurationMin: 90,
            transitMode: "walk",
            transitDurationMin: 2,
            memo:
              "瑞巌寺からは歩いておよそ2分です。円通院は、仙台藩2代藩主・伊達忠宗の次男・光宗の霊廟として、正保2年(1645)に開かれた寺です。光宗は19歳の若さで亡くなり、その死を悼んだ忠宗によって建てられました。趣の異なる4つの庭園があり、四季折々の景色を楽しめるほか、支倉常長がヨーロッパから持ち帰ったとされる、日本最古ともいわれる西洋バラが厨子に描かれていることでも知られています。静かな禅寺の空気の中、庭園めぐりを楽しんでみましょう。",
          },
        },
        {
          create: {
            name: "五大堂",
            address: "宮城郡松島町松島字町内111",
            lat: 38.3697244,
            lng: 141.0642082,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 47)),
            stayDurationMin: 25,
            transitMode: "walk",
            transitDurationMin: 5,
            memo:
              "円通院からは歩いておよそ5分です。五大堂は、大同2年(807)、坂上田村麻呂が東征の折に毘沙門堂を建てたのが始まりとされ、のちに慈覚大師が五大明王像を安置したことから、五大堂と呼ばれるようになりました。現在のお堂は慶長9年(1604)、伊達政宗によって建立されたもので、東北地方に現存する最古の桃山建築として、国の重要文化財に指定されています。海に浮かぶ小島に建つお堂へは、床板の隙間から海面が見える「すかし橋」を渡っていきます。足元に気をつけながら渡ってみましょう。",
          },
        },
        {
          create: {
            name: "観瀾亭",
            address: "宮城郡松島町松島字町内56",
            lat: 38.369701,
            lng: 141.062378,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 13)),
            stayDurationMin: 45,
            transitMode: "walk",
            transitDurationMin: 1,
            memo:
              "五大堂からは歩いてすぐです。観瀾亭は、もとは豊臣秀吉の伏見桃山城にあった茶室で、政宗が秀吉から譲り受け、その子・忠宗が現在地に移したと伝わる建物です。藩主一族の松島遊覧や、幕府からの巡見使の接待などに使われ、五代藩主・伊達吉村によって「観瀾亭」と名付けられました。隣接する松島博物館では、伊達家ゆかりの品々が展示されています。このあたりで、昼食をとりましょう。伊達家の歴史に思いをはせながら、ひと休みしてみましょう。",
          },
        },
        { id: cruise.id, data: {} },
        { id: fukuura.id, data: {} },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
