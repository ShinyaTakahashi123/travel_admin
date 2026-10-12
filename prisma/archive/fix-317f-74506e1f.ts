/**
 * #317 熊野三山(74506e1f)の続き。企画運営2026-09-30 21:16 JSTの4点。
 *
 * 1. 1日目朝のつじつま: 「新宮駅で借りたレンタカー」と「本宮大社前から龍神バス」が
 *    つながっていなかった。発心門王子の書き出しに、新宮駅→本宮大社駐車場(車で約1時間、
 *    hongu.jp公式の「新宮市街地35km・約1時間」)を明示し、車をどこに置くか分かる形にした。
 *    大斎原の締めに「本宮大社の駐車場まで戻り」を足し、車へ戻る動線も明示。
 *    本宮大社前発心門王子行きのバスが朝(8:20発8:37着・9:30発9:45着など)に実在することは
 *    jorudan/ekitan/NAVITIME時刻表で確認済み(本文には時刻を書かない)。
 * 2. 2日目朝: 神倉神社の書き出しに、前夜の湯の峰温泉の宿から新宮までの車の時間(約25分、
 *    新宮駅⇔湯の峰温泉の路線バス時刻表(奈良交通)の所要26分を参考に概算)を追加。
 * 3. 東光寺の50分は小さな寺として長すぎた(決まりA)ため20分に短縮。空いた時間で、
 *    湯の峰温泉の実在の名所「湯筒」(90℃の湯が自噴し、卵や野菜を茹でて温泉たまごに
 *    できる場所。Overpassで実在確認: node 5104538927 amenity=public_bath
 *    natural=hot_spring name=湯筒)を新しいスポットとして追加。宿の一言もここに移した。
 * 4. 帰り: 新宮駅で借りて紀伊勝浦方面で返す一方通行(乗り捨て)は、レンタカー会社によって
 *    可否が分かれ確認が取れなかったため、新宮駅へ戻って返す往復に直した(車で約35分。
 *    速玉大社→大門坂で既に使っている35分と、直線距離がほぼ同じ(約11km台)ことを確認
 *    済みなので、同じ目安を採用)。お滝拝所(有料の近接拝観所)は閉まる時刻が早いため、
 *    本文には時刻を書かず「公式サイトで確かめましょう」の形で一言を追加。
 *
 * 出典:
 * - https://www.hongu.jp/access/to-hongu/car/ (新宮市街地35km・約1時間)
 * - https://www.jorudan.co.jp/bus/rosen/timetable/本宮大社前〔熊野御坊南海バス〕/51川丈線/本宮行政局前/
 *   (本宮大社前→発心門王子方面、龍神バスの朝の便の実在を確認)
 * - http://yunominesou.com/bussingu2.pdf (新宮駅⇔湯の峰温泉、路線バス26分)
 * - https://news.yahoo.co.jp/expert/articles/2dc2304cf1b247d89a57440460755a2b115809ba
 *   および https://wakayama-guidance.com/entry/2025/12/25/190000 (湯筒: 90℃自噴、
 *   卵・野菜を茹でて温泉たまごにできる。湯を持ち帰るのは禁止)
 * - 既存DB値(#317自身の熊野速玉大社→大門坂: 車で約35分)を飛瀧神社→新宮駅の目安に転用
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-317f-74506e1f.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "74506e1f-41b4-444a-9d8d-557e13353862";

async function main() {
  // --- 1. 発心門王子: 新宮駅→本宮大社駐車場の車の時間を明示 ---
  const hosshinmon = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "発心門王子" },
  });
  {
    const old =
      "この旅は、新宮駅で借りたレンタカーと、熊野古道を歩く区間を組み合わせてめぐります。本宮大社前からは、龍神バスで発心門王子まで、およそ15分です。発心門王子は、";
    const next =
      "この旅は、新宮駅で借りたレンタカーと、熊野古道を歩く区間を組み合わせてめぐります。新宮駅でレンタカーを借りたら、熊野本宮大社の駐車場まで車でおよそ1時間。車を置いて、本宮大社前から龍神バスで発心門王子まで、およそ15分です。発心門王子は、";
    if (hosshinmon.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: hosshinmon.id }, { memo: hosshinmon.memo.replace(old, next) });
    }
  }

  // --- 1続き. 大斎原: 車(本宮大社の駐車場)まで戻る動線を明示 ---
  const oojigahara = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "大斎原" },
  });
  {
    const old = "続いては、車でおよそ20分の湯の峰温泉・つぼ湯へ向かいましょう。";
    const next = "続いては、本宮大社の駐車場まで戻り、車でおよそ20分の湯の峰温泉・つぼ湯へ向かいましょう。";
    if (oojigahara.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: oojigahara.id }, { memo: oojigahara.memo.replace(old, next) });
    }
  }

  // --- 2. 神倉神社: 前夜の宿(湯の峰温泉)からの車の時間を追加 ---
  const kamikura = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "神倉神社" },
  });
  {
    const old = "この旅は、新宮駅で借りたレンタカーと徒歩を使い分けてめぐります。神倉神社は、";
    const next =
      "この旅は、新宮駅で借りたレンタカーと徒歩を使い分けてめぐります。昨夜の湯の峰温泉の宿から、車でおよそ25分。神倉神社は、";
    if (kamikura.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: kamikura.id }, { memo: kamikura.memo.replace(old, next) });
    }
  }

  // --- 4. 飛瀧神社: 一方通行の乗り捨てをやめ、新宮駅へ戻って返却する形に。お滝拝所の一言 ---
  const hiro = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "飛瀧神社(那智の滝)" },
  });
  {
    const old =
      "熊野三山めぐりの締めくくりに、轟音を響かせて流れ落ちる滝を、静かに、敬意をもって眺めてみましょう。滝のそばは濡れて滑りやすいので、足元に気をつけましょう。見学を終えたら、車で紀伊勝浦駅方面へ向かい、レンタカーを返却してから帰りましょう。";
    const next =
      "熊野三山めぐりの締めくくりに、轟音を響かせて流れ落ちる滝を、静かに、敬意をもって眺めてみましょう。滝のそばは濡れて滑りやすいので、足元に気をつけましょう。滝に近づいて拝観できる「お滝拝所」は、閉まる時刻が早めなので、利用したい場合は公式サイトで確かめましょう。見学を終えたら、車で新宮駅へ戻り(およそ35分)、レンタカーを返却してから帰りましょう。";
    if (hiro.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: hiro.id }, { memo: hiro.memo.replace(old, next) });
    }
  }

  // --- 3. 東光寺を20分に短縮し、湯筒を新しいスポットとして追加 ---
  const tokoji = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "東光寺" },
  });
  const tsuboyu = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "湯の峰温泉 つぼ湯" },
  });
  const hosshinmon2 = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "発心門王子" },
  });
  const fushiogami = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "伏拝王子" },
  });
  const hongu = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "熊野本宮大社" },
  });

  const day1Id = tokoji.dayId;
  const alreadyHasYutsutsu = await prisma.spot.findFirst({
    where: { dayId: day1Id, name: "湯筒" },
  });

  if (tokoji.stayDurationMin === 50 && !alreadyHasYutsutsu) {
    const tokojiOld = "静かに、敬意をもってお参りください。今夜は湯の峰温泉の宿に泊まります。";
    const tokojiNext = "静かに、敬意をもってお参りください。続いては、歩いてすぐの湯筒へ向かいましょう。";
    if (!tokoji.memo?.includes(tokojiOld)) {
      throw new Error("東光寺のmemoが想定と異なります。現在の内容を確認してください。");
    }
    const tokojiMemo = tokoji.memo.replace(tokojiOld, tokojiNext);

    await setDaySpotOrder(
      day1Id,
      [
        { id: hosshinmon2.id, data: {} },
        { id: fushiogami.id, data: {} },
        { id: hongu.id, data: {} },
        { id: oojigahara.id, data: {} },
        { id: tsuboyu.id, data: {} },
        { id: tokoji.id, data: { memo: tokojiMemo, stayDurationMin: 20 } },
        {
          create: {
            name: "湯筒",
            address: "田辺市本宮町湯峯",
            lat: 33.828852,
            lng: 135.757569,
            visitTime: new Date(Date.UTC(1970, 0, 1, 16, 5)),
            stayDurationMin: 25,
            transitMode: "walk",
            transitDurationMin: 2,
            memo:
              "東光寺からは歩いてすぐです。湯筒は、90℃ほどの高温の湯が自噴する、湯の峰温泉ならではの名所です。近くの売店で生卵や野菜を買い、赤いネットに入れて湯筒につければ、名物の温泉たまごができあがります。持ち帰り用に湯をくむことは禁じられていますので、その場で楽しみましょう。やけどに十分気をつけ、熱い湯には直接手を触れないようにしましょう。今夜は湯の峰温泉の宿に泊まります。",
          },
        },
      ],
      { remove: [] }
    );

    const yutsutsu = await prisma.spot.findFirstOrThrow({
      where: { dayId: day1Id, name: "湯筒" },
    });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: yutsutsu.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: yutsutsu.id, orderNo: 1, transitMode: "walk", transitDurationMin: 2 },
    });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
