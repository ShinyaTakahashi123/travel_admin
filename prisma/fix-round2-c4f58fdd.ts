/**
 * 写真がなくなったしおりの写真探し ラウンド2。c4f58fdd(田沢湖)の2点の直し。
 *
 * 1. 写真: 「御座石神社」に付けていた写真(File:Lake_Tazawa_and_Kansa-gū_20210213.jpg)は、
 *    法務の指摘で、実際には漢槎宮(浮木神社・潟尻)という御座石神社(相内潟)とは別の神社だった
 *    (WebSearchで場所が異なることを確認済み)。このしおりには漢槎宮のスポットがないため、
 *    御座石神社そのものを写した写真に差し替える。
 *
 * 2. 本文: Day2「抱返り渓谷」の本文が、冒頭で乳頭温泉郷の宿の朝風呂・遊歩道散策の話をしてから
 *    抱返り渓谷へ移動する構成になっており、スポット名(抱返り渓谷)と冒頭部分の内容が合っていない
 *    (企画運営の指摘)。乳頭温泉郷側の朝の活動の記述を削り、抱返り渓谷の内容だけにする。
 *    座標・滞在時間・前後のつなぎはそのまま(抱返り渓谷の実在の座標で変更不要)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photofill-20261012-r2";
const FILE_TITLE = "御座石神社鳥居20220702-P1000532.jpg";

const OLD_MEMO =
  "乳頭温泉郷で迎える朝です。宿のお風呂でもうひと浴びしてから、ブナの原生林の中に整備された遊歩道を少し散策しましょう。入浴の際は、ほかの入浴客を写真に撮ったりせず、長湯をしすぎないよう気をつけ、こまめに水分をとりましょう。遊歩道ではクマが出ることもあるので、鈴を鳴らして歩き、決められた道から外れず、もし出会ったら騒がず静かにその場を離れましょう。散策のあとは宿を出発し、車でおよそ50分、抱返り渓谷に着きます。玉川沿いに広がる渓谷で、新緑や紅葉の時期には特に美しい景色が広がることから、「東北の耶馬渓」とも呼ばれます。遊歩道の途中にかかる神の岩橋を渡った先には、抱返り渓谷のシンボルとされる回顧の滝があります。岩場や吊り橋は足元が滑りやすいので、気をつけて歩きましょう。この後は、車でおよそ18分、角館の町なかへ向かいましょう。";
const NEW_MEMO =
  "乳頭温泉郷で迎える朝です。宿を出発し、車でおよそ50分、抱返り渓谷に着きます。玉川沿いに広がる渓谷で、新緑や紅葉の時期には特に美しい景色が広がることから、「東北の耶馬渓」とも呼ばれます。遊歩道の途中にかかる神の岩橋を渡った先には、抱返り渓谷のシンボルとされる回顧の滝があります。岩場や吊り橋は足元が滑りやすいので、気をつけて歩きましょう。遊歩道ではクマが出ることもあるので、鈴を鳴らして歩き、決められた道から外れず、もし出会ったら騒がず静かにその場を離れましょう。この後は、車でおよそ18分、角館の町なかへ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c4f58fdd%'`);
  const itinId = rows[0].id;
  const itin = await prisma.itinerary.findUnique({ where: { id: itinId }, select: { thumbnailUrl: true } });

  const gozaishi = await prisma.spot.findFirst({ where: { name: "御座石神社", day: { itineraryId: itinId } }, include: { photos: true } });
  if (!gozaishi) throw new Error("御座石神社が見つかりません");
  if (gozaishi.photos.length !== 1) throw new Error("御座石神社の既存写真が1枚ではありません: " + gozaishi.photos.length);
  const oldPhoto = gozaishi.photos[0];
  if (oldPhoto.caption !== "御座石神社(漢槎宮)") throw new Error("既存写真のキャプションが想定外です: " + oldPhoto.caption);
  console.log("写真 確認OK。差し替え元:", oldPhoto.id, oldPhoto.url, "| 現在の表紙と一致:", itin!.thumbnailUrl === oldPhoto.url);

  const kakaeri = await prisma.spot.findFirst({ where: { name: "抱返り渓谷", day: { itineraryId: itinId } } });
  if (!kakaeri) throw new Error("抱返り渓谷が見つかりません");
  if (kakaeri.memo !== OLD_MEMO) throw new Error("抱返り渓谷の本文が想定外です");
  console.log("本文 確認OK。抱返り渓谷 id:", kakaeri.id);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  const result = await uploadCommonsFile(FILE_TITLE, "御座石神社", BLOB_PREFIX);
  if (!result) throw new Error("画像の取得・ライセンス確認に失敗しました");
  console.log("取得:", result.url, result.credit);

  await prisma.photo.delete({ where: { id: oldPhoto.id } });
  const newPhoto = await prisma.photo.create({
    data: {
      spotId: gozaishi.id,
      url: result.url,
      caption: "御座石神社",
      sourceUrl: result.credit.sourceUrl ?? null,
      author: result.credit.author ?? null,
      license: result.credit.license ?? null,
      licenseUrl: result.credit.licenseUrl ?? null,
    },
  });

  if (itin!.thumbnailUrl === oldPhoto.url) {
    await prisma.itinerary.update({ where: { id: itinId }, data: { thumbnailUrl: newPhoto.url } });
    console.log("表紙も差し替えました");
  }

  await prisma.spot.update({ where: { id: kakaeri.id }, data: { memo: NEW_MEMO } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
