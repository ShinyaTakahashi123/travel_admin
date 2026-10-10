/**
 * チェックリスト #433 896c41e3「五稜郭と函館山、定番の絶景と歴史を1日で巡るプラン」の見直し（しおりえ(制作補助2)）
 * 五稜郭タワー → 五稜郭公園 → 箱館奉行所（新規）→（市電）金森赤レンガ倉庫（昼食）→ 八幡坂（新規）→ 旧函館区公会堂 →（ロープウェイ）函館山（7か所 09:00〜16:30）
 * 前の行程は函館山の夜景で18時に終わっていたので、函館山は昼の眺めにして16時30分までに終える。説明文の「日本三大夜景」も直す
 * 既存の5か所はIDのまま、本文を公式で確かめて書き直す（「駆け足で…」のくり返しも直す）:
 *   - 五稜郭公園「約1500本のソメイヨシノ」→ 公式は「大正3年に公園として開放され、5,000株の桜の苗木が植樹」
 *   - 五稜郭タワー「初代は1964年」、金森「1907年の大火で6棟を焼失、1909年に再建」、函館山「100万ドルの夜景」「陸繋島」などは開いた公式で確かめられないので外す
 * 写真: 5枚とも目で見て場所が合っているので残す
 * 本文の出典: 五稜郭タワー https://www.goryokaku-tower.co.jp/ ・ https://www.goryokaku-tower.co.jp/facility/ ・五稜郭の歴史 https://www.goryokaku-tower.co.jp/history/ ／
 *   箱館奉行所 https://hakodate-bugyosho.jp/history ／金森赤レンガ倉庫 https://www.hakodate-kanemori.com/about/ ／八幡坂 https://www.hakobura.jp/spots/478 ／
 *   旧函館区公会堂 https://hakodate-kokaido.jp/ ・ https://hakodate-kokaido.jp/history/ ／函館山 https://www.hakobura.jp/spots/585 ・函館山ロープウェイ https://334.co.jp/
 * 座標の出典: Nominatim（五稜郭タワー 41.7945919,140.7539587／五稜郭公園 41.7969004,140.7571559／箱館奉行所 41.7969330,140.7567258／金森赤レンガ倉庫 41.7661843,140.7164492／
 *   旧函館区公会堂 41.7650377,140.7089208／函館山展望台 41.7594299,140.7046412）、OSM/Overpass（八幡坂 way 41111885 41.7647317,140.7127335）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-433-896c41e3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "896c41e3-2a7d-4180-b052-c8ef4cf13c87";
const DAY1_ID = "08de559a-8497-48f4-be2e-d2a493d49b13";
const PARK = "12ba6711-bffb-46b8-9072-3f8e823e6f7a";
const TOWER = "6c78e5ca-26e9-4df2-a8f7-231852b9ea82";
const KANEMORI = "37c2114b-9b02-4f10-9413-9137d288db9c";
const KOKAIDO = "944804db-b22f-45f7-bc57-f74d885f5321";
const HAKODATEYAMA = "a500e632-60d2-4dcc-8a48-6f1486817305";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "星形の五稜郭を五稜郭タワーから眺め、復元された箱館奉行所をめぐったら、市電でベイエリアの金森赤レンガ倉庫へ。八幡坂と旧函館区公会堂を訪ね、最後はロープウェイで函館山の山頂から街並みを見渡します。函館観光の定番の歴史と絶景を1日でめぐるプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, line: string | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  upd(TOWER, 9, 0, 50, null, null, null, 41.794592, 140.753959,
    "旅の始まりは五稜郭タワーへ。今のタワーは2006年（平成18年）にオープンした2代目で、高さは避雷針を含めて107mです。地上90mの展望2階からは、特別史跡・五稜郭の星形がくっきりと見え、函館の市街や函館山、横津連峰の山並みも一望できます。展望2階には五稜郭の歴史を学べる「五稜郭歴史回廊」があり、展望1階には真下が見える強化ガラスの床「シースルーフロア」もあります。"),
  upd(PARK, 9, 55, 40, "walk", 5, null, 41.7969, 140.757156,
    "タワーを降りたら、星形の五稜郭へ。幕府の命を受けた蘭学者・武田斐三郎が設計した西洋式の城郭で、安政4年（1857年）に着工し、ほぼ工事が完成した元治元年（1864年）に、箱館の奉行所がここへ移りました。大正3年（1914年）に公園として一般に開放され、5,000株の桜の苗木が植えられて、北海道でも有数の桜の名所になっています。昭和27年（1952年）には国の特別史跡に指定されました。"),
  cre("箱館奉行所", 10, 40, 50, "walk", 5, 41.796933, 140.756726, "北海道函館市五稜郭町",
    "五稜郭の中に建つ箱館奉行所へ。箱館戦争が終わった2年後の明治4年（1871年）に解体されましたが、それから約140年後の平成22年（2010年）、4年の工期をかけて、できるかぎり建築当時の材料と日本の伝統的な工法を使い、庁舎の3分の1の規模で復元されました。幕末の箱館と五稜郭の歴史を、展示で学ぶことができます。"),
  upd(KANEMORI, 12, 0, 60, "train", 30, "函館市電", 41.766184, 140.716449,
    "五稜郭公園前から市電でベイエリアへ。金森赤レンガ倉庫の歴史は、明治2年（1869年）に初代・渡邉熊四郎が洋品店を開いたことに始まり、明治20年（1887年）には倉庫業を始めました。大火で一度は失われかけながらも復活した倉庫群は、昭和63年（1988年）に今のようなショップやレストランが並ぶ施設になりました。海沿いの赤レンガの倉庫群を歩いて、このあたりで昼食にしましょう。"),
  cre("八幡坂", 13, 10, 20, "walk", 10, 41.764732, 140.712734, "北海道函館市末広町",
    "赤レンガ倉庫から函館山のほうへ歩いて八幡坂へ。函館山からの夜景と並んで、函館のビュースポットとしてよく紹介される坂で、坂の上からは青函連絡船記念館摩周丸を正面に望めます。坂の名は、かつて坂の上に函館八幡宮があったことに由来し、八幡宮は大火の被害を受けて、明治13年（1880年）に今の谷地頭町に移りました。冬には「はこだてイルミネーション」で、街路樹と石畳が照らし出されます。坂道なので、雨や雪の日は足元に気をつけましょう。"),
  upd(KOKAIDO, 13, 35, 55, "walk", 5, null, 41.765038, 140.708921,
    "八幡坂から歩いてすぐ。明治40年（1907年）の函館大火で町会所や商業会議所が焼失したため、住民の集会所や商業会議所の事務所として、明治43年（1910年）に建てられた洋風建築の代表的な建物です。建築費約5万8千円のうち5万円を、豪商の初代・相馬哲平が寄付しました。左右対称の形や、コリント様式の円柱で支えられたバルコニーをもつコロニアルスタイルの建物で、明治44年（1911年）には皇太子（のちの大正天皇）の宿泊所にもなりました。昭和49年（1974年）に国の重要文化財に指定され、大規模な保存修理を経て、2021年にリニューアルオープンしました。"),
  upd(HAKODATEYAMA, 14, 50, 100, "other", 20, null, 41.75943, 140.704641,
    "公会堂から歩いて函館山ロープウェイの山麓駅へ向かい、約3分の空中散歩で山頂へ。標高334mの函館山は、牛が寝そべったような姿から「臥牛山」とも呼ばれます。明治時代から昭和20年まで軍の要塞として立ち入りが禁じられていたため、結果として植物や野鳥などの豊かな自然が残り、今も砲台など戦争の跡が見られます。山頂の展望台からは函館の街並みを見渡せます。夜景で知られる場所で、日の入りの時刻が近づくと混み合うので、昼の景色をゆっくり楽しみましょう。山頂は風が強いので、寒さ対策をして出かけましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== [PARK, TOWER, KANEMORI, KOKAIDO, HAKODATEYAMA].join()) throw new Error("構成が想定と違います");
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
