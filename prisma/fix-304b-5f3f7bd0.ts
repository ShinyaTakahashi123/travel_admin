/**
 * チェックリスト #304 の修正記録(企画運営7点・法務3点)。
 * しおり「遠刈田温泉の共同浴場めぐり、宮城蔵王の湯治文化を楽しむ日帰り
 * プラン」(5f3f7bd0-2efd-405d-840c-53913d342c3e)
 *
 * 企画運営の指摘:
 * 1. みやぎ蔵王こけし館の座標が地区レベルの近似値だったため、番地まで
 *    含む住所で国土地理院の住所検索を取り直した。
 *    出典(住所): https://www.town.zao.miyagi.jp/kurashi_guide/koukyoushisetsu/kokeshikan/kokeshi.html
 *    (蔵王町公式。「蔵王町遠刈田温泉字新地西裏山36-135」)
 *    GSI住所検索の結果(38.121506,140.573547、「新地西裏山36番地」)を採用。
 *    壽の湯からの実際の距離が0.5km弱と判明したため、移動手段をcarから
 *    walk/8に修正。
 * 2. 昼食の時間帯(壽の湯10:45発では早すぎ)を、こけし館の滞在(10:53〜
 *    12:23)の終わりに合わせ、11:30〜13:30の範囲内にした。
 * 3. 御釜の滞在100分は決まりAに触れるため35分に短縮。空いた時間は、
 *    蔵王エコーライン沿いの実在の展望地「駒草平」(標高1383m、コマクサの
 *    群生地)を追加して埋めた。
 *    出典: https://miyagizao-navi.jp/detail/detail_1244/ 等の複数の観光
 *    サイトで確認(標高・コマクサの開花期・冬季通行止め)。
 * 4. 御釜に火山の安全の一文を追加。「1182年の噴火でできた」は出典に
 *    幅があったため(1182年〜1200年ごろ)、「1200年ごろ(鎌倉時代の初め)」
 *    とヘッジ。
 *    出典: https://zaogeopark.jp/top/zaovolcanoarea/(蔵王ジオパーク
 *    推進協議会。「御釜の最初の噴火は、西暦1200年頃」)
 * 5. 神の湯・壽の湯に入浴の配慮の一文を追加(法務指摘と同じ)。
 * 6. 最初のスポット(刈田嶺神社里宮)に、移動手段の案内を追加。
 * 7. 三階滝の「迫力満点で」→「迫力があり」に修正。
 *
 * 法務の指摘:
 * 1. 神の湯・壽の湯の配慮の一文(企画運営と同内容、水分補給も含めて追加)
 * 2. 壽の湯の「熱めのお湯が身体を芯から温めてくれます」→
 *    「熱めのお湯が特徴です」(効き目に近い表現を避ける)
 * 3. 御釜の火山の安全の一文(企画運営と同内容)
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-304b-5f3f7bd0.ts
 * (実行済み。駒草平の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "5f3f7bd0-2efd-405d-840c-53913d342c3e";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "駒草平")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const satomiya = spots.find((s) => s.name === "刈田嶺神社(里宮)")!;
  const kaminoyu = spots.find((s) => s.name === "神の湯")!;
  const kotobukinoyu = spots.find((s) => s.name === "壽の湯")!;
  const kokeshikan = spots.find((s) => s.name === "みやぎ蔵王こけし館")!;
  const sankaidaki = spots.find((s) => s.name === "三階滝")!;
  const okama = spots.find((s) => s.name === "御釜")!;
  const okumiya = spots.find((s) => s.name === "刈田嶺神社(奥宮)")!;

  const courtesy = " 浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。";

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        {
          id: satomiya.id,
          data: {
            memo:
              "この旅は、遠刈田温泉街とこけし館までは徒歩で、三階滝から先は車でめぐります。遠刈田温泉のシンボルです。刈田嶺神社は、蔵王連峰・刈田岳山頂の奥宮と、この地の里宮が対をなす神社で、天之水分神・国之水分神を祀っています。明治5年(1872)に水分神社と改め、同8年(1875)に刈田嶺神社と改称しました。御神体は、夏は山頂の奥宮に、冬は里宮にと、季節によって遷座します。蔵王山への信仰とともに、遠刈田温泉の発展を支えてきた神社です。境内に伝わる絵馬は、蔵王町の指定文化財になっています。静かに、敬意をもってお参りください。",
          },
        },
        {
          id: kaminoyu.id,
          data: {
            memo:
              "刈田嶺神社からは徒歩2分ほどです。神の湯は、遠刈田温泉に2軒ある共同浴場の一つです。青森ヒバをふんだんに使った浴室に包まれながら、開湯からおよそ400年の歴史を持つ温泉にゆっくりとつかりましょう。屋外には足湯も設けられています。" +
              courtesy,
          },
        },
        {
          id: kotobukinoyu.id,
          data: {
            memo:
              "神の湯からは徒歩3分ほどです。壽の湯は、江戸時代の湯小屋を再現した、宮大工による建築が趣を伝える共同浴場です。地元の人に親しまれてきた、こぢんまりとした湯船で、熱めのお湯が特徴です。共同浴場めぐりならではの、昔ながらの湯治文化を味わいましょう。" +
              courtesy,
          },
        },
        {
          id: kokeshikan.id,
          data: {
            lat: 38.121506,
            lng: 140.573547,
            visitTime: new Date(Date.UTC(1970, 0, 1, 10, 53)),
            transitMode: "walk",
            transitDurationMin: 8,
            memo:
              "壽の湯からは徒歩8分ほどです。遠刈田は、鳴子・土湯と並ぶ日本三大こけし産地の一つといわれ、素朴な表情の「遠刈田こけし」は、江戸時代から湯治客への土産として発展してきました。みやぎ蔵王こけし館は、遠刈田伝統こけしをはじめ、全国の伝統こけしや木地玩具およそ5500点を展示する資料館です。現役のこけし工人によるろくろ挽きの実演を見学できるほか、白木地に絵を描く絵付け体験もできます。自分だけのこけしを作ってみましょう。周辺には食事処もあるので、絵付け体験のあとに昼食をとりましょう。",
          },
        },
        {
          id: sankaidaki.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 38)),
            stayDurationMin: 60,
            transitMode: "car",
            transitDurationMin: 15,
            memo:
              "こけし館からは車で15分ほどです。三階滝は、蔵王連峰の東斜面、澄川の支流にかかる滝です。その名の通り、水が三段になって流れ落ちる姿は壮大で、「日本の滝百選」にも選ばれています。深く削れた滝壺は迫力があり、蔵王山中に古くから伝わる話には、この滝の淵に大きなカニが棲んでいたという言い伝えも残っています。対岸の蔵王エコーライン沿いには滝見台が設けられており、三段に落ちる滝の全景を見晴らすことができますが、積雪期は閉鎖されるので、訪れる際は時期に注意しましょう。",
          },
        },
        {
          create: {
            name: "駒草平",
            address: "宮城県刈田郡蔵王町遠刈田温泉(蔵王エコーライン沿い)",
            lat: 38.1346238,
            lng: 140.4679767,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 53)),
            stayDurationMin: 40,
            transitMode: "car",
            transitDurationMin: 15,
            memo:
              "三階滝からは車で15分ほどです。駒草平は、標高およそ1,383mに位置する、蔵王エコーライン沿いの展望スポットです。断崖の上に設けられた展望台からは、不帰の滝や振子滝、奥羽山脈の山並みの向こうに太平洋までも見渡せます。「高山植物の女王」と呼ばれるコマクサの群生地としても知られ、例年6月中旬から7月ごろに花を咲かせます。蔵王エコーラインは11月から4月ごろまで冬季通行止めとなるので、訪れる時期に注意しましょう。",
          },
        },
        {
          id: okama.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 38)),
            stayDurationMin: 35,
            transitMode: "car",
            transitDurationMin: 5,
            memo:
              "駒草平からは車で5分ほどです。御釜は、蔵王連峰の中央部にある火口湖で、「五色沼」とも呼ばれています。1200年ごろ(鎌倉時代の初め)の噴火によってできたとされる火口に、雪解け水や雨水がたまってできたもので、水質は強酸性のため生物はすんでいません。太陽の光の角度によって、エメラルドグリーンからコバルトブルーへと、刻々と色を変える神秘的な湖面は、蔵王のシンボルとして親しまれています。蔵王山は今も活動を続ける火山です。火山ガスが出る場所や立ち入りが規制される場所もあるので、気象庁や現地の最新の案内で確かめましょう。",
          },
        },
        {
          id: okumiya.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 23)),
            stayDurationMin: 70,
          },
        },
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
