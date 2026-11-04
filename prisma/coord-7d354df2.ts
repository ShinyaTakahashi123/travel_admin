/**
 * 日帰りの座標の直し（A・B）: 7d354df2（「日本最古の学校」ともいわれる足利学校と鑁阿寺、足利さんぽ日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 足利学校 36.335917,139.453667（秒の形）→ OSM「足利学校跡」historic=school,tourism=attraction way256397669（Nominatim 36.3360040,139.4533353、約30m）
 * - 鑁阿寺 36.337528,139.45225（秒の形）→ OSM place_of_worship way1112896625（Nominatim 36.3374074,139.4520880。2afa2584・f39d3e76 と同じ点）
 * - 足利公園 36.336771,139.434764（公園の面 way446028413 の中心）→ 名前のある入口・案内所がないため、メモに出てくる古墳の
 *   「足利公園古墳群」historic=archaeological_site node2480048388 36.3370860,139.4350362（7章の例外の候補）
 * - 足利市立美術館・織姫神社は、2afa2584 と同じ OSM の点にそろえる（美術館 way509383229 36.3340535,139.4503402 約27m、織姫神社 way429990200 36.3392356,139.4448770 約16m）
 * 歩く時間（routed-foot）: 足利学校→鑁阿寺 3.2分（5のまま）、鑁阿寺→美術館 539m 7.2分（6→8）、美術館→足利公園 1747m 23.3分（19→24）、足利公園→織姫神社 1414m 18.9分（13→19）
 * メモ: 書き出し・終わりの分、鑁阿寺の祈りの文を決まりの一文に（4章）
 * 時刻: 合わせて13分のびる。上限（100分）を超えるあしかがフラワーパークの滞在 120→107 で吸収し、終わり 16:38 はそのまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-7d354df2.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("7d354df2-789b-4240-943d-c06c04658fe4", [
  {
    id: "3082f6a6-f0f9-4fcb-8185-9ed4df7d8813",
    label: "足利学校",
    point: { from: [36.335917, 139.453667], to: [36.336004, 139.4533353], source: "OSM 足利学校跡 historic=school,tourism=attraction way256397669（Nominatim）" },
  },
  {
    id: "554f5f87-bb90-46a9-abab-e43f06bf0efc",
    label: "鑁阿寺",
    point: { from: [36.337528, 139.45225], to: [36.3374074, 139.452088], source: "OSM 鑁阿寺 amenity=place_of_worship way1112896625（Nominatim）" },
    memo: [
      { from: "今も信仰の対象となっている寺院ですので、参拝の際は敬意を込めて手を合わせましょう。", to: "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。" },
      { from: "この後は、歩いておよそ6分、足利市立美術館へ向かいましょう。", to: "この後は、歩いておよそ8分、足利市立美術館へ向かいましょう。" },
    ],
  },
  {
    id: "b96b5cbd-3b27-4ecc-972f-1789d0247edb",
    label: "足利市立美術館",
    point: { from: [36.334195, 139.450092], to: [36.3340535, 139.4503402], source: "OSM 足利市立美術館 tourism=museum way509383229（Nominatim）" },
    time: { from: "11:11", to: "11:13" },
    legs: { from: [{ mode: "walk", min: 6 }], to: [{ mode: "walk", min: 8 }] },
    memo: [
      { from: "鑁阿寺から歩いておよそ6分、", to: "鑁阿寺から歩いておよそ8分、" },
      { from: "この後は、歩いておよそ19分、足利公園へ向かいましょう。", to: "この後は、歩いておよそ24分、足利公園へ向かいましょう。" },
    ],
  },
  {
    id: "c5737401-5e6c-4cd1-9b93-8c93ec2e341e",
    label: "足利公園",
    point: { from: [36.336771, 139.434764], to: [36.337086, 139.4350362], source: "OSM 足利公園古墳群 historic=archaeological_site node2480048388" },
    time: { from: "12:55", to: "13:02" },
    legs: { from: [{ mode: "walk", min: 19 }], to: [{ mode: "walk", min: 24 }] },
    memo: [
      { from: "足利市立美術館から歩いておよそ19分、", to: "足利市立美術館から歩いておよそ24分、" },
      { from: "この後は、歩いておよそ13分、織姫神社へ向かいましょう。", to: "この後は、歩いておよそ19分、織姫神社へ向かいましょう。" },
    ],
  },
  {
    id: "b96087f7-daff-4f81-bae4-9ea3fe4dc4b1",
    label: "織姫神社",
    point: { from: [36.339378, 139.444956], to: [36.3392356, 139.444877], source: "OSM 織姫神社 amenity=place_of_worship way429990200（Nominatim）" },
    time: { from: "13:38", to: "13:51" },
    legs: { from: [{ mode: "walk", min: 13 }], to: [{ mode: "walk", min: 19 }] },
    memo: [{ from: "足利公園から歩いておよそ13分、", to: "足利公園から歩いておよそ19分、" }],
  },
  {
    id: "4790f85a-a5ee-4317-a99e-3799832f6c8c",
    label: "あしかがフラワーパーク",
    time: { from: "14:38", to: "14:51" },
    stay: { from: 120, to: 107 },
  },
]);
