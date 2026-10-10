/**
 * チェックリスト #313 の修正記録(ふだんの見直し)。
 * しおり「有田焼の窯元めぐりと陶山神社、磁器の里・有田を巡る定番プラン」
 * (720bdfcb-fba0-4b55-b949-ae25f4ff3bbb)
 *
 * 本番で2か所09:30〜12:00のみで、決まり(4か所以上・終了16:30〜17:00)に
 * 届いていないことが判明。泉山磁石場・有田町歴史民俗資料館東館・トンバイ
 * 塀のある裏通り・有田陶磁美術館・佐賀県立九州陶磁文化館を追加した。
 *
 * 出典: https://www.arita.jp/spot/post_16.html (泉山磁石場、有田観光協会
 * 公式。李参平が17世紀初頭に陶石を発見・国指定史跡)
 * 出典: https://www.town.arita.lg.jp/kiji003586/index.html (有田町歴史民俗
 * 資料館東館、有田町公式。昭和53年開館・泉山磁石場に隣接)
 * 出典: https://www.arita.jp/spot/post_20.html (トンバイ塀のある裏通り、
 * 有田観光協会公式。登り窯の耐火レンガの廃材を赤土で固めた塀)
 * 出典: https://www.town.arita.lg.jp/kiji0031926/index.html (有田陶磁美術館、
 * 有田町公式。明治7年建築の焼物倉庫を改築・昭和29年開館)
 * 出典: https://www.arita.jp/spot/post_2.html (佐賀県立九州陶磁文化館、
 * 有田観光協会公式。蒲原コレクション・柴田コレクション)
 *
 * 座標はすべてNominatim(OSM)の名称一致ノードを使用。
 *
 * 有田内山伝統的建造物群・陶山神社の書き出しを、他のしおりと合わせて
 * 通常の文体に直し、車でめぐる旨を明記(決まり8)。陶山神社末尾の締めの
 * 一言(旧・最後のスポットだった名残)は次のスポットへの案内に差し替え。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-313-720bdfcb.ts
 * (実行済み。泉山磁石場の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "720bdfcb-fba0-4b55-b949-ae25f4ff3bbb";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];

  if (day1.spots.some((s) => s.name === "泉山磁石場")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const uchiyama = day1.spots.find((s) => s.name === "有田内山伝統的建造物群")!;
  const touzan = day1.spots.find((s) => s.name === "陶山神社")!;

  const uchiyamaMemo = (uchiyama.memo ?? "").replace(
    "皆様、本日ご案内するのは有田内山伝統的建造物群です。",
    "この旅は、車でめぐります。ご案内するのは、有田内山伝統的建造物群です。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: uchiyama.id }, { memo: uchiyamaMemo });

  const touzanMemo = (touzan.memo ?? "")
    .replace("続いてご案内するのは陶山神社です。", "有田内山伝統的建造物群からは車でおよそ15分です。陶山神社は、")
    .replace(
      "有田焼の窯元めぐりと陶山神社、磁器の里・有田を巡る定番プランをお楽しみいただけたことでしょう。",
      "続いては、車でおよそ5分の泉山磁石場へ向かいましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: touzan.id }, { memo: touzanMemo });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: uchiyama.id, data: {} },
        { id: touzan.id, data: {} },
        {
          create: {
            name: "泉山磁石場",
            address: "西松浦郡有田町泉山1-5",
            lat: 33.1939448,
            lng: 129.9101704,
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 50)),
            stayDurationMin: 30,
            transitMode: "car",
            transitDurationMin: 5,
            memo:
              "陶山神社からは車でおよそ5分です。泉山磁石場は、17世紀初頭、李参平がここで磁器の原料となる良質な陶石を発見し、日本で初めて磁器の大量生産に成功したとされる、有田焼400年の歴史の原点です。南北およそ400m・東西およそ250mにおよぶ採掘の跡には、つるはしの跡が今も残っており、人の手で掘り進められていたことがうかがえます。採掘坑の内部には入れませんが、外から往時の規模を眺めてみましょう。このあたりで、昼食をとりましょう。",
          },
        },
        {
          create: {
            name: "有田町歴史民俗資料館東館",
            address: "西松浦郡有田町泉山1-4-1",
            lat: 33.195076,
            lng: 129.91104,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 22)),
            stayDurationMin: 40,
            transitMode: "car",
            transitDurationMin: 2,
            memo:
              "泉山磁石場からは車でおよそ2分です。有田町歴史民俗資料館東館は、昭和53年(1978)、泉山磁石場に隣接して開館した資料館です。江戸時代に皿山会所が発行した「窯焼名代札」や「職人札」など、窯業400年を支えてきた有田の歴史・民俗にまつわる資料が展示されており、登り窯の10分の1模型も見どころです。館外には唐臼の実物大模型もあり、有田焼を支えてきた道具の姿を実際に目にすることができます。",
          },
        },
        {
          create: {
            name: "トンバイ塀のある裏通り",
            address: "西松浦郡有田町上幸平一丁目",
            lat: 33.1912682,
            lng: 129.8999466,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 7)),
            stayDurationMin: 25,
            transitMode: "car",
            transitDurationMin: 5,
            memo:
              "有田町歴史民俗資料館東館からは車でおよそ5分です。トンバイ塀のある裏通りは、登り窯を築くために使った耐火レンガ(トンバイ)の廃材や、使い捨ての窯道具、陶片を赤土で塗り固めて作った塀が続く、有田ならではの裏通りです。かつては窯元を囲むように築かれ、陶工の技術の流出を防ぐ意味もあったと考えられています。文政11年(1828)の大火のあと再建された町並みの中、やきものの町らしい風情を歩いて感じてみましょう。",
          },
        },
        {
          create: {
            name: "有田陶磁美術館",
            address: "西松浦郡有田町赤絵町1-4-2",
            lat: 33.1904701,
            lng: 129.8987623,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 34)),
            stayDurationMin: 40,
            transitMode: "walk",
            transitDurationMin: 2,
            memo:
              "トンバイ塀のある裏通りからは歩いてすぐです。有田陶磁美術館は、明治7年(1874)に建てられた焼物倉庫を改築し、昭和29年(1954)に開館した美術館です。建物自体も有田内山重要伝統的建造物群の一つに数えられています。佐賀県重要文化財の「陶彫赤絵の狛犬」をはじめ、江戸時代の海外貿易とともに発展した有田焼から、明治・昭和初期にかけてのやきものまでを紹介しています。",
          },
        },
        {
          create: {
            name: "佐賀県立九州陶磁文化館",
            address: "西松浦郡有田町戸杓乙3100-1",
            lat: 33.179011,
            lng: 129.880574,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 30)),
            stayDurationMin: 120,
            transitMode: "car",
            transitDurationMin: 16,
            memo:
              "有田陶磁美術館からは車でおよそ16分です。佐賀県立九州陶磁文化館は、肥前地区をはじめとした九州各地のやきものを収集・展示する、やきもの専門の美術館です。有田町所蔵の古伊万里を集めた蒲原コレクション、江戸時代の有田焼を集めた柴田コレクションなど、見応えのある収蔵品が揃っています。屋外にはマイセン磁器製の鐘が設置されており、時を告げる音色を耳にすることもできます。1日の締めくくりに、有田焼の歴史をじっくりとたどってみましょう。見学を終えたら、車で帰りましょう。",
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
