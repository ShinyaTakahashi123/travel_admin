/**
 * チェックリスト #299 の修正記録(1巡目)。
 * しおり「花と丘の絶景を巡る、富良野・美瑛のフォトジェニック旅」
 * (51cda3be-9832-4e7b-ac74-42bb780ebb89)
 *
 * このしおりは prisma/seed-batch2.ts の共通スポット控え(area: 富良野・美瑛)から
 * pilot-gen.ts の仕組みで自動生成されたもので、日ごとの並び・本文を1本ずつ記録する
 * 専用の seed ファイルは存在しない。そのため、変更内容をこのスクリプトで記録する。
 *
 * 既存はDay1・Day2とも5か所で決まり1(4か所以上)は満たしていたが、終了がいずれも
 * 15:25で決まり2(16:30〜17:00)に違反。決まりA(水増し禁止)にもとづき各日1か所追加
 * (すべて直接開いたURLで確認):
 * ・Day1: 美瑛の丘(パッチワークの路)とケンとメリーの木の間に北西の丘展望公園を挿入
 *   (美瑛町観光協会公式 https://www.biei-hokkaido.jp/ja/facility/hokusei-no-oka)
 * ・Day2: 麓郷の森とニングルテラスの間に風のガーデンを挿入
 *   (Wikipedia https://ja.wikipedia.org/wiki/風のガーデン。写真1件新規取得)
 * 開始・終了はいずれも09:00〜16:30(窓内)。
 *
 * あわせて監査ツールが検出した既存の誤りを2点修正:
 * (1) 白ひげの滝の座標が実際の位置から約15km離れた誤った値(徒歩5分で14.3kmという
 *     不整合を検出)。OSM Nominatimで確認した正しい座標(43.4746, 142.6392)に修正し、
 *     白ひげの滝→青い池の移動も「徒歩5分」から「車7分」に修正。共通のスポット控え
 *     prisma/seed-batch2.ts にも同じ誤った座標があったため、あわせて修正した(新しい
 *     2か所も控えに追加)。
 * (2) 麓郷の森の「テレビドラマ『北の国から』シリーズで最も歴史あるロケ地」という
 *     言い切りを、ふらの観光協会公式 https://www.furanotourism.com/jp/spot/spot_D.php?id=404
 *     の内容にもとづき「最初に公開されたと伝わる」というヘッジ付きの表現に修正。
 *
 * itinerary-audit.cjs・prayer-check.cjs 確認済み(時刻の不整合・配慮の一文の警告なし)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-299-51cda3be.ts
 * (実行済み。挿入する2スポットは名前の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "51cda3be-9832-4e7b-ac74-42bb780ebb89";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];
  const day2 = itin.days[1];

  if (!day1.spots.some((s) => s.name === "北西の丘展望公園")) {
    const patchwork = day1.spots.find((s) => s.name === "美瑛の丘（パッチワークの路）")!;
    const kenMary = day1.spots.find((s) => s.name === "ケンとメリーの木")!;
    await setDaySpotOrder(day1.id, [
      ...day1.spots
        .filter((s) => s.id !== kenMary.id)
        .map((s) => ({ id: s.id, data: {} })),
      {
        create: {
          name: "北西の丘展望公園",
          address: "上川郡美瑛町大久保協生",
          lat: 43.6049396,
          lng: 142.4579849,
          visitTime: new Date(Date.UTC(1970, 0, 1, 14, 14)),
          stayDurationMin: 45,
          transitMode: "car",
          transitDurationMin: 18,
          memo: "美瑛の丘(パッチワークの路)からは車で18分ほどです。北西の丘展望公園は、ピラミッド型の白い展望台が目印の公園です。展望台に上がると、視界をさえぎるものがない丘陵地帯の向こうに、大雪山連峰まで一望できます。園内にはラベンダーやひまわり、ポピー、紫サルビアなど季節の花々も植えられていて、これまで巡ってきた丘の風景を、ここでもう一度違う角度から楽しめます。売店では、地元の農産物やコーヒーなども取り扱っています。",
        },
      },
      { id: kenMary.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 6)), transitMode: "car", transitDurationMin: 7 } },
    ]);
  }

  if (!day2.spots.some((s) => s.name === "風のガーデン")) {
    const rokugo = day2.spots.find((s) => s.name === "麓郷の森")!;
    const ningle = day2.spots.find((s) => s.name === "新富良野プリンスホテル・ニングルテラス")!;
    await setDaySpotOrder(day2.id, [
      ...day2.spots
        .filter((s) => s.id !== ningle.id)
        .map((s) => ({ id: s.id, data: {} })),
      {
        create: {
          name: "風のガーデン",
          address: "富良野市中御料",
          lat: 43.3233006,
          lng: 142.354089,
          visitTime: new Date(Date.UTC(1970, 0, 1, 14, 20)),
          stayDurationMin: 55,
          transitMode: "car",
          transitDurationMin: 20,
          memo: "麓郷の森からは車で20分ほどです。風のガーデンは、脚本家・倉本聰氏が手がけたテレビドラマ『風のガーデン』の撮影のために、新富良野プリンスホテルの敷地内に作られた庭園です。放送終了後も庭園として公開が続けられていて、約450種、2万株ともいわれる宿根草が、春から秋にかけて次々と表情を変えながら咲きそろいます。この庭を舞台にした物語を思い浮かべながら、花々の間の小径をゆっくり歩いてみてください。",
        },
      },
      { id: ningle.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 20)), stayDurationMin: 70, transitMode: "car", transitDurationMin: 5 } },
    ]);
  }

  const shirahige = await findSpotInItinerary(ITIN_ID, { spotName: "白ひげの滝" });
  await updateSpotInItinerary(ITIN_ID, { spotId: shirahige.id }, { lat: 43.4745828, lng: 142.6391874 });

  const bluePond = await findSpotInItinerary(ITIN_ID, { spotName: "青い池" });
  await updateSpotInItinerary(
    ITIN_ID,
    { spotId: bluePond.id },
    { transitMode: "car", transitDurationMin: 7, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 16)) }
  );

  const rokugoSpot = await findSpotInItinerary(ITIN_ID, { spotName: "麓郷の森" });
  const rokugoRow = await prisma.spot.findUniqueOrThrow({ where: { id: rokugoSpot.id } });
  if (rokugoRow.memo?.includes("最も歴史あるロケ地")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: rokugoSpot.id },
      {
        memo: rokugoRow.memo
          .replace("青い池から林道を進むと着くのが", "青い池から車で1時間ほど、山あいの道を抜けて着くのが")
          .replace("最も歴史あるロケ地", "最初に公開されたと伝わるロケ地"),
      }
    );
  }

  // legacy transitMode/transitDurationMinをミラーするSpotTransitLegを作り直す
  const allSpots = await prisma.spot.findMany({ where: { dayId: { in: [day1.id, day2.id] } } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
