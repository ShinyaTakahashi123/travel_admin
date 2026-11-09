/**
 * 日帰りの座標の直し（A・B）: 6de84372 のつづき（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - coord-6de84372.ts で近代美術館→歴史博物館を歩2→6にしたが、歴史博物館のメモの書き出し「徒歩2分ほど」を直し忘れた（法務 11/04 09:40 の指摘）
 * - 書き出しの分を6分に直す。時刻・点・移動は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-6de84372b.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("6de84372-3d1e-4106-bcb2-f881ee14b8b4", [
  {
    id: "67175166-c233-4b11-9d17-0d86303b2ed1",
    label: "群馬県立歴史博物館",
    memo: [{ from: "群馬県立近代美術館からは徒歩2分ほどです。", to: "群馬県立近代美術館からは徒歩6分ほどです。" }],
  },
]);
