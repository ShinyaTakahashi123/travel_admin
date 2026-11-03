/**
 * 日帰りの座標の直し（A・B）: 578b155e（鳥羽水族館、飼育種類数は国内屈指の水族館プラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 鳥羽水族館 34.481528,136.845778（秒の形）→ OSM tourism=aquarium way183967154 34.4820148,136.8453304（約68m）
 * 歩く時間（routed-foot）: 水族館→鳥羽城跡 623m 8.3分（3「すぐ」→9）。上限を超えている水族館 150→144 で、城跡 12:03 からあとはそのまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-578b155e.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("578b155e-646c-42f3-8570-538fc3126ce8", [
  {
    id: "4d6fdafa-9179-4794-9d09-41cd558f52b1",
    label: "鳥羽水族館",
    point: { from: [34.481528, 136.845778], to: [34.4820148, 136.8453304], source: "OSM 鳥羽水族館 tourism=aquarium way183967154" },
    stay: { from: 150, to: 144 },
  },
  {
    id: "155e4baf-94e7-446f-8bf9-80dce75dd7ec",
    label: "鳥羽城跡",
    legs: { from: [{ mode: "walk", min: 3 }], to: [{ mode: "walk", min: 9 }] },
    memo: [{ from: "鳥羽水族館から歩いてすぐ、", to: "鳥羽水族館から歩いておよそ9分、" }],
  },
]);
