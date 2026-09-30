/**
 * #97 3993afce の直し(2回目)。fix-97 をコミットした直後、itinerary-audit.cjs で
 * 「竹生島」の座標を島そのものにしていたため、直前の長浜鉄道スクエアからの
 * 徒歩9分(実際は12.2km)・次の長浜城歴史博物館への徒歩11分(実際は11.7km)が
 * 不可能な速さと判定された。元箱根港(芦ノ湖遊覧船)など既存の公開中しおりの
 * 作り方にならい、クルーズ系のスポットは実際の乗り場(ここでは長浜港)の座標を
 * 使う決まりのため、座標を長浜港(35.3731339,136.2641139)に直す。あわせて
 * 長浜城歴史博物館への移動時間を実際の距離に合わせて8分に、長浜鉄道スクエアの
 * 「現存する日本最古の鉄道駅舎です」は言い切りの指摘を受けてヘッジ表現に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const TETSUDO_MEMO =
  "慶雲館から歩いておよそ3分、長浜鉄道スクエアに着きます。中心となる旧長浜駅舎は、明治15年(1882)に建てられた、現存する日本最古の鉄道駅舎とされています。鹿鳴館調の石灰コンクリート造りで、壁の厚さは50センチにもなります。イギリス人鉄道技師ホルサムらが設計し、施工は神戸の稲葉弥助が担当しました。明治36年(1903)に現在の長浜駅の位置へ新しい駅舎が完成するまで、20年にわたって日本の鉄道交通の要衝としての役目を果たしました。当時の駅舎や車両の展示を見ながら、鉄道黎明期の空気を感じてみてください。この後は、歩いておよそ9分、長浜港へ向かいましょう。";

const CHIKUBUSHIMA_MEMO =
  "長浜鉄道スクエアから歩いておよそ9分、長浜港に着きます。港で乗船の手続きをすませ、琵琶湖汽船のクルーズ船で竹生島へ渡ります。竹生島は、琵琶湖の北部に浮かぶ小さな島で、古くから「神の棲む島」として敬われてきました。宝厳寺は、神亀元年(724)、聖武天皇の命を受けた僧・行基が開いたと伝わる西国三十三所第三十番札所です。国宝に指定されている唐門は、豊国廟の建物を移したものと伝わります。隣り合う都久夫須麻神社は、かつて宝厳寺と一体となって祀られており、日本三弁天の一つに数えられています。龍神拝所から鳥居に向かって素焼きの皿を投げる「かわらけ投げ」でも知られています。船を降りてからの上陸時間はおよそ90分で、急な石段を上りながら、湖に浮かぶ島ならではの静けさを味わえます。この後は、船で長浜港へ戻り、長浜城歴史博物館へ向かいましょう。";

const CASTLE_MEMO =
  "長浜港から歩いておよそ8分、長浜城歴史博物館に着きます。天正元年(1573)、織田信長に命じられて浅井氏の旧領・長浜を治めることになった羽柴(豊臣)秀吉が、初めて自らの居城として築いたと伝わるのが長浜城です。江戸時代前期に廃城となり、建物や石垣の多くは彦根城や大通寺に移築されましたが、わずかな石垣と井戸だけが跡地に残されていました。現在の天守は、昭和58年(1983)、安土桃山時代の城郭を模して復元されたもので、2階・3階では湖北や長浜ゆかりの資料、秀吉と浅井長政・石田三成ら長浜と縁の深い人物たちの足跡が紹介されています。5階の展望台からは、琵琶湖と長浜の街並みを一望できます。この後は、歩いてすぐ、豊公園へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '3993afce%'`);
  const itinId = rows[0].id;

  const chikubu = await findSpotInItinerary(itinId, { spotName: "竹生島" });
  const tetsudo = await findSpotInItinerary(itinId, { spotName: "長浜鉄道スクエア" });
  const castle = await findSpotInItinerary(itinId, { spotName: "長浜城歴史博物館" });

  console.log("竹生島現在地:", chikubu.lat, chikubu.lng);
  console.log("長浜城 現在transit:", castle.transitDurationMin);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: chikubu.id }, {
    address: "滋賀県長浜市港町",
    lat: 35.3731339,
    lng: 136.2641139,
    memo: CHIKUBUSHIMA_MEMO,
    transitDurationMin: 12,
  });
  await updateSpotInItinerary(itinId, { spotId: tetsudo.id }, { memo: TETSUDO_MEMO });
  await updateSpotInItinerary(itinId, { spotId: castle.id }, { memo: CASTLE_MEMO, transitDurationMin: 8 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
