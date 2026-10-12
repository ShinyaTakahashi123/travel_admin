/**
 * #161の続き。itinerary-audit.cjsが検出した2点を修正。
 * ①中山の農村歌舞伎舞台: 「毎年10月の第2日曜日に上演」が、禁止語スキャンの
 *   「日曜」に該当したため、具体的な上演日を外した言い回しに変更。
 * ②Day2: 映画村の滞在を110分→85分に短くした際、後続スポットの
 *   visitTimeを更新し忘れており、「時刻の計算が合わない」になっていた。
 *   岬の分教場以降をすべて正しい時刻に組み直した。
 *
 * 新しい時刻(Day2、09:30〜16:32): 映画村09:30(85)→岬の分教場11:03(40)→
 * 昼食11:53(75)→醤の郷13:13(65)→観音寺14:23(30)→坂手港14:55(50)→
 * 常光寺15:48(44)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-161f-464a25fa.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY2_ID = "c9f825d6-5aa0-4e33-b608-cfcadc4977f3";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const nakayamaStage = await prisma.spot.findFirstOrThrow({ where: { name: "中山の農村歌舞伎舞台" } });
  const eigamura = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "二十四の瞳映画村" } });
  const bunkyojo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "岬の分教場" } });
  const lunch2 = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "馬木で昼食" } });
  const shoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "醤の郷" } });
  const kannonji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "観音寺" } });
  const sakate = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "坂手港" } });
  const jokoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "常光寺" } });

  if (bunkyojo.visitTime?.getUTCHours() === 11 && bunkyojo.visitTime?.getUTCMinutes() === 3) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: nakayamaStage.id },
    data: {
      memo: nakayamaStage.memo!.replace(
        "中山では毎年10月の第2日曜日に上演が行われ、棚田に囲まれたこの土地ならではの、のどかな雰囲気の中で歌舞伎が楽しまれてきました。",
        "中山では、棚田に囲まれたこの土地ならではの、のどかな雰囲気の中で、今も年に一度、地域の人々によって歌舞伎が演じ継がれています。"
      ),
    },
  });

  await setDaySpotOrder(DAY2_ID, [
    { id: eigamura.id, data: {} },
    { id: bunkyojo.id, data: { visitTime: T(11, 3) } },
    { id: lunch2.id, data: {} },
    { id: shoyu.id, data: { visitTime: T(13, 13) } },
    { id: kannonji.id, data: { visitTime: T(14, 23) } },
    { id: sakate.id, data: { visitTime: T(14, 55) } },
    { id: jokoji.id, data: { visitTime: T(15, 48) } },
  ]);

  console.log("#161続き: 中山の農村歌舞伎舞台の上演日の記載を削除、Day2のvisitTimeを移動時間に合わせて修正(09:30〜16:32)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
