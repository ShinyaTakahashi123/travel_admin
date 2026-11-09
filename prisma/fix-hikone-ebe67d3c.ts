/**
 * 夢京橋キャッスルロード・彦根(ebe67d3c)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の ebe67d3c の欄。
 * - 題・説明文から「食べ歩き」「グルメ」を外し、主題を城下町に(企画運営)。夢京橋キャッスルロードは通りとして残し、店・品物・食べ歩きを外して
 *   町並み(白壁・黒格子の町家風、昭和60〜平成10年の整備)を中心に書く。昼食は夢京橋の70分の中から分け、バス停「夢京橋キャッスルロド」
 *   node12985390114 の点の昼食の行き先(40分)にする(決まり379行目)
 * - 四番町スクエアを外す(6章、企画運営の判断)。そのあとの「歩き30」は、宗安寺→龍潭寺をタクシー(routed-car 5.3分＋5＝11)に(街なかで25分超え)
 * - 終わりが早まる分は、決まりの順で、始まり 9:00→9:30(昼食 12:58 が 13:30 より前)と、本物の行き先「宗安寺」(夢京橋キャッスルロードに面した寺、
 *   通年 9:00〜17:00、25分)を足して合わせる。終わり 16:30
 * - 点: 彦根城 → 着く側の「表門橋」way73533338(広い城跡。次の博物館へは、メモのとおり天守から測る、東大寺と同じ考え)、
 *   博物館 → tourism=museum way363244231、玄宮園 → leisure=garden way585543133(名前のある入口がない)、夢京橋 → 通りの線 way180831396、
 *   宗安寺 → place_of_worship way1070665202、龍潭寺 → node4389652283、清凉寺は今の点(OSM の清涼寺の敷地 landuse=religious way268013761)
 * - 歩き(routed-foot): 彦根駅(西側)→表門橋 13.6≤15、天守→博物館 9.7→10、博物館→玄宮園 12.1→13、玄宮園→昼食 14.7→15、昼食→夢京橋 0.5→1、
 *   夢京橋→宗安寺 1.7→2、龍潭寺→清凉寺 2.4→3、清凉寺→彦根駅 20.0→20
 * - 事実の直し: 清凉寺は慶長7年(1602)に井伊直政の墓所として創建(文化遺産オンライン「彦根藩主井伊家墓所」。もとは「2代藩主・井伊直孝が開いた」)。
 *   出典のない文(博物館の「1987年に開館」、玄宮園の「9つの橋」、龍潭寺の「庭の寺」、清凉寺の「七不思議」「関ヶ原の供養」、彦根城の「1603年」)を外す。
 *   清凉寺の墓所とお寺の一文を2つに分ける(法務)
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-hikone-ebe67d3c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "ebe67d3c-6449-41d9-ba8f-c951cb74f968";
const DAY_ID = "5ffac0de-7665-4318-93e4-42c9050dcb10";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const W = (min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk" as const, transitDurationMin: min }] });

const HIKONEJO = "6404a335-6858-416d-b66f-3aaeafade414";
const MUSEUM = "142b9238-99ba-4c41-800a-7fb65c3d5743";
const GENKYUEN = "4a70b394-adaa-4cfe-b8ea-cb052bb56850";
const YUMEKYO = "5d59a977-65bc-4450-8dbc-ddb43294c70d";
const YONBANCHO = "0a2e8d05-0483-4e9d-997f-32da7e70a2ec"; // 外す
const RYOTANJI = "5e07f587-5f28-4c8e-9f81-7a3dc30995ab";
const SEIRYOJI = "4d9fc778-d3b7-4685-b727-d9fa95617bfa";

const EXPECT: Record<string, string> = {
  [HIKONEJO]: "彦根城", [MUSEUM]: "彦根城博物館", [GENKYUEN]: "玄宮園", [YUMEKYO]: "夢京橋キャッスルロード",
  [YONBANCHO]: "四番町スクエア", [RYOTANJI]: "龍潭寺", [SEIRYOJI]: "清凉寺",
};

const TITLE_OLD = "夢京橋キャッスルロードで食べ歩き、彦根の城下町グルメ日帰りプラン";
const TITLE_NEW = "彦根城と玄宮園、夢京橋キャッスルロードと井伊家ゆかりの寺をめぐる日帰りプラン";
const DESC_OLD =
  "国宝の天守がそびえる彦根城と、井伊家の大名文化を伝える博物館・庭園をめぐり、白壁と黒格子の町家が並ぶ夢京橋キャッスルロードで食べ歩き。午後は大正ロマンの四番町スクエアから、佐和山のふもとの井伊家ゆかりのお寺まで、彦根の城下町を歩いて楽しむ日帰りプランです。";
const DESC_NEW =
  "国宝の天守がそびえる彦根城と、井伊家の大名文化を伝える博物館・庭園をめぐり、白壁と黒格子の町家風の家並みが続く夢京橋キャッスルロードを歩きます。午後は通りに面した宗安寺から、佐和山のふもとの井伊家ゆかりの龍潭寺・清凉寺まで、彦根の城下町の歴史をたどる日帰りプランです。";

const M = {
  hikonejo:
    "JR彦根駅から歩いておよそ15分、彦根城の表門橋に着きます。関ヶ原の戦いのあと、初代藩主・井伊直政の遺志を継いで築かれた城で、元和8年(1622)ごろに城の全体が整ったとされます。天守は大津城の天守を移したものと伝えられ、昭和27年(1952)に国宝に指定されました。国宝の天守をもつ5つの城の一つに数えられます。天守の石垣は、自然の形の石を積み上げた「牛蒡積み」と呼ばれる積み方です。天守の中の階段はとても急なので、手すりを持ってゆっくり上り下りしましょう。この後は、天守から城山を下りて歩いておよそ10分、彦根城博物館へ向かいましょう。",
  museum:
    "天守から城山を下りて歩いておよそ10分、彦根藩の政庁だった表御殿を復元した博物館に着きます。藩主だった井伊家に伝わる美術工芸品や古文書を中心に展示しています。藩主の暮らしの場だった「奥向き」は木造で復元され、寛政12年(1800)ごろに建てられた能舞台も、元の場所に移されています。休館日は公式の案内で確かめましょう。この後は、歩いておよそ13分、玄宮園へ向かいましょう。",
  genkyuen:
    "彦根城博物館から歩いておよそ13分、彦根城の北東にある大名庭園に着きます。延宝5年(1677)ごろに、4代藩主・井伊直興がつくったと伝えられる池泉回遊式の庭で、中国・唐の玄宗皇帝の離宮になぞらえたといわれます。池のまわりには近江八景を模した景色が配され、池越しに見上げる天守の姿も見どころです。となりの楽々園とあわせて「玄宮楽々園」として、国の名勝に指定されています。この後は、歩いておよそ15分、夢京橋キャッスルロードのあたりへ向かいましょう。",
  lunch:
    "玄宮園から歩いておよそ15分、夢京橋キャッスルロードのあたりで、昼食にしましょう。この後は、歩いておよそ1分、夢京橋キャッスルロードの町並みを歩きましょう。",
  yumekyo:
    "昼食のあとは、歩いておよそ1分で夢京橋キャッスルロードへ。彦根城の中堀にかかる京橋から南西へおよそ350m続く通りで、白壁と黒格子、切妻屋根の町家風にそろえた建物が並び、江戸時代の城下町をイメージした町並みになっています。昭和60年(1985)から平成10年(1998)にかけて、電線を地中に移すことなどとあわせて整えられました。城下町の面影をしのびながら、ゆっくり歩いてみましょう。この後は、歩いておよそ2分、宗安寺へ向かいましょう。",
  soanji:
    "夢京橋キャッスルロードを歩いておよそ2分、通りに面して朱塗りの赤門が立つ宗安寺に着きます。井伊直政の正室ゆかりの寺と伝えられ、赤門は佐和山城の城門を移したものと伝えられています。江戸時代には、朝鮮通信使の宿にもなりました。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、龍潭寺までは歩くと30分ほどかかるので、タクシーを呼んで、およそ11分、龍潭寺へ向かいましょう。",
  ryotanji:
    "宗安寺からタクシーでおよそ11分、佐和山のふもとに建つ龍潭寺に着きます。井伊家の祖先ゆかりの遠江(今の静岡県)の龍潭寺から、井伊家が彦根に移ったのにともない、元和元年(1615)にこの地に開かれたと伝えられる寺です。方丈の56面のふすま絵は、松尾芭蕉の弟子・森川許六の作と伝えられます。白砂に石を組んだ方丈南庭「ふだらくの庭」も見どころです。拝観の時間は公式の案内で確かめましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ3分、清凉寺へ向かいましょう。",
  seiryoji:
    "龍潭寺から歩いておよそ3分、清凉寺に着きます。慶長7年(1602)、彦根藩の初代藩主・井伊直政の墓所として開かれた寺で、境内の墓所には直政をはじめ歴代の藩主が眠り、国の史跡「彦根藩主井伊家墓所」に含まれています。境内は、石田三成の家臣・島左近の屋敷があった場所と伝えられています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。井伊家の墓所のまわりでは、静かに過ごしましょう。帰りは、JR彦根駅まで歩いておよそ20分です。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  { label: "彦根城(点を表門橋 way73533338、始まり 9:30)", item: { id: HIKONEJO, data: { lat: "35.274955", lng: "136.25412", visitTime: T(9, 30), stayDurationMin: 80, memo: M.hikonejo } } },
  { label: "彦根城博物館(点 way363244231、天守から歩き10)", item: { id: MUSEUM, data: { lat: "35.275616", lng: "136.253567", visitTime: T(11, 0), stayDurationMin: 50, memo: M.museum, transitLegs: W(10) } } },
  { label: "玄宮園(点 way585543133、歩き13)", item: { id: GENKYUEN, data: { lat: "35.278383", lng: "136.254043", visitTime: T(12, 3), stayDurationMin: 40, memo: M.genkyuen, transitLegs: W(13) } } },
  {
    label: "夢京橋キャッスルロードのあたりで昼食(新規。点はバス停 node12985390114、店でない)",
    item: { create: { name: "夢京橋キャッスルロードのあたりで昼食", address: "滋賀県彦根市本町1丁目", lat: "35.271104", lng: "136.251676", visitTime: T(12, 58), stayDurationMin: 40, memo: M.lunch, transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] } } },
  },
  { label: "夢京橋キャッスルロード(点を通りの線 way180831396、70→30、町並みを中心に)", item: { id: YUMEKYO, data: { lat: "35.271042", lng: "136.251558", visitTime: T(13, 39), stayDurationMin: 30, memo: M.yumekyo, transitLegs: W(1) } } },
  {
    label: "宗安寺(新規。点は place_of_worship way1070665202)",
    item: { create: { name: "宗安寺", address: "滋賀県彦根市本町2丁目3-7", lat: "35.270761", lng: "136.250535", visitTime: T(14, 11), stayDurationMin: 25, memo: M.soanji, transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] } } },
  },
  {
    label: "龍潭寺(点 node4389652283、タクシー11)",
    item: { id: RYOTANJI, data: { lat: "35.282795", lng: "136.266455", visitTime: T(14, 47), stayDurationMin: 60, memo: M.ryotanji, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "taxi", transitDurationMin: 11 }] } } },
  },
  { label: "清凉寺(歩き3、創建の直し、墓所の一文)", item: { id: SEIRYOJI, data: { visitTime: T(15, 50), stayDurationMin: 40, memo: M.seiryoji, transitLegs: W(3) } } },
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
  console.log(`■ [外す] 四番町スクエア (${YONBANCHO})`);
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 12:58(13:30より前)/ 終わり 清凉寺 16:30");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: [YONBANCHO] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
