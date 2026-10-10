/**
 * チェックリスト #431 83518f0d「グルメも夜景も。札幌の魅力をぎゅっと詰め込んだ旅」の見直し（しおりえ(制作補助2)）
 * 1日目: 北海道神宮 →（地下鉄東西線）白い恋人パーク →（昼食）→（地下鉄）北海道大学 → 北海道庁旧本庁舎 → 大通公園（新規）→ 狸小路商店街（6か所 09:00〜16:30）
 * 2日目: 二条市場（朝食）→ さっぽろテレビ塔 → 札幌市時計台 → すすきの（昼食）→（タクシー）サッポロビール博物館（5か所 09:00〜14:15。帰る日）
 * 行程に夜の時間がないのに、タイトル・説明文が「夜景」、すすきのの本文が「夜は…」だったので直す。
 *   タイトル「グルメも名所も。札幌の魅力をぎゅっと詰め込んだ旅」
 * 既存の10か所はIDのまま、本文を一文ずつ公式で確かめて書き直す（開いた公式で確かめられない記述は外す）:
 *   - 北海道神宮「御霊代を函館から札幌まで自ら背負って」→ 公式は「島義勇が奉じ、銭函の仮役所に仮安置し、12月に札幌へ」。三方を山・大鳥居の向きの話は外す
 *   - 白い恋人パーク: 会社名・創業者・名前の由来の逸話、アンティーク展示などは外す
 *   - 北大: 「Boys, be ambitious」の場所、ポプラ並木の年などは外す。時計台: ハワード社・機械遺産は外す
 *   - 狸小路: 名前の由来の説、祭りの日付（1月2日・8月第一土曜日）を外す。テレビ塔: 開業日（8月24日）・電波の話・高さの変化を外す
 *   - すすきの: 遊郭の歴史・店の数の話は外し、公式の説明に。ビール博物館: 「製糖会社」の年などは外し、「有料」の語も使わない
 * 写真: 10枚とも目で見て場所が合っているので残す
 * 本文の出典: 北海道神宮 http://www.hokkaidojingu.or.jp/history.html ／白い恋人パーク https://www.shiroikoibitopark.jp/ ・ https://www.shiroikoibitopark.jp/course/ ／
 *   北海道大学 https://www.visit-hokkaido.jp/spot/detail_10013.html ／北海道庁旧本庁舎 https://www.akarenga-h.jp/hokkaido/kaitaku/k-03/ ・ https://www.akarenga-h.jp/fhgo/satellite/ ／
 *   大通公園 https://www.sapporo-park.or.jp/odori/ ／狸小路 https://tanukikoji.or.jp/about-tanukikoji/ ／二条市場 https://nijomarket.com/about ／
 *   さっぽろテレビ塔 https://www.tv-tower.co.jp/enjoy_history.html ／札幌市時計台 https://sapporoshi-tokeidai.jp/know/bits_of_knowledge.php ・ https://sapporoshi-tokeidai.jp/ ／
 *   すすきの https://www.visit-hokkaido.jp/spot/detail_10009.html ・ラーメン横丁 https://www.sapporo-cci.or.jp/web/tourism/night/details/post-9.html ／
 *   サッポロビール博物館 https://www.sapporobeer.jp/brewery/s_museum/
 * 座標の出典: Nominatim（北海道神宮 43.0545798,141.3092009／白い恋人パーク 43.0886903,141.2716802／北海道大学 43.0795634,141.3373222／北海道庁旧本庁舎 43.0639656,141.3480242／
 *   大通公園 43.0599018,141.3475101／狸小路 43.0572584,141.3526980／二条市場 43.0582472,141.3584604／さっぽろテレビ塔 43.0611129,141.3564484／
 *   札幌市時計台 43.0625537,141.3536448／すすきの 43.0553612,141.3533762／サッポロビール博物館 43.0714076,141.3689962）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-431-83518f0d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "83518f0d-2bb9-44db-a3f1-bf8193c73dcf";
const DAY1_ID = "efdcb0f0-c389-4751-8b1c-bc263fa70fe3";
const DAY2_ID = "d6460354-db24-4320-bc2e-ae73b71008f4";
const JINGU = "dabeee47-03d6-4930-8d49-19803a745605";
const SHIROI = "a64fc7c6-f0cf-4db1-b548-93032af5b394";
const HOKUDAI = "ed41aa59-56ec-4856-a258-be18ed01daff";
const AKARENGA = "3837bba8-ad6b-4fcd-b6af-5cec98239fe1";
const TANUKI = "099f2144-1577-4c84-b1b7-d965850373bc";
const SUSUKINO = "852a8b42-5f83-4fe2-9036-3fba013ac479";
const NIJO = "a2761c0f-6dbc-44c4-b69d-dbf7003b16bf";
const TVTOWER = "2f90b5d5-e14f-4302-88b0-660109f7e310";
const TOKEIDAI = "db0dcebe-7bc9-4fc5-871a-0b4d5a92ad32";
const BEER = "fea2bc42-e36e-4167-ac39-489d9a3d2e76";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "グルメも名所も。札幌の魅力をぎゅっと詰め込んだ旅";
const DESCRIPTION =
  "1日目は北海道神宮から白い恋人パーク、北海道大学、赤れんが庁舎、大通公園をめぐり、狸小路商店街へ。2日目は二条市場の朝ごはんから、さっぽろテレビ塔、札幌市時計台を訪ね、すすきののラーメン横丁で昼食。最後はサッポロビール博物館で開拓とビールの歴史にふれる、札幌の名所とグルメを詰め込んだ1泊2日です。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, line: string | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, memo },
});

const day1 = [
  upd(JINGU, 9, 0, 50, null, null, null, 43.05458, 141.309201,
    "地下鉄東西線の円山公園駅から歩いて、北海道神宮へ。明治2年（1869年）、北海道の開拓・発展の守護神として、開拓三神とも呼ばれる大国魂神・大那牟遅神・少彦名神の三柱をまつる鎮座祭が行われたのが始まりです。御霊代は開拓判官・島義勇が奉じて銭函の仮役所に安置したのち札幌へ移され、明治4年（1871年）に円山の地に社殿が完成しました。昭和39年（1964年）に明治天皇をあわせてまつり、社名を「北海道神宮」と改めています。" + RESPECT),
  upd(SHIROI, 10, 15, 75, "train", 25, "札幌市営地下鉄東西線", 43.08869, 141.27168,
    "円山公園駅から地下鉄東西線で、白い恋人パークへ。北海道みやげの定番のお菓子「白い恋人」のテーマパークで、まるで絵本に出てくるような、お菓子だらけの世界をまるごと体験できます。チョコレートについて学び、白い恋人の歴史を知ることができるほか、ここでしか味わえないオリジナルスイーツや、お菓子作りの体験、ガーデンも楽しめます。体験などは予約が必要なこともあるので、公式の案内で確かめましょう。このあと、昼食にしましょう。"),
  upd(HOKUDAI, 12, 45, 60, "train", 30, "札幌市営地下鉄", 43.079563, 141.337322,
    "昼食のあとは地下鉄で札幌駅方面へ戻り、北海道大学へ。1876年に札幌農学校として開校した大学で、札幌キャンパスは東京ドーム約38個分の広さがあります。正門そばのインフォメーションセンター「エルムの森」でマップを手に入れるのがおすすめです。構内には国の重要文化財の札幌農学校第2農場や、1909年建築の古河講堂など歴史ある建物が点在し、古河講堂の近くにはクラーク博士の胸像があります。旧理学部本館を生かした総合博物館も見学できます。大学の構内なので、授業や研究のじゃまにならないよう、静かに見学しましょう。"),
  upd(AKARENGA, 14, 0, 45, "walk", 15, null, 43.063966, 141.348024,
    "北海道大学から歩いて、赤れんが庁舎と呼ばれる北海道庁旧本庁舎へ。焼失した開拓使本庁舎に代わって1888年（明治21年）に建てられ、設計は北海道庁の技師・平井晴二郎です。レンガは、レンガに適した土が見つかった白石村（今の札幌市白石区）の工場で焼かれたものが使われました。国の重要文化財で、改修工事を終えて2025年（令和7年）にリニューアルオープンしました。"),
  {
    create: {
      name: "大通公園", visitTime: t(14, 55), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 43.059902, lng: 141.34751, address: "北海道札幌市中央区大通西1〜12丁目",
      memo: "赤れんが庁舎から歩いて大通公園へ。札幌の中心部を、大通西1丁目から12丁目まで長さ約1.5kmにわたって延びる公園で、花壇や芝生、92種約4700本の樹木が四季を彩ります。ライラックまつりやYOSAKOIソーラン祭り、雪まつり、ホワイトイルミネーションなどの会場にもなっています。",
    },
  },
  upd(TANUKI, 15, 45, 45, "walk", 10, null, 43.057258, 141.352698,
    "大通公園から南へ歩いて、狸小路商店街へ。北海道で最古の商店街の一つとされ、明治2年（1869年）に開拓使が札幌に置かれたころ、今の2丁目・3丁目あたりに商家や飲食店が建ち並び始め、明治6年ごろに「狸小路」と呼ばれるようになったそうです。7つのブロック、総延長約900mに約200軒の店が並ぶ全蓋アーケードの商店街で、今のアーケードは昭和57年（1982年）に完成した2代目です。雨や雪の日も歩きやすい通りで、夕食のお店を探しましょう。今夜は札幌に泊まります。"),
];

const day2 = [
  upd(NIJO, 9, 0, 60, null, null, null, 43.058247, 141.35846,
    "2日目は、125年以上の歴史をもつ「札幌市民の台所」、二条市場で朝ごはんを。明治初期に石狩浜の漁師が石狩川をさかのぼり、このあたりで新鮮な魚を売ったのが始まりといわれ、明治35年（1902年）の大火災を乗り越えて再建されました。北海道の新鮮な魚介や加工品、野菜や果物が並び、とれたての海の幸をその場で味わえるお店もあります。"),
  upd(TVTOWER, 10, 5, 40, "walk", 5, null, 43.061113, 141.356448,
    "二条市場から歩いてすぐ、大通公園に立つさっぽろテレビ塔へ。1957年にオープンした塔で、設計は名古屋テレビ塔や通天閣、別府タワーなども手がけ、「タワー博士」と呼ばれた内藤多仲です。高さ90mの展望台からは大通公園や札幌の街並みを見渡せ、天気のよい日には西側に手稲山も見えます。"),
  upd(TOKEIDAI, 10, 50, 40, "walk", 5, null, 43.062554, 141.353645,
    "テレビ塔から歩いて、札幌市時計台へ。国の重要文化財で、正式には旧札幌農学校演武場といい、明治11年（1878年）に札幌農学校の中央講堂として建てられました。時計の機械は明治14年に動き始め、ワイヤーロープやねじなどの消耗部品以外は取り替えずに、明治の姿のまま動いているそうです。クラーク博士が札幌を離れたあとに建てられたので、博士が時計台で授業をしたことはありません。"),
  upd(SUSUKINO, 11, 45, 60, "walk", 15, null, 43.055361, 141.353376,
    "時計台から南へ歩いて、すすきのへ。約3,500軒の店が集まり、日本三大歓楽街の一つといわれる繁華街で、東京以北でも最大級の規模とされます。1951年にできたラーメンの名店街をもとにした「元祖さっぽろラーメン横丁」など、ラーメンの店が並ぶ一角もあるので、ここで昼食にしましょう。夏にはすすきの祭り、冬の雪まつりの期間にはすすきのアイスワールドも行われます。"),
  upd(BEER, 13, 5, 70, "taxi", 20, null, 43.071408, 141.368996,
    "すすきのからタクシーでサッポロビール博物館へ。1876年の北海道開拓事業から受け継がれるサッポロビールの歴史を紹介する博物館で、日本で最も歴史のあるビール博物館とされます。レンガ造りの建物は、明治時代の貴重な建造物として北海道遺産に指定されています。見学のあとは、試飲のコーナーで工場直送のビールも味わえます。お酒は20歳から。北海道の開拓とビールの歴史にふれて、札幌の旅を締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== [JINGU, SHIROI, HOKUDAI, AKARENGA, TANUKI].join() ||
    days[1].spots.map((s) => s.id).join() !== [SUSUKINO, NIJO, TVTOWER, TOKEIDAI, BEER].join()) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots).map((s) => [s.id, s.name]));

  console.log(`タイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
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
