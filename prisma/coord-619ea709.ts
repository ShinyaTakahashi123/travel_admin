/**
 * 日帰りの座標の直し（A・B）: 619ea709（仙巌園と尚古集成館、世界遺産・薩摩の近代化遺産を巡るプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 仙巌園 31.617222,130.576944（秒の形）→ OSM「Entrance to Sengan-En gardens」tourism=attraction node4826351725 31.6174465,130.5771785
 *   （広い庭園は着く場所の入口の点、7章。c2115481 と同じ点。約33m）
 * - 尚古集成館 31.617306,130.57625（秒の形・5けた）→ OSM tourism=museum node1423927218 31.6173244,130.5763006（c2115481・1f5e18c2 と同じ点）
 * - 維新ふるさと館（way117143629）は OSM の値の丸めなので直さない
 * 歩く時間（routed-foot）: 仙巌園入口→尚古集成館 97m 1.3分（10は上限7を超えるので 10→2）、尚古集成館→異人館 347m 4.7分（4→5）。
 *   始まりは 9:30 より遅くできないので、異人館から後ろを7分ずつ早める（終わり 16:54→16:47、16:30 より後）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-619ea709.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("619ea709-6437-438a-8421-ce3ad8852486", [
  {
    id: "ab1fa271-56a9-48b5-a1db-a1d7f32cefc0",
    label: "仙巌園",
    point: { from: [31.617222, 130.576944], to: [31.6174465, 130.5771785], source: "OSM Entrance to Sengan-En gardens tourism=attraction node4826351725（入口）" },
  },
  {
    id: "98868caf-f966-4860-8e73-81429e1777b7",
    label: "尚古集成館",
    point: { from: [31.617306, 130.57625], to: [31.6173244, 130.5763006], source: "OSM 尚古集成館 tourism=museum node1423927218" },
    time: { from: "10:50", to: "10:42" },
    legs: { from: [{ mode: "walk", min: 10 }], to: [{ mode: "walk", min: 2 }] },
    memo: [{ from: "仙巌園からは徒歩10分ほどです。", to: "仙巌園からは徒歩2分ほどです。" }],
  },
  {
    id: "2dac2d29-e014-4695-9d32-3fee8b0afc62",
    label: "旧鹿児島紡績所技師館(異人館)",
    time: { from: "11:44", to: "11:37" },
    legs: { from: [{ mode: "walk", min: 4 }], to: [{ mode: "walk", min: 5 }] },
    memo: [{ from: "尚古集成館からは徒歩4分ほどです。", to: "尚古集成館からは徒歩5分ほどです。" }],
  },
  { id: "43b78ca1-676d-4a98-8e30-18e5f8f2f2d5", label: "城山展望台", time: { from: "12:46", to: "12:39" } },
  { id: "b39e547b-285e-434a-8647-c5183888d268", label: "鹿児島市維新ふるさと館", time: { from: "13:39", to: "13:32" } },
  { id: "f00cb849-e09c-482a-a12b-aa646fc1b53a", label: "桜島溶岩なぎさ公園・足湯", time: { from: "15:39", to: "15:32" } },
]);
