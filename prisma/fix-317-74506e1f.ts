/**
 * チェックリスト #317 の修正記録(ふだんの見直し)。
 * しおり「熊野三山をすべて巡る、世界遺産・熊野古道じっくり1泊2日」
 * (74506e1f-41b4-444a-9d8d-557e13353862)
 *
 * 本番でDay1が2か所09:30〜11:10、Day2が2か所09:00〜11:50のみで、決まり
 * (1日4か所以上・終了16:30〜17:00)に届いていないことが判明。タイトルが
 * 「熊野古道じっくり」と明記しているため、熊野古道の実在の王子跡・古道
 * 区間を中心に追加した。
 *
 * Day1: 発心門王子・伏拝王子(熊野古道 中辺路の王子跡、本宮大社までの
 * 徒歩コース)・湯の峰温泉つぼ湯(世界遺産に登録された、熊野詣の湯垢離場)
 * を追加。
 * 出典: https://www.hongu.jp/kumanokodo/walk/hosshin/hosshin2/ (熊野本宮
 * 観光協会公式。発心門王子〜本宮大社のコース、伏拝王子の由来)
 * 出典: https://www.hongu.jp/onsen/yunomine/tuboyu/ (熊野本宮観光協会
 * 公式。つぼ湯、2004年世界遺産登録、日本最古の共同浴場とされる)
 *
 * Day2: 神倉神社(ゴトビキ岩、熊野速玉大社の元宮)・大門坂(熊野古道、
 * 那智大社への参詣道)・青岸渡寺(那智大社に隣接、西国三十三所第一番
 * 札所)・飛瀧神社(那智の滝そのものを御神体とする、本殿を持たない神社)
 * を追加。
 * 出典: https://kumanohayatama.jp/?page_id=18 (熊野速玉大社公式。摂社
 * 神倉神社、源頼朝寄進と伝わる538段の石段)
 * 出典: https://kumanonachitaisha.or.jp/pavilion/waterfall/ (熊野那智
 * 大社公式。飛瀧神社、那智の滝、落差133m)
 *
 * 座標はすべてNominatim(OSM)の名称一致ノード。
 *
 * 熊野本宮大社・大斎原・熊野速玉大社・熊野那智大社の書き出しを、他の
 * しおりと合わせて通常の文体に直した。熊野那智大社末尾の締めの一言
 * (旧・最後のスポットだった名残)は飛瀧神社への案内・帰りの一言に
 * 差し替え。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-317-74506e1f.ts
 * (実行済み。発心門王子の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "74506e1f-41b4-444a-9d8d-557e13353862";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];
  const day2 = itin.days[1];

  if (day1.spots.some((s) => s.name === "発心門王子")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const hongu = day1.spots.find((s) => s.name === "熊野本宮大社")!;
  const oyunohara = day1.spots.find((s) => s.name === "大斎原")!;
  const hayatama = day2.spots.find((s) => s.name === "熊野速玉大社")!;
  const nachi = day2.spots.find((s) => s.name === "熊野那智大社")!;

  // 熊野本宮大社: 書き出し・次スポット案内
  const honguMemo = (hongu.memo ?? "")
    .replace(
      "皆様、本日ご案内するのは熊野本宮大社です。",
      "伏拝王子からは、熊野古道を歩いておよそ80分です。熊野本宮大社は、"
    )
    .replace(
      "今日から2日間かけて、この熊野本宮大社を皮切りに、熊野三山のすべてを巡っていきます。境内では静かにお参りをお楽しみください。参拝のあとは、かつて社殿があった旧社地、大斎原へとご案内いたします。",
      "今日から2日間かけて、熊野三山のすべてを巡っていきます。境内では静かに、敬意をもってお参りください。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: hongu.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 12, 20)),
    stayDurationMin: 80,
    transitMode: "walk",
    transitDurationMin: 80,
    memo: honguMemo,
  });

  // 大斎原: 書き出し・滞在延長・つぼ湯への案内
  const oyunoharaMemo = (oyunohara.memo ?? "")
    .replace("続いてご案内するのは大斎原です。", "熊野本宮大社からは歩いておよそ15分です。大斎原は、")
    .replace(
      "今も熊野本宮大社の聖域の一部として大切にされている場所ですので、静かに見学をお楽しみください。大きな鳥居をくぐりながら、かつてこの地にあった壮大な社殿の姿に思いを馳せてみてください。今夜はこの近くの宿にご宿泊いただきます。",
      "今も熊野本宮大社の聖域の一部として大切にされている場所ですので、静かに見学をお楽しみください。大きな鳥居をくぐりながら、かつてこの地にあった壮大な社殿の姿に思いを馳せてみましょう。続いては、歩いておよそ20分の湯の峰温泉・つぼ湯へ向かいましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: oyunohara.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 13, 55)),
    stayDurationMin: 45,
    transitDurationMin: 15,
    memo: oyunoharaMemo,
  });

  // 熊野速玉大社: 書き出し・時刻・滞在延長
  const hayatamaMemo = (hayatama.memo ?? "")
    .replace("旅の2日目にご案内するのは熊野速玉大社です。", "神倉神社からは車でおよそ15分です。熊野速玉大社は、")
    .replace(
      "昨日参拝した熊野本宮大社とはまた違う、水辺の聖地ならではの空気を感じながら、静かにお参りをお楽しみください。参拝のあとは、熊野三山めぐりの最後を飾る熊野那智大社へとご案内いたします。",
      "昨日参拝した熊野本宮大社とはまた違う、水辺の聖地ならではの空気を感じながら、静かに、敬意をもってお参りください。続いては、車でおよそ35分の大門坂へ向かいましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: hayatama.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 10, 30)),
    stayDurationMin: 70,
    transitMode: "car",
    transitDurationMin: 15,
    memo: hayatamaMemo,
  });

  // 熊野那智大社: 書き出し・時刻・滞在延長・末尾の差し替え
  const nachiMemo = (nachi.memo ?? "")
    .replace("続いてご案内するのは熊野那智大社です。", "大門坂からは歩いておよそ35分です。熊野那智大社は、")
    .replace(
      "本宮、速玉と巡ってきた熊野三山めぐりの締めくくりに、那智の滝の轟音を背にこの聖地で静かにお参りをお楽しみください。熊野三山をすべて巡る、世界遺産・熊野古道じっくり1泊2日をお楽しみいただけたことでしょう。",
      "本宮、速玉と巡ってきた熊野三山めぐりの締めくくりに、この聖地で静かに、敬意をもってお参りください。続いては、歩いておよそ3分の青岸渡寺へ向かいましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: nachi.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 13, 10)),
    stayDurationMin: 90,
    transitMode: "walk",
    transitDurationMin: 35,
    memo: nachiMemo,
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        {
          create: {
            name: "発心門王子",
            address: "田辺市本宮町",
            lat: 33.8617469,
            lng: 135.7206005,
            visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)),
            stayDurationMin: 15,
            transitMode: null,
            transitDurationMin: null,
            memo:
              "この旅は、熊野古道を歩く区間も含めてめぐります。ご案内するのは発心門王子です。熊野古道 中辺路にある九十九王子の中でも、格式の高い五体王子の一つに数えられる場所で、「発心門」とは仏の道に帰依する心を発する入り口という意味です。ここから先が熊野本宮大社の神域とされてきました。ここから熊野本宮大社まで、およそ7kmの熊野古道を歩いていきます。大きな上り下りの少ない、歩きやすい道です。",
          },
        },
        {
          create: {
            name: "伏拝王子",
            address: "田辺市本宮町伏拝",
            lat: 33.8602049,
            lng: 135.7568176,
            visitTime: new Date(Date.UTC(1970, 0, 1, 10, 45)),
            stayDurationMin: 15,
            transitMode: "walk",
            transitDurationMin: 90,
            memo:
              "発心門王子からは、熊野古道を歩いておよそ90分です。伏拝王子は、中辺路を歩いてきた参詣者が、初めて熊野本宮大社(旧社地の大斎原)を見ることができた場所です。あまりの尊さに、その場で伏して拝んだことが名前の由来と伝えられています。ここからしばし休み、この先に待つ熊野本宮大社への思いを新たにしてみましょう。",
          },
        },
        { id: hongu.id, data: {} },
        { id: oyunohara.id, data: {} },
        {
          create: {
            name: "湯の峰温泉 つぼ湯",
            address: "田辺市本宮町湯峯",
            lat: 33.8291897,
            lng: 135.7577217,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 0)),
            stayDurationMin: 90,
            transitMode: "walk",
            transitDurationMin: 20,
            memo:
              "大斎原からは歩いておよそ20分です。湯の峰温泉は、開湯およそ1800年と伝わる、日本最古とされる温泉です。その中心にある岩風呂「つぼ湯」は、いにしえの熊野詣の人々が、参拝の前後に身を清めた湯垢離場で、平成16年(2004)、熊野三山・熊野古道とともにユネスコの世界遺産に登録されました。実際に入浴できる世界遺産としては、世界でここだけとされています。日によって湯の色が変わるともいわれる、天然の岩風呂で旅の疲れを癒やしましょう。",
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day2.id,
      [
        {
          create: {
            name: "神倉神社",
            address: "新宮市神倉1丁目",
            lat: 33.7242509,
            lng: 135.9841101,
            visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)),
            stayDurationMin: 75,
            transitMode: null,
            transitDurationMin: null,
            memo:
              "この旅は、車と徒歩を使い分けてめぐります。ご案内するのは神倉神社です。熊野速玉大社の摂社にあたり、熊野権現が最初に降り立ったと伝わる聖地です。社殿の背後にそびえる巨岩「ゴトビキ岩」がご神体で、ゴトビキとは新宮の方言でヒキガエルを指すといわれています。山上へは、源頼朝が寄進したと伝わる、急勾配の石段538段を登ります。歩きやすい靴で、足元に十分気をつけながら、静かに、敬意をもって参拝しましょう。",
          },
        },
        { id: hayatama.id, data: {} },
        {
          create: {
            name: "大門坂",
            address: "東牟婁郡那智勝浦町那智山",
            lat: 33.6707046,
            lng: 135.9012075,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 15)),
            stayDurationMin: 20,
            transitMode: "car",
            transitDurationMin: 35,
            memo:
              "熊野速玉大社からは車でおよそ35分です。大門坂は、熊野那智大社へと続く熊野古道の中でも、古の面影を最も色濃く残す区間とされています。全長およそ500m・高低差およそ100mの石畳の道が、樹齢800年を超すとされる老杉並木の中に続き、夫婦杉と呼ばれる巨木も見どころです。このあたりで、昼食をとりましょう。ここから那智大社まで、苔むした石段を歩いて登っていきます。",
          },
        },
        { id: nachi.id, data: {} },
        {
          create: {
            name: "青岸渡寺",
            address: "東牟婁郡那智勝浦町那智山8",
            lat: 33.6693139,
            lng: 135.889923,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 13)),
            stayDurationMin: 30,
            transitMode: "walk",
            transitDurationMin: 3,
            memo:
              "熊野那智大社からは歩いておよそ3分です。青岸渡寺は、熊野那智大社に隣接する天台宗の寺院で、西国三十三所第一番札所として知られています。早くから神仏習合が進んだ那智山では、那智大社と一体となって修験者の霊場として栄えてきました。朱塗りの三重塔越しに那智の滝を望む景観は、この地ならではの眺めとして親しまれています。静かに、敬意をもってお参りください。",
          },
        },
        {
          create: {
            name: "飛瀧神社(那智の滝)",
            address: "東牟婁郡那智勝浦町那智山",
            lat: 33.6741888,
            lng: 135.8876666,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 25)),
            stayDurationMin: 65,
            transitMode: "walk",
            transitDurationMin: 12,
            memo:
              "青岸渡寺からは歩いておよそ12分です。飛瀧神社は、那智の滝そのものを御神体とする神社で、本殿を持たないことで知られています。落差およそ133mは、一段の滝として日本一とされ、およそ4世紀の頃から信仰の対象とされてきました。神武天皇の一行がこの滝を探し当てたという伝承も残っています。熊野三山めぐりの締めくくりに、轟音を響かせて流れ落ちる滝を、静かに、敬意をもって眺めてみましょう。見学を終えたら、車で帰路につきましょう。",
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: { in: [day1.id, day2.id] } } });
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
