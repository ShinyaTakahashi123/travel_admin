/**
 * #2の直し直し。企画運営の指摘(2026-10-13)に対応。
 * 1. 「蔵屋鳴沢（昼食）」は会社の施設名なのでスポット名・台帳名・メモから外し、
 *    一般的な名前にする(現在の営業は、2025年12月〜2026年4月のつるし飾り雛展示の
 *    開催情報(walkerplus.com)から、今も営業していると判断)
 * 2. 言い切りのぼかしを同じ文の中に入れる
 * 3. いちご狩りセンターの座標をGSIの番地の点(丸めなし)に直す
 * 4. 出典URL: 旧集成館はhttps://online.bunka.go.jp/db/heritages/detail/139834/1
 *    (文化庁の文化遺産オンライン。「反射炉を除き焼失」のち「反射炉は取壊され」と
 *    確認。「薩英戦争で破壊された」は不正確だったため、基礎部分が残る事実のみに直す)。
 *    萩はhttps://yamaguchi-tourism.jp/spot/detail_14025.html 等(本格的な鋳造の実用には
 *    至らなかった試験炉だったとする記述を複数の観光サイトで確認。断定できる一次
 *    資料は見つからなかったため「とされる」のぼかしを残す)
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ICHIGO_SPOT_ID = "5ad5cb34-3a0f-45f0-8a9e-e60b15782e20";
const HANSHARO_SPOT_ID = "a3ec4c91-70e9-492c-9757-00394b97c78f";
const EGAWATEI_SPOT_ID = "09e4dc85-b84f-465b-9cb0-eab50181d024";
const KURAYA_PLACE_ID = "2338052e-19ca-4617-a990-4003b21e36a4";

const HANSHARO_MEMO =
  "幕末の韮山代官・江川英龍が計画し、その子・英敏の代の安政4年(1857)に完成した、大砲を鋳造するための溶解炉です。日本国内には、ほかに萩(山口県。本格的な鋳造の実用には至らなかった試験炉だったとされる)、旧集成館(鹿児島県。安政4年完成の反射炉の基礎部分が残る)の反射炉跡が残りますが、韮山反射炉は、実際に大砲を鋳造した実用炉として唯一現存するものとされています。平成27年(2015)、「明治日本の産業革命遺産 製鉄・製鋼、造船、石炭産業」の構成資産の一つとして世界遺産に登録されました。隣接するガイダンスセンターでは、反射炉の仕組みや江川家の歴史をパネルや模型でわかりやすく紹介しています。";

const EGAWATEI_MEMO =
  "韮山反射炉を築いた韮山代官・江川家が、江戸時代を通じて代々暮らした屋敷です。36代当主・江川英龍(坦庵)は、韮山反射炉の建造や品川台場の築造のほか、日本で初めてパンを焼いたとされることでも知られる、幕末の多才な代官でした。主屋は昭和33年(1958)に、書院や蔵などは平成5年(1993)に、国の重要文化財に指定されています。公開の時間や休館日は季節によって変わるため、訪れる前に公式サイトで確かめましょう。";

const KURAYA_MEMO = "反射炉のそばに、売店や飲食店が集まる一画があります。ここで昼食をとりましょう。";

async function main() {
  const ichigo = await prisma.spot.findUnique({ where: { id: ICHIGO_SPOT_ID } });
  const kurayaSpot = await prisma.spot.findFirst({ where: { name: "蔵屋鳴沢（昼食）" } });
  const kurayaPlace = await prisma.placeMaster.findUnique({ where: { id: KURAYA_PLACE_ID } });
  if (!ichigo || !kurayaSpot || !kurayaPlace) throw new Error("想定と違います");

  console.log("[確認OK] 韮山反射炉・江川邸のメモのぼかしを同じ文に");
  console.log("[確認OK] いちごの森の座標をGSIの番地の点に直す");
  console.log("[確認OK] 昼食のスポット名・台帳名を一般的な名前に直す");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: HANSHARO_SPOT_ID }, data: { memo: HANSHARO_MEMO } });
  await prisma.spot.update({ where: { id: EGAWATEI_SPOT_ID }, data: { memo: EGAWATEI_MEMO } });
  await prisma.spot.update({ where: { id: ICHIGO_SPOT_ID }, data: { lat: 35.048199, lng: 138.91832 } });

  await prisma.spot.update({
    where: { id: kurayaSpot.id },
    data: { name: "韮山反射炉の周辺（昼食）", memo: KURAYA_MEMO },
  });
  await prisma.placeMaster.update({
    where: { id: KURAYA_PLACE_ID },
    data: { name: "韮山反射炉の周辺" },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
