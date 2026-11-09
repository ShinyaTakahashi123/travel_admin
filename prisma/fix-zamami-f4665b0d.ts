/**
 * 座間味島、ケラマブルーの2つのビーチと高月山展望台(f4665b0d)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の f4665b0d の欄。
 * - 船: 座間味村の公式の時刻表 https://www.vill.zamami.okinawa.jp/ship/ は 2026年9月〜の月ごとの表だけで、夏(7・8月)の表はまだ出ていない。
 *   一番近い9月の表(https://www.vill.zamami.okinawa.jp/ship/2026/09/)の高速船(那覇9:00→座間味9:50、座間味17:20発)で組む(企画運営 (b))。
 *   本文に便の時刻・便名は書かず、1か所目に「便は季節で変わる・欠航がある・行きと帰りの便を公式で確かめ、最終便に間に合うように」の一文(法務)。
 *   阿真ビーチ 16:30 → 歩き22 → 港 16:52 ごろ、17:20発まで28分(決まり64行目の25分以上)
 * - 村内バスは夏の表が公式になく(今は10〜12月の表だけ、券は車内で買えない)、待ちを確かめられないので使わない(企画運営 (a))。
 *   高月山→阿真の「bus/45」をやめ、歩きと、港のそばの「青のゆくる館」(慶良間諸島国立公園のビジターセンター、新規 25分)にする
 * - 点(7章): 古座間味ビーチ(砂浜の面の中心)→ 着く側のバス停「ふるざまみ」node13668267601、阿真ビーチ(砂浜の面の中心)→
 *   「阿真ビーチ」tourism=attraction node4873078521、昼食(集落の中心の地名の点 node8299864731)→ バス停「座間味ゆくる館」node13673730401
 *   (決まり379行目、企画運営 (c))、青のゆくる館 → tourism=information node11341064044
 * - 歩き(routed-foot): 港→ふるざまみ 20.0→20、ふるざまみ→昼食 19.7→20、昼食→高月山 16.2(上り。国交省の多言語解説の「座間味港から片道約20分」で 20)、
 *   高月山→青のゆくる館 15.8(下り、同じく 20)、青のゆくる館→阿真 20.2→21、阿真→港 21.4→22(帰りの一文)
 * - 古座間味ビーチ 120→100(上限)、昼食 50→40。海の安全(遊泳区域・監視・離岸流)、ウミガメ(触らない・追いかけない)の一文。
 *   「ミシュラン・グリーンガイドで2つ星」は ANA の旅の案内(https://www.ana.co.jp/ja/jp/japan-travel-planner/okinawa/0000004.html)を出典に「とされています」
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-zamami-f4665b0d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "f4665b0d-7529-416b-b259-398d83c1b3c1";
const DAY_ID = "3b614918-04ca-455f-b6d7-b9505d8b69df";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const W = (min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk" as const, transitDurationMin: min }] });

const TOMARI = "57530e81-16b6-4af9-8b01-4f7330ebdb1a";
const ZAMAMI_PORT = "54a48134-d330-4138-acf6-4e1c21ea248f";
const FURUZAMAMI = "d66df421-3f2b-4a81-88fd-c5b470cab5ab";
const LUNCH = "3208f677-0674-4846-afdc-35af04a53917";
const TAKATSUKI = "d0080957-3461-446a-a641-3e021ac05e33";
const AMA = "0f816cfc-2a62-4f8c-8afd-62c79d24e8b6";

const EXPECT: Record<string, string> = {
  [TOMARI]: "泊港 北岸（高速船乗り場）", [ZAMAMI_PORT]: "座間味港", [FURUZAMAMI]: "古座間味ビーチ",
  [LUNCH]: "座間味の集落（昼食）", [TAKATSUKI]: "高月山展望台", [AMA]: "阿真ビーチ",
};

const DESC_OLD =
  "那覇の泊港から高速船で慶良間諸島の座間味島へ。白い砂浜と澄んだ海の古座間味ビーチで泳ぎ、集落で昼食をとってから、高月山の展望台で島々の眺めを楽しみ、ウミガメに出会えることもある阿真ビーチへ。慶良間諸島国立公園の海を1日で味わう夏の日帰りプランです。";
const DESC_NEW =
  "那覇の泊港から高速船で慶良間諸島の座間味島へ。白い砂浜と澄んだ海の古座間味ビーチで泳ぎ、集落で昼食をとってから、高月山の展望台で島々の眺めを楽しみ、港のそばのビジターセンター・青のゆくる館に寄って、ウミガメが訪れることもある阿真ビーチへ。慶良間諸島国立公園の海を1日で味わう夏の日帰りプランです。";

const M = {
  tomari:
    "那覇の泊港から、座間味島へ向かう高速船に乗ります。泊港北岸の高速船乗り場から乗るので、時間に余裕をもって向かいましょう。予約の受付は公式の案内で確かめましょう。便の時刻は季節で変わり、天候や点検などで欠航することもあります。出発の前に、行きと帰りの便を座間味村の公式の時刻表で確かめ、帰りの最終便に間に合うように回りましょう。",
  zamamiPort:
    "高速船で約50分、座間味島の玄関口の港です。慶良間諸島は2014年に国立公園に指定され、「ケラマブルー」と呼ばれる透明度の高い海や、多様なサンゴ礁が広がっています。港の近くには観光の案内所があり、村内バスの乗り場もあるので、島の地図や帰りの便を確かめてから歩き始めましょう。冬には、島のまわりの海がザトウクジラの繁殖の場所になり、ホエールウォッチングの季節を迎えます。この後は、歩いておよそ20分、古座間味ビーチへ向かいましょう。",
  furuzamami:
    "座間味港から坂道を歩いておよそ20分、島の東側にある、座間味島を代表するビーチに着きます。約1kmにわたって白い砂浜が続き、「慶良間ブルー」と呼ばれる青い海との対比が美しく、ミシュラン・グリーンガイドで2つ星に選ばれたとされています。水深の浅い場所でも熱帯魚が見られ、シュノーケリングも楽しめます。泳ぐときは、遊泳区域や監視員のいる時季を公式の案内で確かめ、その中で泳ぎましょう。離岸流などの強い流れに気をつけましょう。サンゴは生き物なので、踏んだり触ったりしないようにしましょう。日差しがとても強いので、帽子や日焼け止め、こまめな水分補給を忘れずに。この後は、歩いておよそ20分、座間味の集落へ向かいましょう。",
  lunch:
    "古座間味ビーチから歩いておよそ20分、座間味の集落に戻り、このあたりで昼食にしましょう。集落の中は住む人の暮らしの場なので、静かに歩き、家の敷地に入ったり、人を勝手に撮ったりしないようにしましょう。この後は、坂道を歩いておよそ20分、高月山展望台へ向かいましょう。",
  takatsuki:
    "座間味の集落から坂道を歩いておよそ20分、標高137mの高月山にある展望台です。座間味の集落や古座間味ビーチ、入り江、まわりに点在する慶良間の島々を見渡せ、島の地形がよくわかります。上り坂が続くので、暑い時間は無理をせず、水分をとりながらゆっくり上りましょう。足元にも気をつけましょう。この後は、歩いておよそ20分、港のそばの青のゆくる館へ向かいましょう。",
  yukurukan:
    "高月山展望台から歩いておよそ20分、座間味港のそばにある、慶良間諸島国立公園のビジターセンター「青のゆくる館」に着きます。慶良間の海や島の自然を紹介する展示があり、無料で見学できます。開館時間や休館日は公式の案内で確かめましょう。この後は、歩いておよそ21分、阿真ビーチへ向かいましょう。",
  ama:
    "青のゆくる館から歩いておよそ21分、島の西側にある、遠浅で波の静かなビーチに着きます。慶良間諸島のサンゴ礁の海は、ラムサール条約の湿地に登録されています。ウミガメが訪れることもありますが、見かけても、触らない、追いかけない、近づきすぎないようにしましょう。遠浅なので、潮が大きく引く時間は泳ぐのに向きません。潮の満ち引きと、遊泳区域や監視員のいる時季を確かめて、その中で泳ぎましょう。天気が悪いときや海が荒れているときは泳げません。帰りの便に間に合うよう、着替えの時間も見て早めに切り上げ、歩いておよそ22分の座間味港へ向かいましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  { label: "泊港 北岸(「確かめましょう」、便の時刻・欠航・最終便の一文)", item: { id: TOMARI, data: { memo: M.tomari } } },
  { label: "座間味港(終わりの分を足す)", item: { id: ZAMAMI_PORT, data: { memo: M.zamamiPort } } },
  { label: "古座間味ビーチ(点をバス停「ふるざまみ」、120→100、海の安全)", item: { id: FURUZAMAMI, data: { lat: "26.222568", lng: "127.307375", visitTime: T(10, 30), stayDurationMin: 100, memo: M.furuzamami, transitLegs: W(20) } } },
  { label: "座間味の集落のあたりで昼食(名前と点をバス停「座間味ゆくる館」に、50→40)", item: { id: LUNCH, data: { name: "座間味の集落のあたりで昼食", lat: "26.227744", lng: "127.301864", visitTime: T(12, 30), stayDurationMin: 40, memo: M.lunch, transitLegs: W(20) } } },
  { label: "高月山展望台(上り20、国交省の解説)", item: { id: TAKATSUKI, data: { visitTime: T(13, 30), stayDurationMin: 30, memo: M.takatsuki, transitLegs: W(20) } } },
  {
    label: "青のゆくる館(新規。慶良間諸島国立公園のビジターセンター、点は node11341064044)",
    item: { create: { name: "青のゆくる館", address: "沖縄県島尻郡座間味村座間味95", lat: "26.22767", lng: "127.302151", visitTime: T(14, 20), stayDurationMin: 25, memo: M.yukurukan, transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 20 }] } } },
  },
  { label: "阿真ビーチ(点を tourism=attraction node4873078521、bus/45→歩き21、終わり 16:30)", item: { id: AMA, data: { lat: "26.226699", lng: "127.292384", visitTime: T(15, 6), stayDurationMin: 84, memo: M.ama, transitLegs: W(21) } } },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { description: true } });
  if (it?.description !== DESC_OLD) throw new Error("説明文が想定と違います");
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);

  console.log(`説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
    const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(変更なし)";
    console.log(`■ ${"id" in item ? "[既存]" : "[新規]"} ${label}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}${d.name ? `／名前 ${d.name}` : ""}\n  ${d.memo}`);
  }
  console.log("\n  泊港 8:40・座間味港 9:50 は変わらず。昼食 12:30(13:30より前)/ 終わり 阿真ビーチ 16:30 → 歩き22で港 16:52 ごろ(9月の公式の表の最終便 17:20 まで28分)");

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
