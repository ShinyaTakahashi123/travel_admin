/**
 * #74(竹林と紫陽花、鎌倉の名庭と自然をゆったり巡る1泊2日、4b95c57d)の
 * 初日を、docs/content/itinerary-rules.md(10/29仕様)に合わせて組み直す。
 *
 * 【移動時間を道のりで測り直した(企画運営の指摘)】すべての区間をOSRM
 * (foot、distance÷75m/分の「ふつうの歩く速さ」。rawのdurationは速すぎて
 * 使わない)で測り直したところ、もとの値と大きくずれている区間が3つ
 * あった: 浄妙寺→瑞泉寺(8分→28分)、荏柄天神社→鶴岡八幡宮(9分→18分)、
 * 円覚寺→英勝寺(18分→34分、Day2)。ほかの区間も、多くが1〜3分ずれて
 * いたため、全区間を測り直した値に統一した。
 *
 * 【Day1(初日、11時ごろ〜・3か所以上・16:30〜17:00）】
 * 直す前は09:30開始・7か所。7か所とも鎌倉の由緒ある寺社で、説明文に
 * ある報国寺も含め1つも外さず、開始を11:10に遅らせ、移動時間を測り
 * 直した分も含めて滞在をバランスよく短くした(もとから長めだった
 * 浄妙寺110分・瑞泉寺75分を主に短くした)。1か所目に入口の一文
 * (JR鎌倉駅に10時50分ごろ着→バスで約20分)を追加。
 *
 * 新しい時刻(Day1、11:10〜16:55、7か所): 報国寺11:10(40)→
 * 杉本寺11:57(30)→浄妙寺12:35(60、昼食)→瑞泉寺14:03(42)→
 * 鎌倉宮14:56(20)→荏柄天神社15:22(20)→鶴岡八幡宮16:00(55)
 *
 * 【Day2(最終日)】09:30開始・7か所で、1泊2日の決まり(16:30-17:00・
 * 4か所以上)に合う。移動時間を測り直した結果、滞在をそのままにすると
 * 終了が16:37→16:58に延びてしまうため、企画運営の指示で「終わりが今より
 * 遅くならない」形にそろえた(#144・#145と同じ扱い)。円覚寺(90→70分)を
 * 中心に、英勝寺(35→34分)もあわせて21分短くし、もとの終了時刻16:37に
 * 収めた(延ばしてはいない)。
 *
 * 新しい時刻(Day2、09:30〜16:37、7か所): 明月院09:30(70)→
 * 東慶寺10:50(55)→北鎌倉駅のまわり(昼食)11:49(65)→円覚寺12:57(70)→
 * 英勝寺14:41(34)→寿福寺15:17(35)→海蔵寺16:02(35)
 *
 * 【言葉づかい】Day1・Day2とも確認したが、もとから「お参りしましょう」
 * の形で、「〜てみてください」「おすすめ」などは無かった(東慶寺の
 * 「歩いてみましょう」は「てみてください」ではないため対象外)。鶴岡
 * 八幡宮(1日目の最後)の宿の一文だけ、決まりの「この夜は、〇〇の宿に
 * 泊まりましょう。」の形に直した。書き出しの分数は、測り直した移動
 * 時間にあわせてすべて直した。
 *
 * 【座標】全14か所と、北鎌倉の昼食の点(駅の点)を、Nominatimの名前の
 * 点と比べ、すべて0mで一致することを確認した(dms-check.cjsも0件)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-74-4b95c57d.ts
 *   反映: npm run prod -- npx tsx prisma/fix-74-4b95c57d.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "badac21c-fd67-45da-98d3-cff2ec258992";
const DAY2_ID = "66dbae38-0451-4b6b-87ff-9dc1068d1a1f";

const HOKOKUJI_ID = "126b4d3f-62e8-42c1-9fb0-c63954b2ff57"; // 報国寺
const SUGIMOTODERA_ID = "22c3f62c-f760-4f18-a60b-fb78916beefd"; // 杉本寺
const JOMYOJI_ID = "e28909e0-da8d-4c3f-af89-7505430a049e"; // 浄妙寺
const ZUISENJI_ID = "2502de02-9469-4dff-8a46-e5f3dee87cd2"; // 瑞泉寺
const KAMAKURAGU_ID = "5ad7835b-175e-46ed-a4be-3019ef7543c9"; // 鎌倉宮
const EGARA_ID = "9db58e58-8cde-4f50-8209-41200382e176"; // 荏柄天神社
const TSURUGAOKA_ID = "8b535b93-e34c-4305-bc9a-bd688dfadc80"; // 鶴岡八幡宮

const MEIGETSUIN_ID = "aae33bd7-0ef5-4690-b0d4-ea4d27dbc704"; // 明月院
const TOKEIJI_ID = "2d5dfe10-20b2-438c-b820-bcaea00fd8f8"; // 東慶寺
const KITAKAMAKURA_LUNCH_ID = "7dd24dad-dcf4-460d-b7f4-26eaa7fdb55f"; // 北鎌倉駅のまわりで昼食
const ENGAKUJI_ID = "dd43b2c9-9e29-462f-81ab-1d179c4d63d5"; // 円覚寺
const EISHOJI_ID = "b76e031e-ef2c-4d5b-8c83-797bfc38282d"; // 英勝寺
const JUFUKUJI_ID = "b54a8a75-8bbc-4fb4-8f9d-bbe2ff16416a"; // 寿福寺
const KAIZOJI_ID = "c75ce7b8-0864-4a26-a463-618ab2e74ca3"; // 海蔵寺

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const HOKOKUJI_FIND = "JR鎌倉駅からバスで約20分、山あいの静かな一角にあるのが報国寺です。";
const HOKOKUJI_REPLACE = "JR鎌倉駅に10時50分ごろ着いたら、バスで約20分の報国寺へ。山あいの静かな一角にあります。";

const SUGIMOTODERA_FIND = "報国寺から歩いて向かうのは杉本寺です。";
const SUGIMOTODERA_REPLACE = "報国寺から歩いておよそ7分、杉本寺に向かいます。";

const JOMYOJI_FIND = "杉本寺から歩いて5分ほど、次に訪れるのは浄妙寺です。";
const JOMYOJI_REPLACE = "杉本寺から歩いて8分ほど、次に訪れるのは浄妙寺です。";

const ZUISENJI_FIND = "浄妙寺から歩いて8分ほど、次に訪れるのは瑞泉寺です。";
const ZUISENJI_REPLACE = "浄妙寺から歩いて28分ほど、次に訪れるのは瑞泉寺です。";

const KAMAKURAGU_FIND = "瑞泉寺から歩いておよそ10分、次に訪れるのは鎌倉宮です。";
const KAMAKURAGU_REPLACE = "瑞泉寺から歩いておよそ11分、次に訪れるのは鎌倉宮です。";

const EGARA_FIND = "鎌倉宮から歩いて3分ほど、次に訪れるのは荏柄天神社です。";
const EGARA_REPLACE = "鎌倉宮から歩いて6分ほど、次に訪れるのは荏柄天神社です。";

const TSURUGAOKA_FIND0 = "荏柄天神社から歩いて9分ほど、鎌倉観光のハイライトともいえる鶴岡八幡宮に到着です。";
const TSURUGAOKA_REPLACE0 = "荏柄天神社から歩いて18分ほど、鎌倉観光のハイライトともいえる鶴岡八幡宮に到着です。";
const TSURUGAOKA_FIND1 = "見学を終えたら、今夜は鎌倉市内の宿に宿泊します。";
const TSURUGAOKA_REPLACE1 = "この夜は、鎌倉市内の宿に泊まりましょう。";

const TOKEIJI_FIND = "明月院から歩いて7分ほど、次に訪れるのは東慶寺です。";
const TOKEIJI_REPLACE = "明月院から歩いて10分ほど、次に訪れるのは東慶寺です。";

const EISHOJI_FIND = "円覚寺から歩いて18分ほど、次に訪れるのは英勝寺です。";
const EISHOJI_REPLACE = "円覚寺から歩いて34分ほど、次に訪れるのは英勝寺です。";

const KAIZOJI_FIND = "寿福寺から歩いて8分ほど、1泊2日の旅の最後に訪れるのは海蔵寺です。";
const KAIZOJI_REPLACE = "寿福寺から歩いて10分ほど、1泊2日の旅の最後に訪れるのは海蔵寺です。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [hokokuji, sugimotodera, jomyoji, zuisenji, kamakuragu, egara, tsurugaoka, meigetsuin, tokeiji, kitakamakuraLunch, engakuji, eishoji, jufukuji, kaizoji] =
    await Promise.all([
      prisma.spot.findFirstOrThrow({ where: { id: HOKOKUJI_ID, dayId: DAY1_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: SUGIMOTODERA_ID, dayId: DAY1_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: JOMYOJI_ID, dayId: DAY1_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: ZUISENJI_ID, dayId: DAY1_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: KAMAKURAGU_ID, dayId: DAY1_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: EGARA_ID, dayId: DAY1_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: TSURUGAOKA_ID, dayId: DAY1_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: MEIGETSUIN_ID, dayId: DAY2_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: TOKEIJI_ID, dayId: DAY2_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: KITAKAMAKURA_LUNCH_ID, dayId: DAY2_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: ENGAKUJI_ID, dayId: DAY2_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: EISHOJI_ID, dayId: DAY2_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: JUFUKUJI_ID, dayId: DAY2_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: KAIZOJI_ID, dayId: DAY2_ID } }),
    ]);

  for (const [label, spot, find] of [
    ["報国寺", hokokuji, HOKOKUJI_FIND],
    ["杉本寺", sugimotodera, SUGIMOTODERA_FIND],
    ["浄妙寺", jomyoji, JOMYOJI_FIND],
    ["瑞泉寺", zuisenji, ZUISENJI_FIND],
    ["鎌倉宮", kamakuragu, KAMAKURAGU_FIND],
    ["荏柄天神社", egara, EGARA_FIND],
    ["鶴岡八幡宮(0)", tsurugaoka, TSURUGAOKA_FIND0],
    ["鶴岡八幡宮(1)", tsurugaoka, TSURUGAOKA_FIND1],
    ["東慶寺", tokeiji, TOKEIJI_FIND],
    ["英勝寺", eishoji, EISHOJI_FIND],
    ["海蔵寺", kaizoji, KAIZOJI_FIND],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newHokokujiMemo = hokokuji.memo!.replace(HOKOKUJI_FIND, HOKOKUJI_REPLACE);
  const newSugimotoderaMemo = sugimotodera.memo!.replace(SUGIMOTODERA_FIND, SUGIMOTODERA_REPLACE);
  const newJomyojiMemo = jomyoji.memo!.replace(JOMYOJI_FIND, JOMYOJI_REPLACE);
  const newZuisenjiMemo = zuisenji.memo!.replace(ZUISENJI_FIND, ZUISENJI_REPLACE);
  const newKamakuraguMemo = kamakuragu.memo!.replace(KAMAKURAGU_FIND, KAMAKURAGU_REPLACE);
  const newEgaraMemo = egara.memo!.replace(EGARA_FIND, EGARA_REPLACE);
  const newTsurugaokaMemo = tsurugaoka.memo!.replace(TSURUGAOKA_FIND0, TSURUGAOKA_REPLACE0).replace(TSURUGAOKA_FIND1, TSURUGAOKA_REPLACE1);

  const newTokeijiMemo = tokeiji.memo!.replace(TOKEIJI_FIND, TOKEIJI_REPLACE);
  const newEishojiMemo = eishoji.memo!.replace(EISHOJI_FIND, EISHOJI_REPLACE);
  const newKaizojiMemo = kaizoji.memo!.replace(KAIZOJI_FIND, KAIZOJI_REPLACE);

  console.log("=== #74 Day1(初日)直す前→直した後 ===\n");
  console.log(`[1] 報国寺 (id=${hokokuji.id})  新visitTime: 11:10  新stay: 40`);
  console.log("  新memo:", newHokokujiMemo);
  console.log(`[2] 杉本寺 (id=${sugimotodera.id})  新visitTime: 11:57  新stay: 30  新leg: walk/7分`);
  console.log("  新memo:", newSugimotoderaMemo);
  console.log(`[3] 浄妙寺 (id=${jomyoji.id})  新visitTime: 12:35  新stay: 60(昼食)  新leg: walk/8分`);
  console.log("  新memo:", newJomyojiMemo);
  console.log(`[4] 瑞泉寺 (id=${zuisenji.id})  新visitTime: 14:03  新stay: 42  新leg: walk/28分`);
  console.log("  新memo:", newZuisenjiMemo);
  console.log(`[5] 鎌倉宮 (id=${kamakuragu.id})  新visitTime: 14:56  新stay: 20  新leg: walk/11分`);
  console.log("  新memo:", newKamakuraguMemo);
  console.log(`[6] 荏柄天神社 (id=${egara.id})  新visitTime: 15:22  新stay: 20  新leg: walk/6分`);
  console.log("  新memo:", newEgaraMemo);
  console.log(`[7] 鶴岡八幡宮 (id=${tsurugaoka.id})  新visitTime: 16:00  新stay: 55  新leg: walk/18分(〜16:55)`);
  console.log("  新memo:", newTsurugaokaMemo);
  console.log(
    "\nDay1 新しい時刻: 報国寺11:10(40)→杉本寺11:57(30)→浄妙寺12:35(60、昼食)→瑞泉寺14:03(42)→鎌倉宮14:56(20)→荏柄天神社15:22(20)→鶴岡八幡宮16:00(55、〜16:55)"
  );

  console.log("\n=== #74 Day2(最終日)移動の測り直し・終了時刻をもとの16:37にそろえる ===\n");
  console.log(`[1] 明月院 (id=${meigetsuin.id}) — 無変更  09:30(70)`);
  console.log(`[2] 東慶寺 (id=${tokeiji.id})  新visitTime: 10:50  新stay: 55(無変更)  新leg: walk/10分`);
  console.log("  新memo:", newTokeijiMemo);
  console.log(`[3] 北鎌倉駅のまわりで昼食 (id=${kitakamakuraLunch.id})  新visitTime: 11:49  新stay: 65(無変更、leg無変更4分)`);
  console.log(`[4] 円覚寺 (id=${engakuji.id})  新visitTime: 12:57  新stay: 70(もと90、leg無変更3分)`);
  console.log(`[5] 英勝寺 (id=${eishoji.id})  新visitTime: 14:41  新stay: 34(もと35)  新leg: walk/34分`);
  console.log("  新memo:", newEishojiMemo);
  console.log(`[6] 寿福寺 (id=${jufukuji.id})  新visitTime: 15:17  新stay: 35(無変更、leg無変更2分)`);
  console.log(`[7] 海蔵寺 (id=${kaizoji.id})  新visitTime: 16:02  新stay: 35(無変更)  新leg: walk/10分(〜16:37)`);
  console.log("  新memo:", newKaizojiMemo);
  console.log(
    "\nDay2 新しい時刻: 明月院09:30(70)→東慶寺10:50(55)→北鎌倉駅のまわり11:49(65、昼食)→円覚寺12:57(70)→英勝寺14:41(34)→寿福寺15:17(35)→海蔵寺16:02(35、〜16:37)"
  );

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    { id: hokokuji.id, data: { visitTime: T(11, 10), stayDurationMin: 40, memo: newHokokujiMemo } },
    {
      id: sugimotodera.id,
      data: {
        visitTime: T(11, 57),
        stayDurationMin: 30,
        memo: newSugimotoderaMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
      },
    },
    {
      id: jomyoji.id,
      data: {
        visitTime: T(12, 35),
        stayDurationMin: 60,
        memo: newJomyojiMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
      },
    },
    {
      id: zuisenji.id,
      data: {
        visitTime: T(14, 3),
        stayDurationMin: 42,
        memo: newZuisenjiMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 28 }] },
      },
    },
    {
      id: kamakuragu.id,
      data: {
        visitTime: T(14, 56),
        stayDurationMin: 20,
        memo: newKamakuraguMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 11 }] },
      },
    },
    {
      id: egara.id,
      data: {
        visitTime: T(15, 22),
        stayDurationMin: 20,
        memo: newEgaraMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
      },
    },
    {
      id: tsurugaoka.id,
      data: {
        visitTime: T(16, 0),
        stayDurationMin: 55,
        memo: newTsurugaokaMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 18 }] },
      },
    },
  ]);

  await prisma.spot.update({
    where: { id: TOKEIJI_ID },
    data: {
      visitTime: T(10, 50),
      memo: newTokeijiMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
    },
  });
  await prisma.spot.update({ where: { id: KITAKAMAKURA_LUNCH_ID }, data: { visitTime: T(11, 49) } });
  await prisma.spot.update({ where: { id: ENGAKUJI_ID }, data: { visitTime: T(12, 57), stayDurationMin: 70 } });
  await prisma.spot.update({
    where: { id: EISHOJI_ID },
    data: {
      visitTime: T(14, 41),
      stayDurationMin: 34,
      memo: newEishojiMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 34 }] },
    },
  });
  await prisma.spot.update({ where: { id: JUFUKUJI_ID }, data: { visitTime: T(15, 17) } });
  await prisma.spot.update({
    where: { id: KAIZOJI_ID },
    data: {
      visitTime: T(16, 2),
      memo: newKaizojiMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
    },
  });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
