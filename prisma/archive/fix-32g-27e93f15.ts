/**
 * #32 27e93f15（由布院）企画運営の指摘(2026-09-30 11:34): 座標は「手で動かした値」を
 * 使わない決まり。佛山寺はOSMに点がなく、周辺の道・バス停等でも見つからなかったため、
 * ご指示どおり外し、OSMに実在の点がある天祖神社(金鱗湖畔、OSM way 365948034、
 * 33.2663393,131.3696776)に差し替える。第12代景行天皇の治世(82年ごろ)創建と伝わり、
 * 霧の金鱗湖に浮かぶ鳥居はもとはこの神社の鳥居だったという由来もあり、金鱗湖と
 * つながりの深い実在のスポット。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY1_ID = "ede500a0-2990-4990-8871-ef29d2056d90";

const BUSSANJI_ID = "552dce23-8ba9-4ae6-9a6d-41cedd3dde63"; // 削除
const FLORAL_ID = "4cca95e3-f128-4b90-99f6-c3d04c362c42";

const YUNOTSUBO_MEMO_NEW =
  "COMICO ART MUSEUM YUFUINから歩いておよそ9分、湯の坪街道に着きます。金鱗湖まで、およそ800mにわたって続く由布院温泉のメインストリートで、カフェや雑貨店、食べ歩きグルメの店などおよそ70以上が軒を連ねています。かつて小さな山あいの温泉街だった由布院は、昭和27年(1952)に持ち上がったダム建設計画に地元の人々が反対し、自然豊かな景観を生かした観光地づくりを選んだことから、今の姿へと発展してきました。この通りは、平成に入ってから本格的に賑わいを見せるようになったといわれています。冬場は行き交う人の吐く息も白く、あたりに立ちこめる湯けむりが、いっそう温泉地らしい風情を醸し出します。続いては天祖神社へ向かいましょう。";

const TENSO_MEMO =
  "湯の坪街道から歩いておよそ2分、金鱗湖の湖畔に佇む天祖神社に着きます。第12代景行天皇の治世(82年ごろ)の創建と伝わり、およそ2000年の歴史を持つとされる神社です。天之御中主神をはじめとする神々を祀り、湖に安住の地を求めた龍にまつわる言い伝えも残っています。霧に包まれた金鱗湖に浮かぶ鳥居は、もとはこの神社の鳥居で、明治の神仏分離のあと、湖の中に移されたと伝えられています。静かに、敬意をもってお参りください。この後は、歩いておよそ7分、由布院フローラルヴィレッジへ向かいましょう。";

const FLORAL_MEMO_NEW =
  "天祖神社から歩いておよそ7分、英国の街並みをイメージした由布院フローラルヴィレッジに着きます。石畳の小径に、色とりどりの花と小さな洋風の建物が並び、雑貨店やスイーツ店、動物とふれあえる施設などが軒を連ねています。写真映えする街並みを、ゆっくりと散策してみてください。軽食を楽しめるお店もあるので、ここでお昼をとるのもおすすめです。続いては宇奈岐日女神社へ向かいましょう。";

async function main() {
  const spots: SpotOrderItem[] = [
    { id: "ed65cc48-464e-4b14-aa61-a8adb46d4426", data: {} }, // 由布院駅
    { id: "f941000c-0be8-4cd8-8c48-a807b3b86fc0", data: {} }, // COMICO
    { id: "e1497db9-5d65-4abd-8f4c-774bbf45b22e", data: { memo: YUNOTSUBO_MEMO_NEW } }, // 湯の坪街道(時刻は変わらず)
    {
      create: {
        name: "天祖神社",
        address: "大分県由布市湯布院町川上",
        lat: 33.2663393,
        lng: 131.3696776,
        memo: TENSO_MEMO,
        visitTime: t(11, 51),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    { id: FLORAL_ID, data: { memo: FLORAL_MEMO_NEW, visitTime: t(12, 23), stayDurationMin: 90, transitMode: "walk", transitDurationMin: 7 } },
    { id: "7add311e-aa32-4415-b20f-8691f7da20be", data: { visitTime: t(14, 8), stayDurationMin: 40 } }, // 宇奈岐日女神社
    { id: "bdb2e3bf-f55e-4c65-8b9d-498f9594fb4d", data: { visitTime: t(14, 53), stayDurationMin: 50 } }, // ステンドグラス美術館
    { id: "bfabbeec-a1f9-445e-ad23-474e80e76877", data: { visitTime: t(15, 59), stayDurationMin: 40 } }, // 大杵社
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt || st == null) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY1_ID, spots, { remove: [BUSSANJI_ID], tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
