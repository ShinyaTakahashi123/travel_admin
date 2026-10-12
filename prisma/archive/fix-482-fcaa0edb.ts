/**
 * #482 fcaa0edb（京都 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 5か所 09:00〜15:10（八坂の塔 → 八坂庚申堂 → 建仁寺 → 新京極商店街 → 錦市場）で、タイトルの「清水寺から祇園へ」なのに清水寺も祇園も入っておらず、昼食の一言がなかった
 *   タイトルどおり、清水寺から産寧坂・八坂の塔・庚申堂・建仁寺を通り、花見小路（昼食）・祇園白川・八坂神社・円山公園で締めくくる（戻らない。新京極・錦市場は鴨川の西なので外す）
 *   清水寺（新規）9:10〜10:15 →（歩き10分）産寧坂（新規）10:25〜11:00 →（歩き5分）法観寺 11:05〜11:25 →（歩き5分）八坂庚申堂 11:30〜11:50 →（歩き10分）建仁寺 12:00〜13:05
 *   →（歩き10分）花見小路通（新規・昼食）13:15〜14:20 →（歩き5分）祇園白川（新規）14:25〜15:05 →（歩き10分）八坂神社（新規）15:15〜15:55 →（歩き5分）円山公園（新規）16:00〜16:30
 *   閉まる時刻: 清水寺 6:00〜18:00、建仁寺 10:00〜17:00（受付16:30まで）。本文に時刻・曜日・料金は書かない
 * 本文の出典: 京都観光Navi 清水寺 https://ja.kyoto.travel/tourism/single01.php?category_id=7&tourism_id=267 ・清水寺 https://www.kiyomizudera.or.jp/access.php （京都駅から市バスで五条坂、徒歩10分）、
 *   産寧坂 https://ja.kyoto.travel/tourism/single01.php?category_id=8&tourism_id=691 、法観寺 https://ja.kyoto.travel/tourism/single01.php?category_id=7&tourism_id=518 、
 *   八坂庚申堂 https://ja.kyoto.travel/tourism/single01.php?category_id=7&tourism_id=2007 、建仁寺 https://www.kenninji.jp/around/ ・ https://www.kenninji.jp/ （京都最古の禅寺）・ https://www.kenninji.jp/news/?p=2196 （撮影）、
 *   祇園の私道 https://www.ktv.jp/news/feature/240318-shido/ 、祇園新橋 https://ja.kyoto.travel/tourism/single01.php?category_id=8&tourism_id=689 、
 *   八坂神社 https://ja.kyoto.travel/tourism/single01.php?category_id=7&tourism_id=474 、円山公園 京都市 https://www.city.kyoto.lg.jp/kensetu/page/0000257049.html
 * 座標の出典: OSM（清水寺 way 336641107／三年坂 way 526198271／法観寺 way 371717423／八坂庚申堂 way 1316622873／建仁寺 way 760889100／花見小路通 way 547229146／巽橋 way 190891717／八坂神社 way 328903218／円山公園 way 54170783）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-482-fcaa0edb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "fcaa0edb-3539-47f5-ae75-4ee183f27044";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const TOWN = "今も人が暮らす町並みです。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。";

const DESCRIPTION = "清水の舞台で知られる清水寺から、石畳の産寧坂、八坂の塔、くくり猿の八坂庚申堂を通って、禅寺の建仁寺へ。花見小路で昼食をとり、祇園白川の町並みを歩いて、八坂神社と円山公園で締めくくる、着物で歩く東山と祇園の日帰りさんぽです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["法観寺（八坂の塔）", "八坂庚申堂", "建仁寺", "新京極商店街", "錦市場"].join()) throw new Error("構成が想定と違います");
  const [tower, koshin, kennin, shinkyo, nishiki] = day.spots;

  const order = [
    { create: mk({ name: "清水寺", h: 9, m: 10, stay: 65, mode: null, min: null, lat: 34.994303, lng: 135.7844389, address: "京都府京都市東山区清水一丁目294",
      memo: "この旅は歩きでめぐります。着物で歩くときは、坂道や石段で、裾と足元に気をつけましょう。京都駅から市バスで五条坂へ行き、歩いて約10分の清水寺へ。宝亀9年（778年）の開山と伝わる寺で、「清水の舞台」で知られる本堂は国宝です。今の主な堂塔は、寛永10年（1633年）に徳川家光が再建したもので、舞台は、長さ約12mのケヤキの柱を組み合わせて、崖の上に張り出しています。「古都京都の文化財」のひとつとして、世界遺産に登録されています。舞台の上では、手すりから身を乗り出さないようにしましょう。" + RESPECT }) },
    { create: mk({ name: "産寧坂", h: 10, m: 25, stay: 35, mode: "walk", min: 10, lat: 34.9972858, lng: 135.7810498, address: "京都府京都市東山区清水三丁目",
      memo: "清水寺の門前から坂を下って、産寧坂（三年坂）へ。清水寺などの社寺への古くからの参詣路で、石段や折れ曲がった石畳の坂に沿って、江戸時代の終わりから大正時代にかけて建てられた町家が並び、国の重要伝統的建造物群保存地区に選ばれています。石段では足元に気をつけましょう。" + TOWN }) },
    { id: tower.id, data: { visitTime: t(11, 5), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 34.9984916, lng: 135.7793183, address: "京都府京都市東山区清水八坂上町388",
      memo: "産寧坂から八坂通へ入ると、法観寺の五重塔「八坂の塔」が見えてきます。飛鳥時代に創建されたと伝わる古い寺で、高さ46mの塔は、永享12年（1440年）に足利義教が再建したもので、国の重要文化財です。東山の景色に欠かせない塔を、坂の途中から見上げましょう。" + RESPECT } },
    { id: koshin.id, data: { visitTime: t(11, 30), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 34.9983685, lng: 135.7787632, address: "京都府京都市東山区金園町390",
      memo: "塔のすぐ下の八坂庚申堂へ。平安時代に浄蔵貴所が開いたと伝えられるお堂です。境内に色とりどりに並ぶ「くくり猿」は、欲のままに動く猿の手足をくくった姿で、わがままな自分の心を戒めるお守りとされています。" + RESPECT } },
    { id: kennin.id, data: { visitTime: t(12, 0), stayDurationMin: 65, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 35.0002572, lng: 135.7737408, address: "京都府京都市東山区大和大路通四条下る小松町",
      memo: "八坂通を西へ歩いて、建仁寺へ。建仁2年（1202年）、栄西を開山、源頼家を開基として開かれた、京都最古の禅寺とされる寺です。慶長4年（1599年）に移された方丈や、○・△・□の3つの形で地・水・火を表すともいわれる「〇△□乃庭」、どこから見ても正面となる中庭「潮音庭」などを見学できます。撮影できる場所や決まりは、お寺の案内に従いましょう。" + RESPECT } },
    { create: mk({ name: "花見小路通", h: 13, m: 15, stay: 65, mode: "walk", min: 10, lat: 35.0044755, lng: 135.7751432, address: "京都府京都市東山区祇園町南側",
      memo: "建仁寺の北の門から、花見小路通を北へ歩いて、四条通へ。祇園の石畳の通りで、このあたりで昼食にしましょう。祇園には、私道での撮影が禁じられているところがあります。舞妓さんや芸妓さんを呼び止めたり、追いかけて撮ったりしないようにしましょう。" }) },
    { create: mk({ name: "祇園白川", h: 14, m: 25, stay: 40, mode: "walk", min: 5, lat: 35.0055773, lng: 135.7745018, address: "京都府京都市東山区清本町",
      memo: "四条通の北、白川のほとりの祇園新橋へ。祇園社の門前町として始まった祇園のなかでも、江戸時代の終わりから明治時代のはじめにかけて茶屋町として栄えた地区で、茶屋造りの町家が、白川の流れや石畳、桜並木とともに残り、国の重要伝統的建造物群保存地区に選ばれています。川辺では足元に気をつけましょう。" + TOWN }) },
    { create: mk({ name: "八坂神社", h: 15, m: 15, stay: 40, mode: "walk", min: 10, lat: 35.0036027, lng: 135.7782611, address: "京都府京都市東山区祇園町北側625",
      memo: "白川から東へ歩いて、四条通の東の端の八坂神社へ。「祇園さん」と呼ばれて親しまれる神社で、承応3年（1654年）に徳川家綱が再建した本殿は、祇園造と呼ばれる独特の造りで、国宝です。貞観11年（869年）に疫病がはやったとき、この神社の神に祈ったのが、祇園祭の始まりと伝わります。" + RESPECT }) },
    { create: mk({ name: "円山公園", h: 16, m: 0, stay: 30, mode: "walk", min: 5, lat: 35.0037618, lng: 135.7814763, address: "京都府京都市東山区円山町",
      memo: "八坂神社の境内を抜けて、東どなりの円山公園へ。明治19年（1886年）に開かれた、京都市でもっとも古い公園とされます。園内のしだれ桜（一重白彼岸枝垂桜）は、昭和24年に植えられた2代目です。清水寺から祇園へ、着物で歩く東山の旅を、ここで締めくくりましょう。帰りは、祇園のバス停から市バスで京都駅へ。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 清水寺 9:10 → 産寧坂 10:25 → 八坂の塔 11:05 → 庚申堂 11:30 → 建仁寺 12:00 → 花見小路（昼食）13:15 → 祇園白川 14:25 → 八坂神社 15:15 → 円山公園 16:00〜16:30（新京極・錦市場は外す）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order as any, { tx, remove: [shinkyo.id, nishiki.id] });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
