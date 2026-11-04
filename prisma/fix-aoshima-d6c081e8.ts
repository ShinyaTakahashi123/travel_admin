/**
 * 青島神社と鬼の洗濯板(d6c081e8)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の d6c081e8 の欄。
 * - バスの旅を車の旅に替える(企画運営 11/04 案1)。宮崎交通の時刻表(2-09、10/1 改正)では、青島より南は1日4本で、主な停留所しか載っておらず、
 *   今の区間と合わない(飫肥に着くのは早くて 17:29)ため
 * - 題から「定番」を外し、説明文の「バスで」を「車で」に
 * - 道の駅フェニックスを外す: 車の旅にすると終わりが 16:50 を超える(企画運営の条件「収まらなければ行き先を1つ外す」)。
 *   堀切峠から南へ約1kmで眺めが堀切峠と重なり、レストランは公式で「休業中」のため、昼食の場所にもできない
 * - 回る順: 飫肥で昼食をとるため、青島 → 堀切峠 → 飫肥(昼食・町並み) → 鵜戸神宮 → サンメッセ日南 の順に
 * - 昼食の行き先を足す(バス停「飫肥城下」node5919682584 の点、店でない。45分、12:01 に始まる)。サンメッセの「園内のレストランで昼食」を外す
 * - 点: 青島神社 → place_of_worship way486892124、鬼の洗濯板 → 青島の案内板「青島の文化財」node6398207553(広い岩場、7章の例外として相談)、
 *   サンメッセ日南 → tourism=theme_park node6956981686(公園の面の中心は使わない、af30d135 と同じ)。堀切峠・鵜戸神宮は 1d72e477・af30d135 と同じ点、
 *   飫肥城下町は 1d72e477 と同じ点(同じ場所は同じ点)。区間は揃えた点で測り直して変わらない
 * - 区間(routing.openstreetmap.de): 宮崎駅→青島の入口(バス停「青島」) 車 25.3→31 ＋ 歩 13.8→14(入口の一文)、青島神社→案内板 歩 3.7→4、
 *   案内板→青島の入口 歩 10.9→11 ＋ 車 6.2→12、堀切峠→飫肥城下 車 48.2→54、昼食→飫肥の町 歩 5.1→6、飫肥→鵜戸神宮 車 24.6→30、
 *   鵜戸神宮→サンメッセ 車 9.1→15、サンメッセ→宮崎駅 車 53.5→59(帰りの一文)
 * - 時刻: 始まり 9:00(宮崎駅の近くのレンタカーは 8:00 に開く。手続き15分＋車31＋歩14)、終わり 16:50(もとの 16:50 より遅くしない)。
 *   そのためサンメッセ日南を 80→73 に短くする(法務 11/04 の指摘でレンタカーの手続きを入れたため)。滞在は延ばさない。サンメッセは最終入園 16:30・営業 17:00 まで(公式)
 * - 青島の入口は、バス停「青島」node5919547407 のそばの駐車場(OSM の amenity=parking は名前がない)。歩きはこのバス停の点から測る
 * - 文: 書き出しと終わりに分、決まりの祈りの一文。出典のない文(山幸彦と豊玉姫が結ばれた地、祈りの古道、700万年前、国定公園、
 *   伊東祐兵・280年・大手門の復元、鵜戸の名の由来・国の名勝、モアイの高さ)を外す
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-aoshima-d6c081e8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "d6c081e8-2895-4363-ac7a-1fa21aababf5";
const DAY_ID = "16453015-ba45-4c3d-a97d-2571e04cfa29";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Mode = "walk" | "car";
const L = (...legs: [Mode, number][]) => ({
  deleteMany: {},
  create: legs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min })),
});

const AOSHIMA = "85623b80-766e-4f8b-a66c-20873dbf6ed2";
const SENTAKU = "00764317-9293-4eab-8b90-f236031cca9f";
const HORIKIRI = "249a3005-3ccd-4275-8242-75ae99d1f371";
const MICHINOEKI = "cbc912de-c308-4f16-9939-03330386d25d"; // 外す
const SUNMESSE = "debd0fdf-b523-4f27-ac54-e51a137d79cb";
const UDO = "46eb7787-fa6f-452a-b12b-1b32cec77f94";
const OBI = "18430943-f48e-4d61-8737-3036509de1e5";

const EXPECT: Record<string, string> = {
  [AOSHIMA]: "青島神社", [SENTAKU]: "鬼の洗濯板", [HORIKIRI]: "堀切峠", [MICHINOEKI]: "道の駅フェニックス",
  [SUNMESSE]: "サンメッセ日南", [UDO]: "鵜戸神宮", [OBI]: "飫肥城下町",
};

const TITLE_OLD = "青島神社と鬼の洗濯板、南国宮崎の定番絶景日帰りプラン";
const TITLE_NEW = "青島神社と鬼の洗濯板、日南海岸を車でめぐる宮崎の日帰りプラン";
const DESC_OLD =
  "縁結びの神様として知られる青島神社と奇岩「鬼の洗濯板」から、バスで日南海岸を南へ。堀切峠の眺め、モアイ像が並ぶサンメッセ日南、断崖の洞窟に本殿がある鵜戸神宮をめぐり、最後は城下町・飫肥を歩く日帰りプランです。";
const DESC_NEW =
  "縁結びの神様として知られる青島神社と奇岩「鬼の洗濯板」から、車で日南海岸を南へ。堀切峠の眺めを楽しみ、城下町・飫肥を歩いたあと、海に面した岩窟にまつられた鵜戸神宮と、モアイ像が並ぶサンメッセ日南をめぐる日帰りプランです。";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  aoshima:
    `JR宮崎駅の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ31分、青島のバス停のそばの駐車場に車をとめ、弥生橋を渡って歩いておよそ14分、青島神社に着きます。山幸彦として知られる彦火火出見命が、海神の宮から帰ったときの住まいの跡とされ、彦火火出見命・豊玉姫命・塩筒大神の三神をまつっています。縁結びをはじめ、あらゆる和合をもたらす神様として信仰を集め、安産・航海・交通安全の神としても信仰されています。境内の奥には青島神社の元宮と伝えられる場所があり、その跡からは弥生式土器なども見つかっています。${PRAY}この後は、歩いておよそ4分、鬼の洗濯板へ向かいましょう。`,
  sentaku:
    "青島神社から歩いておよそ4分、青島の文化財の案内板のあたりに着きます。青島のまわりに広がる「鬼の洗濯板」は、「青島の隆起海床と奇形波蝕痕」の名で、昭和9年(1934)に国の天然記念物に指定されています。数百万年前に深い海でたまった地層が、傾きながら持ち上がって波に削られ、硬い砂岩の層が出っ張り、軟らかい泥岩の層がへこんで、板を並べたような形になりました。潮が引くと岩の上を歩けますが、濡れた岩は滑りやすく、潮が満ちると足場がなくなるので、潮の時間を確かめ、足元に気をつけましょう。この後は、青島のバス停のそばの駐車場まで歩いておよそ11分、そこから車でおよそ12分、堀切峠へ向かいましょう。",
  horikiri:
    "鬼の洗濯板から、歩きと車でおよそ23分、堀切峠に着きます。日南海岸の入口とされる峠で、フェニックスが立ち並び、眼下には鬼の洗濯板の岩の縞模様、その先には日向灘が広がります。道沿いは車の行き来が多いので、車に気をつけて眺めましょう。この後は、車でおよそ54分、城下町・飫肥で昼食にしましょう。",
  lunch:
    "堀切峠から車でおよそ54分、飫肥の城下で、昼食にしましょう。この後は、歩いておよそ6分、飫肥の城下町を歩きましょう。",
  obi:
    "昼食のあとは、歩いておよそ6分で飫肥の城下町へ。飫肥藩5万1千石の城下町で、江戸時代の初めの町割りがよく残り、当時のままの幅の通りに面して、石垣や生垣、門が続きます。武家屋敷は、飫肥石や玉石の石垣の上に、お茶などの生垣をめぐらせているのが特徴です。昭和52年(1977)に、九州で初めて国の重要伝統的建造物群保存地区に選ばれたとされます。この後は、車でおよそ30分、鵜戸神宮へ向かいましょう。",
  udo:
    `飫肥から車でおよそ30分、鵜戸神宮に着きます。日向灘に面した岩窟にまつられた神社で、主祭神は、神武天皇の父とされる鸕鶿草葺不合尊です。岩窟の壁には「お乳岩」と呼ばれる岩があり、安産や子育ての無事を願う人が参拝に訪れます。本殿の近くでは、亀の形をした「亀石」のくぼみをめがけて「運玉」を投げるならわしがあり、男性は左手、女性は右手で投げます。足元に気をつけて歩きましょう。${PRAY}この後は、車でおよそ15分、サンメッセ日南へ向かいましょう。`,
  sunmesse:
    "鵜戸神宮から車でおよそ15分、サンメッセ日南に着きます。海を見渡す丘に、7体のモアイ像が並んでいます。平成2年から約3年をかけて、日本の修復委員会がイースター島のアフ・トンガリキの15体を修復し、島の長老会は、世界で初めて日本でのモアイの復刻を許可したとされています。ここに並ぶのは、アフ・アキビの7体を復刻したものです。定休日があるので、公式の案内で確かめましょう。帰りは、JR宮崎駅まで車でおよそ59分。駅の近くで車を返しましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  { label: "青島神社(点 way486892124、始まり 9:00、入口の一文)", item: { id: AOSHIMA, data: { lat: "31.804413", lng: "131.475092", visitTime: T(9, 0), stayDurationMin: 50, memo: M.aoshima } } },
  { label: "鬼の洗濯板(点 案内板 node6398207553、歩き10→4)", item: { id: SENTAKU, data: { lat: "31.803811", lng: "131.473788", visitTime: T(9, 54), stayDurationMin: 30, memo: M.sentaku, transitLegs: L(["walk", 4]) } } },
  { label: "堀切峠(点を 1d72e477・af30d135 と同じ点に、バス20→歩き11＋車12)", item: { id: HORIKIRI, data: { lat: "31.776825", lng: "131.482161", visitTime: T(10, 47), stayDurationMin: 30, memo: M.horikiri, transitLegs: L(["walk", 11], ["car", 12]) } } },
  {
    label: "飫肥の城下で昼食(新規。点はバス停 node5919682584、店でない)",
    item: { create: { name: "飫肥の城下で昼食", address: "宮崎県日南市飫肥1丁目", lat: "31.624872", lng: "131.353058", visitTime: T(12, 11), stayDurationMin: 45, memo: M.lunch, transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 54 }] } } },
  },
  { label: "飫肥城下町(点を 1d72e477 と同じ点に、順を前に、歩き6)", item: { id: OBI, data: { lat: "31.627563", lng: "131.351822", visitTime: T(13, 2), stayDurationMin: 40, memo: M.obi, transitLegs: L(["walk", 6]) } } },
  { label: "鵜戸神宮(点を 1d72e477・af30d135 と同じ点に、順を後に、バス20→車30)", item: { id: UDO, data: { lat: "31.649165", lng: "131.466117", visitTime: T(14, 12), stayDurationMin: 70, memo: M.udo, transitLegs: L(["car", 30]) } } },
  { label: "サンメッセ日南(点 node6956981686、順を最後に、バス30→車15、80→73、帰りの一文)", item: { id: SUNMESSE, data: { lat: "31.663278", lng: "131.460957", visitTime: T(15, 37), stayDurationMin: 73, memo: M.sunmesse, transitLegs: L(["car", 15]) } } },
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
  console.log(`■ [外す] 道の駅フェニックス (${MICHINOEKI})`);
  console.log("\n  始まり 9:00(8:30〜9:30)/ 昼食 12:11(13:30より前)/ 終わり サンメッセ日南 16:50(もとは 16:50)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: [MICHINOEKI] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
