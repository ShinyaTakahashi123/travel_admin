/**
 * 同じ場所の点をそろえる: 33100ce1（日御碕神社と日御碕灯台、出雲の岬と絶景を巡る1泊2日）の宝物殿(神祜殿)（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md（bb5348fc の欄①、企画運営 11/04: 33100ce1 の神祜殿も同じ OSM の点にそろえる）
 * - 宝物殿(神祜殿) 35.4011,132.686085 → OSM building=museum way404484666（alt_name=宝物殿、OSM の name は誤字で「神枯殿」）
 *   （35.4011181,132.6860616 → 6けた 35.401118,132.686062、約3m）
 * 歩く時間（routed-foot、実測 ≤ 今の値 ≤ 上限）: 神楽殿→神祜殿 200m 2.7 ≤ 3 ≤ 10、神祜殿→命主社 332m 4.4 ≤ 5 ≤ 12。変えない。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-33100ce1.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("33100ce1-b739-4342-826f-4de81880d252", [
  {
    id: "0ea871a3-8453-4b28-abf8-ddc830764259",
    label: "宝物殿(神祜殿)",
    point: { from: [35.4011, 132.686085], to: [35.401118, 132.686062], source: "OSM 宝物殿（神祜殿）building=museum way404484666" },
  },
]);
