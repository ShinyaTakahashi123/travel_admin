/**
 * #90 鶴岡八幡宮と北鎌倉の禅寺、長谷の観音・大仏をめぐり御朱印をいただく鎌倉1泊2日
 * (dba1a628-faa4-451e-94d2-73f6a09356e4) 初日・最終日の見直し。
 *
 * 初日: 入口(北鎌倉駅)の到着時刻の記載がなく09:30開始だったため、入口10:45ごろ着(徒歩1分)
 * で1か所目を10:46に直す。説明文には鶴岡八幡宮・円覚寺・建長寺・高徳院・長谷寺・銭洗弁財天
 * 宇賀福神社の名前があり、浄智寺・小町通り・宝戒寺・妙本寺は出てこない。企画運営の判断で、
 * 浄智寺・妙本寺を外す(円覚寺→建長寺を直接、実測24分)。小町通りの昼食が13:55と遅くなった
 * ため(法務・企画運営の指摘)、小町通りは昼食の場所をやめ「買い物や食事」に変え(食べ歩きは
 * 勧めない)。建長寺の滞在を65→90分にする案は「延ばし」になるため不可(法務・企画運営の
 * 指摘)で、新しいスポット「建長寺の門前で昼食」(バス停「建長寺」node260752525、店ではない
 * 点)を立てる。円覚寺はもとの70分に戻し(60分への短縮を取り消す)、建長寺は60分(もとの65分
 * 以下)、鶴岡八幡宮も延ばさずもとの60分のまま。全区間を実測(routed-foot)し、もとの値が
 * 短すぎた区間を直す(円覚寺→建長寺21→24分は新規、建長寺→バス停9分・バス停→小町通り21分、
 * 小町通り→宝戒寺9→11分、宝戒寺→鶴岡八幡宮7→9分)。終了は16:55(16:30〜17:00)。
 *
 * 2日目(最終日): 時刻(09:30〜16:30)はもとから決まりに合っていたため変更しない。ただし
 * 全区間を実測したところ、もとの値が短すぎたため(甘縄神明神社→高徳院5→10分など)、直すと
 * 終了が16:46まで遅くなる。企画運営の指摘で、見直す前と同じ16:30に収まるよう、滞在を
 * もとの範囲で短くする(長谷寺85→75分・成就院35→29分)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-90-dba1a628.ts
 *   反映: npm run prod -- npx tsx prisma/fix-90-dba1a628.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "96284495-0195-4581-8427-139690a53837";
const DAY2_ID = "60ee048f-16ab-4dbe-a6b0-6f21d972ba33";

const ENGAKUJI_ID = "e541dae7-99f7-491f-8718-7d659acf1bba";
const JOCHIJI_ID = "8c428f68-e821-4193-89c2-aa4c8e653f3c";
const KENCHOJI_ID = "1448c667-7e2a-4545-b755-79f53a3a2cb8";
const KOMACHIDORI_ID = "29e9c277-6f0a-4869-8ad0-975904f08d28";
const HOKAIJI_ID = "a4a77829-9bd7-4ffd-bc3f-1f4b32ac0b77";
const TSURUGAOKA_ID = "706790af-bd13-4237-8745-4ab54dbfe321";
const MYOHONJI_ID = "5deaa282-1363-43e6-98ed-41950262cbe2";

const AMANAWA_ID = "76b2e2fd-510c-42e4-b0e3-2a8b9c35f016";
const KOTOKUIN_ID = "de6ccb4b-8775-477d-bf89-a01ae8c5e91e";
const HASEDERA_ID = "648aa595-8790-431f-b1de-296f76e8b9df";
const HASEEKI_ID = "34a8aa15-565d-41a5-9f8c-5adc6045cb50";
const GORYO_ID = "f101abaa-8e63-40c7-aa34-25cd61978f67";
const JOJUIN_ID = "e27fcc38-eb77-4050-afb3-4d4ed61e52f3";
const KOKUZODO_ID = "cd9db71c-0509-4dca-b42f-a2ba145fe518";
const ZENIARAI_ID = "62d9358e-1486-42c1-97ae-38b7eea12e8e";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const ENGAKUJI_FIND = "北鎌倉駅から徒歩約1分。";
const ENGAKUJI_REPLACE = "北鎌倉駅に10:45ごろ着いたら、徒歩約1分。";
const ENGAKUJI_FIND2 = "この後は、歩いておよそ7分、浄智寺へ向かいましょう。";
const ENGAKUJI_REPLACE2 = "この後は、歩いておよそ24分、建長寺へ向かいましょう。";

const KENCHOJI_FIND = "浄智寺から歩いておよそ16分、建長寺に着きます。";
const KENCHOJI_REPLACE = "円覚寺から歩いておよそ24分、建長寺に着きます。";
const KENCHOJI_FIND2 =
  "今も座禅会が開かれる修行の場ですので、静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ21分、鎌倉駅近くの小町通りへ向かいましょう。";
const KENCHOJI_REPLACE2 =
  "今も座禅会が開かれる修行の場ですので、静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ9分、建長寺の門前へ向かいましょう。";

const LUNCH_MEMO = "建長寺の門前のあたりで、昼食にしましょう。この後は、歩いておよそ21分、鎌倉駅近くの小町通りへ向かいましょう。";

const KOMACHIDORI_FIND =
  "建長寺から歩いておよそ21分、鎌倉駅近くの小町通りに着きます。鶴岡八幡宮の一の鳥居から鎌倉駅東口まで、およそ360メートルにわたって食事処やみやげ物店が軒を連ねる、鎌倉でもっとも賑やかな通りの一つとされます。ここで昼食をとりましょう。食事を終えたら、歩いておよそ9分、宝戒寺へ向かいましょう。";
const KOMACHIDORI_REPLACE =
  "建長寺の門前から歩いておよそ21分、鎌倉駅近くの小町通りに着きます。鶴岡八幡宮の一の鳥居から鎌倉駅東口まで、およそ360メートルにわたって食事処やみやげ物店が軒を連ねる、鎌倉でもっとも賑やかな通りの一つとされます。買い物を楽しみましょう。歩きながらの食べ歩きは控えましょう。この後は、歩いておよそ11分、宝戒寺へ向かいましょう。";

const HOKAIJI_FIND = "小町通りから歩いておよそ9分、宝戒寺に着きます。";
const HOKAIJI_REPLACE = "小町通りから歩いておよそ11分、宝戒寺に着きます。";
const HOKAIJI_FIND2 = "この後は、歩いておよそ7分、鶴岡八幡宮へ向かいましょう。";
const HOKAIJI_REPLACE2 = "この後は、歩いておよそ9分、鶴岡八幡宮へ向かいましょう。";

const TSURUGAOKA_FIND = "宝戒寺から歩いておよそ7分、鶴岡八幡宮に着きます。";
const TSURUGAOKA_REPLACE = "宝戒寺から歩いておよそ9分、鶴岡八幡宮に着きます。";
const TSURUGAOKA_FIND2 =
  "静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ15分、妙本寺へ向かいましょう。";
const TSURUGAOKA_REPLACE2 = "静かに、敬意を持ってお参りしましょう。この日は、鎌倉駅のまわりの宿に泊まりましょう。";

const AMANAWA_FIND = "長谷駅から歩いておよそ5分、長谷の高台に鎮座する甘縄神明神社に着きます。";
const AMANAWA_REPLACE = "長谷駅から歩いておよそ7分、長谷の高台に鎮座する甘縄神明神社に着きます。";
const AMANAWA_FIND2 = "この後は、歩いておよそ5分、高徳院へ向かいましょう。";
const AMANAWA_REPLACE2 = "この後は、歩いておよそ10分、高徳院へ向かいましょう。";

const KOTOKUIN_FIND = "甘縄神明神社から歩いておよそ5分、高徳院に着きます。";
const KOTOKUIN_REPLACE = "甘縄神明神社から歩いておよそ10分、高徳院に着きます。";
const KOTOKUIN_FIND2 = "この後は、歩いておよそ8分、長谷寺へ向かいましょう。";
const KOTOKUIN_REPLACE2 = "この後は、歩いておよそ10分、長谷寺へ向かいましょう。";

const HASEDERA_FIND = "高徳院から歩いておよそ8分、長谷寺に着きます。";
const HASEDERA_REPLACE = "高徳院から歩いておよそ10分、長谷寺に着きます。";
const HASEDERA_FIND2 = "この後は、歩いておよそ5分、長谷駅のまわりへ向かいましょう。昼食をとりましょう。";
const HASEDERA_REPLACE2 = "この後は、歩いておよそ6分、長谷駅のまわりへ向かいましょう。昼食をとりましょう。";

const HASEEKI_FIND = "長谷寺から歩いておよそ5分、長谷駅のまわりに着きます。";
const HASEEKI_REPLACE = "長谷寺から歩いておよそ6分、長谷駅のまわりに着きます。";

const GORYO_FIND2 = "この後は、歩いておよそ4分、成就院へ向かいましょう。";
const GORYO_REPLACE2 = "この後は、歩いておよそ6分、成就院へ向かいましょう。";

const JOJUIN_FIND = "御霊神社から歩いておよそ4分、成就院に着きます。";
const JOJUIN_REPLACE = "御霊神社から歩いておよそ6分、成就院に着きます。";

const KOKUZODO_FIND2 = "この後は、歩いておよそ31分、銭洗弁財天宇賀福神社へ向かいましょう。";
const KOKUZODO_REPLACE2 = "この後は、歩いておよそ37分、銭洗弁財天宇賀福神社へ向かいましょう。";

const ZENIARAI_FIND = "虚空蔵堂から歩いておよそ31分、銭洗弁財天宇賀福神社に着きます。";
const ZENIARAI_REPLACE = "虚空蔵堂から歩いておよそ37分、銭洗弁財天宇賀福神社に着きます。";

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = {
    engakuji: ENGAKUJI_ID,
    kenchoji: KENCHOJI_ID,
    komachidori: KOMACHIDORI_ID,
    hokaiji: HOKAIJI_ID,
    tsurugaoka: TSURUGAOKA_ID,
    amanawa: AMANAWA_ID,
    kotokuin: KOTOKUIN_ID,
    hasedera: HASEDERA_ID,
    haseeki: HASEEKI_ID,
    goryo: GORYO_ID,
    jojuin: JOJUIN_ID,
    kokuzodo: KOKUZODO_ID,
    zeniarai: ZENIARAI_ID,
  };
  const spots = Object.fromEntries(
    await Promise.all(
      Object.entries(ids).map(async ([key, id]) => [key, await prisma.spot.findFirstOrThrow({ where: { id } })])
    )
  ) as Record<keyof typeof ids, { memo: string | null }>;

  const checks: [string, string, string][] = [
    ["円覚寺", spots.engakuji.memo ?? "", ENGAKUJI_FIND],
    ["円覚寺(2)", spots.engakuji.memo ?? "", ENGAKUJI_FIND2],
    ["建長寺", spots.kenchoji.memo ?? "", KENCHOJI_FIND],
    ["建長寺(2)", spots.kenchoji.memo ?? "", KENCHOJI_FIND2],
    ["小町通り", spots.komachidori.memo ?? "", KOMACHIDORI_FIND],
    ["宝戒寺", spots.hokaiji.memo ?? "", HOKAIJI_FIND],
    ["宝戒寺(2)", spots.hokaiji.memo ?? "", HOKAIJI_FIND2],
    ["鶴岡八幡宮", spots.tsurugaoka.memo ?? "", TSURUGAOKA_FIND],
    ["鶴岡八幡宮(2)", spots.tsurugaoka.memo ?? "", TSURUGAOKA_FIND2],
    ["甘縄神明神社", spots.amanawa.memo ?? "", AMANAWA_FIND],
    ["甘縄神明神社(2)", spots.amanawa.memo ?? "", AMANAWA_FIND2],
    ["高徳院", spots.kotokuin.memo ?? "", KOTOKUIN_FIND],
    ["高徳院(2)", spots.kotokuin.memo ?? "", KOTOKUIN_FIND2],
    ["長谷寺", spots.hasedera.memo ?? "", HASEDERA_FIND],
    ["長谷寺(2)", spots.hasedera.memo ?? "", HASEDERA_FIND2],
    ["長谷駅のまわり", spots.haseeki.memo ?? "", HASEEKI_FIND],
    ["御霊神社(2)", spots.goryo.memo ?? "", GORYO_FIND2],
    ["成就院", spots.jojuin.memo ?? "", JOJUIN_FIND],
    ["虚空蔵堂(2)", spots.kokuzodo.memo ?? "", KOKUZODO_FIND2],
    ["銭洗弁財天宇賀福神社", spots.zeniarai.memo ?? "", ZENIARAI_FIND],
  ];
  for (const [label, text, find] of checks) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const m = {
    engakuji: spots.engakuji.memo!.replace(ENGAKUJI_FIND, ENGAKUJI_REPLACE).replace(ENGAKUJI_FIND2, ENGAKUJI_REPLACE2),
    kenchoji: spots.kenchoji.memo!.replace(KENCHOJI_FIND, KENCHOJI_REPLACE).replace(KENCHOJI_FIND2, KENCHOJI_REPLACE2),
    komachidori: spots.komachidori.memo!.replace(KOMACHIDORI_FIND, KOMACHIDORI_REPLACE),
    hokaiji: spots.hokaiji.memo!.replace(HOKAIJI_FIND, HOKAIJI_REPLACE).replace(HOKAIJI_FIND2, HOKAIJI_REPLACE2),
    tsurugaoka: spots.tsurugaoka.memo!.replace(TSURUGAOKA_FIND, TSURUGAOKA_REPLACE).replace(TSURUGAOKA_FIND2, TSURUGAOKA_REPLACE2),
    amanawa: spots.amanawa.memo!.replace(AMANAWA_FIND, AMANAWA_REPLACE).replace(AMANAWA_FIND2, AMANAWA_REPLACE2),
    kotokuin: spots.kotokuin.memo!.replace(KOTOKUIN_FIND, KOTOKUIN_REPLACE).replace(KOTOKUIN_FIND2, KOTOKUIN_REPLACE2),
    hasedera: spots.hasedera.memo!.replace(HASEDERA_FIND, HASEDERA_REPLACE).replace(HASEDERA_FIND2, HASEDERA_REPLACE2),
    haseeki: spots.haseeki.memo!.replace(HASEEKI_FIND, HASEEKI_REPLACE),
    goryo: spots.goryo.memo!.replace(GORYO_FIND2, GORYO_REPLACE2),
    jojuin: spots.jojuin.memo!.replace(JOJUIN_FIND, JOJUIN_REPLACE),
    kokuzodo: spots.kokuzodo.memo!.replace(KOKUZODO_FIND2, KOKUZODO_REPLACE2),
    zeniarai: spots.zeniarai.memo!.replace(ZENIARAI_FIND, ZENIARAI_REPLACE),
  };

  console.log("=== #90 初日・最終日の見直し ===\n");
  console.log("--- 初日(浄智寺・妙本寺を外す。新規スポット「建長寺の門前で昼食」) ---");
  console.log("1. 円覚寺 10:46(70分、入口を追加)");
  console.log("2. 建長寺 12:20(60分←65分):");
  console.log(m.kenchoji.slice(-80));
  console.log("3. (新規)建長寺の門前で昼食 13:29(40分、バス停「建長寺」node260752525):");
  console.log(LUNCH_MEMO);
  console.log("4. 小町通り 14:30(35分←60分、買い物・食事):");
  console.log(m.komachidori.slice(-80));
  console.log("5. 宝戒寺 15:16(30分)");
  console.log("6. 鶴岡八幡宮(最後) 15:55(60分、終了16:55):");
  console.log(m.tsurugaoka.slice(-80));

  console.log("\n--- 2日目(最終日、変更なし。移動を実測し直し、滞在で合わせる) ---");
  console.log("長谷寺85→75分、成就院35→29分。終了は見直す前と同じ16:30");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      DAY1_ID,
      [
        { id: ENGAKUJI_ID, data: { visitTime: t(10, 46), stayDurationMin: 70, memo: m.engakuji } },
        {
          id: KENCHOJI_ID,
          data: {
            visitTime: t(12, 20),
            stayDurationMin: 60,
            memo: m.kenchoji,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 24 }] },
          },
        },
        {
          create: {
            name: "建長寺の門前で昼食",
            visitTime: t(13, 29),
            stayDurationMin: 40,
            lat: 35.331079,
            lng: 139.5524582,
            memo: LUNCH_MEMO,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
          },
        },
        {
          id: KOMACHIDORI_ID,
          data: {
            visitTime: t(14, 30),
            stayDurationMin: 35,
            memo: m.komachidori,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 21 }] },
          },
        },
        {
          id: HOKAIJI_ID,
          data: {
            visitTime: t(15, 16),
            stayDurationMin: 30,
            memo: m.hokaiji,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 11 }] },
          },
        },
        {
          id: TSURUGAOKA_ID,
          data: {
            visitTime: t(15, 55),
            stayDurationMin: 60,
            memo: m.tsurugaoka,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
          },
        },
      ],
      { remove: [JOCHIJI_ID, MYOHONJI_ID], tx }
    );

    await setDaySpotOrder(
      DAY2_ID,
      [
        { id: AMANAWA_ID, data: { memo: m.amanawa } },
        {
          id: KOTOKUIN_ID,
          data: { memo: m.kotokuin, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] } },
        },
        {
          id: HASEDERA_ID,
          data: {
            stayDurationMin: 75,
            memo: m.hasedera,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
          },
        },
        {
          id: HASEEKI_ID,
          data: { memo: m.haseeki, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] } },
        },
        { id: GORYO_ID, data: { memo: m.goryo } },
        {
          id: JOJUIN_ID,
          data: {
            stayDurationMin: 29,
            memo: m.jojuin,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
          },
        },
        { id: KOKUZODO_ID, data: { memo: m.kokuzodo } },
        {
          id: ZENIARAI_ID,
          data: { memo: m.zeniarai, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 37 }] } },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
