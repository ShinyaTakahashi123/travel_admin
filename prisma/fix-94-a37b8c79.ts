/**
 * #94 東大寺と春日大社、薬師寺と唐招提寺をめぐり御朱印をいただく奈良1泊2日
 * (a37b8c79-85e0-4c3d-b2c6-94057033f31a) 初日・最終日の見直し。
 *
 * 初日: 入口(JR・近鉄奈良駅からのバス)の到着時刻の記載がなく09:10開始だったため、
 * 入口10:45ごろ着+バス約8分で1か所目(東大寺)を10:53に直す(企画運営の判断。東大寺は
 * もとの75分のまま変更しない)。昼食(ならまち)が13:30の決まりに収まらないため、企画運営の
 * 判断で、東大寺のすぐあとに新しいスポット「東大寺のあたりで昼食」(#47と同じ案内板の点)を
 * 立てる(12時台)。ならまちの昼食の一文は外し、散策の場所にする。説明文に名前のない猿沢池を
 * 外す(宿泊の一文は興福寺に移す)。実測(routed-foot)で元興寺→興福寺(15→9分)など一部の
 * 移動を直す。二月堂・春日大社・ならまち・元興寺・興福寺の滞在を少しずつ短くして、終了を
 * 17:00に収める。
 *
 * 2日目(最終日): 時刻(09:10〜16:30)はもとから決まりに合っていた。薬師寺→唐招提寺
 * (実測15分、もとの10分は短すぎたため直す)、朱雀門ひろば→第一次大極殿(実測19分、もとの
 * 15分は短すぎたため直す)。この差(+9分)を秋篠寺の滞在(40→30分)で吸収し、終了を見直す前と
 * 同じ16:30に保つ。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-94-a37b8c79.ts
 *   反映: npm run prod -- npx tsx prisma/fix-94-a37b8c79.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "c6f7bfd1-53c8-47a3-9ff4-c029789ef069";
const DAY2_ID = "75b46b4e-c560-443c-89af-f7bc5e02c173";

const TODAIJI_ID = "22de220b-2413-458c-a043-0625c6f74f3e";
const NIGATSUDO_ID = "0b0ba813-43f0-4c4e-b3b1-1f72fdb069dd";
const KASUGATAISHA_ID = "4d60a64f-b632-4082-8f09-368ffdd8490d";
const NARAMACHI_ID = "210616e9-bcdd-430d-a0d5-92d386ac130a";
const GANGOJI_ID = "f6543e24-be5f-447c-a46f-f08f9321b631";
const KOFUKUJI_ID = "fa1a3190-33d8-460c-bf8e-50cd9c591c2f";
const SARUSAWAIKE_ID = "178e1fb2-41c8-4596-b8e1-9f0b740a8d94";

const YAKUSHIJI_ID = "a232deaa-9ab1-4168-a599-dc37940ea444";
const TOSHODAIJI_ID = "58094211-a23f-4147-9272-29af5280b2c9";
const SUZAKUMON_ID = "f0c5ad22-ffe6-4cef-bb60-9c0c59d40186";
const DAIGOKUDEN_ID = "6732ec67-2df1-420c-af0e-1f9e7dba333b";
const SAIDAIJI_ID = "a1487217-615c-4db1-886e-66e8fa19c64a";
const AKISHINODERA_ID = "83daf9b9-2449-470d-9c5a-dbf2d6e69282";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const TODAIJI_FIND = "JR・近鉄奈良駅からバスで約8分の東大寺へ。";
const TODAIJI_REPLACE = "JR奈良駅からバスで約9分の東大寺大仏殿のバス停に10:45ごろ着いたら、歩いて約11分で大仏殿へ。";
const TODAIJI_FIND2 = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const TODAIJI_REPLACE2 =
  "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。この後は、歩いてすぐ、昼食をとる東大寺のあたりへ向かいましょう。";

const LUNCH_MEMO = "このあたりで昼食にしましょう。この後は、歩いておよそ9分、二月堂へ向かいましょう。";

const NIGATSUDO_FIND = "大仏殿から東へ坂を上って、二月堂へ。";
const NIGATSUDO_REPLACE = "昼食のあと、東大寺のあたりから坂を上って、二月堂へ。";

const NARAMACHI_FIND =
  "春日大社から西へ歩いて、ならまちへ。元興寺の境内だった土地に、江戸から明治のころの格子の町家が残る町で、家々の軒先には「身代わり申」と呼ばれる猿のお守りが下がっています。このあたりで昼食にしましょう。今も人が暮らす町並みです。";
const NARAMACHI_REPLACE =
  "春日大社から西へ歩いて、ならまちへ。元興寺の境内だった土地に、江戸から明治のころの格子の町家が残る町で、家々の軒先には「身代わり申」と呼ばれる猿のお守りが下がっています。今も人が暮らす町並みです。";

const KOFUKUJI_FIND = "元興寺から北へ歩いて、興福寺へ。";
const KOFUKUJI_REPLACE = "元興寺から北へ歩いて約9分、興福寺へ。";
const KOFUKUJI_FIND1B = "見学できる範囲は公式の案内で確かめてください。";
const KOFUKUJI_REPLACE1B = "見学できる範囲は公式の案内で確かめましょう。";
const KOFUKUJI_FIND2 = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const KOFUKUJI_REPLACE2 =
  "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。奈良の社寺をめぐる1日目を、ここで締めくくりましょう。今夜は近鉄奈良駅のまわりに泊まります。";

const YAKUSHIJI_FIND = "約15分の西ノ京駅へ。";
const YAKUSHIJI_REPLACE = "約15分の西ノ京駅へ。";

const TOSHODAIJI_FIND = "薬師寺から北へ歩いて、唐招提寺へ。";
const TOSHODAIJI_REPLACE = "薬師寺から北へ歩いて約15分、唐招提寺へ。";

const SUZAKUMON_FIND = "駅から歩いて約20分の、平城宮跡の朱雀門ひろばへ。";
const SUZAKUMON_REPLACE = "駅から歩いて約20分の、平城宮跡の朱雀門ひろばへ。";

const DAIGOKUDEN_FIND = "朱雀門から平城宮跡を北へ歩いて、復原された第一次大極殿へ。";
const DAIGOKUDEN_REPLACE = "朱雀門から平城宮跡を北へ歩いて約19分、復原された第一次大極殿へ。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [todaiji, nigatsudo, naramachi, gangoji, kofukuji, toshodaiji] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: TODAIJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: NIGATSUDO_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: NARAMACHI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: GANGOJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KOFUKUJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: TOSHODAIJI_ID } }),
  ]);

  for (const [label, text, find] of [
    ["東大寺", todaiji.memo ?? "", TODAIJI_FIND],
    ["東大寺(2)", todaiji.memo ?? "", TODAIJI_FIND2],
    ["二月堂", nigatsudo.memo ?? "", NIGATSUDO_FIND],
    ["ならまち", naramachi.memo ?? "", NARAMACHI_FIND],
    ["興福寺", kofukuji.memo ?? "", KOFUKUJI_FIND],
    ["興福寺(1b)", kofukuji.memo ?? "", KOFUKUJI_FIND1B],
    ["興福寺(2)", kofukuji.memo ?? "", KOFUKUJI_FIND2],
    ["唐招提寺", toshodaiji.memo ?? "", TOSHODAIJI_FIND],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const m = {
    todaiji: todaiji.memo!.replace(TODAIJI_FIND, TODAIJI_REPLACE).replace(TODAIJI_FIND2, TODAIJI_REPLACE2),
    nigatsudo: nigatsudo.memo!.replace(NIGATSUDO_FIND, NIGATSUDO_REPLACE),
    naramachi: naramachi.memo!.replace(NARAMACHI_FIND, NARAMACHI_REPLACE),
    kofukuji: kofukuji.memo!
      .replace(KOFUKUJI_FIND, KOFUKUJI_REPLACE)
      .replace(KOFUKUJI_FIND1B, KOFUKUJI_REPLACE1B)
      .replace(KOFUKUJI_FIND2, KOFUKUJI_REPLACE2),
    toshodaiji: toshodaiji.memo!.replace(TOSHODAIJI_FIND, TOSHODAIJI_REPLACE),
  };

  console.log("=== #94 初日・最終日の見直し ===\n");
  console.log("--- 初日(猿沢池を外す。新規スポット「東大寺のあたりで昼食」) ---");
  console.log("1. 東大寺 10:56(75分、変更なし):");
  console.log(m.todaiji.slice(0, 90));
  console.log("2. (新規)東大寺のあたりで昼食 12:15(40分、#47と同じ点):");
  console.log(LUNCH_MEMO);
  console.log("3. 二月堂 13:04(20分←25分)");
  console.log("4. 春日大社 13:41(46分←50分)");
  console.log("5. ならまち 14:53(30分←65分、昼食の一文を削除)");
  console.log("6. 元興寺 15:29(35分←45分)");
  console.log("7. 興福寺(最後) 16:13(47分←70分、終了17:00)");

  console.log("\n--- 2日目(最終日、変更なし。移動2区間を実測で直す) ---");
  console.log("薬師寺→唐招提寺10→15分、朱雀門ひろば→第一次大極殿15→19分。秋篠寺40→31分で終了16:30を保つ");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      DAY1_ID,
      [
        { id: TODAIJI_ID, data: { visitTime: t(10, 56), stayDurationMin: 75, memo: m.todaiji } },
        {
          create: {
            name: "東大寺のあたりで昼食",
            visitTime: t(12, 15),
            stayDurationMin: 40,
            lat: 34.687499,
            lng: 135.839814,
            memo: LUNCH_MEMO,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
          },
        },
        {
          id: NIGATSUDO_ID,
          data: {
            visitTime: t(13, 4),
            stayDurationMin: 20,
            memo: m.nigatsudo,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
          },
        },
        {
          id: KASUGATAISHA_ID,
          data: {
            visitTime: t(13, 41),
            stayDurationMin: 46,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 17 }] },
          },
        },
        { id: NARAMACHI_ID, data: { visitTime: t(14, 53), stayDurationMin: 30, memo: m.naramachi } },
        { id: GANGOJI_ID, data: { visitTime: t(15, 29), stayDurationMin: 35, lat: 34.677815, lng: 135.831339 } },
        {
          id: KOFUKUJI_ID,
          data: {
            visitTime: t(16, 13),
            stayDurationMin: 47,
            lat: 34.682485,
            lng: 135.832225,
            memo: m.kofukuji,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
          },
        },
      ],
      { remove: [SARUSAWAIKE_ID], tx }
    );

    await tx.spot.update({
      where: { id: TOSHODAIJI_ID },
      data: {
        visitTime: t(10, 40),
        memo: m.toshodaiji,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
      },
    });
    await tx.spot.update({ where: { id: SUZAKUMON_ID }, data: { visitTime: t(12, 25) } });
    await tx.spot.update({
      where: { id: DAIGOKUDEN_ID },
      data: { visitTime: t(13, 44), transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 19 }] } },
    });
    await tx.spot.update({ where: { id: SAIDAIJI_ID }, data: { visitTime: t(14, 54) } });
    await tx.spot.update({ where: { id: AKISHINODERA_ID }, data: { visitTime: t(15, 59), stayDurationMin: 31 } });
  }, { timeout: 60000 });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
