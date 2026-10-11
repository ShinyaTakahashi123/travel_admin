/**
 * #249 124d62bc「名護屋城跡、豊臣秀吉の巨大城郭跡を訪ねる歴史日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜12:00 で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」「お楽しみいただけたことでしょう」）。
 *   「大坂城に次ぐ規模」「人口10万人」「約120か所」など、出典で確かめていない数は書かない（説明文の「大坂城に次ぐ規模」も外す）
 * 唐津市のほかのしおり（#220 d0a83d9f: 名護屋城博物館の黄金の茶室・城跡に残る陣跡・天守台から壱岐や対馬、7ffb8f61・7d685f8a: 波戸岬・七ツ釜・唐津城・虹の松原など）の
 *   本文を読み、使っていない話で書いた（城跡: 割普請・破却と発掘の遺構、博物館: 交流史の4つのコーナーと木下延俊陣跡）。堀秀治陣跡・曳山展示場・鏡山はほかのしおりにない
 * 車の旅（JR唐津駅の近くでレンタカーを借りて返す）:
 *   名護屋城跡 9:30 → 堀秀治陣跡 → 道の駅桃山天下市（昼食）→ 佐賀県立名護屋城博物館（裏の木下延俊陣跡も）→ 曳山展示場 → 鏡山展望台 16:30 → 唐津駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   佐賀県立名護屋城博物館 https://saga-museum.jp/nagoya/nagoya-castle/nagoya.html 名護屋城跡（文禄・慶長の役の拠点・1591年に築城が始まり、諸大名の割普請で数か月で完成・秀吉は1年以上滞在・
 *     建物は江戸時代初期に破却され石垣が広く崩されている・発掘で礎石や玉石敷の遺構・天守台に五層七階の天守・本丸御殿跡は遺構を平面表示・博物館→三ノ丸→本丸で約30〜40分）／
 *     https://saga-museum.jp/nagoya/nagoya-castle/jinato.html 陣跡（約160の大名・150あまりの陣跡・23か所が特別史跡・堀秀治陣跡は御殿や能舞台の跡が確かめられたもっとも整備された陣跡・
 *     木下延俊は秀吉の甥で大手口を守る場所、博物館裏から見学）／https://saga-museum.jp/nagoya/event/004086.html 木下延俊陣跡（2022年11月27日から再整備して公開・御殿や茶の湯の遺構の露出展示）／
 *     https://saga-museum.jp/nagoya/information/ と検索結果（1993年10月開館・常設展示は「日本列島と朝鮮半島との交流史」・名護屋城以前、歴史の中の名護屋城、名護屋城以後、特別史跡の4コーナー・月曜休館）
 *   よむの道の駅 https://yomuno.jp/michinoeki/saga/1099 道の駅桃山天下市（レストラン・軽食・直売所・地元グルメ）
 *   唐津観光協会 https://www.karatsu-kankou.jp/spots/detail/188/ 曳山展示場（唐津くんちの14台の曳山・佐賀県の重要有形民俗文化財・2021年10月からふるさと会館アルピノの旧多目的ホールに仮移転・
 *     11月3日・4日と年末は休み）／https://www.karatsu-kankou.jp/spots/detail/2 鏡山（標高284m・頂上の展望台から虹の松原、唐津の町、唐津湾を一望）
 * 座標: OSM — 名護屋城阯本丸 node 3388740293・佐賀県立名護屋城博物館 node 1423799816・鏡山展望台 node 6419027089（node は API で名前つきを確かめた）／
 *   堀秀治陣跡 way 331778615・桃山天下市 way 331366073・アルピノ way 267311552（Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-249-124d62bc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "124d62bc-9be4-4cec-b809-ba6361fa217b";
const DAY_ID = "328b12df-9800-495f-aa9e-0e98966e9dde";
const CASTLE = "5b281f4a-497a-461b-aecf-6ae4484c6606";
const MUSEUM = "72b83e47-0fa7-41c9-a66c-d2f61c61d62b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });

const DESCRIPTION =
  "豊臣秀吉が文禄・慶長の役の拠点として築いた名護屋城の跡と、全国の大名が構えた陣の跡を歩き、日本列島と朝鮮半島の長い交流の歴史を伝える博物館へ。午後は唐津に戻り、唐津くんちの曳山と、鏡山の展望台からの眺めを楽しむ、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(CASTLE, { h: 9, m: 30, stay: 70, legs: [], lat: 33.5299938, lng: 129.8694233, address: "佐賀県唐津市鎮西町名護屋",
    memo: "この旅は車でめぐります。JR唐津駅の近くでレンタカーを借りて、車で約35分。豊臣秀吉が文禄・慶長の役の拠点とした城の跡で、1591年に築城が始まり、全国の大名が工事を分け合う「割普請」で、わずか数か月で完成したとされます。建物は江戸時代のはじめに取り壊され、石垣も広く崩されましたが、発掘で見つかった礎石や玉石敷きの跡が、本丸の御殿跡などに示されています。三ノ丸から本丸へ、30〜40分ほどかけて歩きましょう。石垣のまわりや坂道では、足元に気をつけましょう。" }),
  cre("堀秀治陣跡", { h: 10, m: 50, stay: 40, legs: [car(10)], lat: 33.523556, lng: 129.8631343, address: "佐賀県唐津市鎮西町串",
    memo: "城跡から車で約10分。名護屋には約160の大名が集まり、まわりの丘に陣屋を構えました。今も150あまりの陣跡が確かめられています。越前の大名・堀秀治の陣跡は、御殿や能舞台の跡が見つかった、もっとも整えられた陣跡とされます。" }),
  cre("道の駅桃山天下市", { h: 11, m: 40, stay: 60, legs: [car(10)], lat: 33.5287036, lng: 129.873279, address: "佐賀県唐津市鎮西町名護屋1859",
    memo: "陣跡から車で約10分、城跡のふもとへ戻ります。地元の産物が並ぶ直売所や、レストランのある道の駅です。ここで昼食にしましょう。" }),
  upd(MUSEUM, { h: 12, m: 45, stay: 75, legs: [car(5)], lat: 33.5276739, lng: 129.8702292, address: "佐賀県唐津市鎮西町名護屋1931-3",
    memo: "道の駅から車で約5分。名護屋城跡と陣跡を守り整えることと、文禄・慶長の役、そして日本列島と朝鮮半島との長い交流の歴史を伝えることを目的に、1993年に開館した博物館です。常設展示は、名護屋城より前の時代、名護屋城の時代、名護屋城より後の時代、特別史跡の4つに分かれ、両国の交流の歩みを長い時の流れの中でたどれます。博物館の裏には、秀吉の甥・木下延俊の陣跡があり、御殿や茶の湯にかかわる遺構を、そのまま見られるように整えています。休館日は公式の案内で確かめましょう。" }),
  cre("曳山展示場", { h: 14, m: 40, stay: 50, legs: [car(40)], lat: 33.4459594, lng: 129.9699197, address: "佐賀県唐津市新興町2881-1",
    memo: "博物館から車で約40分、唐津の町へ戻ります。秋の唐津くんちで町を巡る14台の曳山を展示している施設で、曳山は佐賀県の重要有形民俗文化財に指定されています。今は唐津駅近くの「ふるさと会館アルピノ」の中に移って展示しています。くんちの日や年末は休みなので、公式の案内で確かめましょう。" }),
  cre("鏡山展望台", { h: 15, m: 50, stay: 40, legs: [car(20)], lat: 33.4307599, lng: 130.0179359, address: "佐賀県唐津市鏡",
    memo: "展示場から車で約20分。唐津の町の東にそびえる標高284mの鏡山の頂上の展望台で、海沿いに続く虹の松原の松林と、唐津の町並み、唐津湾を一度に見渡せます。山道はカーブが続くので、ゆっくり運転しましょう。帰りは、車で約20分のJR唐津駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [CASTLE, MUSEUM].join()) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? x.id.slice(0, 8) + "(既存)" : d.name} ${String(d.memo).length}字`);
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
