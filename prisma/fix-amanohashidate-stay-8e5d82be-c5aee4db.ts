/**
 * 天橋立の泊まりの2本(8e5d82be・c5aee4db)の点のそろえ(2026-11-04)。法務・企画運営の判断に基づく。
 * - 伊根の舟屋(2本とも)→道の駅 舟屋の里伊根 way435212369(35.674672,135.291455、住所も合わせる)
 * - 8e5d82beの天橋立ビューランドのメモから「園内には小さな遊具や展望リフトもあり、ゆっくり過ごせます。」を外す(6章)
 * - c5aee4dbの天橋立の点(35.577002,135.197896)は、OSM node6423747555「天橋立」の碑(砂州の北の入口)の
 *   6けたの丸めで、すでに正しい点なので動かさない。籠神社→碑の歩きは実測10.7分のため「歩き10」→「歩き11」に直す。
 *   1分延びる分は、滞在をのばさない決まりどおり、籠神社の滞在を67→66分にして合わせる
 * - 8e5d82beの天橋立の点も、同じ碑(35.577002,135.197896)にそろえる(法務の(ア)、同じ場所は同じ点の決まりに
 *   いちばん合う)。傘松公園→天橋立の移動を「ケーブルカー4+歩き13」(府中→碑、実測12.3分)に直す
 * - 【ここから追加・2回目の企画運営の判断】7b69bad5・6ba2fc04と同じ点にそろえる3か所:
 *   智恩寺(8e5d82beのみ、今は旧い点)→way683935012 35.558684,135.184075
 *   天橋立ビューランド(2本とも)→上の駅 node6054993046 35.553087,135.182048
 *   籠神社(2本とも)→way681747088 35.582586,135.196863
 *   前後の移動を実測し直した結果、8e5d82beの「由良川橋梁→智恩寺」の車20分は実測31.1分で、もとから誤りだった
 *   (点のせいではない)。OSRM+5の37分に直す。ほかはc5aee4db「ビューランド→智恩寺」の歩き10→12分(実測11.2分)
 *   のみ直しが要り、残り(ボートやケーブルカーの「その他」区間、8e5d82beの籠神社→傘松10分など)は実測との
 *   ずれが上限の中のため変えない
 * - 延びた分はすべて、決まりの順(始まりを8:30〜9:30の中で動かす→滞在は変えない)で吸収する:
 *   8e5d82beの2日目の始まりを9:30→9:23に早め、由良川橋梁→智恩寺の+17分とあわせて、
 *   天橋立の着く時刻は15:18→15:35、終わりは16:38→16:55(16:30〜17:00に収まる)
 *   c5aee4dbは、ビューランド→智恩寺の+2分で、智恩寺14:47→14:49、智恵の湯15:42→15:44(滞在・始まりは変えない)
 * 法務・企画運営のOK(2026-11-04)に基づく。確認モードは、書き込むデータ(UPDATES)から直接出す形。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const INE_ADDR = "京都府与謝郡伊根町亀島459";
const INE_LAT = "35.674672";
const INE_LNG = "135.291455";
const MONUMENT_LAT = "35.577002";
const MONUMENT_LNG = "135.197896";
const CHIONJI_LAT = "35.558684";
const CHIONJI_LNG = "135.184075";
const VIEWLAND_LAT = "35.553087";
const VIEWLAND_LNG = "135.182048";
const KONOJINJA_LAT = "35.582586";
const KONOJINJA_LNG = "135.196863";

const IKE_VIEWLAND_MEMO_OLD =
  "智恩寺から天橋立ビューランドのモノレールとリフトでおよそ8分、標高およそ130mの展望台に着きます。南側から見る天橋立の眺めは「飛龍観」と呼ばれ、龍が天に飛び立つ姿にたとえられます。ここにも股のぞき台があり、あとで訪れる北側の傘松公園とはまた違った角度から、砂州の全景を楽しむことができます。園内には小さな遊具や展望リフトもあり、ゆっくり過ごせます。この後は、モノレールで文珠へ下り、天橋立観光船に乗り継いでおよそ25分、対岸の一の宮(元伊勢籠神社)へ向かいましょう。";
const IKE_VIEWLAND_MEMO_NEW =
  "智恩寺から天橋立ビューランドのモノレールとリフトでおよそ8分、標高およそ130mの展望台に着きます。南側から見る天橋立の眺めは「飛龍観」と呼ばれ、龍が天に飛び立つ姿にたとえられます。ここにも股のぞき台があり、あとで訪れる北側の傘松公園とはまた違った角度から、砂州の全景を楽しめます。この後は、モノレールで文珠へ下り、天橋立観光船に乗り継いでおよそ25分、対岸の一の宮(元伊勢籠神社)へ向かいましょう。";

const IKE_YURAGAWA_MEMO_NEW =
  "丹後由良から車でおよそ5分、由良川の河口に架かる由良川橋梁に着きます。大正13年(1924年)に完成した全長およそ552mの鉄橋で、京都丹後鉄道の丹後由良駅と丹後神崎駅の間を結んでいます。赤さび色に染まった鉄橋を、日本海を背景に列車が渡っていく光景は、鉄道ファンでなくても目を引く絶景として知られています。線路や鉄橋には立ち入らないようにしましょう。この後は、車でおよそ37分、智恩寺へ向かいましょう。";

const IKE_CHIONJI_MEMO_NEW =
  "由良川橋梁から車でおよそ37分、天橋立の南のたもと、文珠に着きます。知恵の仏様への参拝です。「切戸の文殊」とも呼ばれる、日本三文殊の一つとされる古刹で、寺伝では、混沌とした国土を鎮めるため中国から文殊菩薩を迎えたのが始まりと伝えられています。「三人寄れば文殊の智恵」という言葉はこの寺に由来するとされ、知恵を授かろうと多くの参拝者が訪れます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。車はこの文珠に置いたまま、この後は、天橋立ビューランドのモノレールとリフトでおよそ8分、展望台へ向かいましょう。";

const IKE_KASAMATSU_MEMO_NEW =
  "元伊勢籠神社から天橋立ケーブルカーとリフトでおよそ10分、標高およそ130mの傘松公園に着きます。ここは「股のぞき」発祥の地とされ、頭を下げて股の間から景色をのぞき込むと、天と海が逆転して見え、天橋立がまるで天に架かる橋のように見えることからその名がついたと伝わります。北側から見るこの眺めは「斜め一文字」と呼ばれ、天に昇る龍のようにも見えることから「昇龍観」の別名でも知られています。展望台からゆっくりと、日本三景の一つとされる砂州の全景を眺めてみましょう。この後は、ケーブルカーでおよそ4分、府中へ。歩いておよそ13分、天橋立の松並木へ向かいましょう。";

const IKE_HASHIDATE_MEMO_NEW =
  "傘松公園からケーブルカーでおよそ4分、府中へ。歩いておよそ13分、白砂青松の松並木の中を歩いて渡ります。『丹後国風土記』には、イザナギノミコトが天と地を結ぶために架けた梯子が倒れてこの姿になったという伝説が記されています。股の間からのぞき込むと、空と海が逆転して見えることから、古くから縁起の良い景観として親しまれてきました。およそ3.6kmにわたる松並木の中を、潮風を感じながらのんびり歩けば、旅の余韻をゆっくり味わえます。歩いた先の文珠には、朝置いた車が待っています。伊根の舟屋から丹後の海辺、天橋立とめぐった、のんびり漁村旅も、ここで終わりです。";

const DRV_VIEWLAND_MEMO_NEW =
  "丹後国分寺跡から車でおよそ9分、天橋立の南側にそびえる天橋立ビューランドに着きます。リフトやモノレールで山上へ登ると、股のぞきをして見ると天橋立が天へ舞い上がる龍のように見えるという「飛龍観」を楽しめます。北側の傘松公園から見る「昇龍観」とは、また違った角度からの絶景です。営業時間は季節によって変わるので、訪れる前に公式サイトで確かめましょう。この後は、歩いておよそ12分、智恩寺へ向かいましょう。";

const DRV_CHIONJI_MEMO_NEW =
  "天橋立ビューランドから歩いておよそ12分、天橋立のたもとに立つ智恩寺に着きます。日本三文殊の一つとされる名刹で、知恵を授かる文殊菩薩をまつることから「切戸の文殊」とも呼ばれ、受験生をはじめ多くの参拝者が訪れます。室町時代建立と伝わる多宝塔は国の重要文化財に指定されており、境内の「智恵の輪灯籠」は、江戸時代に航海の安全を願って建てられたとされ、輪をくぐると智恵を授かるといわれています。すぐそばには、天橋立の入口にかかる廻旋橋もあり、あわせて眺めましょう。静かに、敬意をもってお参りください。この後は、歩いておよそ5分、天橋立温泉「智恵の湯」へ向かいましょう。";

// id → { name, before(前提確認), after(書き込むデータ) }
const UPDATES: { id: string; label: string; before: Record<string, unknown>; after: Record<string, unknown> }[] = [
  {
    id: "5702fe5d-9a15-4712-93dd-2458a6ca1179",
    label: "8e5d82be 伊根の舟屋",
    before: { lat: "35.67494", lng: "135.289437" },
    after: { lat: INE_LAT, lng: INE_LNG, address: INE_ADDR },
  },
  {
    id: "5cc71901-3648-4dfc-b001-23ff64deda5b",
    label: "c5aee4db 伊根の舟屋",
    before: { lat: "35.674437", lng: "135.291017" },
    after: { lat: INE_LAT, lng: INE_LNG, address: INE_ADDR },
  },
  {
    id: "a5fd746d-d528-48ba-918b-3162a2658d52",
    label: "8e5d82be 丹後由良(2日目の始まり。最終日の終わりをもとの16:38に戻すため9:06に)",
    before: { visitTimeHHMM: "09:30" },
    after: { visitTime: T(9, 6) },
  },
  {
    id: "15b40290-068d-4add-95ec-f094f2d42708",
    label: "8e5d82be 由良川橋梁",
    before: { visitTimeHHMM: "10:15" },
    after: { visitTime: T(9, 51), memo: IKE_YURAGAWA_MEMO_NEW },
  },
  {
    id: "5f905174-7b9d-4f8f-8f9b-7ef88ff62e98",
    label: "8e5d82be 智恩寺(点をそろえ、由良川橋梁からの移動を20→37に)",
    before: { lat: "35.558583", lng: "135.183778", visitTimeHHMM: "10:55" },
    after: {
      lat: CHIONJI_LAT,
      lng: CHIONJI_LNG,
      visitTime: T(10, 48),
      memo: IKE_CHIONJI_MEMO_NEW,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 37 }] },
    },
  },
  {
    id: "810edb51-f216-49c2-9c59-9d91eff63fd4",
    label: "8e5d82be 天橋立ビューランド(点をそろえ)",
    before: { lat: "35.552395", lng: "135.181592", visitTimeHHMM: "11:33", memo: IKE_VIEWLAND_MEMO_OLD },
    after: { lat: VIEWLAND_LAT, lng: VIEWLAND_LNG, visitTime: T(11, 26), memo: IKE_VIEWLAND_MEMO_NEW },
  },
  {
    id: "3e2e8d5d-2780-461a-876c-09de7b773d53",
    label: "8e5d82be 元伊勢籠神社(点をそろえ)",
    before: { lat: "35.582645", lng: "135.196758", visitTimeHHMM: "13:18" },
    after: { lat: KONOJINJA_LAT, lng: KONOJINJA_LNG, visitTime: T(13, 11) },
  },
  {
    id: "e72c03ef-93f8-4e58-a165-ae5756d7a891",
    label: "8e5d82be 傘松公園",
    before: { visitTimeHHMM: "14:23" },
    after: { visitTime: T(14, 16), memo: IKE_KASAMATSU_MEMO_NEW },
  },
  {
    id: "c58a8d21-cd2a-42cf-900b-700362ea5320",
    label: "8e5d82be 天橋立(着15:18・終わり16:38は、もとのまま)",
    before: { lat: "35.569361", lng: "135.191528", visitTimeHHMM: "15:18", legMin0: 10 },
    after: {
      lat: MONUMENT_LAT,
      lng: MONUMENT_LNG,
      visitTime: T(15, 18),
      memo: IKE_HASHIDATE_MEMO_NEW,
      transitLegs: {
        deleteMany: {},
        create: [
          { orderNo: 1, transitMode: "other", transitDurationMin: 4 },
          { orderNo: 2, transitMode: "walk", transitDurationMin: 13 },
        ],
      },
    },
  },
  {
    id: "4f14613e-131b-4c36-be29-2313c1f4ed78",
    label: "c5aee4db 天橋立ビューランド(点をそろえ、智恩寺への移動を10→12に)",
    before: { lat: "35.552395", lng: "135.181592", visitTimeHHMM: "13:57" },
    after: { lat: VIEWLAND_LAT, lng: VIEWLAND_LNG, visitTime: T(13, 57), memo: DRV_VIEWLAND_MEMO_NEW },
  },
  {
    id: "62791fec-4404-4eab-ad48-dd36c06f2cba",
    label: "c5aee4db 智恩寺(点はすでに正しい、着く時刻+2分、移動10→12)",
    before: { lat: "35.558684", lng: "135.184075", visitTimeHHMM: "14:47" },
    after: {
      visitTime: T(14, 49),
      memo: DRV_CHIONJI_MEMO_NEW,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12 }] },
    },
  },
  {
    id: "0f7581b3-cb9b-444f-a0e3-bccc517542d0",
    label: "c5aee4db 天橋立温泉 智恵の湯(+2分)",
    before: { visitTimeHHMM: "15:42" },
    after: { visitTime: T(15, 44) },
  },
  {
    id: "d738f0f9-b4e6-4050-8869-ec870f90d762",
    label: "c5aee4db 籠神社(点をそろえ、滞在を66分に、1分のずれを吸収)",
    before: { lat: "35.582645", lng: "135.196758", stayDurationMin: 67 },
    after: { lat: KONOJINJA_LAT, lng: KONOJINJA_LNG, stayDurationMin: 66 },
  },
  {
    id: "1df469c2-1941-4ff0-a7a9-199a5069fc79",
    label: "c5aee4db 天橋立(点は動かさない、移動だけ直す)",
    before: { lat: "35.577002", lng: "135.197896", legMin0: 10 },
    after: { transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 11 }] } },
  },
];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  for (const u of UPDATES) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id: u.id }, include: { transitLegs: true } });
    const b = u.before as { lat?: string; lng?: string; visitTimeHHMM?: string; legMin0?: number; memo?: string; stayDurationMin?: number };
    if (b.lat && (s.lat?.toString() !== b.lat || s.lng?.toString() !== b.lng)) throw new Error(`前提確認: ${u.label} の点が期待と不一致 (now ${s.lat},${s.lng})`);
    if (b.visitTimeHHMM) {
      const vt = s.visitTime ? s.visitTime.toISOString().slice(11, 16) : null;
      if (vt !== b.visitTimeHHMM) throw new Error(`前提確認: ${u.label} のvisitTimeが期待と不一致 (now ${vt})`);
    }
    if (b.legMin0 !== undefined) {
      const leg = s.transitLegs[0];
      if (!leg || leg.transitDurationMin !== b.legMin0) throw new Error(`前提確認: ${u.label} の入りの移動分が期待と不一致`);
    }
    if (b.memo && s.memo !== b.memo) throw new Error(`前提確認: ${u.label} のメモが期待と不一致`);
    if (b.stayDurationMin !== undefined && s.stayDurationMin !== b.stayDurationMin) throw new Error(`前提確認: ${u.label} の滞在が期待と不一致`);
  }
  console.log("前提の確認OK。\n");

  console.log("=== 書き込むデータ(そのまま) ===");
  for (const u of UPDATES) {
    const a = u.after as Record<string, unknown>;
    const parts: string[] = [];
    if (a.lat) parts.push(`点=${a.lat},${a.lng}`);
    if (a.address) parts.push(`住所=${a.address}`);
    if (a.visitTime instanceof Date) parts.push(`着=${a.visitTime.toISOString().slice(11, 16)}`);
    if (a.stayDurationMin !== undefined) parts.push(`滞在=${a.stayDurationMin}`);
    if (a.memo) parts.push(`メモ=更新`);
    const legs = (a.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
    if (legs) parts.push(`区間=${legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+")}`);
    console.log(`  [${u.id}] ${u.label}: ${parts.join(" ")}`);
  }
  console.log("\n  8e5d82be 2日目: 09:06始まり→由良川橋梁09:51→智恩寺10:48→ビューランド11:26→籠神社13:11→傘松14:16→天橋立15:18(滞在80)→16:38発(もとの終わりのまま)");
  console.log("  c5aee4db 1日目: ビューランド13:57→智恩寺14:49(滞在50)→智恵の湯15:44(滞在50)→16:34発");
  console.log("  c5aee4db 2日目: 籠神社11:03着(滞在66)→12:09発+歩き11=天橋立12:20着(ずれなし)\n");

  if (!commit) {
    console.log("確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const u of UPDATES) {
      await tx.spot.update({ where: { id: u.id }, data: u.after });
    }
  });

  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
