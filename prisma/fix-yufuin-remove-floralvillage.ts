/**
 * #27e93f15(金鱗湖の朝霧と由布院温泉、別府の地獄めぐりへ 冬の湯どころ1泊2日)Day1の
 * 由布院フローラルヴィレッジを外す(企画運営の判断、2026-11-02)。
 *
 * 理由: 由布市・大分県の公式観光ページ、施設自身の公式サイトのいずれも見つからず、
 * メモの事実(英国コッツウォルズ風の街並みなど)を公式で確かめられなかった。代わりの候補
 * (佛山寺・九州湯布院民芸村)も同様に公式で確かめられず、C(外して組み直す)を選んだ。
 *
 * 【1回目の組み直し(差し戻し)】天祖神社→宇奈岐日女神社を直接測り直すと22分。フローラル
 * ヴィレッジを外すとその分1日目の終わりが早まりすぎるため、始まりを10:45→11:44に遅らせて
 * 吸収したが、法務の確認で「1日目の昼食の一文がフローラルヴィレッジのメモにしかなく、
 * 外すと1日目に昼食が無くなる」と指摘された(各日に昼食の一文が必要)。湯の坪街道(30分)に
 * そのまま昼食を入れるのは短すぎ、滞在を延ばすのは決まりAで不可のため、法務の案・企画運営の
 * 決定どおり、次の形に直す:
 *   - 始まりを11:04ごろに早める(初日の決まり10:45〜11:45の範囲内)
 *   - 湯の坪街道のすぐ手前に、名前のある地物(店ではない点)「湯の坪橋」を新規スポットとして
 *     追加し、そこで昼食(視察12:20、11:30〜13:30の範囲内、滞在40分=決まりの35〜45分の
 *     範囲内。44分は終わりを16:30にそろえるための数に見えるという法務の指摘で40分に、
 *     その分始まりを11:00→11:04に変更。終わりの16:30は変わらない)
 *   - 座標はOSM node3199786829。法務の確認で、この点は橋の線(way)ではなく、名前の付いた
 *     信号(highway=traffic_signals、交差点の名前)だった(この範囲に橋の線で「湯の坪橋」の
 *     名前のものはない)。昼食の点は案内図などの例外が認められているため、名前のない点の
 *     例外と同じ扱いとして記録する(「湯の坪橋＝交差点の信号の点、橋の線に名前なし」)
 *   - COMICO→湯の坪橋→湯の坪街道の2区間(routed-foot実測: 399m/5.3分→5分、
 *     310m/4.1分→4分)は、もとのCOMICO→湯の坪街道の1区間(9分)とほぼ同じ合計(9分)
 *   - 天祖神社→宇奈岐日女神社の直接の区間(routed-foot実測1632m・21.8分→22分)はそのまま
 *   - 滞在は湯の坪橋(新規、決まりの範囲内の44分)以外、どこも延ばしていない。終わりは16:30で
 *     もとと同じ
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const ITIN_ID = "27e93f15-8dbe-4e72-81d5-7bcde9231b4e";

const EKI = "ed65cc48-464e-4b14-aa61-a8adb46d4426";
const COMICO = "f941000c-0be8-4cd8-8c48-a807b3b86fc0";
const YUNOTSUBO = "e1497db9-5d65-4abd-8f4c-774bbf45b22e";
const TENSO = "dce8d43f-6ac7-4390-a8ca-6bc28ff37717";
const FLORAL = "4cca95e3-f128-4b90-99f6-c3d04c362c42";
const UNAGI = "7add311e-aa32-4415-b20f-8691f7da20be";
const STAINEDGLASS = "bdb2e3bf-f55e-4c65-8b9d-498f9594fb4d";
const OOGI = "bfabbeec-a1f9-445e-ad23-474e80e76877";

const EKI_MEMO_OLD =
  "JR由布院駅に10時45分ごろ着いたら、1日目は、建築家・磯崎新氏が設計した由布院駅の駅舎からです。平成2年(1990)に竣工した木造の駅舎で、礼拝堂をイメージしたという高さ12mの吹き抜けロビーが特徴です。改札口を設けず、ホームまで一続きに抜けられる造りになっており、待合室を兼ねたアートギャラリーや、ホームの足湯も見どころです。この後は、歩いておよそ11分、COMICO ART MUSEUM YUFUINへ向かいましょう。";
const EKI_MEMO_NEW = EKI_MEMO_OLD.replace("10時45分ごろ", "11時ごろ"); // 実際のvisitTimeは11:04だが、法務の指示で表記は「11時ごろ」のまま

const YUNOTSUBOMACHI_MEMO_OLD =
  "COMICO ART MUSEUM YUFUINから歩いておよそ9分、湯の坪街道に着きます。金鱗湖まで、およそ800mにわたって続く由布院温泉のメインストリートで、カフェや雑貨店、食べ歩きグルメの店などおよそ70以上が軒を連ねています。かつて小さな山あいの温泉街だった由布院は、昭和27年(1952)に持ち上がったダム建設計画に地元の人々が反対し、自然豊かな景観を生かした観光地づくりを選んだことから、今の姿へと発展してきました。この通りは、平成に入ってから本格的に賑わいを見せるようになったといわれています。冬場は行き交う人の吐く息も白く、あたりに立ちこめる湯けむりが、いっそう温泉地らしい風情を醸し出します。続いては天祖神社へ向かいましょう。";
const YUNOTSUBOMACHI_MEMO_NEW = YUNOTSUBOMACHI_MEMO_OLD.replace(
  "COMICO ART MUSEUM YUFUINから歩いておよそ9分、湯の坪街道に着きます。",
  "湯の坪橋から歩いておよそ4分、湯の坪街道に着きます。"
);

const YUNOTSUBOBASHI_MEMO =
  "COMICO ART MUSEUM YUFUINから歩いておよそ5分、湯の坪川に架かる湯の坪橋に着きます。橋のたもとから金鱗湖へ続く湯の坪街道沿いには、食事ができる店が軒を連ねています。ここで昼食にしましょう。この後は、歩いておよそ4分、湯の坪街道へ向かいましょう。";

const TENSO_MEMO_OLD =
  "湯の坪街道から歩いておよそ8分、金鱗湖の湖畔に佇む天祖神社に着きます。第12代景行天皇の治世(82年ごろ)の創建と伝わり、およそ2000年の歴史を持つとされる神社です。天之御中主神をはじめとする神々を祀り、湖に安住の地を求めた龍にまつわる言い伝えも残っています。霧に包まれた金鱗湖に浮かぶ鳥居は、もとは近くの佛山寺の境内にあった金刀比羅神社の鳥居で、明治の神仏分離のあと、ここへ移されたと伝えられています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ8分、由布院フローラルヴィレッジへ向かいましょう。";
const TENSO_MEMO_NEW = TENSO_MEMO_OLD.replace(
  "この後は、歩いておよそ8分、由布院フローラルヴィレッジへ向かいましょう。",
  "この後は、歩いておよそ22分、宇奈岐日女神社へ向かいましょう。"
);

const UNAGI_MEMO_OLD =
  "由布院フローラルヴィレッジから歩いておよそ23分、宇奈岐日女神社に着きます。由布院盆地の総鎮守とされる古社で、6柱の神を祀っています。うっそうとした木立に囲まれた境内は、温泉街の賑わいとは違う、静かで厳かな空気に包まれています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。続いては由布院ステンドグラス美術館へ向かいましょう。";
const UNAGI_MEMO_NEW = UNAGI_MEMO_OLD.replace(
  "由布院フローラルヴィレッジから歩いておよそ23分、宇奈岐日女神社に着きます。",
  "天祖神社から歩いておよそ22分、宇奈岐日女神社に着きます。"
);

const OOGI_MEMO_OLD =
  "由布院ステンドグラス美術館から歩いておよそ18分、大杵社に着きます。宇奈岐日女神社の末社で、拝殿のかたわらにそびえる大杉は、樹齢1000年以上ともいわれ、国の天然記念物に指定されています。高さおよそ38m、幹まわりおよそ11mという堂々とした姿は、長い年月を見守ってきた由布院の自然を象徴する存在です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。由布院駅から湯の坪街道、フローラルヴィレッジとめぐった1日目は、ここで終わりです。この夜は、歩いておよそ17分の由布院駅のまわりの宿に泊まりましょう。";
const OOGI_MEMO_NEW = OOGI_MEMO_OLD.replace(
  "由布院駅から湯の坪街道、フローラルヴィレッジとめぐった1日目は、ここで終わりです。",
  "由布院駅から湯の坪街道、天祖神社とめぐった1日目は、ここで終わりです。"
);

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const day = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 }, select: { id: true } });

  const checks: { id: string; name: string; memo: string }[] = [
    { id: EKI, name: "由布院駅", memo: EKI_MEMO_OLD },
    { id: YUNOTSUBO, name: "湯の坪街道", memo: YUNOTSUBOMACHI_MEMO_OLD },
    { id: TENSO, name: "天祖神社", memo: TENSO_MEMO_OLD },
    { id: UNAGI, name: "宇奈岐日女神社", memo: UNAGI_MEMO_OLD },
    { id: OOGI, name: "大杵社", memo: OOGI_MEMO_OLD },
  ];
  for (const c of checks) {
    const spot = await prisma.spot.findUniqueOrThrow({ where: { id: c.id } });
    if (spot.name !== c.name) throw new Error(`${c.name}: name不一致`);
    if (spot.memo !== c.memo) throw new Error(`${c.name}: memo現在値が期待と不一致`);
  }

  console.log("\n--- Day1 時刻・区間(組み直し後) ---");
  console.log(
    "由布院駅 11:04(20) → COMICO ART MUSEUM YUFUIN 11:35(40,walk11) → 湯の坪橋 12:20(40,walk5、昼食) → 湯の坪街道 13:04(30,walk4) → 天祖神社 13:42(20,walk8) → 宇奈岐日女神社 14:24(30,walk22、直接測り直し) → 由布院ステンドグラス美術館 15:02(40,walk8) → 大杵社 16:00(30,walk18、終了16:30。もとと同じ)"
  );
  console.log("\n--- 文の変更箇所 ---");
  console.log(`[由布院駅] 「10時45分ごろ着いたら」→「11時ごろ着いたら」(実際のvisitTimeは11:04)`);
  console.log(`[新規: 湯の坪橋] ${YUNOTSUBOBASHI_MEMO}`);
  console.log(`[湯の坪街道] 冒頭「COMICO ART MUSEUM YUFUINから歩いておよそ9分」→「湯の坪橋から歩いておよそ4分」`);
  console.log(`[天祖神社] 末尾「歩いておよそ8分、由布院フローラルヴィレッジへ」→「歩いておよそ22分、宇奈岐日女神社へ」`);
  console.log(`[宇奈岐日女神社] 冒頭「由布院フローラルヴィレッジから歩いておよそ23分」→「天祖神社から歩いておよそ22分」`);
  console.log(`[大杵社] 「由布院駅から湯の坪街道、フローラルヴィレッジとめぐった」→「由布院駅から湯の坪街道、天祖神社とめぐった」`);
  console.log(`[削除] 由布院フローラルヴィレッジ(${FLORAL})`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(
        day.id,
        [
          { id: EKI, data: { visitTime: t(11, 4), memo: EKI_MEMO_NEW } },
          { id: COMICO, data: { visitTime: t(11, 35) } },
          {
            create: {
              name: "湯の坪橋",
              address: "大分県由布市湯布院町川上",
              lat: 33.2677036,
              lng: 131.3636026,
              memo: YUNOTSUBOBASHI_MEMO,
              visitTime: t(12, 20),
              stayDurationMin: 40,
              transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
            },
          },
          {
            id: YUNOTSUBO,
            data: {
              visitTime: t(13, 4),
              memo: YUNOTSUBOMACHI_MEMO_NEW,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
            },
          },
          { id: TENSO, data: { visitTime: t(13, 42), memo: TENSO_MEMO_NEW } },
          {
            id: UNAGI,
            data: {
              visitTime: t(14, 24),
              memo: UNAGI_MEMO_NEW,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 22 }] },
            },
          },
          { id: STAINEDGLASS, data: { visitTime: t(15, 2) } },
          { id: OOGI, data: { visitTime: t(16, 0), memo: OOGI_MEMO_NEW } },
        ],
        { remove: [FLORAL], tx }
      );
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}

main().finally(() => prisma.$disconnect());
