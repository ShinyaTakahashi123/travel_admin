/**
 * #89 鶴ヶ城と大内宿、五色沼もめぐる会津・磐梯3泊4日 (c3b9522c-ed27-4728-bf23-8eab5f95b521)
 * 初日・最終日の見直し。
 *
 * 初日: 入口(会津若松駅)の到着時刻の記載がなく09:00開始だったため、入口10:35ごろ着+バス10分
 * (法務の指摘で10:45、もとの10:40から5分遅く)で1か所目を10:45に直す。白虎隊記念館は説明文に
 * 名前がないため外す(さざえ堂→会津武家屋敷の移動は「山を下りて徒歩5分+バス20分」の2本に
 * 分ける)。遅れの吸収は、内容の多い会津武家屋敷(110→75)・御薬園(45→35)・鶴ヶ城(70→50)に
 * 多めに割り、終了は変更前と同じ17:00に収める。会津武家屋敷の食事処で昼食(13:35発)。
 * 東山温泉の足湯に、ほかの方を撮らない旨の一言を追記する。
 *
 * 最終日: 2泊以上の最終日の決まり(最後のスポットを出るのが14:30〜15:00)に対し、現状は
 * 旧滝沢本陣・福島県立博物館・野口英世青春館・福西本店の4か所を回ってから猪苗代へ向かう形で、
 * 終了が16:50と約2時間20分遅い。4か所とも説明文に名前があったため、企画運営の判断で、
 * 旧滝沢本陣・福西本店を外し、説明文も直す(残す福島県立博物館・野口英世青春館の時間を手厚く
 * する)。1か所目は、もとの開始(09:00)より早めず、福島県立博物館の開館時刻(公式で9:30)に
 * 合わせて09:30開始。会津若松駅からの入口のバスは約25分(研究: 20〜30分の目安)。
 * 野口英世青春館から七日町駅は実測(routed-foot)で13分。七日町駅→猪苗代駅の電車70分は
 * もとの値のまま(変更しない)。猪苗代駅に着いたら、昼食のための新しいスポット
 * 「猪苗代駅前で昼食」(駅前の点、店ではない)を立てる。そこから土津神社へは、もとの徒歩40分
 * ではなく、バスの便がないためタクシー(OSRM実測4.3分+呼ぶ余裕で8分)に直す(説明文の移動の
 * 書き方に「一部タクシー」を追記)。はじまりの美術館の滞在は、法務の指摘で30分(もとの値)に
 * 戻し、最後のスポットを出るのが14:31(14:30〜15:00の決まりに合う)、猪苗代駅に14:56着とする。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-89-c3b9522c.ts
 *   反映: npm run prod -- npx tsx prisma/fix-89-c3b9522c.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "c3b9522c-ed27-4728-bf23-8eab5f95b521";

const DAY1_ID = "0bee4921-aaec-47cd-8d38-e904ff9d0b8e";
const DAY4_ID = "092a926a-61b0-47d7-8a92-e096533d9990";

const IIMORIYAMA_ID = "f954ae6a-464b-4877-8815-bca2844bfbb1";
const SAZAEDO_ID = "c2a0087c-b3ed-47a1-a5c3-7bd57df1d245";
const BYAKKOTAI_ID = "8b52bfa4-0494-482a-a0fb-0962d3c5d061";
const BUKEYASHIKI_ID = "ec3dd3bd-934e-44cb-adfa-20fa3f2caff6";
const GOYAKUEN_ID = "b97189c0-ea3c-45fd-bbef-182d471dfdba";
const TSURUGAJO_ID = "ffbfa517-cac6-4c64-b013-7187ef543606";
const RINKAKU_ID = "87868327-d2c7-493c-b4a6-cd3ab2efb91b";
const HIGASHIYAMA_ID = "9e4ff654-2a81-45f5-949c-b6395c32594a";

const TAKIZAWAHONJIN_ID = "47383e71-3312-4549-b83a-69f295673572";
const FUKUSHIMAHAKUBUTSUKAN_ID = "cec1ac0d-786a-4386-a80a-c004ca58c79e";
const SEISHUNKAN_ID = "9f5d2931-e121-42d8-8a87-cc8290b098c4";
const FUKUNISHIHONTEN_ID = "4b023c86-d080-4f4a-a2df-fd19d74873d7";
const DOTSUJINJA_ID = "c4d8f296-86fd-40f6-bcd5-965e325015f5";
const HAJIMARI_ID = "f0f670be-6df2-4dfb-8bdc-c35027a57733";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const IIMORIYAMA_FIND = "会津の旅は、会津若松駅から周遊バス「あかべぇ」で10分ほどの飯盛山下から始まります。";
const IIMORIYAMA_REPLACE = "会津の旅は、会津若松駅に10:35ごろ着いたら、まちなか周遊バスで10分ほどの飯盛山下から始まります。";

const BUKEYASHIKI_FIND = "飯盛山下から周遊バス「あかべぇ」で会津武家屋敷前へ。";
const BUKEYASHIKI_REPLACE = "さざえ堂から山を下りて飯盛山下へ(徒歩約5分)、まちなか周遊バスで会津武家屋敷前へ(バス約20分)。";

const HIGASHIYAMA_FIND = "温泉街を流れる湯川沿いには、川面を眺めながら休める足湯があり、雨降り滝をはじめとする「東山の四大滝」も流れ落ちます。";
const HIGASHIYAMA_REPLACE = "温泉街を流れる湯川沿いには、川面を眺めながら休める足湯があり(入るときは、ほかの方を撮らないようにしましょう)、雨降り滝をはじめとする「東山の四大滝」も流れ落ちます。";

const HAKUBUTSUKAN_FIND = "飯盛山下から周遊バス「あかべぇ」で鶴ヶ城三の丸口へ。降りてすぐ、";
const HAKUBUTSUKAN_REPLACE =
  "最終日は、会津若松駅からまちなか周遊バスで約25分の鶴ヶ城三の丸口から始めます。開館の時刻は公式の案内で確かめましょう。降りてすぐ、";

const DOTSUJINJA_FIND =
  "福西本店から歩いて約15分の七日町駅から、只見線で会津若松駅へ出て、JR磐越西線で猪苗代駅へ。帰り道に、猪苗代の町に立ち寄ります。駅から磐梯山の方へ歩いて約40分、";
const DOTSUJINJA_REPLACE =
  "野口英世青春館から歩いて約13分の七日町駅から、只見線で会津若松駅へ出て、JR磐越西線で猪苗代駅へ。帰り道に、猪苗代の町に立ち寄ります。駅前で昼食をとったら、駅から神社までは歩くと約40分かかるので、タクシーで約8分です(前もって呼んでおくと安心です)。";

const DESC_FIND =
  "4日目は旧滝沢本陣や県立博物館、野口英世青春館、商家の蔵が残る福西本店を訪ね、帰り道に猪苗代の土津神社とはじまりの美術館へ。電車とバスでめぐる会津・磐梯の3泊4日です。";
const DESC_REPLACE =
  "4日目は福島県立博物館から野口英世青春館を訪ね、帰り道に猪苗代の土津神社とはじまりの美術館へ。電車とバス、一部タクシーでめぐる会津・磐梯の3泊4日です。";

const LUNCH_MEMO =
  "猪苗代駅に着いたら、駅のまわりで昼食にしましょう。駅前には食事のできる店が何軒かあります。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [itinerary, iimoriyama, bukeyashiki, higashiyama, hakubutsukan, dotsujinja] = await Promise.all([
    prisma.itinerary.findFirstOrThrow({ where: { id: ITINERARY_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: IIMORIYAMA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: BUKEYASHIKI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: HIGASHIYAMA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: FUKUSHIMAHAKUBUTSUKAN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: DOTSUJINJA_ID } }),
  ]);

  for (const [label, text, find] of [
    ["説明文", itinerary.description ?? "", DESC_FIND],
    ["飯盛山", iimoriyama.memo ?? "", IIMORIYAMA_FIND],
    ["会津武家屋敷", bukeyashiki.memo ?? "", BUKEYASHIKI_FIND],
    ["東山温泉", higashiyama.memo ?? "", HIGASHIYAMA_FIND],
    ["福島県立博物館", hakubutsukan.memo ?? "", HAKUBUTSUKAN_FIND],
    ["土津神社", dotsujinja.memo ?? "", DOTSUJINJA_FIND],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newDescription = itinerary.description!.replace(DESC_FIND, DESC_REPLACE);
  const newIimoriyamaMemo = iimoriyama.memo!.replace(IIMORIYAMA_FIND, IIMORIYAMA_REPLACE);
  const newBukeyashikiMemo = bukeyashiki.memo!.replace(BUKEYASHIKI_FIND, BUKEYASHIKI_REPLACE);
  const newHigashiyamaMemo = higashiyama.memo!.replace(HIGASHIYAMA_FIND, HIGASHIYAMA_REPLACE);
  const newHakubutsukanMemo = hakubutsukan.memo!.replace(HAKUBUTSUKAN_FIND, HAKUBUTSUKAN_REPLACE);
  const newDotsujinjaMemo = dotsujinja.memo!.replace(DOTSUJINJA_FIND, DOTSUJINJA_REPLACE);

  console.log("=== #89 初日・最終日の見直し ===\n");
  console.log("--- 説明文(4日目部分+移動) ---");
  console.log(newDescription);

  console.log("\n--- 初日(白虎隊記念館を外す) ---");
  console.log("1. 飯盛山 10:45(40分、入口を追加):");
  console.log(newIimoriyamaMemo);
  console.log("\n2. さざえ堂 11:30(25分、変更なし)");
  console.log("3. 会津武家屋敷 12:20(75分←110分、昼食13:35発):");
  console.log(newBukeyashikiMemo);
  console.log("4. 御薬園 13:50(35分←45分)");
  console.log("5. 鶴ヶ城 14:45(50分←70分)");
  console.log("6. 茶室麟閣 15:40(25分、変更なし)");
  console.log("7. 東山温泉(最後) 16:25(35分、終了17:00):");
  console.log(newHigashiyamaMemo);

  console.log("\n--- 最終日(旧滝沢本陣・福西本店を外す) ---");
  console.log("1. 福島県立博物館 09:30(60分、開館時刻から):");
  console.log(newHakubutsukanMemo);
  console.log("2. 野口英世青春館 10:45(35分、変更なし)");
  console.log("3. (新規)猪苗代駅前で昼食 12:43(35分、徒歩13分+電車70分で到着):");
  console.log(LUNCH_MEMO);
  console.log("4. 土津神社 13:26(20分、タクシー8分に変更):");
  console.log(newDotsujinjaMemo);
  console.log("5. はじまりの美術館(最後) 14:01(30分←もとの30分に戻す、14:31発、猪苗代駅14:56着)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: newDescription } });

    await setDaySpotOrder(
      DAY1_ID,
      [
        { id: IIMORIYAMA_ID, data: { visitTime: t(10, 45), stayDurationMin: 40, memo: newIimoriyamaMemo } },
        { id: SAZAEDO_ID, data: { visitTime: t(11, 30), stayDurationMin: 25 } },
        {
          id: BUKEYASHIKI_ID,
          data: {
            visitTime: t(12, 20),
            stayDurationMin: 75,
            memo: newBukeyashikiMemo,
            transitLegs: {
              deleteMany: {},
              create: [
                { orderNo: 1, transitMode: "walk", transitDurationMin: 5 },
                { orderNo: 2, transitMode: "bus", transitDurationMin: 20, transitLine: "まちなか周遊バス あかべぇ（飯盛山下→会津武家屋敷前）" },
              ],
            },
          },
        },
        { id: GOYAKUEN_ID, data: { visitTime: t(13, 50), stayDurationMin: 35 } },
        { id: TSURUGAJO_ID, data: { visitTime: t(14, 45), stayDurationMin: 50 } },
        { id: RINKAKU_ID, data: { visitTime: t(15, 40), stayDurationMin: 25 } },
        { id: HIGASHIYAMA_ID, data: { visitTime: t(16, 25), stayDurationMin: 35, memo: newHigashiyamaMemo } },
      ],
      { remove: [BYAKKOTAI_ID], tx }
    );

    await setDaySpotOrder(
      DAY4_ID,
      [
        {
          id: FUKUSHIMAHAKUBUTSUKAN_ID,
          data: {
            visitTime: t(9, 30),
            stayDurationMin: 60,
            memo: newHakubutsukanMemo,
            transitLegs: {
              deleteMany: {},
              create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 25, transitLine: "まちなか周遊バス あかべぇ（会津若松駅前→鶴ヶ城三の丸口）" }],
            },
          },
        },
        { id: SEISHUNKAN_ID, data: { visitTime: t(10, 45), stayDurationMin: 35 } },
        {
          create: {
            name: "猪苗代駅前で昼食",
            visitTime: t(12, 43),
            stayDurationMin: 35,
            lat: 37.5463239,
            lng: 140.1032381,
            memo: LUNCH_MEMO,
            transitLegs: {
              create: [
                { orderNo: 1, transitMode: "walk", transitDurationMin: 13 },
                {
                  orderNo: 2,
                  transitMode: "train",
                  transitDurationMin: 70,
                  transitLine: "JR只見線（七日町→会津若松）・JR磐越西線（会津若松→猪苗代）",
                },
              ],
            },
          },
        },
        {
          id: DOTSUJINJA_ID,
          data: {
            visitTime: t(13, 26),
            stayDurationMin: 20,
            memo: newDotsujinjaMemo,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "taxi", transitDurationMin: 8 }] },
          },
        },
        { id: HAJIMARI_ID, data: { visitTime: t(14, 1), stayDurationMin: 30 } },
      ],
      { remove: [TAKIZAWAHONJIN_ID, FUKUNISHIHONTEN_ID], tx }
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
