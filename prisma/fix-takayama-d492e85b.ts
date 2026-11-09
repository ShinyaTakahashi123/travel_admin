/**
 * さんまちと高山陣屋(d492e85b)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の d492e85b の欄。
 * - 宗猷寺を外す(企画運営 11/04)。町の東に離れていて、行き帰りの歩き(20.3分・11.0分)で終わりが 17:00 を超えるため
 * - 昼食の行き先を足す(バス停「さんまち通り」node13833692506 の点、店でない。40分、12:44 に始まる)。さんまちの100分は昼食を含んでいたので、
 *   昼食40とさんまち60に分ける。さんまちの「造り酒屋や飛騨牛の店」「昼食をとるのもおすすめ」「食べ歩き」を外す
 * - 点: 高山祭屋台会館 36.1491,137.2612 → OSM「高山屋台会館」building=museum way490918179(Nominatim の中心 36.1484179,137.2600988 → 6けた、0534e5d3・581607ca と同じ)。
 *   高山陣屋は 0534e5d3・581607ca と同じ 36.139692,137.257618 に(約7m、区間は変わらない)
 * - 区間(routed-foot): 高山駅東口(entrance node6408499730)→朝市 13.2→14(入口の一文)、朝市→日下部 3.7→4、日下部→八幡宮 5.0→5、
 *   八幡宮→屋台会館 3.8→4、屋台会館→昼食 14.6→15、昼食→さんまち 1.1→2、さんまち→まち博 3.3→4、まち博→陣屋 7.0→7、陣屋→国分寺 12.7→13、
 *   国分寺→高山駅東口 5.8→6(帰りの一文)
 * - 時刻: 始まり 9:00→9:06(日下部民藝館の開館が 10:00 のため。公式)。飛騨国分寺は受付が 9〜16時(公式)なので、着く 16:20 は境内の塔と大イチョウを見る文に。終わり 16:50(日帰りの 16:30〜17:00)。滞在は延ばさない
 * - 題・説明文から「定番」と「全国で唯一」の言い切り、出典のない「飛騨の小京都」を外す。最後の「締めくくってください」を外す
 * - 事実の直し: 朝市の始まり「文政3年(1820)ごろ…桑市」→「1819年ごろ…高山別院の前で桑市」(宮川朝市の公式)。
 *   出典のない文(三大朝市、ユネスコ・展示4台・桜山日光館、通りの幅4m・陣屋より高くしない軒、まち博の明治8年の土蔵、陣屋の昭和4年の史跡、
 *   国分寺の樹齢1200年・行基が植えた)を外す。国分寺の大イチョウは公式の「推定樹齢1300年」「創建当初の植樹と伝わる」に
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-takayama-d492e85b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "d492e85b-d2a7-4d8f-b9cd-1e76a2c60a19";
const DAY_ID = "4ce17c8e-8f05-4c87-bc60-59b5899725f5";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const W = (min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk" as const, transitDurationMin: min }] });

const ASAICHI = "295e5906-6951-494a-ac4b-987e68c4da36";
const KUSAKABE = "a86e8595-6b09-482c-abbd-d09b04affe5e";
const HACHIMAN = "ef9ebc97-39bc-479e-b4d7-b4b5199586a1";
const YATAI = "77ff8246-d977-445d-b09c-87804f9a9eef";
const SOYUJI = "dcc83585-07a6-49fa-bda1-b9dcd43e3665"; // 外す
const SANMACHI = "0f38324d-7305-4934-a183-a4fe633acd3b";
const MACHIHAKU = "6174e595-82fd-48c7-b797-5e0b8f052bdb";
const JINYA = "e8c33099-7009-4e75-ad51-21dbe0f96827";
const KOKUBUNJI = "7c118ebe-1067-4d9c-93cc-0815b498243a";

const EXPECT: Record<string, string> = {
  [ASAICHI]: "宮川朝市", [KUSAKABE]: "日下部民藝館", [HACHIMAN]: "桜山八幡宮", [YATAI]: "高山祭屋台会館", [SOYUJI]: "宗猷寺",
  [SANMACHI]: "古い町並み（さんまち）", [MACHIHAKU]: "飛騨高山まちの博物館", [JINYA]: "高山陣屋", [KOKUBUNJI]: "飛騨国分寺",
};

const TITLE_OLD = "さんまちと高山陣屋、飛騨の小京都を歩く定番日帰りプラン";
const TITLE_NEW = "さんまちと高山陣屋、飛騨高山の町を歩く日帰りプラン";
const DESC_OLD =
  "江戸時代の面影を残す古い町並み「さんまち」と、全国で唯一現存するとされる陣屋建築。「飛騨の小京都」と呼ばれる高山の中心部を巡ります。";
const DESC_NEW =
  "江戸時代の面影を残す古い町並み「さんまち」と、主な建物が今も残る高山陣屋を中心に、宮川朝市や高山祭屋台会館、飛騨国分寺まで、高山の中心部を歩いてめぐる日帰りプランです。";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  asaichi:
    "JR高山駅の東口から歩いておよそ14分、宮川朝市に着きます。宮川の岸に沿って、地元の野菜や漬物、民芸品などを並べる露店が続く朝市です。朝市の歴史は江戸時代にさかのぼり、1819年ごろには高山別院の前で、養蚕のための「桑市」が開かれていたと伝えられます。朝の市なので、午前のうちに川沿いを歩いてみましょう。この後は、歩いておよそ4分、日下部民藝館へ向かいましょう。",
  kusakabe:
    "宮川朝市から歩いておよそ4分、日下部民藝館に着きます。天領の時代に代官所の御用商人として栄えた日下部家の町家で、明治12年(1879)に飛騨の名棟梁・川尻治助が、江戸時代の建築様式を忠実に再現して建てました。昭和41年(1966)に、明治期の民家として国の重要文化財に指定されています。土蔵を使った展示室では、日下部家に伝わる渋草焼などの美術品・民芸品が公開されています。休館日は公式の案内で確かめましょう。この後は、歩いておよそ5分、桜山八幡宮へ向かいましょう。",
  hachiman:
    `日下部民藝館から歩いておよそ5分、桜山八幡宮に着きます。応神天皇を主祭神とする神社で、仁徳天皇の時代に、応神天皇の霊をまつってこの桜山で祈りをささげたのが始まりと伝えられます。毎年10月9日・10日の秋の高山祭は、この神社の例祭です。${PRAY}この後は、歩いておよそ4分、高山祭屋台会館へ向かいましょう。`,
  yatai:
    "桜山八幡宮から歩いておよそ4分、境内の高山祭屋台会館に着きます。高山祭の実物の屋台を常設で展示している施設は、ここだけとされています。高山祭は春と秋の年2回ありますが、春は日枝神社、秋は桜山八幡宮の例祭で、祭りを行う神社も地域も屋台も違います。江戸時代の後期に花開いた高山祭の屋台は、国の重要有形民俗文化財に指定されています。この後は、歩いておよそ15分、さんまちの近くで昼食にしましょう。",
  lunch:
    "高山祭屋台会館から歩いておよそ15分、さんまちの近くで昼食にしましょう。この後は、歩いておよそ2分、古い町並みのさんまちへ向かいましょう。",
  sanmachi:
    "昼食の場所から歩いておよそ2分、古い町並み(さんまち)に着きます。古くから飛騨の中心地として栄え、江戸時代の中ごろからは幕府の直轄地となった高山の商家町で、昭和54年(1979)に国の重要伝統的建造物群保存地区に選ばれました。狭い通りをはさんで軒の低い町家が連なり、中二階建てで屋根の勾配がゆるく、深い軒をもつのが特徴です。格子の続く町並みを、ゆっくり歩いてみましょう。この後は、歩いておよそ4分、飛騨高山まちの博物館へ向かいましょう。",
  machihaku:
    "さんまちから歩いておよそ4分、飛騨高山まちの博物館に着きます。高山市の施設で、高山城下町の歴史や、そこで育まれた美術工芸・伝統文化を紹介しています。展示室には、江戸時代の豪商だった矢嶋家と永田家の土蔵が使われています。この後は、歩いておよそ7分、高山陣屋へ向かいましょう。",
  jinya:
    "飛騨高山まちの博物館から歩いておよそ7分、高山陣屋に着きます。飛騨は元禄5年(1692)に幕府の直轄地となり、ここは代官・郡代が飛騨を治めた拠点でした。幕末には全国に60数か所あったといわれる代官所・郡代所のうち、主な建物が残るのは高山陣屋だけとされています。大広間や御蔵、御白洲などが見られます。入場の締め切りは季節で変わるので、公式の案内で確かめましょう。この後は、歩いておよそ13分、飛騨国分寺へ向かいましょう。",
  kokubunji:
    `高山陣屋から歩いておよそ13分、飛騨国分寺に着きます。天平13年(741)の聖武天皇の詔を受けて、天平18年(746)ごろに建てられたとされ、開基は行基と伝えられます。境内の三重塔は文政4年(1821)に再建されたもので、飛騨でただ一つの三重塔とされ、岐阜県の重要文化財です。推定樹齢1300年の大イチョウは国の天然記念物で、寺ができたころに植えられたと伝わります。この時間は本堂の拝観の受付が終わっているので、境内の三重塔と大イチョウを中心に見て回りましょう。${PRAY}帰りは、JR高山駅の東口まで歩いておよそ6分です。`,
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  { label: "宮川朝市(始まり 9:00→9:06、入口の一文)", item: { id: ASAICHI, data: { visitTime: T(9, 6), stayDurationMin: 50, memo: M.asaichi } } },
  { label: "日下部民藝館(歩き3→4)", item: { id: KUSAKABE, data: { visitTime: T(10, 0), stayDurationMin: 40, memo: M.kusakabe, transitLegs: W(4) } } },
  { label: "桜山八幡宮(歩き4→5)", item: { id: HACHIMAN, data: { visitTime: T(10, 45), stayDurationMin: 25, memo: M.hachiman, transitLegs: W(5) } } },
  { label: "高山祭屋台会館(点 way490918179、歩き2→4)", item: { id: YATAI, data: { lat: "36.148418", lng: "137.260099", visitTime: T(11, 14), stayDurationMin: 75, memo: M.yatai, transitLegs: W(4) } } },
  {
    label: "さんまちの近くで昼食(新規。点はバス停 node13833692506、店でない)",
    item: { create: { name: "さんまちの近くで昼食", address: "岐阜県高山市上三之町", lat: "36.14131", lng: "137.259272", visitTime: T(12, 44), stayDurationMin: 40, memo: M.lunch, transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] } } },
  },
  { label: "古い町並み（さんまち）(100→60、歩き10→2)", item: { id: SANMACHI, data: { visitTime: T(13, 26), stayDurationMin: 60, memo: M.sanmachi, transitLegs: W(2) } } },
  { label: "飛騨高山まちの博物館(歩き2→4)", item: { id: MACHIHAKU, data: { visitTime: T(14, 30), stayDurationMin: 35, memo: M.machihaku, transitLegs: W(4) } } },
  { label: "高山陣屋(点を 0534e5d3・581607ca と同じ点に、歩き5→7)", item: { id: JINYA, data: { lat: "36.139692", lng: "137.257618", visitTime: T(15, 12), stayDurationMin: 55, memo: M.jinya, transitLegs: W(7) } } },
  { label: "飛騨国分寺(歩き7→13、帰りの一文)", item: { id: KOKUBUNJI, data: { visitTime: T(16, 20), stayDurationMin: 30, memo: M.kokubunji, transitLegs: W(13) } } },
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
  console.log(`■ [外す] 宗猷寺 (${SOYUJI})`);
  console.log("\n  始まり 9:06(8:30〜9:30)/ 昼食 12:44(13:30より前)/ 終わり 飛騨国分寺 16:50(日帰りの 16:30〜17:00)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: [SOYUJI] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
