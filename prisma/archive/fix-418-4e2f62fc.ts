/**
 * チェックリスト #418 4e2f62fc「科学未来館と豊洲市場、家族で学んで食べるお台場ベイエリアプラン」の見直し（しおりえ(制作補助2)、企画運営の指示で順番を早めて対応）
 * 日本科学未来館は2026年10月1日から2027年4月中旬まで全館休館のため外し（公式 https://www.miraikan.jst.go.jp/news/general/202503273938.html ）、タイトルを内容に合わせる
 * 東京都水の科学館 → そなエリア東京 →（ゆりかもめ）豊洲市場（見学と昼食）→（ゆりかもめ）東京ビッグサイト →（ゆりかもめ）南極観測船「宗谷」→ 潮風公園（6か所 09:30〜16:35）
 * 既存のビッグサイト・豊洲市場・潮風公園はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」だったので書き直す）。未来館のスポットは削除（写真も一緒に消える）
 * 表紙は未来館の写真だったので、豊洲市場の写真に替える。潮風公園の写真の撮影者の欄「Ryoma35988 (ja:利用者:Ryoma35988)」を「Ryoma35988」に直す
 * 座標の出典: Nominatim（水の科学館 35.6308222,139.7855104／そなエリア東京 35.6351622,139.7942160／豊洲市場(7街区) 35.6421477,139.7827183／
 *   東京ビッグサイト community_centre 35.6297628,139.7939817／宗谷 35.6190496,139.7736122／潮風公園 35.6242241,139.7690910）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-418-4e2f62fc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4e2f62fc-db69-4fbf-af20-0bfe61f3ae62";
const DAY1_ID = "35b23b44-87d6-4adb-aa2a-25fe79778478";
const MIRAIKAN_ID = "3bc2e68e-0ca0-4ea2-b253-8e0c0b19c273";
const BIGSIGHT_ID = "83104431-30fe-45e2-938b-da0416e2a239";
const TOYOSU_ID = "b6487ce0-d054-4928-9532-f3a41739cc23";
const SHIOKAZE_ID = "d1f6d729-9bb2-4a82-a069-9324d7d53102";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "豊洲市場と水・防災の体験館、家族で学んで食べるベイエリアプラン";
const DESCRIPTION =
  "水の旅を体感できる東京都水の科学館と、地震のあとを生き抜く知恵を学ぶそなエリア東京で親子で学び、豊洲市場で市場を見学して昼食を。午後は東京ビッグサイトを眺め、南極観測船「宗谷」を見学し、潮風公園で東京港を眺める、家族で学んで食べるベイエリアの日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, line: string | null, lat: number, lng: number, memo: string, extra: Record<string, unknown> = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, line: string | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, address, memo },
});

const order = [
  cre("東京都水の科学館", 9, 30, 60, null, null, null, 35.630822, 139.78551, "東京都江東区有明3-1-8",
    "ゆりかもめの東京ビッグサイト駅やりんかい線の国際展示場駅から歩いて向かいます。水がどこで生まれ、どこを流れて私たちのところまで来るのかを、科学の目で紹介する体感型のミュージアムです。映像シアターで「水の旅」を体感したり、水の性質を使った体験装置や実験ショーを楽しんだりでき、プロジェクションマッピングを使った給水所の見学ツアーもあります。水遊びができる広場もあるので、着替えやタオルがあると安心です。休館日は公式の案内で確かめてから訪れましょう。"),
  cre("そなエリア東京", 10, 40, 80, "walk", 10, null, 35.635162, 139.794216, "東京都江東区有明3-8-35",
    "水の科学館から歩いて約10分、東京臨海広域防災公園の中にある防災体験学習施設です。地震のあと、支援が届くまでの時間を生き抜く知恵を学ぶ体験学習ツアー「東京直下72hTOUR」を中心に、被災地や避難所の様子を再現した実物大のジオラマ展示や、首都直下地震について紹介するコーナーがあります。家族で参加できるツアーは受付順なので、早めにインフォメーションで申し込みましょう。休館日は公式の案内で確かめてから訪れましょう。"),
  upd(TOYOSU_ID, 12, 20, 100, "train", 20, "ゆりかもめ（東京ビッグサイト→市場前）", 35.642148, 139.782718,
    "そなエリア東京からゆりかもめで市場前駅へ。首都圏の生鮮食品の流通を担う中央卸売市場で、一般の人も見学エリアを歩けます。見学通路からはマグロの卸売場を見下ろせ、巨大なクロマグロのオブジェや、市場を走るターレの実物、市場の歴史の展示もあり、子どもと一緒に市場の仕組みを学べます。飲食のエリアもあるので、ここで昼食にしましょう。市場が休みの日は見学もできないので、開場日は公式の案内で確かめてから訪れましょう。"),
  upd(BIGSIGHT_ID, 14, 20, 30, "train", 20, "ゆりかもめ（市場前→東京ビッグサイト）", 35.629763, 139.793982,
    "豊洲市場からゆりかもめで東京ビッグサイト駅へ。1996年に開業した、国内で最大のコンベンション施設とされる会場で、数多くの見本市や展示会の会場として使われてきました。有明のランドマークとなっている独特な形の建物を、外からじっくり眺めてみましょう。催しの日はとても混み合うので、人の流れに気をつけて歩きましょう。"),
  cre("南極観測船「宗谷」", 15, 10, 50, "train", 20, "ゆりかもめ（東京ビッグサイト→東京国際クルーズターミナル）", 35.61905, 139.773612, "東京都江東区青海2丁目地先",
    "ゆりかもめで東京国際クルーズターミナル駅へ。船の科学館の前に係留されている船で、1938年に耐氷型の貨物船として造られ、太平洋戦争を経験したあと、日本で初めての南極観測船として知られ、1956年から1962年まで6回の南極観測に活躍しました。操舵室や船長室、観測隊員の居住区などを見学できます。船内は急な階段や狭い通路があり、雨の日は床が滑りやすいので、子どもの手を引いて気をつけて歩きましょう。休館日は公式の案内で確かめてから訪れましょう。"),
  upd(SHIOKAZE_ID, 16, 10, 25, "walk", 10, null, 35.624224, 139.769091,
    "宗谷から歩いて約10分、臨海副都心の西側にある海沿いの公園です。レインボーブリッジを背景にした東京港の景色や、対岸の大型のコンテナ船、ガントリークレーンを望めます。1日の終わりに、家族で海を眺めてひと休みしましょう。帰りはゆりかもめの駅から帰れます。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true, thumbnailUrl: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${MIRAIKAN_ID},${BIGSIGHT_ID},${TOYOSU_ID},${SHIOKAZE_ID}`) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days[0].spots.map((s) => [s.id, s.name]));
  const toyosuPhoto = await prisma.photo.findFirstOrThrow({ where: { spotId: TOYOSU_ID } });
  const shioPhoto = await prisma.photo.findMany({ where: { spotId: SHIOKAZE_ID } });
  if (shioPhoto.length !== 1 || shioPhoto[0].author !== "Ryoma35988 (ja:利用者:Ryoma35988)") throw new Error("潮風公園の写真の撮影者が想定と違います");
  console.log(`表紙: ${it.thumbnailUrl}\n→ ${toyosuPhoto.url}`);

  console.log(`タイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`削除: ${names[MIRAIKAN_ID]}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION, thumbnailUrl: toyosuPhoto.url } });
      await tx.photo.update({ where: { id: shioPhoto[0].id }, data: { author: "Ryoma35988" } });
      await setDaySpotOrder(DAY1_ID, order, { tx, remove: [MIRAIKAN_ID] });
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
