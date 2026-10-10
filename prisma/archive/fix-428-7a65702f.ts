/**
 * チェックリスト #428 7a65702f「山口県立山口博物館と瑠璃光寺五重塔、湯田温泉近郊1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目: 山口県立山口博物館 → 山口大神宮（新規）→ 山口サビエル記念聖堂（新規）→（昼食）→ 山口県立美術館（新規）→（タクシー）湯田温泉（新規、泊）（5か所 09:00〜16:30）
 * 2日目: 瑠璃光寺五重塔 → 萩藩主毛利家墓所（新規）→ 洞春寺（新規）→ 八坂神社（新規）（4か所 09:00〜11:40。帰る日）
 * 瑠璃光寺五重塔は令和4年12月から檜皮葺屋根の全面葺き替えの保存修理をしていたが、令和7年12月末に完了した（山口市）ので、そのとおりに書く
 * 既存の2か所はIDのまま、本文を公式で確かめて書き直す（前の本文は「皆様、…」の話し言葉）:
 *   - 博物館「収蔵品およそ34万点」「ティラノサウルスの骨格標本」は開いた公式で確かめられないので外す。「明治45年の開館」は公式の「防長教育博物館として発足」に合わせる
 *   - 五重塔「大内文化の最高傑作」は公式の「室町中期における最も秀でた建造物と評されている」に合わせる
 *   - 説明文の「足湯や文学館とは違う」は内容の説明にならないので外す
 * 写真: 博物館・五重塔の写真は合っているので残す
 * 本文の出典: 山口県立山口博物館 沿革 https://www.yamahaku.pref.yamaguchi.lg.jp/enkaku.html ・概要 https://www.yamahaku.pref.yamaguchi.lg.jp/gaiyo.html ／
 *   山口市観光情報サイト https://yamaguchi-city.jp/details/N.html（山口大神宮 ad_daijingu／山口サビエル記念聖堂 ac_sabieru01／湯田温泉 af_yuda／五重塔 aa_ruri_tou／
 *   香山公園 aa_kozan／毛利家墓所 aa_ruri_bosyo／洞春寺 aa_tousyun／八坂神社 ac_yasaka）、山口県立美術館 https://yamaguchi-city.jp/y-art/museum.html ／
 *   五重塔の保存修理の完了 https://www.city.yamaguchi.lg.jp/soshiki/110/192674.html
 * 座標の出典: Nominatim（山口県立山口博物館 34.1824368,131.4727757／山口大神宮 34.1843928,131.4680103／山口サビエル記念聖堂 34.1789852,131.4731088／
 *   山口県立美術館 34.1795770,131.4744868／湯田温泉 34.1598753,131.4604069／毛利家墓所 34.1889266,131.4711699／洞春寺 34.1880320,131.4711131）、
 *   OSM/Overpass（瑠璃光寺五重塔 node 6814865885 34.1895157,131.4730742／八坂神社 node 6796971627 34.1850155,131.4782343）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-428-7a65702f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7a65702f-5c0b-4b5b-a3b7-922d2f9ed73e";
const DAY1_ID = "a6e8e0de-2382-4c47-9ddf-78e622e508cb";
const DAY2_ID = "fc49fe4c-47ff-4e71-9d45-ea251094e3fe";
const MUSEUM = "e2a70d13-4853-4a9a-9d36-c543cc0fb42a";
const PAGODA = "6a6c4a6e-46b5-4c24-b9c0-61bd649701bb";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "天文から歴史まで7つの分野で山口の自然と歴史を紹介する県立山口博物館から、伊勢の神霊を迎えた山口大神宮、白い三角錐のサビエル記念聖堂、県立美術館をめぐり、湯田温泉に泊まります。2日目は、屋根の葺き替えを終えた国宝・瑠璃光寺五重塔から、毛利家墓所、洞春寺、八坂神社へ。「西の京」山口の歴史を歩く1泊2日です。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const day1 = [
  upd(MUSEUM, 9, 0, 80, null, null, 34.182437, 131.472776,
    "旅の始まりは山口県立山口博物館へ。明治45年（1912年）に防長教育博物館として発足し、大正6年（1917年）に今の場所に開設された、歴史の長い総合博物館です。昭和42年（1967年）に今の建物に改築され、天文・地学・植物・動物・考古・歴史・理工の7つの部門で、山口県の自然と歴史を紹介しています。開館100周年を迎えた平成24年（2012年）には展示室が新しくなりました。休館日は公式の案内で確かめてから訪れましょう。"),
  cre("山口大神宮", 10, 30, 30, "walk", 10, 34.184393, 131.46801, "山口県山口市滝町",
    "博物館から歩いて約10分。永正17年（1520年）に大内義興が、伊勢から神霊を迎えて創建した古社です。京都で足利幕府の管領代を務めていた義興が伊勢神宮に参拝し、その荘厳さに打たれて、帰国後この地に社殿を造営したといわれています。社殿は伊勢神宮と同じ神明造りで、当時、伊勢の神霊を迎えた神社はここだけだったことから、伊勢信仰が盛んだった江戸時代には「西のお伊勢様」と呼ばれ、多くの参拝者でにぎわったといわれます。社殿の横の石段を上ると、天照大神をまつる内宮と、豊受大神をまつる外宮があります。" + RESPECT),
  cre("山口サビエル記念聖堂", 11, 15, 35, "walk", 15, 34.178985, 131.473109, "山口県山口市亀山町",
    "山口大神宮から歩いて約15分。はじめの記念聖堂は、フランシスコ・サビエルが山口を訪れてから400年を記念して、昭和27年（1952年）に建てられました。平成3年（1991年）に焼失しましたが、再建に向けた募金活動などを経て、平成10年（1998年）に白い新しい記念聖堂が完成しました。十字架と鐘を含めて高さ53mの2本の塔と、建物全体を覆う三角錐の屋根が特徴的なデザインで、礼拝堂の中にはたくさんのステンドグラスやパイプオルガンがあります。見学できる時間は公式の案内で確かめ、" + "今も祈りが続く場所ですので、静かに、敬意をもって見学してください。このあと、町なかで昼食にしましょう。"),
  cre("山口県立美術館", 13, 0, 90, "walk", 5, 34.179577, 131.474487, "山口県山口市亀山町3-1",
    "サビエル記念聖堂から歩いてすぐ。昭和54年（1979年）に開館した、山口県の芸術文化の鑑賞と創造の場として中心的な役割を担う美術館です。「山口県の特色を発揮する郷土色豊かな美術館」「県民が参加する開かれた美術館」をコンセプトに、郷土ゆかりの作家を取り上げた展覧会や、さまざまな美術・文化を紹介する展覧会を開いています。展示替えなどで休館することもあるので、公式の案内で確かめてから訪れましょう。"),
  cre("湯田温泉", 14, 50, 100, "taxi", 20, 34.159875, 131.460407, "山口県山口市湯田温泉",
    "美術館からタクシーで湯田温泉へ。湯田の名は、湯が湧き出る田地に由来するといわれます。無色透明のアルカリ性単純温泉で、30あまりの旅館などの温泉を支えています。正治2年（1200年）の文書に「湯田」の地名があることから、少なくともそのころには湯が出ていたといわれます。傷ついた足を池の湯につけに来る白狐を見た寺の和尚が、池の近くを掘らせると熱い湯と薬師仏の金像が出てきた、という「白狐の湯」の伝説も残っています。温泉街を歩いたら、宿でゆっくり温まりましょう。今夜は湯田温泉に泊まります。"),
];

const day2 = [
  upd(PAGODA, 9, 0, 50, null, null, 34.189516, 131.473074,
    "2日目は香山公園の国宝・瑠璃光寺五重塔へ。大内氏の25代・大内義弘は、応永6年（1399年）に足利義満と戦って戦死しました。弟の26代・盛見は、兄の菩提を弔うため、義弘が建てた香積寺に五重塔を造営しましたが、その途中で戦死し、五重塔は嘉吉2年（1442年）ごろに落慶しました。全国に現存する五重塔のうち10番目に古く、その美しさは奈良の法隆寺、京都の醍醐寺の五重塔とともに日本三名塔の一つに数えられ、室町時代中期のもっとも秀でた建造物と評されています。相輪の先まで31.2mで、檜皮葺の屋根は、全面葺き替えの保存修理を令和7年末に終えました。" + RESPECT),
  cre("萩藩主毛利家墓所", 9, 55, 30, "walk", 5, 34.188927, 131.47117, "山口県山口市香山町",
    "五重塔と同じ香山公園の中。萩市にある毛利家墓所とともに、長州藩の藩主の墓地として昭和56年（1981年）に国の史跡に指定されています。13代・毛利敬親とその夫人、世子の元徳と夫人、その子の元昭と夫人、毛利本家歴代の諸霊の墓など計7基があり、初代・秀就の母の墓などもあります。今も祈りが続く場所ですので、静かに、敬意をもって見学してください。"),
  cre("洞春寺", 10, 30, 30, "walk", 5, 34.188032, 131.471113, "山口県山口市",
    "毛利家墓所から歩いてすぐ。毛利元就の菩提寺ですが、この地にはもともと、応永11年（1404年）に大内盛見が天下泰平と家内繁栄を祈って建てた国清寺がありました。今の本堂は江戸時代に焼失したあとに再建されたものですが、山門は国清寺の創建当時のものと考えられています。彫刻のない大きな板蟇股など、当時の禅宗の山門の特色がよく表れています。" + RESPECT),
  cre("八坂神社", 11, 10, 30, "walk", 10, 34.185016, 131.478234, "山口県山口市",
    "洞春寺から歩いて約10分。町家づくりの建物が並ぶ竪小路のそばに、朱色の大鳥居が目を引く神社です。大内弘世が応安2年（1369年）に京都から迎えたのが始まりで、江戸時代の末期に毛利氏が本殿を今の場所に移しました。本殿は永正16年（1519年）に建てられたままのもので、二間社流造、檜皮葺の屋根をもち、まわりの13個の変化に富んだ蟇股には室町時代の特色がよく表れています。" + RESPECT + "「西の京」山口の歴史をたどる旅を、ここで締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== MUSEUM || days[1].spots.map((s) => s.id).join() !== PAGODA) throw new Error("構成が想定と違います");
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
