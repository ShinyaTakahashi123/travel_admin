/**
 * チェックリスト #440 9903e2ef「白糸の滝とタリアセン、自然を感じる軽井沢1泊2日リゾート旅」の見直し（しおりえ(制作補助2)）
 * 車の旅。1日目: 白糸の滝 → 旧三笠ホテル（新規）→ 雲場池 →（昼食）→ 軽井沢ショー記念礼拝堂（新規）→ 旧碓氷峠 見晴台（新規）→ 熊野皇大神社（新規）→ 旧軽井沢銀座通り（新規）（7か所 09:00〜16:30）
 *        2日目: 追分宿郷土館（新規）→ 堀辰雄文学記念館（新規）→ 追分宿の分去れ（新規）→ 軽井沢タリアセン（4か所 09:00〜13:30。帰る日）
 * 説明文の「マイナスイオンあふれる」は根拠を確かめられない言葉（書き方の決まり）なので外す
 * 一年中のしおりなので、冬に休館する施設は入れない: ショーハウス記念館（11/4〜3/31休館）・旧近衛文麿別荘／歴史民俗資料館（11/16〜3/31冬期休館）・室生犀星記念館・町立植物園
 * 軽井沢タリアセンは12月・1月の開園時間が短い（公式 http://www.karuizawataliesin.com/information）ので、2日目の遅めの時間に回す
 * 旧三笠ホテルは約5年半の保存修理を終え、令和7年10月1日にリニューアルオープン（公式）
 * 既存の3か所はIDのまま、本文を公式で確かめて書き直す（前の本文は「皆様、…」の話し言葉）:
 *   - 雲場池「お水端」「大正時代に別荘開発で造られた」、タリアセン「名前の由来」「睡鳩荘・ペイネ美術館の説明」「冬季は休園」は開いた公式で確かめられないので外す
 * 写真: 白糸の滝・雲場池・タリアセンの写真は合っているので残す
 * 本文の出典: 軽井沢観光協会 https://karuizawa-kankokyokai.jp/spot/N/（白糸の滝 23206／雲場池 23234／軽井沢タリアセン 1203／旧三笠ホテル 1148／ショーハウス記念館 1144／
 *   旧碓氷峠 見晴台 23063／熊野皇大神社 23083／旧軽井沢銀座通り 30092／堀辰雄文学記念館 1138／追分宿郷土館 1137）、旧三笠ホテル https://kyu-mikasa-hotel.jp/ 、
 *   軽井沢町 https://www.town.karuizawa.lg.jp/site/kanko/1201.html（ショー記念礼拝堂）・https://www.town.karuizawa.lg.jp/page/1235.html と /page/1284.html（分去れ）
 * 座標の出典: Nominatim（白糸の滝 36.4103914,138.5924843／旧三笠ホテル 36.3731331,138.6262318／雲場池 36.3520901,138.6268853／碓氷峠見晴台 36.3672937,138.6565831／
 *   旧軽井沢銀座 36.3598831,138.6368547／追分宿郷土館 36.3414440,138.5475357／堀辰雄文学記念館 36.3387989,138.5439874／追分宿の分去れ 36.3368140,138.5387651／
 *   軽井沢タリアセン 36.3285277,138.5969394）、OSM/Overpass（熊野皇大神社 node 10877915637 36.3695043,138.6566576／軽井沢ショー記念礼拝堂 node 2463546492 36.3621095,138.6390282）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-440-9903e2ef.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9903e2ef-b144-43b3-885f-c552bc7cc906";
const DAY1_ID = "6a8e923f-5ccd-47aa-b0f4-10e51bd60187";
const DAY2_ID = "79a64fd4-2674-4b30-a37c-24d5cd25c4a4";
const SHIRAITO = "7921c54c-210f-49b8-8f26-534f63c414e0";
const KUMOBA = "41c7d26b-d461-4ed9-abe5-324daffdc00e";
const TALIESIN = "ebaf8e29-91d3-4ccf-baff-72a39d790da3";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "岩はだから地下水が白糸のように落ちる白糸の滝、明治の西洋式ホテル・旧三笠ホテル、「スワンレイク」とも呼ばれる雲場池、軽井沢で最も古い教会のショー記念礼拝堂、県境の碓氷峠をめぐり、2日目は中山道の宿場だった追分を歩いてから、塩沢湖畔の軽井沢タリアセンへ。軽井沢の自然と歴史を車でめぐる1泊2日です。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const day1 = [
  upd(SHIRAITO, 9, 0, 45, null, null, 36.410391, 138.592484,
    "旅の始まりは白糸の滝へ。湯川の水源にある滝で、高さ3m、幅70mの岩はだから、数百条の地下水が白い糸のように流れ落ちます。春はさわやかな新緑、夏は滝しぶきと涼しい風、秋はまばゆい紅葉と、季節ごとに違う表情を見せてくれます。滝の近くは足元が濡れて滑りやすいので、気をつけて歩きましょう。"),
  cre("旧三笠ホテル", 10, 5, 45, "car", 20, 36.373133, 138.626232, "長野県北佐久郡軽井沢町大字軽井沢1339-342",
    "白糸の滝から車で旧三笠ホテルへ。設計・施工とも日本人の手による、明治後期の純西洋式の木造ホテルで、明治・大正時代を築いた著名人が訪れた面影を今に伝えています。八角形の塔屋のある建物で、昭和55年（1980年）に国の重要文化財に指定されました。約5年半にわたる保存修理を終えて、2025年にリニューアルオープンしています。休館日は公式の案内で確かめてから訪れましょう。"),
  upd(KUMOBA, 11, 0, 50, "car", 10, 36.35209, 138.626885,
    "旧三笠ホテルから車で雲場池へ。「スワンレイク」とも呼ばれる小さな池で、水面に映る四季折々の自然が美しく、落ち着いた雰囲気の場所です。池のまわりは約1kmの散策路になっていて、のんびり歩きながら景色を楽しめます。新緑や紅葉の季節は特にすばらしく、軽井沢を代表する景勝地です。周辺の駐車場は公式の案内で確かめてから出かけましょう。このあと、昼食にしましょう。"),
  cre("軽井沢ショー記念礼拝堂", 13, 0, 30, "car", 10, 36.36211, 138.639028, "長野県北佐久郡軽井沢町大字軽井沢57-1",
    "昼食のあとは、旧軽井沢の軽井沢ショー記念礼拝堂へ。軽井沢で最も古い教会で、軽井沢を避暑地として世に知らしめたA.C.ショーが宣教師をしていた教会です。ショーは明治18年（1885年）に初めて軽井沢を訪れ、この地を「屋根のない病院」と呼んでたたえ、明治21年（1888年）には軽井沢で最初の別荘を建てました。この別荘が「軽井沢の別荘」を生み出すもとになったとされます。礼拝堂の横には、その別荘を復元したショーハウス記念館があります（冬は休館）。" + RESPECT),
  cre("旧碓氷峠 見晴台", 13, 45, 50, "car", 15, 36.367294, 138.656583, "長野県北佐久郡軽井沢町大字峠町",
    "礼拝堂から車で、標高1200mの旧碓氷峠 見晴台へ。長野県と群馬県の県境にあり、東には妙義連峰、西には浅間山が見える絶景が楽しめます。見晴台の入口には約4kmの遊歩道もあります。峠への道は冬に凍ることもあるので、冬用タイヤなどの準備をして、安全に運転しましょう。"),
  cre("熊野皇大神社", 14, 40, 35, "walk", 5, 36.369504, 138.656658, "長野県北佐久郡軽井沢町大字峠町",
    "見晴台から歩いてすぐ、碓氷峠の頂上にある熊野皇大神社へ。全国的にも珍しい、県境にある神社で、長野県側では「熊野皇大神社」、群馬県側では「熊野神社」と呼ばれ、ヤマトタケルが建てたと伝わる古い神社です。樹齢1000年以上とされるしなの木は、古くから御神木として信仰されてきました。" + RESPECT),
  cre("旧軽井沢銀座通り", 15, 30, 60, "car", 15, 36.359883, 138.636855, "長野県北佐久郡軽井沢町大字軽井沢",
    "碓氷峠から車で、旧軽井沢のメインストリート・旧軽井沢銀座通りへ。約750mの通りの両側に、老舗のベーカリーやコーヒーショップ、お土産や食べ歩きのお店が並びます。木造のクラシックな外観の軽井沢観光会館では、観光の情報を教えてもらえます。人通りの多い通りなので、まわりに気をつけて歩きましょう。今夜は軽井沢に泊まります。"),
];

const day2 = [
  cre("追分宿郷土館", 9, 0, 45, null, null, 36.341444, 138.547536, "長野県北佐久郡軽井沢町大字追分1155-8",
    "2日目は、中山道の宿場町だった追分へ。追分宿の東の入口にある追分宿郷土館は、江戸時代に宿場町として栄えた追分宿と、軽井沢町西地区の地域文化を伝えるため、昭和60年（1985年）に開館しました。旅籠を模した出桁造りの建物で、近世の追分宿を中心に、原始から現代までの資料を展示しています。宿場や脇本陣、旅籠のジオラマや模型のほか、軽井沢の伝承民謡「追分節」を聴けるコーナーもあります。休館日は公式の案内で確かめてから訪れましょう。"),
  cre("堀辰雄文学記念館", 9, 55, 45, "walk", 10, 36.338799, 138.543987, "長野県北佐久郡軽井沢町大字追分662",
    "郷土館から歩いて、堀辰雄文学記念館へ。昭和初期に活躍した作家・堀辰雄は、19歳で軽井沢を訪れて以来、毎年のようにこの地を訪れ、軽井沢を舞台にした数々の作品を残しました。昭和19年（1944年）からは追分に住み、この地に建てた家で昭和28年（1953年）に49歳で亡くなりました。記念館では原稿や書簡、初版本、遺愛の品々が展示され、晩年を過ごした住居や、愛蔵書を納めた書庫も見られます。休館日は公式の案内で確かめましょう。"),
  cre("追分宿の分去れ", 10, 50, 20, "walk", 10, 36.336814, 138.538765, "長野県北佐久郡軽井沢町大字追分",
    "記念館からさらに西へ歩いて、追分宿の西にある「分去れ」へ。昔の旅人にとって、中山道と北国街道が分かれる分岐点の道しるべだった場所です。ここに置かれた石碑には、各方面への里程や「さらしなは右みよしのは左にて月と花とを追分の宿」の一文が刻まれていて、当時の旅がしのばれます。そばの道路は車が多いので、気をつけて歩きましょう。"),
  upd(TALIESIN, 11, 30, 120, "car", 20, 36.328528, 138.596939,
    "追分から車で、塩沢湖を中心に広がる軽井沢タリアセンへ。軽井沢の自然を凝縮した広い敷地に、バラが咲き誇る庭園や美術館、歴史的な建物、レストラン、ショップ、遊戯施設などが集まっています。アートを鑑賞したり、四季折々の花や紅葉を楽しんだり、ボート遊びやゴーカートなど、幅広く楽しめます。園内で昼食をとるのもよいでしょう。12月・1月は開園時間が短くなり、遊戯施設は季節や天候によって営業しないこともあるので、公式の案内で確かめましょう。軽井沢の旅を、ここで締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== [SHIRAITO, KUMOBA].join() || days[1].spots.map((s) => s.id).join() !== TALIESIN) throw new Error("構成が想定と違います");
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
