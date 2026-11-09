/**
 * #22 沖縄2泊3日(2678aee0)、法務指摘の4回目(2026-10-30 14:20)、点・文の小さな直し3点
 * - 壺屋やちむん通り: 26.21303,127.69162 → OSMの「壺屋やちむん通り」way104798533の
 *   Nominatim値26.212911,127.691807に。中城城跡からのlegは29.498分+駐車5分=34分で変更なし
 * - 中城城跡「石段や城壁の上では足元に気をつけてください」→「…気をつけましょう」
 * - 沖縄美ら海水族館「世界最大の魚・ジンベエザメ」→「世界最大の魚とされるジンベエザメ」
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const TSUBOYA = "7aceb87a-0d55-409f-8919-a18fde524eee";
const NAKAGUSUKU = "ee29a36e-4721-4caf-a198-b95c90fdb4d8";
const CHURAUMI = "8a33c9e3-253d-4c3e-a2d0-28c1da4ac00a";

const NAKAGUSUKU_MEMO_OLD =
  "美浜から車で約20分。14世紀の中ごろに築かれ始めた城で、1440年、王の命によって護佐丸が、1日目に訪ねた座喜味グスクから移り、三の郭と北の郭を増やしました。六つの郭が連なる城で、自然の岩や地形を生かした美しい曲線の城壁と、石積みの技が見どころです。昭和47年（1972年）に国の史跡となり、2000年に世界遺産「琉球王国のグスク及び関連遺産群」に登録されました。城跡には護佐丸の墓もあります。墓のまわりでは、静かに過ごしましょう。石段や城壁の上では足元に気をつけてください。";
const NAKAGUSUKU_MEMO_NEW =
  "美浜から車で約20分。14世紀の中ごろに築かれ始めた城で、1440年、王の命によって護佐丸が、1日目に訪ねた座喜味グスクから移り、三の郭と北の郭を増やしました。六つの郭が連なる城で、自然の岩や地形を生かした美しい曲線の城壁と、石積みの技が見どころです。昭和47年（1972年）に国の史跡となり、2000年に世界遺産「琉球王国のグスク及び関連遺産群」に登録されました。城跡には護佐丸の墓もあります。墓のまわりでは、静かに過ごしましょう。石段や城壁の上では足元に気をつけましょう。";

const CHURAUMI_MEMO_OLD =
  "2日目は、恩納村から北へ車で約1時間の本部町へ。海洋博公園の中にある沖縄美ら海水族館は、2002年11月に開館しました。「沖縄の海との出会い」をテーマに、南西諸島や黒潮の海に生きる生き物を紹介しています。大きな水槽「黒潮の海」では、世界最大の魚・ジンベエザメや、世界で初めて繁殖に成功したとされるナンヨウマンタを見られます。";
const CHURAUMI_MEMO_NEW =
  "2日目は、恩納村から北へ車で約1時間の本部町へ。海洋博公園の中にある沖縄美ら海水族館は、2002年11月に開館しました。「沖縄の海との出会い」をテーマに、南西諸島や黒潮の海に生きる生き物を紹介しています。大きな水槽「黒潮の海」では、世界最大の魚とされるジンベエザメや、世界で初めて繁殖に成功したとされるナンヨウマンタを見られます。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { id: { in: [TSUBOYA, NAKAGUSUKU, CHURAUMI] } } });
  const byId = new Map(spots.map((s) => [s.id, s]));

  if (Number(byId.get(TSUBOYA)!.lat) !== 26.21303 || Number(byId.get(TSUBOYA)!.lng) !== 127.69162) {
    throw new Error("壺屋やちむん通り: 座標の現在値が期待と不一致");
  }
  if (byId.get(NAKAGUSUKU)!.memo !== NAKAGUSUKU_MEMO_OLD) throw new Error("中城城跡: memo現在値が期待と不一致");
  if (byId.get(CHURAUMI)!.memo !== CHURAUMI_MEMO_OLD) throw new Error("沖縄美ら海水族館: memo現在値が期待と不一致");

  console.log("前提の確認OK。");
  console.log("壺屋やちむん通り: 26.21303,127.69162 → 26.212911,127.691807(Nominatim値)。中城城跡からのlegは34分のまま変更なし");
  console.log("中城城跡「足元に気をつけてください」→「気をつけましょう」");
  console.log("沖縄美ら海水族館「世界最大の魚・ジンベエザメ」→「世界最大の魚とされるジンベエザメ」");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: TSUBOYA }, data: { lat: 26.212911, lng: 127.691807 } });
    await tx.spot.update({ where: { id: NAKAGUSUKU }, data: { memo: NAKAGUSUKU_MEMO_NEW } });
    await tx.spot.update({ where: { id: CHURAUMI }, data: { memo: CHURAUMI_MEMO_NEW } });
  });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
