/**
 * #140 04fcc64bの直し(6回目、法務の指摘)。
 * ①雪国館の座標36.93897,138.80558が、way 290141515のNominatimの中心
 *   36.9389733,138.8055779を5けたに丸めた値だったため、丸めない値に
 *   修正。
 * ②雪国館の「昭和の初めごろの住まいを再現した展示や、…豪雪地ならでは
 *   の暮らしの知恵を伝える品々」が、eebd52dfの雪国館の「昭和の初めごろ
 *   の住まいを再現した展示…豪雪地の暮らしの知恵にもふれられます」と
 *   言い回しが近かったため、3階展示の農具・古銭という、eebd52dfが
 *   触れていない具体的な展示品に絞って書き直し。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const YUKIGUNIKAN_FROM =
  "岩原スキー場から車でおよそ9分、湯沢町歴史民俗資料館「雪国館」に着きます。昭和の初めごろの住まいを再現した展示や、雪に閉ざされる冬を生き抜くために使われてきた蓑や雪靴、除雪の道具など、豪雪地ならではの暮らしの知恵を伝える品々が並びます。スキー場で雪と遊んだあとに、この土地の人々が昔から雪とどう向き合ってきたかを知ることができます。休館日は公式サイトで確かめましょう。この後は、歩いておよそ7分、越後湯沢駅のまわりへ向かいましょう。";
const YUKIGUNIKAN_TO =
  "岩原スキー場から車でおよそ9分、湯沢町歴史民俗資料館「雪国館」に着きます。3階建ての館内には、むかし使われていた農具や、この地方で流通していた古銭なども展示されています。雪に囲まれたこの土地で、人々がどのように田畑を耕し、暮らしを営んできたかをうかがえる品々です。休館日は公式サイトで確かめましょう。この後は、歩いておよそ7分、越後湯沢駅のまわりへ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '04fcc64b%'`);
  const itinId = rows[0].id;
  const yukigunikan = await findSpotInItinerary(itinId, { spotName: "雪国館" });

  if (!yukigunikan.memo?.includes(YUKIGUNIKAN_FROM)) throw new Error("雪国館の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({
    where: { id: yukigunikan.id },
    data: { lat: 36.9389733, lng: 138.8055779, memo: yukigunikan.memo!.replace(YUKIGUNIKAN_FROM, YUKIGUNIKAN_TO) },
  });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
