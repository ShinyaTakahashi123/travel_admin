/**
 * #209 b1d9788b「菅沼合掌造り集落と五箇山民俗館、もう一つの世界遺産集落を訪ねる旅」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜11:30 で、行き方・昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。確かめられない記述（10戸に満たない・最も古い家屋を活用など）があった。
 *   2か所とも座標が相倉の近く（菅沼から約5km）になっていた
 * 車の旅（新高岡駅でレンタカーを借りて返す）: 菅沼合掌造り集落 9:00 → 五箇山民俗館 → 村上家 → 相倉合掌造り集落（昼食）→ 五箇山和紙の里 → 城端曳山会館 16:30 → 新高岡駅
 *   #489（8d2e4984、バスの旅）と行き先が重なるので、文は別に書き、白山宮・善徳寺は入れない。善徳寺は16時までなので終わりに置けない
 *   塩硝の館は修理のため当面休館（https://gokayama-info.jp/archives/9106 ）なので入れない。岩瀬家は OSM に点がないので入れない
 *   季節: 村上家が12月15日〜2月末は休業なので、冬を外す（fix-209b で書き込み）
 * 本文の出典: 菅沼 https://gokayama-info.jp/archives/1654 （江戸末期〜明治初期の合掌家屋・閑静・早朝夕方の訪問は控える）／
 *   五箇山民俗館 /archives/1664 （生活用具約200点・屋根裏の構造・養蚕・籠の渡し・9:00〜16:30）／
 *   村上家 /archives/598 ・https://www.murakamike.jp/ （約350年前・最も古い合掌家屋のひとつ・代表的な様式を当時のまま・1958年重文・囲炉裏を囲んで話・冬季休業）／
 *   相倉 /archives/1718 （原始合掌小屋・大小の合掌家屋・茅葺きのお寺・人が住まう世界遺産・資料館・お土産・飲食店）／
 *   道の駅たいら 五箇山和紙の里 /archives/593 （紙すき体験は要予約・10:00〜15:00、全国の名紙と歴史資料の展示、ロビーで10分の映像、9:00〜17:00）／
 *   城端曳山会館 https://www.tabi-nanto.jp/archives/702 （城端塗の技を尽くした曳山・祭りの映像・資料、9:00〜17:00 入館16:30まで）
 *   レンタカー: 新高岡駅の北口にレンタカーの店がある（https://store.nipponrentacar.co.jp/b/nrs/info/460194/ 、店の名前は本文に書かない）
 * 座標の出典: OSM — 菅沼合掌造り集落 node 5059456024（史跡の碑「国指定史跡越中五箇山菅沼集落」、集落の中）／
 *   五箇山民俗館 node 1420913961（推定。民俗館の OSM の点 node 479724758 は集落から約1km南の国道上にずれているので使わず、#489 と同じく隣の塩硝の館の点を元に）／
 *   村上家 way 1342700012（Nominatim の中心）／相倉合掌造り集落 node 4485300889（tourism=attraction「越中五箇山相倉集落」）／
 *   五箇山和紙の里 way 435716934（Nominatim の中心）／城端曳山会館 way 279545671（Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-209-b1d9788b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b1d9788b-d0fc-4ade-b894-f90084f94d55";
const DAY_ID = "06523fb1-21a5-4f2d-90ff-21bb9abf5386";
const SUGA = "57b200e5-e969-4aab-97c5-79b44440853c";
const MINZOKU = "997638cb-3180-4e3e-91bd-f27da536342e";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const HOMES = "家々は今も住まいとして使われています。庭や軒先に入らず、暮らしている人や家の中を撮らないようにしましょう。";

const DESCRIPTION =
  "新高岡駅でレンタカーを借りて、世界遺産の五箇山をめぐる日帰りプランです。庄川のほとりの菅沼合掌造り集落と五箇山民俗館から、最も古い合掌造りの家のひとつとされる村上家、茅葺きのお寺も残る相倉合掌造り集落へ。五箇山和紙の里で和紙にふれ、城端の曳山会館で締めくくります。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY = [
  upd(SUGA, { h: 9, m: 0, stay: 45, mode: null, min: null, lat: 36.404403, lng: 136.886601, address: "富山県南砺市菅沼578",
    memo: "この旅は車でめぐります。北陸新幹線の新高岡駅でレンタカーを借りて、東海北陸自動車道を通り、車で約50分。庄川のほとりに、江戸時代の終わりから明治のはじめにかけて建てられた合掌造りの家が集まる、ひっそりとした集落です。季節ごとに、山あいの景色の移り変わりも楽しめます。地元では、早朝や夕方の訪問を控えるようお願いしています。" + HOMES }),
  upd(MINZOKU, { h: 9, m: 50, stay: 40, mode: "walk", min: 5, lat: 36.4041163, lng: 136.8869617, address: "富山県南砺市菅沼436",
    memo: "集落の中を歩いて約5分。山あいの村で使われてきた生活の道具、約200点を集めた資料館です。階段を上ると、合掌造りの屋根裏の組み方や、蚕を育てていた様子を間近に見られ、「籠の渡し」の展示もあります。となりの塩硝の館は修理のため休館が続いているので、公式の案内で確かめましょう。" }),
  cre("村上家", { h: 10, m: 45, stay: 50, mode: "car", min: 15, lat: 36.4105654, lng: 136.9309668, address: "富山県南砺市上梨742",
    memo: "菅沼から車で約15分、庄川沿いを下って上梨へ。約350年前に建てられたとされる、最も古い合掌造りの家のひとつで、国の重要文化財に指定されています。合掌造りの代表的な造りを当時のまま残しており、囲炉裏を囲んで、五箇山の暮らしや民俗文化についての話を聞けます。冬の間は休業するほか、休館日もあるので、公式の案内で確かめましょう。" }),
  cre("相倉合掌造り集落", { h: 11, m: 50, stay: 115, mode: "car", min: 15, lat: 36.426177, lng: 136.9355622, address: "富山県南砺市相倉611",
    memo: "村上家から車で約15分。原始的な合掌造りの小屋から、大小さまざまな合掌造りの家、茅葺き屋根のお寺までが残り、五箇山の昔ながらの風景を伝える集落です。合掌造りの家を生かした資料館やお土産の店、食事の店もあるので、集落を歩きながら、ここで昼食にしましょう。" + HOMES }),
  cre("五箇山和紙の里", { h: 14, m: 0, stay: 70, mode: "car", min: 15, lat: 36.4455974, lng: 136.9735167, address: "富山県南砺市東中江215",
    memo: "相倉から車で約15分、庄川沿いの東中江にある道の駅へ。五箇山和紙の紙すきを体験できる施設で、全国の名高い和紙や歴史の資料が展示され、ロビーでは和紙づくりを紹介する約10分の映像も見られます。紙すき体験は予約が必要で、受付の時間も決まっているので、公式の案内で確かめましょう。" }),
  cre("城端曳山会館", { h: 15, m: 45, stay: 45, mode: "car", min: 35, lat: 36.5145735, lng: 136.9021174, address: "富山県南砺市城端579-3",
    memo: "和紙の里から車で約35分、山を越えて城端の町へ。城端の曳山祭で引き回される曳山を展示する会館で、城端塗の技を尽くした華やかな曳山や、祭りの映像、ゆかりの資料を見られます。休館日は公式の案内で確かめましょう。このあとは、車で約30分の新高岡駅へ戻り、レンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [SUGA, MINZOKU].join()) throw new Error("構成が想定と違います");
  if (it.days[0].spots.some((s) => s.photos.length)) throw new Error("写真があります（想定外）");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${"id" in x ? (x.id === SUGA ? "菅沼(既存)" : "民俗館(既存)") : d.name} ${String(d.memo).length}字`);
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
