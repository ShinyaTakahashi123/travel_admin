/**
 * チェックリスト #426 6e5b2d45「濃溝の滝と養老渓谷、房総の絶景自然を巡る1泊2日」の見直し（しおりえ(制作補助2)）
 * 車の旅。1日目: 濃溝の滝（亀岩の洞窟）→ 亀山湖（新規、昼食）→ 大福山展望台（新規）→ 養老渓谷（温泉に泊まる）（4か所 09:00〜16:30）
 *        2日目: 粟又の滝 → 大多喜城（新規）→ 大多喜の城下町（新規、昼食）→ 夷隅神社（新規）（4か所 09:00〜13:00。帰る日）
 * 養老渓谷の遊歩道は台風などの被害で一部の通行規制が続いている（大多喜町、2026年9月29日更新）: 中瀬遊歩道の弘文洞跡は見られない、
 *   滝めぐり遊歩道は粟又の滝側から約100m で折り返し、面白峡遊歩道は通行止め。遊歩道を歩く行程にはせず、規制の一文を入れる
 * 大多喜城（県立中央博物館大多喜城分館）は施設改修で休館中。敷地には入れて、研修館で展示をしているので、その書き方にする
 * 既存の3か所はIDのまま、本文を公式で確かめて書き直す（前の本文は「皆様、…」の話し言葉）:
 *   - 養老渓谷の「モール泉」「湯治場」、粟又の滝の「落差約30m」「県内有数の紅葉の名所」は開いた公式で確かめられないので外す
 *   - 粟又の滝の座標が養老渓谷と同じ（35.257611,140.160083）だったので、OSM の滝の点に直す
 * 写真: 養老渓谷と粟又の滝に同じ写真（Yoro_Keikoku_04.JPG、渓谷の崖と川）が付いていた。粟又の滝の写真ではないので粟又の滝の行は外す（Blobは消さない）。
 *   養老渓谷・亀岩の洞窟の写真は合っているので残す。表紙（亀岩の洞窟）はそのまま
 * 本文の出典: 君津市 清水渓流広場 https://www.city.kimitsu.lg.jp/site/kanko/2259.html ・君津市観光協会 https://www.kimitsu-kankou.com/gallery/simizukeiryuhiroba/ ／
 *   亀山湖 https://www.city.kimitsu.lg.jp/site/kanko/2180.html ／大福山 https://www.youroukeikoku.com/spot/daifukuzan ／
 *   養老渓谷 https://www.youroukeikoku.com/ ・遊歩道の通行規制 https://www.town.otaki.chiba.jp/kanko_iju_bunka/kanko_iju/kanko_jyouho/5/4/1471.html ・
 *   道路の通行規制 https://www.town.otaki.chiba.jp/kanko_iju_bunka/kanko_iju/kanko_jyouho/5/4/2163.html ／
 *   粟又の滝 https://www.town.otaki.chiba.jp/kanko_iju_bunka/kanko_iju/kanko_jyouho/5/4/1482.html ・滝めぐり遊歩道 https://www.town.otaki.chiba.jp/kanko_iju_bunka/kanko_iju/kanko_jyouho/5/4/1479.html ／
 *   大多喜城 https://www.town.otaki.chiba.jp/kanko_iju_bunka/kanko_iju/kanko_jyouho/5/3/1488.html ・ https://www.chiba-muse.or.jp/NATURAL/sonan/page-1517920926854/page-1638417115624/ ／
 *   房総の小江戸大多喜 https://www.town.otaki.chiba.jp/kanko_iju_bunka/kanko_iju/kanko_jyouho/5/1/1485.html ／夷隅神社 https://www.town.otaki.chiba.jp/kanko_iju_bunka/kanko_iju/kanko_jyouho/5/1/1484.html
 * 座標の出典: Nominatim（亀岩の洞窟 35.1853815,140.0602108／亀山湖 35.2219510,140.0792708／大福山展望台 35.2567830,140.1252266）、
 *   OSM/Overpass（養老渓谷観音橋 way 126483152 35.2550163,140.1616164／粟又の滝 node 4681426542 35.2192109,140.1824472（OSMの名前は「栗又の滝」と誤記）／
 *   千葉県立中央博物館大多喜城分館 node 1420729461 35.2859446,140.2391733／渡辺家住宅 way 1375168067 35.2870149,140.2460884／夷隅神社 way 734114707 35.2826778,140.2460309）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-426-6e5b2d45.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "6e5b2d45-92e1-4cfe-913d-b80babce8573";
const DAY1_ID = "d5b3d03a-13af-4203-9a01-6ec52963bf8d";
const DAY2_ID = "aa4b3de6-3fa5-4638-b964-334abfeaf8bb";
const NOMIZO = "70610f3e-8f58-47a2-ac55-cab768d7469c";
const YORO = "69a50b2d-f9f6-4d80-b941-afbe7a26e1c8";
const AWAMATA = "556c2808-d9f2-43d6-8686-77a271b463e4";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "神秘的な「亀岩の洞窟」で知られる濃溝の滝から、千葉県最大の多目的ダムの湖・亀山湖、大福山の展望台を経て、養老渓谷の温泉へ。2日目は、ゆるやかな岩肌を流れ落ちる粟又の滝から、本多忠勝ゆかりの大多喜城と城下町へ。房総の渓谷と城下町をめぐる、車の1泊2日です。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const day1 = [
  upd(NOMIZO, 9, 0, 60, null, null, 35.185382, 140.060211,
    "旅の始まりは、君津市の清水渓流広場（濃溝の滝・亀岩の洞窟）へ。房総半島の内陸部、笹川の上流にある自然公園で、遊歩道が整えられています。亀岩の洞窟は、約350年前に水田をつくるため、曲がった川のくびれた部分をトンネルでつないだ「川廻し」という工事から生まれた洞窟です。洞窟から差し込む光が水面に映ってハート形を描く写真がSNSで話題になり、千葉県を代表する観光スポットの一つになりました。ハート形が見やすいのは、3月と9月のお彼岸のころの早朝とされています。洞窟の正面付近は落石や崖崩れのおそれがあるので、立ち入るときは十分に気をつけましょう。"),
  cre("亀山湖", 10, 15, 75, "car", 15, 35.221951, 140.079271, "千葉県君津市",
    "濃溝の滝から車で約15分。小櫃川の上流にある亀山ダムは、昭和46年から10年の歳月をかけて昭和56年に完成した、千葉県で最初の、そして最大の多目的ダムです。ダム湖の亀山湖は四季折々に美しい表情を見せ、湖に架かる25の橋をめぐるサイクリングやハイキング、ボート遊びや釣りが楽しめます。紅葉の時期には、ボートに乗って湖面から見る紅葉が見事です。ダムと湖は、君津市の「次世代に伝えたい20世紀遺産」にも指定されています。湖のまわりで昼食にしましょう。"),
  cre("大福山展望台", 13, 10, 50, "car", 40, 35.256783, 140.125227, "千葉県市原市石塚",
    "亀山湖から車で約40分。標高292mの大福山は市原市でいちばん高い山で、山頂の大福山展望台からは、紅葉のころには養老渓谷の山々に連なる紅葉を眺められます。梅ヶ瀬渓谷へ続くハイキングコースもありますが、道は険しいので、歩きやすい靴で出かけましょう。この地域では県道の一部で土砂崩れによる通行規制が続いているので、道順は千葉県の最新の道路情報で確かめましょう。"),
  upd(YORO, 14, 20, 130, "car", 20, 35.255016, 140.161616,
    "大福山から車で約20分。養老川沿いの養老渓谷は、渓流釣りやハイキングなどを手軽に楽しめる温泉郷です。観音橋のあたりから渓谷の景色を眺めたら、温泉宿に入ってゆっくり過ごしましょう。渓谷の遊歩道は、台風などの影響で壊れたところがあり、一部で通行規制が続いています。中瀬遊歩道の弘文洞跡は今は見られず、雨のあとは川の増水で通行止めになることもあるので、大多喜町の最新の案内を確かめてから歩きましょう。今夜は養老渓谷に泊まります。"),
];

const day2 = [
  upd(AWAMATA, 9, 0, 60, null, null, 35.219211, 140.182447,
    "2日目は粟又の滝へ。房総一の名瀑とされる滝で、100mにわたって、滑り台のようなゆるやかな岩肌を流れ落ちます。秋には渓谷が紅葉で赤く色づきます。粟又の滝から下流へ続く約2kmの「滝めぐり遊歩道」は、今は滝の側から約100mの地点で折り返しになっていて、滝のまわりだけを散策できます。雨のあとは増水で通行止めになることもあるので、最新の案内を確かめましょう。濡れた岩場は滑りやすいので、足元に気をつけましょう。"),
  cre("大多喜城", 10, 30, 50, "car", 30, 35.285945, 140.239173, "千葉県夷隅郡大多喜町大多喜481",
    "粟又の滝から車で約30分。徳川四天王のひとり、本多忠勝が初代城主となった大多喜城の本丸跡に、城郭の様式で建てられた千葉県立中央博物館大多喜城分館があります。分館の建物は施設改修のため休館が続いていますが、敷地内には入ることができ、敷地内から城の写真も撮れます。隣の研修館では「大多喜城と城下町」を紹介する展示が行われています。"),
  cre("大多喜の城下町（渡辺家住宅）", 11, 30, 60, "walk", 10, 35.287015, 140.246088, "千葉県夷隅郡大多喜町久保",
    "大多喜城から歩いて約10分。本多忠勝が城を築いた歴史をもつ大多喜では、城下町の面影を残す久保・桜台・新丁地区に、江戸時代から変わらないたたずまいの建物が点在しています。嘉永2年（1849年）に建てられた大商家で国の重要文化財の渡辺家住宅や、江戸時代から続く造り酒屋など、歴史ある町並みを歩きましょう。石畳や店頭の看板など、町並みを生かした景観づくりも進められています。町なかで昼食にしましょう。お酒は20歳から。車を運転する人は飲まないでください。"),
  cre("夷隅神社", 12, 40, 20, "walk", 10, 35.282678, 140.246031, "千葉県夷隅郡大多喜町大多喜",
    "城下町から歩いて約10分。権現造りの社殿を玉垣が囲む、整った形式の神社で、古くは牛頭天皇宮ともいわれました。社殿のまわりの彫刻には動物が多く、人の身近な動物と農業とのかかわりがうかがえます。" + RESPECT + "房総の渓谷と城下町をめぐる旅を、ここで締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true, thumbnailUrl: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== [NOMIZO, YORO].join() || days[1].spots.map((s) => s.id).join() !== AWAMATA) throw new Error("構成が想定と違います");
  const wrong = days[1].spots[0].photos;
  if (wrong.length !== 1 || !wrong[0].sourceUrl?.includes("Yoro_Keikoku_04.JPG")) throw new Error("粟又の滝の写真が想定と違います");
  if (it.thumbnailUrl === wrong[0].url && !days[0].spots[1].photos.some((p) => p.url === wrong[0].url)) throw new Error("表紙の扱いを確かめてください");
  console.log(`外す写真: ${wrong[0].id}（表紙と同じ: ${it.thumbnailUrl === wrong[0].url}）`);
  const names: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots).map((s) => [s.id, s.name]));

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, order] of [[1, day1], [2, day2]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`D${n} ${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
      await setDaySpotOrder(DAY2_ID, day2, { tx });
      await tx.photo.delete({ where: { id: wrong[0].id } });
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
