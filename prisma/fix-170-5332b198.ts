/**
 * #170 5332b198「岡山後楽園、日本三名園の一つを巡る定番日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜11:10 で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」「お楽しみいただけたことでしょう」）。
 * 岡山市のほかのしおり（62d86c73・c18c581c・6062ae58・573dd48c: 後楽園・岡山城・県立博物館・林原美術館・夢二郷土美術館・表町など）と町なかの行き先が重なるので、
 *   後楽園のあとは吉備路（吉備津彦神社・吉備津神社・造山古墳・備中国分寺・鬼ノ城）へ向かう。吉備路はほかのしおりにない。
 *   後楽園は、ほかの3本が書いた「池田綱政・14年・1700年・日本三名園・藩主のやすらぎ」を使わず、芝生と建物、岡山城の眺め、評価で書いた
 * 車の旅（JR岡山駅の近くでレンタカーを借りて返す）:
 *   岡山後楽園 9:00 → 吉備津彦神社 → 吉備津神社 → 造山古墳 → 吉備路もてなしの館（昼食）→ 備中国分寺 → 鬼ノ城 16:30 → 岡山駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   岡山後楽園 https://okayama-korakuen.jp/ （江戸時代の大名庭園・広い芝生、池、築山、能舞台や茶室などの建物・岡山城の眺め・特別名勝・ミシュラン・グリーンガイドで三つ星）
 *   岡山観光WEB https://www.okayama-kanko.jp/spot/<番号> — detail_10048 吉備津彦神社（桃太郎の話のもとになったとされる大吉備津彦命・吉備の中山は古くから神が降りる山・夏至の朝日が鳥居の正面から差す「朝日の宮」）／
 *     10082 造山古墳（5世紀はじめでは全国最大級の前方後円墳・全長約350m・歩いて登れる古墳としては日本一とされる）／10775 吉備路もてなしの館（食事と買い物のコーナー・五重塔の向かい・火曜休み）／
 *     fc/location/12956 備中国分寺（聖武天皇の命で全国に建てられた国分寺の一つ・南北朝時代に焼失・今の五重塔は江戸時代の再建・高さ約34.3m・初層の天井に花や草木の彩色画）／
 *     detail_10755 鬼ノ城（日本100名城・歴史書に記録のない謎の古代山城・復元された西門・西門からの眺め・城壁に沿う2.8kmの道・ビジターセンターから西門まで徒歩約15分）
 *   おかやま観光コンベンション協会 https://okayama-kanko.net/sightseeing/spot/102/ 吉備津神社（本殿と拝殿は1425年に足利義満が再建し国宝・吉備津造は全国唯一とされる・約400mの廻廊・鳴釜神事）
 * 座標: OSM — 後楽園 way 82602383・吉備津彦神社 way 265888801・吉備津神社 way 690955403（Nominatim の中心）／造山古墳 node 2478974379・吉備路もてなしの館 node 13103277740・
 *   備中国分寺 node 4538946590・鬼ノ城 node 2460039705（node は API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-170-5332b198.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "5332b198-5be3-4cf5-9800-7528a8d5b7ad";
const DAY_ID = "e6eb41d9-9088-4410-ac2e-293826c0b2a1";
const KORAKUEN = "50026b53-7472-461a-8c6e-f03f2d8caedc";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const TITLE = "岡山後楽園から吉備路へ、名園と古社・古墳・五重塔をめぐる日帰りプラン";
const DESCRIPTION =
  "芝生と池が広がる大名庭園・岡山後楽園を歩いたあと、桃太郎の話の舞台ともいわれる吉備路へ。吉備津彦神社と国宝の吉備津神社、歩いて登れる造山古墳、備中国分寺の五重塔、謎の古代山城・鬼ノ城をめぐる、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(KORAKUEN, { h: 9, m: 0, stay: 90, legs: [], lat: 34.66633, lng: 133.9373948, address: "岡山県岡山市北区後楽園1-5",
    memo: "この旅は車でめぐります。JR岡山駅の近くでレンタカーを借りて、車で約10分。江戸時代の大名庭園で、広々とした芝生の間に池や築山が配され、能舞台や茶室などの建物が点在します。園内からは、岡山城の姿も眺められます。国の特別名勝で、ミシュラン・グリーンガイドでは三つ星に選ばれています。芝生のあいだの園路をめぐり、建物と庭の取り合わせを見てまわりましょう。" }),
  cre("吉備津彦神社", { h: 10, m: 55, stay: 35, legs: [car(25)], lat: 34.6765715, lng: 133.8635129, address: "岡山県岡山市北区一宮",
    memo: "後楽園から西へ、車で約25分の吉備路へ。桃太郎の話のもとになったともいわれる大吉備津彦命をまつる神社で、背後の吉備の中山は、古くから神が降りる山とあがめられてきました。夏至の日には、朝日が鳥居の正面から差し込むことから「朝日の宮」とも呼ばれます。" + PRAY }),
  cre("吉備津神社", { h: 11, m: 35, stay: 50, legs: [car(5)], lat: 34.6706821, lng: 133.8506113, address: "岡山県岡山市北区吉備津931",
    memo: "吉備津彦神社から吉備の中山のふもとを回って、車で約5分。本殿と拝殿は、室町時代の1425年に再建されたもので、国宝に指定されています。「吉備津造」と呼ばれる独特の造りは、全国でここだけとされます。境内には約400mの回廊がまっすぐに延び、お釜の鳴る音で吉凶を占う「鳴釜神事」も今に伝えられています。" + PRAY }),
  cre("造山古墳", { h: 12, m: 40, stay: 30, legs: [car(15)], lat: 34.6734617, lng: 133.8037499, address: "岡山県岡山市北区新庄下",
    memo: "吉備津神社から車で約15分。5世紀のはじめでは全国でも最大級の前方後円墳で、全長は約350mあります。歩いて登れる古墳としては日本一とされます。坂や段差があるので、足元に気をつけましょう。" }),
  cre("吉備路もてなしの館", { h: 13, m: 25, stay: 50, legs: [car(15)], lat: 34.6636995, lng: 133.7824285, address: "岡山県総社市宿418",
    memo: "造山古墳から車で約15分。備中国分寺の五重塔の向かいにある施設で、食事のコーナーや、地元の産物や朝どれの野菜を並べるコーナーがあります。ここで昼食にしましょう。休みの日は公式の案内で確かめましょう。" }),
  cre("備中国分寺", { h: 14, m: 20, stay: 40, legs: [walk(5)], lat: 34.6665369, lng: 133.7818173, address: "岡山県総社市上林1046",
    memo: "もてなしの館から歩いて約5分。奈良時代に聖武天皇の命で全国に建てられた国分寺の一つで、南北朝時代に建物の多くが焼けたと伝えられます。田園の中に立つ五重塔は江戸時代に建て直されたもので、高さは約34mあり、塔の初層の天井には、花や草木の絵が一枚ずつ描かれています。" + PRAY }),
  cre("鬼ノ城", { h: 15, m: 35, stay: 55, legs: [car(20), walk(15)], lat: 34.7275739, lng: 133.7678973, address: "岡山県総社市奥坂",
    memo: "国分寺から北へ、車で約20分の鬼城山ビジターセンターに停め、歩いて約15分（あわせて約35分）。山の上に築かれた古代の山城で、国を守るために築かれたとされながら、歴史書には記録がない、謎の多い城です。復元された西門のあたりからの眺めは、とくにすばらしいとされます。山道や石段が続くので、歩きやすい靴で、足元に気をつけて歩きましょう。帰りは、ビジターセンターまで歩いて戻り、車で約40分のJR岡山駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== KORAKUEN) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? "後楽園(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
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
