/**
 * 3155fabf（尾道・広島・宮島）言葉2点・座標1点の直し（法務指摘、2026-10-30）
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const FLOWER = "e054e64a-9779-40ae-9165-64044a9e841d";
const HIROSHIMAJO = "418e5b4b-04a5-4584-914c-f7b5a4376729";
const ITSUKUSHIMA = "d6d055ce-06c1-4f24-9dc9-37be299dea43";

const FLOWER_MEMO_OLD =
  "向島を縦断し、因島大橋を渡って、自転車で約1時間。平成2年（1990年）、「海と島の博覧会」の会場の跡地に開園した植物園です。四季の花が楽しめるほか、バナナやマンゴーなどが育つ温室もあり、丘の上からは瀬戸内海と周りの島々を見渡せます。橋の上は風が強いことがあるので気をつけましょう。休園日は公式の案内で確かめてください。";
const FLOWER_MEMO_NEW =
  "向島を縦断し、因島大橋を渡って、自転車で約1時間。平成2年（1990年）、「海と島の博覧会」の会場の跡地に開園した植物園です。四季の花が楽しめるほか、バナナやマンゴーなどが育つ温室もあり、丘の上からは瀬戸内海と周りの島々を見渡せます。橋の上は風が強いことがあるので気をつけましょう。休園日は公式の案内で確かめましょう。";

const HIROSHIMAJO_MEMO_OLD =
  "本通から北へ歩いて約15分。天正17年（1589年）、毛利輝元によって築かれた城で、「鯉城」の愛称でも親しまれています。原爆で倒壊した天守は昭和33年（1958年）に鉄筋コンクリートで再建されました。今は天守の中には入れず、外観を見学します（最新の情報は公式の案内で確かめましょう）。堀や石垣、二の丸に復元された表御門・平櫓などをめぐりましょう。石垣の近くでは足元に気をつけてください。";
const HIROSHIMAJO_MEMO_NEW =
  "本通から北へ歩いて約15分。天正17年（1589年）、毛利輝元によって築かれた城で、「鯉城」の愛称でも親しまれています。原爆で倒壊した天守は昭和33年（1958年）に鉄筋コンクリートで再建されました。今は天守の中には入れず、外観を見学します（最新の情報は公式の案内で確かめましょう）。堀や石垣、二の丸に復元された表御門・平櫓などをめぐりましょう。石垣の近くでは足元に気をつけましょう。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { id: { in: [FLOWER, HIROSHIMAJO, ITSUKUSHIMA] } } });
  const byId = new Map(spots.map((s) => [s.id, s]));
  if (byId.get(FLOWER)!.memo !== FLOWER_MEMO_OLD) throw new Error("因島フラワーセンター: memo現在値が期待と不一致");
  if (byId.get(HIROSHIMAJO)!.memo !== HIROSHIMAJO_MEMO_OLD) throw new Error("広島城: memo現在値が期待と不一致");
  const itsukushima = byId.get(ITSUKUSHIMA)!;
  if (itsukushima.lat?.toString() !== "34.2958503" && itsukushima.lat?.toString() !== "34.29585") {
    throw new Error(`厳島神社: 座標現在値が期待と不一致。現在値=${itsukushima.lat},${itsukushima.lng}`);
  }
  console.log("前提の確認OK。\n");
  console.log("[因島フラワーセンター] 確かめてください。→確かめましょう。");
  console.log("[広島城] 気をつけてください。→気をつけましょう。");
  console.log(`[厳島神社] ${itsukushima.lat},${itsukushima.lng} → 34.295837,132.319993（本殿way 1306168431のNominatim値、約2mのずれを直す）`);

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: FLOWER }, data: { memo: FLOWER_MEMO_NEW } }),
    prisma.spot.update({ where: { id: HIROSHIMAJO }, data: { memo: HIROSHIMAJO_MEMO_NEW } }),
    prisma.spot.update({ where: { id: ITSUKUSHIMA }, data: { lat: 34.295837, lng: 132.319993 } }),
  ]);
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
