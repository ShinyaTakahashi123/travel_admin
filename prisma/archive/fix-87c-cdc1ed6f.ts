/**
 * #87 cdc1ed6f 企画運営の指摘(2026-09-30 19:48)。「行き先が足りない」は
 * 例外にしないとのことで、徳島藩の歴史の主旨のまま実在スポットを追加。
 * 興源寺(実在、蜂須賀家墓所=国指定史跡、GSIの住所検索で番地まで確認
 * [下助任町二丁目45番地]、配慮の一文あり)、瑞巌寺(実在、蜂須賀至鎮が
 * 弟の菩提のため1614年に再興、池泉回遊式庭園、切支丹灯籠、OSM way
 * 319083890、配慮の一文あり)を追加。徳島県立博物館は、興源寺・瑞巌寺
 * だけで16:30〜17:00の窓に届いたため今回は見送り。移動はOSM歩行者
 * ルーティング実測。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const BARA_FROM = "この後は、歩いておよそ10分、ひょうたん島クルーズの乗り場、新町川水際公園へ向かいましょう。";
const BARA_TO = "この後は、歩いておよそ17分、興源寺へ向かいましょう。";

const KOGENJI_MEMO =
  "バラ園・数寄屋橋から歩いておよそ17分、助任川を渡った先にある興源寺に着きます。徳島藩祖・蜂須賀家政から13代藩主まで、歴代藩主の墓が営まれている蜂須賀家の菩提寺で、境内の墓所は「徳島藩主蜂須賀家墓所」として国の史跡に指定されています。整然と並ぶ歴代藩主の墓石が、260年余り続いた蜂須賀家の歴史の重みを伝えています。静かに、敬意をもってお参りください。この後は、歩いておよそ29分、ひょうたん島クルーズの乗り場、新町川水際公園へ向かいましょう。";

const CRUISE_FROM = "バラ園・数寄屋橋から歩いておよそ10分、新町川水際公園に着きます。";
const CRUISE_TO = "興源寺から歩いておよそ29分、新町川水際公園に着きます。";
const CRUISE_END_FROM = "徳島城跡から鷲の門、博物館、庭園とめぐった蜂須賀家の城下町をたどる旅は、ここで終了です。お疲れさまでした。お帰りは、徳島駅方面へ徒歩またはバスでどうぞ。";
const CRUISE_END_TO = "この後は、歩いておよそ9分、瑞巌寺へ向かいましょう。";

const ZUIGANJI_MEMO =
  "新町川水際公園から歩いておよそ9分、瑞巌寺に着きます。慶長19年(1614)、徳島藩初代藩主・蜂須賀至鎮が、弟・義英の菩提を弔うために一鶚禅師を開山として再興したと伝わる、臨済宗妙心寺派の寺院です。山麓の斜面を巧みに生かした境内には、江戸時代初期に築かれた池泉回遊式の庭園が広がり、阿波の名水の一つに数えられる湧き水が池を潤しています。境内にはキリスト教が禁じられていた時代、地蔵菩薩に見せかけてマリア像を刻んだと伝わる「切支丹灯籠」も残されており、あわせて見学できます。庭園の拝観料は公式サイトで確かめてから訪れましょう。静かに、敬意をもってお参りください。徳島城跡から鷲の門、博物館、庭園、興源寺の蜂須賀家墓所とめぐった、蜂須賀家の城下町をたどる旅は、ここで終了です。お疲れさまでした。お帰りは、徳島駅方面へバスでどうぞ。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cdc1ed6f%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId } });

  const { findSpotInItinerary } = await import("./lib/spot-lookup");
  const castle = await findSpotInItinerary(itinId, { spotName: "徳島城跡（徳島中央公園）" });
  const washinomon = await findSpotInItinerary(itinId, { spotName: "鷲の門" });
  const hakubutsukan = await findSpotInItinerary(itinId, { spotName: "徳島城博物館" });
  const teien = await findSpotInItinerary(itinId, { spotName: "旧徳島城表御殿庭園" });
  const bara = await findSpotInItinerary(itinId, { spotName: "バラ園・数寄屋橋" });
  const cruise = await findSpotInItinerary(itinId, { spotName: "ひょうたん島クルーズ" });

  if (!bara.memo!.includes(BARA_FROM)) throw new Error("一致しません(バラ園)");
  const baraNewMemo = bara.memo!.split(BARA_FROM).join(BARA_TO);

  if (!cruise.memo!.includes(CRUISE_FROM)) throw new Error("一致しません(クルーズ-1)");
  if (!cruise.memo!.includes(CRUISE_END_FROM)) throw new Error("一致しません(クルーズ-2)");
  const cruiseNewMemo = cruise.memo!.split(CRUISE_FROM).join(CRUISE_TO).split(CRUISE_END_FROM).join(CRUISE_END_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: castle.id, data: {} },
    { id: washinomon.id, data: {} },
    { id: hakubutsukan.id, data: {} },
    { id: teien.id, data: {} },
    { id: bara.id, data: { memo: baraNewMemo } },
    {
      create: {
        name: "興源寺",
        address: "徳島県徳島市下助任町二丁目45",
        lat: 34.082489,
        lng: 134.555603,
        memo: KOGENJI_MEMO,
        visitTime: t(14, 13),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 17,
        transitLine: null,
      },
    },
    { id: cruise.id, data: { memo: cruiseNewMemo, visitTime: t(15, 12), transitMode: "walk", transitDurationMin: 29 } },
    {
      create: {
        name: "瑞巌寺",
        address: "徳島県徳島市東山手町(西山手町)",
        lat: 34.0679378,
        lng: 134.5443932,
        memo: ZUIGANJI_MEMO,
        visitTime: t(16, 6),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 9,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = { [cruise.id]: 45 };
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
    if (!vt) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
