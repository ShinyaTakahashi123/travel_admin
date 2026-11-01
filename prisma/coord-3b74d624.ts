/**
 * 日帰りの座標の直し（A・B）: 3b74d624（日光東照宮と輪王寺、世界遺産の社寺を巡る定番日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 神橋 36.753361,139.604（経度3けた）→ OSM「神橋」man_made=bridge way431806706 36.7533178,139.6040375（da0eae0b と同じ点）
 * - 日光山輪王寺 36.754389,139.601139（秒の形）→ OSM「輪王寺」amenity=place_of_worship way699236460 36.7547249,139.600759
 *   （名前「日光山輪王寺」の node13720153425 は historic=memorial（碑）なので使わない）
 * - 日光東照宮 36.758056,139.598944（秒の形）→ OSM amenity=place_of_worship way388017091 36.7576378,139.59911（8912b8d0 と同じ点）
 * - 日光二荒山神社（way388017140）は OSM の値の丸めなので直さない
 * 歩く時間（routed-foot）: 神橋→輪王寺 592m 7.9分（8のまま）、輪王寺→東照宮 557m 7.8分（10のまま）、東照宮→大猷院 719m 10.4分（8→11）。
 *   東照宮の滞在 100→97 で大猷院 12:36 はそのまま。メモに分の書き出し・終わりの文がないので、文は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-3b74d624.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("3b74d624-6a42-4c82-8c6e-d93977d146a0", [
  {
    id: "ad19beab-02c1-4b0c-8bdf-610e7acc3789",
    label: "神橋",
    point: { from: [36.753361, 139.604], to: [36.7533178, 139.6040375], source: "OSM 神橋 way431806706" },
  },
  {
    id: "75ab19af-f3e9-406c-b91d-e31e16d16f8b",
    label: "日光山輪王寺",
    point: { from: [36.754389, 139.601139], to: [36.7547249, 139.600759], source: "OSM 輪王寺 place_of_worship way699236460" },
  },
  {
    id: "942ac1b2-2250-4e94-b655-e18eafebb7d0",
    label: "日光東照宮",
    point: { from: [36.758056, 139.598944], to: [36.7576378, 139.59911], source: "OSM 日光東照宮 way388017091" },
    stay: { from: 100, to: 97 },
  },
  {
    id: "6dbadcf2-1fdf-4648-97c6-415b0584a4b9",
    label: "大猷院",
    legs: { from: [{ mode: "walk", min: 8 }], to: [{ mode: "walk", min: 11 }] },
  },
]);
