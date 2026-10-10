/**
 * #353の続き。企画運営15:17・15:18・15:19(訂正)の指摘、法務15:18の指摘
 * (企画運営15:18で再度依頼)に対応。
 *
 * 1. 白川郷の湯の80→85分(16:32に届かせるための調整)は、目安の範囲内でも
 *    時間を合わせるための延長にあたり決まりA違反と判明。80分に戻し、
 *    浮いた(そして元々足りなかった)時間に、実在の本覚寺(新規、明善寺が
 *    分かれて開かれた本寺、おおたザクラがある)を追加して16:55に着地。
 * 2. 相倉集落の本文(自身の結び)がまだ「車でおよそ26分の道の駅白川郷へ」
 *    のままだった(道の駅側の書き出しだけ直し、相倉自身の結びを直し忘れ)。
 *    29分に修正。
 * 3. 菅沼→相倉の「車でおよそ9分」は、相倉の座標修正後も偶然ほぼ同じ距離
 *    (5.01km)だったため、修正不要と確認(Overpassで再計算)。
 * 4. 明善寺の座標(36.256043,136.9066)は、OSMの実POI「明善寺郷土館」
 *    (way 236248630、36.2560535,136.9066053)との差がおよそ1.3mで、
 *    実質同一の点であることを確認(修正不要)。
 *
 * 事実確認: 本覚寺(白川郷荻町)は、明善寺が寛延元年(1748)にこの寺から
 * 分かれた一門によって開かれたと伝わる、ゆかりの深い寺院。境内に
 * 「おおたザクラ」と呼ばれる桜の木がある。
 * 出典: 検索による複数サイトの一致(明善寺の由緒として本覚寺からの分立が
 * 繰り返し言及されている)
 * 座標: 36.2574804,136.9053395(Overpass実POI、amenity=place_of_worship)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-353h-b991287e.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "ef26a9e0-4a9b-4732-b80f-84742164b5f2";
const DAY2_ID = "8eca1d8b-3a0f-4456-b6d6-3cda73868695";

const MINKAEN_ID = "4dffce3e-9971-497a-beef-24f57c65404d";
const MEIZENJI_ID = "38b25bdb-2d4a-4d59-b2eb-7959afe92056";
const NAGASEKE_ID = "06dba380-7097-4c0e-a886-3c3d662699b4";
const WADAKE_ID = "f0620fbe-1a1f-4579-b40c-df1223c3ed55";
const TENBODAI_ID = "d53d2b1f-f533-4354-b43d-66172ebc2116";
const ONSEN_ID = "e4889630-ee86-4d05-9e51-1ccba1ed69d5";

async function main() {
  const already = await prisma.spot.findFirst({ where: { dayId: DAY1_ID, name: "本覚寺" } });
  if (already) {
    console.log("already applied, skipping (相倉の結びの修正は個別に確認)");
  } else {
    const meizenji = await prisma.spot.findUniqueOrThrow({ where: { id: MEIZENJI_ID } });
    const meizenjiNewMemo = meizenji.memo!.replace(
      "見学を終えたら、歩いておよそ3分の長瀬家へ向かいましょう。",
      "見学を終えたら、歩いておよそ3分の本覚寺へ向かいましょう。"
    );
    if (meizenjiNewMemo === meizenji.memo) throw new Error("明善寺: 結びの置換に失敗");

    const honkakujiMemo =
      "明善寺郷土館を見学したら、歩いておよそ3分の本覚寺へ向かいましょう。明善寺は、寛延元年(1748)にこの本覚寺から分かれた一門によって開かれたと伝えられており、ゆかりの深いお寺です。境内には、大きな一本桜「おおたザクラ」があります。今も法要が営まれるお寺ですので、静かに、敬意をもって見学しましょう。見学を終えたら、歩いておよそ3分の長瀬家へ向かいましょう。";

    const nagaseke = await prisma.spot.findUniqueOrThrow({ where: { id: NAGASEKE_ID } });
    const nagasekeNewMemo = nagaseke.memo!.replace(
      "明善寺郷土館を見学したら、歩いておよそ3分の長瀬家へ向かいましょう。",
      "本覚寺を見学したら、歩いておよそ3分の長瀬家へ向かいましょう。"
    );
    if (nagasekeNewMemo === nagaseke.memo) throw new Error("長瀬家: 書き出しの置換に失敗");

    await prisma.$transaction(async (tx) => {
      await setDaySpotOrder(
        DAY1_ID,
        [
          { id: MINKAEN_ID, data: {} },
          { id: MEIZENJI_ID, data: { memo: meizenjiNewMemo } },
          {
            create: {
              name: "本覚寺",
              address: "岐阜県大野郡白川村荻町",
              lat: 36.2574804,
              lng: 136.9053395,
              visitTime: new Date(Date.UTC(1970, 0, 1, 12, 12)),
              stayDurationMin: 25,
              transitMode: "walk",
              transitDurationMin: 3,
              memo: honkakujiMemo,
            },
          },
          {
            id: NAGASEKE_ID,
            data: { memo: nagasekeNewMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 40)), transitMode: "walk", transitDurationMin: 3 },
          },
          { id: WADAKE_ID, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 24)) } },
          { id: TENBODAI_ID, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 52)) } },
          { id: ONSEN_ID, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 35)), stayDurationMin: 80 } },
        ],
        { tx }
      );
    }, { timeout: 60000 });
    console.log("Day1: 白川郷の湯を80分に戻し、本覚寺を追加して16:55着地");
  }

  // 相倉集落自身の結びの「26分」直し忘れを修正
  const ainokura = await prisma.spot.findFirstOrThrow({ where: { name: "相倉集落", day: { itineraryId: (await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID } })).itineraryId } } });
  const old = "見学を終えたら、車でおよそ26分の道の駅白川郷へ向かいましょう。";
  const next = "見学を終えたら、車でおよそ29分の道の駅白川郷へ向かいましょう。";
  if (ainokura.memo?.includes(old)) {
    const { updateSpotInItinerary } = await import("./lib/spot-lookup");
    await updateSpotInItinerary((await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID } })).itineraryId, { spotId: ainokura.id }, {
      memo: ainokura.memo.replace(old, next),
    });
    console.log("相倉集落: 自身の結びの分数も29分に修正");
  } else {
    console.log("相倉集落: 結びは既に修正済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
