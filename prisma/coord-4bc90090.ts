/**
 * 日帰りの座標の直し（A・B）: 4bc90090（日光東照宮と輪王寺、二荒山神社をめぐり御朱印をいただく日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * 点はどれも 3b74d624 と同じにそろえる
 * - 神橋 36.7533,139.604（4/3けた）→ OSM「神橋」man_made=bridge way431806706 36.7533178,139.6040375
 * - 日光山輪王寺 36.754389,139.601139（秒の形）→ OSM「輪王寺」amenity=place_of_worship way699236460 36.7547249,139.600759
 *   （名前「日光山輪王寺」の node13720153425 は historic=memorial（碑）なので使わない）
 * - 日光東照宮 36.758056,139.598944（秒の形）→ OSM amenity=place_of_worship way388017091 36.7576378,139.59911
 * - 大猷院 36.75801,139.595915（5けた。案内板 node6738553474 の点）→ OSM「大猷院霊廟」amenity=place_of_worship way195072229 36.758385,139.5951743
 * - 日光二荒山神社 36.7583,139.5964（4けた）→ OSM「二荒山神社」amenity=place_of_worship way388017140 36.7584003,139.5966644
 * 歩く時間（routed-foot）: 神橋→輪王寺 592m 7.9分（5→8）、輪王寺→東照宮 557m 7.8分（10のまま）、東照宮→大猷院 719m 10.4分（4→11）、
 *   大猷院→二荒山 263m 3.5分（1→4）、二荒山→滝尾神社 1,169m 13.8分（20のまま）。
 *   のびた13分は東照宮の滞在だけで吸収（135→122。上限を超えている所。法務 11/02）: 輪王寺 9:25→9:28、東照宮 10:35→10:38、大猷院 12:54→12:51、二荒山 13:50 からあとはそのまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-4bc90090.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("4bc90090-102a-4b9d-bae8-31abe8f12f23", [
  {
    id: "4599aa60-4982-4192-b62b-5707279ebb8c",
    label: "神橋",
    point: { from: [36.7533, 139.604], to: [36.7533178, 139.6040375], source: "OSM 神橋 way431806706" },
  },
  {
    id: "82bb43a9-5271-4eac-9aae-78503c809a0e",
    label: "日光山輪王寺",
    point: { from: [36.754389, 139.601139], to: [36.7547249, 139.600759], source: "OSM 輪王寺 place_of_worship way699236460" },
    time: { from: "09:25", to: "09:28" },
    legs: { from: [{ mode: "walk", min: 5 }], to: [{ mode: "walk", min: 8 }] },
  },
  {
    id: "fa3bfa04-f503-4213-8993-fab2d5cafee6",
    label: "日光東照宮",
    point: { from: [36.758056, 139.598944], to: [36.7576378, 139.59911], source: "OSM 日光東照宮 way388017091" },
    time: { from: "10:35", to: "10:38" },
    stay: { from: 135, to: 122 },
  },
  {
    id: "81b32d61-6597-44c6-ad1b-d7ddffc8a734",
    label: "大猷院",
    point: { from: [36.75801, 139.595915], to: [36.758385, 139.5951743], source: "OSM 大猷院霊廟 place_of_worship way195072229" },
    time: { from: "12:54", to: "12:51" },
    legs: { from: [{ mode: "walk", min: 4 }], to: [{ mode: "walk", min: 11 }] },
    memo: [{ from: "日光東照宮からは歩いて4分ほどです。", to: "日光東照宮からは歩いて11分ほどです。" }],
  },
  {
    id: "936c277f-bc4c-43ba-b2f0-6dc58e28bdee",
    label: "日光二荒山神社",
    point: { from: [36.7583, 139.5964], to: [36.7584003, 139.5966644], source: "OSM 二荒山神社 place_of_worship way388017140" },
    legs: { from: [{ mode: "walk", min: 1 }], to: [{ mode: "walk", min: 4 }] },
    memo: [{ from: "大猷院からは歩いてすぐです。", to: "大猷院からは歩いて4分ほどです。" }],
  },
]);
