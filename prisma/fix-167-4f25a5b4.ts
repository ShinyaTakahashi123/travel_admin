/**
 * #167 4f25a5b4「中之島の歴史建築と扇町公園、アートと緑を楽しむ梅田の穴場日帰り旅」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 3か所 09:30〜13:00 で、昼食と帰りの一言がなく、本文は案内の話し方。説明文の「陶磁コレクションを誇る美術館」は行き先に入っていなかった
 * 大阪市立東洋陶磁美術館は 2026年8月3日から2027年4月ごろまで改修で休館（moco.or.jp の検索結果）なので入れない。説明文も書き直す
 * グラングリーン大阪（うめきた公園）は、ほかの2本（ac6501e9・2fd67b8b）が使っていて、タイトルにもないので外す
 * 歩きと地下鉄・京阪電車の旅（地下鉄堺筋線の扇町駅から。帰りは渡辺橋駅・肥後橋駅から）:
 *   扇町公園 9:30 → 大阪市中央公会堂 → 大阪府立中之島図書館 → 適塾 → 北浜（昼食）→ 大阪中之島美術館 → 国立国際美術館 → 大阪市立科学館 16:35
 * タイトル・季節はそのまま、説明文は書き直す
 * 梅田・中之島のほかのしおり（ac6501e9・2fd67b8b）の本文を読み、使っていない話で書いた（公会堂は岩本栄之助・岡田信一郎と辰野金吾・重要文化財でなく、建物のつくりと地下の展示室。
 *   扇町公園は堀川監獄・扇橋でなく、今の公園の広場と噴水）。中之島図書館・適塾・中之島美術館・国立国際美術館・科学館はほかのしおりにない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   扇町公園 parksgreenery.city.osaka.lg.jp/article/expo_park2/（堺筋線扇町駅から徒歩1分・マウンテンスライダーの遊具広場・広い芝生広場・水遊び憩いエリア・毎日噴水ショー）／
 *   大阪市中央公会堂 osaka-info.jp/spot/osaka-central-public-hall/（1918年竣工・鉄骨煉瓦造の地上3階地下1階・ネオ・ルネッサンス様式を基調・貸館のため館内見学不可、地下1階の展示室は自由見学・第4火曜休館）／
 *   中之島図書館 library.pref.osaka.jp/site/nakato/tatemono.html（明治37年に本館・住友家第15代吉左衛門が建物と図書購入の基金を寄付・野口孫市の設計・外観はルネッサンス、内部はバロック・中央ホールのドームに八哲の名・
 *   昭和49年に国の重要文化財）と osaka-info.jp の同館のページ（日曜・祝日は休館、検索結果）／
 *   適塾 tekijuku.osaka-u.ac.jp/ja/tekijuku（我が国唯一の蘭学塾の遺構・国史跡、重要文化財で内部を観覧できる・緒方洪庵が1838年に開いた・1845年に町屋を買って移った建物・名は号の適々斎から・
 *   福澤諭吉、橋本左内、大村益次郎らが学んだ）と同館の利用案内（10時〜16時・月曜休館、検索結果）／
 *   大阪中之島美術館 nakka-art.jp/en/nakka-news/06-en/（遠藤克彦の設計・黒くて宙に浮かんでいるような外観・パッサージュ、2階を中心に吹き抜け、階ごとに向きを変えて都市とつながる）と開館の記事（2022年2月2日開館、検索結果）／
 *   国立国際美術館 nmao.go.jp/about/design/（シーザー・ペリの設計・完全地下型・展示室は地下2階と3階・竹の生命力と現代美術の成長をイメージした外観・地上から地下3階までの吹き抜けに自然光）／
 *   大阪市立科学館 sci-museum.jp/info/guide/（4階 科学の探究、3階 物質の探究、2階 みんなでたのしむサイエンス、1階 サイエンス・ラボ・プラネタリウムは約45分・9時30分〜17時、展示場の入場は16時30分まで）
 * 座標: OSM — 扇町公園 way 54237489（park）・大阪市中央公会堂 way 162382613（historic=building）・大阪府立中之島図書館 way 220002945（library）・大阪中之島美術館 way 343837388・
 *   国立国際美術館 way 231449189・大阪市立科学館 way 231449111（museum）（way は Nominatim の中心）／北浜駅 node 7937883040（station）／
 *   適塾は OSM の名前「緒方洪庵宅」の node 2398107034（historic=archaeological_site。国土地理院の北浜三丁目3番8号の点と約10m）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-167-4f25a5b4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4f25a5b4-3398-4532-958e-c6e67d5b999b";
const DAY1_ID = "12153bd9-c72e-4fa0-badd-0cab591ea310";
const KOKAIDO = "a8ace013-2f81-4f65-80a2-0dc9a4e14a5b";
const UMEKITA = "3f143004-36e4-4f5b-b31a-ed03c209429c";
const OGIMACHI = "b44b38df-9738-43ab-9eae-193fde3cdb6f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });

const DESCRIPTION =
  "芝生と噴水の扇町公園から、中之島の大阪市中央公会堂と中之島図書館、緒方洪庵の適塾へ。北浜で昼食をとってから、黒い箱のような大阪中之島美術館、地下に広がる国立国際美術館、大阪市立科学館をめぐる、梅田のそばの建築とアートの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(OGIMACHI, { h: 9, m: 30, stay: 30, legs: [], lat: 34.7041603, lng: 135.5091473, address: "大阪府大阪市北区扇町1-1",
    memo: "この旅は歩きと電車でめぐります。地下鉄堺筋線の扇町駅から歩いてすぐ。広い芝生の広場や、長いすべり台のある遊具広場、水遊びのできる場所がそろう公園で、毎日噴水のショーも開かれています。朝の公園をひと回りしてから、中之島へ向かいましょう。" }),
  upd(KOKAIDO, { h: 10, m: 15, stay: 40, legs: [walk(3), train(5, "大阪メトロ堺筋線（扇町→北浜）"), walk(7)], lat: 34.6935404, lng: 135.5040087, address: "大阪府大阪市北区中之島1-1-27",
    memo: "扇町駅から地下鉄で北浜駅へ行き、川を渡って歩いて約7分（あわせて約15分）。大正7年（1918年）に完成した、鉄骨とレンガで造られた地上3階・地下1階の建物で、ネオ・ルネッサンス様式をもとにしています。館の中は催しに貸し出されているため、自由に見学できるのは、公会堂の歴史や品々を展示する地下1階の展示室です。休館日は公式の案内で確かめましょう。" }),
  cre("大阪府立中之島図書館", { h: 11, m: 0, stay: 25, legs: [walk(5)], lat: 34.693505, lng: 135.5031979, address: "大阪府大阪市北区中之島1-2-10",
    memo: "公会堂から西へ歩いてすぐ。明治37年に、住友家の15代当主・吉左衛門が建物と本を買うための資金を寄付して建てられた図書館で、住友家の建築技師長・野口孫市が設計しました。外観はルネッサンス様式、内部はバロック様式を基本とし、中央ホールのドームには、菅原道真や孔子、ソクラテスなど「八哲」の名が記されています。国の重要文化財です。日曜・祝日は休館なので、その日は外から眺めましょう。図書館なので、館内では静かに過ごしましょう。" }),
  cre("適塾", { h: 11, m: 35, stay: 40, legs: [walk(10)], lat: 34.691302, lng: 135.503284, address: "大阪府大阪市中央区北浜3-3-8",
    memo: "図書館から川を南へ渡り、歩いて約10分、北浜のオフィス街へ。蘭方医の緒方洪庵が天保9年（1838年）に開いた蘭学の塾で、今の建物は、弘化2年（1845年）に洪庵が町屋を買って移ったものです。名前は洪庵の号「適々斎」から付けられました。福澤諭吉や橋本左内、大村益次郎など、多くの人がここで学びました。日本でただ一つ残る蘭学塾の建物とされ、国の史跡・重要文化財として中を見学できます。休館日は公式の案内で確かめましょう。" }),
  cre("北浜（昼食）", { h: 12, m: 20, stay: 50, legs: [walk(5)], lat: 34.6911712, lng: 135.5065821, address: "大阪府大阪市中央区北浜",
    memo: "適塾から東へ歩いて約5分、北浜駅のあたりへ。このあたりで昼食にしましょう。" }),
  cre("大阪中之島美術館", { h: 13, m: 35, stay: 65, legs: [walk(8), train(5, "京阪中之島線（なにわ橋→渡辺橋）"), walk(12)], lat: 34.6923805, lng: 135.4913682, address: "大阪府大阪市北区中之島4丁目",
    memo: "なにわ橋駅から京阪電車で渡辺橋駅へ行き、川沿いを西へ歩いて約12分（あわせて約25分）。2022年2月に開館した美術館で、建築家・遠藤克彦が設計しました。黒い箱が宙に浮かんでいるような外観で、中には誰でも行き来できる「パッサージュ」と呼ばれる広場のような空間があり、2階を中心に吹き抜けが上下に広がります。休館日は公式の案内で確かめましょう。" }),
  cre("国立国際美術館", { h: 14, m: 45, stay: 60, legs: [walk(5)], lat: 34.6916929, lng: 135.492151, address: "大阪府大阪市北区中之島4丁目",
    memo: "中之島美術館のとなりへ歩いて約5分。展示室がすべて地下にある、完全地下型の美術館で、建築家シーザー・ペリが設計しました。地上に見える骨組みの外観は、竹の生命力と現代美術の成長をイメージしたものです。ガラス張りの入口から地下3階まで吹き抜けが続き、地下でも自然の光が差し込みます。休館日は公式の案内で確かめましょう。" }),
  cre("大阪市立科学館", { h: 15, m: 50, stay: 45, legs: [walk(5)], lat: 34.6912074, lng: 135.4914613, address: "大阪府大阪市北区中之島4-2-1",
    memo: "国立国際美術館のとなりへ歩いて約5分。4階の「科学の探究」から1階の「サイエンス・ラボ」まで、階ごとにテーマを変えた展示場と、約45分のプラネタリウムがある科学館です。展示場に入れるのは閉館の30分前までなので、入館の時間と休館日は公式の案内で確かめましょう。帰りは、渡辺橋駅か肥後橋駅まで歩いて約10分です。" }),
];

function show(label: string, DAY: X[]) {
  console.log(`\n${label}`);
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
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== [KOKAIDO, UMEKITA, OGIMACHI].join()) throw new Error("構成が想定と違います");
  const um = it.days[0].spots[1];
  if (um.photos.some((p) => p.url === it.thumbnailUrl)) throw new Error("外すスポットの写真が表紙です");
  show("1日目", DAY1);
  console.log(`\n説明文: ${DESCRIPTION}\n外すスポット: ${um.name}（写真 ${um.photos.length}枚）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.photo.deleteMany({ where: { spotId: UMEKITA } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx, remove: [UMEKITA] });
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
