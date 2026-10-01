/**
 * #351の続き。企画運営10/1 14:08の2点に対応。
 *
 * 1. 紅の蔵100分(昼食を霞城公園へ移したため、店と直売所を見るだけになり
 *    水増し)を35分に短縮。空いた時間に、企画運営提案の最上義光歴史館
 *    (霞城公園の東大手門前、最上義光の遺品を展示)と山形美術館(長谷川・
 *    吉野石膏コレクション)を新規追加。どちらも開館時間を公式で確認
 *    (最上義光歴史館: 9:00〜17:00・入館16:30まで・無料・月曜と年末年始
 *    休館。山形美術館: 10:00〜17:00・入館16:30まで・月曜休館)。
 *    出典: https://www.city.yamagata-yamagata.lg.jp/bunkasports/geijyutsu/1006706/1008028.html
 *    https://www.yamagata-art-museum.or.jp/information
 * 2. 霞城公園到着(11:25)直後の昼食が11:30よりわずかに早く始まっていた
 *    ため、昼食の一言を霞城公園から外し、次の最上義光歴史館(到着12:06、
 *    11:30以降)の書き出しに移した。
 *
 * 座標の出典(ともにNominatim名称一致): 最上義光歴史館38.2551083,140.3334337・
 * 山形美術館38.2558691,140.3323997
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-351e-b461a3e0.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY2_ID = "54d2bf64-6494-40cb-96c2-877861b27eaa";

const KAJOKOEN_ID = "6c3d9355-885a-4c25-bcd0-e18788de65b9";
const MUSEUM_ID = "29811af4-c4a3-49a3-b26a-838897de68c5";
const KYODOKAN_ID = "c7d2f61b-668c-4eaf-aac6-c2f9ec3608ac";
const BUNSHOKAN_ID = "6d4feffc-3070-461d-902b-20b56df68a63";
const BENINOKURA_ID = "0eb03bc1-7dce-4990-8c70-de23840c68fc";
const SHIRAGANE_FALLS_ID = "e906056d-38c8-45b0-879e-a98dc3edbea8";
const SHIROGANEYU_ID = "c431760f-e5ec-4d32-b165-d3e7c0736fdf";

async function main() {
  const already = await prisma.spot.findFirst({ where: { dayId: DAY2_ID, name: "最上義光歴史館" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const kajojoen = await prisma.spot.findUniqueOrThrow({ where: { id: KAJOKOEN_ID } });
  let kajojoenNewMemo = kajojoen.memo!.replace("到着したら、まずこのあたりで昼食をとりましょう。", "");
  if (kajojoenNewMemo === kajojoen.memo) throw new Error("霞城公園: 昼食の一言が見つからない");
  kajojoenNewMemo = kajojoenNewMemo.replace(
    "見学を終えたら、歩いてすぐの山形県立博物館へ向かいましょう。",
    "見学を終えたら、歩いておよそ6分の最上義光歴史館へ向かいましょう。"
  );
  if (!kajojoenNewMemo.includes("最上義光歴史館へ向かいましょう")) throw new Error("霞城公園: 結びの置換に失敗");

  const yoshiakiMemo =
    "霞城公園を見学したら、歩いておよそ6分の最上義光歴史館へ向かいましょう。到着したら、まずこのあたりで昼食をとりましょう。霞城公園の東大手門前にある、山形城を築いた戦国武将・最上義光ゆかりの資料館です。義光が実際に身につけていたと伝わる兜「三十八間金覆輪筋兜」や、金色の小札に紫の糸威を施した胴丸など、本人の遺品が展示されています。関ヶ原の戦いと連動した長谷堂合戦を描いた屏風の複製も見どころです。雪の城下に生きた武将の足跡を、じっくりとたどってみましょう。見学を終えたら、歩いてすぐの山形美術館へ向かいましょう。";

  const bijutsukanMemo =
    "最上義光歴史館を見学したら、歩いてすぐの山形美術館へ向かいましょう。山形銀行の元会長・長谷川吉郎氏から寄贈された、与謝蕪村の「奥の細道図屏風」など江戸時代の絵画を中心とする長谷川コレクションや、ピサロ、モネ、ルノワールといった19〜20世紀フランス絵画を収める吉野石膏コレクションなど、複数のコレクションを収蔵する美術館です。期間を区切った企画展も開かれています。雪の城下町で、日本と西洋、両方の美術にふれてみましょう。見学を終えたら、歩いておよそ4分の山形県立博物館へ向かいましょう。";

  const museum = await prisma.spot.findUniqueOrThrow({ where: { id: MUSEUM_ID } });
  const museumNewMemo = museum.memo!.replace(
    "霞城公園を見学したら、歩いてすぐの山形県立博物館へ向かいましょう。",
    "山形美術館を見学したら、歩いておよそ4分の山形県立博物館へ向かいましょう。"
  );
  if (museumNewMemo === museum.memo) throw new Error("山形県立博物館: 書き出しの置換に失敗");

  await setDaySpotOrder(
    DAY2_ID,
    [
      { id: SHIRAGANE_FALLS_ID, data: {} },
      { id: SHIROGANEYU_ID, data: {} },
      { id: KAJOKOEN_ID, data: { memo: kajojoenNewMemo, stayDurationMin: 35 } },
      {
        create: {
          name: "最上義光歴史館",
          address: "山形県山形市大手町1-53",
          lat: 38.2551083,
          lng: 140.3334337,
          visitTime: new Date(Date.UTC(1970, 0, 1, 12, 6)),
          stayDurationMin: 35,
          transitMode: "walk",
          transitDurationMin: 6,
          memo: yoshiakiMemo,
        },
      },
      {
        create: {
          name: "山形美術館",
          address: "山形県山形市大手町1-63",
          lat: 38.2558691,
          lng: 140.3323997,
          visitTime: new Date(Date.UTC(1970, 0, 1, 12, 43)),
          stayDurationMin: 40,
          transitMode: "walk",
          transitDurationMin: 2,
          memo: bijutsukanMemo,
        },
      },
      {
        id: MUSEUM_ID,
        data: { memo: museumNewMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 27)), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 4 },
      },
      {
        id: KYODOKAN_ID,
        data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 4)), stayDurationMin: 30 },
      },
      {
        id: BUNSHOKAN_ID,
        data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 50)), stayDurationMin: 50 },
      },
      {
        id: BENINOKURA_ID,
        data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 56)), stayDurationMin: 35 },
      },
    ],
    {}
  );

  console.log("#351 Day2: 最上義光歴史館・山形美術館を追加、紅の蔵を35分に短縮、昼食の位置を調整");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
