/**
 * #101 野口英世記念館と磐梯山噴火記念館、猪苗代の偉人と自然史1泊2日。
 * 初日・最終日の見直し（docs/content/20261029-first-last-day-times.md）。法務・企画運営との
 * やりとり(2026-10-30)を経た最終版。
 *
 * Day1 はもとは09:00開始・7か所。決まり(10:45〜11:45開始・16:30〜17:00終了・3か所以上)に
 * 合わせて組み直す。Day2 はもとから決まりの範囲内だが、五色沼の点の直しで時刻がずれるため
 * 全スポットのvisitTimeを再計算する。
 *
 * Day1:
 * 1. 会津民俗館(説明文・タイトルに出てこない、もとの時刻10:10で11時より前)を削除。
 * 2. 猪苗代駅→記念館: バスの時刻表が確認できないため、タクシーに変更(OSRM 5.27分+5=約10分、
 *    もとの「バス約10分」と同じ分数)。予約の一文を追加。10:35着→10:45開始。
 * 3. 記念館→天鏡閣: もとの「徒歩35分(湖岸の道)」は誤り(実際は国道49号を避けて約9.7kmの
 *    迂回になる)。タクシーに変更(OSRM 3.66分+5=約9分)。
 * 4. 天鏡閣→長浜: 長浜の点をバス停「長浜」に直したため(下記)、routed-footで測り直し
 *    (546.2m＋前後のスナップ55.4m＝601.6m÷75=約8分、もとの「徒歩10分」から変更)。
 * 5. 長浜→亀ヶ城公園: もとの「バス30分」の時刻表が確認できないため、タクシーに変更
 *    (OSRM 8.33分+5=約13分)。
 * 6. 亀ヶ城公園・土津神社・はじまりの美術館の滞在はもとの長さ(35・45・40分)のまま。
 *    長浜の滞在のみ75→65分に短縮。
 *
 * Day2:
 * 1. 五色沼自然探勝路の点を、メモの書き出しに合う名前のある点(OSMのバス停「五色沼入口」
 *    node 506471647)に変更。記念館からの徒歩を測り直し(1643.4m＋スナップ87.2m＝1730.6m
 *    ÷75=約23分、もとの「15分」から変更)。後続スポットのvisitTimeもすべて再計算。
 * 2. 七日町通りは、OSMの名前のある道そのもの(way 44769537、通りのスポットは道の点が基本との
 *    法務の指摘)の値が、もとの値とほぼ同じ(6cm差)だったため変更なし。
 *
 * 座標(OSM優先。地理院はOSMに該当なしのときだけ):
 *  - 野口英世記念館: OSM way 255400461 → 37.5361443,140.0738806
 *  - 天鏡閣: OSM node 3008117481 → 37.5212863,140.0434820
 *  - 土津神社: OSM way 1422837188 → 37.5701004,140.1006132
 *  - 長浜(昼食): OSM named node「長浜」(バス停) 3010378678 → 37.5227006,140.0463796
 *  - はじまりの美術館: OSMに該当なし(raw OSM API bboxで確認)。地理院の点のまま変更なし
 *  - 亀ヶ城公園: OSM node 2981137627 → 37.5613975,140.1037930
 *  - 磐梯山噴火記念館: OSM way 245404237 → 37.6597561,140.0793817
 *  - 五色沼自然探勝路: OSM named node「五色沼入口」(バス停) 506471647 → 37.655142,140.093098
 *    (メモの書き出し「五色沼入口から」に合う名前のある点。遊歩道の線の中心や生のnodeではない)
 *  - 猪苗代駅前: OSM node 263083428 → 37.5463239,140.1032381
 *  - 七日町通り: 変更なし(もとの値がOSMの道の点とほぼ同じ)
 *  - 鶴ヶ城: OSM way 24270507 → 37.4877353,139.9297661
 *  - 御薬園: OSM way 235463581 → 37.4910814,139.9439165
 *
 * 法務の指摘(2026-10-30 16:40): 五色沼の徒歩が8分延びた分、2日目の終わりが16:58になり、
 * もとの終わり(16:50)より遅くなってしまうため、鶴ヶ城の滞在を75→67分に短縮して16:50に戻す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-101-e1871a37.ts
 *   反映: npm run prod -- npx tsx prisma/fix-101-e1871a37.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "028c8948-0d6b-4125-97d0-eaf8a30614a1";

const KINENKAN_ID = "2d266736-fb65-482b-acaf-1f310b3e8614";
const MINZOKUKAN_ID = "d50dbca4-6853-451f-819a-89731a3270df";
const TENKYOKAKU_ID = "c1f5d0a6-7e2c-4796-b8b2-32a8fd670d3c";
const NAGAHAMA_ID = "64aea759-8f2c-4a4f-9ad2-dc8fecaa9da8";
const KAMEGAJO_ID = "f09c8173-1414-4071-9653-ca0322923120";
const HATSUSHINJA_ID = "cee357a3-ccf4-4218-aaa4-176244c5eda5";
const BIJUTSUKAN_ID = "b34890fa-c2c6-49aa-af1e-e633a73ba1ea";

const FUNKAKINENKAN_ID = "9919aa76-f724-419d-b7bb-089b55073095";
const GOSHIKINUMA_ID = "6e609e93-de6b-4b9e-986a-17a679d3c593";
const INAWASHIROEKIMAE_ID = "34c31741-9f54-42f8-ac5c-2fda4b399eaf";
const NANOKAMACHI_ID = "8c2ecf6d-e0da-4f73-995e-cc2236320e15";
const TSURUGAJO_ID = "c9c23a9c-fe73-43a8-9fc2-3fac6957689f";
const OYAKUEN_ID = "ceea85b2-4254-41c1-9c9f-f6c1c8fae2f6";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const KINENKAN_MEMO_OLD =
  "朝の早い時間は記念館へのバスの便がないので、猪苗代駅からタクシーで約10分です。世界的な細菌学者・野口英世の生家を保存・公開する記念館です。幼名を清作といった英世は、1歳のときに囲炉裏に落ちて左手に大やけどを負い、指が開かなくなりましたが、16歳で受けた手術で指が動くようになったことに心を動かされ、医学の道を志したと伝えられています。生家には、やけどを負ったその囲炉裏が今も残ります。館内では、アメリカのロックフェラー医学研究所での研究や、黄熱病の研究のため向かった西アフリカのガーナで自らもその病に倒れるまでの歩みを、資料や自筆の手紙でたどれます。";
const KINENKAN_MEMO_NEW =
  "猪苗代駅に10時35分ごろ着いたら、タクシーで約10分です。タクシーは前もって予約しておくと安心です。世界的な細菌学者・野口英世の生家を保存・公開する記念館です。幼名を清作といった英世は、1歳のときに囲炉裏に落ちて左手に大やけどを負い、指が開かなくなりましたが、16歳で受けた手術で指が動くようになったことに心を動かされ、医学の道を志したと伝えられています。生家には、やけどを負ったその囲炉裏が今も残ります。館内では、アメリカのロックフェラー医学研究所での研究や、黄熱病の研究のため向かった西アフリカのガーナで自らもその病に倒れるまでの歩みを、資料や自筆の手紙でたどれます。見学を終えたら、タクシーでおよそ9分の天鏡閣へ向かいましょう。この区間は、タクシーを使うと便利です。";

const TENKYOKAKU_MEMO_OLD =
  "民俗館から、猪苗代湖の岸の道を西へ歩いて約35分。湖を見下ろす丘に立つ洋館です。明治41年（1908年）、有栖川宮威仁親王の別邸として建てられ、同じ年に滞在した皇太子嘉仁親王（のちの大正天皇）によって「天鏡閣」と名づけられました。八角形の塔屋や正面の車寄せをもつ優雅な建物で、国の重要文化財に指定されています。窓の外には猪苗代湖が広がります。";
const TENKYOKAKU_MEMO_NEW =
  "湖を見下ろす丘に立つ洋館です。明治41年（1908年）、有栖川宮威仁親王の別邸として建てられ、同じ年に滞在した皇太子嘉仁親王（のちの大正天皇）によって「天鏡閣」と名づけられました。八角形の塔屋や正面の車寄せをもつ優雅な建物で、国の重要文化財に指定されています。窓の外には猪苗代湖が広がります。";

const NAGAHAMA_MEMO_OLD =
  "天鏡閣から歩いて約10分、猪苗代湖の北西の湖岸に広がる長浜です。湖の向こうに磐梯山を望む眺めが楽しめ、湖畔には食事のできる店もあるので、ここで昼食にしましょう。晴れた日の湖面は空を映して青く輝きます。次のバスの時刻まで、湖畔でゆっくり過ごしましょう。湖に入るときや岸辺を歩くときは、足元と天気の変化に気をつけましょう。";
const NAGAHAMA_MEMO_NEW =
  "天鏡閣から歩いて約8分、猪苗代湖の北西の湖岸に広がる長浜です。湖の向こうに磐梯山を望む眺めが楽しめ、湖畔には食事のできる店もあるので、ここで昼食にしましょう。晴れた日の湖面は空を映して青く輝きます。湖に入るときや岸辺を歩くときは、足元と天気の変化に気をつけましょう。見学を終えたら、タクシーでおよそ13分の亀ヶ城公園へ向かいましょう。この区間は、タクシーを使うと便利です。";

const KAMEGAJO_MEMO_OLD =
  "長浜のバス停から北窪行きのバスに乗り、猪苗代駅を通って亀ヶ城入口で降ります。鎌倉時代のはじめ、建久2年（1191年）にこの地を治めた猪苗代経連が築いたと伝わる猪苗代城の跡を整えた公園です。猪苗代氏代々の居城でしたが、戊辰戦争で建物は焼け落ち、今は石垣や土塁がその面影を伝えています。城跡は福島県の史跡に指定され、春には桜の名所としてにぎわいます。";
const KAMEGAJO_MEMO_NEW =
  "鎌倉時代のはじめ、建久2年（1191年）にこの地を治めた猪苗代経連が築いたと伝わる猪苗代城の跡を整えた公園です。猪苗代氏代々の居城でしたが、戊辰戦争で建物は焼け落ち、今は石垣や土塁がその面影を伝えています。城跡は福島県の史跡に指定され、春には桜の名所としてにぎわいます。";

const GOSHIKINUMA_MEMO_OLD =
  "記念館から東へ歩いて約15分の五色沼入口から、西の裏磐梯高原駅まで、毘沙門沼・赤沼・みどろ沼・弁天沼・瑠璃沼・青沼・柳沼などをめぐる約3.6kmの散策路を、1時間10分ほどかけて歩きます。これらの沼は、1888年の噴火で川がせき止められてできたもの。噴火のときの地下水に含まれた成分が、沼の水の中で細かな粒になって光を散らすことで、青や緑に見えるといわれます。水辺の草木が赤茶色に染まって見えるのは、水に含まれる鉄分によるものです。入口の裏磐梯ビジターセンターでは、散策の前に沼の成り立ちを知ることができます。遊歩道から外れず、足元に気をつけて歩きましょう。探勝路の終わりは、柳沼のそばの裏磐梯高原駅です。";
const GOSHIKINUMA_MEMO_NEW =
  "記念館から東へ歩いて約23分の五色沼入口から、西の裏磐梯高原駅まで、毘沙門沼・赤沼・みどろ沼・弁天沼・瑠璃沼・青沼・柳沼などをめぐる約3.6kmの散策路を、1時間10分ほどかけて歩きます。これらの沼は、1888年の噴火で川がせき止められてできたもの。噴火のときの地下水に含まれた成分が、沼の水の中で細かな粒になって光を散らすことで、青や緑に見えるといわれます。水辺の草木が赤茶色に染まって見えるのは、水に含まれる鉄分によるものです。入口の裏磐梯ビジターセンターでは、散策の前に沼の成り立ちを知ることができます。遊歩道から外れず、足元に気をつけて歩きましょう。探勝路の終わりは、柳沼のそばの裏磐梯高原駅です。";

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = [KINENKAN_ID, TENKYOKAKU_ID, NAGAHAMA_ID, KAMEGAJO_ID, GOSHIKINUMA_ID];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const memoById = new Map(spots.map((s) => [s.id, s.memo ?? ""]));

  const checks: [string, string, string][] = [
    [KINENKAN_ID, "記念館", KINENKAN_MEMO_OLD],
    [TENKYOKAKU_ID, "天鏡閣", TENKYOKAKU_MEMO_OLD],
    [NAGAHAMA_ID, "長浜", NAGAHAMA_MEMO_OLD],
    [KAMEGAJO_ID, "亀ヶ城公園", KAMEGAJO_MEMO_OLD],
    [GOSHIKINUMA_ID, "五色沼自然探勝路", GOSHIKINUMA_MEMO_OLD],
  ];
  for (const [id, label, old] of checks) {
    if (memoById.get(id) !== old) {
      console.log(`[想定と違います] ${label} のメモが想定と一致しません。処理を中止します。`);
      return;
    }
  }

  console.log("=== #101 Day1 新しい時刻 ===");
  console.log("記念館 10:45 (65分、タクシー10分で入る)");
  console.log("天鏡閣 11:59 (60分、タクシー9分)");
  console.log("長浜   13:07 (65分、徒歩8分) ← 昼食");
  console.log("亀ヶ城公園 14:25 (35分、タクシー13分)");
  console.log("土津神社 15:15 (45分、徒歩15分)");
  console.log("はじまりの美術館 16:15 (40分、徒歩15分) → 終了16:55");
  console.log("\n=== #101 Day2 新しい時刻(五色沼の点直しで再計算) ===");
  console.log("磐梯山噴火記念館 09:00 (45分)");
  console.log("五色沼自然探勝路 10:08 (80分、徒歩23分)");
  console.log("猪苗代駅前 12:18 (35分、バス50分)");
  console.log("七日町通り 13:43 (55分、電車50分)");
  console.log("鶴ヶ城 14:53 (67分、バス15分)");
  console.log("御薬園 16:20 (30分、徒歩20分) → 終了16:50");
  console.log("\n=== メモ ===");
  console.log("[記念館]\n" + KINENKAN_MEMO_NEW + "\n");
  console.log("[天鏡閣]\n" + TENKYOKAKU_MEMO_NEW + "\n");
  console.log("[長浜]\n" + NAGAHAMA_MEMO_NEW + "\n");
  console.log("[亀ヶ城公園]\n" + KAMEGAJO_MEMO_NEW + "\n");
  console.log("[五色沼自然探勝路]\n" + GOSHIKINUMA_MEMO_NEW + "\n");
  console.log("=== 座標 ===");
  console.log("記念館 37.5361443,140.0738806 / 天鏡閣 37.5212863,140.0434820 / 土津神社 37.5701004,140.1006132");
  console.log("長浜 37.5227006,140.0463796 / 亀ヶ城公園 37.5613975,140.1037930");
  console.log("磐梯山噴火記念館 37.6597561,140.0793817 / 五色沼自然探勝路 37.655142,140.093098");
  console.log("猪苗代駅前 37.5463239,140.1032381 / 鶴ヶ城 37.4877353,139.9297661 / 御薬園 37.4910814,139.9439165");
  console.log("七日町通り: 変更なし");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      DAY1_ID,
      [
        {
          id: KINENKAN_ID,
          data: { visitTime: t(10, 45), stayDurationMin: 65, lat: 37.5361443, lng: 140.0738806, memo: KINENKAN_MEMO_NEW },
        },
        {
          id: TENKYOKAKU_ID,
          data: { visitTime: t(11, 59), stayDurationMin: 60, lat: 37.5212863, lng: 140.043482, memo: TENKYOKAKU_MEMO_NEW },
        },
        {
          id: NAGAHAMA_ID,
          data: { visitTime: t(13, 7), stayDurationMin: 65, lat: 37.5227006, lng: 140.0463796, memo: NAGAHAMA_MEMO_NEW },
        },
        {
          id: KAMEGAJO_ID,
          data: { visitTime: t(14, 25), stayDurationMin: 35, lat: 37.5613975, lng: 140.103793, memo: KAMEGAJO_MEMO_NEW },
        },
        { id: HATSUSHINJA_ID, data: { visitTime: t(15, 15), stayDurationMin: 45, lat: 37.5701004, lng: 140.1006132 } },
        { id: BIJUTSUKAN_ID, data: { visitTime: t(16, 15), stayDurationMin: 40 } },
      ],
      { remove: [MINZOKUKAN_ID], tx }
    );

    await tx.spotTransitLeg.updateMany({
      where: { spotId: TENKYOKAKU_ID },
      data: { transitMode: "taxi", transitDurationMin: 9, transitLine: null },
    });
    await tx.spotTransitLeg.updateMany({
      where: { spotId: NAGAHAMA_ID },
      data: { transitMode: "walk", transitDurationMin: 8, transitLine: null },
    });
    await tx.spotTransitLeg.updateMany({
      where: { spotId: KAMEGAJO_ID },
      data: { transitMode: "taxi", transitDurationMin: 13, transitLine: null },
    });

    // Day2: 五色沼の点直しで後続スポットのvisitTimeを再計算。並び・滞在・移動分はそのまま
    await tx.spot.update({
      where: { id: FUNKAKINENKAN_ID },
      data: { lat: 37.6597561, lng: 140.0793817 },
    });
    await tx.spot.update({
      where: { id: GOSHIKINUMA_ID },
      data: { visitTime: t(10, 8), lat: 37.655142, lng: 140.093098, memo: GOSHIKINUMA_MEMO_NEW },
    });
    await tx.spotTransitLeg.updateMany({
      where: { spotId: GOSHIKINUMA_ID },
      data: { transitDurationMin: 23 },
    });
    await tx.spot.update({ where: { id: INAWASHIROEKIMAE_ID }, data: { visitTime: t(12, 18), lat: 37.5463239, lng: 140.1032381 } });
    await tx.spot.update({ where: { id: NANOKAMACHI_ID }, data: { visitTime: t(13, 43) } });
    await tx.spot.update({
      where: { id: TSURUGAJO_ID },
      data: { visitTime: t(14, 53), stayDurationMin: 67, lat: 37.4877353, lng: 139.9297661 },
    });
    await tx.spot.update({ where: { id: OYAKUEN_ID }, data: { visitTime: t(16, 20), lat: 37.4910814, lng: 139.9439165 } });
  }, { timeout: 60000 });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
