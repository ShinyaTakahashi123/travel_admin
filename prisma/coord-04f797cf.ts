/**
 * 日帰りの座標の直し（A・5けた）: 04f797cf（毛越寺の浄土庭園、平安時代の美しい庭を歩く平泉さんぽ・日帰り）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * 点:
 * - 毛越寺 38.987222,141.1075（経度4けた。秒の形）→ OSM「毛越寺」amenity=place_of_worship way218652547 の Nominatim 38.9882159,141.1073078（49f34e12 と同じ点。経楼跡のそばの境内）
 * - 直さない（OSM の値を6けたにしたもの）: 観自在王院跡 way218653376、無量光院跡 way1056543994、義経堂 node4355986091、中尊寺 way1023510974
 *   （観自在王院跡・無量光院跡・中尊寺は面の中心なので、C（広い場所の中心）で扱う）
 * 歩く時間（routed-foot）: 毛越寺→観自在王院跡 532m 7.1分（4→8）、観自在王院跡→遺産センター 795m 10.6分（7→11）、遺産センター→無量光院跡 1,003m 13.4分（5→14）、
 *   無量光院跡→義経堂 607m 8.1分（7→9）、義経堂→中尊寺 1,475m 19.7分（20のまま）
 *   のびた分は、毛越寺 90→86・観自在王院跡 40→36・遺産センター 60→55・無量光院跡 30→24 で合わせる（観自在王院跡 11:04・遺産センター 11:51・義経堂 13:33・中尊寺 14:38 はもとのまま）
 * メモ: 書き出しと終わりの文の分。触るメモの「ください」を直す（義経堂の祈りの一文「お参りください」はもとからの形なので残す）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-04f797cf.ts [--commit]
 */
import { main, type SpotFix } from "./lib/coordfix-lib";

const closer = (to: string, min: number) => ({ from: `続いては${to}へ向かいましょう。`, to: `続いては、歩いておよそ${min}分、${to}へ向かいましょう。` });
const first = (from: string, a: number, b: number) => ({ from: `${from}から歩いておよそ${a}分、`, to: `${from}から歩いておよそ${b}分、` });
const walk = (a: number, b: number) => ({ from: [{ mode: "walk" as const, min: a }], to: [{ mode: "walk" as const, min: b }] });

const FIXES: SpotFix[] = [
  {
    id: "9d7c6a93-364a-4a6b-9fec-d5fc6a98052d",
    label: "毛越寺",
    point: { from: [38.987222, 141.1075], to: [38.9882159, 141.1073078], source: "OSM 毛越寺 way218652547" },
    stay: { from: 90, to: 86 },
    memo: [
      { from: "境内では静かに、敬意をもってお過ごしください。", to: "境内では静かに、敬意をもって過ごしましょう。" },
      { from: "味わってください。", to: "味わいましょう。" },
      closer("観自在王院跡", 8),
    ],
  },
  {
    id: "17d63bae-af42-4aac-ba5c-2a522d387ca6",
    label: "観自在王院跡",
    stay: { from: 40, to: 36 },
    legs: walk(4, 8),
    memo: [first("毛越寺", 4, 8), { from: "ゆっくりと歩いてみてください。", to: "ゆっくりと歩けます。" }, closer("平泉文化遺産センター", 11)],
  },
  {
    id: "36a9e15e-a71f-4eeb-b24f-6e4642c260d2",
    label: "平泉文化遺産センター",
    stay: { from: 60, to: 55 },
    legs: walk(7, 11),
    memo: [first("観自在王院跡", 7, 11), closer("無量光院跡", 14)],
  },
  {
    id: "16b16eba-6a74-475f-b981-5a2214045666",
    label: "無量光院跡",
    time: { from: "12:56", to: "13:00" },
    stay: { from: 30, to: 24 },
    legs: walk(5, 14),
    memo: [first("平泉文化遺産センター", 5, 14), { from: "静かな史跡をゆっくりと歩いてみてください。", to: "静かな史跡をゆっくりと歩けます。" }, closer("義経堂", 9)],
  },
  {
    id: "dce321c3-1d4b-48c9-87ed-ab6c64ce2dba",
    label: "義経堂",
    legs: walk(7, 9),
    memo: [first("無量光院跡", 7, 9), closer("中尊寺", 20)],
  },
];

main("04f797cf-7186-4ea2-a4d7-a2855062c478", FIXES);
