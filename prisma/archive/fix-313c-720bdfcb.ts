/**
 * #313の続き(企画運営4点・法務4点、2026-09-30 19:32 JST)。
 * しおり「有田焼の窯元めぐりと陶山神社、磁器の里・有田を巡る定番プラン」
 * (720bdfcb-fba0-4b55-b949-ae25f4ff3bbb)
 *
 * 企画運営の指摘:
 * 1. 昼食の時間が無かった。泉山磁石場のあたり(11:50〜12:20、11:30〜13:30
 *    の窓内)に昼食の一言を追加(既存の一言をそのまま活かす)。
 * 2. 九州陶磁文化館の滞在を120分→70分に短縮。空いた時間には、有田
 *    ポーセリンパーク(ろくろ・絵付け体験ができる施設)と、大公孫樹
 *    (泉山の大イチョウ、国指定天然記念物)を追加。
 *    出典: https://www.town.arita.lg.jp/dynamic/info/pub/detail.aspx?c_id=26&id=64
 *    (有田の大イチョウ、有田町公式。大正15年(1926)国指定天然記念物)
 *    有田ポーセリンパークは公式サイトで通常営業中と確認(一部展示館のみ
 *    休業中のため、本文には体験工房についてのみ記載)。
 * 3. タイトルの「窯元めぐり」に合わせ、内山の本文に「通り沿いには今も
 *    窯元が軒を連ねており」を追加。ポーセリンパークの本文でも、ろくろ・
 *    絵付け体験を通じて窯元の技に触れる旨を記載(店名は出さない)。
 * 4. 内山地区の徒歩圏(内山・陶山神社・泉山磁石場・大公孫樹・資料館東館・
 *    トンバイ塀・陶磁美術館)の移動手段をcarからwalkに変更。有田陶磁
 *    美術館の本文末尾で、車に戻ってから先は車でめぐる旨を明記。
 *    ※有田内山伝統的建造物群のみ、既存の座標(33.21064,129.84903)が
 *    実際の住所(上幸平)と大きく離れていたため(GSI住所検索で確認した
 *    上幸平の座標は33.191868,129.901443)、誤りとみて座標も訂正した。
 *    このため他のスポットとの徒歩移動が現実的な距離になった。
 *
 * 法務の指摘:
 * 1. 陶山神社に「境内を線路が横切っています。線路に入らず、列車に気を
 *    つけましょう。」を追加。
 * 2. description・内山本文の「発祥の地」を「発祥の地とされる」にヘッジ。
 * 3. 内山・トンバイ塀に「今も人が暮らす町並みです。家の敷地に入ったり、
 *    住民の方を撮ったりしないようにしましょう。」を追加。
 * 4. 表紙の写真は別スクリプト(fix-313d)で対応。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-313c-720bdfcb.ts
 * (実行済み。大公孫樹の有無で確認するため、再実行しても安全)
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

  if (day1.spots.some((s) => s.name === "大公孫樹")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const uchiyama = day1.spots.find((s) => s.name === "有田内山伝統的建造物群")!;
  const touzan = day1.spots.find((s) => s.name === "陶山神社")!;
  const izumiyama = day1.spots.find((s) => s.name === "泉山磁石場")!;
  const shiryokan = day1.spots.find((s) => s.name === "有田町歴史民俗資料館東館")!;
  const tonbai = day1.spots.find((s) => s.name === "トンバイ塀のある裏通り")!;
  const bijutsukan = day1.spots.find((s) => s.name === "有田陶磁美術館")!;
  const kyushu = day1.spots.find((s) => s.name === "佐賀県立九州陶磁文化館")!;

  // 有田内山: 座標訂正・書き出し・「発祥の地とされる」・窯元・住民配慮
  const uchiyamaMemo = (uchiyama.memo ?? "")
    .replace(
      "皆様、本日ご案内するのは有田内山伝統的建造物群です。",
      "この旅は、内山地区は車を置いて歩き、そのあとは車でめぐります。ご案内するのは有田内山伝統的建造物群です。"
    )
    .replace(
      "日本磁器発祥の地ならではの、時代を超えて受け継がれてきたやきものの町並みを、ゆっくりと歩いてお楽しみください。",
      "通り沿いには今も窯元が軒を連ねており、日本磁器発祥の地とされる有田ならではの、時代を超えて受け継がれてきたやきものの町並みを、ゆっくりと歩いてお楽しみください。今も人が暮らす町並みです。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: uchiyama.id }, {
    lat: 33.191868,
    lng: 129.901443,
    memo: uchiyamaMemo,
  });

  // 陶山神社: 歩き・線路の安全一文・次スポットへの案内
  const touzanMemo = (touzan.memo ?? "")
    .replace("続いてご案内するのは陶山神社です。", "有田内山伝統的建造物群からは歩いておよそ5分です。陶山神社は、")
    .replace(
      "境内には線路が通っており、JRの列車が鳥居のすぐそばを通り抜けていく、全国でも珍しい光景を目にすることができます。",
      "境内には線路が通っており、JRの列車が鳥居のすぐそばを通り抜けていく、全国でも珍しい光景を目にすることができます。境内を線路が横切っています。線路に入らず、列車に気をつけましょう。"
    )
    .replace(
      "有田焼の窯元めぐりと陶山神社、磁器の里・有田を巡る定番プランをお楽しみいただけたことでしょう。",
      "続いては、歩いておよそ15分の泉山磁石場へ向かいましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: touzan.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 11, 5)),
    transitMode: "walk",
    transitDurationMin: 5,
    memo: touzanMemo,
  });

  // 泉山磁石場: 歩き(すでに昼食の一言あり)
  await updateSpotInItinerary(ITIN_ID, { spotId: izumiyama.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 11, 50)),
    transitMode: "walk",
    transitDurationMin: 15,
  });

  // 資料館東館: 大公孫樹からの案内に変更
  const shiryokanMemo = (shiryokan.memo ?? "").replace(
    "泉山磁石場からは車でおよそ2分です。",
    "大公孫樹からは歩いておよそ3分です。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: shiryokan.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 12, 42)),
    transitMode: "walk",
    transitDurationMin: 3,
    memo: shiryokanMemo,
  });

  // トンバイ塀: 歩き・住民配慮
  const tonbaiMemo = (tonbai.memo ?? "")
    .replace("有田町歴史民俗資料館東館からは車でおよそ5分です。", "有田町歴史民俗資料館東館からは歩いておよそ15分です。")
    .replace(
      "やきものの町らしい風情を歩いて感じてみましょう。",
      "やきものの町らしい風情を歩いて感じてみましょう。今も人が暮らす町並みです。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: tonbai.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 13, 37)),
    transitMode: "walk",
    transitDurationMin: 15,
    memo: tonbaiMemo,
  });

  // 有田陶磁美術館: 車に戻る旨・次(ポーセリンパーク)への案内
  const bijutsukanMemo = (bijutsukan.memo ?? "") +
    "ここからは、停めておいた車に戻り、車でめぐりましょう。続いては、車でおよそ10分の有田ポーセリンパークへ向かいましょう。";
  await updateSpotInItinerary(ITIN_ID, { spotId: bijutsukan.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 14, 4)),
    memo: bijutsukanMemo,
  });

  // 九州陶磁文化館: 滞在短縮・ポーセリンパークからの案内
  const kyushuMemo = (kyushu.memo ?? "").replace(
    "有田陶磁美術館からは車でおよそ16分です。",
    "有田ポーセリンパークからは車でおよそ9分です。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: kyushu.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 15, 48)),
    stayDurationMin: 70,
    transitMode: "car",
    transitDurationMin: 9,
    memo: kyushuMemo,
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: uchiyama.id, data: {} },
        { id: touzan.id, data: {} },
        { id: izumiyama.id, data: {} },
        {
          create: {
            name: "大公孫樹",
            address: "西松浦郡有田町泉山一丁目524-2",
            lat: 33.194229,
            lng: 129.908661,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 24)),
            stayDurationMin: 15,
            transitMode: "walk",
            transitDurationMin: 4,
            memo:
              "泉山磁石場からは歩いておよそ4分です。大公孫樹は、泉山弁財天の境内に立つ、樹齢およそ1000年とされるイチョウの巨木です。高さおよそ30.5m、根回りおよそ12mという大きさを誇り、大正15年(1926)、イチョウの木としては全国で最も早く国の天然記念物に指定されました。木の下にある口屋番所跡では、江戸時代、佐賀藩の役人が陶石ややきものの持ち出しを厳しく取り締まっていたと伝えられています。悠久の時を重ねてきた大樹を、見上げてみましょう。",
          },
        },
        { id: shiryokan.id, data: {} },
        { id: tonbai.id, data: {} },
        { id: bijutsukan.id, data: {} },
        {
          create: {
            name: "有田ポーセリンパーク",
            address: "西松浦郡有田町戸矢乙340-28",
            lat: 33.164637,
            lng: 129.908242,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 54)),
            stayDurationMin: 45,
            transitMode: "car",
            transitDurationMin: 10,
            memo:
              "有田陶磁美術館からは車でおよそ10分です。有田ポーセリンパークは、ヨーロッパの宮殿を思わせる建物が立ち並ぶ、有田焼をテーマにした施設です。園内の工房では、ろくろや絵付けの体験を通じて、やきものづくりの工程を間近に見ることができます。窯元の技を感じながら、有田焼の魅力に触れてみましょう。",
          },
        },
        { id: kyushu.id, data: {} },
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

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "日本磁器発祥の地とされる有田。窯元が並ぶ通りを歩き、鳥居まで有田焼でできた陶山神社に参拝する、有田観光の定番プランです。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
