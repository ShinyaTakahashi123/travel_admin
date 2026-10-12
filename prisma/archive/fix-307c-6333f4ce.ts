/**
 * チェックリスト #307 の修正記録(企画運営5点・法務3点)。
 * しおり「高松城跡（玉藻公園）と讃岐うどん、海城と名物グルメのプラン」
 * (6333f4ce-9869-4542-910e-f9fdc7b89760)
 *
 * 企画運営・法務の指摘(重なる部分は1回で対応):
 * 1. 北浜alleyは店の宣伝寄りだったため外し、香川県立ミュージアム(node
 *    1423745215、歴史博物館と美術館が一体、空海の生涯を伝える展示室は
 *    全国で唯一)に差し替え。
 *    出典(直接開いたURL): https://www.kmuseum.pref.kagawa.lg.jp/
 *    (香川県立ミュージアム公式)
 * 2. 四国村ミウゼアムの店名「わら家」を外し、「茅葺きの古民家を活かした
 *    うどん店もあるので」に(法務指定文言)。
 * 3. 高松城跡の「最初にして最大級の海城で」→「最初にして最大級の海城
 *    とされ」にヘッジ。
 * 4. 商店街の「コシの強い麺とだしの効いたつゆが自慢の本場の味」→
 *    「本場の讃岐うどんを味わえる店が多く」に。
 * 5. 商店街(徒歩)→屋島(車)の移動手段の切り替わりが分かるよう、屋島の
 *    書き出しに明記。
 * 6. 屋島の「獅子の霊巌」に、崖の安全の一文を追加。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-307c-6333f4ce.ts
 * (実行済み。香川県立ミュージアムの有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "6333f4ce-9869-4542-910e-f9fdc7b89760";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "香川県立ミュージアム")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const takamatsujo = spots.find((s) => s.name === "高松城跡（玉藻公園）")!;
  const shotengai = spots.find((s) => s.name === "高松中央商店街（讃岐うどん）")!;
  const yashima = spots.find((s) => s.name === "屋島")!;
  const shikokumura = spots.find((s) => s.name === "四国村ミウゼアム")!;
  const kitahama = spots.find((s) => s.name === "北浜alley")!;

  const takamatsujoMemo = (takamatsujo.memo ?? "").replace(
    "近世城郭としては最初にして最大級の海城で、",
    "近世城郭としては最初にして最大級の海城とされ、"
  );

  const shotengaiMemo = (shotengai.memo ?? "").replace(
    "コシの強い麺とだしの効いたつゆが自慢の本場の味を、気軽に味わうことができます。",
    "本場の讃岐うどんを味わえる店が多く、気軽に立ち寄ることができます。"
  );

  const yashimaMemo = ((yashima.memo ?? "")
    .replace(
      "高松中央商店街からは車で15分ほどです。",
      "高松中央商店街からは、ここから先は車で15分ほどです。"
    )
    .replace(
      "展望スポットの一つ「獅子の霊巌」からは、瀬戸内海と高松市街を一望でき、夕日の名所としても知られています。",
      "展望スポットの一つ「獅子の霊巌」からは、瀬戸内海と高松市街を一望でき、夕日の名所としても知られています。崖の近くでは柵の外に出ないようにしましょう。"
    ));

  const shikokumuraMemo = (shikokumura.memo ?? "").replace(
    "祖谷地方から移築した茅葺きの古民家を活用したうどん店「わら家」もあるので、",
    "祖谷地方から移築した、茅葺きの古民家を活かしたうどん店もあるので、"
  );

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: takamatsujo.id, data: { memo: takamatsujoMemo } },
        { id: shotengai.id, data: { memo: shotengaiMemo } },
        { id: yashima.id, data: { memo: yashimaMemo } },
        { id: shikokumura.id, data: { memo: shikokumuraMemo } },
        {
          create: {
            name: "香川県立ミュージアム",
            address: "香川県高松市玉藻町5-5",
            lat: 34.349722,
            lng: 134.05329,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 23)),
            stayDurationMin: 70,
            transitMode: "car",
            transitDurationMin: 15,
            memo:
              "四国村ミウゼアムからは車で15分ほどです。香川県立ミュージアムは、歴史博物館と美術館が一体となった総合的な博物館です。およそ2万年前にさかのぼる香川県の歴史を紹介する展示室のほか、香川県ゆかりの作家の美術作品を紹介する企画展も開かれています。とりわけ、京都・東寺の灌頂院をモデルにしつらえた展示室で、香川県出身の弘法大師空海の生涯を絵巻の流れに沿って紹介するコーナーは、空海の事績を通して学べる展示として知られています。高松城跡のすぐそばにあるので、見学の締めくくりにも立ち寄りやすい立地です。見学を終えたら、高松駅・高松港方面へ戻りましょう。",
          },
        },
      ],
      { tx, remove: [kitahama.id] }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "瀬戸内海の海水を引き入れた高松城跡と、本場の讃岐うどん。栗林公園とは違う、高松の海城とグルメを楽しむプランです。源平合戦の舞台・屋島、四国の古民家を集めた四国村ミウゼアム、空海の生涯を伝える香川県立ミュージアムまで、高松市の定番と穴場を一日で巡ります。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
