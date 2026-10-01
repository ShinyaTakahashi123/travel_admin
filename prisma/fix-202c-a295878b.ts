/**
 * #202 a295878b の追いの直し（しおりえ(制作補助2)、2026-10-01 企画運営の指摘「#487 と同じ文を写すのは不可」）
 * 東尋坊・雄島・三国湊・旧岸名家の本文を、同じ出典の別の点・別の言い回しで書き直す（注意の定型文はそのまま）
 * 出典: 東尋坊 https://kanko-sakai.com/spot/k001/ （デイサイトの柱状節理・世界三大絶勝・四季の景色）／
 *   雄島 https://kanko-sakai.com/spot/k006/ （周囲2km・標高27m・「神の島」・クラウンシャイネス・蜂の巣のような柱状節理・島を1周する散策路）／
 *   三国湊 https://kanko-sakai.com/spot/k007/ （北前船の寄港地・格子戸の町家と豪商の商家・マチノクラ・カフェなど）／
 *   旧岸名家 https://kanko-sakai.com/spot/k007/ ・https://www.city.fukui-sakai.lg.jp/kankou/kanko-bunka/kanko/rekishi/kishinake.html （角地に建ち一際目立つ・かぐら建て・帳場・大八車が行き来した石畳の通路）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-202c-a295878b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "a295878b-e036-44bb-a0a9-a44e5e4a8c0b";
const COMMIT = process.argv.includes("--commit");
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const TOWN = "今も人が暮らす町並みです。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。";

const MEMOS: Record<string, [string, string]> = {
  東尋坊: ["日本海の荒波が打ち寄せる断崖が約1kmにわたって続く",
    "この旅は車でめぐります。JR福井駅の近くでレンタカーを借りて、車で約45分の東尋坊へ。国指定名勝の断崖で、絶壁に日本海の荒波が打ち寄せる眺めが続きます。崖をかたちづくるのはデイサイトという火山岩で、その柱状節理がこれほど広い範囲で見られる場所は世界でもわずかとされ、地質の面でも貴重です。初夏の青い空と海、秋の夕日、冬の荒々しい波と、季節ごとに違う姿を見せます。東尋坊観光遊覧船に乗れば、海の上から断崖を見上げることもできます。遊覧船は荒れた天気の日は運休することがあります。柵のない場所も多いので、崖のふちには近づきすぎず、足元に十分気をつけましょう。"],
  雄島: ["長さ224mの朱塗りの雄島橋を渡り",
    "東尋坊から車で約10分。東尋坊の沖に浮かぶ、周囲2km・標高27mの小さな島で、土地の人々から昔から「神の島」とあがめられてきました。朱塗りの橋で島へ渡り、石段を上った先に大湊神社がまつられています。本殿の前では、ヤブニッケイの枝葉がたがいに重なりすぎずに広がる「クラウンシャイネス」という姿が見られます。島の柱状節理は、東尋坊とは反対に、蜂の巣のように上から下へ向かって見えるのも見どころです。島をひと回りする散策路もあります。荒れた天気の日や夕方以降の散策は控えましょう。崖や石段では足元に気をつけましょう。" + RESPECT],
  三国湊: ["江戸時代から明治のはじめにかけて、北前船の交易で栄えた港町で",
    "水族館から車で約15分、三国湊へ。北前船の寄港地として栄えた港町で、格子戸の町家や豪商の面影を残す商家が並ぶ通りを歩くと、往時のにぎわいが感じられます。三國湊の海運と文学をテーマにしたミニ資料館「マチノクラ」では、町の歴史の資料やガイダンスの映像を見られます。町並みにはカフェなどもあるので、このあたりで昼食にしましょう。" + TOWN],
  旧岸名家: ["三国湊で材木商を営んだ岸名惣助が代々住んだ町家で",
    "町並みの中を歩いて約5分。代々材木商を営んだ岸名家の町家で、角地に建ち、通りでもひときわ目を引く外観です。切妻の主屋の前に平入りの表屋を付けた、三國独特の「かぐら建て」の建物で、店の帳場や、大八車が行き来した石畳の通路が残り、商いの暮らしぶりが伝わってきます。休館日は公式の案内で確かめましょう。"],
};

async function main() {
  const plan: { id: string; name: string; memo: string }[] = [];
  for (const [name, [mark, memo]] of Object.entries(MEMOS)) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
    if (!s.memo?.includes(mark)) throw new Error(`${name}: 本文が想定と違います`);
    plan.push({ id: s.id, name, memo });
    console.log(`\n${name}: ${memo}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plan) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: p.id }, { memo: p.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
