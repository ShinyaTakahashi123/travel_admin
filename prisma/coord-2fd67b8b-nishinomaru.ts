/**
 * 2fd67b8b（グランフロントと中崎町、新旧が交わる梅田さんぽ旅）2日目「西の丸庭園」の点を、大阪の下書き（20261106-osaka-castle-expo）と同じ点にそろえる（しおりえ(制作補助2)、2026-11-06）
 * 企画運営（11/06）: 決まり187「同じ場所は同じ点」。今の点 34.688108,135.522924 は出どころ不明で、約110m離れている
 * → OSM leisure=garden「西の丸庭園」way159278501 の Nominatim の中心 34.6870969,135.5231150 → 6けた 34.687097,135.523115
 *   （名前のある入口は「西の丸庭園入り口 チケット売場」building way405236739 だけで、券売所は7章の料金所にあたるため使わない）
 * 区間（routing.openstreetmap.de routed-foot）: 大阪城天守閣 node13388509601→新しい点 962m 12.94分（今の walk14 の範囲の中。変えない）、
 *   新しい点→豊国神社 608m 8.15分→9（今の walk9 と同じ）。時刻・本文の分は変わらない。メモの「天守閣を間近に見上げる眺め」も変わらず当てはまる
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-2fd67b8b-nishinomaru.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("2fd67b8b-59c6-4ea4-ab01-b27e2414a53e", [
  {
    id: "8df2d766-d513-44e7-a7a4-bc75d0b092ed",
    label: "西の丸庭園",
    point: { from: [34.688108, 135.522924], to: [34.687097, 135.523115], source: "OSM leisure=garden 西の丸庭園 way159278501 の Nominatim の中心（大阪の下書きと同じ点）" },
  },
]);
