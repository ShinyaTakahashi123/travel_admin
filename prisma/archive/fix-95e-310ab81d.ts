/**
 * #95 310ab81d 企画運営(2026-10-01 01:03)の指摘: fix-95cで、あかばね
 * 40→20分の空きを恋路ヶ浜50→70分に、田原市博物館95→100分に、それぞれ
 * 回しただけで、決まりA(水増し)に該当していた。恋路ヶ浜・博物館の滞在を
 * 元に戻し、代わりに実在の行き先で埋める。
 *
 * D1: 恋路ヶ浜を50分に戻す。日出の石門(隣接、既存の座標のまま)に、
 * 入口の日出園地にある「椰子の実」記念碑(柳田國男が伊良湖で拾った椰子の
 * 実の話をもとに、島崎藤村が詩を作った)の紹介を加え、35→55分に(石門と
 * あわせて同じ場所で過ごす内容のため、新規スポットの座標を作らずに対応)。
 * D2: 田原市博物館を95分に戻す。普門寺に、旧境内の遊歩道・元堂跡の紹介を
 * 加え、60→70分に。あわせて法務の指摘で「市内でもっとも多くの文化財を
 * 所蔵しています」→「…所蔵するとされます」に。
 *
 * 開いたURL:
 * - 椰子の実記念碑(由来・柳田國男・島崎藤村・日出園地の位置): 田原市公式
 *   https://www.city.tahara.aichi.jp/shisetsu/kankou/1002465.html /
 *   ニッポン旅マガジン https://tabi-mag.jp/ai0430/
 *   (記念碑自体のOSM点は見つからなかったため、既存の日出の石門のスポット
 *   内で紹介する形にした。日出園地は日出の石門の入口にあり、同じ場所で
 *   過ごす内容のため、新たな座標は作っていない)
 * - 普門寺の旧境内・元堂跡: WebSearch集約(浜松・浜名湖だいすきネット)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const HIIDENOSEKIMON_MEMO =
  "恋路ヶ浜から車でおよそ4分、日出の石門に着きます。太平洋の荒波の浸食によってできた、中央に洞穴のあいた岩で、沖の石門と岸の石門の2つがあります。日の出の時間帯に見られる美しいシルエットでも知られ、荒々しい岩と青い海が織りなす景色を楽しめます。岩場は滑りやすいので、足元に気をつけましょう。石門の入口にあたる日出園地には、民俗学者・柳田國男が伊良湖で拾った椰子の実の話をもとに、親友の島崎藤村が詩を作ったことにちなむ「椰子の実」の記念碑が立っています。この後は、車でおよそ5分、伊良湖岬灯台へ向かいましょう。";

const FUMONJI_MEMO =
  "岩屋緑地公園から車でおよそ14分、普門寺に着きます。開山から1300年という古刹で、国の重要文化財をはじめ、市内でもっとも多くの文化財を所蔵するとされます。境内には、樹齢450年ともいわれる市の天然記念物「大杉」や、樹齢250年の「夫婦檜」もあり、豊かな自然に包まれています。旧境内は遊歩道として整備されており、山道を登った先には、かつての本堂があった元堂跡も残っています。11月下旬から12月にかけては、県内でも遅くまで紅葉が楽しめる「もみじ寺」としても知られています。静かに、敬意をもってお参りください。渥美半島と太平洋を望む1泊2日の旅は、ここで終わりです。お帰りは、車でおよそ23分、豊橋駅へ戻り、レンタカーを返しましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '310ab81d%'`);
  const itinId = rows[0].id;

  const koiji = await findSpotInItinerary(itinId, { spotName: "恋路ヶ浜" });
  const hiide = await findSpotInItinerary(itinId, { spotName: "日出の石門" });
  const irago = await findSpotInItinerary(itinId, { spotName: "伊良湖岬灯台" });
  const tahara = await findSpotInItinerary(itinId, { spotName: "田原市博物館" });
  const iwaya = await findSpotInItinerary(itinId, { spotName: "岩屋緑地公園" });
  const fumonji = await findSpotInItinerary(itinId, { spotName: "普門寺" });

  console.log("現在: 恋路ヶ浜stay", koiji.stayDurationMin, "田原市博物館stay", tahara.stayDurationMin);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    // D1: 恋路ヶ浜50分に戻す→以降のvisitTimeを20分前へ、日出の石門は55分に
    // (20分延長)→伊良湖岬灯台のvisitTimeは変わらない
    await tx.spot.update({ where: { id: koiji.id }, data: { stayDurationMin: 50, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 49)) } });
    await tx.spot.update({
      where: { id: hiide.id },
      data: { memo: HIIDENOSEKIMON_MEMO, stayDurationMin: 55, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 43)) },
    });
    await tx.spot.update({ where: { id: irago.id }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 43)) } });

    // D2: 田原市博物館95分に戻す→以降を5分前へ、普門寺は70分に(10分延長)
    await tx.spot.update({ where: { id: tahara.id }, data: { stayDurationMin: 95 } });
    await tx.spot.update({ where: { id: iwaya.id }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 27)) } });
    await tx.spot.update({
      where: { id: fumonji.id },
      data: { memo: FUMONJI_MEMO, stayDurationMin: 70, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 26)) },
    });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
