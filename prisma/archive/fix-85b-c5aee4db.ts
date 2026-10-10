/**
 * #85 c5aee4db D2分。
 * 1) 傘松公園の移動が「徒歩10分/1.2km」で速すぎ(itinerary-audit)。成相寺→
 *    傘松公園は実際には登山バスで下る区間のため、bus/7分に修正。
 * 2) 籠神社の移動が「徒歩5分/2.8km」で速すぎ(itinerary-audit、時速34km相当で
 *    物理的に不可能)。傘松公園→籠神社は実際にはケーブルカー/リフトで
 *    下山する区間のため、other/8分に修正。あわせて傘松公園の本文末尾にあった
 *    「ケーブルカーまたはリフトで山を登りましょう」という、向きが逆で
 *    位置もおかしい一文(この時点では下山する場面)を削除し、正しい案内に修正。
 * 3) 天橋立の「日本三景」に言い切りのヘッジを追加。あわせて昼食の一言を追加。
 * 4) 旧加悦鉄道加悦駅舎への移動が car になっていたが、この旅は歩き・バス・
 *    ケーブルカーの旅のため車を混ぜない(決まり8)。天橋立駅から京都丹後鉄道
 *    +与謝野町コミュニティバスの乗り継ぎ(実在)に変更。
 * 5) 空いた時間・終了を16:30〜17:00の窓に収めるため、加悦駅舎のあとに
 *    ちりめん街道(実在、重要伝統的建造物群保存地区、OSM way 830182389
 *    「宝巌寺」を代表点に)・旧尾藤家住宅(実在、国指定重要文化財、生糸
 *    ちりめん商家、OSM way 829970432)を追加。旧尾藤家住宅に帰りの一言を追加。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KASAMATSU_MEMO =
  "成相寺から登山バスでおよそ7分、天橋立を北側から見下ろす展望公園に着きます。展望台へと続く道にある「傘松」という松にちなんで名づけられたと伝えられ、明治33年（1900年）ごろに展望台が開かれたのが始まりといわれています。股の間からのぞき込むと、天橋立が天に舞い上がる龍のように見える「昇龍観」を楽しめます。この後は、ケーブルカーまたはリフトでおよそ8分、山を下って籠神社へ向かいましょう。";

const TAMBA_MEMO =
  "続いて訪れるのは、日本三景の一つとされる白砂青松の砂州です。『丹後国風土記』には、イザナギノミコトが天と地を結ぶために架けた梯子が、寝ている間に倒れてこの姿になったという伝説が記されています。股の間からのぞき込むと、空と海が逆転し、天に向かって橋が駆け上がっていくように見えることから、古くから縁起の良い景観として親しまれてきました。松並木の途中には食事処や茶屋も点在しているので、ここで昼食にするのもおすすめです。";

const KAYA_EKISHA_MEMO =
  "天橋立から徒歩で天橋立駅へ向かい、京都丹後鉄道で与謝野駅までおよそ15分、与謝野町のコミュニティバスに乗り継いでおよそ15分、加悦の地区に着きます(乗り継ぎ待ちを含めるとおよそ50分。バスの本数が少ないので、事前に時刻を確かめましょう)。大正15年（1926年）に建てられた木造洋風の駅舎です。かつて加悦鉄道の車両を集めていた「加悦SL広場」は2020年に閉園しましたが、こちらの駅舎は「加悦鉄道資料館」として、令和3年（2021年）のリニューアルを経て今も公開されています。NPO法人とボランティアの手で大切に守られてきた、丹後の鉄道の歴史をたどってみてください。この後は、歩いておよそ5分、ちりめん街道へ向かいましょう。";

const CHIRIMEN_MEMO =
  "加悦鉄道資料館から歩いておよそ5分、ちりめん街道に着きます。高級織物「丹後ちりめん」の産地として、また京都と丹後を結ぶ物流の拠点として、江戸時代から昭和初期にかけて栄えた地区で、南北およそ700mの旧街道沿いに、当時の町家や織物工場など江戸〜昭和初期の建物がおよそ120棟も残っており、専門家から「屋根のない建築博物館」とも呼ばれています。街道沿いには宝巌寺・天満神社・吉祥寺などの寺社も点在し、寺町らしい町並みもあわせて楽しめます。当時の面影を残す町並みを、のんびりと歩いてみてください。この後は、歩いておよそ5分、旧尾藤家住宅へ向かいましょう。";

const BITOKE_MEMO =
  "ちりめん街道から歩いておよそ5分、旧尾藤家住宅に着きます。文久3年（1863年）に建てられた、生糸・ちりめん商家の屋敷で、国の重要文化財に指定されています。ちりめん交易で財を成し、町の発展にも大きく貢献したという尾藤家の暮らしぶりを、当時のままの建物と調度からしのぶことができます。休館日は公式サイトで確かめてから訪れましょう。天橋立から伊根の舟屋、丹後ちりめんの町並みまでめぐった2日間の旅は、ここで終了です。お疲れさまでした。お帰りは、与謝野町のコミュニティバスと京都丹後鉄道で天橋立駅方面へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c5aee4db%'`);
  const itinId = rows[0].id;
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const day2Spots: SpotOrderItem[] = [
    { id: "80d3d20f-0c11-4cd5-bde7-58ad874c152d", data: {} }, // 成相寺
    {
      id: "3d2be909-0968-4a39-bf71-9322da89e098", // 傘松公園
      data: { memo: KASAMATSU_MEMO, visitTime: t(10, 14), transitMode: "bus", transitDurationMin: 7 },
    },
    {
      id: "d738f0f9-b4e6-4050-8869-ec870f90d762", // 籠神社
      data: { transitMode: "other", transitDurationMin: 8 },
    },
    {
      id: "1df469c2-1941-4ff0-a7a9-199a5069fc79", // 天橋立
      data: { memo: TAMBA_MEMO },
    },
    {
      id: "70935df8-9d82-404e-9690-d459c77001db", // 旧加悦鉄道加悦駅舎
      data: { memo: KAYA_EKISHA_MEMO, visitTime: t(14, 0), transitMode: "other", transitDurationMin: 50 },
    },
    {
      create: {
        name: "ちりめん街道",
        address: "京都府与謝野町加悦",
        lat: 35.5025441,
        lng: 135.0925155,
        memo: CHIRIMEN_MEMO,
        visitTime: t(15, 3),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    {
      create: {
        name: "旧尾藤家住宅",
        address: "京都府与謝野町加悦1085",
        lat: 35.5045911,
        lng: 135.0919023,
        memo: BITOKE_MEMO,
        visitTime: t(15, 43),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = {
    "80d3d20f-0c11-4cd5-bde7-58ad874c152d": 67,
    "3d2be909-0968-4a39-bf71-9322da89e098": 41,
    "d738f0f9-b4e6-4050-8869-ec870f90d762": 67,
    "1df469c2-1941-4ff0-a7a9-199a5069fc79": 50,
    "70935df8-9d82-404e-9690-d459c77001db": 58,
  };
  let prevEnd = -1;
  for (const x of day2Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
    if (!vt) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
