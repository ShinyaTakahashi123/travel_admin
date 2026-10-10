/**
 * #16 c946b414 鳥取砂丘、日本最大級の砂丘を歩く定番日帰りプラン。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM =
  "皆様、鳥取砂丘へようこそ。目の前に広がりますのは、東西およそ16キロ、南北2.4キロ前後にわたって続く、雄大な海岸砂丘でございます。はるか昔、千代川が運んだ砂が、波や沿岸流、そして冬の厳しい北西の季節風によって少しずつ集められ、長い年月をかけてこの姿になったと考えられております。その規模の雄大さが評価され、1955年には国の天然記念物にも指定されました。あちらに見えます起伏の大きな丘は「馬の背」と呼ばれ、下から見上げますと高さ約47メートルにも及ぶ、迫力ある砂の壁となって皆様をお迎えいたします。また、風が吹くたびに刻まれる「風紋」も、この砂丘ならではの見どころのひとつでございます。素足では砂の熱さに驚かれますので、靴をお履きになり、日差しの中、水分補給もお忘れなく、どうぞ雄大な自然の造形を心ゆくまでお楽しみください。";
const TO =
  "旅の始まりは鳥取砂丘です。目の前に広がるのは、東西およそ16キロ、南北2.4キロ前後にわたって続く、雄大な海岸砂丘です。はるか昔、千代川が運んだ砂が、波や沿岸流、そして冬の厳しい北西の季節風によって少しずつ集められ、長い年月をかけてこの姿になったと考えられています。その規模の雄大さが評価され、1955年には国の天然記念物にも指定されました。起伏の大きな丘は「馬の背」と呼ばれ、下から見上げると高さ約47メートルにも及ぶ、迫力ある砂の壁がそびえます。また、風が吹くたびに刻まれる「風紋」も、この砂丘ならではの見どころです。素足では砂の熱さに驚くことがあるので、靴を履き、日差しの中、水分補給も忘れずに、雄大な自然の造形をゆっくり楽しんでください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c946b414%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "鳥取砂丘" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
