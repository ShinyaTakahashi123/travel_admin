/**
 * #22(55e932b6)の滞在の水増し解消(企画運営指摘、2026-10-13)。伊尾木洞(99分)を
 * 45〜60分に短縮し、空いた時間に安芸市の実在の行き先「野良時計」を追加する。
 * 野良時計は、明治時代半ば(明治20年頃)に地主・畠中源馬が自力で時計を製造し
 * 建てたと伝わる時計台(出典: tabi-mag.jp/ko0101/)。座標はOSMの名前付き地物
 * (node 5099519321、tourism=attraction、33.5157497,133.9117008)。
 * 伊尾木洞70→50分、新しいleg(伊尾木洞→野良時計)は実距離の約6分、
 * 野良時計の滞在43分で16:30終了(9:30〜16:30は変わらず)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY_ID = "389c5e96-7cd0-41e9-91a9-7c7e4965749c";
const IOKIDO_ID = "e580b545-6cf1-4c27-8c39-156d681aa0c6";
const ITIN_ID = "55e932b6-c5c2-4057-b36b-afcab176ad68";

const OLD_DESC =
  "幕末の志士・中岡慎太郎の生涯を伝える資料館から、フランス・モネ財団に名前の使用を認められた庭園「モネの庭マルモッタン」、水切瓦の残る奈半利の町並みをめぐります。道の駅田野駅屋に立ち寄り、国指定天然記念物のシダ群落が広がる伊尾木洞まで足をのばす、北川村・奈半利町・田野町・安芸市の歴史と自然をめぐる日帰りプランです。";
const NEW_DESC =
  "幕末の志士・中岡慎太郎の生涯を伝える資料館から、フランス・モネ財団に名前の使用を認められた庭園「モネの庭マルモッタン」、水切瓦の残る奈半利の町並みをめぐります。道の駅田野駅屋に立ち寄り、国指定天然記念物のシダ群落が広がる伊尾木洞や、手作りの時計台「野良時計」が時を刻む安芸市の町並みまで足をのばす、北川村・奈半利町・田野町・安芸市の歴史と自然をめぐる日帰りプランです。";

const NORAZOKEI_NAME = "野良時計";
const NORAZOKEI_LAT = 33.5157497;
const NORAZOKEI_LNG = 133.9117008;
const NORAZOKEI_MEMO =
  "明治時代半ば(明治20年頃)、地主の畠中源馬が自力で時計を製造し、建てたと伝わる時計台です。今も安芸市のシンボルとして親しまれています。すぐそばには、藩政期の武士が暮らした武家屋敷群「土居廓中」も広がっています。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || itin.description !== OLD_DESC) throw new Error("説明文が想定と違います");

  const iokido = await prisma.spot.findUnique({ where: { id: IOKIDO_ID } });
  if (!iokido) throw new Error("想定と違います");

  console.log("[確認OK] 説明文を書きかえ(野良時計を追加)");
  console.log("[確認OK] 伊尾木洞の滞在:", iokido.stayDurationMin, "→ 50分");
  console.log("[確認OK] 野良時計を追加: orderNo6、座標", NORAZOKEI_LAT, NORAZOKEI_LNG);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESC } });
  await prisma.spot.update({ where: { id: IOKIDO_ID }, data: { stayDurationMin: 50 } });

  const place = await prisma.placeMaster.create({
    data: { name: NORAZOKEI_NAME, lat: NORAZOKEI_LAT, lng: NORAZOKEI_LNG, positionSource: "osm", source: "ai_collected" },
  });
  const newSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID,
      placeMasterId: place.id,
      orderNo: 6,
      name: NORAZOKEI_NAME,
      lat: NORAZOKEI_LAT,
      lng: NORAZOKEI_LNG,
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 47)),
      memo: NORAZOKEI_MEMO,
      stayDurationMin: 43,
    },
  });
  await prisma.spotTransitLeg.create({
    data: { spotId: newSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 6 },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
