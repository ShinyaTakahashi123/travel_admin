/**
 * #324の続き。企画運営2026-10-01 00:58の4点。
 * 1) 終わりが16:24(直す前)で窓外だった。小幡記念図書館(福澤諭吉と学問の
 *    すゝめを共著した小幡篤次郎ゆかりの図書館、槇文彦設計の名建築)を
 *    追加し、16:44に着地させた。
 * 2) 自性寺の75分は長すぎた(決まりA)。40分に短縮。
 * 3) 中津城の書き出しに「JR中津駅から歩いておよそ15分」を追加(帰りの
 *    一言は既に村上医家史料館にあり)。
 * 4) 福澤諭吉旧居・福澤記念館の見学(旧居+記念館)だけで40分ほどかかる
 *    ため、昼食(30〜40分)とあわせて80分に延ばした。
 *
 * 座標の出典: 小幡記念図書館、Nominatim名称一致。way 212723756,
 * 33.6037428,131.1844041
 * 事実確認: 中津図書館として明治42年(1909)開設、大正元年(1912)財団法人
 * 小幡記念図書館に改称、槇文彦設計の現行館は平成5年(1993)開館、日本
 * 図書館協会建築賞(平成7年)・公共建築百選(平成10年)選定(city-nakatsu.jp・
 * bunka.nii.ac.jp公式)。小幡篤次郎は福澤諭吉と「学問のすゝめ」を共著した
 * 慶應義塾2代目塾長。福澤諭吉自身が図書館の設計に関わったわけではない
 * ため、その旨は本文で断定していない
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-324d-84eb50c0.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "84eb50c0-577b-428d-9200-80b8a8f2fedb";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "小幡記念図書館" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const nakatsujo = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "中津城" } });
  const nakahaku = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "なかはく" } });
  const fukuzawa = await prisma.spot.findFirstOrThrow({
    where: { dayId: day1.id, name: "福澤諭吉旧居・福澤記念館" },
  });
  const oe = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "大江医家史料館" } });
  const teramachi = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "寺町" } });
  const jishoji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "自性寺" } });
  const murakami = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "村上医家史料館" } });

  const nakatsujoMemo = (nakatsujo.memo ?? "").replace(
    "中津城は、天正16年(1588)、",
    "JR中津駅から歩いておよそ15分。中津城は、天正16年(1588)、"
  );

  const jishojiMemo = (jishoji.memo ?? "").replace(
    "続いては、歩いておよそ6分の村上医家史料館へ向かいましょう。",
    "続いては、歩いておよそ6分の小幡記念図書館へ向かいましょう。"
  );

  const murakamiMemo = (murakami.memo ?? "").replace(
    "自性寺からは歩いておよそ6分です。",
    "小幡記念図書館からは歩いておよそ3分です。"
  );

  await setDaySpotOrder(day1.id, [
    { id: nakatsujo.id, data: { memo: nakatsujoMemo } },
    { id: nakahaku.id, data: {} },
    { id: fukuzawa.id, data: { stayDurationMin: 80 } },
    {
      id: oe.id,
      data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 0)) },
    },
    { id: teramachi.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 38)) } },
    {
      id: jishoji.id,
      data: { memo: jishojiMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 20)), stayDurationMin: 40 },
    },
    {
      create: {
        name: "小幡記念図書館",
        address: "中津市二ノ丁",
        lat: 33.6037428,
        lng: 131.1844041,
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 6)),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 6,
        memo:
          "自性寺からは歩いておよそ6分です。小幡記念図書館は、明治42年(1909)に開設された中津図書館を前身とする、中津市立の図書館です。福澤諭吉と「学問のすゝめ」を共著した、慶應義塾2代目塾長・小幡篤次郎にちなんで名づけられました。現在の建物は、建築家・槇文彦の設計により平成5年(1993)に開館したもので、日本図書館協会建築賞や、公共建築百選にも選ばれています。福澤諭吉とゆかりの深い中津らしい、学問の香り漂う建築を眺めてみましょう。続いては、歩いておよそ3分の村上医家史料館へ向かいましょう。",
      },
    },
    {
      id: murakami.id,
      data: { memo: murakamiMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 44)), transitDurationMin: 3 },
    },
  ]);

  for (const [name, mode, min] of [
    ["福澤諭吉旧居・福澤記念館", "walk", 8],
    ["大江医家史料館", "walk", 4],
    ["寺町", "walk", 3],
    ["自性寺", "walk", 12],
    ["小幡記念図書館", "walk", 6],
    ["村上医家史料館", "walk", 3],
  ] as [string, string, number][]) {
    const s = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name } });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: s.id, orderNo: 1, transitMode: mode, transitDurationMin: min },
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
