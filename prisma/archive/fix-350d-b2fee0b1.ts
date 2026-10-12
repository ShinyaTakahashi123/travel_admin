/**
 * #350の続き。企画運営12:59の指摘2点に対応。
 * 1) 秋田まるごと市場60分(水増し)を25分に戻し、空いた時間は実在の
 *    旧金子家住宅(赤れんが郷土館のすぐそば)を新規に追加して埋めた。
 * 2) 題名「ねぶり流し体験」に合う実際の体験(竿燈演技体験、通年実施、
 *    予約不要)を伝承館の本文に追加。
 *
 * 座標はNominatimで確認(2026-10-01)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-350d-b2fee0b1.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "878b6c6c-7d71-4151-a303-edb9ce56d8bd";
const DENSHOKAN_ID = "65523682-1bc5-4218-b924-a0114505b76d";
const SENSHU_ID = "ca8d63be-6d4a-4a16-8dd5-224708d6d4c4";
const BIJUTSUKAN_ID = "319da2bd-6f86-45d4-872f-c6ed0aef39d7";
const AKARENGA_ID = "10bd2f24-bc87-4d8b-9ac5-d960424f92e8";
const ICHIBA_ID = "1aaa04e6-7a3b-4cac-a8b8-514653cd0ba3";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const already = await prisma.spot.findFirst({ where: { name: "旧金子家住宅", dayId: DAY1_ID } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const denshokan = await prisma.spot.findFirstOrThrow({ where: { id: DENSHOKAN_ID } });
  const senshu = await prisma.spot.findFirstOrThrow({ where: { id: SENSHU_ID } });
  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { id: BIJUTSUKAN_ID } });
  const akarenga = await prisma.spot.findFirstOrThrow({ where: { id: AKARENGA_ID } });
  const ichiba = await prisma.spot.findFirstOrThrow({ where: { id: ICHIBA_ID } });

  const denshokanOld =
    "館内には実際にまつりで使われる、稲穂に見立てた提灯が連なる本物の竿燈が展示されており、間近でその迫力を体感できます。見学を終えたら、歩いておよそ15分の千秋公園へ向かいましょう。";
  const denshokanNext =
    "館内には実際にまつりで使われる、稲穂に見立てた提灯が連なる本物の竿燈が展示されており、間近でその迫力を体感できます。実物の竿燈を手に持って、平手や額、肩、腰に乗せる「竿燈演技体験」も通年受け付けており、予約なしで気軽に挑戦できます。見学を終えたら、歩いておよそ15分の千秋公園へ向かいましょう。";
  if (!denshokan.memo?.includes(denshokanOld)) throw new Error("denshokan anchor not found");

  const akarengaOld = "見学を終えたら、歩いておよそ24分の秋田まるごと市場へ向かいましょう。";
  const akarengaNext = "見学を終えたら、歩いておよそ5分の旧金子家住宅へ向かいましょう。";
  if (!akarenga.memo?.includes(akarengaOld)) throw new Error("akarenga anchor not found");

  const ichibaOld = "赤れんが郷土館からは、歩いておよそ24分です。";
  const ichibaNext = "旧金子家住宅からは、歩いておよそ28分です。";
  if (!ichiba.memo?.includes(ichibaOld)) throw new Error("ichiba anchor not found");

  await setDaySpotOrder(DAY1_ID, [
    { id: denshokan.id, data: { memo: denshokan.memo.replace(denshokanOld, denshokanNext) } },
    { id: senshu.id, data: {} },
    { id: bijutsukan.id, data: {} },
    { id: akarenga.id, data: { memo: akarenga.memo.replace(akarengaOld, akarengaNext) } },
    {
      create: {
        name: "旧金子家住宅",
        address: "秋田市大町1-3-31",
        lat: 39.7202325,
        lng: 140.1169844,
        visitTime: t(15, 26),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 5,
        memo:
          "秋田市立赤れんが郷土館からは、歩いておよそ5分です。旧金子家住宅は、江戸時代後期に質屋や古着屋を営み、明治時代初期からは呉服・太物の卸商を営んだ金子家の住宅です。明治19年(1886)の秋田大火で焼失した住居を、翌年に再建したものが現在の建物で、商家としての造りを今に伝えています。母屋の奥には、書院造りの座敷や、庭園を望む部屋もあり、秋田の商人の暮らしぶりをうかがうことができます。落ち着いた雰囲気の町家建築を、ゆっくりと見学しましょう。見学を終えたら、歩いておよそ28分の秋田まるごと市場へ向かいましょう。",
      },
    },
    { id: ichiba.id, data: { visitTime: t(16, 34), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 28, memo: ichiba.memo.replace(ichibaOld, ichibaNext) } },
  ]);

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
