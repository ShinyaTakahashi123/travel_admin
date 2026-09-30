/**
 * #32 27e93f15（由布院）企画運営の指摘(2026-09-30 11:29): COMICO ART MUSEUM
 * YUFUINは本文でも「小さな美術館」と書きながら85分にしており、決まりA(滞在で
 * 空いた時間を埋める)に当たる。60分に戻し、空いた25分は実在の行き先で埋める。
 *
 * 佛山寺(実在、臨済宗妙心寺派、康保年間964〜968創建と伝わる、茅葺きの山門、
 * 由布岳信仰の中心地)を、湯の坪街道とフローラルヴィレッジの間に追加。
 * 座標: 公式サイト(YUFUINFO)の「金鱗湖の南端からおよそ300m南」の記述をもとに、
 * 金鱗湖の座標から南へ300m移動した地点を代替アンカーとして使用(Nominatimでは
 * 住所からヒットせず。#24の箱根町港と同じ方法)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY1_ID = "ede500a0-2990-4990-8871-ef29d2056d90";

const COMICO_ID = "f941000c-0be8-4cd8-8c48-a807b3b86fc0";
const YUNOTSUBO_ID = "e1497db9-5d65-4abd-8f4c-774bbf45b22e";
const FLORAL_ID = "4cca95e3-f128-4b90-99f6-c3d04c362c42";

const YUNOTSUBO_MEMO_NEW =
  "COMICO ART MUSEUM YUFUINから歩いておよそ9分、湯の坪街道に着きます。金鱗湖まで、およそ800mにわたって続く由布院温泉のメインストリートで、カフェや雑貨店、食べ歩きグルメの店などおよそ70以上が軒を連ねています。かつて小さな山あいの温泉街だった由布院は、昭和27年(1952)に持ち上がったダム建設計画に地元の人々が反対し、自然豊かな景観を生かした観光地づくりを選んだことから、今の姿へと発展してきました。この通りは、平成に入ってから本格的に賑わいを見せるようになったといわれています。冬場は行き交う人の吐く息も白く、あたりに立ちこめる湯けむりが、いっそう温泉地らしい風情を醸し出します。続いては佛山寺へ向かいましょう。";

const BUSSANJI_MEMO =
  "湯の坪街道から歩いておよそ4分、佛山寺に着きます。臨済宗妙心寺派の寺院で、康保年間(964〜968)に、由布岳の山腹で鳴り響く岩から僧・性空が仏像を彫り出したのが始まりと伝えられています。茅葺き屋根の山門が印象的で、由布岳信仰の中心地として、古くから人々に大切にされてきました。静かに、敬意をもってお参りください。この後は、歩いておよそ8分、由布院フローラルヴィレッジへ向かいましょう。";

const FLORAL_MEMO_NEW =
  "佛山寺から歩いておよそ8分、英国の街並みをイメージした由布院フローラルヴィレッジに着きます。石畳の小径に、色とりどりの花と小さな洋風の建物が並び、雑貨店やスイーツ店、動物とふれあえる施設などが軒を連ねています。写真映えする街並みを、ゆっくりと散策してみてください。軽食を楽しめるお店もあるので、ここでお昼をとるのもおすすめです。続いては宇奈岐日女神社へ向かいましょう。";

async function main() {
  const spots: SpotOrderItem[] = [
    { id: "ed65cc48-464e-4b14-aa61-a8adb46d4426", data: {} }, // 由布院駅
    { id: COMICO_ID, data: { stayDurationMin: 60 } },
    { id: YUNOTSUBO_ID, data: { memo: YUNOTSUBO_MEMO_NEW, visitTime: t(10, 49), stayDurationMin: 60 } },
    {
      create: {
        name: "佛山寺",
        address: "大分県由布市湯布院町川上",
        lat: 33.263972,
        lng: 131.369167,
        memo: BUSSANJI_MEMO,
        visitTime: t(11, 53),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    { id: FLORAL_ID, data: { memo: FLORAL_MEMO_NEW, visitTime: t(12, 26), stayDurationMin: 90, transitMode: "walk", transitDurationMin: 8 } },
    { id: "7add311e-aa32-4415-b20f-8691f7da20be", data: { visitTime: t(14, 11), stayDurationMin: 40 } }, // 宇奈岐日女神社
    { id: "bdb2e3bf-f55e-4c65-8b9d-498f9594fb4d", data: { visitTime: t(14, 56), stayDurationMin: 50 } }, // ステンドグラス美術館
    { id: "bfabbeec-a1f9-445e-ad23-474e80e76877", data: { visitTime: t(16, 2), stayDurationMin: 40 } }, // 大杵社
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
    await setDaySpotOrder(DAY1_ID, spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
