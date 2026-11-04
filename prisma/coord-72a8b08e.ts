/**
 * 日帰りの座標の直し（A・B）: 72a8b08e（佐賀城本丸歴史館と佐嘉神社、定番の佐賀市内さんぽ日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 佐嘉神社 33.251944,130.3025（6/4けた・秒の形）→ OSM「佐嘉神社 拝殿」amenity=place_of_worship node5599101701 33.2518209,130.3025552（約15m。45f439eb・980d1330 と同じ点）
 * - 松原神社 33.251944,130.3025（佐嘉神社と同じ値）→ OSM「松原神社 拝殿」amenity=place_of_worship node5599101702 33.2520672,130.3029846（約47m）
 * 歩く時間（routed-foot）: 与賀神社→佐嘉神社 1057m 14.1分（10→15）、佐嘉神社→松原神社 106m 1.5分（2のまま、上限8）、松原神社→佐賀バルーンミュージアム 399m 5.3分（3→6）
 * 時刻: 佐賀城本丸歴史館は 9:30 開館（sagajou.jp）で始まりを早められず、上限を超える滞在もないため、佐嘉神社からあとを5分・8分遅らせる（滞在は縮めない）。
 *   大隈重信記念館 16:03 着・16:58 まで（9:00〜17:00、入場は16:30まで。okuma-museum.jp/about）
 * メモ: 佐嘉神社・バルーンミュージアムの書き出しの分。佐嘉神社の「お参りください」を決まりの一文に（4章）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-72a8b08e.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("72a8b08e-fc24-49ca-94da-b0faaabb2562", [
  {
    id: "8fadc844-db8a-43cc-9d13-8c44be6f01ba",
    label: "佐嘉神社",
    point: { from: [33.251944, 130.3025], to: [33.2518209, 130.3025552], source: "OSM 佐嘉神社 拝殿 amenity=place_of_worship node5599101701" },
    time: { from: "13:08", to: "13:13" },
    legs: { from: [{ mode: "walk", min: 10 }], to: [{ mode: "walk", min: 15 }] },
    memo: [
      { from: "与賀神社からは歩いておよそ10分です。", to: "与賀神社からは歩いておよそ15分です。" },
      { from: "静かに、敬意をもってお参りください。", to: "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。" },
    ],
  },
  {
    id: "962597d8-b065-475a-a2ed-5806951d8e2f",
    label: "松原神社",
    point: { from: [33.251944, 130.3025], to: [33.2520672, 130.3029846], source: "OSM 松原神社 拝殿 amenity=place_of_worship node5599101702" },
    time: { from: "13:50", to: "13:55" },
  },
  {
    id: "0142e8c9-52ab-4dab-82d7-3b57accf3021",
    label: "佐賀バルーンミュージアム",
    time: { from: "14:13", to: "14:21" },
    legs: { from: [{ mode: "walk", min: 3 }], to: [{ mode: "walk", min: 6 }] },
    memo: [{ from: "松原神社からは歩いておよそ3分です。", to: "松原神社からは歩いておよそ6分です。" }],
  },
  { id: "27ced380-6718-4bb6-9c15-68a7303d4f69", label: "旧古賀家", time: { from: "15:11", to: "15:19" } },
  { id: "c38d33ce-bae5-45c3-980b-4af2b1faf800", label: "大隈重信記念館・旧宅", time: { from: "15:55", to: "16:03" } },
]);
