/**
 * #351の続き。企画運営10/1 14:13・法務14:13の指摘に対応。
 *
 * 1. 最上義光歴史館の35分では見学と昼食を両方行うのは無理との指摘。昼食を
 *    独立した40分以上の時間として確保するため、滞在を75分(見学35分+昼食
 *    40分)に延長。近くの実在の飲食店をOverpass(OSM)で確認
 *    (玄海焼肉店 38.2522175,140.3329466、歴史館から約320m)。
 *    延びた分、17:00を超えてしまうため、決まりどおり滞在を縮めて帳尻を
 *    合わせるのではなく、山形県立博物館を外して調整(山形美術館・郷土館で
 *    博物館の要素は引き続きカバー)。
 * 2. 法務の指摘(できれば)で、山形美術館の「山形銀行の元会長・長谷川吉郎氏」
 *    を、会社名を出さない「実業家・長谷川吉郎氏」に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-351f-b461a3e0.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY2_ID = "54d2bf64-6494-40cb-96c2-877861b27eaa";

const SHIRAGANE_FALLS_ID = "e906056d-38c8-45b0-879e-a98dc3edbea8";
const SHIROGANEYU_ID = "c431760f-e5ec-4d32-b165-d3e7c0736fdf";
const KAJOKOEN_ID = "6c3d9355-885a-4c25-bcd0-e18788de65b9";
const YOSHIAKI_ID_NAME = "最上義光歴史館";
const BIJUTSUKAN_NAME = "山形美術館";
const MUSEUM_ID = "29811af4-c4a3-49a3-b26a-838897de68c5";
const KYODOKAN_ID = "c7d2f61b-668c-4eaf-aac6-c2f9ec3608ac";
const BUNSHOKAN_ID = "6d4feffc-3070-461d-902b-20b56df68a63";
const BENINOKURA_ID = "0eb03bc1-7dce-4990-8c70-de23840c68fc";

async function main() {
  const yoshiaki = await prisma.spot.findFirstOrThrow({ where: { name: YOSHIAKI_ID_NAME, dayId: DAY2_ID } });
  if (yoshiaki.stayDurationMin === 75) {
    console.log("already applied, skipping");
    return;
  }

  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { name: BIJUTSUKAN_NAME, dayId: DAY2_ID } });
  let bijutsukanNewMemo = bijutsukan.memo!.replace("山形銀行の元会長・長谷川吉郎氏", "実業家・長谷川吉郎氏");
  if (bijutsukanNewMemo === bijutsukan.memo) throw new Error("山形美術館: 長谷川吉郎の肩書き置換に失敗");
  bijutsukanNewMemo = bijutsukanNewMemo.replace(
    "見学を終えたら、歩いておよそ4分の山形県立博物館へ向かいましょう。",
    "見学を終えたら、歩いておよそ6分の山形市郷土館(旧済生館本館)へ向かいましょう。"
  );
  if (!bijutsukanNewMemo.includes("山形市郷土館")) throw new Error("山形美術館: 結びの置換に失敗");

  const kyodokan = await prisma.spot.findUniqueOrThrow({ where: { id: KYODOKAN_ID } });
  const kyodokanNewMemo = kyodokan.memo!.replace(
    "山形県立博物館を見学したら、歩いてすぐの山形市郷土館(旧済生館本館)へ向かいましょう。",
    "山形美術館を見学したら、歩いておよそ6分の山形市郷土館(旧済生館本館)へ向かいましょう。"
  );
  if (kyodokanNewMemo === kyodokan.memo) throw new Error("山形市郷土館: 書き出しの置換に失敗");

  await setDaySpotOrder(
    DAY2_ID,
    [
      { id: SHIRAGANE_FALLS_ID, data: {} },
      { id: SHIROGANEYU_ID, data: {} },
      { id: KAJOKOEN_ID, data: {} },
      { id: yoshiaki.id, data: { stayDurationMin: 75 } },
      { id: bijutsukan.id, data: { memo: bijutsukanNewMemo } },
      { id: KYODOKAN_ID, data: { memo: kyodokanNewMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 9)), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 6 } },
      { id: BUNSHOKAN_ID, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 0)) } },
      { id: BENINOKURA_ID, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 16, 6)), stayDurationMin: 35 } },
    ],
    { remove: [MUSEUM_ID] }
  );

  console.log("#351 Day2: 山形県立博物館を外し、最上義光歴史館の滞在を75分(見学+昼食)に。美術館の肩書き表現も修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
