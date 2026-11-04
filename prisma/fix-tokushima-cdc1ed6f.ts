/**
 * 徳島城跡と徳島中央公園(cdc1ed6f)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の cdc1ed6f の欄。
 * - 回る順を変える: 興源寺 → 新町川の乗り場の歩きが routed-foot 29.2分(街なかで25分を超える)ため、興源寺を最後にし、遊覧船を昼すぎ(14時台)に回す(企画運営 11/04)。
 *   駅 → 鷲の門 → 徳島城跡 → 博物館 → 昼食 → 表御殿庭園 → 数寄屋橋・バラ園 → 遊覧船 → 藍場浜公園 → 興源寺 → 駅(歩きはすべて25分以内)
 * - 昼食の行き先を足す(バス停「中央郵便局前・徳島市役所北」node300189806 の点、店でない。40分、12:20 に始まる)。
 *   博物館の「この付近で昼食をとるのもよいでしょう」を外し、95分は昼食を含んでいたので博物館55と昼食40に分ける
 * - 「ひょうたん島クルーズ」→「新町川からひょうたん島をめぐる遊覧船」(法務: 運航する団体の商品名にしない、287e75c5 と同じ扱い)。
 *   点は OSM「ひょうたん島周遊船のりば」amenity=ferry_terminal node2993380255。料金・申し込み方は書かない
 * - 点: 徳島城跡 → historic=castle node12285186670(287e75c5 と同じ)、鷲の門 34.0719,134.556554 → OSM「鷲の門」building=roof way290225961(34.071893,134.556548)。ほかは今の点
 * - 区間(routed-foot): 徳島駅→鷲の門 8.1→9(入口の一文)、鷲の門→城跡 9.4→10、城跡→博物館 8.5→9、博物館→昼食 5.9→6、
 *   昼食→庭園 5.9→6、庭園→数寄屋橋 3.5→4、数寄屋橋→乗り場 13.5→14、乗り場→藍場浜 6.9→7、藍場浜→興源寺 24.4→25、興源寺→駅 24.0〜24.02→25(帰りの一文、法務の測り直しで 25)
 * - 時刻: 9:30〜16:46。遊覧船は 14:29 に着く(営業 11:00〜15:40、国交省四国地方整備局の資料。最後の便でも乗れるよう昼すぎに)。滞在は延ばさない
 * - 興源寺は 16:16〜16:46 に訪ねる。開いた出典に見学の時間が見つからないため「見学できる時間は公式の案内で確かめましょう」を足す(企画運営)
 * - 興源寺: お寺と墓所を1文にまとめる「今も祈りが続くお寺で、蜂須賀家の墓所もありますので、…」(法務 11/04 18:03、決まり265行目)
 * - 事実の出典: 国交省の多言語解説(徳島城博物館・表御殿庭園 001557900、ひょうたん島周遊船 001557903)、四国地方整備局「四国八十八景」03、
 *   文化遺産オンライン 192572(蜂須賀家墓所)、tabi-mag.jp ts0164(鷲の門)・ts0155(城山・数寄屋門・バラ園)。
 *   出典のない文(17万石余・280年・14代・東西640m南北550m・野面積み、鷲の門の名の由来・明治に門だけ残った、千山丸の安政4年・全長・装飾、
 *   バラ園の約50種、外堀の役割、藍場浜の名の由来)を外す
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-tokushima-cdc1ed6f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "cdc1ed6f-3fe0-4f9d-af75-be5cff739a2e";
const DAY_ID = "45dec71d-42e1-4003-83a6-b29ff978bfb3";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const W = (min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk" as const, transitDurationMin: min }] });

const CASTLE = "d4d2af45-492e-4865-95f8-7f008cc71562";
const WASHI = "a487817a-475a-45e4-bc7b-0a6649483b98";
const MUSEUM = "53b0f7d8-bcd3-448c-a4ea-3ebc51b12d01";
const GARDEN = "090ffe34-0df3-4cec-9f88-5551adc5b210";
const SUKIYA = "3a4d3f61-4ab9-4e44-8683-516439af6892";
const KOGENJI = "9255bf32-aaa7-4488-8578-e8e3d7a027ab";
const BOAT = "a569a696-b7b6-479e-87ea-39fa7d0e23c4";
const AIBA = "8786d9c9-fd3b-4d1b-8722-7a396a9286e9";

const EXPECT: Record<string, string> = {
  [CASTLE]: "徳島城跡（徳島中央公園）", [WASHI]: "鷲の門", [MUSEUM]: "徳島城博物館", [GARDEN]: "旧徳島城表御殿庭園",
  [SUKIYA]: "バラ園・数寄屋橋", [KOGENJI]: "興源寺", [BOAT]: "ひょうたん島クルーズ", [AIBA]: "藍場浜公園",
};

const TITLE = "徳島城跡と徳島中央公園、蜂須賀家の城下町を歩くプラン";
const DESC_OLD =
  "蜂須賀家政が築いた徳島城の跡地に広がる徳島中央公園から、蜂須賀家墓所の興源寺、ひょうたん島クルーズ、藍の産業にゆかりのある藍場浜公園まで。眉山や阿波おどりとは違う、徳島藩の歴史をたどるプランです。";
const DESC_NEW =
  "蜂須賀家の菩提寺・興源寺から、徳島城跡に広がる徳島中央公園の鷲の門や城山、博物館と表御殿庭園をめぐり、新町川の遊覧船で「ひょうたん島」をひとまわり。徳島藩の歴史をたどる日帰りプランです。";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  kogenji:
    `藍場浜公園から歩いておよそ25分、助任川を渡った先の興源寺に着きます。蜂須賀家の菩提寺で、寺の西には、藩祖・家政をはじめ歴代の藩主が葬られた墓所が、築地塀に囲まれて営まれています。眉山の稜線にある万年山墓所とあわせて「徳島藩主蜂須賀家墓所」として、平成14年(2002)に国の史跡に指定されました。今も祈りが続くお寺で、蜂須賀家の墓所もありますので、静かに、敬意をもってお参りしましょう。見学できる時間は公式の案内で確かめましょう。帰りは、JR徳島駅まで歩いておよそ25分です。`,
  washi:
    "JR徳島駅から歩いておよそ9分、鷲の門に着きます。この門をくぐるのが徳島城の正規の登城道で、門の先は三木郭、下乗橋、大手門へと続いていました。もとの門は徳島大空襲で焼失し、今の門は徳島市の市制100年を記念して、平成元年(1989)に復元されたものです。門の先に広がる徳島中央公園は、日露戦争の戦勝を記念して明治39年(1906)に開かれた公園です。この後は、歩いておよそ10分、城山の徳島城跡へ向かいましょう。",
  castle:
    "鷲の門から歩いておよそ10分、城山の徳島城跡に着きます。蜂須賀家政が徳島藩の藩祖となったのを機に1586年に完成した城で、明治8年(1875)に取り壊されました。標高61mの城山の山頂部に本丸の跡があり、城山は原生林に覆われています。本丸や二の丸などの石垣が今も残っています。山道は足元に気をつけて歩きましょう。この後は、歩いておよそ9分、徳島城博物館へ向かいましょう。",
  museum:
    "徳島城跡から歩いておよそ9分、徳島城博物館に着きます。平成4年(1992)に開館した博物館で、藩主の蜂須賀家に伝わる甲冑や刀剣、着物、絵画や屏風などを展示しています。城下町として栄えたころの暮らしを伝える地図や、住まいと店の実物大の模型もあります。水軍のコーナーには、江戸時代の末に蜂須賀家が持っていた船「千山丸」があり、この形で残る日本の船はこれだけと考えられていて、国の重要文化財に指定されています。休館日は公式の案内で確かめましょう。この後は、歩いておよそ6分、徳島中央公園の近くで昼食にしましょう。",
  lunch:
    "徳島城博物館から歩いておよそ6分、徳島中央公園の近くで昼食にしましょう。この後は、歩いておよそ6分、旧徳島城表御殿庭園へ向かいましょう。",
  garden:
    "昼食の場所から歩いておよそ6分、旧徳島城表御殿庭園に着きます。城の表御殿の前庭だった庭で、1600年ごろ、千利休に学んだ茶人で武将の上田宗箇が造営を監修したとされ、国の名勝に指定されています。池のある庭と枯山水を組み合わせた庭で、長さ10.5mの緑泥片岩の石橋など、いくつもの石橋が架かっています。この後は、歩いておよそ4分、数寄屋橋とバラ園のあたりへ向かいましょう。",
  sukiya:
    "表御殿庭園から歩いておよそ4分、数寄屋橋とバラ園のあたりに着きます。城の御殿の鬼門(北東)にあたる数寄屋門は、城の東を流れる堀川に面した門で、別名「不明門」とも呼ばれました。近くには、400株のバラが咲くバラ園があります。この後は、歩いておよそ14分、新町川の周遊船の乗り場へ向かいましょう。",
  boat:
    "数寄屋橋から歩いておよそ14分、両国橋のたもとの周遊船の乗り場に着きます。新町川と助任川に囲まれた周囲約6kmの市街地は、その形から「ひょうたん島」と呼ばれ、遊覧船はおよそ30分で、19の橋をくぐりながら島をひとまわりします。船は決まった時刻に出るので、乗り場で次の便を待つ時間も見ておきましょう。最新の運航の時刻は公式の案内で確かめましょう。この後は、歩いておよそ7分、藍場浜公園へ向かいましょう。",
  aiba:
    "周遊船の乗り場から歩いておよそ7分、新町川に面した藍場浜公園に着きます。「水都」の愛称で呼ばれる徳島の、川沿いの景色を眺めながら、ひと休みしましょう。この後は、歩いておよそ25分、助任川を渡って興源寺へ向かいましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  { label: "鷲の門(点 way290225961、1か所目に、始まり 9:30、入口の一文、区間を消す)", item: { id: WASHI, data: { lat: "34.071893", lng: "134.556548", visitTime: T(9, 30), stayDurationMin: 20, memo: M.washi, transitLegs: { deleteMany: {} } } } },
  { label: "徳島城跡(点を node12285186670 に、歩き10)", item: { id: CASTLE, data: { lat: "34.075064", lng: "134.554571", visitTime: T(10, 0), stayDurationMin: 70, memo: M.castle, transitLegs: W(10) } } },
  { label: "徳島城博物館(95→55、歩き9)", item: { id: MUSEUM, data: { visitTime: T(11, 19), stayDurationMin: 55, memo: M.museum, transitLegs: W(9) } } },
  {
    label: "徳島中央公園の近くで昼食(新規。点はバス停 node300189806、店でない)",
    item: { create: { name: "徳島中央公園の近くで昼食", address: "徳島県徳島市", lat: "34.071605", lng: "134.553606", visitTime: T(12, 20), stayDurationMin: 40, memo: M.lunch, transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] } } },
  },
  { label: "旧徳島城表御殿庭園(歩き6)", item: { id: GARDEN, data: { visitTime: T(13, 6), stayDurationMin: 30, memo: M.garden, transitLegs: W(6) } } },
  { label: "バラ園・数寄屋橋(歩き2→4)", item: { id: SUKIYA, data: { visitTime: T(13, 40), stayDurationMin: 35, memo: M.sukiya, transitLegs: W(4) } } },
  { label: "遊覧船(名前を変える、点を node2993380255 に、歩き14)", item: { id: BOAT, data: { name: "新町川からひょうたん島をめぐる遊覧船", lat: "34.069306", lng: "134.550538", visitTime: T(14, 29), stayDurationMin: 45, memo: M.boat, transitLegs: W(14) } } },
  { label: "藍場浜公園(歩き5→7)", item: { id: AIBA, data: { visitTime: T(15, 21), stayDurationMin: 30, memo: M.aiba, transitLegs: W(7) } } },
  { label: "興源寺(最後に、歩き25、帰りの一文)", item: { id: KOGENJI, data: { visitTime: T(16, 16), stayDurationMin: 30, memo: M.kogenji, transitLegs: W(25) } } },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true } });
  if (it?.title !== TITLE || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);

  console.log(`題: ${TITLE}(変えない)\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
    const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(`■ ${"id" in item ? "[既存]" : "[新規]"} ${label}\n  名前 ${d.name ?? "(変更なし)"}／着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`);
  }
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 12:20(13:30より前)/ 遊覧船 14:29 / 終わり 興源寺 16:46(日帰りの 16:30〜17:00)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { description: DESC_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
