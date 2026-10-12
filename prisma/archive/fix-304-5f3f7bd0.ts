/**
 * チェックリスト #304 の修正記録(ふだんの見直し)。
 * しおり「遠刈田温泉の共同浴場めぐり、宮城蔵王の湯治文化を楽しむ日帰り
 * プラン」(5f3f7bd0-2efd-405d-840c-53913d342c3e)
 *
 * 本番で2か所・10:00〜12:40のみで、決まり(1日4か所以上・開始8:30〜9:30・
 * 終了16:30〜17:00)に届いていないことが判明。ガイド口調だった「遠刈田
 * 温泉」の総称スポットを、実在する2つの共同浴場と、遠刈田温泉の由来にも
 * 関わる刈田嶺神社(里宮)に分割・具体化し、こけし館と蔵王山頂を加えた。
 *
 * 1. 刈田嶺神社(里宮)(node、遠刈田温泉仲町): 遠刈田温泉の発展を支えた
 *    神社、御神体が夏冬で山頂の奥宮と行き来する。
 *    出典(直接開いたURL): https://www.zao-machi.com/temples_history/425.html
 *    (蔵王町観光物産協会公式)
 * 2. 神の湯・壽の湯(node、遠刈田温泉本町): 実在する2つの共同浴場。
 *    出典: https://www.zao-machi.com/stay_hotspring/1629.html(同協会公式)
 * 3. みやぎ蔵王こけし館: 全国の伝統こけしおよそ5500点を展示。座標は
 *    OSM・Nominatimに見つからず、国土地理院の住所検索(「宮城県刈田郡
 *    蔵王町遠刈田温泉新地」)による地区レベルの点を使用(実際の建物とは
 *    多少ずれる可能性がある近似値。目印として妥当な範囲)。
 * 4. 御釜(way 219619536): 蔵王連峰の火口湖、1182年の噴火でできた。
 * 5. 刈田嶺神社奥宮(刈田岳山頂、node 957115808): 里宮と対をなす奥宮、
 *    冬期は蔵王エコーライン通行止めのため参拝不可(このしおりの対象季節
 *    が春夏秋のみなのと一致)。
 *    出典: https://www.zao-machi.com/temples_history/427.html(同協会公式)
 *
 * 座標はNominatim(OSM)・国土地理院で確認(みやぎ蔵王こけし館のみ地区
 * レベルの近似)。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-304-5f3f7bd0.ts
 * (実行済み。刈田嶺神社の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "5f3f7bd0-2efd-405d-840c-53913d342c3e";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "刈田嶺神社(里宮)")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const togatta = spots.find((s) => s.name === "遠刈田温泉")!;
  const sankaidaki = spots.find((s) => s.name === "三階滝")!;

  const newSankaidakiMemo =
    "こけし館からは車で15分ほどです。三階滝は、蔵王連峰の東斜面、澄川の支流にかかる滝です。その名の通り、水が三段になって流れ落ちる姿は壮大で、「日本の滝百選」にも選ばれています。深く削れた滝壺は迫力満点で、蔵王山中に古くから伝わる話には、この滝の淵に大きなカニが棲んでいたという言い伝えも残っています。対岸の蔵王エコーライン沿いには滝見台が設けられており、三段に落ちる滝の全景を見晴らすことができますが、積雪期は閉鎖されるので、訪れる際は時期に注意しましょう。";

  await updateSpotInItinerary(ITIN_ID, { spotId: sankaidaki.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 12, 42)),
    stayDurationMin: 50,
    transitMode: "car",
    transitDurationMin: 15,
    memo: newSankaidakiMemo,
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        {
          create: {
            name: "刈田嶺神社(里宮)",
            address: "宮城県刈田郡蔵王町遠刈田温泉仲町1",
            lat: 38.1246085,
            lng: 140.5765942,
            visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)),
            stayDurationMin: 20,
            memo:
              "遠刈田温泉のシンボルです。刈田嶺神社は、蔵王連峰・刈田岳山頂の奥宮と、この地の里宮が対をなす神社で、天之水分神・国之水分神を祀っています。明治5年(1872)に水分神社と改め、同8年(1875)に刈田嶺神社と改称しました。御神体は、夏は山頂の奥宮に、冬は里宮にと、季節によって遷座します。蔵王山への信仰とともに、遠刈田温泉の発展を支えてきた神社です。境内に伝わる絵馬は、蔵王町の指定文化財になっています。静かに、敬意をもってお参りください。",
          },
        },
        {
          create: {
            name: "神の湯",
            address: "宮城県刈田郡蔵王町遠刈田温泉本町",
            lat: 38.124205,
            lng: 140.577237,
            visitTime: new Date(Date.UTC(1970, 0, 1, 9, 22)),
            stayDurationMin: 40,
            transitMode: "walk",
            transitDurationMin: 2,
            memo:
              "刈田嶺神社からは徒歩2分ほどです。神の湯は、遠刈田温泉に2軒ある共同浴場の一つです。青森ヒバをふんだんに使った浴室に包まれながら、開湯からおよそ400年の歴史を持つ温泉にゆっくりとつかりましょう。屋外には足湯も設けられています。",
          },
        },
        {
          create: {
            name: "壽の湯",
            address: "宮城県刈田郡蔵王町遠刈田温泉本町",
            lat: 38.123244,
            lng: 140.578612,
            visitTime: new Date(Date.UTC(1970, 0, 1, 10, 5)),
            stayDurationMin: 40,
            transitMode: "walk",
            transitDurationMin: 3,
            memo:
              "神の湯からは徒歩3分ほどです。壽の湯は、江戸時代の湯小屋を再現した、宮大工による建築が趣を伝える共同浴場です。地元の人に親しまれてきた、こぢんまりとした湯船が特徴で、熱めのお湯が身体を芯から温めてくれます。共同浴場めぐりならではの、昔ながらの湯治文化を味わいましょう。浴場を出たら、遠刈田温泉本町周辺の食事処で昼食をとりましょう。",
          },
        },
        {
          create: {
            name: "みやぎ蔵王こけし館",
            address: "宮城県刈田郡蔵王町遠刈田温泉新地",
            lat: 38.117413,
            lng: 140.57048,
            visitTime: new Date(Date.UTC(1970, 0, 1, 10, 57)),
            stayDurationMin: 90,
            transitMode: "car",
            transitDurationMin: 12,
            memo:
              "壽の湯からは車で12分ほどです。遠刈田は、鳴子・土湯と並ぶ日本三大こけし産地の一つといわれ、素朴な表情の「遠刈田こけし」は、江戸時代から湯治客への土産として発展してきました。みやぎ蔵王こけし館は、遠刈田伝統こけしをはじめ、全国の伝統こけしや木地玩具およそ5500点を展示する資料館です。現役のこけし工人によるろくろ挽きの実演を見学できるほか、白木地に絵を描く絵付け体験もできます。自分だけのこけしを作ってみましょう。",
          },
        },
        { id: sankaidaki.id, data: {} },
        {
          create: {
            name: "御釜",
            address: "宮城県刈田郡蔵王町遠刈田温泉",
            lat: 38.1364301,
            lng: 140.4495359,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 57)),
            stayDurationMin: 100,
            transitMode: "car",
            transitDurationMin: 25,
            memo:
              "三階滝からは車で25分ほどです。御釜は、蔵王連峰の中央部にある火口湖で、「五色沼」とも呼ばれています。1182年の噴火でできた火口に、雪解け水や雨水がたまってできたもので、水質は強酸性のため生物はすんでいません。太陽の光の角度によって、エメラルドグリーンからコバルトブルーへと、刻々と色を変える神秘的な湖面は、蔵王のシンボルとして親しまれています。蔵王エコーライン・蔵王ハイライン沿いの展望スペースから眺められます。",
          },
        },
        {
          create: {
            name: "刈田嶺神社(奥宮)",
            address: "宮城県刈田郡蔵王町刈田岳山頂",
            lat: 38.127749,
            lng: 140.4481979,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 47)),
            stayDurationMin: 45,
            transitMode: "walk",
            transitDurationMin: 10,
            memo:
              "御釜からは徒歩10分ほどです。刈田嶺神社奥宮は、刈田岳の山頂に鎮座する神社で、かつては蔵王信仰の中心として「蔵王大権現社」と呼ばれ、江戸時代には多くの参詣者を集めました。明治の神仏分離を経て、遠刈田温泉の里宮と対をなす奥宮となりました。冬季は蔵王エコーラインが通行止めになるため、御神体は里宮へ遷され、参拝できるのは春から秋にかけての期間に限られます。山頂からは、御釜や仙台方面まで見渡す大パノラマが広がります。静かに、敬意をもってお参りください。見学を終えたら、車で遠刈田温泉方面へ戻りましょう。",
          },
        },
      ],
      { tx, remove: [togatta.id] }
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

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "こけしの産地としても知られる遠刈田温泉。神の湯・壽の湯の共同浴場めぐりと刈田嶺神社の参拝、こけし館での絵付け体験、三階滝、蔵王のシンボル御釜と山頂の奥宮まで、宮城蔵王の湯治文化と自然を丸一日楽しむプランです。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
