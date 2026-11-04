/**
 * 雪の金閣寺と北野の梅(d8ccb730)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の d8ccb730 の欄。
 * - 題を「冬の金閣寺と北野の梅。京都・洛北をめぐる日帰り旅」に(雪を言い切らない、企画運営)。説明文も雪の前提と出典のない文を外す
 * - 昼食の行き先を足す(バス停「北野天満宮前」node4305501405 の点、店でない。45分、12:17 に始まる)。北野の「昼食をとってから」を外す
 * - 点: 仁和寺 → 着く側の二王門(OSM「仁王門」way372535205)、北野天満宮 → place_of_worship way432120699、
 *   上七軒 → 通りの線「上七軒通」way54370705。ほかは今の点
 * - 区間(routed-foot/routed-car): 金閣寺→龍安寺 歩 26.0 は25分超えなのでタクシー 3.5→9、龍安寺→二王門 歩 16.0→16、
 *   二王門→昼食 タクシー 3.3→9(歩くと25分超え)、昼食→北野 歩 4.9→5、北野→上七軒 歩 5.6→6、上七軒→千本釈迦堂 歩 5.6≤10≤14 そのまま、
 *   千本釈迦堂→平野神社 歩 12.4→13、平野神社→わら天神宮 歩 8.9→9。入口は市バス「金閣寺道」から歩 7.9→8、帰りはバス停「わら天神前」まで歩 2.2→3
 * - 時刻: 始まり 9:00→9:18(終わりを 16:30 にそろえる。決まりの順で、100分超えの滞在がないため始まりを動かす)。終わり 16:30(もとは 16:37)。滞在は延ばさない
 * - 文: 書き出しと終わりに分を入れ、決まりの祈りの一文にそろえる。千本釈迦堂のおかめの話は法務の文の形に(5章)。
 *   出典のない文(金閣の金箔の層・昭和25年の焼失、石庭の5群・1つ見えない、仁和寺の明治まで皇室の住職、平野神社の守護神、
 *   北野の「大宰府へ旅立つ際」・飛梅が飛んできた話、雪が積もる回数)を外す。北野の歌は北野天満宮の公式の表記にそろえる
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-kinkaku-d8ccb730.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "d8ccb730-d487-4621-a610-a02f8af8f68a";
const DAY_ID = "6958119d-49c5-429e-9609-402791fee868";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const L = (mode: "walk" | "taxi", min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: mode, transitDurationMin: min }] });

const KINKAKU = "b36782e7-87e0-4ded-a57a-ef606edee882";
const RYOANJI = "f7a79fb7-5756-467c-abc8-b591ca4dad1e";
const NINNAJI = "c3a6a890-5062-498d-b96c-2b05209273ad";
const KITANO = "b6591f37-c187-460b-9779-76c977a42768";
const KAMISHICHIKEN = "3993e2aa-2c4e-4d60-aa30-8dfb3bea76df";
const SENBON = "34e9e44b-8750-4416-aa01-10e16fce459f";
const HIRANO = "490d03d2-350e-41aa-a447-490411ee82bc";
const WARA = "483dd3ca-783d-4b62-9ec5-b1ec9b52b383";

const EXPECT: Record<string, string> = {
  [KINKAKU]: "金閣寺（鹿苑寺）", [RYOANJI]: "龍安寺", [NINNAJI]: "仁和寺", [KITANO]: "北野天満宮", [KAMISHICHIKEN]: "上七軒",
  [SENBON]: "千本釈迦堂（大報恩寺）", [HIRANO]: "平野神社", [WARA]: "わら天神宮（敷地神社）",
};

const TITLE_OLD = "雪の金閣寺と北野の梅。冬の京都・洛北をめぐる日帰り旅";
const TITLE_NEW = "冬の金閣寺と北野の梅。京都・洛北をめぐる日帰り旅";
const DESC_OLD =
  "雪が降った朝は「雪化粧の金閣」を狙って朝一番に金閣寺へ。きぬかけの路沿いの龍安寺・仁和寺をめぐり、午後は梅の名所・北野天満宮と京都最古の花街とされる上七軒、平野神社・わら天神宮へ向かう日帰りプランです。京都市内で雪が積もるのは年に数回ほど。北野天満宮の梅苑は例年2月上旬〜3月下旬に公開されます。";
const DESC_NEW =
  "冬の金閣寺から、きぬかけの路沿いの龍安寺・仁和寺をめぐり、午後は梅の名所・北野天満宮と、京都最古の花街とされる上七軒、千本釈迦堂、平野神社、わら天神宮へ向かう日帰りプランです。北野天満宮の梅苑は、例年2月上旬から3月下旬に公開されます。";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  kinkaku:
    `京都市バスの「金閣寺道」で降りて、歩いておよそ8分、金閣寺に着きます。正式な名を鹿苑寺といい、応永4年(1397)に室町幕府3代将軍・足利義満が、西園寺家の山荘を譲り受けて山荘「北山殿」を造り始めたのが始まりとされます。義満の死後、遺言によりお寺となり、義満の法号「鹿苑院殿」から2字をとって鹿苑寺と名づけられました。舎利殿「金閣」は、1層が寝殿造の法水院、2層が武家造の潮音洞、3層が中国風の禅宗仏殿造の究竟頂と、3つの様式を重ねたつくりです。雪の日には、白く雪をかぶった金閣が見られることもあります。${PRAY}この後は、タクシーでおよそ9分、龍安寺へ向かいましょう。`,
  ryoanji:
    `金閣寺からタクシーでおよそ9分、龍安寺に着きます。石庭は、わずか75坪の白砂の空間に、大小15個の石を配した庭です。室町時代につくられたと推定されていますが、作者は誰なのか、どんな思いを込めたのかは今もわかっていません。石庭に残る「小太郎・口二郎」の刻印も、作者の名かどうかは定かでないとされます。${PRAY}この後は、歩いておよそ16分、仁和寺へ向かいましょう。`,
  ninnaji:
    `龍安寺から歩いておよそ16分、仁和寺の二王門に着きます。仁和2年(886)に光孝天皇の願いで造営が始まり、仁和4年(888)に宇多天皇が完成させました。のちに出家した宇多法皇は、延喜4年(904)に寺の中に「御室」を造って移り住んだとされます。世界遺産にも登録されています。${PRAY}この後は、タクシーでおよそ9分、北野天満宮の近くで昼食にしましょう。`,
  lunch:
    "仁和寺からタクシーでおよそ9分、北野天満宮の近くで、昼食にしましょう。この後は、歩いておよそ5分、北野天満宮へ向かいましょう。",
  kitano:
    `昼食の場所から歩いておよそ5分、北野天満宮に着きます。菅原道真公をまつる、全国約1万2000社の天満宮・天神社の総本社です。天暦元年(947)、お告げにより平安京の北西にあたるこの北野の地に創建されました。梅は道真公がこよなく愛した花と伝えられ、境内にはおよそ50種・1,500本の梅があり、2月から3月にかけて花を咲かせます。「東風吹かば匂ひおこせよ梅の花あるじなしとて春を忘るな」は、道真公が大事にしていた梅の木に語りかけるように詠んだ歌です。毎年2月25日には、およそ900年の歴史をもつ梅花祭が行われます。${PRAY}この後は、歩いておよそ6分、上七軒へ向かいましょう。`,
  kamishichiken:
    "北野天満宮から歩いておよそ6分、上七軒に着きます。北野天満宮の東参道に広がる、京都最古の花街とされる町です。室町時代の文安元年(1444)、北野の社殿の修築で残った材木で、東門前に7軒の茶店を建てたのが名の由来と伝えられます。天正15年(1587)に豊臣秀吉が北野で大茶会を開いたとき、七軒茶屋の名物の御手洗団子をほめたと伝えられ、上七軒の「五つ団子」の紋章はこの団子にちなみます。石畳とお茶屋が並ぶ町並みを、静かに歩きましょう。この後は、歩いておよそ10分、千本釈迦堂へ向かいましょう。",
  senbon:
    `上七軒から歩いておよそ10分、千本釈迦堂(大報恩寺)に着きます。本堂は、棟木に残る墨書から安貞元年(1227)の建立とわかっていて、京都の市街にある最古の建築とされ、国宝に指定されています。本堂を建てるとき、棟梁の妻おかめが知恵を出して夫を助けたと伝えられ、境内には、そのおかめにちなむ像が立っています。${PRAY}この後は、歩いておよそ13分、平野神社へ向かいましょう。`,
  hirano:
    `千本釈迦堂から歩いておよそ13分、平野神社に着きます。もとは平城宮の宮中にまつられていたとされ、延暦13年(794)の平安遷都と同時に、この平野の地に移されました。桜の名所として知られ、平野神社から広まった早咲きの「魁桜」が咲き出すと、都のお花見が始まるといわれます。${PRAY}この後は、歩いておよそ9分、わら天神宮へ向かいましょう。`,
  wara:
    `平野神社から歩いておよそ9分、わら天神宮に着きます。正式な名を敷地神社といい、安産・子授けの守り神とされる木花開耶姫命をまつっています。安産のお守りのわらに節があれば男の子、なければ女の子が生まれるという言い伝えがあります。${PRAY}帰りは、わら天神前のバス停まで歩いておよそ3分です。`,
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  { label: "金閣寺(始まり 9:00→9:18、入口の一文)", item: { id: KINKAKU, data: { visitTime: T(9, 18), stayDurationMin: 50, memo: M.kinkaku } } },
  { label: "龍安寺(歩き20→タクシー9)", item: { id: RYOANJI, data: { visitTime: T(10, 17), stayDurationMin: 45, memo: M.ryoanji, transitLegs: L("taxi", 9) } } },
  { label: "仁和寺(点を二王門 way372535205、歩き15→16)", item: { id: NINNAJI, data: { lat: "35.028215", lng: "135.713796", visitTime: T(11, 18), stayDurationMin: 50, memo: M.ninnaji, transitLegs: L("walk", 16) } } },
  {
    label: "北野天満宮の近くで昼食(新規。点はバス停 node4305501405、店でない)",
    item: { create: { name: "北野天満宮の近くで昼食", address: "京都府京都市上京区", lat: "35.027792", lng: "135.735013", visitTime: T(12, 17), stayDurationMin: 45, memo: M.lunch, transitLegs: { create: [{ orderNo: 1, transitMode: "taxi", transitDurationMin: 9 }] } } },
  },
  { label: "北野天満宮(点 way432120699、バス15→歩き5)", item: { id: KITANO, data: { lat: "35.030475", lng: "135.734918", visitTime: T(13, 7), stayDurationMin: 50, memo: M.kitano, transitLegs: L("walk", 5) } } },
  { label: "上七軒(点を通りの線 way54370705、歩き5→6)", item: { id: KAMISHICHIKEN, data: { lat: "35.030177", lng: "135.737957", visitTime: T(14, 3), stayDurationMin: 30, memo: M.kamishichiken, transitLegs: L("walk", 6) } } },
  { label: "千本釈迦堂(歩き10、おかめの文)", item: { id: SENBON, data: { visitTime: T(14, 43), stayDurationMin: 30, memo: M.senbon, transitLegs: L("walk", 10) } } },
  { label: "平野神社(歩き10→13)", item: { id: HIRANO, data: { visitTime: T(15, 26), stayDurationMin: 30, memo: M.hirano, transitLegs: L("walk", 13) } } },
  { label: "わら天神宮(歩き7→9、帰りの一文)", item: { id: WARA, data: { visitTime: T(16, 5), stayDurationMin: 25, memo: M.wara, transitLegs: L("walk", 9) } } },
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
    console.log(`■ ${"id" in item ? "[既存]" : "[新規]"} ${label}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`);
  }
  console.log("\n  始まり 9:18(8:30〜9:30)/ 昼食 12:17(13:30より前)/ 終わり わら天神宮 16:30(もとは 16:37)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
