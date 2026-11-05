/**
 * 依水園と般若寺、奈良の庭園と花の寺を訪ねる日帰り旅(7f972333)の組み直し(2026-11-05、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の 7f972333 の欄(点も含めて組み直し)。
 * - c97e2205(1泊2日)などとの重なりを減らすため、題の中心の依水園・般若寺のほかは、東大寺(南大門)だけを重なりとして残す(企画運営 11/05)。
 *   奈良国立博物館・二月堂・手向山八幡宮・北山十八間戸(c97e2205 と重なる)と、空海寺(ふだんの拝観を公式で確かめられない)を外す。
 *   五劫院・聖武天皇陵・不退寺は、ふだんの拝観・点・歩きの分が決まりに合わず使わない。若草山を足す(ほかのしおりにない。企画運営 11/05)
 * - 回る順は、歩きをすべて25分以内にするため、奈良阪の奈良豆比古神社から南へ下り、東大寺で終える逆回り(案E。企画運営・法務 11/05)。
 *   書き出しは近鉄奈良駅からバスでおよそ15分「奈良阪」下車すぐ(観光協会 narashikanko.or.jp/spot/detail_10054.html。路線名・会社名は書かない)
 * - 点: 奈良豆比古神社 way398754703 の Nominatim の中心 34.7043562,135.8339665、般若寺 着く側の「楼門」way398722152 の中心 34.6997293,135.8355922
 *   (c97e2205 の般若寺と同じ点)、昼食 バス停「今在家」node2637772015 34.694725,135.835191、
 *   依水園 garden way97082272 34.6854662,135.8379189(名前のある入口がなく、狭い庭園で中心が園内に落ちるため中心。c97e2205 と同じ点)、
 *   若草山 北の入口 node4418292191(shop=ticket、「Parc Entrance」。東大寺・依水園の側から着く入口)34.6864709,135.8458856、
 *   東大寺 着く側の「南大門」34.685812,135.839843(ほかの本と同じ点。企画運営 11/04)、帰り 近鉄奈良 node7836257261 34.6841971,135.8284104
 * - 区間(routing.openstreetmap.de routed-foot、秒から切り上げ): 奈良豆比古→楼門 581.4→10、楼門→今在家 650.0→11、今在家→依水園 1392.9→24、
 *   依水園→北の入口 1058.8→18、北の入口→南大門 576.7→10、帰り 南大門→近鉄奈良 1061.2→18
 * - 時刻: 奈良豆比古 9:30・30、般若寺 10:10・75、昼食 11:36・45、依水園 12:45・60、若草山 14:03・80(山頂の三重目まで往復: 登り約30〜40分)、
 *   東大寺 15:33・80 → 16:53(大仏殿の拝観は 8:00〜17:00、todaiji.or.jp/information/)
 * - 出典: 奈良豆比古神社 narashikanko.or.jp/spot/detail_10054.html、般若寺 /spot/detail_10017.html、依水園 /spot/detail_10050.html、
 *   若草山 奈良県 奈良公園クイックガイド www3.pref.nara.jp/park/item/2585.htm・観光協会 /ja/spot/nature/wakakusayama/、
 *   東大寺 todaiji.or.jp/information/nandaimon/・/information/daibutsuden/・/information/
 * - 季節: 春・秋のまま(若草山は3月第3土曜〜12月第2日曜。般若寺の花 山吹・コスモス、依水園の花と紅葉)。写真3枚(依水園・東大寺・般若寺)と表紙はそのまま
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-nara-7f972333.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "7f972333-ae4c-4ed4-9634-6c0d0b9efe28";
const DAY_ID = "1038dfb6-cd9f-4f76-bc23-959ad8fad609";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

const ISUIEN = "d24158dd-801d-48f2-b4b4-9553e31547ae";
const HAKUBUTSUKAN = "8a0092a3-ab75-4f99-bd22-ca41c110ecbc"; // 外す
const TODAIJI = "a7b55c23-d7ae-4fa7-b245-ca73f4ce326e";
const NIGATSUDO = "d518af75-b223-493c-99d9-854d3275ac22"; // 外す
const TAMUKEYAMA = "51867acd-9537-40ba-a49d-7753d05fbc75"; // 外す
const KUKAIJI = "0f43ebb8-8653-41ac-a30b-9dbe0bc87e0b"; // 外す
const HANNYAJI = "14319a64-e1eb-4af1-b49c-8f0dad0e7326";
const KITAYAMA = "b0878e3c-efa0-4758-8855-adc6dde00a78"; // 外す
const NARAZUHIKO = "02107c6d-4ba2-4641-9abb-7af8b6e179a9";
const REMOVE = [HAKUBUTSUKAN, NIGATSUDO, TAMUKEYAMA, KUKAIJI, KITAYAMA];

const EXPECT: Record<string, string> = {
  [ISUIEN]: "依水園", [HAKUBUTSUKAN]: "奈良国立博物館", [TODAIJI]: "東大寺", [NIGATSUDO]: "二月堂", [TAMUKEYAMA]: "手向山八幡宮",
  [KUKAIJI]: "空海寺", [HANNYAJI]: "般若寺", [KITAYAMA]: "北山十八間戸", [NARAZUHIKO]: "奈良豆比古神社",
};
const PHOTOS_EXPECT = ["68c9a88a-5b85-477e-8d66-a4a6653ad6db", "333140ab-75ff-4197-865d-899c1a67906d", "ae333f45-7c99-422b-9352-5366ce721843"].sort();

const TITLE_OLD = "依水園と般若寺、奈良の穴場庭園と花の寺を訪ねる日帰り旅";
const TITLE_NEW = "依水園と般若寺、奈良の庭園と花の寺を訪ねる日帰り旅";
const DESC_OLD = "東大寺の借景を活かした名庭園、二月堂・手向山八幡宮、そして秋にコスモスが咲く「花の寺」般若寺まで、奈良阪エリアの静かな魅力を発見するプランです。";
const DESC_NEW = "花の寺として知られる般若寺と、若草山や東大寺南大門の屋根を借景にした依水園。奈良阪の奈良豆比古神社から歩き始め、若草山に登って、東大寺の大仏殿まで訪ねる日帰りの旅です。";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  narazuhiko:
    "近鉄奈良駅からバスでおよそ15分、奈良阪のバス停で降りるとすぐ、奈良豆比古神社です。バスの時刻は、公式で確かめましょう。光仁天皇の父で、万葉の歌人として知られる施基親王(志貴皇子)と兄の春日王、そしてこの土地の守り神の平城津彦神をまつる、古い神社です。毎年10月8日の夜、秋祭の宵宮には、朱色の本殿の前の拝殿で「翁舞」が奉納されます。三人の翁が並んで舞うなど古い形が残る舞で、平成12年(2000)に国の重要無形民俗文化財に指定されました。本殿の裏には、樹齢千年を超えるといわれる高さ約30mの楠の巨樹があり、奈良県の天然記念物になっています。" +
    PRAY +
    "この後は、歩いておよそ10分、般若寺へ向かいましょう。",
  hannyaji:
    "奈良豆比古神社から歩いておよそ10分、国宝の楼門の前に着き、般若寺に入ります。寺伝では、飛鳥時代に高句麗の慧灌法師が開いたとされ、天平7年(735)、聖武天皇のときに平城京の鬼門を守るため堂塔が建てられ、『大般若経』を塔の基壇に納めたことが、寺の名の起こりと伝えられています。南都焼討で伽藍を失ったのち、鎌倉時代に西大寺の叡尊上人が文殊菩薩を本尊として復興し、病者などを救う活動の拠点となりました。楼門の奥の正面には、高さ約14.2mの十三重石塔(重要文化財)が立ちます。石仏のまわりに咲く春の山吹、初夏のアジサイ、初夏と秋のコスモスで、花の寺としても知られています。拝観の時間は月によって変わるので、公式で確かめましょう。" +
    PRAY +
    "この後は、歩いておよそ11分、今在家のあたりへ向かいましょう。",
  lunch:
    "般若寺から歩いておよそ11分、今在家のあたりに着きます。このあたりで昼食にしましょう。この後は、歩いておよそ24分、依水園へ向かいましょう。",
  isuien:
    "今在家のあたりから歩いておよそ24分、依水園に着きます。時代の違う二つの池泉回遊式庭園からなる庭です。江戸時代の特徴が残る「前園」は、奈良晒の御用商人が煎茶を楽しむ別邸として、三秀亭を移して造った庭で、「後園」は、明治時代の実業家が茶の湯と詩歌の会を楽しむために造った庭です。庭は、若草山や春日山、東大寺南大門の屋根を借景にし、中の島と築山を芝生でおおって、若草山の芝生が園の中まで続いているように見せています。昭和50年(1975)に国の名勝に指定されました。園内の寧楽美術館では、東洋の古美術品が展示されています。開園の時間と休みの日は、公式で確かめましょう。この後は、歩いておよそ18分、若草山へ向かいましょう。",
  wakakusa:
    "依水園から歩いておよそ18分、若草山の北の入口に着きます。芝生におおわれた標高342mの山で、三つの笠を重ねたように見えることから「三笠山」とも呼ばれます。入口から一重目、二重目を通って、山頂の三重目までは歩いて約30〜40分で、山頂からは興福寺や東大寺など、奈良の町を見渡せます。山頂には、5世紀ごろに築かれたといわれる史跡の鶯塚古墳があります。古墳のまわりでは、静かに過ごしましょう。毎年1月には、山焼きが行われます。山に入れるのは、3月の第3土曜日から12月の第2日曜日までなので、入山の期間と時間は公式で確かめましょう。芝生の坂は、足元に気をつけて歩きましょう。この後は、歩いておよそ10分、東大寺の南大門へ向かいましょう。",
  todaiji:
    "若草山から歩いておよそ10分、東大寺の南大門に着きます。南大門は東大寺の正門で、今の門は、鎌倉時代に東大寺を復興した重源上人が、宋の様式を採り入れた「大仏様」で建て直したものです。門の中には、建仁3年(1203)に運慶・快慶らの仏師がわずか69日間で造った、高さ8.4m近い金剛力士像が立っています。門をくぐって、大仏殿へ進みましょう。大仏殿は、二度の兵火ののち江戸時代に再建された建物で、東西の幅は創建のころより小さくなりましたが、世界最大級の木造建造物とされています。中には、盧舎那仏とも呼ばれる大仏さまがまつられています。大仏殿の拝観は8時から17時までなので、時間に気をつけましょう。" +
    PRAY +
    "旅を締めくくったら、近鉄奈良駅までは歩いておよそ18分です。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "奈良豆比古神社(既存。1か所目、区間なし。点 way398754703 の中心へ)",
    item: {
      id: NARAZUHIKO,
      data: { lat: "34.704356", lng: "135.833967", visitTime: T(9, 30), stayDurationMin: 30, memo: M.narazuhiko, transitLegs: { deleteMany: {} } },
    },
  },
  {
    label: "般若寺(既存。点 楼門 way398722152 へ、歩10。写真はそのまま)",
    item: { id: HANNYAJI, data: { lat: "34.699729", lng: "135.835592", visitTime: T(10, 10), stayDurationMin: 75, memo: M.hannyaji, transitLegs: L(["walk", 10]) } },
  },
  {
    label: "今在家のあたりで昼食(新規。点 バス停「今在家」node2637772015、歩11)",
    item: { create: { name: "今在家のあたりで昼食", lat: "34.694725", lng: "135.835191", visitTime: T(11, 36), stayDurationMin: 45, memo: M.lunch, transitLegs: C(["walk", 11]) } },
  },
  {
    label: "依水園(既存。点 way97082272 の中心へ、歩24。写真はそのまま)",
    item: { id: ISUIEN, data: { lat: "34.685466", lng: "135.837919", visitTime: T(12, 45), stayDurationMin: 60, memo: M.isuien, transitLegs: L(["walk", 24]) } },
  },
  {
    label: "若草山(新規。点 北の入口 node4418292191、歩18)",
    item: { create: { name: "若草山", address: "奈良市雑司町", lat: "34.686471", lng: "135.845886", visitTime: T(14, 3), stayDurationMin: 80, memo: M.wakakusa, transitLegs: C(["walk", 18]) } },
  },
  {
    label: "東大寺(既存。点 南大門へ、歩10、帰りの一文。写真はそのまま)",
    item: { id: TODAIJI, data: { lat: "34.685812", lng: "135.839843", visitTime: T(15, 33), stayDurationMin: 80, memo: M.todaiji, transitLegs: L(["walk", 10]) } },
  },
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
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true, spotId: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);
  if (photos.some((p) => REMOVE.includes(p.spotId))) throw new Error("外すスポットに写真があります");

  console.log(`題:\n  ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節・表紙: そのまま\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const lg = d.transitLegs as { create?: Leg[]; deleteMany?: object } | undefined;
    const legsStr = lg?.create ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}${d.address ? `\n  住所: ${d.address}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})`);
  console.log("  写真: 依水園・東大寺・般若寺の3枚と表紙はそのまま。外すスポットに写真はない");
  console.log("\n  始まり 奈良豆比古神社 9:30(近鉄奈良駅からバスでおよそ15分)/ 昼食 11:36(11:30〜13:30)/ 終わり 東大寺 16:53(16:30〜17:00。大仏殿は17:00まで)");

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
