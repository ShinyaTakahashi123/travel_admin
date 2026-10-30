/**
 * #91 城崎の外湯めぐりと温泉寺、玄武洞と出石の城下町を歩く1泊2日
 * (9d31758b-13cf-4d8c-bbdd-87a0361b36db) 初日・最終日の見直し。
 *
 * 初日: 入口(城崎温泉駅)の到着時刻の記載がなく09:00開始だったため、入口10:45ごろ着+徒歩5分
 * で1か所目(城崎文芸館)を10:50に直す。説明文は「外湯めぐり」「温泉寺」と集合的な言い方で、
 * 個々の外湯・文芸館・ロープウェイの名前は出てこない。地蔵湯→まんだら湯→柳湯の道順が、
 * 地理的に西へ戻って東へ戻る回り道だったため(まんだら湯は御所の湯側に近い)、企画運営の判断で
 * まんだら湯を外す(地蔵湯→柳湯は直接、実測4分)。昼食は、一の湯のメモにあった一文を外し、
 * 温泉寺のあとに新しいスポット「城崎の温泉街で昼食」(城崎温泉観光協会の案内所の点、店ではない)
 * を立てる(12:50、45分)。全区間を実測(routed-foot)したが、もとの値はほぼ正確だったため、
 * 新設した昼食スポットの前後2区間以外は移動時間を変更しない。終了は17:00。
 *
 * 2日目(最終日): 時刻(09:30〜16:34)はもとから決まりに合っていた。玄武洞公園→コウノトリの
 * 郷公園(車20分)は実測12.1分で、もとの値のままでよい(閾値23.2分より短い)。コウノトリの郷
 * 公園→辰鼓楼(車20分)は実測23.5分で、もとの値より長いため24分に直す(+4分)。この差を、
 * 出石永楽館の滞在45→41分(4分短縮)で吸収し、終了を見直す前と同じ16:34に保つ。昼食の一文は
 * 辰鼓楼のメモに元からある(出石そばの店)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-91-9d31758b.ts
 *   反映: npm run prod -- npx tsx prisma/fix-91-9d31758b.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "a1c4a50b-aa75-4320-8ef3-c94461767417";
const DAY2_ID = "a27eb037-3e92-4666-88d1-b4d5778c9e1b";

const BUNGEIKAN_ID = "84b65fc2-0eb0-4081-ac13-69fffd89427c";
const ROPEWAY_ID = "af0777ba-b67e-495e-8054-6db61432bf8d";
const ONSENJI_ID = "ade9fdb9-a7fd-4fff-97aa-e39531dda3af";
const GOSHONOYU_ID = "475ab79e-bb50-4b18-880a-3d69e6ea34e8";
const ICHINOYU_ID = "09a6b3df-6ef9-4ad9-aae7-1b3b6ea60003";
const JIZOYU_ID = "9371b3c7-ca2d-43ff-b608-0ad43e152a6b";
const MANDARAYU_ID = "9e3677e6-b334-40fc-bae5-39f17446903d";
const YANAGIYU_ID = "18a015d9-3ff4-400a-9eac-91d723f2c0b3";

const KOUNOTORI_ID = "d7e71437-9403-49bc-b494-c62cb5c7681c";
const SHINKORO_ID = "9a97a226-5644-4711-ae7d-e4bdad7b8932";
const EIRAKUKAN_ID = "e455278a-21ac-42c0-904a-6e6626d96000";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const BUNGEIKAN_FIND = "豊岡市立城崎文芸館は、";
const BUNGEIKAN_REPLACE = "城崎温泉駅に10:45ごろ着いたら、大谿川沿いの柳並木を眺めながら、徒歩でおよそ5分の城崎文芸館へ。豊岡市立城崎文芸館は、";

const ONSENJI_FIND = "続いては、歩いておよそ12分の御所の湯へ向かいましょう。";
const ONSENJI_REPLACE = "続いては、歩いておよそ15分の城崎の温泉街へ向かいましょう。昼食をとりましょう。";

const LUNCH_MEMO = "温泉寺から歩いておよそ15分、城崎の温泉街のあたりで、昼食にしましょう。食事を終えたら、歩いておよそ5分の御所の湯へ向かいましょう。";

const GOSHONOYU_FIND = "温泉寺からは歩いておよそ12分です。";
const GOSHONOYU_REPLACE = "城崎の温泉街からは歩いておよそ5分です。";

const ICHINOYU_FIND = "ここでも撮影は控え、湯あたりしないよう、休みながら水分をとりましょう。浴後は、このあたりの木屋町小路周辺の飲食店で昼食をとるとよいでしょう。外湯はそれぞれ開いている時間や休みの曜日が異なるため、訪れる前に公式サイトで確認しましょう。";
const ICHINOYU_REPLACE = "ここでも撮影は控え、湯あたりしないよう、休みながら水分をとりましょう。外湯はそれぞれ開いている時間や休みの曜日が異なるため、訪れる前に公式サイトで確認しましょう。";

const JIZOYU_FIND = "続いては、歩いておよそ11分のまんだら湯へ向かいましょう。";
const JIZOYU_REPLACE = "続いては、歩いておよそ4分の柳湯へ向かいましょう。";

const YANAGIYU_FIND = "まんだら湯からは歩いておよそ7分です。";
const YANAGIYU_REPLACE = "地蔵湯からは歩いておよそ4分です。";

const SHINKORO_FIND = "コウノトリの郷公園からは、車でおよそ20分です。";
const SHINKORO_REPLACE = "コウノトリの郷公園からは、車でおよそ24分です。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [bungeikan, onsenji, goshonoyu, ichinoyu, jizoyu, yanagiyu, shinkoro] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: BUNGEIKAN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: ONSENJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: GOSHONOYU_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: ICHINOYU_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: JIZOYU_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: YANAGIYU_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SHINKORO_ID } }),
  ]);

  for (const [label, text, find] of [
    ["城崎文芸館", bungeikan.memo ?? "", BUNGEIKAN_FIND],
    ["温泉寺", onsenji.memo ?? "", ONSENJI_FIND],
    ["御所の湯", goshonoyu.memo ?? "", GOSHONOYU_FIND],
    ["一の湯", ichinoyu.memo ?? "", ICHINOYU_FIND],
    ["地蔵湯", jizoyu.memo ?? "", JIZOYU_FIND],
    ["柳湯", yanagiyu.memo ?? "", YANAGIYU_FIND],
    ["辰鼓楼", shinkoro.memo ?? "", SHINKORO_FIND],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const m = {
    bungeikan: bungeikan.memo!.replace(BUNGEIKAN_FIND, BUNGEIKAN_REPLACE),
    onsenji: onsenji.memo!.replace(ONSENJI_FIND, ONSENJI_REPLACE),
    goshonoyu: goshonoyu.memo!.replace(GOSHONOYU_FIND, GOSHONOYU_REPLACE),
    ichinoyu: ichinoyu.memo!.replace(ICHINOYU_FIND, ICHINOYU_REPLACE),
    jizoyu: jizoyu.memo!.replace(JIZOYU_FIND, JIZOYU_REPLACE),
    yanagiyu: yanagiyu.memo!.replace(YANAGIYU_FIND, YANAGIYU_REPLACE),
    shinkoro: shinkoro.memo!.replace(SHINKORO_FIND, SHINKORO_REPLACE),
  };

  console.log("=== #91 初日・最終日の見直し ===\n");
  console.log("--- 初日(まんだら湯を外す。新規スポット「城崎の温泉街で昼食」) ---");
  console.log("1. 城崎文芸館 10:50(20分←30分):");
  console.log(m.bungeikan.slice(0, 100));
  console.log("2. 城崎温泉ロープウェイ 11:25(20分←25分)");
  console.log("3. 温泉寺 11:55(40分、変更なし):");
  console.log(m.onsenji.slice(-60));
  console.log("4. (新規)城崎の温泉街で昼食 12:50(45分、観光協会の点):");
  console.log(LUNCH_MEMO);
  console.log("5. 御所の湯 13:40(55分←70分):");
  console.log(m.goshonoyu.slice(0, 40));
  console.log("6. 一の湯 14:39(75分←90分):");
  console.log(m.ichinoyu.slice(-100));
  console.log("7. 地蔵湯 15:59(32分←50分):");
  console.log(m.jizoyu.slice(-40));
  console.log("8. 柳湯(最後) 16:35(25分←40分、終了17:00):");
  console.log(m.yanagiyu.slice(0, 40));

  console.log("\n--- 2日目(最終日、変更なし。移動を実測で直す) ---");
  console.log("辰鼓楼:", m.shinkoro.slice(0, 40));
  console.log("出石永楽館: 45→41分(-4分で吸収)。終了16:34(見直す前と同じ)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      DAY1_ID,
      [
        { id: BUNGEIKAN_ID, data: { visitTime: t(10, 50), stayDurationMin: 20, memo: m.bungeikan } },
        { id: ROPEWAY_ID, data: { visitTime: t(11, 25), stayDurationMin: 20 } },
        {
          id: ONSENJI_ID,
          data: { visitTime: t(11, 55), stayDurationMin: 40, memo: m.onsenji, lat: 35.623948, lng: 134.800441 },
        },
        {
          create: {
            name: "城崎の温泉街で昼食",
            visitTime: t(12, 50),
            stayDurationMin: 45,
            lat: 35.6252454,
            lng: 134.8105817,
            memo: LUNCH_MEMO,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
          },
        },
        {
          id: GOSHONOYU_ID,
          data: {
            visitTime: t(13, 40),
            stayDurationMin: 55,
            memo: m.goshonoyu,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
          },
        },
        { id: ICHINOYU_ID, data: { visitTime: t(14, 39), stayDurationMin: 75, memo: m.ichinoyu } },
        {
          id: JIZOYU_ID,
          data: { visitTime: t(15, 59), stayDurationMin: 32, memo: m.jizoyu },
        },
        {
          id: YANAGIYU_ID,
          data: {
            visitTime: t(16, 35),
            stayDurationMin: 25,
            memo: m.yanagiyu,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
          },
        },
      ],
      { remove: [MANDARAYU_ID], tx }
    );

    await tx.spot.update({
      where: { id: SHINKORO_ID },
      data: { memo: m.shinkoro, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 24 }] } },
    });
    await tx.spot.update({ where: { id: EIRAKUKAN_ID }, data: { stayDurationMin: 41 } });
  }, { timeout: 60000 });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
