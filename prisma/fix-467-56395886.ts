/**
 * チェックリスト #467 56395886「浅草寺の参道とパンダに会える、上野・浅草満喫旅」の見直し（しおりえ(制作補助2)、企画運営の急ぎの依頼）
 * 上野動物園の双子のパンダ（シャオシャオ・レイレイ）は2026年1月27日に中国へ返還されたので、タイトル・説明文・本文の「パンダに会える」を直す
 * タイトル: 「浅草寺の参道と上野の森、上野・浅草満喫旅」
 * 1日目: 上野東照宮 → 上野動物園（昼食）→ 上野恩賜公園 → 東京国立博物館 →（銀座線）浅草花やしき（5か所 09:00〜16:30）
 * 2日目: 雷門 → 仲見世通り → 浅草寺（新規）→ 隅田公園 → すみだリバーウォーク（前の「隅田川」をIDのまま名前を変える）→ 東京スカイツリー（6か所 09:00〜14:30。帰る日）
 * 既存の本文は1行ずつの短い説明で、確かめられない最上級（「日本最大級」など）もあったので、全部を公式で確かめて書き直す。2日目は雷門を先に並べ直す
 * 既存の写真8枚は目で見て合っているので残す
 * 本文の出典: 上野東照宮 https://www.uenotoshogu.com/ ／上野動物園 https://www.tokyo-zoo.net/ueno/about/index.html ・パンダの返還 https://www.tokyo-zoo.net/event/panda_xiaolei/ ・
 *   https://www.tokyo-zoo.net/topic/topics_detail?kind=news&inst=ueno&link_num=29508 ／上野恩賜公園 https://www.kensetsu.metro.tokyo.lg.jp/jimusho/toubuk/ueno/kouenannai ／
 *   東京国立博物館 https://www.tnm.jp/modules/r_free_page/index.php?id=143 ／浅草花やしき https://www.hanayashiki.jp/our-history/ ／
 *   浅草寺 雷門 https://www.senso-ji.jp/guide/guide01.html ・仲見世 guide02 ・宝蔵門 guide03 ・本堂 guide04 ・歴史 https://www.senso-ji.jp/about/ ／
 *   隅田公園 https://t-navi.city.taito.lg.jp/spot/1011 ・ https://t-navi.city.taito.lg.jp/spot/1043 ／すみだリバーウォーク https://t-navi.city.taito.lg.jp/spot/1050 ・
 *   東京ミズマチ https://www.gotokyo.org/jp/spot/1795/index.html ／東京スカイツリー https://www.tokyo-skytree.jp/about/outline/ ・ https://www.tokyo-skytree.jp/about/design/
 * 座標の出典: Nominatim（上野東照宮 35.7153670,139.7706322／上野動物園 35.7153426,139.7688960／上野公園 35.7140191,139.7739291／東京国立博物館 35.7190448,139.7759676／
 *   浅草花やしき 35.7154975,139.7946127／雷門 35.7111333,139.7963683／仲見世通り 35.7125206,139.7965171／浅草寺 35.7134032,139.7955265／
 *   隅田公園 35.7155065,139.8031428／すみだリバーウォーク 35.7121012,139.8008439／東京スカイツリー 35.7100543,139.8107141）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-467-56395886.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "56395886-d541-4396-b650-e006867bef6a";
const DAY1_ID = "5dd5fe4a-7f3b-4653-b9b6-c26b7fdf9fd1";
const DAY2_ID = "9599b353-bdac-4c29-9018-dd14c2a94137";
const TOSHOGU = "af6f05f1-2ca9-41f9-a253-bed3fd3bacb5";
const ZOO = "e12d19d0-d6a6-4487-84ec-b4d225efbf91";
const PARK = "7ad36aed-fdd7-4674-a19f-63c5eb89a97a";
const TNM = "8c9563a2-277a-411b-9e50-bfa84127186e";
const HANAYASHIKI = "7576c498-58bc-4b2e-9be2-3ea4aa3d349f";
const NAKAMISE = "4d5358e8-0e94-4b56-aa9c-b6f4944e91f8";
const KAMINARIMON = "bb582650-7a7e-4ef3-a84b-297cdbd3af18";
const SUMIDA_PARK = "56b844ec-e66e-45c9-98a9-886c328afded";
const SUMIDA_RIVER = "ccc43a13-271a-4434-9b9d-ff94c84b8aec";
const SKYTREE = "5feba797-ed01-4075-9d02-ab7917f6d898";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "浅草寺の参道と上野の森、上野・浅草満喫旅";
const DESCRIPTION =
  "1日目は上野東照宮から上野動物園、上野恩賜公園、東京国立博物館をめぐり、夕方は日本最古の遊園地とされる浅草花やしきへ。2日目は雷門をくぐって仲見世を歩き、浅草寺にお参り。隅田公園からすみだリバーウォークで隅田川を渡り、東京スカイツリーへ。上野の歴史と浅草の下町情緒を満喫する1泊2日です。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

type Extra = Record<string, unknown>;
const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, line: string | null, lat: number, lng: number, memo: string, extra: Extra = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const day1 = [
  upd(TOSHOGU, 9, 0, 40, null, null, null, 35.715367, 139.770632,
    "旅の始まりは上野東照宮へ。1627年に創建された神社で、徳川家康公（東照大権現）を神様としてまつっています。東照宮は日光や久能山のほか全国に数多くあり、ここ上野東照宮は、出世・勝利・健康長寿に特にご利益があるとされています。金色殿などの豪華な建物は、戦争や地震にも崩れずに残った江戸初期の貴重な建築として、国の重要文化財に指定されています。透塀の内側で社殿を間近に見られる拝観の時間は、公式の案内で確かめましょう。境内のぼたん苑では、例年1月〜2月ごろに冬ぼたん、4月〜5月ごろに春のぼたん祭りが開かれます。" + RESPECT),
  upd(ZOO, 9, 45, 150, "walk", 5, null, 35.715343, 139.768896,
    "東照宮から歩いてすぐ。1882年（明治15年）に開園した、日本で最初の動物園とされる動物園です。都心にありながら自然と景観を残す都市型の動物園で、約300種3,000点の動物を飼育しています。巨樹が茂る丘の東園には、ゴリラ・トラのすむ森、ゾウのすむ森、クマたちの丘、ホッキョクグマとアザラシの海などがあり、不忍池の北側の西園には、キリン、カバ、サイ、ハシビロコウ、アイアイなどアフリカの動物や、小獣館、両生爬虫類館、子ども動物園があります。1972年の初来園から長く親しまれてきたジャイアントパンダは、双子のシャオシャオとレイレイが2026年1月に中国へ返還されました。園内のフードショップで昼食にしましょう。休園日は公式の案内で確かめてから訪れましょう。"),
  upd(PARK, 12, 20, 40, "walk", 5, null, 35.714019, 139.773929,
    "動物園を出たら、上野恩賜公園を歩きましょう。明治6年（1873年）の太政官布達で、芝・浅草・深川・飛鳥山とともに、日本で初めて公園に指定された場所の一つです。江戸時代には東叡山寛永寺の境内で、明治維新のあと国の土地になり、大正13年（1924年）に宮内省から東京市に下賜されたことから「恩賜」の名が付いています。約1,200本の桜があり、江戸時代から受け継がれてきた桜の名所としても知られています。"),
  upd(TNM, 13, 10, 120, "walk", 10, null, 35.719045, 139.775968,
    "公園を北へ歩いて、東京国立博物館へ。明治5年（1872年）、文部省博物局が湯島聖堂大成殿で開いた最初の博覧会をはじまりとする博物館で、明治15年（1882年）に上野公園に移りました。日本の美術を紹介する本館（日本ギャラリー）、アジアの美術を集めた東洋館（アジアギャラリー）、日本の考古と特別展の平成館、法隆寺献納宝物を収めた法隆寺宝物館などが並び、広い構内をめぐりながら見学できます。休館日は公式の案内で確かめてから訪れましょう。"),
  upd(HANAYASHIKI, 15, 30, 60, "train", 20, "東京メトロ銀座線", 35.715498, 139.794613,
    "上野駅から東京メトロ銀座線で浅草へ。浅草花やしきは、江戸時代末期の嘉永6年（1853年）に、造園師の森田六三郎が牡丹と菊細工を中心とした花園として開いたのが始まりで、日本最古の遊園地とされています。明治5年ごろから遊具が置かれるようになり、震災や戦争による閉園の時代を経て、昭和24年（1949年）に遊園地として再建されました。昭和28年（1953年）に営業を始めたローラーコースターは、日本に現存する最古のコースターとされています。レトロな雰囲気の中で1日目を締めくくり、今夜は浅草の近くに泊まります。"),
];

const day2 = [
  upd(KAMINARIMON, 9, 0, 20, null, null, null, 35.711133, 139.796368,
    "2日目は、浅草寺の総門・雷門から。正式名称は「風雷神門」で、門の左右に風神と雷神をまつっていることが名前の由来です。平公雅が天慶5年（942年）に堂塔伽藍を一新した際、総門を建てたと伝えられています。「雷門」と書かれた赤い大提灯は、高さ3.9m、幅3.3m、重さ約700kgあり、提灯の底には龍の彫刻が施されています。門の前はいつも記念写真を撮る人でにぎわっています。"),
  upd(NAKAMISE, 9, 21, 39, "walk", 1, null, 35.712521, 139.796517,
    "雷門をくぐると、浅草寺の表参道・仲見世です。宝蔵門まで長さ約250mにわたって、参道の両側に朱塗りの店が並び、日本で最も古い商店街のひとつとされています。「仲見世」の名は、浅草広小路（今の雷門通り）あたりの店と、観音堂の前の店との中間、つまり「中店」から来たともいわれます。人通りが多いので、立ち止まるときはまわりに気をつけましょう。"),
  cre("浅草寺", 10, 5, 50, "walk", 5, 35.713403, 139.795527, "東京都台東区浅草2丁目",
    "仲見世の先の宝蔵門をくぐり、浅草寺の本堂へ。寺伝によると、推古天皇36年（628年）、宮戸川（今の隅田川）で漁をしていた檜前浜成・竹成の兄弟の網にかかった観音像が、ご本尊の始まりとされています。1400年近い歴史をもつ観音霊場です。本堂はご本尊の聖観世音菩薩をまつることから観音堂とも呼ばれ、国宝だった旧本堂は昭和20年（1945年）の東京大空襲で焼失し、全国の信徒の浄財によって昭和33年（1958年）に再建されました。宝蔵門の中央の大提灯は、高さ3.75m、重さ約450kgあります。" + RESPECT),
  upd(SUMIDA_PARK, 11, 5, 40, "walk", 10, null, 35.715507, 139.803143,
    "浅草寺から隅田川のほうへ歩いて、隅田公園へ。隅田川の両岸に広がる公園で、江戸時代から桜の名所として知られています。吾妻橋から桜橋まで、川の両側の堤に約1km続く桜並木は、日本さくら名所百選に選ばれています。東京スカイツリーを眺める絶好の場所でもあり、春は桜とスカイツリーの共演が人気です。"),
  upd(SUMIDA_RIVER, 11, 50, 25, "walk", 5, null, 35.712101, 139.800844,
    "隅田公園から、東武鉄道の浅草駅ととうきょうスカイツリー駅の間にある隅田川橋梁に設けられた歩道橋、すみだリバーウォークへ。全長約160mで、浅草と東京スカイツリーを最短で結ぶ歩行者ルートのひとつです。途中のガラス床から隅田川を見下ろしたり、すぐ横を走る電車を間近に眺めたりできます。渡った先の高架下には、2020年に誕生した複合商業施設「東京ミズマチ」があります。通れる時間は公式の案内で確かめましょう。",
    { name: "すみだリバーウォーク", address: "東京都台東区花川戸1丁目" }),
  upd(SKYTREE, 12, 30, 120, "walk", 15, null, 35.710054, 139.810714,
    "東京ミズマチから歩いて約15分。2012年に誕生した、高さ634mの自立式電波塔で、世界一高いタワーとされています。高さ350mの天望デッキと、450mの天望回廊の2つの展望台があり、関東一円を見渡す大パノラマが広がります。空に向かって伸びる大きな木をイメージしたデザインで、シルエットは伝統的な日本建築などに見られる「そり」や「むくり」を意識しているそうです。展望台を楽しんだら、ふもとで昼食をとり、2日間の上野・浅草の旅を締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== [TOSHOGU, ZOO, PARK, TNM, HANAYASHIKI].join() ||
    days[1].spots.map((s) => s.id).join() !== [NAKAMISE, KAMINARIMON, SUMIDA_PARK, SUMIDA_RIVER, SKYTREE].join()) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots).map((s) => [s.id, s.name]));

  console.log(`タイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, order] of [[1, day1], [2, day2]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      const label = "id" in x ? `${names[x.id]}(既存)${d.name ? `→${d.name}` : ""}` : d.name;
      console.log(`D${n} ${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${label} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
      await setDaySpotOrder(DAY2_ID, day2, { tx });
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
