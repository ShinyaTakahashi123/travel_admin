/**
 * お遍路 本3(#10)の2回目の直し(企画運営指摘、2026-10-14)。対象はすべてidで指定。
 * 1. 題の番号を4→3に(公開11本の通し番号。#9を飛ばすため)
 * 2. 室戸岬(昼食)・御厨人窟の座標を、度分秒換算の値からOSMの名前付きの地物
 *    (室戸岬: node 600400771 natural=cape、御厨人窟: node 11160085877
 *    natural=cave_entrance)に修正
 * 3. 室戸岬(昼食): 「お楽しみください」を削除、具体的な食事処は確認できな
 *    かったため「周辺の食事処で」という安全な表現のまま(すでに「ここで昼食を
 *    とりましょう」はある)
 * 4. 牧野植物園(昼食): 昼食の一文を追加(出典: 高知県の公式発表資料、
 *    レストラン「C.L.GARDEN」)
 * 5. 野良時計: 出典を確かめられなかった個人名・建立年・登録有形文化財の
 *    記載を削除
 * 6. むろと廃校水族館: 出典を確かめられなかった具体的な数字(廃校・開館の年、
 *    種類数、プールの大きさ)を削除
 * 7. 薬王寺: 「一段ごとに1円玉を置きながら」(お金の話)を削除
 *
 * 【メモ】伊尾木洞の「波の浸食でできた海食洞」は複数の資料(観光ガイド等)で
 * 確認でき、変更していない。企画運営の指摘にあった#22の「渓谷の水に浸食」
 * は誤りの可能性が高いと考えられるため、報告で伝える(#22はこのスクリプトの
 * 対象外)。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book3-round2.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book3-round2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const BOOK10_ID = "ba669bf2-10a6-4994-8360-a83c633e88e8";
const MISAKI_ID = "eb2a8995-d875-4074-88c7-7772c480c10c";
const OKUNO_ID = "3f6bcb62-d443-4e7c-b98c-01f1144de048";
const MAKINO_ID = "23262495-c19b-4014-94b9-f20fa3f71946";
const NORA_ID = "e809b94f-5a02-40a1-a349-98cf267eb41e";
const MUROTO_SUIZOKU_ID = "bdf5b949-816a-466a-930e-5612649c1266";
const YAKUOJI_ID = "55dbf255-7075-4ad7-8aaa-85d04a2288a0";

const OLD_TITLE = "【四国八十八か所 4】土佐・22番平等寺〜33番雪蹊寺";
const NEW_TITLE = "【四国八十八か所 3】土佐・22番平等寺〜33番雪蹊寺";

const MISAKI_MEMO_NEW =
  "太平洋に突き出た室戸岬は、地球の大地の動きがつくり出したダイナミックな海岸段丘や奇岩が広がる景勝地で、「室戸ユネスコ世界ジオパーク」の中心地の一つです。明治32年(1899)に初点灯した室戸岬灯台は、日本最大級のレンズを備え、光の届く距離・光の強さともに国内有数とされています。岬には、坂本龍馬とともに幕末に活躍した中岡慎太郎の像も建ち、太平洋を見つめています。長い遍路の道のりを歩んできた先人たちも目にした、雄大な海の眺めが広がります。遊歩道の岩場は滑りやすく、波が高い日もあるので、足もとと波に気をつけて歩きましょう。周辺の食事処で昼食をとりましょう。";

const MAKINO_MEMO_NEW =
  "「日本の植物分類学の父」と呼ばれる高知県出身の植物学者・牧野富太郎の業績を顕彰し、昭和33年(1958)に五台山の一角に開園しました。竹林寺と隣接し、駐車場を共有しています。約8ヘクタールの広大な敷地に、牧野博士にゆかりのある植物を中心に、3,000種を超える植物が四季を通じて栽培・展示されています。園内にはレストラン「C.L.GARDEN」があり(出典: 高知県の発表資料)、ここで昼食をとりましょう。";

const NORA_MEMO_NEW =
  "安芸市土居にある、明治時代に地元の地主が手作りで設置したと伝わる時計台です。今も個人の住居の敷地内にあるため、中には入らず、道から眺めましょう。";

const MUROTO_SUIZOKU_MEMO_NEW =
  "室戸市にある、廃校になった旧小学校の校舎を生かした水族館です。教室だったスペースや、屋外のプールをそのまま生かして、地元の海洋生物を飼育・展示しています。";

const YAKUOJI_MEMO_NEW =
  "神亀3年(726)、聖武天皇の勅願により行基が開いたと伝わる寺です。弘仁6年(815)、平城上皇の勅命を受けた弘法大師が、厄除けの薬師如来像を刻んで整えたことから、古くから厄除けの寺として知られています。文治4年(1188)の火災で本尊が自ら光を放って奥の院・玉厨子山へ避難し、のちに再建された際、光とともに戻った本尊が厨子に後ろ向きに納まったという「後ろ向き薬師」の言い伝えがあります。仁王門をくぐった先には、女厄坂(33段)・男厄坂(42段)・還暦厄坂(61段)と呼ばれる石段が続きます。石段の先には、瑜祇塔と呼ばれる昭和38年(1963)建立の塔があり、展望台からは日和佐の海を一望できます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: BOOK10_ID } });
  const misaki = await prisma.spot.findUnique({ where: { id: MISAKI_ID } });
  const okuno = await prisma.spot.findUnique({ where: { id: OKUNO_ID } });
  const makino = await prisma.spot.findUnique({ where: { id: MAKINO_ID } });
  const nora = await prisma.spot.findUnique({ where: { id: NORA_ID } });
  const murotoSuizoku = await prisma.spot.findUnique({ where: { id: MUROTO_SUIZOKU_ID } });
  const yakuoji = await prisma.spot.findUnique({ where: { id: YAKUOJI_ID } });
  if (!itin || !misaki || !okuno || !makino || !nora || !murotoSuizoku || !yakuoji) throw new Error("想定と違います");
  if (itin.title !== OLD_TITLE && itin.title !== NEW_TITLE) throw new Error("想定と違います(title)");

  console.log("[確認OK] 題: 4→3");
  console.log("[確認OK] 室戸岬・御厨人窟の座標をOSMの地物に修正");
  console.log("[確認OK] 室戸岬・牧野植物園・野良時計・むろと廃校水族館・薬王寺のメモを修正");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  if (itin.title !== NEW_TITLE) {
    await prisma.itinerary.update({ where: { id: BOOK10_ID }, data: { title: NEW_TITLE } });
  }

  if (misaki.placeMasterId) {
    await prisma.placeMaster.update({ where: { id: misaki.placeMasterId }, data: { lat: 33.2435799, lng: 134.1768342, positionSource: "osm" } });
  }
  await prisma.spot.update({ where: { id: MISAKI_ID }, data: { lat: 33.2435799, lng: 134.1768342, memo: MISAKI_MEMO_NEW } });

  if (okuno.placeMasterId) {
    await prisma.placeMaster.update({ where: { id: okuno.placeMasterId }, data: { lat: 33.2515633, lng: 134.1804812, positionSource: "osm" } });
  }
  await prisma.spot.update({ where: { id: OKUNO_ID }, data: { lat: 33.2515633, lng: 134.1804812 } });

  await prisma.spot.update({ where: { id: MAKINO_ID }, data: { memo: MAKINO_MEMO_NEW } });
  await prisma.spot.update({ where: { id: NORA_ID }, data: { memo: NORA_MEMO_NEW } });
  await prisma.spot.update({ where: { id: MUROTO_SUIZOKU_ID }, data: { memo: MUROTO_SUIZOKU_MEMO_NEW } });
  await prisma.spot.update({ where: { id: YAKUOJI_ID }, data: { memo: YAKUOJI_MEMO_NEW } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
