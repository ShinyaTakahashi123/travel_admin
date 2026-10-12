/**
 * #51 24469e72（アクアマリンふくしま）ユーザー決定「全部直す」の対象。
 * Day1が16:28で、16:30〜17:00にわずかに届いていなかった。滞在を延ばさず(決まりA)、
 * ほるるのあとに、いわき湯本温泉のさはこの湯(実在、江戸末期の建築様式を再現した
 * 公衆浴場、ほるるから徒歩6分)を追加して16:30〜17:00に収める。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY1_ID = "bea01041-d011-4e20-93b3-0ed86c650b22";
const HORURU_ID = "f42bc90c-c80b-4f5a-b392-95209d66cb22";

const HORURU_MEMO_NEW =
  "塩屋埼灯台から車でおよそ22分、いわき市石炭・化石館「ほるる」に着きます。いわき市で発見された首長竜の化石「フタバサウルス・スズキイ(通称フタバスズキリュウ)」の全身復元骨格(レプリカ)が一番の見どころで、白亜紀後期の海を泳いでいた姿を間近に見ることができます。館内の模擬坑道では、この地に栄えた常磐炭田の採炭の歴史や、炭鉱で働いた人々の暮らしを学べます。毎月決まった曜日に休館日があるので、訪れる前に公式の案内で開館状況を確かめてください。この後は、歩いておよそ6分、いわき湯本温泉のさはこの湯へ向かいましょう。";

const SAHAKO_MEMO =
  "いわき市石炭・化石館「ほるる」から歩いておよそ6分、いわき湯本温泉のさはこの湯に着きます。江戸末期の建築様式を再現した純和風の建物で、「火の見櫓」を配置したいわき湯本温泉の新たなシンボルです。うたせ湯のある岩風呂と、木の香り漂う檜風呂があり、源泉かけ流しの湯につかることができます。いわき湯本温泉は、平安時代の延喜式神名帳にもその名が記された、歴史ある温泉地です。化石と炭鉱の歴史をたどったあとは、あたたかい湯につかって、今日の旅を締めくくってください。ほかの入浴客を撮影したり、施設の決まりに反したりしないようにしましょう。";

async function main() {
  const spots: SpotOrderItem[] = [
    { id: "6ec0a75d-47b4-4f91-9895-a4eef7d5dd56", data: {} },
    { id: "b1b4365f-96fa-4784-8904-8d3387643495", data: {} },
    { id: "b5e9b64d-5e99-4f19-b446-4706a26239d9", data: {} },
    { id: "e973ad09-8f4a-4362-b67d-3b6e0db33ff1", data: {} },
    { id: HORURU_ID, data: { memo: HORURU_MEMO_NEW } },
    {
      create: {
        name: "さはこの湯",
        address: "福島県いわき市常磐湯本町三函",
        lat: 37.010263,
        lng: 140.845756,
        memo: SAHAKO_MEMO,
        visitTime: t(16, 34),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
  ];

  console.log("最終スポット: さはこの湯 16:34-16:59");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY1_ID, spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
