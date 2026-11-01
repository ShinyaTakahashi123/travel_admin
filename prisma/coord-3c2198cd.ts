/**
 * 日帰りの座標の直し（A）: 3c2198cd（しまなみ海道サイクリング、尾道から瀬戸内の島々を走るプラン・日帰り）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md。点だけを直す（約130mの移動で、次の区間（自転車 other40）・時刻・文は変わらない）
 * - 尾道市街地～向島（しまなみ海道起点） 34.4053,133.1917（4けた。名前のある地物の点ではない）→ OSM「尾道」railway=station node8122138840 34.4048206,133.1931084
 *   （スポットは尾道の市街地からしまなみ海道へ走り出す広い場所で、名前のある地物がないため、旅を歩き始める駅の点にする。広い場所の例外として一覧に書く。
 *    同じ名前の node13344696295 は abandoned:railway=station なので使わない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-3c2198cd.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("3c2198cd-cbc8-4002-99b5-01e1f4342803", [
  {
    id: "b63ca5bf-e421-45cc-b669-973a90658822",
    label: "尾道市街地～向島（しまなみ海道起点）",
    point: { from: [34.4053, 133.1917], to: [34.4048206, 133.1931084], source: "OSM 尾道 railway=station node8122138840" },
  },
]);
