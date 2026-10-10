/**
 * #276 日御碕神社と日御碕灯台、出雲の岬と絶景を巡る1泊2日
 * 企画運営の指摘(10/1 13:24)で発覚。島根ワイナリーは1社のお店(ワイナリー)の
 * 紹介になるため行き先にしない決まり(#105 富士山ワイナリーと同じ扱い)。
 * 実在の公共の行き先に差し替える。
 *
 * 差し替え先: 出雲文化伝承館(島根県出雲市浜町520、公益財団法人出雲市芸術文化
 * 振興財団が運営する公共の文化施設)。平成3年(1991)開館、出雲地方の大地主
 * だった江角家の母屋・長屋門・庭園を移築した「出雲屋敷」、千利休が長柄橋の
 * 橋杭を用いて建てたと伝わる茶室「独楽庵」(松江藩七代藩主・松平治郷が大切に
 * 受け継いだとされる)、出雲流の枯山水庭園、現代数寄屋建築の茶室「松籟亭」、
 * 企画展示室があり、郷土ゆかりの作家等の展覧会も開催。
 * 出典(すべて公式、公益財団法人出雲市芸術文化振興財団):
 * https://www.izumo-zaidan.jp/izumodenshokan/izudensho_facility/32
 * https://www.izumo-zaidan.jp/izumodenshokan/izudensho_facility/34
 *
 * 座標はOverpass(OSM)の実POI(tourism=museum, KSJ2公共施設データ)一致。
 * 35.381974,132.714584。
 *
 * 移動時間: 直線距離から再計算(日御碕灯台→旧ワイナリー8.59km/20分・旧ワイナリー
 * →稲佐の浜3.42km/8分の実績から、この経路の実効時速およそ25.7km/hを算出し、
 * 新しい2区間の距離(日御碕灯台→出雲文化伝承館9.66km、出雲文化伝承館→稲佐の浜
 * 4.02km)に当てはめた)。日御碕灯台→伝承館: car/20→car/23。伝承館→稲佐の浜:
 * car/8→car/9。滞在75分はそのまま(見どころの数は同程度と判断)。
 * 1日目の終了は16:38→16:42(窓16:30〜17:00内)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-276-33100ce1.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "33100ce1-b739-4342-826f-4de81880d252";

const DENSHOKAN_MEMO =
  "日御碕灯台を見学したら、車でおよそ23分の出雲文化伝承館へ向かいましょう。出雲文化伝承館は、出雲地方の大地主だった江角家の母屋・長屋門・庭園を移築した「出雲屋敷」を中心とする文化施設です。茶室「独楽庵」は、千利休が名橋・長柄の橋杭を用いて建てたと伝わる名席で、松江藩七代藩主・松平治郷(不昧公)によって大切に受け継がれてきたとされています。出雲流の枯山水庭園や、現代の数寄屋建築による茶室「松籟亭」もあり、企画展示室では美術工芸品や郷土ゆかりの作家の作品の展覧会も開かれています。平成3年(1991)の開館以来、出雲の歴史的な住まいと庭園の趣を伝える施設です。見学を終えたら、車でおよそ9分の稲佐の浜へ向かいましょう。";

async function main() {
  const todai = await prisma.spot.findFirstOrThrow({ where: { name: "日御碕灯台", day: { itineraryId: ITIN_ID } } });
  const winery = await prisma.spot.findFirst({ where: { name: "島根ワイナリー", day: { itineraryId: ITIN_ID } } });
  const inasa = await prisma.spot.findFirstOrThrow({ where: { name: "稲佐の浜", day: { itineraryId: ITIN_ID } } });

  const todaiOld = "見学を終えたら、車で島根ワイナリーへ向かいましょう。";
  const todaiNext = "見学を終えたら、車でおよそ23分の出雲文化伝承館へ向かいましょう。";
  if (todai.memo?.includes(todaiOld)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: todai.id }, { memo: todai.memo.replace(todaiOld, todaiNext) });
    console.log("日御碕灯台: closer fixed → 出雲文化伝承館(車23分)");
  } else if (todai.memo?.includes(todaiNext)) {
    console.log("日御碕灯台: already fixed, skipping");
  } else {
    throw new Error("日御碕灯台: anchor not found");
  }

  if (winery) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: winery.id },
      {
        name: "出雲文化伝承館",
        address: "島根県出雲市浜町520",
        lat: 35.381974,
        lng: 132.714584,
        memo: DENSHOKAN_MEMO,
        transitDurationMin: 23,
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 18)),
      }
    );
    console.log("島根ワイナリー → 出雲文化伝承館 に差し替え");
  } else {
    console.log("島根ワイナリーのスポットが見つからない(既に差し替え済みの可能性)、スキップ");
  }

  const inasaOld = "島根ワイナリーを見学したら、車で稲佐の浜へ向かいましょう。";
  const inasaNext = "出雲文化伝承館を見学したら、車でおよそ9分の稲佐の浜へ向かいましょう。";
  if (inasa.memo?.includes(inasaOld)) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: inasa.id },
      { memo: inasa.memo.replace(inasaOld, inasaNext), transitDurationMin: 9, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 42)) }
    );
    console.log("稲佐の浜: opener fixed → 出雲文化伝承館(車9分)、時刻を15:42に調整");
  } else if (inasa.memo?.includes(inasaNext)) {
    console.log("稲佐の浜: already fixed, skipping");
  } else {
    throw new Error("稲佐の浜: anchor not found");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
