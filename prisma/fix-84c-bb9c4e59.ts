/**
 * #84 bb9c4e59（那須）企画運営の指摘6点(小さな直し)。
 * 1) 乃木神社: 「殉死」(自死にふれる書き方)を避け、配慮の一文をほかと統一。
 * 2) 那須ロープウェイ: 山頂の防寒の一文を追加。
 * 3) 那須平成の森: 開園日の日にちを削除、断定できる事実として「伝えられています」を外す。「お楽しみください」→「歩いてみてください」。
 * 4) 那須高原展望台: 「全国で100番目」の出典 https://www.tochigiji.or.jp/spot/s11654 （とちぎ旅ネット）で確認済み。数字はそのまま維持。
 * 5) 那須どうぶつ王国: 「話題の」を削除。
 * 6) 千本松牧場: 「搾りたての牛乳を使った」を削除し控えめな表現に。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ITIN = "bb9c4e59-3518-4a44-9e66-3544ddfc3b45";
const RESPECT_STD = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: 変更あり`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotName: name }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "乃木神社",
    "明治天皇の崩御を追って夫妻が殉死したのち、地元の人々の間で「乃木夫妻をまつる神社を」という声が高まり、創建に至ったと伝えられています。",
    "夫妻の没後、地元の人々の間で「乃木夫妻をまつる神社を」という声が高まり、創建に至ったと伝えられています。"
  );
  await replaceMemo(
    "乃木神社",
    "参拝の際は、敬意を持ってお参りしましょう。",
    RESPECT_STD
  );
  await replaceMemo(
    "那須ロープウェイ",
    "標高およそ1,700mの高原の空気を、旅の始まりに感じてみてください。",
    "山の上は天気が変わりやすく、夏でも肌寒いことがあるので、上着を持っていきましょう。標高およそ1,700mの高原の空気を、旅の始まりに感じてみてください。"
  );
  await replaceMemo(
    "那須平成の森",
    "御在位20年の節目に、御用邸用地の約半分にあたる約560ヘクタールが宮内庁から環境省へと移管され、2011年5月22日に開園したと伝えられています。",
    "御在位20年の節目に、御用邸用地の約半分にあたる約560ヘクタールが宮内庁から環境省へと移管され、2011年に開園しました。"
  );
  await replaceMemo(
    "那須平成の森",
    "自然の記憶と皇室の歴史が重なり合う、静かで特別な森をゆっくりとお楽しみください。",
    "自然の記憶と皇室の歴史が重なり合う、静かで特別な森をゆっくり歩いてみてください。"
  );
  await replaceMemo(
    "那須どうぶつ王国",
    "話題のマヌルネコや、希少種のスナネコ、ライチョウなどに間近で出会えるほか",
    "マヌルネコや、希少種のスナネコ、ライチョウなどに間近で出会えるほか"
  );
  await replaceMemo(
    "那須フラワーワールド",
    "季節の花々が織りなす那須高原ならではの景色を、心ゆくまでお楽しみください。",
    "季節の花々が織りなす那須高原ならではの景色を、ゆっくり歩いてみてください。"
  );
  await replaceMemo(
    "千本松牧場",
    "たとえば、動物とふれあったあとサイクリングで敷地を回り、搾りたての牛乳を使ったソフトクリームで一休みする、といった過ごし方ができます。",
    "たとえば、動物とふれあったあとサイクリングで敷地を回り、牧場のソフトクリームで一休みする、といった過ごし方ができます。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
