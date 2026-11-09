/**
 * 鵜戸神宮と日南の南側の日帰り(af30d135)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の af30d135 の欄(組み直し、企画運営 11/04)。
 * - d6c081e8 とほとんど同じ旅になるため、鵜戸神宮が主役の日南の南側の旅に組み直す(企画運営 11/04、法務の指摘)。
 *   青島神社・青島亜熱帯植物園・堀切峠・道の駅フェニックス・サンメッセ日南を外す
 * - 回る順(企画運営): 宮崎駅 → 猪八重渓谷(朝) → 飫肥城跡と城下町 → 飫肥で昼食 → 油津の堀川運河 → 猪崎鼻 → 鵜戸神宮(最後)
 * - 足す行き先: 猪八重渓谷(OSM tourism=attraction node13978438973、駐車場のそば)、油津の堀川運河(着く側の名前のある橋「堀川橋（乙姫橋）」way181405241)、
 *   猪崎鼻(国土地理院の地名「猪崎鼻の堆積構造」31.5589385,131.3973634。OSM の公園の面に名前のある入口・駐車場・展望所がないため、7章の例外。企画運営 11/04)、
 *   飫肥の城下で昼食(バス停「飫肥城下」node5919682584、d6c081e8 と同じ点)
 * - 飫肥城下町は名前を「飫肥城跡と城下町」にして、点を node4021797675(31.627563,131.351822、d6c081e8・1d72e477 と同じ)にそろえる
 * - 区間(routing.openstreetmap.de): 宮崎駅→猪八重渓谷 車 40.3〜41.4→47(入口の一文、法務の測り直しで 47)、猪八重渓谷→飫肥 車 17.7→23、飫肥→昼食 歩 4.8→5、
 *   昼食→堀川橋 車 12.2→18、堀川橋→猪崎鼻 車 8.6→14、猪崎鼻→鵜戸神宮 車 28.8→34、鵜戸神宮→宮崎駅 車 58.5〜59.3→65(帰りの一文)
 * - 時刻: 始まり 9:30(猪八重渓谷)、昼食 12:38、終わり 16:44(鵜戸神宮を出る。参拝は 10〜3月 18時まで)。滞在は延ばさない
 * - 題・説明文から「定番」と出典のない「縁結び・安産の神社として親しまれる」を外す
 * - 事実の出典: 猪八重渓谷 林野庁のレクリエーションの森のページ・tabi-mag.jp/mz0198(携帯電話)、飫肥 文化庁の保存地区の資料、
 *   堀川運河 全国漁港漁場協会「油津の港物語」、猪崎鼻 文化遺産オンライン 232641、鵜戸神宮 国交省の多言語解説(R2-02103・001558220)
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-udo-af30d135.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "af30d135-b7e7-4a4e-b6f1-dec242afcdb9";
const DAY_ID = "5d106f12-8bfb-464f-bfe0-67eafe3df1b2";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Mode = "walk" | "car";
const L = (mode: Mode, min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: mode, transitDurationMin: min }] });
const C = (mode: Mode, min: number) => ({ create: [{ orderNo: 1, transitMode: mode, transitDurationMin: min }] });

const AOSHIMA = "850f6912-15cd-4e2b-a39a-491e28621050"; // 外す
const GARDEN = "53d70bb9-4af8-40f8-86ca-01c309875e3c"; // 外す
const HORIKIRI = "b24f3cc8-ee36-4baa-8fc0-87df3cf20c60"; // 外す
const MICHINOEKI = "cfef78b1-a87d-4c5d-a181-c4b6a7979f99"; // 外す
const SUNMESSE = "485d8957-66d5-4f22-bcda-7011fa47e2ae"; // 外す
const OBI = "7a31c028-94da-4a57-9d1f-95ff753d28fd";
const UDO = "efaee18b-0a25-4c66-9d35-9c5df6ce7a9e";
const REMOVE = [AOSHIMA, GARDEN, HORIKIRI, MICHINOEKI, SUNMESSE];

const EXPECT: Record<string, string> = {
  [AOSHIMA]: "青島神社", [GARDEN]: "青島亜熱帯植物園", [HORIKIRI]: "堀切峠", [MICHINOEKI]: "道の駅フェニックス",
  [SUNMESSE]: "サンメッセ日南", [OBI]: "飫肥城下町", [UDO]: "鵜戸神宮",
};

const TITLE_OLD = "鵜戸神宮、崖に埋め込まれた社殿を訪ねる定番日帰りプラン";
const TITLE_NEW = "鵜戸神宮と猪八重渓谷、飫肥・油津をめぐる日南の日帰りプラン";
const DESC_OLD =
  "断崖の洞窟に埋め込まれた朱塗りの社殿で知られる鵜戸神宮。縁結び・安産の神社として親しまれる、日南海岸を代表する定番プランです。";
const DESC_NEW =
  "朝は苔の森が続く猪八重渓谷を歩き、城下町の飫肥、油津の堀川運河、古い地層が見られる猪崎鼻をめぐって、最後は海に面した岩窟にまつられた鵜戸神宮へ。レンタカーで日南の南側をめぐる日帰りプランです。";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  inohae:
    "JR宮崎駅の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ47分、猪八重渓谷の駐車場に着きます。日南市北郷町の渓谷で、駐車場から五重の滝まで、片道3.0kmの遊歩道(通称コケロード)が続きます。約300種のコケが自生するとされ、まわりにはシイやタブ、カシなどの照葉樹の森が広がります。五重の滝まではゆっくり歩くと片道約90分かかるので、この旅では遊歩道の途中で引き返し、渓谷の流れと森の空気を味わいましょう。携帯電話がつながらないとされる場所なので、無理をせず早めに引き返しましょう。渓流沿いは落石や路肩の崩れがあるので、頭上と足元に気をつけて歩きましょう。この後は、車でおよそ23分、飫肥へ向かいましょう。",
  obi:
    "猪八重渓谷から車でおよそ23分、飫肥城跡と城下町に着きます。飫肥は酒谷川が三方を囲む城下で、飫肥藩5万1千石の城下町として、江戸時代の初めの町割りが今も残ります。城に近いほうから、上級の家臣、中級の家臣、町家、下級の家臣の屋敷が並んでいたとされ、武家屋敷は格式に応じて門を構え、飫肥石や玉石の石垣の上にお茶などの生垣をめぐらせています。昭和49年(1974)からは、飫肥城を復元する事業も進められました。通りに面した家の敷地には入らず、静かに歩きましょう。この後は、歩いておよそ5分、飫肥の城下で昼食にしましょう。",
  lunch:
    "飫肥城跡と城下町から歩いておよそ5分、飫肥の城下で昼食にしましょう。この後は、車でおよそ18分、油津の堀川運河へ向かいましょう。",
  horikawa:
    "飫肥から車でおよそ18分、油津の堀川運河の堀川橋に着きます。山から切り出した木材は、筏で川を下って油津へ運ばれていましたが、河口から荒い外海に出るため、木材が流されることも多くありました。そこで飫肥藩5代藩主・伊東祐実の命で運河が掘られ、2年4か月をかけて貞享3年(1686)に完成したと伝えられます。運河に架かる堀川橋は、明治36年(1903)に築かれたアーチ形の石橋で、吾平津神社の参道も兼ねています。この後は、車でおよそ14分、猪崎鼻へ向かいましょう。",
  inosaki:
    "堀川運河から車でおよそ14分、猪崎鼻に着きます。日向灘に突き出した岬で、およそ4000万〜2200万年前に深い海でたまった日南層群の、砂岩と泥岩が重なる地層が見られ、「猪崎鼻の堆積構造」として平成26年(2014)に国の天然記念物に指定されました。砂岩の層の底に見られる「フルートキャスト」は、規模と保存のよさで他に類を見ないとされています。岩場は滑りやすく、崖は崩れやすいので、足元に気をつけ、崖のふちには近づかないようにしましょう。この後は、車でおよそ34分、鵜戸神宮へ向かいましょう。",
  udo:
    `猪崎鼻から車でおよそ34分、旅の最後は鵜戸神宮です。主祭神の鸕鶿草葺不合尊は、初代の天皇とされる神武天皇の父にあたる神で、岩窟の壁の「お乳岩」は、母の神が子に残したものと伝えられ、安産や子育ての無事を願う人がこの岩に触れていきます。名物の「運玉」は、亀の形をした「亀石」の上の、縄で囲まれたくぼみをめがけて投げるもので、男性は左手、女性は右手で投げるならわしです。足元に気をつけて歩きましょう。${PRAY}帰りは、JR宮崎駅まで車でおよそ65分。駅の近くで車を返しましょう。`,
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "猪八重渓谷(新規。点 node13978438973、始まり 9:30、入口の一文)",
    item: { create: { name: "猪八重渓谷", address: "宮崎県日南市北郷町郷之原", lat: "31.727653", lng: "131.370404", visitTime: T(9, 30), stayDurationMin: 90, memo: M.inohae } },
  },
  { label: "飫肥城跡と城下町(名前を変える、点を node4021797675 にそろえる、車23)", item: { id: OBI, data: { name: "飫肥城跡と城下町", lat: "31.627563", lng: "131.351822", visitTime: T(11, 23), stayDurationMin: 70, memo: M.obi, transitLegs: L("car", 23) } } },
  {
    label: "飫肥の城下で昼食(新規。点はバス停 node5919682584、店でない)",
    item: { create: { name: "飫肥の城下で昼食", address: "宮崎県日南市飫肥1丁目", lat: "31.624872", lng: "131.353058", visitTime: T(12, 38), stayDurationMin: 40, memo: M.lunch, transitLegs: C("walk", 5) } },
  },
  {
    label: "油津の堀川運河(新規。点は堀川橋（乙姫橋） way181405241)",
    item: { create: { name: "油津の堀川運河", address: "宮崎県日南市油津1丁目", lat: "31.584519", lng: "131.401907", visitTime: T(13, 36), stayDurationMin: 40, memo: M.horikawa, transitLegs: C("car", 18) } },
  },
  {
    label: "猪崎鼻(新規。点は国土地理院「猪崎鼻の堆積構造」、7章の例外)",
    item: { create: { name: "猪崎鼻", address: "宮崎県日南市大字隈谷", lat: "31.558939", lng: "131.397363", visitTime: T(14, 30), stayDurationMin: 30, memo: M.inosaki, transitLegs: C("car", 14) } },
  },
  { label: "鵜戸神宮(最後、車19→34、帰りの一文)", item: { id: UDO, data: { visitTime: T(15, 34), stayDurationMin: 70, memo: M.udo, transitLegs: L("car", 34) } } },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true } });
  if (it?.title !== TITLE_OLD || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
    const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(`■ ${"id" in item ? "[既存]" : "[新規]"} ${label}\n  名前 ${d.name ?? "(変更なし)"}／着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`);
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})`);
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 12:38(11:30〜13:30)/ 終わり 鵜戸神宮 16:44(日帰りの 16:30〜17:00)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
