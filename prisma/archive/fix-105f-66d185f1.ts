/**
 * #105 66d185f1(朝霧高原)の直し。企画運営(2026-10-01 12:57、画面名は
 * 一時的に01-study-96)の指摘3点。
 * 1. 田貫湖「毎年4月20日と8月20日前後」(日付)→「年に2回」に
 * 2. 富士ミルクランド「乳製品を販売するショップ」(料金に近い商業の
 *    言葉ではなく、販売の言葉そのもの)→「乳製品のショップ」に
 * 3. 最後の「バスまたは車でお戻りください」(案内口調、車の旅と不整合)
 *    →レンタカーを返す形に。車の旅の前提が1日目の最初になかったため、
 *    白糸の滝の書き出しにも新富士駅でのレンタカーの一文を追加して
 *    そろえた。1日目最後の宿の一言(陣馬の滝「今夜はこの近くの宿に
 *    泊まります」)はすでにあるため変更なし。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const SHIRAITO_FROM = "旅の1日目は、白糸の滝から始まります。";
const SHIRAITO_TO = "新富士駅でレンタカーを借り、車でおよそ30分、旅の1日目は白糸の滝から始まります。";

const TANUKIKO_FROM = "湖畔からは富士山を望むことができ、毎年4月20日と8月20日前後の1週間ほどは、山頂から太陽が昇る「ダイヤモンド富士」が見られることでも知られています。";
const TANUKIKO_TO = "湖畔からは富士山を望むことができ、年に2回、山頂から太陽が昇る「ダイヤモンド富士」が見られることでも知られています。";

const MILKLAND_FROM = "敷地内には乳製品を販売するショップやレストラン、花畑なども点在しています。";
const MILKLAND_TO = "敷地内には乳製品のショップやレストラン、花畑なども点在しています。";

const HITOANA_FROM = "朝霧高原の牧場とふもとっぱら、富士山を望む高原1泊2日の旅は、これで終わりです。帰りは、新富士駅・富士宮駅方面へ、バスまたは車でお戻りください。";
const HITOANA_TO = "朝霧高原の牧場とふもとっぱら、富士山を望む高原1泊2日の旅は、これで終わりです。新富士駅まで車でおよそ20分戻り、レンタカーを返却してから、新幹線などで帰路につきましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '66d185f1%'`);
  const itinId = rows[0].id;

  const shiraito = await findSpotInItinerary(itinId, { spotName: "白糸の滝" });
  const tanukiko = await findSpotInItinerary(itinId, { spotName: "田貫湖" });
  const milkland = await findSpotInItinerary(itinId, { spotName: "富士ミルクランド" });
  const hitoana = await findSpotInItinerary(itinId, { spotName: "人穴富士講遺跡" });

  if (!shiraito.memo!.includes(SHIRAITO_FROM)) throw new Error("白糸の滝の文言が想定外です");
  if (!tanukiko.memo!.includes(TANUKIKO_FROM)) throw new Error("田貫湖の文言が想定外です");
  if (!milkland.memo!.includes(MILKLAND_FROM)) throw new Error("富士ミルクランドの文言が想定外です");
  if (!hitoana.memo!.includes(HITOANA_FROM)) throw new Error("人穴富士講遺跡の文言が想定外です");
  console.log("確認OK: 4件");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: shiraito.id }, { memo: shiraito.memo!.replace(SHIRAITO_FROM, SHIRAITO_TO) });
  await updateSpotInItinerary(itinId, { spotId: tanukiko.id }, { memo: tanukiko.memo!.replace(TANUKIKO_FROM, TANUKIKO_TO) });
  await updateSpotInItinerary(itinId, { spotId: milkland.id }, { memo: milkland.memo!.replace(MILKLAND_FROM, MILKLAND_TO) });
  await updateSpotInItinerary(itinId, { spotId: hitoana.id }, { memo: hitoana.memo!.replace(HITOANA_FROM, HITOANA_TO) });
  console.log("COMMITTED: 4件");
}
main().finally(() => prisma.$disconnect());
