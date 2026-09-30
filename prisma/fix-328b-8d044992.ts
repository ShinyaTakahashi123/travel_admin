/**
 * #328の続き。表参道の昼食の到着が11:12で、11:30より前だった(自己
 * チェック、itinerary-audit再確認で気づいた決まり)。明治神宮ミュー
 * ジアム(令和元年〈2019〉開館、隈研吾設計、明治天皇・昭憲皇太后
 * ゆかりの品を展示)を実在の内容として本文に加え、明治神宮の滞在を
 * 65分→85分に延ばして、表参道の到着を11:32(11:30より後)にした。
 * 後続のスポットのvisitTimeもすべて+20分ずらした(終了は16:30→
 * 16:50、窓内)。
 *
 * 事実確認(直接開いて確認): 明治神宮ミュージアムは、鎮座百年祭記念
 * 事業として令和元年(2019)10月に開館。建築家・隈研吾が設計を手がけ、
 * 森の中に溶け込むような、木の葉を思わせる屋根が特徴。明治天皇・
 * 昭憲皇太后ゆかりの品々を展示。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-328b-8d044992.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "8d044992-9b50-48ea-9beb-05be5076a217";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const jingu = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "明治神宮" } });
  const takeshita = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "竹下通り" } });
  const omotesando = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "表参道" } });
  const catstreet = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "キャットストリート" } });
  const center = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "渋谷センター街" } });
  const sky = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "渋谷スクランブルスクエア" } });

  if (jingu.stayDurationMin === 85) {
    console.log("already applied, skipping");
    return;
  }

  const jinguMemo =
    "明治神宮は、大正9年(1920)に創建された、明治天皇と昭憲皇太后をお祀りする神社です。JR原宿駅から歩いてすぐの南参道が正参道で、鳥居をくぐると都心とは思えない、深い森の中の参道が続きます。社殿は太平洋戦争末期の東京大空襲で焼失しましたが、昭和33年(1958)に再建されました。本殿の脇には、創建当初からこの場所に立つ「夫婦楠」と呼ばれる御神木もあります。境内には、鎮座百年祭記念事業として令和元年(2019)に開館した明治神宮ミュージアムもあり、建築家・隈研吾が手がけた、森に溶け込むような屋根の建物の中で、明治天皇・昭憲皇太后ゆかりの品々を見学できます。境内の森は、100年後の自然林化を見据えて設計され、全国の青年団の勤労奉仕によって植えられたものだといわれています。静かに、敬意をもってお参りください。都心とは思えない森の参道と、ミュージアムでの展示を、ゆっくり楽しんでみましょう。続いては、歩いておよそ12分の竹下通りへ向かいましょう。";

  await setDaySpotOrder(day1.id, [
    { id: jingu.id, data: { memo: jinguMemo, stayDurationMin: 85 } },
    { id: takeshita.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 10, 37)) } },
    { id: omotesando.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 32)) } },
    { id: catstreet.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 12)) } },
    { id: center.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 27)) } },
    { id: sky.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 52)) } },
  ]);

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
