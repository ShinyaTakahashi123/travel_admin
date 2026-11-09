/**
 * 日帰りの座標の直し（A・B）: 5429383d（東広島・西条酒蔵通り、白壁の蔵元と御建神社をめぐる日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 御建神社 34.432129,132.7444（経度4けた。約100m南）→ OSM amenity=place_of_worship node9932805810 34.4330537,132.744223
 * - 西条駅周辺（昼食）34.43113,132.743621（5けた）→ OSM「JR西条駅周辺案内図」information=map node5901192022 34.4311383,132.7438657
 *   （昼食のスポットなので店の点は使わず、案内板の点。決まり377行目。約22m）
 * 歩く時間（routed-foot）: 御建神社→美術館 1,115m 14.9分（9→15）、賀茂鶴→駅周辺 260m 3.5分（3→4）、駅周辺→福美人 407m 5.4分（5→6）。
 *   上限内の滞在は縮めず、始まりを 9:30→9:22 にして、福美人 13:37 からあとはそのまま（美術館〜駅周辺は1〜2分早く着く）。メモに分の書き出しはない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-5429383d.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("5429383d-560c-47c2-9413-4188ed09c34e", [
  {
    id: "cbe67073-d218-4bc4-bb49-6c01f0c966e9",
    label: "御建神社",
    point: { from: [34.432129, 132.7444], to: [34.4330537, 132.744223], source: "OSM 御建神社 place_of_worship node9932805810" },
    time: { from: "09:30", to: "09:22" },
  },
  {
    id: "f8e590f7-de40-43ec-b8ca-ed1c2cb5c01b",
    label: "東広島市立美術館",
    time: { from: "10:24", to: "10:22" },
    legs: { from: [{ mode: "walk", min: 9 }], to: [{ mode: "walk", min: 15 }] },
  },
  { id: "04385a5d-d61b-4312-af1d-ddb3cc49d00b", label: "白牡丹酒造", time: { from: "11:34", to: "11:32" } },
  { id: "de07407b-0ac5-45bf-ace8-7ee491bdcd0e", label: "賀茂鶴酒造", time: { from: "12:19", to: "12:17" } },
  {
    id: "0e60efb9-54b0-4bb7-8013-aef131bc150a",
    label: "西条駅周辺（昼食）",
    point: { from: [34.43113, 132.743621], to: [34.4311383, 132.7438657], source: "OSM JR西条駅周辺案内図 information=map node5901192022（昼食のスポット）" },
    time: { from: "13:02", to: "13:01" },
    legs: { from: [{ mode: "walk", min: 3 }], to: [{ mode: "walk", min: 4 }] },
  },
  {
    id: "6965cdc6-1dc5-4059-a169-a036c5850f0d",
    label: "福美人酒造",
    legs: { from: [{ mode: "walk", min: 5 }], to: [{ mode: "walk", min: 6 }] },
  },
]);
