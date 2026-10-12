/**
 * #139 04618af3の直し(5回目)。企画運営・法務の指摘をまとめて反映。
 * ・東後畑棚田の座標が、国土地理院の住所検索で大字までしか引けない
 *   番地のない点だったため、OSMの名前つきの点(place=quarter「油谷
 *   後畑」)に修正。田やあぜ道に入らない一文も追加。
 * ・土井ヶ浜(100→65分)に空いた時間で道の駅北浦街道ほうほく(新規)を
 *   Day1の最後に追加。土井ヶ浜に「静かに見学しましょう」を追加。
 * ・龍宮の潮吹き(45→25分)で空いた時間を長門湯本温泉(35→55分、
 *   立ち寄り湯に入る話と入浴の一文)に回す。
 * ・夢崎波公園の結び「歩いておよそ12分」を、大浜の書き出し
 *   「およそ13分」にそろえる。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const YUMEZAKI_FROM = "この後は、歩いておよそ12分、角島大浜海水浴場へ向かいましょう。";
const YUMEZAKI_TO = "この後は、歩いておよそ13分、角島大浜海水浴場へ向かいましょう。";

const DOIGAHAMA_MEMO =
  "牧崎から車でおよそ14分、土井ヶ浜遺跡・人類学ミュージアムに着きます。弥生時代の墓地遺跡で、300体を超える人骨が装身具や土器とともに見つかった、国の史跡です。日本で唯一とされる人類学専門の博物館では、発掘された人骨の実際の埋葬の様子を再現した「土井ヶ浜ドーム」や、顔つきの変化を紹介する展示などを見ることができます。弥生時代の人々の暮らしに、思いをめぐらせながら、静かに見学しましょう。この後は、車でおよそ4分、道の駅北浦街道ほうほくへ向かいましょう。";

const MICHINOEKI_MEMO =
  "土井ヶ浜遺跡・人類学ミュージアムから車でおよそ4分、道の駅北浦街道ほうほくに着きます。日本海を望む高台に立つ道の駅で、地元でとれた海産物や特産品が並びます。食事処もあるので、ひと休みしましょう。見学を終えたら、車でおよそ10分、豊北町内の宿へ向かいましょう。";

const HIGASHIUSHIROBATA_MEMO =
  "宿を出て、車でおよそ35分、東後畑棚田に着きます。向津具半島にある、日本海を見渡す棚田で、「日本の棚田百選」に選ばれています。山の斜面に階段状に連なる水田と、その先に広がる海の景色を一緒に眺められるのが魅力です。田んぼやあぜ道には入らず、道から眺めましょう。静かに景色を楽しみましょう。この後は、車でおよそ4分、元乃隅神社へ向かいましょう。";

const NAGATOYUMOTO_MEMO =
  "金子みすゞ記念館から車でおよそ12分、長門湯本温泉に着きます。およそ600年前、大寧寺の定庵禅師が、住吉大明神からのお告げによって見つけたと伝えられる、山口県でも最も古い歴史を持つ温泉地とされています。音信川のせせらぎに沿って、昔ながらの湯治場の情緒と、今の感性が融合した温泉街が広がります。立ち寄り湯もあるので、温泉街を歩いたあと、ゆっくり湯につかってみましょう。長湯は避けて、水分をとりながら入りましょう。見学を終えたら、車でおよそ1時間10分、新下関駅でレンタカーを返し、帰りの新幹線に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '04618af3%'`);
  const itinId = rows[0].id;
  const yumezaki = await findSpotInItinerary(itinId, { spotName: "夢崎波公園" });
  const doigahama = await findSpotInItinerary(itinId, { spotName: "土井ヶ浜遺跡・人類学ミュージアム" });
  const higashiushirobata = await findSpotInItinerary(itinId, { spotName: "東後畑棚田" });
  const ryugu = await findSpotInItinerary(itinId, { spotName: "龍宮の潮吹き" });
  const nagatoyumoto = await findSpotInItinerary(itinId, { spotName: "長門湯本温泉" });

  if (!yumezaki.memo?.includes(YUMEZAKI_FROM)) throw new Error("夢崎波公園の文言が想定外です");

  console.log("day1:", doigahama.dayId, "day2:", higashiushirobata.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: yumezaki.id }, data: { memo: yumezaki.memo!.replace(YUMEZAKI_FROM, YUMEZAKI_TO) } });

    const day1Ids = ["角島大橋", "角島灯台", "夢崎波公園", "角島大浜海水浴場", "牧崎"];
    const day1Existing = await Promise.all(day1Ids.map((n) => findSpotInItinerary(itinId, { spotName: n })));
    const day1: SpotOrderItem[] = [
      ...day1Existing.map((s) => ({ id: s.id, data: {} })),
      { id: doigahama.id, data: { visitTime: t(14, 58), stayDurationMin: 65, memo: DOIGAHAMA_MEMO } },
      {
        create: {
          name: "道の駅北浦街道ほうほく", lat: 34.281658, lng: 130.900955, visitTime: t(16, 7), stayDurationMin: 35, memo: MICHINOEKI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 4 }] },
        },
      },
    ];
    await setDaySpotOrder(day1Existing[0].dayId, day1, { tx });

    const day2Ids = ["元乃隅神社", "千畳敷", "青海島", "金子みすゞ記念館"];
    const day2Existing = await Promise.all(day2Ids.map((n) => findSpotInItinerary(itinId, { spotName: n })));
    const day2: SpotOrderItem[] = [
      {
        id: higashiushirobata.id,
        data: { lat: 34.405154, lng: 131.0552557, memo: HIGASHIUSHIROBATA_MEMO },
      },
      { id: day2Existing[0].id, data: {} },
      { id: ryugu.id, data: { visitTime: t(11, 26), stayDurationMin: 25 } },
      { id: day2Existing[1].id, data: { visitTime: t(11, 56) } },
      { id: day2Existing[2].id, data: { visitTime: t(13, 6) } },
      { id: day2Existing[3].id, data: { visitTime: t(14, 42) } },
      {
        id: nagatoyumoto.id,
        data: { visitTime: t(15, 44), stayDurationMin: 55, memo: NAGATOYUMOTO_MEMO },
      },
    ];
    await setDaySpotOrder(higashiushirobata.dayId, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
