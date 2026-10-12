/**
 * #197 8662231d の続き（しおりえ(制作補助2)）: 長浜城歴史博物館の滞在90分は長すぎるので60分にし、最後に博物館を囲む豊公園を足して 16:32 に終える
 *   帰りの一言は豊公園に移す
 * 本文の出典: 滋賀県の観光公式サイト biwako-visitors.jp/spot/detail/850/ 豊公園（江戸時代前期に廃城となった長浜城の跡に明治42年に作られた公園・長浜城主だった豊太閤・豊臣秀吉にちなんで名付けられた・
 *   園内に長浜城歴史博物館、音楽が流れる洋風庭園や噴水、児童公園、テニスコート・JR長浜駅から歩いて8分・出入り自由）
 *   長浜のほかのしおり（3993afce）の豊公園の本文（約600本の桜・さくら名所100選・湖岸の遊歩道と竹生島）は使わない
 * 座標: OSM 豊公園 way 27189105（leisure=park、Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-197b-8662231d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "8662231d-f119-4190-aa1d-b9b4d1ed051e";
const DAY1_ID = "c6048113-ec09-461b-a063-3c514d82bc6a";
const COMMIT = process.argv.includes("--commit");
const MUSEUM = "長浜城歴史博物館";
const FROM = "入館の時間と休館日は公式の案内で確かめましょう。帰りは、長浜駅まで歩いて約8分です。";
const TO = "入館の時間と休館日は公式の案内で確かめましょう。";
const PARK_MEMO =
  "博物館を出てすぐ。江戸時代の初めに廃城となった長浜城の跡に、明治42年に開かれた公園で、長浜城主だった豊臣秀吉にちなんで「豊公園」と名付けられました。博物館のまわりには、噴水のある洋風の庭や子どもの遊び場があり、旅の終わりにひと息つけます。帰りは、長浜駅まで歩いて約8分です。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: DAY1_ID }, orderBy: { orderNo: "asc" } });
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID } });
  console.log(`対象: ${it.title}`);
  if (spots.length !== 8 || spots[7].name !== MUSEUM) throw new Error("構成が想定と違います");
  const m = spots[7];
  if ((m.memo ?? "").split(FROM).length !== 2) throw new Error("直す文が見つからない");
  const museumMemo = (m.memo ?? "").replace(FROM, TO);
  console.log(`${MUSEUM} 15:00-16:00\n  ${museumMemo}\n豊公園 16:02-16:32 walk2\n  ${PARK_MEMO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(
        DAY1_ID,
        [
          ...spots.slice(0, 7).map((s) => ({ id: s.id, data: {} })),
          { id: m.id, data: { stayDurationMin: 60, memo: museumMemo } },
          {
            create: {
              name: "豊公園",
              visitTime: new Date(Date.UTC(1970, 0, 1, 16, 2)),
              stayDurationMin: 30,
              lat: 35.3762635,
              lng: 136.2625104,
              address: "滋賀県長浜市公園町",
              memo: PARK_MEMO,
              transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2, transitLine: null }] },
            },
          },
        ],
        { tx }
      );
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
