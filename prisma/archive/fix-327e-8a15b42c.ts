/**
 * #327の続き。企画運営2026-10-01 03:04の4点 + 法務03:04の1点。
 *
 * 企画運営:
 * 1) 材木岩公園82分・遠刈田温泉120分は、ほかで縮めた分をこちらに
 *    回しただけの水増しだった。材木岩公園は70分に戻し、遠刈田温泉は
 *    昼食を含めて65分にした(決まりA: 縮めた分を別の滞在に回さない)。
 * 2) 白石市商家資料館の「白石うーめん やまぶき亭」は店名のため、
 *    一般的な言い方に直した。
 * 3) 2日目の昼食: 神の湯(共同浴場)の40分に昼食を入れるのは無理が
 *    あったため、昼食は実際に食事ができる遠刈田温泉の枠(到着後すぐ)に
 *    移した。神の湯は昼食なしで50分(共同浴場・足湯・観光案内所)に。
 * 4) みやぎ蔵王キツネ村: 冬は閉村が16:00のため、16:30近くまで居る
 *    形は成り立たない。注意書きではなく、キツネ村を1日目の中ほど
 *    (白石市商家資料館のあと)に前倒しし、14:08には村を出る並びに
 *    変更した(冬でも余裕を持って閉村前に出られる)。これにより、
 *    冬季の注意書きは不要になったため削除した。
 *
 * 法務: 白石市商家資料館「奥州白石温麺協同組合が営む『白石うーめん
 * やまぶき亭』があり」→組合名・店名を出さない言い方に修正(企画運営の
 * 指摘と同じ箇所)。
 *
 * 空いた時間は、水増しではなく、神の湯(50分、共同浴場・足湯・観光
 * 案内所をゆっくり見て回る)・刈田嶺神社(35分、境内をしっかり見る)・
 * みやぎ蔵王こけし館(70分、絵付け体験の乾燥待ちの間に他の展示も見る、
 * #326のとんぼ玉体験と同様の考え方)・湯神社(33分)の、いずれも実在
 * する内容の範囲でやや厚めに配分して埋めた。七日原高原(蔵王ハート
 * ランドと同じ場所)は冬季休業のため使わなかった。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-327e-8a15b42c.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "8a15b42c-8c4a-44cc-8aa1-97e4c32bd761";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });

  const zaimokuiwa = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "材木岩公園" } });
  const shiroishijo = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "白石城" } });
  const shokakan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "白石市商家資料館" } });
  const bukeyashiki = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "片倉家中武家屋敷(旧小関家)" } });
  const sumaru = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "壽丸屋敷" } });
  const kessanji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "傑山寺" } });
  const kitsune = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "みやぎ蔵王キツネ村" } });

  const shokakanMemo =
    "白石城からは歩いておよそ8分です。到着したら、まずこのあたりで昼食をとりましょう。白石市商家資料館は、明治時代の豪商の屋敷を改装した資料館です。館内には、江戸時代から続く白石の郷土麺「白石温麺(うーめん)」を味わえる食事処があります。油を使わずに作られる短い麺は、あっさりとした喉ごしが特徴で、かつて胃を患った父のために息子が考案したという言い伝えも残っています。資料館では、白石の商家の暮らしぶりを伝える展示もあわせて見学できます。続いては、車でおよそ20分のみやぎ蔵王キツネ村へ向かいましょう。";

  const kitsuneMemo =
    "白石市商家資料館からは車でおよそ20分です。白石蔵王駅から車で20分ほどの山あいに広がるみやぎ蔵王キツネ村では、キタキツネやギンギツネ、めずらしいプラチナギツネなど、6種類のキツネが飼育されています。多くは林の中に放し飼いにされ、すぐそばまでキツネが近づいてくる距離感で観察できるのが人気の理由です。かつて映画『子ぎつねヘレン』にこの村のキツネが出演したことをきっかけに知られるようになり、近年はふわふわとした愛らしい姿がSNSでも話題を呼び、国内外から多くの人が訪れています。キツネは野生の性質を残しているので、施設の決まりに従い、むやみに手を出したり、決められた場所以外でえさをあげたりしないようにしましょう。キツネたちとの時間を満喫しましょう。続いては、車でおよそ20分の片倉家中武家屋敷(旧小関家)へ向かいましょう。";

  const bukeyashikiMemo = (bukeyashiki.memo ?? "")
    .replace("白石市商家資料館からは歩いておよそ10分です。", "みやぎ蔵王キツネ村からは車でおよそ20分です。")
    .replace("続いては、車でおよそ10分の壽丸屋敷へ向かいましょう。", "続いては、歩いておよそ10分の壽丸屋敷へ向かいましょう。");

  await setDaySpotOrder(day1.id, [
    { id: zaimokuiwa.id, data: { stayDurationMin: 70 } },
    { id: shiroishijo.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 10, 30)) } },
    { id: shokakan.id, data: { memo: shokakanMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 38)) } },
    { id: kitsune.id, data: { memo: kitsuneMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 48)), transitMode: "car", transitDurationMin: 20 } },
    { id: bukeyashiki.id, data: { memo: bukeyashikiMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 28)), transitMode: "car", transitDurationMin: 20 } },
    { id: sumaru.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 8)), transitMode: "walk", transitDurationMin: 10 } },
    { id: kessanji.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 58)), stayDurationMin: 32 } },
  ]);

  const rakunou = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "蔵王酪農センター" } });
  const toogatta = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "遠刈田温泉" } });
  const kaminoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "神の湯" } });
  const kattamine = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "刈田嶺神社(里宮)" } });
  const kokeshikan = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "みやぎ蔵王こけし館" } });
  const aone = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "青根温泉" } });
  const yujinja = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "湯神社" } });

  const toogattaMemo =
    "蔵王酪農センターからは車でおよそ10分です。到着したら、まずこのあたりで昼食をとりましょう。遠刈田温泉は、開湯からおよそ400年の歴史を持つ温泉地です。平安時代の末、金山で富を築いた金売吉次という商人がこの地で霊泉を見つけたという言い伝えが残っていますが、実際に温泉が開かれたのは江戸時代の初め頃と考えられています。遠刈田は、鳴子・土湯と並ぶ日本三大こけし産地の一つともいわれ、素朴な表情の「遠刈田こけし」は、湯治に訪れた人々へのお土産として発展してきたのだそうです。温泉街には昔ながらの共同浴場や、こけし工人の工房が点在しており、ろくろを挽く音に耳を傾けながら、のんびりと散策を楽しめます。温泉街の風情を味わってみましょう。続いては、車でおよそ10分の神の湯へ向かいましょう。";

  const kaminoyuMemo =
    "遠刈田温泉からは車でおよそ10分です。神の湯は、平成18年(2006)、老朽化のため廃止された遠刈田福祉センターに代わって整備された、遠刈田温泉の顔ともいえる共同浴場です。昭和初期のこの温泉街には「上の湯」「中の湯」「滝の湯」という3つの共同浴場があり、神の湯という名は、そのひとつ「上の湯」と同じ響きにちなんでつけられたといわれています。観光案内所や足湯も併設されており、旅の合間の休憩にも利用されています。足湯に腰かけて、温泉街の空気をゆっくり感じてみましょう。続いては、歩いてすぐの刈田嶺神社(里宮)へ向かいましょう。";

  await setDaySpotOrder(day2.id, [
    { id: rakunou.id, data: {} },
    { id: toogatta.id, data: { memo: toogattaMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 10, 30)), stayDurationMin: 65 } },
    { id: kaminoyu.id, data: { memo: kaminoyuMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 45)), stayDurationMin: 50 } },
    { id: kattamine.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 37)), stayDurationMin: 35 } },
    { id: kokeshikan.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 20)), stayDurationMin: 70 } },
    { id: aone.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 42)), stayDurationMin: 70 } },
    { id: yujinja.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 57)), stayDurationMin: 33 } },
  ]);

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
