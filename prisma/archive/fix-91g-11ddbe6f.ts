/**
 * #91 11ddbe6f 企画運営(23:00)の指摘。ニシハマビーチ・「阿嘉島 集落展望」の
 * メモに話し言葉・宣伝口調が残っていたため、ふつうの書き方に直す。あわせて
 * スポット名を、メモの内容どおり「天城展望台」に変更する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const NISHIHAMA_MEMO =
  "とまりんから高速船とビーチまでの徒歩で1時間ほど、阿嘉港に着き、阿嘉島のメインビーチ、ニシハマビーチに着きます。地元では「ニシバマ(北浜)」と呼ばれることも多く、方言の「ニシ」は「北」を意味するという説が伝えられています。約700mにわたって続く真っ白な砂浜と、座間味島の古座間味ビーチに匹敵するといわれる透明度で知られ、海中に広がる珊瑚礁を手軽にシュノーケリングで楽しめるビーチです。波打ち際からゆっくり泳ぎ出せば、色とりどりの魚たちがすぐそばまで近づいてくることもあります。ビーチのすぐそばには北浜(ニシバマ)展望台があり、高台から見下ろすビーチと海のグラデーションは、また違った角度からの景色です。泳ぎ疲れたら展望台まで足を延ばして、海を見下ろしながらひと息つくのもよいでしょう。泳げる場所や時期は現地の案内で確かめ、サンゴは踏んだり持ち帰ったりしないようにしましょう。この後は、レンタサイクルでおよそ1分、中岳展望台へ向かいましょう。島の中はレンタサイクルでめぐります。自転車は港の近くで借りられるので、借りられるか事前に確かめておきましょう。坂道や車に気をつけて走りましょう。";

const TENJO_MEMO =
  "ニシハマビーチから一夜明け、今日は阿嘉島の集落を見渡せる天城(あまぐすく)展望台へ向かいます。港の近くにある前浜ビーチを過ぎたあたりから急な坂道が続き、その先に展望台があります。坂は少しきついですが、上りきった先には見合うだけの眺めが広がります。展望台からは阿嘉大橋越しに渡嘉敷島や慶留間島を望むことができ、天気が良ければ遠く久場島まで見渡せることもあると伝えられています。阿嘉島は慶良間諸島国立公園の一部に含まれていて、素朴な集落の家並みと、その周囲を彩るケラマブルーの海とのコントラストが、このエリアいちばんの見どころとされています。急な坂を上る前に水分補給をしっかりしておくと安心です。眼下に広がる島の暮らしと海の景色を、時間をかけてゆっくり眺めましょう。この後は、レンタサイクルでおよそ8分、阿嘉大橋へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '11ddbe6f%'`);
  const itinId = rows[0].id;

  const nishihama = await findSpotInItinerary(itinId, { spotName: "ニシハマビーチ" });
  const tenjo = await findSpotInItinerary(itinId, { spotName: "阿嘉島 集落展望" });

  console.log("見つかりました。ニシハマ:", nishihama.id, " 天城:", tenjo.id);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: nishihama.id }, { memo: NISHIHAMA_MEMO });
  await updateSpotInItinerary(itinId, { spotId: tenjo.id }, { memo: TENJO_MEMO, name: "天城展望台" });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
