/**
 * チェックリスト #300 の修正記録(4巡目、企画運営の指摘2点)。
 * しおり「京橋と林原美術館、旭川のほとりで水辺と美術を楽しむ1泊2日」
 * (573dd48c-8210-408d-9f3e-422e03e507bb)
 *
 * 1. 説明文に、3巡目で外した「中之島」がまだ残っていたため、現在の中身(岡山神社・
 *    岡山城を含む)にあわせて書き直した。
 * 2. 事実確認(直接開いたURL、Wikipedia以外の出典で追加確認):
 *    ・岡山神社: 岡山県神社庁 https://www.okayama-jinjacho.or.jp/search/16434/ で、
 *      貞観年間(860年)創建・天正元年に宇喜多直家が遷座・祭神7柱(武安霊命=池田光政を
 *      含む)・昭和33年の本殿再建を確認。本文の記載と一致(修正不要)。
 *    ・岡山城: 公式サイト https://okayama-castle.jp/ で「令和の大改修」が2022年11月
 *      (令和4年)に完了したことを確認。築城期間の「8年」は、刀剣ワールド
 *      https://www.touken-world.jp/castle-building/okayama/ で「宇喜多秀家が8年を
 *      かけて築城」「完成は1597年(慶長2年)」を確認。本文の記載と一致(修正不要)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-300d-573dd48c.ts
 * (実行済み。説明文の内容を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "573dd48c-8210-408d-9f3e-422e03e507bb";
const NEW_DESCRIPTION =
  "旭川に架かる京橋や桜並木の遊歩道から岡山後楽園、岡山神社まで水辺の風景を楽しむ1日目。2日目は林原美術館や岡山城をはじめ、岡山県立美術館や岡山市立オリエント美術館など、岡山ゆかりの歴史と美術にふれる1泊2日です。";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.description !== NEW_DESCRIPTION) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
