/**
 * #161の続き。法務の指摘に対応(記録 2076d55)。
 * ①馬木で昼食 34.474697,134.329285 は、国土地理院で「香川県小豆島町馬木」
 *   (大字だけ、番地なし)を引いた点そのものだったため、使えない。法務の
 *   提案どおり、醤の郷現代美術館の点(n10047329439、醤の郷と同じ点)に
 *   変更。
 * ②土庄の町で昼食 34.486652,134.188629 は、どの住所の点か確認できな
 *   かったため、法務の提案どおり土庄町立中央図書館の点(n1423732510、
 *   34.486125,134.189450)に変更。
 * 座標変更にあわせて、前後の移動時間・時刻も組み直した。
 *
 * 新しい時刻:
 * Day1(09:20〜16:34、変更なし。土庄の昼食の座標のみ変更、距離がほぼ
 *   同じため時刻は変わらず)
 * Day2(09:30〜16:30、昼食→醤の郷が同じ点になったため、醤の郷以降が
 *   3分ずつ早まる): 醤の郷13:11→観音寺14:21→坂手港14:53→常光寺15:46
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-161h-464a25fa.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "322356ed-3fb4-4c5a-afe4-edc2b31855a8";
const DAY2_ID = "c9f825d6-5aa0-4e33-b608-cfcadc4977f3";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const lunch1 = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "土庄の町で昼食" } });
  const lunch2 = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "馬木で昼食" } });
  const shoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "醤の郷" } });
  const kannonji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "観音寺" } });
  const sakate = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "坂手港" } });
  const jokoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "常光寺" } });

  if (Number(lunch1.lat) === 34.486125) {
    console.log("already applied, skipping");
    return;
  }

  // ---------- Day1: 土庄の昼食の座標を図書館の点に(距離がほぼ同じため時刻は維持) ----------
  await prisma.spot.update({
    where: { id: lunch1.id },
    data: { lat: 34.486125, lng: 134.18945 },
  });

  // ---------- Day2: 馬木の昼食を醤の郷と同じ点に、以降の時刻を組み直し ----------
  await prisma.spot.update({
    where: { id: lunch2.id },
    data: {
      lat: 34.474685,
      lng: 134.317926,
      memo: "岬の分教場から車でおよそ12分、お昼は醤油蔵の立ち並ぶ馬木地区で食事をとりましょう。醤油の香りが漂う町並みの中に、島の食材を使った定食や、醤油味のソフトクリームを味わえる店もあります。ゆっくりと食事をとったら、醤の郷を巡りましょう。",
    },
  });
  await prisma.spot.update({
    where: { id: shoyu.id },
    data: {
      visitTime: T(13, 11),
      memo: shoyu.memo?.replace("馬木の町から車でおよそ4分、次に訪れるのは醤の郷です。", "次に訪れるのは醤の郷です。"),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
    },
  });
  await prisma.spot.update({ where: { id: kannonji.id }, data: { visitTime: T(14, 21) } });
  await prisma.spot.update({ where: { id: sakate.id }, data: { visitTime: T(14, 53) } });
  await prisma.spot.update({ where: { id: jokoji.id }, data: { visitTime: T(15, 46) } });

  console.log("#161続き: 昼食2か所の座標を法務指摘の実点(土庄=図書館、馬木=醤の郷現代美術館)に修正、Day2の醤の郷以降の時刻を組み直し");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
