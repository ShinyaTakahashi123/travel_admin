/**
 * #79(尾道市立美術館とネコの細道、坂の町の路地裏を巡る1泊2日、
 * d4f3c053)の初日・最終日の見直し(修正版)。
 *
 * 【浄土寺の拝観時間(企画運営の指摘)】浄土寺は本堂・庭園・宝物館の
 * 拝観受付が16:00ごろまで(境内自体は終日入れる)。最初の版の到着
 * 15:51では拝観できる時間がほぼなかった。西國寺と浄土寺の順番を
 * 入れかえ(本通り商店街→浄土寺→西國寺)、浄土寺の到着を14:55に
 * 早めた(受付時刻は本文に書かない)。
 *
 * 【滞在が短すぎた3か所(企画運営の指摘)】映画資料館12分・歴史博物館
 * 15分・持光寺17分は、入っても見られない長さだった。持光寺(タイトル・
 * 説明文に名前が出てこない)を外し、浮いた時間を歴史博物館・映画資料館
 * (どちらも説明文に名前がある)にもとの滞在(25分)まで戻した
 * (写真0枚、外してもスポットの内容に影響なし)。
 *
 * 【ネコの細道(2日目)】タイトルの由来として実在し、2日目の#3スポット。
 *
 * 【座標の直し(法務・企画運営の指摘)】
 * - 本通り商店街で昼食: 現在の点はJR尾道駅(node8122138840)で、本通り
 *   ではなかった。本通りの通り自体(way465927337「中商店街」)は線で
 *   点ではないため、7章の「通りに面した名前の地物」で、通り沿いの
 *   node6207052653「奉行所跡」34.4065805,133.1981202に直す
 * - ネコの細道: 隣の艮神社と同じ点(21m差)で、名前のない点だった。
 *   細道自体(way599997417「猫の細道」)の線の上のnode5706910916
 *   34.4106921,133.1997265に直す
 *
 * 【移動の測り直し】座標の移動・順番の入れかえ・持光寺の除外にともない、
 * 関係する区間をすべて測り直した:
 * - 尾道市立美術館→おのみち歴史博物館(直接、持光寺を外した分): 実測
 *   14.0分。14分に直す
 * - おのみち映画資料館→本通り商店街(新座標): 実測11.4分。11分に直す
 * - 本通り商店街(新座標)→浄土寺(入れかえ、新区間): 実測20.9分。21分
 * - 浄土寺→西國寺(入れかえ、逆順): 実測15.4分。15分(もとの西國寺→
 *   浄土寺と同じ)
 * - 宝土寺→ネコの細道(新座標): 実測5.5分。6分に直す
 * - ネコの細道(新座標)→艮神社: 実測4.4分。4分に直す
 *
 * 【新しい時刻】
 * Day1(10:45開始・17:00終了、見どころは削らず滞在短縮): 千光寺10:45(35)
 * →尾道市立美術館11:27(45)→おのみち歴史博物館12:26(25)→おのみち映画
 * 資料館12:53(25)→本通り商店街13:29(65、昼食)→浄土寺14:55(65)→
 * 西國寺16:15(45、〜17:00)
 * Day2(最終日は今より遅くならないという決まりのため、企画運営の指示で
 * ネコの細道の座標直しによる+3分を海岸通りの滞在短縮(65→62分)で吸収
 * し、西郷寺以降はもとの時刻のまま): 天寧寺09:30(60)→宝土寺10:34(38)→
 * ネコの細道11:18(35)→艮神社11:57(35)→御袖天満宮12:38(30)→海岸通り
 * 13:20(62、もと65分、昼食)→西郷寺14:38(55、もとの時刻)→尾道渡船
 * 15:52(40、〜16:32、もとの時刻のまま)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-79-d4f3c053.ts
 *   反映: npm run prod -- npx tsx prisma/fix-79-d4f3c053.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "e708eacb-a5bc-45c4-8e50-b75d9b2ad14b";

const SENKOJI_ID = "7aa3aecc-19dc-4d20-94cf-6d0745605642";
const BIJUTSUKAN_ID = "a44c7aca-ddae-476a-928e-d4d7924f890b";
const JIKOJI_ID = "b8e99148-9b47-4ecc-afb8-43a9a8af8b4f";
const REKISHIKAN_ID = "6adf0f0e-d896-4b81-966b-f4c45d359b87";
const EIGASHIRYOKAN_ID = "debbabc8-45fc-4333-855b-9370b1cdebf0";
const HONDORI_ID = "78b4ddd2-f27e-4501-9b16-40c3e6992a79";
const SAIKOKUJI_ID = "e35d70d4-f558-4307-bbdc-16dffc6a4d25";
const JODOJI_ID = "8bdd60c9-6d58-41c7-81a5-576f762eaca5";

const NEKONOHOSOMICHI_ID = "3a46a905-26fd-44f4-a939-d9e2be280d75";
const USHITORA_ID = "2f76091e-e825-4567-99de-a356e879ce4c";
const MISODE_ID = "2e10ad65-c9eb-4ce4-a2cc-f2fc51f631c6";
const KAIGANDORI_ID = "2202dbed-9ec5-4b08-9598-6baa3bb0b4e9";
const SAIGOJI_ID = "12fe73b7-1908-4faa-8912-e6bc194d54ce";
const TOSEN_ID = "89c33cf1-ffaa-4b2e-bd06-8ee2e62beb2a";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SENKOJI_FIND = "尾道駅からバスでおよそ5分の長江口から、千光寺山ロープウェイで山頂まで登り、尾道の旅は千光寺から始まります。";
const SENKOJI_REPLACE =
  "JR尾道駅に10時35分ごろ着いたら、バスでおよそ5分の長江口から、千光寺山ロープウェイで山頂まで登り、千光寺へ。";

const BIJUTSUKAN_FIND = "見学を終えたら、歩いて持光寺へ向かいましょう。";
const BIJUTSUKAN_REPLACE = "見学を終えたら、歩いておのみち歴史博物館へ向かいましょう。";

const REKISHIKAN_FIND = "持光寺から歩いて16分ほど、次に訪れるのはおのみち歴史博物館です。";
const REKISHIKAN_REPLACE = "尾道市立美術館から歩いて14分ほど、次に訪れるのはおのみち歴史博物館です。";

const HONDORI_FIND1 = "おのみち映画資料館から歩いて16分ほど、お昼は本通り商店街で食事をとりましょう。";
const HONDORI_REPLACE1 = "おのみち映画資料館から歩いて11分ほど、お昼は本通り商店街で食事をとりましょう。";
const HONDORI_FIND2 = "お腹を満たしたら、バスで西國寺へ向かいましょう。";
const HONDORI_REPLACE2 = "お腹を満たしたら、歩いて浄土寺へ向かいましょう。";

const JODOJI_FIND1 = "西國寺から歩いて15分ほど、今日最後に訪れるのは浄土寺です。";
const JODOJI_REPLACE1 = "本通り商店街から歩いて21分ほど、次に訪れるのは浄土寺です。";
const JODOJI_FIND2 = "見学を終えたら、今夜はこの近くの宿に宿泊します。";
const JODOJI_REPLACE2 = "見学を終えたら、歩いて西國寺へ向かいましょう。";

const SAIKOKUJI_FIND1 = "本通り商店街からバスでおよそ12分、次に訪れるのは西國寺です。";
const SAIKOKUJI_REPLACE1 = "浄土寺から歩いて15分ほど、今日最後に訪れるのは西國寺です。";
const SAIKOKUJI_FIND2 = "見学を終えたら、歩いて浄土寺へ向かいましょう。";
const SAIKOKUJI_REPLACE2 = "見学を終えたら、今夜はこの近くの宿に宿泊します。";

const NEKO_FIND = "宝土寺から歩いて5分ほど、次に訪れるのはネコの細道です。";
const NEKO_REPLACE = "宝土寺から歩いて6分ほど、次に訪れるのはネコの細道です。";

const USHITORA_FIND = "ネコの細道から歩いて2分ほど、次に訪れるのは艮神社です。";
const USHITORA_REPLACE = "ネコの細道から歩いて4分ほど、次に訪れるのは艮神社です。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [senkoji, bijutsukan, rekishikan, hondori, jodoji, saikokuji, neko, ushitora] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: SENKOJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: BIJUTSUKAN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: REKISHIKAN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: HONDORI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: JODOJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SAIKOKUJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: NEKONOHOSOMICHI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: USHITORA_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["千光寺", senkoji, SENKOJI_FIND],
    ["尾道市立美術館", bijutsukan, BIJUTSUKAN_FIND],
    ["おのみち歴史博物館", rekishikan, REKISHIKAN_FIND],
    ["本通り(1)", hondori, HONDORI_FIND1],
    ["本通り(2)", hondori, HONDORI_FIND2],
    ["浄土寺(1)", jodoji, JODOJI_FIND1],
    ["浄土寺(2)", jodoji, JODOJI_FIND2],
    ["西國寺(1)", saikokuji, SAIKOKUJI_FIND1],
    ["西國寺(2)", saikokuji, SAIKOKUJI_FIND2],
    ["ネコの細道", neko, NEKO_FIND],
    ["艮神社", ushitora, USHITORA_FIND],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newSenkojiMemo = senkoji.memo!.replace(SENKOJI_FIND, SENKOJI_REPLACE);
  const newBijutsukanMemo = bijutsukan.memo!.replace(BIJUTSUKAN_FIND, BIJUTSUKAN_REPLACE);
  const newRekishikanMemo = rekishikan.memo!.replace(REKISHIKAN_FIND, REKISHIKAN_REPLACE);
  const newHondoriMemo = hondori.memo!.replace(HONDORI_FIND1, HONDORI_REPLACE1).replace(HONDORI_FIND2, HONDORI_REPLACE2);
  const newJodojiMemo = jodoji.memo!.replace(JODOJI_FIND1, JODOJI_REPLACE1).replace(JODOJI_FIND2, JODOJI_REPLACE2);
  const newSaikokujiMemo = saikokuji.memo!.replace(SAIKOKUJI_FIND1, SAIKOKUJI_REPLACE1).replace(SAIKOKUJI_FIND2, SAIKOKUJI_REPLACE2);
  const newNekoMemo = neko.memo!.replace(NEKO_FIND, NEKO_REPLACE);
  const newUshitoraMemo = ushitora.memo!.replace(USHITORA_FIND, USHITORA_REPLACE);

  console.log("=== #79 Day1: 持光寺を外し、浄土寺・西國寺の順番を入れかえる ===\n");
  console.log(
    "千光寺10:45(35)→尾道市立美術館11:27(45)→おのみち歴史博物館12:26(25)→おのみち映画資料館12:53(25)→本通り商店街13:29(65、昼食)→浄土寺14:55(65)→西國寺16:15(45、〜17:00)"
  );
  console.log("\n=== #79 Day2: ネコの細道の座標直しに伴う調整(海岸通りの滞在で吸収) ===\n");
  console.log(
    "天寧寺09:30(60)→宝土寺10:34(38)→ネコの細道11:18(35)→艮神社11:57(35)→御袖天満宮12:38(30)→海岸通り13:20(62、もと65分)→西郷寺14:38(55、もとの時刻)→尾道渡船15:52(40、〜16:32、もとの時刻)"
  );

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: SENKOJI_ID, data: { visitTime: T(10, 45), stayDurationMin: 35, memo: newSenkojiMemo } },
      { id: BIJUTSUKAN_ID, data: { visitTime: T(11, 27), stayDurationMin: 45, memo: newBijutsukanMemo } },
      {
        id: REKISHIKAN_ID,
        data: {
          visitTime: T(12, 26),
          stayDurationMin: 25,
          memo: newRekishikanMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 14 }] },
        },
      },
      { id: EIGASHIRYOKAN_ID, data: { visitTime: T(12, 53), stayDurationMin: 25 } },
      {
        id: HONDORI_ID,
        data: {
          visitTime: T(13, 29),
          stayDurationMin: 65,
          lat: 34.4065805,
          lng: 133.1981202,
          memo: newHondoriMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 11 }] },
        },
      },
      {
        id: JODOJI_ID,
        data: {
          visitTime: T(14, 55),
          stayDurationMin: 65,
          memo: newJodojiMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 21 }] },
        },
      },
      {
        id: SAIKOKUJI_ID,
        data: {
          visitTime: T(16, 15),
          stayDurationMin: 45,
          memo: newSaikokujiMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
        },
      },
    ],
    { remove: [JIKOJI_ID] }
  );

  await prisma.spot.update({
    where: { id: NEKONOHOSOMICHI_ID },
    data: {
      visitTime: T(11, 18),
      lat: 34.4106921,
      lng: 133.1997265,
      memo: newNekoMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
    },
  });
  await prisma.spot.update({
    where: { id: USHITORA_ID },
    data: {
      visitTime: T(11, 57),
      memo: newUshitoraMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
    },
  });
  await prisma.spot.update({ where: { id: MISODE_ID }, data: { visitTime: T(12, 38) } });
  await prisma.spot.update({ where: { id: KAIGANDORI_ID }, data: { visitTime: T(13, 20), stayDurationMin: 62 } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
