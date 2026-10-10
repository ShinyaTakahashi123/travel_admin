/**
 * チェックリスト #314 の修正記録(ふだんの見直し)。
 * しおり「佐賀城本丸歴史館と佐嘉神社、定番の佐賀市内さんぽ日帰りプラン」
 * (72a8b08e-fc24-49ca-94da-b0faaabb2562)
 *
 * 本番で2か所09:30〜11:40のみで、決まり(4か所以上・終了16:30〜17:00)に
 * 届いていないことが判明。すべて佐賀市中心部・徒歩圏内の実在のスポットを
 * 追加した。
 *
 * 出典: https://online.bunka.go.jp/heritages/detail/191343 (佐賀城鯱の門
 * 及び続櫓、文化遺産オンライン。天保9年(1838)建立・国指定重要文化財)
 * 出典: https://saga-museum.jp/museum/ (佐賀県立博物館・美術館 公式。
 * 高輪築堤の移設展示など)
 * 出典: https://www.city.saga.lg.jp/main/4779.html (与賀神社、佐賀市公式。
 * 欽明天皇25年(564)勅願造立と伝わる古社、楼門・鳥居・石橋は国指定重要
 * 文化財)
 * 出典: https://sagajinjya.sagafan.jp/e36947.html (松原神社、佐嘉神社
 * 公式ブログ。安永元年(1772)創建、佐嘉神社と同じ敷地)
 * 出典: https://www.sagabai.com/balloon-museum/main/10.html (佐賀バルーン
 * ミュージアム公式。国内初の常設型、熱気球「イカロス5号」実物展示)
 * 出典: https://www.city.saga.lg.jp/kanko/kanko-spot/5/3995.html (大隈重信
 * 記念館・旧宅、佐賀市公式。昭和42年(1967)開館、今井兼次設計)
 *
 * 座標はすべてNominatim(OSM)の名称一致ノードを使用。すべて佐賀市中心部の
 * 徒歩圏内(最長でもおよそ1.3km)のため、移動手段はすべて徒歩とした。
 *
 * 佐賀城本丸歴史館・佐嘉神社の書き出しを、他のしおりと合わせて通常の
 * 文体に直した。歴史館の「入館は無料ですので」は、決まり9(料金・時刻の
 * 記載なし)にあたるため削除。佐嘉神社末尾の締めの一言(旧・最後のスポット
 * だった名残)は次のスポットへの案内に差し替え。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-314-72a8b08e.ts
 * (実行済み。鯱の門の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "72a8b08e-fc24-49ca-94da-b0faaabb2562";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];

  if (day1.spots.some((s) => s.name === "佐賀城鯱の門")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const rekishikan = day1.spots.find((s) => s.name === "佐賀城本丸歴史館")!;
  const sagajinja = day1.spots.find((s) => s.name === "佐嘉神社")!;

  const rekishikanMemo = (rekishikan.memo ?? "")
    .replace("皆様、本日ご案内するのは佐賀城本丸歴史館です。", "この旅は、佐賀市中心部を歩いてめぐります。ご案内するのは佐賀城本丸歴史館です。")
    .replace("入館は無料ですので、幕末維新期の佐賀の輝かしい歴史を、じっくりとご覧ください。", "幕末維新期の佐賀の輝かしい歴史を、じっくりとご覧ください。");
  await updateSpotInItinerary(ITIN_ID, { spotId: rekishikan.id }, { memo: rekishikanMemo });

  const sagajinjaMemo = (sagajinja.memo ?? "")
    .replace("続いてご案内するのは佐嘉神社です。", "佐賀県立博物館からは歩いておよそ10分です。佐嘉神社は、")
    .replace(
      "佐賀城本丸歴史館と佐嘉神社、定番の佐賀市内さんぽ日帰りプランをお楽しみいただけたことでしょう。",
      "続いては、歩いておよそ2分の松原神社へ向かいましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: sagajinja.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 12, 48)),
    transitMode: "walk",
    transitDurationMin: 10,
    memo: sagajinjaMemo,
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: rekishikan.id, data: {} },
        {
          create: {
            name: "佐賀城鯱の門",
            address: "佐賀市城内二丁目",
            lat: 33.24597,
            lng: 130.302854,
            visitTime: new Date(Date.UTC(1970, 0, 1, 10, 32)),
            stayDurationMin: 20,
            transitMode: "walk",
            transitDurationMin: 2,
            memo:
              "佐賀城本丸歴史館からは歩いてすぐです。佐賀城鯱の門は、天保9年(1838)に建立された佐賀城本丸の表門です。二重二階の櫓門で、屋根の両端に置かれた青銅製の鯱が名前の由来となっています。白壁の門扉には、明治7年(1874)の佐賀の乱の際についたとされる弾痕が今も残っており、国の重要文化財に指定されています。幕末から明治にかけての佐賀の歴史を物語る、貴重な現存建造物です。",
          },
        },
        {
          create: {
            name: "佐賀県立博物館",
            address: "佐賀市城内一丁目15-23",
            lat: 33.24498,
            lng: 130.300534,
            visitTime: new Date(Date.UTC(1970, 0, 1, 10, 55)),
            stayDurationMin: 65,
            transitMode: "walk",
            transitDurationMin: 3,
            memo:
              "佐賀城鯱の門からは歩いておよそ3分です。佐賀県立博物館は、自然史・考古・歴史・美術・工芸・民俗と幅広い分野にわたる資料を、常設展「佐賀県の歴史と文化」として紹介する博物館です。有田焼や鍋島藩窯で焼かれた鍋島焼、吉野ケ里遺跡の出土品などが並ぶほか、屋外展示場には、東京の高輪ゲートウェイ駅周辺の再開発で出土した鉄道遺構「高輪築堤」の一部が移設・再現されています。佐賀の自然と歴史を、じっくりとたどってみましょう。",
          },
        },
        {
          create: {
            name: "与賀神社",
            address: "佐賀市与賀町2-50",
            lat: 33.248868,
            lng: 130.294851,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 8)),
            stayDurationMin: 30,
            transitMode: "walk",
            transitDurationMin: 8,
            memo:
              "佐賀県立博物館からは歩いておよそ8分です。与賀神社は、欽明天皇25年(564)の勅願造立と伝わる古社で、佐賀城の鎮守として崇敬を集めてきました。室町時代に建てられた朱塗りの楼門、慶長8年(1603)造の三の鳥居、両者を結ぶ慶長11年(1606)建造の石橋は、いずれも国の重要文化財です。境内には樹齢およそ1400年と推定される大楠が立ち、県の天然記念物に指定されています。このあたりで、昼食をとりましょう。静かに、敬意をもってお参りください。",
          },
        },
        { id: sagajinja.id, data: {} },
        {
          create: {
            name: "松原神社",
            address: "佐賀市松原二丁目10-43",
            lat: 33.251944,
            lng: 130.3025,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 30)),
            stayDurationMin: 20,
            transitMode: "walk",
            transitDurationMin: 2,
            memo:
              "佐嘉神社とは同じ敷地の隣にあり、歩いてすぐです。松原神社は、安永元年(1772)、佐賀藩8代藩主・鍋島治茂が、藩祖・鍋島直茂を祀る社として建てたのが始まりで、当初は直茂の戒名にちなみ「日峯社」と呼ばれました。文化14年(1817)、直茂の祖父・清久とその室・彦鶴を合祀し、松原神社と改称されています。龍造寺隆信公など、あわせて7柱の神をお祀りする神社です。静かに、敬意をもってお参りください。",
          },
        },
        {
          create: {
            name: "佐賀バルーンミュージアム",
            address: "佐賀市松原一丁目1-1",
            lat: 33.252469,
            lng: 130.300391,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 53)),
            stayDurationMin: 55,
            transitMode: "walk",
            transitDurationMin: 3,
            memo:
              "松原神社からは歩いておよそ3分です。佐賀バルーンミュージアムは、平成28年(2016)に開館した、国内初の常設型の熱気球博物館です。館内では、日本で初めて有人飛行に成功した熱気球「イカロス5号」の実機や、大画面のシアター映像を通じて、熱気球の歴史や仕組みを紹介しています。本物のバスケットとバーナーを使ったバルーンフライトシミュレーターでは、操縦の疑似体験もできます。空を飛ぶ夢に挑んできた人々の歩みを、体感してみましょう。",
          },
        },
        {
          create: {
            name: "大隈重信記念館・旧宅",
            address: "佐賀市水ヶ江二丁目11-11",
            lat: 33.247982,
            lng: 130.308806,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 0)),
            stayDurationMin: 90,
            transitMode: "walk",
            transitDurationMin: 12,
            memo:
              "佐賀バルーンミュージアムからは歩いておよそ12分です。大隈重信記念館は、佐賀が生んだ政治家・大隈重信の生誕125年を記念し、昭和42年(1967)に開館した記念館です。建築家・今井兼次の設計で、県木のクスノキの根幹や大隈の体を曲面で表現した、記念碑的な建物です。隣接する大隈重信旧宅は、天保9年(1838)、大隈重信が生まれ育った家で、佐賀地方に多い「コの字形」の造りを今に伝えています。佐賀が生んだ近代日本の立役者の歩みを、たどってみましょう。見学を終えたら、歩いて帰りましょう。",
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
