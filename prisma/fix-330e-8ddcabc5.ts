/**
 * #330の組み直し(その4)。企画運営2026-10-01 04:33・04:34、法務04:33の指摘に対応。
 *
 * 企画運営04:33: 資料館の滞在60→85分・移動5→15分への変更は、時間を延ばして
 * 合わせただけで決まりAの水増しにあたる、と指摘。元の60分・5分に戻し、空く
 * 約35分は、天岩戸温泉(日帰り入浴、公式で確認)を1日目の最後に追加して埋めた。
 * (企画運営の案(a)「開始を8:30→9:00にずらす」は、そうすると昼食(高千穂神社
 * 到着)が13:30を過ぎてしまう(決まり「昼食は11:30〜13:30開始」に反する)ため
 * 使わず、(b)の行き先追加を選んだ。)
 * 天岩戸温泉は資料館の後、1日目の最後に配置(宿泊の一言もここに移動)。
 *
 * 企画運営04:34: 石垣の村の「戸数わずか7戸」は、住む人数が変わり得て確かめ
 * にくいため、具体的な数を外し「小さな集落」に変更。
 * 法務04:33: 石垣の村に住民への配慮の一文(敷地・畑に入らない、住まいや人への
 * 撮影を控える)を追加。
 *
 * 天岩戸温泉の座標出典: GSI住所検索「宮崎県西臼杵郡高千穂町岩戸58」
 * (131.352036,32.744366)。
 * 事実確認(公式・るるぶ&more.等、直接確認): 天岩戸地区を見渡す高台に立つ
 * 日帰り公衆浴場。大浴場・サウナを完備、休憩室・茶屋(郷土料理)併設。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-330e-8ddcabc5.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "8ddcabc5-91a8-49bb-881a-d60a4d29dc93";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "天岩戸温泉" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const takachihoJinja = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "高千穂神社" } });
  const shiryokan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "高千穂町歴史民俗資料館" } });
  const ishigaki = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "石垣の村(戸川地区)" } });

  await setDaySpotOrder(day1.id, [
    { id: (await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "天岩戸神社(西本宮)" } })).id, data: {} },
    { id: (await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "天安河原" } })).id, data: {} },
    { id: (await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "天岩戸神社(東本宮)" } })).id, data: {} },
    { id: (await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "八大龍王水神" } })).id, data: {} },
    { id: (await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "槵觸神社(くしふる神社)" } })).id, data: {} },
    { id: (await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "四皇子峰・高天原遥拝所" } })).id, data: {} },
    { id: (await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "天真名井" } })).id, data: {} },
    { id: (await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "荒立神社" } })).id, data: {} },
    { id: takachihoJinja.id, data: {} },
    {
      id: shiryokan.id,
      data: {
        stayDurationMin: 60,
        transitDurationMin: 5,
        memo:
          "高千穂神社からは、車でおよそ5分です。高千穂町歴史民俗資料館は、町内から出土した考古資料や、古文書、化石、動物の剥製など、およそ1万点の資料を収蔵する施設です。中でも、高千穂神楽で使われる神面や、紙で作られた「彫物(えりもの)」と呼ばれる飾りは、今日訪ねた神楽殿の奉納をより深く味わう手がかりになります。これまでの1日で巡ってきた神話の舞台を、あらためて資料とともに振り返ってみましょう。続いては、車でおよそ15分の天岩戸温泉へ向かいましょう。",
      },
    },
    {
      create: {
        name: "天岩戸温泉",
        address: "西臼杵郡高千穂町岩戸58",
        lat: 32.744366,
        lng: 131.352036,
        stayDurationMin: 35,
        transitMode: "car",
        transitDurationMin: 15,
        memo:
          "高千穂町歴史民俗資料館からは、車でおよそ15分です。天岩戸温泉は、天岩戸地区を見渡す高台に立つ日帰り入浴施設です。大浴場にはサウナも備わり、1日歩き回った体をゆっくりとほぐすことができます。浴場では、ほかの方が写らないよう撮影は控え、長湯を避けて水分をとりながら楽しみましょう。併設の茶屋では、郷土料理を味わうこともできます。今夜はこの近くの宿に宿泊し、神話の里の夜を過ごします。",
      },
    },
  ]);

  // 資料館・天岩戸温泉の時刻を再計算(高千穂神社 13:27+85=15:12 までは変更なし)
  await prisma.spot.update({ where: { id: shiryokan.id }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 57)) } });
  const tenIwato = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "天岩戸温泉" } });
  await prisma.spot.update({ where: { id: tenIwato.id }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 16, 12)) } });
  console.log("day1 done");

  await prisma.spot.update({
    where: { id: ishigaki.id },
    data: {
      memo:
        "道の駅青雲橋からは、車でおよそ20分です。石垣の村は、日之影川沿いの山あいにひっそりと佇む小さな集落です。記録に残る中で最も古い石垣は、嘉永から安政年間(1854〜1859)に築かれたと伝えられ、宅地や耕地、石蔵から防風垣にいたるまで、集落全体が丁寧に積まれた石垣で形づくられています。中でも、高さおよそ11mの石垣は日本一ともいわれ、苔むした石組みの棚田には、先人たちの知恵と労苦がしのばれます。住民の方が暮らす集落です。家の敷地や畑には入らず、静かに見学し、住まいや人に向けた撮影は控えましょう。続いては、車でおよそ40分の高千穂の湯へ向かいましょう。",
    },
  });
  console.log("day2 done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
