/**
 * 石鎚神社と石鎚登山ロープウェイ(e8927e1c)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の e8927e1c の欄。
 * - ロープウェイ: 公式 https://www.ishizuchi.com/rw-2 「上り便・下り便 同時刻発車 毎時00･20･40分(定時20分毎)」、運行時間は季節で変わる
 *   (いちばん短い時期でも 8:40〜17:00)。乗っている時間は約7分30秒(8分)。待ちは見える区間にする
 * - 成就社まで: 山頂成就駅から歩いておよそ25分(旅の案内 tabi-mag。公式は「リフトに乗り継ぎ、下車徒歩約10分」)
 * - 昼食: 「成就社のあたり」(85分、宿・店の話)をやめ、名前のある店でない点「成就駅」node2483295949 の昼食の行き先(35分)に(決まり329・379)
 * - 成就社→口之宮の「car/30」を、歩き25(昼食の前)・ロープウェイの待ち7・ロープウェイ8・車26 に分ける(routed-car 下谷駅→口之宮 20.2＋5)
 * - 武丈公園の点: 公園の中の点 → 「伊曽の橋」highway=footway way448807167(メモの「伊曽の橋からの眺め」)
 * - 車(routed-car): 伊予西条駅→下谷駅 23.5→入口の一文「車でおよそ29分」、口之宮→伊曽乃 6.8≤10≤16、伊曽乃→伊曽の橋 7.7(今の5は実測より短い→13)、
 *   伊曽の橋→四国鉄道文化館 9.1→15
 * - 終わりが早まる分は、決まりの順で、本物の行き先「四国鉄道文化館」(西条市の施設、JR伊予西条駅のそば、9:00〜17:00・入館16:30まで、
 *   西条市の広報資料)を足して合わせる。16:22着、終わり 16:47。レンタカーは駅のそばで返す
 * - 事実の直し: 口之宮の「天武天皇13年(685)」(685年は天武14年)と祭神の系譜(出典なし)を外し、4社の構成(旅の案内)に。伊曽乃神社の「成務天皇7年(137)」
 *   (出典によって158年)と「伊予国第一の大社」を外す。説明文の「伊予国一宮格」も外す
 * - 祈りの一文を決まりの形に。鎖場・修験の道は登拝の人の道として、その先へ進まない書き方に(法務)。冬の足元の一文
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-ishizuchi-e8927e1c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "e8927e1c-6138-4102-b06f-d041ab191b68";
const DAY_ID = "96854358-7640-49c4-b132-e8fd4476f024";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const CAR = (min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: "car" as const, transitDurationMin: min }] });

const ROPEWAY = "56a4e551-a558-441a-a6e6-ab9da47461d2";
const JOJU = "bb556853-7e70-4a07-811f-d603f303a8ab";
const LUNCH = "68845005-1b6f-4612-bb2d-ec070e7cd1dc";
const KUCHINOMIYA = "d965042c-6d92-4d26-9c80-9e59e2c988cd";
const ISONO = "3d0a3bb0-36ac-46ff-81cf-328f532ff3ac";
const BUJO = "6c36beb4-6488-4d46-8789-de6eab003c66";

const EXPECT: Record<string, string> = {
  [ROPEWAY]: "石鎚登山ロープウェイ", [JOJU]: "石鎚神社 中宮成就社", [LUNCH]: "成就社のあたり（昼食）",
  [KUCHINOMIYA]: "石鎚神社 口之宮本社", [ISONO]: "伊曽乃神社", [BUJO]: "武丈公園",
};

const DESC_OLD =
  "ロープウェイで中宮成就社へ上り、西日本で最も高いとされる石鎚山を神とあがめてきた信仰にふれます。下山後は、山麓の石鎚神社 口之宮本社、伊予国一宮格の伊曽乃神社、加茂川沿いの桜の名所・武丈公園をめぐる日帰りプランです。";
const DESC_NEW =
  "ロープウェイで中宮成就社へ上り、西日本で最も高いとされる石鎚山を神とあがめてきた信仰にふれます。下山後は、山麓の石鎚神社 口之宮本社、西条まつりで知られる伊曽乃神社、加茂川沿いの桜の名所・武丈公園をめぐり、伊予西条駅のそばの四国鉄道文化館まで訪ねる日帰りプランです。";

const M = {
  ropeway:
    "JR伊予西条駅の近くでレンタカーを借り、車でおよそ29分、石鎚登山ロープウェイの山麓下谷駅に着きます。山麓下谷駅(標高約454m)と山頂成就駅(標高約1,293m)を結ぶ、全長1,815m・高低差839mのロープウェイで、乗っている時間は約7分30秒です。上りと下りは同じ時刻に、およそ20分おきに出ます。運行時間は季節や曜日によって変わり、点検で運休する時期もあるので、お出かけ前に公式の時刻表で確かめましょう。この後は、ロープウェイでおよそ8分、山頂成就駅から歩いておよそ25分、成就社へ向かいましょう。",
  joju:
    "ロープウェイで山頂成就駅へ上り、歩いておよそ25分(観光リフトを使う道もあります)、石鎚神社の中宮にあたる「成就社」(標高約1,450m)に着きます。ここまでは一般的なハイキング道で、鎖場はありません。山頂(天狗岳)への道は、成就社からさらに数時間、鎖場の続く修験の道で、登拝の装備と経験がある人のための道です。このしおりではその先へは進まず、成就社でお参りしましょう。標高の高い成就社は、麓より気温が低く天気も変わりやすいので、上着を持っていきましょう。冬は雪や凍った道になることがあるので、滑りにくい靴で、足元に気をつけて歩きましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ25分、山頂成就駅へ戻りましょう。",
  lunch:
    "成就社から歩いておよそ25分、山頂成就駅のあたりで昼食にしましょう。晴れた日には、瀬戸内海まで見渡せる眺めも広がります。この後は、ロープウェイで山麓下谷駅へ下り、車でおよそ26分、石鎚神社 口之宮本社へ向かいましょう。",
  kuchinomiya:
    "山頂成就駅からロープウェイで下り(待ちを含めておよそ15分)、車でおよそ26分、石鎚神社 口之宮本社に着きます。西日本で最も高いとされる石鎚山(標高1,982m)を神体山とする石鎚神社の本社です。山麓の本社(口之宮)、中腹の成就社(中宮)、山頂の頂上社(奥宮)、土小屋遥拝殿の4社をあわせて「石鎚神社」といいます。祭神は石鎚毘古命で、飛鳥時代に修験道の開祖・役小角がこの山を開いたという言い伝えも残ります。明治の神仏分離により、それまでの神仏習合の姿から「石鎚神社」に改められました。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、車でおよそ10分、伊曽乃神社へ向かいましょう。",
  isono:
    "石鎚神社 口之宮本社から車でおよそ10分、伊曽乃神社に着きます。天照大神と、日本武尊の弟とされる武国凝別命を祭神とする、古い歴史をもつ神社です。毎年秋に行われる例祭は、西条まつりの中でもっとも大きく、だんじりとみこしを合わせて80台あまりが繰り出します。祭りの日は年によって異なるので、公式の案内で確かめましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、車でおよそ13分、武丈公園へ向かいましょう。",
  bujo:
    "伊曽乃神社から車でおよそ13分、加茂川沿いの武丈公園に着きます。八堂山のふもとに広がる、西条市を代表する桜の名所で、園内には約100種、1,500本ほどの桜が植えられています。加茂川に架かる伊曽の橋からの眺めは特によいとされ、「四国の嵐山」とも呼ばれています。例年3月下旬から4月上旬ごろが見頃です。桜の季節以外も、加茂川沿いの散策を楽しめます。川辺では足元に気をつけましょう。この後は、車でおよそ15分、伊予西条駅のそばの四国鉄道文化館へ向かいましょう。",
  railway:
    "武丈公園から車でおよそ15分、JR伊予西条駅のそばにある、鉄道の歴史を伝える四国鉄道文化館に着きます。北館には、0系の新幹線の車両が展示されています。入館の時間や休館日は、公式の案内で確かめましょう。石鎚の山と、西条の町をめぐる旅はここで終わりです。帰りは、駅のそばでレンタカーを返し(返す手続きに15分ほど)、JR伊予西条駅へ向かいましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  { label: "石鎚登山ロープウェイ(山麓下谷駅、入口の一文、30→10)", item: { id: ROPEWAY, data: { visitTime: T(9, 30), stayDurationMin: 10, memo: M.ropeway } } },
  {
    label: "石鎚神社 中宮成就社(ロープウェイ8＋歩き25)",
    item: { id: JOJU, data: { visitTime: T(10, 13), stayDurationMin: 60, memo: M.joju, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "other", transitDurationMin: 8, transitLine: "石鎚登山ロープウェイ" }, { orderNo: 2, transitMode: "walk", transitDurationMin: 25 }] } } },
  },
  { label: "山頂成就駅のあたりで昼食(名前と点を成就駅 node2483295949 に、85→35)", item: { id: LUNCH, data: { name: "山頂成就駅のあたりで昼食", lat: "33.795118", lng: "133.13374", visitTime: T(11, 38), stayDurationMin: 35, memo: M.lunch, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 25 }] } } } },
  {
    label: "石鎚神社 口之宮本社(待ち7＋ロープウェイ8＋車26)",
    item: { id: KUCHINOMIYA, data: { visitTime: T(12, 54), stayDurationMin: 45, memo: M.kuchinomiya, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "other", transitDurationMin: 7, transitLine: "ロープウェイの待ち" }, { orderNo: 2, transitMode: "other", transitDurationMin: 8, transitLine: "石鎚登山ロープウェイ" }, { orderNo: 3, transitMode: "car", transitDurationMin: 26 }] } } },
  },
  { label: "伊曽乃神社(車10)", item: { id: ISONO, data: { visitTime: T(13, 49), stayDurationMin: 50, memo: M.isono, transitLegs: CAR(10) } } },
  { label: "武丈公園(点を伊曽の橋 way448807167、車 5→13)", item: { id: BUJO, data: { lat: "33.900315", lng: "133.189845", visitTime: T(14, 52), stayDurationMin: 75, memo: M.bujo, transitLegs: CAR(13) } } },
  {
    label: "四国鉄道文化館(新規。点は tourism=museum 北館 way209018022、車15)",
    item: { create: { name: "四国鉄道文化館", address: "愛媛県西条市大町798-1", lat: "33.912887", lng: "133.188358", visitTime: T(16, 22), stayDurationMin: 25, memo: M.railway, transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] } } },
  },
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
    const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number; transitLine?: string }[] } | undefined)?.create;
    const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}${l.transitLine ? `(${l.transitLine})` : ""}`).join("+") : "(区間なし)";
    console.log(`■ ${"id" in item ? "[既存]" : "[新規]"} ${label}\n  着 ${vt}／滞在 ${d.stayDurationMin}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}${d.name ? `／名前 ${d.name}` : ""}\n  ${d.memo}`);
  }
  console.log("\n  上りは 9:40 発、下りは 12:20 発(公式の毎時00・20・40分)。昼食 11:38(13:30より前)/ 終わり 四国鉄道文化館 16:47(入館は16:22で、16:30より前)");

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
