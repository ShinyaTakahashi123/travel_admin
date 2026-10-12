/**
 * #354の続き。企画運営10/11 9:44・法務10/11 10:05(記録bf97983)の指摘に対応(Day1分)。
 *
 * 【法務の指摘】
 * - 歓会門の座標は案内板(board)の点だった。実際の建物(way 168659880「歓会門」)の
 *   中心26.2177965,127.7177945に修正。
 * - 「首里の食事処で昼食」の座標が、前の「首里そば」の店の場所(OSMでは隣の駐車場)の
 *   ままだった。店でない点として、首里城公園の座標(26.2174337,127.7191031)に修正。
 *   これにより玉陵からの距離が約451mに変わるため、移動時間も6分に修正
 *   (企画運営が示した「徒歩約10分」は、直す前の座標(約750m)をもとにした指摘だった)。
 *
 * 【企画運営の指摘】
 * - 首里城公園: 正殿は2026年11月23日から公開予定で、「今も再建工事が続いています」
 *   「見せる復興」「展示室」は時期で変わる書き方だった。#41(2b09beea)の書き方にならい、
 *   工事の状態そのものには触れず、時期で変わらない書き方に直した。
 * - 玉陵: 伝聞の「だったそうです」を「でした」に、話しかける「少しややこしいですが、
 *   …覚えておきましょう」の一文を削除。
 *
 * 新しい時刻(09:00〜16:30、12か所):
 * 09:00 首里城公園(55) → 09:58 歓会門(18) → 10:19 円覚寺跡(20) → 10:41 弁財天堂円鑑池(15)
 * → 10:58 久慶門(18) → 11:18 園比屋武御嶽石門(15) → 11:37 玉陵(46) → 12:29 首里の食事処(45)
 * → 13:16 継世門(18) → 13:40 石畳道(40) → 14:30 識名宮(20) → 15:00 識名園(90) → 16:30
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-354i-b9b5d943.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b9b5d943-e02a-4013-95e8-89ca62f50842";

const SHURIJO_ID = "e755d32a-02a7-499e-a77d-2f66c897d7ad";
const TAMAUDUN_ID = "c24d3305-ef33-46e7-a64c-19f9ed0ae671";
const SHOKUJI_ID = "2e4ce302-40bb-4011-a922-1e3cb8ca481e";
const KEISEIMON_NAME = "継世門";
const ISHIDATAMI_ID = "58e30032-0cff-4223-baf8-ef14eac6af8e";
const SHIKINAGU_ID = "d565a129-63d4-4a87-bfd0-5d07d7def7b4";
const SHIKINAEN_ID = "2bfbaa2c-fcaa-46e8-a942-64ca9a5cbb2a";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const shurijo = await prisma.spot.findUniqueOrThrow({ where: { id: SHURIJO_ID } });
  const marker = "復元の工事が進められてきました";
  if (shurijo.memo?.includes(marker)) {
    console.log("already applied, skipping");
    return;
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: SHURIJO_ID }, {
    memo: "ゆいレール首里駅から徒歩約15分、2泊3日の那覇めぐりは首里城公園から始まります。首里城跡(公園)自体は今も開園していて、2019年10月の火災で焼失した正殿は、復元の工事が進められてきました。見学できる範囲や正殿の公開状況は時期によって変わるので、出かける前に首里城公園の公式案内で確かめましょう。世界遺産「琉球王国のグスク及び関連遺産群」の構成資産は首里城跡・園比屋武御嶽石門・玉陵・識名園・今帰仁城跡・勝連城跡・座喜味城跡・中城城跡・斎場御嶽の9資産からなり、首里城跡について世界遺産の登録対象になっているのは、焼失した木造の正殿の建物そのものではなく、その地下に眠る「正殿基壇遺構」です。建物が失われても、登録は取り消されていません。まずはこの広大な城跡を歩き、これから巡る世界遺産の旅の始まりを感じましょう。次は、城郭の正門にあたる歓会門へ向かいます。",
  });

  const kankaimon = await prisma.spot.findFirstOrThrow({ where: { name: "歓会門", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: kankaimon.id }, { lat: 26.2177965, lng: 127.7177945 });

  const tamaudun = await prisma.spot.findUniqueOrThrow({ where: { id: TAMAUDUN_ID } });
  const old1 = "これは沖縄県内の建造物としては初めての国宝指定だったそうです。世界遺産の登録と国宝指定は別の制度なので、少しややこしいですが、両方の価値が認められた貴重な文化財だということを覚えておきましょう。";
  const new1 = "これは沖縄県内の建造物としては初めての国宝指定でした。世界遺産の登録と国宝指定は別の制度で、玉陵は両方の価値が認められた貴重な文化財です。";
  if (!tamaudun.memo?.includes(old1)) throw new Error("玉陵: anchor not found");
  await updateSpotInItinerary(ITIN_ID, { spotId: TAMAUDUN_ID }, {
    memo: tamaudun.memo.replace(old1, new1),
    transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
  });

  await updateSpotInItinerary(ITIN_ID, { spotId: SHOKUJI_ID }, {
    name: "首里の食事処で昼食",
    address: "沖縄県那覇市首里当蔵町(首里城公園周辺)",
    lat: 26.2174337,
    lng: 127.7191031,
    visitTime: T(12, 29),
    transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
  });

  const keiseimon = await prisma.spot.findFirstOrThrow({ where: { name: KEISEIMON_NAME, day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: keiseimon.id }, {
    visitTime: T(13, 16),
    transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
  });

  await updateSpotInItinerary(ITIN_ID, { spotId: ISHIDATAMI_ID }, { visitTime: T(13, 40) });
  await updateSpotInItinerary(ITIN_ID, { spotId: SHIKINAGU_ID }, { visitTime: T(14, 30) });
  await updateSpotInItinerary(ITIN_ID, { spotId: SHIKINAEN_ID }, { visitTime: T(15, 0) });

  console.log("Day1: 首里城公園の書き方・玉陵の口調を直し、歓会門・食事処の座標を実点に、時刻を4分前倒しして16:30着地");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
