/**
 * チェックリスト #406 0c3184ff「雷門とスカイツリー、下町情緒あふれる浅草さんぽプラン」の見直し（しおりえ(制作補助2)）
 * 上野東照宮 → 上野恩賜公園 →（銀座線）雷門 → 浅草寺（仲見世を歩いて本堂へ）→ 浅草花やしき（昼食）→ 東京スカイツリー（6か所 09:00〜16:30）
 * 既存の5か所はIDのまま直す（前の本文は一行だけの仮の文だったので書き直す）。浅草寺を新しく入れる。タイトルは内容に合っているのでそのまま
 * 既存の写真（東照宮の金色殿・花やしき・雷門・スカイツリー）は目で見て合っているので残す
 * 本文の出典: 上野東照宮 https://www.uenotoshogu.com/ ／上野恩賜公園 https://www.kensetsu.metro.tokyo.lg.jp/jimusho/toubuk/ueno/index_top.html ／
 *   雷門 https://www.senso-ji.jp/guide/guide01.html ／仲見世 https://www.senso-ji.jp/guide/guide02.html ／本堂 https://www.senso-ji.jp/guide/guide04.html ／
 *   浅草寺（交通・開堂時間）https://www.senso-ji.jp/ ／花やしき https://www.hanayashiki.net/ ／スカイツリー https://www.tokyo-skytree.jp/about/outline/ ・ https://www.tokyo-skytree.jp/about/design/ ・ https://www.tokyo-skytree.jp/
 * 座標の出典: Nominatim（上野東照宮 35.7153670,139.7706322／上野公園 35.7140191,139.7739291／雷門 gatehouse 35.7111333,139.7963683／
 *   浅草寺 35.7134032,139.7955265／浅草花やしき 35.7154975,139.7946127／東京スカイツリー 35.7100543,139.8107141）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-406-0c3184ff.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0c3184ff-3941-434a-807b-2285e927ce24";
const DAY1_ID = "5074acf4-af26-477f-94b9-929d202fb6dc";
const TOSHOGU_ID = "361658cb-e285-4f50-bbaf-dd85aaba19b4";
const UENO_ID = "78f2f75e-96fb-4dbd-9743-8e12ddce5aa5";
const HANAYASHIKI_ID = "e286432e-a1e7-4004-a260-e9668f107137";
const KAMINARIMON_ID = "e8802384-9018-4eb8-85ed-e5937936aff2";
const SKYTREE_ID = "27e630ba-27f2-482d-b5c8-ea53cef3722c";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "徳川家康をまつる上野東照宮と、桜や不忍池で知られる上野恩賜公園を歩いてから、銀座線で浅草へ。雷門をくぐって仲見世を歩き、浅草寺にお参りしたあとは、日本最古の遊園地とされる浅草花やしきで昼食とアトラクションを。最後は隅田川を渡って東京スカイツリーの展望台へ。上野の歴史散策から浅草の下町情緒、東京の絶景まで1日で回るプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, line: string | null, lat: number, lng: number, memo: string, extra: Record<string, unknown> = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  upd(TOSHOGU_ID, 9, 0, 40, null, null, null, 35.715367, 139.770632,
    "1627年に創建された、徳川家康（東照大権現）をまつる神社です。出世や勝利、健康長寿にご利益があるとされています。金色殿などの豪華な建物は、戦争や地震にも崩れずに残った江戸初期の貴重な建築として、国の重要文化財に指定されています。透塀の内側に入って、社殿を間近に見ることもできます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  upd(UENO_ID, 9, 45, 60, "walk", 5, null, 35.714019, 139.773929,
    "上野東照宮から歩いてすぐ。「上野の山」と呼ばれる台地と不忍池からなる公園で、園内には博物館や美術館、動物園など多くの文化施設が集まっています。春は桜、夏は蓮、秋は紅葉と、四季の景色を楽しめます。緑の中を散策して、不忍池のほとりまで歩いてみましょう。"),
  upd(KAMINARIMON_ID, 11, 5, 20, "train", 20, "東京メトロ銀座線（上野→浅草）", 35.711133, 139.796368,
    "上野から東京メトロ銀座線で浅草駅へ。浅草寺の総門で、正式な名前は「風雷神門」といい、門の左右に風神と雷神がまつられていることに由来します。「雷門」と書かれた赤い大提灯は高さ3.9m、重さは約700kgあり、提灯の底には龍の彫刻が施されています。門の前はいつも記念写真を撮る人でにぎわっているので、まわりの人に気をつけて撮りましょう。"),
  cre("浅草寺", 11, 30, 50, "walk", 5, 35.713403, 139.795527, "東京都台東区浅草2-3-1",
    "雷門から、浅草寺の表参道・仲見世を歩いて本堂へ。仲見世は雷門から宝蔵門まで約250mにわたって朱塗りの店が並ぶ、日本で最も古い商店街のひとつとされています。浅草寺は、推古天皇36年（628）に檜前浜成・竹成の兄弟が隅田川で観音さまのお像を感得したことに始まると伝わります。今の本堂は、東京大空襲で旧本堂が焼失したあと、1958年に再建されたものです。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  upd(HANAYASHIKI_ID, 12, 25, 100, "walk", 5, null, 35.715498, 139.794613,
    "浅草寺から歩いてすぐ。日本最古の遊園地とされ、開園から170年を超える歴史があります。レトロな雰囲気の園内で、アトラクションを楽しみましょう。園内にはレストランもあるので、ここで昼食にしましょう。営業時間は季節や天候で変わるので、公式の案内で確かめてから訪れましょう。"),
  upd(SKYTREE_ID, 14, 30, 120, "walk", 25, null, 35.710054, 139.810714,
    "花やしきから隅田川を渡って、歩いて約25分。高さ634m、世界一高い自立式電波塔として知られ、2012年に誕生したタワーで、そのシルエットは伝統的な日本建築にみられる「そり」や「むくり」を意識してデザインされています。高さ350mの天望デッキからは、晴れた日には富士山まで望め、フロア340ではガラス床から足元に広がる東京の景色も体感できます。さらに高さ450mの天望回廊では、空中散歩のような回廊を歩けます。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${TOSHOGU_ID},${UENO_ID},${HANAYASHIKI_ID},${KAMINARIMON_ID},${SKYTREE_ID}`) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days[0].spots.map((s) => [s.id, s.name]));

  console.log(`説明文: ${DESCRIPTION}`);
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
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
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
