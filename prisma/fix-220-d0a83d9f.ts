/**
 * #220 d0a83d9f「呼子朝市とイカ活き造り、玄界灘の海の幸を満喫する日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 08:30〜11:30 で、昼食の行・帰りの一言がなく、本文は案内の話し方（「皆様」「お楽しみいただけたことでしょう」）。
 *   「日本三大朝市」「およそ100年」など、確かめられない書き方があった
 * 車の旅（JR唐津駅の近くでレンタカーを借りて返す）:
 *   呼子朝市 8:30 → 鯨組主中尾家屋敷 → 七ツ釜の遊覧船（マリンパル呼子）→ 呼子港（昼食・イカの活き造り）→ 佐賀県立名護屋城博物館 → 特別史跡名護屋城跡 → 波戸岬 16:30
 *   朝市は7時30分から12時までなので、朝のうちに訪ねる。#430（七ツ釜を陸から・呼子大橋・田島神社・波戸岬）と重なる波戸岬は、文を別に書いた。#249（名護屋城）は、のちの見直しで書き分ける
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   呼子朝市 佐賀県観光サイト あそぼーさが https://www.asobo-saga.jp/courses/detail/5197d15b-dd71-4c0d-8955-e9d22ef45d3d （元旦を除く毎日・7時30分〜12時・約200mの通りが歩行者天国・水産物や農産物の露店・干物）・
 *     唐津観光協会 https://www.karatsu-kankou.jp/spots/detail/52/ （元旦を除き毎日・おばちゃんとの会話）
 *   鯨組主中尾家屋敷 唐津観光協会 /spots/detail/224/ （江戸時代から明治初頭に8代170年・捕鯨業の鯨組主・「小川島鯨鯢合戦」に描かれた建物・佐賀県の重要文化財・8:45〜17:00 入館16:30・水曜休館）
 *   マリンパル呼子 /spots/detail/53/ （七ツ釜遊覧船「イカ丸」で7つのかまどのような海蝕洞窟まで・海中展望船・9:20〜16:40 季節で変わる）
 *   呼子のイカ あそぼーさが https://www.asobo-saga.jp/articles/detail/b2d97eae-3915-4ae9-b04f-25f35eba3beb （注文後にいけすからすくって調理・身が透き通る・季節ごとに旬のイカ・下足は塩焼きや天ぷらに）
 *   名護屋城博物館 /spots/detail/220/ （黄金の茶室の再現を常設展示・9:00〜17:00）／名護屋城跡 /spots/detail/221/ （豊臣秀吉が約420年前に築かせた・石垣と陣跡・天守閣跡から壱岐と対馬）
 *   波戸岬 /spots/detail/49/ （九州最西北端・日本の渚百選・玄海国定公園・玄界灘・夕日・さざえのつぼ焼）
 * 座標: OSM — 呼子の朝市 node 4500121491／マリンパル呼子 way 1322961231（Nominatim の中心）／呼子港 way 1324735496（同）／名護屋城博物館 node 1423799816／
 *   名護屋城跡 node 12871663877（historic=castle）／波戸岬 node 6657820685（node は API で名前つきを確かめた）
 *   鯨組主中尾家屋敷は OSM に点がないので、国土地理院の住所検索（呼子町呼子3750番地）33.539875,129.895004
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-220-d0a83d9f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d0a83d9f-65f0-4364-aeb0-4a5310b9e7b0";
const DAY_ID = "432c31d3-f664-47e1-8828-8d309f32dcde";
const ASAICHI = "97ff8727-1ab8-4a02-afaa-13ebe8d3bac8";
const KOU = "acc3d748-f328-4bbf-8ec3-779623c62ddd";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const DESCRIPTION =
  "朝は呼子の朝市を歩き、捕鯨で栄えた中尾家の屋敷や、遊覧船からの七ツ釜を楽しんで、昼は呼子港で名物のイカの活き造りを。午後は名護屋城博物館と名護屋城跡で豊臣秀吉の時代にふれ、玄界灘を望む波戸岬で締めくくる、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(ASAICHI, { h: 8, m: 30, stay: 50, legs: [], lat: 33.5370297, lng: 129.895091, address: "佐賀県唐津市呼子町呼子",
    memo: "この旅は車でめぐります。JR唐津駅の近くでレンタカーを借りて、車で約30分の呼子へ。朝市は元旦を除く毎日、朝7時30分から昼12時まで開かれ、約200mの通りが歩行者天国になり、魚介や野菜を並べた露店が続きます。干物は店ごとに作り方が違うので、味見をしながら選ぶのも楽しみです。地元のおかみさんたちとの会話も弾みます。人通りが多いので、まわりに気をつけて歩きましょう。" }),
  cre("鯨組主中尾家屋敷", { h: 9, m: 30, stay: 45, legs: [{ mode: "walk", min: 10 }], lat: 33.539875, lng: 129.895004, address: "佐賀県唐津市呼子町呼子3750-3",
    memo: "朝市から歩いて約10分。江戸時代から明治のはじめにかけて、8代170年にわたり呼子を拠点に捕鯨を営んだ鯨組主・中尾家の屋敷です。江戸時代の捕鯨の様子を描いた絵巻にも描かれた豪壮な建物は、当時の町屋建築を伝えるものとして、佐賀県の重要文化財に指定されています。休館日は公式の案内で確かめましょう。" }),
  cre("七ツ釜の遊覧船（マリンパル呼子）", { h: 10, m: 25, stay: 50, legs: [{ mode: "walk", min: 10 }], lat: 33.5382303, lng: 129.8938495, address: "佐賀県唐津市呼子町呼子",
    memo: "中尾家から港へ歩いて約10分。遊覧船で、7つのかまどを並べたような海蝕洞窟が続く七ツ釜まで、海の上から近づけます。古くから奇岩の景勝地として知られる場所です。運航の時刻は季節や天気で変わるので、公式の案内で確かめましょう。船の上では手すりにつかまり、足元に気をつけましょう。" }),
  upd(KOU, { h: 11, m: 30, stay: 60, legs: [{ mode: "walk", min: 15 }], lat: 33.5397012, lng: 129.8939239, address: "佐賀県唐津市呼子町呼子",
    memo: "船を降りて、港沿いを歩いて約15分。呼子の名物はイカの活き造りで、店では注文を受けてからいけすのイカを網ですくい、手早く調理してくれます。身が透き通るほど新しく、歯ごたえと甘みが楽しめます。季節ごとに旬のイカが変わるので、一年を通して味わえます。港のまわりのイカ料理の店で、昼食にしましょう。" }),
  cre("佐賀県立名護屋城博物館", { h: 12, m: 50, stay: 60, legs: [{ mode: "car", min: 20 }], lat: 33.5276739, lng: 129.8702292, address: "佐賀県唐津市鎮西町名護屋1931-3",
    memo: "呼子港から車で約20分、鎮西町の名護屋へ。名護屋城跡のすぐそばにある県立の博物館で、当時の資料をもとに再現された豊臣秀吉の「黄金の茶室」が常設で展示されています。休館日は公式の案内で確かめましょう。" }),
  cre("特別史跡名護屋城跡", { h: 13, m: 55, stay: 85, legs: [{ mode: "walk", min: 5 }], lat: 33.5270662, lng: 129.8759583, address: "佐賀県唐津市鎮西町名護屋1938-3",
    memo: "博物館から歩いて約5分。天下を統一した豊臣秀吉が、およそ420年前にこの地に築かせた城の跡で、今も石垣や、全国から集まった武将たちの陣の跡が残ります。天守台の跡からは、晴れた日には壱岐や対馬を望めます。石垣のまわりや坂道では足元に気をつけましょう。" }),
  cre("波戸岬", { h: 15, m: 35, stay: 55, legs: [{ mode: "walk", min: 5 }, { mode: "car", min: 10 }], lat: 33.5552756, lng: 129.8465907, address: "佐賀県唐津市鎮西町波戸",
    memo: "城跡の駐車場から車で約10分（歩きを含めて約15分）。九州の最も北西の端とされる岬で、玄海国定公園の中にあり、日本の渚百選にも選ばれています。目の前に玄界灘が広がり、夕方には海に沈む夕日も美しい場所です。岬の名物、さざえのつぼ焼きも味わえます。岩場では足元に気をつけましょう。帰りは、車で約40分の唐津駅へ戻り、レンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [ASAICHI, KOU].join()) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    const nm = "id" in x ? it.days[0].spots.find((s) => s.id === x.id)!.name + "(既存)" : d.name;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${nm} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY_ID, DAY, { tx });
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
