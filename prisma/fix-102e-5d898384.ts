/**
 * #102 5d898384 の直し(5回目)。法務(2026-10-01 10:46)の指摘:
 * ① 鶴岡八幡宮「実朝暗殺の逸話」「3代将軍実朝が暗殺された際、公暁がその陰に
 *    隠れていた」は死に方・事件の描写を避け、「実朝の最期にまつわる言い伝え
 *    で知られる」に(法務の提案文言)
 * ② 小町通り「鎌倉屈指のにぎわいを見せます」→「鎌倉屈指ともいわれる
 *    にぎわいを見せます」(言い切りを避ける)
 * ③ 高徳院「鎌倉に残る国宝の仏像としては唯一の存在です」→「唯一とされます」
 * ④ 高徳院「別途拝観料を納めれば胎内に入ることができます」→料金の言葉を
 *    削除、「胎内に入ることもできます」
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const TSURUGAOKA_FROM = "実朝暗殺の逸話とともに語られてきたのが、かつて境内にあった大銀杏です。3代将軍実朝が暗殺された際、公暁がその陰に隠れていたとの言い伝えにちなみ『隠れ銀杏』とも呼ばれ、樹齢1000年ともいわれる大木でしたが、2010年3月の強い風にあおられて根元から倒れてしまいました。";
const TSURUGAOKA_TO = "実朝の最期にまつわる言い伝えで知られるのが、かつて境内にあった大銀杏です。『隠れ銀杏』とも呼ばれ、樹齢1000年ともいわれる大木でしたが、2010年3月の強い風にあおられて根元から倒れてしまいました。";

const KOMACHI_FROM = "鎌倉屈指のにぎわいを見せます。";
const KOMACHI_TO = "鎌倉屈指ともいわれるにぎわいを見せます。";

const KOTOKUIN_FROM1 = "鎌倉に残る国宝の仏像としては唯一の存在です。";
const KOTOKUIN_TO1 = "鎌倉に残る国宝の仏像としては唯一とされます。";

const KOTOKUIN_FROM2 = "像の内部は空洞になっており、別途拝観料を納めれば胎内に入ることができます。";
const KOTOKUIN_TO2 = "像の内部は空洞になっており、胎内に入ることもできます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5d898384%'`);
  const itinId = rows[0].id;

  const tsurugaoka = await findSpotInItinerary(itinId, { spotName: "鶴岡八幡宮" });
  const komachi = await findSpotInItinerary(itinId, { spotName: "小町通り" });
  const kotokuin = await findSpotInItinerary(itinId, { spotName: "高徳院（鎌倉大仏）" });

  if (!tsurugaoka.memo!.includes(TSURUGAOKA_FROM)) throw new Error("鶴岡八幡宮の文言が想定外です");
  if (!komachi.memo!.includes(KOMACHI_FROM)) throw new Error("小町通りの文言が想定外です");
  if (!kotokuin.memo!.includes(KOTOKUIN_FROM1)) throw new Error("高徳院の文言①が想定外です");
  if (!kotokuin.memo!.includes(KOTOKUIN_FROM2)) throw new Error("高徳院の文言②が想定外です");
  console.log("確認OK: 4件");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: tsurugaoka.id }, { memo: tsurugaoka.memo!.replace(TSURUGAOKA_FROM, TSURUGAOKA_TO) });
  await updateSpotInItinerary(itinId, { spotId: komachi.id }, { memo: komachi.memo!.replace(KOMACHI_FROM, KOMACHI_TO) });
  const kotokuinMemo = kotokuin.memo!.replace(KOTOKUIN_FROM1, KOTOKUIN_TO1).replace(KOTOKUIN_FROM2, KOTOKUIN_TO2);
  await updateSpotInItinerary(itinId, { spotId: kotokuin.id }, { memo: kotokuinMemo });
  console.log("COMMITTED: 4件");
}
main().finally(() => prisma.$disconnect());
