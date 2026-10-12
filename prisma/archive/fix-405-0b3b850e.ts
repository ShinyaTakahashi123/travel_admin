/**
 * チェックリスト #405 0b3b850e「レインボーブリッジとガンダム像、お台場満喫日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 豊洲市場 →（ゆりかもめ）お台場海浜公園 → 台場公園 → ダイバーシティ東京プラザ（昼食）→ 南極観測船「宗谷」→ 潮風公園 → レインボーブリッジ（遊歩道）（7か所 09:00〜16:30）
 * 実物大ユニコーンガンダム立像は2026年8月31日で展示が終わったので（公式 https://www.unicorn-gundam-statue.jp/ ）、タイトル・説明文・本文からガンダムを外す（企画運営の了承済み）
 * 日本科学未来館は2026年10月1日から全館休館なので入れない。台場公園は催しの準備などで入れない期間があるので、その旨を本文に（日付は書かない）
 * 既存の5か所はIDのまま直す（前の本文は一行だけの仮の文だったので書き直す）。お台場海浜公園の写真の撮影者の欄「Ryoma35988 (ja:利用者:Ryoma35988)」を「Ryoma35988」に直す
 * 座標の出典: Nominatim（豊洲市場(7街区) 35.6421477,139.7827183／お台場海浜公園 35.6310840,139.7773535／台場公園 35.6335286,139.7715386／ダイバーシティ東京 35.6253160,139.7758804／
 *   宗谷 tourism=museum 35.6190496,139.7736122／潮風公園 35.6242241,139.7690910／レインボーブリッジ 35.6363770,139.7639279）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-405-0b3b850e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0b3b850e-f174-49fe-8413-158011680085";
const DAY1_ID = "9f82f873-bffc-4c34-92a7-38ae559b6466";
const TOYOSU_ID = "458a87a4-5345-481d-bd3f-3f6b3ebc3778";
const KAIHIN_ID = "61317a3f-d20a-4621-b02a-2efa03e40d80";
const DIVER_ID = "45936b8d-fe2f-427f-93ca-5eaa38498f8d";
const DAIBA_ID = "90501916-7cd9-4c45-b098-d6c904e4eded";
const RAINBOW_ID = "c48cf351-e32c-4002-9c65-a72a28fa64d8";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "レインボーブリッジと台場の歴史、お台場満喫日帰りプラン";
const DESCRIPTION =
  "豊洲市場の見学から始めて、ゆりかもめでお台場へ。砂浜の広がるお台場海浜公園と、砲台の跡が残る台場公園を歩き、昼食のあとは南極観測船「宗谷」を見学。潮風公園で東京港を眺めてから、最後はレインボーブリッジの遊歩道を歩いて渡る、お台場の海と歴史を楽しむ日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, line: string | null, lat: number, lng: number, memo: string, extra: Record<string, unknown> = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  upd(TOYOSU_ID, 9, 0, 50, null, null, null, 35.642148, 139.782718,
    "首都圏の生鮮食品の流通を担う中央卸売市場で、食のプロが集まる仕入れの場ですが、一般の人も見学エリアを歩けます。水産卸売場棟では、見学通路からマグロの卸売場を見下ろせ、巨大なクロマグロのオブジェや、市場の歴史の展示もあります。仲卸売場棟には市場を走るターレの実物も展示されています。屋上の緑化広場にも上がれます。市場が休みの日は見学もできないので、開場日は公式の案内で確かめてから訪れましょう。"),
  upd(KAIHIN_ID, 10, 5, 45, "train", 15, "ゆりかもめ（市場前→お台場海浜公園）", 35.631084, 139.777354,
    "豊洲市場からゆりかもめでお台場へ。台場公園と一体となって入り江を囲み、砂浜や磯が広がる公園です。砂浜や芝生からのんびり海を眺めたり、展望デッキやスカイウォークからレインボーブリッジを望んだりできます。夕暮れや夜景の美しさでも知られています。"),
  upd(DAIBA_ID, 11, 0, 35, "walk", 10, null, 35.633529, 139.771539,
    "お台場海浜公園から歩いて約10分。国の史跡である「品川台場」の第三台場を、公園として開放したものです。海岸沿いの高台には砲台跡が、園内の中央には陣屋跡や火薬庫跡、かまど跡が残り、2017年には隣の第六台場とともに「品川台場」として続日本100名城に選ばれました。催しの準備などで入れない期間があるので、公式の案内で確かめてから訪れましょう。"),
  upd(DIVER_ID, 11, 55, 70, "walk", 20, null, 35.625316, 139.77588,
    "台場公園から歩いて約20分、青海にある商業施設です。飲食店やショップが集まっているので、ここで昼食をとり、ひと休みしましょう。",
    { name: "ダイバーシティ東京プラザ（昼食）" }),
  cre("南極観測船「宗谷」", 13, 20, 60, "walk", 15, 35.61905, 139.773612, "東京都江東区青海2丁目地先",
    "ダイバーシティから歩いて約15分、船の科学館の前に係留されている船です。1938年に耐氷型の貨物船として造られ、太平洋戦争を経験したあと、1956年から1962年まで日本で初めての南極観測船として6回の南極観測に活躍しました。1978年に巡視船として退役し、翌年からここで保存展示されています。操舵室や船長室、観測隊員の居住区などを見学できます。船内は急な階段や狭い通路があり、雨の日は床が滑りやすいので気をつけましょう。休館日は公式の案内で確かめてから訪れましょう。"),
  cre("潮風公園", 14, 25, 30, "walk", 5, 35.624224, 139.769091, "東京都品川区東八潮1・2",
    "宗谷から歩いてすぐ、臨海副都心の西側にある海沿いの公園です。レインボーブリッジを背景にした東京港の景色や、対岸のコンテナ埠頭の大型のコンテナ船、ガントリークレーンを望めます。海を眺めながらひと休みしましょう。"),
  upd(RAINBOW_ID, 15, 15, 75, "walk", 20, null, 35.636377, 139.763928,
    "潮風公園から歩いて約20分、台場側の入口から遊歩道へ。1993年（平成5年）8月に開通した、臨海副都心と都心を結ぶ橋で、約1.7kmの遊歩道があります。海に浮かぶ船や、臨海副都心の景色を眺めながら、歩いて渡ってみましょう。芝浦側に渡りきると、ゆりかもめの芝浦ふ頭駅から帰れます。休みの日や天候による閉鎖があるので、公式の案内で確かめてから向かいましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${TOYOSU_ID},${KAIHIN_ID},${DIVER_ID},${DAIBA_ID},${RAINBOW_ID}`) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days[0].spots.map((s) => [s.id, s.name]));
  const kaihinPhoto = await prisma.photo.findMany({ where: { spotId: KAIHIN_ID } });
  if (kaihinPhoto.length !== 1 || kaihinPhoto[0].author !== "Ryoma35988 (ja:利用者:Ryoma35988)") throw new Error("海浜公園の写真の撮影者が想定と違います");

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
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await tx.photo.update({ where: { id: kaihinPhoto[0].id }, data: { author: "Ryoma35988" } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
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
