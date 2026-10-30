/**
 * 初日・最終日の見直し #49 1a32349e「港の見える丘公園と元町、異国情緒あふれる横浜1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目・310a16a）
 * 1泊2日・歩き。初日を11時ごろからにする。2日目はもとから 16:59 に終わる（終わりは今より遅くしない）
 * 初日: 元町・中華街駅に10:50ごろ（開館: 大さん橋の屋上は24時間 https://www.welcome.city.yokohama.jp/topics/tp_detail.php?tpid=T04339、象の鼻テラスは10〜18時 bbid=755） → 歩7（foot 558m）→ 港の見える丘公園 10:57 → 外国人墓地 11:36 → 山手西洋館 12:00 → 元町商店街 12:58（昼食）→
 *   中華街 14:07 → 山下公園 15:06 → 氷川丸 15:32 → マリンタワー 16:19〜16:54
 *   山手公園は外す（11時からでは17時に収まらない。タイトル・説明文にない。写真なし）。もとの昼食は中華街 13:40 で遅すぎたため、元町で昼食
 *   滞在はどれも、もとと同じか短い（丘 40→35、墓地 30→20、西洋館 60→50、中華街 60→50、山下公園 30→20、氷川丸 45→40）
 * 2日目: もとの1か所目の横浜美術館 9:00 は開館（10時、https://yokohama.art.museum/visit/info/）より前、帆船日本丸・みなと博物館も10時開館
 *   （https://www.nippon-maru.or.jp/userguide/）なので、外で見られる大さん橋・象の鼻パークから始め、港をまわって桜木町で終わる順に組みかえる:
 *   日本大通り駅 → 歩12 → 大さん橋 9:00 → 象の鼻パーク 9:36 → 開港記念会館 10:09 → 歴史博物館 10:38（9:30開館）→ 赤レンガ倉庫 11:24（60→50）→
 *   カップヌードルミュージアム 12:25（昼食、もとのまま）→ 美術館 13:40 → ドックヤードガーデン 14:47 → 日本丸 15:11 → みなと博物館 15:45（入館16:30まで）→
 *   汽車道 16:37〜16:57 → 歩5 → 桜木町駅
 * 歩きの分数はどれも routing.openstreetmap.de の foot の道のり（直したあとの点で測った）
 * 文: 「ください」（祈りの一文でないもの）・「おすすめです」・「お帰りは…ご利用ください」を直す。元町のメモのブランド名3つを消す（rules 329）
 * 座標（どれも OSM の値。メモに出てくる物）:
 *   港の見える丘公園 → レンガ造り井戸遺構（フランス山地区、node 4549051125）、外国人墓地 → 資料館（way 205604305）、山手西洋館 → エリスマン邸（way 205727799）、
 *   山下公園 → 水の守護神像（node 4949974788、メモに足す。出典 https://www.city.yokohama.lg.jp/kurashi/machizukuri-kankyo/midori-koen/koen/koen/daihyoteki/kouen008.html）、氷川丸 way 130991780、マリンタワー way 319050351、美術館 way 36213480、日本丸 way 138101264、
 *   ドックヤードガーデン way 253927836、汽車道 = 港一号橋梁 way 530755812（bridge、法務 10/30）、象の鼻パーク → 象の鼻テラス（node 4924035837、メモに足す）、
 *   大さん橋 → くじらのせなか（way 498025391）、歴史博物館 way 88383441、開港記念会館 relation 12430576
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-049-1a32349e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "1a32349e-32f2-4140-acbc-5748b6fa6f42";
const DAY1_ID = "d90a19ff-9ae9-41bd-b7d2-4efd0cf0ad3d";
const DAY2_ID = "d75d5d6a-2f74-4477-9ff4-56ce5fbc0ee0";
const OKA = "e326999e-e70d-436c-bef0-03cede98a9c2";
const BOCHI = "3b606379-2690-4f03-824b-8d0634e431a2";
const SEIYO = "5b5656a0-9850-4926-b6b1-d5b66465ddaf";
const YAMATEP = "c22f5125-8c83-492d-8d74-3be9310aaaa3";
const MOTO = "836e5d24-66c7-4948-a3bc-1e48c2d17ec5";
const CHUKA = "a89de8c9-b564-4df1-be50-bfb2793a01dd";
const YAMASHITA = "e0ca456c-c6ee-48b9-a308-f91ee95e7709";
const HIKAWA = "d610b474-3c15-4f19-85d7-2277ee29e304";
const MARINE = "68e75f92-d8c0-4a47-b1c0-302723ec76cc";
const BIJUTSU = "9d566d0f-3838-4903-9e11-31d7a7d51751";
const NIPPON = "491c9f6b-c202-490a-9893-c8d340bcd990";
const MINATO = "ce5b39ba-6a08-4ce0-99f5-9cf1a0928821";
const DYG = "5f8e669d-7618-4975-8cc0-f025bc6d25f2";
const KISHA = "8ab3eeb1-2921-42a4-86d3-cdb42e164864";
const AKA = "f0445e67-7fd0-4850-b3b2-3e10cee90e24";
const CN = "aea607b4-c6f1-4659-844d-787b362b63cd";
const ZOU = "5100c4e6-f5c0-4147-92e7-f3d1162c5027";
const OSAN = "2d7d31f0-0b9a-4cac-a5cc-5a563b24323b";
const REKI = "7ad84103-e6af-484a-ac5d-d8fc6df553b1";
const KAIKO = "6b7c3cd7-8f97-4f10-a626-47c646e90b48";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

// [いまの値, 直した値]（OSM の値）
const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [OKA]: { from: [35.439889, 139.655], to: [35.440915, 139.653974] },
  [BOCHI]: { from: [35.439687, 139.65192], to: [35.43953, 139.652384] },
  [SEIYO]: { from: [35.4372, 139.6539], to: [35.437581, 139.651293] },
  [YAMASHITA]: { from: [35.4457, 139.6499], to: [35.445788, 139.64977] },
  [HIKAWA]: { from: [35.4467, 139.6513], to: [35.446666, 139.651255] },
  [MARINE]: { from: [35.443929, 139.650902], to: [35.443928, 139.650902] },
  [BIJUTSU]: { from: [35.4571, 139.6305], to: [35.457099, 139.630527] },
  [NIPPON]: { from: [35.4545, 139.6334], to: [35.453726, 139.632307] },
  [DYG]: { from: [35.4551, 139.6323], to: [35.455052, 139.632327] },
  [KISHA]: { from: [35.4526, 139.6332], to: [35.452636, 139.633334] },
  [ZOU]: { from: [35.4494, 139.6433], to: [35.44968, 139.643193] },
  [OSAN]: { from: [35.4517, 139.6478], to: [35.452101, 139.648071] },
  [REKI]: { from: [35.4491, 139.6362], to: [35.449124, 139.636228] },
  [KAIKO]: { from: [35.4473, 139.6412], to: [35.447278, 139.641228] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [OKA]: [
    {
      from: "みなとみらい線の元町・中華街駅から歩いて5分ほど、坂道を上った先にあるのが港の見える丘公園です。",
      to: "みなとみらい線の元町・中華街駅に10時50分ごろ着いたら、坂道を上って歩いて約7分、港の見える丘公園に着きます。",
    },
    { from: "ひと通り見て回ったら、公園を出て山手の洋館めぐりへ向かいましょう。", to: "この後は、歩いておよそ4分、横浜外国人墓地へ向かいましょう。" },
  ],
  [BOCHI]: [
    {
      from: "静かに、敬意をもって見学し、異国の地に生きた人々の足跡を通して、横浜という町が歩んできた国際交流の歴史を感じてみてください。この後は、歩いておよそ5分、山手西洋館へ向かいましょう。",
      to: "異国の地に生きた人々の足跡を通して、横浜という町が歩んできた国際交流の歴史を感じましょう。お墓のまわりでは、静かに過ごしましょう。この後は、歩いておよそ4分、山手西洋館のひとつ、エリスマン邸へ向かいましょう。",
    },
  ],
  [SEIYO]: [
    { from: "港の見える丘公園から続く山手の丘には、", to: "横浜外国人墓地から歩いておよそ4分、エリスマン邸に着きます。港の見える丘公園から続く山手の丘には、" },
    { from: "洋館めぐりの合間に花を眺めてひと息つくのもおすすめです。", to: "洋館めぐりの合間に、花を眺めてひと息つきましょう。" },
    { from: "ひと通り洋館をめぐったら、坂を下って元町商店街へ向かいましょう。", to: "ひと通り洋館をめぐったら、歩いておよそ8分、坂を下って元町商店街へ向かいましょう。" },
  ],
  [MOTO]: [
    { from: "山手公園から歩いておよそ9分、", to: "山手西洋館から歩いておよそ8分、" },
    {
      from: "『ハマトラ』の発祥地としても知られるようになり、ミハマ、キタムラ、フクゾーという3つのブランドが代表格とされています。",
      to: "『ハマトラ』の発祥地としても知られるようになりました。",
    },
    {
      from: "今も洗練された洋品店やカフェが並ぶ通りを、開港以来の異国情緒を感じながら歩いてみてください。この後は、歩いておよそ5分、横浜中華街へ向かいましょう。",
      to: "今も洗練された洋品店やカフェが並ぶ通りを、開港以来の異国情緒を感じながら歩きましょう。通り沿いのカフェや飲食店で、昼食にしましょう。この後は、歩いておよそ9分、横浜中華街へ向かいましょう。",
    },
  ],
  [CHUKA]: [
    { from: "元町商店街から歩いておよそ5分、", to: "元町商店街から歩いておよそ9分、" },
    {
      from: "数百軒ともいわれる中華料理店が軒を連ねているので、ここで昼食にしましょう。食べ歩きをしながら、道教の廟や豪華な牌楼を眺めて歩くのもおすすめです。この後は、歩いておよそ7分、山下公園へ向かいましょう。",
      to: "数百軒ともいわれる中華料理店が軒を連ねています。道教の廟や豪華な牌楼を眺めながら、通りを歩いてみましょう。この後は、歩いておよそ9分、山下公園へ向かいましょう。",
    },
  ],
  [YAMASHITA]: [
    { from: "横浜中華街から歩いておよそ7分、", to: "横浜中華街から歩いておよそ9分、" },
    {
      from: "昭和5年(1930)の開園以来、市民や旅行者に親しまれてきました。",
      to: "昭和5年(1930)の開園以来、市民や旅行者に親しまれてきました。公園には、サンディエゴ市から贈られた「水の守護神」の像があります。",
    },
    { from: "この後は、歩いてすぐ、氷川丸へ向かいましょう。", to: "この後は、歩いておよそ6分、氷川丸へ向かいましょう。" },
  ],
  [HIKAWA]: [
    { from: "山下公園から歩いてすぐ、", to: "山下公園から歩いておよそ6分、" },
    { from: "この後は、歩いておよそ5分、横浜マリンタワーへ向かいましょう。", to: "この後は、歩いておよそ7分、横浜マリンタワーへ向かいましょう。" },
  ],
  [MARINE]: [
    { from: "日本郵船氷川丸から歩いておよそ5分、", to: "日本郵船氷川丸から歩いておよそ7分、" },
    { from: "今夜は横浜の宿へ向かいましょう。", to: "この夜は、横浜の宿に泊まりましょう。" },
  ],
  // 2日目（組みかえ後の順）
  [OSAN]: [
    { from: "象の鼻パークから歩いておよそ7分、大さん橋に着きます。", to: "旅の2日目は、宿を出て、みなとみらい線の日本大通り駅から歩いて約12分、大さん橋に着きます。屋上は24時間開いているので、朝のうちから歩けます。" },
    {
      from: "潮風を感じながら、開港の町・横浜の景色を楽しんでみてください。この後は、歩いておよそ16分、神奈川県立歴史博物館へ向かいましょう。",
      to: "潮風を感じながら、開港の町・横浜の景色を眺めましょう。この後は、歩いておよそ11分、象の鼻パークへ向かいましょう。",
    },
  ],
  [ZOU]: [
    { from: "カップヌードルミュージアムから歩いておよそ12分、", to: "大さん橋から歩いておよそ11分、" },
    {
      from: "横浜港を象徴する景色を360度見渡せる、絶好のビューポイントです。この後は、歩いておよそ7分、大さん橋へ向かいましょう。",
      to: "横浜港を象徴する景色を360度見渡せる、絶好のビューポイントです。園内の「象の鼻テラス」は休憩所を兼ねた施設です。開いている時間は、公式の案内で確かめましょう。この後は、歩いておよそ8分、横浜市開港記念会館へ向かいましょう。",
    },
  ],
  [KAIKO]: [
    { from: "神奈川県立歴史博物館から歩いておよそ7分、", to: "象の鼻パークから歩いておよそ8分、" },
    {
      from: "内部の一般公開日は限られているので、訪れる前に公式サイトで確かめてください。外観を眺めながら、開港とともに発展してきた横浜のまちの歴史を感じてみてください。異国情緒あふれる町並みの奥に息づく、開港の町・横浜の重厚な歴史を味わった1泊2日を、ここで締めくくりましょう。お帰りは、みなとみらい線の日本大通り駅からご利用ください。",
      to: "内部の一般公開日は限られているので、訪れる前に公式サイトで確かめましょう。外観を眺めながら、開港とともに発展してきた横浜のまちの歴史を感じましょう。この後は、歩いておよそ9分、神奈川県立歴史博物館へ向かいましょう。",
    },
  ],
  [REKI]: [
    { from: "大さん橋から歩いておよそ16分、", to: "横浜市開港記念会館から歩いておよそ9分、" },
    { from: "この後は、歩いておよそ7分、横浜市開港記念会館へ向かいましょう。", to: "この後は、歩いておよそ16分、横浜赤レンガ倉庫へ向かいましょう。" },
  ],
  [AKA]: [
    { from: "汽車道から歩いておよそ11分、", to: "神奈川県立歴史博物館から歩いておよそ16分、" },
    { from: "この後は、歩いておよそ7分、カップヌードルミュージアム横浜へ向かいましょう。", to: "この後は、歩いておよそ11分、カップヌードルミュージアム横浜へ向かいましょう。" },
  ],
  [CN]: [
    { from: "横浜赤レンガ倉庫から歩いておよそ7分、", to: "横浜赤レンガ倉庫から歩いておよそ11分、" },
    {
      from: "横浜港のものづくりの歴史を、最後は少し違う角度から楽しんでみてください。この後は、歩いておよそ12分、象の鼻パークへ向かいましょう。",
      to: "横浜港のものづくりの歴史を、少し違う角度から楽しみましょう。この後は、歩いておよそ15分、横浜美術館へ向かいましょう。",
    },
  ],
  [BIJUTSU]: [
    { from: "旅の2日目は、みなとみらいにある横浜美術館から始めます。", to: "カップヌードルミュージアム横浜から歩いておよそ15分、みなとみらいにある横浜美術館に着きます。" },
    {
      from: "開催中の企画展や、コレクション展をじっくりと楽しんでみてください。この後は、歩いておよそ6分、帆船日本丸へ向かいましょう。",
      to: "開催中の企画展や、コレクション展をじっくりと見てまわりましょう。この後は、歩いておよそ7分、ドックヤードガーデンへ向かいましょう。",
    },
  ],
  [DYG]: [
    { from: "横浜みなと博物館から歩いておよそ5分、", to: "横浜美術館から歩いておよそ7分、" },
    {
      from: "近代日本の造船業を支えた施設のスケールを、実際に足を踏み入れて感じてみてください。この後は、歩いておよそ5分、汽車道へ向かいましょう。",
      to: "近代日本の造船業を支えた施設のスケールを、実際に足を踏み入れて感じましょう。この後は、歩いておよそ4分、帆船日本丸へ向かいましょう。",
    },
  ],
  [NIPPON]: [
    { from: "横浜美術館から歩いておよそ6分、", to: "ドックヤードガーデンから歩いておよそ4分、" },
    {
      from: "大海原を渡った船旅に思いをはせてみてください。この後は、歩いてすぐ、横浜みなと博物館へ向かいましょう。",
      to: "大海原を渡った船旅に思いをはせましょう。この後は、歩いておよそ4分、横浜みなと博物館へ向かいましょう。",
    },
  ],
  [MINATO]: [
    { from: "帆船日本丸から歩いてすぐ、", to: "帆船日本丸から歩いておよそ4分、" },
    {
      from: "博物館では横浜港の歴史をじっくり学び、日本丸の甲板に立ってその大きさを実感したら、この後は、歩いておよそ5分、ドックヤードガーデンへ向かいましょう。",
      to: "博物館で横浜港の歴史をじっくり学んだら、この後は、歩いておよそ2分、汽車道へ向かいましょう。",
    },
  ],
  [KISHA]: [
    { from: "ドックヤードガーデンから歩いておよそ5分、", to: "横浜みなと博物館から歩いておよそ2分、" },
    {
      from: "港の発展を支えた鉄道の歴史を感じながら、赤レンガ倉庫まで、海風を感じる散歩道をゆっくりと歩いてみてください。この後は、歩いておよそ11分、横浜赤レンガ倉庫へ向かいましょう。",
      to: "港の発展を支えた鉄道の歴史を感じながら、海風を感じる散歩道を少し歩いてみましょう。異国情緒あふれる町並みと、開港の町・横浜の歴史をめぐった1泊2日は、これで終わりです。見学を終えたら、歩いて約5分のJR桜木町駅から帰りましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const PLAN: Plan = [
  { id: OKA, h: 10, m: 57, stay: 35, legs: [] },
  { id: BOCHI, h: 11, m: 36, stay: 20, legs: [walk(4)] },
  { id: SEIYO, h: 12, m: 0, stay: 50, legs: [walk(4)] },
  { id: MOTO, h: 12, m: 58, stay: 60, legs: [walk(8)] },
  { id: CHUKA, h: 14, m: 7, stay: 50, legs: [walk(9)] },
  { id: YAMASHITA, h: 15, m: 6, stay: 20, legs: [walk(9)] },
  { id: HIKAWA, h: 15, m: 32, stay: 40, legs: [walk(6)] },
  { id: MARINE, h: 16, m: 19, stay: 35, legs: [walk(7)] },
];
const DAY2: Plan = [
  { id: OSAN, h: 9, m: 0, stay: 25, legs: [] },
  { id: ZOU, h: 9, m: 36, stay: 25, legs: [walk(11)] },
  { id: KAIKO, h: 10, m: 9, stay: 20, legs: [walk(8)] },
  { id: REKI, h: 10, m: 38, stay: 30, legs: [walk(9)] },
  { id: AKA, h: 11, m: 24, stay: 50, legs: [walk(16)] },
  { id: CN, h: 12, m: 25, stay: 60, legs: [walk(11)] },
  { id: BIJUTSU, h: 13, m: 40, stay: 60, legs: [walk(15)] },
  { id: DYG, h: 14, m: 47, stay: 20, legs: [walk(7)] },
  { id: NIPPON, h: 15, m: 11, stay: 30, legs: [walk(4)] },
  { id: MINATO, h: 15, m: 45, stay: 50, legs: [walk(4)] },
  { id: KISHA, h: 16, m: 37, stay: 20, legs: [walk(2)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [OKA, BOCHI, SEIYO, YAMATEP, MOTO, CHUKA, YAMASHITA, HIKAWA, MARINE].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [BIJUTSU, NIPPON, MINATO, DYG, KISHA, AKA, CN, ZOU, OSAN, REKI, KAIKO].join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  for (const [id, c] of Object.entries(COORDS)) {
    const s = all.find((x) => x.id === id)!;
    if (Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  }
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const memos: Record<string, string> = {};
  for (const [id, edits] of Object.entries(MEMO_EDITS)) memos[id] = apply(id, edits);
  for (const [id, m] of Object.entries(memos)) {
    const n = all.find((s) => s.id === id)!.name;
    for (const w of ["ください", "おすすめ", "ご利用", "山手公園"]) if (m.includes(w)) console.log(`  ⚠ ${n}: 「${w}」が残っています`);
  }
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan, spots: typeof d1.spots) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = spots.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", PLAN, d1.spots);
  show("2日目（直したあと）", DAY2, d2.spots);
  console.log("\n外す: 山手公園（1日目）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: Plan) =>
    plan.map((p) => ({
      id: p.id,
      data: {
        ...timeLegs(p.h, p.m, p.stay, p.legs),
        ...(memos[p.id] !== undefined ? { memo: memos[p.id] } : {}),
        ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
      },
    }));
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items(PLAN) as never, { tx, remove: [YAMATEP] });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
