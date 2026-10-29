/**
 * #63(ハウステンボスと九十九島、長崎の絶景と異国情緒を楽しむ1泊2日、
 * 949c4f43)の初日を、仕様書 docs/specs/20261029-first-last-day-times.md
 * の決まり(初日は11時ごろ〜・3か所以上)に合わせて組み直す。
 * 最終日(2日目)は1泊2日のため今のまま変更しない。
 *
 * 【直す前】Day1は09:00開始・8か所(弓張岳展望台→海上自衛隊佐世保史料館→
 * 佐世保市博物館島瀬美術センター→四ヶ町アーケード→旧佐世保無線電信所→
 * 西海橋→パレスハウステンボス→ドムトールン)、16:54終了。
 *
 * 【直した内容】11時より前の3か所(弓張岳展望台・海上自衛隊佐世保史料館・
 * 佐世保市博物館島瀬美術センター)は、タイトル・説明文の見どころ(ハウス
 * テンボス・九十九島)に当たらず、2日目にも同種の展望スポット(展海峰・
 * 石岳展望台)があるため、仕様書の「合わなければ外す」に従って外した。
 * 残り5か所(四ヶ町アーケード・旧佐世保無線電信所・西海橋・パレス
 * ハウステンボス・ドムトールン)は、もとの並び順のまま、四ヶ町アーケードを
 * 11:30開始・昼食の1か所目とした(もとから「ここで昼食にしましょう」と
 * あった場所)。旧佐世保無線電信所・西海橋・パレスハウステンボスの本文は、
 * もとから直前のスポットとの移動関係が変わらない(四ヶ町アーケード→
 * 旧佐世保無線電信所→西海橋→パレスハウステンボス→ドムトールンの並びは
 * もとの並びの一部そのまま)ため、書き出し・結びとも無修正。四ヶ町
 * アーケードのみ、旅の入口の一言(入口=JR佐世保駅に11時ごろ着く前提、
 * 出発時刻や交通機関名は書かない)を追加。
 *
 * 【法務・企画運営の指摘で追加修正】①四ヶ町アーケードの書き出しに、入口
 * (JR佐世保駅)に着く時刻を明記(「11時ごろ着いたら」)。②旧佐世保無線
 * 電信所の既存の文「ほかに類を見ない独特の景観です」(言い切り)を
 * 「遠くからもよく目立ちます」に修正。
 *
 * 滞在はもとの値をほぼ維持し(四ヶ町60・旧無線電信所40・西海橋30・
 * パレス70は無変更)、ドムトールンだけ45→60分にした(決まりAに配慮し、
 * 水増しは最小限に留めた。もとの文のまま、塔からの眺めをゆっくり楽しむ
 * 想定)。
 *
 * 新しい時刻(Day1、11:30〜16:33、5か所): 四ヶ町アーケードで昼食11:30(60)
 * →旧佐世保無線電信所12:50(40)→西海橋13:35(30)→パレスハウステンボス
 * 14:15(70)→ドムトールン15:33(60)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-63-949c4f43.ts
 *   反映: npm run prod -- npx tsx prisma/fix-63-949c4f43.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "949c4f43-db10-464f-b160-a81867b082a3";
const DAY1_ID = "7c8640c3-e64d-42e9-b32a-1c98d5735be5";

const YUMIHARI_ID = "f87333c3-91af-4545-ab84-b31c69b86247"; // 弓張岳展望台(削除)
const SHIRYOKAN_ID = "2b390bf2-6ead-43c9-9c4f-4856618368d6"; // 海上自衛隊佐世保史料館(削除)
const HAKUBUTSUKAN_ID = "74b2b0c8-09e1-4440-8584-ef4a60e741ec"; // 佐世保市博物館島瀬美術センター(削除)
const YONKACHO_ID = "7e32b459-03e0-4c6a-95ae-6691bbc90ac1"; // 四ヶ町アーケード
const MUSEN_ID = "a2fc18e8-7645-4b51-b428-7bedc45e8449"; // 旧佐世保無線電信所
const SAIKAI_ID = "50b9eef1-e04c-48b3-bed4-89eadb7533fa"; // 西海橋
const PALACE_ID = "09c2cc4c-5a9c-46af-a4f5-47c7ebafc6ff"; // パレスハウステンボス
const DOM_ID = "a14cd127-4064-4639-8944-52719d46fa5a"; // ドムトールン

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const YONKACHO_MEMO =
  "JR佐世保駅に11時ごろ着いたら、駅前でレンタカーを借りて、車で数分の四ヶ町アーケードから旅を始めましょう。佐世保を代表する商店街で、アーケードの下に飲食店や土産物店が並びます。佐世保の名物・レモンステーキや佐世保バーガーの店も多いので、ここで昼食にしましょう。食事を終えたら、車で旧佐世保無線電信所へ向かいましょう。";

const MUSEN_MEMO_FIND = "巨大な鉄塔3基が並んで立つ姿は、ほかに類を見ない独特の景観です。";
const MUSEN_MEMO_REPLACE = "巨大な鉄塔3基が並んで立つ姿は、遠くからもよく目立ちます。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [yonkacho, musen, saikai, palace, dom] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: YONKACHO_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MUSEN_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SAIKAI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: PALACE_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: DOM_ID, dayId: DAY1_ID } }),
  ]);

  console.log("=== #63 Day1 直す前→直した後 ===\n");
  console.log("[削除] 弓張岳展望台 id=" + YUMIHARI_ID);
  console.log("[削除] 海上自衛隊佐世保史料館 id=" + SHIRYOKAN_ID);
  console.log("[削除] 佐世保市博物館島瀬美術センター id=" + HAKUBUTSUKAN_ID);
  console.log("");
  console.log(`[1] 四ヶ町アーケードで昼食 (id=${yonkacho.id})`);
  console.log("  旧visitTime:", yonkacho.visitTime, " 旧stay:", yonkacho.stayDurationMin);
  console.log("  新visitTime: 11:30  新stay: 60");
  console.log("  旧memo:", yonkacho.memo);
  console.log("  新memo:", YONKACHO_MEMO);
  console.log("");
  console.log(`[2] 旧佐世保無線電信所 (id=${musen.id})`);
  console.log("  旧visitTime:", musen.visitTime, " 新visitTime: 12:50 (stay 40、無変更)");
  console.log("  旧文の一文:", MUSEN_MEMO_FIND);
  console.log("  新文の一文:", MUSEN_MEMO_REPLACE, "(法務指摘: 「ほかに類を見ない」の言い切りを修正)");
  console.log("");
  console.log(`[3] 西海橋 (id=${saikai.id}) — 本文は無修正、時刻のみ`);
  console.log("  旧visitTime:", saikai.visitTime, " 新visitTime: 13:35 (stay 30、無変更)");
  console.log("");
  console.log(`[4] パレスハウステンボス (id=${palace.id}) — 本文は無修正、時刻のみ`);
  console.log("  旧visitTime:", palace.visitTime, " 新visitTime: 14:15 (stay 70、無変更)");
  console.log("");
  console.log(`[5] ドムトールン (id=${dom.id}) — 本文は無修正、時刻と滞在のみ`);
  console.log("  旧visitTime:", dom.visitTime, " 旧stay:", dom.stayDurationMin);
  console.log("  新visitTime: 15:33  新stay: 60 (もとの45から+15、決まりA配慮で最小限)");
  console.log("");
  console.log("Day1 新しい時刻: 11:30 四ヶ町アーケード(昼食)→12:50 旧佐世保無線電信所→13:35 西海橋→14:15 パレスハウステンボス→15:33 ドムトールン(〜16:33)");
  console.log("Day2(最終日)は1泊2日のため無変更。");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      {
        id: yonkacho.id,
        data: { visitTime: T(11, 30), stayDurationMin: 60, memo: YONKACHO_MEMO, transitLegs: { deleteMany: {} } },
      },
      { id: musen.id, data: { visitTime: T(12, 50), memo: musen.memo!.replace(MUSEN_MEMO_FIND, MUSEN_MEMO_REPLACE) } },
      { id: saikai.id, data: { visitTime: T(13, 35) } },
      { id: palace.id, data: { visitTime: T(14, 15) } },
      { id: dom.id, data: { visitTime: T(15, 33), stayDurationMin: 60 } },
    ],
    { remove: [YUMIHARI_ID, SHIRYOKAN_ID, HAKUBUTSUKAN_ID] }
  );

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
