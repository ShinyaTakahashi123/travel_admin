/**
 * #314の続き(企画運営7点・法務2点、2026-09-30 19:58〜19:59 JST)。
 * しおり「佐賀城本丸歴史館と佐嘉神社、定番の佐賀市内さんぽ日帰りプラン」
 * (72a8b08e-fc24-49ca-94da-b0faaabb2562)
 *
 * 企画運営の指摘:
 * 1. 大隈重信記念館・旧宅の滞在90分→55分に短縮。空いた時間には旧古賀家
 *    (佐賀市歴史民俗館、明治17年(1884)建築、市重要文化財)を追加。
 *    出典: https://www.city.saga.lg.jp/main/852.html (佐賀市公式)
 *    入館は16:30までとのことで、大隈重信記念館の到着を15:55にした
 *    (16:30より前、終了16:50で17:00の閉館にも余裕あり)。
 * 2. 与賀神社の昼食(30分)を、お参りと昼食を実際にとれる55分に見直し。
 *    本文の順番も「お参り→昼食」に。あわせて佐賀県立博物館の滞在も
 *    65分→60分に短縮し、時間の帳尻を合わせた。
 * 3. 佐賀城本丸歴史館の「ご案内するのは」「じっくりとご覧ください」
 *    「輝かしい歴史」を、ふつうの書き方に直した。
 * 4. 「木造復元建築としては日本最大規模を誇り」→「〜とされ」、佐嘉神社
 *    「全国に先駆けて反射炉を築いて」→「〜とされ」にヘッジ(法務の指摘
 *    (1)と同内容)。
 * 5. 帰りの一言を「歩いて帰りましょう」から、実際の手段(徒歩32分、また
 *    はバス)に直した。
 *    出典: https://www.okuma-museum.jp/access/ (大隈重信記念館公式。
 *    佐賀駅バスセンターからバス、佐賀駅南口から徒歩32分)
 * 6. 佐賀県立博物館の高輪築堤の出典を確認。saga-museum.jp/museum/(一覧
 *    ページ)には無かったが、常設展の個別ページに記載があった。
 *    出典: https://saga-museum.jp/museum/exhibition/permanent/takanawa-chikutei.html
 *    (佐賀県立博物館・美術館公式。令和4年(2022)、大隈重信ゆかりの佐賀に
 *    移設・再現展示)。本文の記載自体は事実として維持。
 * 7. descriptionに、足したスポット(与賀神社・佐賀バルーンミュージアム・
 *    大隈重信記念館など)を反映して書き直した。
 *
 * 法務の指摘:
 * 1. 佐賀城本丸歴史館の「日本最大規模を誇り」→「〜とされ」(上記4と同じ
 *    対応)。
 * 2. 佐賀バルーンミュージアム「国内初の常設型の熱気球博物館です」→
 *    「国内初とされる常設型の熱気球博物館です」にヘッジ。
 *
 * 時刻の並び(すべて徒歩): 09:30歴史館(60)→鯱の門(20)→10:55博物館(60)→
 * 12:03与賀神社(55)→13:08佐嘉神社(40)→13:50松原神社(20)→14:13バルーン
 * (50)→15:11旧古賀家(35)→15:55大隈重信記念館(55)→16:50終了。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-314c-72a8b08e.ts
 * (実行済み。旧古賀家の有無で確認するため、再実行しても安全)
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

  if (day1.spots.some((s) => s.name === "旧古賀家")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const rekishikan = day1.spots.find((s) => s.name === "佐賀城本丸歴史館")!;
  const hakubutsukan = day1.spots.find((s) => s.name === "佐賀県立博物館")!;
  const yokajinja = day1.spots.find((s) => s.name === "与賀神社")!;
  const sagajinja = day1.spots.find((s) => s.name === "佐嘉神社")!;
  const matsubara = day1.spots.find((s) => s.name === "松原神社")!;
  const balloon = day1.spots.find((s) => s.name === "佐賀バルーンミュージアム")!;
  const okuma = day1.spots.find((s) => s.name === "大隈重信記念館・旧宅")!;

  // 佐賀城本丸歴史館: 口調・ヘッジ
  const rekishikanMemo = (rekishikan.memo ?? "")
    .replace("ご案内するのは佐賀城本丸歴史館です。", "佐賀城本丸歴史館は、")
    .replace("木造復元建築としては日本最大規模を誇り、", "木造復元建築としては日本最大規模とされ、")
    .replace("幕末維新期の佐賀の輝かしい歴史を、じっくりとご覧ください。", "幕末維新期の佐賀の歴史を、たどってみましょう。");
  await updateSpotInItinerary(ITIN_ID, { spotId: rekishikan.id }, { memo: rekishikanMemo });

  // 佐賀県立博物館: 滞在65→60分
  await updateSpotInItinerary(ITIN_ID, { spotId: hakubutsukan.id }, { stayDurationMin: 60 });

  // 与賀神社: お参り→昼食の順に、滞在55分、時刻更新
  const yokajinjaMemo = (yokajinja.memo ?? "").replace(
    "このあたりで、昼食をとりましょう。静かに、敬意をもってお参りください。",
    "静かに、敬意をもってお参りください。参拝のあとは、このあたりで昼食をとりましょう。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: yokajinja.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 12, 3)),
    stayDurationMin: 55,
    memo: yokajinjaMemo,
  });

  // 佐嘉神社: 時刻更新・ヘッジ
  const sagajinjaMemo = (sagajinja.memo ?? "").replace(
    "全国に先駆けて反射炉を築いて大砲を鋳造し、",
    "全国に先駆けて反射炉を築いて大砲を鋳造したとされ、"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: sagajinja.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 13, 8)),
    memo: sagajinjaMemo,
  });

  // 松原神社: 時刻更新
  await updateSpotInItinerary(ITIN_ID, { spotId: matsubara.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 13, 50)),
  });

  // バルーンミュージアム: 時刻更新・ヘッジ・次スポットへの案内
  const balloonMemo =
    (balloon.memo ?? "").replace(
      "平成28年(2016)に開館した、国内初の常設型の熱気球博物館です。",
      "平成28年(2016)に開館した、国内初とされる常設型の熱気球博物館です。"
    ) + "続いては、歩いておよそ8分の旧古賀家へ向かいましょう。";
  await updateSpotInItinerary(ITIN_ID, { spotId: balloon.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 14, 13)),
    stayDurationMin: 50,
    memo: balloonMemo,
  });

  // 大隈重信記念館: 滞在短縮・時刻更新・帰りの一言を実際の手段に
  const okumaMemo = (okuma.memo ?? "")
    .replace("佐賀バルーンミュージアムからは歩いておよそ12分です。", "旧古賀家からは歩いておよそ9分です。")
    .replace(
      "見学を終えたら、歩いて帰りましょう。",
      "見学を終えたら、佐賀駅までは徒歩およそ32分です。大隈重信記念館入口バス停からのバスも利用できます。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: okuma.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 15, 55)),
    stayDurationMin: 55,
    transitMode: "walk",
    transitDurationMin: 9,
    memo: okumaMemo,
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        ...day1.spots.filter((s) => s.name !== "大隈重信記念館・旧宅").map((s) => ({ id: s.id, data: {} })),
        {
          create: {
            name: "旧古賀家",
            address: "佐賀市柳町3-15",
            lat: 33.2543049,
            lng: 130.3070156,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 11)),
            stayDurationMin: 35,
            transitMode: "walk",
            transitDurationMin: 8,
            memo:
              "佐賀バルーンミュージアムからは歩いておよそ8分です。旧古賀家は、古賀銀行を創設した2代目・古賀善兵衛の邸宅として、明治17年(1884)に建てられた建物です。町家ではなく武家屋敷に近い配置を採るのが特徴で、明治期の銀行家の暮らしぶりを伝えています。銀行の解散後は料亭としても使われ、平成7年(1995)、佐賀市の重要文化財に指定されました。趣のある佇まいを眺めながら、明治の佐賀に思いをはせてみましょう。",
          },
        },
        { id: okuma.id, data: {} },
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
        "幕末の佐賀藩の姿を伝える佐賀城本丸歴史館と、鍋島直正公を祀る佐嘉神社。与賀神社や佐賀バルーンミュージアム、大隈重信記念館など、佐賀市内の歴史スポットを巡る定番プランです。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
