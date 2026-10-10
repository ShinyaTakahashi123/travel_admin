/**
 * #451 ce594140（冬の蔵王 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 4か所 10:30〜15:55（温泉街 → ロープウェイ → 上湯 → 高湯通り）。朝いちばんにロープウェイで樹氷原へ上り、温泉街で昼食、帰りに山形市の郷土館へ
 *   蔵王ロープウェイ 蔵王山麓駅（新規）9:20〜9:40 →（山頂線15分）地蔵山頂駅と樹氷原 9:55〜11:10 →（ロープウェイと歩き30分）蔵王温泉（昼食）11:40〜12:40
 *   →（歩き5分）高湯通り 12:45〜13:10 →（歩き5分）上湯共同浴場 13:15〜14:00 →（歩き5分）酢川温泉神社（新規）14:05〜14:30
 *   →（歩きと路線バス70分）山形市郷土館（新規）15:40〜16:30
 *   閉まる時刻: ロープウェイ（冬）山麓線 8:30〜17:00・山頂線 8:45〜16:45、共同浴場 6:00〜22:00、郷土館 9:00〜16:30。本文に時刻・曜日は書かない
 *   もとの本文は案内役の話し言葉で、効能の言い方（美人の湯・皮膚によい）や「最も歴史が古い」もあったので、開いたページの事実だけで書き直す
 * 本文の出典: 蔵王ロープウェイ https://zaoropeway.co.jp/winter/guide.php 、やまがたへの旅 https://yamagatakanko.com/attractions/detail_2721.html （蔵王の樹氷・アクセス）・
 *   detail_2766.html（蔵王温泉・酢川温泉神社・高湯通り）・detail_10816.html（共同浴場）・/transport/detail_13843.html（山形交通の路線バス）、
 *   蔵王温泉観光協会 https://zaomountainresort.com/about/ 、山形市 https://www.city.yamagata-yamagata.lg.jp/shisetsu/bunkasports/1008032/1005895.html （山形市郷土館）
 * 座標の出典: OSM（蔵王山麓駅 way 310732765／地蔵山頂駅 way 310732770／蔵王温泉 node 8527320886（place）／高湯通り way 705939795／
 *   蔵王温泉 上湯共同浴場 way 854848652／酢川温泉神社 way 484655973／山形市郷土館 relation 14422186）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-451-ce594140.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ce594140-b602-4b84-9a15-7e1cda98c987";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const BATH = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。";

const DESCRIPTION = "山形駅から路線バスで蔵王温泉へ。ロープウェイで標高1,661mの地蔵山頂駅へ上り、「スノーモンスター」とも呼ばれる樹氷原を間近に見る冬の日帰りプランです。樹氷の見ごろは例年12月下旬から2月中旬ごろ。下山後は強酸性の硫黄泉の温泉街で昼食をとり、高湯通りや上湯共同浴場、酢川温泉神社をめぐって、帰りに霞城公園の山形市郷土館（旧済生館本館）へ立ち寄ります。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["蔵王温泉", "蔵王ロープウェイ（樹氷高原・地蔵山頂駅）", "蔵王温泉 上湯共同浴場", "高湯通り"].join()) throw new Error("構成が想定と違います");
  const [onsen, rope, kamiyu, takayu] = day.spots;

  const order = [
    { create: { name: "蔵王ロープウェイ 蔵王山麓駅", visitTime: t(9, 20), stayDurationMin: 20, transitMode: null, transitDurationMin: null, transitLine: null, lat: 38.161672, lng: 140.395175, address: "山形県山形市蔵王温泉",
      memo: "この旅は路線バスとロープウェイ、歩きでめぐります。JR山形駅の東口から山形交通の路線バスで約40分、蔵王温泉バスターミナルで降りて、歩いて約15分で蔵王ロープウェイの蔵王山麓駅へ。山麓線で約7分、標高1,331mの樹氷高原駅へ上り、山頂線に乗り換えます。天候によって運転を休むことがあるので、公式の案内で確かめましょう。" } },
    { id: rope.id, data: { name: "地蔵山頂駅と樹氷原", visitTime: t(9, 55), stayDurationMin: 75, transitMode: "other", transitDurationMin: 15, transitLine: null, lat: 38.154735, lng: 140.431084, address: "山形県山形市蔵王温泉（地蔵山頂駅）",
      memo: "樹氷高原駅から山頂線で約10分、標高1,661mの地蔵山頂駅へ。まわりには、冬に「スノーモンスター」とも呼ばれる樹氷が広がります。樹氷は、霧状になった氷点下の水滴を含んだ季節風がオオシラビソ（アオモリトドマツ）の木々にぶつかって凍りつく「着氷」と、そのすき間に雪がとり込まれる「着雪」、それらが互いにくっついて固くしまる「焼結」をくり返して、大きく育ったものです。見ごろは例年12月下旬から2月中旬ごろです。駅の近くには蔵王地蔵尊もまつられています。" + RESPECT + "山頂はとても寒く、天気が急に変わることもあるので、防寒をしっかりして、決められた場所の外には出ないようにしましょう。" } },
    { id: onsen.id, data: { visitTime: t(11, 40), stayDurationMin: 60, transitMode: "other", transitDurationMin: 30, transitLine: null, lat: 38.167927, lng: 140.400344, address: "山形県山形市蔵王温泉",
      memo: "ロープウェイで山麓駅へ戻り、歩いて蔵王温泉の温泉街へ。開湯は約1900年前、日本武尊の東征に従った吉備多賀由が見つけたと伝わる古い温泉で、江戸時代には蔵王権現への登山口としてにぎわいました。強酸性の硫黄泉で、湯量が豊富なことで知られます。温泉街で昼食にしましょう。" } },
    { id: takayu.id, data: { visitTime: t(12, 45), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 38.169146, lng: 140.396885, address: "山形県山形市蔵王温泉",
      memo: "昼食のあとは、蔵王温泉の古くからの温泉街「高湯通り」を歩きます。上湯・下湯・川原湯の3つの共同浴場が歩いて5分ほどの範囲にあり、下湯には足湯もあります。冬の道は凍っていることがあるので、滑りにくい靴で歩きましょう。" } },
    { id: kamiyu.id, data: { visitTime: t(13, 15), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 38.168676, lng: 140.397446, address: "山形県山形市蔵王温泉",
      memo: "高湯通りから、酢川温泉神社へ向かう坂の途中にある上湯共同浴場へ。蔵王温泉に3つある共同浴場のひとつで、一年を通して入浴できます。樹氷原で冷えた体を、強酸性の硫黄泉で温めましょう。" + BATH } },
    { create: { name: "酢川温泉神社", visitTime: t(14, 5), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 38.169458, lng: 140.398789, address: "山形県山形市蔵王温泉",
      memo: "上湯から、高湯通りより続く急な上りの参道をのぼって、その上にまつられる酢川温泉神社へ。" + RESPECT + "冬の参道は凍っていることがあるので、足元に十分気をつけましょう。お参りのあとは、蔵王温泉バスターミナルから路線バスで山形駅へ戻ります。" } },
    { create: { name: "山形市郷土館（旧済生館本館）", visitTime: t(15, 40), stayDurationMin: 50, transitMode: "bus", transitDurationMin: 70, transitLine: "山形交通の路線バス", lat: 38.25326, lng: 140.328649, address: "山形県山形市霞城町1-1（霞城公園内）",
      memo: "蔵王温泉バスターミナルから路線バスで約40分、山形駅へ戻り、西口から霞城公園の南門を通って歩いて約15分で、霞城公園の中にある山形市郷土館へ。明治11年（1878年）9月に完成した擬洋風の病院建築「旧済生館本館」で、県立病院、のちに市立病院の本館として使われました。昭和41年（1966年）に国の重要文化財に指定され、昭和44年（1969年）に今の場所へ移築復元されています。館内では、郷土史や医学に関する資料を展示しています。樹氷と温泉、山形の町をめぐる旅を、ここで締めくくりましょう。帰りは、山形駅まで歩いて約15分です。" } },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 山麓駅 9:20 → 地蔵山頂駅と樹氷原 9:55〜11:10 → 蔵王温泉（昼食）11:40 → 高湯通り 12:45 → 上湯 13:15 → 酢川温泉神社 14:05〜14:30 →（バス）山形市郷土館 15:40〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
