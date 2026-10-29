/**
 * 公開中のしおり2本の直し(法務2026-10-26指摘、docs/content/20261026-x-posts.md末尾)。
 *
 * 1. 函館 b6c6744a(函館山の夜景と異国情緒あふれる街並みを楽しむプラン):
 *    しおりの中に函館山を訪れる予定(時間つきのスポット)がないのに、題と説明文が
 *    「函館山の夜景」「世界三大夜景に数えられる」から始まっている。函館山は元町にあり、
 *    しおりは元町のあと港(金森赤レンガ倉庫)・湯の川温泉・大沼国定公園(車で離れた場所)
 *    へ向かうため、夜の函館山を時間の決まり(9時〜17時)の中に収めるのは難しい。
 *    実際の中身(元町の洋館・赤レンガ倉庫・大沼国定公園)に題・説明文を合わせる。
 *    あわせて、金森赤レンガ倉庫のメモの書き出し「函館山から港へ下りてくると」(実際の
 *    一つ前のスポットは旧函館区公会堂で、函館山には行っていない)と、最後のスポット
 *    「島巡りの路」の締めの文にあった、同じ函館山の夜景への言及(「日本三大夜景の
 *    一つ」も言い切り)も、題の直しに合わせて外す。
 *
 * 2. 鵜戸神宮 af30d135(鵜戸神宮、崖に埋め込まれた社殿を訪ねる定番日帰りプラン)の
 *    鵜戸神宮の座標(31.650278, 131.466667)は度分秒から換算した値(0.650278*60=39'01",
 *    0.466667*60=28'00"ちょうど)。OSM way 1312406391(amenity=place_of_worship,
 *    name="鵜戸神宮", addr:block_number=3232・addr:quarter=大字宮浦と、公式サイト
 *    https://www.udojingu.or.jp/ の住所「宮崎県日南市宮浦3232」が一致)の中心点
 *    31.649165, 131.466117に直す。GSI住所検索は「宮浦3232」の番地までは解決できず、
 *    大字宮浦の代表点(約2km離れた場所)しか返さなかったため、OSMの名前つきの地物を採用。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-hakodate-yakei-udo.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-hakodate-yakei-udo.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const HAKODATE_ID = "b6c6744a-856b-4406-b0ab-45acdf70fbaa";
const HAKODATE_OLD_TITLE = "函館山の夜景と異国情緒あふれる街並みを楽しむプラン";
const HAKODATE_NEW_TITLE = "異国情緒あふれる元町と金森赤レンガ倉庫、大沼国定公園をめぐる函館日帰りプラン";
const HAKODATE_OLD_DESC =
  "世界三大夜景に数えられる函館山の夜景から、旧函館区公会堂の洋風建築、赤レンガが並ぶ金森赤レンガ倉庫、湯の川温泉、雄大な大沼国定公園まで。函館の異国情緒あふれる街並みと自然を1日で満喫するプランです。";
const HAKODATE_NEW_DESC =
  "函館市旧イギリス領事館や旧函館区公会堂といった元町の洋風建築から、赤レンガが並ぶ金森赤レンガ倉庫、湯の川温泉、雄大な大沼国定公園まで。函館の異国情緒あふれる街並みと自然を1日で満喫するプランです。";

const AKARENGA_ID = "e539b04e-1d8f-43c9-936c-af3433f9b8ca";
const AKARENGA_OLD_MEMO =
  "函館山から港へ下りてくると見えてくるのが、赤レンガ造りの倉庫群です。もとは1869年、渡辺熊四郎という人物が函館で開いた洋物店で、1887年（明治20年）から倉庫業も手がけるようになったのがルーツと伝えられています。1907年（明治40年）の函館大火で6棟を焼失する被害を受けましたが、燃えにくい構造でただちに再建に着手し、1909年（明治42年）に今の姿が完成しました。今はショップやレストランが軒を連ね、ライトアップされた夜の散策にもおすすめのスポットです。";
const AKARENGA_NEW_MEMO =
  "元町の坂道から港へ下りてくると見えてくるのが、赤レンガ造りの倉庫群です。もとは1869年、渡辺熊四郎という人物が函館で開いた洋物店で、1887年（明治20年）から倉庫業も手がけるようになったのがルーツと伝えられています。1907年（明治40年）の函館大火で6棟を焼失する被害を受けましたが、燃えにくい構造でただちに再建に着手し、1909年（明治42年）に今の姿が完成しました。今はショップやレストランが軒を連ね、ライトアップされた夜の散策にもおすすめのスポットです。";

const SHIMAMEGURI_ID = "d9d45cb8-f957-49e3-b428-6011e85ccabb";
const SHIMAMEGURI_OLD_MEMO =
  "大沼の湖畔から、木橋で結ばれた7つの島をめぐる遊歩道「島巡りの路」を歩いてみましょう。一周およそ50分のコースで、橋のたもとごとに、駒ヶ岳を背景にした湖面の景色が移り変わっていきます。中でも太鼓橋の「浮島橋」からの眺めは、大沼を代表する撮影スポットの一つです。北海道らしいスケールの大きな自然を、湖の間近でゆっくり味わってください。函館市街に戻ったら、夜はロープウェイで函館山へ登り、「100万ドルの夜景」ともいわれる、長崎・神戸と並ぶ日本三大夜景の一つを楽しんで、旅を締めくくりましょう。";
const SHIMAMEGURI_NEW_MEMO =
  "大沼の湖畔から、木橋で結ばれた7つの島をめぐる遊歩道「島巡りの路」を歩いてみましょう。一周およそ50分のコースで、橋のたもとごとに、駒ヶ岳を背景にした湖面の景色が移り変わっていきます。中でも太鼓橋の「浮島橋」からの眺めは、大沼を代表する撮影スポットの一つです。北海道らしいスケールの大きな自然を、湖の間近でゆっくり味わいましょう。見学を終えたら、帰路につきましょう。";

const UDO_ITINERARY_ID = "af30d135-b7e7-4a4e-b6f1-dec242afcdb9";
const UDO_SPOT_ID = "efaee18b-0a25-4c66-9d35-9c5df6ce7a9e";
const UDO_OLD_LAT = 31.650278;
const UDO_OLD_LNG = 131.466667;
const UDO_NEW_LAT = 31.649165;
const UDO_NEW_LNG = 131.466117;

async function main() {
  console.log("=== 確認 ===");

  const hakodate = await prisma.itinerary.findUnique({ where: { id: HAKODATE_ID } });
  if (!hakodate) throw new Error("函館のしおりが見つかりません");
  if (hakodate.status !== "published") throw new Error("函館のしおりが公開中ではありません: " + hakodate.status);
  if (hakodate.title !== HAKODATE_OLD_TITLE) throw new Error("函館の題が想定と違います: " + hakodate.title);
  if ((hakodate.description ?? "") !== HAKODATE_OLD_DESC) {
    throw new Error("函館の説明文が想定と違います: " + hakodate.description);
  }
  console.log("[OK] 函館(題・説明文)", HAKODATE_ID);

  const akarenga = await prisma.spot.findUnique({
    where: { id: AKARENGA_ID },
    include: { day: { include: { itinerary: { select: { id: true } } } } },
  });
  if (!akarenga) throw new Error("金森赤レンガ倉庫が見つかりません");
  if (akarenga.day.itinerary.id !== HAKODATE_ID) throw new Error("金森赤レンガ倉庫が対象外のしおりです");
  if ((akarenga.memo ?? "") !== AKARENGA_OLD_MEMO) throw new Error("金森赤レンガ倉庫の本文が想定と違います: " + akarenga.memo);
  console.log("[OK] 金森赤レンガ倉庫", AKARENGA_ID);

  const shimameguri = await prisma.spot.findUnique({
    where: { id: SHIMAMEGURI_ID },
    include: { day: { include: { itinerary: { select: { id: true } } } } },
  });
  if (!shimameguri) throw new Error("島巡りの路が見つかりません");
  if (shimameguri.day.itinerary.id !== HAKODATE_ID) throw new Error("島巡りの路が対象外のしおりです");
  if ((shimameguri.memo ?? "") !== SHIMAMEGURI_OLD_MEMO) {
    throw new Error("島巡りの路の本文が想定と違います: " + shimameguri.memo);
  }
  console.log("[OK] 島巡りの路", SHIMAMEGURI_ID);

  const udoSpot = await prisma.spot.findUnique({
    where: { id: UDO_SPOT_ID },
    include: { day: { include: { itinerary: { select: { id: true, status: true } } } } },
  });
  if (!udoSpot) throw new Error("鵜戸神宮が見つかりません");
  if (udoSpot.day.itinerary.id !== UDO_ITINERARY_ID) throw new Error("鵜戸神宮が対象外のしおりです");
  if (udoSpot.day.itinerary.status !== "published") throw new Error("鵜戸神宮のしおりが公開中ではありません");
  if (udoSpot.name !== "鵜戸神宮") throw new Error("スポット名が想定と違います: " + udoSpot.name);
  const udoLat = udoSpot.lat?.toNumber() ?? 0;
  const udoLng = udoSpot.lng?.toNumber() ?? 0;
  if (Math.abs(udoLat - UDO_OLD_LAT) > 1e-6 || Math.abs(udoLng - UDO_OLD_LNG) > 1e-6) {
    throw new Error(`鵜戸神宮の座標が想定と違います: lat=${udoSpot.lat} lng=${udoSpot.lng}`);
  }
  console.log("[OK] 鵜戸神宮(座標)", UDO_SPOT_ID);

  console.log("\n--- 函館の新しい題・説明文 ---");
  console.log("題:", HAKODATE_NEW_TITLE);
  console.log("文:", HAKODATE_NEW_DESC);
  console.log("\n--- 鵜戸神宮の新しい座標 ---");
  console.log(`${UDO_OLD_LAT},${UDO_OLD_LNG} → ${UDO_NEW_LAT},${UDO_NEW_LNG}`);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  console.log("\n=== 書き込み ===");
  await prisma.itinerary.update({
    where: { id: HAKODATE_ID },
    data: { title: HAKODATE_NEW_TITLE, description: HAKODATE_NEW_DESC },
  });
  console.log("  函館(題・説明文): COMMITTED");

  await prisma.spot.update({ where: { id: AKARENGA_ID }, data: { memo: AKARENGA_NEW_MEMO } });
  console.log("  金森赤レンガ倉庫: COMMITTED");

  await prisma.spot.update({ where: { id: SHIMAMEGURI_ID }, data: { memo: SHIMAMEGURI_NEW_MEMO } });
  console.log("  島巡りの路: COMMITTED");

  await prisma.spot.update({ where: { id: UDO_SPOT_ID }, data: { lat: UDO_NEW_LAT, lng: UDO_NEW_LNG } });
  console.log("  鵜戸神宮(座標): COMMITTED");
}
main().finally(() => prisma.$disconnect());
